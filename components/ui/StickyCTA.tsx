'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function StickyCTA() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling 500px (past hero section)
      if (window.scrollY > 500 && !dismissed) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [dismissed]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-navy border-t-2 border-medium-blue shadow-[0_-8px_32px_rgba(27,63,122,0.3)]">
      <div className="px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex-1">
          <div className="font-inter font-bold text-white" style={{ fontSize: '0.95rem' }}>
            Get Your Pack — £79
          </div>
          <div className="font-inter text-white/80" style={{ fontSize: '0.75rem' }}>
            10 documents · 24 hours
          </div>
        </div>
        <Link
          href="/checkout"
          className="font-inter font-semibold text-navy bg-white rounded-lg hover:bg-gray-50 transition-colors shrink-0"
          style={{ padding: '12px 24px', fontSize: '0.9rem' }}
        >
          Get Started
        </Link>
      </div>
    </div>
  );
}
