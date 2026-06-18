'use client';

import Link from 'next/link';
import { Star, Briefcase, Crown, Package, ArrowRight } from 'lucide-react';
import { getServicesByTier, getServiceGroupById, serviceGroups, type ServiceTier } from '@/lib/services/service-catalog';

const tierConfig: Record<ServiceTier, { label: string; headline: string; description: string; color: string; bgColor: string; borderColor: string; icon: React.ElementType }> = {
  foundation: {
    label: 'Foundation',
    headline: 'Start your business',
    description: 'Essential documents, website copy, and social media to launch professionally.',
    color: '#1B3F7A',
    bgColor: 'bg-slate-50',
    borderColor: 'border-slate-300',
    icon: Star,
  },
  operations: {
    label: 'Operations',
    headline: 'Run your business',
    description: 'Client management, payment protection, IP rights, and deep GDPR compliance.',
    color: '#2563eb',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-300',
    icon: Briefcase,
  },
  industry: {
    label: 'Industry',
    headline: 'Dominate your industry',
    description: 'Specialized documents tailored to your specific profession.',
    color: '#d97706',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-300',
    icon: Crown,
  },
};

export default function ServicesClient() {
  const foundationServices = getServicesByTier('foundation').filter(s => s.mode !== 'subscription');
  const operationsServices = getServicesByTier('operations');
  const industryServices = getServicesByTier('industry');

  const foundationBundle = getServiceGroupById('foundation_bundle');
  const operationsBundle = getServiceGroupById('full_operations_bundle');
  const industryBundles = serviceGroups.filter(g => g.tier === 'industry' && g.discountPercent >= 20);

  const getMinPrice = (services: typeof foundationServices) => {
    const min = Math.min(...services.map(s => s.price));
    return min;
  };

  return (
    <>
      {/* Hero */}
      <section
        className="relative text-center px-6"
        style={{ paddingTop: 0, paddingBottom: '72px', minHeight: '420px' }}
      >
        {/* Background image */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            backgroundImage: 'url(/images/hero/services-hero.jpg)',
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
            background: 'linear-gradient(135deg, rgba(15,30,61,0.82) 0%, rgba(27,63,122,0.78) 100%)',
            zIndex: 1,
          }}
        />
        <div className="mx-auto relative" style={{ maxWidth: 800, zIndex: 2 }}>
          <div style={{ paddingTop: 'clamp(100px, 13vw, 128px)' }}>
          <span
            className="font-inter font-semibold uppercase block"
            style={{
              fontSize: '0.75rem',
              letterSpacing: '0.15em',
              color: 'rgba(255,255,255,0.7)',
            }}
          >
            YOUR BUSINESS INFRASTRUCTURE
          </span>
          <h1
            className="font-inter font-extrabold text-white mt-3"
            style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', lineHeight: 1.2 }}
          >
            Build your business infrastructure
          </h1>
          <p
            className="font-inter font-normal mx-auto mt-4 leading-[1.7]"
            style={{
              fontSize: '1.05rem',
              color: 'rgba(255,255,255,0.85)',
              maxWidth: 550,
            }}
          >
            Three tiers. 13 packs. 70+ documents. Start with Foundation, protect with Operations, dominate with Industry.
          </p>
          </div>
        </div>
      </section>

      {/* Tier Cards Hub */}
      <section className="bg-white py-20 px-6">
        <div className="mx-auto" style={{ maxWidth: 1100 }}>
          <span
            className="font-inter font-semibold text-medium-blue uppercase block mb-3"
            style={{ fontSize: '0.75rem', letterSpacing: '0.15em' }}
          >
            CHOOSE YOUR TIER
          </span>
          <h2
            className="font-inter font-bold text-dark-text"
            style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)' }}
          >
            Three tiers of protection
          </h2>
          <p
            className="font-inter font-normal text-secondary-text mt-3 leading-[1.7]"
            style={{ fontSize: '1rem', maxWidth: 600 }}
          >
            Start where you are. Each tier builds on the last. Foundation to launch, Operations to protect, Industry to dominate your sector.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {/* Foundation Card */}
            <Link
              href="/services/foundation"
              className="group bg-slate-50 rounded-2xl border-2 border-slate-200 hover:border-slate-400 hover:shadow-lg transition-all duration-200 p-8 flex flex-col"
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: '#1B3F7A' }}
                >
                  <Star size={22} className="text-white" />
                </div>
                <div>
                  <span className="font-inter font-bold text-dark-text block" style={{ fontSize: '1.1rem' }}>
                    Foundation
                  </span>
                  <span className="font-inter text-secondary-text" style={{ fontSize: '0.85rem' }}>
                    Start professionally
                  </span>
                </div>
              </div>
              <p className="font-inter font-normal text-secondary-text leading-[1.6]" style={{ fontSize: '0.9rem' }}>
                Documents, website copy, social media — everything to launch your business properly.
              </p>
              <div className="mt-auto pt-6 flex items-center justify-between">
                <span className="font-inter font-bold text-navy" style={{ fontSize: '1.2rem' }}>
                  From £{getMinPrice(foundationServices)}
                </span>
                <span className="font-inter font-medium text-slate-600 flex items-center gap-1 group-hover:text-navy">
                  View <ArrowRight size={16} />
                </span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="font-inter font-medium bg-white rounded-full px-3 py-1 text-xs text-slate-600">
                  {foundationServices.length} packs
                </span>
                {foundationBundle && (
                  <span className="font-inter font-medium bg-green-100 text-green-700 rounded-full px-3 py-1 text-xs">
                    {foundationBundle.discountPercent}% off bundle
                  </span>
                )}
              </div>
            </Link>

            {/* Operations Card */}
            <Link
              href="/services/operations"
              className="group bg-blue-50 rounded-2xl border-2 border-blue-200 hover:border-blue-400 hover:shadow-lg transition-all duration-200 p-8 flex flex-col"
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: '#2563eb' }}
                >
                  <Briefcase size={22} className="text-white" />
                </div>
                <div>
                  <span className="font-inter font-bold text-dark-text block" style={{ fontSize: '1.1rem' }}>
                    Operations
                  </span>
                  <span className="font-inter text-secondary-text" style={{ fontSize: '0.85rem' }}>
                    Protect your business
                  </span>
                </div>
              </div>
              <p className="font-inter font-normal text-secondary-text leading-[1.6]" style={{ fontSize: '0.9rem' }}>
                Onboarding systems, payment protection, GDPR compliance, and IP rights.
              </p>
              <div className="mt-auto pt-6 flex items-center justify-between">
                <span className="font-inter font-bold text-navy" style={{ fontSize: '1.2rem' }}>
                  From £{getMinPrice(operationsServices)}
                </span>
                <span className="font-inter font-medium text-blue-600 flex items-center gap-1 group-hover:text-blue-800">
                  View <ArrowRight size={16} />
                </span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="font-inter font-medium bg-white rounded-full px-3 py-1 text-xs text-blue-600">
                  {operationsServices.length} packs
                </span>
                {operationsBundle && (
                  <span className="font-inter font-medium bg-green-100 text-green-700 rounded-full px-3 py-1 text-xs">
                    {operationsBundle.discountPercent}% off bundle
                  </span>
                )}
              </div>
            </Link>

            {/* Industry Card */}
            <Link
              href="/services/industry"
              className="group bg-amber-50 rounded-2xl border-2 border-amber-200 hover:border-amber-400 hover:shadow-lg transition-all duration-200 p-8 flex flex-col"
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: '#d97706' }}
                >
                  <Crown size={22} className="text-white" />
                </div>
                <div>
                  <span className="font-inter font-bold text-dark-text block" style={{ fontSize: '1.1rem' }}>
                    Industry
                  </span>
                  <span className="font-inter text-secondary-text" style={{ fontSize: '0.85rem' }}>
                    Dominate your sector
                  </span>
                </div>
              </div>
              <p className="font-inter font-normal text-secondary-text leading-[1.6]" style={{ fontSize: '0.9rem' }}>
                Photography, coaching, consulting, and contractor-specific documents.
              </p>
              <div className="mt-auto pt-6 flex items-center justify-between">
                <span className="font-inter font-bold text-navy" style={{ fontSize: '1.2rem' }}>
                  From £{getMinPrice(industryServices)}
                </span>
                <span className="font-inter font-medium text-amber-600 flex items-center gap-1 group-hover:text-amber-700">
                  View <ArrowRight size={16} />
                </span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="font-inter font-medium bg-white rounded-full px-3 py-1 text-xs text-amber-700">
                  {industryServices.length} industries
                </span>
                <span className="font-inter font-medium bg-green-100 text-green-700 rounded-full px-3 py-1 text-xs">
                  Up to 25% off
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Bundles Section */}
      <section id="bundles" className="py-20 px-6" style={{ background: '#e6f7ed' }}>
        <div className="mx-auto" style={{ maxWidth: 1100 }}>
          <span
            className="font-inter font-semibold text-success uppercase block mb-3"
            style={{ fontSize: '0.75rem', letterSpacing: '0.15em' }}
          >
            BUNDLE & SAVE
          </span>
          <h2
            className="font-inter font-bold text-dark-text"
            style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)' }}
          >
            Pre-configured bundles. Up to 25% off.
          </h2>
          <p
            className="font-inter font-normal text-secondary-text mt-3 leading-[1.7]"
            style={{ fontSize: '1rem', maxWidth: 600 }}
          >
            Get everything you need in one click. Our most popular combinations, pre-built for you.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
            {/* Foundation Bundle */}
            {foundationBundle && (
              <Link
                href={`/checkout?services=${foundationBundle.serviceIds.join(',')}`}
                className="bg-white rounded-xl p-5 border-2 border-success/30 hover:border-success hover:shadow-md transition-all flex flex-col"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Package size={18} className="text-success" />
                  <span className="font-inter font-semibold text-dark-text text-sm">
                    Foundation Bundle
                  </span>
                </div>
                <p className="font-inter text-secondary-text text-xs mb-4">
                  Documents + website + social
                </p>
                <div className="mt-auto flex items-center justify-between">
                  <span className="font-inter font-bold text-success text-sm">
                    {foundationBundle.discountPercent}% off
                  </span>
                  <span className="font-inter font-medium text-navy text-sm">
                    View
                  </span>
                </div>
              </Link>
            )}

            {/* Operations Bundle */}
            {operationsBundle && (
              <Link
                href={`/checkout?services=${operationsBundle.serviceIds.join(',')}`}
                className="bg-white rounded-xl p-5 border-2 border-success/30 hover:border-success hover:shadow-md transition-all flex flex-col"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Package size={18} className="text-success" />
                  <span className="font-inter font-semibold text-dark-text text-sm">
                    Full Operations
                  </span>
                </div>
                <p className="font-inter text-secondary-text text-xs mb-4">
                  Onboarding + payments + IP + GDPR
                </p>
                <div className="mt-auto flex items-center justify-between">
                  <span className="font-inter font-bold text-success text-sm">
                    {operationsBundle.discountPercent}% off
                  </span>
                  <span className="font-inter font-medium text-navy text-sm">
                    View
                  </span>
                </div>
              </Link>
            )}

            {/* Industry bundles */}
            {industryBundles.slice(0, 2).map((bundle) => (
              <Link
                key={bundle.id}
                href={`/checkout?services=${bundle.serviceIds.join(',')}`}
                className="bg-white rounded-xl p-5 border-2 border-success/30 hover:border-success hover:shadow-md transition-all flex flex-col"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Package size={18} className="text-success" />
                  <span className="font-inter font-semibold text-dark-text text-sm">
                    {bundle.name.replace(' Complete Bundle', '')}
                  </span>
                </div>
                <p className="font-inter text-secondary-text text-xs mb-4">
                  Operations + industry pack
                </p>
                <div className="mt-auto flex items-center justify-between">
                  <span className="font-inter font-bold text-success text-sm">
                    {bundle.discountPercent}% off
                  </span>
                  <span className="font-inter font-medium text-navy text-sm">
                    View
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              href="/services/bundles"
              className="inline-flex items-center gap-2 font-inter font-semibold text-success hover:text-green-700 transition-colors"
              style={{ fontSize: '0.95rem' }}
            >
              View all bundles <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Not Sure Section */}
      <section className="bg-off-white py-16 px-6">
        <div className="mx-auto" style={{ maxWidth: 640 }}>
          <div className="text-center">
            <span
              className="font-inter font-semibold text-medium-blue uppercase block mb-3"
              style={{ fontSize: '0.75rem', letterSpacing: '0.15em' }}
            >
              NEED HELP?
            </span>
            <h2
              className="font-inter font-bold text-dark-text"
              style={{ fontSize: 'clamp(1.4rem, 2.5vw, 1.8rem)' }}
            >
              Not sure which tier?
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

      {/* Final CTA */}
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
            style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)' }}
          >
            Ready to build your infrastructure?
          </h2>
          <p
            className="font-inter font-normal mt-4 leading-[1.7]"
            style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.85)' }}
          >
            Start with Foundation at £79, or build a bundle and save up to 25%. Your complete business infrastructure, delivered.
          </p>
          <Link
            href="/checkout?services=business_foundations_pack"
            className="inline-block font-inter font-bold text-navy bg-white rounded-lg hover:bg-[rgba(255,255,255,0.92)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.2)] transition-all duration-200 mt-8"
            style={{ padding: '16px 36px', fontSize: '1rem' }}
          >
            Start with Foundation - £79
          </Link>
        </div>
      </section>
    </>
  );
}
