'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { SectionLabel } from './SectionLabel';

interface FAQItem {
  q: string;
  a: string;
}

interface FAQSectionProps {
  items: FAQItem[];
  title?: string;
  label?: string;
  collapsible?: boolean;
}

export function FAQSection({ items, title = 'Common questions', label = 'FAQ', collapsible = false }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="bg-white py-20 px-6">
      <div className="mx-auto" style={{ maxWidth: 760 }}>
        <SectionLabel>{label}</SectionLabel>
        <h2
          className="font-inter font-bold text-dark-text"
          style={{ fontSize: 'clamp(1.5rem, 2.8vw, 2rem)' }}
        >
          {title}
        </h2>

        <div className="mt-10">
          {items.map((faq, i) => (
            <div key={i} className="border-b border-border py-5">
              {collapsible ? (
                <>
                  <button
                    className="flex items-center justify-between w-full text-left gap-4"
                    onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  >
                    <span className="font-inter font-semibold text-dark-text" style={{ fontSize: '1rem' }}>
                      {faq.q}
                    </span>
                    <ChevronDown
                      size={18}
                      className="text-secondary-text shrink-0 transition-transform duration-200"
                      style={{ transform: openIndex === i ? 'rotate(180deg)' : 'rotate(0deg)' }}
                    />
                  </button>
                  <div
                    className="overflow-hidden transition-all duration-300"
                    style={{ maxHeight: openIndex === i ? 200 : 0 }}
                  >
                    <p
                      className="font-inter font-normal text-secondary-text pt-3 leading-[1.7]"
                      style={{ fontSize: '0.95rem' }}
                    >
                      {faq.a}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="font-inter font-semibold text-dark-text" style={{ fontSize: '1rem' }}>
                    {faq.q}
                  </h3>
                  <p
                    className="font-inter font-normal text-secondary-text mt-2 leading-[1.7]"
                    style={{ fontSize: '0.95rem' }}
                  >
                    {faq.a}
                  </p>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
