'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Check, ArrowRight, Clock, RefreshCw, TrendingUp, Zap } from 'lucide-react';

/* ─── Sub-components ─── */

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

function Hero() {
  return (
    <section
      className="text-center px-6"
      style={{
        padding: '80px 0 64px',
        background: 'linear-gradient(135deg, #1B3F7A 0%, #2C68C4 100%)',
      }}
    >
      <div className="mx-auto" style={{ maxWidth: 800 }}>
        <h1
          className="font-inter font-extrabold text-white"
          style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', lineHeight: 1.2 }}
        >
          Your documents, kept current. One update per quarter. Cancel anytime.
        </h1>
        <p
          className="font-inter font-normal mx-auto mt-4 leading-[1.7]"
          style={{
            fontSize: '1.05rem',
            color: 'rgba(255,255,255,0.85)',
            maxWidth: 600,
          }}
        >
          Your business changes. So should your documents. Keep your contracts, pricing, terms, and GDPR policy aligned with reality.
        </p>
        <Link
          href="/checkout?services=business_foundations_pack,quarterly_refresh"
          className="inline-block font-inter font-bold text-navy bg-white rounded-lg hover:bg-[rgba(255,255,255,0.92)] transition-colors duration-200 mt-9"
          style={{ padding: '16px 36px', fontSize: '1rem', minHeight: 48 }}
        >
          Get Started — £29/Quarter
        </Link>
      </div>
    </section>
  );
}

function ProblemSection() {
  const painPoints = [
    {
      icon: TrendingUp,
      title: 'Your prices change',
      desc: 'You raise rates but your contract still quotes the old price. Now what — do you honour the old contract or negotiate?',
    },
    {
      icon: Zap,
      title: 'Your services evolve',
      desc: 'You add a new offering or discontinue an old one, but your contract and T&Cs still describe the old scope.',
    },
    {
      icon: Clock,
      title: 'GDPR rules shift',
      desc: "You adopt a new tool, change how you store data, or update your retention policy. Your privacy policy hasn't changed in two years.",
    },
    {
      icon: RefreshCw,
      title: 'Terms go stale',
      desc: 'Your documents still say 2022 things. Old payment methods. Outdated contact details. References to services you don\'t offer anymore.',
    },
  ];

  return (
    <section className="bg-off-white py-24 px-6">
      <div className="mx-auto" style={{ maxWidth: 960 }}>
        <SectionLabel>THE PROBLEM</SectionLabel>
        <h2
          className="font-inter font-bold text-dark-text mb-12"
          style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)' }}
        >
          Businesses change. Documents shouldn't stay the same.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {painPoints.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="bg-white rounded-lg border border-border p-6 hover:border-medium-blue hover:shadow-[0_4px_16px_rgba(44,104,196,0.1)] transition-all duration-200"
            >
              <Icon size={24} className="text-medium-blue mb-3" />
              <h3 className="font-inter font-semibold text-dark-text" style={{ fontSize: '1.05rem' }}>
                {title}
              </h3>
              <p className="font-inter font-normal text-secondary-text mt-2 leading-[1.6]" style={{ fontSize: '0.9rem' }}>
                {desc}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-white rounded-xl border border-border p-8">
          <p className="font-inter font-normal text-secondary-text leading-[1.8]" style={{ fontSize: '0.95rem' }}>
            Without regular updates, your documents become legal liabilities. A contract that doesn't match your current offering is a dispute waiting to happen. A privacy policy that doesn't reflect your actual data practices exposes you to ICO enforcement. Pricing terms that are 18 months out of date create confusion at the exact moment you're trying to close a client.
          </p>
        </div>
      </div>
    </section>
  );
}

function WhatsIncludedSection() {
  const features = [
    'One document updated per quarter',
    'Pricing changes and rate updates',
    'New services added to your contract and terms',
    'GDPR and data processing updates',
    'Contact details and payment method changes',
    'Service description updates',
    'Delivered within 3-5 business days',
    'Ongoing consistency checks across all documents',
  ];

  return (
    <section className="bg-white py-24 px-6">
      <div className="mx-auto" style={{ maxWidth: 960 }}>
        <SectionLabel>WHAT'S INCLUDED</SectionLabel>
        <h2
          className="font-inter font-bold text-dark-text mb-12"
          style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)' }}
        >
          Quarterly document maintenance
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          {features.map((feature) => (
            <div key={feature} className="flex items-start gap-3">
              <Check size={20} className="text-success shrink-0 mt-0.5" />
              <span className="font-inter font-normal text-dark-text" style={{ fontSize: '0.9rem' }}>
                {feature}
              </span>
            </div>
          ))}
        </div>

        <div className="bg-off-white rounded-xl border border-border p-8">
          <h3 className="font-inter font-semibold text-dark-text" style={{ fontSize: '1.05rem' }}>
            How it works
          </h3>
          <ol className="flex flex-col gap-4 mt-5">
            {[
              'Subscribe to Quarterly Document Refresh',
              'Contact us via email with your update description (e.g., "I\'ve raised my prices" or "I added a new service")',
              'We review your current documents and make the necessary updates',
              'We deliver the updated document within 3-5 days',
              'Your documents stay current, and you stay compliant',
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-3">
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center text-white font-inter font-bold shrink-0"
                  style={{
                    fontSize: '0.8rem',
                    background: 'linear-gradient(135deg, #1B3F7A, #2C68C4)',
                  }}
                >
                  {i + 1}
                </span>
                <span className="font-inter font-normal text-dark-text" style={{ fontSize: '0.9rem' }}>
                  {step}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function RequirementsSection() {
  return (
    <section className="bg-off-white py-24 px-6">
      <div className="mx-auto" style={{ maxWidth: 960 }}>
        <SectionLabel>REQUIREMENTS</SectionLabel>
        <h2
          className="font-inter font-bold text-dark-text mb-12"
          style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)' }}
        >
          You must own the Business Foundations Pack
        </h2>

        <div className="bg-white rounded-xl border-2 border-navy p-8 mb-8">
          <p className="font-inter font-normal text-dark-text leading-[1.7]" style={{ fontSize: '1rem' }}>
            The Quarterly Document Refresh is an add-on service designed to maintain the 10 documents from the Business Foundations Pack. It requires that you own the core pack — we need the original documents to update them.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-border p-8">
            <h3 className="font-inter font-semibold text-success" style={{ fontSize: '1.05rem' }}>
              If you own the Business Foundations Pack
            </h3>
            <p className="font-inter font-normal text-secondary-text mt-4 leading-[1.6]" style={{ fontSize: '0.9rem' }}>
              You can subscribe to Quarterly Document Refresh immediately at £29 every 4 months. Your first update is due one quarter from your subscription date.
            </p>
            <Link
              href="/checkout?services=business_foundations_pack,quarterly_refresh"
              className="inline-block font-inter font-bold text-white bg-navy rounded-lg hover:bg-medium-blue transition-colors duration-200 mt-6"
              style={{ padding: '12px 24px', fontSize: '0.9rem' }}
            >
              Add Quarterly Refresh
            </Link>
          </div>

          <div className="bg-white rounded-xl border border-border p-8">
            <h3 className="font-inter font-semibold text-navy" style={{ fontSize: '1.05rem' }}>
              If you don't own it yet
            </h3>
            <p className="font-inter font-normal text-secondary-text mt-4 leading-[1.6]" style={{ fontSize: '0.9rem' }}>
              Purchase the Business Foundations Pack (£79) first. Once you have your documents, you can add the Quarterly Refresh subscription at any time.
            </p>
            <Link
              href="/checkout?services=business_foundations_pack"
              className="inline-block font-inter font-bold text-white bg-navy rounded-lg hover:bg-medium-blue transition-colors duration-200 mt-6"
              style={{ padding: '12px 24px', fontSize: '0.9rem' }}
            >
              Get Business Foundations Pack
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function PricingSection() {
  return (
    <section className="bg-white py-24 px-6">
      <div className="mx-auto" style={{ maxWidth: 700 }}>
        <div
          className="bg-white border-2 border-navy rounded-[20px] p-10 text-center"
          style={{
            boxShadow: '0 16px 64px rgba(27,63,122,0.12)',
          }}
        >
          <SectionLabel>SUBSCRIPTION</SectionLabel>

          <div>
            <span
              className="font-inter font-extrabold text-navy block"
              style={{ fontSize: '3.5rem', lineHeight: 1 }}
            >
              £29
            </span>
            <span
              className="font-inter font-normal text-secondary-text block mt-2"
              style={{ fontSize: '1rem' }}
            >
              Every 4 months
            </span>
          </div>

          <div className="border-t border-border my-8" />

          <div className="flex flex-col gap-3 mb-8 text-left">
            <div className="flex items-start gap-3">
              <Check size={18} className="text-success shrink-0 mt-0.5" />
              <span className="font-inter font-normal text-dark-text" style={{ fontSize: '0.9rem' }}>
                One document updated per quarter
              </span>
            </div>
            <div className="flex items-start gap-3">
              <Check size={18} className="text-success shrink-0 mt-0.5" />
              <span className="font-inter font-normal text-dark-text" style={{ fontSize: '0.9rem' }}>
                Pricing, services, GDPR, or terms — your choice
              </span>
            </div>
            <div className="flex items-start gap-3">
              <Check size={18} className="text-success shrink-0 mt-0.5" />
              <span className="font-inter font-normal text-dark-text" style={{ fontSize: '0.9rem' }}>
                Delivered within 3-5 business days
              </span>
            </div>
            <div className="flex items-start gap-3">
              <Check size={18} className="text-success shrink-0 mt-0.5" />
              <span className="font-inter font-normal text-dark-text" style={{ fontSize: '0.9rem' }}>
                Cancel anytime via email — no penalty
              </span>
            </div>
          </div>

          <div className="border-t border-border my-6" />

          <Link
            href="/checkout?services=business_foundations_pack,quarterly_refresh"
            className="block w-full font-inter font-bold text-white bg-navy rounded-lg hover:bg-medium-blue transition-colors duration-200"
            style={{ padding: '16px', fontSize: '1rem' }}
          >
            Subscribe Now — £29/Quarter
          </Link>

          <p className="font-inter font-normal text-secondary-text mt-4" style={{ fontSize: '0.85rem' }}>
            Recurring every 4 months · Cancel anytime · Requires Business Foundations Pack
          </p>
        </div>

        <div className="mt-12 bg-off-white rounded-xl p-8 text-center">
          <h3 className="font-inter font-semibold text-dark-text" style={{ fontSize: '1.05rem' }}>
            The Math
          </h3>
          <p className="font-inter font-normal text-secondary-text mt-3 leading-[1.6]" style={{ fontSize: '0.9rem' }}>
            £29 every 4 months = £87 per year. That's significantly less than hiring a lawyer or accountant to review your documents quarterly, and it keeps you compliant without the mental load of tracking updates yourself.
          </p>
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  const faqs = [
    {
      q: 'What if I only need one or two documents updated?',
      a: 'That\'s fine — the refresh is designed around one update per quarter, but you choose which document and which change. Some quarters you might update pricing, another quarter you might add a new service. It\'s flexible.',
    },
    {
      q: 'Can I pause or skip a quarter?',
      a: 'Yes. Email us to pause your subscription. You can resume it anytime. The next update will be due one quarter from when you resume.',
    },
    {
      q: 'What if I cancel the subscription?',
      a: 'No problem. Email us to cancel, and your subscription stops immediately. You keep all the documents you\'ve already received, and there are no cancellation fees or penalties.',
    },
    {
      q: 'Can I update multiple documents in one quarter?',
      a: 'The subscription includes one document per quarter. If you need additional updates beyond that, email us and we can discuss a custom rate.',
    },
    {
      q: 'How quickly are updates delivered?',
      a: 'Within 3-5 business days of you describing the change. We review the current document, implement the update, and send it back as an updated Word file and PDF.',
    },
    {
      q: 'Do you offer this as an annual commitment?',
      a: 'Not required. The subscription is month-to-month in 4-month billing cycles. You\'re never locked in — cancel anytime.',
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="bg-off-white py-24 px-6">
      <div className="mx-auto" style={{ maxWidth: 760 }}>
        <SectionLabel>COMMON QUESTIONS</SectionLabel>
        <h2
          className="font-inter font-bold text-dark-text mb-12"
          style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)' }}
        >
          About the quarterly refresh
        </h2>

        <div className="bg-white rounded-xl border border-border divide-y divide-border">
          {faqs.map((faq, i) => (
            <div key={i} className="p-6">
              <button
                className="flex items-center justify-between w-full text-left gap-4"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <span className="font-inter font-semibold text-dark-text" style={{ fontSize: '1rem' }}>
                  {faq.q}
                </span>
                <span
                  className="text-secondary-text shrink-0 transition-transform duration-200"
                  style={{ transform: openIndex === i ? 'rotate(180deg)' : 'rotate(0deg)' }}
                >
                  ▼
                </span>
              </button>
              {openIndex === i && (
                <p className="font-inter font-normal text-secondary-text pt-4 leading-[1.7]" style={{ fontSize: '0.95rem' }}>
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTABanner() {
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
          Keep your business documents current
        </h2>
        <p
          className="font-inter font-normal mt-4 leading-[1.7]"
          style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.85)' }}
        >
          One update per quarter keeps you compliant, protects your business, and removes the stress of tracking document changes yourself.
        </p>
        <Link
          href="/checkout?services=business_foundations_pack,quarterly_refresh"
          className="inline-block font-inter font-bold text-navy bg-white rounded-lg hover:bg-[rgba(255,255,255,0.92)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.2)] transition-all duration-200 mt-10"
          style={{ padding: '18px 40px', fontSize: '1rem', minHeight: 48 }}
        >
          Subscribe Now — £29/Quarter
        </Link>
        <p
          className="font-inter font-normal mt-4"
          style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}
        >
          Cancel anytime · No long-term contract · Requires Business Foundations Pack
        </p>
      </div>
    </section>
  );
}

export default function QuarterlyRefreshClient() {
  return (
    <>
      <Hero />
      <ProblemSection />
      <WhatsIncludedSection />
      <RequirementsSection />
      <PricingSection />
      <FAQSection />
      <CTABanner />
    </>
  );
}
