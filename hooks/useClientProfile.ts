'use client';

import { useState, useEffect, useMemo } from 'react';
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

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setProfile(null);
      setPurchasedServiceIds([]);
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        // Try client_profiles table (may not exist in all environments)
        const { data, error } = await supabase
          .from('client_profiles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (!error && data) {
          setProfile(data);
        }

        // Derive purchased services from live schema
        const purchasedIds = await derivePurchasedServices(user.id);
        setPurchasedServiceIds(purchasedIds);
      } catch (error) {
        console.error('Error fetching client profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, authLoading]);

  const intakeFullyComplete = useMemo(() => {
    if (!profile) return false;
    if (!profile.has_submitted_intake) return false;
    return isIntakeFullyComplete(purchasedServiceIds, profile.intake_complete_for_services || []);
  }, [profile, purchasedServiceIds]);

  const intakeCompleteForServices = profile?.intake_complete_for_services || [];

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
    const { data: orders } = await supabase
      .from('stripe_orders')
      .select('checkout_session_id, status, service_ids')
      .eq('customer_id', customer.customer_id)
      .eq('status', 'completed');

    if (orders && orders.length > 0) {
      for (const order of orders) {
        if (order.service_ids && Array.isArray(order.service_ids) && order.service_ids.length > 0) {
          order.service_ids.forEach((id: string) => ids.add(id));
        } else {
          // Legacy orders without service_ids — assume business_foundations_pack
          ids.add('business_foundations_pack');
        }
      }
    }

    // 3. Active subscriptions
    const { data: subs } = await supabase
      .from('stripe_subscriptions')
      .select('price_id, status')
      .eq('customer_id', customer.customer_id);

    if (subs) {
      for (const sub of subs) {
        if (sub.status === 'active' || sub.status === 'trialing') {
          const serviceId = findServiceIdByPriceId(sub.price_id);
          if (serviceId) ids.add(serviceId);
        }
      }
    }
  }

  // Also check services_purchased table (populated by webhook)
  const { data: services } = await supabase
    .from('services_purchased')
    .select('service_id')
    .eq('user_id', userId)
    .eq('status', 'active');

  if (services && services.length > 0) {
    services.forEach((s: any) => ids.add(s.service_id));
  }

  // Fallback: try client_profiles.purchased_upsells
  if (ids.size === 0) {
    const { data: profile } = await supabase
      .from('client_profiles')
      .select('purchased_upsells')
      .eq('user_id', userId)
      .maybeSingle();

    if (profile?.purchased_upsells && Array.isArray(profile.purchased_upsells)) {
      ids.add('business_foundations_pack');
      profile.purchased_upsells.forEach((id: string) => ids.add(id));
    }
  }

  return Array.from(ids);
}
