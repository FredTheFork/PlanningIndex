"use client";

import { useState } from 'react';
import StickyCTA from '@/components/ui/StickyCTA';
import CookieConsent from '@/components/ui/CookieConsent';
import ExitIntentPopup from '@/components/ui/ExitIntentPopup';
import ChatBubbleTrigger from '@/components/ui/ChatBubbleTrigger';
import ChatBubble from '@/components/ui/ChatBubble';

export default function ClientOverlays() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <>
      <StickyCTA />
      <CookieConsent />
      <ExitIntentPopup />
      <ChatBubbleTrigger onOpen={() => setIsChatOpen(true)} />
      <ChatBubble isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </>
  );
}
