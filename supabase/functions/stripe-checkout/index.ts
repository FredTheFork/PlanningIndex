import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import Stripe from "https://esm.sh/stripe@14.14.0";

// VERSION: v3-care-plan-fix-2026-07-07T15:45:00Z
console.log('[INIT] stripe-checkout edge function loaded - v3-care-plan-fix');

// Local service tier/industry metadata — mirrors SERVICE_META from stripe-webhook
// and service-catalog.ts for use in edge function
interface ServiceTierMeta {
  tier: 'foundation' | 'operations' | 'industry';
  industry: 'coach' | 'photographer' | 'consultant' | 'contractor' | null;
}

const SERVICE_TIER_META: Record<string, ServiceTierMeta> = {
  business_foundations_pack: { tier: 'foundation', industry: null },
  website_copy_pack: { tier: 'foundation', industry: null },
  social_media_pack: { tier: 'foundation', industry: null },
  monthly_care_plan: { tier: 'foundation', industry: null },
  quarterly_refresh: { tier: 'foundation', industry: null },
  client_onboarding_pack: { tier: 'operations', industry: null },
  payment_protection_pack: { tier: 'operations', industry: null },
  copyright_licensing_pack: { tier: 'operations', industry: null },
  gdpr_deep_pack: { tier: 'operations', industry: null },
  coach_industry_pack: { tier: 'industry', industry: 'coach' },
  photographer_industry_pack: { tier: 'industry', industry: 'photographer' },
  consultant_industry_pack: { tier: 'industry', industry: 'consultant' },
  contractor_industry_pack: { tier: 'industry', industry: 'contractor' },
};

function getHighestTier(serviceIds: string[]): 'foundation' | 'operations' | 'industry' {
  const tiers = serviceIds.map(id => SERVICE_TIER_META[id]?.tier).filter(Boolean);
  if (tiers.includes('industry')) return 'industry';
  if (tiers.includes('operations')) return 'operations';
  return 'foundation';
}

function getPrimaryIndustry(serviceIds: string[]): string | null {
  const industryService = serviceIds.find(id => SERVICE_TIER_META[id]?.industry);
  return industryService ? SERVICE_TIER_META[industryService].industry : null;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

// Modular care plan pricing tiers (v3 - deployed 2026-07-07T15:30:00Z)
// Essentials: £19/mo | Standard: £29/mo | Complete: £49/mo
// Product: prod_UfntRYA1SkzyAD
const CARE_PLAN_PRICING_TIERS: Record<string, { test: string; live: string }> = {
  essentials: { test: 'price_1TqbeiGfxcDbzGRtlwAhDA7i', live: '' },
  standard: { test: 'price_1TjIl9GfxcDbzGRtgZxMzBWo', live: '' },
  complete: { test: 'price_1TqbeiGfxcDbzGRt3pvHkD4h', live: '' },
};

function getCarePlanPriceId(tierId: string, mode: 'test' | 'live'): string | undefined {
  const tier = CARE_PLAN_PRICING_TIERS[tierId];
  if (!tier) return undefined;
  return tier[mode];
}

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
  1: { test: 'price_1TgXZQGfxcDbzGRtkovnGBSm', live: '' },
  2: { test: 'price_1TgXZYGfxcDbzGRtnokfBuT3', live: '' },
  3: { test: 'price_1TgXa9GfxcDbzGRtcQYtwDeI', live: '' },
  4: { test: 'price_1TgXbFGfxcDbzGRtuRAV2SGv', live: '' },
  5: { test: 'price_1TgSEkGfxcDbzGRtDaBz70tR', live: '' },
  6: { test: 'price_1TgXbQGfxcDbzGRteGhQeYwJ', live: '' },
  7: { test: 'price_1TgXbZGfxcDbzGRtjlm9GL6Z', live: '' },
  8: { test: 'price_1TgXbhGfxcDbzGRtlqg1FHhk', live: '' },
  9: { test: 'price_1TgXbxGfxcDbzGRtnTF07CE2', live: '' },
  10: { test: 'price_1TgXc3GfxcDbzGRtHs7m8tou', live: '' },
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
      live: '',
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
      test: 'price_1TjIl9GfxcDbzGRtgZxMzBWo',
      live: '',
    },
    mode: 'subscription',
  },
  {
    id: 'monthly_care_plan',
    name: 'Monthly Care Plan',
    priceIds: {
      test: 'price_1TjIl9GfxcDbzGRtgZxMzBWo',
      live: '',
    },
    mode: 'subscription',
  },
  {
    id: 'client_onboarding_pack',
    name: 'Client Onboarding & Scope Control Pack',
    priceIds: {
      test: 'price_1TjIeAGfxcDbzGRtAdPjogwV',
      live: '',
    },
    mode: 'payment',
  },
  {
    id: 'payment_protection_pack',
    name: 'Payment Protection Pack',
    priceIds: {
      test: 'price_1TjIf6GfxcDbzGRtv843ka5P',
      live: '',
    },
    mode: 'payment',
  },
  {
    id: 'copyright_licensing_pack',
    name: 'Copyright & Licensing Pack',
    priceIds: {
      test: 'price_1TjIfpGfxcDbzGRt1rBiLXqC',
      live: '',
    },
    mode: 'payment',
  },
  {
    id: 'gdpr_deep_pack',
    name: 'GDPR & Data Retention Deep Pack',
    priceIds: {
      test: 'price_1TjIgyGfxcDbzGRt3O0f8wmM',
      live: '',
    },
    mode: 'payment',
  },
  {
    id: 'coach_industry_pack',
    name: 'Coach Industry Pack',
    priceIds: {
      test: 'price_1TjIhfGfxcDbzGRtWDo6RyZ6',
      live: '',
    },
    mode: 'payment',
  },
  {
    id: 'photographer_industry_pack',
    name: 'Photographer Industry Pack',
    priceIds: {
      test: 'price_1TjIiFGfxcDbzGRt74btRoIa',
      live: '',
    },
    mode: 'payment',
  },
  {
    id: 'consultant_industry_pack',
    name: 'Consultant Industry Pack',
    priceIds: {
      test: 'price_1TjIj6GfxcDbzGRtazMtGvDM',
      live: '',
    },
    mode: 'payment',
  },
  {
    id: 'contractor_industry_pack',
    name: 'Contractor Industry Pack',
    priceIds: {
      test: 'price_1TjIjmGfxcDbzGRtDlS8hipL',
      live: '',
    },
    mode: 'payment',
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

function getBundleDiscountPercentage(serviceCount: number, groupDiscountPercent?: number): number {
  const countBased = serviceCount >= 3 ? 15 : serviceCount >= 2 ? 10 : 0;
  if (groupDiscountPercent !== undefined) return Math.max(countBased, groupDiscountPercent);
  return countBased;
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
    console.log('[DEBUG] Received request body:', JSON.stringify(body));
    const {
      service_ids,
      mode,
      success_url,
      cancel_url,
      social_media_post_count,
      website_page_count,
      website_pages_selected,
      group_id,
      group_discount_percent,
      care_plan_tier_id,
    } = body;
    console.log(`[DEBUG] Parsed care_plan_tier_id: ${care_plan_tier_id}, mode: ${mode}`);

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
      } else if (serviceId === 'monthly_care_plan') {
        // Handle modular care plan tier pricing
        const tierId = care_plan_tier_id || 'standard';
        priceId = getCarePlanPriceId(tierId, mode || 'test');
        console.log(`[DEBUG] Care plan tier: ${tierId}, mode: ${mode}, priceId: ${priceId}`);
        console.log(`[DEBUG] CARE_PLAN_PRICING_TIERS:`, JSON.stringify(CARE_PLAN_PRICING_TIERS));
        if (!priceId || priceId.startsWith('REPLACE_WITH')) {
          return new Response(
            JSON.stringify({ error: `Care plan tier "${tierId}" is not yet configured. Please contact support.` }),
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

    // Calculate bundle discount — use group discount if provided, otherwise count-based
    const discountPercentage = getBundleDiscountPercentage(service_ids.length, group_discount_percent);

    // Compute tier and industry for metadata
    const highestTier = getHighestTier(validatedServiceIds);
    const primaryIndustry = getPrimaryIndustry(validatedServiceIds);

    // Build metadata with social media post count and website pages if applicable
    const metadata: Record<string, string> = {
      service_ids: validatedServiceIds.join(","),
      tier: highestTier,
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
    if (group_id) {
      metadata.group_id = group_id;
    }
    if (care_plan_tier_id && service_ids.includes('monthly_care_plan')) {
      metadata.care_plan_tier_id = care_plan_tier_id;
    }
    if (primaryIndustry) {
      metadata.industry = primaryIndustry;
    }
    if (discountPercentage > 0) {
      metadata.bundle_discount_percent = discountPercentage.toString();
      metadata.is_bundle = (service_ids.length > 1).toString();
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

    const websitePagesSelected = session.metadata?.website_pages_selected
      ? session.metadata.website_pages_selected.split(",").filter(Boolean)
      : null;
    const websitePageCount = session.metadata?.website_page_count
      ? parseInt(session.metadata.website_page_count, 10)
      : null;
    const socialMediaPostCount = session.metadata?.social_media_post_count
      ? parseInt(session.metadata.social_media_post_count, 10)
      : null;
    const groupId = session.metadata?.group_id || null;
    const tier = session.metadata?.tier || 'foundation';
    const industry = session.metadata?.industry || null;

    return new Response(
      JSON.stringify({
        email,
        service_ids: serviceIds,
        mode: session.mode,
        payment_status: session.payment_status,
        customer_id: session.customer,
        subscription_id: session.subscription,
        website_pages_selected: websitePagesSelected,
        website_page_count: websitePageCount,
        social_media_post_count: socialMediaPostCount,
        group_id: groupId,
        tier,
        industry,
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
