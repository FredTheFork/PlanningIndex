import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import Stripe from "npm:stripe@17.5.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const SERVICE_CATALOG = [
  {
    id: "business_foundations_pack",
    mode: "payment",
    price: 79,
    stripePriceIds: {
      test: "price_1TZc9UGfxcDbzGRtniOLIJLE",
      live: "price_1TX34AGfxcDbzGRtxVtQN95g",
    },
  },
  {
    id: "website_copy_pack",
    mode: "payment",
    price: 49,
    stripePriceIds: { test: "", live: "" },
  },
  {
    id: "social_media_pack",
    mode: "payment",
    price: 120,
    stripePriceIds: { test: "", live: "" },
  },
  {
    id: "quarterly_refresh",
    mode: "subscription",
    price: 29,
    stripePriceIds: { test: "", live: "" },
  },
];

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
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const { service_ids, mode, success_url, cancel_url } = await req.json();
    if (!service_ids || !Array.isArray(service_ids) || service_ids.length === 0) {
      return new Response(JSON.stringify({ error: "service_ids is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const stripeMode = mode || "test";

    // Get or create Stripe customer
    const authHeader = req.headers.get("Authorization");
    let customerId: string | undefined;

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

        // Save customer mapping
        const { error: upsertErr } = await sb
          .from("stripe_customers")
          .upsert({ user_id: user.id, customer_id: customerId }, { onConflict: "user_id" });
        if (upsertErr) console.error("Failed to upsert stripe_customers:", upsertErr);
      }
    }

    // Build line items
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
    const bundleDiscounts: { serviceId: string; amountOff: number }[] = [];

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

    // Calculate bundle discounts
    const hasBusiness = service_ids.includes("business_foundations_pack");
    const hasWebsite = service_ids.includes("website_copy_pack");
    const hasSocial = service_ids.includes("social_media_pack");

    const discounts: Stripe.Checkout.SessionCreateParams.Discount[] = [];
    if (hasBusiness && hasWebsite) {
      discounts.push({ coupon: undefined }); // Will use custom amount
    }

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: service_ids.some((id) => SERVICE_CATALOG.find((s) => s.id === id)?.mode === "subscription")
        ? "subscription"
        : "payment",
      line_items: lineItems,
      success_url,
      cancel_url,
      payment_method_types: ["card"],
      metadata: { service_ids: service_ids.join(",") },
    };

    if (customerId) {
      sessionParams.customer = customerId;
      sessionParams.customer_update = { name: "auto" };
    }

    // If mixing payment + subscription, we need to split into separate sessions
    // Stripe Checkout doesn't support mixed modes in one session
    const hasPayment = service_ids.some((id) => SERVICE_CATALOG.find((s) => s.id === id)?.mode === "payment");
    const hasSubscription = service_ids.some((id) => SERVICE_CATALOG.find((s) => s.id === id)?.mode === "subscription");

    if (hasPayment && hasSubscription) {
      // For mixed mode, create a payment session for one-time items
      // and the subscription will be handled separately
      const paymentIds = service_ids.filter((id) => SERVICE_CATALOG.find((s) => s.id === id)?.mode === "payment");
      const paymentLineItems = paymentIds.map((id) => {
        const service = SERVICE_CATALOG.find((s) => s.id === id)!;
        return { price: service.stripePriceIds[stripeMode as "test" | "live"], quantity: 1 };
      });

      sessionParams.mode = "payment";
      sessionParams.line_items = paymentLineItems;
      sessionParams.metadata = { service_ids: service_ids.join(","), includes_subscription: "true" };
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
