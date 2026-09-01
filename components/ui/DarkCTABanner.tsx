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
    <section className="bg-primary-900 text-center px-6 py-24">
      <div className="max-w-3xl mx-auto">
        <h2
          className="font-sans font-bold text-white"
          style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)' }}
        >
          {title}
        </h2>
        {subtitle && (
          <p
            className="font-sans mt-4 leading-relaxed"
            style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.8)' }}
          >
            {subtitle}
          </p>
        )}
        <Link
          href={ctaHref}
          className="inline-flex items-center gap-2 font-sans font-semibold text-primary-900 bg-white rounded-lg hover:bg-primary-50 transition-all duration-200 mt-8"
          style={{ padding: '14px 32px', fontSize: '1rem' }}
        >
          {Icon && <Icon size={18} />}
          {ctaLabel}
        </Link>
        {note && (
          <p
            className="font-sans mt-4"
            style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)' }}
          >
            {note}
          </p>
        )}
      </div>
    </section>
  );
}
