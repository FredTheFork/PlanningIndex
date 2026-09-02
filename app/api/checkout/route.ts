import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getStripeClient, isStripeConfigured, getStripePriceId, type BillingCycle, type PlanTier } from '@/lib/stripe';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://planningindex.co.uk';

export async function POST(req: NextRequest) {
  try {
    if (!isStripeConfigured()) {
      return NextResponse.json(
        { error: 'Payments are not yet configured. Please contact support to complete your subscription setup.' },
        { status: 503 }
      );
    }

    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await req.json();
    const { tier, cycle } = body as { tier: PlanTier; cycle: BillingCycle };

    if (!tier || !cycle) {
      return NextResponse.json({ error: 'Plan tier and billing cycle are required' }, { status: 400 });
    }

    if (tier === 'enterprise') {
      return NextResponse.json({ url: '/contact' });
    }

    const priceId = getStripePriceId(tier, cycle);
    if (!priceId) {
      return NextResponse.json(
        { error: `No Stripe price configured for the ${tier} plan (${cycle}). Please contact support.` },
        { status: 503 }
      );
    }

    const stripe = getStripeClient();

    const { data: customerData } = await supabase
      .from('customers')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .maybeSingle();

    let customerId = customerData?.stripe_customer_id;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email || undefined,
        metadata: { supabase_user_id: user.id },
      });
      customerId = customer.id;

      await supabase.from('customers').upsert({
        user_id: user.id,
        stripe_customer_id: customerId,
      });
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${SITE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}/checkout/cancelled`,
      metadata: {
        supabase_user_id: user.id,
        plan_tier: tier,
        billing_cycle: cycle,
      },
      subscription_data: {
        metadata: {
          supabase_user_id: user.id,
          plan_tier: tier,
          billing_cycle: cycle,
        },
      },
      allow_promotion_codes: true,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to create checkout session';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
