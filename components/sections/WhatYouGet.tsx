'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Star, Briefcase, Crown, CheckCircle } from 'lucide-react';
import { getServicesByTier, type ServiceTier } from '@/lib/services/service-catalog';

const tabs = [
  {
    id: 'foundation' as ServiceTier,
    label: 'Foundation',
    icon: Star,
    headline: 'Start Your Business',
    subheadline: 'Everything you need to launch professionally. Documents, website copy, and social media - all tailored to your business.',
    tierIntro: 'Foundation tier packs give you the core documents and content every UK sole trader needs to launch professionally.',
    price: 'From 79',
    priceNote: 'one-time payment',
    primary: { label: 'See Foundation packs', href: '/services#foundation' },
    secondary: { label: 'Get the Business Foundations Pack', href: '/checkout?services=business_foundations_pack' },
  },
  {
    id: 'operations' as ServiceTier,
    label: 'Operations',
    icon: Briefcase,
    headline: 'Run Your Business',
    subheadline: 'Protect your business from the inside out. Client onboarding, payment protection, GDPR compliance, and IP rights.',
    tierIntro: 'Operations tier packs protect you from scope creep, unpaid invoices, data breaches, and intellectual property theft.',
    price: 'From 149',
    priceNote: 'one-time payment',
    primary: { label: 'See Operations packs', href: '/services#operations' },
    secondary: { label: 'Get the Client Onboarding Pack', href: '/checkout?services=client_onboarding_pack' },
  },
  {
    id: 'industry' as ServiceTier,
    label: 'Industry',
    icon: Crown,
    headline: 'Dominate Your Industry',
    subheadline: 'Industry-specific documents built for your exact profession. Coaches, photographers, consultants, and contractors.',
    tierIntro: 'Industry tier packs provide profession-specific documents that address the unique challenges of your sector.',
    price: 'From 199',
    priceNote: 'one-time payment',
    primary: { label: 'See Industry packs', href: '/services#industry' },
    secondary: { label: 'Explore Industry packs', href: '/services#industry' },
  },
];

export default function WhatYouGet() {
  const [activeTab, setActiveTab] = useState(0);

  const active = tabs[activeTab];
  const Icon = active.icon;
  const tierServices = getServicesByTier(active.id).filter(s => s.id !== 'monthly_care_plan' && s.id !== 'quarterly_refresh');

  return (
    <section id="pack" className="bg-off-white py-24 px-6">
      <div className="max-w-[1200px] mx-auto">
        <span
          className="font-inter font-semibold text-medium-blue uppercase block mb-3"
          style={{ fontSize: '0.75rem', letterSpacing: '0.15em' }}
        >
          THREE TIERS OF PROTECTION
        </span>
        <h2
          className="font-inter font-bold text-dark-text"
          style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)' }}
        >
          From starting to running to dominating — your complete infrastructure.
        </h2>

        {/* Tab selector */}
        <div className="flex flex-wrap gap-2 mt-10">
          {tabs.map((tab, i) => {
            const TabIcon = tab.icon;
            const isActive = i === activeTab;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(i)}
                className="flex items-center gap-2 font-inter font-semibold rounded-full transition-all duration-200"
                style={{
                  padding: '10px 20px',
                  fontSize: '0.875rem',
                  background: isActive
                    ? tab.id === 'foundation'
                      ? '#1B3F7A'
                      : tab.id === 'operations'
                        ? '#2C68C4'
                        : '#F59E0B'
                    : '#ffffff',
                  color: isActive ? '#ffffff' : '#4A5568',
                  border: `2px solid ${isActive
                    ? tab.id === 'foundation'
                      ? '#1B3F7A'
                      : tab.id === 'operations'
                        ? '#2C68C4'
                        : '#F59E0B'
                    : '#E2E8F0'}`,
                  boxShadow: isActive ? '0 4px 16px rgba(27,63,122,0.22)' : 'none',
                  transform: isActive ? 'translateY(-1px)' : 'none',
                }}
              >
                <TabIcon size={15} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Panel */}
        <div
          key={active.id}
          className="mt-8 bg-white rounded-2xl border border-border overflow-hidden"
          style={{
            boxShadow: '0 8px 40px rgba(27,63,122,0.08)',
            animation: 'fadeInUp 0.35s ease-out both',
          }}
        >
          <div className="flex flex-col lg:flex-row">
            {/* Left: content */}
            <div className="flex-1 p-8 lg:p-10">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                style={{
                  background: active.id === 'foundation'
                    ? 'linear-gradient(135deg, #1B3F7A, #2C68C4)'
                    : active.id === 'operations'
                      ? 'linear-gradient(135deg, #2C68C4, #4A90E2)'
                      : 'linear-gradient(135deg, #F59E0B, #FBBF24)',
                }}
              >
                <Icon size={24} className="text-white" />
              </div>

              <h3 className="font-inter font-bold text-dark-text mb-3" style={{ fontSize: '1.4rem' }}>
                {active.headline}
              </h3>

              <p
                className="font-inter font-normal text-secondary-text leading-[1.6] mb-6"
                style={{ fontSize: '0.95rem' }}
              >
                {active.tierIntro}
              </p>

              <h4 className="font-inter font-semibold text-dark-text mb-3" style={{ fontSize: '1rem' }}>
                Packs in this tier:
              </h4>

              <ul className="space-y-3 mb-8">
                {tierServices.map((service) => (
                  <li key={service.id} className="flex items-start gap-3">
                    <CheckCircle size={17} className="text-success shrink-0 mt-0.5" />
                    <div>
                      <span className="font-inter font-medium text-dark-text" style={{ fontSize: '0.95rem' }}>
                        {service.name}
                      </span>
                      {service.badge && (
                        <span
                          className="font-inter font-semibold rounded-full ml-2"
                          style={{
                            background: active.id === 'foundation'
                              ? '#1B3F7A'
                              : active.id === 'operations'
                                ? '#2C68C4'
                                : '#F59E0B',
                            color: '#fff',
                            padding: '2px 8px',
                            fontSize: '0.65rem',
                          }}
                        >
                          {service.badge}
                        </span>
                      )}
                      <p className="font-inter font-normal text-secondary-text" style={{ fontSize: '0.85rem' }}>
                        {service.shortDescription}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-3">
                <Link
                  href={active.secondary.href}
                  className="font-inter font-semibold text-white bg-navy rounded-lg hover:bg-medium-blue hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(27,63,122,0.25)] transition-all duration-200"
                  style={{ padding: '14px 28px', fontSize: '0.95rem' }}
                >
                  {active.secondary.label}
                </Link>
                <Link
                  href={active.primary.href}
                  className="font-inter font-semibold text-navy border-2 border-navy rounded-lg hover:bg-off-white transition-colors duration-200"
                  style={{ padding: '12px 24px', fontSize: '0.95rem' }}
                >
                  {active.primary.label}
                </Link>
              </div>
            </div>

            {/* Right: price panel */}
            <div
              className="lg:w-64 p-8 lg:p-10 flex flex-col justify-center items-center text-center border-t lg:border-t-0 lg:border-l border-border"
              style={{ background: '#f8faff' }}
            >
              <div className="font-inter font-bold text-navy" style={{ fontSize: '2.5rem' }}>
                {active.price}
              </div>
              <div className="font-inter font-normal text-secondary-text mt-1 mb-8" style={{ fontSize: '0.9rem' }}>
                {active.priceNote}
              </div>
              <div
                className="w-full rounded-xl p-4 text-center"
                style={{
                  background: active.id === 'foundation'
                    ? 'linear-gradient(135deg, rgba(27,63,122,0.06), rgba(44,104,196,0.08))'
                    : active.id === 'operations'
                      ? 'linear-gradient(135deg, rgba(44,104,196,0.08), rgba(74,144,226,0.1))'
                      : 'linear-gradient(135deg, rgba(245,158,11,0.08), rgba(251,191,36,0.1))',
                }}
              >
                <div className="font-inter font-medium text-navy" style={{ fontSize: '0.8rem' }}>
                  Bundle multiple packs
                </div>
                <div className="font-inter font-semibold text-success mt-1" style={{ fontSize: '0.95rem' }}>
                  Save 10 to 25%
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bundle Savings Callout */}
        <div className="bg-success/10 border border-success/30 rounded-xl p-8 text-center mt-10">
          <h3 className="font-inter font-semibold text-dark-text mb-2" style={{ fontSize: '1.05rem' }}>
            Bundle and Save
          </h3>
          <p className="font-inter font-normal text-secondary-text" style={{ fontSize: '0.95rem' }}>
            Two packs? Save 10%. Four or more? Save 15-25%. Pre-configured bundles available for maximum savings.
          </p>
          <Link
            href="/services#bundles"
            className="inline-block font-inter font-semibold text-white bg-success rounded-lg hover:bg-[#2d8659] transition-colors duration-200 mt-5"
            style={{ padding: '12px 32px', fontSize: '0.95rem' }}
          >
            See all bundles
          </Link>
        </div>
      </div>
    </section>
  );
}
