import Link from 'next/link';
import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface DarkCTABannerProps {
  title: string;
  subtitle?: string;
  ctaLabel: string;
  ctaHref: string;
  icon?: LucideIcon;
  note?: string;
}

export function DarkCTABanner({ title, subtitle, ctaLabel, ctaHref, icon: Icon, note }: DarkCTABannerProps) {
  return (
    <section
      className="text-center px-6"
      style={{
        padding: '80px 0',
        background: 'linear-gradient(135deg, #1B3F7A 0%, #2C68C4 100%)',
      }}
    >
      <div className="mx-auto" style={{ maxWidth: 700 }}>
        <h2
          className="font-inter font-bold text-white"
          style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)' }}
        >
          {title}
        </h2>
        {subtitle && (
          <p
            className="font-inter font-normal mt-4 leading-[1.7]"
            style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.85)' }}
          >
            {subtitle}
          </p>
        )}
        <Link
          href={ctaHref}
          className="inline-flex items-center gap-2 font-inter font-bold text-navy bg-white rounded-lg hover:bg-[rgba(255,255,255,0.92)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.2)] transition-all duration-200 mt-8"
          style={{ padding: '16px 36px', fontSize: '1rem' }}
        >
          {Icon && <Icon size={18} />}
          {ctaLabel}
        </Link>
        {note && (
          <p
            className="font-inter font-normal mt-4"
            style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.65)' }}
          >
            {note}
          </p>
        )}
      </div>
    </section>
  );
}
