'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, MessageSquare, Phone, Loader, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { triggerMessageNotification } from '@/app/actions/messaging';

interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  message_content: string;
  message_type: string;
  related_document_id?: string;
  is_read: boolean;
  read_at?: string;
  created_at: string;
}

interface MessagingTabProps {
  userId: string;
  data: any;
  refreshData: () => void;
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

export default function MessagingTab({ userId, data, refreshData }: MessagingTabProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const [messageType, setMessageType] = useState<'general' | 'document_query' | 'intake_query'>('general');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [conversationId, setConversationId] = useState('');
  const [clientPreferences, setClientPreferences] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user && userId) {
      fetchConversation();
      fetchClientPreferences();
    }
  }, [user, userId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchClientPreferences = async () => {
    try {
      const { data: prefs } = await supabase
        .from('client_communication_preferences')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      setClientPreferences(prefs);
    } catch (err) {
      console.error('Error fetching preferences:', err);
    }
  };

  useEffect(() => {
    if (user && conversationId) {
      let subscription: any;
      let isMounted = true;

      subscription = supabase.channel(`admin_messages:${conversationId}`);

      subscription
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'client_messages',
            filter: `conversation_id=eq.${conversationId}`,
          },
          async (payload: any) => {
            if (isMounted) {
              if (payload.eventType === 'INSERT') {
                setMessages((prev) =>
                  prev.some((m) => m.id === payload.new.id) ? prev : [...prev, payload.new]
                );
              } else if (payload.eventType === 'UPDATE') {
                setMessages((prev) =>
                  prev.map((m) => (m.id === payload.new.id ? payload.new : m))
                );
              }
            }
          }
        )
        .subscribe();

      return () => {
        isMounted = false;
        subscription.unsubscribe();
      };
    }
  }, [user, conversationId]);

  const fetchConversation = async () => {
    setLoading(true);

    try {
      if (!user) return;

      const convId = [user.id, userId].sort().join('_');
      setConversationId(convId);

      const { data: messagesData, error } = await supabase
        .from('client_messages')
        .select('*')
        .eq('conversation_id', convId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching conversation:', error);
        setMessages([]);
        return;
      }

      setMessages(messagesData || []);

      // Mark client messages as read
      const unreadIds =
        messagesData
          ?.filter((m) => m.recipient_id === user.id && !m.is_read)
          .map((m) => m.id) || [];

      if (unreadIds.length > 0) {
        await supabase
          .from('client_messages')
          .update({ is_read: true, read_at: new Date().toISOString() })
          .in('id', unreadIds);
      }
    } catch (err) {
      console.error('Error fetching conversation:', err);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!messageText.trim() || !user || !conversationId) return;

    const optimisticMessage: Message = {
      id: `temp_${Date.now()}`,
      sender_id: user.id,
      recipient_id: userId,
      message_content: messageText.trim(),
      message_type: messageType,
      is_read: true,
      created_at: new Date().toISOString(),
    };

    // Add optimistic message immediately
    setMessages((prev) => [...prev, optimisticMessage]);
    setMessageText('');
    setSending(true);

    try {
      const { data: insertedData, error } = await supabase.from('client_messages').insert({
        conversation_id: conversationId,
        sender_id: user.id,
        recipient_id: userId,
        message_content: optimisticMessage.message_content,
        message_type: messageType,
      }).select('*');

      if (error) {
        console.error('Error sending message:', error);
        setMessages((prev) => prev.filter((m) => m.id !== optimisticMessage.id));
        setMessageText(optimisticMessage.message_content);
        return;
      }

      if (insertedData && insertedData.length > 0) {
        const newMessage = insertedData[0];
        // Replace optimistic message with real one
        setMessages((prev) =>
          prev.map((m) => (m.id === optimisticMessage.id ? newMessage : m))
        );

        await triggerMessageNotification({
          id: newMessage.id,
          sender_id: newMessage.sender_id,
          recipient_id: newMessage.recipient_id,
          message_content: newMessage.message_content,
          message_type: newMessage.message_type,
          created_at: newMessage.created_at,
        });
      }

      setMessageType('general');
    } catch (err) {
      console.error('Error sending message:', err);
      setMessages((prev) => prev.filter((m) => m.id !== optimisticMessage.id));
      setMessageText(optimisticMessage.message_content);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader size={32} className="text-[#1B3F7A] animate-spin mx-auto mb-2" />
          <p className="font-inter text-gray-600 text-sm">Loading messages...</p>
        </div>
      </div>
    );
  }

  const clientEmail = data?.email || 'Client';
  const unreadCount = messages.filter((m) => m.sender_id === userId && !m.is_read).length;
  const totalMessages = messages.length;

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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Left Panel - Conversation Info */}
      <div className="lg:col-span-1 space-y-4">
        {/* Client Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#1B3F7A] to-[#2C68C4] rounded-lg flex items-center justify-center">
              <MessageSquare size={20} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-inter font-semibold text-gray-900 text-sm truncate">{clientEmail}</p>
              <p className="font-inter text-gray-600 text-xs">Client</p>
            </div>
          </div>

          {/* Conversation Stats */}
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between bg-gray-50 rounded-lg p-2.5">
              <span className="font-inter text-gray-600 text-xs">Total Messages</span>
              <span className="font-inter font-semibold text-gray-900">{totalMessages}</span>
            </div>
            {unreadCount > 0 && (
              <div className="flex items-center justify-between bg-blue-50 rounded-lg p-2.5 border border-blue-100">
                <span className="font-inter text-blue-700 text-xs font-medium">Unread</span>
                <span className="font-inter font-semibold text-blue-700">{unreadCount}</span>
              </div>
            )}
          </div>
        </div>

        {/* Communication Preferences */}
        {clientPreferences && (
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <h4 className="font-inter font-semibold text-gray-900 text-sm mb-3">Contact Info</h4>

            {clientPreferences.phone_number && (
              <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-200">
                <Phone size={16} className="text-gray-500 shrink-0" />
                <p className="font-inter text-sm text-gray-700 break-all">{clientPreferences.phone_number}</p>
              </div>
            )}

            <div className="space-y-2">
              <p className="font-inter text-xs text-gray-600 font-medium uppercase tracking-wider mb-2">Notifications</p>

              {clientPreferences.email_notifications_enabled && (
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-blue-600" />
                  <span className="font-inter text-xs text-gray-700">Email enabled</span>
                </div>
              )}

              {clientPreferences.push_notifications_enabled && (
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-green-600" />
                  <span className="font-inter text-xs text-gray-700">Push enabled</span>
                </div>
              )}

              {clientPreferences.sms_notifications_enabled && (
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-purple-600" />
                  <span className="font-inter text-xs text-gray-700">SMS enabled</span>
                </div>
              )}

              {!clientPreferences.email_notifications_enabled &&
               !clientPreferences.push_notifications_enabled &&
               !clientPreferences.sms_notifications_enabled && (
                <div className="flex items-start gap-2 p-2 bg-gray-50 rounded">
                  <AlertCircle size={14} className="text-gray-500 shrink-0 mt-0.5" />
                  <span className="font-inter text-xs text-gray-600">No notifications enabled</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Quick Info */}
        <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
          <div className="flex items-start gap-2">
            <Clock size={16} className="text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-inter text-xs font-semibold text-blue-900 mb-1">Keep Messages Brief</p>
              <p className="font-inter text-xs text-blue-800">Clear, concise messages work best for client communication.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Messaging */}
      <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 overflow-hidden flex flex-col h-[600px] lg:h-auto">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gradient-to-b from-gray-50 to-white">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <MessageSquare size={32} className="text-gray-300 mx-auto mb-2" />
                <p className="font-inter font-semibold text-gray-900 text-sm">No messages yet</p>
                <p className="font-inter text-gray-600 text-xs mt-1">Start the conversation</p>
              </div>
            </div>
          ) : (
            <>
              {sortedDateKeys.map((dateKey) => (
                <div key={dateKey}>
                  {/* Date separator */}
                  <div className="flex items-center gap-2 my-2">
                    <div className="flex-1 border-t border-gray-200" />
                    <p className="text-xs font-inter text-gray-500 font-medium px-1">
                      {formatMessageDate(groupedMessages[dateKey][0].created_at)}
                    </p>
                    <div className="flex-1 border-t border-gray-200" />
                  </div>

                  {/* Messages for this date */}
                  <div className="space-y-1.5">
                    {groupedMessages[dateKey].map((msg) => (
                      <div key={msg.id} className={`flex ${msg.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}>
                        <div
                          className={`max-w-xs rounded-xl px-3 py-2 text-sm ${
                            msg.sender_id === user?.id
                              ? 'bg-[#1B3F7A] text-white rounded-br-none shadow-sm'
                              : 'bg-gray-100 text-gray-900 rounded-bl-none'
                          }`}
                        >
                          {msg.message_type !== 'general' && (
                            <p className={`text-xs font-inter font-semibold mb-1 opacity-75 ${
                              msg.sender_id === user?.id ? 'text-blue-100' : 'text-gray-700'
                            }`}>
                              {msg.message_type === 'document_query' && '📄 Document'}
                              {msg.message_type === 'intake_query' && '📋 Intake'}
                            </p>
                          )}
                          <p className="font-inter break-words leading-snug">{msg.message_content}</p>
                          <div className={`flex items-center justify-end gap-1 mt-1 text-xs font-inter ${
                            msg.sender_id === user?.id ? 'text-blue-100' : 'text-gray-600'
                          }`}>
                            <span>
                              {new Date(msg.created_at).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                            {msg.sender_id !== user?.id && msg.is_read && (
                              <CheckCircle2 size={12} />
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
        <div className="border-t border-gray-200 bg-white p-3 space-y-2">
          <select
            value={messageType}
            onChange={(e) => setMessageType(e.target.value as any)}
            className="w-full px-2.5 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B3F7A] focus:border-transparent font-inter text-xs bg-white"
          >
            <option value="general">Message</option>
            <option value="document_query">Document question</option>
            <option value="intake_query">Intake question</option>
          </select>

          <div className="flex gap-2">
            <input
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type message..."
              maxLength={500}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B3F7A] focus:border-transparent font-inter text-sm"
            />
            <button
              onClick={sendMessage}
              disabled={!messageText.trim() || sending}
              className="bg-[#1B3F7A] hover:bg-[#2C68C4] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-md px-3 py-2 transition-colors flex items-center justify-center"
            >
              {sending ? (
                <Loader size={16} className="animate-spin" />
              ) : (
                <Send size={16} />
              )}
            </button>
          </div>

          {messageText.length > 400 && (
            <p className="font-inter text-xs text-gray-500 text-right">
              {messageText.length}/500
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
