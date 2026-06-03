import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.105.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  message_content: string;
  message_type: string;
  created_at: string;
}

interface ResendResponse {
  id: string;
  error?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const message: Message = await req.json();

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    if (!supabaseUrl || !serviceRoleKey || !resendApiKey) {
      throw new Error("Missing environment variables");
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Get recipient preferences and email
    const { data: recipientData } = await supabase.auth.admin.getUserById(
      message.recipient_id
    );

    if (!recipientData?.user?.email) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Recipient email not found",
        }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const recipientEmail = recipientData.user.email;

    // Get recipient preferences
    const { data: preferences } = await supabase
      .from("client_communication_preferences")
      .select("*")
      .eq("user_id", message.recipient_id)
      .maybeSingle();

    // Get sender name
    const { data: senderData } = await supabase.auth.admin.getUserById(
      message.sender_id
    );
    const senderEmail = senderData?.user?.email || "Foundationary";

    // Send email if enabled
    if (preferences?.email_notifications_enabled) {
      const messagePreview =
        message.message_content.substring(0, 100) +
        (message.message_content.length > 100 ? "..." : "");

      let subject = "New Message from Foundationary";
      if (message.message_type === "document_query") {
        subject = "Document Question from Foundationary";
      } else if (message.message_type === "intake_query") {
        subject = "Intake Form Question from Foundationary";
      }

      const emailResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Foundationary <noreply@foundationary.com>",
          to: recipientEmail,
          subject: subject,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: linear-gradient(135deg, #1B3F7A 0%, #1A5C9E 100%); padding: 20px; border-radius: 8px; margin-bottom: 20px; text-align: center;">
                <h2 style="color: white; margin: 0; font-size: 24px;">Foundationary</h2>
              </div>
              <h3 style="color: #1B3F7A; margin-top: 20px; margin-bottom: 10px;">You have a new message</h3>
              <p style="color: #666; margin: 10px 0;">From: <strong>${senderEmail}</strong></p>
              <div style="background: #f5f5f5; padding: 15px; border-left: 4px solid #1B3F7A; margin: 20px 0;">
                <p style="color: #333; margin: 0;">${messagePreview}</p>
              </div>
              <div style="margin: 30px 0;">
                <a href="${Deno.env.get("NEXT_PUBLIC_APP_URL") || "https://foundationary.com"}/personal/messages" style="display: inline-block; background: #1B3F7A; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                  View Full Message
                </a>
              </div>
              <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
              <p style="color: #999; font-size: 12px; text-align: center;">
                © Foundationary. All rights reserved.
              </p>
            </div>
          `,
        }),
      });

      if (!emailResponse.ok) {
        const errorText = await emailResponse.text();
        console.error("Email send failed:", errorText);
      }

      // Log notification
      await supabase.from("notification_logs").insert({
        user_id: message.recipient_id,
        message_id: message.id,
        notification_type: "email",
        delivery_status: emailResponse.ok ? "sent" : "failed",
        recipient_address: recipientEmail,
        error_message: emailResponse.ok ? null : "Email service error",
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Notifications processed",
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
