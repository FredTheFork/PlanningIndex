'use client';

import Link from 'next/link';
import { Crown, Check, ShoppingCart, Package, Camera, Users, Briefcase, HardHat } from 'lucide-react';
import { getServicesByTier, getServiceGroupById, getServicesInGroup } from '@/lib/services/service-catalog';

const industryConfig = {
  photographer: { icon: Camera, label: 'Photographers', color: '#d97706' },
  coach: { icon: Users, label: 'Coaches', color: '#2563eb' },
  consultant: { icon: Briefcase, label: 'Consultants', color: '#059669' },
  contractor: { icon: HardHat, label: 'Contractors', color: '#dc2623' },
};

export default function IndustryTierPage() {
  const industryServices = getServicesByTier('industry');

  // Get bundles for each industry
  const photographerBundle = getServiceGroupById('photographer_full_bundle');
  const coachBundle = getServiceGroupById('coach_full_bundle');
  const consultantBundle = getServiceGroupById('consultant_full_bundle');
  const contractorBundle = getServiceGroupById('contractor_full_bundle');

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
              style={{ background: 'linear-gradient(135deg, #F59E0B, #FBBF24)' }}
            >
              <Crown size={24} className="text-white" />
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
            INDUSTRY TIER
          </span>
          <h1
            className="font-inter font-extrabold text-white mt-3"
            style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', lineHeight: 1.2 }}
          >
            Dominate your profession
          </h1>
          <p
            className="font-inter font-normal mx-auto mt-4 leading-[1.7]"
            style={{
              fontSize: '1.05rem',
              color: 'rgba(255,255,255,0.85)',
              maxWidth: 550,
            }}
          >
            Industry-specific documents designed for how you actually work. Pick your profession and see exactly what you need.
          </p>
        </div>
      </section>

      {/* Industry Cards */}
      <section className="bg-white py-20 px-6">
        <div className="mx-auto" style={{ maxWidth: 1100 }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {industryServices.map((service) => {
              const industryKey = (service.industry || 'photographer') as keyof typeof industryConfig;
              const config = industryConfig[industryKey];
              const Icon = config?.icon || Crown;
              const bundleMap: Record<string, typeof photographerBundle> = {
                photographer: photographerBundle,
                coach: coachBundle,
                consultant: consultantBundle,
                contractor: contractorBundle,
              };
              const bundle = service.industry ? bundleMap[service.industry] : null;

              const bundleServices = bundle ? getServicesInGroup(bundle.id) : [];
              const bundlePrice = bundleServices.reduce((sum, s) => sum + s.price, 0);
              const discountedPrice = bundle ? bundlePrice * (1 - bundle.discountPercent / 100) : 0;

              return (
                <div
                  key={service.id}
                  className="bg-off-white rounded-2xl border-2 p-8 hover:shadow-lg transition-all duration-200"
                  style={{ borderColor: config?.color || '#d97706' }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: config?.color || '#d97706' }}
                    >
                      <Icon size={18} className="text-white" />
                    </div>
                    <div>
                      <span className="font-inter font-bold text-dark-text block" style={{ fontSize: '1.2rem' }}>
                        {config?.label || service.name}
                      </span>
                      <span className="font-inter text-secondary-text" style={{ fontSize: '0.85rem' }}>
                        {service.priceLabel}
                      </span>
                    </div>
                  </div>

                  <p className="font-inter font-normal text-secondary-text leading-[1.6]" style={{ fontSize: '0.9rem' }}>
                    {service.shortDescription}
                  </p>

                  <div className="mt-4">
                    <span className="font-inter font-medium text-dark-text" style={{ fontSize: '0.85rem' }}>
                      {service.includes.length} documents:
                    </span>
                    <ul className="grid grid-cols-2 gap-1.5 mt-2">
                      {service.includes.slice(0, 6).map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check size={12} className="text-success shrink-0 mt-0.5" />
                          <span className="font-inter text-secondary-text" style={{ fontSize: '0.8rem' }}>{item}</span>
                        </li>
                      ))}
                    </ul>
                    {service.includes.length > 6 && (
                      <span className="font-inter text-medium-blue mt-2 block" style={{ fontSize: '0.8rem' }}>
                        +{service.includes.length - 6} more
                      </span>
                    )}
                  </div>

                  <div className="flex gap-3 mt-6">
                    <Link
                      href={`/checkout?services=${service.id}`}
                      className="flex-1 text-center font-inter font-semibold text-white rounded-lg transition-colors text-sm py-2.5"
                      style={{ background: config?.color || '#d97706' }}
                    >
                      Get this pack
                    </Link>
                    <Link
                      href={`/for/${service.industry}`}
                      className="font-inter font-medium text-medium-blue hover:text-navy transition-colors text-sm py-2.5 px-4"
                    >
                      Learn more
                    </Link>
                  </div>

                  {bundle && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <Link
                        href={`/checkout?services=${bundle.serviceIds.join(',')}`}
                        className="flex items-center justify-between bg-green-50 rounded-lg p-3 hover:bg-green-100 transition-colors"
                      >
                        <div>
                          <span className="font-inter font-medium text-dark-text block" style={{ fontSize: '0.85rem' }}>
                            Complete Bundle
                          </span>
                          <span className="font-inter text-secondary-text" style={{ fontSize: '0.75rem' }}>
                            Ops + {config?.label} pack
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="font-inter text-secondary-text line-through text-xs">
                            £{bundlePrice.toFixed(0)}
                          </span>
                          <span className="font-inter font-bold text-success ml-2" style={{ fontSize: '0.95rem' }}>
                            £{discountedPrice.toFixed(0)}
                          </span>
                        </div>
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Complete Infrastructure Bundle */}
      <section className="py-16 px-6" style={{ background: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)' }}>
        <div className="mx-auto" style={{ maxWidth: 800 }}>
          <div className="text-center text-white">
            <Crown size={32} className="mx-auto mb-4" />
            <h2 className="font-inter font-bold" style={{ fontSize: '1.6rem' }}>
              Complete Infrastructure Bundle
            </h2>
            <p className="font-inter font-normal mt-3 leading-[1.6]" style={{ fontSize: '1rem', opacity: 0.95 }}>
              Every pack we offer. The full business infrastructure, built for you.
            </p>
            <Link
              href="/checkout?services=business_foundations_pack,website_copy_pack,social_media_pack,client_onboarding_pack,payment_protection_pack,copyright_licensing_pack,gdpr_deep_pack,coach_industry_pack,photographer_industry_pack,consultant_industry_pack,contractor_industry_pack"
              className="inline-block font-inter font-bold text-amber-600 bg-white rounded-lg hover:bg-amber-50 transition-colors mt-6"
              style={{ padding: '14px 32px', fontSize: '0.95rem' }}
            >
              View Complete Bundle
            </Link>
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
