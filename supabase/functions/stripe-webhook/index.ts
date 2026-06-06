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

// Services that require an intake form to be completed.
const SERVICES_REQUIRING_INTAKE = [
  'business_foundations_pack',
  'website_copy_pack',
  'social_media_pack',
];

// Mapping from service ID to the intake form section IDs it requires.
// Used when an existing user buys an additional service to determine
// which new sections need to be completed.
const SERVICE_INTAKE_SECTIONS: Record<string, string[]> = {
  business_foundations_pack: [
    'intro', 'business_identity', 'services', 'clients', 'pricing',
    'gdpr', 'legal', 'brand', 'invoice', 'linkedin', 'final',
  ],
  website_copy_pack: [
    'intro', 'business_identity', 'services', 'clients', 'brand',
    'website_copy', 'final',
  ],
  social_media_pack: [
    'intro', 'business_identity', 'services', 'brand',
    'social_media', 'final',
  ],
  quarterly_refresh: [],
};

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
  if (event.type === 'checkout.session.completed') {
    await handleCheckoutComplete(event, stripe);
    return;
  }

  if (event.type === 'customer.subscription.created') {
    await handleSubscriptionCreated(event);
    return;
  }

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

  const isPaid = session.payment_status === 'paid';
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

  // Fallback: derive from line items if no metadata
  if (purchasedServiceIds.length === 0) {
    console.info('No service_ids in metadata, attempting to derive from line items');
    const lineItems = await stripe.checkout.sessions.listLineItems(checkoutSessionId);
    for (const item of lineItems.data) {
      if (item.price?.product) {
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

  // ── Step 3: Create order record with service_ids and amount_total ──
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
      service_ids: purchasedServiceIds,
      amount_total: session.amount_total ?? 0,
    });
    if (orderError) {
      console.error('Failed to create order:', orderError);
    }
  }

  // ── Step 4: Insert rows into services_purchased for each service ──
  // Use check-before-insert: if an active record for this user+service already exists, skip.
  const subscriptionId = session.subscription as string | null;

  for (const serviceId of purchasedServiceIds) {
    const { data: existingActive } = await supabase
      .from('services_purchased')
      .select('id')
      .eq('user_id', userId)
      .eq('service_id', serviceId)
      .eq('status', 'active')
      .maybeSingle();

    if (!existingActive) {
      const insertData: Record<string, any> = {
        user_id: userId,
        service_id: serviceId,
        stripe_checkout_session_id: checkoutSessionId,
        status: 'active',
        purchased_at: new Date().toISOString(),
      };

      // For subscription-mode services (quarterly_refresh), store the subscription ID
      // and billing period from the checkout session
      if (subscriptionId && serviceId === 'quarterly_refresh') {
        insertData.stripe_subscription_id = subscriptionId;
      }

      const { error: spError } = await supabase.from('services_purchased').insert(insertData);
      if (spError) {
        console.error(`Failed to insert services_purchased for ${serviceId}:`, spError);
      }
    } else {
      console.info(`Active services_purchased already exists for user ${userId}, service ${serviceId} — skipping`);
    }
  }

  // ── Step 5: Create or update client_profile ──
  const { data: existingProfile } = await supabase
    .from('client_profiles')
    .select('id, purchased_upsells, intake_complete_for_services')
    .eq('user_id', userId)
    .maybeSingle();

  if (!existingProfile) {
    const { error: profileError } = await supabase.from('client_profiles').insert({
      user_id: userId,
      has_submitted_intake: false,
      delivery_status: 'not_started',
      purchased_upsells: purchasedServiceIds,
      intake_complete_for_services: [],
    });
    if (profileError) {
      console.error('Failed to create client profile:', profileError);
    }
  } else {
    // Append new service IDs to existing purchased_upsells (do not overwrite)
    const existingUpsells: string[] = existingProfile.purchased_upsells ?? [];
    const mergedUpsells = [...new Set([...existingUpsells, ...purchasedServiceIds])];

    const existingCompleteFor: string[] = existingProfile.intake_complete_for_services ?? [];

    // Determine if any newly purchased services require intake that isn't yet complete
    const newServicesNeedingIntake = purchasedServiceIds.filter(
      (id) => SERVICES_REQUIRING_INTAKE.includes(id) && !existingCompleteFor.includes(id)
    );

    const updateData: Record<string, any> = {
      purchased_upsells: mergedUpsells,
    };

    // If there are new services that need intake (not yet complete), reset the flag
    if (newServicesNeedingIntake.length > 0) {
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

  // ── Step 6: Create or update intake_responses with purchased_service_ids ──
  const { data: existingResponses } = await supabase
    .from('intake_responses')
    .select('id, purchased_service_ids, form_section_completions')
    .eq('user_id', userId)
    .maybeSingle();

  if (!existingResponses) {
    const { error: responsesError } = await supabase.from('intake_responses').insert({
      user_id: userId,
      form_version: 'v4',
      responses: {},
      current_section: 0,
      purchased_service_ids: purchasedServiceIds,
      form_section_completions: {},
    });
    if (responsesError) {
      console.error('Failed to create intake responses:', responsesError);
    }
  } else {
    // Merge purchased_service_ids for existing user buying additional services
    const existingServiceIds: string[] = existingResponses.purchased_service_ids ?? [];
    const mergedServiceIds = [...new Set([...existingServiceIds, ...purchasedServiceIds])];

    // Recalculate which sections need to be completed based on the new full set of services.
    // For any section required by the new services that hasn't been completed yet,
    // ensure it appears as incomplete in form_section_completions.
    const existingCompletions: Record<string, boolean> = existingResponses.form_section_completions ?? {};

    // Build the set of all required sections across all purchased services
    const allRequiredSections = new Set<string>();
    for (const sid of mergedServiceIds) {
      const sections = SERVICE_INTAKE_SECTIONS[sid] ?? [];
      for (const section of sections) {
        allRequiredSections.add(section);
      }
    }

    // Update completions: mark any new required section as incomplete if not already completed
    const updatedCompletions = { ...existingCompletions };
    for (const section of allRequiredSections) {
      if (updatedCompletions[section] === undefined) {
        updatedCompletions[section] = false;
      }
    }

    const { error: updateError } = await supabase
      .from('intake_responses')
      .update({
        purchased_service_ids: mergedServiceIds,
        form_section_completions: updatedCompletions,
      })
      .eq('user_id', userId);

    if (updateError) {
      console.error('Failed to update intake responses:', updateError);
    }
  }

  // ── Step 7: Record in stripe_orders with actual amounts ──
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
      amount_subtotal: session.amount_subtotal ?? 0,
      amount_total: session.amount_total ?? 0,
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

// ── Subscription Created ──

async function handleSubscriptionCreated(event: Stripe.Event) {
  const subscription = event.data.object as Stripe.Subscription;
  console.info(`Subscription created: ${subscription.id}, status: ${subscription.status}`);

  const customerId = typeof subscription.customer === 'string'
    ? subscription.customer
    : subscription.customer.id;

  const { data: customerMapping } = await supabase
    .from('stripe_customers')
    .select('user_id')
    .eq('customer_id', customerId)
    .is('deleted_at', null)
    .maybeSingle();

  if (!customerMapping) {
    console.info(`No user found for customer ${customerId} on subscription.created`);
    return;
  }

  const userId = customerMapping.user_id;
  const periodEnd = new Date(subscription.current_period_end * 1000).toISOString();
  const periodStart = new Date(subscription.current_period_start * 1000).toISOString();

  // Derive service_id from metadata, defaulting to quarterly_refresh
  const serviceId = subscription.metadata?.service_id ?? 'quarterly_refresh';
  const checkoutSessionId = subscription.metadata?.checkout_session_id ?? '';

  // Check if an active services_purchased row already exists for this user+service
  const { data: existingActive } = await supabase
    .from('services_purchased')
    .select('id, stripe_subscription_id')
    .eq('user_id', userId)
    .eq('service_id', serviceId)
    .eq('status', 'active')
    .maybeSingle();

  if (existingActive) {
    // Update the existing row with subscription details
    const newStatus = (subscription.status === 'active' || subscription.status === 'trialing')
      ? 'active'
      : 'pending';

    const { error } = await supabase
      .from('services_purchased')
      .update({
        status: newStatus,
        stripe_subscription_id: subscription.id,
        stripe_checkout_session_id: checkoutSessionId || existingActive.stripe_checkout_session_id,
        expires_at: periodEnd,
        next_billing_date: periodEnd,
        subscription_period_start: periodStart,
        subscription_period_end: periodEnd,
      })
      .eq('id', existingActive.id);

    if (error) {
      console.error('Failed to update services_purchased on subscription.created:', error);
    } else {
      console.info(`Updated ${serviceId} subscription for user ${userId}, next billing: ${periodEnd}`);
    }
  } else {
    // Insert a new services_purchased row for the subscription
    const newStatus = (subscription.status === 'active' || subscription.status === 'trialing')
      ? 'active'
      : 'pending';

    const { error } = await supabase.from('services_purchased').insert({
      user_id: userId,
      service_id: serviceId,
      stripe_checkout_session_id: checkoutSessionId,
      stripe_subscription_id: subscription.id,
      status: newStatus,
      purchased_at: new Date().toISOString(),
      expires_at: periodEnd,
      next_billing_date: periodEnd,
      subscription_period_start: periodStart,
      subscription_period_end: periodEnd,
    });

    if (error) {
      console.error('Failed to insert services_purchased on subscription.created:', error);
    } else {
      console.info(`Created ${serviceId} subscription for user ${userId}, next billing: ${periodEnd}`);
    }
  }

  // Ensure client_profiles.purchased_upsells includes this service
  const { data: profile } = await supabase
    .from('client_profiles')
    .select('id, purchased_upsells, intake_complete_for_services')
    .eq('user_id', userId)
    .maybeSingle();

  if (profile) {
    const existingUpsells: string[] = profile.purchased_upsells ?? [];
    if (!existingUpsells.includes(serviceId)) {
      const mergedUpsells = [...existingUpsells, serviceId];
      const { error: updateError } = await supabase
        .from('client_profiles')
        .update({ purchased_upsells: mergedUpsells })
        .eq('id', profile.id);
      if (updateError) {
        console.error('Failed to update client_profiles on subscription.created:', updateError);
      }
    }
  }

  // Ensure intake_responses.purchased_service_ids includes this service
  const { data: intakeResponse } = await supabase
    .from('intake_responses')
    .select('id, purchased_service_ids, form_section_completions')
    .eq('user_id', userId)
    .maybeSingle();

  if (intakeResponse) {
    const existingServiceIds: string[] = intakeResponse.purchased_service_ids ?? [];
    if (!existingServiceIds.includes(serviceId)) {
      const mergedServiceIds = [...existingServiceIds, serviceId];

      // Recalculate section completions for the new service
      const existingCompletions: Record<string, boolean> = intakeResponse.form_section_completions ?? {};
      const updatedCompletions = { ...existingCompletions };
      const sections = SERVICE_INTAKE_SECTIONS[serviceId] ?? [];
      for (const section of sections) {
        if (updatedCompletions[section] === undefined) {
          updatedCompletions[section] = false;
        }
      }

      const { error: updateError } = await supabase
        .from('intake_responses')
        .update({
          purchased_service_ids: mergedServiceIds,
          form_section_completions: updatedCompletions,
        })
        .eq('id', intakeResponse.id);
      if (updateError) {
        console.error('Failed to update intake_responses on subscription.created:', updateError);
      }
    }
  }
}

// ── Subscription Updated ──

async function handleSubscriptionUpdated(event: Stripe.Event) {
  const subscription = event.data.object as Stripe.Subscription;
  console.info(`Subscription updated: ${subscription.id}, status: ${subscription.status}`);

  const { data: spRecord } = await supabase
    .from('services_purchased')
    .select('id, service_id, user_id')
    .eq('stripe_subscription_id', subscription.id)
    .maybeSingle();

  if (!spRecord) {
    console.info(`No services_purchased record found for subscription ${subscription.id}`);
    return;
  }

  const periodEnd = new Date(subscription.current_period_end * 1000).toISOString();
  const periodStart = new Date(subscription.current_period_start * 1000).toISOString();

  if (subscription.status === 'active' || subscription.status === 'trialing') {
    const { error } = await supabase
      .from('services_purchased')
      .update({
        status: 'active',
        expires_at: periodEnd,
        next_billing_date: periodEnd,
        subscription_period_start: periodStart,
        subscription_period_end: periodEnd,
      })
      .eq('id', spRecord.id);

    if (error) {
      console.error('Failed to update services_purchased on subscription.updated:', error);
    } else {
      console.info(`Updated subscription period for ${spRecord.service_id}, user ${spRecord.user_id}, next billing: ${periodEnd}`);
    }
  } else if (subscription.status === 'past_due' || subscription.status === 'unpaid') {
    await supabase
      .from('services_purchased')
      .update({ status: 'past_due' })
      .eq('id', spRecord.id);
    console.info(`Subscription ${subscription.id} is ${subscription.status}, marked past_due`);
  }
}

// ── Subscription Deleted ──

async function handleSubscriptionDeleted(event: Stripe.Event) {
  const subscription = event.data.object as Stripe.Subscription;
  console.info(`Subscription deleted: ${subscription.id}, status: ${subscription.status}`);

  const { data: spRecord } = await supabase
    .from('services_purchased')
    .select('id, service_id, user_id')
    .eq('stripe_subscription_id', subscription.id)
    .maybeSingle();

  if (!spRecord) {
    console.info(`No services_purchased record found for subscription ${subscription.id}`);
    return;
  }

  const { error } = await supabase
    .from('services_purchased')
    .update({
      status: 'cancelled',
      expires_at: new Date().toISOString(),
    })
    .eq('id', spRecord.id);

  if (error) {
    console.error(`Failed to cancel services_purchased:`, error);
  } else {
    console.info(`Cancelled services_purchased ${spRecord.service_id} for user ${spRecord.user_id}`);
  }

  // Also remove from client_profiles.purchased_upsells
  const { data: profile } = await supabase
    .from('client_profiles')
    .select('id, purchased_upsells')
    .eq('user_id', spRecord.user_id)
    .maybeSingle();

  if (profile) {
    const updatedUpsells = (profile.purchased_upsells ?? []).filter(
      (id: string) => id !== spRecord.service_id
    );
    await supabase
      .from('client_profiles')
      .update({ purchased_upsells: updatedUpsells })
      .eq('id', profile.id);
  }
}
