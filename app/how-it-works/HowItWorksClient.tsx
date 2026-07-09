'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Check } from 'lucide-react';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { DarkCTABanner } from '@/components/ui/DarkCTABanner';
import { howItWorksSteps, isItems, isntItems, howItWorksFaqs } from '@/lib/content';

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
          HOW IT WORKS
        </span>
        <h1
          className="font-inter font-extrabold text-white mt-3"
          style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', lineHeight: 1.2 }}
        >
          Here&apos;s exactly what happens when you order
        </h1>
        <p
          className="font-inter font-normal mx-auto mt-4 leading-[1.7]"
          style={{
            fontSize: '1.05rem',
            color: 'rgba(255,255,255,0.85)',
            maxWidth: 560,
          }}
        >
          One questionnaire. Everything you need delivered within 3-5 business days. No templates, no complexity.
        </p>
      </div>
    </section>
  );
}

function ThreeStepProcess() {
  return (
    <section className="bg-white py-20 px-6">
      <div className="mx-auto" style={{ maxWidth: 1000 }}>
        <SectionLabel>THE PROCESS</SectionLabel>
        <h2
          className="font-inter font-bold text-dark-text"
          style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)' }}
        >
          Three steps. Done for you.
        </h2>
        <p
          className="font-inter font-normal text-secondary-text mt-3 leading-[1.7]"
          style={{ fontSize: '1rem', maxWidth: 520 }}
        >
          We&apos;ve designed the process to respect your time. Everything is collected upfront, built correctly, and delivered ready to use.
        </p>

        <div className="relative mt-14">
          <div className="flex flex-col gap-12">
            {howItWorksSteps.map((step) => (
              <div
                key={step.num}
                className="flex flex-col md:flex-row items-start gap-6"
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-white font-inter font-bold shrink-0 mx-auto md:mx-0 relative z-10"
                  style={{
                    fontSize: '1.4rem',
                    background: 'linear-gradient(135deg, #1B3F7A, #2C68C4)',
                  }}
                >
                  {step.num}
                </div>
                <div className="bg-off-white rounded-2xl p-6 flex-1" style={{ boxShadow: '0 4px 24px rgba(27,63,122,0.06)' }}>
                  <h3 className="font-inter font-semibold text-dark-text" style={{ fontSize: '1.1rem' }}>
                    {step.title}
                  </h3>
                  <p className="font-inter font-normal text-secondary-text mt-2 leading-[1.6]" style={{ fontSize: '0.95rem' }}>
                    {step.desc}
                  </p>
                  <ul className="flex flex-wrap gap-3 mt-4">
                    {step.details.map((d) => (
                      <li key={d} className="flex items-center gap-2 bg-white rounded-full px-3 py-1.5">
                        <Check size={12} className="text-success shrink-0" />
                        <span className="font-inter font-medium text-dark-text" style={{ fontSize: '0.8rem' }}>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function WhatThisIs() {
  return (
    <section className="bg-off-white py-16 px-6">
      <div className="mx-auto" style={{ maxWidth: 900 }}>
        <SectionLabel>CLARITY</SectionLabel>
        <h2
          className="font-inter font-bold text-dark-text"
          style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}
        >
          What this is — and what it isn&apos;t
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
          <div className="bg-white rounded-2xl p-6">
            <h3 className="font-inter font-semibold text-dark-text mb-4" style={{ fontSize: '1rem' }}>
              What Foundationary is
            </h3>
            <ul className="flex flex-col gap-3">
              {isItems.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Check size={16} className="text-success shrink-0 mt-0.5" />
                  <span className="font-inter font-medium text-dark-text" style={{ fontSize: '0.9rem' }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white rounded-2xl p-6">
            <h3 className="font-inter font-semibold text-dark-text mb-4" style={{ fontSize: '1rem' }}>
              What it isn&apos;t
            </h3>
            <ul className="flex flex-col gap-3">
              {isntItems.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="text-danger font-bold shrink-0">X</span>
                  <span className="font-inter font-medium text-secondary-text" style={{ fontSize: '0.9rem' }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function FAQs() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="bg-white py-20 px-6">
      <div className="mx-auto" style={{ maxWidth: 760 }}>
        <SectionLabel>COMMON QUESTIONS</SectionLabel>
        <h2
          className="font-inter font-bold text-dark-text"
          style={{ fontSize: 'clamp(1.5rem, 2.8vw, 2rem)' }}
        >
          Questions about the process
        </h2>

        <div className="mt-10">
          {howItWorksFaqs.map((faq, i) => (
            <div key={i} className="border-b border-border py-5">
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function HowItWorksPage() {
  return (
    <>
      <PageHeader />
      <ThreeStepProcess />
      <WhatThisIs />
      <FAQs />
      <DarkCTABanner
        title="Ready to get your business foundations sorted?"
        subtitle="One questionnaire. Everything delivered within 3-5 business days."
        ctaLabel="See all services"
        ctaHref="/services"
      />
    </>
  );
}
