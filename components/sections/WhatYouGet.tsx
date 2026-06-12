import Link from 'next/link';
import { FileText, Globe, Share2, RotateCw } from 'lucide-react';

interface ServiceCard {
  icon: React.ComponentType<any>;
  headline: string;
  inclusions: string[];
  price: string;
  primary: { label: string; href: string };
  secondary: { label: string; href: string };
  note?: string;
}

const services: ServiceCard[] = [
  {
    icon: FileText,
    headline: '10 Bespoke Business Documents',
    inclusions: [
      'Contract',
      'T&Cs',
      'GDPR Policy',
      'Bio',
      'Pitch',
      'LinkedIn',
      'Invoice',
      'Welcome Emails',
      'Late Payment Letters',
      'Service Sheets',
    ],
    price: 'From £79 one-time',
    primary: { label: "See what's included", href: '/whats-included' },
    secondary: { label: 'Get this pack', href: '/checkout?services=business_foundations_pack' },
  },
  {
    icon: Globe,
    headline: 'Professional Website Copy',
    inclusions: [
      'Homepage',
      'About',
      'Services',
      'Contact + up to 10 pages',
      'SEO-aware',
      'Paste-ready',
      'Bolt.new prompt included',
    ],
    price: 'From £35/page',
    primary: { label: 'Learn more', href: '/services/website-copy' },
    secondary: { label: 'Get website copy', href: '/checkout?services=website_copy_pack' },
  },
  {
    icon: Share2,
    headline: 'Done-For-You Social Posts',
    inclusions: [
      'Educational posts',
      'Promotional posts',
      'Personal posts',
      'Captions and hashtags',
      'Platform-specific',
      'LinkedIn, Instagram, Facebook, X',
      '5-30 posts available',
    ],
    price: 'From £20 for 5 posts',
    primary: { label: 'Learn more', href: '/services/social-media' },
    secondary: { label: 'Get social posts', href: '/checkout?services=social_media_pack' },
  },
  {
    icon: RotateCw,
    headline: 'Keep Your Foundations Current',
    inclusions: [
      'One document per quarter',
      'Pricing updates',
      'New services',
      'GDPR updates',
      'Regulation changes',
    ],
    price: '£29/quarter',
    note: 'Requires Business Foundations Pack',
    primary: { label: 'Learn more', href: '/services/quarterly-refresh' },
    secondary: { label: 'Add refresh', href: '/checkout?services=quarterly_refresh' },
  },
];

export default function WhatYouGet() {
  return (
    <section id="pack" className="bg-off-white py-24 px-6">
      <div className="max-w-[1200px] mx-auto">
        <span
          className="font-inter font-semibold text-medium-blue uppercase block mb-3"
          style={{ fontSize: '0.75rem', letterSpacing: '0.15em' }}
        >
          OUR SERVICES
        </span>
        <h2
          className="font-inter font-bold text-dark-text"
          style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)' }}
        >
          Four Ways We Serve Your Business
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-14">
          {services.map((service, idx) => {
            const Icon = service.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-xl border border-border p-8 hover:border-medium-blue hover:shadow-[0_8px_32px_rgba(27,63,122,0.08)] transition-all duration-200 flex flex-col"
              >
                <Icon size={32} className="text-medium-blue mb-4" />
                <h3 className="font-inter font-semibold text-dark-text mb-5" style={{ fontSize: '1.2rem' }}>
                  {service.headline}
                </h3>

                <div className="mb-6">
                  <ul className="space-y-2">
                    {service.inclusions.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-success font-bold shrink-0 mt-0.5">✓</span>
                        <span className="font-inter font-normal text-secondary-text" style={{ fontSize: '0.9rem' }}>
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t border-border pt-5 mb-5">
                  <div className="font-inter font-bold text-navy" style={{ fontSize: '1.1rem' }}>
                    {service.price}
                  </div>
                  {service.note && (
                    <div className="font-inter font-normal text-secondary-text mt-2" style={{ fontSize: '0.85rem' }}>
                      {service.note}
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-3 mt-auto">
                  <Link
                    href={service.primary.href}
                    className="text-center font-inter font-semibold text-medium-blue border border-medium-blue rounded-lg hover:bg-off-white transition-colors duration-200"
                    style={{ padding: '12px 20px', fontSize: '0.95rem' }}
                  >
                    {service.primary.label}
                  </Link>
                  <Link
                    href={service.secondary.href}
                    className="text-center font-inter font-semibold text-white bg-navy rounded-lg hover:bg-medium-blue hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(27,63,122,0.25)] transition-all duration-200"
                    style={{ padding: '12px 20px', fontSize: '0.95rem' }}
                  >
                    {service.secondary.label}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bundle Savings Callout */}
        <div className="bg-success/10 border border-success/30 rounded-xl p-8 text-center mt-14">
          <h3 className="font-inter font-semibold text-dark-text mb-2" style={{ fontSize: '1.05rem' }}>
            Bundle and Save
          </h3>
          <p className="font-inter font-normal text-secondary-text" style={{ fontSize: '0.95rem' }}>
            Buy two services? Save 10%. Buy three or more? Save 15%. Applied automatically at checkout.
          </p>
          <Link
            href="/checkout"
            className="inline-block font-inter font-semibold text-white bg-success rounded-lg hover:bg-[#2d8659] transition-colors duration-200 mt-5"
            style={{ padding: '12px 32px', fontSize: '0.95rem' }}
          >
            Build my bundle
          </Link>
        </div>
      </div>
    </section>
  );
}
