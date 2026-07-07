'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Check, ArrowRight, Instagram, Linkedin, Facebook, Twitter, AlertCircle } from 'lucide-react';

/* ─── Sub-components ─── */

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

function Hero() {
  return (
    <section
      className="relative text-center px-6"
      style={{ paddingTop: 0, paddingBottom: '72px', minHeight: '420px' }}
    >
      {/* Background image */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          backgroundImage: 'url(/images/hero/social-media-hero.jpg)',
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
          <h1
            className="font-inter font-extrabold text-white"
            style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', lineHeight: 1.2 }}
          >
            30 days of social media content. Done. No blank pages, no second-guessing.
          </h1>
          <p
            className="font-inter font-normal mx-auto mt-4 leading-[1.7]"
            style={{
              fontSize: '1.05rem',
              color: 'rgba(255,255,255,0.85)',
              maxWidth: 600,
            }}
          >
            Done-for-you posts that work — educational, promotional, and trust-building. Pick your quantity and platforms.
          </p>
          <Link
            href="/checkout?services=social_media_pack"
            className="inline-block font-inter font-bold text-navy bg-white rounded-lg hover:bg-[rgba(255,255,255,0.92)] transition-colors duration-200 mt-9"
            style={{ padding: '16px 36px', fontSize: '1rem', minHeight: 48 }}
          >
            Get Social Posts — From £20
          </Link>
        </div>
      </div>
    </section>
  );
}

function WhatsIncludedSection() {
  const contentTypes = [
    {
      title: 'Educational Posts',
      desc: 'Teach your audience something useful about your industry or offer. Build authority.',
    },
    {
      title: 'Promotional Posts',
      desc: 'Highlight your services, mention special offers, point people towards your website.',
    },
    {
      title: 'Personal / Trust-Building Posts',
      desc: 'Share your story, wins, behind-the-scenes, or advice. Build genuine connection.',
    },
    {
      title: 'Captions & Hashtags',
      desc: 'Every post comes with a caption and platform-specific hashtag suggestions.',
    },
  ];

  return (
    <section className="bg-off-white py-24 px-6">
      <div className="mx-auto" style={{ maxWidth: 960 }}>
        <SectionLabel>WHAT YOU GET</SectionLabel>
        <h2
          className="font-inter font-bold text-dark-text mb-12"
          style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)' }}
        >
          Four types of high-value content
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {contentTypes.map((type) => (
            <div
              key={type.title}
              className="bg-white rounded-lg border border-border p-6 hover:border-medium-blue hover:shadow-[0_4px_16px_rgba(44,104,196,0.1)] transition-all duration-200"
            >
              <Check size={20} className="text-success mb-3" />
              <h3 className="font-inter font-semibold text-dark-text" style={{ fontSize: '1.05rem' }}>
                {type.title}
              </h3>
              <p className="font-inter font-normal text-secondary-text mt-2 leading-[1.6]" style={{ fontSize: '0.9rem' }}>
                {type.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-border p-8">
          <h3 className="font-inter font-semibold text-dark-text" style={{ fontSize: '1.05rem' }}>
            Platform Coverage
          </h3>
          <p className="font-inter font-normal text-secondary-text mt-2 leading-[1.6]" style={{ fontSize: '0.9rem' }}>
            All posts are adapted for each platform's format and audience. Choose which platforms you use:
          </p>
          <div className="flex flex-wrap gap-4 mt-6">
            {[
              { name: 'LinkedIn', icon: Linkedin },
              { name: 'Instagram', icon: Instagram },
              { name: 'Facebook', icon: Facebook },
              { name: 'X (Twitter)', icon: Twitter },
            ].map(({ name, icon: Icon }) => (
              <div key={name} className="flex items-center gap-2 bg-off-white rounded-lg px-4 py-2">
                <Icon size={16} className="text-medium-blue" />
                <span className="font-inter font-medium text-dark-text" style={{ fontSize: '0.9rem' }}>
                  {name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const steps = [
    {
      num: '01',
      title: 'Questionnaire',
      desc: 'Tell us your platforms, audience, tone, content pillars, and any boundaries',
    },
    {
      num: '02',
      title: 'Post Generation',
      desc: 'We create your posts — mixing educational, promotional, and personal content',
    },
    {
      num: '03',
      title: 'Platform Adaptation',
      desc: 'Each post is tailored for its platform — LinkedIn copy vs. Instagram captions',
    },
    {
      num: '04',
      title: 'Delivery',
      desc: 'All posts delivered ready to schedule into your social management tool',
    },
  ];

  return (
    <section className="bg-white py-24 px-6">
      <div className="mx-auto" style={{ maxWidth: 960 }}>
        <SectionLabel>HOW IT WORKS</SectionLabel>
        <h2
          className="font-inter font-bold text-dark-text mb-12"
          style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)' }}
        >
          From questionnaire to ready-to-schedule posts
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => (
            <div key={step.num} className="flex flex-col">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-white font-inter font-bold mb-4 shrink-0"
                style={{
                  fontSize: '0.9rem',
                  background: 'linear-gradient(135deg, #1B3F7A, #2C68C4)',
                }}
              >
                {step.num}
              </div>
              <h3 className="font-inter font-semibold text-dark-text" style={{ fontSize: '1rem' }}>
                {step.title}
              </h3>
              <p className="font-inter font-normal text-secondary-text mt-2 leading-[1.6]" style={{ fontSize: '0.85rem' }}>
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingTiers() {
  const tiers = [
    { posts: '5 posts', price: '£20', perPost: '£4' },
    { posts: '10 posts', price: '£40', perPost: '£4' },
    { posts: '15 posts', price: '£57', perPost: '£3.80' },
    { posts: '20 posts', price: '£73', perPost: '£3.65' },
    { posts: '25 posts', price: '£80', perPost: '£3.20' },
    { posts: '30 posts', price: '£110', perPost: '£3.67' },
  ];

  return (
    <section className="bg-off-white py-24 px-6">
      <div className="mx-auto" style={{ maxWidth: 900 }}>
        <SectionLabel>PRICING</SectionLabel>
        <h2
          className="font-inter font-bold text-dark-text mb-4"
          style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)' }}
        >
          Choose your post quantity
        </h2>
        <p className="font-inter font-normal text-secondary-text mb-12 leading-[1.7]" style={{ fontSize: '1rem' }}>
          Bulk discounts apply — the more posts, the lower the per-post cost. Most sole traders start with 10 posts per quarter.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {tiers.map((tier) => (
            <Link
              key={tier.posts}
              href={`/checkout?services=social_media_pack`}
              className="bg-white rounded-lg border border-border p-6 hover:border-medium-blue hover:shadow-[0_4px_12px_rgba(44,104,196,0.1)] transition-all duration-200"
            >
              <div className="font-inter font-semibold text-dark-text" style={{ fontSize: '1rem' }}>
                {tier.posts}
              </div>
              <div className="font-inter font-bold text-medium-blue mt-3" style={{ fontSize: '1.5rem' }}>
                {tier.price}
              </div>
              <div className="font-inter font-normal text-secondary-text mt-2" style={{ fontSize: '0.85rem' }}>
                {tier.perPost} per post
              </div>
            </Link>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-border p-8">
          <h3 className="font-inter font-semibold text-dark-text" style={{ fontSize: '1.05rem' }}>
            A note on expectations
          </h3>
          <div className="flex items-start gap-4 mt-4">
            <AlertCircle size={20} className="text-medium-blue shrink-0 mt-0.5" />
            <p className="font-inter font-normal text-secondary-text leading-[1.6]" style={{ fontSize: '0.9rem' }}>
              These are well-written, on-brand, ready-to-post pieces. However: <strong>we don't guarantee engagement, followers, or conversions.</strong> Social media success depends on your consistency, your audience, platform algorithms, and more. This is great content, not a growth hack. Post regularly, be genuine, and respond to your audience — that's where the real growth happens.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function WhoItIsForSection() {
  const goodFit = [
    'Sole traders who know they should be posting but keep running out of ideas',
    'Business owners who feel stuck every time they sit down to write a post',
    'Anyone who wants to maintain a professional social presence without the mental load',
    'People who have a clear audience and want content tailored to them',
  ];

  const notFor = [
    'Anyone expecting social media content alone to grow followers exponentially',
    'Accounts with no existing audience — these posts work best with regular engagement',
    'Businesses wanting ongoing strategy consulting (we do content, not strategy)',
  ];

  return (
    <section className="bg-white py-24 px-6">
      <div className="mx-auto" style={{ maxWidth: 960 }}>
        <SectionLabel>IS THIS FOR YOU?</SectionLabel>
        <h2
          className="font-inter font-bold text-dark-text mb-12"
          style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)' }}
        >
          Perfect if you're consistent and ready
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-off-white rounded-xl p-8">
            <h3 className="font-inter font-semibold text-success" style={{ fontSize: '1.05rem' }}>
              This is for you
            </h3>
            <ul className="flex flex-col gap-4 mt-5">
              {goodFit.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check size={18} className="text-success shrink-0 mt-0.5" />
                  <span className="font-inter font-normal text-dark-text" style={{ fontSize: '0.9rem' }}>
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-off-white rounded-xl p-8">
            <h3 className="font-inter font-semibold text-navy" style={{ fontSize: '1.05rem' }}>
              This is not for you
            </h3>
            <ul className="flex flex-col gap-4 mt-5">
              {notFor.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-secondary-text font-normal shrink-0 mt-0.5" style={{ fontSize: '1rem' }}>✕</span>
                  <span className="font-inter font-normal text-dark-text" style={{ fontSize: '0.9rem' }}>
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function BundleSection() {
  const bundles = [
    {
      name: 'Documents + Social Media',
      description: 'All your business documents plus 5 social posts. Save 10%.',
      href: '/checkout?services=business_foundations_pack,social_media_pack',
    },
    {
      name: 'All Three Services',
      description: 'Documents + Website Copy + Social Media. Best value at 15% off.',
      href: '/checkout?services=business_foundations_pack,website_copy_pack,social_media_pack',
    },
  ];

  return (
    <section className="bg-off-white py-24 px-6">
      <div className="mx-auto" style={{ maxWidth: 960 }}>
        <SectionLabel>BUNDLE SAVINGS</SectionLabel>
        <h2
          className="font-inter font-bold text-dark-text mb-12"
          style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)' }}
        >
          Get more, save more
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {bundles.map((bundle) => (
            <Link
              key={bundle.name}
              href={bundle.href}
              className="bg-white rounded-xl border border-border p-8 hover:border-medium-blue hover:shadow-[0_8px_32px_rgba(44,104,196,0.12)] transition-all duration-200 flex flex-col"
            >
              <h3 className="font-inter font-semibold text-dark-text" style={{ fontSize: '1.05rem' }}>
                {bundle.name}
              </h3>
              <p className="font-inter font-normal text-secondary-text mt-3 leading-[1.6] flex-1" style={{ fontSize: '0.9rem' }}>
                {bundle.description}
              </p>
              <div className="border-t border-border my-4" />
              <ArrowRight size={16} className="text-medium-blue" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTABanner() {
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
          Social media posts that actually sound like you
        </h2>
        <p
          className="font-inter font-normal mt-4 leading-[1.7]"
          style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.85)' }}
        >
          Choose your quantity and platforms. Get ready-to-post content delivered within days.
        </p>
        <Link
          href="/checkout?services=social_media_pack"
          className="inline-block font-inter font-bold text-navy bg-white rounded-lg hover:bg-[rgba(255,255,255,0.92)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.2)] transition-all duration-200 mt-10"
          style={{ padding: '18px 40px', fontSize: '1rem', minHeight: 48 }}
        >
          Get Social Posts — From £20
        </Link>
        <p
          className="font-inter font-normal mt-4"
          style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}
        >
          Educational · Promotional · Personal · Platform-adapted
        </p>
      </div>
    </section>
  );
}

export default function SocialMediaClient() {
  return (
    <>
      <Hero />
      <WhatsIncludedSection />
      <HowItWorksSection />
      <PricingTiers />
      <WhoItIsForSection />
      <BundleSection />
      <CTABanner />
    </>
  );
}
