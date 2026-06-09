import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import Stripe from "https://esm.sh/stripe@14.14.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey, Stripe-Signature",
};

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");

  if (!stripeKey || !webhookSecret) {
    console.error("Missing STRIPE_SECRET_KEY or STRIPE_WEBHOOK_SECRET");
    return new Response(
      JSON.stringify({ error: "Server configuration error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const stripe = new Stripe(stripeKey, {
    apiVersion: "2023-10-16",
  });

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    // Get the raw body for signature verification
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      return new Response(
        JSON.stringify({ error: "Missing stripe-signature header" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verify webhook signature
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

    console.log(`Received Stripe event: ${event.type}`);

    // Handle checkout.session.completed
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      await handleCheckoutCompleted(supabase, stripe, session);
    }

    // Handle subscription events
    if (event.type === "customer.subscription.created" ||
        event.type === "customer.subscription.updated") {
      const subscription = event.data.object as Stripe.Subscription;
      await handleSubscriptionUpdated(supabase, subscription);
    }

    if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object as Stripe.Subscription;
      await handleSubscriptionDeleted(supabase, subscription);
    }

    // Handle invoice events for subscription status
    if (event.type === "invoice.paid") {
      const invoice = event.data.object as Stripe.Invoice;
      if (invoice.subscription) {
        await handleSubscriptionPaid(supabase, invoice);
      }
    }

    return new Response(
      JSON.stringify({ received: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Webhook error:", error);
    const message = error instanceof Error ? error.message : "Webhook processing failed";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

async function handleCheckoutCompleted(
  supabase: ReturnType<typeof createClient>,
  stripe: Stripe,
  session: Stripe.Checkout.Session
) {
  const customerId = session.customer as string;
  const customerEmail = session.customer_details?.email || session.customer_email;
  const paymentIntentId = session.payment_intent as string | undefined;
  const subscriptionId = session.subscription as string | undefined;

  // Extract service_ids from metadata
  const serviceIdsStr = session.metadata?.service_ids || "";
  const serviceIds = serviceIdsStr ? serviceIdsStr.split(",").filter(Boolean) : [];
  const socialMediaPostCount = session.metadata?.social_media_post_count
    ? parseInt(session.metadata.social_media_post_count, 10)
    : undefined;
  const websitePageCount = session.metadata?.website_page_count
    ? parseInt(session.metadata.website_page_count, 10)
    : undefined;
  const websitePagesSelected = session.metadata?.website_pages_selected
    ? session.metadata.website_pages_selected.split(",").filter(Boolean)
    : undefined;

  console.log(`Checkout completed: customer=${customerId}, services=${serviceIds.join(",")}, mode=${session.mode}`);

  // Find or create the user
  let userId: string | null = null;

  // First, try to find user by stripe customer ID
  const { data: existingCustomer } = await supabase
    .from("stripe_customers")
    .select("user_id")
    .eq("customer_id", customerId)
    .maybeSingle();

  if (existingCustomer?.user_id) {
    userId = existingCustomer.user_id;
  } else if (customerEmail) {
    // Try to find user by email in auth.users
    const { data: authUser } = await supabase.auth.admin.listUsers();
    const user = authUser.users.find((u) => u.email?.toLowerCase() === customerEmail.toLowerCase());
    if (user) {
      userId = user.id;
    }
  }

  // Upsert stripe_customers
  await supabase
    .from("stripe_customers")
    .upsert({
      customer_id: customerId,
      user_id: userId,
      updated_at: new Date().toISOString(),
    }, { onConflict: "customer_id" });

  // Update stripe_orders with service_ids
  if (session.mode === "payment") {
    const { data: existingOrder } = await supabase
      .from("stripe_orders")
      .select("id")
      .eq("checkout_session_id", session.id)
      .maybeSingle();

    if (existingOrder) {
      await supabase
        .from("stripe_orders")
        .update({
          service_ids: serviceIds,
          status: "completed",
          payment_status: session.payment_status,
          payment_intent_id: paymentIntentId || null,
        })
        .eq("id", existingOrder.id);
    } else {
      await supabase
        .from("stripe_orders")
        .insert({
          checkout_session_id: session.id,
          customer_id: customerId,
          payment_intent_id: paymentIntentId || null,
          amount_subtotal: session.amount_subtotal || 0,
          amount_total: session.amount_total || 0,
          currency: session.currency || "gbp",
          payment_status: session.payment_status,
          status: "completed",
          service_ids: serviceIds,
        });
    }
  }

  // Handle subscription mode
  if (session.mode === "subscription" && subscriptionId) {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    await handleSubscriptionUpdated(supabase, subscription);
  }

  // Record services in services_purchased
  if (userId && serviceIds.length > 0) {
    for (const serviceId of serviceIds) {
      // Check if already recorded
      const { data: existing } = await supabase
        .from("services_purchased")
        .select("id")
        .eq("user_id", userId)
        .eq("service_id", serviceId)
        .eq("status", "active")
        .maybeSingle();

      if (!existing) {
        await supabase
          .from("services_purchased")
          .insert({
            user_id: userId,
            service_id: serviceId,
            stripe_checkout_session_id: session.id,
            stripe_subscription_id: subscriptionId || null,
            status: "active",
            purchased_at: new Date().toISOString(),
            website_pages_selected: serviceId === 'website_copy_pack' && websitePagesSelected ? websitePagesSelected : null,
            website_page_count: serviceId === 'website_copy_pack' && websitePageCount ? websitePageCount : null,
            social_media_post_count: serviceId === 'social_media_pack' && socialMediaPostCount ? socialMediaPostCount : null,
          });
      }
    }
  }

  console.log(`Checkout processed: ${serviceIds.length} services recorded for user ${userId}`);
}

async function handleSubscriptionUpdated(
  supabase: ReturnType<typeof createClient>,
  subscription: Stripe.Subscription
) {
  const customerId = subscription.customer as string;
  const priceId = subscription.items.data[0]?.price?.id;
  const status = subscription.status;

  const statusMap: Record<string, string> = {
    active: "active",
    trialing: "trialing",
    past_due: "past_due",
    canceled: "cancelled",
    unpaid: "unpaid",
    incomplete: "incomplete",
    incomplete_expired: "incomplete",
    paused: "paused",
  };

  await supabase
    .from("stripe_subscriptions")
    .upsert({
      customer_id: customerId,
      subscription_id: subscription.id,
      price_id: priceId,
      current_period_start: subscription.current_period_start,
      current_period_end: subscription.current_period_end,
      cancel_at_period_end: subscription.cancel_at_period_end,
      status: statusMap[status] || status,
      updated_at: new Date().toISOString(),
    }, { onConflict: "customer_id" });

  // Update services_purchased status
  const { data: customer } = await supabase
    .from("stripe_customers")
    .select("user_id")
    .eq("customer_id", customerId)
    .maybeSingle();

  if (customer?.user_id) {
    await supabase
      .from("services_purchased")
      .update({
        status: status === "active" || status === "trialing" ? "active" : "cancelled",
        subscription_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        subscription_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", customer.user_id)
      .eq("stripe_subscription_id", subscription.id);
  }
}

async function handleSubscriptionDeleted(
  supabase: ReturnType<typeof createClient>,
  subscription: Stripe.Subscription
) {
  const customerId = subscription.customer as string;

  await supabase
    .from("stripe_subscriptions")
    .update({
      status: "cancelled",
      deleted_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("subscription_id", subscription.id);

  const { data: customer } = await supabase
    .from("stripe_customers")
    .select("user_id")
    .eq("customer_id", customerId)
    .maybeSingle();

  if (customer?.user_id) {
    await supabase
      .from("services_purchased")
      .update({
        status: "cancelled",
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", customer.user_id)
      .eq("stripe_subscription_id", subscription.id);
  }
}

async function handleSubscriptionPaid(
  supabase: ReturnType<typeof createClient>,
  invoice: Stripe.Invoice
) {
  const subscriptionId = invoice.subscription as string;
  const customerId = invoice.customer as string;

  // Ensure subscription record exists and is active
  await supabase
    .from("stripe_subscriptions")
    .update({
      status: "active",
      updated_at: new Date().toISOString(),
    })
    .eq("subscription_id", subscriptionId);

  const { data: customer } = await supabase
    .from("stripe_customers")
    .select("user_id")
    .eq("customer_id", customerId)
    .maybeSingle();

  if (customer?.user_id) {
    await supabase
      .from("services_purchased")
      .update({
        status: "active",
        next_billing_date: invoice.next_payment_attempt
          ? new Date(invoice.next_payment_attempt * 1000).toISOString()
          : null,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", customer.user_id)
      .eq("stripe_subscription_id", subscriptionId);
  }
}
