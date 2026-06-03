'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, MessageSquare, Phone, Loader } from 'lucide-react';
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
      const subscription = supabase
        .channel(`admin_messages:${conversationId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'client_messages',
            filter: `conversation_id=eq.${conversationId}`,
          },
          () => {
            fetchConversation();
          }
        )
        .subscribe();

      return () => {
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

    setSending(true);

    try {
      const { data: insertedData, error } = await supabase.from('client_messages').insert({
        conversation_id: conversationId,
        sender_id: user.id,
        recipient_id: userId,
        message_content: messageText.trim(),
        message_type: messageType,
      }).select('*');

      if (error) {
        console.error('Error sending message:', error);
        return;
      }

      if (insertedData && insertedData.length > 0) {
        const newMessage = insertedData[0];
        await triggerMessageNotification({
          id: newMessage.id,
          sender_id: newMessage.sender_id,
          recipient_id: newMessage.recipient_id,
          message_content: newMessage.message_content,
          message_type: newMessage.message_type,
          created_at: newMessage.created_at,
        });
      }

      setMessageText('');
      setMessageType('general');
      await fetchConversation();
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader size={32} className="text-blue-500 animate-spin mx-auto mb-2" />
          <p className="font-inter text-secondary-text text-sm">Loading messages...</p>
        </div>
      </div>
    );
  }

  const clientEmail = data?.email || 'Client';
  const unreadCount = messages.filter((m) => m.sender_id === userId && !m.is_read).length;

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
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden flex flex-col h-screen md:h-full md:max-h-screen">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 rounded-lg p-2">
              <MessageSquare size={20} className="text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-inter font-semibold text-gray-900 text-base">Conversation</h3>
              <p className="font-inter text-gray-600 text-sm">
                {clientEmail}
                {unreadCount > 0 && <span className="text-blue-600 ml-2 font-medium">({unreadCount} unread)</span>}
              </p>
            </div>
          </div>
        </div>

        {/* Client Contact Info */}
        {clientPreferences && (
          <div className="pt-3 border-t border-gray-200 space-y-2">
            {clientPreferences.phone_number && (
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-gray-500" />
                <p className="font-inter text-sm text-gray-700">
                  {clientPreferences.phone_number}
                </p>
              </div>
            )}
            <div className="flex items-center gap-2 flex-wrap">
              {clientPreferences.email_notifications_enabled && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 border border-blue-200 rounded text-xs font-inter font-medium text-blue-700">
                  <span className="w-2 h-2 rounded-full bg-blue-600" />
                  Email enabled
                </span>
              )}
              {clientPreferences.push_notifications_enabled && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-50 border border-green-200 rounded text-xs font-inter font-medium text-green-700">
                  <span className="w-2 h-2 rounded-full bg-green-600" />
                  Push enabled
                </span>
              )}
              {clientPreferences.sms_notifications_enabled && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-50 border border-purple-200 rounded text-xs font-inter font-medium text-purple-700">
                  <span className="w-2 h-2 rounded-full bg-purple-600" />
                  SMS enabled
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-gradient-to-b from-gray-50 to-white">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <MessageSquare size={40} className="text-gray-300 mx-auto mb-3" />
              <p className="font-inter font-semibold text-gray-900">No messages yet</p>
              <p className="font-inter text-gray-600 text-sm mt-1">
                Start a conversation with this client
              </p>
            </div>
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
                    <div key={msg.id} className={`flex ${msg.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-xs lg:max-w-md rounded-2xl p-4 ${
                          msg.sender_id === user?.id
                            ? 'bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] text-white rounded-br-none shadow-md'
                            : 'bg-white text-gray-900 border border-gray-200 rounded-bl-none shadow-sm'
                        }`}
                      >
                        {msg.message_type !== 'general' && (
                          <p className="text-xs font-inter font-semibold mb-2 opacity-80">
                            {msg.message_type === 'document_query' && 'Question about a document'}
                            {msg.message_type === 'intake_query' && 'Question about intake form'}
                          </p>
                        )}
                        <p className="font-inter text-sm break-words leading-relaxed">{msg.message_content}</p>
                        <div
                          className={`flex items-center justify-between mt-2 gap-2 ${
                            msg.sender_id === user?.id ? 'text-blue-100' : 'text-gray-500'
                          }`}
                        >
                          <p className="font-inter text-xs">
                            {new Date(msg.created_at).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                          {msg.sender_id !== user?.id && msg.is_read && (
                            <p className="font-inter text-xs">Read</p>
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

      {/* Input */}
      <div className="p-4 border-t border-gray-200 bg-white space-y-3">
        <div className="flex gap-2">
          <select
            value={messageType}
            onChange={(e) => setMessageType(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-inter text-sm bg-white"
          >
            <option value="general">General message</option>
            <option value="document_query">About a document</option>
            <option value="intake_query">About intake form</option>
          </select>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type your message..."
            maxLength={500}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-inter text-sm"
          />
          <button
            onClick={sendMessage}
            disabled={!messageText.trim() || sending}
            className="bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] hover:from-[#1d4ed8] hover:to-[#1e40af] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg px-4 py-3 transition-all flex items-center gap-2 font-medium"
          >
            {sending ? (
              <Loader size={18} className="animate-spin" />
            ) : (
              <>
                <Send size={18} />
                <span className="hidden sm:inline">Send</span>
              </>
            )}
          </button>
        </div>
        {messageText.length > 400 && (
          <p className="font-inter text-xs text-gray-500">
            {messageText.length}/500 characters
          </p>
        )}
      </div>
    </div>
  );
}
