'use client';

import Link from 'next/link';
import { useState } from 'react';
import { FileText, Globe, Share2, RotateCw, CheckCircle } from 'lucide-react';

const tabs = [
  {
    id: 'documents',
    label: 'Documents',
    icon: FileText,
    headline: '10 Bespoke Business Documents',
    benefits: [
      'A legally robust client contract that protects your scope and payment terms',
      'A GDPR privacy policy written specifically for UK sole traders',
      'Invoice template with the correct statutory late-payment wording',
      'Professional bio and elevator pitch you can use anywhere',
      'Welcome email sequence that makes clients feel like you run an agency',
    ],
    price: 'From £79',
    priceNote: 'one-time payment',
    primary: { label: "See what's included", href: '/whats-included' },
    secondary: { label: 'Get the Documents Pack', href: '/checkout?services=business_foundations_pack' },
  },
  {
    id: 'website',
    label: 'Website',
    icon: Globe,
    headline: 'Professional Website — Fully Built',
    benefits: [
      'Homepage, About, Services, Contact — and up to 10 pages total',
      'Written in your voice, not generic agency copy',
      'SEO-aware structure so you appear in the right searches',
      'Source files plus a hosted preview — ready to hand to any developer',
      'Delivered as a complete, deploy-ready website',
    ],
    price: 'From £35',
    priceNote: 'per page',
    primary: { label: 'Learn more', href: '/services/website-copy' },
    secondary: { label: 'Get website copy', href: '/checkout?services=website_copy_pack' },
  },
  {
    id: 'social',
    label: 'Social Media',
    icon: Share2,
    headline: 'Done-For-You Social Posts',
    benefits: [
      '5 to 30 posts written in your voice — educational, promotional, personal',
      'Captions and hashtags included for every post',
      'Formatted for LinkedIn, Instagram, Facebook, and X',
      'Completely eliminates the blank-page dread of "what should I post?"',
      'Consistent content strategy you can actually stick to',
    ],
    price: 'From £20',
    priceNote: 'for 5 posts',
    primary: { label: 'Learn more', href: '/services/social-media' },
    secondary: { label: 'Get social posts', href: '/checkout?services=social_media_pack' },
  },
  {
    id: 'refresh',
    label: 'Quarterly Refresh',
    icon: RotateCw,
    headline: 'Keep Your Foundations Current',
    benefits: [
      'One document updated every quarter to reflect your current business',
      'Pricing changes, new services, and GDPR updates handled for you',
      'Regulation changes reviewed and incorporated automatically',
      'Never operate on a contract that no longer reflects how you work',
      'Cancel any quarter — no lock-in, no penalties',
    ],
    price: '£29',
    priceNote: 'per quarter',
    primary: { label: 'Learn more', href: '/services/quarterly-refresh' },
    secondary: { label: 'Add quarterly refresh', href: '/checkout?services=quarterly_refresh' },
    note: 'Requires Business Foundations Pack',
  },
];

export default function WhatYouGet() {
  const [activeTab, setActiveTab] = useState(0);

  const active = tabs[activeTab];
  const Icon = active.icon;

  return (
    <section id="pack" className="bg-off-white py-24 px-6">
      <div className="max-w-[1200px] mx-auto">
        <span
          className="font-inter font-semibold text-medium-blue uppercase block mb-3"
          style={{ fontSize: '0.75rem', letterSpacing: '0.15em' }}
        >
          OUR SERVICES
        </span>
        <h2
          className="font-inter font-bold text-dark-text"
          style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)' }}
        >
          Four ways we serve your business.
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
                  background: isActive ? '#1B3F7A' : '#ffffff',
                  color: isActive ? '#ffffff' : '#4A5568',
                  border: `2px solid ${isActive ? '#1B3F7A' : '#E2E8F0'}`,
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
                style={{ background: 'linear-gradient(135deg, #1B3F7A, #2C68C4)' }}
              >
                <Icon size={24} className="text-white" />
              </div>

              <h3 className="font-inter font-bold text-dark-text mb-6" style={{ fontSize: '1.4rem' }}>
                {active.headline}
              </h3>

              <ul className="space-y-3 mb-8">
                {active.benefits.map((b) => (
                  <li key={b} className="flex items-start gap-3">
                    <CheckCircle size={17} className="text-success shrink-0 mt-0.5" />
                    <span className="font-inter font-normal text-secondary-text leading-[1.6]" style={{ fontSize: '0.95rem' }}>
                      {b}
                    </span>
                  </li>
                ))}
              </ul>

              {active.note && (
                <div
                  className="font-inter font-normal text-secondary-text text-sm mb-6 pl-3"
                  style={{ borderLeft: '3px solid #E2E8F0' }}
                >
                  {active.note}
                </div>
              )}

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
                style={{ background: 'linear-gradient(135deg, rgba(27,63,122,0.06), rgba(44,104,196,0.08))' }}
              >
                <div className="font-inter font-medium text-navy" style={{ fontSize: '0.8rem' }}>
                  Bundle 2+ services
                </div>
                <div className="font-inter font-semibold text-success mt-1" style={{ fontSize: '0.95rem' }}>
                  Save 10–15%
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
            Buy two services? Save 10%. Buy three or more? Save 15%. Applied automatically at checkout.
          </p>
          <Link
            href="/checkout"
            className="inline-block font-inter font-semibold text-white bg-success rounded-lg hover:bg-[#2d8659] transition-colors duration-200 mt-5"
            style={{ padding: '12px 32px', fontSize: '0.95rem' }}
          >
            Build my bundle
          </Link>
        </div>
      </div>
    </section>
  );
}
