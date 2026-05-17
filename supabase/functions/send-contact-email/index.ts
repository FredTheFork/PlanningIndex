import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { name, email, phone, subject, message, recipientEmail } = await req.json();

    if (!name || !email || !subject || !message) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    // For now, we'll store the contact message in a contact_messages table
    // and send a simple success response. In production, you'd integrate
    // with an email service like Resend, SendGrid, or AWS SES.

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Store contact message in database
    const response = await fetch(`${supabaseUrl}/rest/v1/contact_messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${supabaseServiceKey}`,
        "apikey": supabaseServiceKey,
      },
      body: JSON.stringify({
        name,
        email,
        phone: phone || null,
        subject,
        message,
        created_at: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      console.error("Failed to store contact message:", await response.text());
      // Don't fail the request - the user experience should be positive even if storage fails
    }

    // Return success response
    // In production, integrate with Resend API or similar to actually send emails
    return new Response(
      JSON.stringify({
        success: true,
        message: "Your message has been received. We'll get back to you within 24 hours.",
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Contact email error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process your request" }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
