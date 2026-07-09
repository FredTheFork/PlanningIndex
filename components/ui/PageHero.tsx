import React from 'react';
import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';

interface PageHeroProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  icon?: LucideIcon;
  ctaLabel?: string;
  ctaHref?: string;
  gradient?: string;
  children?: React.ReactNode;
}

export function PageHero({
  eyebrow,
  title,
  subtitle,
  backgroundImage,
  icon: Icon,
  ctaLabel,
  ctaHref,
  gradient,
  children,
}: PageHeroProps) {
  const hasBackground = !!backgroundImage;
  const defaultGradient = 'linear-gradient(135deg, #1B3F7A 0%, #2C68C4 100%)';
  const overlayGradient = 'linear-gradient(135deg, rgba(15,30,61,0.80) 0%, rgba(27,63,122,0.75) 100%)';

  if (hasBackground) {
    return (
      <section
        className="relative text-center px-6"
        style={{ paddingTop: 0, paddingBottom: '72px', minHeight: '420px' }}
      >
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            zIndex: 0,
          }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background: overlayGradient,
            zIndex: 1,
          }}
        />
        <div className="mx-auto relative" style={{ maxWidth: 800, zIndex: 2 }}>
          <div style={{ paddingTop: 'clamp(100px, 13vw, 128px)' }}>
            {Icon && (
              <div className="flex items-center justify-center gap-2 mb-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(255,255,255,0.15)' }}
                >
                  <Icon size={24} className="text-white" />
                </div>
              </div>
            )}
            {eyebrow && (
              <span
                className="font-inter font-semibold uppercase block"
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
              className="font-inter font-extrabold text-white mt-3"
              style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', lineHeight: 1.2 }}
            >
              {title}
            </h1>
            {subtitle && (
              <p
                className="font-inter font-normal mx-auto mt-4 leading-[1.7]"
                style={{
                  fontSize: '1.05rem',
                  color: 'rgba(255,255,255,0.85)',
                  maxWidth: 560,
                }}
              >
                {subtitle}
              </p>
            )}
            {ctaLabel && ctaHref && (
              <Link
                href={ctaHref}
                className="inline-block font-inter font-bold text-navy bg-white rounded-lg hover:bg-[rgba(255,255,255,0.92)] transition-colors duration-200 mt-9"
                style={{ padding: '16px 36px', fontSize: '1rem', minHeight: 48 }}
              >
                {ctaLabel}
              </Link>
            )}
            {children}
          </div>
        </div>
      </section>
    );
  }

  // Simple gradient hero (no background image)
  return (
    <section
      className="text-center px-6"
      style={{
        padding: '80px 0 72px',
        background: gradient || defaultGradient,
      }}
    >
      <div className="mx-auto" style={{ maxWidth: 800 }}>
        {eyebrow && (
          <span
            className="font-inter font-semibold uppercase block"
            style={{
              fontSize: '0.75rem',
              letterSpacing: '0.15em',
              color: 'rgba(255,255,255,0.7)',
              marginTop: '72px',
            }}
          >
            {eyebrow}
          </span>
        )}
        <h1
          className="font-inter font-extrabold text-white mt-3"
          style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', lineHeight: 1.2 }}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            className="font-inter font-normal mx-auto mt-4 leading-[1.7]"
            style={{
              fontSize: '1.05rem',
              color: 'rgba(255,255,255,0.85)',
              maxWidth: 620,
            }}
          >
            {subtitle}
          </p>
        )}
        {ctaLabel && ctaHref && (
          <Link
            href={ctaHref}
            className="inline-block font-inter font-bold text-navy bg-white rounded-lg hover:bg-[rgba(255,255,255,0.92)] transition-colors duration-200 mt-9"
            style={{ padding: '16px 36px', fontSize: '1rem', minHeight: 48 }}
          >
            {ctaLabel}
          </Link>
        )}
        {children}
      </div>
    </section>
  );
}
