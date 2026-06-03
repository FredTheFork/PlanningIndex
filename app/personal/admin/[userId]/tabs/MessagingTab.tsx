'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, MessageSquare, Filter, Phone } from 'lucide-react';
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
      const { data: prefs, error } = await supabase
        .from('client_communication_preferences')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching preferences:', error);
      }

      setClientPreferences(prefs);
    } catch (err) {
      console.error('Error fetching preferences:', err);
    }
  };

  useEffect(() => {
    if (user && conversationId) {
      // Subscribe to real-time message updates
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
        alert('Failed to send message: ' + error.message);
        return;
      }

      // Trigger notification via server action if message was inserted
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
      alert('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-navy mx-auto mb-2" />
          <p className="font-inter text-secondary-text text-sm">Loading messages...</p>
        </div>
      </div>
    );
  }

  const clientEmail = data?.email || 'Unknown';
  const unreadCount = messages.filter((m) => m.sender_id === userId && !m.is_read).length;

  return (
    <div className="bg-white rounded-lg border border-border overflow-hidden flex flex-col h-full max-h-screen">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="bg-blue-50 rounded-lg p-2">
              <MessageSquare size={20} className="text-medium-blue" />
            </div>
            <div>
              <h3 className="font-inter font-bold text-navy text-base">Direct Messaging</h3>
              <p className="font-inter text-secondary-text text-xs">
                {clientEmail}
                {unreadCount > 0 && ` · ${unreadCount} unread`}
              </p>
            </div>
          </div>
        </div>

        {/* Client Contact Info */}
        {clientPreferences && (
          <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
            {clientPreferences.phone_number && clientPreferences.push_notifications_enabled && (
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-secondary-text" />
                <p className="font-inter text-xs text-secondary-text">
                  {clientPreferences.phone_number}
                </p>
              </div>
            )}
            <div className="flex items-center gap-2 flex-wrap">
              {clientPreferences.email_notifications_enabled && (
                <span className="inline-block bg-blue-50 border border-blue-200 rounded px-2 py-1">
                  <p className="font-inter text-xs text-medium-blue">Email enabled</p>
                </span>
              )}
              {clientPreferences.push_notifications_enabled && (
                <span className="inline-block bg-green-50 border border-green-200 rounded px-2 py-1">
                  <p className="font-inter text-xs text-success">Push enabled</p>
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <MessageSquare size={32} className="text-gray-300 mx-auto mb-3" />
              <p className="font-inter text-secondary-text text-sm">No messages yet</p>
              <p className="font-inter text-secondary-text text-xs mt-1">
                Start a conversation with this client
              </p>
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-xs lg:max-w-md rounded-lg p-3 ${
                  msg.sender_id === user?.id
                    ? 'bg-medium-blue text-white'
                    : 'bg-white border border-gray-200 text-navy'
                }`}
              >
                <p className="font-inter text-sm break-words">{msg.message_content}</p>
                <div className={`flex items-center justify-between mt-1 gap-2 ${
                  msg.sender_id === user?.id ? 'text-blue-100' : 'text-secondary-text'
                }`}>
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
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border bg-white space-y-3">
        <div className="flex gap-2">
          <select
            value={messageType}
            onChange={(e) => setMessageType(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-medium-blue font-inter text-sm"
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
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-medium-blue font-inter text-sm"
          />
          <button
            onClick={sendMessage}
            disabled={!messageText.trim() || sending}
            className="bg-navy hover:bg-medium-blue disabled:opacity-50 text-white rounded-lg px-4 py-2.5 transition-colors flex items-center gap-2"
          >
            <Send size={18} />
            {sending && <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white" />}
          </button>
        </div>
        <p className="font-inter text-xs text-secondary-text">
          {messageText.length}/500 characters
        </p>
      </div>
    </div>
  );
}
