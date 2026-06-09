import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get the authorization header to verify the user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse request body
    const body = await req.json();
    const { user_id } = body;

    if (!user_id) {
      return new Response(
        JSON.stringify({ error: "Missing user_id" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Starting account deletion for user: ${user_id}`);

    // Get the user's stripe customer ID before deleting
    const { data: stripeCustomer } = await supabase
      .from("stripe_customers")
      .select("customer_id")
      .eq("user_id", user_id)
      .maybeSingle();

    const customerId = stripeCustomer?.customer_id;

    // Delete from all related tables in order

    // 1. Delete notification logs
    const { error: notificationError } = await supabase
      .from("notification_logs")
      .delete()
      .eq("user_id", user_id);
    if (notificationError) console.log("Notification logs delete error (may not exist):", notificationError);

    // 2. Delete document refresh jobs
    const { error: refreshJobsError } = await supabase
      .from("document_refresh_jobs")
      .delete()
      .eq("user_id", user_id);
    if (refreshJobsError) console.log("Document refresh jobs delete error:", refreshJobsError);

    // 3. Delete website page contents
    const { error: websitePagesError } = await supabase
      .from("website_page_contents")
      .delete()
      .eq("user_id", user_id);
    if (websitePagesError) console.log("Website page contents delete error:", websitePagesError);

    // 4. Delete social media posts
    const { error: socialPostsError } = await supabase
      .from("social_media_posts")
      .delete()
      .eq("user_id", user_id);
    if (socialPostsError) console.log("Social media posts delete error:", socialPostsError);

    // 5. Delete generated documents
    const { error: generatedDocsError } = await supabase
      .from("generated_documents")
      .delete()
      .eq("client_id", user_id);
    if (generatedDocsError) console.log("Generated documents delete error:", generatedDocsError);

    // 6. Delete client briefs
    const { error: briefsError } = await supabase
      .from("client_briefs")
      .delete()
      .eq("user_id", user_id);
    if (briefsError) console.log("Client briefs delete error:", briefsError);

    // 7. Delete intake uploads (files and records)
    const { data: uploads } = await supabase
      .from("intake_uploads")
      .select("file_path")
      .eq("user_id", user_id);

    if (uploads && uploads.length > 0) {
      // Delete files from storage
      const filePaths = uploads.map((u) => u.file_path).filter(Boolean);
      if (filePaths.length > 0) {
        for (const bucket of ["intake-uploads", "documents"]) {
          await supabase.storage.from(bucket).remove(filePaths);
        }
      }
    }

    const { error: uploadsError } = await supabase
      .from("intake_uploads")
      .delete()
      .eq("user_id", user_id);
    if (uploadsError) console.log("Intake uploads delete error:", uploadsError);

    // 8. Delete intake responses
    const { error: intakeError } = await supabase
      .from("intake_responses")
      .delete()
      .eq("user_id", user_id);
    if (intakeError) console.log("Intake responses delete error:", intakeError);

    // 9. Delete client messages
    const { error: messagesError } = await supabase
      .from("client_messages")
      .delete()
      .eq("user_id", user_id);
    if (messagesError) console.log("Client messages delete error:", messagesError);

    // 10. Delete conversation metadata
    const { error: conversationError } = await supabase
      .from("conversation_metadata")
      .delete()
      .eq("user_id", user_id);
    if (conversationError) console.log("Conversation metadata delete error:", conversationError);

    // 11. Delete services purchased
    const { error: servicesError } = await supabase
      .from("services_purchased")
      .delete()
      .eq("user_id", user_id);
    if (servicesError) console.log("Services purchased delete error:", servicesError);

    // 12. Delete client documents
    const { error: clientDocsError } = await supabase
      .from("client_documents")
      .delete()
      .eq("user_id", user_id);
    if (clientDocsError) console.log("Client documents delete error:", clientDocsError);

    // 13. Delete communication preferences
    const { error: commsError } = await supabase
      .from("client_communication_preferences")
      .delete()
      .eq("user_id", user_id);
    if (commsError) console.log("Communication preferences delete error:", commsError);

    // 14. Delete newsletter subscriber if exists
    const { error: newsletterError } = await supabase
      .from("newsletter_subscribers")
      .delete()
      .eq("user_id", user_id);
    if (newsletterError) console.log("Newsletter subscriber delete error:", newsletterError);

    // 15. Delete client profile
    const { error: profileError } = await supabase
      .from("client_profiles")
      .delete()
      .eq("user_id", user_id);
    if (profileError) console.log("Client profile delete error:", profileError);

    // 16. Delete gemini API usage
    const { error: geminiError } = await supabase
      .from("gemini_api_usage")
      .delete()
      .eq("user_id", user_id);
    if (geminiError) console.log("Gemini API usage delete error:", geminiError);

    // 17. Delete stripe subscriptions
    if (customerId) {
      const { error: subsError } = await supabase
        .from("stripe_subscriptions")
        .delete()
        .eq("customer_id", customerId);
      if (subsError) console.log("Stripe subscriptions delete error:", subsError);
    }

    // 18. Delete stripe orders
    if (customerId) {
      const { error: ordersError } = await supabase
        .from("stripe_orders")
        .delete()
        .eq("customer_id", customerId);
      if (ordersError) console.log("Stripe orders delete error:", ordersError);
    }

    // 19. Delete stripe customer
    const { error: stripeCustomerError } = await supabase
      .from("stripe_customers")
      .delete()
      .eq("user_id", user_id);
    if (stripeCustomerError) console.log("Stripe customer delete error:", stripeCustomerError);

    // 20. Delete generated documents files from storage
    const { data: buckets } = await supabase.storage.listBuckets();
    for (const bucket of buckets) {
      try {
        const { data: files } = await supabase.storage
          .from(bucket.name)
          .list(user_id);
        if (files && files.length > 0) {
          const filePaths = files.map((f) => `${user_id}/${f.name}`);
          await supabase.storage.from(bucket.name).remove(filePaths);
        }
      } catch {
        // Bucket may not have files for this user
      }
    }

    // 21. Finally, delete the auth user using admin API
    const { error: authError } = await supabase.auth.admin.deleteUser(user_id);
    if (authError) {
      console.error("Failed to delete auth user:", authError);
      return new Response(
        JSON.stringify({ error: "Failed to delete user account" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Successfully deleted account for user: ${user_id}`);

    return new Response(
      JSON.stringify({ success: true, message: "Account deleted successfully" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Delete account error:", error);
    const message = error instanceof Error ? error.message : "Failed to delete account";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
