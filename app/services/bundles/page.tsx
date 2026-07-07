'use client';

import Link from 'next/link';
import { Package, Check, ArrowRight } from 'lucide-react';
import { serviceGroups, getServicesInGroup, getServiceById } from '@/lib/services/service-catalog';

export default function BundlesPage() {
  const bundles = serviceGroups;

  return (
    <>
      {/* Hero */}
      <section
        className="text-center px-6"
        style={{
          padding: '80px 0 72px',
          background: 'linear-gradient(135deg, #38A169 0%, #48BB78 100%)',
        }}
      >
        <div className="mx-auto" style={{ maxWidth: 800 }}>
          <div style={{ paddingTop: 'clamp(80px, 10vw, 128px)' }}>
            <div className="flex items-center justify-center gap-2 mb-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(255,255,255,0.2)' }}
              >
                <Package size={24} className="text-white" />
              </div>
            </div>
            <span
              className="font-inter font-semibold uppercase block"
              style={{
                fontSize: '0.75rem',
                letterSpacing: '0.15em',
                color: 'rgba(255,255,255,0.8)',
                marginTop: '12px',
              }}
            >
              BUNDLE & SAVE
            </span>
            <h1
              className="font-inter font-extrabold text-white mt-3"
              style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', lineHeight: 1.2 }}
            >
              Pre-built bundles. Up to 25% off.
            </h1>
            <p
              className="font-inter font-normal mx-auto mt-4 leading-[1.7]"
              style={{
                fontSize: '1.05rem',
                color: 'rgba(255,255,255,0.9)',
                maxWidth: 550,
              }}
            >
              Get everything you need in one click. Our most popular combinations, pre-built for you.
            </p>
          </div>
        </div>
      </section>

      {/* All Bundles */}
      <section className="bg-white py-20 px-6">
        <div className="mx-auto" style={{ maxWidth: 1100 }}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bundles.map((bundle) => {
              const services = getServicesInGroup(bundle.id);
              const bundlePrice = services.reduce((sum, s) => sum + s.price, 0);
              const discountedPrice = bundlePrice * (1 - bundle.discountPercent / 100);
              const savings = bundlePrice - discountedPrice;

              return (
                <div
                  key={bundle.id}
                  className="bg-off-white rounded-2xl border-2 border-success/30 p-6 hover:shadow-lg hover:border-success transition-all duration-200 flex flex-col"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-inter font-semibold text-dark-text" style={{ fontSize: '1.1rem' }}>
                      {bundle.name}
                    </h3>
                    {bundle.badge && (
                      <span
                        className="font-inter font-semibold rounded-full"
                        style={{
                          background: bundle.discountPercent >= 20 ? '#F59E0B' : '#38A169',
                          color: '#fff',
                          padding: '4px 10px',
                          fontSize: '0.7rem',
                        }}
                      >
                        {bundle.badge}
                      </span>
                    )}
                  </div>

                  <p className="font-inter font-normal text-secondary-text" style={{ fontSize: '0.9rem' }}>
                    {bundle.description}
                  </p>

                  <div className="mt-4 flex items-baseline gap-3">
                    <span className="font-inter text-secondary-text line-through" style={{ fontSize: '1rem' }}>
                      £{bundlePrice.toFixed(0)}
                    </span>
                    <span className="font-inter font-bold text-navy" style={{ fontSize: '1.4rem' }}>
                      £{discountedPrice.toFixed(0)}
                    </span>
                  </div>

                  <span className="font-inter font-semibold text-success mt-1" style={{ fontSize: '0.85rem' }}>
                    Save £{savings.toFixed(0)} ({bundle.discountPercent}% off)
                  </span>

                  <div className="border-t border-border my-4" />

                  <div className="flex-1">
                    <span className="font-inter font-medium text-dark-text block mb-2" style={{ fontSize: '0.85rem' }}>
                      Includes {services.length} packs:
                    </span>
                    <ul className="space-y-1.5">
                      {services.slice(0, 5).map((s) => (
                        <li key={s.id} className="flex items-center gap-2">
                          <Check size={14} className="text-success shrink-0" />
                          <span className="font-inter text-secondary-text" style={{ fontSize: '0.85rem' }}>
                            {s.name}
                          </span>
                        </li>
                      ))}
                      {services.length > 5 && (
                        <li className="font-inter text-medium-blue" style={{ fontSize: '0.85rem' }}>
                          +{services.length - 5} more packs
                        </li>
                      )}
                    </ul>
                  </div>

                  <Link
                    href={`/checkout?services=${bundle.serviceIds.join(',')}`}
                    className="w-full mt-5 text-center font-inter font-semibold text-white bg-success rounded-lg hover:bg-[#2d8659] transition-colors flex items-center justify-center gap-2"
                    style={{ padding: '12px', fontSize: '0.95rem' }}
                  >
                    <Package size={16} />
                    Get this bundle
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Custom Bundle CTA */}
      <section className="bg-off-white py-16 px-6">
        <div className="mx-auto text-center" style={{ maxWidth: 600 }}>
          <h2 className="font-inter font-bold text-dark-text" style={{ fontSize: '1.5rem' }}>
            Want to build your own?
          </h2>
          <p className="font-inter font-normal text-secondary-text mt-3 leading-[1.6]" style={{ fontSize: '0.95rem' }}>
            Mix and match any packs. Get 10% off 2 packs, 15% off 3 or more. No code needed.
          </p>
          <Link
            href="/checkout"
            className="inline-flex items-center gap-2 font-inter font-semibold text-navy border-2 border-navy rounded-lg hover:bg-navy hover:text-white transition-colors mt-6"
            style={{ padding: '14px 32px', fontSize: '0.95rem' }}
          >
            Build your bundle <ArrowRight size={16} />
          </Link>
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
