'use client';

import { MessageCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface ChatBubbleTriggerProps {
  onOpen: () => void;
}

export default function ChatBubbleTrigger({ onOpen }: ChatBubbleTriggerProps) {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) return;

    // Get initial unread count
    const getUnreadCount = async () => {
      const { data: adminData } = await supabase
        .from('admin_users')
        .select('user_id')
        .limit(1)
        .maybeSingle();

      if (adminData) {
        const { data: messages } = await supabase
          .from('client_messages')
          .select('id')
          .eq('recipient_id', user.id)
          .eq('is_read', false)
          .or(
            `and(sender_id.eq.${user.id},recipient_id.eq.${adminData.user_id}),and(sender_id.eq.${adminData.user_id},recipient_id.eq.${user.id})`
          );

        setUnreadCount(messages?.length || 0);

        // Subscribe to new messages
        const conversationId = [user.id, adminData.user_id].sort().join('_');
        const subscription = supabase
          .channel(`messages:${conversationId}`)
          .on(
            'postgres_changes',
            {
              event: 'INSERT',
              schema: 'public',
              table: 'client_messages',
              filter: `conversation_id=eq.${conversationId}`,
            },
            (payload) => {
              if (payload.new.recipient_id === user.id && !payload.new.is_read) {
                setUnreadCount((prev) => prev + 1);
              }
            }
          )
          .subscribe();

        return () => {
          subscription.unsubscribe();
        };
      }
    };

    getUnreadCount();
  }, [user]);

  return (
    <button
      onClick={onOpen}
      className="fixed bottom-6 right-6 bg-gradient-to-r from-navy to-medium-blue hover:from-medium-blue hover:to-navy text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 z-40 flex items-center justify-center group"
      aria-label="Open chat"
    >
      <div className="relative">
        <MessageCircle size={28} />
        {unreadCount > 0 && (
          <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </div>
        )}
      </div>
      <span className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs font-medium px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
        Message our team
      </span>
    </button>
  );
}
