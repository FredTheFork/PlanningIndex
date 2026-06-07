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

    const { userId, documentType, briefId } = await req.json();
    if (!userId || !documentType) {
      return new Response(JSON.stringify({ error: "userId and documentType are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch brief if briefId provided
    let briefText = "";
    if (briefId) {
      const { data: brief } = await sb
        .from("client_briefs")
        .select("brief_text")
        .eq("id", briefId)
        .single();
      briefText = brief?.brief_text || "";
    }

    // Fetch intake responses
    const { data: intake } = await sb
      .from("intake_responses")
      .select("responses")
      .eq("user_id", userId)
      .maybeSingle();

    const r = intake?.responses || {};

    // Build document generation prompt
    const FILE_OUTPUT_SPEC = `

OUTPUT FORMAT SPECIFICATION:
Generate this document as a professional DOCX file. Include:
- Professional formatting with appropriate headings, body text, and spacing
- Consistent font (e.g., Calibri 11pt body, 14pt headings)
- Client's business name and details in headers/footers where appropriate
- Save as .docx format`;

    const documentPrompts: Record<string, string> = {
      terms_and_conditions: `Generate comprehensive Terms & Conditions for a UK sole trader / small business.`,
      service_agreement_contract: `Generate a bespoke Client Service Agreement Contract for a UK sole trader / small business.`,
      gdpr_privacy_policy: `Generate a UK GDPR-compliant Privacy Policy for a sole trader / small business.`,
      professional_invoice_template: `Generate a Professional Invoice Template for a UK sole trader / small business.`,
      late_payment_letters: `Generate a sequence of 3 Late Payment Letters (reminder, formal notice, final demand) for a UK sole trader / small business.`,
      welcome_email_sequence: `Generate a New Client Welcome Email Sequence (3 emails: welcome, what to expect, getting started) for a UK sole trader / small business.`,
      professional_bio: `Generate a Professional Bio for a UK sole trader / small business.`,
      elevator_pitch: `Generate 3 versions of an Elevator Pitch (30-second, 60-second, written) for a UK sole trader / small business.`,
      linkedin_profile_script: `Generate a LinkedIn Profile Optimisation Script for a UK sole trader / small business.`,
      service_description_sheets: `Generate Service Description Sheets for each service offered by a UK sole trader / small business.`,
      website_homepage: `Generate Homepage copy for a UK sole trader / small business website, including hero section, benefits, and CTA.`,
      website_about: `Generate an About page copy for a UK sole trader / small business website.`,
      website_services: `Generate a Services page copy for a UK sole trader / small business website.`,
      website_contact: `Generate a Contact page copy for a UK sole trader / small business website.`,
      social_media_posts: `Generate 30 social media posts for a UK sole trader / small business, with captions and hashtag suggestions.`,
    };

    const basePrompt = documentPrompts[documentType] || `Generate a ${documentType} document for a UK sole trader / small business.`;

    const fullPrompt = `${basePrompt}

CLIENT INFORMATION:
${briefText || "See responses below."}

CLIENT RESPONSES:
Business Name: ${r.q2_business_name || "N/A"}
Legal Name: ${r.q1_legal_name || "N/A"}
Business Type: ${r.q3_business_registered || "N/A"}
Jurisdiction: ${r.q5_jurisdiction || "N/A"}
What They Do: ${r.q13_what_you_do || "N/A"}
Flagship Service: ${r.q14_flagship_service || "N/A"}
Ideal Client: ${r.q20_ideal_client || "N/A"}
Tone of Voice: ${Array.isArray(r.q62_tone_of_voice) ? r.q62_tone_of_voice.join(", ") : r.q62_tone_of_voice || "N/A"}
Differentiator: ${r.q61_differentiator || "N/A"}
${FILE_OUTPUT_SPEC}`;

    // Create or update the generated_documents record
    const { data: doc, error: docErr } = await sb
      .from("generated_documents")
      .upsert({
        user_id: userId,
        document_type: documentType,
        brief_id: briefId || null,
        status: "generating",
      }, { onConflict: undefined })
      .select("id")
      .single();

    if (docErr) console.error("Failed to create document record:", docErr);

    return new Response(JSON.stringify({
      prompt: fullPrompt,
      documentId: doc?.id,
      documentType,
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Generate document error:", err);
    return new Response(JSON.stringify({ error: err.message || "Document generation failed" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
