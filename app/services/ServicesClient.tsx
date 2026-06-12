'use client';

import Link from 'next/link';
import { ArrowRight, Check, ShoppingCart, Package } from 'lucide-react';

/* ─── data ─── */

const services = [
  {
    id: 'business_foundations_pack',
    title: 'Business Foundations Pack',
    tagline: '10 bespoke business documents for UK sole traders',
    price: '£79',
    priceLabel: 'one-time',
    keyItems: [
      'Client Contract',
      'T&Cs',
      'GDPR Policy',
      'Bio',
      'Invoice',
      'Welcome Emails',
      'Late Payment Letters',
    ],
    learnMoreHref: '/whats-included',
    learnMoreLabel: 'Learn more',
    checkoutHref: '/checkout?services=business_foundations_pack',
    checkoutLabel: 'Get this pack',
  },
  {
    id: 'website_copy_pack',
    title: 'Website Copy Starter Pack',
    tagline: 'Professional website copy written in your voice',
    price: 'From £35/page',
    priceLabel: 'per page',
    keyItems: [
      'Homepage',
      'About',
      'Services',
      'Contact pages',
      'SEO-aware',
      'Bolt.new prompt included',
    ],
    learnMoreHref: '/services/website-copy',
    learnMoreLabel: 'Learn more',
    checkoutHref: '/checkout?services=website_copy_pack',
    checkoutLabel: 'Get website copy',
  },
  {
    id: 'social_media_pack',
    title: 'Social Media Starter Pack',
    tagline: 'Done-for-you social posts in your voice',
    price: 'From £20',
    priceLabel: 'for 5 posts',
    keyItems: [
      'Educational, promotional, trust-building posts',
      'Captions & hashtags',
      'Platform-specific',
    ],
    learnMoreHref: '/services/social-media',
    learnMoreLabel: 'Learn more',
    checkoutHref: '/checkout?services=social_media_pack',
    checkoutLabel: 'Get social posts',
  },
  {
    id: 'quarterly_refresh',
    title: 'Quarterly Document Refresh',
    tagline: 'Keep your foundations current as your business evolves',
    price: '£29',
    priceLabel: 'every 4 months',
    keyItems: [
      'One document update per quarter',
      'Pricing changes',
      'New services',
      'GDPR updates',
    ],
    note: 'Requires the Business Foundations Pack',
    learnMoreHref: '/services/quarterly-refresh',
    learnMoreLabel: 'Learn more',
    checkoutHref: '/checkout?services=quarterly_refresh',
    checkoutLabel: 'Add refresh',
  },
];

/* ─── sub-components ─── */

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

function HeroSection() {
  return (
    <section
      className="text-center px-6"
      style={{
        padding: '80px 24px 64px',
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
            marginTop: '48px',
          }}
        >
          OUR SERVICES
        </span>
        <h1
          className="font-inter font-extrabold text-white mt-3"
          style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', lineHeight: 1.2 }}
        >
          Four services. One platform. Your business foundations.
        </h1>
        <p
          className="font-inter font-normal mx-auto mt-4 leading-[1.7]"
          style={{
            fontSize: '1.05rem',
            color: 'rgba(255,255,255,0.85)',
            maxWidth: 650,
          }}
        >
          Every service is sold separately. Buy what you need, bundle for savings, or start with the flagship Business Foundations Pack.
        </p>
      </div>
    </section>
  );
}

interface ServiceCardProps {
  service: (typeof services)[number];
}

function ServiceCard({ service }: ServiceCardProps) {
  const isFlagship = service.id === 'business_foundations_pack';

  return (
    <div
      className={`rounded-2xl p-8 flex flex-col relative overflow-hidden transition-all duration-200 ${
        isFlagship
          ? 'border-2 border-navy bg-white shadow-[0_16px_64px_rgba(27,63,122,0.12)]'
          : 'border border-border bg-white hover:border-medium-blue hover:shadow-[0_8px_32px_rgba(27,63,122,0.08)]'
      }`}
    >
      {/* Flagship badge */}
      {isFlagship && (
        <span
          className="absolute top-0 left-1/2 -translate-x-1/2 text-white font-inter font-semibold rounded-b-xl"
          style={{
            background: 'linear-gradient(135deg, #1B3F7A, #2C68C4)',
            padding: '6px 20px',
            fontSize: '0.7rem',
            letterSpacing: '0.1em',
          }}
        >
          FLAGSHIP PACK
        </span>
      )}

      {/* Price badge */}
      <div
        className={`inline-block rounded-full font-inter font-bold self-start ${
          isFlagship
            ? 'bg-off-white border border-navy text-navy'
            : 'bg-off-white border border-medium-blue text-navy'
        }`}
        style={{ padding: '6px 16px', fontSize: '0.85rem', marginTop: isFlagship ? '28px' : '0' }}
      >
        {service.price}
        {service.priceLabel && (
          <span className="font-normal ml-1 text-secondary-text">{service.priceLabel}</span>
        )}
      </div>

      {/* Title and tagline */}
      <h3 className="font-inter font-bold text-dark-text mt-4" style={{ fontSize: '1.2rem' }}>
        {service.title}
      </h3>
      <p
        className="font-inter font-normal text-secondary-text mt-2 leading-[1.65]"
        style={{ fontSize: '0.95rem' }}
      >
        {service.tagline}
      </p>

      {/* Key items list */}
      <div className="flex flex-col gap-2.5 mt-6">
        {service.keyItems.map((item, i) => (
          <div key={i} className="flex items-start gap-2.5">
            <span className={`font-bold shrink-0 ${isFlagship ? 'text-navy' : 'text-medium-blue'}`}>
              ✓
            </span>
            <span className="font-inter font-medium text-dark-text" style={{ fontSize: '0.875rem' }}>
              {item}
            </span>
          </div>
        ))}
      </div>

      {/* Note if applicable */}
      {service.note && (
        <div className="mt-5 pt-5 border-t border-border">
          <p className="font-inter font-normal text-secondary-text" style={{ fontSize: '0.8rem' }}>
            {service.note}
          </p>
        </div>
      )}

      {/* CTA buttons */}
      <div className="flex flex-col gap-3 mt-8 mt-auto">
        <Link
          href={service.checkoutHref}
          className={`w-full text-center font-inter font-bold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${
            isFlagship
              ? 'text-white bg-navy hover:bg-medium-blue hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(27,63,122,0.3)]'
              : 'text-white bg-navy hover:bg-medium-blue transition-colors'
          }`}
          style={{ padding: '14px 20px', fontSize: '0.95rem', minHeight: 44 }}
        >
          <ShoppingCart size={16} />
          {service.checkoutLabel}
        </Link>
        <Link
          href={service.learnMoreHref}
          className={`w-full text-center font-inter font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${
            isFlagship
              ? 'text-navy bg-off-white border border-navy hover:bg-white hover:shadow-[0_4px_16px_rgba(27,63,122,0.1)]'
              : 'text-navy bg-off-white border border-medium-blue hover:bg-white hover:shadow-[0_4px_16px_rgba(27,63,122,0.08)]'
          }`}
          style={{ padding: '12px 20px', fontSize: '0.9rem', minHeight: 44 }}
        >
          {service.learnMoreLabel}
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}

function ServicesGridSection() {
  return (
    <section className="bg-white py-20 px-6">
      <div className="mx-auto" style={{ maxWidth: 1200 }}>
        <SectionLabel>THE SERVICES</SectionLabel>
        <h2
          className="font-inter font-bold text-dark-text"
          style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)' }}
        >
          Everything you need to launch and run your business
        </h2>
        <p
          className="font-inter font-normal text-secondary-text mt-3 leading-[1.7]"
          style={{ fontSize: '1rem', maxWidth: 620 }}
        >
          Each service stands alone. Combine them for bigger savings.
        </p>

        {/* 2x2 grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
}

function BundleSavingsSection() {
  return (
    <section className="bg-success py-16 px-6">
      <div className="mx-auto" style={{ maxWidth: 960 }}>
        <div className="text-center">
          <h3
            className="font-inter font-bold text-white"
            style={{ fontSize: 'clamp(1.4rem, 2.8vw, 1.8rem)' }}
          >
            Buy smart. Save more.
          </h3>
          <p
            className="font-inter font-normal text-white mt-3 leading-[1.7]"
            style={{ fontSize: '1rem', maxWidth: 600, margin: '12px auto 0' }}
          >
            Buy two services? Save 10%. Buy three or more? Save 15%. Applied automatically at checkout.
          </p>

          {/* Example */}
          <div
            className="mt-6 bg-white bg-opacity-20 rounded-lg p-5"
            style={{ maxWidth: 500, margin: '0 auto' }}
          >
            <p className="font-inter font-normal text-white" style={{ fontSize: '0.95rem' }}>
              <span className="font-semibold">Example:</span> Documents (£79) + Website Copy (5 pages, £139) = £218 — save £21.80 with 10% off
            </p>
          </div>

          {/* CTA */}
          <Link
            href="/checkout"
            className="inline-block font-inter font-bold text-navy bg-white rounded-lg hover:bg-[rgba(255,255,255,0.92)] transition-all duration-200 mt-8"
            style={{ padding: '14px 32px', fontSize: '0.95rem', minHeight: 44 }}
          >
            Build my bundle
          </Link>
        </div>
      </div>
    </section>
  );
}

function UnsureSection() {
  return (
    <section className="bg-off-white py-16 px-6">
      <div className="mx-auto" style={{ maxWidth: 640 }}>
        <div className="text-center">
          <SectionLabel>NEED HELP?</SectionLabel>
          <h2
            className="font-inter font-bold text-dark-text"
            style={{ fontSize: 'clamp(1.4rem, 2.5vw, 1.8rem)' }}
          >
            Not sure which service?
          </h2>
          <p
            className="font-inter font-normal text-secondary-text mt-4 leading-[1.7]"
            style={{ fontSize: '1rem' }}
          >
            Email us and we'll help you figure out exactly what you need — no sales pressure.
          </p>
          <Link
            href="/contact"
            className="inline-block font-inter font-bold text-white bg-navy rounded-lg hover:bg-medium-blue transition-colors duration-200 mt-6"
            style={{ padding: '14px 32px', fontSize: '0.95rem', minHeight: 44 }}
          >
            Get in touch
          </Link>
        </div>
      </div>
    </section>
  );
}

function FinalCTABanner() {
  return (
    <section
      className="text-center px-6"
      style={{
        padding: '80px 24px',
        background: 'linear-gradient(135deg, #1B3F7A 0%, #2C68C4 100%)',
      }}
    >
      <div className="mx-auto" style={{ maxWidth: 700 }}>
        <h2
          className="font-inter font-bold text-white"
          style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)' }}
        >
          Ready to get started?
        </h2>
        <p
          className="font-inter font-normal mt-4 leading-[1.7]"
          style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.85)' }}
        >
          Build your foundation today. Choose one service or combine multiple services for even greater value.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
          <Link
            href="/checkout?services=business_foundations_pack"
            className="font-inter font-bold text-navy bg-white rounded-lg hover:bg-[rgba(255,255,255,0.92)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.2)] transition-all duration-200 flex items-center gap-2"
            style={{ padding: '16px 36px', fontSize: '1rem', minHeight: 48 }}
          >
            <ShoppingCart size={18} />
            Start with Documents
          </Link>
          <Link
            href="/checkout"
            className="font-inter font-semibold text-white border-2 border-white rounded-lg hover:bg-white hover:text-navy transition-all duration-200 flex items-center gap-2"
            style={{ padding: '14px 32px', fontSize: '0.95rem', minHeight: 48 }}
          >
            <Package size={18} />
            Build a Bundle
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ─── Main Component ─── */

export default function ServicesClient() {
  return (
    <>
      <HeroSection />
      <ServicesGridSection />
      <BundleSavingsSection />
      <UnsureSection />
      <FinalCTABanner />
    </>
  );
}
