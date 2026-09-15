import { NextRequest, NextResponse } from 'next/server';
import { getDb, saveDb, newId } from '@/lib/server/db';
import { getSessionUser, unauthorized, upsertSubscription } from '@/lib/server/auth';
import { getStripeClient, isStripeConfigured, getStripePriceId, type BillingCycle, type PlanTier } from '@/lib/stripe';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://planningindex.co.uk';

export async function POST(req: NextRequest) {
  try {
    const user = getSessionUser(req);
    if (!user) return unauthorized();

    const body = await req.json();
    const { tier, cycle } = body as { tier: PlanTier; cycle: BillingCycle };

    if (!tier || !cycle) {
      return NextResponse.json({ error: 'Plan tier and billing cycle are required' }, { status: 400 });
    }

    if (tier === 'enterprise') {
      return NextResponse.json({ url: '/contact' });
    }

    // Local mode: Stripe is not configured, so membership is activated directly
    // by the backend (development / self-hosted flow).
    if (!isStripeConfigured()) {
      upsertSubscription(user.id, tier, cycle);
      return NextResponse.json({ url: '/checkout/success', dev: true });
    }

    const priceId = getStripePriceId(tier, cycle);
    if (!priceId) {
      return NextResponse.json(
        { error: `No Stripe price configured for the ${tier} plan (${cycle}). Please contact support.` },
        { status: 503 }
      );
    }

    const stripe = getStripeClient();

    const db = getDb();
    let subscription = db.subscriptions.find((s) => s.userId === user.id && s.status !== 'canceled');
    if (!subscription) {
      subscription = {
        id: newId(),
        userId: user.id,
        planTier: tier,
        billingCycle: cycle,
        status: 'active',
        currentPeriodEnd: new Date().toISOString(),
        cancelAtPeriodEnd: false,
      };
      db.subscriptions.push(subscription);
    }
    if (!subscription.stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email || undefined,
        metadata: { user_id: user.id },
      });
      subscription.stripeCustomerId = customer.id;
      saveDb();
    }

    const session = await stripe.checkout.sessions.create({
      customer: subscription.stripeCustomerId,
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${SITE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}/checkout/cancelled`,
      metadata: {
        user_id: user.id,
        plan_tier: tier,
        billing_cycle: cycle,
      },
      subscription_data: {
        metadata: {
          user_id: user.id,
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
