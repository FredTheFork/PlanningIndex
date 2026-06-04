import { useEffect, useState, useRef, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from './useAuth';

const REFRESH_INTERVAL = 15000;
const MAX_RETRIES = 3;

export function useUnreadMessages() {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const subscriptionRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const retryCountRef = useRef(0);
  const isMountedRef = useRef(true);

  const fetchUnreadCount = useCallback(async () => {
    if (!user) return;

    try {
      const { count, error } = await supabase
        .from('client_messages')
        .select('id', { count: 'exact', head: true })
        .eq('recipient_id', user.id)
        .eq('is_read', false);

      if (!isMountedRef.current) return;

      if (error) {
        console.error('Error fetching unread count:', error);
        return;
      }

      setUnreadCount(count || 0);
    } catch (err) {
      console.error('Error fetching unread count:', err);
    } finally {
      if (isMountedRef.current) setLoading(false);
    }
  }, [user]);

  const startPolling = useCallback(() => {
    if (pollingRef.current) return;
    pollingRef.current = setInterval(fetchUnreadCount, REFRESH_INTERVAL);
  }, [fetchUnreadCount]);

  const stopPolling = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  }, []);

  const setupSubscription = useCallback(() => {
    if (!user) return;

    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
      subscriptionRef.current = null;
    }

    const subscription = supabase
      .channel(`unread_messages:${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'client_messages',
          filter: `recipient_id=eq.${user.id}`,
        },
        () => {
          if (isMountedRef.current) fetchUnreadCount();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'client_messages',
          filter: `recipient_id=eq.${user.id}`,
        },
        () => {
          if (isMountedRef.current) fetchUnreadCount();
        }
      )
      .subscribe((status) => {
        console.log('[useUnreadMessages] Subscription status:', status);

        if (status === 'SUBSCRIBED') {
          retryCountRef.current = 0;
          startPolling();
        } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || status === 'CLOSED') {
          if (retryCountRef.current < MAX_RETRIES) {
            retryCountRef.current++;
            const delay = Math.min(1000 * Math.pow(2, retryCountRef.current), 8000);
            setTimeout(() => {
              if (isMountedRef.current) setupSubscription();
            }, delay);
          }
          startPolling();
        }
      });

    subscriptionRef.current = subscription;
  }, [user, fetchUnreadCount, startPolling]);

  useEffect(() => {
    if (!user) return;

    isMountedRef.current = true;
    fetchUnreadCount();
    setupSubscription();
    startPolling();

    const handleFocus = () => {
      if (isMountedRef.current) fetchUnreadCount();
    };
    const handleVisibility = () => {
      if (document.visibilityState === 'visible' && isMountedRef.current) {
        fetchUnreadCount();
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      isMountedRef.current = false;
      stopPolling();
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [user, fetchUnreadCount, setupSubscription, startPolling, stopPolling]);

  return { unreadCount, loading };
}
