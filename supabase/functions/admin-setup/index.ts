import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const ADMIN_EMAILS = ["foundationarybusiness@gmail.com"];

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const { createClient } = await import("npm:@supabase/supabase-js@2");
    const sb = createClient(supabaseUrl, supabaseServiceKey);

    // Get the calling user's token
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
      // If no valid token, check if we should auto-confirm the user
      // This endpoint also serves as a "confirm email" helper
      const { data: users } = await sb.auth.admin.listUsers();
      let confirmed = 0;
      for (const u of (users?.users || [])) {
        if (!u.email_confirmed_at && u.created_at) {
          const age = Date.now() - new Date(u.created_at).getTime();
          if (age < 24 * 60 * 60 * 1000) { // Less than 24h old
            await sb.auth.admin.updateUserById(u.id, { email_confirm: true });
            confirmed++;
          }
        }
      }

      // Ensure admin_users entries exist for admin emails
      for (const adminEmail of ADMIN_EMAILS) {
        const adminUser = (users?.users || []).find((u) => u.email?.toLowerCase() === adminEmail);
        if (adminUser) {
          await sb.from("admin_users").upsert(
            { user_id: adminUser.id, role: "admin" },
            { onConflict: "user_id" }
          );
          // Set admin role in app_metadata
          await sb.auth.admin.updateUserById(adminUser.id, {
            app_metadata: { role: "admin" },
          });
        }
      }

      return new Response(JSON.stringify({
        message: `Setup complete. Confirmed ${confirmed} pending users.`,
      }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // If user is authenticated, confirm their email if needed
    if (!user.email_confirmed_at) {
      await sb.auth.admin.updateUserById(user.id, { email_confirm: true });
    }

    // Ensure admin role if this is an admin email
    if (ADMIN_EMAILS.includes(user.email?.toLowerCase() || "")) {
      await sb.from("admin_users").upsert(
        { user_id: user.id, role: "admin" },
        { onConflict: "user_id" }
      );
      await sb.auth.admin.updateUserById(user.id, {
        app_metadata: { role: "admin" },
      });
    }

    return new Response(JSON.stringify({ message: "Account setup complete" }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Admin setup error:", err);
    return new Response(JSON.stringify({ error: err.message || "Setup failed" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
