'use client';

import Link from 'next/link';

export default function CTABanner() {
  return (
    <section
      className="relative py-24 px-6 overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0F2557, #1B3F7A, #2C68C4, #1B3F7A, #0F2557)',
        backgroundSize: '300% 300%',
        animation: 'gradientShift 10s ease infinite',
      }}
    >
      {/* Subtle top-right orb */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: -80,
          right: -80,
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'rgba(44,104,196,0.3)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
        }}
      />
      {/* Subtle bottom-left orb */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: -60,
          left: -60,
          width: 320,
          height: 320,
          borderRadius: '50%',
          background: 'rgba(14,165,233,0.15)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
        }}
      />

      <div className="max-w-[700px] mx-auto text-center relative" style={{ zIndex: 1 }}>
        <span
          className="font-inter font-semibold uppercase block mb-5"
          style={{ fontSize: '0.75rem', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.6)' }}
        >
          GET STARTED
        </span>

        <h2
          className="font-inter font-bold text-white leading-[1.25]"
          style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)' }}
        >
          Every week without a contract is a week you are exposed. It takes 20 minutes to change that.
        </h2>

        <p
          className="font-inter font-normal leading-[1.7] mt-5"
          style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.82)' }}
        >
          One questionnaire. Up to 10 bespoke documents, a fully built website, and 30 social posts — all in your voice, all delivered within 5 days.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
          <Link
            href="/checkout"
            className="inline-block font-inter font-bold text-navy bg-white rounded-lg hover:bg-[rgba(255,255,255,0.92)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.25)] transition-all duration-200"
            style={{ padding: '16px 40px', fontSize: '1rem', minHeight: 52 }}
          >
            Get the Documents Pack — £79
          </Link>

          <Link
            href="/services"
            className="inline-block font-inter font-bold text-white border-2 border-white/70 rounded-lg hover:bg-white/10 hover:border-white transition-all duration-200"
            style={{ padding: '14px 40px', fontSize: '1rem', minHeight: 52 }}
          >
            See all services
          </Link>
        </div>

        <p className="font-inter font-normal mt-6" style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>
          One-time payments. No subscription required unless you want one.
        </p>
      </div>
    </section>
  );
}
