import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY") || "";

async function adminUpsert(table: string, data: Record<string, unknown>, onConflict: string) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: "POST",
    headers: {
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
      Prefer: `return=representation,resolution=merge-duplicates`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const text = await res.text();
    console.error(`Admin upsert ${table} failed: ${res.status} ${text}`);
    return null;
  }
  return await res.json();
}

async function adminUpdate(table: string, data: Record<string, unknown>, filter: Record<string, string>) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(filter)) {
    params.set(key, `eq.${value}`);
  }
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${params.toString()}`, {
    method: "PATCH",
    headers: {
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const text = await res.text();
    console.error(`Admin update ${table} failed: ${res.status} ${text}`);
    return null;
  }
  return await res.json();
}

async function adminQuery(table: string, select: string, filter: Record<string, string>) {
  const params = new URLSearchParams();
  params.set("select", select);
  for (const [key, value] of Object.entries(filter)) {
    params.set(key, `eq.${value}`);
  }
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${params.toString()}`, {
    headers: {
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    const text = await res.text();
    console.error(`Admin query ${table} failed: ${res.status} ${text}`);
    return null;
  }
  return await res.json();
}

// ── Brief auto-regeneration on resubmission ─────────────────────────────────

async function regenerateBriefsOnResubmission(userId: string): Promise<string[]> {
  // Get all existing briefs for this client
  const existingBriefs = await adminQuery("client_briefs", "id,service_id,version", { client_id: userId });
  if (!Array.isArray(existingBriefs) || existingBriefs.length === 0) {
    return [];
  }

  const regeneratedServices: string[] = [];
  const briefsToRegenerate = existingBriefs.filter((b: any) => b.status !== "generating");

  // Regenerate each brief with a 60-second delay between them
  for (let i = 0; i < briefsToRegenerate.length; i++) {
    const brief = briefsToRegenerate[i];

    // Mark the old brief as pending and increment version
    const newVersion = (brief.version || 1) + 1;
    await adminUpdate("client_briefs", {
      status: "pending",
      brief_content: null,
      version: newVersion,
      error_message: null,
      generated_at: null,
    }, { id: brief.id });

    regeneratedServices.push(brief.service_id || "comprehensive");

    // If there's another brief after this one, wait 60 seconds
    if (i < briefsToRegenerate.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 60000));
    }
  }

  // Now trigger the actual regeneration for each brief via the generate-brief endpoint
  for (const serviceId of regeneratedServices) {
    try {
      const body: Record<string, string> = { user_id: userId };
      if (serviceId !== "comprehensive") body.service_id = serviceId;

      const genRes = await fetch(`${SUPABASE_URL}/functions/v1/generate-brief`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${SERVICE_ROLE_KEY}`,
        },
        body: JSON.stringify(body),
      });

      if (!genRes.ok) {
        const errText = await genRes.text();
        console.error(`Auto-regeneration failed for ${serviceId}: ${errText}`);
      }
    } catch (err) {
      console.error(`Auto-regeneration error for ${serviceId}:`, err);
    }
  }

  return regeneratedServices;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Missing auth token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const token = authHeader.replace("Bearer ", "");

    // Verify the user's JWT
    const userRes = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: {
        apikey: SERVICE_ROLE_KEY,
        Authorization: `Bearer ${token}`,
      },
    });

    if (!userRes.ok) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const user = await userRes.json();
    const userId = user.id;

    const body = await req.json();
    const { responses, current_section_id } = body;

    if (!responses || typeof responses !== "object") {
      return new Response(JSON.stringify({ error: "Missing responses" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const now = new Date().toISOString();

    // Get existing intake row to find purchased_service_ids and edit state
    const existingRows = await adminQuery("intake_responses", "purchased_service_ids,intake_complete_for_services,section_progress,edit_granted_at,edit_requested_at", { user_id: userId });
    const existing = Array.isArray(existingRows) && existingRows.length > 0 ? existingRows[0] : null;

    const purchasedServiceIds: string[] = existing?.purchased_service_ids || ["business_foundations_pack"];
    const previousCompleteFor: string[] = existing?.intake_complete_for_services || [];
    const sectionProgress: Record<string, boolean> = existing?.section_progress || {};
    const hadEditAccess = !!existing?.edit_granted_at;

    // Derive which services are now complete
    const newlyCompleteFor = [...new Set([...previousCompleteFor, ...purchasedServiceIds])];

    // Update intake_responses — clear edit access on resubmission
    const updateData = {
      user_id: userId,
      responses,
      current_section_id: current_section_id || "intro",
      section_progress: sectionProgress,
      purchased_service_ids: purchasedServiceIds,
      intake_complete_for_services: newlyCompleteFor,
      submitted_at: now,
      last_saved_at: now,
      form_version: "v4",
      // Clear edit access since they've now resubmitted
      edit_granted_at: null,
      edit_granted_by: null,
      edit_requested_at: null,
    };

    await adminUpsert("intake_responses", updateData, "user_id");

    // Update client_profiles to mark intake as submitted
    await adminUpdate("client_profiles", {
      has_submitted_intake: true,
      intake_submitted_at: now,
      intake_complete_for_services: newlyCompleteFor,
    }, { user_id: userId });

    // If this was a resubmission (had edit access), trigger brief auto-regeneration
    let regeneratedBriefs: string[] = [];
    if (hadEditAccess) {
      console.log(`Resubmission detected for ${userId} — triggering brief auto-regeneration`);
      // Run regeneration in the background (don't block the response)
      regenerateBriefsOnResubmission(userId).then((services) => {
        console.log(`Auto-regeneration queued for services: ${services.join(", ")}`);
      }).catch((err) => {
        console.error(`Auto-regeneration failed for ${userId}:`, err);
      });
    }

    return new Response(JSON.stringify({
      submitted_at: now,
      purchased_service_ids: purchasedServiceIds,
      intake_complete_for_services: newlyCompleteFor,
      resubmission: hadEditAccess,
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("intake-submit error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
