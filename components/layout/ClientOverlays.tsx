"use client";

import StickyCTA from '@/components/ui/StickyCTA';
import CookieConsent from '@/components/ui/CookieConsent';

export default function ClientOverlays() {
  return (
    <>
      <StickyCTA />
      <CookieConsent />
    </>
  );
}
