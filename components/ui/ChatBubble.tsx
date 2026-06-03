'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, X, MessageCircle, Loader, ChevronDown } from 'lucide-react';
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

const WaveDivider = () => (
  <svg
    className="w-full h-8 text-white"
    viewBox="0 0 1200 120"
    preserveAspectRatio="none"
  >
    <path
      d="M0,50 Q300,0 600,50 T1200,50 L1200,120 L0,120 Z"
      fill="currentColor"
    />
  </svg>
);

const formatMessageDate = (date: string) => {
  const msgDate = new Date(date);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (msgDate.toDateString() === today.toDateString()) return 'Today';
  if (msgDate.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return msgDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const getMessageGroupKey = (date: string) => {
  return new Date(date).toDateString();
};

export default function ChatBubble({ isOpen, onClose }: ChatBubbleProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const [sending, setSending] = useState(false);
  const [teamMember, setTeamMember] = useState<TeamMember | null>(null);
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load team member data
  useEffect(() => {
    if (!user || !isOpen) return;

    const loadTeamMember = async () => {
      try {
        const { data: adminData } = await supabase
          .from('admin_users')
          .select('user_id, display_name, profile_picture_url')
          .limit(1)
          .maybeSingle();

        if (adminData) {
          setTeamMember({
            id: adminData.user_id,
            display_name: adminData.display_name || 'Our Team',
            profile_picture_url: adminData.profile_picture_url,
          });
          setConversationId([user.id, adminData.user_id].sort().join('_'));
        }
      } catch (err) {
        console.error('Error loading team member:', err);
      }
    };

    loadTeamMember();
  }, [user, isOpen]);

  // Load messages
  useEffect(() => {
    if (!user || !conversationId) return;

    const loadMessages = async () => {
      setLoading(true);
      try {
        const { data: messagesData } = await supabase
          .from('client_messages')
          .select('*')
          .eq('conversation_id', conversationId)
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
          }
        }
      } catch (err) {
        console.error('Error loading messages:', err);
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
  }, [user, conversationId]);

  // Real-time subscription for new messages
  useEffect(() => {
    if (!user || !conversationId) return;

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
          if (payload.new) {
            setMessages((prev) => [...prev, payload.new as Message]);
            if (payload.new.recipient_id === user.id && payload.new.sender_id !== user.id) {
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

    return () => {
      subscription.unsubscribe();
    };
  }, [user, conversationId]);

  const sendMessage = async () => {
    if (!messageText.trim() || !user || !teamMember) return;

    setSending(true);
    try {
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

  // Group messages by date
  const groupedMessages: { [key: string]: Message[] } = {};
  messages.forEach((msg) => {
    const dateKey = getMessageGroupKey(msg.created_at);
    if (!groupedMessages[dateKey]) {
      groupedMessages[dateKey] = [];
    }
    groupedMessages[dateKey].push(msg);
  });
  const sortedDateKeys = Object.keys(groupedMessages).sort();

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-30 z-40 md:hidden"
        onClick={onClose}
      />

      {/* Chat Modal */}
      <div
        className={`fixed bottom-0 right-0 top-0 md:bottom-6 md:right-6 md:top-auto md:w-96 w-full z-50 flex flex-col bg-white rounded-t-3xl md:rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ${
          isMinimized ? 'md:max-h-16' : 'max-h-screen md:max-h-[650px]'
        }`}
      >
        {/* Header with gradient background and wave */}
        <div className="bg-gradient-to-r from-[#1e3a8a] to-[#2563eb] text-white relative overflow-hidden">
          {/* Header content */}
          <div className="p-4 pb-0 relative z-10">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                {teamMember?.profile_picture_url ? (
                  <img
                    src={teamMember.profile_picture_url}
                    alt={teamMember.display_name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-lg"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-white bg-opacity-30 flex items-center justify-center shadow-lg">
                    <MessageCircle size={24} className="text-white" />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="font-inter font-semibold text-base leading-tight">
                    Chat with {teamMember?.display_name || 'Our Team'}
                  </h3>
                  <p className="text-xs text-blue-100 mt-0.5">We're here to help</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors"
                  aria-label="Minimize chat"
                >
                  <ChevronDown size={20} className={`transition-transform ${isMinimized ? 'rotate-180' : ''}`} />
                </button>
                <button
                  onClick={onClose}
                  className="hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors"
                  aria-label="Close chat"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Wave divider */}
          {!isMinimized && <WaveDivider />}
        </div>

        {/* Messages Area */}
        {!isMinimized && (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-gradient-to-b from-gray-50 to-white">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <Loader size={32} className="text-blue-500 animate-spin mx-auto mb-2" />
                    <p className="text-sm text-gray-600 font-inter">Loading messages...</p>
                  </div>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <div className="bg-blue-50 rounded-full p-6 mb-4">
                    <MessageCircle size={40} className="text-blue-500" />
                  </div>
                  <p className="font-inter font-semibold text-gray-900 mb-2">
                    Welcome to our support channel
                  </p>
                  <p className="font-inter text-sm text-gray-600">
                    We're the team responsible for your documents. How can we help?
                  </p>
                </div>
              ) : (
                <>
                  {sortedDateKeys.map((dateKey) => (
                    <div key={dateKey}>
                      {/* Date separator */}
                      <div className="flex items-center gap-3 my-4">
                        <div className="flex-1 border-t border-gray-200" />
                        <p className="text-xs font-inter text-gray-500 font-medium px-2">
                          {formatMessageDate(groupedMessages[dateKey][0].created_at)}
                        </p>
                        <div className="flex-1 border-t border-gray-200" />
                      </div>

                      {/* Messages for this date */}
                      <div className="space-y-3">
                        {groupedMessages[dateKey].map((msg) => (
                          <div
                            key={msg.id}
                            className={`flex ${msg.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-xs px-4 py-3 rounded-2xl ${
                                msg.sender_id === user?.id
                                  ? 'bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] text-white rounded-br-none shadow-md'
                                  : 'bg-white text-gray-900 border border-gray-200 rounded-bl-none shadow-sm'
                              }`}
                            >
                              <p className="font-inter text-sm break-words leading-relaxed">
                                {msg.message_content}
                              </p>
                              <div
                                className={`flex items-center gap-1 mt-2 ${
                                  msg.sender_id === user?.id
                                    ? 'text-blue-100 justify-end'
                                    : 'text-gray-500'
                                }`}
                              >
                                <p className="font-inter text-xs">
                                  {new Date(msg.created_at).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </p>
                                {msg.sender_id === user?.id && msg.is_read && (
                                  <span className="text-xs ml-1">✓</span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </>
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
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-inter text-sm bg-gray-50 transition-colors"
                  disabled={sending}
                />
                <button
                  onClick={sendMessage}
                  disabled={!messageText.trim() || sending}
                  className="bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] hover:from-[#1d4ed8] hover:to-[#1e40af] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full p-3 transition-all flex items-center justify-center shadow-md hover:shadow-lg"
                  aria-label="Send message"
                >
                  {sending ? (
                    <Loader size={18} className="animate-spin" />
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M16.6915026,12.4744748 L3.50612381,13.2599618 C3.19218622,13.2599618 3.03521743,13.4170592 3.03521743,13.5741566 L1.15159189,20.0151496 C0.8376543,20.8006365 0.99,21.89 1.77946707,22.52 C2.41,22.99 3.50612381,23.1 4.13399899,22.8429026 L21.714504,14.0454487 C22.6563168,13.5741566 23.1272231,12.6315722 22.9702544,11.6889879 L4.13399899,1.16386554 C3.34915502,0.9 2.40734225,1.00636533 1.77946707,1.4776575 C0.994623095,2.10604706 0.837654326,3.0486314 1.15159189,3.99021575 L3.03521743,10.4310088 C3.03521743,10.5881061 3.34915502,10.7452035 3.50612381,10.7452035 L16.6915026,11.5306905 C16.6915026,11.5306905 17.1624089,11.5306905 17.1624089,12.0019827 C17.1624089,12.4744748 16.6915026,12.4744748 16.6915026,12.4744748 Z" />
                    </svg>
                  )}
                </button>
              </div>
              {messageText.length > 400 && (
                <p className="font-inter text-xs text-gray-500 mt-2">
                  {messageText.length}/500 characters
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}
