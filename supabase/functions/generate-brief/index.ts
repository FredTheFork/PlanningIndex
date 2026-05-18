import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.49.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

// ── Model Configuration ──
// Primary model: gemini-2.5-flash (higher quality, ~500 RPD free tier)
// Fallback model: gemini-3-flash-preview (also free tier, separate quota)
// When 2.5 Flash hits its daily limit, we automatically switch to 3 Flash.
// At midnight UTC each day, counts reset and we switch back to 2.5 Flash.

const PRIMARY_MODEL = 'gemini-2.5-flash';
const FALLBACK_MODEL = 'gemini-3-flash-preview';

// Threshold: switch to fallback after this many requests to the primary model
const PRIMARY_DAILY_LIMIT = 18;

function formatValue(val: any): string {
  if (val === undefined || val === null || val === '') return 'Not provided';
  if (typeof val === 'string') return val;
  if (Array.isArray(val)) {
    if (val.length === 0) return 'Not provided';
    return val.map(v => typeof v === 'object' ? JSON.stringify(v) : String(v)).join('\n');
  }
  if (typeof val === 'object') return JSON.stringify(val, null, 2);
  return String(val);
}

function buildStructuredData(r: Record<string, any>, notes: Record<string, string>): string {
  const sections: string[] = [];

  // Section 1: Business Identity
  sections.push(`=== BUSINESS IDENTITY ===
Legal Name: ${formatValue(r.q1_legal_name)}
Business/Trading Name: ${formatValue(r.q2_business_name)}
Business Registration: ${formatValue(r.q3_business_registered)}
Companies House No: ${formatValue(r.q4_companies_house)}
Jurisdiction: ${formatValue(r.q5_jurisdiction)}
Business Address: ${formatValue(r.q6_business_address)}
Document Email: ${formatValue(r.q7_document_email)}
Business Phone: ${formatValue(r.q8_business_phone)}
Website Status: ${formatValue(r.q9_has_website)}
Website URL: ${formatValue(r.q10_website_url)}
Social Platforms: ${formatValue(r.q11_social_platforms)}
Social Links: ${formatValue(r.q12_social_links)}`);

  // Section 2: Services
  const services = r.q15_services;
  let servicesText = '';
  if (Array.isArray(services) && services.length > 0) {
    servicesText = services.map((s: any, i: number) => {
      const sub: string[] = [];
      sub.push(`  Service ${i + 1}:`);
      if (s.service_name) sub.push(`    Name: ${s.service_name}`);
      if (s.service_includes) sub.push(`    Includes: ${s.service_includes}`);
      if (s.service_excludes) sub.push(`    Excludes: ${s.service_excludes}`);
      if (s.service_client_provides) sub.push(`    Client Provides: ${s.service_client_provides}`);
      if (s.service_timeline) sub.push(`    Timeline: ${s.service_timeline}`);
      if (s.service_outcome) sub.push(`    Outcome: ${s.service_outcome}`);
      if (s.service_starting_price) sub.push(`    Starting Price: ${s.service_starting_price}`);
      return sub.join('\n');
    }).join('\n');
  } else {
    servicesText = formatValue(services);
  }

  sections.push(`=== SERVICES ===
What They Do: ${formatValue(r.q13_what_you_do)}
Flagship Service: ${formatValue(r.q14_flagship_service)}
Service Details:
${servicesText}
Uses Subcontractors: ${formatValue(r.q16_uses_subcontractors)}
${r.q16_uses_subcontractors === 'Yes' ? `Inform Clients About Subcontractors: ${formatValue(r.q17_inform_subcontractors)}` : ''}
Sends Proposal Before Engagement: ${formatValue(r.q18_sends_proposal)}`);

  // Section 3: Clients
  sections.push(`=== CLIENTS & HOW THEY WORK ===
Client Type: ${formatValue(r.q19_client_type)}
Ideal Client: ${formatValue(r.q20_ideal_client)}
Client Industries: ${formatValue(r.q21_client_industries)}
Past Client Issues: ${formatValue(r.q22_client_issues)}
Dispute Details: ${formatValue(r.q23_dispute_details)}
Client Concerns: ${formatValue(r.q24_client_concerns)}`);

  // Section 4: Pricing & Payment
  sections.push(`=== PRICING, PAYMENT & PROTECTION ===
Pricing Model: ${formatValue(r.q25_pricing_model)}
${r.q25_pricing_model_other ? `Pricing Model (Other): ${formatValue(r.q25_pricing_model_other)}` : ''}
Payment Terms: ${formatValue(r.q26_payment_terms)}
Payment Detail: ${formatValue(r.q27_payment_detail)}
Requires Deposit: ${formatValue(r.q28_requires_deposit)}
Deposit Detail: ${formatValue(r.q29_deposit_detail)}
Payment Methods: ${formatValue(r.q30_payment_methods)}
${r.q30_payment_methods_other ? `Payment Methods (Other): ${formatValue(r.q30_payment_methods_other)}` : ''}
Refund Policy: ${formatValue(r.q31_refund_policy)}
Refund Detail: ${formatValue(r.q32_refund_detail)}
Late Payment Interest: ${formatValue(r.q33_late_payment_interest)}
VAT Registered: ${formatValue(r.q34_vat_registered)}
VAT Number: ${formatValue(r.q35_vat_number)}`);

  // Section 5: GDPR
  sections.push(`=== GDPR & DATA PROTECTION ===
Data Collected: ${formatValue(r.q36_data_collected)}
${r.q36_data_collected_other ? `Data Collected (Other): ${formatValue(r.q36_data_collected_other)}` : ''}
Data Collection Method: ${formatValue(r.q37_data_collection_method)}
${r.q37_data_collection_method_other ? `Collection Method (Other): ${formatValue(r.q37_data_collection_method_other)}` : ''}
Data Purpose: ${formatValue(r.q38_data_purpose)}
Data Storage: ${formatValue(r.q39_data_storage)}
${r.q39_data_storage_other ? `Data Storage (Other): ${formatValue(r.q39_data_storage_other)}` : ''}
Data Retention: ${formatValue(r.q40_data_retention)}
Uses Third Party Tools: ${formatValue(r.q41_uses_third_party_tools)}
Third Party Tools Detail: ${formatValue(r.q42_third_party_tools)}
Shares Data: ${formatValue(r.q43_shares_data)}
Data Sharing Detail: ${formatValue(r.q44_data_sharing_detail)}
Sends Marketing: ${formatValue(r.q45_sends_marketing)}
Marketing Platform: ${formatValue(r.q46_marketing_platform)}
Uses Cookies: ${formatValue(r.q47_uses_cookies)}
Tracking Tools: ${formatValue(r.q48_tracking_tools)}`);

  // Section 6: Legal & Risk
  sections.push(`=== LEGAL & RISK ===
Regulated Services: ${formatValue(r.q49_regulated_services)}
Regulatory Detail: ${formatValue(r.q50_regulatory_detail)}
Indemnity Insurance: ${formatValue(r.q51_indemnity_insurance)}
Certifications: ${formatValue(r.q52_certifications)}
Specific Clauses Requested: ${formatValue(r.q53_specific_clauses)}
Exclusions Requested: ${formatValue(r.q54_exclusions)}`);

  // Section 7: Brand & Voice
  sections.push(`=== VOICE, STORY & BRAND ===
First Name: ${formatValue(r.q55_first_name)}
Business Story: ${formatValue(r.q56_business_story)}
Experience: ${formatValue(r.q57_experience)}
Achievements: ${formatValue(r.q58_achievements)}
Client Compliments: ${formatValue(r.q59_client_compliments)}
12-Month Goal: ${formatValue(r.q60_12_month_goal)}
Differentiator: ${formatValue(r.q61_differentiator)}
Tone of Voice: ${formatValue(r.q62_tone_of_voice)}
Words to Avoid: ${formatValue(r.q63_avoid_words)}
Brand Identity: ${formatValue(r.q64_brand_identity)}
Has Logo: ${formatValue(r.q65_has_logo)}
Brand Colours: ${formatValue(r.q67_brand_colours)}
Visual Style: ${formatValue(r.q68_visual_style)}`);

  // Section 8: Invoice
  sections.push(`=== INVOICE PREFERENCES ===
Bank Details: ${formatValue(r.q69_bank_details)}
Invoice Due Date: ${formatValue(r.q70_invoice_due_date)}
Invoice Fields: ${formatValue(r.q71_invoice_fields)}`);

  // Section 9: LinkedIn
  sections.push(`=== LINKEDIN PROFILE ===
LinkedIn Usage: ${formatValue(r.q72_linkedin_usage)}
LinkedIn URL: ${formatValue(r.q73_linkedin_url)}
LinkedIn Target: ${formatValue(r.q74_linkedin_target)}
LinkedIn Keywords: ${formatValue(r.q75_linkedin_keywords)}`);

  // Section 10: Final
  sections.push(`=== FINAL DETAILS ===
Anything Else: ${formatValue(r.q78_anything_else)}
How Heard: ${formatValue(r.q79_how_heard)}
${r.q79_how_heard_other ? `How Heard (Other): ${formatValue(r.q79_how_heard_other)}` : ''}
Confidence Level: ${formatValue(r.q80_confidence_level)}
Consent (Marketing): ${formatValue(r.q81_consent_marketing)}
Consent (Not Legal Advice): ${formatValue(r.q82_consent_not_legal)}
Consent (Accuracy): ${formatValue(r.q83_consent_accuracy)}`);

  // Additional notes
  const noteKeys = Object.keys(notes).filter(k => notes[k] && notes[k].trim() !== '');
  if (noteKeys.length > 0) {
    sections.push(`=== ADDITIONAL NOTES FROM CLIENT ===
${noteKeys.map(k => `Question ${k}: ${notes[k]}`).join('\n\n')}`);
  }

  return sections.join('\n\n');
}

const BRIEF_SYSTEM_PROMPT = `You are a professional business analyst creating a Master Client Brief for a UK sole trader document drafting service called Foundationary. This brief will be used by the document drafting team to create 10 bespoke business documents.

Your task is to read the client's intake questionnaire responses and produce a clear, well-structured, comprehensive Master Brief that:

1. Summarises the business identity, structure, and registration details
2. Details every service offered with scope boundaries (includes/excludes)
3. Captures the client's pricing model, payment terms, and deposit requirements
4. Documents GDPR/data protection specifics (what data, how collected, where stored, retention)
5. Identifies legal and regulatory context
6. Captures the brand voice, tone, and visual preferences
7. Notes any past client issues and protective clauses needed
8. Summarises LinkedIn and online presence goals
9. Flags any risks, gaps, or inconsistencies in the client's answers
10. Provides invoice and document formatting preferences

FORMAT REQUIREMENTS:
- Use clear section headers with === delimiters
- Use bullet points for lists
- Be specific and factual — do not invent information
- If a field says "Not provided", note it as such
- Flag any contradictions or missing information that could affect document quality
- Include a RISK ASSESSMENT section at the end with specific concerns
- Keep the brief professional but readable — this is an internal working document
- Do NOT include any preamble about what you are doing — start directly with the brief content
- Do NOT wrap the output in markdown code blocks

The brief should be thorough enough that a document drafter could create all 10 documents from it without needing to refer back to the raw questionnaire data.`;

// ── API Usage Tracking ──

async function getTodayRequestCount(supabase: any, model: string): Promise<number> {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD in UTC

  const { data, error } = await supabase
    .from('gemini_api_usage')
    .select('request_count')
    .eq('model', model)
    .eq('request_date', today)
    .maybeSingle();

  if (error) {
    console.error('Error fetching API usage count:', error);
    return 0;
  }

  return data?.request_count || 0;
}

async function incrementRequestCount(supabase: any, model: string): Promise<void> {
  const today = new Date().toISOString().split('T')[0];

  // Try to update existing row first
  const { data: existing, error: fetchError } = await supabase
    .from('gemini_api_usage')
    .select('id, request_count')
    .eq('model', model)
    .eq('request_date', today)
    .maybeSingle();

  if (fetchError) {
    console.error('Error checking existing usage:', fetchError);
    // Attempt insert anyway
    const { error: insertError } = await supabase
      .from('gemini_api_usage')
      .insert({
        model,
        request_date: today,
        request_count: 1,
        last_used_at: new Date().toISOString(),
      });
    if (insertError) {
      console.error('Error inserting API usage:', insertError);
    }
    return;
  }

  if (existing) {
    const { error: updateError } = await supabase
      .from('gemini_api_usage')
      .update({
        request_count: existing.request_count + 1,
        last_used_at: new Date().toISOString(),
      })
      .eq('id', existing.id);

    if (updateError) {
      console.error('Error updating API usage:', updateError);
    }
  } else {
    const { error: insertError } = await supabase
      .from('gemini_api_usage')
      .insert({
        model,
        request_date: today,
        request_count: 1,
        last_used_at: new Date().toISOString(),
      });

    if (insertError) {
      console.error('Error inserting API usage:', insertError);
    }
  }
}

// ── Model Selection ──

async function selectModel(supabase: any): Promise<string> {
  const primaryCount = await getTodayRequestCount(supabase, PRIMARY_MODEL);

  if (primaryCount < PRIMARY_DAILY_LIMIT) {
    console.info(`Using primary model ${PRIMARY_MODEL} (${primaryCount}/${PRIMARY_DAILY_LIMIT} requests today)`);
    return PRIMARY_MODEL;
  }

  // Primary model limit reached — switch to fallback
  const fallbackCount = await getTodayRequestCount(supabase, FALLBACK_MODEL);
  console.info(`Primary model limit reached (${primaryCount}/${PRIMARY_DAILY_LIMIT}). Switching to fallback ${FALLBACK_MODEL} (${fallbackCount} requests today)`);

  return FALLBACK_MODEL;
}

// ── Gemini API Call ──

async function callGemini(model: string, apiKey: string, structuredData: string): Promise<string> {
  const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const generationConfig: Record<string, any> = {
    temperature: 0.3,
    maxOutputTokens: 8192,
  };

  // gemini-3-flash-preview uses a different API structure for system instructions
  const requestBody: Record<string, any> = {
    system_instruction: {
      parts: [{ text: BRIEF_SYSTEM_PROMPT }],
    },
    contents: [{
      role: 'user',
      parts: [{
        text: `Here is the client's intake questionnaire data. Please generate the Master Client Brief:\n\n${structuredData}`,
      }],
    }],
    generationConfig,
  };

  const geminiResponse = await fetch(geminiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody),
  });

  if (!geminiResponse.ok) {
    const errText = await geminiResponse.text();
    console.error(`Gemini API error (${model}):`, geminiResponse.status, errText);
    throw new Error(`Gemini API (${model}) returned ${geminiResponse.status}: ${errText.substring(0, 200)}`);
  }

  const geminiData = await geminiResponse.json();

  if (geminiData.candidates?.[0]?.content?.parts?.[0]?.text) {
    return geminiData.candidates[0].content.parts[0].text;
  }

  console.error('Unexpected Gemini response structure:', JSON.stringify(geminiData).substring(0, 500));
  throw new Error('No text content in Gemini response');
}

// ── Main Handler ──

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { user_id } = await req.json();

    if (!user_id) {
      return new Response(
        JSON.stringify({ error: 'Missing user_id' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Set status to 'generating'
    const { data: existingBrief } = await supabase
      .from('client_briefs')
      .select('id')
      .eq('client_id', user_id)
      .maybeSingle();

    if (existingBrief) {
      await supabase
        .from('client_briefs')
        .update({ status: 'generating', error_message: null })
        .eq('id', existingBrief.id);
    } else {
      await supabase
        .from('client_briefs')
        .insert({ client_id: user_id, status: 'generating' });
    }

    // Fetch intake responses
    const { data: intake, error: intakeError } = await supabase
      .from('intake_responses')
      .select('responses, additional_notes')
      .eq('user_id', user_id)
      .maybeSingle();

    if (intakeError || !intake) {
      const errMsg = intakeError?.message || 'No intake form found for this user';
      await supabase
        .from('client_briefs')
        .update({ status: 'failed', error_message: errMsg })
        .eq('client_id', user_id);
      return new Response(
        JSON.stringify({ error: errMsg }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const r = intake.responses || {};
    const notes = intake.additional_notes || {};

    // Build structured data from intake responses
    const structuredData = buildStructuredData(r, notes);

    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');

    let briefContent: string;
    let riskLevel: string;
    let modelUsed: string | null = null;

    if (geminiApiKey && geminiApiKey.trim() !== '') {
      // Select model based on daily usage tracking
      const selectedModel = await selectModel(supabase);
      modelUsed = selectedModel;

      try {
        briefContent = await callGemini(selectedModel, geminiApiKey, structuredData);

        // Track the successful request
        await incrementRequestCount(supabase, selectedModel);

        // Determine risk level from the brief content
        riskLevel = determineRiskLevel(r, briefContent);
      } catch (geminiErr: any) {
        console.error(`Gemini generation failed with ${selectedModel}:`, geminiErr.message);

        // If primary model failed and we were using it, try fallback
        if (selectedModel === PRIMARY_MODEL) {
          console.info(`Attempting fallback to ${FALLBACK_MODEL}...`);
          try {
            briefContent = await callGemini(FALLBACK_MODEL, geminiApiKey, structuredData);
            modelUsed = FALLBACK_MODEL;

            // Track the fallback request
            await incrementRequestCount(supabase, FALLBACK_MODEL);

            riskLevel = determineRiskLevel(r, briefContent);
          } catch (fallbackErr: any) {
            console.error(`Fallback model ${FALLBACK_MODEL} also failed:`, fallbackErr.message);
            briefContent = generateFallbackBrief(r, notes, structuredData);
            modelUsed = null;
            riskLevel = determineRiskLevel(r, null);
          }
        } else {
          // Fallback model also failed — use template
          briefContent = generateFallbackBrief(r, notes, structuredData);
          modelUsed = null;
          riskLevel = determineRiskLevel(r, null);
        }
      }
    } else {
      // No Gemini key — use fallback template
      briefContent = generateFallbackBrief(r, notes, structuredData);
      riskLevel = determineRiskLevel(r, null);
    }

    // Update the brief with generated content
    const { error: updateError } = await supabase
      .from('client_briefs')
      .update({
        status: 'completed',
        brief_content: briefContent,
        risk_level: riskLevel,
        generated_at: new Date().toISOString(),
      })
      .eq('client_id', user_id);

    if (updateError) {
      await supabase
        .from('client_briefs')
        .update({ status: 'failed', error_message: updateError.message })
        .eq('client_id', user_id);
      return new Response(
        JSON.stringify({ error: updateError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, status: 'completed', model: modelUsed }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Generate brief error:', error.message);
    return new Response(
      JSON.stringify({ error: error.message || 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function determineRiskLevel(r: Record<string, any>, briefContent: string | null): string {
  // If we have Gemini output, check for risk indicators in the brief
  if (briefContent) {
    const lowerBrief = briefContent.toLowerCase();
    const hasHighRisk = lowerBrief.includes('high risk') || lowerBrief.includes('significant risk') || lowerBrief.includes('major concern');
    const hasMedRisk = lowerBrief.includes('medium risk') || lowerBrief.includes('moderate risk') || lowerBrief.includes('some concern');
    if (hasHighRisk) return 'High';
    if (hasMedRisk) return 'Medium';
  }

  // Fallback: check completeness of critical fields
  const criticalFields = [
    r.q1_legal_name, r.q2_business_name, r.q3_business_registered,
    r.q5_jurisdiction, r.q6_business_address, r.q7_document_email,
    r.q13_what_you_do, r.q14_flagship_service,
  ];

  const missingCount = criticalFields.filter(v => !v || v === '' || v === 'Not provided').length;

  if (missingCount === 0) return 'Low';
  if (missingCount <= 2) return 'Medium';
  return 'High';
}

function generateFallbackBrief(r: Record<string, any>, notes: Record<string, string>, structuredData: string): string {
  const businessName = r.q2_business_name || 'Unknown Business';

  const missingFields: string[] = [];
  if (!r.q1_legal_name) missingFields.push('Legal Name');
  if (!r.q2_business_name) missingFields.push('Business Name');
  if (!r.q3_business_registered) missingFields.push('Business Type');
  if (!r.q5_jurisdiction) missingFields.push('Jurisdiction');
  if (!r.q6_business_address) missingFields.push('Business Address');
  if (!r.q7_document_email) missingFields.push('Document Email');
  if (!r.q13_what_you_do) missingFields.push('Services Description');
  if (!r.q14_flagship_service) missingFields.push('Flagship Service');
  if (!r.q26_payment_terms) missingFields.push('Payment Terms');
  if (!r.q36_data_collected) missingFields.push('GDPR Data Collected');

  const riskSection = missingFields.length === 0
    ? 'No critical fields are missing. The client has provided all essential information.'
    : `The following critical fields are missing and should be obtained before document drafting:\n${missingFields.map(f => `- ${f}`).join('\n')}`;

  return `MASTER CLIENT BRIEF — ${businessName}
Generated: ${new Date().toISOString()}

${structuredData}

=== RISK ASSESSMENT ===
${riskSection}`;
}
