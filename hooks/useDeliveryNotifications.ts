'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from './useAuth';

export interface DeliveryNotification {
  id: string;
  type: 'document' | 'website' | 'social_post';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  metadata?: {
    documentId?: string;
    documentType?: string;
    websiteId?: string;
    postId?: string;
  };
}

const POLLING_INTERVAL = 60000;
const NOTIFICATIONS_KEY = 'delivery_notifications_seen';

export function useDeliveryNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<DeliveryNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const activeRef = useRef(true);

  const getSeenIds = useCallback((): Set<string> => {
    if (typeof window === 'undefined') return new Set();
    try {
      const stored = localStorage.getItem(NOTIFICATIONS_KEY);
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  }, []);

  const markSeen = useCallback((ids: string[]) => {
    if (typeof window === 'undefined') return;
    try {
      const seen = getSeenIds();
      ids.forEach(id => seen.add(id));
      localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify([...seen].slice(-100)));
    } catch {
      // Ignore storage errors
    }
  }, [getSeenIds]);

  const fetchNotifications = useCallback(async () => {
    if (!user) return;

    try {
      const now = new Date().toISOString();
      const seenIds = getSeenIds();
      const newNotifications: DeliveryNotification[] = [];

      // Check for newly delivered documents
      const { data: docs } = await supabase
        .from('generated_documents')
        .select('id, document_type, document_label, delivered_at')
        .eq('client_id', user.id)
        .eq('delivered_to_client', true)
        .gte('delivered_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        .order('delivered_at', { ascending: false })
        .limit(10);

      if (docs) {
        docs.forEach(doc => {
          newNotifications.push({
            id: `doc-${doc.id}`,
            type: 'document',
            title: 'Document Delivered',
            message: `Your ${doc.document_label} is ready for download.`,
            timestamp: doc.delivered_at,
            read: seenIds.has(`doc-${doc.id}`),
            metadata: { documentId: doc.id, documentType: doc.document_type },
          });
        });
      }

      // Check for newly delivered websites
      const { data: websites } = await supabase
        .from('website_deliveries')
        .select('id, delivered_at')
        .eq('user_id', user.id)
        .not('delivered_at', 'is', null)
        .gte('delivered_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        .order('delivered_at', { ascending: false })
        .limit(5);

      if (websites) {
        websites.forEach(site => {
          newNotifications.push({
            id: `website-${site.id}`,
            type: 'website',
            title: 'Website Ready',
            message: 'Your website is now available for preview and download.',
            timestamp: site.delivered_at!,
            read: seenIds.has(`website-${site.id}`),
            metadata: { websiteId: site.id },
          });
        });
      }

      // Check for newly delivered social posts
      const { data: posts } = await supabase
        .from('social_media_posts')
        .select('id, delivered_to_client, created_at')
        .eq('user_id', user.id)
        .eq('delivered_to_client', true)
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false })
        .limit(20);

      if (posts && posts.length > 0) {
        // Group posts by delivery batch (within same hour)
        const postNotifications = groupPostsToNotifications(posts, seenIds);
        newNotifications.push(...postNotifications);
      }

      // Sort by timestamp, newest first
      newNotifications.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      if (activeRef.current) {
        setNotifications(newNotifications.slice(0, 20));
        setUnreadCount(newNotifications.filter(n => !n.read).length);
      }
    } catch (err) {
      console.error('Error fetching delivery notifications:', err);
    } finally {
      if (activeRef.current) setLoading(false);
    }
  }, [user, getSeenIds]);

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    activeRef.current = true;
    fetchNotifications();

    // Realtime subscription for new document deliveries
    const channel = supabase.channel(`delivery_notifications:${user.id}:${Date.now()}`);
    channel
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'generated_documents',
        filter: `client_id=eq.${user.id}`,
      }, (payload) => {
        if (payload.new?.delivered_to_client === true && payload.old?.delivered_to_client === false) {
          if (activeRef.current) fetchNotifications();
        }
      })
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'generated_documents',
        filter: `client_id=eq.${user.id}`,
      }, (payload) => {
        if (payload.new?.delivered_to_client === true) {
          if (activeRef.current) fetchNotifications();
        }
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'website_deliveries',
        filter: `user_id=eq.${user.id}`,
      }, (payload) => {
        if (payload.new?.delivered_at && !payload.old?.delivered_at) {
          if (activeRef.current) fetchNotifications();
        }
      })
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'social_media_posts',
        filter: `user_id=eq.${user.id}`,
      }, (payload) => {
        if (payload.new?.delivered_to_client === true) {
          if (activeRef.current) fetchNotifications();
        }
      })
      .subscribe();

    channelRef.current = channel;

    // Periodic polling as fallback
    pollingRef.current = setInterval(fetchNotifications, POLLING_INTERVAL);

    // Refetch on focus
    const onFocus = () => { if (activeRef.current) fetchNotifications(); };
    const onVisible = () => { if (document.visibilityState === 'visible' && activeRef.current) fetchNotifications(); };
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVisible);

    return () => {
      activeRef.current = false;
      supabase.removeChannel(channel);
      if (pollingRef.current) { clearInterval(pollingRef.current); pollingRef.current = null; }
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [user?.id, fetchNotifications]);

  const markAsRead = useCallback((notificationId: string) => {
    markSeen([notificationId]);
    setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, read: true } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, [markSeen]);

  const markAllAsRead = useCallback(() => {
    const unreadIds = notifications.filter(n => !n.read).map(n => n.id);
    markSeen(unreadIds);
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  }, [notifications, markSeen]);

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    refetch: fetchNotifications,
  };
}

function groupPostsToNotifications(
  posts: { id: string; delivered_to_client: boolean; created_at: string }[],
  seenIds: Set<string>
): DeliveryNotification[] {
  if (posts.length === 0) return [];

  // Sort by created_at
  const sorted = [...posts].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  // Find groups of posts within 1 hour of each other
  const groups: { id: string; count: number; timestamp: string }[] = [];
  let currentGroup: { id: string; count: number; timestamp: string; lastTime: Date } | null = null;

  for (const post of sorted) {
    const postTime = new Date(post.created_at);

    if (!currentGroup) {
      currentGroup = { id: `posts-${post.id}`, count: 1, timestamp: post.created_at, lastTime: postTime };
    } else {
      const hoursDiff = (currentGroup.lastTime.getTime() - postTime.getTime()) / (1000 * 60 * 60);
      if (hoursDiff < 1) {
        currentGroup.count++;
      } else {
        groups.push(currentGroup);
        currentGroup = { id: `posts-${post.id}`, count: 1, timestamp: post.created_at, lastTime: postTime };
      }
    }
  }

  if (currentGroup) groups.push(currentGroup);

  return groups.map(group => ({
    id: group.id,
    type: 'social_post' as const,
    title: group.count === 1 ? 'Social Post Ready' : `${group.count} Social Posts Ready`,
    message: group.count === 1 ? 'A new social media post is ready for download.' : 'New social media posts are ready for download.',
    timestamp: group.timestamp,
    read: seenIds.has(group.id),
    metadata: { postId: group.id },
  }));
}
