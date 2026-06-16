import Hero from '@/components/sections/Hero';
import SocialProof from '@/components/sections/SocialProof';
import Problem from '@/components/sections/Problem';
import WhatYouGet from '@/components/sections/WhatYouGet';
import HowItWorks from '@/components/sections/HowItWorks';
import Testimonials from '@/components/sections/Testimonials';
import Pricing from '@/components/sections/Pricing';
import GuaranteeBlock from '@/components/sections/GuaranteeBlock';
import CTABanner from '@/components/sections/CTABanner';
import { JsonLd } from '@/components/seo';
import { generateProductSchema, generateWebPageSchema, SITE_URL } from '@/lib/seo';

export const metadata = {
  title: 'Foundationary | Complete Business Infrastructure for UK Sole Traders',
  description: 'Complete business infrastructure for UK sole traders. Three tiers: Foundation (documents, website, social), Operations (onboarding, payments, GDPR), Industry (coach, photographer, consultant, contractor packs). 13 packs. 70+ documents. Up to 25% off with bundles.',
  keywords: 'sole trader UK, business infrastructure, business documents UK, client contract UK, GDPR compliance, client onboarding, payment protection, operations pack, industry pack, coach documents, photographer contract, consultant agreements, contractor H&S, website copy UK, social media posts UK',
  openGraph: {
    title: 'Foundationary | Complete Business Infrastructure for UK Sole Traders',
    description: 'Three tiers. 13 packs. 70+ documents. Foundation to start, Operations to protect, Industry to dominate. UK law compliant, done for you. From £79.',
    url: SITE_URL,
    siteName: 'Foundationary',
    locale: 'en_GB',
    type: 'website',
    images: [{ url: `${SITE_URL}/api/og?title=${encodeURIComponent('Complete Business Infrastructure for UK Sole Traders')}&description=${encodeURIComponent('Three tiers. 13 packs. 70+ documents. From £79.')}`, width: 1200, height: 630, alt: 'Foundationary | Complete Business Infrastructure for UK Sole Traders' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Foundationary | Complete Business Infrastructure for UK Sole Traders',
    description: 'Three tiers. 13 packs. 70+ documents. Foundation to start, Operations to protect, Industry to dominate. From £79.',
    images: [`${SITE_URL}/api/og?title=${encodeURIComponent('Complete Business Infrastructure for UK Sole Traders')}&description=${encodeURIComponent('Three tiers. 13 packs. 70+ documents. From £79.')}`],
    creator: '@Foundationary',
    site: '@Foundationary',
  },
  alternates: {
    canonical: SITE_URL,
    languages: {
      'en-GB': SITE_URL,
      'x-default': SITE_URL,
    },
  },
};

export default function HomePage() {
  const webPage = generateWebPageSchema({
    name: 'Foundationary | Complete Business Infrastructure for UK Sole Traders',
    description: 'Complete business infrastructure for UK sole traders. Three tiers: Foundation, Operations, Industry. 13 packs. 70+ documents. UK law compliant, done for you. From £79.',
    path: '',
  });

  return (
    <>
      <JsonLd data={[generateProductSchema(), webPage]} />
      <Hero />
      <SocialProof />
      <Problem />
      <WhatYouGet />
      <HowItWorks />
      <Testimonials />
      <Pricing />
      <GuaranteeBlock />
      <CTABanner />
    </>
  );
}
