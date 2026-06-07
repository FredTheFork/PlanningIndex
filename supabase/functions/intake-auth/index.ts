import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const SERVICE_CATALOG_IDS = [
  "business_foundations_pack",
  "website_copy_pack",
  "social_media_pack",
  "quarterly_refresh",
];

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const { createClient } = await import("npm:@supabase/supabase-js@2");
    const sb = createClient(supabaseUrl, supabaseServiceKey);

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Authorization required" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authErr } = await sb.auth.getUser(token);

    if (authErr || !user) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Derive purchased services server-side
    const ids = new Set<string>();

    // Check stripe_customers
    const { data: customer } = await sb
      .from("stripe_customers")
      .select("customer_id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (customer?.customer_id) {
      const { data: orders } = await sb
        .from("stripe_orders")
        .select("checkout_session_id, status")
        .eq("customer_id", customer.customer_id)
        .eq("status", "completed");

      if (orders && orders.length > 0) {
        ids.add("business_foundations_pack");
      }

      const { data: subs } = await sb
        .from("stripe_subscriptions")
        .select("price_id, status")
        .eq("customer_id", customer.customer_id);

      if (subs) {
        for (const sub of subs) {
          if (sub.status === "active" || sub.status === "trialing") {
            // Map price_id back to service_id
            const { data: priceMappings } = await sb
              .from("services_purchased")
              .select("service_id")
              .eq("user_id", user.id)
              .eq("stripe_price_id", sub.price_id)
              .eq("status", "active")
              .limit(1);

            if (priceMappings && priceMappings.length > 0) {
              ids.add(priceMappings[0].service_id);
            }
          }
        }
      }
    }

    // Fallback: services_purchased
    if (ids.size === 0) {
      const { data: services } = await sb
        .from("services_purchased")
        .select("service_id")
        .eq("user_id", user.id)
        .eq("status", "active");

      if (services && services.length > 0) {
        services.forEach((s: { service_id: string }) => ids.add(s.service_id));
      }
    }

    // Fallback: client_profiles
    if (ids.size === 0) {
      const { data: profile } = await sb
        .from("client_profiles")
        .select("purchased_upsells")
        .eq("user_id", user.id)
        .maybeSingle();

      if (profile?.purchased_upsells && Array.isArray(profile.purchased_upsells)) {
        ids.add("business_foundations_pack");
        profile.purchased_upsells.forEach((id: string) => ids.add(id));
      }
    }

    // Fallback: intake_responses.purchased_service_ids
    if (ids.size === 0) {
      const { data: intake } = await sb
        .from("intake_responses")
        .select("purchased_service_ids")
        .eq("user_id", user.id)
        .maybeSingle();

      if (intake?.purchased_service_ids && Array.isArray(intake.purchased_service_ids)) {
        intake.purchased_service_ids.forEach((id: string) => ids.add(id));
      }
    }

    // Default to business_foundations_pack if nothing found
    const purchasedServiceIds = ids.size > 0
      ? Array.from(ids).filter((id) => SERVICE_CATALOG_IDS.includes(id))
      : ["business_foundations_pack"];

    return new Response(JSON.stringify({ purchased_service_ids: purchasedServiceIds }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Intake auth error:", err);
    return new Response(JSON.stringify({ error: err.message || "Authorization failed" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
