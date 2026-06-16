import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY") || "";

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

// ─── Service-specific brief prompt builders ─────────────────────────────────

function buildDocumentsBriefPrompt(r: Record<string, any>, websitePages: string[]): string {
  const wpSection = websitePages.length > 0
    ? `\n=== WEBSITE PAGES ORDERED ===\nPages: ${websitePages.join(', ')}\n`
    : '';

  return `You are a professional business analyst creating a COMPREHENSIVE client brief for the BUSINESS FOUNDATIONS PACK (Documents).

This brief will be used to generate 10 professional documents: Terms & Conditions, Service Agreement Contract, GDPR Privacy Policy, Professional Invoice Template, Late Payment Letters, Welcome Email Sequence, Professional Bio, Elevator Pitch, LinkedIn Profile Script, and Service Description Sheets.

These documents span legal, financial, operational, branding, and marketing domains. The brief MUST contain EVERY detail about the client because each document needs different information. A missing detail could result in an inaccurate legal clause, an unenforceable contract term, or a missed branding opportunity.

Include ALL information below. Where data is missing, note it clearly as [NOT PROVIDED] rather than guessing.

Generate the brief using these exact section headers:

=== BUSINESS IDENTITY ===
Legal Name: ${r.q1_legal_name || '[NOT PROVIDED]'}
Business Name: ${r.q2_business_name || '[NOT PROVIDED]'}
Registration: ${r.q3_business_registered || '[NOT PROVIDED]'}
${r.q4_companies_house ? `Companies House: ${r.q4_companies_house}` : ''}
Jurisdiction: ${r.q5_jurisdiction || '[NOT PROVIDED]'}
Address: ${r.q6_business_address || '[NOT PROVIDED]'}
Document Email: ${r.q7_document_email || '[NOT PROVIDED]'}
${r.q8_business_phone ? `Phone: ${r.q8_business_phone}` : ''}
Website: ${r.q9_has_website || '[NOT PROVIDED]'}${r.q10_website_url ? ` — ${r.q10_website_url}` : ''}
Social: ${Array.isArray(r.q11_social_platforms) ? r.q11_social_platforms.join(', ') : '[NOT PROVIDED]'}

=== SERVICES ===
What They Do: ${r.q13_what_you_do || '[NOT PROVIDED]'}
Flagship Service: ${r.q14_flagship_service || '[NOT PROVIDED]'}
Services Detail:
${Array.isArray(r.q15_services)
  ? r.q15_services.map((s: any, i: number) =>
      `${i + 1}. ${s.service_name}: ${s.service_includes || 'No details'}\n   Excludes: ${s.service_excludes || 'Not specified'}\n   Client Provides: ${s.service_client_provides || 'Not specified'}\n   Timeline: ${s.service_timeline || 'Not specified'}\n   Outcome: ${s.service_outcome || 'Not specified'}${s.service_starting_price ? `\n   Starting Price: ${s.service_starting_price}` : ''}`
    ).join('\n')
  : '[NOT PROVIDED]'}
Uses Subcontractors: ${r.q16_uses_subcontractors || '[NOT PROVIDED]'}
${r.q17_inform_subcontractors ? `Inform Clients: ${r.q17_inform_subcontractors}` : ''}
Sends Proposal: ${r.q18_sends_proposal || '[NOT PROVIDED]'}

=== CLIENTS & WORK ===
Client Type: ${r.q19_client_type || '[NOT PROVIDED]'}
Ideal Client: ${r.q20_ideal_client || '[NOT PROVIDED]'}
${r.q21_client_industries ? `Industries: ${r.q21_client_industries}` : ''}
Issues Experienced: ${Array.isArray(r.q22_client_issues) ? r.q22_client_issues.join(', ') : 'None reported'}
${r.q23_dispute_details ? `Dispute Details: ${r.q23_dispute_details}` : ''}
${r.q24_client_concerns ? `Concerns: ${r.q24_client_concerns}` : ''}

=== PRICING & PAYMENT ===
Pricing Model: ${Array.isArray(r.q25_pricing_model) ? r.q25_pricing_model.join(', ') : '[NOT PROVIDED]'}
Payment Terms: ${r.q26_payment_terms || '[NOT PROVIDED]'}
${r.q27_payment_detail ? `Payment Detail: ${r.q27_payment_detail}` : ''}
Deposit: ${r.q28_requires_deposit || '[NOT PROVIDED]'}
${r.q29_deposit_detail ? `Deposit Detail: ${r.q29_deposit_detail}` : ''}
Payment Methods: ${Array.isArray(r.q30_payment_methods) ? r.q30_payment_methods.join(', ') : '[NOT PROVIDED]'}
Refund Policy: ${r.q31_refund_policy || '[NOT PROVIDED]'}
${r.q32_refund_detail ? `Refund Detail: ${r.q32_refund_detail}` : ''}
Late Payment Interest: ${r.q33_late_payment_interest || '[NOT PROVIDED]'}
VAT Registered: ${r.q34_vat_registered || '[NOT PROVIDED]'}
${r.q35_vat_number ? `VAT Number: ${r.q35_vat_number}` : ''}

=== GDPR & DATA PROTECTION ===
Data Collected: ${Array.isArray(r.q36_data_collected) ? r.q36_data_collected.join(', ') : '[NOT PROVIDED]'}
Collection Method: ${Array.isArray(r.q37_data_collection_method) ? r.q37_data_collection_method.join(', ') : '[NOT PROVIDED]'}
Purpose: ${r.q38_data_purpose || '[NOT PROVIDED]'}
Storage: ${Array.isArray(r.q39_data_storage) ? r.q39_data_storage.join(', ') : '[NOT PROVIDED]'}
Retention: ${r.q40_data_retention || '[NOT PROVIDED]'}
Third Party Tools: ${r.q41_uses_third_party_tools || '[NOT PROVIDED]'}
${r.q42_third_party_tools ? `Tools Detail: ${r.q42_third_party_tools}` : ''}
Shares Data: ${r.q43_shares_data || '[NOT PROVIDED]'}
${r.q44_data_sharing_detail ? `Sharing Detail: ${r.q44_data_sharing_detail}` : ''}
Marketing: ${r.q45_sends_marketing || '[NOT PROVIDED]'}
${r.q46_marketing_platform ? `Platform: ${r.q46_marketing_platform}` : ''}
Cookies: ${r.q47_uses_cookies || '[NOT PROVIDED]'}
${r.q48_tracking_tools ? `Tracking: ${Array.isArray(r.q48_tracking_tools) ? r.q48_tracking_tools.join(', ') : r.q48_tracking_tools}` : ''}

=== LEGAL & RISK ===
Regulated Services: ${r.q49_regulated_services || '[NOT PROVIDED]'}
${r.q50_regulatory_detail ? `Regulatory Detail: ${r.q50_regulatory_detail}` : ''}
Indemnity Insurance: ${r.q51_indemnity_insurance || '[NOT PROVIDED]'}
${r.q52_certifications ? `Certifications: ${r.q52_certifications}` : ''}
${r.q53_specific_clauses ? `Specific Clauses: ${r.q53_specific_clauses}` : ''}
${r.q54_exclusions ? `Exclusions: ${r.q54_exclusions}` : ''}

=== BRAND & VOICE ===
First Name: ${r.q55_first_name || '[NOT PROVIDED]'}
Business Story: ${r.q56_business_story || '[NOT PROVIDED]'}
Experience: ${r.q57_experience || '[NOT PROVIDED]'}
${r.q58_achievements ? `Achievements: ${r.q58_achievements}` : ''}
${r.q59_client_compliments ? `Compliments: ${r.q59_client_compliments}` : ''}
12 Month Goal: ${r.q60_12_month_goal || '[NOT PROVIDED]'}
Differentiator: ${r.q61_differentiator || '[NOT PROVIDED]'}
Tone of Voice: ${Array.isArray(r.q62_tone_of_voice) ? r.q62_tone_of_voice.join(', ') : '[NOT PROVIDED]'}
${r.q63_avoid_words ? `Avoid Words: ${r.q63_avoid_words}` : ''}
Brand Identity: ${r.q64_brand_identity || '[NOT PROVIDED]'}
Has Logo: ${r.q65_has_logo || '[NOT PROVIDED]'}
${r.q67_brand_colours ? `Brand Colours: ${r.q67_brand_colours}` : ''}
Visual Style: ${r.q68_visual_style || '[NOT PROVIDED]'}

=== INVOICE PREFERENCES ===
Bank Details: ${r.q69_bank_details || '[NOT PROVIDED]'}
Invoice Due Date: ${r.q70_invoice_due_date || '[NOT PROVIDED]'}
Invoice Fields: ${Array.isArray(r.q71_invoice_fields) ? r.q71_invoice_fields.join(', ') : '[NOT PROVIDED]'}

=== LINKEDIN ===
Usage: ${r.q72_linkedin_usage || '[NOT PROVIDED]'}
${r.q73_linkedin_url ? `URL: ${r.q73_linkedin_url}` : ''}
Target: ${r.q74_linkedin_target || '[NOT PROVIDED]'}
${r.q75_linkedin_keywords ? `Keywords: ${r.q75_linkedin_keywords}` : ''}
${wpSection}
=== ADDITIONAL INFORMATION ===
${r.q78_anything_else ? `Anything Else: ${r.q78_anything_else}` : ''}
Confidence Level: ${r.q80_confidence_level || '[NOT PROVIDED]'}

Generate the brief now. Organise the raw data above into a structured, professional client brief. Add analytical commentary where useful — identify legal risks, flag GDPR compliance gaps, note contradictions, highlight areas where the documents will need to be especially protective. This analysis helps the document generator produce better, more protective documents.`;
}

function buildSocialMediaBriefPrompt(r: Record<string, any>): string {
  return `You are a professional social media strategist creating a DETAILED client brief for the SOCIAL MEDIA PACK.

This brief will be used to generate social media posts (educational, promotional, personal) across multiple platforms. It must contain everything a content creator needs: brand identity, voice, visual style, services to promote, audience insights, and platform-specific strategy.

Do NOT include legal, GDPR, financial, or operational details unless they directly affect what can/cannot be posted publicly. Focus exclusively on information that helps create engaging, on-brand social content.

Generate the brief using these exact section headers:

=== BUSINESS IDENTITY ===
Business Name: ${r.q2_business_name || '[NOT PROVIDED]'}
Owner First Name: ${r.q55_first_name || '[NOT PROVIDED]'}
Website: ${r.q9_has_website || '[NOT PROVIDED]'}${r.q10_website_url ? ` — ${r.q10_website_url}` : ''}
Email: ${r.q7_document_email || '[NOT PROVIDED]'}
${r.q8_business_phone ? `Phone: ${r.q8_business_phone}` : ''}
Social Platforms: ${Array.isArray(r.q11_social_platforms) ? r.q11_social_platforms.join(', ') : '[NOT PROVIDED]'}

=== SERVICES TO PROMOTE ===
What They Do: ${r.q13_what_you_do || '[NOT PROVIDED]'}
Flagship Service: ${r.q14_flagship_service || '[NOT PROVIDED]'}
Services Summary:
${Array.isArray(r.q15_services)
  ? r.q15_services.map((s: any, i: number) =>
      `${i + 1}. ${s.service_name}: ${s.service_includes || 'No details'}${s.service_starting_price ? ` — From ${s.service_starting_price}` : ''}`
    ).join('\n')
  : '[NOT PROVIDED]'}
Sends Proposal: ${r.q18_sends_proposal || '[NOT PROVIDED]'}

=== TARGET AUDIENCE ===
Client Type: ${r.q19_client_type || '[NOT PROVIDED]'}
Ideal Client: ${r.q20_ideal_client || '[NOT PROVIDED]'}
${r.q21_client_industries ? `Industries: ${r.q21_client_industries}` : ''}
${r.q24_client_concerns ? `Client Concerns: ${r.q24_client_concerns}` : ''}

=== BRAND & VOICE ===
Business Story: ${r.q56_business_story || '[NOT PROVIDED]'}
Experience: ${r.q57_experience || '[NOT PROVIDED]'}
${r.q58_achievements ? `Achievements: ${r.q58_achievements}` : ''}
${r.q59_client_compliments ? `Compliments Received: ${r.q59_client_compliments}` : ''}
12 Month Goal: ${r.q60_12_month_goal || '[NOT PROVIDED]'}
Differentiator: ${r.q61_differentiator || '[NOT PROVIDED]'}
Tone of Voice: ${Array.isArray(r.q62_tone_of_voice) ? r.q62_tone_of_voice.join(', ') : '[NOT PROVIDED]'}
${r.q63_avoid_words ? `Avoid Words: ${r.q63_avoid_words}` : ''}
Brand Identity: ${r.q64_brand_identity || '[NOT PROVIDED]'}
${r.q67_brand_colours ? `Brand Colours: ${r.q67_brand_colours}` : ''}
Visual Style: ${r.q68_visual_style || '[NOT PROVIDED]'}

=== SOCIAL MEDIA STRATEGY ===
Platforms: ${Array.isArray(r.sm1_platforms) ? r.sm1_platforms.join(', ') : '[NOT PROVIDED]'}
Content Types: ${Array.isArray(r.sm2_content_types) ? r.sm2_content_types.join(', ') : '[NOT PROVIDED]'}
${r.sm3_avoid_topics ? `Topics to Avoid: ${r.sm3_avoid_topics}` : ''}
Posting Frequency: ${r.sm4_posting_frequency || '[NOT PROVIDED]'}
Content Pillars: ${r.sm5_content_pillars || '[NOT PROVIDED]'}
Personal Boundaries: ${r.sm6_personal_boundaries || '[NOT PROVIDED]'}
Hashtag Strategy: ${r.sm7_hashtag_strategy || '[NOT PROVIDED]'}
${r.sm8_competitor_accounts ? `Competitor Accounts: ${r.sm8_competitor_accounts}` : ''}
Content Tone: ${r.sm9_content_tone || '[NOT PROVIDED]'}
${r.sm10_call_to_action ? `Preferred CTA: ${r.sm10_call_to_action}` : ''}
${r.sm11_existing_accounts ? `Existing Accounts: ${r.sm11_existing_accounts}` : ''}
Content Calendar: ${r.sm12_content_calendar || '[NOT PROVIDED]'}
${r.sm13_upcoming_launches ? `Upcoming Launches: ${r.sm13_upcoming_launches}` : ''}

=== ADDITIONAL INFORMATION ===
${r.q78_anything_else ? `Anything Else: ${r.q78_anything_else}` : ''}

Generate the brief now. Transform the raw data above into a well-organised social media strategy brief. Add strategic commentary: suggest content themes based on their services, identify opportunities for viral/shareable content, note any brand consistency issues, and recommend how to position this business on social media for maximum impact.`;
}

function buildWebsiteBriefPrompt(r: Record<string, any>, websitePages: string[]): string {
  const pagesSection = websitePages.length > 0
    ? `PAGES ORDERED AT CHECKOUT\n========================\nPages: ${websitePages.join(', ')}\nTotal: ${websitePages.length} pages\n`
    : '';

  return `You are a professional web strategist creating a COMPREHENSIVE client brief for the WEBSITE COPY PACK.

This brief will be used to generate a complete, production-ready website. A website is the public representation of a business — it must contain everything a visitor needs to understand the business, trust the business, and take action. Missing details result in a poor-quality website.

Include: full business identity, every service in detail, client profile, brand/visual specifications, ALL website-specific requirements, and any legal context relevant to website publication.

Generate the brief using these exact section headers:

=== BUSINESS IDENTITY ===
Legal Name: ${r.q1_legal_name || '[NOT PROVIDED]'}
Business Name: ${r.q2_business_name || '[NOT PROVIDED]'}
Registration: ${r.q3_business_registered || '[NOT PROVIDED]'}
${r.q4_companies_house ? `Companies House: ${r.q4_companies_house}` : ''}
Jurisdiction: ${r.q5_jurisdiction || '[NOT PROVIDED]'}
Address: ${r.q6_business_address || '[NOT PROVIDED]'}
Document Email: ${r.q7_document_email || '[NOT PROVIDED]'}
${r.q8_business_phone ? `Phone: ${r.q8_business_phone}` : ''}
Website: ${r.q9_has_website || '[NOT PROVIDED]'}${r.q10_website_url ? ` — ${r.q10_website_url}` : ''}
Social: ${Array.isArray(r.q11_social_platforms) ? r.q11_social_platforms.join(', ') : '[NOT PROVIDED]'}

=== SERVICES (FULL DETAIL FOR SERVICE PAGES) ===
What They Do: ${r.q13_what_you_do || '[NOT PROVIDED]'}
Flagship Service: ${r.q14_flagship_service || '[NOT PROVIDED]'}
Services Detail:
${Array.isArray(r.q15_services)
  ? r.q15_services.map((s: any, i: number) =>
      `${i + 1}. ${s.service_name}: ${s.service_includes || 'No details'}\n   Excludes: ${s.service_excludes || 'Not specified'}\n   Timeline: ${s.service_timeline || 'Not specified'}\n   Outcome: ${s.service_outcome || 'Not specified'}${s.service_starting_price ? `\n   Starting Price: ${s.service_starting_price}` : ''}`
    ).join('\n')
  : '[NOT PROVIDED]'}
Uses Subcontractors: ${r.q16_uses_subcontractors || '[NOT PROVIDED]'}
Sends Proposal: ${r.q18_sends_proposal || '[NOT PROVIDED]'}

=== TARGET AUDIENCE ===
Client Type: ${r.q19_client_type || '[NOT PROVIDED]'}
Ideal Client: ${r.q20_ideal_client || '[NOT PROVIDED]'}
${r.q21_client_industries ? `Industries: ${r.q21_client_industries}` : ''}
${r.q22_client_issues ? `Issues: ${Array.isArray(r.q22_client_issues) ? r.q22_client_issues.join(', ') : r.q22_client_issues}` : ''}
${r.q24_client_concerns ? `Concerns: ${r.q24_client_concerns}` : ''}

=== BRAND & VISUAL IDENTITY ===
First Name: ${r.q55_first_name || '[NOT PROVIDED]'}
Business Story: ${r.q56_business_story || '[NOT PROVIDED]'}
Experience: ${r.q57_experience || '[NOT PROVIDED]'}
${r.q58_achievements ? `Achievements: ${r.q58_achievements}` : ''}
${r.q59_client_compliments ? `Compliments: ${r.q59_client_compliments}` : ''}
12 Month Goal: ${r.q60_12_month_goal || '[NOT PROVIDED]'}
Differentiator: ${r.q61_differentiator || '[NOT PROVIDED]'}
Tone of Voice: ${Array.isArray(r.q62_tone_of_voice) ? r.q62_tone_of_voice.join(', ') : '[NOT PROVIDED]'}
${r.q63_avoid_words ? `Avoid Words: ${r.q63_avoid_words}` : ''}
Brand Identity: ${r.q64_brand_identity || '[NOT PROVIDED]'}
Has Logo: ${r.q65_has_logo || '[NOT PROVIDED]'}
${r.q67_brand_colours ? `Brand Colours: ${r.q67_brand_colours}` : ''}
Visual Style: ${r.q68_visual_style || '[NOT PROVIDED]'}

=== ${pagesSection}WEBSITE STRUCTURE & CONTENT ===
Primary Action: ${r.wc2_primary_action || '[NOT PROVIDED]'}
${r.wc3_inspiration_urls ? `Inspiration URLs: ${r.wc3_inspiration_urls}` : ''}
Nav Structure: ${r.wc_nav_structure || '[NOT PROVIDED]'}
Service Pages: ${r.wc_service_page_count || '[NOT PROVIDED]'}
${r.wc_headline_idea ? `Headline Idea: ${r.wc_headline_idea}` : ''}
Hero Message: ${r.wc_hero_message || '[NOT PROVIDED]'}
${r.wc_differentiator ? `Differentiator: ${r.wc_differentiator}` : ''}
Problems Solved: ${r.wc_problems_solved || '[NOT PROVIDED]'}
Visitor Feeling: ${Array.isArray(r.wc_visitor_feeling) ? r.wc_visitor_feeling.join(', ') : '[NOT PROVIDED]'}

=== WEBSITE VISUAL DESIGN ===
Colour Preferences: ${r.wc_colour_preferences || r.q67_brand_colours || '[NOT PROVIDED]'}
Colour Palette Style: ${r.wc_colour_palette_style || '[NOT PROVIDED]'}
Font Style: ${r.wc_font_style || '[NOT PROVIDED]'}
Imagery Style: ${r.wc_imagery_style || '[NOT PROVIDED]'}
Logo Placement: ${r.wc_logo_placement || '[NOT PROVIDED]'}
Brand Guidelines: ${r.wc_has_brand_guidelines || '[NOT PROVIDED]'}
${r.wc_competitor_urls ? `Competitor URLs: ${r.wc_competitor_urls}` : ''}
${r.wc_disliked_urls ? `Disliked URLs: ${r.wc_disliked_urls}` : ''}

=== WEBSITE FEATURES ===
Forms Needed: ${Array.isArray(r.wc_forms_needed) ? r.wc_forms_needed.join(', ') : '[NOT PROVIDED]'}
Legal Pages: ${Array.isArray(r.wc_legal_pages) ? r.wc_legal_pages.join(', ') : '[NOT PROVIDED]'}
Pricing Display: ${r.wc_show_pricing_on_website || '[NOT PROVIDED]'}
${r.wc_pricing_text ? `Pricing Text: ${r.wc_pricing_text}` : ''}
Payment Methods Display: ${Array.isArray(r.wc_payment_methods_display) ? r.wc_payment_methods_display.join(', ') : '[NOT PROVIDED]'}
Data Collection: ${r.wc_website_collects_data || '[NOT PROVIDED]'}
Cookie Consent: ${r.wc_needs_cookie_consent || '[NOT PROVIDED]'}
Business Hours: ${r.wc_show_business_hours || '[NOT PROVIDED]'}${r.wc_business_hours ? ` — ${r.wc_business_hours}` : ''}
Phone on Website: ${r.wc_phone_on_website || '[NOT PROVIDED]'}
${r.q8_business_phone ? `Phone Number: ${r.q8_business_phone}` : ''}
Email Display: ${r.wc_email_display || r.q7_document_email || '[NOT PROVIDED]'}
Address Display: ${r.wc_address_on_website || '[NOT PROVIDED]'}
Social Links: ${r.wc_show_social_links || '[NOT PROVIDED]'}${r.wc_social_links_to_show ? ` — ${Array.isArray(r.wc_social_links_to_show) ? r.wc_social_links_to_show.join(', ') : r.wc_social_links_to_show}` : ''}
${r.wc_linkedin_url ? `LinkedIn URL: ${r.wc_linkedin_url}` : ''}
${r.wc_instagram_url ? `Instagram URL: ${r.wc_instagram_url}` : ''}
${r.wc_facebook_url ? `Facebook URL: ${r.wc_facebook_url}` : ''}

=== TESTIMONIALS & CREDENTIALS ===
Testimonials: ${r.wc_testimonials || '[NOT PROVIDED]'}
Testimonials Count: ${r.wc_testimonials_count || '[NOT PROVIDED]'}
${r.wc_credentials_to_show ? `Credentials: ${r.wc_credentials_to_show}` : ''}
${r.wc_awards_or_press ? `Awards/Press: ${r.wc_awards_or_press}` : ''}
${r.q52_certifications ? `Certifications: ${r.q52_certifications}` : ''}

=== BOOKING & NEWSLETTER ===
Booking Tool: ${r.wc_booking_tool || '[NOT PROVIDED]'}${r.wc_booking_url ? ` — ${r.wc_booking_url}` : ''}
Newsletter: ${r.wc_newsletter_signup || '[NOT PROVIDED]'}${r.wc_newsletter_platform ? ` — ${r.wc_newsletter_platform}` : ''}

=== GDPR FOR WEBSITE ===
Data Collected on Website: ${Array.isArray(r.q36_data_collected) ? r.q36_data_collected.join(', ') : '[NOT PROVIDED]'}
Collection Method: ${Array.isArray(r.q37_data_collection_method) ? r.q37_data_collection_method.join(', ') : '[NOT PROVIDED]'}
Third Party Tools: ${r.q41_uses_third_party_tools || '[NOT PROVIDED]'}
${r.q42_third_party_tools ? `Tools Detail: ${r.q42_third_party_tools}` : ''}
Marketing: ${r.q45_sends_marketing || '[NOT PROVIDED]'}
${r.q46_marketing_platform ? `Platform: ${r.q46_marketing_platform}` : ''}
Cookies/Tracking: ${r.q47_uses_cookies || '[NOT PROVIDED]'}
${r.q48_tracking_tools ? `Tracking: ${Array.isArray(r.q48_tracking_tools) ? r.q48_tracking_tools.join(', ') : r.q48_tracking_tools}` : ''}

=== ADDITIONAL INFORMATION ===
${r.q78_anything_else ? `Anything Else: ${r.q78_anything_else}` : ''}
Confidence Level: ${r.q80_confidence_level || '[NOT PROVIDED]'}

Generate the brief now. Transform the raw data into a structured, comprehensive website strategy brief. Add analytical commentary: identify content gaps, suggest page structures for each ordered page, recommend CTAs based on their business type, flag contradictions, and note any missing information that would prevent a complete website.`;
}

function buildComprehensiveBriefPrompt(r: Record<string, any>, websitePages: string[]): string {
  const wpSection = websitePages.length > 0
    ? `\nWEBSITE PAGES ORDERED\n=====================\nPages: ${websitePages.join(', ')}\n`
    : '';

  return `You are a professional business analyst creating a comprehensive client brief covering all purchased services.

Generate a comprehensive, well-structured client brief that captures everything needed to produce professional deliverables. Use the client's actual information throughout — no placeholders, no generic filler.

Structure the brief with clear section headers using === SECTION NAME === format.

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

CLIENTS & HOW THEY WORK
========================
Client Type: ${r.q19_client_type || 'Not provided'}
Ideal Client: ${r.q20_ideal_client || 'Not provided'}
${r.q21_client_industries ? `Industries: ${r.q21_client_industries}` : ''}
Issues Experienced: ${Array.isArray(r.q22_client_issues) ? r.q22_client_issues.join(', ') : 'None reported'}
${r.q23_dispute_details ? `Dispute Details: ${r.q23_dispute_details}` : ''}
${r.q24_client_concerns ? `Concerns: ${r.q24_client_concerns}` : ''}

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

LEGAL & RISK
=============
Regulated Services: ${r.q49_regulated_services || 'Not provided'}
${r.q50_regulatory_detail ? `Regulatory Detail: ${r.q50_regulatory_detail}` : ''}
Indemnity Insurance: ${r.q51_indemnity_insurance || 'Not provided'}
${r.q52_certifications ? `Certifications: ${r.q52_certifications}` : ''}
${r.q53_specific_clauses ? `Specific Clauses: ${r.q53_specific_clauses}` : ''}
${r.q54_exclusions ? `Exclusions: ${r.q54_exclusions}` : ''}

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

INVOICE PREFERENCES
====================
Bank Details: ${r.q69_bank_details || 'Not provided'}
Invoice Due Date: ${r.q70_invoice_due_date || 'Not provided'}
Invoice Fields: ${Array.isArray(r.q71_invoice_fields) ? r.q71_invoice_fields.join(', ') : 'Not provided'}

LINKEDIN
=========
Usage: ${r.q72_linkedin_usage || 'Not provided'}
${r.q73_linkedin_url ? `URL: ${r.q73_linkedin_url}` : ''}
Target: ${r.q74_linkedin_target || 'Not provided'}
${r.q75_linkedin_keywords ? `Keywords: ${r.q75_linkedin_keywords}` : ''}
${wpSection}
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

ADDITIONAL INFORMATION
=======================
${r.q78_anything_else ? `Anything Else: ${r.q78_anything_else}` : ''}
Confidence Level: ${r.q80_confidence_level || 'Not provided'}

Generate the brief now. Be thorough, specific, and use the client's actual information. Where information is missing, note it clearly rather than making assumptions.`;
}

function buildClientOnboardingBriefPrompt(r: Record<string, any>): string {
  return `You are a professional business analyst creating a client brief for the CLIENT ONBOARDING & SCOPE CONTROL PACK.

This brief will be used to generate 8 documents: Client Onboarding Questionnaire, Scope of Work Document, Project Brief Template, Change Request Form, Onboarding Checklist, Client Communication Protocols, Welcome Packet Guide, and Feedback & Closing Questionnaire.

BUSINESS IDENTITY
==================
Business Name: ${r.q2_business_name || 'Not provided'}
Legal Name: ${r.q1_legal_name || 'Not provided'}
Business Type: ${r.q3_business_registered || 'Not provided'}
Jurisdiction: ${r.q5_jurisdiction || 'Not provided'}
Email: ${r.q7_document_email || 'Not provided'}

SERVICES OFFERED
=================
What They Do: ${r.q13_what_you_do || 'Not provided'}
Flagship Service: ${r.q14_flagship_service || 'Not provided'}

CLIENT ONBOARDING DETAILS
==========================
Onboarding Style: ${r.co1_onboarding_style || 'Not provided'}
Pain Points: ${r.co2_onboarding_pain_points || 'Not provided'}
Scope Creep Experience: ${r.co3_scope_creep_experience || 'Not provided'}
${r.co4_scope_creep_detail ? `Scope Creep Detail: ${r.co4_scope_creep_detail}` : ''}
Communication Channels: ${Array.isArray(r.co5_communication_channels) ? r.co5_communication_channels.join(', ') : 'Not provided'}
Response Time Commitment: ${r.co6_response_time_expectation || 'Not provided'}
Client Must Provide: ${r.co7_client_provides || 'Not provided'}
Kick-Off Format: ${r.co8_kickoff_format || 'Not provided'}
Revision Policy: ${r.co9_revision_policy || 'Not provided'}
Closing Process: ${r.co10_closing_process || 'Not provided'}
${r.client_onboarding_notes ? `Additional Notes: ${r.client_onboarding_notes}` : ''}

Generate a thorough brief covering onboarding workflow, scope protection strategies, communication standards, and closing procedures. Flag any gaps with [NOT PROVIDED].`;
}

function buildPaymentProtectionBriefPrompt(r: Record<string, any>): string {
  return `You are a professional business analyst creating a client brief for the PAYMENT PROTECTION PACK.

This brief will be used to generate 8 documents: Invoice Terms & Conditions, Late Payment Policy, Payment Schedule Template, Refund & Cancellation Policy, Deposit & Cancellation Terms, Payment Tracking Template, Chasing Payment Scripts (x5), and Chargeback Response Templates.

BUSINESS IDENTITY
==================
Business Name: ${r.q2_business_name || 'Not provided'}
Legal Name: ${r.q1_legal_name || 'Not provided'}
Jurisdiction: ${r.q5_jurisdiction || 'Not provided'}
Business Type: ${r.q3_business_registered || 'Not provided'}
Email: ${r.q7_document_email || 'Not provided'}

PRICING & PAYMENT (Foundation)
================================
Pricing Model: ${Array.isArray(r.q25_pricing_model) ? r.q25_pricing_model.join(', ') : 'Not provided'}
Payment Terms: ${r.q26_payment_terms || 'Not provided'}
Requires Deposit: ${r.q28_requires_deposit || 'Not provided'}
${r.q29_deposit_detail ? `Deposit Detail: ${r.q29_deposit_detail}` : ''}
Payment Methods: ${Array.isArray(r.q30_payment_methods) ? r.q30_payment_methods.join(', ') : 'Not provided'}
Refund Policy: ${r.q31_refund_policy || 'Not provided'}
${r.q32_refund_detail ? `Refund Detail: ${r.q32_refund_detail}` : ''}
Late Payment Interest: ${r.q33_late_payment_interest || 'Not provided'}
VAT Registered: ${r.q34_vat_registered || 'Not provided'}

PAYMENT PROTECTION DETAILS
============================
Late Payment Experience: ${r.pp1_late_payment_experience || 'Not provided'}
${r.pp2_late_payment_detail ? `Late Payment Detail: ${r.pp2_late_payment_detail}` : ''}
Deposit Percentage: ${r.pp3_deposit_percentage || 'Not provided'}
Deposit Refundable: ${r.pp4_deposit_non_refundable || 'Not provided'}
Invoice Due Days: ${r.pp5_invoice_due_days || 'Not provided'}
${r.pp6_invoice_due_custom ? `Custom Terms: ${r.pp6_invoice_due_custom}` : ''}
Late Payment Interest Preference: ${r.pp7_late_payment_interest || 'Not provided'}
Chargeback Experience: ${r.pp8_chargeback_experience || 'Not provided'}
${r.pp9_chargeback_detail ? `Chargeback Detail: ${r.pp9_chargeback_detail}` : ''}
Work Stoppage Policy: ${r.pp10_work_stoppage_policy || 'Not provided'}
${r.payment_protection_notes ? `Additional Notes: ${r.payment_protection_notes}` : ''}

Generate a thorough brief covering payment protection strategy, risk areas based on their history, and specific clauses needed. Flag any gaps with [NOT PROVIDED].`;
}

function buildCopyrightLicensingBriefPrompt(r: Record<string, any>): string {
  return `You are a professional business analyst creating a client brief for the COPYRIGHT & LICENSING PACK.

This brief will be used to generate 8 documents: Copyright Notice & IP Policy, Content Licensing Agreement, Image & Media Usage Rights, Work-for-Hire Agreement, Brand Usage Guidelines, Non-Disclosure Agreement (NDA), IP Assignment Agreement, and Cease & Desist Template.

BUSINESS IDENTITY
==================
Business Name: ${r.q2_business_name || 'Not provided'}
Legal Name: ${r.q1_legal_name || 'Not provided'}
Jurisdiction: ${r.q5_jurisdiction || 'Not provided'}
Business Type: ${r.q3_business_registered || 'Not provided'}

SERVICES OFFERED
=================
What They Do: ${r.q13_what_you_do || 'Not provided'}
Flagship Service: ${r.q14_flagship_service || 'Not provided'}

COPYRIGHT & LICENSING DETAILS
===============================
Deliverable Types: ${Array.isArray(r.cl1_deliverable_types) ? r.cl1_deliverable_types.join(', ') : 'Not provided'}
IP Ownership Preference: ${r.cl2_ip_ownership_preference || 'Not provided'}
${r.cl3_ip_ownership_detail ? `IP Ownership Detail: ${r.cl3_ip_ownership_detail}` : ''}
Licence Scope: ${Array.isArray(r.cl4_licence_scope) ? r.cl4_licence_scope.join(', ') : 'Not provided'}
Uses Third-Party Content: ${r.cl5_uses_third_party_content || 'Not provided'}
${r.cl6_third_party_detail ? `Third-Party Detail: ${r.cl6_third_party_detail}` : ''}
NDA Needed: ${r.cl7_nda_needed || 'Not provided'}
${r.cl8_nda_type ? `NDA Type: ${r.cl8_nda_type}` : ''}
Portfolio Right: ${r.cl9_portfolio_right || 'Not provided'}
IP Infringement Experience: ${r.cl10_ip_infringement_experience || 'Not provided'}
${r.cl11_infringement_detail ? `Infringement Detail: ${r.cl11_infringement_detail}` : ''}
${r.copyright_licensing_notes ? `Additional Notes: ${r.copyright_licensing_notes}` : ''}

Generate a thorough brief covering IP ownership strategy, licensing structure, NDA requirements, and brand protection needs. Flag any gaps with [NOT PROVIDED].`;
}

function buildGdprDeepBriefPrompt(r: Record<string, any>): string {
  return `You are a professional business analyst creating a client brief for the GDPR & DATA RETENTION DEEP PACK.

This brief will be used to generate 9 documents: Comprehensive Privacy Policy, Data Retention Schedule, Data Processing Agreement (DPA), Cookie Consent Implementation Guide, Subject Access Request Template, Data Breach Notification Template, Data Protection Impact Assessment (DPIA), Marketing Consent Management Procedures, and Third-Party Data Sharing Agreement.

BUSINESS IDENTITY
==================
Business Name: ${r.q2_business_name || 'Not provided'}
Legal Name: ${r.q1_legal_name || 'Not provided'}
Jurisdiction: ${r.q5_jurisdiction || 'Not provided'}
Email: ${r.q7_document_email || 'Not provided'}
Website: ${r.q10_website_url || 'Not provided'}

STANDARD GDPR (Foundation)
============================
Data Collected: ${Array.isArray(r.q36_data_collected) ? r.q36_data_collected.join(', ') : 'Not provided'}
Collection Method: ${Array.isArray(r.q37_data_collection_method) ? r.q37_data_collection_method.join(', ') : 'Not provided'}
Purpose: ${r.q38_data_purpose || 'Not provided'}
Storage: ${Array.isArray(r.q39_data_storage) ? r.q39_data_storage.join(', ') : 'Not provided'}
Retention: ${r.q40_data_retention || 'Not provided'}
Third-Party Tools: ${r.q41_uses_third_party_tools || 'Not provided'}
${r.q42_third_party_tools ? `Tools Detail: ${r.q42_third_party_tools}` : ''}
Shares Data: ${r.q43_shares_data || 'Not provided'}
${r.q44_data_sharing_detail ? `Sharing Detail: ${r.q44_data_sharing_detail}` : ''}
Sends Marketing: ${r.q45_sends_marketing || 'Not provided'}
Uses Cookies: ${r.q47_uses_cookies || 'Not provided'}
${r.q48_tracking_tools ? `Tracking Tools: ${Array.isArray(r.q48_tracking_tools) ? r.q48_tracking_tools.join(', ') : r.q48_tracking_tools}` : ''}

GDPR DEEP DETAILS
==================
Lawful Basis: ${Array.isArray(r.gd1_lawful_basis) ? r.gd1_lawful_basis.join(', ') : 'Not provided'}
Uses Data Processors: ${r.gd2_data_processor_relationships || 'Not provided'}
${r.gd3_processor_list ? `Processor List: ${r.gd3_processor_list}` : ''}
International Transfers: ${r.gd4_international_transfers || 'Not provided'}
${r.gd5_international_transfer_detail ? `Transfer Detail: ${r.gd5_international_transfer_detail}` : ''}
SAR Procedure: ${r.gd6_sar_procedure || 'Not provided'}
Breach Procedure: ${r.gd7_breach_procedure || 'Not provided'}
High-Risk Processing: ${Array.isArray(r.gd8_high_risk_processing) ? r.gd8_high_risk_processing.join(', ') : 'Not provided'}
Consent Management: ${r.gd9_consent_management || 'Not provided'}
Retention Clarity: ${r.gd10_retention_clarity || 'Not provided'}
${r.gdpr_deep_notes ? `Additional Notes: ${r.gdpr_deep_notes}` : ''}

Generate a thorough brief covering all GDPR compliance gaps, risk areas, and document requirements. Flag any gaps with [NOT PROVIDED].`;
}

function buildCoachBriefPrompt(r: Record<string, any>): string {
  return `You are a professional business analyst creating a client brief for the COACH INDUSTRY PACK.

This brief will be used to generate 7 industry-specific documents: Coaching Agreement, Session Terms & Cancellation Policy, Supervision Policy, CPD Tracker Template, Coaching Code of Ethics, Client Progress Tracker, and Testimonial Request Template.

BUSINESS IDENTITY
==================
Business Name: ${r.q2_business_name || 'Not provided'}
Legal Name: ${r.q1_legal_name || 'Not provided'}
First Name: ${r.q55_first_name || 'Not provided'}
Jurisdiction: ${r.q5_jurisdiction || 'Not provided'}
Email: ${r.q7_document_email || 'Not provided'}

BRAND & POSITIONING
====================
Business Story: ${r.q56_business_story || 'Not provided'}
Experience: ${r.q57_experience || 'Not provided'}
Differentiator: ${r.q61_differentiator || 'Not provided'}
Tone of Voice: ${Array.isArray(r.q62_tone_of_voice) ? r.q62_tone_of_voice.join(', ') : 'Not provided'}

COACHING PRACTICE DETAILS
===========================
Coaching Modality: ${Array.isArray(r.ic1_coaching_modality) ? r.ic1_coaching_modality.join(', ') : 'Not provided'}
Accreditation: ${Array.isArray(r.ic2_accreditation) ? r.ic2_accreditation.join(', ') : 'Not provided'}
Session Format: ${Array.isArray(r.ic3_session_format) ? r.ic3_session_format.join(', ') : 'Not provided'}
Session Length: ${r.ic4_session_length || 'Not provided'}
Programme Structure: ${r.ic5_programme_structure || 'Not provided'}
Programme Detail: ${r.ic6_programme_detail || 'Not provided'}
Supervision: ${r.ic7_supervision_arrangement || 'Not provided'}
Cancellation Notice: ${r.ic8_cancellation_policy || 'Not provided'}
Late Cancellation Fee: ${r.ic9_late_cancellation_fee || 'Not provided'}
Confidentiality Exceptions: ${r.ic10_confidentiality_exceptions || 'Not provided'}
${r.ic11_cpd_hours ? `CPD Hours: ${r.ic11_cpd_hours}` : ''}
${r.industry_coach_notes ? `Additional Notes: ${r.industry_coach_notes}` : ''}

Generate a thorough brief covering coaching practice specifics, ethical standards, supervision, and cancellation policies. Flag any gaps with [NOT PROVIDED].`;
}

function buildPhotographerBriefPrompt(r: Record<string, any>): string {
  return `You are a professional business analyst creating a client brief for the PHOTOGRAPHER INDUSTRY PACK.

This brief will be used to generate 7 industry-specific documents: Photography Licensing Agreement, Model Release Form, Shot List Template, Delivery Terms & Timeline Policy, Editing Brief Template, Print Release Form, and Event Photography Terms.

BUSINESS IDENTITY
==================
Business Name: ${r.q2_business_name || 'Not provided'}
Legal Name: ${r.q1_legal_name || 'Not provided'}
Jurisdiction: ${r.q5_jurisdiction || 'Not provided'}
Email: ${r.q7_document_email || 'Not provided'}

PHOTOGRAPHY PRACTICE DETAILS
==============================
Specialism: ${Array.isArray(r.ip1_photography_specialism) ? r.ip1_photography_specialism.join(', ') : 'Not provided'}
Client Types: ${Array.isArray(r.ip2_client_type) ? r.ip2_client_type.join(', ') : 'Not provided'}
Licensing Intent: ${r.ip3_licensing_intent || 'Not provided'}
Commercial Use: ${r.ip4_commercial_use || 'Not provided'}
Model Releases Needed: ${r.ip5_model_releases_needed || 'Not provided'}
Location Releases: ${r.ip6_location_releases || 'Not provided'}
Delivery Format: ${Array.isArray(r.ip7_delivery_format) ? r.ip7_delivery_format.join(', ') : 'Not provided'}
Delivery Timeline: ${r.ip8_delivery_timeline || 'Not provided'}
Editing Rounds: ${r.ip9_editing_rounds || 'Not provided'}
Event Cancellation Policy: ${r.ip10_event_cancellation || 'Not provided'}
Portfolio Usage: ${r.ip11_portfolio_usage || 'Not provided'}
${r.industry_photographer_notes ? `Additional Notes: ${r.industry_photographer_notes}` : ''}

Generate a thorough brief covering licensing structure, release requirements, delivery terms, and event-specific policies. Flag any gaps with [NOT PROVIDED].`;
}

function buildConsultantBriefPrompt(r: Record<string, any>): string {
  return `You are a professional business analyst creating a client brief for the CONSULTANT INDUSTRY PACK.

This brief will be used to generate 7 industry-specific documents: Consulting Agreement, Consultant NDA, Deliverables Specification, Milestone Tracking Template, Knowledge Transfer Protocol, Consultant Code of Conduct, and Engagement Closure Report.

BUSINESS IDENTITY
==================
Business Name: ${r.q2_business_name || 'Not provided'}
Legal Name: ${r.q1_legal_name || 'Not provided'}
Jurisdiction: ${r.q5_jurisdiction || 'Not provided'}
Email: ${r.q7_document_email || 'Not provided'}

CONSULTING PRACTICE DETAILS
=============================
Specialism: ${Array.isArray(r.con1_consulting_specialism) ? r.con1_consulting_specialism.join(', ') : 'Not provided'}
Engagement Model: ${r.con2_engagement_model || 'Not provided'}
Deliverable Types: ${Array.isArray(r.con3_deliverable_types) ? r.con3_deliverable_types.join(', ') : 'Not provided'}
Proprietary Methodology: ${r.con4_methodology || 'Not provided'}
${r.con5_methodology_detail ? `Methodology Detail: ${r.con5_methodology_detail}` : ''}
Knowledge Transfer: ${r.con6_knowledge_transfer || 'Not provided'}
Conflicts of Interest: ${r.con7_conflicts_of_interest || 'Not provided'}
Milestone Payments: ${r.con8_milestones || 'Not provided'}
Reporting Frequency: ${r.con9_reporting_frequency || 'Not provided'}
Acceptance Criteria: ${r.con10_acceptance_criteria || 'Not provided'}
${r.industry_consultant_notes ? `Additional Notes: ${r.industry_consultant_notes}` : ''}

Generate a thorough brief covering engagement structure, IP protection, milestone tracking, and knowledge handover. Flag any gaps with [NOT PROVIDED].`;
}

function buildContractorBriefPrompt(r: Record<string, any>): string {
  return `You are a professional business analyst creating a client brief for the CONTRACTOR INDUSTRY PACK.

This brief will be used to generate 8 industry-specific documents: Health & Safety Policy, Risk Assessment Template, Method Statement, COSHH Assessment, Construction Phase Plan, Subcontractor Agreement, Site Induction Checklist, and Defect Liability Template.

BUSINESS IDENTITY
==================
Business Name: ${r.q2_business_name || 'Not provided'}
Legal Name: ${r.q1_legal_name || 'Not provided'}
Jurisdiction: ${r.q5_jurisdiction || 'Not provided'}
Email: ${r.q7_document_email || 'Not provided'}

CONTRACTOR / TRADE DETAILS
============================
Trade Type: ${Array.isArray(r.ct1_trade_type) ? r.ct1_trade_type.join(', ') : 'Not provided'}
Work Environments: ${Array.isArray(r.ct2_work_environment) ? r.ct2_work_environment.join(', ') : 'Not provided'}
Workforce Structure: ${r.ct3_employees_subcontractors || 'Not provided'}
CDM Exposure: ${r.ct4_cdm_exposure || 'Not provided'}
Hazardous Substances: ${Array.isArray(r.ct5_hazardous_substances) ? r.ct5_hazardous_substances.join(', ') : 'Not provided'}
Height Working: ${r.ct6_height_working || 'Not provided'}
Plant & Equipment: ${Array.isArray(r.ct7_plant_equipment) ? r.ct7_plant_equipment.join(', ') : 'Not provided'}
Existing H&S Documentation: ${r.ct8_existing_hs_documentation || 'Not provided'}
Insurance: ${Array.isArray(r.ct9_insurance) ? r.ct9_insurance.join(', ') : 'Not provided'}
Defect Liability Period: ${r.ct10_defect_liability_period || 'Not provided'}
${r.ct11_specific_hazards ? `Specific Hazards: ${r.ct11_specific_hazards}` : ''}
${r.industry_contractor_notes ? `Additional Notes: ${r.industry_contractor_notes}` : ''}

Generate a thorough brief covering H&S compliance requirements, specific site hazards, CDM obligations, and subcontractor management. Flag any gaps with [NOT PROVIDED].`;
}

function buildBriefPrompt(responses: Record<string, any>, serviceId: string | null, websitePages: string[]): string {
  const r = responses || {};
  if (serviceId === 'business_foundations_pack') {
    return buildDocumentsBriefPrompt(r, websitePages);
  } else if (serviceId === 'social_media_pack') {
    return buildSocialMediaBriefPrompt(r);
  } else if (serviceId === 'website_copy_pack') {
    return buildWebsiteBriefPrompt(r, websitePages);
  } else if (serviceId === 'client_onboarding_pack') {
    return buildClientOnboardingBriefPrompt(r);
  } else if (serviceId === 'payment_protection_pack') {
    return buildPaymentProtectionBriefPrompt(r);
  } else if (serviceId === 'copyright_licensing_pack') {
    return buildCopyrightLicensingBriefPrompt(r);
  } else if (serviceId === 'gdpr_deep_pack') {
    return buildGdprDeepBriefPrompt(r);
  } else if (serviceId === 'coach_industry_pack') {
    return buildCoachBriefPrompt(r);
  } else if (serviceId === 'photographer_industry_pack') {
    return buildPhotographerBriefPrompt(r);
  } else if (serviceId === 'consultant_industry_pack') {
    return buildConsultantBriefPrompt(r);
  } else if (serviceId === 'contractor_industry_pack') {
    return buildContractorBriefPrompt(r);
  } else {
    return buildComprehensiveBriefPrompt(r, websitePages);
  }
}

async function callGemini(prompt: string, maxTokens: number = 8192): Promise<{ text: string; model: string; finishReason?: string }> {
  const model = "gemini-2.5-flash";
  console.log(`Calling Gemini API with model=${model}, prompt length=${prompt.length}, maxOutputTokens=${maxTokens}`);

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: maxTokens },
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

  if (req.method === "GET") {
    return successResponse({
      status: "generate-brief endpoint active",
      env: {
        hasSupabaseUrl: !!SUPABASE_URL,
        hasServiceRoleKey: !!SERVICE_ROLE_KEY,
        hasGeminiKey: !!GEMINI_API_KEY,
      },
    });
  }

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

    const { data: servicesData } = await adminQuery(
      "services_purchased", "website_pages_selected", { user_id, service_id: "website_copy_pack", status: "active" }
    );
    const websitePages = servicesData && Array.isArray(servicesData) && servicesData.length > 0
      ? (servicesData[0].website_pages_selected || [])
      : [];

    const briefPrompt = buildBriefPrompt(responses, service_id || null, websitePages);
    if (shouldDebug) {
      debugInfo.promptLength = briefPrompt.length;
      debugInfo.serviceId = service_id || null;
      debugInfo.websitePages = websitePages;
    }

    const maxTokens = service_id === 'business_foundations_pack' ? 16384 : 8192;
    let briefContent: string;
    let usedModel: string;
    try {
      const result = await callGemini(briefPrompt, maxTokens);
      briefContent = result.text;
      usedModel = result.model;
      if (shouldDebug) {
        debugInfo.finishReason = result.finishReason;
      }
    } catch (geminiErr) {
      const errMsg = geminiErr instanceof Error ? geminiErr.message : "Unknown Gemini error";
      console.error("Gemini call failed:", errMsg);

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
