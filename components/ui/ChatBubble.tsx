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
  is_read: boolean;
  created_at: string;
}

export default function ChatBubble() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [teamId, setTeamId] = useState('');
  const [teamName, setTeamName] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'instant' });
    }
  }, [messages, isOpen]);

  useEffect(() => {
    if (!user) return;

    let isMounted = true;

    const setup = async () => {
      try {
        const { data: admin } = await supabase
          .from('admin_users')
          .select('user_id, display_name')
          .limit(1)
          .maybeSingle();

        if (!isMounted || !admin) return;

        const convId = [user.id, admin.user_id].sort().join('_');
        setTeamId(admin.user_id);
        setTeamName(admin.display_name || 'Support Team');

        const { data: unread } = await supabase
          .from('client_messages')
          .select('id', { count: 'exact', head: true })
          .eq('recipient_id', user.id)
          .eq('is_read', false);

        if (isMounted) setUnreadCount(unread?.length || 0);

        const subscription = supabase.channel(`messages:${convId}`);
        subscription
          .on(
            'postgres_changes',
            {
              event: 'INSERT',
              schema: 'public',
              table: 'client_messages',
              filter: `conversation_id=eq.${convId}`,
            },
            (payload) => {
              if (isMounted && payload.new?.recipient_id === user.id) {
                setMessages((prev) =>
                  prev.some((m) => m.id === payload.new.id)
                    ? prev
                    : [...prev, payload.new as Message]
                );

                if (!payload.new.is_read) {
                  setUnreadCount((prev) => prev + 1);
                  supabase
                    .from('client_messages')
                    .update({ is_read: true, read_at: new Date().toISOString() })
                    .eq('id', payload.new.id)
                    .then();
                }
              }
            }
          )
          .subscribe();

        return () => subscription.unsubscribe();
      } catch (err) {
        console.error('Chat setup error:', err);
      }
    };

    setup();
    return () => {
      isMounted = false;
    };
  }, [user]);

  useEffect(() => {
    if (!user || !teamId) return;

    const loadMessages = async () => {
      setLoading(true);
      try {
        const convId = [user.id, teamId].sort().join('_');

        const { data } = await supabase
          .from('client_messages')
          .select('*')
          .eq('conversation_id', convId)
          .order('created_at', { ascending: true });

        if (data) {
          setMessages(data);

          const unreadIds = data
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
      } catch (err) {
        console.error('Error loading messages:', err);
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
  }, [user, teamId]);

  const sendMessage = async () => {
    if (!messageText.trim() || !user || !teamId) return;

    const text = messageText.trim();
    setMessageText('');
    setSending(true);

    try {
      const convId = [user.id, teamId].sort().join('_');

      await supabase.from('client_messages').insert({
        conversation_id: convId,
        sender_id: user.id,
        recipient_id: teamId,
        message_content: text,
        message_type: 'general',
      });
    } catch (err) {
      console.error('Error sending message:', err);
      setMessageText(text);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-[9998] md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={`fixed md:bottom-8 md:right-6 bottom-0 right-0 z-[9999] transition-all ${
          isOpen
            ? 'inset-0 md:inset-auto md:w-96 md:h-[500px]'
            : 'w-auto h-auto pointer-events-none md:pointer-events-auto'
        }`}
      >
        {isOpen && (
          <div className="flex flex-col bg-white rounded-none md:rounded-lg shadow-xl overflow-hidden h-full border border-gray-200">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#0F1E4D] to-[#1A3A7A] px-6 py-4 flex items-center justify-between text-white">
              <div>
                <h3 className="font-semibold text-base">{teamName}</h3>
                <p className="text-xs text-blue-100">Chat with the Team</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-white hover:bg-opacity-20 rounded p-1 transition-colors"
                aria-label="Close chat"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader size={24} className="text-gray-400 animate-spin" />
                </div>
              ) : messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-500 text-sm">
                  No messages yet
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
                      className={`max-w-[83%] px-4 py-2 rounded-lg text-sm ${
                        msg.sender_id === user?.id
                          ? 'bg-[#0F1E4D] text-white'
                          : 'bg-white text-gray-900 border border-gray-200'
                      }`}
                    >
                      <p className="break-words">{msg.message_content}</p>
                      <div
                        className={`text-xs mt-1 ${
                          msg.sender_id === user?.id
                            ? 'text-blue-100'
                            : 'text-gray-500'
                        }`}
                      >
                        {new Date(msg.created_at).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-gray-200 bg-white p-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  placeholder="Type a message..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#0F1E4D] focus:border-transparent"
                  disabled={sending}
                />
                <button
                  onClick={sendMessage}
                  disabled={!messageText.trim() || sending}
                  className="bg-[#0F1E4D] hover:bg-[#1A3A7A] disabled:opacity-50 text-white px-4 py-2 rounded text-sm font-medium transition-colors flex items-center gap-1"
                  aria-label="Send message"
                >
                  {sending ? (
                    <Loader size={16} className="animate-spin" />
                  ) : (
                    <Send size={16} />
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="fixed bottom-8 right-8 md:bottom-8 md:right-6 bg-[#0F1E4D] hover:bg-[#1A3A7A] text-white rounded-lg px-4 py-3 shadow-lg transition-all flex items-center gap-2 font-medium text-sm"
            aria-label="Open support chat"
          >
            <MessageCircle size={18} />
            <span className="hidden md:inline">Chat with the Team</span>
            {unreadCount > 0 && (
              <span className="ml-1 inline-flex items-center justify-center w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
        )}
      </div>
    </>
  );
}
