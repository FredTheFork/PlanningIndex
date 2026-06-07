import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const SERVICE_CATALOG = [
  {
    id: "business_foundations_pack",
    requiresIntake: true,
    intakeSections: [
      "intro", "business_identity", "services", "clients", "pricing",
      "gdpr", "legal", "brand", "invoice", "linkedin", "final",
    ],
  },
  {
    id: "website_copy_pack",
    requiresIntake: true,
    intakeSections: ["intro", "business_identity", "services", "clients", "brand", "website_copy", "final"],
  },
  {
    id: "social_media_pack",
    requiresIntake: true,
    intakeSections: ["intro", "business_identity", "services", "brand", "social_media", "final"],
  },
  {
    id: "quarterly_refresh",
    requiresIntake: false,
    intakeSections: [],
  },
];

// Form sections and their required fields for validation
const SECTION_REQUIRED_FIELDS: Record<string, string[]> = {
  business_identity: ["q1_legal_name", "q2_business_name", "q3_business_registered", "q5_jurisdiction", "q6_business_address", "q7_document_email", "q9_has_website"],
  services: ["q13_what_you_do", "q14_flagship_service", "q15_services", "q16_uses_subcontractors", "q18_sends_proposal"],
  clients: ["q19_client_type", "q20_ideal_client", "q22_client_issues"],
  pricing: ["q25_pricing_model", "q26_payment_terms", "q28_requires_deposit", "q30_payment_methods", "q31_refund_policy", "q33_late_payment_interest", "q34_vat_registered"],
  gdpr: ["q36_data_collected", "q37_data_collection_method", "q38_data_purpose", "q39_data_storage", "q40_data_retention", "q41_uses_third_party_tools", "q43_shares_data", "q45_sends_marketing"],
  legal: ["q49_regulated_services", "q51_indemnity_insurance"],
  brand: ["q55_first_name", "q56_business_story", "q57_experience", "q60_12_month_goal", "q61_differentiator", "q62_tone_of_voice", "q64_brand_identity", "q65_has_logo", "q68_visual_style"],
  invoice: ["q69_bank_details", "q70_invoice_due_date"],
  linkedin: ["q72_linkedin_usage", "q74_linkedin_target"],
  final: ["q80_confidence_level", "q81_consent_marketing", "q82_consent_not_legal", "q83_consent_accuracy"],
  website_copy: ["wc1_pages_needed", "wc_service_page_count", "wc_nav_structure", "wc_hero_message", "wc_visitor_feeling", "wc_font_style", "wc_imagery_style", "wc_has_brand_guidelines", "wc2_primary_action", "wc_website_builder"],
  social_media: ["sm1_platforms", "sm2_content_types", "sm4_posting_frequency", "sm5_content_pillars", "sm6_personal_boundaries", "sm7_hashtag_strategy", "sm9_content_tone", "sm12_content_calendar"],
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

    const { responses, current_section_id } = await req.json();
    if (!responses || typeof responses !== "object") {
      return new Response(JSON.stringify({ error: "Responses object is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get purchased service IDs
    const { data: intakeRow } = await sb
      .from("intake_responses")
      .select("purchased_service_ids")
      .eq("user_id", user.id)
      .maybeSingle();

    const purchasedServiceIds: string[] = intakeRow?.purchased_service_ids || ["business_foundations_pack"];

    // Determine which sections are required for purchased services
    const requiredSectionIds = new Set<string>();
    for (const serviceId of purchasedServiceIds) {
      const service = SERVICE_CATALOG.find((s) => s.id === serviceId);
      if (service) {
        service.intakeSections.forEach((id) => requiredSectionIds.add(id));
      }
    }

    // Compute section progress
    const sectionProgress: Record<string, boolean> = {};
    const rejectedFields: string[] = [];

    for (const sectionId of requiredSectionIds) {
      if (sectionId === "intro") {
        sectionProgress[sectionId] = true;
        continue;
      }

      const requiredFields = SECTION_REQUIRED_FIELDS[sectionId] || [];
      const allFilled = requiredFields.every((fieldId) => {
        const val = responses[fieldId];
        return val !== undefined && val !== null && val !== "" && !(Array.isArray(val) && val.length === 0);
      });

      sectionProgress[sectionId] = allFilled;
    }

    // Determine which services have complete intake
    const intakeCompleteForServices: string[] = [];
    for (const serviceId of purchasedServiceIds) {
      const service = SERVICE_CATALOG.find((s) => s.id === serviceId);
      if (!service) continue;
      if (!service.requiresIntake) {
        intakeCompleteForServices.push(serviceId);
        continue;
      }
      const allSectionsDone = service.intakeSections.every((sid) => sectionProgress[sid] === true);
      if (allSectionsDone) {
        intakeCompleteForServices.push(serviceId);
      }
    }

    const isIntakeComplete = purchasedServiceIds.every((id) => intakeCompleteForServices.includes(id));
    const now = new Date().toISOString();

    // Update intake_responses
    const { error: upsertErr } = await sb
      .from("intake_responses")
      .upsert({
        user_id: user.id,
        responses,
        form_version: "v4",
        current_section_id: current_section_id || "intro",
        section_progress: sectionProgress,
        purchased_service_ids: purchasedServiceIds,
        intake_complete_for_services: intakeCompleteForServices,
        submitted_at: isIntakeComplete ? now : null,
        last_saved_at: now,
      }, { onConflict: "user_id" });

    if (upsertErr) {
      console.error("Intake submit upsert error:", upsertErr);
      return new Response(JSON.stringify({ error: "Failed to save intake data" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Update client_profiles
    const { error: profileErr } = await sb
      .from("client_profiles")
      .update({
        has_submitted_intake: isIntakeComplete,
        intake_submitted_at: isIntakeComplete ? now : null,
        intake_complete_for_services: intakeCompleteForServices,
      })
      .eq("user_id", user.id);

    if (profileErr) console.error("Failed to update client profile:", profileErr);

    return new Response(JSON.stringify({
      submitted_at: isIntakeComplete ? now : null,
      section_progress: sectionProgress,
      purchased_service_ids: purchasedServiceIds,
      intake_complete_for_services: intakeCompleteForServices,
      rejected_fields: rejectedFields.length > 0 ? rejectedFields : undefined,
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Intake submit error:", err);
    return new Response(JSON.stringify({ error: err.message || "Submission failed" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
