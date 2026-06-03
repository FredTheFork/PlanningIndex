'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, X, MessageCircle, Loader, MoreVertical, Smile, Paperclip, ChevronUp } from 'lucide-react';
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

export default function ChatBubble() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const [sending, setSending] = useState(false);
  const [teamMember, setTeamMember] = useState<TeamMember | null>(null);
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotification, setShowNotification] = useState(false);
  const [lastMessagePreview, setLastMessagePreview] = useState('');
  const [lastMessage, setLastMessage] = useState<Message | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isInitialLoadRef = useRef(true);

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    const behavior = isInitialLoadRef.current ? ('instant' as ScrollBehavior) : ('smooth' as ScrollBehavior);
    scrollToBottom(behavior);
    isInitialLoadRef.current = false;
  }, [messages]);

  // Scroll to bottom when modal opens (if messages already loaded)
  useEffect(() => {
    if (isOpen && messages.length > 0 && !loading) {
      scrollToBottom('instant');
    }
  }, [isOpen]);

  // Load team member data AND start subscription immediately
  useEffect(() => {
    if (!user) return;

    let isMounted = true;
    let subscription: any;

    const setupTeamMemberAndSubscription = async () => {
      try {
        const { data: adminData } = await supabase
          .from('admin_users')
          .select('user_id, display_name, profile_picture_url')
          .limit(1)
          .maybeSingle();

        if (!isMounted || !adminData) return;

        const teamMemberId = adminData.user_id;
        const conversationId = [user.id, teamMemberId].sort().join('_');

        // Set team member
        setTeamMember({
          id: teamMemberId,
          display_name: adminData.display_name || 'Our Team',
          profile_picture_url: adminData.profile_picture_url,
        });

        // Set conversation ID
        setConversationId(conversationId);

        // Set up real-time subscription IMMEDIATELY with the conversation ID
        subscription = supabase.channel(`messages:${conversationId}`);

        subscription
          .on(
            'postgres_changes',
            {
              event: 'INSERT',
              schema: 'public',
              table: 'client_messages',
              filter: `conversation_id=eq.${conversationId}`,
            },
            (payload: any) => {
              if (isMounted && payload.new) {
                // Only process messages where THIS user is the recipient (admin sent it to me)
                if (payload.new.recipient_id === user.id) {
                  setMessages((prev) => {
                    // Avoid duplicates
                    if (prev.some((m) => m.id === payload.new.id)) {
                      return prev;
                    }
                    return [...prev, payload.new as Message];
                  });
                  setLastMessage(payload.new as Message);

                  // Update unread count and show notification if unread
                  if (!payload.new.is_read) {
                    setUnreadCount((prev) => prev + 1);
                    setLastMessagePreview(payload.new.message_content);
                    setShowNotification(true);
                    setTimeout(() => {
                      if (isMounted) setShowNotification(false);
                    }, 5000);
                    // Mark as read
                    supabase
                      .from('client_messages')
                      .update({ is_read: true, read_at: new Date().toISOString() })
                      .eq('id', payload.new.id)
                      .then();
                  }
                }
              }
            }
          )
          .subscribe();
      } catch (err) {
        console.error('Error loading team member:', err);
      }
    };

    setupTeamMemberAndSubscription();

    return () => {
      isMounted = false;
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [user]);

  // Initialize unread count
  useEffect(() => {
    if (!user) return;

    let isMounted = true;

    const getUnreadCount = async () => {
      try {
        const { data: adminData } = await supabase
          .from('admin_users')
          .select('user_id')
          .limit(1)
          .maybeSingle();

        if (!isMounted || !adminData) return;

        const { data: messages } = await supabase
          .from('client_messages')
          .select('id, message_content')
          .eq('recipient_id', user.id)
          .eq('is_read', false)
          .order('created_at', { ascending: false })
          .limit(1);

        if (!isMounted) return;

        setUnreadCount(messages?.length || 0);
        if (messages && messages.length > 0) {
          setLastMessagePreview(messages[0].message_content);
          setLastMessage(messages[0] as Message);
        }
      } catch (err) {
        console.error('Error getting unread count:', err);
      }
    };

    getUnreadCount();

    return () => {
      isMounted = false;
    };
  }, [user]);

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
  }, [user, conversationId]);

  const sendMessage = async () => {
    if (!messageText.trim() || !user || !teamMember) return;

    const optimisticMessage: Message = {
      id: `temp_${Date.now()}`,
      sender_id: user.id,
      recipient_id: teamMember.id,
      message_content: messageText.trim(),
      message_type: 'general',
      is_read: true,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, optimisticMessage]);
    setMessageText('');
    setSending(true);

    try {
      const { data: insertedData, error } = await supabase
        .from('client_messages')
        .insert({
          conversation_id: conversationId,
          sender_id: user.id,
          recipient_id: teamMember.id,
          message_content: optimisticMessage.message_content,
          message_type: 'general',
        })
        .select('*');

      if (error) {
        console.error('Error sending message:', error);
        setMessages((prev) => prev.filter((m) => m.id !== optimisticMessage.id));
        setMessageText(optimisticMessage.message_content);
        return;
      }

      if (insertedData && insertedData.length > 0) {
        const newMessage = insertedData[0];
        setMessages((prev) =>
          prev.map((m) => (m.id === optimisticMessage.id ? newMessage : m))
        );

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
    } catch (err) {
      console.error('Error sending message:', err);
      setMessages((prev) => prev.filter((m) => m.id !== optimisticMessage.id));
      setMessageText(optimisticMessage.message_content);
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

  const closeChat = () => {
    setIsOpen(false);
  };

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
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-[9998] md:hidden backdrop-blur-sm transition-opacity duration-300"
          onClick={closeChat}
        />
      )}

      {/* Chat Modal Container */}
      <div
        className={`fixed md:bottom-8 md:right-12 bottom-0 right-0 z-[9999] transition-all duration-300 ${
          isOpen
            ? 'top-0 md:top-auto md:w-96 w-full'
            : 'md:w-auto md:h-auto w-16 h-auto pointer-events-none md:pointer-events-auto'
        }`}
      >
        {/* Chat Modal - visible when open */}
        {isOpen && (
          <div className="flex flex-col bg-white rounded-t-3xl md:rounded-3xl shadow-2xl overflow-hidden h-full md:max-h-[750px] animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Header */}
            <div className="relative">
              <div className="bg-gradient-to-r from-[#0F1E4D] to-[#1A3A7A] relative overflow-hidden pb-6">
                <div className="absolute top-0 -right-32 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl" />
                <div className="absolute -bottom-16 -left-32 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl" />

                <svg
                  className="absolute bottom-0 left-0 w-full h-8 text-white"
                  viewBox="0 0 1200 120"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0,50 Q300,0 600,50 T1200,50 L1200,120 L0,120 Z"
                    fill="currentColor"
                  />
                </svg>

                <div className="relative z-10 px-4 pt-4 pb-2">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="relative">
                        {teamMember?.profile_picture_url ? (
                          <img
                            src={teamMember.profile_picture_url}
                            alt={teamMember.display_name}
                            className="w-14 h-14 rounded-full object-cover border-3 border-white shadow-lg"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-full bg-white bg-opacity-20 flex items-center justify-center border-3 border-white shadow-lg backdrop-blur-sm">
                            <MessageCircle size={28} className="text-white" />
                          </div>
                        )}
                        <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-400 border-2 border-white rounded-full shadow-lg" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-semibold leading-tight">Chat with</p>
                        <p className="text-white text-lg font-bold truncate">
                          {teamMember?.display_name || 'Our Team'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-2">
                      <button className="hover:bg-white hover:bg-opacity-15 rounded-full p-2 transition-colors duration-200 text-white">
                        <MoreVertical size={20} />
                      </button>
                      <button
                        onClick={closeChat}
                        className="hover:bg-white hover:bg-opacity-15 rounded-full p-2 transition-colors duration-200 text-white"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  </div>

                  <p className="text-blue-100 text-sm font-medium pl-0">We're online</p>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-blue-50 via-gray-50 to-white">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-3">
                      <Loader size={32} className="text-blue-600 animate-spin" />
                    </div>
                    <p className="text-sm text-gray-600 font-inter">Loading messages...</p>
                  </div>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-full p-6 mb-4 shadow-lg">
                    <MessageCircle size={40} className="text-blue-600" />
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
                      <div className="flex items-center gap-3 my-4">
                        <div className="flex-1 border-t border-gray-200" />
                        <p className="text-xs font-inter text-gray-500 font-medium px-3 py-1 bg-white rounded-full border border-gray-200">
                          {formatMessageDate(groupedMessages[dateKey][0].created_at)}
                        </p>
                        <div className="flex-1 border-t border-gray-200" />
                      </div>

                      <div className="space-y-3">
                        {groupedMessages[dateKey].map((msg) => (
                          <div
                            key={msg.id}
                            className={`flex ${
                              msg.sender_id === user?.id ? 'justify-end' : 'justify-start'
                            } animate-in fade-in slide-in-from-bottom-2 duration-300`}
                          >
                            <div
                              className={`max-w-xs px-4 py-3 rounded-2xl ${
                                msg.sender_id === user?.id
                                  ? 'bg-gradient-to-br from-[#0F3A7D] to-[#1A4A9E] text-white rounded-br-none shadow-md'
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
            <div className="border-t border-gray-200 bg-white p-4">
              <div className="space-y-3">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter your message..."
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-inter text-sm bg-gray-50 transition-all shadow-sm hover:shadow-md"
                    disabled={sending}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!messageText.trim() || sending}
                    className="bg-gradient-to-br from-[#0F3A7D] to-[#1A4A9E] hover:from-[#1A4A9E] hover:to-[#0F2E63] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full p-3 transition-all flex items-center justify-center shadow-md hover:shadow-lg active:scale-95"
                    aria-label="Send message"
                  >
                    {sending ? (
                      <Loader size={18} className="animate-spin" />
                    ) : (
                      <Send size={18} />
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between px-1">
                  <div className="flex gap-2">
                    <button className="hover:text-blue-600 text-gray-500 transition-colors p-2 hover:bg-blue-50 rounded-full">
                      <Smile size={20} />
                    </button>
                    <button className="hover:text-blue-600 text-gray-500 transition-colors p-2 hover:bg-blue-50 rounded-full">
                      <Paperclip size={20} />
                    </button>
                  </div>
                  {messageText.length > 400 && (
                    <p className="font-inter text-xs text-gray-500">
                      {messageText.length}/500
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Closed Toggle Tab with Message Preview */}
        {!isOpen && (
          <div className="relative">
            {/* Message Preview Bubble */}
            {lastMessage && lastMessage.sender_id !== user?.id && (
              <div className="absolute -top-16 left-0 md:left-auto md:-top-20 md:right-0 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="bg-white rounded-2xl px-4 py-3 shadow-lg border border-gray-100 max-w-xs">
                  <p className="font-inter text-sm text-gray-900 break-words leading-relaxed">
                    {lastMessage.message_content}
                  </p>
                  {/* Pointer triangle */}
                  <div className="absolute -bottom-2 left-6 md:left-auto md:right-6 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-white" />
                </div>
              </div>
            )}

            {/* Toggle Button */}
            <button
              onClick={() => setIsOpen(true)}
              className="fixed bottom-8 right-8 md:bottom-0 md:right-6 bg-gradient-to-br from-[#0F1E4D] to-[#1A3A7A] hover:from-[#1A3A7A] hover:to-[#0F2E63] text-white rounded-t-3xl md:rounded-t-3xl px-5 py-3 shadow-2xl hover:shadow-[0_20px_40px_rgba(15,30,77,0.4)] transition-all duration-300 flex items-center gap-2 group animate-in fade-in slide-in-from-bottom-2 duration-300"
              aria-label="Open chat"
              style={
                unreadCount > 0
                  ? {
                      animation:
                        'breathe 2.5s ease-in-out infinite, slideIn 0.3s ease-out',
                    }
                  : undefined
              }
            >
              <div className="relative">
                <MessageCircle size={20} strokeWidth={1.5} />
                {unreadCount > 0 && (
                  <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold animate-pulse shadow-lg">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </div>
                )}
              </div>

              <span className="font-inter text-sm font-semibold hidden md:inline whitespace-nowrap">
                {unreadCount > 0 ? `${unreadCount} new` : 'Talk with the team'}
              </span>

              <ChevronUp
                size={18}
                className="hidden md:inline transition-transform duration-300 group-hover:-translate-y-1"
              />

              <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs font-medium px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none md:hidden">
                {unreadCount > 0
                  ? `${unreadCount} new message${unreadCount !== 1 ? 's' : ''}`
                  : 'Talk with the team'}
              </span>

              <style>{`
                @keyframes breathe {
                  0%, 100% { box-shadow: 0 0 20px 0 rgba(15, 30, 77, 0.4), 0 10px 25px -5px rgba(0, 0, 0, 0.1); }
                  50% { box-shadow: 0 0 30px 0 rgba(15, 30, 77, 0.6), 0 10px 25px -5px rgba(0, 0, 0, 0.15); }
                }
                @keyframes slideIn {
                  from {
                    opacity: 0;
                    transform: translateY(10px);
                  }
                  to {
                    opacity: 1;
                    transform: translateY(0);
                  }
                }
              `}</style>
            </button>
          </div>
        )}
      </div>
    </>
  );
}
