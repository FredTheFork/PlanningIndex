import { useState, useCallback } from 'react';

export interface ChatMessage {
  id: string;
  sender_id: string;
  recipient_id: string;
  message_content: string;
  message_type: string;
  is_read: boolean;
  created_at: string;
}

export interface TeamMember {
  id: string;
  display_name: string;
  profile_picture_url?: string;
}

export const useChat = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [teamMember, setTeamMember] = useState<TeamMember | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const openChat = useCallback(() => {
    setIsChatOpen(true);
  }, []);

  const closeChat = useCallback(() => {
    setIsChatOpen(false);
  }, []);

  const toggleChat = useCallback(() => {
    setIsChatOpen((prev) => !prev);
  }, []);

  return {
    isChatOpen,
    setIsChatOpen,
    openChat,
    closeChat,
    toggleChat,
    unreadCount,
    setUnreadCount,
    messages,
    setMessages,
    teamMember,
    setTeamMember,
    isLoading,
    setIsLoading,
  };
};
