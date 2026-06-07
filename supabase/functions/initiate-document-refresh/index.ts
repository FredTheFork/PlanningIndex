import "jsr:@supabase/functions-js/edge-runtime.d.ts";

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

    // Verify admin
    const { data: adminRecord } = await sb
      .from("admin_users")
      .select("role")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!adminRecord) {
      return new Response(JSON.stringify({ error: "Admin access required" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const userId = body.userId || body.user_id;
    const documentTypes = body.documentTypes || body.document_types;
    const updateInstructions = body.updateInstructions || body.update_instructions;
    const subscriptionId = body.subscriptionId || body.subscription_id;

    if (!userId || !documentTypes || !Array.isArray(documentTypes) || documentTypes.length === 0) {
      return new Response(JSON.stringify({ error: "userId and documentTypes are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verify the client has an active quarterly_refresh subscription
    const { data: services } = await sb
      .from("services_purchased")
      .select("status")
      .eq("user_id", userId)
      .eq("service_id", "quarterly_refresh")
      .eq("status", "active")
      .limit(1);

    if (!services || services.length === 0) {
      // Also check stripe_subscriptions
      const { data: customer } = await sb
        .from("stripe_customers")
        .select("customer_id")
        .eq("user_id", userId)
        .maybeSingle();

      let hasActiveSub = false;
      if (customer?.customer_id) {
        const { data: subs } = await sb
          .from("stripe_subscriptions")
          .select("status")
          .eq("customer_id", customer.customer_id)
          .eq("status", "active");
        hasActiveSub = (subs?.length || 0) > 0;
      }

      if (!hasActiveSub) {
        return new Response(JSON.stringify({ error: "Client does not have an active Quarterly Refresh subscription" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // Create refresh job
    const { data: job, error: jobErr } = await sb
      .from("document_refresh_jobs")
      .insert({
        user_id: userId,
        subscription_id: subscriptionId || null,
        document_types: documentTypes,
        update_instructions: updateInstructions || "",
        status: "pending",
      })
      .select("id")
      .single();

    if (jobErr) {
      console.error("Failed to create refresh job:", jobErr);
      return new Response(JSON.stringify({ error: "Failed to create refresh job" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({
      success: true,
      jobId: job.id,
      status: "pending",
      documentTypes,
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Initiate document refresh error:", err);
    return new Response(JSON.stringify({ error: err.message || "Refresh initiation failed" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
