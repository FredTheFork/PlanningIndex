import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export default function Hero() {
  return (
    <section className="bg-white pt-24 pb-20 px-6">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
        <div className="flex-1 max-w-xl">
          <div className="flex items-center gap-3 mb-5">
            <span className="w-8 h-0.5 bg-medium-blue" />
            <span className="text-xs font-semibold text-medium-blue uppercase tracking-wider">
              For UK Sole Traders
            </span>
          </div>

          <h1 className="text-4xl lg:text-5xl font-extrabold text-dark-text leading-tight">
            Your Business. Properly Set Up. In{' '}
            <span className="text-medium-blue">24 Hours.</span>
          </h1>

          <p className="text-lg text-secondary-text mt-5 leading-relaxed">
            10 professional documents built entirely around your UK sole trader business — contracts, privacy policies, invoices, bios, pitches and more. Done for you. Delivered in 24 hours.
          </p>

          <div className="flex flex-wrap gap-4 mt-9">
            <a
              href="/checkout"
              className="bg-navy text-white px-8 py-4 rounded-lg font-semibold hover:bg-medium-blue transition-colors"
            >
              Get Started — £79
            </a>
            <Link
              href="/whats-included"
              className="border-2 border-navy text-navy px-7 py-4 rounded-lg font-semibold hover:bg-off-white transition-colors"
            >
              See What&apos;s Included →
            </Link>
          </div>

          <div className="flex flex-wrap gap-6 mt-8">
            {['UK Law Compliant', '24-Hour Delivery', 'Done For You'].map((badge) => (
              <div key={badge} className="flex items-center gap-2">
                <CheckCircle size={16} className="text-success shrink-0" />
                <span className="text-sm font-medium text-secondary-text">
                  {badge}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="hidden lg:flex flex-1 justify-center">
          <div className="relative" style={{ width: 380, height: 280 }}>
            <div className="absolute rounded-xl" style={{ width: 280, height: 240, top: 16, left: 50, background: '#DBEAFE' }} />
            <div className="absolute rounded-xl" style={{ width: 280, height: 240, top: 8, left: 42, background: '#EBF2FF' }} />
            <div className="absolute rounded-xl bg-white overflow-hidden shadow-2xl" style={{ width: 280, height: 240, top: 0, left: 34 }}>
              <div className="bg-navy flex items-center px-4 h-10">
                <span className="text-xs font-semibold text-white">CLIENT CONTRACT</span>
              </div>
              <div className="p-4 flex flex-col gap-3">
                {[80, 65, 90, 55, 70].map((w, i) => (
                  <div key={i} className="rounded" style={{ width: `${w}%`, height: 10, background: '#E2E8F0' }} />
                ))}
              </div>
            </div>
            <div className="absolute bg-white rounded-full shadow-lg flex items-center gap-2" style={{ bottom: -8, left: 22, padding: '10px 16px' }}>
              <span className="text-success font-bold">✓</span>
              <span className="text-xs font-semibold text-navy">10 Documents Ready</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
