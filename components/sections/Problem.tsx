'use client';

import { FileX, ShieldOff, Receipt, Globe, PenLine, RefreshCw, Users, CreditCard } from 'lucide-react';
import { useInView } from '@/hooks/useInView';
import Link from 'next/link';

const problems = [
  {
    icon: FileX,
    title: 'No Client Contract',
    sub: 'Zero legal protection if clients disappear',
  },
  {
    icon: ShieldOff,
    title: 'No GDPR Policy',
    sub: 'ICO fines start the day you take an email',
  },
  {
    icon: Receipt,
    title: 'Invoices Without Teeth',
    sub: 'Late payment has no real consequence',
  },
  {
    icon: Globe,
    title: 'No Professional Website',
    sub: 'Clients judge you before making contact',
  },
  {
    icon: PenLine,
    title: 'No Social Presence',
    sub: 'Every day offline is business lost',
  },
  {
    icon: RefreshCw,
    title: 'Outdated Documents',
    sub: 'Your paperwork no longer matches your business',
  },
  {
    icon: Users,
    title: 'No Onboarding System',
    sub: 'Scope creep starts from day one',
  },
  {
    icon: CreditCard,
    title: 'No Payment Protection',
    sub: 'Unpaid invoices with no recourse',
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
          What operating without business infrastructure looks like.
        </h2>
        <p
          className="font-inter font-normal text-secondary-text mt-4 leading-[1.7]"
          style={{ fontSize: '1.05rem', maxWidth: 580 }}
        >
          Most UK sole traders are legally exposed and professionally underselling — not because they are bad at their work, but because nobody ever helped them build the infrastructure their business needs.
        </p>

        <div
          ref={ref}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12"
        >
          {problems.map((p, i) => {
            const Icon = p.icon;
            return (
              <div
                key={p.title}
                className="group bg-off-white rounded-xl p-6 border border-transparent hover:border-medium-blue/30 hover:shadow-md transition-all duration-300 flex flex-col gap-3"
                style={{
                  opacity: inView ? 1 : 0,
                  transform: inView ? 'translateY(0)' : 'translateY(24px)',
                  transition: `opacity 0.5s ease ${i * 60}ms, transform 0.5s ease ${i * 60}ms, box-shadow 0.2s, border-color 0.2s`,
                }}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-200 group-hover:bg-navy/10"
                  style={{ background: 'rgba(27,63,122,0.08)' }}
                >
                  <Icon size={20} className="text-navy" />
                </div>
                <div>
                  <h3 className="font-inter font-semibold text-dark-text leading-snug" style={{ fontSize: '0.95rem' }}>
                    {p.title}
                  </h3>
                  <p className="font-inter font-normal text-secondary-text mt-1 leading-[1.5]" style={{ fontSize: '0.8rem' }}>
                    {p.sub}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Industry callout — clean banner */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl px-6 py-5"
          style={{ background: 'linear-gradient(135deg, #0F1E3D 0%, #1B3F7A 100%)' }}
        >
          <p className="font-inter font-medium text-white" style={{ fontSize: '0.95rem' }}>
            Each profession has unique risks — coaches, photographers, consultants, and contractors all face specific vulnerabilities.
          </p>
          <Link
            href="/services"
            className="font-inter font-semibold text-navy bg-white rounded-lg whitespace-nowrap hover:bg-off-white transition-colors"
            style={{ padding: '10px 22px', fontSize: '0.875rem' }}
          >
            See Industry Packs
          </Link>
        </div>
      </div>
    </section>
  );
}
