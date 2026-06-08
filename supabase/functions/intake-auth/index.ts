import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

function createAdminClient() {
  return { url: SUPABASE_URL, key: SERVICE_ROLE_KEY };
}

async function adminQuery(table: string, select: string, filter: Record<string, string>) {
  const params = new URLSearchParams();
  params.set("select", select);
  for (const [key, value] of Object.entries(filter)) {
    params.set(key, `eq.${value}`);
  }
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${params.toString()}`, {
    headers: {
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
  });
  if (!res.ok) {
    const text = await res.text();
    console.error(`Admin query ${table} failed: ${res.status} ${text}`);
    return null;
  }
  return await res.json();
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Missing auth token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const token = authHeader.replace("Bearer ", "");

    // Verify the user's JWT and get their ID
    const userRes = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: {
        apikey: SERVICE_ROLE_KEY,
        Authorization: `Bearer ${token}`,
      },
    });

    if (!userRes.ok) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const user = await userRes.json();
    const userId = user.id;

    const ids = new Set<string>();

    // 1. Primary source: services_purchased table (populated by webhook)
    const services = await adminQuery("services_purchased", "service_id,status", { user_id: userId });
    if (services && Array.isArray(services)) {
      for (const s of services) {
        if (s.status === "active") {
          ids.add(s.service_id);
        }
      }
    }

    // 2. Secondary source: stripe_orders with service_ids
    const customers = await adminQuery("stripe_customers", "customer_id", { user_id: userId });
    if (customers && customers.length > 0) {
      const customerId = customers[0].customer_id;
      const orders = await adminQuery("stripe_orders", "checkout_session_id,status,service_ids", {
        customer_id: customerId,
      });
      if (orders && Array.isArray(orders)) {
        for (const order of orders) {
          if (order.status === "completed") {
            if (order.service_ids && Array.isArray(order.service_ids) && order.service_ids.length > 0) {
              order.service_ids.forEach((id: string) => ids.add(id));
            } else {
              // Legacy order without service_ids — assume core pack
              ids.add("business_foundations_pack");
            }
          }
        }
      }

      // 3. Active subscriptions from stripe_subscriptions
      const subs = await adminQuery("stripe_subscriptions", "price_id,status", {
        customer_id: customerId,
      });
      if (subs && Array.isArray(subs)) {
        for (const sub of subs) {
          if (sub.status === "active" || sub.status === "trialing") {
            // Map price_id to service_id
            const priceToService: Record<string, string> = {
              price_1TZc9UGfxcDbzGRtniOLIJLE: "business_foundations_pack",
              price_1TX34AGfxcDbzGRtxVtQN95g: "business_foundations_pack",
            };
            const serviceId = priceToService[sub.price_id];
            if (serviceId) ids.add(serviceId);
            else if (sub.price_id) ids.add("quarterly_refresh");
          }
        }
      }
    }

    // 4. Fallback: client_profiles.purchased_upsells
    if (ids.size === 0) {
      const profile = await adminQuery("client_profiles", "purchased_upsells", { user_id: userId });
      if (profile && profile.length > 0 && profile[0].purchased_upsells) {
        ids.add("business_foundations_pack");
        for (const id of profile[0].purchased_upsells) {
          ids.add(id);
        }
      }
    }

    // If still empty, default to core pack so the form always has sections
    const purchasedServiceIds = ids.size > 0 ? Array.from(ids) : ["business_foundations_pack"];

    return new Response(JSON.stringify({ purchased_service_ids: purchasedServiceIds }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("intake-auth error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
