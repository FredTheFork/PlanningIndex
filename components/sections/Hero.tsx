'use client';

import Link from 'next/link';
import { CheckCircle, FileText, Globe, Share2, RefreshCw } from 'lucide-react';
import { useCountUp } from '@/hooks/useCountUp';

const avatars = [
  { initials: 'SM' },
  { initials: 'JR' },
  { initials: 'AS' },
  { initials: 'MT' },
  { initials: 'PK' },
];

export default function Hero() {
  const count = useCountUp(200, 1800, true);

  return (
    <section
      className="relative overflow-hidden pt-[100px] pb-20 md:pt-[120px] md:pb-20 px-6"
      style={{ background: '#f8faff' }}
    >
      {/* Swirl blobs behind content */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <div
          style={{
            position: 'absolute',
            top: '-80px',
            left: 'calc(50% - 80px)',
            width: 560,
            height: 560,
            borderRadius: '50%',
            background: '#1B3F7A',
            filter: 'blur(110px)',
            opacity: 0.13,
            animation: 'swirl-1 18s ease-in-out infinite',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '80px',
            left: 'calc(50% + 60px)',
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: '#2C68C4',
            filter: 'blur(90px)',
            opacity: 0.16,
            animation: 'swirl-2 14s ease-in-out infinite',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '220px',
            left: 'calc(50% + 30px)',
            width: 280,
            height: 280,
            borderRadius: '50%',
            background: '#0EA5E9',
            filter: 'blur(80px)',
            opacity: 0.12,
            animation: 'swirl-3 22s ease-in-out infinite',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-40px',
            left: 'calc(50% - 30px)',
            width: 340,
            height: 340,
            borderRadius: '50%',
            background: '#0F2557',
            filter: 'blur(100px)',
            opacity: 0.09,
            animation: 'swirl-2 26s ease-in-out infinite reverse',
          }}
        />
      </div>

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
            <span className="w-8 h-0.5 bg-medium-blue" />
            <span
              className="font-inter font-semibold text-medium-blue uppercase"
              style={{ fontSize: '0.75rem', letterSpacing: '0.15em' }}
            >
              For UK Sole Traders
            </span>
          </div>

          <h1
            className="font-inter font-extrabold text-dark-text leading-[1.15]"
            style={{
              fontSize: 'clamp(2.4rem, 5vw, 3.6rem)',
              animation: 'fadeInUp 0.65s ease-out both',
              animationDelay: '80ms',
            }}
          >
            Your Business,<br />Properly Founded.
          </h1>

          <p
            className="font-inter font-normal text-secondary-text mt-5 leading-[1.7]"
            style={{
              fontSize: '1.1rem',
              maxWidth: 480,
              animation: 'fadeInUp 0.65s ease-out both',
              animationDelay: '160ms',
            }}
          >
            Professional documents, website copy, and social media posts — built entirely around your UK sole trader business. Done for you. Delivered within 5 days.
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
            <span className="font-inter font-medium text-dark-text" style={{ fontSize: '0.9rem' }}>
              <span className="font-bold text-navy">{count}+</span> UK sole traders — properly founded
            </span>
          </div>

          <div
            className="flex flex-wrap gap-4"
            style={{ animation: 'fadeInUp 0.65s ease-out both', animationDelay: '320ms' }}
          >
            <Link
              href="/services"
              className="font-inter font-semibold text-white bg-navy rounded-lg hover:bg-medium-blue hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(27,63,122,0.25)] transition-all duration-200"
              style={{ padding: '16px 32px', fontSize: '1rem', minHeight: 48 }}
            >
              See All Services
            </Link>
            <Link
              href="/checkout"
              className="font-inter font-semibold text-navy border-2 border-navy rounded-lg hover:bg-off-white transition-colors duration-200"
              style={{ padding: '14px 28px', fontSize: '1rem', minHeight: 48 }}
            >
              Start with Documents — £79
            </Link>
          </div>

          <div
            className="flex flex-wrap gap-6 mt-8"
            style={{ animation: 'fadeInUp 0.65s ease-out both', animationDelay: '400ms' }}
          >
            {['UK Law Compliant', 'Done For You', 'One-Time Payments Available'].map((badge) => (
              <div key={badge} className="flex items-center gap-2">
                <CheckCircle size={16} className="text-success shrink-0" />
                <span className="font-inter font-medium text-secondary-text" style={{ fontSize: '0.875rem' }}>
                  {badge}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right column — floating animated cards */}
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

            {/* Document card */}
            <div
              className="absolute bg-white rounded-2xl overflow-hidden"
              style={{
                width: 300,
                height: 220,
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
                  <FileText size={16} className="text-white/90" />
                  <span className="font-inter font-semibold text-white" style={{ fontSize: '0.8rem' }}>CLIENT CONTRACT</span>
                </div>
                <span className="font-inter font-medium text-white/60" style={{ fontSize: '0.7rem' }}>01/10</span>
              </div>
              <div className="p-5 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div style={{ width: '25%', height: 8, background: '#1B3F7A', borderRadius: 4 }} />
                  <div className="flex-1" style={{ height: 8, background: '#E2E8F0', borderRadius: 4 }} />
                </div>
                <div style={{ width: '90%', height: 8, background: '#F0F4FF', borderRadius: 4 }} />
                <div style={{ width: '72%', height: 8, background: '#F0F4FF', borderRadius: 4 }} />
                <div style={{ width: '85%', height: 8, background: '#F0F4FF', borderRadius: 4 }} />
                <div className="flex gap-2 mt-1">
                  <div style={{ width: 60, height: 24, background: '#38A169', borderRadius: 6 }} />
                  <div style={{ width: 80, height: 24, background: '#EBF2FF', borderRadius: 6 }} />
                </div>
              </div>
            </div>

            {/* Website Copy card */}
            <div
              className="absolute bg-white rounded-2xl overflow-hidden"
              style={{
                width: 185,
                height: 135,
                top: 168,
                right: 0,
                boxShadow: '0 20px 48px rgba(27,63,122,0.14), 0 2px 6px rgba(27,63,122,0.05)',
                zIndex: 4,
                animation: 'float-b 8s ease-in-out infinite',
                animationDelay: '1s',
              }}
            >
              <div
                className="flex items-center gap-2 px-3"
                style={{ height: 36, background: 'linear-gradient(135deg, #2C68C4, #4A90E2)', borderRadius: '16px 16px 0 0' }}
              >
                <Globe size={14} className="text-white/90" />
                <span className="font-inter font-semibold text-white" style={{ fontSize: '0.7rem' }}>WEBSITE COPY</span>
              </div>
              <div className="p-3 flex flex-col gap-2">
                <div style={{ width: '60%', height: 6, background: '#1B3F7A', borderRadius: 3 }} />
                <div style={{ width: '80%', height: 5, background: '#E2E8F0', borderRadius: 3 }} />
                <div style={{ width: '45%', height: 5, background: '#E2E8F0', borderRadius: 3 }} />
                <div className="flex gap-1.5 mt-1">
                  <div style={{ width: 28, height: 16, background: '#F0F4FF', borderRadius: 4 }} />
                  <div style={{ width: 28, height: 16, background: '#F0F4FF', borderRadius: 4 }} />
                </div>
              </div>
            </div>

            {/* Social Posts card */}
            <div
              className="absolute bg-white rounded-2xl overflow-hidden"
              style={{
                width: 174,
                height: 145,
                bottom: 50,
                right: 22,
                boxShadow: '0 20px 48px rgba(27,63,122,0.14), 0 2px 6px rgba(27,63,122,0.05)',
                zIndex: 5,
                animation: 'float-c 9s ease-in-out infinite',
                animationDelay: '2s',
              }}
            >
              <div
                className="flex items-center gap-2 px-3"
                style={{ height: 36, background: 'linear-gradient(135deg, #38A169, #48BB78)', borderRadius: '16px 16px 0 0' }}
              >
                <Share2 size={14} className="text-white/90" />
                <span className="font-inter font-semibold text-white" style={{ fontSize: '0.7rem' }}>SOCIAL POSTS</span>
              </div>
              <div className="p-3 flex flex-col gap-2">
                {[{ color: '#4A90E2', w: '70%' }, { color: '#38A169', w: '55%' }, { color: '#2C68C4', w: '65%' }].map((post, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div style={{ width: 16, height: 16, borderRadius: 4, background: post.color, flexShrink: 0 }} />
                    <div className="flex-1" style={{ height: 5, background: '#E2E8F0', borderRadius: 3, maxWidth: post.w }} />
                  </div>
                ))}
                <div className="flex gap-1 mt-1">
                  <span className="font-inter text-[0.55rem] text-secondary-text">#freelancer</span>
                  <span className="font-inter text-[0.55rem] text-secondary-text">#ukbusiness</span>
                </div>
              </div>
            </div>

            {/* Quarterly Refresh badge */}
            <div
              className="absolute bg-white rounded-2xl flex items-center gap-3"
              style={{
                bottom: 8,
                left: 16,
                padding: '12px 18px',
                boxShadow: '0 12px 32px rgba(27,63,122,0.12)',
                zIndex: 6,
                animation: 'float-a 11s ease-in-out infinite',
                animationDelay: '3s',
              }}
            >
              <div
                className="flex items-center justify-center shrink-0"
                style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #1B3F7A, #2C68C4)' }}
              >
                <RefreshCw size={18} className="text-white" />
              </div>
              <div>
                <div className="font-inter font-semibold text-dark-text" style={{ fontSize: '0.75rem' }}>Quarterly Refresh</div>
                <div className="font-inter font-medium text-secondary-text" style={{ fontSize: '0.65rem' }}>£29 every 4 months</div>
              </div>
            </div>

            {/* 4 Services badge */}
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
              <span className="text-success font-bold" style={{ fontSize: '0.85rem' }}>✓</span>
              <span className="font-inter font-semibold text-white" style={{ fontSize: '0.8rem' }}>4 Services</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
