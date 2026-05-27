'use client';

import Hero from '@/components/Hero';
import SocialProof from '@/components/SocialProof';
import Problem from '@/components/Problem';
import WhatYouGet from '@/components/WhatYouGet';
import HowItWorks from '@/components/HowItWorks';
import Testimonials from '@/components/Testimonials';
import Pricing from '@/components/Pricing';
import CTABanner from '@/components/CTABanner';

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'Foundationary - Business Foundations. Fast.',
            description: 'Professional business documents for UK sole traders. Client contracts, GDPR privacy policies, T&Cs, and more.',
            url: 'https://foundationary.vercel.app',
            publisher: {
              '@type': 'Organization',
              name: 'Foundationary',
            },
          }),
        }}
      />
      <Hero />
      <SocialProof />
      <Problem />
      <WhatYouGet />
      <HowItWorks />
      <Testimonials />
      <Pricing />
      <CTABanner />
    </>
  );
}
