'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, MessageSquare, Phone, Loader, Clock, AlertCircle, CheckCircle2, Unlock } from 'lucide-react';
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

const getMessageGroupKey = (date: string) => new Date(date).toDateString();

const POLL_INTERVAL = 3000;

export default function MessagingTab({ userId, data, refreshData }: MessagingTabProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const [messageType, setMessageType] = useState<'general' | 'document_query' | 'intake_query'>('general');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [conversationId, setConversationId] = useState('');
  const [clientPreferences, setClientPreferences] = useState<any>(null);
  const [clientEditGranted, setClientEditGranted] = useState(false);
  const [clientSubmissionCount, setClientSubmissionCount] = useState(0);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const isInitialLoadRef = useRef(true);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const lastFetchTimeRef = useRef('');
  const componentActiveRef = useRef(true);

  useEffect(() => {
    componentActiveRef.current = true;
    return () => {
      componentActiveRef.current = false;
    };
  }, []);

  // Compute and set conversation ID
  useEffect(() => {
    if (user && userId) {
      const convId = [user.id, userId].sort().join('_');
      setConversationId(convId);
    }
  }, [user, userId]);

  // Load messages and setup subscriptions
  useEffect(() => {
    if (!conversationId || !user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    lastFetchTimeRef.current = '';

    // Fetch initial messages
    const loadInitialMessages = async () => {
      try {
        const { data: msgs, error } = await supabase
          .from('client_messages')
          .select('*')
          .eq('conversation_id', conversationId)
          .order('created_at', { ascending: true });

        if (!componentActiveRef.current) return;
        if (error) {
          console.error('[MessagingTab] Query error:', error);
          setMessages([]);
        } else {
          setMessages(msgs || []);
          if (msgs && msgs.length > 0) {
            lastFetchTimeRef.current = msgs[msgs.length - 1].created_at;
          }

          // Mark unread as read
          const unreadIds = (msgs || [])
            .filter((m) => m.recipient_id === user.id && !m.is_read)
            .map((m) => m.id);
          if (unreadIds.length > 0) {
            supabase
              .from('client_messages')
              .update({ is_read: true, read_at: new Date().toISOString() })
              .in('id', unreadIds)
              .then();
          }
        }
      } catch (err) {
        console.error('[MessagingTab] Load error:', err);
      } finally {
        if (componentActiveRef.current) setLoading(false);
      }
    };

    loadInitialMessages();

    // Fetch preferences
    supabase
      .from('client_communication_preferences')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()
      .then(({ data: prefs }) => {
        if (componentActiveRef.current) setClientPreferences(prefs);
      });

    // Check if client already has edit access and their submission count
    supabase
      .from('intake_responses')
      .select('edit_granted_at, submission_count')
      .eq('user_id', userId)
      .maybeSingle()
      .then(({ data: intakeData }) => {
        if (componentActiveRef.current) {
          if (intakeData?.edit_granted_at) setClientEditGranted(true);
          setClientSubmissionCount(intakeData?.submission_count || 0);
        }
      });

    // Setup Realtime
    const channel = supabase.channel(`messages:${conversationId}`);

    channel.on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'client_messages',
        filter: `conversation_id=eq.${conversationId}`,
      },
      (payload: any) => {
        if (!componentActiveRef.current) return;
        const newMsg = payload.new as Message;

        setMessages((prev) => {
          const exists = prev.some((m) => m.id === newMsg.id);
          if (exists) return prev;

          const tempIdx = prev.findIndex(
            (m) =>
              m.id.startsWith('temp_') &&
              m.sender_id === newMsg.sender_id &&
              m.message_content === newMsg.message_content
          );
          if (tempIdx !== -1) {
            return prev.map((m, i) => (i === tempIdx ? newMsg : m));
          }

          return [...prev, newMsg];
        });

        lastFetchTimeRef.current = newMsg.created_at;

        if (newMsg.recipient_id === user.id && !newMsg.is_read) {
          supabase
            .from('client_messages')
            .update({ is_read: true, read_at: new Date().toISOString() })
            .eq('id', newMsg.id)
            .then();
        }
      }
    );

    channel.on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'client_messages',
        filter: `conversation_id=eq.${conversationId}`,
      },
      (payload: any) => {
        if (!componentActiveRef.current) return;
        setMessages((prev) =>
          prev.map((m) => (m.id === payload.new.id ? payload.new : m))
        );
      }
    );

    channel.subscribe();
    channelRef.current = channel;

    // Poll for new messages
    const pollMessages = async () => {
      if (!componentActiveRef.current) return;
      try {
        let query = supabase
          .from('client_messages')
          .select('*')
          .eq('conversation_id', conversationId)
          .order('created_at', { ascending: true });

        if (lastFetchTimeRef.current) {
          query = query.gt('created_at', lastFetchTimeRef.current);
        }

        const { data: newMsgs, error } = await query;

        if (!componentActiveRef.current || error) return;
        if (!newMsgs || newMsgs.length === 0) return;

        setMessages((prev) => {
          const existingIds = new Set(prev.map((m) => m.id));
          const trulyNew = newMsgs.filter((m) => !existingIds.has(m.id));
          if (trulyNew.length === 0) return prev;
          return [...prev, ...trulyNew];
        });

        lastFetchTimeRef.current = newMsgs[newMsgs.length - 1].created_at;

        const unreadNew = newMsgs.filter(
          (m) => m.recipient_id === user.id && !m.is_read
        );
        if (unreadNew.length > 0) {
          supabase
            .from('client_messages')
            .update({ is_read: true, read_at: new Date().toISOString() })
            .in('id', unreadNew.map((m) => m.id))
            .then();
        }
      } catch (err) {
        console.error('[MessagingTab] Poll error:', err);
      }
    };

    pollingRef.current = setInterval(pollMessages, POLL_INTERVAL);

    // Refetch handlers
    const handleFocus = () => {
      if (componentActiveRef.current) loadInitialMessages();
    };

    const handleVisibility = () => {
      if (
        document.visibilityState === 'visible' &&
        componentActiveRef.current
      ) {
        loadInitialMessages();
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      channel.unsubscribe();
      if (pollingRef.current) clearInterval(pollingRef.current);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [conversationId, user?.id]);

  // Reset componentActive on remount
  useEffect(() => {
    componentActiveRef.current = true;
  }, []);

  // Auto-scroll chat container only on messages change
  useEffect(() => {
    const container = chatContainerRef.current;
    if (!container) return;
    const behavior = isInitialLoadRef.current ? 'instant' : 'smooth';
    container.scrollTo({ top: container.scrollHeight, behavior });
    isInitialLoadRef.current = false;
  }, [messages]);

  const sendMessage = async () => {
    if (!messageText.trim() || !user || !conversationId) return;
    const text = messageText.trim();
    const optimisticId = `temp_${Date.now()}`;

    const optimisticMessage: Message = {
      id: optimisticId,
      sender_id: user.id,
      recipient_id: userId,
      message_content: text,
      message_type: messageType,
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
          recipient_id: userId,
          message_content: text,
          message_type: messageType,
        })
        .select('*');

      if (error) {
        console.error('Error sending message:', error);
        setMessages((prev) => prev.filter((m) => m.id !== optimisticId));
        setMessageText(text);
        return;
      }

      if (insertedData && insertedData.length > 0) {
        const newMessage = insertedData[0];
        lastFetchTimeRef.current = newMessage.created_at;
        setMessages((prev) => {
          if (prev.some((m) => m.id === newMessage.id)) {
            return prev.filter((m) => m.id !== optimisticId);
          }
          return prev.map((m) => (m.id === optimisticId ? newMessage : m));
        });

        triggerMessageNotification({
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
      setMessages((prev) => prev.filter((m) => m.id !== optimisticId));
      setMessageText(text);
    } finally {
      setSending(false);
    }
  };

  const handleGrantEditAccess = async () => {
    if (!user) return;

    // Re-check submission count before granting (server-side validation)
    const { data: intakeCheck } = await supabase
      .from('intake_responses')
      .select('submission_count, submitted_at')
      .eq('user_id', userId)
      .maybeSingle();

    if (intakeCheck && (intakeCheck.submission_count || 0) >= 3) {
      console.error('Cannot grant edit access — client has reached maximum submissions');
      return;
    }

    try {
      const now = new Date().toISOString();
      // Grant edit access in intake_responses
      const { error: updateError } = await supabase
        .from('intake_responses')
        .update({ edit_granted_at: now, edit_granted_by: user.id })
        .eq('user_id', userId);

      if (updateError) {
        console.error('Error granting edit access:', updateError);
        return;
      }

      setClientEditGranted(true);

      // Send confirmation message to client
      const { error: msgError } = await supabase
        .from('client_messages')
        .insert({
          conversation_id: conversationId,
          sender_id: user.id,
          recipient_id: userId,
          message_content: 'You have been granted access to edit your intake form. Go to the Intake Form page to make your changes.',
          message_type: 'intake_edit_granted',
        });

      if (msgError) {
        console.error('Error sending grant message:', msgError);
      }
    } catch (err) {
      console.error('Error granting edit access:', err);
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

  const groupedMessages: { [key: string]: Message[] } = {};
  messages.forEach((msg) => {
    const dateKey = getMessageGroupKey(msg.created_at);
    if (!groupedMessages[dateKey]) groupedMessages[dateKey] = [];
    groupedMessages[dateKey].push(msg);
  });
  const sortedDateKeys = Object.keys(groupedMessages).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-280px)]">
      {/* Left Panel */}
      <div className="lg:col-span-1 space-y-4 overflow-y-auto">
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
                  <CheckCircle2 size={14} className="text-emerald-600" />
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
      <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 overflow-hidden flex flex-col h-full">
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-3 space-y-3 bg-gradient-to-b from-gray-50 to-white">
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
                  <div className="flex items-center gap-2 my-2">
                    <div className="flex-1 border-t border-gray-200" />
                    <p className="text-xs font-inter text-gray-500 font-medium px-1">
                      {formatMessageDate(groupedMessages[dateKey][0].created_at)}
                    </p>
                    <div className="flex-1 border-t border-gray-200" />
                  </div>
                  <div className="space-y-1.5">
                    {groupedMessages[dateKey].map((msg) => (
                      <div key={msg.id} className={`flex ${msg.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}>
                        <div
                          className={`max-w-[83%] rounded-xl px-3 py-2 text-sm ${
                            msg.sender_id === user?.id
                              ? 'bg-[#1B3F7A] text-white rounded-br-none shadow-sm'
                              : 'bg-gray-100 text-gray-900 rounded-bl-none'
                          }`}
                        >
                          {msg.message_type !== 'general' && (
                            <p className={`text-xs font-inter font-semibold mb-1 opacity-75 ${
                              msg.sender_id === user?.id ? 'text-blue-100' : 'text-gray-700'
                            }`}>
                              {msg.message_type === 'document_query' && 'Document'}
                              {msg.message_type === 'intake_query' && 'Intake'}
                              {msg.message_type === 'intake_edit_request' && 'Edit Request'}
                              {msg.message_type === 'intake_edit_granted' && 'Edit Access'}
                            </p>
                          )}
                          <p className="font-inter break-words leading-snug">{msg.message_content}</p>
                          <div className={`flex items-center justify-end gap-1 mt-1 text-xs font-inter ${
                            msg.sender_id === user?.id ? 'text-blue-100' : 'text-gray-600'
                          }`}>
                            <span>
                              {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            {msg.sender_id !== user?.id && msg.is_read && <CheckCircle2 size={12} />}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        <div className="border-t border-gray-200 bg-white p-3 space-y-2">
          {/* Grant Edit Access banner (admin only, when client requested edit) */}
          {messages.some(m => m.message_type === 'intake_edit_request' && m.sender_id === userId) && !clientEditGranted && clientSubmissionCount < 3 && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-2">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Unlock size={16} className="text-amber-600 shrink-0" />
                  <p className="font-inter text-xs font-medium text-amber-900">
                    Client requested to edit their intake form (submission {clientSubmissionCount}/3)
                  </p>
                </div>
                <button
                  onClick={handleGrantEditAccess}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-md text-xs font-inter font-semibold transition-colors shrink-0"
                >
                  <Unlock size={12} />
                  Grant Edit Access
                </button>
              </div>
            </div>
          )}
          {messages.some(m => m.message_type === 'intake_edit_request' && m.sender_id === userId) && !clientEditGranted && clientSubmissionCount >= 3 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-2">
              <div className="flex items-center gap-2">
                <AlertCircle size={16} className="text-red-600 shrink-0" />
                <p className="font-inter text-xs font-medium text-red-900">
                  Client has reached the maximum of 3 submissions — edit access cannot be granted
                </p>
              </div>
            </div>
          )}
          {clientEditGranted && messages.some(m => m.message_type === 'intake_edit_request') && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-green-600 shrink-0" />
                <p className="font-inter text-xs font-medium text-green-900">
                  Edit access granted — client can now update their intake form
                </p>
              </div>
            </div>
          )}
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
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
              placeholder="Type message..."
              maxLength={500}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B3F7A] focus:border-transparent font-inter text-sm"
            />
            <button
              onClick={sendMessage}
              disabled={!messageText.trim() || sending}
              className="bg-[#1B3F7A] hover:bg-[#2C68C4] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-md px-3 py-2 transition-colors flex items-center justify-center"
            >
              {sending ? <Loader size={16} className="animate-spin" /> : <Send size={16} />}
            </button>
          </div>
          {messageText.length > 400 && (
            <p className="font-inter text-xs text-gray-500 text-right">{messageText.length}/500</p>
          )}
        </div>
      </div>
    </div>
  );
}
