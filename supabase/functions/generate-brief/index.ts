import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const { createClient } = await import("npm:@supabase/supabase-js@2");
    const sb = createClient(supabaseUrl, supabaseServiceKey);

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Authorization required" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authErr } = await sb.auth.getUser(token);

    if (authErr || !user) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verify admin
    const { data: adminRecord } = await sb
      .from("admin_users")
      .select("role")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!adminRecord) {
      return new Response(JSON.stringify({ error: "Admin access required" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { userId, serviceId } = await req.json();
    if (!userId) {
      return new Response(JSON.stringify({ error: "userId is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch intake responses for this user
    const { data: intake, error: intakeErr } = await sb
      .from("intake_responses")
      .select("responses, purchased_service_ids")
      .eq("user_id", userId)
      .maybeSingle();

    if (intakeErr || !intake) {
      return new Response(JSON.stringify({ error: "No intake data found for this user" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch client profile
    const { data: profile } = await sb
      .from("client_profiles")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    // Build brief text from responses
    const r = intake.responses || {};
    const briefSections: string[] = [];

    briefSections.push(`# Client Brief${serviceId ? ` — ${serviceId}` : ""}`);
    briefSections.push(`Generated: ${new Date().toISOString()}`);
    briefSections.push("");

    if (r.q2_business_name) briefSections.push(`## Business: ${r.q2_business_name}`);
    if (r.q1_legal_name) briefSections.push(`Legal Name: ${r.q1_legal_name}`);
    if (r.q3_business_registered) briefSections.push(`Registration: ${r.q3_business_registered}`);
    if (r.q5_jurisdiction) briefSections.push(`Jurisdiction: ${r.q5_jurisdiction}`);
    briefSections.push("");

    if (r.q13_what_you_do) {
      briefSections.push("## What They Do");
      briefSections.push(r.q13_what_you_do);
      briefSections.push("");
    }

    if (r.q14_flagship_service) {
      briefSections.push("## Flagship Service");
      briefSections.push(r.q14_flagship_service);
      briefSections.push("");
    }

    if (r.q15_services) {
      briefSections.push("## Services");
      const services = Array.isArray(r.q15_services) ? r.q15_services : [r.q15_services];
      for (const svc of services) {
        if (typeof svc === "object") {
          briefSections.push(`- ${svc.service_name || "Unnamed"}: ${svc.service_includes || ""}`);
        } else {
          briefSections.push(`- ${svc}`);
        }
      }
      briefSections.push("");
    }

    if (r.q20_ideal_client) {
      briefSections.push("## Ideal Client");
      briefSections.push(r.q20_ideal_client);
      briefSections.push("");
    }

    if (r.q62_tone_of_voice) {
      const tones = Array.isArray(r.q62_tone_of_voice) ? r.q62_tone_of_voice.join(", ") : r.q62_tone_of_voice;
      briefSections.push(`## Tone of Voice: ${tones}`);
      briefSections.push("");
    }

    if (r.q56_business_story) {
      briefSections.push("## Business Story");
      briefSections.push(r.q56_business_story);
      briefSections.push("");
    }

    if (r.q61_differentiator) {
      briefSections.push("## Differentiator");
      briefSections.push(r.q61_differentiator);
      briefSections.push("");
    }

    // Service-specific sections
    if (serviceId === "website_copy_pack" || intake.purchased_service_ids?.includes("website_copy_pack")) {
      if (r.wc1_pages_needed) {
        const pages = Array.isArray(r.wc1_pages_needed) ? r.wc1_pages_needed.join(", ") : r.wc1_pages_needed;
        briefSections.push(`## Website Pages: ${pages}`);
      }
      if (r.wc_hero_message) {
        briefSections.push("## Hero Message");
        briefSections.push(r.wc_hero_message);
        briefSections.push("");
      }
    }

    if (serviceId === "social_media_pack" || intake.purchased_service_ids?.includes("social_media_pack")) {
      if (r.sm1_platforms) {
        const platforms = Array.isArray(r.sm1_platforms) ? r.sm1_platforms.join(", ") : r.sm1_platforms;
        briefSections.push(`## Social Platforms: ${platforms}`);
      }
      if (r.sm5_content_pillars) {
        briefSections.push("## Content Pillars");
        briefSections.push(r.sm5_content_pillars);
        briefSections.push("");
      }
    }

    const briefText = briefSections.join("\n");

    // Save brief to client_briefs
    const { data: brief, error: briefErr } = await sb
      .from("client_briefs")
      .upsert({
        user_id: userId,
        service_id: serviceId || null,
        brief_text: briefText,
        status: "generated",
      }, { onConflict: undefined })
      .select("id")
      .single();

    if (briefErr) console.error("Failed to save brief:", briefErr);

    return new Response(JSON.stringify({
      brief: briefText,
      briefId: brief?.id,
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Generate brief error:", err);
    return new Response(JSON.stringify({ error: err.message || "Brief generation failed" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
