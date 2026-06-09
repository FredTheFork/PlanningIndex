import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import Stripe from "https://esm.sh/stripe@14.14.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

// Service catalog - matching service-catalog.ts
interface ServiceConfig {
  id: string;
  name: string;
  priceIds: { test: string; live: string };
  mode: 'payment' | 'subscription';
}

const SERVICES: ServiceConfig[] = [
  {
    id: 'business_foundations_pack',
    name: 'Business Foundations Pack',
    priceIds: {
      test: 'price_1TZc9UGfxcDbzGRtniOLIJLE',
      live: 'price_1TX34AGfxcDbzGRtxVtQN95g',
    },
    mode: 'payment',
  },
  {
    id: 'website_copy_pack',
    name: 'Website Copy Starter Pack',
    priceIds: {
      test: 'price_1TfnutGfxcDbzGRtr7kC2XcM',
      live: '',
    },
    mode: 'payment',
  },
  {
    id: 'social_media_pack',
    name: 'Social Media Starter Pack',
    priceIds: {
      test: 'price_1Tfo0mGfxcDbzGRtHqF3MmVv',
      live: '',
    },
    mode: 'payment',
  },
  {
    id: 'quarterly_refresh',
    name: 'Quarterly Document Refresh',
    priceIds: {
      test: 'price_1TgSI7GfxcDbzGRtm9vf0YRM',
      live: '',
    },
    mode: 'subscription',
  },
];

function getServiceConfig(serviceId: string): ServiceConfig | undefined {
  return SERVICES.find(s => s.id === serviceId);
}

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
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      throw new Error("STRIPE_SECRET_KEY not configured");
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: "2023-10-16",
    });

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parse request body
    const body = await req.json();
    const { service_ids, mode, success_url, cancel_url } = body;

    if (!service_ids || !Array.isArray(service_ids) || service_ids.length === 0) {
      return new Response(
        JSON.stringify({ error: "No services selected" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate services and get their price IDs
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
    const subscriptionItems: Stripe.Checkout.SessionCreateParams.SubscriptionData.Item[] = [];
    const validatedServiceIds: string[] = [];

    for (const serviceId of service_ids) {
      const service = getServiceConfig(serviceId);
      if (!service) {
        return new Response(
          JSON.stringify({ error: `Service ${serviceId} is not yet available for purchase. Please contact support.` }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const priceId = mode === 'live' ? service.priceIds.live : service.priceIds.test;
      if (!priceId) {
        return new Response(
          JSON.stringify({ error: `Service ${serviceId} is not yet available for purchase. Please contact support.` }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      validatedServiceIds.push(serviceId);

      if (service.mode === 'payment') {
        lineItems.push({
          price: priceId,
          quantity: 1,
        });
      } else if (service.mode === 'subscription') {
        subscriptionItems.push({
          price: priceId,
          quantity: 1,
        });
      }
    }

    // Determine checkout mode
    const hasPayment = lineItems.length > 0;
    const hasSubscription = subscriptionItems.length > 0;

    let checkoutMode: 'payment' | 'subscription' = 'payment';
    if (hasSubscription && !hasPayment) {
      checkoutMode = 'subscription';
    }

    // Create checkout session
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: checkoutMode,
      success_url: success_url || `${req.headers.get("origin")}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancel_url || `${req.headers.get("origin")}/checkout`,
      metadata: {
        service_ids: validatedServiceIds.join(","),
      },
      custom_text: {
        submit: {
          message: "Your documents will be prepared after checkout. Complete the intake form to get started.",
        },
      },
    };

    // Add line items for one-time payments
    if (hasPayment) {
      sessionParams.line_items = lineItems;
    }

    // Add subscription data if we have subscriptions
    if (hasSubscription) {
      if (hasPayment) {
        // Mix of payment and subscription - Stripe handles this via invoice items
        // We'll create the subscription and add one-time items separately
        sessionParams.mode = 'subscription';
        sessionParams.subscription_data = {
          items: subscriptionItems,
        };
        // Add invoice items for one-time payments that will be charged with first invoice
        sessionParams.invoice_creation = {
          enabled: true,
        };
        sessionParams.line_items = lineItems;
      } else {
        // Only subscription
        sessionParams.subscription_data = {
          items: subscriptionItems,
        };
      }
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    return new Response(
      JSON.stringify({ url: session.url, session_id: session.id }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Stripe checkout error:", error);
    const message = error instanceof Error ? error.message : "Checkout failed";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
