'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from './useAuth';
import { isIntakeFullyComplete } from '@/lib/forms/build-intake-form';
import { serviceCatalog, stripeMode } from '@/lib/services/service-catalog';

export interface ClientProfile {
  id: string;
  user_id: string;
  has_submitted_intake: boolean;
  intake_submitted_at: string | null;
  delivery_link: string | null;
  delivery_status: 'not_started' | 'in_progress' | 'delivered';
  created_at: string;
  updated_at: string;
  admin_notes: string;
  purchased_upsells: string[];
  intake_complete_for_services: string[];
}

export function useClientProfile() {
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<ClientProfile | null>(null);
  const [purchasedServiceIds, setPurchasedServiceIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setProfile(null);
      setPurchasedServiceIds([]);
      setLoading(false);
      return;
    }

    let active = true;

    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('client_profiles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (!active) return;

        if (!error && data) {
          setProfile(data);
        }

        const purchasedIds = await derivePurchasedServices(user.id);
        if (!active) return;
        setPurchasedServiceIds(purchasedIds);
      } catch (error) {
        console.error('Error fetching client profile:', error);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchProfile();

    // Realtime subscription for profile changes (delivery_status, etc.)
    const channel = supabase.channel(`client_profile:${user.id}:${Date.now()}`);
    channel
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'client_profiles',
        filter: `user_id=eq.${user.id}`,
      }, (payload) => {
        if (active && payload.new) {
          setProfile(payload.new as ClientProfile);
        }
      })
      .subscribe();

    channelRef.current = channel;

    // Periodic polling as fallback (60 seconds)
    pollingRef.current = setInterval(fetchProfile, 60000);

    // Refetch on window focus
    const onFocus = () => { if (active) fetchProfile(); };
    const onVisible = () => { if (document.visibilityState === 'visible' && active) fetchProfile(); };
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVisible);

    return () => {
      active = false;
      supabase.removeChannel(channel);
      if (pollingRef.current) { clearInterval(pollingRef.current); pollingRef.current = null; }
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [user?.id, authLoading]);

  const intakeFullyComplete = useMemo(() => {
    if (!profile) return false;
    if (!profile.has_submitted_intake) return false;
    const icf = profile.intake_complete_for_services || [];
    // Legacy: submitted but intake_complete_for_services empty → treat as complete
    if (icf.length === 0) return true;
    return isIntakeFullyComplete(purchasedServiceIds, icf);
  }, [profile, purchasedServiceIds]);

  const intakeCompleteForServices = (() => {
    const icf = profile?.intake_complete_for_services || [];
    // Legacy: submitted but tracking column empty → assume all purchased services were completed
    if (icf.length === 0 && profile?.has_submitted_intake) return purchasedServiceIds;
    return icf;
  })();

  return { profile, loading: authLoading || loading, purchasedServiceIds, intakeFullyComplete, intakeCompleteForServices };
}

/** Map a Stripe price_id back to a service catalog entry ID. */
function findServiceIdByPriceId(priceId: string): string | null {
  if (!priceId) return null;
  for (const service of serviceCatalog) {
    if (
      service.stripePriceIds.test === priceId ||
      service.stripePriceIds.live === priceId
    ) {
      return service.id;
    }
  }
  return null;
}

/**
 * Derive which services a user has purchased.
 * Tries the live stripe_* schema first, then falls back to
 * services_purchased, then client_profiles.purchased_upsells.
 */
async function derivePurchasedServices(userId: string): Promise<string[]> {
  const ids = new Set<string>();

  // 1. Check stripe_customers to get the Stripe customer ID
  const { data: customer } = await supabase
    .from('stripe_customers')
    .select('customer_id')
    .eq('user_id', userId)
    .maybeSingle();

  if (customer?.customer_id) {
    // 2. Completed orders = one-time purchases
    try {
      const { data: orders, error: ordersError } = await supabase
        .from('stripe_orders')
        .select('checkout_session_id, status, service_ids')
        .eq('customer_id', customer.customer_id)
        .eq('status', 'completed');

      if (!ordersError && orders && orders.length > 0) {
        for (const order of orders) {
          if (order.service_ids && Array.isArray(order.service_ids) && order.service_ids.length > 0) {
            order.service_ids.forEach((id: string) => ids.add(id));
          } else {
            ids.add('business_foundations_pack');
          }
        }
      }
    } catch {
      // service_ids column may not exist — silently ignore
    }

    // 3. Active subscriptions
    try {
      const { data: subs, error: subsError } = await supabase
        .from('stripe_subscriptions')
        .select('price_id, status')
        .eq('customer_id', customer.customer_id);

      if (!subsError && subs) {
        for (const sub of subs) {
          if (sub.status === 'active' || sub.status === 'trialing') {
            const serviceId = findServiceIdByPriceId(sub.price_id);
            if (serviceId) ids.add(serviceId);
          }
        }
      }
    } catch {
      // stripe_subscriptions table may not exist — silently ignore
    }
  }

  // Also check services_purchased table (populated by webhook)
  try {
    const { data: services, error: servicesError } = await supabase
      .from('services_purchased')
      .select('service_id')
      .eq('user_id', userId)
      .eq('status', 'active');

    if (!servicesError && services && services.length > 0) {
      services.forEach((s: any) => ids.add(s.service_id));
    }
  } catch {
    // services_purchased may not exist — silently ignore
  }

  // Fallback: try client_profiles.purchased_upsells
  if (ids.size === 0) {
    try {
      const { data: profile } = await supabase
        .from('client_profiles')
        .select('purchased_upsells')
        .eq('user_id', userId)
        .maybeSingle();

      if (profile?.purchased_upsells && Array.isArray(profile.purchased_upsells)) {
        ids.add('business_foundations_pack');
        profile.purchased_upsells.forEach((id: string) => ids.add(id));
      }
    } catch {
      // Silently ignore
    }
  }

  return Array.from(ids);
}
