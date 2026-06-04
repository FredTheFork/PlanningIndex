import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import Stripe from 'npm:stripe@17.7.0';
import { createClient } from 'npm:@supabase/supabase-js@2.49.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

function getStripeAndSecret(mode: string): { stripe: Stripe; webhookSecret: string } {
  if (mode === 'live') {
    const key = Deno.env.get('STRIPE_SECRET_KEY_LIVE') ?? Deno.env.get('STRIPE_SECRET_KEY')!;
    const secret = Deno.env.get('STRIPE_WEBHOOK_SECRET_LIVE') ?? Deno.env.get('STRIPE_WEBHOOK_SECRET')!;
    return {
      stripe: new Stripe(key, { appInfo: { name: 'Foundationary', version: '1.0.0' } }),
      webhookSecret: secret,
    };
  }
  const key = Deno.env.get('STRIPE_SECRET_KEY')!;
  const secret = Deno.env.get('STRIPE_WEBHOOK_SECRET')!;
  return {
    stripe: new Stripe(key, { appInfo: { name: 'Foundationary', version: '1.0.0' } }),
    webhookSecret: secret,
  };
}

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

Deno.serve(async (req) => {
  try {
    if (req.method === 'OPTIONS') {
      return new Response(null, { status: 200, headers: corsHeaders });
    }

    if (req.method !== 'POST') {
      return new Response('Method not allowed', { status: 405, headers: corsHeaders });
    }

    const url = new URL(req.url);
    const mode = url.searchParams.get('mode') === 'live' ? 'live' : 'test';
    const { stripe, webhookSecret } = getStripeAndSecret(mode);

    const signature = req.headers.get('stripe-signature');
    if (!signature) {
      return new Response('No signature found', { status: 400, headers: corsHeaders });
    }

    const body = await req.text();

    let event: Stripe.Event;
    try {
      event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
    } catch (error: any) {
      console.error(`Webhook signature verification failed: ${error.message}`);
      return new Response(`Webhook signature verification failed: ${error.message}`, {
        status: 400,
        headers: corsHeaders,
      });
    }

    EdgeRuntime.waitUntil(handleEvent(event, stripe));

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

async function handleEvent(event: Stripe.Event, stripe: Stripe) {
  // Handle checkout.session.completed (one-time payments and initial subscription checkout)
  if (event.type === 'checkout.session.completed') {
    await handleCheckoutComplete(event, stripe);
    return;
  }

  // Handle subscription lifecycle events
  if (event.type === 'customer.subscription.updated') {
    await handleSubscriptionUpdated(event);
    return;
  }

  if (event.type === 'customer.subscription.deleted') {
    await handleSubscriptionDeleted(event);
    return;
  }

  console.info(`Ignoring event type: ${event.type}`);
}

// ── Checkout Session Completed ──

async function handleCheckoutComplete(event: Stripe.Event, stripe: Stripe) {
  const session = event.data.object as Stripe.Checkout.Session;

  // Accept both 'payment' and 'subscription' mode sessions
  const isPaid = session.payment_status === 'paid';
  // For subscription mode, the session may not have payment_status=paid immediately,
  // but Stripe still fires this event once the checkout is complete.
  if (session.mode === 'payment' && !isPaid) {
    console.info(`Ignoring non-paid payment session: status=${session.payment_status}`);
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

  // ── Extract purchased service IDs from metadata ──
  const serviceIdsStr = session.metadata?.service_ids ?? '';
  const purchasedServiceIds = serviceIdsStr
    .split(',')
    .map((s: string) => s.trim())
    .filter(Boolean);

  // Fallback: if no metadata, try to derive from line items
  if (purchasedServiceIds.length === 0) {
    console.info('No service_ids in metadata, attempting to derive from line items');
    const lineItems = await stripe.checkout.sessions.listLineItems(checkoutSessionId);
    for (const item of lineItems.data) {
      if (item.price?.product) {
        // Map product IDs back to service IDs
        const productId = typeof item.price.product === 'string' ? item.price.product : item.price.product.id;
        const mapping: Record<string, string> = {
          'prod_UdvhNsQZM3C2RL': 'business_foundations_pack',
          'prod_UdvoYyIfAtIHjh': 'social_media_pack',
          'prod_UdvqABMskIHzzZ': 'quarterly_refresh',
        };
        if (mapping[productId] && !purchasedServiceIds.includes(mapping[productId])) {
          purchasedServiceIds.push(mapping[productId]);
        }
      }
    }
    // If still empty, default to core pack
    if (purchasedServiceIds.length === 0) {
      purchasedServiceIds.push('business_foundations_pack');
    }
  }

  console.info(`Processing checkout for email: ${customerEmail}, services: ${purchasedServiceIds.join(',')}`);

  // ── Step 1: Find or create user ──
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
    const tempPassword = crypto.randomUUID();
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email: customerEmail,
      password: tempPassword,
      email_confirm: true,
    });

    if (createError || !newUser) {
      console.error('Failed to create user:', createError);
      return;
    }

    userId = newUser.user.id;
    console.info(`Created new user: ${userId} for email: ${customerEmail}`);
  }

  // ── Step 2: Create stripe_customers mapping ──
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

  // ── Step 3: Create order record ──
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

  // ── Step 4: Create or update client_profile with purchased services ──
  const { data: existingProfile } = await supabase
    .from('client_profiles')
    .select('id, purchased_upsells')
    .eq('user_id', userId)
    .maybeSingle();

  if (!existingProfile) {
    const { error: profileError } = await supabase.from('client_profiles').insert({
      user_id: userId,
      has_submitted_intake: false,
      delivery_status: 'not_started',
      purchased_upsells: purchasedServiceIds,
    });
    if (profileError) {
      console.error('Failed to create client profile:', profileError);
    }
  } else {
    // Existing user buying additional services: merge purchased_upsells
    const existingUpsells: string[] = existingProfile.purchased_upsells ?? [];
    const mergedUpsells = [...new Set([...existingUpsells, ...purchasedServiceIds])];

    // If user already submitted intake but bought new services that require intake,
    // reset has_submitted_intake so they complete the new sections
    const servicesNeedingIntake = purchasedServiceIds.filter((id) => {
      const needsIntake = [
        'business_foundations_pack',
        'website_copy_pack',
        'social_media_pack',
      ];
      return needsIntake.includes(id);
    });

    const updateData: Record<string, any> = {
      purchased_upsells: mergedUpsells,
    };

    if (servicesNeedingIntake.length > 0) {
      updateData.has_submitted_intake = false;
    }

    const { error: updateError } = await supabase
      .from('client_profiles')
      .update(updateData)
      .eq('user_id', userId);

    if (updateError) {
      console.error('Failed to update client profile:', updateError);
    }
  }

  // ── Step 5: Create or update intake_responses ──
  const { data: existingResponses } = await supabase
    .from('intake_responses')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle();

  if (!existingResponses) {
    const { error: responsesError } = await supabase.from('intake_responses').insert({
      user_id: userId,
      form_version: 'v3',
      responses: {},
      current_section: 0,
    });
    if (responsesError) {
      console.error('Failed to create intake responses:', responsesError);
    }
  }

  // ── Step 6: Record in stripe_orders with actual amounts ──
  const { data: existingStripeOrder } = await supabase
    .from('stripe_orders')
    .select('id')
    .eq('checkout_session_id', checkoutSessionId)
    .maybeSingle();

  if (!existingStripeOrder) {
    const amountSubtotal = session.amount_subtotal ?? 0;
    const amountTotal = session.amount_total ?? 0;

    const { error: stripeOrderError } = await supabase.from('stripe_orders').insert({
      checkout_session_id: checkoutSessionId,
      payment_intent_id: paymentIntentId,
      customer_id: customerId,
      amount_subtotal: amountSubtotal,
      amount_total: amountTotal,
      currency: session.currency ?? 'gbp',
      payment_status: isPaid ? 'paid' : 'pending',
      status: 'completed',
    });
    if (stripeOrderError) {
      console.error('Failed to create stripe order:', stripeOrderError);
    }
  }

  console.info(`Successfully processed checkout for ${customerEmail}, services: ${purchasedServiceIds.join(',')}`);
}

// ── Subscription Updated ──

async function handleSubscriptionUpdated(event: Stripe.Event) {
  const subscription = event.data.object as Stripe.Subscription;
  console.info(`Subscription updated: ${subscription.id}, status: ${subscription.status}`);

  // Could update services_purchased table status here when that table exists.
  // For now, just log it.
}

// ── Subscription Deleted ──

async function handleSubscriptionDeleted(event: Stripe.Event) {
  const subscription = event.data.object as Stripe.Subscription;
  console.info(`Subscription deleted: ${subscription.id}, status: ${subscription.status}`);

  // Could mark service as cancelled in services_purchased table when that table exists.
  // For now, just log it.
}
