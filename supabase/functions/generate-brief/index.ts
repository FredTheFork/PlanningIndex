import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const GEMINI_API_KEY = "AIzaSyAAjWuVWqnaRA7bDsbR_Hx_zuCxvMMaFIY";

function errorResponse(status: number, error: string, details?: Record<string, unknown>) {
  return new Response(JSON.stringify({ error, ...details }), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function successResponse(data: Record<string, unknown>) {
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
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
    return { data: null, error: `${res.status}: ${text}` };
  }
  const data = await res.json();
  return { data, error: null };
}

async function trackGeminiUsage(model: string) {
  const today = new Date().toISOString().split('T')[0];
  try {
    const { data: existing } = await adminQuery("gemini_api_usage", "id,request_count", { request_date: today, model });
    if (existing && Array.isArray(existing) && existing.length > 0) {
      const id = existing[0].id;
      const count = (existing[0].request_count || 0) + 1;
      await fetch(`${SUPABASE_URL}/rest/v1/gemini_api_usage?id=eq.${id}`, {
        method: "PATCH",
        headers: {
          apikey: SERVICE_ROLE_KEY,
          Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ request_count: count, last_used_at: new Date().toISOString() }),
      });
    } else {
      await fetch(`${SUPABASE_URL}/rest/v1/gemini_api_usage`, {
        method: "POST",
        headers: {
          apikey: SERVICE_ROLE_KEY,
          Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=representation,resolution=merge-duplicates",
        },
        body: JSON.stringify({
          model,
          request_date: today,
          request_count: 1,
          last_used_at: new Date().toISOString(),
        }),
      });
    }
  } catch (err) {
    console.error("Failed to track Gemini usage:", err);
  }
}

async function testGeminiKey(): Promise<{ valid: boolean; error?: string; keyPrefix?: string }> {
  if (!GEMINI_API_KEY) return { valid: false, error: "GEMINI_API_KEY is empty", keyPrefix: "(empty)" };
  const keyPrefix = GEMINI_API_KEY.substring(0, 6) + "...";
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`,
      { method: "GET" }
    );
    if (res.ok) return { valid: true, keyPrefix };
    const text = await res.text();
    return { valid: false, error: `${res.status}: ${text.substring(0, 200)}`, keyPrefix };
  } catch (err) {
    return { valid: false, error: err instanceof Error ? err.message : "Network error", keyPrefix };
  }
}

function buildBriefPrompt(responses: Record<string, any>, serviceId: string | null, websitePages: string[]): string {
  const r = responses || {};

  const websitePagesSection = websitePages.length > 0
    ? `\nWEBSITE PAGES ORDERED AT CHECKOUT\n==================================\nPages: ${websitePages.join(', ')}\n`
    : '';

  const businessIdentity = `
BUSINESS IDENTITY
=================
Legal Name: ${r.q1_legal_name || 'Not provided'}
Business Name: ${r.q2_business_name || 'Not provided'}
Registration: ${r.q3_business_registered || 'Not provided'}
${r.q4_companies_house ? `Companies House: ${r.q4_companies_house}` : ''}
Jurisdiction: ${r.q5_jurisdiction || 'Not provided'}
Address: ${r.q6_business_address || 'Not provided'}
Document Email: ${r.q7_document_email || 'Not provided'}
${r.q8_business_phone ? `Phone: ${r.q8_business_phone}` : ''}
Website: ${r.q9_has_website || 'Not provided'}${r.q10_website_url ? ` — ${r.q10_website_url}` : ''}
Social: ${Array.isArray(r.q11_social_platforms) ? r.q11_social_platforms.join(', ') : 'Not provided'}
`;

  const services = `
SERVICES
========
What They Do: ${r.q13_what_you_do || 'Not provided'}
Flagship Service: ${r.q14_flagship_service || 'Not provided'}
Services Detail:
${Array.isArray(r.q15_services)
  ? r.q15_services.map((s: any, i: number) =>
      `${i + 1}. ${s.service_name}: ${s.service_includes || 'No details'}\n   Excludes: ${s.service_excludes || 'Not specified'}\n   Client Provides: ${s.service_client_provides || 'Not specified'}\n   Timeline: ${s.service_timeline || 'Not specified'}\n   Outcome: ${s.service_outcome || 'Not specified'}${s.service_starting_price ? `\n   Starting Price: ${s.service_starting_price}` : ''}`
    ).join('\n')
  : 'Not provided'}
Uses Subcontractors: ${r.q16_uses_subcontractors || 'Not provided'}
${r.q17_inform_subcontractors ? `Inform Clients: ${r.q17_inform_subcontractors}` : ''}
Sends Proposal: ${r.q18_sends_proposal || 'Not provided'}
`;

  const clients = `
CLIENTS & HOW THEY WORK
========================
Client Type: ${r.q19_client_type || 'Not provided'}
Ideal Client: ${r.q20_ideal_client || 'Not provided'}
${r.q21_client_industries ? `Industries: ${r.q21_client_industries}` : ''}
Issues Experienced: ${Array.isArray(r.q22_client_issues) ? r.q22_client_issues.join(', ') : 'None reported'}
${r.q23_dispute_details ? `Dispute Details: ${r.q23_dispute_details}` : ''}
${r.q24_client_concerns ? `Concerns: ${r.q24_client_concerns}` : ''}
`;

  const pricing = `
PRICING & PAYMENT
=================
Pricing Model: ${Array.isArray(r.q25_pricing_model) ? r.q25_pricing_model.join(', ') : 'Not provided'}
Payment Terms: ${r.q26_payment_terms || 'Not provided'}
${r.q27_payment_detail ? `Payment Detail: ${r.q27_payment_detail}` : ''}
Deposit: ${r.q28_requires_deposit || 'Not provided'}
${r.q29_deposit_detail ? `Deposit Detail: ${r.q29_deposit_detail}` : ''}
Payment Methods: ${Array.isArray(r.q30_payment_methods) ? r.q30_payment_methods.join(', ') : 'Not provided'}
Refund Policy: ${r.q31_refund_policy || 'Not provided'}
${r.q32_refund_detail ? `Refund Detail: ${r.q32_refund_detail}` : ''}
Late Payment Interest: ${r.q33_late_payment_interest || 'Not provided'}
VAT Registered: ${r.q34_vat_registered || 'Not provided'}
${r.q35_vat_number ? `VAT Number: ${r.q35_vat_number}` : ''}
`;

  const gdpr = `
GDPR & DATA PROTECTION
=======================
Data Collected: ${Array.isArray(r.q36_data_collected) ? r.q36_data_collected.join(', ') : 'Not provided'}
Collection Method: ${Array.isArray(r.q37_data_collection_method) ? r.q37_data_collection_method.join(', ') : 'Not provided'}
Purpose: ${r.q38_data_purpose || 'Not provided'}
Storage: ${Array.isArray(r.q39_data_storage) ? r.q39_data_storage.join(', ') : 'Not provided'}
Retention: ${r.q40_data_retention || 'Not provided'}
Third Party Tools: ${r.q41_uses_third_party_tools || 'Not provided'}
${r.q42_third_party_tools ? `Tools Detail: ${r.q42_third_party_tools}` : ''}
Shares Data: ${r.q43_shares_data || 'Not provided'}
${r.q44_data_sharing_detail ? `Sharing Detail: ${r.q44_data_sharing_detail}` : ''}
Marketing: ${r.q45_sends_marketing || 'Not provided'}
${r.q46_marketing_platform ? `Platform: ${r.q46_marketing_platform}` : ''}
Cookies: ${r.q47_uses_cookies || 'Not provided'}
${r.q48_tracking_tools ? `Tracking: ${Array.isArray(r.q48_tracking_tools) ? r.q48_tracking_tools.join(', ') : r.q48_tracking_tools}` : ''}
`;

  const legal = `
LEGAL & RISK
=============
Regulated Services: ${r.q49_regulated_services || 'Not provided'}
${r.q50_regulatory_detail ? `Regulatory Detail: ${r.q50_regulatory_detail}` : ''}
Indemnity Insurance: ${r.q51_indemnity_insurance || 'Not provided'}
${r.q52_certifications ? `Certifications: ${r.q52_certifications}` : ''}
${r.q53_specific_clauses ? `Specific Clauses: ${r.q53_specific_clauses}` : ''}
${r.q54_exclusions ? `Exclusions: ${r.q54_exclusions}` : ''}
`;

  const brand = `
BRAND & VOICE
==============
First Name: ${r.q55_first_name || 'Not provided'}
Business Story: ${r.q56_business_story || 'Not provided'}
Experience: ${r.q57_experience || 'Not provided'}
${r.q58_achievements ? `Achievements: ${r.q58_achievements}` : ''}
${r.q59_client_compliments ? `Compliments: ${r.q59_client_compliments}` : ''}
12 Month Goal: ${r.q60_12_month_goal || 'Not provided'}
Differentiator: ${r.q61_differentiator || 'Not provided'}
Tone of Voice: ${Array.isArray(r.q62_tone_of_voice) ? r.q62_tone_of_voice.join(', ') : 'Not provided'}
${r.q63_avoid_words ? `Avoid Words: ${r.q63_avoid_words}` : ''}
Brand Identity: ${r.q64_brand_identity || 'Not provided'}
Has Logo: ${r.q65_has_logo || 'Not provided'}
${r.q67_brand_colours ? `Brand Colours: ${r.q67_brand_colours}` : ''}
Visual Style: ${r.q68_visual_style || 'Not provided'}
`;

  const invoice = `
INVOICE PREFERENCES
====================
Bank Details: ${r.q69_bank_details || 'Not provided'}
Invoice Due Date: ${r.q70_invoice_due_date || 'Not provided'}
Invoice Fields: ${Array.isArray(r.q71_invoice_fields) ? r.q71_invoice_fields.join(', ') : 'Not provided'}
`;

  const linkedin = `
LINKEDIN
=========
Usage: ${r.q72_linkedin_usage || 'Not provided'}
${r.q73_linkedin_url ? `URL: ${r.q73_linkedin_url}` : ''}
Target: ${r.q74_linkedin_target || 'Not provided'}
${r.q75_linkedin_keywords ? `Keywords: ${r.q75_linkedin_keywords}` : ''}
`;

  const websiteCopy = `
WEBSITE COPY
=============
Primary Action: ${r.wc2_primary_action || 'Not provided'}
${r.wc3_inspiration_urls ? `Inspiration URLs: ${r.wc3_inspiration_urls}` : ''}
Nav Structure: ${r.wc_nav_structure || 'Not provided'}
Service Pages: ${r.wc_service_page_count || 'Not provided'}
${r.wc_headline_idea ? `Headline Idea: ${r.wc_headline_idea}` : ''}
Hero Message: ${r.wc_hero_message || 'Not provided'}
${r.wc_differentiator ? `Differentiator: ${r.wc_differentiator}` : ''}
Problems Solved: ${r.wc_problems_solved || 'Not provided'}
Visitor Feeling: ${Array.isArray(r.wc_visitor_feeling) ? r.wc_visitor_feeling.join(', ') : 'Not provided'}
Colour Preferences: ${r.wc_colour_preferences || r.q67_brand_colours || 'Not provided'}
Colour Style: ${r.wc_colour_palette_style || 'Not provided'}
Font Style: ${r.wc_font_style || 'Not provided'}
Imagery Style: ${r.wc_imagery_style || 'Not provided'}
Logo Placement: ${r.wc_logo_placement || 'Not provided'}
Brand Guidelines: ${r.wc_has_brand_guidelines || 'Not provided'}
${r.wc_competitor_urls ? `Competitor URLs: ${r.wc_competitor_urls}` : ''}
${r.wc_disliked_urls ? `Disliked URLs: ${r.wc_disliked_urls}` : ''}
Forms: ${Array.isArray(r.wc_forms_needed) ? r.wc_forms_needed.join(', ') : 'Not provided'}
Legal Pages: ${Array.isArray(r.wc_legal_pages) ? r.wc_legal_pages.join(', ') : 'Not provided'}
Pricing Display: ${r.wc_show_pricing_on_website || 'Not provided'}
${r.wc_pricing_text ? `Pricing Text: ${r.wc_pricing_text}` : ''}
Payment Methods: ${Array.isArray(r.wc_payment_methods_display) ? r.wc_payment_methods_display.join(', ') : 'Not provided'}
Data Collection: ${r.wc_website_collects_data || 'Not provided'}
Cookie Consent: ${r.wc_needs_cookie_consent || 'Not provided'}
Business Hours: ${r.wc_show_business_hours || 'Not provided'}${r.wc_business_hours ? ` — ${r.wc_business_hours}` : ''}
Phone on Website: ${r.wc_phone_on_website || 'Not provided'}
Email Display: ${r.wc_email_display || r.q7_document_email || 'Not provided'}
Address Display: ${r.wc_address_on_website || 'Not provided'}
Social Links: ${r.wc_show_social_links || 'Not provided'}${r.wc_social_links_to_show ? ` — ${Array.isArray(r.wc_social_links_to_show) ? r.wc_social_links_to_show.join(', ') : r.wc_social_links_to_show}` : ''}
${r.wc_linkedin_url ? `LinkedIn URL: ${r.wc_linkedin_url}` : ''}
${r.wc_instagram_url ? `Instagram URL: ${r.wc_instagram_url}` : ''}
${r.wc_facebook_url ? `Facebook URL: ${r.wc_facebook_url}` : ''}
Testimonials: ${r.wc_testimonials || 'Not provided'}
Testimonials Count: ${r.wc_testimonials_count || 'Not provided'}
${r.wc_credentials_to_show ? `Credentials: ${r.wc_credentials_to_show}` : ''}
${r.wc_awards_or_press ? `Awards/Press: ${r.wc_awards_or_press}` : ''}
Booking Tool: ${r.wc_booking_tool || 'Not provided'}${r.wc_booking_url ? ` — ${r.wc_booking_url}` : ''}
Newsletter: ${r.wc_newsletter_signup || 'Not provided'}${r.wc_newsletter_platform ? ` — ${r.wc_newsletter_platform}` : ''}
`;

  const socialMedia = `
SOCIAL MEDIA
=============
Platforms: ${Array.isArray(r.sm1_platforms) ? r.sm1_platforms.join(', ') : 'Not provided'}
Content Types: ${Array.isArray(r.sm2_content_types) ? r.sm2_content_types.join(', ') : 'Not provided'}
${r.sm3_avoid_topics ? `Avoid Topics: ${r.sm3_avoid_topics}` : ''}
Posting Frequency: ${r.sm4_posting_frequency || 'Not provided'}
Content Pillars: ${r.sm5_content_pillars || 'Not provided'}
Personal Boundaries: ${r.sm6_personal_boundaries || 'Not provided'}
Hashtag Strategy: ${r.sm7_hashtag_strategy || 'Not provided'}
${r.sm8_competitor_accounts ? `Competitor Accounts: ${r.sm8_competitor_accounts}` : ''}
Content Tone: ${r.sm9_content_tone || 'Not provided'}
${r.sm10_call_to_action ? `CTA: ${r.sm10_call_to_action}` : ''}
${r.sm11_existing_accounts ? `Existing Accounts: ${r.sm11_existing_accounts}` : ''}
Content Calendar: ${r.sm12_content_calendar || 'Not provided'}
${r.sm13_upcoming_launches ? `Upcoming Launches: ${r.sm13_upcoming_launches}` : ''}
`;

  const additional = `
ADDITIONAL INFORMATION
=======================
${r.q78_anything_else ? `Anything Else: ${r.q78_anything_else}` : ''}
Confidence Level: ${r.q80_confidence_level || 'Not provided'}
`;

  let serviceContext = "";
  if (serviceId === 'website_copy_pack') {
    serviceContext = `This brief is specifically for the WEBSITE COPY PACK. Focus on website content, structure, design preferences, and all website-related details. Include the website copy section data as primary context. The client has ordered these pages at checkout: ${websitePages.length > 0 ? websitePages.join(', ') : 'not specified — use standard pages'}.`;
  } else if (serviceId === 'social_media_pack') {
    serviceContext = `This brief is specifically for the SOCIAL MEDIA PACK. Focus on social media strategy, content pillars, posting frequency, platform-specific needs, and tone for social channels. Include the social media section data as primary context.`;
  } else if (serviceId === 'business_foundations_pack') {
    serviceContext = `This brief is for the BUSINESS FOUNDATIONS PACK. Focus on legal, financial, and operational document requirements. Include all business identity, services, clients, pricing, GDPR, legal, brand, and invoice data as primary context.`;
  } else {
    serviceContext = `This is a comprehensive brief covering all purchased services. Include all relevant sections.`;
  }

  return `You are a professional business analyst creating a detailed client brief for a UK small business.

${serviceContext}

Generate a comprehensive, well-structured client brief that captures everything needed to produce professional deliverables. Use the client's actual information throughout — no placeholders, no generic filler.

Structure the brief with clear section headers using === SECTION NAME === format.

${businessIdentity}

${services}

${clients}

${pricing}

${gdpr}

${legal}

${brand}

${invoice}

${linkedin}

${websitePagesSection}

${websiteCopy}

${socialMedia}

${additional}

Generate the brief now. Be thorough, specific, and use the client's actual information. Where information is missing, note it clearly rather than making assumptions.`;
}

async function callGemini(prompt: string): Promise<{ text: string; model: string; finishReason?: string }> {
  const model = "gemini-2.0-flash";

  console.log(`Calling Gemini API with model=${model}, prompt length=${prompt.length}`);

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 8192 },
        safetySettings: [
          { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
        ],
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Gemini API error: ${response.status} ${errorText}`);
    throw new Error(`Gemini API error ${response.status}: ${errorText.substring(0, 500)}`);
  }

  const data = await response.json();

  // Check for safety blocks / empty responses with detailed info
  const candidate = data.candidates?.[0];
  const finishReason = candidate?.finishReason;
  const generatedText = candidate?.content?.parts?.[0]?.text;

  if (!generatedText) {
    const blockInfo = candidate?.safetyRatings
      ? `finishReason=${finishReason}, safetyRatings=${JSON.stringify(candidate.safetyRatings)}`
      : `finishReason=${finishReason}, no content returned`;
    const promptFeedback = data.promptFeedback
      ? `, promptFeedback=${JSON.stringify(data.promptFeedback)}`
      : '';
    throw new Error(`No text generated from Gemini. ${blockInfo}${promptFeedback}`);
  }

  await trackGeminiUsage(model);

  return { text: generatedText, model, finishReason };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  // ─── Health / debug endpoint ────────────────────────────────────────────
  if (req.method === "GET") {
    const keyTest = await testGeminiKey();
    return successResponse({
      status: "generate-brief endpoint active",
      env: {
        hasSupabaseUrl: !!SUPABASE_URL,
        hasServiceRoleKey: !!SERVICE_ROLE_KEY,
        hasGeminiKey: !!GEMINI_API_KEY,
        geminiKeyPrefix: GEMINI_API_KEY ? GEMINI_API_KEY.substring(0, 6) + "..." : "(empty)",
      },
      geminiKeyTest: keyTest,
    });
  }

  // ─── Brief generation ───────────────────────────────────────────────────
  try {
    const body = await req.json();
    const { user_id, service_id, debug } = body as { user_id?: string; service_id?: string; debug?: boolean };

    if (!user_id) {
      return errorResponse(400, "Missing user_id");
    }

    if (!GEMINI_API_KEY) {
      return errorResponse(500, "GEMINI_API_KEY not configured", {
        hint: "Set the GEMINI_API_KEY secret in Supabase edge function settings",
      });
    }

    const debugInfo: Record<string, unknown> = {};
    const shouldDebug = debug === true;

    // Step 1: Verify Gemini key works
    if (shouldDebug) {
      const keyTest = await testGeminiKey();
      debugInfo.geminiKeyTest = keyTest;
      if (!keyTest.valid) {
        return errorResponse(500, "Gemini API key is invalid", debugInfo);
      }
    }

    // Step 2: Fetch intake data
    const { data: intakeData, error: intakeError } = await adminQuery(
      "intake_responses", "responses,purchased_service_ids", { user_id }
    );
    if (intakeError) {
      return errorResponse(500, "Failed to fetch intake data", { intakeError });
    }
    if (!intakeData || !Array.isArray(intakeData) || intakeData.length === 0) {
      return errorResponse(404, "No intake data found for this client");
    }

    const responses = intakeData[0].responses || {};
    if (shouldDebug) {
      debugInfo.intakeResponseKeys = Object.keys(responses);
      debugInfo.purchasedServiceIds = intakeData[0].purchased_service_ids;
    }

    // Step 3: Fetch website pages
    const { data: servicesData } = await adminQuery(
      "services_purchased", "website_pages_selected", { user_id, service_id: "website_copy_pack", status: "active" }
    );
    const websitePages = servicesData && Array.isArray(servicesData) && servicesData.length > 0
      ? (servicesData[0].website_pages_selected || [])
      : [];

    // Step 4: Build prompt
    const briefPrompt = buildBriefPrompt(responses, service_id || null, websitePages);
    if (shouldDebug) {
      debugInfo.promptLength = briefPrompt.length;
      debugInfo.serviceId = service_id || null;
      debugInfo.websitePages = websitePages;
    }

    // Step 5: Call Gemini
    let briefContent: string;
    let usedModel: string;
    try {
      const result = await callGemini(briefPrompt);
      briefContent = result.text;
      usedModel = result.model;
      if (shouldDebug) {
        debugInfo.finishReason = result.finishReason;
      }
    } catch (geminiErr) {
      const errMsg = geminiErr instanceof Error ? geminiErr.message : "Unknown Gemini error";
      console.error("Gemini call failed:", errMsg);

      // Save failed status to client_briefs
      try {
        await fetch(`${SUPABASE_URL}/rest/v1/client_briefs`, {
          method: "POST",
          headers: {
            apikey: SERVICE_ROLE_KEY,
            Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            client_id: user_id,
            service_id: service_id || null,
            status: "failed",
            error_message: errMsg,
            generated_at: new Date().toISOString(),
          }),
        });
      } catch { /* best effort */ }

      return errorResponse(502, `Gemini API failed: ${errMsg}`, shouldDebug ? debugInfo : undefined);
    }

    // Step 6: Save to client_briefs
    const briefFilter = service_id
      ? `client_id=eq.${user_id}&service_id=eq.${service_id}`
      : `client_id=eq.${user_id}&service_id=is.null`;

    const existingRes = await fetch(`${SUPABASE_URL}/rest/v1/client_briefs?select=id&${briefFilter}`, {
      headers: { apikey: SERVICE_ROLE_KEY, Authorization: `Bearer ${SERVICE_ROLE_KEY}` },
    });
    const existingBrief = existingRes.ok ? await existingRes.json() : [];

    const briefRecord = {
      client_id: user_id,
      service_id: service_id || null,
      brief_content: briefContent,
      status: "completed",
      model_used: usedModel,
      generated_at: new Date().toISOString(),
    };

    if (Array.isArray(existingBrief) && existingBrief.length > 0) {
      const patchRes = await fetch(`${SUPABASE_URL}/rest/v1/client_briefs?id=eq.${existingBrief[0].id}`, {
        method: "PATCH",
        headers: {
          apikey: SERVICE_ROLE_KEY,
          Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        body: JSON.stringify(briefRecord),
      });
      if (!patchRes.ok) {
        const text = await patchRes.text();
        console.error(`Patch client_briefs failed: ${patchRes.status} ${text}`);
        if (shouldDebug) debugInfo.briefSaveError = `Patch failed: ${patchRes.status} ${text}`;
      }
    } else {
      const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/client_briefs`, {
        method: "POST",
        headers: {
          apikey: SERVICE_ROLE_KEY,
          Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        body: JSON.stringify(briefRecord),
      });
      if (!insertRes.ok) {
        const text = await insertRes.text();
        console.error(`Insert client_briefs failed: ${insertRes.status} ${text}`);
        if (shouldDebug) debugInfo.briefSaveError = `Insert failed: ${insertRes.status} ${text}`;
      }
    }

    return successResponse({
      success: true,
      brief_content: briefContent,
      model: usedModel,
      generated_at: new Date().toISOString(),
      ...(shouldDebug ? { debug: debugInfo } : {}),
    });

  } catch (err) {
    console.error("generate-brief error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    const stack = err instanceof Error ? err.stack : undefined;
    return errorResponse(500, "Internal server error", { message, stack });
  }
});
