import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

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
            Your Business. Properly Set Up. In{' '}
            <span className="text-medium-blue">24 Hours.</span>
          </h1>

          <p
            className="font-inter font-normal text-secondary-text mt-5 leading-[1.7]"
            style={{ fontSize: '1.1rem', maxWidth: 480 }}
          >
            10 professional documents built entirely around your UK sole trader business — contracts, privacy policies, invoices, bios, pitches and more. Done for you. Delivered in 24 hours.
          </p>

          <div className="flex flex-wrap gap-4 mt-9">
            <a
              href="#" // TODO: Link to checkout
              className="font-inter font-semibold text-white bg-navy rounded-lg hover:bg-medium-blue hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(27,63,122,0.25)] transition-all duration-200"
              style={{ padding: '16px 32px', fontSize: '1rem', minHeight: 48 }}
            >
              Get Started — £79
            </a>
            <Link
              href="/whats-included"
              className="font-inter font-semibold text-navy border-2 border-navy rounded-lg hover:bg-off-white transition-colors duration-200"
              style={{ padding: '14px 28px', fontSize: '1rem', minHeight: 48 }}
            >
              See What's Included →
            </Link>
          </div>

          <div className="flex flex-wrap gap-6 mt-8">
            {['UK Law Compliant', '24-Hour Delivery', 'Done For You'].map((badge) => (
              <div key={badge} className="flex items-center gap-2">
                <CheckCircle size={16} className="text-success shrink-0" />
                <span className="font-inter font-medium text-secondary-text" style={{ fontSize: '0.875rem' }}>
                  {badge}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right column — document preview visual */}
        <div className="hidden lg:flex flex-1 justify-center">
          <div className="relative" style={{ width: 380, height: 280 }}>
            {/* Third card (back) */}
            <div
              className="absolute rounded-xl"
              style={{
                width: 280,
                height: 240,
                top: 16,
                left: 50,
                background: '#DBEAFE',
              }}
            />
            {/* Second card (middle) */}
            <div
              className="absolute rounded-xl"
              style={{
                width: 280,
                height: 240,
                top: 8,
                left: 42,
                background: '#EBF2FF',
              }}
            />
            {/* Top card */}
            <div
              className="absolute rounded-xl bg-white overflow-hidden"
              style={{
                width: 280,
                height: 240,
                top: 0,
                left: 34,
                boxShadow: '0 20px 60px rgba(27,63,122,0.15)',
              }}
            >
              <div
                className="bg-navy flex items-center px-4"
                style={{ height: 40, borderRadius: '12px 12px 0 0' }}
              >
                <span className="font-inter font-semibold text-white" style={{ fontSize: '0.75rem' }}>
                  CLIENT CONTRACT
                </span>
              </div>
              <div className="p-4 flex flex-col gap-[14px]">
                {[80, 65, 90, 55, 70].map((w, i) => (
                  <div
                    key={i}
                    className="rounded"
                    style={{ width: `${w}%`, height: 10, background: '#E2E8F0' }}
                  />
                ))}
              </div>
            </div>

            {/* Floating badge */}
            <div
              className="absolute bg-white rounded-full shadow-[0_4px_16px_rgba(0,0,0,0.12)] flex items-center gap-2"
              style={{ bottom: -8, left: 22, padding: '10px 16px' }}
            >
              <span className="text-success font-bold">✓</span>
              <span className="font-inter font-semibold text-navy" style={{ fontSize: '0.8rem' }}>
                10 Documents Ready
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
