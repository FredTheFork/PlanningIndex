'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Check, ArrowRight, Package, Clock, Shield } from 'lucide-react';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { DarkCTABanner } from '@/components/ui/DarkCTABanner';
import { documentsList, documentsFaqs, documentsFeatures, documentsBundles } from '@/lib/content';

function Hero() {
  return (
    <section
      className="relative text-center px-6"
      style={{ paddingTop: 0, paddingBottom: '72px', minHeight: '420px' }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          backgroundImage: 'url(/images/hero/documents-hero.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          zIndex: 0,
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, rgba(15,30,61,0.80) 0%, rgba(27,63,122,0.75) 100%)',
          zIndex: 1,
        }}
      />
      <div className="mx-auto relative" style={{ maxWidth: 800, zIndex: 2 }}>
        <div style={{ paddingTop: 'clamp(100px, 13vw, 128px)' }}>
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
      </div>
    </section>
  );
}

function WhatsIncludedGrid() {
  return (
    <section className="bg-off-white py-24 px-6">
      <div className="mx-auto" style={{ maxWidth: 1000 }}>
        <SectionLabel>WHAT&apos;S INCLUDED</SectionLabel>
        <h2
          className="font-inter font-bold text-dark-text mb-12"
          style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)' }}
        >
          10 documents, each one essential
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {documentsList.map((doc) => (
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
                  {documentsFeatures[0].title}
                </h3>
                <p className="font-inter font-normal text-secondary-text mt-2 leading-[1.6]" style={{ fontSize: '0.9rem' }}>
                  {documentsFeatures[0].desc}
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <Clock size={24} className="text-medium-blue shrink-0 mt-0.5" />
              <div>
                <h3 className="font-inter font-semibold text-dark-text" style={{ fontSize: '1rem' }}>
                  {documentsFeatures[1].title}
                </h3>
                <p className="font-inter font-normal text-secondary-text mt-2 leading-[1.6]" style={{ fontSize: '0.9rem' }}>
                  {documentsFeatures[1].desc}
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <Shield size={24} className="text-medium-blue shrink-0 mt-0.5" />
              <div>
                <h3 className="font-inter font-semibold text-dark-text" style={{ fontSize: '1rem' }}>
                  {documentsFeatures[2].title}
                </h3>
                <p className="font-inter font-normal text-secondary-text mt-2 leading-[1.6]" style={{ fontSize: '0.9rem' }}>
                  {documentsFeatures[2].desc}
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
          style={{ boxShadow: '0 16px 64px rgba(27,63,122,0.12)' }}
        >
          <span
            className="inline-block font-inter font-semibold text-medium-blue uppercase mb-4"
            style={{ fontSize: '0.75rem', letterSpacing: '0.15em' }}
          >
            ONE-TIME PAYMENT
          </span>

          <div>
            <span className="font-inter font-extrabold text-navy block" style={{ fontSize: '3.5rem', lineHeight: 1 }}>
              £79
            </span>
            <span className="font-inter font-normal text-secondary-text block mt-2" style={{ fontSize: '1rem' }}>
              Includes all 10 documents
            </span>
          </div>

          <div className="border-t border-border my-8" />

          <div className="flex flex-col gap-3 mb-8">
            {documentsList.map((doc) => (
              <div key={doc.num} className="flex items-start gap-3">
                <span className="text-success font-bold shrink-0">✓</span>
                <span className="font-inter font-medium text-dark-text text-left" style={{ fontSize: '0.9rem' }}>
                  {doc.title}
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
          {documentsBundles.map((bundle) => (
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

function FAQSection() {
  return (
    <section className="bg-off-white py-24 px-6">
      <div className="mx-auto" style={{ maxWidth: 800 }}>
        <SectionLabel>FAQ</SectionLabel>
        <h2
          className="font-inter font-bold text-dark-text"
          style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)' }}
        >
          Common questions
        </h2>
        <div className="flex flex-col gap-5 mt-10">
          {documentsFaqs.map((faq, i) => (
            <div key={i} className="bg-white rounded-xl border border-border p-6">
              <h3 className="font-inter font-semibold text-dark-text mb-2" style={{ fontSize: '1rem' }}>
                {faq.q}
              </h3>
              <p className="font-inter font-normal text-secondary-text leading-[1.7]" style={{ fontSize: '0.925rem' }}>
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Disclaimer() {
  return (
    <section className="bg-white py-12 px-6">
      <div className="mx-auto text-center" style={{ maxWidth: 680 }}>
        <p
          className="font-inter font-medium text-secondary-text leading-[1.7]"
          style={{ fontSize: '0.875rem' }}
        >
          Foundationary provides professionally drafted business documents, not legal advice. Our documents are UK-specific and reviewed for accuracy, but they are not a substitute for legal counsel. If you have questions about your legal obligations, consult a qualified solicitor.
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
      <FAQSection />
      <Disclaimer />
      <DarkCTABanner
        title="All ten documents. Your business. 24 hours."
        subtitle="One questionnaire. One payment. Everything set up properly."
        ctaLabel="Get My Business Foundations Pack — £79"
        ctaHref="/checkout?services=business_foundations_pack"
        note="Includes all 10 documents · PDF + editable Word formats · Delivered within 24 hours"
      />
    </>
  );
}
