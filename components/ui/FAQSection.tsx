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
      <div className="max-w-3xl mx-auto">
        <SectionLabel>{label}</SectionLabel>
        <h2
          className="font-sans font-bold text-primary-900"
          style={{ fontSize: 'clamp(1.5rem, 2.8vw, 2rem)' }}
        >
          {title}
        </h2>

        <div className="mt-10">
          {items.map((faq, i) => (
            <div key={i} className="border-b border-primary-200 py-5">
              {collapsible ? (
                <>
                  <button
                    className="flex items-center justify-between w-full text-left gap-4"
                    onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  >
                    <span className="font-sans font-semibold text-primary-900" style={{ fontSize: '1rem' }}>
                      {faq.q}
                    </span>
                    <ChevronDown
                      size={18}
                      className="text-primary-500 shrink-0 transition-transform duration-200"
                      style={{ transform: openIndex === i ? 'rotate(180deg)' : 'rotate(0deg)' }}
                    />
                  </button>
                  <div
                    className="overflow-hidden transition-all duration-300"
                    style={{ maxHeight: openIndex === i ? 200 : 0 }}
                  >
                    <p
                      className="font-sans text-primary-500 pt-3 leading-relaxed"
                      style={{ fontSize: '0.95rem' }}
                    >
                      {faq.a}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="font-sans font-semibold text-primary-900" style={{ fontSize: '1rem' }}>
                    {faq.q}
                  </h3>
                  <p
                    className="font-sans text-primary-500 mt-2 leading-relaxed"
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
