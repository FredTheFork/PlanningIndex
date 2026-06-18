'use client';

import Link from 'next/link';
import { Users, Check, ShoppingCart, Package } from 'lucide-react';
import {
  getServiceById,
  getServiceGroupById,
  getServicesInGroup,
} from '@/lib/services/service-catalog';

const coachPack = getServiceById('coach_industry_pack');
const foundationPack = getServiceById('business_foundations_pack');
const coachBundle = getServiceGroupById('coach_full_bundle');

const coachTestimonials = [
  {
    quote: "I bought the documents and website copy together and the 10% discount made the decision easy. The bigger win was consistency. My contract, my website, my LinkedIn — they all read like the same person runs them now. Two clients have mentioned how professional everything looks, completely unprompted.",
    name: 'Anita S.',
    role: 'Business Coach, Edinburgh',
    initials: 'AS',
  },
];

const faqs = [
  {
    q: 'Do these documents suit executive and life coaches?',
    a: 'Yes. The coaching agreement is written to be adaptable. Whether you coach executives on leadership or individuals on personal development, the core terms (confidentiality, session structure, payment, cancellations) work the same way.',
  },
  {
    q: 'Does the Coaching Code of Ethics replace my professional body membership?',
    a: 'No. The code of ethics in this pack aligns with common UK coaching standards but is not a substitute for membership bodies like the Association for Coaching or ICF. Use it as your client-facing ethics statement.',
  },
  {
    q: "What's the CPD Tracker for?",
    a: 'Continuing Professional Development tracking is essential for accredited coaches. The template helps you log training hours, workshops, and supervision sessions for credential renewal.',
  },
  {
    q: 'Can I edit the supervision policy?',
    a: 'Yes. You receive editable Word files. The supervision policy outlines your commitment to professional supervision as a coach, which some accreditation bodies require.',
  },
];

export default function ForCoachesPage() {
  if (!coachPack || !foundationPack || !coachBundle) {
    return null;
  }

  const bundleServices = getServicesInGroup(coachBundle.id);
  const bundlePrice = bundleServices.reduce((sum, s) => sum + s.price, 0);
  const discountedPrice = bundlePrice * (1 - coachBundle.discountPercent / 100);

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
            backgroundImage: 'url(/images/hero/coaches-hero.jpg)',
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
              <Users size={24} className="text-white" />
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
            FOR COACHES
          </span>
          <h1
            className="font-inter font-extrabold text-white mt-3"
            style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', lineHeight: 1.2 }}
          >
            Professional documents for UK coaches
          </h1>
          <p
            className="font-inter font-normal mx-auto mt-4 leading-[1.7]"
            style={{
              fontSize: '1.05rem',
              color: 'rgba(255,255,255,0.85)',
              maxWidth: 560,
            }}
          >
            Coaching agreements, session terms, ethical standards, and CPD tracking. Built specifically for UK coaching professionals.
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
            Coach Industry Pack
          </h2>
          <p
            className="font-inter font-normal text-secondary-text mt-3 leading-[1.7]"
            style={{ fontSize: '1rem', maxWidth: 600 }}
          >
            7 documents designed for how UK coaches actually work. Agreements, ethics, and professional tracking all covered.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">
            {coachPack.includes.map((item) => (
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
              {coachPack.priceLabel}
            </span>
          </div>

          <Link
            href={`/checkout?services=${coachPack.id}`}
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
                The core business documents every coach needs: client contracts, terms, invoice templates, and welcome emails.
              </p>
              <div className="mt-4">
                <span className="font-inter font-bold text-navy" style={{ fontSize: '1.1rem' }}>
                  {foundationPack.priceLabel}
                </span>
              </div>
            </div>
            <Link
              href={`/checkout?services=${coachPack.id},${foundationPack.id}`}
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
            {coachBundle.name}
          </h2>
          <p
            className="font-inter font-normal text-secondary-text mt-3 leading-[1.7]"
            style={{ fontSize: '1rem', maxWidth: 600 }}
          >
            {coachBundle.description}
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
                  {coachBundle.discountPercent}% off - save {(bundlePrice - discountedPrice).toFixed(0)}
                </span>
              </div>
              <Link
                href={`/checkout?services=${coachBundle.serviceIds.join(',')}`}
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
          {coachTestimonials.map((t) => (
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
            Questions about coach documents
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
            Ready to professionalise your coaching practice?
          </h2>
          <p
            className="font-inter font-normal mt-4 leading-[1.7]"
            style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.85)' }}
          >
            Get coaching agreements, session terms, and ethics documentation delivered within 3-5 business days.
          </p>
          <Link
            href={`/checkout?services=${coachBundle.serviceIds.join(',')}`}
            className="inline-flex items-center gap-2 font-inter font-bold text-navy bg-white rounded-lg hover:bg-[rgba(255,255,255,0.92)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.2)] transition-all duration-200 mt-8"
            style={{ padding: '16px 36px', fontSize: '1rem' }}
          >
            <Package size={18} />
            Get the Coach Bundle
          </Link>
        </div>
      </section>
    </>
  );
}
