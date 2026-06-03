'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, X, MessageCircle, Loader } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  message_content: string;
  message_type: string;
  is_read: boolean;
  created_at: string;
}

interface TeamMember {
  id: string;
  display_name: string;
  profile_picture_url?: string;
}

interface ChatBubbleProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChatBubble({ isOpen, onClose }: ChatBubbleProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const [sending, setSending] = useState(false);
  const [teamMember, setTeamMember] = useState<TeamMember | null>(null);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load team member and messages
  useEffect(() => {
    if (!user || !isOpen) return;

    const loadData = async () => {
      setLoading(true);
      try {
        // Get team member info
        const { data: adminData, error: adminError } = await supabase
          .from('admin_users')
          .select('user_id, display_name, profile_picture_url')
          .limit(1)
          .maybeSingle();

        if (adminData) {
          setTeamMember({
            id: adminData.user_id,
            display_name: adminData.display_name || 'Team',
            profile_picture_url: adminData.profile_picture_url,
          });

          // Get conversation messages
          const conversationId = [user.id, adminData.user_id].sort().join('_');
          const { data: messagesData, error: messagesError } = await supabase
            .from('client_messages')
            .select('*')
            .or(
              `and(sender_id.eq.${user.id},recipient_id.eq.${adminData.user_id}),and(sender_id.eq.${adminData.user_id},recipient_id.eq.${user.id})`
            )
            .order('created_at', { ascending: true });

          if (messagesData) {
            setMessages(messagesData);

            // Mark unread as read
            const unreadIds = messagesData
              .filter((m) => m.recipient_id === user.id && !m.is_read)
              .map((m) => m.id);

            if (unreadIds.length > 0) {
              await supabase
                .from('client_messages')
                .update({ is_read: true, read_at: new Date().toISOString() })
                .in('id', unreadIds);
              setUnreadCount(0);
            }
          }
        }
      } catch (err) {
        console.error('Error loading chat data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // Subscribe to real-time updates
    if (user && teamMember) {
      const conversationId = [user.id, teamMember.id].sort().join('_');
      const subscription = supabase
        .channel(`messages:${conversationId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'client_messages',
            filter: `conversation_id=eq.${conversationId}`,
          },
          (payload) => {
            if (payload.new) {
              setMessages((prev) => [...prev, payload.new as Message]);
            }
          }
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [user, isOpen, teamMember]);

  const sendMessage = async () => {
    if (!messageText.trim() || !user || !teamMember) return;

    setSending(true);
    try {
      const conversationId = [user.id, teamMember.id].sort().join('_');

      const { data: insertedData, error } = await supabase
        .from('client_messages')
        .insert({
          conversation_id: conversationId,
          sender_id: user.id,
          recipient_id: teamMember.id,
          message_content: messageText.trim(),
          message_type: 'general',
        })
        .select('*');

      if (error) {
        console.error('Error sending message:', error);
        return;
      }

      // Trigger notification
      if (insertedData && insertedData.length > 0) {
        const newMessage = insertedData[0];
        try {
          const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
          const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

          await fetch(`${SUPABASE_URL}/functions/v1/send-message-notification`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${ANON_KEY}`,
            },
            body: JSON.stringify({
              id: newMessage.id,
              sender_id: newMessage.sender_id,
              recipient_id: newMessage.recipient_id,
              message_content: newMessage.message_content,
              message_type: newMessage.message_type,
              created_at: newMessage.created_at,
            }),
          });
        } catch (err) {
          console.error('Error triggering notification:', err);
        }
      }

      setMessageText('');
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-30 z-40 md:hidden"
        onClick={onClose}
      />

      {/* Chat Modal */}
      <div className="fixed bottom-0 right-0 top-0 md:bottom-6 md:right-6 md:top-auto md:w-96 w-full z-50 flex flex-col bg-white rounded-t-2xl md:rounded-2xl shadow-2xl max-h-screen md:max-h-[600px] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-navy to-medium-blue text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {teamMember?.profile_picture_url ? (
              <img
                src={teamMember.profile_picture_url}
                alt={teamMember.display_name}
                className="w-10 h-10 rounded-full object-cover border-2 border-white"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-white bg-opacity-30 flex items-center justify-center">
                <MessageCircle size={20} />
              </div>
            )}
            <div>
              <h3 className="font-inter font-bold text-sm">
                {teamMember?.display_name || 'Team'}
              </h3>
              <p className="text-xs text-blue-100">
                Responsible for your documents
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader size={24} className="text-medium-blue animate-spin" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-8">
              <div className="bg-medium-blue bg-opacity-10 rounded-full p-4 mb-4">
                <MessageCircle size={32} className="text-medium-blue" />
              </div>
              <p className="font-inter text-secondary-text text-sm mb-2">
                No messages yet
              </p>
              <p className="font-inter text-secondary-text text-xs">
                Start the conversation with our team
              </p>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.sender_id === user?.id ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-2xl ${
                    msg.sender_id === user?.id
                      ? 'bg-medium-blue text-white rounded-br-none'
                      : 'bg-white text-navy border border-gray-200 rounded-bl-none'
                  }`}
                >
                  <p className="font-inter text-sm break-words">
                    {msg.message_content}
                  </p>
                  <p
                    className={`font-inter text-xs mt-1 ${
                      msg.sender_id === user?.id
                        ? 'text-blue-100'
                        : 'text-secondary-text'
                    }`}
                  >
                    {new Date(msg.created_at).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="flex gap-2">
            <input
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-medium-blue font-inter text-sm"
              disabled={sending}
            />
            <button
              onClick={sendMessage}
              disabled={!messageText.trim() || sending}
              className="bg-medium-blue hover:bg-navy disabled:opacity-50 text-white rounded-full p-3 transition-colors flex items-center justify-center"
            >
              {sending ? (
                <Loader size={18} className="animate-spin" />
              ) : (
                <Send size={18} />
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
