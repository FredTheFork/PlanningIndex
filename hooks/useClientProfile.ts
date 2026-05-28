'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from './useAuth';

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
}

export function useClientProfile() {
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<ClientProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setProfile(null);
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
      } catch (error) {
        console.error('Error fetching client profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, authLoading]);

  return { profile, loading: authLoading || loading };
}
