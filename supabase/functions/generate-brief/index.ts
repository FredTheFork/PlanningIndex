import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { callGeminiWithFallback } from "../_shared/gemini-fallback.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY") || "";
const CHATZ_API_KEY = Deno.env.get("CHATZ_API_KEY") || "";

const CHATZ_MODEL = "glm-4.6";
const GEMINI_MODEL = "gemini-flash-latest";
const MAX_TOKENS = 16384;
const TEMPERATURE = 0.25;
const TIMEOUT_MS = 90000;

const S = {
  BUSINESS_IDENTITY: "BUSINESS IDENTITY",
  SERVICES_OFFERINGS: "SERVICES & OFFERINGS",
  CLIENT_PROFILE: "CLIENT PROFILE & RISK HISTORY",
  PRICING: "PRICING & COMMERCIAL TERMS",
  GDPR: "GDPR & DATA PROCESSING",
  LEGAL: "LEGAL & COMPLIANCE STATUS",
  BRAND_VOICE: "BRAND & VOICE",
  INVOICE: "INVOICE & FINANCIAL ADMIN",
  LINKEDIN: "LINKEDIN & SOCIAL PRESENCE",
  OPERATIONS: "OPERATIONS PACK SPECIFICS",
  COPYRIGHT_IP: "COPYRIGHT & IP SPECIFICS",
  GDPR_DEEP: "GDPR DEEP PACK SPECIFICS",
  INDUSTRY: "INDUSTRY-SPECIFIC DETAILS",
  RISK_FLAGS: "RISK FLAGS & ALERTS",
  AI_ENRICHMENTS: "AI ENRICHMENTS & RECOMMENDATIONS",
} as const;

const BASE_SECTIONS = [
  S.BUSINESS_IDENTITY, S.SERVICES_OFFERINGS, S.CLIENT_PROFILE, S.PRICING,
  S.GDPR, S.LEGAL, S.BRAND_VOICE, S.INVOICE, S.LINKEDIN,
  S.RISK_FLAGS, S.AI_ENRICHMENTS
];

const SECTION_MATRIX: Record<string, string[]> = {
  business_foundations_pack: BASE_SECTIONS,
  website_copy_pack: [S.BUSINESS_IDENTITY, S.SERVICES_OFFERINGS, S.BRAND_VOICE, S.LINKEDIN, S.RISK_FLAGS, S.AI_ENRICHMENTS],
  social_media_pack: [S.BUSINESS_IDENTITY, S.SERVICES_OFFERINGS, S.BRAND_VOICE, S.RISK_FLAGS, S.AI_ENRICHMENTS],
  client_onboarding_pack: [S.BUSINESS_IDENTITY, S.SERVICES_OFFERINGS, S.CLIENT_PROFILE, S.OPERATIONS, S.RISK_FLAGS, S.AI_ENRICHMENTS],
  payment_protection_pack: [S.BUSINESS_IDENTITY, S.PRICING, S.OPERATIONS, S.RISK_FLAGS, S.AI_ENRICHMENTS],
  copyright_licensing_pack: [S.BUSINESS_IDENTITY, S.SERVICES_OFFERINGS, S.LEGAL, S.COPYRIGHT_IP, S.RISK_FLAGS, S.AI_ENRICHMENTS],
  gdpr_deep_pack: [S.BUSINESS_IDENTITY, S.GDPR, S.GDPR_DEEP, S.RISK_FLAGS, S.AI_ENRICHMENTS],
  coach_industry_pack: [S.BUSINESS_IDENTITY, S.SERVICES_OFFERINGS, S.CLIENT_PROFILE, S.BRAND_VOICE, S.INDUSTRY, S.RISK_FLAGS, S.AI_ENRICHMENTS],
  photographer_industry_pack: [S.BUSINESS_IDENTITY, S.SERVICES_OFFERINGS, S.CLIENT_PROFILE, S.BRAND_VOICE, S.INDUSTRY, S.RISK_FLAGS, S.AI_ENRICHMENTS],
  consultant_industry_pack: [S.BUSINESS_IDENTITY, S.SERVICES_OFFERINGS, S.CLIENT_PROFILE, S.BRAND_VOICE, S.INDUSTRY, S.RISK_FLAGS, S.AI_ENRICHMENTS],
  contractor_industry_pack: [S.BUSINESS_IDENTITY, S.SERVICES_OFFERINGS, S.CLIENT_PROFILE, S.BRAND_VOICE, S.INDUSTRY, S.RISK_FLAGS, S.AI_ENRICHMENTS],
};

function getSectionsForService(serviceId: string | null, purchased: string[]): string[] {
  if (!serviceId) {
    const sections = [...BASE_SECTIONS];
    if (purchased.includes('client_onboarding_pack') || purchased.includes('payment_protection_pack')) {
      if (!sections.includes(S.OPERATIONS)) sections.splice(sections.indexOf(S.RISK_FLAGS), 0, S.OPERATIONS);
    }
    if (purchased.includes('copyright_licensing_pack')) {
      if (!sections.includes(S.COPYRIGHT_IP)) sections.splice(sections.indexOf(S.RISK_FLAGS), 0, S.COPYRIGHT_IP);
    }
    if (purchased.includes('gdpr_deep_pack')) {
      if (!sections.includes(S.GDPR_DEEP)) sections.splice(sections.indexOf(S.RISK_FLAGS), 0, S.GDPR_DEEP);
    }
    const industry = purchased.find(id => ['coach_industry_pack','photographer_industry_pack','consultant_industry_pack','contractor_industry_pack'].includes(id));
    if (industry && !sections.includes(S.INDUSTRY)) {
      sections.splice(sections.indexOf(S.RISK_FLAGS), 0, S.INDUSTRY);
    }
    return sections;
  }
  return SECTION_MATRIX[serviceId] || BASE_SECTIONS;
}

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
  return { data: await res.json(), error: null };
}

async function adminUpdate(table: string, id: string, data: Record<string, unknown>) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${id}`, {
    method: "PATCH",
    headers: {
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) console.error(`Admin update ${table} failed: ${res.status} ${await res.text()}`);
}

async function adminInsert(table: string, data: Record<string, unknown>) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: "POST",
    headers: {
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    console.error(`Admin insert ${table} failed: ${res.status} ${await res.text()}`);
    return null;
  }
  return await res.json();
}

async function trackUsage(table: string, model: string, tokenCount: number = 0) {
  const today = new Date().toISOString().split('T')[0];
  try {
    const { data: existing } = await adminQuery(table, "id,request_count,token_count", { request_date: today, model });
    if (existing && Array.isArray(existing) && existing.length > 0) {
      const row = existing[0];
      await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${row.id}`, {
        method: "PATCH",
        headers: { apikey: SERVICE_ROLE_KEY, Authorization: `Bearer ${SERVICE_ROLE_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({ request_count: (row.request_count || 0) + 1, token_count: (row.token_count || 0) + tokenCount, last_used_at: new Date().toISOString() }),
      });
    } else {
      await adminInsert(table, { model, request_date: today, request_count: 1, token_count: tokenCount, last_used_at: new Date().toISOString() });
    }
  } catch (err) {
    console.error(`Failed to track ${table} usage:`, err);
  }
}

interface AIResult {
  text: string;
  model: string;
  provider: 'chatz' | 'fallback_gemini';
  tokenCount: number;
}

async function callChatzAI(prompt: string, systemPrompt: string): Promise<AIResult> {
  const body = JSON.stringify({
    model: CHATZ_MODEL,
    messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: prompt }],
    max_tokens: MAX_TOKENS,
    temperature: TEMPERATURE,
  });
  const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${CHATZ_API_KEY}` };

  for (let attempt = 1; attempt <= 2; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      const response = await fetch('https://api.z.ai/api/paas/v4/chat/completions', {
        method: 'POST', headers, body, signal: controller.signal,
      });
      clearTimeout(timeout);
      if (!response.ok) {
        const errText = await response.text();
        let errCode = '';
        try { errCode = JSON.parse(errText)?.error?.code || ''; } catch {}
        console.error(`Chatz API error ${response.status} (code ${errCode}): ${errText.substring(0, 400)}`);
        if (attempt === 1 && (response.status === 429 || response.status >= 500)) {
          console.warn(`Chatz transient error (attempt ${attempt}), retrying in 3s...`);
          await new Promise(r => setTimeout(r, 3000));
          continue;
        }
        throw new Error(`Chatz API ${response.status} (code ${errCode}): ${errText.substring(0, 400)}`);
      }
      const data = await response.json();
      const text = data.choices?.[0]?.message?.content;
      if (!text) throw new Error('Chatz returned empty content');
      const tokenCount = data.usage?.total_tokens || 0;
      await trackUsage("chatz_api_usage", CHATZ_MODEL, tokenCount);
      return { text, model: `chatz-${CHATZ_MODEL}`, provider: 'chatz', tokenCount };
    } catch (e) {
      clearTimeout(timeout);
      if (attempt === 2) throw e;
      if (e instanceof Error && e.name === 'AbortError') {
        console.warn('Chatz request timed out on attempt 1, retrying...');
        continue;
      }
      throw e;
    }
  }
  throw new Error('Chatz API exhausted retries');
}

async function callGeminiAI(prompt: string, systemPrompt: string): Promise<AIResult> {
  const result = await callGeminiWithFallback({
    prompt,
    systemPrompt,
    apiKey: GEMINI_API_KEY,
    temperature: TEMPERATURE,
    maxOutputTokens: MAX_TOKENS,
    timeoutMs: TIMEOUT_MS,
    preferredModel: GEMINI_MODEL,
    onUsage: (model, tokenCount) => trackUsage("gemini_api_usage", model, tokenCount),
  });
  return { text: result.text, model: `gemini-${result.model}`, provider: 'fallback_gemini', tokenCount: result.tokenCount };
}

async function generateWithAI(prompt: string, systemPrompt: string): Promise<AIResult & { chatzError?: string }> {
  if (CHATZ_API_KEY) {
    try {
      console.log('Attempting chat.z.ai...');
      const result = await callChatzAI(prompt, systemPrompt);
      return { ...result, provider: 'chatz' };
    } catch (e) {
      const errMsg = e instanceof Error ? e.message : String(e);
      console.warn(`Chatz failed: ${errMsg} — falling back to Gemini`);
      if (!GEMINI_API_KEY) throw new Error(`Chatz failed (${errMsg}) and no GEMINI_API_KEY fallback available`);
      console.log('Using Gemini fallback...');
      const geminiResult = await callGeminiAI(prompt, systemPrompt);
      return { ...geminiResult, chatzError: errMsg };
    }
  } else {
    console.warn('CHATZ_API_KEY not set — using Gemini directly');
  }
  if (!GEMINI_API_KEY) throw new Error('Both CHATZ_API_KEY and GEMINI_API_KEY are missing');
  console.log('Using Gemini fallback...');
  return await callGeminiAI(prompt, systemPrompt);
}

const SYSTEM_PROMPT = `You are an expert UK business document specialist creating a comprehensive client brief for a UK sole trader. This brief will be used to create professional legal documents, website copy, and social media content.

CRITICAL INSTRUCTIONS:
1. Output EXACTLY the requested sections in order, each preceded by "=== SECTION NAME ===" on its own line
2. Be specific and factual — use exact details from the intake responses
3. Write in third person about the client (e.g. "The client operates as...")
4. All legal references must be UK-specific (England & Wales / Scotland / Northern Ireland as applicable)
5. Do NOT invent information — only use what is provided; flag gaps as "Not specified"
6. Each section 150-400 words. Risk Flags section: list ALL identified risks
7. AI Enrichments section: include concrete elevator pitch draft, LinkedIn headline, and cross-sell recommendations
8. Format Risk Flags as: SEVERITY (HIGH/MEDIUM/LOW) — CATEGORY (Legal/Financial/GDPR/Operational) — Risk: [description] — Recommendation: [action]

Do not add any formatting, markdown, or commentary outside the === SECTION === blocks.`;

function a(r: Record<string, any>, key: string, label: string, isArray = false): string {
  const val = r[key];
  if (val === undefined || val === null || val === '') return '';
  const display = (isArray && Array.isArray(val)) ? val.join(', ') : (typeof val === 'object' && !Array.isArray(val) ? JSON.stringify(val) : String(val));
  if (!display) return '';
  return `${label}: ${display}\n`;
}

function buildIntakeData(r: Record<string, any>, sections: string[], serviceId: string | null, websitePages: string[]): string {
  const lines: string[] = [];

  if (sections.includes(S.BUSINESS_IDENTITY)) {
    lines.push('### BUSINESS IDENTITY');
    lines.push(a(r,'q1_legal_name','Legal Name')+a(r,'q2_business_name','Business Name')+a(r,'q3_business_registered','Registration')+a(r,'q4_companies_house','Companies House')+a(r,'q5_jurisdiction','Jurisdiction')+a(r,'q6_business_address','Address')+a(r,'q7_document_email','Document Email')+a(r,'q8_business_phone','Phone'));
    lines.push(`Website: ${r.q9_has_website || 'Not provided'}${r.q10_website_url ? ` — ${r.q10_website_url}` : ''}`);
    lines.push(a(r,'q11_social_platforms','Social Platforms',true)+'');
  }

  if (sections.includes(S.SERVICES_OFFERINGS)) {
    lines.push('### SERVICES & OFFERINGS');
    lines.push(a(r,'q13_what_you_do','What They Do')+a(r,'q14_flagship_service','Flagship Service'));
    if (Array.isArray(r.q15_services)) {
      lines.push('Services Detail:');
      r.q15_services.forEach((s: any, i: number) => {
        lines.push(`  ${i+1}. ${s.service_name || 'Service'}\n     Includes: ${s.service_includes||'Not specified'}\n     Excludes: ${s.service_excludes||'Not specified'}\n     Client Provides: ${s.service_client_provides||'Not specified'}\n     Timeline: ${s.service_timeline||'Not specified'}\n     Outcome: ${s.service_outcome||'Not specified'}${s.service_starting_price?`\n     Starting Price: ${s.service_starting_price}`:''}`);
      });
    }
    lines.push(a(r,'q16_uses_subcontractors','Uses Subcontractors')+a(r,'q17_inform_subcontractors','Inform Clients')+a(r,'q18_sends_proposal','Sends Proposal')+'');
  }

  if (sections.includes(S.CLIENT_PROFILE)) {
    lines.push('### CLIENT PROFILE & RISK HISTORY');
    lines.push(a(r,'q19_client_type','Client Type')+a(r,'q20_ideal_client','Ideal Client')+a(r,'q21_client_industries','Industries')+a(r,'q22_client_issues','Issues Experienced',true)+a(r,'q23_dispute_details','Dispute Details')+a(r,'q24_client_concerns','Concerns')+'');
  }

  if (sections.includes(S.PRICING)) {
    lines.push('### PRICING & COMMERCIAL TERMS');
    lines.push(a(r,'q25_pricing_model','Pricing Model',true)+a(r,'q26_payment_terms','Payment Terms')+a(r,'q27_payment_detail','Payment Detail')+a(r,'q28_requires_deposit','Deposit Required')+a(r,'q29_deposit_detail','Deposit Detail')+a(r,'q30_payment_methods','Payment Methods',true)+a(r,'q31_refund_policy','Refund Policy')+a(r,'q32_refund_detail','Refund Detail')+a(r,'q33_late_payment_interest','Late Payment Interest')+a(r,'q34_vat_registered','VAT Registered')+a(r,'q35_vat_number','VAT Number')+'');
  }

  if (sections.includes(S.GDPR)) {
    lines.push('### GDPR & DATA PROCESSING');
    lines.push(a(r,'q36_data_collected','Data Collected',true)+a(r,'q37_data_collection_method','Collection Method',true)+a(r,'q38_data_purpose','Purpose')+a(r,'q39_data_storage','Storage',true)+a(r,'q40_data_retention','Retention')+a(r,'q41_uses_third_party_tools','Third-Party Tools')+a(r,'q42_third_party_tools','Tools Detail')+a(r,'q43_shares_data','Shares Data')+a(r,'q44_data_sharing_detail','Sharing Detail')+a(r,'q45_sends_marketing','Sends Marketing')+a(r,'q46_marketing_platform','Marketing Platform')+a(r,'q47_uses_cookies','Uses Cookies')+a(r,'q48_tracking_tools','Tracking Tools',true)+'');
  }

  if (sections.includes(S.LEGAL)) {
    lines.push('### LEGAL & COMPLIANCE STATUS');
    lines.push(a(r,'q49_regulated_services','Regulated Services')+a(r,'q50_regulatory_detail','Regulatory Detail')+a(r,'q51_indemnity_insurance','Indemnity Insurance')+a(r,'q52_certifications','Certifications')+a(r,'q53_specific_clauses','Specific Clauses')+a(r,'q54_exclusions','Exclusions')+'');
  }

  if (sections.includes(S.BRAND_VOICE)) {
    lines.push('### BRAND & VOICE');
    lines.push(a(r,'q55_first_name','First Name')+a(r,'q56_business_story','Business Story')+a(r,'q57_experience','Experience')+a(r,'q58_achievements','Achievements')+a(r,'q59_client_compliments','Compliments')+a(r,'q60_12_month_goal','12 Month Goal')+a(r,'q61_differentiator','Differentiator')+a(r,'q62_tone_of_voice','Tone of Voice',true)+a(r,'q63_avoid_words','Avoid Words')+a(r,'q64_brand_identity','Brand Identity')+a(r,'q65_has_logo','Has Logo')+a(r,'q67_brand_colours','Brand Colours')+a(r,'q68_visual_style','Visual Style')+'');
  }

  if (sections.includes(S.INVOICE)) {
    lines.push('### INVOICE & FINANCIAL ADMIN');
    lines.push(a(r,'q69_bank_details','Bank Details')+a(r,'q70_invoice_due_date','Invoice Due Date')+a(r,'q71_invoice_fields','Invoice Fields',true)+'');
  }

  if (sections.includes(S.LINKEDIN)) {
    lines.push('### LINKEDIN & SOCIAL PRESENCE');
    lines.push(a(r,'q72_linkedin_usage','LinkedIn Usage')+a(r,'q73_linkedin_url','LinkedIn URL')+a(r,'q74_linkedin_target','Target')+a(r,'q75_linkedin_keywords','Keywords')+'');
  }

  if (sections.includes(S.OPERATIONS)) {
    lines.push('### OPERATIONS PACK SPECIFICS');
    // Onboarding
    lines.push(a(r,'co1_onboarding_style','Onboarding Style')+a(r,'co2_onboarding_pain_points','Pain Points')+a(r,'co3_scope_creep_experience','Scope Creep Experience')+a(r,'co4_scope_creep_detail','Scope Creep Detail')+a(r,'co5_communication_channels','Communication Channels',true)+a(r,'co6_response_time_expectation','Response Time')+a(r,'co7_client_provides','Client Must Provide')+a(r,'co8_kickoff_format','Kickoff Format')+a(r,'co9_revision_policy','Revision Policy')+a(r,'co10_closing_process','Closing Process'));
    // Payment protection
    lines.push(a(r,'pp1_late_payment_experience','Late Payment Experience')+a(r,'pp2_late_payment_detail','Late Payment Detail')+a(r,'pp3_deposit_percentage','Deposit Percentage')+a(r,'pp4_deposit_non_refundable','Deposit Refundable')+a(r,'pp5_invoice_due_days','Invoice Due Days')+a(r,'pp7_late_payment_interest','Late Payment Interest Pref')+a(r,'pp8_chargeback_experience','Chargeback Experience')+a(r,'pp9_chargeback_detail','Chargeback Detail')+a(r,'pp10_work_stoppage_policy','Work Stoppage Policy')+'');
  }

  if (sections.includes(S.COPYRIGHT_IP)) {
    lines.push('### COPYRIGHT & IP SPECIFICS');
    lines.push(a(r,'cl1_deliverable_types','Deliverable Types',true)+a(r,'cl2_ip_ownership_preference','IP Ownership Preference')+a(r,'cl3_ip_ownership_detail','IP Ownership Detail')+a(r,'cl4_licence_scope','Licence Scope',true)+a(r,'cl5_uses_third_party_content','Uses Third-Party Content')+a(r,'cl6_third_party_detail','Third-Party Detail')+a(r,'cl7_nda_needed','NDA Needed')+a(r,'cl8_nda_type','NDA Type')+a(r,'cl9_portfolio_right','Portfolio Right')+a(r,'cl10_ip_infringement_experience','IP Infringement Experience')+a(r,'cl11_infringement_detail','Infringement Detail')+'');
  }

  if (sections.includes(S.GDPR_DEEP)) {
    lines.push('### GDPR DEEP PACK SPECIFICS');
    lines.push(a(r,'gd1_lawful_basis','Lawful Basis',true)+a(r,'gd2_data_processor_relationships','Uses Data Processors')+a(r,'gd3_processor_list','Processor List')+a(r,'gd4_international_transfers','International Transfers')+a(r,'gd5_international_transfer_detail','Transfer Detail')+a(r,'gd6_sar_procedure','SAR Procedure')+a(r,'gd7_breach_procedure','Breach Procedure')+a(r,'gd8_high_risk_processing','High-Risk Processing',true)+a(r,'gd9_consent_management','Consent Management')+a(r,'gd10_retention_clarity','Retention Clarity')+'');
  }

  if (sections.includes(S.INDUSTRY)) {
    lines.push('### INDUSTRY-SPECIFIC DETAILS');
    // Coach
    lines.push(a(r,'ic1_coaching_modality','Coaching Modality',true)+a(r,'ic2_accreditation','Accreditation',true)+a(r,'ic3_session_format','Session Format',true)+a(r,'ic4_session_length','Session Length')+a(r,'ic5_programme_structure','Programme Structure')+a(r,'ic6_programme_detail','Programme Detail')+a(r,'ic7_supervision_arrangement','Supervision')+a(r,'ic8_cancellation_policy','Cancellation Notice')+a(r,'ic9_late_cancellation_fee','Late Cancellation Fee')+a(r,'ic10_confidentiality_exceptions','Confidentiality Exceptions')+a(r,'ic11_cpd_hours','CPD Hours'));
    // Photographer
    lines.push(a(r,'ip1_photography_specialism','Photography Specialism',true)+a(r,'ip2_client_type','Client Types',true)+a(r,'ip3_licensing_intent','Licensing Intent')+a(r,'ip4_commercial_use','Commercial Use')+a(r,'ip5_model_releases_needed','Model Releases')+a(r,'ip6_location_releases','Location Releases')+a(r,'ip7_delivery_format','Delivery Format',true)+a(r,'ip8_delivery_timeline','Delivery Timeline')+a(r,'ip9_editing_rounds','Editing Rounds')+a(r,'ip10_event_cancellation','Event Cancellation Policy')+a(r,'ip11_portfolio_usage','Portfolio Usage'));
    // Consultant
    lines.push(a(r,'con1_consulting_specialism','Consulting Specialism',true)+a(r,'con2_engagement_model','Engagement Model')+a(r,'con3_deliverable_types','Deliverable Types',true)+a(r,'con4_methodology','Methodology')+a(r,'con5_methodology_detail','Methodology Detail')+a(r,'con6_knowledge_transfer','Knowledge Transfer')+a(r,'con7_conflicts_of_interest','Conflicts of Interest')+a(r,'con8_milestones','Milestone Payments')+a(r,'con9_reporting_frequency','Reporting Frequency')+a(r,'con10_acceptance_criteria','Acceptance Criteria'));
    // Contractor
    lines.push(a(r,'ct1_trade_type','Trade Type',true)+a(r,'ct2_work_environment','Work Environments',true)+a(r,'ct3_employees_subcontractors','Workforce Structure')+a(r,'ct4_cdm_exposure','CDM Exposure')+a(r,'ct5_hazardous_substances','Hazardous Substances',true)+a(r,'ct6_height_working','Working at Height')+a(r,'ct7_plant_equipment','Plant & Equipment',true)+a(r,'ct8_existing_hs_documentation','Existing H&S Documentation')+a(r,'ct9_insurance','Insurance',true)+a(r,'ct10_defect_liability_period','Defect Liability Period')+a(r,'ct11_specific_hazards','Specific Hazards')+'');
  }

  if (serviceId === 'website_copy_pack' || websitePages.length > 0) {
    lines.push('### WEBSITE COPY SPECIFICS');
    lines.push(`Pages Ordered: ${websitePages.length > 0 ? websitePages.join(', ') : 'Not specified'}`);
    lines.push(a(r,'wc2_primary_action','Primary Action')+a(r,'wc3_inspiration_urls','Inspiration URLs')+a(r,'wc_nav_structure','Navigation Structure')+a(r,'wc_hero_message','Hero Message')+a(r,'wc_problems_solved','Problems Solved')+a(r,'wc_imagery_style','Imagery Style')+a(r,'wc_colour_preferences','Colour Preferences')||a(r,'q67_brand_colours','Colour Preferences')+a(r,'wc_font_style','Font Style')+'');
  }

  if (serviceId === 'social_media_pack') {
    lines.push('### SOCIAL MEDIA SPECIFICS');
    lines.push(a(r,'sm1_platforms','Platforms',true)+a(r,'sm2_content_types','Content Types',true)+a(r,'sm3_avoid_topics','Topics to Avoid')+a(r,'sm4_posting_frequency','Posting Frequency')+a(r,'sm5_content_pillars','Content Pillars')+a(r,'sm7_hashtag_strategy','Hashtag Strategy')+a(r,'sm9_content_tone','Content Tone')+a(r,'sm10_call_to_action','Preferred CTA')+a(r,'sm13_upcoming_launches','Upcoming Launches')+'');
  }

  if (r.q78_anything_else) {
    lines.push('### ADDITIONAL INFORMATION');
    lines.push(`Anything Else: ${r.q78_anything_else}\n`);
  }

  return lines.join('\n');
}

function buildPrompt(responses: Record<string, any>, serviceId: string | null, purchased: string[], sections: string[], websitePages: string[]): string {
  return `## CLIENT INTAKE DATA

Business: ${responses.q2_business_name || 'Not provided'} (${responses.q1_legal_name || 'Not provided'})
Jurisdiction: ${responses.q5_jurisdiction || 'England & Wales'}
Services Purchased: ${purchased.join(', ')}
${serviceId ? `Brief Type: Service-specific brief for: ${serviceId}` : 'Brief Type: Comprehensive brief (all services)'}

---

## RAW INTAKE RESPONSES

${buildIntakeData(responses, sections, serviceId, websitePages)}

---

## SECTIONS TO GENERATE

Generate the following sections IN ORDER, each starting on its own line with exactly this header format:

${sections.map(s => `=== ${s} ===`).join('\n')}

CRITICAL: Generate ALL sections listed above. Use exact headers shown. Include elevator pitch and cross-sell recommendations in the AI Enrichments section.`;
}

function detectRiskLevel(content: string): 'Low' | 'Medium' | 'High' {
  const match = content.match(/=== RISK FLAGS & ALERTS ===([\s\S]*?)(?==== |$)/);
  if (!match) return 'Low';
  const upper = match[1].toUpperCase();
  if (upper.includes('HIGH')) return 'High';
  if ((upper.match(/\bMEDIUM\b/g) || []).length >= 2) return 'Medium';
  return 'Low';
}

function countWords(content: string): number {
  return content.split(/\s+/).filter(w => w.length > 0).length;
}

function extractSections(content: string): string[] {
  return (content.match(/=== .+? ===/g) || []).map(m => m.replace(/^=== | ===$/g, ''));
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 200, headers: corsHeaders });

  if (req.method === "GET") {
    return successResponse({
      status: "generate-brief endpoint active",
      env: { hasSupabaseUrl: !!SUPABASE_URL, hasServiceRoleKey: !!SERVICE_ROLE_KEY, hasGeminiKey: !!GEMINI_API_KEY, hasChatzKey: !!CHATZ_API_KEY },
    });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) return errorResponse(401, "Missing auth token");

    const token = authHeader.replace("Bearer ", "");
    const isServiceRole = token === SERVICE_ROLE_KEY;

    if (!isServiceRole) {
      const userRes = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
        headers: { apikey: SERVICE_ROLE_KEY, Authorization: `Bearer ${token}` },
      });
      if (!userRes.ok) return errorResponse(401, "Invalid token");
      const user = await userRes.json();
      const { data: adminCheck } = await adminQuery("admin_users", "id", { user_id: user.id });
      if ((!adminCheck || !Array.isArray(adminCheck) || adminCheck.length === 0) && user.email !== 'foundationarybusiness@gmail.com') {
        return errorResponse(403, "Admin access required");
      }
    }

    const body = await req.json();
    const { user_id, service_id, debug } = body as { user_id?: string; service_id?: string; debug?: boolean };
    if (!user_id) return errorResponse(400, "Missing user_id");
    if (!GEMINI_API_KEY && !CHATZ_API_KEY) return errorResponse(500, "No AI API keys configured");

    const shouldDebug = debug === true;
    const debugInfo: Record<string, unknown> = {};
    const startTime = Date.now();

    const { data: intakeData, error: intakeError } = await adminQuery("intake_responses", "responses,purchased_service_ids,submitted_at", { user_id });
    if (intakeError) return errorResponse(500, "Failed to fetch intake data", { intakeError });
    if (!intakeData || !Array.isArray(intakeData) || intakeData.length === 0) return errorResponse(404, "No intake data found for this client");

    const intake = intakeData[0];
    if (!intake.submitted_at) return errorResponse(400, "Intake not yet submitted");

    const responses = intake.responses || {};
    const purchased: string[] = intake.purchased_service_ids || ["business_foundations_pack"];
    const sections = getSectionsForService(service_id || null, purchased);

    const { data: servicesData } = await adminQuery("services_purchased", "website_pages_selected", { user_id, service_id: "website_copy_pack", status: "active" });
    const websitePages = servicesData && Array.isArray(servicesData) && servicesData.length > 0 ? (servicesData[0].website_pages_selected || []) : [];

    if (shouldDebug) {
      debugInfo.sections = sections;
      debugInfo.serviceId = service_id || null;
      debugInfo.purchasedServiceIds = purchased;
    }

    // Get existing brief for versioning
    const briefFilter = service_id ? `client_id=eq.${user_id}&service_id=eq.${service_id}` : `client_id=eq.${user_id}&service_id=is.null`;
    const existingRes = await fetch(`${SUPABASE_URL}/rest/v1/client_briefs?select=id,version&${briefFilter}`, {
      headers: { apikey: SERVICE_ROLE_KEY, Authorization: `Bearer ${SERVICE_ROLE_KEY}` },
    });
    const existingBrief = existingRes.ok ? await existingRes.json() : [];
    const existingId: string | null = Array.isArray(existingBrief) && existingBrief.length > 0 ? existingBrief[0].id : null;
    const version = Array.isArray(existingBrief) && existingBrief.length > 0 ? (existingBrief[0].version || 1) + 1 : 1;
    const generationStartedAt = new Date().toISOString();

    if (existingId) {
      await adminUpdate("client_briefs", existingId, {
        status: "generating", version, brief_content: null, error_message: null,
        generated_at: null, model_used: null, provider: null, risk_level: null,
        generation_started_at: generationStartedAt, generation_completed_at: null, generation_duration_ms: null,
      });
    } else {
      const inserted = await adminInsert("client_briefs", {
        client_id: user_id, service_id: service_id || null, status: "generating", version: 1, generation_started_at: generationStartedAt,
      });
      if (inserted && Array.isArray(inserted) && inserted.length > 0) {
        // existingId will still be null, we'll look it up after generation
      }
    }

    const prompt = buildPrompt(responses, service_id || null, purchased, sections, websitePages);
    if (shouldDebug) debugInfo.promptLength = prompt.length;

    let aiResult: AIResult;
    try {
      aiResult = await generateWithAI(prompt, SYSTEM_PROMPT);
    } catch (aiError) {
      const errMsg = aiError instanceof Error ? aiError.message : "Unknown AI error";
      console.error("AI generation failed:", errMsg);
      const completedAt = new Date().toISOString();
      const failData = { status: "failed", error_message: errMsg, generation_completed_at: completedAt };
      if (existingId) {
        await adminUpdate("client_briefs", existingId, failData);
      } else {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/client_briefs?select=id&${briefFilter}`, {
          headers: { apikey: SERVICE_ROLE_KEY, Authorization: `Bearer ${SERVICE_ROLE_KEY}` },
        });
        const rows = res.ok ? await res.json() : [];
        if (Array.isArray(rows) && rows.length > 0) await adminUpdate("client_briefs", rows[0].id, failData);
      }
      return errorResponse(502, `AI generation failed: ${errMsg}`, shouldDebug ? debugInfo : undefined);
    }

    const riskLevel = detectRiskLevel(aiResult.text);
    const wordCount = countWords(aiResult.text);
    const sectionsGenerated = extractSections(aiResult.text);
    const generationDurationMs = Date.now() - startTime;
    const generationCompletedAt = new Date().toISOString();

    const briefUpdate = {
      brief_content: aiResult.text,
      status: "completed",
      model_used: aiResult.model,
      provider: aiResult.provider,
      risk_level: riskLevel,
      generated_at: generationCompletedAt,
      generation_completed_at: generationCompletedAt,
      generation_duration_ms: generationDurationMs,
      word_count: wordCount,
      token_count: aiResult.tokenCount,
      sections_generated: JSON.stringify(sectionsGenerated),
    };

    if (existingId) {
      await adminUpdate("client_briefs", existingId, briefUpdate);
    } else {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/client_briefs?select=id&${briefFilter}`, {
        headers: { apikey: SERVICE_ROLE_KEY, Authorization: `Bearer ${SERVICE_ROLE_KEY}` },
      });
      const rows = res.ok ? await res.json() : [];
      if (Array.isArray(rows) && rows.length > 0) await adminUpdate("client_briefs", rows[0].id, briefUpdate);
    }

    if (shouldDebug) Object.assign(debugInfo, { provider: aiResult.provider, model: aiResult.model, riskLevel, wordCount, sectionsGenerated, generationDurationMs, chatzError: (aiResult as any).chatzError });

    return successResponse({
      success: true,
      brief_content: aiResult.text,
      model: aiResult.model,
      provider: aiResult.provider,
      version,
      risk_level: riskLevel,
      word_count: wordCount,
      sections_generated: sectionsGenerated,
      generation_duration_ms: generationDurationMs,
      generated_at: generationCompletedAt,
      ...(shouldDebug ? { debug: debugInfo } : {}),
    });

  } catch (err) {
    console.error("generate-brief error:", err);
    return errorResponse(500, "Internal server error", { message: err instanceof Error ? err.message : "Unknown error" });
  }
});
