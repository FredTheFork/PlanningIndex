'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { FAQ } from '@/lib/content/faq-data';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { DarkCTABanner } from '@/components/ui/DarkCTABanner';

function PageHeader() {
  return (
    <section
      className="text-center px-6"
      style={{
        padding: '80px 0 72px',
        background: 'linear-gradient(135deg, #1B3F7A 0%, #2C68C4 100%)',
      }}
    >
      <div className="mx-auto" style={{ maxWidth: 800 }}>
        <span
          className="font-inter font-semibold uppercase block"
          style={{
            fontSize: '0.75rem',
            letterSpacing: '0.15em',
            color: 'rgba(255,255,255,0.7)',
            marginTop: '72px',
          }}
        >
          COMMON QUESTIONS
        </span>
        <h1
          className="font-inter font-extrabold text-white mt-3"
          style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', lineHeight: 1.2 }}
        >
          Questions we hear a lot.
        </h1>
        <p
          className="font-inter font-normal mx-auto mt-4 leading-[1.7]"
          style={{
            fontSize: '1.05rem',
            color: 'rgba(255,255,255,0.85)',
            maxWidth: 620,
          }}
        >
          Get honest answers about what Foundationary does, what it doesn&apos;t, and whether it&apos;s right for your business.
        </p>
      </div>
    </section>
  );
}

interface FAQAccordionProps {
  faqs: FAQ[];
}

function FAQAccordion({ faqs }: FAQAccordionProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggleExpanded = (id: string) => {
    setExpanded(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const categories = Array.from(new Set(faqs.map(faq => faq.category)));

  return (
    <section className="bg-white py-24 px-6">
      <div className="mx-auto" style={{ maxWidth: 900 }}>
        {categories.map(category => (
          <div key={category} className="mb-16">
            <SectionLabel>{category.toUpperCase()}</SectionLabel>
            <h2
              className="font-inter font-bold text-dark-text mb-8"
              style={{ fontSize: 'clamp(1.4rem, 3vw, 1.8rem)' }}
            >
              {category}
            </h2>

            <div className="flex flex-col gap-3">
              {faqs.filter(faq => faq.category === category).map(faq => {
                const isExpanded = !!expanded[faq.id];

                return (
                  <div
                    key={faq.id}
                    className="bg-off-white rounded-lg border border-border overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <button
                      onClick={() => toggleExpanded(faq.id)}
                      className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                      aria-expanded={isExpanded}
                    >
                      <h3
                        className="font-inter font-semibold text-dark-text pr-4"
                        style={{ fontSize: '1rem' }}
                      >
                        {faq.question}
                      </h3>
                      <ChevronDown
                        size={20}
                        className="text-navy shrink-0 transition-transform duration-200"
                        style={{
                          transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                        }}
                      />
                    </button>

                    {isExpanded && (
                      <div className="px-6 pb-6 border-t border-border">
                        <p
                          className="font-inter text-secondary-text leading-[1.7] pt-6"
                          style={{ fontSize: '0.95rem' }}
                        >
                          {faq.answer}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function FAQPage({ faqs }: { faqs: FAQ[] }) {
  return (
    <>
      <PageHeader />
      <FAQAccordion faqs={faqs} />
      <DarkCTABanner
        title="Still have questions?"
        subtitle="Get in touch directly and we'll help you work out whether Foundationary is the right fit for your business."
        ctaLabel="Get In Touch"
        ctaHref="/contact"
      />
    </>
  );
}
