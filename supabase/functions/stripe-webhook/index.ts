import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import Stripe from "npm:stripe@17.5.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");

    if (!stripeKey) {
      return new Response(JSON.stringify({ error: "Stripe key not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const stripe = new Stripe(stripeKey, { apiVersion: "2024-12-18.acacia" });
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const { createClient } = await import("npm:@supabase/supabase-js@2");
    const sb = createClient(supabaseUrl, supabaseServiceKey);

    // Verify webhook signature if secret is available
    const body = await req.text();
    let event: Stripe.Event;

    if (webhookSecret) {
      const signature = req.headers.get("stripe-signature");
      if (!signature) {
        return new Response(JSON.stringify({ error: "Missing stripe-signature header" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      } catch (err) {
        console.error("Webhook signature verification failed:", err);
        return new Response(JSON.stringify({ error: "Invalid signature" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    } else {
      event = JSON.parse(body);
    }

    // Handle event types
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(sb, session);
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionChange(sb, subscription);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(sb, subscription);
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        // Renewal payment for subscription
        if (invoice.subscription) {
          console.log(`Subscription renewal: ${invoice.subscription}`);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Webhook error:", err);
    return new Response(JSON.stringify({ error: err.message || "Webhook processing failed" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

async function handleCheckoutCompleted(
  sb: any,
  session: Stripe.Checkout.Session
) {
  const customerId = session.customer as string;
  const sessionId = session.id;
  const paymentIntentId = session.payment_intent as string;
  const metadata = session.metadata || {};
  const serviceIdsStr = metadata.service_ids || "";
  const serviceIds = serviceIdsStr ? serviceIdsStr.split(",").filter(Boolean) : [];
  const includesSubscription = metadata.includes_subscription === "true";

  // Get user ID from stripe_customers
  const { data: customer } = await sb
    .from("stripe_customers")
    .select("user_id")
    .eq("customer_id", customerId)
    .maybeSingle();

  const userId = customer?.user_id;

  // Update or create stripe_orders
  const { error: orderErr } = await sb
    .from("stripe_orders")
    .upsert({
      checkout_session_id: sessionId,
      payment_intent_id: paymentIntentId || null,
      customer_id: customerId,
      amount_subtotal: session.amount_subtotal || 0,
      amount_total: session.amount_total || 0,
      currency: session.currency || "gbp",
      payment_status: session.payment_status || "paid",
      status: "completed",
      service_ids: serviceIds,
    }, { onConflict: "checkout_session_id" });

  if (orderErr) console.error("Failed to upsert stripe_orders:", orderErr);

  // Populate services_purchased for each service
  if (userId && serviceIds.length > 0) {
    for (const serviceId of serviceIds) {
      // For payment-mode services
      if (serviceId !== "quarterly_refresh") {
        const { error: svcErr } = await sb
          .from("services_purchased")
          .upsert({
            user_id: userId,
            service_id: serviceId,
            status: "active",
            stripe_checkout_session_id: sessionId,
          }, { onConflict: undefined });
        if (svcErr) console.error(`Failed to insert service ${serviceId}:`, svcErr);
      }
    }

    // Update client_profiles
    const { data: profile } = await sb
      .from("client_profiles")
      .select("purchased_upsells")
      .eq("user_id", userId)
      .maybeSingle();

    const existingUpsells = profile?.purchased_upsells || [];
    const newUpsells = serviceIds.filter(
      (id: string) => id !== "business_foundations_pack" && !existingUpsells.includes(id)
    );
    const allUpsells = [...existingUpsells, ...newUpsells];

    const { error: profileErr } = await sb
      .from("client_profiles")
      .upsert({
        user_id: userId,
        purchased_upsells: allUpsells,
      }, { onConflict: "user_id" });

    if (profileErr) console.error("Failed to update client_profiles:", profileErr);

    // Update intake_responses with purchased_service_ids
    const { data: intake } = await sb
      .from("intake_responses")
      .select("purchased_service_ids")
      .eq("user_id", userId)
      .maybeSingle();

    const existingPurchased = intake?.purchased_service_ids || [];
    const allPurchased = [...new Set([...existingPurchased, ...serviceIds])];

    const { error: intakeErr } = await sb
      .from("intake_responses")
      .upsert({
        user_id: userId,
        purchased_service_ids: allPurchased,
      }, { onConflict: "user_id" });

    if (intakeErr) console.error("Failed to update intake_responses:", intakeErr);
  }
}

async function handleSubscriptionChange(
  sb: any,
  subscription: Stripe.Subscription
) {
  const customerId = subscription.customer as string;

  const { error: subErr } = await sb
    .from("stripe_subscriptions")
    .upsert({
      customer_id: customerId,
      subscription_id: subscription.id,
      price_id: subscription.items.data[0]?.price.id || "",
      current_period_start: subscription.current_period_start,
      current_period_end: subscription.current_period_end,
      cancel_at_period_end: subscription.cancel_at_period_end,
      status: subscription.status,
    }, { onConflict: "subscription_id" });

  if (subErr) console.error("Failed to upsert stripe_subscriptions:", subErr);

  // Get user_id and populate services_purchased for quarterly_refresh
  const { data: customer } = await sb
    .from("stripe_customers")
    .select("user_id")
    .eq("customer_id", customerId)
    .maybeSingle();

  const userId = customer?.user_id;
  if (userId && (subscription.status === "active" || subscription.status === "trialing")) {
    const { error: svcErr } = await sb
      .from("services_purchased")
      .upsert({
        user_id: userId,
        service_id: "quarterly_refresh",
        status: "active",
        stripe_price_id: subscription.items.data[0]?.price.id || "",
      }, { onConflict: undefined });
    if (svcErr) console.error("Failed to insert quarterly_refresh service:", svcErr);
  }
}

async function handleSubscriptionDeleted(
  sb: any,
  subscription: Stripe.Subscription
) {
  const customerId = subscription.customer as string;

  // Update subscription status
  const { error: subErr } = await sb
    .from("stripe_subscriptions")
    .update({ status: "canceled" })
    .eq("subscription_id", subscription.id);

  if (subErr) console.error("Failed to update subscription status:", subErr);

  // Mark quarterly_refresh as cancelled in services_purchased
  const { data: customer } = await sb
    .from("stripe_customers")
    .select("user_id")
    .eq("customer_id", customerId)
    .maybeSingle();

  const userId = customer?.user_id;
  if (userId) {
    const { error: svcErr } = await sb
      .from("services_purchased")
      .update({ status: "cancelled" })
      .eq("user_id", userId)
      .eq("service_id", "quarterly_refresh");
    if (svcErr) console.error("Failed to cancel quarterly_refresh:", svcErr);
  }
}
