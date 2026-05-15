import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import Stripe from 'npm:stripe@17.7.0';
import { createClient } from 'npm:@supabase/supabase-js@2.49.1';

const stripeSecret = Deno.env.get('STRIPE_SECRET_KEY')!;
const stripeWebhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')!;
const stripe = new Stripe(stripeSecret, {
  appInfo: {
    name: 'Foundationary',
    version: '1.0.0',
  },
});

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

Deno.serve(async (req) => {
  try {
    if (req.method === 'OPTIONS') {
      return new Response(null, { status: 200, headers: corsHeaders });
    }

    if (req.method !== 'POST') {
      return new Response('Method not allowed', { status: 405, headers: corsHeaders });
    }

    const signature = req.headers.get('stripe-signature');
    if (!signature) {
      return new Response('No signature found', { status: 400, headers: corsHeaders });
    }

    const body = await req.text();

    let event: Stripe.Event;
    try {
      event = await stripe.webhooks.constructEventAsync(body, signature, stripeWebhookSecret);
    } catch (error: any) {
      console.error(`Webhook signature verification failed: ${error.message}`);
      return new Response(`Webhook signature verification failed: ${error.message}`, {
        status: 400,
        headers: corsHeaders,
      });
    }

    EdgeRuntime.waitUntil(handleEvent(event));

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Error processing webhook:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function handleEvent(event: Stripe.Event) {
  if (event.type !== 'checkout.session.completed') {
    console.info(`Ignoring event type: ${event.type}`);
    return;
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (session.mode !== 'payment' || session.payment_status !== 'paid') {
    console.info(`Ignoring non-paid payment session: mode=${session.mode}, status=${session.payment_status}`);
    return;
  }

  const customerEmail = session.customer_details?.email ?? session.customer_email;
  if (!customerEmail) {
    console.error('No customer email found in checkout session');
    return;
  }

  const customerId = session.customer as string;
  const checkoutSessionId = session.id;
  const paymentIntentId = session.payment_intent as string;

  console.info(`Processing paid checkout for email: ${customerEmail}`);

  // Step 1: Check if user already exists (e.g. duplicate webhook)
  const { data: existingUsers, error: listError } = await supabase.auth.admin.listUsers();

  if (listError) {
    console.error('Failed to list users:', listError);
    return;
  }

  const existingUser = existingUsers.users.find((u: any) => u.email === customerEmail);

  let userId: string;

  if (existingUser) {
    userId = existingUser.id;
    console.info(`User already exists: ${userId}`);
  } else {
    // Step 2: Create Supabase Auth user with the Stripe email
    // Generate a random password - user will log in via magic link
    const tempPassword = crypto.randomUUID();

    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email: customerEmail,
      password: tempPassword,
      email_confirm: true, // Auto-confirm since they just paid
    });

    if (createError) {
      console.error('Failed to create user:', createError);
      return;
    }

    if (!newUser) {
      console.error('No user returned from createUser');
      return;
    }

    userId = newUser.user.id;
    console.info(`Created new user: ${userId} for email: ${customerEmail}`);
  }

  // Step 3: Create stripe_customers mapping if not exists
  const { data: existingCustomer } = await supabase
    .from('stripe_customers')
    .select('id')
    .eq('user_id', userId)
    .is('deleted_at', null)
    .maybeSingle();

  if (!existingCustomer) {
    const { error: customerError } = await supabase.from('stripe_customers').insert({
      user_id: userId,
      customer_id: customerId,
    });

    if (customerError) {
      console.error('Failed to create stripe_customers mapping:', customerError);
    }
  }

  // Step 4: Create order record
  const { data: existingOrder } = await supabase
    .from('orders')
    .select('id')
    .eq('stripe_checkout_session_id', checkoutSessionId)
    .maybeSingle();

  if (!existingOrder) {
    const { error: orderError } = await supabase.from('orders').insert({
      user_id: userId,
      stripe_checkout_session_id: checkoutSessionId,
      stripe_payment_intent_id: paymentIntentId,
      status: 'paid',
    });

    if (orderError) {
      console.error('Failed to create order:', orderError);
    }
  }

  // Step 5: Create client_profile if not exists
  const { data: existingProfile } = await supabase
    .from('client_profiles')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle();

  if (!existingProfile) {
    const { error: profileError } = await supabase.from('client_profiles').insert({
      user_id: userId,
      has_submitted_intake: false,
      delivery_status: 'not_started',
    });

    if (profileError) {
      console.error('Failed to create client profile:', profileError);
    }
  }

  // Step 6: Create empty intake_responses if not exists
  const { data: existingResponses } = await supabase
    .from('intake_responses')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle();

  if (!existingResponses) {
    const { error: responsesError } = await supabase.from('intake_responses').insert({
      user_id: userId,
      form_version: 'v2',
      responses: {},
      current_section: 0,
    });

    if (responsesError) {
      console.error('Failed to create intake responses:', responsesError);
    }
  }

  // Step 7: Also record in stripe_orders for compatibility
  const { data: existingStripeOrder } = await supabase
    .from('stripe_orders')
    .select('id')
    .eq('checkout_session_id', checkoutSessionId)
    .maybeSingle();

  if (!existingStripeOrder) {
    const { error: stripeOrderError } = await supabase.from('stripe_orders').insert({
      checkout_session_id: checkoutSessionId,
      payment_intent_id: paymentIntentId,
      customer_id: customerId,
      amount_subtotal: session.amount_subtotal ?? 14900,
      amount_total: session.amount_total ?? 14900,
      currency: session.currency ?? 'gbp',
      payment_status: 'paid',
      status: 'completed',
    });

    if (stripeOrderError) {
      console.error('Failed to create stripe order:', stripeOrderError);
    }
  }

  // Step 8: Send magic link so user can log in
  const { error: magicLinkError } = await supabase.auth.admin.generateLink({
    type: 'magiclink',
    email: customerEmail,
    options: {
      redirectTo: `${Deno.env.get('SITE_URL') ?? 'https://foundationary.co.uk'}/personal`,
    },
  });

  if (magicLinkError) {
    console.error('Failed to send magic link:', magicLinkError);
  } else {
    console.info(`Magic link sent to ${customerEmail}`);
  }

  console.info(`Successfully processed checkout for ${customerEmail}`);
}
