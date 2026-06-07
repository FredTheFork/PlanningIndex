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

    const { recipientUserId, messageContent, senderType } = await req.json();
    if (!recipientUserId || !messageContent) {
      return new Response(JSON.stringify({ error: "recipientUserId and messageContent are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Insert the message
    const { data: message, error: msgErr } = await sb
      .from("client_messages")
      .insert({
        user_id: recipientUserId,
        sender_type: senderType || (await isUserAdmin(sb, user.id) ? "admin" : "client"),
        content: messageContent,
        is_read: false,
      })
      .select("id, created_at")
      .single();

    if (msgErr) {
      console.error("Failed to insert message:", msgErr);
      return new Response(JSON.stringify({ error: "Failed to send message" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check communication preferences before sending email notification
    const { data: prefs } = await sb
      .from("client_communication_preferences")
      .select("email_updates")
      .eq("user_id", recipientUserId)
      .maybeSingle();

    // If the recipient has email notifications enabled (default true), send notification
    if (prefs?.email_updates !== false) {
      // Get recipient email
      const { data: { users } } = await sb.auth.admin.listUsers();
      const recipient = users.find((u) => u.id === recipientUserId);

      if (recipient?.email) {
        // In production, integrate with an email service (Resend, SendGrid, etc.)
        // For now, log the notification intent
        console.log(`[Notification] New message for ${recipient.email} from ${senderType || "sender"}`);
      }
    }

    return new Response(JSON.stringify({
      messageId: message.id,
      createdAt: message.created_at,
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Send message notification error:", err);
    return new Response(JSON.stringify({ error: err.message || "Message sending failed" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

async function isUserAdmin(sb: any, userId: string): Promise<boolean> {
  const { data } = await sb
    .from("admin_users")
    .select("role")
    .eq("user_id", userId)
    .maybeSingle();
  return !!data;
}
