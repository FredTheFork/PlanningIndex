'use client';

import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from './useAuth';
import { isIntakeFullyComplete } from '@/lib/forms/build-intake-form';

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
        const { data, error } = await supabase
          .from('client_profiles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Error fetching client profile:', error);
          return;
        }

        setProfile(data);

        // Derive purchased service IDs from services_purchased (canonical source)
        const { data: services } = await supabase
          .from('services_purchased')
          .select('service_id')
          .eq('user_id', user.id)
          .eq('status', 'active');

        if (services && services.length > 0) {
          setPurchasedServiceIds(services.map((s: any) => s.service_id));
        } else if (data?.purchased_upsells) {
          setPurchasedServiceIds(['business_foundations_pack', ...data.purchased_upsells]);
        } else {
          setPurchasedServiceIds(['business_foundations_pack']);
        }
      } catch (error) {
        console.error('Error fetching client profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, authLoading]);

  // Computed: is intake fully complete for all purchased services?
  const intakeFullyComplete = useMemo(() => {
    if (!profile) return false;
    if (!profile.has_submitted_intake) return false;
    return isIntakeFullyComplete(purchasedServiceIds, profile.intake_complete_for_services || []);
  }, [profile, purchasedServiceIds]);

  const intakeCompleteForServices = profile?.intake_complete_for_services || [];

  return { profile, loading: authLoading || loading, purchasedServiceIds, intakeFullyComplete, intakeCompleteForServices };
}
