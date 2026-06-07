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
    if (!stripeKey) {
      return new Response(JSON.stringify({ error: "Stripe key not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const stripe = new Stripe(stripeKey, { apiVersion: "2024-12-18.acacia" });

    // If GET with session_id param, retrieve session details
    const url = new URL(req.url);
    const sessionId = url.searchParams.get("session_id");

    if (req.method === "GET" && sessionId) {
      const session = await stripe.checkout.sessions.retrieve(sessionId, {
        expand: ["customer"],
      });

      const customerEmail = session.customer_details?.email
        || (session.customer as Stripe.Customer)?.email
        || session.customer_email
        || null;

      const serviceIds = session.metadata?.service_ids?.split(",").filter(Boolean) || [];

      return new Response(JSON.stringify({
        email: customerEmail,
        service_ids: serviceIds,
        payment_status: session.payment_status,
        customer_id: session.customer as string || null,
      }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // POST: create checkout session
    const { service_ids, mode, success_url, cancel_url } = await req.json();
    if (!service_ids || !Array.isArray(service_ids) || service_ids.length === 0) {
      return new Response(JSON.stringify({ error: "service_ids is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const stripeMode = mode || "test";

    // Get or create Stripe customer
    let customerId: string | undefined;
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const authHeader = req.headers.get("Authorization");
    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      const { createClient } = await import("npm:@supabase/supabase-js@2");
      const sb = createClient(supabaseUrl, supabaseServiceKey);
      const { data: { user } } = await sb.auth.getUser(token);
      if (user?.email) {
        const customers = await stripe.customers.list({ email: user.email, limit: 1 });
        if (customers.data.length > 0) {
          customerId = customers.data[0].id;
        } else {
          const customer = await stripe.customers.create({ email: user.email });
          customerId = customer.id;
        }

        const { error: upsertErr } = await sb
          .from("stripe_customers")
          .upsert({ user_id: user.id, customer_id: customerId }, { onConflict: "user_id" });
        if (upsertErr) console.error("Failed to upsert stripe_customers:", upsertErr);
      }
    }

    const SERVICE_CATALOG = [
      {
        id: "business_foundations_pack",
        mode: "payment",
        stripePriceIds: {
          test: "price_1TZc9UGfxcDbzGRtniOLIJLE",
          live: "price_1TX34AGfxcDbzGRtxVtQN95g",
        },
      },
      {
        id: "website_copy_pack",
        mode: "payment",
        stripePriceIds: { test: "", live: "" },
      },
      {
        id: "social_media_pack",
        mode: "payment",
        stripePriceIds: { test: "", live: "" },
      },
      {
        id: "quarterly_refresh",
        mode: "subscription",
        stripePriceIds: { test: "", live: "" },
      },
    ];

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
    for (const serviceId of service_ids) {
      const service = SERVICE_CATALOG.find((s) => s.id === serviceId);
      if (!service) {
        return new Response(JSON.stringify({ error: `Unknown service: ${serviceId}` }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const priceId = service.stripePriceIds[stripeMode as "test" | "live"];
      if (!priceId) {
        return new Response(
          JSON.stringify({ error: `Service ${serviceId} is not yet available for purchase. Please contact support.` }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      lineItems.push({ price: priceId, quantity: 1 });
    }

    const hasPayment = service_ids.some((id: string) => SERVICE_CATALOG.find((s) => s.id === id)?.mode === "payment");
    const hasSubscription = service_ids.some((id: string) => SERVICE_CATALOG.find((s) => s.id === id)?.mode === "subscription");

    // If mixing payment + subscription, use payment mode for one-time items
    // The subscription will need to be created separately after payment
    let checkoutMode: Stripe.Checkout.SessionCreateParams.Mode = "payment";
    let checkoutLineItems = lineItems;

    if (hasSubscription && !hasPayment) {
      checkoutMode = "subscription";
    } else if (hasPayment && hasSubscription) {
      checkoutMode = "payment";
      checkoutLineItems = lineItems.filter((_, i) => {
        const service = SERVICE_CATALOG.find((s) => s.id === service_ids[i]);
        return service?.mode === "payment";
      });
    }

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: checkoutMode,
      line_items: checkoutLineItems,
      success_url,
      cancel_url,
      payment_method_types: ["card"],
      metadata: { service_ids: service_ids.join(","), includes_subscription: hasSubscription ? "true" : "false" },
    };

    if (customerId) {
      sessionParams.customer = customerId;
      sessionParams.customer_update = { name: "auto" };
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    return new Response(JSON.stringify({ url: session.url, sessionId: session.id }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return new Response(JSON.stringify({ error: err.message || "Checkout failed" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
