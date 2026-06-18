'use client';

import Link from 'next/link';
import { CheckCircle, Star, Briefcase, Crown, Zap, Shield, Clock, FileText } from 'lucide-react';
import { useCountUp } from '@/hooks/useCountUp';
import { useInView } from '@/hooks/useInView';

const avatars = [
  { initials: 'SM' },
  { initials: 'JR' },
  { initials: 'AS' },
  { initials: 'MT' },
  { initials: 'PK' },
];

// Document flow animation component
function DocumentFlowVisual() {
  return (
    <div className="relative w-full max-w-[200px]" style={{ height: 160 }}>
      {/* Document pages flying into folder */}
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="absolute bg-white rounded-lg shadow-lg border border-slate-200"
          style={{
            width: 80,
            height: 100,
            right: 20 + i * 8,
            top: 10 + i * 5,
            zIndex: 5 - i,
            animation: `docFly-${i} 3s ease-in-out infinite`,
            animationDelay: `${i * 0.3}s`,
          }}
        >
          <div className="h-6 bg-gradient-to-r from-navy/90 to-medium-blue/90 rounded-t-lg flex items-center justify-center">
            <FileText size={12} className="text-white" />
          </div>
          <div className="p-2 space-y-1">
            <div className="h-1.5 bg-slate-200 rounded w-3/4" />
            <div className="h-1 bg-slate-100 rounded w-full" />
            <div className="h-1 bg-slate-100 rounded w-2/3" />
          </div>
        </div>
      ))}

      <style>{`
        @keyframes docFly-0 {
          0%, 100% { transform: translateX(0) rotate(-2deg); opacity: 1; }
          50% { transform: translateX(10px) rotate(2deg); opacity: 0.8; }
        }
        @keyframes docFly-1 {
          0%, 100% { transform: translateX(0) rotate(1deg); opacity: 1; }
          50% { transform: translateX(8px) rotate(-1deg); opacity: 0.8; }
        }
        @keyframes docFly-2 {
          0%, 100% { transform: translateX(0) rotate(-1deg); opacity: 1; }
          50% { transform: translateX(6px) rotate(1deg); opacity: 0.8; }
        }
        @keyframes docFly-3 {
          0%, 100% { transform: translateX(0) rotate(2deg); opacity: 1; }
          50% { transform: translateX(4px) rotate(-2deg); opacity: 0.8; }
        }
        @keyframes docFly-4 {
          0%, 100% { transform: translateX(0) rotate(-1deg); opacity: 1; }
          50% { transform: translateX(2px) rotate(1deg); opacity: 0.8; }
        }
      `}</style>

      {/* Glow effect */}
      <div
        className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-40 h-8 bg-navy/20 rounded-full blur-xl"
        style={{ zIndex: 0 }}
      />
    </div>
  );
}

// Trust metrics row
function HeroTrustMetrics() {
  const [ref, inView] = useInView(0.2);
  const docsCount = useCountUp(70, 1200, inView);
  const hoursCount = useCountUp(24, 1000, inView);
  const clientsCount = useCountUp(200, 1400, inView);

  return (
    <div ref={ref} className="flex items-center justify-center gap-6 md:gap-10 mt-5 py-4">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center">
          <FileText size={16} className="text-white" />
        </div>
        <div>
          <span className="font-inter font-bold text-white text-lg">{docsCount}+</span>
          <span className="font-inter text-white/70 text-xs block">Documents</span>
        </div>
      </div>

      <div className="w-px h-10 bg-white/20" />

      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center">
          <Clock size={16} className="text-white" />
        </div>
        <div>
          <span className="font-inter font-bold text-white text-lg">{hoursCount}hr</span>
          <span className="font-inter text-white/70 text-xs block">Delivery</span>
        </div>
      </div>

      <div className="w-px h-10 bg-white/20" />

      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center">
          <Shield size={16} className="text-white" />
        </div>
        <div>
          <span className="font-inter font-bold text-white text-lg">{clientsCount}+</span>
          <span className="font-inter text-white/70 text-xs block">Protected</span>
        </div>
      </div>
    </div>
  );
}

export default function Hero() {
  const count = useCountUp(200, 1800, true);

  return (
    <section
      className="relative overflow-hidden px-6"
      style={{ background: '#0F1E3D', paddingTop: 'clamp(120px, 14vw, 148px)', paddingBottom: '5rem', minHeight: '90vh' }}
    >
      {/* Background image */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          backgroundImage: 'url(/images/hero/hero-bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          zIndex: 0,
        }}
      />
      {/* Dark overlay for readability */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, rgba(15,30,61,0.88) 0%, rgba(27,63,122,0.82) 50%, rgba(15,30,61,0.88) 100%)',
          zIndex: 1,
        }}
      />

      <div
        className="max-w-[1200px] mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-16"
        style={{ position: 'relative', zIndex: 1 }}
      >
        {/* Left column */}
        <div className="flex-1 max-w-xl">
          <div
            className="flex items-center gap-3 mb-5"
            style={{ animation: 'fadeInUp 0.6s ease-out both', animationDelay: '0ms' }}
          >
            <span className="w-8 h-0.5 bg-white/50" />
            <span
              className="font-inter font-semibold text-white/80 uppercase"
              style={{ fontSize: '0.75rem', letterSpacing: '0.15em' }}
            >
              For UK Sole Traders
            </span>
          </div>

          <h1
            className="font-inter font-extrabold text-white leading-[1.15]"
            style={{
              fontSize: 'clamp(2.4rem, 5vw, 3.6rem)',
              animation: 'fadeInUp 0.65s ease-out both',
              animationDelay: '80ms',
            }}
          >
            Your Entire Business Infrastructure.<br />Built For You.
          </h1>

          <p
            className="font-inter font-normal text-white/85 mt-5 leading-[1.7]"
            style={{
              fontSize: '1.1rem',
              maxWidth: 480,
              animation: 'fadeInUp 0.65s ease-out both',
              animationDelay: '160ms',
            }}
          >
            Foundation to start. Operations to protect. Industry packs to dominate. 13 packs. 70+ documents. All done for you, delivered within days.
          </p>

          {/* Avatar row + animated count */}
          <div
            className="flex items-center gap-4 my-7"
            style={{ animation: 'fadeInUp 0.65s ease-out both', animationDelay: '240ms' }}
          >
            <div className="flex items-center">
              {avatars.map((a, i) => (
                <div
                  key={a.initials}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white font-inter font-semibold border-2 border-white"
                  style={{
                    fontSize: '0.75rem',
                    background: 'linear-gradient(135deg, #1B3F7A, #2C68C4)',
                    marginLeft: i === 0 ? 0 : -10,
                    zIndex: avatars.length - i,
                    position: 'relative',
                  }}
                >
                  {a.initials}
                </div>
              ))}
            </div>
            <span className="font-inter font-medium text-white/90" style={{ fontSize: '0.9rem' }}>
              <span className="font-bold text-white">{count}+</span> UK sole traders — properly founded
            </span>
          </div>

          <div
            className="flex flex-wrap gap-4"
            style={{ animation: 'fadeInUp 0.65s ease-out both', animationDelay: '320ms' }}
          >
            <Link
              href="/services"
              className="font-inter font-semibold text-white bg-white/20 hover:bg-white/30 rounded-lg hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(255,255,255,0.15)] transition-all duration-200 backdrop-blur-sm border border-white/30"
              style={{ padding: '16px 32px', fontSize: '1rem', minHeight: 48 }}
            >
              See All 13 Packs
            </Link>
            <Link
              href="/checkout?services=business_foundations_pack"
              className="font-inter font-semibold text-white border-2 border-white/30 rounded-lg hover:bg-white/10 transition-colors duration-200"
              style={{ padding: '14px 28px', fontSize: '1rem', minHeight: 48 }}
            >
              Start with Foundation - 79
            </Link>
          </div>

          <div
            className="flex flex-wrap gap-6 mt-8"
            style={{ animation: 'fadeInUp 0.65s ease-out both', animationDelay: '400ms' }}
          >
            {['UK Law Compliant', '70+ Documents Available', 'Three Tiers Available'].map((badge) => (
              <div key={badge} className="flex items-center gap-2">
                <CheckCircle size={16} className="text-white/80 shrink-0" />
                <span className="font-inter font-medium text-white/85" style={{ fontSize: '0.875rem' }}>
                  {badge}
                </span>
              </div>
            ))}
          </div>

          {/* Trust metrics bar */}
          <div style={{ animation: 'fadeInUp 0.65s ease-out both', animationDelay: '500ms' }}>
            <HeroTrustMetrics />
          </div>
        </div>

        {/* Right column — floating animated tier cards */}
        <div className="hidden lg:flex flex-1 justify-center items-center">
          <div className="relative" style={{ width: 420, height: 500 }}>
            {/* Back glow */}
            <div
              aria-hidden="true"
              className="absolute rounded-3xl"
              style={{
                width: 340,
                height: 420,
                top: 30,
                left: 40,
                background: 'linear-gradient(135deg, rgba(27,63,122,0.06), rgba(44,104,196,0.1))',
                zIndex: 0,
                animation: 'float-b 9s ease-in-out infinite',
              }}
            />

            {/* Foundation Tier card */}
            <div
              className="absolute bg-white rounded-2xl overflow-hidden"
              style={{
                width: 300,
                height: 180,
                top: 0,
                left: 10,
                boxShadow: '0 24px 64px rgba(27,63,122,0.18), 0 2px 8px rgba(27,63,122,0.06)',
                zIndex: 3,
                animation: 'float-a 7s ease-in-out infinite',
              }}
            >
              <div
                className="flex items-center justify-between px-4"
                style={{ height: 44, background: 'linear-gradient(135deg, #1B3F7A, #2C68C4)', borderRadius: '16px 16px 0 0' }}
              >
                <div className="flex items-center gap-2">
                  <Star size={14} className="text-white/90" />
                  <span className="font-inter font-semibold text-white" style={{ fontSize: '0.75rem' }}>FOUNDATION</span>
                </div>
                <span className="font-inter font-medium text-white/60" style={{ fontSize: '0.7rem' }}>From 79</span>
              </div>
              <div className="p-4 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-inter font-medium text-dark-text" style={{ fontSize: '0.8rem' }}>Business Foundations Pack</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-inter font-medium text-secondary-text" style={{ fontSize: '0.75rem' }}>Website Copy</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-inter font-medium text-secondary-text" style={{ fontSize: '0.75rem' }}>Social Media Pack</span>
                </div>
                <div className="flex gap-2 mt-1">
                  <span className="font-inter font-semibold text-medium-blue" style={{ fontSize: '0.7rem' }}>+ Monthly Care Plan</span>
                </div>
              </div>
            </div>

            {/* Operations Tier card */}
            <div
              className="absolute bg-white rounded-2xl overflow-hidden"
              style={{
                width: 185,
                height: 155,
                top: 148,
                right: 0,
                boxShadow: '0 20px 48px rgba(44,104,196,0.16), 0 2px 6px rgba(27,63,122,0.05)',
                zIndex: 4,
                animation: 'float-b 8s ease-in-out infinite',
                animationDelay: '1s',
              }}
            >
              <div
                className="flex items-center gap-2 px-3"
                style={{ height: 36, background: 'linear-gradient(135deg, #2C68C4, #4A90E2)', borderRadius: '16px 16px 0 0' }}
              >
                <Briefcase size={14} className="text-white/90" />
                <span className="font-inter font-semibold text-white" style={{ fontSize: '0.7rem' }}>OPERATIONS</span>
              </div>
              <div className="p-3 flex flex-col gap-1.5">
                <span className="font-inter font-medium text-dark-text" style={{ fontSize: '0.7rem' }}>Client Onboarding</span>
                <span className="font-inter font-medium text-secondary-text" style={{ fontSize: '0.65rem' }}>Payment Protection</span>
                <span className="font-inter font-medium text-secondary-text" style={{ fontSize: '0.65rem' }}>GDPR Deep Pack</span>
                <div className="flex items-center gap-1 mt-1">
                  <span className="font-inter font-bold text-navy" style={{ fontSize: '0.75rem' }}>From 149</span>
                </div>
              </div>
            </div>

            {/* Industry Tier card */}
            <div
              className="absolute bg-white rounded-2xl overflow-hidden"
              style={{
                width: 174,
                height: 165,
                bottom: 50,
                right: 22,
                boxShadow: '0 20px 48px rgba(245,158,11,0.16), 0 2px 6px rgba(27,63,122,0.05)',
                zIndex: 5,
                animation: 'float-c 9s ease-in-out infinite',
                animationDelay: '2s',
              }}
            >
              <div
                className="flex items-center gap-2 px-3"
                style={{ height: 36, background: 'linear-gradient(135deg, #F59E0B, #FBBF24)', borderRadius: '16px 16px 0 0' }}
              >
                <Crown size={14} className="text-white/90" />
                <span className="font-inter font-semibold text-white" style={{ fontSize: '0.7rem' }}>INDUSTRY</span>
              </div>
              <div className="p-3 flex flex-col gap-1.5">
                <span className="font-inter font-medium text-dark-text" style={{ fontSize: '0.7rem' }}>Coach Pack</span>
                <span className="font-inter font-medium text-secondary-text" style={{ fontSize: '0.65rem' }}>Photographer Pack</span>
                <span className="font-inter font-medium text-secondary-text" style={{ fontSize: '0.65rem' }}>Consultant Pack</span>
                <span className="font-inter font-medium text-secondary-text" style={{ fontSize: '0.65rem' }}>Contractor Pack</span>
                <div className="flex items-center gap-1 mt-1">
                  <span className="font-inter font-bold text-amber-600" style={{ fontSize: '0.75rem' }}>From 199</span>
                </div>
              </div>
            </div>

            {/* 3 Tiers badge */}
            <div
              className="absolute bg-navy rounded-full flex items-center gap-2"
              style={{
                top: 56,
                right: 36,
                padding: '8px 16px',
                zIndex: 7,
                boxShadow: '0 8px 24px rgba(27,63,122,0.3)',
                animation: 'float-b 6s ease-in-out infinite',
                animationDelay: '0.5s',
              }}
            >
              <span className="text-success font-bold" style={{ fontSize: '0.85rem' }}>&#10003;</span>
              <span className="font-inter font-semibold text-white" style={{ fontSize: '0.8rem' }}>3 Tiers. 13 Packs.</span>
            </div>

            {/* Save up to 25% badge */}
            <div
              className="absolute rounded-full flex items-center gap-2"
              style={{
                bottom: 8,
                left: 16,
                padding: '10px 18px',
                zIndex: 6,
                background: 'linear-gradient(135deg, #38A169, #48BB78)',
                boxShadow: '0 12px 32px rgba(56,161,105,0.25)',
                animation: 'float-a 11s ease-in-out infinite',
                animationDelay: '3s',
              }}
            >
              <span className="font-inter font-bold text-white" style={{ fontSize: '0.85rem' }}>Save up to 25%</span>
              <span className="font-inter font-normal text-white" style={{ fontSize: '0.7rem' }}>with bundles</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
