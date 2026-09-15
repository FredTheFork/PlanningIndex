import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/server/db';
import { getSessionUser, unauthorized } from '@/lib/server/auth';
import { getStripeClient, isStripeConfigured } from '@/lib/stripe';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://planningindex.co.uk';

export async function POST(req: NextRequest) {
  try {
    const user = getSessionUser(req);
    if (!user) return unauthorized();

    // Local mode: manage the plan by choosing a new one.
    if (!isStripeConfigured()) {
      return NextResponse.json({ url: '/choose-plan?manage=1' });
    }

    const db = getDb();
    const subscription = db.subscriptions.find((s) => s.userId === user.id && s.status !== 'canceled');
    if (!subscription?.stripeCustomerId) {
      return NextResponse.json(
        { error: 'No subscription found. Please choose a plan first.' },
        { status: 404 }
      );
    }

    const stripe = getStripeClient();
    const session = await stripe.billingPortal.sessions.create({
      customer: subscription.stripeCustomerId,
      return_url: `${SITE_URL}/account/billing`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to create portal session';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
