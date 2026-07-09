'use client';

import Link from 'next/link';
import { Check, ShoppingCart, Package, Shield, Users, Briefcase, HardHat, Camera, Video } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { DarkCTABanner } from '@/components/ui/DarkCTABanner';
import { TestimonialCard } from '@/components/ui/TestimonialCard';
import { PageHero } from '@/components/ui/PageHero';
import { IndustryPageConfig, IndustryIconName } from '@/lib/content/industry-pages';
import { ServiceCatalogEntry, ServiceGroup } from '@/lib/services/service-catalog-types';

const iconMap: Record<IndustryIconName, LucideIcon> = {
  'users': Users,
  'briefcase': Briefcase,
  'hard-hat': HardHat,
  'camera': Camera,
};

interface IndustryPageClientProps {
  config: IndustryPageConfig;
  industry: string;
  industryPack: ServiceCatalogEntry;
  foundationPack: ServiceCatalogEntry;
  industryBundle: ServiceGroup;
  bundleServices: ServiceCatalogEntry[];
  bundlePrice: number;
  discountedPrice: number;
}

export function IndustryPageClient({
  config,
  industry,
  industryPack,
  foundationPack,
  industryBundle,
  bundleServices,
  bundlePrice,
  discountedPrice,
}: IndustryPageClientProps) {
  const Icon = iconMap[config.iconName];

  return (
    <>
      <PageHero
        eyebrow={config.label}
        title={config.heroTitle}
        subtitle={config.heroSubtitle}
        backgroundImage={config.heroImage}
        icon={Icon}
      />

      <section className="bg-white py-20 px-6">
        <div className="mx-auto" style={{ maxWidth: 900 }}>
          <SectionLabel>WHAT&apos;S INCLUDED</SectionLabel>
          <h2 className="font-inter font-bold text-dark-text" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)' }}>
            {industryPack.name}
          </h2>
          <p className="font-inter font-normal text-secondary-text mt-3 leading-[1.7]" style={{ fontSize: '1rem', maxWidth: 600 }}>
            {industryPack.includes.length} documents designed for how UK {industry} actually work. {industry === 'contractors' ? 'H&S, risk assessments, and site documentation all covered.' : industry === 'coaches' ? 'Agreements, ethics, and professional tracking all covered.' : industry === 'consultants' ? 'Agreements, deliverables, and handover all covered.' : 'Licensing, releases, and client management all covered.'}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">
            {industryPack.includes.map((item: string) => (
              <div key={item} className="flex items-start gap-3 bg-off-white rounded-xl p-4">
                <Check size={18} className="text-success shrink-0 mt-0.5" />
                <span className="font-inter font-medium text-dark-text" style={{ fontSize: '0.9rem' }}>{item}</span>
              </div>
            ))}
          </div>

          <div className="flex items-baseline gap-2 mt-8">
            <span className="font-inter font-extrabold text-navy" style={{ fontSize: '2rem' }}>
              {industryPack.priceLabel}
            </span>
          </div>

          <Link
            href={`/checkout?services=${industryPack.id}`}
            className="inline-flex items-center gap-2 font-inter font-semibold text-white bg-navy rounded-lg hover:bg-medium-blue transition-colors mt-6"
            style={{ padding: '14px 28px', fontSize: '0.95rem' }}
          >
            <ShoppingCart size={18} />
            Get this pack
          </Link>
        </div>
      </section>

      {config.complianceAlert && (
        <section className="bg-amber-50 py-12 px-6 border-y border-amber-200">
          <div className="mx-auto" style={{ maxWidth: 900 }}>
            <div className="flex items-start gap-4">
              <Shield size={24} className="text-amber-600 shrink-0 mt-1" />
              <div>
                <h3 className="font-inter font-semibold text-amber-900" style={{ fontSize: '1.05rem' }}>
                  {config.complianceAlert.title}
                </h3>
                <p className="font-inter font-normal text-amber-800 mt-2 leading-[1.6]" style={{ fontSize: '0.9rem' }}>
                  {config.complianceAlert.content}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="bg-off-white py-16 px-6">
        <div className="mx-auto" style={{ maxWidth: 900 }}>
          <div className="bg-white rounded-2xl border border-border p-8 flex flex-col md:flex-row items-start gap-8">
            <div className="flex-1">
              <span className="font-inter font-semibold text-medium-blue uppercase block mb-2" style={{ fontSize: '0.7rem', letterSpacing: '0.12em' }}>
                YOU&apos;LL ALSO NEED
              </span>
              <h3 className="font-inter font-bold text-dark-text" style={{ fontSize: '1.2rem' }}>
                {foundationPack.name}
              </h3>
              <p className="font-inter font-normal text-secondary-text mt-2 leading-[1.6]" style={{ fontSize: '0.9rem' }}>
                {config.foundationDescription}
              </p>
              <div className="mt-4">
                <span className="font-inter font-bold text-navy" style={{ fontSize: '1.1rem' }}>
                  {foundationPack.priceLabel}
                </span>
              </div>
            </div>
            <Link
              href={`/checkout?services=${industryPack.id},${foundationPack.id}`}
              className="font-inter font-semibold text-navy border-2 border-navy rounded-lg hover:bg-navy hover:text-white transition-colors flex items-center gap-2"
              style={{ padding: '12px 24px', fontSize: '0.9rem' }}
            >
              Add both to checkout
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white py-20 px-6">
        <div className="mx-auto" style={{ maxWidth: 900 }}>
          <SectionLabel>BEST VALUE</SectionLabel>
          <h2 className="font-inter font-bold text-dark-text" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)' }}>
            {industryBundle.name}
          </h2>
          <p className="font-inter font-normal text-secondary-text mt-3 leading-[1.7]" style={{ fontSize: '1rem', maxWidth: 600 }}>
            {industryBundle.description}
          </p>

          <div className="bg-off-white rounded-2xl p-6 mt-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-inter text-secondary-text line-through" style={{ fontSize: '1rem' }}>
                    £{bundlePrice.toFixed(0)}
                  </span>
                  <span className="font-inter font-bold text-success" style={{ fontSize: '1.4rem' }}>
                    £{discountedPrice.toFixed(0)}
                  </span>
                </div>
                <span className="font-inter font-semibold text-navy bg-green-100 rounded-full px-3 py-1" style={{ fontSize: '0.8rem' }}>
                  {industryBundle.discountPercent}% off - save £{(bundlePrice - discountedPrice).toFixed(0)}
                </span>
              </div>
              <Link
                href={`/checkout?services=${industryBundle.serviceIds.join(',')}`}
                className="inline-flex items-center gap-2 font-inter font-semibold text-white bg-success rounded-lg hover:bg-[#2d8659] transition-colors"
                style={{ padding: '14px 28px', fontSize: '0.95rem' }}
              >
                <Package size={18} />
                Get the bundle
              </Link>
            </div>

            <div className="border-t border-border mt-6 pt-6">
              <span className="font-inter font-medium text-dark-text block mb-3" style={{ fontSize: '0.9rem' }}>Includes:</span>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {bundleServices.map((s) => (
                  <span key={s.id} className="font-inter text-secondary-text" style={{ fontSize: '0.85rem' }}>{s.name}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-off-white py-16 px-6">
        <div className="mx-auto" style={{ maxWidth: 700 }}>
          {config.testimonials.map((t) => (
            <TestimonialCard key={t.name} testimonial={t} />
          ))}
        </div>
      </section>

      <section className="bg-white py-20 px-6">
        <div className="mx-auto" style={{ maxWidth: 760 }}>
          <SectionLabel>COMMON QUESTIONS</SectionLabel>
          <h2 className="font-inter font-bold text-dark-text" style={{ fontSize: 'clamp(1.5rem, 2.8vw, 2rem)' }}>
            Questions about {industry} documents
          </h2>

          <div className="mt-10">
            {config.faqs.map((faq, i) => (
              <div key={i} className="border-b border-border py-5">
                <h3 className="font-inter font-semibold text-dark-text" style={{ fontSize: '1rem' }}>{faq.q}</h3>
                <p className="font-inter font-normal text-secondary-text mt-2 leading-[1.7]" style={{ fontSize: '0.95rem' }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <DarkCTABanner
        title={config.ctaTitle}
        subtitle={config.ctaSubtitle}
        ctaLabel={config.ctaButtonLabel}
        ctaHref={`/checkout?services=${industryBundle.serviceIds.join(',')}`}
        icon={Package}
      />
    </>
  );
}
