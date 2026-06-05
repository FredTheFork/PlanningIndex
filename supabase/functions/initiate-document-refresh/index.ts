import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.49.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { user_id, documents_to_refresh, admin_notes, client_notes } = body;

    if (!user_id || !Array.isArray(documents_to_refresh) || documents_to_refresh.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Missing user_id or documents_to_refresh' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Verify the user has an active quarterly_refresh subscription
    const { data: subscription } = await supabase
      .from('services_purchased')
      .select('id, stripe_subscription_id, expires_at')
      .eq('user_id', user_id)
      .eq('service_id', 'quarterly_refresh')
      .eq('status', 'active')
      .maybeSingle();

    if (!subscription) {
      return new Response(
        JSON.stringify({ error: 'No active quarterly_refresh subscription found for this user' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { data: job, error: jobError } = await supabase
      .from('document_refresh_jobs')
      .insert({
        user_id,
        subscription_id: subscription.stripe_subscription_id,
        status: 'pending',
        documents_to_refresh,
        admin_notes: admin_notes ?? null,
        client_notes: client_notes ?? null,
        requested_at: new Date().toISOString(),
      })
      .select('*')
      .single();

    if (jobError) {
      return new Response(
        JSON.stringify({ error: jobError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, job }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
