import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

interface BriefRequest {
  user_id: string;
  service_id?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { user_id, service_id }: BriefRequest = await req.json();

    if (!user_id) {
      return new Response(
        JSON.stringify({ error: "user_id is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if a brief already exists for this client + service combination
    const checkUrl = `${SUPABASE_URL}/rest/v1/client_briefs?client_id=eq.${user_id}&select=id,status${service_id ? `&service_id=eq.${service_id}` : "&service_id=is.null"}`;
    const checkRes = await fetch(checkUrl, {
      headers: {
        apikey: SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      },
    });
    const existing = await checkRes.json();

    // If a brief is already generating, don't start another
    if (existing?.length > 0 && existing[0].status === "generating") {
      return new Response(
        JSON.stringify({ error: "Brief is already being generated" }),
        { status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Upsert: create or update the brief record
    const upsertPayload: Record<string, any> = {
      client_id: user_id,
      status: "generating",
      service_id: service_id || null,
    };

    if (existing?.length > 0) {
      // Update existing
      const updateUrl = `${SUPABASE_URL}/rest/v1/client_briefs?id=eq.${existing[0].id}`;
      await fetch(updateUrl, {
        method: "PATCH",
        headers: {
          apikey: SERVICE_ROLE_KEY,
          Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify(upsertPayload),
      });
    } else {
      // Insert new
      const insertUrl = `${SUPABASE_URL}/rest/v1/client_briefs`;
      await fetch(insertUrl, {
        method: "POST",
        headers: {
          apikey: SERVICE_ROLE_KEY,
          Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify(upsertPayload),
      });
    }

    // Fetch intake responses
    const intakeUrl = `${SUPABASE_URL}/rest/v1/intake_responses?user_id=eq.${user_id}&select=responses,purchased_service_ids,intake_complete_for_services`;
    const intakeRes = await fetch(intakeUrl, {
      headers: {
        apikey: SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      },
    });
    const intakeData = await intakeRes.json();

    if (!intakeData?.length || !intakeData[0].responses) {
      // Mark as failed — no intake data
      const failPayload = {
        status: "failed",
        error_message: "No intake responses found for this client",
      };
      const failUrl = existing?.length > 0
        ? `${SUPABASE_URL}/rest/v1/client_briefs?id=eq.${existing[0].id}`
        : `${SUPABASE_URL}/rest/v1/client_briefs?client_id=eq.${user_id}&service_id=${service_id ? `eq.${service_id}` : "is.null"}`;
      await fetch(failUrl, {
        method: "PATCH",
        headers: {
          apikey: SERVICE_ROLE_KEY,
          Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify(failPayload),
      });

      return new Response(
        JSON.stringify({ error: "No intake responses found" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const responses = intakeData[0].responses;

    // Build service-specific brief prompt
    let briefPrompt: string;
    if (service_id === "website_copy_pack") {
      briefPrompt = buildWebsiteCopyBriefPrompt(responses);
    } else if (service_id === "social_media_pack") {
      briefPrompt = buildSocialMediaBriefPrompt(responses);
    } else {
      // Default: comprehensive brief for business_foundations_pack or no service_id
      briefPrompt = buildComprehensiveBriefPrompt(responses);
    }

    // Generate the brief using Claude API
    const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
    let briefContent: string;
    let modelUsed: string;

    if (ANTHROPIC_API_KEY) {
      const claudeRes = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 8000,
          messages: [{ role: "user", content: briefPrompt }],
        }),
      });

      const claudeData = await claudeRes.json();
      if (claudeData.content?.[0]?.text) {
        briefContent = claudeData.content[0].text;
        modelUsed = "claude-sonnet-4-20250514";
      } else {
        briefContent = briefPrompt; // Fallback: store the prompt itself
        modelUsed = "fallback";
      }
    } else {
      // No API key — store the structured prompt as the brief content
      briefContent = briefPrompt;
      modelUsed = "structured-prompt";
    }

    // Assess risk level
    const riskLevel = assessRiskLevel(responses);

    // Update the brief record with generated content
    const completePayload = {
      brief_content: briefContent,
      status: "completed",
      risk_level: riskLevel,
      model_used: modelUsed,
      generated_at: new Date().toISOString(),
      error_message: null,
    };

    const completeUrl = existing?.length > 0
      ? `${SUPABASE_URL}/rest/v1/client_briefs?id=eq.${existing[0].id}`
      : `${SUPABASE_URL}/rest/v1/client_briefs?client_id=eq.${user_id}&service_id=${service_id ? `eq.${service_id}` : "is.null"}`;
    await fetch(completeUrl, {
      method: "PATCH",
      headers: {
        apikey: SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify(completePayload),
    });

    return new Response(
      JSON.stringify({ success: true, model: modelUsed }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Brief generation error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

// ─── Brief Prompt Builders ───────────────────────────────────────────────────

function buildComprehensiveBriefPrompt(r: Record<string, any>): string {
  return `You are generating a comprehensive client brief for a UK sole trader's business document pack.
Produce a structured brief that covers every aspect of the business needed to draft legal, financial, and marketing documents.

=== BUSINESS IDENTITY ===
Legal Name: ${r.q1_legal_name || "N/A"}
Trading Name: ${r.q2_business_name || "N/A"}
Business Type: ${r.q3_business_registered || "N/A"}
Companies House: ${r.q4_companies_house || "N/A"}
Jurisdiction: ${r.q5_jurisdiction || "N/A"}
Address: ${r.q6_business_address || "N/A"}
Document Email: ${r.q7_document_email || "N/A"}
Phone: ${r.q8_business_phone || "N/A"}
Website: ${r.q10_website_url || "N/A"}

=== SERVICES ===
Services Offered: ${r.q15_services_description || "N/A"}
What's Included: ${r.q15b_service_inclusions || "N/A"}
What's Excluded: ${r.q15c_service_exclusions || "N/A"}
Ideal Client: ${r.q20_ideal_client || "N/A"}
Process: ${r.q15e_service_process || "N/A"}
Results: ${r.q15f_service_results || "N/A"}
Pricing: ${r.q15g_service_pricing || "N/A"}

=== CLIENTS AND WORKFLOW ===
How Clients Find You: ${r.q16_how_clients_find || "N/A"}
Client Relationship: ${r.q17_client_relationship || "N/A"}
Onboarding Process: ${r.q18_onboarding || "N/A"}
Communication: ${r.q19_communication || "N/A"}

=== PRICING AND PAYMENT ===
Pricing Model: ${r.q25_pricing_model || "N/A"}
Payment Methods: ${r.q26_payment_methods || "N/A"}
Payment Terms: ${r.q27_payment_terms || "N/A"}
Deposit: ${r.q28_deposit || "N/A"}
VAT Registered: ${r.q34_vat_registered || "N/A"}
VAT Number: ${r.q35_vat_number || "N/A"}

=== RISKS ===
Key Risks: ${r.q22_key_risks || "N/A"}
Risk Details: ${r.q23_risk_details || "N/A"}
Past Issues: ${r.q24_past_issues || "N/A"}

=== GDPR AND DATA ===
Data Collected: ${r.q40_data_collected || "N/A"}
Data Storage: ${r.q41_data_storage || "N/A"}
Third-Party Tools: ${r.q42_third_party_tools || "N/A"}
Marketing Consent: ${r.q43_marketing_consent || "N/A"}
Data Retention: ${r.q44_data_retention || "N/A"}

=== BRAND AND VOICE ===
Brand Colours: ${r.q67_brand_colours || "N/A"}
Tone of Voice: ${r.q62_tone_of_voice || "N/A"}
Words to Avoid: ${r.q63_words_to_avoid || "N/A"}
Differentiator: ${r.q61_differentiator || "N/A"}
Client Experience: ${r.q59_client_experience || "N/A"}

=== BACKGROUND ===
Years in Business: ${r.q57_years_experience || "N/A"}
Background: ${r.q58_background || "N/A"}
Goals: ${r.q60_business_goals || "N/A"}

Now generate a complete structured brief covering all areas needed for document generation.`;
}

function buildWebsiteCopyBriefPrompt(r: Record<string, any>): string {
  return `You are generating a client brief for WEBSITE COPY creation for a UK sole trader.
Focus on: brand voice and tone, target audience, key messages per page, call-to-action strategy, SEO considerations.

=== BUSINESS IDENTITY ===
Trading Name: ${r.q2_business_name || "N/A"}
Address: ${r.q6_business_address || "N/A"}
Document Email: ${r.q7_document_email || "N/A"}
Phone: ${r.q8_business_phone || "N/A"}
Website: ${r.q10_website_url || "N/A"}

=== SERVICES (for Services page) ===
Services Offered: ${r.q15_services_description || "N/A"}
What's Included: ${r.q15b_service_inclusions || "N/A"}
What's Excluded: ${r.q15c_service_exclusions || "N/A"}
Ideal Client: ${r.q20_ideal_client || "N/A"}
Results: ${r.q15f_service_results || "N/A"}
Pricing: ${r.q15g_service_pricing || "N/A"}

=== TARGET AUDIENCE ===
Ideal Client: ${r.q20_ideal_client || "N/A"}
How They Find You: ${r.q16_how_clients_find || "N/A"}
Client Relationship: ${r.q17_client_relationship || "N/A"}

=== BRAND AND VOICE ===
Brand Colours: ${r.q67_brand_colours || "N/A"}
Tone of Voice: ${r.q62_tone_of_voice || "N/A"}
Words to Avoid: ${r.q63_words_to_avoid || "N/A"}
Differentiator: ${r.q61_differentiator || "N/A"}
Client Experience: ${r.q59_client_experience || "N/A"}

=== WEBSITE-SPECIFIC ===
Website Goals: ${r.wc_website_goals || "N/A"}
Target Pages: ${r.wc_target_pages || "Homepage, About, Services, Contact"}
Competitor Websites: ${r.wc_competitor_websites || "N/A"}
Existing Website: ${r.q10_website_url || "N/A"}
CTA Preference: ${r.wc_cta_preference || "N/A"}
SEO Keywords: ${r.wc_seo_keywords || "N/A"}

=== BACKGROUND ===
Years in Business: ${r.q57_years_experience || "N/A"}
Background: ${r.q58_background || "N/A"}
Business Origin: ${r.q57_years_experience || "N/A"}

Pages to plan: Homepage, About, Services, Contact.

Now generate a complete structured brief for website copy creation.`;
}

function buildSocialMediaBriefPrompt(r: Record<string, any>): string {
  return `You are generating a client brief for SOCIAL MEDIA content creation for a UK sole trader.
Focus on: brand personality on social platforms, content pillars (educational, promotional, personal), hashtag strategy, audience engagement approach, 30 posts across 4–6 weeks.

=== BUSINESS IDENTITY ===
Trading Name: ${r.q2_business_name || "N/A"}
Document Email: ${r.q7_document_email || "N/A"}

=== SERVICES ===
Services Offered: ${r.q15_services_description || "N/A"}
What's Included: ${r.q15b_service_inclusions || "N/A"}
Ideal Client: ${r.q20_ideal_client || "N/A"}
Results: ${r.q15f_service_results || "N/A"}

=== TARGET AUDIENCE ===
Ideal Client: ${r.q20_ideal_client || "N/A"}
How They Find You: ${r.q16_how_clients_find || "N/A"}

=== BRAND AND VOICE ===
Tone of Voice: ${r.q62_tone_of_voice || "N/A"}
Words to Avoid: ${r.q63_words_to_avoid || "N/A"}
Differentiator: ${r.q61_differentiator || "N/A"}

=== SOCIAL MEDIA SPECIFIC ===
Current Platforms: ${r.sm_current_platforms || "N/A"}
Content Style: ${r.sm_content_style || "N/A"}
Hashtag Strategy: ${r.sm_hashtag_strategy || "N/A"}
Posting Frequency: ${r.sm_posting_frequency || "N/A"}
Content Pillars: ${r.sm_content_pillars || "Educational, Promotional, Personal/Trust"}
Industry Topics: ${r.sm_industry_topics || "N/A"}
Competitor Accounts: ${r.sm_competitor_accounts || "N/A"}
Visual Style: ${r.sm_visual_style || "N/A"}

=== BACKGROUND ===
Years in Business: ${r.q57_years_experience || "N/A"}
Background: ${r.q58_background || "N/A"}

Now generate a complete structured brief for 30 social media posts.`;
}

// ─── Risk Assessment ─────────────────────────────────────────────────────────

function assessRiskLevel(r: Record<string, any>): string {
  let riskScore = 0;

  // High-risk indicators
  if (r.q22_key_risks && String(r.q22_key_risks).length > 100) riskScore += 2;
  if (r.q23_risk_details && String(r.q23_risk_details).length > 100) riskScore += 2;
  if (r.q24_past_issues && String(r.q24_past_issues).length > 50) riskScore += 2;
  if (!r.q34_vat_registered) riskScore += 1;
  if (!r.q27_payment_terms) riskScore += 1;
  if (!r.q15g_service_pricing) riskScore += 1;

  if (riskScore >= 5) return "High";
  if (riskScore >= 3) return "Medium";
  return "Low";
}
