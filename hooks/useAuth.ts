'use client';

import { useState, useEffect, useCallback } from 'react';
import { getSession, type SessionContext, type AuthUser } from '@/lib/api/client';

export type { AuthUser };

export interface SubscriptionStatus {
  plan_tier: string | null;
  billing_cycle: string | null;
  status: string;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
}

export function useAuth() {
  const [session, setSession] = useState<SessionContext | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  const refresh = useCallback(async () => {
    const next = await getSession();
    setSession(next);
    setLoading(false);
  }, []);

  useEffect(() => {
    setMounted(true);
    refresh();
  }, [refresh]);

  const signOut = useCallback(async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setSession(null);
  }, []);

  const user: AuthUser | null = session?.user ?? null;

  const subscription: SubscriptionStatus | null = session?.membership
    ? {
        plan_tier: session.membership.planTier,
        billing_cycle: session.membership.billingCycle,
        status: session.membership.status,
        current_period_end: session.membership.currentPeriodEnd,
        cancel_at_period_end: session.membership.cancelAtPeriodEnd,
      }
    : null;

  const hasActiveSubscription = Boolean(
    session?.membership &&
      (session.membership.status === 'active' || session.membership.status === 'trialing') &&
      !session.membership.cancelAtPeriodEnd &&
      // Cardless trials expire on their own — a trialing membership past its
      // period end no longer grants access.
      (session.membership.status !== 'trialing' ||
        new Date(session.membership.currentPeriodEnd).getTime() > Date.now())
  );

  return {
    user,
    loading: !mounted || loading,
    signOut,
    subscription,
    hasActiveSubscription,
    session,
    refresh,
  };
}
