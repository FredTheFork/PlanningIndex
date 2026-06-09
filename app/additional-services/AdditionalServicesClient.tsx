'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Check, ShoppingCart, Package, ArrowRight, AlertCircle } from 'lucide-react';
import {
  serviceCatalog,
  getServiceById,
  calculateTotal,
  getBundleSavingsMessage,
  getBundleDiscountPercentage,
} from '@/lib/services/service-catalog';
import { useAuth } from '@/hooks/useAuth';
import { useClientProfile } from '@/hooks/useClientProfile';

/* ─── shared ─── */

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

/* ─── 1. Page Header ─── */

function PageHeader() {
  return (
    <section
      className="text-center px-6"
      style={{
        padding: '80px 0 72px',
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
            marginTop: '72px',
          }}
        >
          ADDITIONAL SERVICES
        </span>
        <h1
          className="font-inter font-extrabold text-white mt-3"
          style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', lineHeight: 1.2 }}
        >
          Extend your foundations — only if you need to.
        </h1>
        <p
          className="font-inter font-normal mx-auto mt-4 leading-[1.7]"
          style={{
            fontSize: '1.05rem',
            color: 'rgba(255,255,255,0.85)',
            maxWidth: 560,
          }}
        >
          The Business Foundations Pack is complete on its own. These services are optional enhancements for businesses that want to go further.
        </p>
      </div>
    </section>
  );
}

/* ─── 2. Core Message Strip ─── */

function CoreMessage() {
  return (
    <section className="bg-off-white py-14 px-6">
      <p
        className="font-inter font-medium text-navy text-center mx-auto leading-[1.7]"
        style={{ fontSize: '1.1rem', maxWidth: 560 }}
      >
        No bundles. No pressure. Add any service only if it genuinely helps your business.
      </p>
    </section>
  );
}

/* ─── 3. Returning Customer Banner ─── */

function ReturningCustomerBanner({ purchasedServiceIds }: { purchasedServiceIds: string[] }) {
  if (purchasedServiceIds.length === 0) return null;

  const ownsCore = purchasedServiceIds.includes('business_foundations_pack');

  return (
    <section className="bg-white py-8 px-6 border-b border-border">
      <div className="mx-auto" style={{ maxWidth: 960 }}>
        <div className="bg-blue-50 border border-medium-blue rounded-xl p-6 flex items-start gap-4">
          <Check size={22} className="text-success shrink-0 mt-0.5" />
          <div>
            <h2 className="font-inter font-semibold text-navy" style={{ fontSize: '1rem' }}>
              Welcome back
            </h2>
            <p className="font-inter font-normal text-secondary-text mt-1 leading-[1.6]" style={{ fontSize: '0.9rem' }}>
              {ownsCore
                ? 'You already own the Business Foundations Pack. Any add-on you purchase will work seamlessly with your existing documents.'
                : 'You have active services on your account. Add more services below to build on what you already have.'}
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              {purchasedServiceIds.map((serviceId) => {
                const service = getServiceById(serviceId);
                return (
                  <span
                    key={serviceId}
                    className="bg-white border border-border rounded-full font-inter font-medium text-dark-text"
                    style={{ padding: '3px 12px', fontSize: '0.8rem' }}
                  >
                    {service?.name ?? serviceId}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── 4. Services Grid with Purchase Buttons ─── */

const addOnServices = [
  {
    id: 'website_copy_pack' as const,
    whoFor: 'Ideal if you\'re building or refreshing a website and want it to sound credible, clear, and professional.',
  },
  {
    id: 'social_media_pack' as const,
    whoFor: 'Best for sole traders who want consistency without starting from a blank page.',
  },
  {
    id: 'quarterly_refresh' as const,
    whoFor: 'Optional ongoing service. Cancel anytime.',
  },
];

function ServiceCard({
  serviceId,
  whoFor,
  ownsCore,
  alreadyOwned,
}: {
  serviceId: string;
  whoFor: string;
  ownsCore: boolean;
  alreadyOwned: boolean;
}) {
  const service = getServiceById(serviceId);
  if (!service) return null;

  const bundleServiceIds = ownsCore
    ? [serviceId]
    : ['business_foundations_pack', serviceId];
  const bundledTotal = calculateTotal(bundleServiceIds);
  const bundleDiscountPercent = getBundleDiscountPercentage(ownsCore ? 2 : bundleServiceIds.length);
  const bundleSavings = bundledTotal.subtotal * (bundleDiscountPercent / 100);

  if (alreadyOwned) {
    return (
      <div className="bg-white border-2 border-success rounded-2xl p-8 flex flex-col relative overflow-hidden">
        <div className="absolute top-0 right-0 bg-success text-white font-inter font-semibold px-4 py-1.5 rounded-bl-xl" style={{ fontSize: '0.75rem' }}>
          OWNED
        </div>
        <span
          className="inline-block bg-off-white border border-medium-blue rounded-full font-inter font-bold text-navy self-start"
          style={{ padding: '4px 14px', fontSize: '0.9rem' }}
        >
          {service.priceLabel}
        </span>
        <h3 className="font-inter font-bold text-dark-text mt-4" style={{ fontSize: '1.1rem' }}>
          {service.name}
        </h3>
        <p
          className="font-inter font-normal text-secondary-text mt-2.5 leading-[1.65]"
          style={{ fontSize: '0.9rem' }}
        >
          {service.description}
        </p>
        <div className="flex flex-col gap-2.5 mt-5">
          {service.includes.map((f) => (
            <div key={f} className="flex items-start gap-2.5">
              <span className="text-success font-bold shrink-0">✓</span>
              <span className="font-inter font-medium text-dark-text" style={{ fontSize: '0.875rem' }}>
                {f}
              </span>
            </div>
          ))}
        </div>
        <div className="border-t border-border mt-6 pt-5 mt-auto">
          <div className="flex items-center gap-2">
            <Check size={18} className="text-success" />
            <span className="font-inter font-semibold text-success" style={{ fontSize: '0.9rem' }}>
              You own this service
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-border rounded-2xl p-8 hover:border-medium-blue hover:shadow-[0_8px_32px_rgba(27,63,122,0.08)] transition-all duration-200 flex flex-col">
      <span
        className="inline-block bg-off-white border border-medium-blue rounded-full font-inter font-bold text-navy self-start"
        style={{ padding: '4px 14px', fontSize: '0.9rem' }}
      >
        {service.priceLabel}
      </span>
      <h3 className="font-inter font-bold text-dark-text mt-4" style={{ fontSize: '1.1rem' }}>
        {service.name}
      </h3>
      <p
        className="font-inter font-normal text-secondary-text mt-2.5 leading-[1.65]"
        style={{ fontSize: '0.9rem' }}
      >
        {service.description}
      </p>
      <div className="flex flex-col gap-2.5 mt-5">
        {service.includes.map((f) => (
          <div key={f} className="flex items-start gap-2.5">
            <span className="text-medium-blue font-bold shrink-0">✓</span>
            <span className="font-inter font-medium text-dark-text" style={{ fontSize: '0.875rem' }}>
              {f}
            </span>
          </div>
        ))}
      </div>
      <div className="border-t border-border mt-6 pt-5">
        <p className="font-inter font-normal text-secondary-text leading-[1.6]" style={{ fontSize: '0.85rem' }}>
          {whoFor}
        </p>
      </div>

      {/* Purchase actions */}
      <div className="flex flex-col gap-2.5 mt-6 mt-auto">
        <Link
          href={`/checkout?services=${serviceId}`}
          className="w-full text-center font-inter font-bold text-white bg-navy rounded-lg hover:bg-medium-blue transition-colors duration-200 flex items-center justify-center gap-2"
          style={{ padding: '12px 20px', fontSize: '0.9rem', minHeight: 44 }}
        >
          <ShoppingCart size={16} />
          Buy separately
        </Link>

        {!ownsCore && service.isStandalone && bundleDiscountPercent > 0 && (
          <Link
            href={`/checkout?services=business_foundations_pack,${serviceId}`}
            className="w-full text-center font-inter font-semibold text-navy bg-off-white border border-medium-blue rounded-lg hover:bg-white hover:shadow-[0_4px_16px_rgba(27,63,122,0.1)] transition-all duration-200 flex items-center justify-center gap-2"
            style={{ padding: '12px 20px', fontSize: '0.9rem', minHeight: 44 }}
          >
            <Package size={16} />
            Add to my order — save {bundleDiscountPercent}%
          </Link>
        )}

        {ownsCore && bundleDiscountPercent > 0 && (
          <Link
            href={`/checkout?services=${serviceId}`}
            className="w-full text-center font-inter font-semibold text-navy bg-off-white border border-medium-blue rounded-lg hover:bg-white hover:shadow-[0_4px_16px_rgba(27,63,122,0.1)] transition-all duration-200 flex items-center justify-center gap-2"
            style={{ padding: '12px 20px', fontSize: '0.9rem', minHeight: 44 }}
          >
            <ArrowRight size={16} />
            Add to my pack — save {bundleDiscountPercent}%
          </Link>
        )}
      </div>
    </div>
  );
}

function ServicesGrid({ purchasedServiceIds }: { purchasedServiceIds: string[] }) {
  const ownsCore = purchasedServiceIds.includes('business_foundations_pack');

  return (
    <section className="bg-white py-24 px-6">
      <div className="mx-auto" style={{ maxWidth: 960 }}>
        <SectionLabel>OPTIONAL ADD-ONS</SectionLabel>
        <h2
          className="font-inter font-bold text-dark-text"
          style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)' }}
        >
          Choose what fits your business
        </h2>
        <p
          className="font-inter font-normal text-secondary-text mt-3 leading-[1.7]"
          style={{ fontSize: '1rem', maxWidth: 520 }}
        >
          Each add-on is built using the same process as your core pack — your answers, your voice, reviewed before delivery.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {addOnServices.map((s) => (
            <ServiceCard
              key={s.id}
              serviceId={s.id}
              whoFor={s.whoFor}
              ownsCore={ownsCore}
              alreadyOwned={purchasedServiceIds.includes(s.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── 5. Bundle Pricing Comparison Section ─── */

function BundlePricing({ purchasedServiceIds }: { purchasedServiceIds: string[] }) {
  const ownsCore = purchasedServiceIds.includes('business_foundations_pack');

  // Build bundle combinations from the catalog
  const bundles: { label: string; serviceIds: string[]; subtotal: number; discountPercentage: number; discountAmount: number; total: number }[] = [];

  const coreService = getServiceById('business_foundations_pack');
  const websiteService = getServiceById('website_copy_pack');
  const socialService = getServiceById('social_media_pack');

  if (coreService && websiteService) {
    const calc = calculateTotal(['business_foundations_pack', 'website_copy_pack']);
    bundles.push({
      label: 'Documents + Website Copy',
      serviceIds: ['business_foundations_pack', 'website_copy_pack'],
      subtotal: calc.subtotal,
      discountPercentage: calc.discountPercentage,
      discountAmount: calc.discountAmount,
      total: calc.total,
    });
  }

  if (coreService && socialService) {
    const calc = calculateTotal(['business_foundations_pack', 'social_media_pack']);
    bundles.push({
      label: 'Documents + Social Media',
      serviceIds: ['business_foundations_pack', 'social_media_pack'],
      subtotal: calc.subtotal,
      discountPercentage: calc.discountPercentage,
      discountAmount: calc.discountAmount,
      total: calc.total,
    });
  }

  if (coreService && websiteService && socialService) {
    const calc = calculateTotal(['business_foundations_pack', 'website_copy_pack', 'social_media_pack']);
    bundles.push({
      label: 'All Three Services',
      serviceIds: ['business_foundations_pack', 'website_copy_pack', 'social_media_pack'],
      subtotal: calc.subtotal,
      discountPercentage: calc.discountPercentage,
      discountAmount: calc.discountAmount,
      total: calc.total,
    });
  }

  if (bundles.length === 0) return null;

  return (
    <section className="bg-off-white py-20 px-6">
      <div className="mx-auto" style={{ maxWidth: 960 }}>
        <SectionLabel>BUNDLE SAVINGS</SectionLabel>
        <h2
          className="font-inter font-bold text-dark-text"
          style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)' }}
        >
          Buy together and save
        </h2>
        <p
          className="font-inter font-normal text-secondary-text mt-3 leading-[1.7]"
          style={{ fontSize: '1rem', maxWidth: 560 }}
        >
          Combine services and the discount is applied automatically at checkout.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {bundles.map((bundle) => {
            const userOwnsCore = ownsCore;
            const allOwned = bundle.serviceIds.every((id) => purchasedServiceIds.includes(id));
            const checkoutIds = userOwnsCore
              ? bundle.serviceIds.filter((id) => id !== 'business_foundations_pack')
              : bundle.serviceIds;
            const calcForUser = calculateTotal(checkoutIds);

            if (allOwned) {
              return (
                <div
                  key={bundle.label}
                  className="bg-white border-2 border-success rounded-2xl p-8 text-center relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 bg-success text-white font-inter font-semibold px-4 py-1.5 rounded-bl-xl" style={{ fontSize: '0.75rem' }}>
                    OWNED
                  </div>
                  <h3 className="font-inter font-bold text-dark-text" style={{ fontSize: '1.05rem' }}>
                    {bundle.label}
                  </h3>
                  <p className="font-inter font-normal text-secondary-text mt-2" style={{ fontSize: '0.85rem' }}>
                    You own all services in this bundle.
                  </p>
                  <div className="flex items-center justify-center gap-2 mt-4">
                    <Check size={18} className="text-success" />
                    <span className="font-inter font-semibold text-success" style={{ fontSize: '0.9rem' }}>
                      Complete
                    </span>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={bundle.label}
                className="bg-white border border-border rounded-2xl p-8 text-center hover:border-medium-blue hover:shadow-[0_8px_32px_rgba(27,63,122,0.08)] transition-all duration-200"
              >
                {bundle.discountAmount > 0 && (
                  <span
                    className="inline-block bg-green-50 border border-green-200 text-green-800 font-inter font-bold rounded-full mb-4"
                    style={{ padding: '3px 12px', fontSize: '0.8rem' }}
                  >
                    Save £{bundle.discountAmount.toFixed(0)} ({bundle.discountPercentage}%)
                  </span>
                )}
                <h3 className="font-inter font-bold text-dark-text" style={{ fontSize: '1.05rem' }}>
                  {bundle.label}
                </h3>

                <div className="mt-4">
                  <span
                    className="font-inter font-extrabold text-navy block"
                    style={{ fontSize: '2rem', lineHeight: 1.2 }}
                  >
                    £{calcForUser.total.toFixed(0)}
                  </span>
                  {bundle.discountAmount > 0 && (
                    <span className="font-inter font-normal text-secondary-text block mt-1" style={{ fontSize: '0.85rem' }}>
                      <span className="line-through">£{bundle.subtotal.toFixed(0)}</span>
                      {userOwnsCore && !allOwned ? ' (core pack already owned)' : ''}
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-1.5 mt-4 text-left">
                  {bundle.serviceIds.map((serviceId) => {
                    const svc = getServiceById(serviceId);
                    const owned = purchasedServiceIds.includes(serviceId);
                    return (
                      <div key={serviceId} className="flex items-center gap-2">
                        {owned ? (
                          <Check size={14} className="text-success shrink-0" />
                        ) : (
                          <span className="text-medium-blue font-bold shrink-0" style={{ fontSize: '0.75rem' }}>+</span>
                        )}
                        <span
                          className={`font-inter font-medium ${owned ? 'text-success' : 'text-dark-text'}`}
                          style={{ fontSize: '0.85rem' }}
                        >
                          {svc?.name ?? serviceId} {owned && '(owned)'}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <Link
                  href={`/checkout?services=${checkoutIds.join(',')}`}
                  className="w-full mt-6 text-center font-inter font-bold text-white bg-navy rounded-lg hover:bg-medium-blue transition-colors duration-200 flex items-center justify-center gap-2"
                  style={{ padding: '12px 20px', fontSize: '0.9rem', minHeight: 44 }}
                >
                  <ShoppingCart size={16} />
                  Get this bundle — £{calcForUser.total.toFixed(0)}
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─── 6. How Add-ons Fit With the Core Pack ─── */

function AddonsContext() {
  const points = [
    "You don't need add-ons to be compliant or professional — the core pack covers that completely.",
    'The core pack is a standalone product. Everything in it works together without any extras.',
    'Add-ons are convenience and growth tools — they help you go further, not get started.',
  ];

  return (
    <section className="bg-white py-20 px-6">
      <div className="mx-auto" style={{ maxWidth: 760 }}>
        <SectionLabel>HOW IT ALL FITS TOGETHER</SectionLabel>
        <h2
          className="font-inter font-bold text-dark-text"
          style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)' }}
        >
          Add-ons extend. They don't complete.
        </h2>
        <p
          className="font-inter font-normal text-secondary-text mt-3 leading-[1.7]"
          style={{ fontSize: '1rem', maxWidth: 560 }}
        >
          The Business Foundations Pack gives you everything required to operate professionally and protect yourself. These services are for when you want to build on that foundation — not fill gaps in it.
        </p>

        <div className="flex flex-col gap-4 mt-10">
          {points.map((p) => (
            <div
              key={p}
              className="bg-off-white rounded-xl border border-border p-6 flex items-start gap-4"
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white font-inter font-bold shrink-0"
                style={{
                  fontSize: '0.8rem',
                  background: 'linear-gradient(135deg, #1B3F7A, #2C68C4)',
                }}
              >
                ✓
              </div>
              <p className="font-inter font-medium text-dark-text leading-[1.6]" style={{ fontSize: '0.95rem' }}>
                {p}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── 7. Final CTA ─── */

function FinalCTA() {
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
          Start with strong foundations.
        </h2>
        <p
          className="font-inter font-normal mt-4 leading-[1.7]"
          style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.85)' }}
        >
          You can always add more later. Most clients start with the core pack and decide from there.
        </p>
        <Link
          href="/pricing"
          className="inline-block font-inter font-bold text-navy bg-white rounded-lg hover:bg-[rgba(255,255,255,0.92)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.2)] transition-all duration-200 mt-10"
          style={{ padding: '18px 40px', fontSize: '1rem', minHeight: 48 }}
        >
          View the Business Foundations Pack
        </Link>
        <div className="mt-5">
          <Link
            href="/how-it-works"
            className="font-inter font-medium hover:underline"
            style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)' }}
          >
            How the process works →
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ─── Main Client Component ─── */

export default function AdditionalServicesClient() {
  const { user, loading: authLoading } = useAuth();
  const { purchasedServiceIds, loading: profileLoading } = useClientProfile();
  const loading = authLoading || profileLoading;

  if (loading) {
    return (
      <>
        <PageHeader />
        <CoreMessage />
        <div className="bg-white py-24 px-6 flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-navy" />
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader />
      <CoreMessage />
      <ReturningCustomerBanner purchasedServiceIds={purchasedServiceIds} />
      <ServicesGrid purchasedServiceIds={purchasedServiceIds} />
      <BundlePricing purchasedServiceIds={purchasedServiceIds} />
      <AddonsContext />
      <FinalCTA />
    </>
  );
}
