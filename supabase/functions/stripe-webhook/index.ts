import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabaseHeaders = {
  apikey: SUPABASE_SERVICE_ROLE_KEY,
  Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
  "Content-Type": "application/json",
  Prefer: "return=representation",
};

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
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      return new Response(JSON.stringify({ error: "Missing stripe-signature header" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Determine Stripe mode from webhook secret
    const webhookSecretTest = Deno.env.get("STRIPE_WEBHOOK_SECRET") || "";
    const webhookSecretLive = Deno.env.get("STRIPE_WEBHOOK_SECRET_LIVE") || "";

    if (!webhookSecretTest && !webhookSecretLive) {
      return new Response(JSON.stringify({ error: "Webhook secrets not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Parse signature components
    const timestampMatch = signature.match(/t=(\d+)/);
    const signatureMatch = signature.match(/v1=([a-f0-9]+)/);
    if (!timestampMatch || !signatureMatch) {
      return new Response(JSON.stringify({ error: "Invalid signature format" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const timestamp = timestampMatch[1];
    const expectedSig = signatureMatch[1];
    const signedPayload = `${timestamp}.${body}`;

    // Try validating with test secret first, then live
    let stripeKey = Deno.env.get("STRIPE_SECRET_KEY") || "";
    let stripeMode: "test" | "live" = "test";
    let validated = false;

    const testKey = await crypto.subtle.importKey(
      "raw", new TextEncoder().encode(webhookSecretTest),
      { name: "HMAC", hash: "SHA-256" }, false, ["verify"],
    );
    const testValid = await crypto.subtle.verify(
      "HMAC", testKey, hexToBytes(expectedSig), new TextEncoder().encode(signedPayload),
    );

    if (testValid && webhookSecretTest) {
      stripeKey = Deno.env.get("STRIPE_SECRET_KEY") || "";
      stripeMode = "test";
      validated = true;
    } else if (webhookSecretLive) {
      const liveKey = await crypto.subtle.importKey(
        "raw", new TextEncoder().encode(webhookSecretLive),
        { name: "HMAC", hash: "SHA-256" }, false, ["verify"],
      );
      const liveValid = await crypto.subtle.verify(
        "HMAC", liveKey, hexToBytes(expectedSig), new TextEncoder().encode(signedPayload),
      );
      if (liveValid) {
        stripeKey = Deno.env.get("STRIPE_SECRET_KEY_LIVE") || "";
        stripeMode = "live";
        validated = true;
      }
    }

    if (!validated) {
      return new Response(JSON.stringify({ error: "Invalid signature" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const event = JSON.parse(body);

    // ─── Handle checkout.session.completed ───
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const customerEmail = session.customer_email || session.customer_details?.email;
      const stripeCustomerId = session.customer;

      // Find or create user via Admin API
      let userId: string | null = null;

      if (customerEmail) {
        const listRes = await fetch(
          `${SUPABASE_URL}/auth/v1/admin/users?email=${encodeURIComponent(customerEmail)}`,
          {
            headers: {
              apikey: SUPABASE_SERVICE_ROLE_KEY,
              Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
            },
          },
        );
        const listData = await listRes.json();
        if (listData?.users?.length > 0) {
          userId = listData.users[0].id;
        }

        if (!userId) {
          const createRes = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
            method: "POST",
            headers: {
              apikey: SUPABASE_SERVICE_ROLE_KEY,
              Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: customerEmail, email_confirm: true }),
          });
          const createData = await createRes.json();
          userId = createData?.id;
        }
      }

      if (!userId) {
        console.error("Could not resolve user ID for email:", customerEmail);
        return new Response(JSON.stringify({ error: "User resolution failed" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Upsert stripe_customers
      if (stripeCustomerId) {
        const existingCustomerRes = await fetch(
          `${SUPABASE_URL}/rest/v1/stripe_customers?customer_id=eq.${stripeCustomerId}&select=id`,
          { headers: supabaseHeaders },
        );
        const existingCustomers = await existingCustomerRes.json();
        if (!existingCustomers || existingCustomers.length === 0) {
          await fetch(`${SUPABASE_URL}/rest/v1/stripe_customers`, {
            method: "POST",
            headers: supabaseHeaders,
            body: JSON.stringify({
              user_id: userId,
              customer_id: stripeCustomerId,
            }),
          });
        }
      }

      // Create stripe_orders record
      await fetch(`${SUPABASE_URL}/rest/v1/stripe_orders`, {
        method: "POST",
        headers: supabaseHeaders,
        body: JSON.stringify({
          checkout_session_id: session.id,
          payment_intent_id: session.payment_intent || "",
          customer_id: stripeCustomerId || "",
          amount_subtotal: session.amount_subtotal || 0,
          amount_total: session.amount_total || 0,
          currency: session.currency || "gbp",
          payment_status: session.payment_status || "paid",
          status: "completed",
        }),
      });

      console.log(`checkout.session.completed: User ${userId}, order ${session.id}, customer ${stripeCustomerId}`);
    }

    // ─── Handle customer.subscription.created ───
    if (event.type === "customer.subscription.created") {
      const subscription = event.data.object;
      const stripeCustomerId = typeof subscription.customer === "string"
        ? subscription.customer
        : subscription.customer?.id || "";

      // Find user via stripe_customers
      let userId: string | null = null;
      if (stripeCustomerId) {
        const customerRes = await fetch(
          `${SUPABASE_URL}/rest/v1/stripe_customers?customer_id=eq.${stripeCustomerId}&select=user_id`,
          { headers: supabaseHeaders },
        );
        const customers = await customerRes.json();
        if (customers?.length > 0) userId = customers[0].user_id;
      }

      // Insert subscription record
      await fetch(`${SUPABASE_URL}/rest/v1/stripe_subscriptions`, {
        method: "POST",
        headers: supabaseHeaders,
        body: JSON.stringify({
          customer_id: stripeCustomerId,
          subscription_id: subscription.id,
          price_id: subscription.items?.data?.[0]?.price?.id || "",
          current_period_start: subscription.current_period_start,
          current_period_end: subscription.current_period_end,
          cancel_at_period_end: subscription.cancel_at_period_end || false,
          status: subscription.status || "active",
        }),
      });

      console.log(`customer.subscription.created: Subscription ${subscription.id} for customer ${stripeCustomerId}, user ${userId}`);
    }

    // ─── Handle customer.subscription.updated ───
    if (event.type === "customer.subscription.updated") {
      const subscription = event.data.object;

      await fetch(
        `${SUPABASE_URL}/rest/v1/stripe_subscriptions?subscription_id=eq.${subscription.id}`,
        {
          method: "PATCH",
          headers: supabaseHeaders,
          body: JSON.stringify({
            current_period_start: subscription.current_period_start,
            current_period_end: subscription.current_period_end,
            cancel_at_period_end: subscription.cancel_at_period_end || false,
            status: subscription.status || "active",
            updated_at: new Date().toISOString(),
          }),
        },
      );

      console.log(`customer.subscription.updated: Subscription ${subscription.id} → ${subscription.status}`);
    }

    // ─── Handle customer.subscription.deleted ───
    if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object;

      await fetch(
        `${SUPABASE_URL}/rest/v1/stripe_subscriptions?subscription_id=eq.${subscription.id}`,
        {
          method: "PATCH",
          headers: supabaseHeaders,
          body: JSON.stringify({
            status: subscription.status || "canceled",
            updated_at: new Date().toISOString(),
          }),
        },
      );

      console.log(`customer.subscription.deleted: Subscription ${subscription.id}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Webhook error:", message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}
