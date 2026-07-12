import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from './useAuth';

const REFRESH_INTERVAL = 15000;

export function useUnreadMessages() {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const activeRef = useRef(true);

  const fetchUnreadCount = async () => {
    if (!user) return;
    try {
      const { count, error } = await supabase
        .from('client_messages')
        .select('id', { count: 'exact', head: true })
        .eq('recipient_id', user.id)
        .eq('is_read', false);

      if (!activeRef.current) return;
      if (error) { console.error('Error fetching unread count:', error); return; }
      setUnreadCount(count || 0);
    } catch (err) {
      console.error('Error fetching unread count:', err);
    } finally {
      if (activeRef.current) setLoading(false);
    }
  };

  useEffect(() => {
    if (!user?.id) { setLoading(false); return; }

    activeRef.current = true;
    fetchUnreadCount();

    // Realtime subscription for INSERT/UPDATE on messages where user is recipient
    const channel = supabase.channel(`unread_messages:${user.id}:${Date.now()}`);
    channel
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'client_messages', filter: `recipient_id=eq.${user.id}` }, () => {
        if (activeRef.current) fetchUnreadCount();
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'client_messages', filter: `recipient_id=eq.${user.id}` }, () => {
        if (activeRef.current) fetchUnreadCount();
      })
      .subscribe((status) => {
        console.log('[useUnreadMessages] Subscription status:', status);
      });

    channelRef.current = channel;

    // Periodic polling as fallback
    pollingRef.current = setInterval(fetchUnreadCount, REFRESH_INTERVAL);

    // Refetch on focus
    const onFocus = () => { if (activeRef.current) fetchUnreadCount(); };
    const onVisible = () => { if (document.visibilityState === 'visible' && activeRef.current) fetchUnreadCount(); };
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVisible);

    return () => {
      activeRef.current = false;
      supabase.removeChannel(channel);
      if (pollingRef.current) { clearInterval(pollingRef.current); pollingRef.current = null; }
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [user?.id]);

  return { unreadCount, loading };
}
