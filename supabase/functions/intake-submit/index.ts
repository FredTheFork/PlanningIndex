import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const MAX_SUBMISSIONS = 3;

async function adminUpsert(table: string, data: Record<string, unknown>, onConflict: string) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?on_conflict=${onConflict}`, {
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

async function regenerateBriefsOnResubmission(userId: string): Promise<string[]> {
  const existingBriefs = await adminQuery("client_briefs", "id,service_id,version,status", { client_id: userId });
  const briefsArray = Array.isArray(existingBriefs) ? existingBriefs : [];

  const existingServiceIds = new Set(
    briefsArray.map((b: any) => b.service_id || "comprehensive")
  );

  // Fetch purchased service IDs to also generate briefs for newly purchased services
  const intakeRows = await adminQuery("intake_responses", "purchased_service_ids", { user_id: userId });
  const purchasedServiceIds: string[] = Array.isArray(intakeRows) && intakeRows.length > 0
    ? (intakeRows[0].purchased_service_ids || [])
    : [];

  const regeneratedServices: string[] = [];

  // Reset existing briefs that are not currently generating
  const briefsToRegenerate = briefsArray.filter((b: any) => b.status !== "generating");

  for (let i = 0; i < briefsToRegenerate.length; i++) {
    const brief = briefsToRegenerate[i];
    const newVersion = (brief.version || 1) + 1;
    await adminUpdate("client_briefs", {
      status: "pending",
      brief_content: null,
      version: newVersion,
      error_message: null,
      generated_at: null,
    }, { id: brief.id });

    regeneratedServices.push(brief.service_id || "comprehensive");

    if (i < briefsToRegenerate.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 60000));
    }
  }

  // Also generate briefs for newly purchased services that don't have briefs yet
  for (const serviceId of purchasedServiceIds) {
    if (!existingServiceIds.has(serviceId)) {
      regeneratedServices.push(serviceId);
    }
  }

  // Always regenerate the comprehensive brief (null service_id) if it doesn't exist
  if (!existingServiceIds.has("comprehensive")) {
    regeneratedServices.push("comprehensive");
  }

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

    // Get existing intake row
    const existingRows = await adminQuery("intake_responses", "purchased_service_ids,intake_complete_for_services,section_progress,edit_granted_at,edit_requested_at,submitted_at,submission_count", { user_id: userId });
    const existing = Array.isArray(existingRows) && existingRows.length > 0 ? existingRows[0] : null;

    const purchasedServiceIds: string[] = existing?.purchased_service_ids || ["business_foundations_pack"];
    const previousCompleteFor: string[] = existing?.intake_complete_for_services || [];
    const sectionProgress: Record<string, boolean> = existing?.section_progress || {};
    const hadEditAccess = !!existing?.edit_granted_at
      && (!existing?.submitted_at || existing.edit_granted_at > existing.submitted_at);
    const currentCount: number = existing?.submission_count || 0;

    // Enforce submission limit: if this is a resubmission (had edit access), check the count
    if (hadEditAccess && currentCount >= MAX_SUBMISSIONS) {
      return new Response(JSON.stringify({
        error: "Maximum submissions reached",
        detail: `You have reached the maximum of ${MAX_SUBMISSIONS} submissions. No further edits are permitted.`,
      }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // If user already submitted and does NOT have valid edit access, reject the resubmission.
    // This prevents stale sessions or direct API calls from bypassing the lock.
    if (existing?.submitted_at && !hadEditAccess) {
      return new Response(JSON.stringify({
        error: "Form is locked",
        detail: "You do not have edit access. Request permission from an admin before resubmitting.",
      }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const newSubmissionCount = currentCount + 1;
    const newlyCompleteFor = [...new Set([...previousCompleteFor, ...purchasedServiceIds])];

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
      submission_count: newSubmissionCount,
      // Clear edit access since they've now resubmitted
      edit_granted_at: null,
      edit_granted_by: null,
      edit_requested_at: null,
    };

    await adminUpsert("intake_responses", updateData, "user_id");

    // PATCH explicitly clears edit access fields — PostgREST upsert may not apply null
    // values to existing non-null columns, so a separate PATCH is required for reliability.
    await adminUpdate("intake_responses", {
      edit_granted_at: null,
      edit_granted_by: null,
      edit_requested_at: null,
    }, { user_id: userId });

    // Update client_profiles
    await adminUpdate("client_profiles", {
      has_submitted_intake: true,
      intake_submitted_at: now,
      intake_complete_for_services: newlyCompleteFor,
    }, { user_id: userId });

    // If this was a resubmission, trigger brief auto-regeneration
    if (hadEditAccess) {
      console.log(`Resubmission #${newSubmissionCount} for ${userId} — triggering brief auto-regeneration`);
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
      submission_count: newSubmissionCount,
      submissions_remaining: MAX_SUBMISSIONS - newSubmissionCount,
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
