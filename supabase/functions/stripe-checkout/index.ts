import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

// Service catalog — must match lib/services/service-catalog.ts
const SERVICES: Record<string, {
  name: string;
  priceIds: { test: string; live: string };
  mode: "payment" | "subscription";
}> = {
  business_foundations_pack: {
    name: "Business Foundations Pack",
    priceIds: {
      test: "price_1TZc9UGfxcDbzGRtniOLIJLE",
      live: "price_1TX34AGfxcDbzGRtxVtQN95g",
    },
    mode: "payment",
  },
  website_copy_pack: {
    name: "Website Copy Starter Pack",
    priceIds: { test: "", live: "" },
    mode: "payment",
  },
  social_media_pack: {
    name: "Social Media Starter Pack",
    priceIds: { test: "", live: "" },
    mode: "payment",
  },
  quarterly_refresh: {
    name: "Quarterly Document Refresh",
    priceIds: { test: "", live: "" },
    mode: "subscription",
  },
};

// Bundle discounts — when both services in a pair are selected
const BUNDLE_DISCOUNTS: Record<string, Record<string, number>> = {
  business_foundations_pack: { website_copy_pack: 9, social_media_pack: 9 },
  website_copy_pack: { business_foundations_pack: 9 },
  social_media_pack: { business_foundations_pack: 9 },
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { service_ids, mode, success_url, cancel_url } = await req.json();

    if (!service_ids || !Array.isArray(service_ids) || service_ids.length === 0) {
      return new Response(
        JSON.stringify({ error: "service_ids is required and must be a non-empty array" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const stripeMode = mode === "live" ? "live" : "test";
    const stripeKey = stripeMode === "live"
      ? Deno.env.get("STRIPE_SECRET_KEY_LIVE")
      : Deno.env.get("STRIPE_SECRET_KEY");

    if (!stripeKey) {
      return new Response(
        JSON.stringify({ error: "Stripe key not configured for " + stripeMode + " mode" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Validate service IDs and collect line items
    const lineItems: Array<{ price: string; quantity: number }> = [];
    const validatedIds: string[] = [];

    for (const id of service_ids) {
      const service = SERVICES[id];
      if (!service) {
        return new Response(
          JSON.stringify({ error: `Unknown service: ${id}` }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }

      const priceId = service.priceIds[stripeMode];
      if (!priceId) {
        return new Response(
          JSON.stringify({ error: `No Stripe price configured for ${service.name} in ${stripeMode} mode. Create the product in Stripe Dashboard first.` }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }

      lineItems.push({ price: priceId, quantity: 1 });
      validatedIds.push(id);
    }

    // Determine checkout mode
    const hasSubscription = validatedIds.some((id) => SERVICES[id]?.mode === "subscription");
    const hasPayment = validatedIds.some((id) => SERVICES[id]?.mode === "payment");

    // Calculate bundle discounts as coupons
    let couponAmount = 0;
    const processedPairs = new Set<string>();
    for (const id of validatedIds) {
      const bundles = BUNDLE_DISCOUNTS[id];
      if (!bundles) continue;
      for (const [partnerId, amountOff] of Object.entries(bundles)) {
        if (validatedIds.includes(partnerId)) {
          const pairKey = [id, partnerId].sort().join(":");
          if (!processedPairs.has(pairKey)) {
            processedPairs.add(pairKey);
            couponAmount += amountOff;
          }
        }
      }
    }

    // Build checkout session parameters
    const sessionParams: Record<string, unknown> = {
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: hasSubscription && !hasPayment ? "subscription" : "payment",
      success_url: success_url || `${new URL(req.url).origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancel_url || `${new URL(req.url).origin}/checkout`,
      metadata: {
        service_ids: validatedIds.join(","),
      },
    };

    // Apply bundle discount as a coupon if applicable
    if (couponAmount > 0) {
      // Create a one-time coupon for this checkout
      const couponRes = await fetch("https://api.stripe.com/v1/coupons", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${stripeKey}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          "amount_off": String(couponAmount * 100), // Convert to pence
          currency: "gbp",
          duration: "once",
          name: `Bundle discount — save £${couponAmount}`,
        }),
      });

      const coupon = await couponRes.json();
      if (coupon.id) {
        sessionParams.discounts = [{ coupon: coupon.id }];
      }
    }

    // If we have mixed payment + subscription, we need subscription_data for the subscription items
    // Stripe checkout doesn't support mixed modes in a single session,
    // so we handle it: if there are both, use payment mode and handle subscription separately
    if (hasSubscription && hasPayment) {
      // Filter to only payment items for this session; subscription handled via webhook or separate flow
      const paymentIds = validatedIds.filter((id) => SERVICES[id]?.mode === "payment");
      const subscriptionIds = validatedIds.filter((id) => SERVICES[id]?.mode === "subscription");

      // For simplicity, create the session with payment items only
      // The subscription will be created via a follow-up or can be added later
      const paymentLineItems = paymentIds
        .map((id) => {
          const service = SERVICES[id];
          const priceId = service.priceIds[stripeMode];
          return priceId ? { price: priceId, quantity: 1 } : null;
        })
        .filter(Boolean);

      sessionParams.line_items = paymentLineItems;
      sessionParams.mode = "payment";
      sessionParams.metadata = {
        service_ids: paymentIds.join(","),
        pending_subscription_ids: subscriptionIds.join(","),
      };
    }

    // Create the Stripe checkout session
    const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${stripeKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(
        flattenObject(sessionParams),
      ),
    });

    const session = await response.json();

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: session.error?.message || "Failed to create checkout session" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    return new Response(
      JSON.stringify({ url: session.url, sessionId: session.id }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});

// Flatten nested object to Stripe's form-encoded format
function flattenObject(obj: Record<string, unknown>, prefix = ""): Array<[string, string]> {
  const params: Array<[string, string]> = [];
  for (const [key, value] of Object.entries(obj)) {
    const paramKey = prefix ? `${prefix}[${key}]` : key;
    if (value === null || value === undefined) continue;
    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        if (typeof item === "object" && item !== null) {
          params.push(...flattenObject(item as Record<string, unknown>, `${paramKey}[${index}]`));
        } else {
          params.push([`${paramKey}[${index}]`, String(item)]);
        }
      });
    } else if (typeof value === "object") {
      params.push(...flattenObject(value as Record<string, unknown>, paramKey));
    } else {
      params.push([paramKey, String(value)]);
    }
  }
  return params;
}
