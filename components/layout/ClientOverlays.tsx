"use client";

import StickyCTA from '@/components/ui/StickyCTA';
import CookieConsent from '@/components/ui/CookieConsent';
import ExitIntentPopup from '@/components/ui/ExitIntentPopup';

export default function ClientOverlays() {
  return (
    <>
      <StickyCTA />
      <CookieConsent />
      <ExitIntentPopup />
    </>
  );
}
