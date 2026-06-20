'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Check } from 'lucide-react';

/* --- Shared --- */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="font-inter font-semibold text-medium-blue uppercase block mb-3"
      style={{ fontSize: '0.75rem', letterSpacing: '0.15em' }}
    >
      {children}
    </span>
  );
}

/* --- 1. Page Header --- */

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
          Here's exactly what happens when you order
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

/* --- 2. Three-Step Process --- */

const steps = [
  {
    num: '1',
    title: 'Complete the questionnaire',
    desc: 'After payment, you receive a secure questionnaire. Takes about 20 minutes. We ask about your services, pricing, tone, and how your business operates.',
    details: ['Your services in your own words', 'How you charge and work with clients', 'Preferred tone (formal, friendly, plain-English)', 'GDPR and data handling details'],
  },
  {
    num: '2',
    title: 'We build everything for you',
    desc: 'Your answers generate each piece of content individually. UK-specific legal frameworks embedded. No generic templates.',
    details: ['Each asset created separately', 'UK law compliance built-in', 'Brand voice across all content', 'Human reviewed before delivery'],
  },
  {
    num: '3',
    title: 'Receive your content',
    desc: 'Everything delivered within 3-5 business days. PDF for sending. Word for editing. Hosted website preview to review.',
    details: ['Branded PDF documents', 'Editable Word files', 'Website source files + hosted preview', 'Social posts formatted for your platforms'],
  },
];

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
          We've designed the process to respect your time. Everything is collected upfront, built correctly, and delivered ready to use.
        </p>

        <div className="relative mt-14">
          {/* Connection line */}
          <div
            className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-medium-blue/20 hidden md:block"
            style={{ transform: 'translateX(-50%)' }}
          />

          <div className="flex flex-col gap-12">
            {steps.map((step, i) => (
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

/* --- 3. What This Is (And Isn't) --- */

const isItems = [
  'A done-for-you service',
  'Built specifically for UK sole traders',
  'One-time purchase (no subscription required)',
  'Practical protection and professionalism',
];

const isntItems = [
  'Not a DIY legal tool',
  'Not a generic AI prompt',
  'Not a solicitor retainer',
];

function WhatThisIs() {
  return (
    <section className="bg-off-white py-16 px-6">
      <div className="mx-auto" style={{ maxWidth: 900 }}>
        <SectionLabel>CLARITY</SectionLabel>
        <h2
          className="font-inter font-bold text-dark-text"
          style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}
        >
          What this is — and what it isn't
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
              What it isn't
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

/* --- 4. FAQ --- */

const faqs = [
  {
    q: 'Can I pause and come back to the questionnaire?',
    a: 'Yes. Once you pay, you receive a unique link by email. Complete it whenever you are ready — no deadline. The delivery clock starts when you submit.',
  },
  {
    q: "What if I'm not sure how to answer a question?",
    a: "The questionnaire includes guidance notes. Leave a note in the free-text field and we'll use reasonable defaults based on your industry.",
  },
  {
    q: 'Can I request changes after delivery?',
    a: "Yes. Email us within 7 days and we'll make reasonable corrections at no extra charge. You also receive editable Word files to make changes yourself.",
  },
  {
    q: 'How fast do I receive my content?',
    a: 'Documents are typically delivered within 3-5 business days after questionnaire submission. Website copy and social media follow the same timeline.',
  },
  {
    q: "What if I'm not happy with the result?",
    a: "Because we begin work immediately after questionnaire submission, we cannot offer refunds. Email us before purchasing if you have concerns — we'll give you an honest answer.",
  },
];

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
          {faqs.map((faq, i) => (
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

/* --- 5. Final CTA --- */

function FinalCTA() {
  return (
    <section
      className="text-center px-6"
      style={{
        padding: '80px 0',
        background: 'linear-gradient(135deg, #1B3F7A 0%, #2C68C4 100%)',
      }}
    >
      <div className="mx-auto" style={{ maxWidth: 700 }}>
        <h2
          className="font-inter font-bold text-white"
          style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)' }}
        >
          Ready to get your business foundations sorted?
        </h2>
        <p
          className="font-inter font-normal mt-4 leading-[1.7]"
          style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.85)' }}
        >
          One questionnaire. Everything delivered within 3-5 business days.
        </p>
        <Link
          href="/services"
          className="inline-block font-inter font-bold text-navy bg-white rounded-lg hover:bg-[rgba(255,255,255,0.92)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.2)] transition-all duration-200 mt-8"
          style={{ padding: '16px 36px', fontSize: '1rem' }}
        >
          See all services
        </Link>
      </div>
    </section>
  );
}

/* --- Main --- */

export default function HowItWorksPage() {
  return (
    <>
      <PageHeader />
      <ThreeStepProcess />
      <WhatThisIs />
      <FAQs />
      <FinalCTA />
    </>
  );
}
