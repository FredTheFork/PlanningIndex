import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import Stripe from "https://esm.sh/stripe@14.14.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

// Pricing tiers for social media pack
const SOCIAL_MEDIA_PRICING_TIERS: Record<number, { test: string; live: string }> = {
  5: { test: 'price_1TgTD4GfxcDbzGRtwfjjKSc9', live: '' },
  10: { test: 'price_1TgT9eGfxcDbzGRtZFH9msuO', live: '' },
  15: { test: 'price_1TgTAGGfxcDbzGRtYvH7lEYi', live: '' },
  20: { test: 'price_1TgTAZGfxcDbzGRt6ehHzu2X', live: '' },
  25: { test: 'price_1TgTAwGfxcDbzGRtBoXaKI19', live: '' },
  30: { test: 'price_1TgTCpGfxcDbzGRtmaTlfkcF', live: '' },
};

// Pricing tiers for website copy pack (per page)
const WEBSITE_PAGE_PRICING_TIERS: Record<number, { test: string; live: string }> = {
  1: { test: 'price_1TshkCGfxcDbzGRtDummy1', live: '' },
  2: { test: 'price_1TshkCGfxcDbzGRtDummy2', live: '' },
  3: { test: 'price_1TshkCGfxcDbzGRtDummy3', live: '' },
  4: { test: 'price_1TshkCGfxcDbzGRtDummy4', live: '' },
  5: { test: 'price_1TshkCGfxcDbzGRtDummy5', live: '' },
  6: { test: 'price_1TshkCGfxcDbzGRtDummy6', live: '' },
  7: { test: 'price_1TshkCGfxcDbzGRtDummy7', live: '' },
  8: { test: 'price_1TshkCGfxcDbzGRtDummy8', live: '' },
  9: { test: 'price_1TshkCGfxcDbzGRtDummy9', live: '' },
  10: { test: 'price_1TshkCGfxcDbzGRtDummy10', live: '' },
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
      test: 'price_1TgSEkGfxcDbzGRtDaBz70tR',
      live: '',
    },
    mode: 'payment',
  },
  {
    id: 'social_media_pack',
    name: 'Social Media Starter Pack',
    priceIds: {
      test: 'price_1TgTD4GfxcDbzGRtwfjjKSc9', // 30 posts default
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

function getSocialMediaPriceId(postCount: number, mode: 'test' | 'live'): string | undefined {
  const tier = SOCIAL_MEDIA_PRICING_TIERS[postCount];
  if (!tier) return undefined;
  return tier[mode];
}

function getWebsiteCopyPriceId(pageCount: number, mode: 'test' | 'live'): string | undefined {
  const tier = WEBSITE_PAGE_PRICING_TIERS[pageCount];
  if (!tier) return undefined;
  return tier[mode];
}

function getBundleDiscountPercentage(serviceCount: number): number {
  if (serviceCount >= 3) return 15;
  if (serviceCount >= 2) return 10;
  return 0;
}

// Cache for coupon IDs to avoid recreating
const couponCache: Record<string, string> = {};

async function getOrCreateCoupon(
  stripe: Stripe,
  percentage: number
): Promise<string> {
  const cacheKey = `bundle_${percentage}`;

  if (couponCache[cacheKey]) {
    return couponCache[cacheKey];
  }

  // Try to find existing coupon first
  const existingCoupons = await stripe.coupons.list({
    limit: 100,
  });

  const existing = existingCoupons.data.find(
    (c) => c.name === `Bundle ${percentage}% Discount` && c.valid
  );

  if (existing) {
    couponCache[cacheKey] = existing.id;
    return existing.id;
  }

  // Create new coupon
  const coupon = await stripe.coupons.create({
    percent_off: percentage,
    duration: 'once',
    name: `Bundle ${percentage}% Discount`,
    metadata: {
      type: 'bundle_discount',
      percentage: percentage.toString(),
    },
  });

  couponCache[cacheKey] = coupon.id;
  return coupon.id;
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  // GET: Retrieve session details (for success page)
  if (req.method === "GET") {
    return handleGetSession(req);
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
    const {
      service_ids,
      mode,
      success_url,
      cancel_url,
      social_media_post_count,
      website_page_count,
      website_pages_selected
    } = body;

    if (!service_ids || !Array.isArray(service_ids) || service_ids.length === 0) {
      return new Response(
        JSON.stringify({ error: "No services selected" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate services and get their price IDs
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
    const validatedServiceIds: string[] = [];
    let hasSubscription = false;

    for (const serviceId of service_ids) {
      const service = getServiceConfig(serviceId);
      if (!service) {
        return new Response(
          JSON.stringify({ error: `Service ${serviceId} is not yet available for purchase. Please contact support.` }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      let priceId: string | undefined;

      // Handle social media quantity-based pricing
      if (serviceId === 'social_media_pack' && social_media_post_count) {
        priceId = getSocialMediaPriceId(social_media_post_count, mode || 'test');
        if (!priceId) {
          return new Response(
            JSON.stringify({ error: `Social media pack with ${social_media_post_count} posts is not yet available. Please contact support.` }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      } else if (serviceId === 'website_copy_pack' && website_page_count) {
        // Handle website copy page-based pricing
        priceId = getWebsiteCopyPriceId(website_page_count, mode || 'test');
        if (!priceId) {
          return new Response(
            JSON.stringify({ error: `Website copy pack with ${website_page_count} pages is not yet available. Please contact support.` }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      } else {
        priceId = mode === 'live' ? service.priceIds.live : service.priceIds.test;
      }

      if (!priceId) {
        return new Response(
          JSON.stringify({ error: `Service ${serviceId} is not yet available for purchase. Please contact support.` }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      validatedServiceIds.push(serviceId);

      // All items go into line_items, regardless of payment or subscription mode
      lineItems.push({
        price: priceId,
        quantity: 1,
      });

      if (service.mode === 'subscription') {
        hasSubscription = true;
      }
    }

    // Determine checkout mode - subscription mode if any subscription item is present
    const checkoutMode: 'payment' | 'subscription' = hasSubscription ? 'subscription' : 'payment';

    // Calculate bundle discount
    const discountPercentage = getBundleDiscountPercentage(service_ids.length);

    // Build metadata with social media post count and website pages if applicable
    const metadata: Record<string, string> = {
      service_ids: validatedServiceIds.join(","),
    };
    if (social_media_post_count) {
      metadata.social_media_post_count = social_media_post_count.toString();
    }
    if (website_page_count) {
      metadata.website_page_count = website_page_count.toString();
    }
    if (website_pages_selected && Array.isArray(website_pages_selected)) {
      metadata.website_pages_selected = website_pages_selected.join(",");
    }

    // Create checkout session
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: checkoutMode,
      success_url: success_url || `${req.headers.get("origin")}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancel_url || `${req.headers.get("origin")}/checkout`,
      metadata,
      custom_text: {
        submit: {
          message: "Your documents will be prepared after checkout. Complete the intake form to get started.",
        },
      },
      line_items: lineItems,
    };

    // Apply bundle discount coupon if applicable
    if (discountPercentage > 0) {
      try {
        const couponId = await getOrCreateCoupon(stripe, discountPercentage);
        sessionParams.discounts = [
          {
            coupon: couponId,
          },
        ];
      } catch (couponError) {
        console.error("Failed to create coupon, proceeding without discount:", couponError);
        // Continue without discount if coupon creation fails
      }
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    return new Response(
      JSON.stringify({
        url: session.url,
        session_id: session.id,
        discount_applied: discountPercentage > 0 ? `${discountPercentage}% bundle discount` : null,
      }),
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

async function handleGetSession(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const sessionId = url.searchParams.get("session_id");

  if (!sessionId) {
    return new Response(
      JSON.stringify({ error: "Missing session_id" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
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

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    const serviceIdsStr = session.metadata?.service_ids || "";
    const serviceIds = serviceIdsStr ? serviceIdsStr.split(",").filter(Boolean) : [];
    const email = session.customer_details?.email || session.customer_email || null;

    return new Response(
      JSON.stringify({
        email,
        service_ids: serviceIds,
        mode: session.mode,
        payment_status: session.payment_status,
        customer_id: session.customer,
        subscription_id: session.subscription,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error retrieving session:", error);
    const message = error instanceof Error ? error.message : "Failed to retrieve session";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
}
