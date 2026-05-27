import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '../lib/supabase';

const ADMIN_EMAILS = ['foundationarybusiness@gmail.com'];

export function useIsAdmin() {
  const { user, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    // Primary check: JWT app_metadata (set via Auth admin API)
    const jwtRole = user.app_metadata?.role;
    if (jwtRole === 'admin') {
      setIsAdmin(true);
      setLoading(false);
      return;
    }

    // Fallback check: hardcoded admin email list
    const email = user.email?.toLowerCase() || '';
    if (ADMIN_EMAILS.includes(email)) {
      setIsAdmin(true);
      setLoading(false);
      return;
    }

    // Final fallback: try querying admin_users table
    // (may fail due to PostgREST schema cache issues)
    const checkAdminTable = async () => {
      try {
        const { data, error } = await supabase
          .from('admin_users')
          .select('role')
          .eq('user_id', user.id)
          .maybeSingle();

        if (!error && data) {
          setIsAdmin(true);
        }
      } catch {
        // Table may not be accessible, ignore
      } finally {
        setLoading(false);
      }
    };

    checkAdminTable();
  }, [user, authLoading]);

  return { isAdmin, loading: authLoading || loading };
}
