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
    const { email, password } = await req.json();

    if (!email || !password) {
      return new Response(JSON.stringify({ error: "Email and password are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (password.length < 8) {
      return new Response(JSON.stringify({ error: "Password must be at least 8 characters" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const { createClient } = await import("npm:@supabase/supabase-js@2");
    const sb = createClient(supabaseUrl, supabaseServiceKey);

    // Look up user by email
    const { data: users, error: listErr } = await sb.auth.admin.listUsers();
    if (listErr) {
      return new Response(JSON.stringify({ error: "Failed to look up user" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const user = users.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
    if (!user) {
      // Auto-create the user (they came from Stripe checkout)
      const { data: newUser, error: createErr } = await sb.auth.admin.createUser({
        email: email.toLowerCase(),
        password,
        email_confirm: true,
      });

      if (createErr) {
        return new Response(JSON.stringify({ error: "Failed to create account: " + createErr.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Create client profile
      const { error: profileErr } = await sb
        .from("client_profiles")
        .upsert({ user_id: newUser.user.id }, { onConflict: "user_id" });

      if (profileErr) console.error("Failed to create client profile:", profileErr);

      return new Response(JSON.stringify({ success: true, userId: newUser.user.id }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // User exists — update password and confirm email
    const { error: updateErr } = await sb.auth.admin.updateUserById(user.id, {
      password,
      email_confirm: true,
    });

    if (updateErr) {
      return new Response(JSON.stringify({ error: "Failed to set password: " + updateErr.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Ensure client profile exists
    const { data: profile } = await sb
      .from("client_profiles")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!profile) {
      const { error: profileErr } = await sb
        .from("client_profiles")
        .insert({ user_id: user.id });
      if (profileErr) console.error("Failed to create client profile:", profileErr);
    }

    return new Response(JSON.stringify({ success: true, userId: user.id }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Set password error:", err);
    return new Response(JSON.stringify({ error: err.message || "Failed to set password" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
