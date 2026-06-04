'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from './useAuth';

export interface PurchasedService {
  id: string;
  user_id: string;
  service_id: string;
  stripe_checkout_session_id: string;
  stripe_subscription_id: string | null;
  status: 'active' | 'cancelled' | 'expired';
  purchased_at: string;
  expires_at: string | null;
  created_at: string;
}

export function usePurchasedServices() {
  const { user, loading: authLoading } = useAuth();
  const [services, setServices] = useState<PurchasedService[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setServices([]);
      setLoading(false);
      return;
    }

    const fetchServices = async () => {
      try {
        const { data, error } = await supabase
          .from('services_purchased')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .order('purchased_at', { ascending: true });

        if (error) {
          console.error('Error fetching purchased services:', error);
          return;
        }

        setServices(data ?? []);
      } catch (error) {
        console.error('Error fetching purchased services:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [user, authLoading]);

  const activeServiceIds = services.map((s) => s.service_id);

  const hasService = (serviceId: string) =>
    activeServiceIds.includes(serviceId);

  return { services, activeServiceIds, hasService, loading: authLoading || loading };
}
