import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface LeadMagnetRequest {
  email: string;
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
    const { email }: LeadMagnetRequest = await req.json();

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

    // Get Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing Supabase environment variables");
    }

    // Save to newsletter_subscribers with source "lead-magnet"
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
        source: "lead-magnet",
        subscribed_at: new Date().toISOString(),
      }),
    });

    if (!saveResponse.ok && saveResponse.status !== 409) {
      const error = await saveResponse.json();
      console.error("Database error:", error);
      throw new Error("Failed to save subscriber");
    }

    // Send lead magnet email via Resend
    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY not configured");
    }

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Foundationary <noreply@foundationary.co.uk>",
        to: [email],
        subject: "Your Free UK Sole Trader Legal Checklist",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #1B3F7A 0%, #2C68C4 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="margin: 0; font-size: 28px;">UK Sole Trader Legal Checklist</h1>
              <p style="margin: 10px 0 0; opacity: 0.9;">Your free download is ready!</p>
            </div>

            <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
              <h2 style="color: #1B3F7A; margin-top: 0;">Here's Your Checklist</h2>

              <p style="color: #4A5568; line-height: 1.6;">
                Thanks for requesting our free legal checklist. This essential guide covers the 12 documents every UK sole trader needs to protect their business.
              </p>

              <div style="text-align: center; margin: 30px 0;">
                <a href="https://foundationary.vercel.app/downloads/sole-trader-legal-checklist.pdf" style="background: #1B3F7A; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">
                  Download Your Free Checklist (PDF)
                </a>
              </div>

              <div style="background: white; border-left: 4px solid #38A169; padding: 15px; margin: 20px 0;">
                <p style="margin: 0; color: #1B3F7A; font-weight: 600;">Inside you'll find:</p>
                <ul style="margin: 10px 0 0; color: #4A5568;">
                  <li>Client contract essentials</li>
                  <li>GDPR compliance checklist</li>
                  <li>Invoice requirements</li>
                  <li>Data protection basics</li>
                  <li>Terms you must include</li>
                  <li>And 7 more critical documents</li>
                </ul>
              </div>

              <div style="background: #EBF8FF; border: 2px solid #2C68C4; border-radius: 8px; padding: 20px; margin: 30px 0;">
                <h3 style="color: #1B3F7A; margin-top: 0;">Ready to Get All Your Documents Done?</h3>
                <p style="color: #4A5568; margin: 10px 0; line-height: 1.6;">
                  The Business Foundations Pack includes all 10 professional documents, tailored to your UK sole trader business and delivered within 24 hours.
                </p>
                <a href="https://foundationary.vercel.app/checkout" style="background: #1B3F7A; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">
                  Get Your Pack — Just £79
                </a>
              </div>

              <p style="color: #4A5568; line-height: 1.6; font-size: 14px;">
                <strong>Need help?</strong> Check out our <a href="https://foundationary.vercel.app/faq" style="color: #2C68C4; text-decoration: none;">FAQ</a> or <a href="https://foundationary.vercel.app/contact" style="color: #2C68C4; text-decoration: none;">contact us</a> directly.
              </p>

              <hr style="border: none; border-top: 1px solid #E2E8F0; margin: 30px 0;">

              <p style="color: #718096; font-size: 13px; text-align: center;">
                Foundationary • foundationarybusiness@gmail.com<br>
                <a href="https://foundationary.vercel.app" style="color: #2C68C4; text-decoration: none;">foundationary.vercel.app</a>
              </p>
            </div>
          </div>
        `,
        attachments: [
          {
            filename: "uk-sole-trader-legal-checklist.pdf",
            path: "https://foundationary.vercel.app/downloads/sole-trader-legal-checklist.pdf",
          },
        ],
      }),
    });

    if (!emailResponse.ok) {
      const error = await emailResponse.text();
      console.error("Email send failed:", error);
      throw new Error("Failed to send email");
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Checklist sent to your email!",
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Lead magnet error:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to send checklist. Please try again.",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
