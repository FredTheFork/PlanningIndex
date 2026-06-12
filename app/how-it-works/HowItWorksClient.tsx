'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Clock, UserCheck, FileText } from 'lucide-react';

/* ─── shared ─── */

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

/* ─── 1. Page Header ─── */

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
          From questionnaire to complete business foundations — delivered fast.
        </h1>
        <p
          className="font-inter font-normal mx-auto mt-4 leading-[1.7]"
          style={{
            fontSize: '1.05rem',
            color: 'rgba(255,255,255,0.85)',
            maxWidth: 560,
          }}
        >
          Foundationary is a done-for-you service. You tell us about your business once. We create, review, and deliver everything you need — documents, website copy, and social media posts — without templates, complexity, or having to piece it together yourself.
        </p>
      </div>
    </section>
  );
}

/* ─── 2. Simple Overview (3 Steps) ─── */

const overviewSteps = [
  {
    num: '01',
    title: 'Complete the questionnaire',
    body: 'After payment, you receive a secure questionnaire link. It takes around 20 minutes and covers your services, pricing, tone of voice, and how your business actually operates. The questions adapt based on which services you purchased.',
    bullets: [
      'Your services, in your own words',
      'How you charge and work with clients',
      'GDPR and data handling details',
      'Preferred tone (formal, friendly, plain-English)',
      'Social platform and website page preferences (if applicable)',
    ],
  },
  {
    num: '02',
    title: 'We build everything for you',
    body: 'Your answers are used to generate each piece of content individually using structured AI prompts designed specifically for UK sole traders — documents, website pages, and social media posts.',
    bullets: [
      'UK-specific legal frameworks embedded',
      'No generic templates',
      'Each asset created separately, not auto-filled',
      'Fully built website tailored to your brand voice',
      'Social posts written for your platforms and audience',
    ],
  },
  {
    num: '03',
    title: 'Reviewed, packaged, and delivered',
    body: 'Every piece of content is reviewed by a human before delivery to ensure consistency, clarity, and compliance.',
    bullets: [
      'Checked for UK law alignment',
      'Consistent terms across all documents',
      'Brand voice consistent across documents, web, and social',
      'Documents delivered as PDF + editable Word files',
      'Fully built website (ZIP + hosted preview)',
      'Social posts formatted for your chosen platforms',
    ],
  },
];

function SimpleOverview() {
  return (
    <section className="bg-white py-24 px-6">
      <div className="mx-auto" style={{ maxWidth: 1000 }}>
        <SectionLabel>THE PROCESS</SectionLabel>
        <h2
          className="font-inter font-bold text-dark-text"
          style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)' }}
        >
          Three steps. No back-and-forth. No guesswork.
        </h2>
        <p
          className="font-inter font-normal text-secondary-text mt-3 leading-[1.7]"
          style={{ fontSize: '1.05rem', maxWidth: 520 }}
        >
          We've designed the process to respect your time. Everything is collected upfront, built correctly, and delivered ready to use.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-14">
          {overviewSteps.map((step) => (
            <div
              key={step.num}
              className="bg-off-white rounded-[20px] p-8"
              style={{ boxShadow: '0 12px 40px rgba(27,63,122,0.08)' }}
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-white font-inter font-bold shrink-0"
                style={{
                  fontSize: '0.95rem',
                  background: 'linear-gradient(135deg, #1B3F7A, #2C68C4)',
                }}
              >
                {step.num}
              </div>
              <h3 className="font-inter font-semibold text-dark-text mt-5" style={{ fontSize: '1.1rem' }}>
                {step.title}
              </h3>
              <p className="font-inter font-normal text-secondary-text mt-2.5 leading-[1.6]" style={{ fontSize: '0.9rem' }}>
                {step.body}
              </p>
              <ul className="flex flex-col gap-2 mt-4">
                {step.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2.5">
                    <span className="text-success font-bold shrink-0" style={{ fontSize: '0.85rem' }}>✓</span>
                    <span className="font-inter font-medium text-dark-text" style={{ fontSize: '0.85rem' }}>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── 3. Detailed Breakdown ─── */

const detailedSteps = [
  {
    subheading: '1. Intake & context',
    text: 'Your questionnaire answers give us the context we need to produce content that actually fits your business — not an abstract version of it. The questions you see depend on which services you purchased.',
    checklist: [
      'Business details & structure',
      'Services and scope boundaries',
      'Pricing and payment terms',
      'Common client issues',
      'Data collection and GDPR requirements',
      'Branding and tone preferences',
      'Social media platform and audience details',
      'Website page structure and priorities',
    ],
  },
  {
    subheading: '2. Content creation',
    text: 'Each asset is generated using a dedicated prompt that combines your answers with UK-specific legal and professional frameworks. Documents, website pages, and social media posts are all created separately.',
    explicit: [
      'Content is not stitched together',
      'Each asset is created intentionally',
      'Legal language is appropriate for sole traders (not corporate boilerplate)',
      'Website is fully built and ready to deploy',
      'Social posts are tailored per platform',
    ],
  },
  {
    subheading: '3. Human QA & consistency checks',
    text: 'This is the difference between raw AI output and professional work.',
    checklist: [
      'Payment terms match across contract, T&Cs, invoices',
      'Tone is consistent across documents, website copy, and social posts',
      'Obvious legal or structural issues removed',
      'Formatting cleaned and standardised',
      'Social post lengths appropriate for each platform',
    ],
  },
  {
    subheading: '4. Delivery & follow-up',
    text: 'You receive everything organised and ready to use.',
    checklist: [
      'Branded PDFs',
      'Editable Word documents',
      'Fully built website delivered as source files and hosted preview',
      'Social media posts formatted for your platforms',
      'Personal delivery email',
      '7-day follow-up check-in',
    ],
  },
];

function DetailedBreakdown() {
  return (
    <section className="bg-off-white py-24 px-6">
      <div className="mx-auto" style={{ maxWidth: 960 }}>
        <SectionLabel>BEHIND THE SCENES</SectionLabel>
        <h2
          className="font-inter font-bold text-dark-text"
          style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)' }}
        >
          What actually happens behind the scenes
        </h2>
        <p
          className="font-inter font-normal text-secondary-text mt-3 leading-[1.7]"
          style={{ fontSize: '1rem', maxWidth: 600 }}
        >
          Foundationary isn't a tool and it isn't a template bundle. This is a structured service with real work done on your behalf.
        </p>

        <div className="flex flex-col gap-10 mt-14">
          {detailedSteps.map((step, i) => (
            <div key={step.subheading} className="bg-white rounded-2xl border border-border p-8">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white font-inter font-bold shrink-0"
                  style={{
                    fontSize: '0.8rem',
                    background: 'linear-gradient(135deg, #1B3F7A, #2C68C4)',
                  }}
                >
                  {String.fromCharCode(65 + i)}
                </div>
                <h3 className="font-inter font-semibold text-dark-text" style={{ fontSize: '1.1rem' }}>
                  {step.subheading}
                </h3>
              </div>
              <p className="font-inter font-normal text-secondary-text leading-[1.7]" style={{ fontSize: '0.95rem' }}>
                {step.text}
              </p>
              {step.checklist && (
                <ul className="flex flex-col gap-2.5 mt-5">
                  {step.checklist.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <span className="text-success font-bold shrink-0" style={{ fontSize: '0.85rem' }}>✓</span>
                      <span className="font-inter font-medium text-dark-text" style={{ fontSize: '0.9rem' }}>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
              {step.explicit && (
                <ul className="flex flex-col gap-2.5 mt-5">
                  {step.explicit.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <span className="text-medium-blue font-bold shrink-0" style={{ fontSize: '0.85rem' }}>→</span>
                      <span className="font-inter font-medium text-dark-text" style={{ fontSize: '0.9rem' }}>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── 4. What This Is (And Isn't) ─── */

const isItems = [
  'A done-for-you service',
  'Built specifically for UK sole traders',
  'One-time purchase (core pack)',
  'Focused on practical protection and professionalism',
  'Documents, website copy, and social media in one place',
];

const isntItems = [
  'Not a DIY legal tool',
  'Not a generic AI prompt',
  'Not a solicitor retainer',
  'Not a subscription trap — optional refresh available',
];

function WhatThisIs() {
  return (
    <section className="bg-white py-20 px-6">
      <div className="mx-auto" style={{ maxWidth: 960 }}>
        <SectionLabel>CLARITY</SectionLabel>
        <h2
          className="font-inter font-bold text-dark-text"
          style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)' }}
        >
          What this is — and what it isn't
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          <div className="bg-off-white rounded-2xl p-8">
            <h3 className="font-inter font-semibold text-dark-text mb-5" style={{ fontSize: '1.05rem' }}>
              What Foundationary is
            </h3>
            <ul className="flex flex-col gap-3">
              {isItems.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="text-success font-bold shrink-0">✓</span>
                  <span className="font-inter font-medium text-dark-text" style={{ fontSize: '0.925rem' }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-off-white rounded-2xl p-8">
            <h3 className="font-inter font-semibold text-dark-text mb-5" style={{ fontSize: '1.05rem' }}>
              What it isn't
            </h3>
            <ul className="flex flex-col gap-3">
              {isntItems.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="text-danger font-bold shrink-0">✕</span>
                  <span className="font-inter font-medium text-secondary-text" style={{ fontSize: '0.925rem' }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── 5. Timeline & Expectations ─── */

const timelineSteps = [
  { label: 'Payment', desc: 'Choose your service or bundle. One-time payment for documents, website copy, and social posts.' },
  { label: 'Questionnaire submitted', desc: 'The delivery clock starts here.' },
  { label: 'Work begins', desc: 'Your content is created and reviewed.' },
  { label: 'Delivery within 3–5 business days', desc: 'Documents, website copy, and social posts land in your inbox.' },
];

function Timeline() {
  return (
    <section className="bg-off-white py-20 px-6">
      <div className="mx-auto" style={{ maxWidth: 800 }}>
        <SectionLabel>TIMELINE</SectionLabel>
        <h2
          className="font-inter font-bold text-dark-text"
          style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)' }}
        >
          What to expect and when
        </h2>

        <div className="flex flex-col mt-12">
          {timelineSteps.map((step, i) => (
            <div key={step.label} className="flex gap-5">
              <div className="flex flex-col items-center">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-inter font-bold shrink-0"
                  style={{
                    fontSize: '0.85rem',
                    background: 'linear-gradient(135deg, #1B3F7A, #2C68C4)',
                  }}
                >
                  {i + 1}
                </div>
                {i < timelineSteps.length - 1 && (
                  <div className="w-0.5 flex-1 bg-medium-blue mt-2 mb-2" style={{ minHeight: 32 }} />
                )}
              </div>
              <div className="pb-8">
                <h3 className="font-inter font-semibold text-dark-text" style={{ fontSize: '1rem' }}>
                  {step.label}
                </h3>
                <p className="font-inter font-normal text-secondary-text mt-1" style={{ fontSize: '0.9rem' }}>
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div
          className="bg-white border border-medium-blue rounded-xl p-5 mt-4"
        >
          <p className="font-inter font-medium text-navy" style={{ fontSize: '0.9rem' }}>
            The delivery window starts when you submit the questionnaire — not when you pay. Documents are typically delivered within 5 business days; website copy and social media posts within 3–5 business days.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ─── 6. Trust & Reassurance ─── */

const trustItems = [
  {
    icon: '🇬🇧',
    title: 'UK-specific, not US-centric',
    desc: 'Every document references UK law, UK regulators, and UK statutory frameworks.',
  },
  {
    icon: '👤',
    title: 'Reviewed by a human before delivery',
    desc: 'No document leaves our system without a consistency and compliance check.',
  },
  {
    icon: '📄',
    title: 'Editable formats included',
    desc: 'PDF for sending. Word for updating. You own both versions.',
  },
];

function TrustStrip() {
  return (
    <section className="bg-white py-16 px-6">
      <div className="mx-auto" style={{ maxWidth: 960 }}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {trustItems.map((item) => (
            <div key={item.title} className="text-center px-4">
              <div style={{ fontSize: '2rem', lineHeight: 1 }}>{item.icon}</div>
              <h3 className="font-inter font-semibold text-dark-text mt-4" style={{ fontSize: '1rem' }}>
                {item.title}
              </h3>
              <p className="font-inter font-normal text-secondary-text mt-2 leading-[1.6]" style={{ fontSize: '0.875rem' }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
        <p
          className="font-inter font-normal text-center mt-10"
          style={{ fontSize: '0.8rem', color: '#A0AEC0' }}
        >
          Documents are drafted for general guidance and professional use. They do not constitute legal advice.
        </p>
      </div>
    </section>
  );
}

/* ─── 7. Process FAQ ─── */

const faqs = [
  {
    q: 'Can I pause and come back to the questionnaire?',
    a: 'Yes. Once you pay, you receive a unique link to your questionnaire by email. That link is yours to use whenever you are ready — there is no deadline to submit. The delivery clock starts when you submit the questionnaire, not when you pay.',
  },
  {
    q: "What if I'm not sure how to answer a question?",
    a: "The questionnaire includes guidance notes for every section. If you're still unsure, you can leave a note in the free-text field and we'll use reasonable defaults based on your industry and business type. You can also email us before purchasing if you want to discuss whether the service is right for you.",
  },
  {
    q: 'What if my business is unusual?',
    a: "The questionnaire is designed to capture the specifics of your business, not force you into a standard mould. If your services or structure don't fit a typical category, the free-text fields let you describe things in your own words. We work from what you tell us — not from assumptions.",
  },
  {
    q: 'Can I request small tweaks after delivery?',
    a: "Every document is delivered in an editable Word format so you can make changes yourself immediately. If you spot something that doesn't reflect your business accurately, email us within 7 days and we'll make reasonable corrections at no extra charge.",
  },
  {
    q: 'How does the Website Copy Starter Pack work?',
    a: "After purchasing, you answer questions about your brand voice, services, and page priorities in the intake form. We then build a complete, styled website for each page you've selected — Homepage, About, Services, Contact, and more. You receive the fully built website as source files (ZIP) for deployment, plus a hosted preview URL to review it before going live.",
  },
  {
    q: 'How does the Social Media Starter Pack work?',
    a: "During the intake form, you tell us which platforms you use, your audience, and your preferred tone. We write a mix of educational, promotional, and trust-building posts with captions and hashtags tailored to each platform. You choose how many posts you need (5–30) during checkout.",
  },
  {
    q: 'Can I buy just website copy or social media posts without the document pack?',
    a: "Yes. All three services — Business Foundations Pack, Website Copy Starter Pack, and Social Media Starter Pack — can be purchased on their own or bundled together. Bundling gives you 10% off two services or 15% off three or more.",
  },
];

function FAQItem({ item, isOpen, onToggle }: { item: typeof faqs[number]; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-border py-5">
      <button
        className="flex items-center justify-between w-full text-left gap-4"
        onClick={onToggle}
      >
        <span className="font-inter font-semibold text-dark-text" style={{ fontSize: '1rem' }}>
          {item.q}
        </span>
        <ChevronDown
          size={20}
          className="text-secondary-text shrink-0 transition-transform duration-200"
          style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </button>
      <div
        className="overflow-hidden transition-all duration-300"
        style={{ maxHeight: isOpen ? 400 : 0 }}
      >
        <p
          className="font-inter font-normal text-secondary-text pt-3 leading-[1.7]"
          style={{ fontSize: '0.95rem' }}
        >
          {item.a}
        </p>
      </div>
    </div>
  );
}

function ProcessFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="bg-off-white py-20 px-6">
      <div className="mx-auto" style={{ maxWidth: 760 }}>
        <SectionLabel>COMMON QUESTIONS</SectionLabel>
        <h2
          className="font-inter font-bold text-dark-text"
          style={{ fontSize: 'clamp(1.6rem, 2.8vw, 2.2rem)' }}
        >
          Questions about the process
        </h2>

        <div className="mt-10">
          {faqs.map((faq, i) => (
            <FAQItem
              key={i}
              item={faq}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── 8. Final CTA ─── */

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
          style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)' }}
        >
          Ready to get your business foundations sorted?
        </h2>
        <p
          className="font-inter font-normal mt-4 leading-[1.7]"
          style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.85)' }}
        >
          One questionnaire. Everything you need — documents, website copy, and social media posts — delivered within 3-5 business days.
        </p>
        <Link
          href="/services"
          className="inline-block font-inter font-bold text-navy bg-white rounded-lg hover:bg-[rgba(255,255,255,0.92)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.2)] transition-all duration-200 mt-10"
          style={{ padding: '18px 40px', fontSize: '1rem', minHeight: 48 }}
        >
          See all services
        </Link>
        <div className="mt-5">
          <Link
            href="/pricing"
            className="font-inter font-medium hover:underline"
            style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)' }}
          >
            View pricing →
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ─── Main Page ─── */

export default function HowItWorksPage() {
  return (
    <>
      <PageHeader />
      <SimpleOverview />
      <DetailedBreakdown />
      <WhatThisIs />
      <Timeline />
      <TrustStrip />
      <ProcessFAQ />
      <FinalCTA />
    </>
  );
}
