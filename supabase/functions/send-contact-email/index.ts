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

    const { name, email, phone, subject, message, recipientEmail } = await req.json();

    if (!name || !email || !subject || !message) {
      return new Response(JSON.stringify({ error: "Name, email, subject, and message are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Store the contact message
    const { error: dbErr } = await sb
      .from("contact_messages")
      .insert({
        name,
        email,
        subject,
        message,
      });

    if (dbErr) console.error("Failed to store contact message:", dbErr);

    // Log the email that would be sent
    // In production, integrate with an email service (Resend, SendGrid, etc.)
    console.log(`[Contact Email] From: ${name} <${email}>, Subject: ${subject}, Phone: ${phone || "N/A"}`);
    console.log(`[Contact Email] To: ${recipientEmail || "foundationarybusiness@gmail.com"}`);
    console.log(`[Contact Email] Message: ${message.substring(0, 200)}...`);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Send contact email error:", err);
    return new Response(JSON.stringify({ error: err.message || "Failed to send message" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
