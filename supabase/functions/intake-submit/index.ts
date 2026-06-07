import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const adminHeaders = {
  apikey: SERVICE_ROLE_KEY,
  Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
  "Content-Type": "application/json",
  Prefer: "return=representation",
};

// ── Inline intake definition (field IDs per section, with serviceTags) ──
// This must match lib/forms/intake-definition.ts on the client.
// Only the field IDs and serviceTags are needed here for validation.

interface SectionDef {
  id: string;
  serviceTags: string[];
  fieldIds: string[];
  fieldServiceTags: Record<string, string[]>;
}

const INTAKE_SECTIONS: SectionDef[] = [
  {
    id: "intro",
    serviceTags: ["business_foundations_pack", "website_copy_pack", "social_media_pack"],
    fieldIds: [],
    fieldServiceTags: {},
  },
  {
    id: "business_identity",
    serviceTags: ["business_foundations_pack", "website_copy_pack", "social_media_pack"],
    fieldIds: [
      "q1_legal_name", "q2_business_name", "q3_business_registered", "q4_companies_house",
      "q5_jurisdiction", "q6_business_address", "q7_document_email", "q8_business_phone",
      "q9_has_website", "q10_website_url", "q11_social_platforms", "q12_social_links",
    ],
    fieldServiceTags: {},
  },
  {
    id: "services",
    serviceTags: ["business_foundations_pack", "website_copy_pack", "social_media_pack"],
    fieldIds: [
      "q13_what_you_do", "q14_flagship_service", "q15_services",
      "q16_uses_subcontractors", "q17_inform_subcontractors", "q18_sends_proposal",
    ],
    fieldServiceTags: {},
  },
  {
    id: "clients",
    serviceTags: ["business_foundations_pack", "website_copy_pack"],
    fieldIds: [
      "q19_client_type", "q20_ideal_client", "q21_client_industries",
      "q22_client_issues", "q23_dispute_details", "q24_client_concerns",
    ],
    fieldServiceTags: {},
  },
  {
    id: "pricing",
    serviceTags: ["business_foundations_pack"],
    fieldIds: [
      "q25_pricing_model", "q26_payment_terms", "q27_payment_detail",
      "q28_requires_deposit", "q29_deposit_detail", "q30_payment_methods",
      "q31_refund_policy", "q32_refund_detail", "q33_late_payment_interest",
      "q34_vat_registered", "q35_vat_number",
    ],
    fieldServiceTags: {},
  },
  {
    id: "gdpr",
    serviceTags: ["business_foundations_pack"],
    fieldIds: [
      "q36_data_collected", "q37_data_collection_method", "q38_data_purpose",
      "q39_data_storage", "q40_data_retention", "q41_uses_third_party_tools",
      "q42_third_party_tools", "q43_shares_data", "q44_data_sharing_detail",
      "q45_sends_marketing", "q46_marketing_platform", "q47_uses_cookies",
      "q48_tracking_tools",
    ],
    fieldServiceTags: {},
  },
  {
    id: "legal",
    serviceTags: ["business_foundations_pack"],
    fieldIds: [
      "q49_regulated_services", "q50_regulatory_detail", "q51_indemnity_insurance",
      "q52_certifications", "q53_specific_clauses", "q54_exclusions",
    ],
    fieldServiceTags: {},
  },
  {
    id: "brand",
    serviceTags: ["business_foundations_pack", "website_copy_pack", "social_media_pack"],
    fieldIds: [
      "q55_first_name", "q56_business_story", "q57_experience", "q58_achievements",
      "q59_client_compliments", "q60_12_month_goal", "q61_differentiator",
      "q62_tone_of_voice", "q63_avoid_words", "q64_brand_identity",
      "q65_has_logo", "q66_logo_upload", "q67_brand_colours", "q68_visual_style",
    ],
    fieldServiceTags: {
      "q67_brand_colours": ["website_copy_pack", "social_media_pack"],
    },
  },
  {
    id: "invoice",
    serviceTags: ["business_foundations_pack"],
    fieldIds: ["q69_bank_details", "q70_invoice_due_date", "q71_invoice_fields"],
    fieldServiceTags: {},
  },
  {
    id: "linkedin",
    serviceTags: ["business_foundations_pack"],
    fieldIds: [
      "q72_linkedin_usage", "q73_linkedin_url", "q74_linkedin_target",
      "q75_linkedin_keywords",
    ],
    fieldServiceTags: {},
  },
  {
    id: "final",
    serviceTags: ["business_foundations_pack", "website_copy_pack", "social_media_pack"],
    fieldIds: [
      "q76_existing_docs_upload", "q77_writing_samples_upload", "q78_anything_else",
      "q79_how_heard", "q80_confidence_level", "q81_consent_marketing",
      "q82_consent_not_legal", "q83_consent_accuracy",
    ],
    fieldServiceTags: {},
  },
  {
    id: "website_copy",
    serviceTags: ["website_copy_pack"],
    fieldIds: [
      "wc1_pages_needed", "wc_pages_other", "wc_service_page_count", "wc_nav_structure",
      "wc_headline_idea", "wc_hero_message", "wc_differentiator", "wc_problems_solved",
      "wc_visitor_feeling", "wc_colour_preferences", "wc_colour_palette_style",
      "wc_font_style", "wc_imagery_style", "wc_logo_placement",
      "wc_has_brand_guidelines", "wc_brand_guidelines_upload",
      "wc_competitor_urls", "wc3_inspiration_urls", "wc_disliked_urls",
      "wc2_primary_action", "wc_forms_needed", "wc_testimonials", "wc_legal_pages",
      "wc_website_builder", "wc_existing_copy_upload", "wc_existing_images_upload",
      "wc_existing_testimonials",
    ],
    fieldServiceTags: {},
  },
  {
    id: "social_media",
    serviceTags: ["social_media_pack"],
    fieldIds: [
      "sm1_platforms", "sm2_content_types", "sm3_avoid_topics",
      "sm4_posting_frequency", "sm5_content_pillars", "sm6_personal_boundaries",
      "sm7_hashtag_strategy", "sm8_competitor_accounts", "sm9_content_tone",
      "sm10_call_to_action", "sm11_existing_accounts", "sm12_content_calendar",
      "sm13_upcoming_launches",
    ],
    fieldServiceTags: {},
  },
];

// Repeating section sub-field IDs (from q15_services)
const SERVICE_SUB_FIELDS = new Set([
  "service_name", "service_includes", "service_excludes",
  "service_client_provides", "service_timeline",
  "service_outcome", "service_starting_price",
]);

// ── Service catalog (price ID mapping) ──

const SERVICE_CATALOG: Record<string, { stripePriceIds: { test: string; live: string } }> = {
  business_foundations_pack: {
    stripePriceIds: {
      test: "price_1TZc9UGfxcDbzGRtniOLIJLE",
      live: "price_1TX34AGfxcDbzGRtxVtQN95g",
    },
  },
  website_copy_pack: {
    stripePriceIds: { test: "", live: "" },
  },
  social_media_pack: {
    stripePriceIds: { test: "", live: "" },
  },
  quarterly_refresh: {
    stripePriceIds: { test: "", live: "" },
  },
};

function findServiceIdByPriceId(priceId: string): string | null {
  if (!priceId) return null;
  for (const [id, entry] of Object.entries(SERVICE_CATALOG)) {
    if (entry.stripePriceIds.test === priceId || entry.stripePriceIds.live === priceId) {
      return id;
    }
  }
  return null;
}

// ── Derive purchased services from DB (server-side, authoritative) ──

async function derivePurchasedServices(userId: string): Promise<string[]> {
  const ids = new Set<string>();

  // 1. Check stripe_customers → stripe_orders (one-time purchases)
  const customerRes = await fetch(
    `${SUPABASE_URL}/rest/v1/stripe_customers?user_id=eq.${userId}&select=customer_id`,
    { headers: adminHeaders },
  );
  const customers = await customerRes.json();

  if (customers?.length > 0) {
    const customerId = customers[0].customer_id;

    // Completed orders = one-time purchases (core pack)
    const ordersRes = await fetch(
      `${SUPABASE_URL}/rest/v1/stripe_orders?customer_id=eq.${customerId}&status=eq.completed&select=checkout_session_id`,
      { headers: adminHeaders },
    );
    const orders = await ordersRes.json();
    if (orders?.length > 0) {
      ids.add("business_foundations_pack");
    }

    // Active subscriptions
    const subsRes = await fetch(
      `${SUPABASE_URL}/rest/v1/stripe_subscriptions?customer_id=eq.${customerId}&select=price_id,status`,
      { headers: adminHeaders },
    );
    const subs = await subsRes.json();
    if (subs) {
      for (const sub of subs) {
        if (sub.status === "active" || sub.status === "trialing") {
          const serviceId = findServiceIdByPriceId(sub.price_id);
          if (serviceId) ids.add(serviceId);
        }
      }
    }
  }

  // 2. Fallback: services_purchased table
  if (ids.size === 0) {
    const spRes = await fetch(
      `${SUPABASE_URL}/rest/v1/services_purchased?user_id=eq.${userId}&status=eq.active&select=service_id`,
      { headers: adminHeaders },
    );
    const services = await spRes.json();
    if (services?.length > 0) {
      for (const s of services) ids.add(s.service_id);
    }
  }

  // 3. Fallback: client_profiles.purchased_upsells
  if (ids.size === 0) {
    const profileRes = await fetch(
      `${SUPABASE_URL}/rest/v1/client_profiles?user_id=eq.${userId}&select=purchased_upsells`,
      { headers: adminHeaders },
    );
    const profile = await profileRes.json();
    if (profile?.length > 0 && profile[0].purchased_upsells) {
      ids.add("business_foundations_pack");
      for (const id of profile[0].purchased_upsells) ids.add(id);
    }
  }

  return Array.from(ids);
}

// ── Build the set of authorized field IDs for purchased services ──

function getAuthorizedFieldIds(purchasedServiceIds: string[]): Set<string> {
  const serviceSet = new Set(purchasedServiceIds);
  const authorized = new Set<string>();

  for (const section of INTAKE_SECTIONS) {
    // Section must be relevant to at least one purchased service
    const sectionRelevant = section.serviceTags.some((tag) => serviceSet.has(tag));
    if (!sectionRelevant) continue;

    for (const fieldId of section.fieldIds) {
      const fieldTags = section.fieldServiceTags[fieldId];
      if (!fieldTags) {
        // No field-level restriction — show for all services that include the section
        authorized.add(fieldId);
      } else {
        // Field must be relevant to at least one purchased service
        if (fieldTags.some((tag) => serviceSet.has(tag))) {
          authorized.add(fieldId);
        }
      }
    }
  }

  // Add repeating section sub-field keys
  for (const subId of SERVICE_SUB_FIELDS) {
    authorized.add(subId);
  }

  return authorized;
}

// ── Validate submitted responses ──
// Returns an object with rejected field IDs (fields the user is not authorized to submit).

function validateResponses(
  responses: Record<string, any>,
  authorizedFieldIds: Set<string>,
): { rejectedFields: string[]; cleanedResponses: Record<string, any> } {
  const rejectedFields: string[] = [];
  const cleaned: Record<string, any> = {};

  for (const [key, value] of Object.entries(responses)) {
    // For repeating section sub-fields like "q15_services[0].service_name"
    const baseKey = key.split("[")[0].split(".").pop() || key;

    if (authorizedFieldIds.has(key) || authorizedFieldIds.has(baseKey)) {
      cleaned[key] = value;
    } else {
      rejectedFields.push(key);
    }
  }

  return { rejectedFields, cleanedResponses: cleaned };
}

// ── Compute section_progress ──

function computeSectionProgress(
  purchasedServiceIds: string[],
  responses: Record<string, any>,
): Record<string, boolean> {
  const serviceSet = new Set(purchasedServiceIds);
  const progress: Record<string, boolean> = {};

  for (const section of INTAKE_SECTIONS) {
    if (section.id === "intro") {
      progress[section.id] = true;
      continue;
    }

    const relevant = section.serviceTags.some((tag) => serviceSet.has(tag));
    if (!relevant) continue;

    // Check if all required fields have non-empty answers
    const allRequiredFilled = section.fieldIds.every((fieldId) => {
      const value = responses[fieldId];
      if (value === undefined || value === null || value === "") return false;
      if (Array.isArray(value) && value.length === 0) return false;
      return true;
    });

    progress[section.id] = allRequiredFilled;
  }

  return progress;
}

// ── Get completed service IDs ──

function getSectionIdsForService(serviceId: string): string[] {
  return INTAKE_SECTIONS
    .filter((s) => s.serviceTags.includes(serviceId))
    .map((s) => s.id);
}

function getCompletedServiceIds(
  purchasedServiceIds: string[],
  sectionProgress: Record<string, boolean>,
): string[] {
  return purchasedServiceIds.filter((serviceId) => {
    const required = getSectionIdsForService(serviceId);
    if (required.length === 0) return true;
    return required.every((sid) => sectionProgress[sid] === true);
  });
}

// ── Handler ──

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing authorization" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Extract the JWT token from the Authorization header
    const token = authHeader.replace("Bearer ", "");

    // Verify the user's JWT using the admin API
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

    const userData = await userRes.json();
    const userId = userData.id;

    if (!userId) {
      return new Response(JSON.stringify({ error: "User ID not found" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Parse request body
    const body = await req.json();
    const { responses, current_section_id } = body as {
      responses: Record<string, any>;
      current_section_id?: string;
    };

    if (!responses || typeof responses !== "object") {
      return new Response(JSON.stringify({ error: "Missing or invalid responses" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ── SERVER-SIDE PURCHASED SERVICE VERIFICATION ──
    const purchasedServiceIds = await derivePurchasedServices(userId);

    if (purchasedServiceIds.length === 0) {
      return new Response(JSON.stringify({ error: "No purchased services found" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ── FIELD ID AUTHORIZATION CHECK ──
    const authorizedFieldIds = getAuthorizedFieldIds(purchasedServiceIds);
    const { rejectedFields, cleanedResponses } = validateResponses(responses, authorizedFieldIds);

    if (rejectedFields.length > 0) {
      console.warn(
        `[intake-submit] User ${userId} attempted to submit unauthorized fields: ${rejectedFields.join(", ")}`,
      );
      // We still accept the submission but strip unauthorized fields
      // This prevents data leakage while not blocking legitimate users
    }

    // ── COMPUTE SECTION PROGRESS AND COMPLETION ──
    const sectionProgress = computeSectionProgress(purchasedServiceIds, cleanedResponses);
    const completedServiceIds = getCompletedServiceIds(purchasedServiceIds, sectionProgress);
    const now = new Date().toISOString();

    // ── UPSERT INTAKE RESPONSES ──
    const upsertData = {
      user_id: userId,
      responses: cleanedResponses,
      form_version: "v4",
      current_section_id: current_section_id || "intro",
      section_progress: sectionProgress,
      purchased_service_ids: purchasedServiceIds,
      submitted_at: now,
      intake_complete_for_services: completedServiceIds,
      last_saved_at: now,
    };

    const upsertRes = await fetch(`${SUPABASE_URL}/rest/v1/intake_responses`, {
      method: "POST",
      headers: {
        ...adminHeaders,
        Prefer: "resolution=merge-duplicates,return=representation",
      },
      body: JSON.stringify(upsertData),
    });

    if (!upsertRes.ok) {
      const errText = await upsertRes.text();
      console.error("[intake-submit] Upsert error:", errText);
      return new Response(JSON.stringify({ error: "Failed to save intake responses" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ── UPDATE CLIENT PROFILES ──
    const profileUpdateRes = await fetch(
      `${SUPABASE_URL}/rest/v1/client_profiles?user_id=eq.${userId}`,
      {
        method: "PATCH",
        headers: adminHeaders,
        body: JSON.stringify({
          has_submitted_intake: true,
          intake_submitted_at: now,
          intake_complete_for_services: completedServiceIds,
        }),
      },
    );

    if (!profileUpdateRes.ok) {
      console.error("[intake-submit] Profile update error:", await profileUpdateRes.text());
      // Non-fatal: intake data is saved, profile update is secondary
    }

    return new Response(
      JSON.stringify({
        success: true,
        submitted_at: now,
        intake_complete_for_services: completedServiceIds,
        purchased_service_ids: purchasedServiceIds,
        rejected_fields: rejectedFields.length > 0 ? rejectedFields : undefined,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[intake-submit] Error:", message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
