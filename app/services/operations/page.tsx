'use client';

import Link from 'next/link';
import { Briefcase, Check, ShoppingCart, Package, Shield, Zap, RefreshCw } from 'lucide-react';
import { getServicesByTier, getServiceGroupById, getServicesInGroup } from '@/lib/services/service-catalog';

export default function OperationsTierPage() {
  const operationsServices = getServicesByTier('operations');
  const operationsBundle = getServiceGroupById('full_operations_bundle');
  const complianceBundle = getServiceGroupById('compliance_bundle');

  if (!operationsBundle || !complianceBundle) return null;

  const fullBundleServices = getServicesInGroup(operationsBundle.id);
  const fullBundlePrice = fullBundleServices.reduce((sum, s) => sum + s.price, 0);
  const fullDiscountedPrice = fullBundlePrice * (1 - operationsBundle.discountPercent / 100);

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
            backgroundImage: 'url(/images/hero/operations-hero.jpg)',
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
          <div style={{ paddingTop: 'clamp(100px, 13vw, 128px)' }}>
            <div className="flex items-center justify-center gap-2 mb-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(255,255,255,0.15)' }}
              >
                <Briefcase size={24} className="text-white" />
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
              OPERATIONS TIER
            </span>
            <h1
              className="font-inter font-extrabold text-white mt-3"
              style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', lineHeight: 1.2 }}
            >
              Protect your running business
            </h1>
            <p
              className="font-inter font-normal mx-auto mt-4 leading-[1.7]"
              style={{
                fontSize: '1.05rem',
                color: 'rgba(255,255,255,0.85)',
                maxWidth: 550,
              }}
            >
              Client onboarding, payment protection, IP rights, and deep GDPR compliance. Everything to protect how you actually work.
            </p>
          </div>
        </div>
      </section>

      {/* What Operations Protects */}
      <section className="bg-white py-12 px-6 border-b border-border">
        <div className="mx-auto" style={{ maxWidth: 900 }}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <Shield size={20} className="text-medium-blue" />
              <span className="font-inter font-medium text-dark-text" style={{ fontSize: '0.9rem' }}>
                Scope creep protection
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Zap size={20} className="text-medium-blue" />
              <span className="font-inter font-medium text-dark-text" style={{ fontSize: '0.9rem' }}>
                Payment disputes
              </span>
            </div>
            <div className="flex items-center gap-3">
              <RefreshCw size={20} className="text-medium-blue" />
              <span className="font-inter font-medium text-dark-text" style={{ fontSize: '0.9rem' }}>
                GDPR violations
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Package size={20} className="text-medium-blue" />
              <span className="font-inter font-medium text-dark-text" style={{ fontSize: '0.9rem' }}>
                IP theft
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Service Cards */}
      <section className="bg-off-white py-20 px-6">
        <div className="mx-auto" style={{ maxWidth: 1100 }}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {operationsServices.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-2xl border-2 border-blue-200 p-6 flex flex-col hover:shadow-lg transition-all duration-200"
              >
                {service.badge && (
                  <span
                    className="font-inter font-semibold rounded-full self-start mb-3"
                    style={{
                      background: '#2563eb',
                      color: '#fff',
                      padding: '4px 12px',
                      fontSize: '0.7rem',
                    }}
                  >
                    {service.badge}
                  </span>
                )}

                <h3 className="font-inter font-semibold text-dark-text" style={{ fontSize: '1rem' }}>
                  {service.name}
                </h3>
                <p
                  className="font-inter font-normal text-secondary-text mt-2 leading-[1.5]"
                  style={{ fontSize: '0.85rem' }}
                >
                  {service.shortDescription}
                </p>

                <div className="mt-4">
                  <span className="font-inter font-bold text-navy" style={{ fontSize: '1.2rem' }}>
                    {service.priceLabel}
                  </span>
                </div>

                <div className="my-4 border-t border-border" />

                <ul className="space-y-1.5 flex-1">
                  {service.includes.slice(0, 4).map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check size={12} className="text-success shrink-0 mt-0.5" />
                      <span className="font-inter font-normal text-secondary-text" style={{ fontSize: '0.8rem' }}>
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={`/checkout?services=${service.id}`}
                  className="w-full mt-5 text-center font-inter font-semibold text-white bg-navy rounded-lg hover:bg-medium-blue transition-colors text-sm py-2.5"
                >
                  Get this pack
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bundle Recommendation */}
      <section className="py-16 px-6" style={{ background: '#e6f7ed' }}>
        <div className="mx-auto" style={{ maxWidth: 900 }}>
          <div className="bg-white rounded-2xl p-8 border-2 border-success">
            <div className="flex items-center gap-2 mb-4">
              <Package size={20} className="text-success" />
              <span className="font-inter font-semibold text-success uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.1em' }}>
                {operationsBundle.badge || 'BEST VALUE'}
              </span>
            </div>
            <h2 className="font-inter font-bold text-dark-text" style={{ fontSize: '1.4rem' }}>
              {operationsBundle.name}
            </h2>
            <p className="font-inter font-normal text-secondary-text mt-2 leading-[1.6]" style={{ fontSize: '0.95rem' }}>
              {operationsBundle.description}
            </p>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mt-6 pt-6 border-t border-border">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-inter text-secondary-text line-through" style={{ fontSize: '1rem' }}>
                    £{fullBundlePrice.toFixed(0)}
                  </span>
                  <span className="font-inter font-bold text-success" style={{ fontSize: '1.5rem' }}>
                    £{fullDiscountedPrice.toFixed(0)}
                  </span>
                </div>
                <span className="font-inter font-semibold text-navy bg-green-100 rounded-full px-3 py-1" style={{ fontSize: '0.8rem' }}>
                  {operationsBundle.discountPercent}% off - save £{(fullBundlePrice - fullDiscountedPrice).toFixed(0)}
                </span>
              </div>
              <Link
                href={`/checkout?services=${operationsBundle.serviceIds.join(',')}`}
                className="inline-flex items-center gap-2 font-inter font-semibold text-white bg-success rounded-lg hover:bg-[#2d8659] transition-colors"
                style={{ padding: '14px 28px', fontSize: '0.95rem' }}
              >
                <Package size={18} />
                Get the bundle
              </Link>
            </div>

            <div className="mt-6 pt-4 border-t border-border">
              <span className="font-inter font-medium text-dark-text block mb-3" style={{ fontSize: '0.9rem' }}>
                All 4 Operations packs:
              </span>
              <div className="grid grid-cols-2 gap-2">
                {fullBundleServices.map((s) => (
                  <div key={s.id} className="flex items-center gap-2">
                    <Check size={14} className="text-success shrink-0" />
                    <span className="font-inter text-secondary-text" style={{ fontSize: '0.85rem' }}>
                      {s.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Back to Services */}
      <section className="bg-white py-12 px-6">
        <div className="mx-auto text-center" style={{ maxWidth: 600 }}>
          <Link
            href="/services"
            className="font-inter font-medium text-medium-blue hover:text-navy transition-colors"
            style={{ fontSize: '0.95rem' }}
          >
            See all tiers
          </Link>
        </div>
      </section>
    </>
  );
}
