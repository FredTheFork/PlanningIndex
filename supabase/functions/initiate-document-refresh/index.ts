import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

// Document types that support refresh (mirrors supportsRefresh in document-configs.ts)
const REFRESHABLE_TYPES = new Set([
  "terms_and_conditions",
  "service_agreement_contract",
  "gdpr_privacy_policy",
  "professional_invoice_template",
  "late_payment_letters",
  "welcome_email_sequence",
  "professional_bio",
  "elevator_pitch",
  "linkedin_profile_script",
  "service_description_sheets",
  "website_homepage",
  "website_about",
  "website_services",
  "website_contact",
  "social_media_posts",
]);

// Document-type → service-id mapping (mirrors document-service-map.ts)
const DOCUMENT_TYPE_TO_SERVICE_ID: Record<string, string> = {
  terms_and_conditions: "business_foundations_pack",
  service_agreement_contract: "business_foundations_pack",
  gdpr_privacy_policy: "business_foundations_pack",
  professional_invoice_template: "business_foundations_pack",
  late_payment_letters: "business_foundations_pack",
  welcome_email_sequence: "business_foundations_pack",
  professional_bio: "business_foundations_pack",
  elevator_pitch: "business_foundations_pack",
  linkedin_profile_script: "business_foundations_pack",
  service_description_sheets: "business_foundations_pack",
  website_homepage: "website_copy_pack",
  website_about: "website_copy_pack",
  website_services: "website_copy_pack",
  website_contact: "website_copy_pack",
  social_media_posts: "social_media_pack",
};

interface RefreshRequest {
  user_id: string;
  service_id: string;
  document_types?: string[];
  update_instructions: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { user_id, service_id, document_types, update_instructions }: RefreshRequest = await req.json();

    if (!user_id || !service_id) {
      return new Response(
        JSON.stringify({ error: "user_id and service_id are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!update_instructions?.trim()) {
      return new Response(
        JSON.stringify({ error: "update_instructions is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Derive document types to refresh
    let typesToRefresh: string[];
    if (document_types && document_types.length > 0) {
      // Validate all requested types belong to this service and support refresh
      typesToRefresh = document_types.filter(
        (dt) => DOCUMENT_TYPE_TO_SERVICE_ID[dt] === service_id && REFRESHABLE_TYPES.has(dt)
      );
    } else {
      // Default: all refreshable types for this service
      typesToRefresh = Object.entries(DOCUMENT_TYPE_TO_SERVICE_ID)
        .filter(([, sid]) => sid === service_id)
        .map(([dt]) => dt)
        .filter((dt) => REFRESHABLE_TYPES.has(dt));
    }

    if (typesToRefresh.length === 0) {
      return new Response(
        JSON.stringify({ error: "No refreshable document types found for this service" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check for an existing pending/processing refresh job for this client + service
    const checkUrl = `${SUPABASE_URL}/rest/v1/document_refresh_jobs?client_id=eq.${user_id}&service_id=eq.${service_id}&status=in.(pending,processing)&select=id`;
    const checkRes = await fetch(checkUrl, {
      headers: {
        apikey: SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      },
    });
    const existing = await checkRes.json();

    if (existing?.length > 0) {
      return new Response(
        JSON.stringify({ error: "A refresh job is already in progress for this service" }),
        { status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create the refresh job record
    const insertPayload = {
      client_id: user_id,
      service_id,
      document_types: typesToRefresh,
      update_instructions: update_instructions.trim(),
      status: "processing",
      documents_completed: [],
      documents_failed: [],
    };

    const insertUrl = `${SUPABASE_URL}/rest/v1/document_refresh_jobs`;
    const insertRes = await fetch(insertUrl, {
      method: "POST",
      headers: {
        apikey: SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify(insertPayload),
    });
    const inserted = await insertRes.json();
    const jobId = inserted?.[0]?.id;

    if (!jobId) {
      return new Response(
        JSON.stringify({ error: "Failed to create refresh job" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Process each document type sequentially
    const completed: string[] = [];
    const failed: string[] = [];

    for (const docType of typesToRefresh) {
      try {
        const genRes = await fetch(`${SUPABASE_URL}/functions/v1/generate-document`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
            apikey: SERVICE_ROLE_KEY,
          },
          body: JSON.stringify({
            user_id,
            document_type: docType,
            service_id,
            update_instructions: update_instructions.trim(),
          }),
        });

        if (genRes.ok) {
          completed.push(docType);
        } else {
          failed.push(docType);
          console.error(`Refresh failed for ${docType}: ${genRes.status}`);
        }
      } catch (err) {
        failed.push(docType);
        console.error(`Refresh error for ${docType}:`, err);
      }
    }

    // Update the job record with results
    const finalStatus = failed.length === typesToRefresh.length ? "failed" : "completed";
    const updatePayload: Record<string, any> = {
      status: finalStatus,
      documents_completed: completed,
      documents_failed: failed,
      completed_at: new Date().toISOString(),
    };

    if (finalStatus === "failed") {
      updatePayload.error_message = "All document refreshes failed";
    } else if (failed.length > 0) {
      updatePayload.error_message = `${failed.length} document(s) failed: ${failed.join(", ")}`;
    }

    const updateUrl = `${SUPABASE_URL}/rest/v1/document_refresh_jobs?id=eq.${jobId}`;
    await fetch(updateUrl, {
      method: "PATCH",
      headers: {
        apikey: SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify(updatePayload),
    });

    return new Response(
      JSON.stringify({
        success: true,
        job_id: jobId,
        completed,
        failed,
        total: typesToRefresh.length,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Document refresh error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
