'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Send, MessageSquare, ChevronLeft } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  message_content: string;
  message_type: string;
  related_document_id?: string;
  is_read: boolean;
  created_at: string;
}

interface Conversation {
  conversation_id: string;
  other_user_id: string;
  other_user_email: string;
  last_message_preview: string;
  last_message_at: string;
  unread_count: number;
}

interface UserInfo {
  email: string;
  id: string;
}

export default function MessagesPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const [sending, setSending] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [adminInfo, setAdminInfo] = useState<UserInfo | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (user) {
      fetchConversations();
      fetchAdminInfo();
    }
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchAdminInfo = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('user_id')
        .limit(1)
        .maybeSingle();

      if (data?.user_id) {
        // Try to get from auth, fall back to using ID if not available
        try {
          const { data: userData } = await supabase.auth.admin.getUserById(
            data.user_id
          );

          if (userData?.user?.email) {
            setAdminInfo({ email: userData.user.email, id: data.user_id });
            return;
          }
        } catch (adminErr) {
          console.error('Could not fetch admin via auth API:', adminErr);
        }

        // Fallback: just use the admin user ID, assume they exist
        setAdminInfo({ email: 'Admin', id: data.user_id });
      }
    } catch (err) {
      console.error('Error fetching admin info:', err);
    }
  };

  const fetchConversations = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('client_messages')
        .select('*')
        .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const conversationMap = new Map<string, Conversation>();

      if (data) {
        for (const msg of data) {
          const otherId = msg.sender_id === user.id ? msg.recipient_id : msg.sender_id;
          const convId = [user.id, otherId].sort().join('_');

          if (!conversationMap.has(convId)) {
            conversationMap.set(convId, {
              conversation_id: convId,
              other_user_id: otherId,
              other_user_email: 'Admin',
              last_message_preview: msg.message_content.substring(0, 50),
              last_message_at: msg.created_at,
              unread_count: msg.is_read ? 0 : 1,
            });
          }
        }
      }

      setConversations(Array.from(conversationMap.values()));
    } catch (err) {
      console.error('Error fetching conversations:', err);
    }
  };

  useEffect(() => {
    if (user && selectedConversation) {
      loadMessages(selectedConversation);

      // Subscribe to real-time message updates
      const [userId1, userId2] = selectedConversation.split('_');
      const subscription = supabase
        .channel(`messages:${selectedConversation}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'client_messages',
            filter: `conversation_id=eq.${selectedConversation}`,
          },
          (payload) => {
            loadMessages(selectedConversation);
            fetchConversations();
          }
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [user, selectedConversation]);

  const loadMessages = async (conversationId: string) => {
    if (!user) return;

    setLoadingMessages(true);
    setSelectedConversation(conversationId);

    try {
      const [userId1, userId2] = conversationId.split('_');
      const { data, error } = await supabase
        .from('client_messages')
        .select('*')
        .or(
          `and(sender_id.eq.${userId1},recipient_id.eq.${userId2}),and(sender_id.eq.${userId2},recipient_id.eq.${userId1})`
        )
        .order('created_at', { ascending: true });

      if (error) throw error;

      setMessages(data || []);

      // Mark messages as read
      const unreadIds = data?.filter((m) => m.recipient_id === user.id && !m.is_read).map((m) => m.id) || [];
      if (unreadIds.length > 0) {
        await supabase
          .from('client_messages')
          .update({ is_read: true, read_at: new Date().toISOString() })
          .in('id', unreadIds);
      }
    } catch (err) {
      console.error('Error loading messages:', err);
    } finally {
      setLoadingMessages(false);
    }
  };

  const sendMessage = async () => {
    if (!messageText.trim() || !user || !selectedConversation || !adminInfo) return;

    setSending(true);

    try {
      const [userId1, userId2] = selectedConversation.split('_');
      const { error } = await supabase.from('client_messages').insert({
        conversation_id: selectedConversation,
        sender_id: user.id,
        recipient_id: adminInfo.id,
        message_content: messageText.trim(),
        message_type: 'general',
      });

      if (error) {
        console.error('Error sending message:', error);
        alert('Failed to send message: ' + error.message);
        return;
      }

      setMessageText('');
      await loadMessages(selectedConversation);
    } catch (err) {
      console.error('Error sending message:', err);
      alert('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-off-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy mx-auto mb-4" />
          <p className="font-inter text-secondary-text">Loading messages...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="h-screen bg-off-white flex flex-col md:flex-row gap-4 p-4 md:p-6">
      {/* Conversation List */}
      <div
        className={`${
          isMobile && selectedConversation ? 'hidden' : ''
        } w-full md:w-80 bg-white rounded-lg border border-border flex flex-col`}
      >
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="bg-blue-50 rounded-lg p-2">
              <MessageSquare size={20} className="text-medium-blue" />
            </div>
            <div>
              <h1 className="font-inter font-bold text-navy text-lg">Messages</h1>
              <p className="font-inter text-secondary-text text-xs">
                {conversations.length} conversation{conversations.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="p-4 text-center">
              <p className="font-inter text-secondary-text text-sm">No conversations yet</p>
            </div>
          ) : (
            conversations.map((conv) => (
              <button
                key={conv.conversation_id}
                onClick={() => {
                  loadMessages(conv.conversation_id);
                  if (isMobile) setSelectedConversation(conv.conversation_id);
                }}
                className={`w-full p-4 border-b border-gray-100 text-left hover:bg-gray-50 transition-colors ${
                  selectedConversation === conv.conversation_id ? 'bg-blue-50' : ''
                }`}
              >
                <p className="font-inter font-medium text-navy text-sm mb-1">
                  {conv.other_user_email.split('@')[0]}
                </p>
                <p className="font-inter text-secondary-text text-xs line-clamp-2">
                  {conv.last_message_preview}
                </p>
                <p className="font-inter text-secondary-text text-xs mt-1">
                  {new Date(conv.last_message_at).toLocaleDateString()}
                </p>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Messages Area */}
      {selectedConversation && (
        <div className="flex-1 bg-white rounded-lg border border-border flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-border flex items-center gap-3">
            {isMobile && (
              <button
                onClick={() => setSelectedConversation(null)}
                className="hover:bg-gray-100 rounded-lg p-2"
              >
                <ChevronLeft size={20} />
              </button>
            )}
            <div>
              <h2 className="font-inter font-bold text-navy text-lg">
                {conversations.find((c) => c.conversation_id === selectedConversation)?.other_user_email}
              </h2>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {loadingMessages ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-navy mx-auto" />
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender_id === user.id ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md rounded-lg p-3 ${
                      msg.sender_id === user.id
                        ? 'bg-medium-blue text-white'
                        : 'bg-gray-100 text-navy'
                    }`}
                  >
                    <p className="font-inter text-sm break-words">{msg.message_content}</p>
                    <p
                      className={`font-inter text-xs mt-1 ${
                        msg.sender_id === user.id ? 'text-blue-100' : 'text-secondary-text'
                      }`}
                    >
                      {new Date(msg.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border flex gap-2">
            <input
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-medium-blue font-inter text-sm"
            />
            <button
              onClick={sendMessage}
              disabled={!messageText.trim() || sending}
              className="bg-navy hover:bg-medium-blue disabled:opacity-50 text-white rounded-lg p-2.5 transition-colors"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}

      {/* No conversation selected */}
      {!selectedConversation && !isMobile && (
        <div className="flex-1 bg-white rounded-lg border border-border flex items-center justify-center">
          <div className="text-center">
            <div className="bg-blue-50 rounded-lg p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <MessageSquare size={32} className="text-medium-blue" />
            </div>
            <p className="font-inter text-secondary-text">Select a conversation to start messaging</p>
          </div>
        </div>
      )}
    </div>
  );
}
