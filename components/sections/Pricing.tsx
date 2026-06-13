'use client';

import Link from 'next/link';
import { useInView } from '@/hooks/useInView';

interface PricingCard {
  title: string;
  price: string;
  frequency: string;
  features: string[];
  cta: { label: string; href: string };
  mostPopular?: boolean;
  note?: string;
}

const cards: PricingCard[] = [
  {
    title: 'Business Foundations Pack',
    price: '£79',
    frequency: 'one-time',
    features: [
      'Client Contract',
      'Terms & Conditions',
      'GDPR Privacy Policy',
      'Professional Bio',
      'Elevator Pitch',
      'LinkedIn Profile Script',
      'Invoice Template',
      'Welcome Emails',
      'Late Payment Letters',
      'Service Sheets',
    ],
    cta: { label: 'Get this pack', href: '/checkout?services=business_foundations_pack' },
    mostPopular: true,
  },
  {
    title: 'Website Copy Starter Pack',
    price: 'From £35',
    frequency: 'per page',
    features: [
      'Homepage',
      'About page',
      'Services page',
      'Contact page',
      'Up to 10 pages',
      'SEO-aware',
      'Fully built & ready to deploy',
      'Source files + hosted preview',
    ],
    cta: { label: 'Get website copy', href: '/checkout?services=website_copy_pack' },
  },
  {
    title: 'Social Media Starter Pack',
    price: 'From £20',
    frequency: '5 posts',
    features: [
      'Educational posts',
      'Promotional posts',
      'Personal posts',
      'Captions included',
      'Hashtags included',
      'Platform-specific',
      '5-30 posts available',
      'LinkedIn, Instagram, Facebook, X',
    ],
    cta: { label: 'Get social posts', href: '/checkout?services=social_media_pack' },
  },
  {
    title: 'Quarterly Document Refresh',
    price: '£29',
    frequency: 'per quarter',
    features: [
      'One document updated',
      'Pricing changes',
      'New services added',
      'GDPR updates',
      'Regulation changes',
      'Flexible scheduling',
      'Cancel anytime',
    ],
    cta: { label: 'Add refresh', href: '/checkout?services=quarterly_refresh' },
    note: 'Requires Business Foundations Pack',
  },
];

export default function Pricing() {
  const [ref, inView] = useInView(0.08);

  return (
    <section id="pricing" className="bg-white py-24 px-6">
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-14">
          <span
            className="font-inter font-semibold text-medium-blue uppercase block mb-3"
            style={{ fontSize: '0.75rem', letterSpacing: '0.15em' }}
          >
            PRICING
          </span>
          <h2
            className="font-inter font-bold text-dark-text"
            style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)' }}
          >
            Clear pricing. No surprises.
          </h2>
          <p
            className="font-inter font-normal text-secondary-text mt-3 leading-[1.7]"
            style={{ fontSize: '1.05rem', maxWidth: 600, marginLeft: 'auto', marginRight: 'auto' }}
          >
            Every service is sold separately. Bundle together and save.
          </p>
        </div>

        {/* Service Pricing Grid */}
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-14">
          {cards.map((card, idx) => (
            <div
              key={idx}
              className={`rounded-xl p-8 border flex flex-col ${
                card.mostPopular
                  ? 'border-navy bg-white shadow-[0_16px_64px_rgba(27,63,122,0.12)]'
                  : 'border-border hover:border-medium-blue hover:shadow-[0_8px_32px_rgba(27,63,122,0.08)]'
              }`}
              style={{
                position: 'relative',
                transition: `opacity 0.55s ease ${idx * 80}ms, transform 0.55s ease ${idx * 80}ms`,
                opacity: inView ? 1 : 0,
                transform: inView ? 'translateY(0)' : 'translateY(28px)',
              }}
            >
              {card.mostPopular && (
                <div
                  className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-navy text-white font-inter font-semibold rounded-full whitespace-nowrap"
                  style={{ padding: '4px 16px', fontSize: '0.7rem', letterSpacing: '0.1em' }}
                >
                  MOST POPULAR
                </div>
              )}

              <h3 className="font-inter font-semibold text-dark-text" style={{ fontSize: '1.15rem' }}>
                {card.title}
              </h3>

              <div className="flex items-baseline gap-2 mt-4 mb-6">
                <span className="font-inter font-bold text-navy" style={{ fontSize: '2rem' }}>
                  {card.price}
                </span>
                <span className="font-inter font-normal text-secondary-text" style={{ fontSize: '0.9rem' }}>
                  {card.frequency}
                </span>
              </div>

              <div className="border-t border-border my-6" />

              <ul className="space-y-3 mb-6 flex-1">
                {card.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-success font-bold shrink-0 mt-0.5">✓</span>
                    <span className="font-inter font-normal text-secondary-text" style={{ fontSize: '0.9rem' }}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {card.note && (
                <div className="bg-off-white rounded-lg p-3 mb-6">
                  <p className="font-inter font-normal text-secondary-text text-center" style={{ fontSize: '0.85rem' }}>
                    {card.note}
                  </p>
                </div>
              )}

              <Link
                href={card.cta.href}
                className={`text-center font-inter font-semibold rounded-lg transition-all duration-200 ${
                  card.mostPopular
                    ? 'text-white bg-navy hover:bg-medium-blue hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(27,63,122,0.3)]'
                    : 'text-navy border-2 border-navy hover:bg-off-white'
                }`}
                style={{ padding: '14px 24px', fontSize: '0.95rem' }}
              >
                {card.cta.label}
              </Link>
            </div>
          ))}
        </div>

        {/* Bundle Savings Section */}
        <div
          className="rounded-xl p-10 text-center"
          style={{ background: '#d4f4e1' }}
        >
          <h3 className="font-inter font-bold text-dark-text mb-3" style={{ fontSize: '1.15rem' }}>
            Save More with Bundles
          </h3>
          <p className="font-inter font-normal text-secondary-text mb-5" style={{ fontSize: '0.95rem' }}>
            2 services = 10% off. 3+ services = 15% off.
          </p>
          <div className="bg-white rounded-lg p-5 mb-6 text-left max-w-md mx-auto">
            <p className="font-inter font-normal text-secondary-text mb-2" style={{ fontSize: '0.85rem' }}>
              <span className="font-semibold text-dark-text">Example:</span> Documents (£79) + Website Copy (5 pages, £139) + Social Media (10 posts, £40) = £258
            </p>
            <p className="font-inter font-bold text-success" style={{ fontSize: '0.95rem' }}>
              Save £38.70 with 15% off
            </p>
          </div>
          <Link
            href="/checkout"
            className="inline-block font-inter font-semibold text-white bg-success rounded-lg hover:bg-[#2d8659] transition-colors duration-200"
            style={{ padding: '14px 32px', fontSize: '0.95rem' }}
          >
            Build my package
          </Link>
        </div>
      </div>
    </section>
  );
}
