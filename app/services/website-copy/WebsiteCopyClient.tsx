'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Check, ArrowRight, Globe, Sparkles } from 'lucide-react';

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
          Professional website. Built for you. Ready to deploy. Delivered in 3-5 days.
        </h1>
        <p
          className="font-inter font-normal mx-auto mt-4 leading-[1.7]"
          style={{
            fontSize: '1.05rem',
            color: 'rgba(255,255,255,0.85)',
            maxWidth: 600,
          }}
        >
          A fully built website created in your voice, aligned with your services, and delivered as source files plus a hosted preview.
        </p>
        <Link
          href="/checkout?services=website_copy_pack"
          className="inline-block font-inter font-bold text-navy bg-white rounded-lg hover:bg-[rgba(255,255,255,0.92)] transition-colors duration-200 mt-9"
          style={{ padding: '16px 36px', fontSize: '1rem', minHeight: 48 }}
        >
          Get Your Website — From £35
        </Link>
      </div>
    </section>
  );
}

function WhatsIncludedSection() {
  const pageTypes = [
    'Homepage — compelling hero, benefits section, clear call to action',
    'About page — your story, your credibility, why clients should hire you',
    'Services page — aligned with your service sheets, outcomes, process',
    'Contact page — clear contact options, contact form, response time expectation',
    'FAQ / Blog / Pricing / Testimonials pages — as needed for your business',
    'Fully built website — not just copy, a complete ready-to-deploy site',
    'Source files (ZIP) + hosted preview URL to review before going live',
  ];

  return (
    <section className="bg-off-white py-24 px-6">
      <div className="mx-auto" style={{ maxWidth: 960 }}>
        <SectionLabel>WHAT'S INCLUDED</SectionLabel>
        <h2
          className="font-inter font-bold text-dark-text mb-12"
          style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)' }}
        >
          Professional page-by-page website
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {pageTypes.map((page, i) => (
            <div key={i} className="flex gap-4">
              <Check size={20} className="text-success shrink-0 mt-0.5" />
              <div>
                <p className="font-inter font-normal text-dark-text" style={{ fontSize: '0.95rem' }}>
                  {page}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-border p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <Globe size={24} className="text-medium-blue shrink-0 mt-0.5" />
              <div>
                <h3 className="font-inter font-semibold text-dark-text" style={{ fontSize: '1rem' }}>
                  Fully Built Website
                </h3>
                <p className="font-inter font-normal text-secondary-text mt-2 leading-[1.6]" style={{ fontSize: '0.9rem' }}>
                  You don't just get copy — you get a complete, working website built for you. Download the source files and deploy anywhere, or use the hosted preview to review it first.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <Sparkles size={24} className="text-medium-blue shrink-0 mt-0.5" />
              <div>
                <h3 className="font-inter font-semibold text-dark-text" style={{ fontSize: '1rem' }}>
                  SEO-Aware & Brand-Aligned
                </h3>
                <p className="font-inter font-normal text-secondary-text mt-2 leading-[1.6]" style={{ fontSize: '0.9rem' }}>
                  Every page is built with search intent in mind. Keyword-rich headings, clear structure, and naturally flowing copy that ranks — all in your brand voice.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const steps = [
    {
      num: '01',
      title: 'Questionnaire',
      desc: 'Tell us about your business, your ideal clients, your tone, and what makes you different',
    },
    {
      num: '02',
      title: 'Brand & Voice Capture',
      desc: 'We review your existing materials and interview context to understand your unique angle',
    },
    {
      num: '03',
      title: 'Page-by-Page Writing',
      desc: 'We write each page specifically for its purpose — homepage to convert, about to build trust',
    },
    {
      num: '04',
      title: 'Human Review',
      desc: 'We review every page for consistency, clarity, and alignment with your brand before delivery',
    },
    {
      num: '05',
      title: 'Delivery',
      desc: 'Your fully built website delivered as source files (ZIP) + hosted preview URL to review before deploying',
    },
  ];

  return (
    <section className="bg-white py-24 px-6">
      <div className="mx-auto" style={{ maxWidth: 960 }}>
        <SectionLabel>HOW IT WORKS</SectionLabel>
        <h2
          className="font-inter font-bold text-dark-text mb-12"
          style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)' }}
        >
          From questionnaire to ready-to-deploy website
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {steps.map((step, i) => (
            <div key={step.num} className="flex flex-col">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-white font-inter font-bold mb-4 shrink-0"
                style={{
                  fontSize: '0.9rem',
                  background: 'linear-gradient(135deg, #1B3F7A, #2C68C4)',
                }}
              >
                {step.num}
              </div>
              <h3 className="font-inter font-semibold text-dark-text" style={{ fontSize: '1rem' }}>
                {step.title}
              </h3>
              <p className="font-inter font-normal text-secondary-text mt-2 leading-[1.6]" style={{ fontSize: '0.85rem' }}>
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingTiers() {
  const tiers = [
    { pages: '1 page', price: '£35' },
    { pages: '2 pages', price: '£65' },
    { pages: '3 pages', price: '£90' },
    { pages: '4 pages', price: '£115' },
    { pages: '5 pages', price: '£139' },
    { pages: '6 pages', price: '£160' },
    { pages: '7 pages', price: '£180' },
    { pages: '8 pages', price: '£200' },
    { pages: '9 pages', price: '£218' },
    { pages: '10 pages', price: '£235' },
  ];

  return (
    <section className="bg-off-white py-24 px-6">
      <div className="mx-auto" style={{ maxWidth: 800 }}>
        <SectionLabel>PRICING TIERS</SectionLabel>
        <h2
          className="font-inter font-bold text-dark-text mb-4"
          style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)' }}
        >
          Pick your page count
        </h2>
        <p className="font-inter font-normal text-secondary-text mb-12 leading-[1.7]" style={{ fontSize: '1rem' }}>
          Choose any combination of pages. Most sole traders start with 3–5 pages (Homepage, About, Services, Contact, FAQ).
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {tiers.map((tier) => (
            <Link
              key={tier.pages}
              href={`/checkout?services=website_copy_pack`}
              className="bg-white rounded-lg border border-border p-5 text-center hover:border-medium-blue hover:shadow-[0_4px_12px_rgba(44,104,196,0.1)] transition-all duration-200"
            >
              <div className="font-inter font-semibold text-dark-text" style={{ fontSize: '0.95rem' }}>
                {tier.pages}
              </div>
              <div className="font-inter font-bold text-medium-blue mt-2" style={{ fontSize: '1.25rem' }}>
                {tier.price}
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 bg-white rounded-xl border border-border p-8">
          <h3 className="font-inter font-semibold text-dark-text" style={{ fontSize: '1.05rem' }}>
            What we recommend
          </h3>
          <div className="flex flex-col gap-3 mt-4">
            <div className="flex items-start gap-3">
              <Check size={18} className="text-success shrink-0 mt-0.5" />
              <p className="font-inter font-normal text-secondary-text" style={{ fontSize: '0.9rem' }}>
                <strong>Minimum 3 pages:</strong> Homepage, About, Services — enough to give prospects a sense of your business
              </p>
            </div>
            <div className="flex items-start gap-3">
              <Check size={18} className="text-success shrink-0 mt-0.5" />
              <p className="font-inter font-normal text-secondary-text" style={{ fontSize: '0.9rem' }}>
                <strong>Sweet spot (5 pages):</strong> Add Contact + FAQ for comprehensive site coverage
              </p>
            </div>
            <div className="flex items-start gap-3">
              <Check size={18} className="text-success shrink-0 mt-0.5" />
              <p className="font-inter font-normal text-secondary-text" style={{ fontSize: '0.9rem' }}>
                <strong>Bundle with Documents:</strong> Save 10% when you buy Website Copy + Business Foundations Pack together
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function WhoItIsForSection() {
  const goodFit = [
    'Sole traders building or refreshing a website',
    "People who know they need copy but don't want to write it",
    'Business owners without a copywriter budget (agency rates start at £5k+)',
    'Anyone who wants their website to actually reflect their business',
  ];

  const notFor = [
    'People wanting ongoing website maintenance and updates',
    'Anyone looking for an ongoing managed copywriting service (we deliver one-off websites)',
    'Businesses that want SEO without any involvement — content is 30% of SEO',
  ];

  return (
    <section className="bg-white py-24 px-6">
      <div className="mx-auto" style={{ maxWidth: 960 }}>
        <SectionLabel>IS THIS FOR YOU?</SectionLabel>
        <h2
          className="font-inter font-bold text-dark-text mb-12"
          style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)' }}
        >
          Perfect if you're building or refreshing
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-off-white rounded-xl p-8">
            <h3 className="font-inter font-semibold text-success" style={{ fontSize: '1.05rem' }}>
              This is for you
            </h3>
            <ul className="flex flex-col gap-4 mt-5">
              {goodFit.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check size={18} className="text-success shrink-0 mt-0.5" />
                  <span className="font-inter font-normal text-dark-text" style={{ fontSize: '0.9rem' }}>
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-off-white rounded-xl p-8">
            <h3 className="font-inter font-semibold text-navy" style={{ fontSize: '1.05rem' }}>
              This is not for you
            </h3>
            <ul className="flex flex-col gap-4 mt-5">
              {notFor.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-secondary-text font-normal shrink-0 mt-0.5" style={{ fontSize: '1rem' }}>✕</span>
                  <span className="font-inter font-normal text-dark-text" style={{ fontSize: '0.9rem' }}>
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function BundleSection() {
  const bundles = [
    {
      name: 'Documents + Website Copy',
      description: 'All your business documents plus professional website copy. Save 10%.',
      href: '/checkout?services=business_foundations_pack,website_copy_pack',
    },
    {
      name: 'All Three Services',
      description: 'Documents + Website Copy + Social Media. Best value at 15% off.',
      href: '/checkout?services=business_foundations_pack,website_copy_pack,social_media_pack',
    },
  ];

  return (
    <section className="bg-off-white py-24 px-6">
      <div className="mx-auto" style={{ maxWidth: 960 }}>
        <SectionLabel>BUNDLE SAVINGS</SectionLabel>
        <h2
          className="font-inter font-bold text-dark-text mb-12"
          style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)' }}
        >
          Get more, save more
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <ArrowRight size={16} className="text-medium-blue" />
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
          A website that sounds like you
        </h2>
        <p
          className="font-inter font-normal mt-4 leading-[1.7]"
          style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.85)' }}
        >
          Choose your pages, fill in a questionnaire, and receive a fully built website in 3-5 days.
        </p>
        <Link
          href="/checkout?services=website_copy_pack"
          className="inline-block font-inter font-bold text-navy bg-white rounded-lg hover:bg-[rgba(255,255,255,0.92)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.2)] transition-all duration-200 mt-10"
          style={{ padding: '18px 40px', fontSize: '1rem', minHeight: 48 }}
        >
          Get Your Website — From £35
        </Link>
        <p
          className="font-inter font-normal mt-4"
          style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}
        >
          Fully built website · Source files included · Hosted preview
        </p>
      </div>
    </section>
  );
}

export default function WebsiteCopyClient() {
  return (
    <>
      <Hero />
      <WhatsIncludedSection />
      <HowItWorksSection />
      <PricingTiers />
      <WhoItIsForSection />
      <BundleSection />
      <CTABanner />
    </>
  );
}
