import React from 'react';
import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';

interface PageHeroProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  ctaLabel?: string;
  ctaHref?: string;
  children?: React.ReactNode;
}

export function PageHero({
  eyebrow,
  title,
  subtitle,
  icon: Icon,
  ctaLabel,
  ctaHref,
  children,
}: PageHeroProps) {
  return (
    <section className="bg-primary-900 text-white px-6 pt-32 pb-20">
      <div className="max-w-3xl mx-auto text-center">
        {Icon && (
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-white/10">
              <Icon size={24} className="text-white" />
            </div>
          </div>
        )}
        {eyebrow && (
          <span
            className="font-sans font-semibold uppercase block"
            style={{
              fontSize: '0.75rem',
              letterSpacing: '0.15em',
              color: 'rgba(255,255,255,0.7)',
              marginTop: Icon ? '12px' : 0,
            }}
          >
            {eyebrow}
          </span>
        )}
        <h1
          className="font-sans font-bold text-white mt-3"
          style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', lineHeight: 1.2 }}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            className="font-sans mx-auto mt-4 leading-relaxed"
            style={{
              fontSize: '1.1rem',
              color: 'rgba(255,255,255,0.8)',
              maxWidth: 560,
            }}
          >
            {subtitle}
          </p>
        )}
        {ctaLabel && ctaHref && (
          <Link
            href={ctaHref}
            className="inline-block font-sans font-semibold text-primary-900 bg-white rounded-lg hover:bg-primary-50 transition-colors duration-200 mt-8"
            style={{ padding: '14px 32px', fontSize: '1rem' }}
          >
            {ctaLabel}
          </Link>
        )}
        {children}
      </div>
    </section>
  );
}
