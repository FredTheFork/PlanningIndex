'use client';

import Link from 'next/link';
import { useInView } from '@/hooks/useInView';
import { Star, Briefcase, Crown, Check } from 'lucide-react';
import {
  getServicesByTier,
  getServiceGroupById,
  getServicesInGroup,
  calculateTotal,
  type ServiceTier,
} from '@/lib/services/service-catalog';

interface TierCardProps {
  tier: ServiceTier;
  label: string;
  icon: typeof Star;
  headline: string;
  description: string;
  startingPrice: string;
  colorScheme: {
    border: string;
    background: string;
    headerBg: string;
    badge: string;
    accent: string;
  };
  isMostPopular?: boolean;
}

function TierCard({ tier, label, icon: Icon, headline, description, startingPrice, colorScheme, isMostPopular }: TierCardProps) {
  const services = getServicesByTier(tier).filter(s => s.id !== 'monthly_care_plan' && s.id !== 'quarterly_refresh');

  return (
    <div
      className="rounded-xl flex flex-col relative overflow-hidden transition-all duration-200"
      style={{
        border: `2px solid ${colorScheme.border}`,
        background: colorScheme.background,
      }}
    >
      {isMostPopular && (
        <div
          className="absolute -top-0.5 left-1/2 -translate-x-1/2 font-inter font-semibold rounded-b-lg z-10"
          style={{
            background: colorScheme.badge,
            color: '#fff',
            padding: '4px 16px',
            fontSize: '0.7rem',
            letterSpacing: '0.05em',
          }}
        >
          MOST POPULAR
        </div>
      )}

      <div
        className="flex items-center gap-3 p-5"
        style={{ background: colorScheme.headerBg }}
      >
        <Icon size={20} className="text-white" />
        <div>
          <span className="font-inter font-semibold text-white/70 uppercase" style={{ fontSize: '0.65rem', letterSpacing: '0.1em' }}>
            Tier {tier === 'foundation' ? '1' : tier === 'operations' ? '2' : '3'}
          </span>
          <h3 className="font-inter font-bold text-white" style={{ fontSize: '1.1rem' }}>
            {label}
          </h3>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <h4 className="font-inter font-semibold text-dark-text" style={{ fontSize: '1rem' }}>
          {headline}
        </h4>
        <p className="font-inter font-normal text-secondary-text mt-2 leading-[1.5]" style={{ fontSize: '0.85rem' }}>
          {description}
        </p>

        <div className="flex items-baseline gap-1 mt-4">
          <span className="font-inter font-bold text-navy" style={{ fontSize: '1.5rem' }}>
            {startingPrice}
          </span>
          <span className="font-inter font-normal text-secondary-text" style={{ fontSize: '0.85rem' }}>
            starting price
          </span>
        </div>

        <div className="border-t border-border my-4" />

        <div className="flex-1">
          <span className="font-inter font-medium text-dark-text" style={{ fontSize: '0.85rem' }}>
            {services.length} packs included:
          </span>
          <ul className="mt-3 space-y-2">
            {services.slice(0, 4).map((service) => (
              <li key={service.id} className="flex items-start gap-2">
                <Check size={14} className="text-success shrink-0 mt-0.5" />
                <div>
                  <span className="font-inter font-medium text-dark-text" style={{ fontSize: '0.8rem' }}>
                    {service.name}
                  </span>
                  {service.badge && (
                    <span
                      className="font-inter font-semibold rounded-full ml-1"
                      style={{
                        background: colorScheme.accent,
                        color: '#fff',
                        padding: '1px 6px',
                        fontSize: '0.6rem',
                      }}
                    >
                      {service.badge}
                    </span>
                  )}
                </div>
              </li>
            ))}
            {services.length > 4 && (
              <li className="font-inter font-medium text-medium-blue" style={{ fontSize: '0.8rem' }}>
                +{services.length - 4} more packs
              </li>
            )}
          </ul>
        </div>

        <Link
          href={`/services#${tier}`}
          className="mt-4 text-center font-inter font-semibold rounded-lg transition-colors"
          style={{
            padding: '12px 20px',
            fontSize: '0.9rem',
            background: colorScheme.accent,
            color: '#fff',
          }}
        >
          Explore {label} packs
        </Link>
      </div>
    </div>
  );
}

export default function Pricing() {
  const [ref, inView] = useInView(0.08);

  const bundles = [
    { id: 'foundation_bundle', label: 'Foundation Bundle' },
    { id: 'full_operations_bundle', label: 'Operations Bundle' },
    { id: 'complete_infrastructure_bundle', label: 'Complete Bundle' },
  ];

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
            Three tiers. Every protection you need.
          </h2>
          <p
            className="font-inter font-normal text-secondary-text mt-3 leading-[1.7]"
            style={{ fontSize: '1.05rem', maxWidth: 600, marginLeft: 'auto', marginRight: 'auto' }}
          >
            From launching your business to dominating your industry. Start where you are, scale when you&apos;re ready.
          </p>
        </div>

        {/* Tier Pricing Grid */}
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
          <div
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? 'translateY(0)' : 'translateY(28px)',
              transition: 'opacity 0.55s ease, transform 0.55s ease',
            }}
          >
            <TierCard
              tier="foundation"
              label="Foundation"
              icon={Star}
              headline="Start Your Business"
              description="Core documents, website copy, and social media. Everything to launch professionally."
              startingPrice="£79"
              colorScheme={{
                border: '#E2E8F0',
                background: '#ffffff',
                headerBg: 'linear-gradient(135deg, #1B3F7A, #2C68C4)',
                badge: '#1B3F7A',
                accent: '#1B3F7A',
              }}
            />
          </div>

          <div
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? 'translateY(0)' : 'translateY(28px)',
              transition: 'opacity 0.55s ease 80ms, transform 0.55s ease 80ms',
            }}
          >
            <TierCard
              tier="operations"
              label="Operations"
              icon={Briefcase}
              headline="Run Your Business"
              description="Client onboarding, payment protection, GDPR, and IP rights. Protect what you build."
              startingPrice="£149"
              colorScheme={{
                border: '#2C68C4',
                background: '#f8faff',
                headerBg: 'linear-gradient(135deg, #2C68C4, #4A90E2)',
                badge: '#2C68C4',
                accent: '#2C68C4',
              }}
              isMostPopular
            />
          </div>

          <div
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? 'translateY(0)' : 'translateY(28px)',
              transition: 'opacity 0.55s ease 160ms, transform 0.55s ease 160ms',
            }}
          >
            <TierCard
              tier="industry"
              label="Industry"
              icon={Crown}
              headline="Dominate Your Industry"
              description="Profession-specific documents for coaches, photographers, consultants, and contractors."
              startingPrice="£199"
              colorScheme={{
                border: '#F59E0B',
                background: '#fffbeb',
                headerBg: 'linear-gradient(135deg, #F59E0B, #FBBF24)',
                badge: '#F59E0B',
                accent: '#F59E0B',
              }}
            />
          </div>
        </div>

        {/* Bundle Savings Section */}
        <div
          className="rounded-xl p-10"
          style={{ background: '#d4f4e1' }}
        >
          <div className="text-center mb-8">
            <h3 className="font-inter font-bold text-dark-text mb-2" style={{ fontSize: '1.25rem' }}>
              Save More with Bundles
            </h3>
            <p className="font-inter font-normal text-secondary-text" style={{ fontSize: '0.95rem' }}>
              Pre-configured bundles with up to 25% off. Get everything you need in one click.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {bundles.map(({ id, label }) => {
              const bundle = getServiceGroupById(id);
              if (!bundle) return null;
              const services = getServicesInGroup(id);

              return (
                <div key={id} className="bg-white rounded-lg p-5 border border-success/30">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-inter font-semibold text-dark-text" style={{ fontSize: '1rem' }}>
                      {bundle.name}
                    </h4>
                    {bundle.badge && (
                      <span
                        className="font-inter font-semibold rounded-full"
                        style={{
                          background: '#38A169',
                          color: '#fff',
                          padding: '2px 8px',
                          fontSize: '0.65rem',
                        }}
                      >
                        {bundle.badge}
                      </span>
                    )}
                  </div>
                  <p className="font-inter font-normal text-secondary-text mb-4" style={{ fontSize: '0.85rem' }}>
                    {bundle.description}
                  </p>
                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <span className="font-inter font-bold text-success" style={{ fontSize: '1rem' }}>
                      {bundle.discountPercent}% off
                    </span>
                    <Link
                      href={`/checkout?services=${bundle.serviceIds.join(',')}`}
                      className="font-inter font-semibold text-white bg-success rounded-lg hover:bg-[#2d8659] transition-colors text-sm py-2 px-4"
                    >
                      Get bundle
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-8">
            <Link
              href="/services#bundles"
              className="inline-block font-inter font-semibold text-success bg-white border border-success rounded-lg hover:bg-success/5 transition-colors"
              style={{ padding: '14px 32px', fontSize: '0.95rem' }}
            >
              See all 9 bundles
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
