'use client';

import { FileX, ShieldOff, Receipt, Globe, PenLine, RefreshCw } from 'lucide-react';
import { useInView } from '@/hooks/useInView';

const problems = [
  {
    icon: FileX,
    title: 'No Client Contract',
    desc: "When a client disputes scope, delays payment, or simply disappears — without a signed contract, you have zero legal protection. None.",
  },
  {
    icon: ShieldOff,
    title: 'No GDPR Privacy Policy',
    desc: "The moment you collect a client's email address, you legally need one. The ICO can fine you for not having it. Most sole traders don't.",
  },
  {
    icon: Receipt,
    title: 'Invoices Without Legal Teeth',
    desc: "Missing the right statutory wording means clients know — consciously or not — that late payment carries no real consequence.",
  },
  {
    icon: Globe,
    title: 'No Professional Website Copy',
    desc: "Your website reads like a draft. Clients judge you in seconds, before they ever get in touch. Generic copy means missed business.",
  },
  {
    icon: PenLine,
    title: 'No Social Media Presence',
    desc: "Your LinkedIn is bare, your Instagram untouched. You know you should post but don't know what to say or how often. Every day you're invisible.",
  },
  {
    icon: RefreshCw,
    title: 'Documents That Go Out of Date',
    desc: "Your contract was written two years ago. Your prices, services, and GDPR tools have all changed since. Your paperwork hasn't.",
  },
];

export default function Problem() {
  const [ref, inView] = useInView(0.1);

  return (
    <section id="about" className="bg-white py-24 px-6">
      <div className="max-w-[1200px] mx-auto">
        <span
          className="font-inter font-semibold text-medium-blue uppercase block mb-3"
          style={{ fontSize: '0.75rem', letterSpacing: '0.15em' }}
        >
          THE PROBLEM
        </span>
        <h2
          className="font-inter font-bold text-dark-text leading-snug"
          style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', maxWidth: 660 }}
        >
          What operating without foundations actually looks like.
        </h2>
        <p
          className="font-inter font-normal text-secondary-text mt-4 leading-[1.7]"
          style={{ fontSize: '1.05rem', maxWidth: 600 }}
        >
          Most UK sole traders are legally exposed, professionally underselling themselves, and financially unprotected — not because they are bad at their work, but because nobody ever helped them get the basics right.
        </p>

        <div
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-14"
        >
          {problems.map((p, i) => {
            const Icon = p.icon;
            return (
              <div
                key={p.title}
                className="bg-off-white rounded-xl p-7 border-l-4 border-medium-blue hover:shadow-md transition-all duration-300"
                style={{
                  opacity: inView ? 1 : 0,
                  transform: inView ? 'translateY(0)' : 'translateY(28px)',
                  transition: `opacity 0.55s ease ${i * 70}ms, transform 0.55s ease ${i * 70}ms`,
                }}
              >
                <Icon size={24} className="text-medium-blue mb-4" />
                <h3 className="font-inter font-semibold text-dark-text" style={{ fontSize: '1rem' }}>
                  {p.title}
                </h3>
                <p className="font-inter font-normal text-secondary-text mt-2 leading-[1.6]" style={{ fontSize: '0.9rem' }}>
                  {p.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
