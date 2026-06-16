'use client';

import { FileX, ShieldOff, Receipt, Globe, PenLine, RefreshCw, Users, CreditCard, TrendingUp } from 'lucide-react';
import { useInView } from '@/hooks/useInView';

const problems = [
  {
    icon: FileX,
    title: 'No Client Contract',
    desc: "When a client disputes scope, delays payment, or simply disappears — without a signed contract, you have zero legal protection. None.",
    tier: 'foundation',
  },
  {
    icon: ShieldOff,
    title: 'No GDPR Privacy Policy',
    desc: "The moment you collect a client's email address, you legally need one. The ICO can fine you for not having it. Most sole traders don't.",
    tier: 'foundation',
  },
  {
    icon: Receipt,
    title: 'Invoices Without Legal Teeth',
    desc: "Missing the right statutory wording means clients know — consciously or not — that late payment carries no real consequence.",
    tier: 'foundation',
  },
  {
    icon: Globe,
    title: 'No Professional Website Copy',
    desc: "Your website reads like a draft. Clients judge you in seconds, before they ever get in touch. Generic copy means missed business.",
    tier: 'foundation',
  },
  {
    icon: PenLine,
    title: 'No Social Media Presence',
    desc: "Your LinkedIn is bare, your Instagram untouched. You know you should post but don't know what to say or how often. Every day you're invisible.",
    tier: 'foundation',
  },
  {
    icon: RefreshCw,
    title: 'Documents That Go Out of Date',
    desc: "Your contract was written two years ago. Your prices, services, and GDPR tools have all changed since. Your paperwork hasn't.",
    tier: 'foundation',
  },
  {
    icon: Users,
    title: 'No Client Onboarding System',
    desc: "Every new client starts with confusion. No clear scope boundaries. No project brief. Scope creep starts from day one — and you pay for it.",
    tier: 'operations',
  },
  {
    icon: CreditCard,
    title: 'No Payment Protection',
    desc: "Unpaid invoices, chargeback disputes, clients who cancel mid-project. Without proper terms, you're exposed every time you send work.",
    tier: 'operations',
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
          style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', maxWidth: 700 }}
        >
          What operating without business infrastructure actually looks like.
        </h2>
        <p
          className="font-inter font-normal text-secondary-text mt-4 leading-[1.7]"
          style={{ fontSize: '1.05rem', maxWidth: 650 }}
        >
          Most UK sole traders are legally exposed, professionally underselling themselves, and financially unprotected — not because they are bad at their work, but because nobody ever helped them build the infrastructure their business needs.
        </p>

        <div
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-14"
        >
          {problems.map((p, i) => {
            const Icon = p.icon;
            const isOperations = p.tier === 'operations';
            return (
              <div
                key={p.title}
                className="bg-off-white rounded-xl p-7 border-l-4 hover:shadow-md transition-all duration-300"
                style={{
                  borderLeftColor: isOperations ? '#2C68C4' : '#1B3F7A',
                  opacity: inView ? 1 : 0,
                  transform: inView ? 'translateY(0)' : 'translateY(28px)',
                  transition: `opacity 0.55s ease ${i * 70}ms, transform 0.55s ease ${i * 70}ms`,
                }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Icon size={24} className={isOperations ? 'text-medium-blue' : 'text-navy'} />
                  {isOperations && (
                    <span
                      className="font-inter font-semibold text-medium-blue uppercase"
                      style={{ fontSize: '0.65rem', letterSpacing: '0.1em' }}
                    >
                      Operations tier risk
                    </span>
                  )}
                </div>
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

        {/* Industry-specific callout */}
        <div
          className="mt-12 rounded-xl p-6"
          style={{
            background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
            border: '2px solid #F59E0B',
          }}
        >
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp size={24} className="text-amber-500" />
            <h3 className="font-inter font-bold text-dark-text" style={{ fontSize: '1.1rem' }}>
              Industry-specific exposure
            </h3>
          </div>
          <p className="font-inter font-normal text-secondary-text leading-[1.6]" style={{ fontSize: '0.95rem' }}>
            Beyond these general risks, each profession has unique vulnerabilities. Coaches face scope creep around &quot;extra sessions.&quot; Photographers deal with image licensing disputes. Consultants battle unclear deliverables. Contractors navigate complex health and safety requirements. Our Industry tier addresses every profession specifically.
          </p>
        </div>
      </div>
    </section>
  );
}
