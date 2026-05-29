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

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const resendApiKey = Deno.env.get("RESEND_API_KEY");

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
    const storeResponse = await fetch(`${supabaseUrl}/rest/v1/contact_messages`, {
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

    if (!storeResponse.ok) {
      console.error("Failed to store contact message:", await storeResponse.text());
    }

    // Send email via Resend
    if (resendApiKey && recipientEmail) {
      const emailResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Foundationary Contact Form <noreply@foundationary.co.uk>",
          to: [recipientEmail],
          reply_to: email,
          subject: `New Contact Form Submission: ${subject}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: linear-gradient(135deg, #1B3F7A 0%, #2C68C4 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0;">
                <h2 style="margin: 0;">New Contact Form Submission</h2>
              </div>

              <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; font-weight: 600; color: #1B3F7A; width: 120px;">Name:</td>
                    <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #4A5568;">${name}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; font-weight: 600; color: #1B3F7A;">Email:</td>
                    <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #4A5568;"><a href="mailto:${email}" style="color: #2C68C4; text-decoration: none;">${email}</a></td>
                  </tr>
                  ${phone ? `
                  <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; font-weight: 600; color: #1B3F7A;">Phone:</td>
                    <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #4A5568;"><a href="tel:${phone}" style="color: #2C68C4; text-decoration: none;">${phone}</a></td>
                  </tr>
                  ` : ''}
                  <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; font-weight: 600; color: #1B3F7A;">Subject:</td>
                    <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #4A5568; text-transform: capitalize;">${subject}</td>
                  </tr>
                </table>

                <div style="margin-top: 20px; padding: 20px; background: white; border-radius: 8px; border: 1px solid #e2e8f0;">
                  <h3 style="margin-top: 0; color: #1B3F7A;">Message:</h3>
                  <p style="color: #4A5568; line-height: 1.6; white-space: pre-wrap;">${message}</p>
                </div>

                <div style="margin-top: 20px; padding: 15px; background: #EBF8FF; border-radius: 8px;">
                  <p style="margin: 0; color: #1B3F7A; font-size: 14px;">
                    <strong>Reply directly:</strong> <a href="mailto:${email}" style="color: #2C68C4;">${email}</a>
                  </p>
                </div>
              </div>
            </div>
          `,
        }),
      });

      if (!emailResponse.ok) {
        console.error("Email send failed:", await emailResponse.text());
        // Don't fail the request - message is stored in database
      }
    }
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
