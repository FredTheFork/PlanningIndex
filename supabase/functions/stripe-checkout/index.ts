import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import Stripe from 'npm:stripe@17.7.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

function getStripeClient(mode: string): Stripe {
  const key = mode === 'live'
    ? Deno.env.get('STRIPE_SECRET_KEY_LIVE') ?? Deno.env.get('STRIPE_SECRET_KEY')!
    : Deno.env.get('STRIPE_SECRET_KEY')!;
  return new Stripe(key, {
    appInfo: {
      name: 'Foundationary',
      version: '1.0.0',
    },
  });
}

// ── Service catalog (mirrors lib/services/service-catalog.ts) ──
// Must be defined here because edge functions cannot import from the Next.js app.

interface ServiceEntry {
  id: string;
  stripeProductIds: { test: string; live: string };
  stripePriceIds: { test: string; live: string };
  mode: 'payment' | 'subscription';
  price: number;
  isCore: boolean;
  discountWhenBundledWith?: { serviceId: string; amountOff: number }[];
}

const SERVICE_CATALOG: ServiceEntry[] = [
  {
    id: 'business_foundations_pack',
    stripeProductIds: { test: 'prod_UdvhNsQZM3C2RL', live: 'prod_UdvhNsQZM3C2RL' },
    stripePriceIds: {
      test: 'price_1TZc9UGfxcDbzGRtniOLIJLE',
      live: 'price_1TX34AGfxcDbzGRtxVtQN95g',
    },
    mode: 'payment',
    price: 7900,
    isCore: true,
    discountWhenBundledWith: [
      { serviceId: 'website_copy_pack', amountOff: 900 },
      { serviceId: 'social_media_pack', amountOff: 900 },
    ],
  },
  {
    id: 'website_copy_pack',
    stripeProductIds: { test: 'prod_UdvhNsQZM3C2RL', live: 'prod_UdvhNsQZM3C2RL' },
    stripePriceIds: {
      test: '',
      live: '',
    },
    mode: 'payment',
    price: 4900,
    isCore: false,
    discountWhenBundledWith: [
      { serviceId: 'business_foundations_pack', amountOff: 900 },
    ],
  },
  {
    id: 'social_media_pack',
    stripeProductIds: { test: 'prod_UdvoYyIfAtIHjh', live: 'prod_UdvoYyIfAtIHjh' },
    stripePriceIds: {
      test: '',
      live: '',
    },
    mode: 'payment',
    price: 2000,
    isCore: false,
    discountWhenBundledWith: [
      { serviceId: 'business_foundations_pack', amountOff: 900 },
    ],
  },
  {
    id: 'quarterly_refresh',
    stripeProductIds: { test: 'prod_UdvqABMskIHzzZ', live: 'prod_UdvqABMskIHzzZ' },
    stripePriceIds: {
      test: '',
      live: '',
    },
    mode: 'subscription',
    price: 2900,
    isCore: false,
  },
];

function getService(id: string): ServiceEntry | undefined {
  return SERVICE_CATALOG.find((s) => s.id === id);
}

function calculateBundleDiscount(serviceIds: string[]): number {
  const processedPairs = new Set<string>();
  let total = 0;
  for (const id of serviceIds) {
    const service = getService(id);
    if (!service?.discountWhenBundledWith) continue;
    for (const bundle of service.discountWhenBundledWith) {
      if (serviceIds.includes(bundle.serviceId)) {
        const pairKey = [id, bundle.serviceId].sort().join(':');
        if (!processedPairs.has(pairKey)) {
          processedPairs.add(pairKey);
          total += bundle.amountOff;
        }
      }
    }
  }
  return total;
}

/**
 * Resolve a price ID for a service.
 * Uses the hardcoded price ID if available and valid.
 * Falls back to looking up the active price for the product via Stripe API.
 */
async function resolvePriceId(
  stripe: Stripe,
  serviceId: string,
  mode: string,
): Promise<string> {
  const service = getService(serviceId);
  if (!service) throw new Error(`Unknown service: ${serviceId}`);

  // Try the hardcoded price ID first
  const hardcodedPriceId = service.stripePriceIds[mode as 'test' | 'live'] ?? service.stripePriceIds.test;
  if (hardcodedPriceId) {
    try {
      const price = await stripe.prices.retrieve(hardcodedPriceId);
      if (price.active) return hardcodedPriceId;
    } catch {
      // Price ID doesn't exist — fall through to dynamic lookup
    }
  }

  // Dynamic lookup: find an active price for this product
  const productId = service.stripeProductIds[mode as 'test' | 'live'] ?? service.stripeProductIds.test;
  const prices = await stripe.prices.list({
    product: productId,
    active: true,
    limit: 1,
  });

  if (prices.data.length === 0) {
    throw new Error(`No active price found for product ${productId} (service: ${serviceId})`);
  }

  return prices.data[0].id;
}

Deno.serve(async (req) => {
  try {
    if (req.method === 'OPTIONS') {
      return new Response(null, { status: 200, headers: corsHeaders });
    }

    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const body = await req.json();
    const {
      service_ids,
      success_url,
      cancel_url,
      mode: requestedMode,
      // Backward compat: old checkout sends price_id + add_ons
      price_id,
      add_ons,
    } = body;

    if (!success_url || !cancel_url) {
      return new Response(JSON.stringify({ error: 'Missing required parameters: success_url, cancel_url' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const stripeMode = requestedMode === 'live' ? 'live' : 'test';
    const stripe = getStripeClient(stripeMode);

    // ── Determine which services are being purchased ──

    let selectedServiceIds: string[];

    if (service_ids && Array.isArray(service_ids) && service_ids.length > 0) {
      // New flow: explicit service IDs
      selectedServiceIds = service_ids;
    } else if (price_id) {
      // Legacy flow: single price_id + optional add_ons
      const coreService = SERVICE_CATALOG.find(
        (s) => s.stripePriceIds.test === price_id || s.stripePriceIds.live === price_id,
      );
      selectedServiceIds = coreService ? [coreService.id] : ['business_foundations_pack'];

      if (add_ons && Array.isArray(add_ons)) {
        const addOnMapping: Record<string, string> = {
          'website-copy': 'website_copy_pack',
          'social-media': 'social_media_pack',
          'quarterly-refresh': 'quarterly_refresh',
        };
        for (const addOnId of add_ons) {
          const mapped = addOnMapping[addOnId] ?? addOnId;
          if (!selectedServiceIds.includes(mapped)) {
            selectedServiceIds.push(mapped);
          }
        }
      }
    } else {
      return new Response(JSON.stringify({ error: 'Missing service_ids or price_id' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Validate all service IDs
    for (const sid of selectedServiceIds) {
      if (!getService(sid)) {
        return new Response(JSON.stringify({ error: `Unknown service: ${sid}` }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    // ── Resolve price IDs and build line items ──

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    for (const serviceId of selectedServiceIds) {
      const priceId = await resolvePriceId(stripe, serviceId, stripeMode);
      lineItems.push({
        price: priceId,
        quantity: 1,
      });
    }

    // ── Calculate bundle discounts ──

    const discountAmount = calculateBundleDiscount(selectedServiceIds);
    const discounts: Stripe.Checkout.SessionCreateParams.Discount[] = [];

    if (discountAmount > 0) {
      const discountAmountGBP = discountAmount / 100;
      const serviceNames: Record<string, string> = {
        business_foundations_pack: 'Docs',
        website_copy_pack: 'Website Copy',
        social_media_pack: 'Social Media',
        quarterly_refresh: 'Quarterly Refresh',
      };
      let couponName: string;
      if (selectedServiceIds.length >= 3) {
        couponName = `3-Service Bundle — Save £${discountAmountGBP}`;
      } else {
        const names = selectedServiceIds.map((id) => serviceNames[id] ?? id);
        couponName = `${names.join(' + ')} Bundle — Save £${discountAmountGBP}`;
      }
      const coupon = await stripe.coupons.create({
        amount_off: discountAmount,
        currency: 'gbp',
        duration: 'once',
        name: couponName,
      });
      discounts.push({ coupon: coupon.id });
    }

    // ── Determine checkout mode ──

    const hasSubscription = selectedServiceIds.some(
      (id) => getService(id)?.mode === 'subscription',
    );
    const hasPayment = selectedServiceIds.some(
      (id) => getService(id)?.mode === 'payment',
    );

    // If mixing payment + subscription, use subscription mode.
    // One-time items are charged as the first invoice alongside the subscription.
    const checkoutMode: 'payment' | 'subscription' = hasSubscription ? 'subscription' : 'payment';

    // ── Create checkout session ──

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: checkoutMode,
      payment_method_types: ['card'],
      line_items: lineItems,
      discounts: discounts.length > 0 ? discounts : undefined,
      customer_creation: 'always',
      success_url,
      cancel_url,
      metadata: {
        service_ids: selectedServiceIds.join(','),
      },
    };

    const session = await stripe.checkout.sessions.create(sessionParams);

    console.log(
      `Created checkout session ${session.id} (mode: ${stripeMode}, services: ${selectedServiceIds.join(',')}, discount: ${discountAmount})`,
    );

    return new Response(
      JSON.stringify({ sessionId: session.id, url: session.url }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  } catch (error: any) {
    console.error(`Checkout error: ${error.message}`);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
