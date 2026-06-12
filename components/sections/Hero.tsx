import Link from 'next/link';
import { CheckCircle, Users, FileText, Globe, Share2, RefreshCw } from 'lucide-react';

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

        {/* Right column — premium platform visual */}
        <div className="hidden lg:flex flex-1 justify-center items-center">
          <div className="relative" style={{ width: 420, height: 480 }}>
            {/* Back layer: subtle gradient glow */}
            <div
              className="absolute rounded-3xl"
              style={{
                width: 340,
                height: 420,
                top: 30,
                left: 40,
                background: 'linear-gradient(135deg, rgba(27,63,122,0.06), rgba(44,104,196,0.1))',
                zIndex: 0,
              }}
            />

            {/* Document Stack — top card */}
            <div
              className="absolute bg-white rounded-2xl overflow-hidden"
              style={{
                width: 300,
                height: 220,
                top: 0,
                left: 10,
                boxShadow: '0 24px 64px rgba(27,63,122,0.18), 0 2px 8px rgba(27,63,122,0.06)',
                zIndex: 3,
              }}
            >
              {/* Navy header bar */}
              <div
                className="flex items-center justify-between px-4"
                style={{
                  height: 44,
                  background: 'linear-gradient(135deg, #1B3F7A, #2C68C4)',
                  borderRadius: '16px 16px 0 0',
                }}
              >
                <div className="flex items-center gap-2">
                  <FileText size={16} className="text-white/90" />
                  <span className="font-inter font-semibold text-white" style={{ fontSize: '0.8rem' }}>
                    CLIENT CONTRACT
                  </span>
                </div>
                <span className="font-inter font-medium text-white/60" style={{ fontSize: '0.7rem' }}>
                  01/10
                </span>
              </div>

              {/* Document content lines */}
              <div className="p-5">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div className="rounded" style={{ width: '25%', height: 8, background: '#1B3F7A', borderRadius: 4 }} />
                    <div className="rounded flex-1" style={{ height: 8, background: '#E2E8F0', borderRadius: 4 }} />
                  </div>
                  <div className="rounded" style={{ width: '90%', height: 8, background: '#F0F4FF', borderRadius: 4 }} />
                  <div className="rounded" style={{ width: '72%', height: 8, background: '#F0F4FF', borderRadius: 4 }} />
                  <div className="rounded" style={{ width: '85%', height: 8, background: '#F0F4FF', borderRadius: 4 }} />
                  <div className="flex gap-2 mt-1">
                    <div className="rounded" style={{ width: 60, height: 24, background: '#38A169', borderRadius: 6 }} />
                    <div className="rounded" style={{ width: 80, height: 24, background: '#EBF2FF', borderRadius: 6 }} />
                  </div>
                </div>
              </div>

              {/* Subtle second/third document edges peeking out */}
              <div
                className="absolute rounded-b-2xl"
                style={{
                  bottom: -6,
                  left: 8,
                  right: 8,
                  height: 12,
                  background: '#F0F4FF',
                  boxShadow: '0 4px 16px rgba(27,63,122,0.06)',
                  zIndex: -1,
                }}
              />
            </div>

            {/* Website Copy Card */}
            <div
              className="absolute bg-white rounded-2xl overflow-hidden"
              style={{
                width: 180,
                height: 130,
                top: 160,
                right: 0,
                boxShadow: '0 20px 48px rgba(27,63,122,0.14), 0 2px 6px rgba(27,63,122,0.05)',
                zIndex: 4,
              }}
            >
              <div
                className="flex items-center gap-2 px-3"
                style={{
                  height: 36,
                  background: 'linear-gradient(135deg, #2C68C4, #4A90E2)',
                  borderRadius: '16px 16px 0 0',
                }}
              >
                <Globe size={14} className="text-white/90" />
                <span className="font-inter font-semibold text-white" style={{ fontSize: '0.7rem' }}>
                  WEBSITE COPY
                </span>
              </div>
              <div className="p-3 flex flex-col gap-2">
                <div className="rounded" style={{ width: '60%', height: 6, background: '#1B3F7A', borderRadius: 3 }} />
                <div className="rounded" style={{ width: '80%', height: 5, background: '#E2E8F0', borderRadius: 3 }} />
                <div className="rounded" style={{ width: '45%', height: 5, background: '#E2E8F0', borderRadius: 3 }} />
                <div className="flex gap-1.5 mt-1">
                  <div className="rounded" style={{ width: 28, height: 16, background: '#F0F4FF', borderRadius: 4 }} />
                  <div className="rounded" style={{ width: 28, height: 16, background: '#F0F4FF', borderRadius: 4 }} />
                </div>
              </div>
            </div>

            {/* Social Posts Card */}
            <div
              className="absolute bg-white rounded-2xl overflow-hidden"
              style={{
                width: 170,
                height: 140,
                bottom: 40,
                right: 20,
                boxShadow: '0 20px 48px rgba(27,63,122,0.14), 0 2px 6px rgba(27,63,122,0.05)',
                zIndex: 5,
              }}
            >
              <div
                className="flex items-center gap-2 px-3"
                style={{
                  height: 36,
                  background: 'linear-gradient(135deg, #38A169, #48BB78)',
                  borderRadius: '16px 16px 0 0',
                }}
              >
                <Share2 size={14} className="text-white/90" />
                <span className="font-inter font-semibold text-white" style={{ fontSize: '0.7rem' }}>
                  SOCIAL POSTS
                </span>
              </div>
              <div className="p-3 flex flex-col gap-2">
                {/* Mini post cards */}
                {[{ color: '#FF6B6B', w: '70%' }, { color: '#4ECDC4', w: '55%' }, { color: '#FFE66D', w: '65%' }].map((post, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div
                      style={{
                        width: 16,
                        height: 16,
                        borderRadius: 4,
                        background: post.color,
                        flexShrink: 0,
                      }}
                    />
                    <div className="rounded flex-1" style={{ height: 5, background: '#E2E8F0', borderRadius: 3, maxWidth: post.w }} />
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
                bottom: 0,
                left: 20,
                padding: '12px 18px',
                boxShadow: '0 12px 32px rgba(27,63,122,0.12), 0 2px 4px rgba(27,63,122,0.04)',
                zIndex: 6,
              }}
            >
              <div
                className="flex items-center justify-center shrink-0"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: 'linear-gradient(135deg, #1B3F7A, #2C68C4)',
                }}
              >
                <RefreshCw size={18} className="text-white" />
              </div>
              <div>
                <div className="font-inter font-semibold text-dark-text" style={{ fontSize: '0.75rem' }}>
                  Quarterly Refresh
                </div>
                <div className="font-inter font-medium text-secondary-text" style={{ fontSize: '0.65rem' }}>
                  £29 every 4 months
                </div>
              </div>
            </div>

            {/* Floating "4 Services" badge */}
            <div
              className="absolute bg-navy rounded-full flex items-center gap-2"
              style={{
                top: 60,
                right: 40,
                padding: '8px 16px',
                zIndex: 7,
                boxShadow: '0 8px 24px rgba(27,63,122,0.3)',
              }}
            >
              <span className="text-success font-bold" style={{ fontSize: '0.85rem' }}>✓</span>
              <span className="font-inter font-semibold text-white" style={{ fontSize: '0.8rem' }}>
                4 Services
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
