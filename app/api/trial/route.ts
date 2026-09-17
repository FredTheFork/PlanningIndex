import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/server/db';
import { getSessionUser, unauthorized, upsertSubscription, isSubscriptionActive } from '@/lib/server/auth';

const TRIAL_DAYS = 14;

/**
 * Starts a 14-day free trial — full product access, no card required.
 * One trial per user, and only when they have no active membership.
 * Access expires automatically: `isSubscriptionActive()` treats a trialing
 * subscription past `currentPeriodEnd` as inactive.
 */
export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    if (!user) return unauthorized();

    const db = await getDb();
    if (db.subscriptions.some((s) => s.userId === user.id && s.planTier === 'trial')) {
      return NextResponse.json(
        { error: 'You have already used your free trial.' },
        { status: 400 }
      );
    }

    const active = db.subscriptions.find(
      (s) => s.userId === user.id && isSubscriptionActive(s)
    );
    if (active) {
      return NextResponse.json(
        { error: 'You already have an active plan.' },
        { status: 400 }
      );
    }

    await upsertSubscription(user.id, 'trial', 'monthly', 'trialing', TRIAL_DAYS);
    return NextResponse.json({ url: '/app' });
  } catch {
    return NextResponse.json(
      { error: 'Failed to start trial. Please try again.' },
      { status: 500 }
    );
  }
}
