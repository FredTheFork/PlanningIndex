import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const adminHeaders = {
  apikey: SERVICE_ROLE_KEY,
  Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
  "Content-Type": "application/json",
};

// ── Service catalog (price ID mapping) ──

const SERVICE_CATALOG: Record<string, { stripePriceIds: { test: string; live: string } }> = {
  business_foundations_pack: {
    stripePriceIds: {
      test: "price_1TZc9UGfxcDbzGRtniOLIJLE",
      live: "price_1TX34AGfxcDbzGRtxVtQN95g",
    },
  },
  website_copy_pack: {
    stripePriceIds: { test: "", live: "" },
  },
  social_media_pack: {
    stripePriceIds: { test: "", live: "" },
  },
  quarterly_refresh: {
    stripePriceIds: { test: "", live: "" },
  },
};

function findServiceIdByPriceId(priceId: string): string | null {
  if (!priceId) return null;
  for (const [id, entry] of Object.entries(SERVICE_CATALOG)) {
    if (entry.stripePriceIds.test === priceId || entry.stripePriceIds.live === priceId) {
      return id;
    }
  }
  return null;
}

// ── Derive purchased services from DB (server-side, authoritative) ──

async function derivePurchasedServices(userId: string): Promise<string[]> {
  const ids = new Set<string>();

  // 1. Check stripe_customers → stripe_orders (one-time purchases)
  const customerRes = await fetch(
    `${SUPABASE_URL}/rest/v1/stripe_customers?user_id=eq.${userId}&select=customer_id`,
    { headers: adminHeaders },
  );
  const customers = await customerRes.json();

  if (customers?.length > 0) {
    const customerId = customers[0].customer_id;

    const ordersRes = await fetch(
      `${SUPABASE_URL}/rest/v1/stripe_orders?customer_id=eq.${customerId}&status=eq.completed&select=checkout_session_id`,
      { headers: adminHeaders },
    );
    const orders = await ordersRes.json();
    if (orders?.length > 0) {
      ids.add("business_foundations_pack");
    }

    const subsRes = await fetch(
      `${SUPABASE_URL}/rest/v1/stripe_subscriptions?customer_id=eq.${customerId}&select=price_id,status`,
      { headers: adminHeaders },
    );
    const subs = await subsRes.json();
    if (subs) {
      for (const sub of subs) {
        if (sub.status === "active" || sub.status === "trialing") {
          const serviceId = findServiceIdByPriceId(sub.price_id);
          if (serviceId) ids.add(serviceId);
        }
      }
    }
  }

  // 2. Fallback: services_purchased table
  if (ids.size === 0) {
    const spRes = await fetch(
      `${SUPABASE_URL}/rest/v1/services_purchased?user_id=eq.${userId}&status=eq.active&select=service_id`,
      { headers: adminHeaders },
    );
    const services = await spRes.json();
    if (services?.length > 0) {
      for (const s of services) ids.add(s.service_id);
    }
  }

  // 3. Fallback: client_profiles.purchased_upsells
  if (ids.size === 0) {
    const profileRes = await fetch(
      `${SUPABASE_URL}/rest/v1/client_profiles?user_id=eq.${userId}&select=purchased_upsells`,
      { headers: adminHeaders },
    );
    const profile = await profileRes.json();
    if (profile?.length > 0 && profile[0].purchased_upsells) {
      ids.add("business_foundations_pack");
      for (const id of profile[0].purchased_upsells) ids.add(id);
    }
  }

  return Array.from(ids);
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing authorization" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const token = authHeader.replace("Bearer ", "");

    // Verify the user's JWT
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

    const userData = await userRes.json();
    const userId = userData.id;

    if (!userId) {
      return new Response(JSON.stringify({ error: "User ID not found" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get server-side authoritative purchased service IDs
    const purchasedServiceIds = await derivePurchasedServices(userId);

    return new Response(
      JSON.stringify({
        purchased_service_ids: purchasedServiceIds,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[intake-auth] Error:", message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
