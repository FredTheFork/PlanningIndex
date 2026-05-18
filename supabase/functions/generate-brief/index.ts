import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.49.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

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

    // Build the brief content from intake data
    const legalName = r.q1_legal_name || 'Not provided';
    const businessName = r.q2_business_name || 'Not provided';
    const businessType = r.q3_business_registered || 'Not provided';
    const companiesHouse = r.q4_companies_house || 'N/A';
    const jurisdiction = r.q5_jurisdiction || 'Not provided';
    const businessAddress = r.q6_business_address || 'Not provided';
    const documentEmail = r.q7_document_email || 'Not provided';
    const businessDescription = r.q8_business_description || 'Not provided';
    const targetMarket = r.q9_target_market || 'Not provided';
    const usp = r.q10_unique_selling_point || 'Not provided';
    const competitors = r.q11_competitors || 'Not provided';
    const pricing = r.q12_pricing || 'Not provided';
    const revenueModel = r.q13_revenue_model || 'Not provided';
    const brandTone = r.q14_brand_tone || 'Not provided';
    const services = r.q15_services || 'Not provided';
    const website = r.q16_website || 'Not provided';
    const socialMedia = r.q17_social_media || 'Not provided';
    const existingContracts = r.q18_existing_contracts || 'Not provided';
    const compliance = r.q19_compliance || 'Not provided';
    const goals = r.q20_goals || 'Not provided';

    const briefContent = `CLIENT BRIEF — ${businessName}

===
BUSINESS IDENTITY
===
Legal Name: ${legalName}
Business/Trading Name: ${businessName}
Business Type: ${businessType}
${businessType === 'Limited company' ? `Companies House No: ${companiesHouse}` : ''}
Jurisdiction: ${jurisdiction}
Business Address: ${businessAddress}
Document Email: ${documentEmail}

===
BUSINESS OVERVIEW
===
Description: ${businessDescription}
Target Market: ${targetMarket}
Unique Selling Point: ${usp}
Key Competitors: ${competitors}

===
COMMERCIAL DETAILS
===
Pricing Strategy: ${pricing}
Revenue Model: ${revenueModel}
Brand Tone: ${brandTone}
Services/Products: ${typeof services === 'object' ? JSON.stringify(services, null, 2) : services}

===
ONLINE PRESENCE
===
Website: ${website}
Social Media: ${socialMedia}

===
LEGAL & COMPLIANCE
===
Existing Contracts: ${existingContracts}
Compliance Requirements: ${compliance}

===
GOALS & PRIORITIES
===
${goals}

===
ADDITIONAL NOTES
===
${Object.keys(notes).length > 0 ? JSON.stringify(notes, null, 2) : 'None'}`;

    // Determine risk level based on completeness
    const requiredFields = [legalName, businessName, businessType, jurisdiction, businessAddress, documentEmail, businessDescription];
    const missingCount = requiredFields.filter(v => !v || v === 'Not provided').length;
    const riskLevel = missingCount === 0 ? 'low' : missingCount <= 2 ? 'medium' : 'high';

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
      JSON.stringify({ success: true, status: 'completed' }),
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
