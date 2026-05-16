import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
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
          // If schema cache error, try direct REST API
          if (error.code === 'PGRST205' || error.code === 'PGRST204') {
            const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
            const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
            if (supabaseUrl && anonKey) {
              try {
                const res = await fetch(
                  `${supabaseUrl}/rest/v1/client_profiles?user_id=eq.${user.id}&select=*`,
                  {
                    headers: {
                      'apikey': anonKey,
                      'Authorization': `Bearer ${anonKey}`,
                    },
                  }
                );
                if (res.ok) {
                  const rows = await res.json();
                  setProfile(rows?.[0] || null);
                  return;
                }
              } catch {
                // REST API also failed
              }
            }
          }
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
