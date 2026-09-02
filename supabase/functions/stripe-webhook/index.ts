import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY") || "";
const STRIPE_WEBHOOK_SECRET = Deno.env.get("STRIPE_WEBHOOK_SECRET") || "";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const stripe = new (await import("npm:stripe@14.25.0")).default(STRIPE_SECRET_KEY, {
      apiVersion: "2024-06-20",
    });

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const sig = req.headers.get("stripe-signature");
    if (!sig || !STRIPE_WEBHOOK_SECRET) {
      return new Response(
        JSON.stringify({ error: "Missing signature or webhook secret" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body = await req.text();
    let event;
    try {
      event = await stripe.webhooks.constructEventAsync(body, sig, STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Signature verification failed";
      return new Response(
        JSON.stringify({ error: message }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUserId = (obj: Record<string, unknown>): string | null => {
      const metadata = obj.metadata as Record<string, string> | undefined;
      return metadata?.supabase_user_id || null;
    };

    const upsertSubscription = async (
      userId: string,
      sub: { id: string; items: { data: { price: { id: string } }[] }; status: string; current_period_start: number; current_period_end: number; cancel_at_period_end: boolean }
    ) => {
      const priceId = sub.items.data[0]?.price?.id || null;
      const metadata = sub.metadata as Record<string, string> | undefined;
      await supabase.from("subscriptions").upsert({
        user_id: userId,
        stripe_subscription_id: sub.id,
        stripe_price_id: priceId,
        plan_tier: metadata?.plan_tier || null,
        billing_cycle: metadata?.billing_cycle || null,
        status: sub.status,
        current_period_start: new Date(sub.current_period_start * 1000).toISOString(),
        current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
        cancel_at_period_end: sub.cancel_at_period_end,
      });
    };

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Record<string, unknown>;
        const userId = supabaseUserId(session);
        if (userId) {
          const customerId = session.customer as string;
          await supabase.from("customers").upsert({
            user_id: userId,
            stripe_customer_id: customerId,
          });
          await supabase.from("subscription_history").insert({
            user_id: userId,
            event_type: "created",
            stripe_event_id: event.id,
            subscription_data: JSON.parse(JSON.stringify(session)),
          });
        }
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const sub = event.data.object as unknown as { id: string; items: { data: { price: { id: string } }[] }; status: string; current_period_start: number; current_period_end: number; cancel_at_period_end: boolean; metadata: Record<string, string> };
        const userId = sub.metadata?.supabase_user_id;
        if (userId) {
          await upsertSubscription(userId, sub);
          await supabase.from("subscription_history").insert({
            user_id: userId,
            event_type: event.type === "customer.subscription.created" ? "created" : "updated",
            stripe_event_id: event.id,
            subscription_data: JSON.parse(JSON.stringify(sub)),
          });
        }
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as unknown as { id: string; metadata: Record<string, string> };
        const userId = sub.metadata?.supabase_user_id;
        if (userId) {
          await supabase.from("subscriptions").update({
            status: "canceled",
            cancel_at_period_end: false,
          }).eq("stripe_subscription_id", sub.id);
          await supabase.from("subscription_history").insert({
            user_id: userId,
            event_type: "deleted",
            stripe_event_id: event.id,
            subscription_data: JSON.parse(JSON.stringify(sub)),
          });
        }
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Record<string, unknown>;
        const lines = invoice.lines as { data: { metadata: Record<string, string> }[] } | undefined;
        const userId = lines?.data?.[0]?.metadata?.supabase_user_id;
        if (userId) {
          await supabase.from("subscription_history").insert({
            user_id: userId,
            event_type: "payment_succeeded",
            stripe_event_id: event.id,
            subscription_data: JSON.parse(JSON.stringify(invoice)),
          });
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Record<string, unknown>;
        const lines = invoice.lines as { data: { metadata: Record<string, string> }[] } | undefined;
        const userId = lines?.data?.[0]?.metadata?.supabase_user_id;
        if (userId) {
          await supabase.from("subscription_history").insert({
            user_id: userId,
            event_type: "payment_failed",
            stripe_event_id: event.id,
            subscription_data: JSON.parse(JSON.stringify(invoice)),
          });
        }
        break;
      }

      default:
        break;
    }

    return new Response(
      JSON.stringify({ received: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Webhook handler failed";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
