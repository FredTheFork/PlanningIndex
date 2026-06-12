import Link from 'next/link';
import { CheckCircle, Users } from 'lucide-react';

export default function Hero() {
  return (
    <section className="bg-white pt-[100px] pb-20 md:pt-[120px] md:pb-20 px-6">
      <div className="max-w-[1200px] mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
        {/* Left column */}
        <div className="flex-1 max-w-xl">
          <div className="flex items-center gap-3 mb-5">
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
            style={{ fontSize: 'clamp(2.4rem, 5vw, 3.6rem)' }}
          >
            Your Business, Properly Founded.
          </h1>

          <p
            className="font-inter font-normal text-secondary-text mt-5 leading-[1.7]"
            style={{ fontSize: '1.1rem', maxWidth: 480 }}
          >
            Professional documents, website copy, and social media posts — built entirely around your UK sole trader business. Done for you. Delivered fast.
          </p>

          {/* Social Proof Counter */}
          <div className="flex items-center gap-3 my-6 px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
            <Users size={18} className="text-medium-blue shrink-0" />
            <span className="font-inter font-medium text-dark-text" style={{ fontSize: '0.9rem' }}>
              Join <span className="font-semibold text-navy">200+</span> UK sole traders who got their business foundations sorted
            </span>
          </div>

          <div className="flex flex-wrap gap-4 mt-9">
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

          <div className="flex flex-wrap gap-6 mt-8">
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

        {/* Right column — stacked services visual */}
        <div className="hidden lg:flex flex-1 justify-center">
          <div className="relative" style={{ width: 340, height: 580 }}>
            {/* Item 1: CLIENT CONTRACT */}
            <div
              className="absolute rounded-xl bg-white overflow-hidden"
              style={{
                width: 240,
                height: 140,
                top: 0,
                left: 50,
                boxShadow: '0 16px 48px rgba(27,63,122,0.12)',
                zIndex: 4,
              }}
            >
              <div
                className="bg-navy flex items-center px-3"
                style={{ height: 32, borderRadius: '12px 12px 0 0' }}
              >
                <span className="font-inter font-semibold text-white" style={{ fontSize: '0.65rem' }}>
                  CLIENT CONTRACT
                </span>
              </div>
              <div className="p-3 flex flex-col gap-2">
                {[70, 55, 80].map((w, i) => (
                  <div
                    key={i}
                    className="rounded"
                    style={{ width: `${w}%`, height: 7, background: '#E2E8F0' }}
                  />
                ))}
              </div>
            </div>

            {/* Item 2: WEBSITE COPY */}
            <div
              className="absolute rounded-xl bg-white overflow-hidden"
              style={{
                width: 240,
                height: 140,
                top: 120,
                left: 46,
                boxShadow: '0 16px 48px rgba(27,63,122,0.12)',
                zIndex: 3,
              }}
            >
              <div
                className="bg-medium-blue flex items-center px-3"
                style={{ height: 32, borderRadius: '12px 12px 0 0' }}
              >
                <span className="font-inter font-semibold text-white" style={{ fontSize: '0.65rem' }}>
                  WEBSITE COPY
                </span>
              </div>
              <div className="p-3 flex flex-col gap-2">
                {[75, 60, 70, 50].map((w, i) => (
                  <div
                    key={i}
                    className="rounded"
                    style={{ width: `${w}%`, height: 6, background: '#E2E8F0' }}
                  />
                ))}
              </div>
            </div>

            {/* Item 3: SOCIAL POSTS */}
            <div
              className="absolute rounded-xl bg-white overflow-hidden flex items-center justify-center"
              style={{
                width: 240,
                height: 140,
                top: 240,
                left: 42,
                boxShadow: '0 16px 48px rgba(27,63,122,0.12)',
                zIndex: 2,
              }}
            >
              <div
                className="bg-success flex items-center px-3"
                style={{ height: 32, borderRadius: '12px 12px 0 0', position: 'absolute', top: 0, left: 0, right: 0 }}
              >
                <span className="font-inter font-semibold text-white" style={{ fontSize: '0.65rem' }}>
                  SOCIAL POSTS
                </span>
              </div>
              <div className="pt-12 flex gap-3 pb-6">
                <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#FF6B6B' }} />
                <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#4ECDC4' }} />
                <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#FFE66D' }} />
              </div>
            </div>

            {/* Item 4: QUARTERLY REFRESH */}
            <div
              className="absolute rounded-xl bg-white overflow-hidden flex items-center justify-center"
              style={{
                width: 240,
                height: 140,
                top: 360,
                left: 38,
                boxShadow: '0 16px 48px rgba(27,63,122,0.12)',
                zIndex: 1,
              }}
            >
              <div
                className="bg-medium-blue flex items-center px-3"
                style={{ height: 32, borderRadius: '12px 12px 0 0', position: 'absolute', top: 0, left: 0, right: 0 }}
              >
                <span className="font-inter font-semibold text-white" style={{ fontSize: '0.65rem' }}>
                  QUARTERLY REFRESH
                </span>
              </div>
              <div
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #1B3F7A, #2C68C4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2rem',
                  color: 'white',
                  fontWeight: 'bold',
                  marginTop: 16,
                }}
              >
                ↻
              </div>
            </div>

            {/* Floating badge */}
            <div
              className="absolute bg-white rounded-full shadow-[0_4px_16px_rgba(0,0,0,0.12)] flex items-center gap-2"
              style={{ bottom: -8, left: 18, padding: '10px 16px', zIndex: 5 }}
            >
              <span className="text-success font-bold">✓</span>
              <span className="font-inter font-semibold text-navy" style={{ fontSize: '0.8rem' }}>
                4 Services
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
