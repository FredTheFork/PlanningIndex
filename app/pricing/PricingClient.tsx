'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { ChevronDown, Check, ShoppingCart, Package, ArrowRight, Zap, ShieldCheck, Clock } from 'lucide-react';
import {
  serviceCatalog,
  getServiceById,
  calculateTotal,
  getBundleSavingsMessage,
  getBundleDiscountPercentage,
  getBundleDiscountLabel,
} from '@/lib/services/service-catalog';
import { buildIntakeForm } from '@/lib/forms/build-intake-form';
import { useAuth } from '@/hooks/useAuth';
import { useClientProfile } from '@/hooks/useClientProfile';
import GuaranteeBadge from '@/components/ui/GuaranteeBadge';

/* ─── shared data ─── */

const documents = [
  { num: '01', title: 'Bespoke Client Contract', desc: 'UK law-compliant service agreement covering scope, payment, IP, termination, and dispute resolution. Specific to your services.' },
  { num: '02', title: 'Terms & Conditions', desc: 'Your complete operating rulebook — payment terms, late payment rights (Late Payment Act 1998), refunds, cancellations.' },
  { num: '03', title: 'GDPR Privacy Policy', desc: 'ICO-compliant and specific to your actual data activities. Not a generic template — built around what you actually collect and why.' },
  { num: '04', title: 'Professional Bio', desc: '150-word website version and 50-word social version, written in your voice, that makes you sound exactly as good as you are.' },
  { num: '05', title: 'Elevator Pitch (3 Versions)', desc: "30-second, 2-minute, and written versions. Never stumble over 'so what do you do?' again." },
  { num: '06', title: 'LinkedIn Profile Script', desc: 'Headline, full About section, and Featured section — keyword-optimised and ready to copy-paste.' },
  { num: '07', title: 'Professional Invoice Template', desc: 'UK-formatted, VAT-ready, with your branding and the correct statutory late payment interest notice.' },
  { num: '08', title: 'New Client Welcome Emails (x3)', desc: "The onboarding sequence that makes every client feel like they've hired a professional firm, not a one-person business." },
  { num: '09', title: 'Late Payment Letters (x3)', desc: 'Friendly reminder → formal demand → Letter Before Action. All legally sound. All ready to send.' },
  { num: '10', title: 'Service Description Sheets', desc: "One-page professional breakdown per service — what's in, what's out, who it's for, what they get." },
];

const packFeatures = [
  'Bespoke Client Contract',
  'Terms & Conditions',
  'GDPR Privacy Policy',
  'Professional Bio',
  'Elevator Pitch (3 Versions)',
  'LinkedIn Profile Script',
  'Professional Invoice Template',
  'New Client Welcome Emails (x3)',
  'Late Payment Letters (x3)',
  'Service Description Sheets',
];

const packExtras = [
  'Delivered within 3-5 business days',
  'PDF + editable Word formats',
  'UK law compliant throughout',
  'Your tone, your business, your name',
];

const comparisonRows = [
  { feature: '10 documents included', foundationary: 'check', solicitor: 'Charged per doc', diy: 'cross', ai: 'cross' },
  { feature: 'Done for you', foundationary: 'check', solicitor: 'check', diy: 'cross', ai: 'cross' },
  { feature: 'UK law compliant', foundationary: 'check', solicitor: 'check', diy: 'partial', ai: 'cross' },
  { feature: 'Specific to your business', foundationary: 'check', solicitor: 'check', diy: 'cross', ai: 'cross' },
  { feature: 'Delivered in 3-5 business days', foundationary: 'check', solicitor: 'Weeks', diy: 'You decide', ai: 'Minutes' },
  { feature: 'Professional bio & pitch', foundationary: 'check', solicitor: 'cross', diy: 'cross', ai: 'cross' },
  { feature: 'LinkedIn profile script', foundationary: 'check', solicitor: 'cross', diy: 'cross', ai: 'cross' },
  { feature: 'Invoice template included', foundationary: 'check', solicitor: 'cross', diy: 'cross', ai: 'cross' },
  { feature: 'Welcome & late payment emails', foundationary: 'check', solicitor: 'cross', diy: 'cross', ai: 'cross' },
  { feature: 'Typical cost', foundationary: '£79', solicitor: '£500–£2,000+', diy: '£30–£80/yr', ai: 'Free*' },
];

const faqs = [
  {
    q: 'Is this really a one-time payment?',
    a: 'Yes. £79 is the total cost for all 10 documents. There is no subscription, no monthly fee, and no further charges unless you choose to add an optional extra. The Quarterly Document Refresh is the only recurring option and it is entirely your choice.',
  },
  {
    q: 'Can I buy services separately without the core pack?',
    a: 'Yes. The Website Copy Starter Pack (£49) and the Social Media Starter Pack (£120) can each be purchased on their own. The Quarterly Document Refresh (£29/4 months) is an add-on that requires you to own at least the Business Foundations Pack first, since it updates documents from that pack.',
  },
  {
    q: 'What if I buy the core pack first and then add another service later?',
    a: 'You can add any service at any time. When you add a second service, the bundle discount (£9 off) is automatically applied at checkout. Your existing intake answers are saved, so the additional questionnaire sections are the only new ones you need to fill in — you won\'t repeat anything.',
  },
  {
    q: 'What does the intake form look like for different combinations?',
    a: 'The intake form is tailored to the services you select. The Business Foundations Pack covers 11 sections (business identity, services, clients, pricing, GDPR, legal, brand, and more). Adding Website Copy adds a website-specific section. Adding Social Media adds a social media section. Sections that overlap between services are shared — you only answer them once.',
  },
  {
    q: 'What if I only need some of the documents?',
    a: "We don't offer individual documents — the pack is the product. The reason is that the documents need to be consistent with each other: your contract and your T&Cs need to use the same payment terms. Your invoice template needs to match your stated late payment policy. Your bio and elevator pitch need to align in tone and positioning. Producing them together is what makes them work properly.",
  },
  {
    q: 'Can I pay and come back to fill in the questionnaire later?',
    a: 'Yes. Once you pay, you receive a unique link to your questionnaire by email. That link is yours to use whenever you are ready — there is no deadline to submit. The delivery clock starts when you submit the questionnaire, not when you pay. Documents are typically delivered within 3-5 business days.',
  },
  {
    q: "Is there a refund if I'm not happy?",
    a: 'Because we begin work on your documents within hours of questionnaire submission, we are not able to offer refunds after the process has begun. If you have any concerns about whether this service is right for your business before purchasing, email us first — we will give you an honest answer.',
  },
  {
    q: 'Do the documents need any editing before I use them?',
    a: 'They are ready to use immediately. We review every document before delivery to check consistency, UK law compliance, and alignment with your stated tone and services. That said, some clients choose to make small personal adjustments — which is why every document is delivered in an editable Word format alongside the polished PDF.',
  },
  {
    q: 'What if my business grows and I need to update things?',
    a: 'The editable Word format makes minor updates straightforward to do yourself. If you want us to handle updates professionally, the Quarterly Document Refresh (£29/quarter) covers one document per quarter — new services, pricing changes, GDPR updates, and anything else that evolves.',
  },
  {
    q: 'How does the bundle discount work?',
    a: 'When you buy 2 services together, you get 10% off automatically. Buy 3 or more and you get 15% off. The discount is applied at checkout — no code needed. If you already own one service and add more later, the discount still applies.',
  },
];

/* ─── tiny sub-components ─── */

function CheckMark() {
  return (
    <span
      className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-success text-white font-bold shrink-0"
      style={{ fontSize: '0.75rem' }}
    >
      ✓
    </span>
  );
}

function CrossMark() {
  return (
    <span
      className="inline-flex items-center justify-center w-6 h-6 rounded-full shrink-0"
      style={{ fontSize: '0.75rem', background: '#F0F4FF', color: '#CBD5E0' }}
    >
      ✕
    </span>
  );
}

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

/* ─── page sections ─── */

function PageHeader() {
  return (
    <section
      className="text-center px-6"
      style={{
        padding: '80px 0 64px',
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
          PRICING
        </span>
        <h1
          className="font-inter font-extrabold text-white mt-3"
          style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', lineHeight: 1.2 }}
        >
          Four services. One platform. Your price.
        </h1>
        <p
          className="font-inter font-normal mx-auto mt-4 leading-[1.7]"
          style={{
            fontSize: '1.05rem',
            color: 'rgba(255,255,255,0.85)',
            maxWidth: 600,
          }}
        >
          Every service is sold separately. Bundle together and save — 10% off two services, 15% off three or more.
        </p>
      </div>
    </section>
  );
}

function CellContent({ value }: { value: string }) {
  if (value === 'check') return <CheckMark />;
  if (value === 'cross') return <CrossMark />;
  if (value === 'partial')
    return (
      <span className="font-inter font-normal italic text-secondary-text" style={{ fontSize: '0.875rem' }}>
        Partial
      </span>
    );
  return (
    <span className="font-inter font-medium text-dark-text" style={{ fontSize: '0.875rem' }}>
      {value}
    </span>
  );
}

function ComparisonSection() {
  const headers = ['What you get', 'Foundationary', 'Solicitor', 'DIY (LegalZoom etc.)', 'Generic AI (ChatGPT)'];

  return (
    <section className="bg-off-white py-24 px-6">
      <div className="mx-auto" style={{ maxWidth: 1100 }}>
        <SectionLabel>HOW WE COMPARE</SectionLabel>
        <h2
          className="font-inter font-bold text-dark-text"
          style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)' }}
        >
          Not the cheapest option. The only one that makes sense.
        </h2>
        <p
          className="font-inter font-normal text-secondary-text mt-3 leading-[1.7]"
          style={{ fontSize: '1rem', maxWidth: 580 }}
        >
          Every alternative either costs dramatically more, requires you to do all the work yourself, or produces something generic that doesn't reflect your actual business.
        </p>

        {/* Desktop table */}
        <div
          className="hidden md:block mt-12 rounded-2xl overflow-hidden border border-border"
          style={{ boxShadow: '0 8px 40px rgba(27,63,122,0.08)' }}
        >
          <table className="w-full">
            <thead>
              <tr className="bg-navy">
                <th
                  className="text-left font-inter font-semibold text-white p-4"
                  style={{ fontSize: '0.85rem', padding: '16px 20px' }}
                >
                  {headers[0]}
                </th>
                <th
                  className="font-inter font-bold text-white text-center"
                  style={{
                    fontSize: '0.9rem',
                    padding: '16px 20px',
                    background: 'rgba(255,255,255,0.15)',
                  }}
                >
                  {headers[1]}
                </th>
                <th
                  className="font-inter font-medium text-center"
                  style={{
                    fontSize: '0.85rem',
                    padding: '16px 20px',
                    color: 'rgba(255,255,255,0.75)',
                  }}
                >
                  {headers[2]}
                </th>
                <th
                  className="font-inter font-medium text-center"
                  style={{
                    fontSize: '0.85rem',
                    padding: '16px 20px',
                    color: 'rgba(255,255,255,0.75)',
                  }}
                >
                  {headers[3]}
                </th>
                <th
                  className="font-inter font-medium text-center"
                  style={{
                    fontSize: '0.85rem',
                    padding: '16px 20px',
                    color: 'rgba(255,255,255,0.75)',
                  }}
                >
                  {headers[4]}
                </th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row, i) => (
                <tr
                  key={row.feature}
                  style={{ background: i % 2 === 0 ? '#FFFFFF' : '#F8FAFF' }}
                >
                  <td
                    className="font-inter font-medium text-dark-text"
                    style={{ fontSize: '0.875rem', padding: '14px 20px', minHeight: 52 }}
                  >
                    {row.feature}
                  </td>
                  <td
                    className="text-center"
                    style={{ padding: '14px 20px', background: i % 2 === 0 ? 'rgba(240,244,255,0.4)' : 'rgba(240,244,255,0.25)' }}
                  >
                    <CellContent value={row.foundationary} />
                  </td>
                  <td className="text-center" style={{ padding: '14px 20px' }}>
                    <CellContent value={row.solicitor} />
                  </td>
                  <td className="text-center" style={{ padding: '14px 20px' }}>
                    <CellContent value={row.diy} />
                  </td>
                  <td className="text-center" style={{ padding: '14px 20px' }}>
                    <CellContent value={row.ai} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile card stack */}
        <div className="md:hidden mt-12 flex flex-col gap-4">
          {comparisonRows.map((row, i) => (
            <div
              key={row.feature}
              className="bg-white rounded-xl border border-border p-5"
              style={{ background: i % 2 === 0 ? '#FFFFFF' : '#F8FAFF' }}
            >
              <div className="font-inter font-semibold text-dark-text mb-3" style={{ fontSize: '0.9rem' }}>
                {row.feature}
              </div>
              <div className="flex flex-col gap-2">
                {['Foundationary', 'Solicitor', 'DIY Tools', 'Generic AI'].map((col, ci) => {
                  const val = [row.foundationary, row.solicitor, row.diy, row.ai][ci];
                  return (
                    <div key={col} className="flex items-center justify-between gap-3">
                      <span className="font-inter font-medium text-secondary-text" style={{ fontSize: '0.8rem' }}>
                        {col}
                      </span>
                      <CellContent value={val} />
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <p
          className="font-inter font-normal italic text-secondary-text mt-4 text-right"
          style={{ fontSize: '0.8rem' }}
        >
          *Generic AI tools like ChatGPT are free to use but produce unstructured, US-oriented, legally incomplete output with no quality assurance and no understanding of UK law.
        </p>
      </div>
    </section>
  );
}

/* ─── 3. Core Pack — Flagship Section ─── */

function CorePackSection({ ownsCore }: { ownsCore: boolean }) {
  if (ownsCore) {
    return (
      <section className="bg-white py-24 px-6">
        <div className="mx-auto" style={{ maxWidth: 960 }}>
          <SectionLabel>THE PACK</SectionLabel>
          <h2
            className="font-inter font-bold text-dark-text"
            style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)' }}
          >
            Business Foundations Pack
          </h2>

          <div className="mt-8 bg-green-50 border-2 border-success rounded-2xl p-8 flex items-start gap-4">
            <Check size={24} className="text-success shrink-0 mt-0.5" />
            <div>
              <h3 className="font-inter font-semibold text-navy" style={{ fontSize: '1.1rem' }}>
                You already own the Business Foundations Pack
              </h3>
              <p className="font-inter font-normal text-secondary-text mt-2 leading-[1.6]" style={{ fontSize: '0.9rem' }}>
                Your 10 bespoke documents have been delivered. Add services below to build on your foundation — bundle discounts still apply.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-24 px-6">
      <div className="mx-auto" style={{ maxWidth: 960 }}>
        <SectionLabel>THE PACK</SectionLabel>
        <h2
          className="font-inter font-bold text-dark-text"
          style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)' }}
        >
          Business Foundations Pack
        </h2>

        <div className="flex flex-col lg:flex-row gap-10 mt-12">
          {/* Left — pricing card */}
          <div className="relative mx-auto lg:mx-0" style={{ maxWidth: 420, width: '100%' }}>
            <div
              className="bg-white border-2 border-navy rounded-[20px] p-10 relative"
              style={{
                boxShadow: '0 16px 64px rgba(27,63,122,0.12)',
                padding: '40px 36px',
              }}
            >
              {/* Badge */}
              <span
                className="absolute left-1/2 -translate-x-1/2 text-white font-inter font-semibold rounded-full"
                style={{
                  top: -14,
                  background: 'linear-gradient(135deg, #1B3F7A, #2C68C4)',
                  padding: '5px 18px',
                  fontSize: '0.7rem',
                  letterSpacing: '0.1em',
                }}
              >
                COMPLETE PACK
              </span>

              <div className="text-center">
                <span
                  className="font-inter font-extrabold text-navy block"
                  style={{ fontSize: '3.5rem', lineHeight: 1 }}
                >
                  £79
                </span>
                <span
                  className="font-inter font-normal text-secondary-text block mt-1"
                  style={{ fontSize: '0.875rem' }}
                >
                  one-time payment
                </span>
              </div>

              <div className="border-t border-border my-6" />

              <div className="flex flex-col gap-3">
                {packFeatures.map((f) => (
                  <div key={f} className="flex items-start gap-3">
                    <span className="text-success font-bold shrink-0">✓</span>
                    <span className="font-inter font-medium text-dark-text" style={{ fontSize: '0.9rem' }}>
                      {f}
                    </span>
                  </div>
                ))}
                {packExtras.map((e) => (
                  <div key={e} className="flex items-start gap-3">
                    <span className="text-success font-bold shrink-0">✓</span>
                    <span className="font-inter font-medium text-dark-text" style={{ fontSize: '0.9rem' }}>
                      {e}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-border my-6" />

              <Link
                href="/checkout?services=business_foundations_pack"
                className="block w-full text-center font-inter font-bold text-white bg-navy rounded-[10px] hover:bg-medium-blue hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(27,63,122,0.3)] transition-all duration-200"
                style={{ padding: '16px', fontSize: '1rem' }}
              >
                Buy Now — £79
              </Link>

              <div className="flex justify-center gap-4 mt-4 flex-wrap">
                {['Secure via Stripe', 'PDF + Word formats', 'UK law compliant'].map((t) => (
                  <span key={t} className="font-inter font-normal text-secondary-text" style={{ fontSize: '0.75rem' }}>
                    {t}
                  </span>
                ))}
              </div>

              <div
                className="bg-off-white rounded-lg text-center font-inter font-normal text-navy mt-5"
                style={{ padding: '14px 16px', fontSize: '0.85rem' }}
              >
                Not sure? Email us before buying — we'll tell you honestly if this pack is the right fit for your business.
              </div>
            </div>
          </div>

          {/* Right — detail breakdown */}
          <div className="flex-1">
            <h3 className="font-inter font-semibold text-dark-text mb-6" style={{ fontSize: '1rem' }}>
              What's in every pack
            </h3>
            <div className="flex flex-col gap-5">
              {documents.map((doc) => (
                <div key={doc.num} className="flex gap-4">
                  <div
                    className="shrink-0 w-7 h-7 rounded-full bg-navy text-white flex items-center justify-center font-inter font-bold"
                    style={{ fontSize: '0.75rem' }}
                  >
                    {doc.num}
                  </div>
                  <div>
                    <div className="font-inter font-semibold text-dark-text" style={{ fontSize: '0.95rem' }}>
                      {doc.title}
                    </div>
                    <p
                      className="font-inter font-normal text-secondary-text mt-1 leading-[1.55]"
                      style={{ fontSize: '0.85rem' }}
                    >
                      {doc.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Link
              href="/whats-included"
              className="inline-block font-inter font-medium text-medium-blue hover:underline mt-6"
              style={{ fontSize: '0.875rem' }}
            >
              Read the full breakdown of every document →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── 4. Standalone Services Section ─── */

const standaloneServices = [
  {
    id: 'website_copy_pack' as const,
    bestFor: 'Building or refreshing a website',
    whoFor: 'Ideal if you\'re building a website and want it to sound credible, clear, and professional.',
  },
  {
    id: 'social_media_pack' as const,
    bestFor: 'Consistent social presence',
    whoFor: 'Best for sole traders who want consistency without starting from a blank page.',
  },
];

function StandaloneServiceCard({
  serviceId,
  bestFor,
  whoFor,
  ownsCore,
  alreadyOwned,
}: {
  serviceId: string;
  bestFor: string;
  whoFor: string;
  ownsCore: boolean;
  alreadyOwned: boolean;
}) {
  const service = getServiceById(serviceId);
  if (!service) return null;

  const bundleDiscountPercentage = ownsCore ? 10 : 0;

  if (alreadyOwned) {
    return (
      <div className="bg-white border-2 border-success rounded-2xl p-8 flex flex-col relative overflow-hidden">
        <div className="absolute top-0 right-0 bg-success text-white font-inter font-semibold px-4 py-1.5 rounded-bl-xl" style={{ fontSize: '0.75rem' }}>
          OWNED
        </div>
        <span
          className="inline-block bg-off-white border border-medium-blue rounded-full font-inter font-bold text-navy self-start"
          style={{ padding: '4px 14px', fontSize: '0.9rem' }}
        >
          {service.priceLabel}
        </span>
        <h3 className="font-inter font-bold text-dark-text mt-4" style={{ fontSize: '1.1rem' }}>
          {service.name}
        </h3>
        <p
          className="font-inter font-normal text-secondary-text mt-2.5 leading-[1.65]"
          style={{ fontSize: '0.9rem' }}
        >
          {service.description}
        </p>
        <div className="flex flex-col gap-2.5 mt-5">
          {service.includes.map((f) => (
            <div key={f} className="flex items-start gap-2.5">
              <span className="text-success font-bold shrink-0">✓</span>
              <span className="font-inter font-medium text-dark-text" style={{ fontSize: '0.875rem' }}>
                {f}
              </span>
            </div>
          ))}
        </div>
        <div className="border-t border-border mt-6 pt-5 mt-auto">
          <div className="flex items-center gap-2">
            <Check size={18} className="text-success" />
            <span className="font-inter font-semibold text-success" style={{ fontSize: '0.9rem' }}>
              You own this service
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-border rounded-2xl p-8 hover:border-medium-blue hover:shadow-[0_8px_32px_rgba(27,63,122,0.08)] transition-all duration-200 flex flex-col">
      <span
        className="inline-block bg-off-white border border-medium-blue rounded-full font-inter font-bold text-navy self-start"
        style={{ padding: '4px 14px', fontSize: '0.9rem' }}
      >
        {service.priceLabel}
      </span>
      <span
        className="inline-block font-inter font-medium text-medium-blue mt-3"
        style={{ fontSize: '0.8rem' }}
      >
        Best for: {bestFor}
      </span>
      <h3 className="font-inter font-bold text-dark-text mt-3" style={{ fontSize: '1.1rem' }}>
        {service.name}
      </h3>
      <p
        className="font-inter font-normal text-secondary-text mt-2.5 leading-[1.65]"
        style={{ fontSize: '0.9rem' }}
      >
        {service.description}
      </p>
      <div className="flex flex-col gap-2.5 mt-5">
        {service.includes.map((f) => (
          <div key={f} className="flex items-start gap-2.5">
            <span className="text-medium-blue font-bold shrink-0">✓</span>
            <span className="font-inter font-medium text-dark-text" style={{ fontSize: '0.875rem' }}>
              {f}
            </span>
          </div>
        ))}
      </div>
      <div className="border-t border-border mt-6 pt-5">
        <p className="font-inter font-normal text-secondary-text leading-[1.6]" style={{ fontSize: '0.85rem' }}>
          {whoFor}
        </p>
      </div>

      {/* Purchase actions */}
      <div className="flex flex-col gap-2.5 mt-6 mt-auto">
        <Link
          href={`/checkout?services=${serviceId}`}
          className="w-full text-center font-inter font-bold text-white bg-navy rounded-lg hover:bg-medium-blue transition-colors duration-200 flex items-center justify-center gap-2"
          style={{ padding: '12px 20px', fontSize: '0.9rem', minHeight: 44 }}
        >
          <ShoppingCart size={16} />
          Buy Now — {service.priceLabel}
        </Link>

        {!ownsCore && (
          <Link
            href={`/checkout?services=business_foundations_pack,${serviceId}`}
            className="w-full text-center font-inter font-semibold text-navy bg-off-white border border-medium-blue rounded-lg hover:bg-white hover:shadow-[0_4px_16px_rgba(27,63,122,0.1)] transition-all duration-200 flex items-center justify-center gap-2"
            style={{ padding: '12px 20px', fontSize: '0.9rem', minHeight: 44 }}
          >
            <Package size={16} />
            Bundle with Foundations Pack — save 10%
          </Link>
        )}
      </div>
    </div>
  );
}

function StandaloneServicesSection({ purchasedServiceIds }: { purchasedServiceIds: string[] }) {
  const ownsCore = purchasedServiceIds.includes('business_foundations_pack');

  return (
    <section className="bg-off-white py-20 px-6">
      <div className="mx-auto" style={{ maxWidth: 960 }}>
        <SectionLabel>ALSO AVAILABLE SEPARATELY</SectionLabel>
        <h2
          className="font-inter font-bold text-dark-text"
          style={{ fontSize: 'clamp(1.6rem, 2.8vw, 2.2rem)' }}
        >
          Standalone services you can buy on their own
        </h2>
        <p
          className="font-inter font-normal text-secondary-text mt-3 leading-[1.7]"
          style={{ fontSize: '1rem', maxWidth: 560 }}
        >
          These work independently. Buy them with or without the core pack — bundle with the Business Foundations Pack and save 10%.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
          {standaloneServices.map((s) => (
            <StandaloneServiceCard
              key={s.id}
              serviceId={s.id}
              bestFor={s.bestFor}
              whoFor={s.whoFor}
              ownsCore={ownsCore}
              alreadyOwned={purchasedServiceIds.includes(s.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── 5. Build Your Bundle — Interactive Section ─── */

function BuildYourBundleSection({ purchasedServiceIds }: { purchasedServiceIds: string[] }) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const ownsCore = purchasedServiceIds.includes('business_foundations_pack');
  const availableServices = serviceCatalog.filter(
    (s) => !purchasedServiceIds.includes(s.id)
  );

  const toggleService = (serviceId: string) => {
    setSelectedIds((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const effectiveIds = ownsCore
    ? [...new Set([...selectedIds, 'business_foundations_pack'])]
    : selectedIds;
  const { subtotal, discountPercentage, discountAmount, total } = calculateTotal(effectiveIds);
  const savingsMessage = getBundleSavingsMessage(subtotal, discountPercentage);
  const isBestValue = effectiveIds.length >= 3 && discountPercentage > 0;

  const intakeSections = selectedIds.length > 0 ? buildIntakeForm(effectiveIds) : [];
  const sectionCount = intakeSections.length;
  const estimatedMinutes = Math.ceil(sectionCount * 2.5);
  const hasSubscription = selectedIds.some(
    (id) => getServiceById(id)?.mode === 'subscription'
  );

  // Pre-select core pack if user doesn't own it and hasn't selected anything
  useEffect(() => {
    if (!ownsCore && selectedIds.length === 0) {
      setSelectedIds(['business_foundations_pack']);
    }
  }, [ownsCore]);

  return (
    <section className="bg-white py-24 px-6">
      <div className="mx-auto" style={{ maxWidth: 960 }}>
        <SectionLabel>BUILD YOUR BUNDLE</SectionLabel>
        <h2
          className="font-inter font-bold text-dark-text"
          style={{ fontSize: 'clamp(1.6rem, 2.8vw, 2.2rem)' }}
        >
          Mix and match — save when you combine
        </h2>
        <p
          className="font-inter font-normal text-secondary-text mt-3 leading-[1.7]"
          style={{ fontSize: '1rem', maxWidth: 560 }}
        >
          Select the services you want. Bundle discounts are applied automatically — no code needed.
        </p>

        <div className="flex flex-col lg:flex-row gap-10 mt-12">
          {/* Service selection */}
          <div className="lg:w-3/5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {availableServices.map((service) => {
                const isSelected = selectedIds.includes(service.id);
                const isCore = service.isCore;
                const serviceDiscountPercent = getBundleDiscountPercentage(effectiveIds.length);

                return (
                  <button
                    key={service.id}
                    onClick={() => toggleService(service.id)}
                    className={`text-left border-2 rounded-xl p-5 transition-all duration-200 ${
                      isSelected
                        ? 'border-medium-blue bg-blue-50'
                        : 'border-border bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-5 h-5 rounded flex items-center justify-center shrink-0 mt-0.5 ${
                          isSelected
                            ? 'bg-medium-blue'
                            : 'border-2 border-gray-300 bg-white'
                        }`}
                      >
                        {isSelected && <Check size={14} className="text-white" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        {isCore && (
                          <span
                            className="inline-block bg-navy text-white font-inter font-semibold rounded-full mb-2"
                            style={{ padding: '2px 10px', fontSize: '0.65rem', letterSpacing: '0.08em' }}
                          >
                            FLAGSHIP
                          </span>
                        )}
                        <h3 className="font-inter font-bold text-dark-text" style={{ fontSize: '0.95rem' }}>
                          {service.name}
                        </h3>
                        <p className="font-inter font-semibold text-navy mt-1">
                          {service.priceLabel}
                        </p>
                        {!isCore && effectiveIds.length >= 2 && serviceDiscountPercent > 0 && (
                          <p className="font-inter font-medium text-green-700 mt-1" style={{ fontSize: '0.8rem' }}>
                            Save {serviceDiscountPercent}% when bundled
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {ownsCore && (
              <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                <Check size={18} className="text-success shrink-0" />
                <p className="font-inter font-medium text-green-800" style={{ fontSize: '0.85rem' }}>
                  Business Foundations Pack included (you already own it)
                </p>
              </div>
            )}
          </div>

          {/* Price summary sidebar */}
          <div className="lg:w-2/5">
            <div className="bg-white border border-border rounded-xl p-8 sticky top-24"
              style={{ boxShadow: '0 8px 32px rgba(27,63,122,0.08)' }}
            >
              <h3 className="font-inter font-bold text-navy" style={{ fontSize: '1.1rem' }}>
                Your selection
              </h3>

              {selectedIds.length === 0 && !ownsCore && (
                <p className="font-inter font-normal text-secondary-text mt-4" style={{ fontSize: '0.9rem' }}>
                  Select a service to see your price.
                </p>
              )}

              {(selectedIds.length > 0 || ownsCore) && (
                <>
                  {savingsMessage && (
                    <div className={`mt-4 rounded-lg p-4 flex items-start gap-3 ${isBestValue ? 'bg-green-50 border border-green-200' : 'bg-blue-50 border border-blue-200'}`}>
                      {isBestValue && (
                        <span className="bg-green-600 text-white text-xs font-inter font-bold px-2 py-1 rounded-full uppercase tracking-wide shrink-0">
                          Best Value
                        </span>
                      )}
                      <p className={`font-inter font-semibold ${isBestValue ? 'text-green-800' : 'text-navy'}`} style={{ fontSize: '0.9rem' }}>
                        {savingsMessage}
                      </p>
                    </div>
                  )}

                  <div className="space-y-2 mb-3 mt-5">
                    {ownsCore && (
                      <div className="flex items-center justify-between">
                        <span className="font-inter text-success flex items-center gap-1.5" style={{ fontSize: '0.9rem' }}>
                          <Check size={14} />
                          Business Foundations Pack
                        </span>
                        <span className="font-inter font-medium text-success" style={{ fontSize: '0.85rem' }}>
                          Owned
                        </span>
                      </div>
                    )}
                    {selectedIds
                      .filter((id) => !(ownsCore && id === 'business_foundations_pack'))
                      .map((serviceId) => {
                        const service = getServiceById(serviceId);
                        if (!service) return null;
                        return (
                          <div key={serviceId} className="flex items-center justify-between">
                            <span className="font-inter text-secondary-text" style={{ fontSize: '0.9rem' }}>
                              {service.name}
                            </span>
                            <span className="font-inter font-semibold text-navy">
                              £{service.price.toFixed(2)}
                            </span>
                          </div>
                        );
                      })}
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex items-center justify-between mb-3 pt-2 border-t border-gray-200">
                      <span className="font-inter font-medium text-green-700" style={{ fontSize: '0.9rem' }}>
                        Bundle discount ({discountPercentage}%)
                      </span>
                      <span className="font-inter font-semibold text-green-700">
                        -£{discountAmount.toFixed(2)}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t border-gray-300">
                    <span className="font-inter font-bold text-navy">Total</span>
                    <span className="font-inter font-bold text-navy text-2xl">
                      £{total.toFixed(2)}
                    </span>
                  </div>

                  {hasSubscription && (
                    <p className="font-inter text-secondary-text text-xs mt-3">
                      One-time charge for services + recurring subscription for Quarterly Refresh.
                    </p>
                  )}

                  {/* Intake preview */}
                  {sectionCount > 0 && (
                    <div className="mt-5 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                      <Zap size={18} className="text-medium-blue shrink-0 mt-0.5" />
                      <div>
                        <p className="font-inter font-semibold text-navy" style={{ fontSize: '0.85rem' }}>
                          Intake covers {sectionCount} sections, approx {estimatedMinutes} min
                        </p>
                        <p className="font-inter text-secondary-text mt-1" style={{ fontSize: '0.75rem' }}>
                          Answer questions tailored to your selection. Save and resume anytime.
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="mt-5 space-y-2">
                    <div className="flex items-center gap-2">
                      <ShieldCheck size={16} className="text-success shrink-0" />
                      <span className="font-inter font-medium text-secondary-text" style={{ fontSize: '0.8rem' }}>
                        Secure checkout via Stripe
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-medium-blue shrink-0" />
                      <span className="font-inter font-medium text-secondary-text" style={{ fontSize: '0.8rem' }}>
                        3-5 business day delivery
                      </span>
                    </div>
                  </div>

                  <Link
                    href={`/checkout?services=${effectiveIds.join(',')}`}
                    className={`w-full mt-6 text-center font-inter font-bold text-white rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${
                      selectedIds.length === 0
                        ? 'bg-gray-300 cursor-not-allowed pointer-events-none'
                        : 'bg-navy hover:bg-medium-blue hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(27,63,122,0.3)]'
                    }`}
                    style={{ padding: '14px 24px', fontSize: '1rem', minHeight: 48 }}
                    onClick={(e) => {
                      if (selectedIds.length === 0) e.preventDefault();
                    }}
                  >
                    {selectedIds.length === 0 ? (
                      'Select a service'
                    ) : (
                      <>
                        <ShoppingCart size={18} />
                        Buy Now — £{total.toFixed(2)}
                      </>
                    )}
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── 6. Quarterly Refresh Section ─── */

function QuarterlyRefreshSection({ purchasedServiceIds }: { purchasedServiceIds: string[] }) {
  const service = getServiceById('quarterly_refresh');
  if (!service) return null;

  const alreadyOwned = purchasedServiceIds.includes('quarterly_refresh');
  const ownsCore = purchasedServiceIds.includes('business_foundations_pack');

  if (alreadyOwned) {
    return (
      <section className="bg-off-white py-16 px-6">
        <div className="mx-auto" style={{ maxWidth: 760 }}>
          <div className="bg-white border-2 border-success rounded-2xl p-8 flex items-start gap-4">
            <Check size={22} className="text-success shrink-0 mt-0.5" />
            <div>
              <h3 className="font-inter font-bold text-dark-text" style={{ fontSize: '1.1rem' }}>
                Quarterly Document Refresh — Active
              </h3>
              <p className="font-inter font-normal text-secondary-text mt-2 leading-[1.6]" style={{ fontSize: '0.9rem' }}>
                Your subscription is active. One document update per quarter, keeping everything current as your business evolves.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-off-white py-16 px-6">
      <div className="mx-auto" style={{ maxWidth: 760 }}>
        <SectionLabel>ONGOING SUPPORT</SectionLabel>
        <h2
          className="font-inter font-bold text-dark-text"
          style={{ fontSize: 'clamp(1.4rem, 2.5vw, 1.8rem)' }}
        >
          Quarterly Document Refresh
        </h2>
        <p
          className="font-inter font-normal text-secondary-text mt-3 leading-[1.7]"
          style={{ fontSize: '1rem', maxWidth: 560 }}
        >
          Keep your documents accurate as your business evolves. One document updated every quarter.
        </p>

        <div className="bg-white border border-border rounded-2xl p-8 mt-8 flex flex-col sm:flex-row gap-8 items-start">
          <div className="flex-1">
            <span
              className="inline-block bg-off-white border border-medium-blue rounded-full font-inter font-bold text-navy"
              style={{ padding: '4px 14px', fontSize: '0.9rem' }}
            >
              {service.priceLabel}
            </span>
            <div className="flex flex-col gap-2.5 mt-5">
              {service.includes.map((f) => (
                <div key={f} className="flex items-start gap-2.5">
                  <span className="text-medium-blue font-bold shrink-0">✓</span>
                  <span className="font-inter font-medium text-dark-text" style={{ fontSize: '0.875rem' }}>
                    {f}
                  </span>
                </div>
              ))}
            </div>
            <p className="font-inter font-normal text-secondary-text mt-4 leading-[1.6]" style={{ fontSize: '0.85rem' }}>
              Optional ongoing service. Cancel anytime.
            </p>
          </div>

          <div className="sm:text-right flex flex-col items-start sm:items-end gap-3">
            {!ownsCore && (
              <p className="font-inter font-medium text-secondary-text" style={{ fontSize: '0.8rem' }}>
                Requires the Business Foundations Pack
              </p>
            )}
            <Link
              href={ownsCore ? `/checkout?services=quarterly_refresh` : `/checkout?services=business_foundations_pack,quarterly_refresh`}
              className="font-inter font-bold text-white bg-navy rounded-lg hover:bg-medium-blue transition-colors duration-200 flex items-center gap-2"
              style={{ padding: '12px 24px', fontSize: '0.9rem', minHeight: 44 }}
            >
              <ShoppingCart size={16} />
              Add to Order
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── 7. FAQ Section ─── */

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
        style={{ maxHeight: isOpen ? 500 : 0 }}
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

function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="bg-white py-20 px-6">
      <div className="mx-auto" style={{ maxWidth: 760 }}>
        <SectionLabel>COMMON QUESTIONS</SectionLabel>
        <h2
          className="font-inter font-bold text-dark-text"
          style={{ fontSize: 'clamp(1.6rem, 2.8vw, 2.2rem)' }}
        >
          Questions about pricing and bundles
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
          Ready to set up your business properly?
        </h2>
        <p
          className="font-inter font-normal mt-4 leading-[1.7]"
          style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.85)' }}
        >
          Start with one service, or build your own bundle — either way, you get content tailored to your business, delivered fast.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
          <Link
            href="/services"
            className="font-inter font-bold text-navy bg-white rounded-lg hover:bg-[rgba(255,255,255,0.92)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.2)] transition-all duration-200 flex items-center gap-2"
            style={{ padding: '18px 40px', fontSize: '1rem', minHeight: 48 }}
          >
            <ShoppingCart size={18} />
            See All Services
          </Link>
          <Link
            href="/checkout?services=business_foundations_pack"
            className="font-inter font-semibold text-white border-2 border-white rounded-lg hover:bg-white hover:text-navy transition-all duration-200 flex items-center gap-2"
            style={{ padding: '16px 32px', fontSize: '0.95rem', minHeight: 48 }}
          >
            <Package size={18} />
            Start with Documents — £79
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ─── Main Page ─── */

export default function PricingPage() {
  const { user, loading: authLoading } = useAuth();
  const { purchasedServiceIds, loading: profileLoading } = useClientProfile();
  const loading = authLoading || profileLoading;

  if (loading) {
    return (
      <>
        <PageHeader />
        <div className="bg-off-white py-24 px-6 flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-navy" />
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader />
      <ComparisonSection />
      <CorePackSection ownsCore={purchasedServiceIds.includes('business_foundations_pack')} />
      <StandaloneServicesSection purchasedServiceIds={purchasedServiceIds} />
      <BuildYourBundleSection purchasedServiceIds={purchasedServiceIds} />
      <QuarterlyRefreshSection purchasedServiceIds={purchasedServiceIds} />
      <FAQSection />
      <FinalCTA />
    </>
  );
}
