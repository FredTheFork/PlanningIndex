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
  Prefer: "return=representation",
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

/**
 * Check whether a user has an active quarterly_refresh subscription.
 * Returns true only if there is an active subscription or active services_purchased record.
 */
async function isRefreshEligible(userId: string): Promise<boolean> {
  // 1. Check services_purchased for active quarterly_refresh
  const spRes = await fetch(
    `${SUPABASE_URL}/rest/v1/services_purchased?user_id=eq.${userId}&service_id=eq.quarterly_refresh&status=eq.active&select=id`,
    { headers: adminHeaders },
  );
  const sp = await spRes.json();
  if (sp?.length > 0) return true;

  // 2. Check stripe_subscriptions for active subscription mapped to quarterly_refresh
  const customerRes = await fetch(
    `${SUPABASE_URL}/rest/v1/stripe_customers?user_id=eq.${userId}&select=customer_id`,
    { headers: adminHeaders },
  );
  const customers = await customerRes.json();
  if (customers?.length > 0) {
    const subsRes = await fetch(
      `${SUPABASE_URL}/rest/v1/stripe_subscriptions?customer_id=eq.${customers[0].customer_id}&status=eq.active&select=price_id`,
      { headers: adminHeaders },
    );
    const subs = await subsRes.json();
    if (subs) {
      for (const sub of subs) {
        const serviceId = findServiceIdByPriceId(sub.price_id);
        if (serviceId === "quarterly_refresh") return true;
      }
    }
  }

  return false;
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
    const adminUserId = userData.id;

    // Verify admin role
    const appRole = userData.app_metadata?.role;
    const email = userData.email;
    const isAdmin = appRole === "admin" || email === "foundationarybusiness@gmail.com";
    if (!isAdmin) {
      return new Response(JSON.stringify({ error: "Forbidden — admin only" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const { user_id, service_id, document_types, update_instructions } = body as {
      user_id: string;
      service_id: string;
      document_types: string[];
      update_instructions: string;
    };

    if (!user_id || !service_id || !document_types?.length) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ── CHECK REFRESH ELIGIBILITY ──
    const eligible = await isRefreshEligible(user_id);
    if (!eligible) {
      return new Response(
        JSON.stringify({
          error: "Quarterly Document Refresh subscription is not active. Document refreshes are not permitted.",
        }),
        {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Create refresh job
    const jobData = {
      user_id,
      service_id,
      documents_to_refresh: document_types,
      client_notes: update_instructions,
      status: "pending",
      admin_id: adminUserId,
    };

    const jobRes = await fetch(`${SUPABASE_URL}/rest/v1/document_refresh_jobs`, {
      method: "POST",
      headers: adminHeaders,
      body: JSON.stringify(jobData),
    });

    if (!jobRes.ok) {
      const errText = await jobRes.text();
      console.error("[initiate-document-refresh] Job creation error:", errText);
      return new Response(JSON.stringify({ error: "Failed to create refresh job" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const job = await jobRes.json();

    return new Response(
      JSON.stringify({
        success: true,
        job_id: job?.[0]?.id,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[initiate-document-refresh] Error:", message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
