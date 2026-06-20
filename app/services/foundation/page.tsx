'use client';

import Link from 'next/link';
import { Star, Check, ShoppingCart, Package } from 'lucide-react';
import { getServicesByTier, getServiceGroupById, getServicesInGroup, getServiceById } from '@/lib/services/service-catalog';

export default function FoundationTierPage() {
  const foundationServices = getServicesByTier('foundation').filter(s => s.mode !== 'subscription');
  const foundationBundle = getServiceGroupById('foundation_bundle');
  const monthlyCarePlan = getServiceById('monthly_care_plan');

  if (!foundationBundle) return null;

  const bundleServices = getServicesInGroup(foundationBundle.id);
  const bundlePrice = bundleServices.reduce((sum, s) => sum + s.price, 0);
  const discountedPrice = bundlePrice * (1 - foundationBundle.discountPercent / 100);

  return (
    <>
      {/* Hero */}
      <section
        className="text-center px-6"
        style={{
          padding: '80px 0 72px',
          background: 'linear-gradient(135deg, #1B3F7A 0%, #2C68C4 100%)',
        }}
      >
        <div className="mx-auto" style={{ maxWidth: 800 }}>
          <div className="flex items-center justify-center gap-2 mb-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.15)' }}
            >
              <Star size={24} className="text-white" />
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
            FOUNDATION TIER
          </span>
          <h1
            className="font-inter font-extrabold text-white mt-3"
            style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', lineHeight: 1.2 }}
          >
            Start your business professionally
          </h1>
          <p
            className="font-inter font-normal mx-auto mt-4 leading-[1.7]"
            style={{
              fontSize: '1.05rem',
              color: 'rgba(255,255,255,0.85)',
              maxWidth: 550,
            }}
          >
            Everything you need to launch. Documents, website copy, and social media — all done for you, delivered within days.
          </p>
        </div>
      </section>

      {/* Service Cards */}
      <section className="bg-white py-20 px-6">
        <div className="mx-auto" style={{ maxWidth: 1100 }}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {foundationServices.map((service) => (
              <div
                key={service.id}
                className="bg-off-white rounded-2xl border-2 border-slate-200 p-6 flex flex-col hover:shadow-lg transition-all duration-200"
              >
                {service.badge && (
                  <span
                    className="font-inter font-semibold rounded-full self-start mb-3"
                    style={{
                      background: '#38A169',
                      color: '#fff',
                      padding: '4px 12px',
                      fontSize: '0.7rem',
                    }}
                  >
                    {service.badge}
                  </span>
                )}

                <h3 className="font-inter font-semibold text-dark-text" style={{ fontSize: '1.1rem' }}>
                  {service.name}
                </h3>
                <p
                  className="font-inter font-normal text-secondary-text mt-2 leading-[1.6]"
                  style={{ fontSize: '0.9rem' }}
                >
                  {service.shortDescription}
                </p>

                <div className="mt-4">
                  <span className="font-inter font-bold text-navy" style={{ fontSize: '1.3rem' }}>
                    {service.priceLabel}
                  </span>
                </div>

                <div className="border-t border-border my-4" />

                <ul className="space-y-2 flex-1">
                  {service.includes.slice(0, 5).map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check size={14} className="text-success shrink-0 mt-0.5" />
                      <span className="font-inter font-normal text-secondary-text" style={{ fontSize: '0.85rem' }}>
                        {item}
                      </span>
                    </li>
                  ))}
                  {service.includes.length > 5 && (
                    <li className="font-inter font-medium text-medium-blue" style={{ fontSize: '0.85rem' }}>
                      +{service.includes.length - 5} more items
                    </li>
                  )}
                </ul>

                <Link
                  href={`/checkout?services=${service.id}`}
                  className="w-full mt-5 text-center font-inter font-semibold text-white bg-navy rounded-lg hover:bg-medium-blue transition-colors flex items-center justify-center gap-2"
                  style={{ padding: '12px', fontSize: '0.9rem' }}
                >
                  <ShoppingCart size={16} />
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
                {foundationBundle.badge || 'BEST VALUE'}
              </span>
            </div>
            <h2 className="font-inter font-bold text-dark-text" style={{ fontSize: '1.4rem' }}>
              {foundationBundle.name}
            </h2>
            <p className="font-inter font-normal text-secondary-text mt-2 leading-[1.6]" style={{ fontSize: '0.95rem' }}>
              {foundationBundle.description}
            </p>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mt-6 pt-6 border-t border-border">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-inter text-secondary-text line-through" style={{ fontSize: '1rem' }}>
                    £{bundlePrice.toFixed(0)}
                  </span>
                  <span className="font-inter font-bold text-success" style={{ fontSize: '1.5rem' }}>
                    £{discountedPrice.toFixed(0)}
                  </span>
                </div>
                <span className="font-inter font-semibold text-navy bg-green-100 rounded-full px-3 py-1" style={{ fontSize: '0.8rem' }}>
                  {foundationBundle.discountPercent}% off - save £{(bundlePrice - discountedPrice).toFixed(0)}
                </span>
              </div>
              <Link
                href={`/checkout?services=${foundationBundle.serviceIds.join(',')}`}
                className="inline-flex items-center gap-2 font-inter font-semibold text-white bg-success rounded-lg hover:bg-[#2d8659] transition-colors"
                style={{ padding: '14px 28px', fontSize: '0.95rem' }}
              >
                <Package size={18} />
                Get the bundle
              </Link>
            </div>

            <div className="mt-6 pt-4 border-t border-border">
              <span className="font-inter font-medium text-dark-text block mb-3" style={{ fontSize: '0.9rem' }}>
                Includes:
              </span>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {bundleServices.map((s) => (
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

      {/* Monthly Care Plan */}
      {monthlyCarePlan && (
        <section className="bg-off-white py-16 px-6">
          <div className="mx-auto" style={{ maxWidth: 800 }}>
            <div className="bg-white rounded-2xl border border-border p-6 flex flex-col md:flex-row items-start gap-6">
              <div className="flex-1">
                <h3 className="font-inter font-bold text-dark-text" style={{ fontSize: '1.2rem' }}>
                  {monthlyCarePlan.name}
                </h3>
                <p className="font-inter font-normal text-secondary-text mt-2 leading-[1.6]" style={{ fontSize: '0.9rem' }}>
                  {monthlyCarePlan.shortDescription} Cancel anytime.
                </p>
                <div className="mt-4 flex flex-col gap-2">
                  {monthlyCarePlan.includes.slice(0, 4).map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <Check size={14} className="text-success" />
                      <span className="font-inter text-secondary-text" style={{ fontSize: '0.85rem' }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="md:text-right flex flex-col items-start md:items-end gap-3">
                <span className="font-inter font-bold text-navy" style={{ fontSize: '1.4rem' }}>
                  {monthlyCarePlan.priceLabel}
                </span>
                <Link
                  href={`/checkout?services=${monthlyCarePlan.id}`}
                  className="font-inter font-semibold text-navy border-2 border-navy rounded-lg hover:bg-navy hover:text-white transition-colors"
                  style={{ padding: '10px 20px', fontSize: '0.9rem' }}
                >
                  Add to any pack
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

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
