import { NextRequest, NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/server/db';
import { getSessionUser, unauthorized } from '@/lib/server/auth';
import { getStripeClient, isStripeConfigured } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  try {
    const user = getSessionUser(req);
    if (!user) return unauthorized();

    const db = getDb();
    const subscription = db.subscriptions.find((s) => s.userId === user.id && s.status !== 'canceled');
    if (!subscription) {
      return NextResponse.json({ error: 'No active subscription found.' }, { status: 404 });
    }

    // Local mode: cancel at period end without Stripe.
    if (!isStripeConfigured() || !subscription.stripeSubscriptionId) {
      subscription.cancelAtPeriodEnd = true;
      saveDb();
      return NextResponse.json({ success: true });
    }

    const stripe = getStripeClient();
    await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      cancel_at_period_end: true,
    });

    subscription.cancelAtPeriodEnd = true;
    saveDb();

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to cancel subscription';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
