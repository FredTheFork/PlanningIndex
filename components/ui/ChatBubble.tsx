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

const POLL_INTERVAL = 3000;

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
  const [convId, setConvId] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastFetchTimeRef = useRef('');
  const activeRef = useRef(true);

  // Initial setup: find admin and get unread count
  useEffect(() => {
    if (!user?.id) return;
    activeRef.current = true;

    const setup = async () => {
      try {
        const { data: admin } = await supabase
          .from('admin_users')
          .select('user_id, display_name')
          .limit(1)
          .maybeSingle();

        if (!activeRef.current || !admin) return;

        setTeamId(admin.user_id);
        setTeamName(admin.display_name || 'Support Team');

        // Compute convId directly
        const computedConvId = [user.id, admin.user_id].sort().join('_');
        setConvId(computedConvId);

        // Get initial unread count
        const { count } = await supabase
          .from('client_messages')
          .select('id', { count: 'exact', head: true })
          .eq('recipient_id', user.id)
          .eq('is_read', false);

        if (activeRef.current) setUnreadCount(count || 0);
      } catch (err) {
        console.error('Chat setup error:', err);
      }
    };

    setup();

    return () => {
      activeRef.current = false;
    };
  }, [user?.id]);

  // Load messages when chat opens
  useEffect(() => {
    if (!isOpen || !convId || !user?.id) return;

    setLoading(true);

    const loadMessages = async () => {
      try {
        const { data } = await supabase
          .from('client_messages')
          .select('*')
          .eq('conversation_id', convId)
          .order('created_at', { ascending: true });

        if (!activeRef.current) return;

        if (data) {
          setMessages(data);
          if (data.length > 0) lastFetchTimeRef.current = data[data.length - 1].created_at;

          const unreadIds = data.filter((m) => m.recipient_id === user.id && !m.is_read).map((m) => m.id);
          if (unreadIds.length > 0) {
            supabase.from('client_messages').update({ is_read: true, read_at: new Date().toISOString() }).in('id', unreadIds).then();
            setUnreadCount(0);
          }
        }
      } catch (err) {
        console.error('Error loading messages:', err);
      } finally {
        if (activeRef.current) setLoading(false);
      }
    };

    loadMessages();
  }, [isOpen, convId, user?.id]);

  // Realtime subscription + polling
  useEffect(() => {
    if (!convId || !user?.id) return;

    // Poll for new messages
    const pollForNewMessages = async () => {
      try {
        let query = supabase.from('client_messages').select('*').eq('conversation_id', convId).order('created_at', { ascending: true });
        if (lastFetchTimeRef.current) query = query.gt('created_at', lastFetchTimeRef.current);

        const { data: newMsgs, error } = await query;
        if (!activeRef.current || error || !newMsgs || newMsgs.length === 0) return;

        setMessages((prev) => {
          const existingIds = new Set(prev.map((m) => m.id));
          const trulyNew = newMsgs.filter((m) => !existingIds.has(m.id));
          if (trulyNew.length === 0) return prev;
          return [...prev, ...trulyNew];
        });
        lastFetchTimeRef.current = newMsgs[newMsgs.length - 1].created_at;

        const unreadNew = newMsgs.filter((m) => m.recipient_id === user.id && !m.is_read);
        if (unreadNew.length > 0) {
          supabase.from('client_messages').update({ is_read: true, read_at: new Date().toISOString() }).in('id', unreadNew.map((m) => m.id)).then();
          setUnreadCount(0);
        }
      } catch (err) {
        console.error('Poll error:', err);
      }
    };

    const channel = supabase.channel(`messages:${convId}`);
    channel
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'client_messages', filter: `conversation_id=eq.${convId}` },
        (payload) => {
          if (!activeRef.current) return;
          const newMsg = payload.new as Message;
          setMessages((prev) => {
            if (prev.some((m) => m.id === newMsg.id)) return prev;
            const tempIdx = prev.findIndex(
              (m) => m.id.startsWith('temp_') && m.sender_id === newMsg.sender_id && m.message_content === newMsg.message_content
            );
            if (tempIdx !== -1) return prev.map((m, i) => (i === tempIdx ? newMsg : m));
            return [...prev, newMsg];
          });
          lastFetchTimeRef.current = newMsg.created_at;
          if (newMsg.recipient_id === user.id && !newMsg.is_read) {
            setUnreadCount((prev) => Math.max(0, prev - 1));
            supabase.from('client_messages').update({ is_read: true, read_at: new Date().toISOString() }).eq('id', newMsg.id).then();
          }
        }
      )
      .subscribe((status) => {
        console.log('[ChatBubble] Subscription status:', status);
      });

    channelRef.current = channel;
    pollingRef.current = setInterval(pollForNewMessages, POLL_INTERVAL);

    // Re-fetch on focus
    const onFocus = () => { if (activeRef.current && isOpen) { setLoading(true); pollForNewMessages().finally(() => setLoading(false)); } };
    const onVisible = () => { if (document.visibilityState === 'visible' && activeRef.current && isOpen) { setLoading(true); pollForNewMessages().finally(() => setLoading(false)); } };
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVisible);

    return () => {
      channel.unsubscribe();
      if (pollingRef.current) { clearInterval(pollingRef.current); pollingRef.current = null; }
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [convId, user?.id, isOpen]);

  // Scroll to bottom
  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'instant' });
    }
  }, [messages, isOpen]);

  const sendMessage = async () => {
    if (!messageText.trim() || !user || !teamId || !convId) return;
    const text = messageText.trim();
    const optimisticId = `temp_${Date.now()}`;
    setMessageText('');
    setSending(true);

    const optimisticMessage: Message = {
      id: optimisticId,
      sender_id: user.id,
      recipient_id: teamId,
      message_content: text,
      message_type: 'general',
      is_read: true,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimisticMessage]);

    try {
      const { data: insertedData, error } = await supabase
        .from('client_messages')
        .insert({
          conversation_id: convId,
          sender_id: user.id,
          recipient_id: teamId,
          message_content: text,
          message_type: 'general',
        })
        .select('*');

      if (error) {
        console.error('Error sending message:', error);
        setMessages((prev) => prev.filter((m) => m.id !== optimisticId));
        setMessageText(text);
        return;
      }

      if (insertedData && insertedData.length > 0) {
        const realMsg = insertedData[0] as Message;
        lastFetchTimeRef.current = realMsg.created_at;
        setMessages((prev) => {
          if (prev.some((m) => m.id === realMsg.id)) return prev.filter((m) => m.id !== optimisticId);
          return prev.map((m) => (m.id === optimisticId ? realMsg : m));
        });
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setMessages((prev) => prev.filter((m) => m.id !== optimisticId));
      setMessageText(text);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-[9998] md:hidden" onClick={() => setIsOpen(false)} />
      )}

      <div className={`fixed md:bottom-8 md:right-6 bottom-0 right-0 z-[9999] transition-all ${
        isOpen ? 'inset-0 md:inset-auto md:w-96 md:h-[500px]' : 'w-auto h-auto pointer-events-none md:pointer-events-auto'
      }`}>
        {isOpen && (
          <div className="flex flex-col bg-white rounded-none md:rounded-lg shadow-xl overflow-hidden h-full border border-gray-200">
            <div className="bg-gradient-to-r from-[#0F1E4D] to-[#1A3A7A] px-6 py-4 flex items-center justify-between text-white">
              <div>
                <h3 className="font-semibold text-base">{teamName}</h3>
                <p className="text-xs text-blue-100">Chat with the Team</p>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-white hover:bg-opacity-20 rounded p-1 transition-colors" aria-label="Close chat">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
              {loading ? (
                <div className="flex items-center justify-center h-full"><Loader size={24} className="text-gray-400 animate-spin" /></div>
              ) : messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-500 text-sm">No messages yet</div>
              ) : (
                messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[83%] px-4 py-2 rounded-lg text-sm ${msg.sender_id === user?.id ? 'bg-[#0F1E4D] text-white' : 'bg-white text-gray-900 border border-gray-200'}`}>
                      <p className="break-words">{msg.message_content}</p>
                      <div className={`text-xs mt-1 ${msg.sender_id === user?.id ? 'text-blue-100' : 'text-gray-500'}`}>
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-gray-200 bg-white p-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
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
                  {sending ? <Loader size={16} className="animate-spin" /> : <Send size={16} />}
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
