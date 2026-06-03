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
  const [showNotification, setShowNotification] = useState(false);
  const [lastMessagePreview, setLastMessagePreview] = useState('');

  useEffect(() => {
    if (!user) return;

    const getUnreadCount = async () => {
      const { data: adminData } = await supabase
        .from('admin_users')
        .select('user_id')
        .limit(1)
        .maybeSingle();

      if (adminData) {
        const { data: messages } = await supabase
          .from('client_messages')
          .select('id, message_content')
          .eq('recipient_id', user.id)
          .eq('is_read', false)
          .or(
            `and(sender_id.eq.${user.id},recipient_id.eq.${adminData.user_id}),and(sender_id.eq.${adminData.user_id},recipient_id.eq.${user.id})`
          )
          .order('created_at', { ascending: false })
          .limit(1);

        setUnreadCount(messages?.length || 0);
        if (messages && messages.length > 0) {
          setLastMessagePreview(messages[0].message_content);
        }

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
                setLastMessagePreview(payload.new.message_content);
                setShowNotification(true);
                setTimeout(() => setShowNotification(false), 5000);
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
    <>
      {showNotification && (
        <div className="fixed bottom-24 right-6 bg-white text-navy rounded-lg shadow-2xl p-4 max-w-xs z-40 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <p className="font-inter text-sm font-semibold mb-1">New message</p>
          <p className="font-inter text-xs text-secondary-text line-clamp-2">
            {lastMessagePreview}
          </p>
        </div>
      )}

      <button
        onClick={onOpen}
        className="fixed bottom-6 right-6 bg-gradient-to-br from-[#2563eb] to-[#1e40af] hover:from-[#1e40af] hover:to-[#1e3a8a] text-white rounded-full p-4 shadow-2xl hover:shadow-2xl transition-all duration-300 z-40 flex items-center justify-center group relative"
        aria-label="Open chat"
        style={unreadCount > 0 ? { animation: 'breathe 2.5s ease-in-out infinite' } : undefined}
      >
        <div className="relative z-10">
          <MessageCircle size={28} strokeWidth={1.5} />
          {unreadCount > 0 && (
            <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold animate-pulse shadow-lg">
              {unreadCount > 9 ? '9+' : unreadCount}
            </div>
          )}
        </div>

        <span className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs font-medium px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          {unreadCount > 0 ? `${unreadCount} new message${unreadCount !== 1 ? 's' : ''}` : 'Message our team'}
        </span>

        <style>{`
          @keyframes breathe {
            0%, 100% { box-shadow: 0 0 20px 0 rgba(37, 99, 235, 0.4), 0 10px 25px -5px rgba(0, 0, 0, 0.1); }
            50% { box-shadow: 0 0 30px 0 rgba(37, 99, 235, 0.6), 0 10px 25px -5px rgba(0, 0, 0, 0.15); }
          }
        `}</style>
      </button>
    </>
  );
}
