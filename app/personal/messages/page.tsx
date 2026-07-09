'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useUnreadMessages } from '@/hooks/useUnreadMessages';
import { supabase } from '@/lib/supabase/client';
import { MessageCircle, FileText, Globe, Share2, Send, Loader, Filter, ChevronDown, ExternalLink } from 'lucide-react';

interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  message_content: string;
  message_type: string;
  is_read: boolean;
  created_at: string;
}

const MESSAGE_TYPES = {
  all: { label: 'All Messages', icon: MessageCircle },
  general: { label: 'General', icon: MessageCircle },
  document_delivery: { label: 'Document Delivery', icon: FileText },
  website_delivery: { label: 'Website', icon: Globe },
  social_delivery: { label: 'Social Posts', icon: Share2 },
};

export default function MessagesPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { unreadCount } = useUnreadMessages();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [teamId, setTeamId] = useState('');
  const [teamName, setTeamName] = useState('');
  const [convId, setConvId] = useState('');
  const [showTypeFilter, setShowTypeFilter] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    const setup = async () => {
      try {
        const { data: admin } = await supabase
          .from('admin_users')
          .select('user_id, display_name')
          .limit(1)
          .maybeSingle();

        if (!admin) return;

        setTeamId(admin.user_id);
        setTeamName(admin.display_name || 'Support Team');

        const computedConvId = [user.id, admin.user_id].sort().join('_');
        setConvId(computedConvId);

        // Fetch messages
        const { data } = await supabase
          .from('client_messages')
          .select('*')
          .eq('conversation_id', computedConvId)
          .order('created_at', { ascending: true });

        if (data) {
          setMessages(data);

          // Mark unread messages as read
          const unreadIds = data.filter(m => m.recipient_id === user.id && !m.is_read).map(m => m.id);
          if (unreadIds.length > 0) {
            await supabase
              .from('client_messages')
              .update({ is_read: true, read_at: new Date().toISOString() })
              .in('id', unreadIds);
          }
        }
      } catch (err) {
        console.error('Messages setup error:', err);
      } finally {
        setLoading(false);
      }
    };

    setup();
  }, [user?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'instant' });
  }, [messages]);

  // Filter messages based on active filter
  const filteredMessages = messages.filter(msg => {
    if (activeFilter === 'all') return true;
    return msg.message_type === activeFilter;
  });

  if (authLoading || loading) {
    return (
      <div>
        <div className="mb-8">
          <div className="h-8 bg-gray-200 rounded w-32 mb-1 animate-pulse" />
          <div className="h-4 bg-gray-100 rounded w-48 animate-pulse" />
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-8 flex items-center justify-center">
          <Loader size={24} className="animate-spin text-gray-400" />
        </div>
      </div>
    );
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  // Group messages by date
  const groupedMessages = filteredMessages.reduce((acc, msg) => {
    const date = new Date(msg.created_at).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    if (!acc[date]) acc[date] = [];
    acc[date].push(msg);
    return acc;
  }, {} as Record<string, Message[]>);

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-inter font-bold text-[#1B3F7A] text-2xl mb-1">
          Messages
        </h1>
        <p className="font-inter text-gray-600 text-sm">
          Your conversation with {teamName}
        </p>
      </div>

      {/* Filter dropdown */}
      <div className="mb-6 relative">
        <button
          onClick={() => setShowTypeFilter(!showTypeFilter)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg font-inter text-sm text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <Filter size={16} />
          {MESSAGE_TYPES[activeFilter as keyof typeof MESSAGE_TYPES]?.label || 'All Messages'}
          <ChevronDown size={14} />
        </button>

        {showTypeFilter && (
          <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[200px]">
            {Object.entries(MESSAGE_TYPES).map(([key, { label, icon: Icon }]) => (
              <button
                key={key}
                onClick={() => {
                  setActiveFilter(key);
                  setShowTypeFilter(false);
                }}
                className={`w-full flex items-center gap-2 px-4 py-2.5 text-left font-inter text-sm transition-colors ${
                  activeFilter === key
                    ? 'bg-[#1B3F7A]/5 text-[#1B3F7A]'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon size={14} />
                {label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Messages container */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {filteredMessages.length === 0 ? (
          <div className="p-12 text-center">
            <MessageCircle size={48} className="mx-auto mb-4 text-gray-300" />
            <h2 className="font-inter font-semibold text-gray-900 text-lg mb-2">
              No messages yet
            </h2>
            <p className="font-inter text-gray-600 text-sm mb-4">
              When you receive document deliveries or communicate with our team, messages will appear here.
            </p>
            <p className="font-inter text-gray-500 text-xs">
              Use the chat bubble in the bottom right corner to start a conversation.
            </p>
          </div>
        ) : (
          <div className="max-h-[600px] overflow-y-auto">
            {Object.entries(groupedMessages).map(([date, msgs]) => (
              <div key={date}>
                <div className="bg-gray-50 px-6 py-2 border-y border-gray-100">
                  <span className="font-inter text-xs text-gray-500 font-medium">{date}</span>
                </div>
                <div className="p-4 space-y-3">
                  {msgs.map((msg) => (
                    <MessageBubble
                      key={msg.id}
                      message={msg}
                      userId={user.id}
                    />
                  ))}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Quick reply */}
      {convId && (
        <div className="mt-4 bg-white rounded-lg border border-gray-200 p-4">
          <QuickReply
            convId={convId}
            userId={user.id}
            teamId={teamId}
            onSent={(newMsg) => setMessages(prev => [...prev, newMsg])}
          />
        </div>
      )}
    </div>
  );
}

function MessageBubble({
  message,
  userId,
}: {
  message: Message;
  userId: string;
}) {
  const isUser = message.sender_id === userId;
  const isDocumentDelivery = message.message_type === 'document_delivery';
  const isWebsiteDelivery = message.message_type === 'website_delivery';
  const isSocialDelivery = message.message_type === 'social_delivery';

  // Extract links from message content for delivery messages
  const getActionLink = () => {
    if (isDocumentDelivery) return '/personal/documents';
    if (isWebsiteDelivery) return '/personal/website';
    if (isSocialDelivery) return '/personal/posts';
    return null;
  };

  const actionLink = getActionLink();
  const Icon = isDocumentDelivery ? FileText : isWebsiteDelivery ? Globe : isSocialDelivery ? Share2 : null;

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[75%] px-4 py-3 rounded-lg ${
          isUser
            ? 'bg-[#1B3F7A] text-white'
            : 'bg-gray-100 text-gray-900'
        }`}
      >
        {/* Badge for delivery type */}
        {Icon && (
          <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-inter font-medium mb-2 ${
            isUser ? 'bg-white/20 text-white' : 'bg-[#1B3F7A]/10 text-[#1B3F7A]'
          }`}>
            <Icon size={10} />
            {isDocumentDelivery && 'Document Delivery'}
            {isWebsiteDelivery && 'Website Ready'}
            {isSocialDelivery && 'Social Posts Ready'}
          </div>
        )}

        <p className="font-inter text-sm break-words whitespace-pre-wrap">
          {message.message_content}
        </p>

        <div className={`flex items-center gap-2 mt-2 ${
          isUser ? 'text-white/70' : 'text-gray-500'
        }`}>
          <span className="font-inter text-xs">
            {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>

          {/* Action link for delivery messages */}
          {actionLink && (
            <Link
              href={actionLink}
              className={`inline-flex items-center gap-1 font-inter text-xs font-medium ${
                isUser
                  ? 'text-white hover:underline'
                  : 'text-[#1B3F7A] hover:underline'
              }`}
            >
              View <ExternalLink size={10} />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

function QuickReply({
  convId,
  userId,
  teamId,
  onSent,
}: {
  convId: string;
  userId: string;
  teamId: string;
  onSent: (msg: Message) => void;
}) {
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!text.trim() || sending) return;

    setSending(true);
    try {
      const { data, error } = await supabase
        .from('client_messages')
        .insert({
          conversation_id: convId,
          sender_id: userId,
          recipient_id: teamId,
          message_content: text.trim(),
          message_type: 'general',
        })
        .select('*')
        .single();

      if (!error && data) {
        onSent(data as Message);
        setText('');
      }
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
          }
        }}
        placeholder="Type a quick reply..."
        className="flex-1 px-4 py-2 border border-gray-200 rounded-lg font-inter text-sm focus:outline-none focus:ring-2 focus:ring-[#1B3F7A] focus:border-transparent"
        disabled={sending}
      />
      <button
        onClick={handleSend}
        disabled={!text.trim() || sending}
        className="inline-flex items-center gap-2 px-4 py-2 bg-[#1B3F7A] hover:bg-[#2C68C4] disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-inter text-sm font-medium transition-colors"
      >
        {sending ? <Loader size={16} className="animate-spin" /> : <Send size={16} />}
        Send
      </button>
    </div>
  );
}
