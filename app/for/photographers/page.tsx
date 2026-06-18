'use client';

import Link from 'next/link';
import { Camera, Check, ShoppingCart, Package } from 'lucide-react';
import {
  getServiceById,
  getServiceGroupById,
  getServicesInGroup,
} from '@/lib/services/service-catalog';

const photographerPack = getServiceById('photographer_industry_pack');
const foundationPack = getServiceById('business_foundations_pack');
const photographerBundle = getServiceGroupById('photographer_full_bundle');

const photographerTestimonials = [
  {
    quote: "The quarterly refresh is something I didn't know I needed. I updated my contract once in three years and by then my pricing, working conditions, and cancellation policy had all changed. Now I update one document every quarter. It costs less than a coffee order per month and means I'm never operating on outdated terms.",
    name: 'Emma W.',
    role: 'Photographer, Brighton',
    initials: 'EW',
  },
];

const faqs = [
  {
    q: 'Do these documents cover UK photography law?',
    a: 'Yes. All documents reference UK copyright law, GDPR requirements for image data, and standard UK commercial photography practices. The licensing agreements are written for UK enforcement.',
  },
  {
    q: 'Can I use the model release for minors?',
    a: 'The model release form includes provisions for parental/guardian consent. You can use it for both adult and minor subjects.',
  },
  {
    q: "What's the difference between the Photography Pack and the Business Foundations Pack?",
    a: 'The Business Foundations Pack gives you core business documents (contracts, terms, invoices, welcome emails). The Photography Pack adds industry-specific documents (licensing agreements, model releases, shot lists). Most photographers start with a bundle that includes both.',
  },
  {
    q: 'Can I edit the licensing terms for each client?',
    a: 'Yes. You receive editable Word files. The licensing agreement includes standard usage rights, but you can adjust permitted uses, timeframes, and territorial restrictions per client.',
  },
];

export default function ForPhotographersPage() {
  if (!photographerPack || !foundationPack || !photographerBundle) {
    return null;
  }

  const bundleServices = getServicesInGroup(photographerBundle.id);
  const bundlePrice = bundleServices.reduce((sum, s) => sum + s.price, 0);
  const discountedPrice = bundlePrice * (1 - photographerBundle.discountPercent / 100);

  return (
    <>
      {/* Hero */}
      <section
        className="relative text-center px-6"
        style={{ padding: '80px 0 72px', minHeight: '320px' }}
      >
        {/* Background image */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            backgroundImage: 'url(/images/hero/photographers-hero.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            zIndex: 0,
          }}
        />
        {/* Overlay */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, rgba(15,30,61,0.80) 0%, rgba(27,63,122,0.75) 100%)',
            zIndex: 1,
          }}
        />
        <div className="mx-auto relative" style={{ maxWidth: 800, zIndex: 2 }}>
          <div className="flex items-center justify-center gap-2 mb-4" style={{ paddingTop: '72px' }}>
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.15)' }}
            >
              <Camera size={24} className="text-white" />
            </div>
          </div>
          <span
            className="font-inter font-semibold uppercase block"
            style={{
              fontSize: '0.75rem',
              letterSpacing: '0.15em',
              color: 'rgba(255,255,255,0.7)',
              marginTop: '12px',
            }}
          >
            FOR PHOTOGRAPHERS
          </span>
          <h1
            className="font-inter font-extrabold text-white mt-3"
            style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', lineHeight: 1.2 }}
          >
            Professional documents for UK photographers
          </h1>
          <p
            className="font-inter font-normal mx-auto mt-4 leading-[1.7]"
            style={{
              fontSize: '1.05rem',
              color: 'rgba(255,255,255,0.85)',
              maxWidth: 560,
            }}
          >
            Licensing agreements, model releases, delivery terms, and editing briefs. Built specifically for UK photography businesses.
          </p>
        </div>
      </section>

      {/* What's Included */}
      <section className="bg-white py-20 px-6">
        <div className="mx-auto" style={{ maxWidth: 900 }}>
          <span
            className="font-inter font-semibold text-medium-blue uppercase block mb-3"
            style={{ fontSize: '0.75rem', letterSpacing: '0.15em' }}
          >
            WHAT'S INCLUDED
          </span>
          <h2
            className="font-inter font-bold text-dark-text"
            style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)' }}
          >
            Photographer Industry Pack
          </h2>
          <p
            className="font-inter font-normal text-secondary-text mt-3 leading-[1.7]"
            style={{ fontSize: '1rem', maxWidth: 600 }}
          >
            7 documents designed for how UK photographers actually work. Licensing, releases, and client management all covered.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">
            {photographerPack.includes.map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 bg-off-white rounded-xl p-4"
              >
                <Check size={18} className="text-success shrink-0 mt-0.5" />
                <span className="font-inter font-medium text-dark-text" style={{ fontSize: '0.9rem' }}>
                  {item}
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-baseline gap-2 mt-8">
            <span className="font-inter font-extrabold text-navy" style={{ fontSize: '2rem' }}>
              {photographerPack.priceLabel}
            </span>
          </div>

          <Link
            href={`/checkout?services=${photographerPack.id}`}
            className="inline-flex items-center gap-2 font-inter font-semibold text-white bg-navy rounded-lg hover:bg-medium-blue transition-colors mt-6"
            style={{ padding: '14px 28px', fontSize: '0.95rem' }}
          >
            <ShoppingCart size={18} />
            Get this pack
          </Link>
        </div>
      </section>

      {/* Foundation Cross-sell */}
      <section className="bg-off-white py-16 px-6">
        <div className="mx-auto" style={{ maxWidth: 900 }}>
          <div className="bg-white rounded-2xl border border-border p-8 flex flex-col md:flex-row items-start gap-8">
            <div className="flex-1">
              <span
                className="font-inter font-semibold text-medium-blue uppercase block mb-2"
                style={{ fontSize: '0.7rem', letterSpacing: '0.12em' }}
              >
                YOU'LL ALSO NEED
              </span>
              <h3 className="font-inter font-bold text-dark-text" style={{ fontSize: '1.2rem' }}>
                {foundationPack.name}
              </h3>
              <p
                className="font-inter font-normal text-secondary-text mt-2 leading-[1.6]"
                style={{ fontSize: '0.9rem' }}
              >
                The core business documents every photographer needs: client contracts, terms, invoice templates, and welcome emails.
              </p>
              <div className="mt-4">
                <span className="font-inter font-bold text-navy" style={{ fontSize: '1.1rem' }}>
                  {foundationPack.priceLabel}
                </span>
              </div>
            </div>
            <Link
              href={`/checkout?services=${photographerPack.id},${foundationPack.id}`}
              className="font-inter font-semibold text-navy border-2 border-navy rounded-lg hover:bg-navy hover:text-white transition-colors flex items-center gap-2"
              style={{ padding: '12px 24px', fontSize: '0.9rem' }}
            >
              Add both to checkout
            </Link>
          </div>
        </div>
      </section>

      {/* Bundle Recommendation */}
      <section className="bg-white py-20 px-6">
        <div className="mx-auto" style={{ maxWidth: 900 }}>
          <span
            className="font-inter font-semibold text-success uppercase block mb-3"
            style={{ fontSize: '0.75rem', letterSpacing: '0.15em' }}
          >
            BEST VALUE
          </span>
          <h2
            className="font-inter font-bold text-dark-text"
            style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)' }}
          >
            {photographerBundle.name}
          </h2>
          <p
            className="font-inter font-normal text-secondary-text mt-3 leading-[1.7]"
            style={{ fontSize: '1rem', maxWidth: 600 }}
          >
            {photographerBundle.description}
          </p>

          <div className="bg-off-white rounded-2xl p-6 mt-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-inter text-secondary-text line-through" style={{ fontSize: '1rem' }}>
                    {bundlePrice.toFixed(0)}
                  </span>
                  <span className="font-inter font-bold text-success" style={{ fontSize: '1.4rem' }}>
                    {discountedPrice.toFixed(0)}
                  </span>
                </div>
                <span className="font-inter font-semibold text-navy bg-green-100 rounded-full px-3 py-1" style={{ fontSize: '0.8rem' }}>
                  {photographerBundle.discountPercent}% off - save {(bundlePrice - discountedPrice).toFixed(0)}
                </span>
              </div>
              <Link
                href={`/checkout?services=${photographerBundle.serviceIds.join(',')}`}
                className="inline-flex items-center gap-2 font-inter font-semibold text-white bg-success rounded-lg hover:bg-[#2d8659] transition-colors"
                style={{ padding: '14px 28px', fontSize: '0.95rem' }}
              >
                <Package size={18} />
                Get the bundle
              </Link>
            </div>

            <div className="border-t border-border mt-6 pt-6">
              <span className="font-inter font-medium text-dark-text block mb-3" style={{ fontSize: '0.9rem' }}>
                Includes:
              </span>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {bundleServices.map((s) => (
                  <span key={s.id} className="font-inter text-secondary-text" style={{ fontSize: '0.85rem' }}>
                    {s.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="bg-off-white py-16 px-6">
        <div className="mx-auto" style={{ maxWidth: 700 }}>
          {photographerTestimonials.map((t) => (
            <div key={t.name} className="bg-white rounded-2xl p-8 border border-border">
              <span
                className="block text-medium-blue font-bold leading-none -mb-3"
                style={{ fontSize: '2.4rem' }}
              >
                &ldquo;
              </span>
              <p
                className="font-inter text-dark-text leading-[1.7]"
                style={{ fontSize: '1rem', fontStyle: 'italic' }}
              >
                {t.quote}
              </p>
              <div className="flex items-center gap-3 mt-6 pt-5 border-t border-border">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: 'linear-gradient(135deg, #1B3F7A, #2C68C4)' }}
                >
                  <span className="font-inter font-semibold text-white" style={{ fontSize: '0.75rem' }}>
                    {t.initials}
                  </span>
                </div>
                <div>
                  <span className="font-inter font-semibold text-dark-text block" style={{ fontSize: '0.9rem' }}>{t.name}</span>
                  <span className="font-inter font-normal text-secondary-text" style={{ fontSize: '0.8rem' }}>{t.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-20 px-6">
        <div className="mx-auto" style={{ maxWidth: 760 }}>
          <span
            className="font-inter font-semibold text-medium-blue uppercase block mb-3"
            style={{ fontSize: '0.75rem', letterSpacing: '0.15em' }}
          >
            COMMON QUESTIONS
          </span>
          <h2
            className="font-inter font-bold text-dark-text"
            style={{ fontSize: 'clamp(1.5rem, 2.8vw, 2rem)' }}
          >
            Questions about photographer documents
          </h2>

          <div className="mt-10">
            {faqs.map((faq, i) => (
              <div key={i} className="border-b border-border py-5">
                <h3 className="font-inter font-semibold text-dark-text" style={{ fontSize: '1rem' }}>
                  {faq.q}
                </h3>
                <p
                  className="font-inter font-normal text-secondary-text mt-2 leading-[1.7]"
                  style={{ fontSize: '0.95rem' }}
                >
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section
        className="text-center px-6"
        style={{
          padding: '80px 0',
          background: 'linear-gradient(135deg, #1B3F7A 0%, #2C68C4 100%)',
        }}
      >
        <div className="mx-auto" style={{ maxWidth: 600 }}>
          <h2
            className="font-inter font-bold text-white"
            style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)' }}
          >
            Ready to protect your photography business?
          </h2>
          <p
            className="font-inter font-normal mt-4 leading-[1.7]"
            style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.85)' }}
          >
            Get licensing agreements, model releases, and client terms delivered within 3-5 business days.
          </p>
          <Link
            href={`/checkout?services=${photographerBundle.serviceIds.join(',')}`}
            className="inline-flex items-center gap-2 font-inter font-bold text-navy bg-white rounded-lg hover:bg-[rgba(255,255,255,0.92)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.2)] transition-all duration-200 mt-8"
            style={{ padding: '16px 36px', fontSize: '1rem' }}
          >
            <Package size={18} />
            Get the Photographer Bundle
          </Link>
        </div>
      </section>
    </>
  );
}
