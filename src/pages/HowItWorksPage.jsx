import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Clock, UserCheck, FileText } from 'lucide-react';

/* ─── shared ─── */

function SectionLabel({ children }) {
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
          }}
        >
          HOW IT WORKS
        </span>
        <h1
          className="font-inter font-extrabold text-white mt-3"
          style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', lineHeight: 1.2 }}
        >
          From questionnaire to complete business foundations — in 24 hours.
        </h1>
        <p
          className="font-inter font-normal mx-auto mt-4 leading-[1.7]"
          style={{
            fontSize: '1.05rem',
            color: 'rgba(255,255,255,0.85)',
            maxWidth: 560,
          }}
        >
          Foundationary is a done-for-you service. You tell us about your business once. We create, review, and deliver everything you need to operate professionally and protect yourself — without templates, subscriptions, or ongoing complexity.
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
    body: 'After payment, you receive a secure questionnaire link. It takes around 20 minutes and covers your services, pricing, tone of voice, and how your business actually operates.',
    bullets: [
      'Your services, in your own words',
      'How you charge and work with clients',
      'GDPR and data handling details',
      'Preferred tone (formal, friendly, plain-English)',
    ],
  },
  {
    num: '02',
    title: 'We build everything for you',
    body: 'Your answers are used to generate each document individually using structured AI prompts designed specifically for UK sole traders.',
    bullets: [
      'UK-specific legal frameworks embedded',
      'No generic templates',
      'Each document created separately, not auto-filled',
    ],
  },
  {
    num: '03',
    title: 'Reviewed, packaged, and delivered',
    body: 'Every document is reviewed by a human before delivery to ensure consistency, clarity, and compliance.',
    bullets: [
      'Checked for UK law alignment',
      'Consistent terms across all documents',
      'Delivered as PDF + editable Word files',
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
    text: 'Your questionnaire answers give us the context we need to produce documents that actually fit your business — not an abstract version of it.',
    checklist: [
      'Business details & structure',
      'Services and scope boundaries',
      'Pricing and payment terms',
      'Common client issues',
      'Data collection and GDPR requirements',
      'Branding and tone preferences',
    ],
  },
  {
    subheading: '2. Document creation',
    text: 'Each of the 10 documents is generated using a dedicated prompt that combines your answers with UK-specific legal and professional frameworks.',
    explicit: [
      'Documents are not stitched together',
      'Each asset is created intentionally',
      'Legal language is appropriate for sole traders (not corporate boilerplate)',
    ],
  },
  {
    subheading: '3. Human QA & consistency checks',
    text: 'This is the difference between raw AI output and professional work.',
    checklist: [
      'Payment terms match across contract, T&Cs, invoices',
      'Tone is consistent throughout',
      'Obvious legal or structural issues removed',
      'Formatting cleaned and standardised',
    ],
  },
  {
    subheading: '4. Delivery & follow-up',
    text: 'You receive a single organised folder containing everything you need.',
    checklist: [
      'Branded PDFs',
      'Editable Word documents',
      'How-to-use guide',
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
  'One-time purchase',
  'Focused on practical protection and professionalism',
];

const isntItems = [
  'Not a DIY legal tool',
  'Not a generic AI prompt',
  'Not a solicitor retainer',
  'Not a subscription you forget about',
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
  { label: 'Payment', desc: 'You pay £149 once. No subscription.' },
  { label: 'Questionnaire submitted', desc: 'The 24-hour clock starts here.' },
  { label: 'Work begins', desc: 'Your documents are created and reviewed.' },
  { label: 'Delivery within 24 hours', desc: 'Everything lands in your inbox.' },
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
            The 24-hour delivery window starts when you submit the questionnaire — not when you pay.
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
    a: 'Yes. Once you pay, you receive a unique link to your questionnaire by email. That link is yours to use whenever you are ready — there is no deadline to submit. The 24-hour delivery clock starts when you submit the questionnaire, not when you pay.',
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
];

function FAQItem({ item, isOpen, onToggle }) {
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
  const [openIndex, setOpenIndex] = useState(null);

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
          One questionnaire. One payment. Everything you need — delivered within 24 hours.
        </p>
        <Link
          to="/whats-included"
          className="inline-block font-inter font-bold text-navy bg-white rounded-lg hover:bg-[rgba(255,255,255,0.92)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.2)] transition-all duration-200 mt-10"
          style={{ padding: '18px 40px', fontSize: '1rem', minHeight: 48 }}
        >
          See what's included in the pack
        </Link>
        <div className="mt-5">
          <Link
            to="/pricing"
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
