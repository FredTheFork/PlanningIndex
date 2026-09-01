'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Cookie, X } from 'lucide-react';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hasConsented = localStorage.getItem('cookie-consent');
    if (!hasConsented) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-primary-900 border-t-2 border-accent-500 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="flex items-start gap-3 flex-1">
            <Cookie size={24} className="text-white shrink-0 mt-0.5" />
            <div>
              <p className="font-sans font-semibold text-white mb-1" style={{ fontSize: '0.95rem' }}>
                We use cookies to improve your experience
              </p>
              <p className="font-sans text-white/80" style={{ fontSize: '0.85rem' }}>
                We use essential cookies to make our site work. We&apos;d also like to set optional analytics cookies to help us improve.{' '}
                <Link href="/privacy" className="text-accent-400 hover:underline">
                  Learn more in our Privacy Policy
                </Link>
              </p>
            </div>
          </div>

          <div className="flex gap-3 shrink-0">
            <button
              onClick={handleDecline}
              className="font-sans font-medium text-white border border-white/30 rounded-lg hover:bg-white/10 transition-colors"
              style={{ padding: '10px 20px', fontSize: '0.9rem' }}
            >
              Decline optional
            </button>
            <button
              onClick={handleAccept}
              className="font-sans font-semibold text-primary-900 bg-white rounded-lg hover:bg-primary-50 transition-colors"
              style={{ padding: '10px 20px', fontSize: '0.9rem' }}
            >
              Accept all
            </button>
          </div>
        </div>
      </div>

      <button
        onClick={handleDecline}
        className="absolute top-2 right-2 text-white/60 hover:text-white transition-colors"
        aria-label="Close cookie banner"
      >
        <X size={20} />
      </button>
    </div>
  );
}
