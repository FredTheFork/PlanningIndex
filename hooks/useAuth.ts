'use client';

import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client';

export interface SubscriptionStatus {
  plan_tier: string | null;
  billing_cycle: string | null;
  status: string;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [subscription, setSubscription] = useState<SubscriptionStatus | null>(null);

  const fetchSubscription = async (userId: string) => {
    const { data } = await supabase
      .from('subscriptions')
      .select('plan_tier, billing_cycle, status, current_period_end, cancel_at_period_end')
      .eq('user_id', userId)
      .maybeSingle();

    setSubscription(data as SubscriptionStatus | null);
  };

  useEffect(() => {
    setMounted(true);

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
      if (session?.user) {
        fetchSubscription(session.user.id);
      }
    });

    const {
      data: { subscription: authSubscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
      if (session?.user) {
        fetchSubscription(session.user.id);
      } else {
        setSubscription(null);
      }
    });

    return () => authSubscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setSubscription(null);
  };

  const hasActiveSubscription = Boolean(
    subscription &&
      (subscription.status === 'active' || subscription.status === 'trialing') &&
      !subscription.cancel_at_period_end
  );

  return {
    user,
    loading: !mounted || loading,
    signOut,
    subscription,
    hasActiveSubscription,
  };
}
