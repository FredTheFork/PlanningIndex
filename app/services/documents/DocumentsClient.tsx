'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Check, ArrowRight, Package, Clock, Shield, Zap } from 'lucide-react';

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
        padding: '152px 0 64px',
        background: 'linear-gradient(135deg, #1B3F7A 0%, #2C68C4 100%)',
      }}
    >
      <div className="mx-auto" style={{ maxWidth: 800 }}>
        <h1
          className="font-inter font-extrabold text-white"
          style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', lineHeight: 1.2 }}
        >
          10 bespoke business documents. Built around your business. Delivered fast.
        </h1>
        <p
          className="font-inter font-normal mx-auto mt-4 leading-[1.7]"
          style={{
            fontSize: '1.05rem',
            color: 'rgba(255,255,255,0.85)',
            maxWidth: 600,
          }}
        >
          Everything a UK sole trader needs to operate with confidence. One questionnaire. One payment. Delivered within 24 hours.
        </p>
        <Link
          href="/checkout?services=business_foundations_pack"
          className="inline-block font-inter font-bold text-navy bg-white rounded-lg hover:bg-[rgba(255,255,255,0.92)] transition-colors duration-200 mt-9"
          style={{ padding: '16px 36px', fontSize: '1rem', minHeight: 48 }}
        >
          Get My Pack — £79
        </Link>
      </div>
    </section>
  );
}

function WhatsIncludedGrid() {
  const documents = [
    {
      num: '01',
      title: 'Bespoke Client Contract',
      desc: 'UK law-compliant service agreement covering scope, payment, IP, termination, and dispute resolution',
    },
    {
      num: '02',
      title: 'Terms & Conditions',
      desc: 'Complete operating rulebook with Late Payment Act 1998 provisions, refund policy, payment terms',
    },
    {
      num: '03',
      title: 'GDPR Privacy Policy',
      desc: 'ICO-compliant, specific to your actual data activities',
    },
    {
      num: '04',
      title: 'Professional Bio',
      desc: '150-word website version and 50-word social version',
    },
    {
      num: '05',
      title: 'Elevator Pitch (3 Versions)',
      desc: '30-second, 2-minute, and written versions',
    },
    {
      num: '06',
      title: 'LinkedIn Profile Script',
      desc: 'Optimized headline, About section, Featured section',
    },
    {
      num: '07',
      title: 'Professional Invoice Template',
      desc: 'UK-formatted, VAT-ready, late payment interest notice',
    },
    {
      num: '08',
      title: 'New Client Welcome Emails (x3)',
      desc: 'Structured onboarding sequence',
    },
    {
      num: '09',
      title: 'Late Payment Letters (x3)',
      desc: 'Friendly reminder, formal demand, Letter Before Action',
    },
    {
      num: '10',
      title: 'Service Description Sheets',
      desc: 'One-page breakdown per service',
    },
  ];

  return (
    <section className="bg-off-white py-24 px-6">
      <div className="mx-auto" style={{ maxWidth: 1000 }}>
        <SectionLabel>WHAT'S INCLUDED</SectionLabel>
        <h2
          className="font-inter font-bold text-dark-text mb-12"
          style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)' }}
        >
          10 documents, each one essential
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {documents.map((doc) => (
            <div
              key={doc.num}
              className="bg-white rounded-lg border border-border p-6 hover:border-medium-blue hover:shadow-[0_4px_16px_rgba(44,104,196,0.1)] transition-all duration-200"
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-inter font-bold mb-3 shrink-0"
                style={{
                  fontSize: '0.9rem',
                  background: 'linear-gradient(135deg, #1B3F7A, #2C68C4)',
                }}
              >
                {doc.num}
              </div>
              <h3 className="font-inter font-semibold text-dark-text" style={{ fontSize: '1rem' }}>
                {doc.title}
              </h3>
              <p className="font-inter font-normal text-secondary-text mt-2 leading-[1.6]" style={{ fontSize: '0.9rem' }}>
                {doc.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-white rounded-xl border border-border p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex gap-4">
              <Package size={24} className="text-medium-blue shrink-0 mt-0.5" />
              <div>
                <h3 className="font-inter font-semibold text-dark-text" style={{ fontSize: '1rem' }}>
                  What you receive
                </h3>
                <p className="font-inter font-normal text-secondary-text mt-2 leading-[1.6]" style={{ fontSize: '0.9rem' }}>
                  Every file is delivered as both a polished PDF and editable Word document so you can make updates yourself in future.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <Clock size={24} className="text-medium-blue shrink-0 mt-0.5" />
              <div>
                <h3 className="font-inter font-semibold text-dark-text" style={{ fontSize: '1rem' }}>
                  When you receive it
                </h3>
                <p className="font-inter font-normal text-secondary-text mt-2 leading-[1.6]" style={{ fontSize: '0.9rem' }}>
                  Within 24 hours of submitting your questionnaire. You fill in the form. We do the rest.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <Shield size={24} className="text-medium-blue shrink-0 mt-0.5" />
              <div>
                <h3 className="font-inter font-semibold text-dark-text" style={{ fontSize: '1rem' }}>
                  How it's personalised
                </h3>
                <p className="font-inter font-normal text-secondary-text mt-2 leading-[1.6]" style={{ fontSize: '0.9rem' }}>
                  Every document is generated from your questionnaire answers — your services, your terms, your voice.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PricingCard() {
  return (
    <section className="bg-white py-24 px-6">
      <div className="mx-auto" style={{ maxWidth: 600 }}>
        <div
          className="bg-white border-2 border-navy rounded-[20px] p-10 text-center"
          style={{
            boxShadow: '0 16px 64px rgba(27,63,122,0.12)',
          }}
        >
          <span
            className="inline-block font-inter font-semibold text-medium-blue uppercase mb-4"
            style={{ fontSize: '0.75rem', letterSpacing: '0.15em' }}
          >
            ONE-TIME PAYMENT
          </span>

          <div>
            <span
              className="font-inter font-extrabold text-navy block"
              style={{ fontSize: '3.5rem', lineHeight: 1 }}
            >
              £79
            </span>
            <span
              className="font-inter font-normal text-secondary-text block mt-2"
              style={{ fontSize: '1rem' }}
            >
              Includes all 10 documents
            </span>
          </div>

          <div className="border-t border-border my-8" />

          <div className="flex flex-col gap-3 mb-8">
            {[
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
            ].map((feature) => (
              <div key={feature} className="flex items-start gap-3">
                <span className="text-success font-bold shrink-0">✓</span>
                <span className="font-inter font-medium text-dark-text text-left" style={{ fontSize: '0.9rem' }}>
                  {feature}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-border my-6" />

          <Link
            href="/checkout?services=business_foundations_pack"
            className="block w-full font-inter font-bold text-white bg-navy rounded-lg hover:bg-medium-blue transition-colors duration-200"
            style={{ padding: '16px', fontSize: '1rem' }}
          >
            Get My Pack — £79
          </Link>

          <p className="font-inter font-normal text-secondary-text mt-4" style={{ fontSize: '0.85rem' }}>
            PDF + editable Word formats · Delivered within 24 hours · UK law compliant
          </p>
        </div>
      </div>
    </section>
  );
}

function BundleSection() {
  const bundles = [
    {
      name: 'Documents + Website Copy',
      description: 'Professional documents plus website copy. £79 + £35 = £114, less 10% bundle discount',
      href: '/checkout?services=business_foundations_pack,website_copy_pack',
      savings: '£12 saved',
    },
    {
      name: 'Documents + Social Media',
      description: 'Professional documents plus 5 social posts. £79 + £20 = £99, less 10% bundle discount',
      href: '/checkout?services=business_foundations_pack,social_media_pack',
      savings: '£10 saved',
    },
    {
      name: 'All Three Services',
      description: 'Documents + Website Copy + Social Media. Best value at 15% off.',
      href: '/checkout?services=business_foundations_pack,website_copy_pack,social_media_pack',
      savings: '£29 saved',
    },
  ];

  return (
    <section className="bg-off-white py-24 px-6">
      <div className="mx-auto" style={{ maxWidth: 960 }}>
        <SectionLabel>WORKS EVEN BETTER WITH</SectionLabel>
        <h2
          className="font-inter font-bold text-dark-text mb-12"
          style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)' }}
        >
          Bundle and save up to 15%
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {bundles.map((bundle) => (
            <Link
              key={bundle.name}
              href={bundle.href}
              className="bg-white rounded-xl border border-border p-8 hover:border-medium-blue hover:shadow-[0_8px_32px_rgba(44,104,196,0.12)] transition-all duration-200 flex flex-col"
            >
              <h3 className="font-inter font-semibold text-dark-text" style={{ fontSize: '1.05rem' }}>
                {bundle.name}
              </h3>
              <p className="font-inter font-normal text-secondary-text mt-3 leading-[1.6] flex-1" style={{ fontSize: '0.9rem' }}>
                {bundle.description}
              </p>
              <div className="border-t border-border my-4" />
              <div className="flex items-center justify-between">
                <span className="font-inter font-semibold text-success" style={{ fontSize: '0.9rem' }}>
                  {bundle.savings}
                </span>
                <ArrowRight size={16} className="text-medium-blue" />
              </div>
            </Link>
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
          All ten documents. Your business. 24 hours.
        </h2>
        <p
          className="font-inter font-normal mt-4 leading-[1.7]"
          style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.85)' }}
        >
          One questionnaire. One payment. Everything set up properly.
        </p>
        <Link
          href="/checkout?services=business_foundations_pack"
          className="inline-block font-inter font-bold text-navy bg-white rounded-lg hover:bg-[rgba(255,255,255,0.92)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.2)] transition-all duration-200 mt-10"
          style={{ padding: '18px 40px', fontSize: '1rem', minHeight: 48 }}
        >
          Get My Business Foundations Pack — £79
        </Link>
        <p
          className="font-inter font-normal mt-4"
          style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}
        >
          Includes all 10 documents · PDF + editable Word formats · Delivered within 24 hours
        </p>
      </div>
    </section>
  );
}

export default function DocumentsClient() {
  return (
    <>
      <Hero />
      <WhatsIncludedGrid />
      <PricingCard />
      <BundleSection />
      <CTABanner />
    </>
  );
}
