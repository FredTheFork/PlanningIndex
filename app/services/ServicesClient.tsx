'use client';

import Link from 'next/link';
import { Check, ShoppingCart, Package, RefreshCw, Shield, Zap, Crown } from 'lucide-react';
import { useInView } from '@/hooks/useInView';
import {
  getServiceById,
  getServiceGroupById,
  getServicesInGroup,
  type ServiceTier,
  type ServiceGroup,
} from '@/lib/services/service-catalog';

/* ─── helpers ─── */

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

/* ─── data from service catalog ─── */

const foundationServices = [
  getServiceById('business_foundations_pack'),
  getServiceById('website_copy_pack'),
  getServiceById('social_media_pack'),
].filter(Boolean);

const operationsServices = [
  getServiceById('client_onboarding_pack'),
  getServiceById('payment_protection_pack'),
  getServiceById('copyright_licensing_pack'),
  getServiceById('gdpr_deep_pack'),
].filter(Boolean);

const industryServices = [
  { service: getServiceById('coach_industry_pack'), label: 'Coaches' },
  { service: getServiceById('photographer_industry_pack'), label: 'Photographers' },
  { service: getServiceById('consultant_industry_pack'), label: 'Consultants' },
  { service: getServiceById('contractor_industry_pack'), label: 'Contractors' },
].filter((item): item is { service: NonNullable<typeof item.service>; label: string } => item.service !== null);

const monthlyCarePlan = getServiceById('monthly_care_plan');

const featuredBundleIds = [
  'foundation_bundle',
  'full_operations_bundle',
  'coach_full_bundle',
  'photographer_full_bundle',
  'complete_infrastructure_bundle',
];

const featuredBundles = featuredBundleIds
  .map(id => getServiceGroupById(id))
  .filter((g): g is ServiceGroup => g !== undefined);

/* ─── sections ─── */

function HeroSection() {
  return (
    <section
      className="text-center px-6"
      style={{
        padding: '80px 24px 64px',
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
          YOUR BUSINESS INFRASTRUCTURE
        </span>
        <h1
          className="font-inter font-extrabold text-white mt-3"
          style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', lineHeight: 1.2 }}
        >
          Your Entire Business Infrastructure. Built for you.
        </h1>
        <p
          className="font-inter font-normal mx-auto mt-4 leading-[1.7]"
          style={{
            fontSize: '1.05rem',
            color: 'rgba(255,255,255,0.85)',
            maxWidth: 650,
          }}
        >
          Three tiers. Foundation to start your business, Operations to protect it, and Industry packs to dominate your sector. Start where you are, scale when you&apos;re ready.
        </p>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const steps = [
    { num: '01', title: 'Choose Your Tier', desc: 'Foundation to start, Operations to protect, Industry to dominate. Start where you are.' },
    { num: '02', title: 'We Build Everything', desc: '70+ documents tailored to your business. Done-for-you, in your voice.' },
    { num: '03', title: "You're Protected", desc: 'Legally compliant, professionally presented, and ready to grow.' },
  ];

  return (
    <section className="bg-off-white py-16 px-6">
      <div className="mx-auto" style={{ maxWidth: 960 }}>
        <SectionLabel>HOW IT WORKS</SectionLabel>
        <h2
          className="font-inter font-bold text-dark-text"
          style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}
        >
          Three steps to complete infrastructure
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
          {steps.map((step, i) => (
            <div key={i} className="flex flex-col items-center text-center">
              <div
                className="font-inter font-extrabold text-navy mb-4"
                style={{ fontSize: '2.5rem', opacity: 0.3 }}
              >
                {step.num}
              </div>
              <h3 className="font-inter font-semibold text-dark-text" style={{ fontSize: '1.1rem' }}>
                {step.title}
              </h3>
              <p
                className="font-inter font-normal text-secondary-text mt-2 leading-[1.6]"
                style={{ fontSize: '0.9rem' }}
              >
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FoundationTierSection() {
  const [ref, inView] = useInView(0.1);

  return (
    <section className="py-20 px-6 bg-white">
      <div className="mx-auto" style={{ maxWidth: 1200 }}>
        <SectionLabel>TIER 1 - FOUNDATION</SectionLabel>
        <h2
          className="font-inter font-bold text-dark-text"
          style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)' }}
        >
          Start your business
        </h2>
        <p
          className="font-inter font-normal text-secondary-text mt-3 leading-[1.7]"
          style={{ fontSize: '1rem', maxWidth: 620 }}
        >
          Everything you need to launch professionally. Documents, website copy, and social media - all done for you.
        </p>

        <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {foundationServices.map((service, idx) => {
            if (!service) return null;
            return (
              <div
                key={service.id}
                className="rounded-xl p-6 flex flex-col bg-white border transition-all duration-200"
                style={{
                  borderColor: service.badge ? '#1B3F7A' : '#E2E8F0',
                  borderWidth: service.badge ? 2 : 1,
                  boxShadow: inView ? '0 4px 24px rgba(27,63,122,0.08)' : 'none',
                  opacity: inView ? 1 : 0,
                  transform: inView ? 'translateY(0)' : 'translateY(20px)',
                  transitionDelay: `${idx * 60}ms`,
                }}
              >
                {service.badge && (
                  <span
                    className="font-inter font-semibold rounded-full self-start mb-3"
                    style={{
                      background: '#1B3F7A',
                      color: '#fff',
                      padding: '4px 12px',
                      fontSize: '0.7rem',
                      letterSpacing: '0.05em',
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

                <div className="flex items-baseline gap-2 mt-4">
                  <span className="font-inter font-bold text-navy" style={{ fontSize: '1.25rem' }}>
                    {service.priceLabel}
                  </span>
                </div>

                <div className="border-t border-border my-4" />

                <ul className="space-y-2 flex-1">
                  {service.includes.slice(0, 5).map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-success font-bold shrink-0 text-sm">+</span>
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

                <div className="flex gap-3 mt-6">
                  <Link
                    href={`/checkout?services=${service.id}`}
                    className="flex-1 text-center font-inter font-semibold text-white bg-navy rounded-lg hover:bg-medium-blue transition-colors flex items-center justify-center gap-2"
                    style={{ padding: '12px 16px', fontSize: '0.9rem' }}
                  >
                    <ShoppingCart size={14} />
                    Get this pack
                  </Link>
                  <Link
                    href="#bundles"
                    className="font-inter font-medium text-navy border border-navy rounded-lg hover:bg-off-white transition-colors flex items-center justify-center"
                    style={{ padding: '12px 16px', fontSize: '0.85rem' }}
                  >
                    Bundle
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function OperationsTierSection() {
  const [ref, inView] = useInView(0.1);

  return (
    <section className="py-20 px-6 bg-off-white">
      <div className="mx-auto" style={{ maxWidth: 1200 }}>
        <SectionLabel>TIER 2 - OPERATIONS</SectionLabel>
        <h2
          className="font-inter font-bold text-dark-text"
          style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)' }}
        >
          Run your business
        </h2>
        <p
          className="font-inter font-normal text-secondary-text mt-3 leading-[1.7]"
          style={{ fontSize: '1rem', maxWidth: 700 }}
        >
          Protect your business from the inside out. Client onboarding, payment protection, GDPR compliance, and intellectual property rights.
        </p>

        <div
          className="bg-white rounded-xl p-6 mt-8"
          style={{ borderLeft: '4px solid #2C68C4' }}
        >
          <h3 className="font-inter font-semibold text-dark-text" style={{ fontSize: '0.95rem' }}>
            What Operations protects you from:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {[
              { icon: Shield, text: 'Scope creep from unclear project boundaries' },
              { icon: Zap, text: 'Unpaid invoices and late payment disputes' },
              { icon: RefreshCw, text: 'GDPR violations and data breaches' },
              { icon: Package, text: 'Intellectual property theft and misuse' },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="flex items-center gap-3">
                  <Icon size={16} className="text-medium-blue shrink-0" />
                  <span className="font-inter font-normal text-secondary-text" style={{ fontSize: '0.9rem' }}>
                    {item.text}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {operationsServices.map((service, idx) => {
            if (!service) return null;
            return (
              <div
                key={service.id}
                className="rounded-xl p-6 flex flex-col bg-white border-2 transition-all duration-200 hover:shadow-lg"
                style={{
                  borderColor: '#2C68C4',
                  opacity: inView ? 1 : 0,
                  transform: inView ? 'translateY(0)' : 'translateY(20px)',
                  transitionDelay: `${idx * 60}ms`,
                }}
              >
                {service.badge && (
                  <span
                    className="font-inter font-semibold rounded-full self-start mb-3"
                    style={{
                      background: '#2C68C4',
                      color: '#fff',
                      padding: '4px 12px',
                      fontSize: '0.7rem',
                      letterSpacing: '0.05em',
                    }}
                  >
                    {service.badge}
                  </span>
                )}

                <h3 className="font-inter font-semibold text-dark-text" style={{ fontSize: '1rem' }}>
                  {service.name}
                </h3>

                <div className="flex items-baseline gap-1 mt-3">
                  <span className="font-inter font-bold text-navy" style={{ fontSize: '1.1rem' }}>
                    {service.priceLabel}
                  </span>
                </div>

                <div className="flex gap-2 mt-auto pt-4">
                  <Link
                    href={`/checkout?services=${service.id}`}
                    className="flex-1 text-center font-inter font-medium text-white bg-navy rounded-lg hover:bg-medium-blue transition-colors text-sm py-2"
                  >
                    Get pack
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function IndustryTierSection() {
  const [ref, inView] = useInView(0.1);

  return (
    <section className="py-20 px-6 bg-white">
      <div className="mx-auto" style={{ maxWidth: 1200 }}>
        <SectionLabel>TIER 3 - INDUSTRY</SectionLabel>
        <h2
          className="font-inter font-bold text-dark-text"
          style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)' }}
        >
          Dominate your industry
        </h2>
        <p
          className="font-inter font-normal text-secondary-text mt-3 leading-[1.7]"
          style={{ fontSize: '1rem', maxWidth: 620 }}
        >
          Industry-specific documents for coaches, photographers, consultants, and contractors. Built for your exact profession.
        </p>

        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {industryServices.map(({ service, label }, idx) => {
            return (
              <div
                key={service.id}
                className="rounded-xl p-6 flex flex-col bg-off-white border-2 transition-all duration-200 hover:shadow-lg"
                style={{
                  borderColor: '#F59E0B',
                  opacity: inView ? 1 : 0,
                  transform: inView ? 'translateY(0)' : 'translateY(20px)',
                  transitionDelay: `${idx * 60}ms`,
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Crown size={18} className="text-amber-500" />
                  <span className="font-inter font-semibold text-dark-text">{label}</span>
                </div>

                <h3 className="font-inter font-medium text-dark-text" style={{ fontSize: '0.95rem' }}>
                  {service.name}
                </h3>

                <p
                  className="font-inter font-normal text-secondary-text mt-2 leading-[1.5]"
                  style={{ fontSize: '0.85rem' }}
                >
                  {service.shortDescription}
                </p>

                <div className="flex items-baseline gap-1 mt-4">
                  <span className="font-inter font-bold text-navy" style={{ fontSize: '1.1rem' }}>
                    {service.priceLabel}
                  </span>
                </div>

                <Link
                  href={`/checkout?services=${service.id}`}
                  className="mt-auto text-center font-inter font-medium text-white bg-amber-500 rounded-lg hover:bg-amber-600 transition-colors py-2 mt-4 text-sm"
                >
                  Get this pack
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function MonthlyCarePlanSection() {
  if (!monthlyCarePlan) return null;

  return (
    <section className="py-16 px-6 bg-off-white">
      <div className="mx-auto" style={{ maxWidth: 800 }}>
        <div
          className="rounded-2xl p-8 flex flex-col md:flex-row items-center gap-8"
          style={{ background: 'linear-gradient(135deg, #f0f4ff 0%, #e8f0fe 100%)', border: '2px solid #2C68C4' }}
        >
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <RefreshCw size={20} className="text-medium-blue" />
              <span className="font-inter font-semibold text-medium-blue uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.1em' }}>
                Keep Everything Current
              </span>
            </div>
            <h3 className="font-inter font-bold text-dark-text" style={{ fontSize: '1.4rem' }}>
              {monthlyCarePlan.name}
            </h3>
            <p
              className="font-inter font-normal text-secondary-text mt-3 leading-[1.6]"
              style={{ fontSize: '0.95rem' }}
            >
              {monthlyCarePlan.shortDescription} Cancel anytime.
            </p>
            <ul className="mt-4 space-y-2">
              {monthlyCarePlan.includes.slice(0, 4).map((item, i) => (
                <li key={i} className="flex items-center gap-2">
                  <Check size={14} className="text-success" />
                  <span className="font-inter font-normal text-secondary-text" style={{ fontSize: '0.85rem' }}>
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="text-center md:text-right">
            <div className="font-inter font-bold text-navy" style={{ fontSize: '2rem' }}>
              {monthlyCarePlan.priceLabel}
            </div>
            <p className="font-inter font-normal text-secondary-text mt-1" style={{ fontSize: '0.85rem' }}>
              Cancel anytime
            </p>
            <Link
              href={`/checkout?services=${monthlyCarePlan.id}`}
              className="inline-block font-inter font-semibold text-white bg-navy rounded-lg hover:bg-medium-blue transition-colors mt-4"
              style={{ padding: '14px 28px', fontSize: '0.95rem' }}
            >
              Add to any pack
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function BundleSection() {
  const [ref, inView] = useInView(0.1);

  return (
    <section id="bundles" className="py-20 px-6" style={{ background: '#d4f4e1' }}>
      <div className="mx-auto" style={{ maxWidth: 1200 }}>
        <SectionLabel>BUNDLE & SAVE</SectionLabel>
        <h2
          className="font-inter font-bold text-dark-text"
          style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)' }}
        >
          Pre-configured bundles. Up to 25% off.
        </h2>
        <p
          className="font-inter font-normal text-secondary-text mt-3 leading-[1.7]"
          style={{ fontSize: '1rem', maxWidth: 600 }}
        >
          Get everything you need in one click. Our most popular combinations, pre-built for you.
        </p>

        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {featuredBundles.map((bundle, idx) => {
            const services = getServicesInGroup(bundle.id);
            return (
              <div
                key={bundle.id}
                className="rounded-xl p-6 bg-white border border-success/30 flex flex-col transition-all duration-200"
                style={{
                  opacity: inView ? 1 : 0,
                  transform: inView ? 'translateY(0)' : 'translateY(20px)',
                  transitionDelay: `${idx * 60}ms`,
                }}
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

                <p
                  className="font-inter font-normal text-secondary-text mb-4"
                  style={{ fontSize: '0.9rem' }}
                >
                  {bundle.description}
                </p>

                <div className="text-sm text-secondary-text mb-4">
                  <span className="font-medium text-dark-text">Includes:</span>
                  <ul className="mt-2 space-y-1">
                    {services.slice(0, 4).map((s) => (
                      <li key={s.id} className="flex items-center gap-2">
                        <Check size={12} className="text-success" />
                        <span className="text-xs">{s.name}</span>
                      </li>
                    ))}
                    {services.length > 4 && (
                      <li className="text-xs text-medium-blue">+{services.length - 4} more packs</li>
                    )}
                  </ul>
                </div>

                <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
                  <div>
                    <span className="font-inter font-bold text-success" style={{ fontSize: '1.1rem' }}>
                      {bundle.discountPercent}% off
                    </span>
                  </div>
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
      </div>
    </section>
  );
}

function WhySection() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="mx-auto" style={{ maxWidth: 960 }}>
        <SectionLabel>WHY FOUNDATIONARY</SectionLabel>
        <h2
          className="font-inter font-bold text-dark-text"
          style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.2rem)' }}
        >
          Built for UK sole traders. Built for you.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {[
            {
              title: '70+ Documents Available',
              desc: 'From contracts to policies to website copy - everything your business needs, done for you.',
            },
            {
              title: 'UK Law Compliant',
              desc: 'Every document aligned with UK regulations. GDPR, contract law, and industry standards covered.',
            },
            {
              title: 'Three Tiers of Protection',
              desc: 'Foundation to launch. Operations to protect. Industry to dominate. Start where you are.',
            },
          ].map((item, i) => (
            <div key={i} className="text-center">
              <h3 className="font-inter font-semibold text-dark-text" style={{ fontSize: '1.05rem' }}>
                {item.title}
              </h3>
              <p
                className="font-inter font-normal text-secondary-text mt-2 leading-[1.6]"
                style={{ fontSize: '0.9rem' }}
              >
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function UnsureSection() {
  return (
    <section className="bg-off-white py-16 px-6">
      <div className="mx-auto" style={{ maxWidth: 640 }}>
        <div className="text-center">
          <SectionLabel>NEED HELP?</SectionLabel>
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
            Email us and we&apos;ll help you figure out exactly what you need - no sales pressure.
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
  );
}

function FinalCTABanner() {
  return (
    <section
      className="text-center px-6"
      style={{
        padding: '80px 24px',
        background: 'linear-gradient(135deg, #1B3F7A 0%, #2C68C4 100%)',
      }}
    >
      <div className="mx-auto" style={{ maxWidth: 700 }}>
        <h2
          className="font-inter font-bold text-white"
          style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)' }}
        >
          Ready to build your infrastructure?
        </h2>
        <p
          className="font-inter font-normal mt-4 leading-[1.7]"
          style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.85)' }}
        >
          Start with Foundation at 79, or build a bundle and save up to 25%. Your complete business infrastructure, delivered.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
          <Link
            href="/checkout?services=business_foundations_pack"
            className="font-inter font-bold text-navy bg-white rounded-lg hover:bg-[rgba(255,255,255,0.92)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.2)] transition-all duration-200 flex items-center gap-2"
            style={{ padding: '16px 36px', fontSize: '1rem', minHeight: 48 }}
          >
            <ShoppingCart size={18} />
            Start with Foundation - 79
          </Link>
          <Link
            href="#bundles"
            className="font-inter font-semibold text-white border-2 border-white rounded-lg hover:bg-white hover:text-navy transition-all duration-200 flex items-center gap-2"
            style={{ padding: '14px 32px', fontSize: '0.95rem', minHeight: 48 }}
          >
            <Package size={18} />
            Build Your Bundle
          </Link>
        </div>
        <p className="font-inter font-normal mt-6" style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>
          Three tiers. 13 packs. Up to 25% off when you bundle.
        </p>
      </div>
    </section>
  );
}

/* ─── Main Component ─── */

export default function ServicesClient() {
  return (
    <>
      <HeroSection />
      <HowItWorksSection />
      <FoundationTierSection />
      <OperationsTierSection />
      <IndustryTierSection />
      <MonthlyCarePlanSection />
      <BundleSection />
      <WhySection />
      <UnsureSection />
      <FinalCTABanner />
    </>
  );
}
