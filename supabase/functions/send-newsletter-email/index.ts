import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface NewsletterRequest {
  email: string;
  source?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  try {
    const { email, source = "footer" }: NewsletterRequest = await req.json();

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: "Valid email address required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // GetSupabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing Supabase environment variables");
    }

    // Save to database (upsert to handle duplicates)
    const saveResponse = await fetch(`${supabaseUrl}/rest/v1/newsletter_subscribers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": supabaseServiceKey,
        "Authorization": `Bearer ${supabaseServiceKey}`,
        "Prefer": "resolution=merge-duplicates",
      },
      body: JSON.stringify({
        email,
        source,
        subscribed_at: new Date().toISOString(),
      }),
    });

    if (!saveResponse.ok && saveResponse.status !== 409) {
      const error = await saveResponse.json();
      console.error("Database error:", error);
      throw new Error("Failed to save subscriber");
    }

    // Send confirmation email via Resend
    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    if (resendApiKey) {
      const emailResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Foundationary <noreply@foundationary.co.uk>",
          to: [email],
          subject: "Welcome to the Foundationary Newsletter",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: linear-gradient(135deg, #1B3F7A 0%, #2C68C4 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                <h1 style="margin: 0; font-size: 28px;">Welcome to Foundationary</h1>
                <p style="margin: 10px 0 0; opacity: 0.9;">Business tips for UK sole traders</p>
              </div>

              <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
                <h2 style="color: #1B3F7A; margin-top: 0;">Thanks for subscribing!</h2>

                <p style="color: #4A5568; line-height: 1.6;">
                  You've successfully joined <strong>200+ UK sole traders</strong> who get practical business tips, legal updates, and resources delivered to their inbox.
                </p>

                <div style="background: white; border-left: 4px solid #2C68C4; padding: 15px; margin: 20px 0;">
                  <p style="margin: 0; color: #1B3F7A; font-weight: 600;">What to expect:</p>
                  <ul style="margin: 10px 0 0; color: #4A5568;">
                    <li>Monthly business tips</li>
                    <li>GDPR and legal updates</li>
                    <li>Invoicing best practices</li>
                    <li>Tax deadline reminders</li>
                  </ul>
                </div>

                <p style="color: #4A5568; line-height: 1.6; font-size: 14px;">
                  <strong>PS:</strong> Ready to get your business documents sorted? Check out our <a href="https://foundationary.vercel.app/whats-included" style="color: #2C68C4; text-decoration: none;">Business Foundations Pack</a> — 10 professional documents for just £79.
                </p>

                <hr style="border: none; border-top: 1px solid #E2E8F0; margin: 30px 0;">

                <p style="color: #718096; font-size: 13px; text-align: center;">
                  Foundationary • foundationarybusiness@gmail.com<br>
                  <a href="https://foundationary.vercel.app" style="color: #2C68C4; text-decoration: none;">foundationary.vercel.app</a>
                </p>
              </div>
            </div>
          `,
        }),
      });

      if (!emailResponse.ok) {
        console.error("Email send failed:", await emailResponse.text());
        // Don't throw - subscriber is saved, email can be retried
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Successfully subscribed to newsletter",
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to subscribe. Please try again.",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
