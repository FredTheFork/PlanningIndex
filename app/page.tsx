import Hero from '@/components/sections/Hero';
import SocialProof from '@/components/sections/SocialProof';
import Problem from '@/components/sections/Problem';
import WhatYouGet from '@/components/sections/WhatYouGet';
import HowItWorks from '@/components/sections/HowItWorks';
import Testimonials from '@/components/sections/Testimonials';
import Pricing from '@/components/sections/Pricing';
import CTABanner from '@/components/sections/CTABanner';
import { JsonLd } from '@/components/seo';
import { generateServiceSchema, SITE_URL } from '@/lib/seo';
import ClientOverlays from '@/components/layout/ClientOverlays';

export const metadata = {
  title: 'Foundationary | Business Documents for UK Sole Traders - Fast & Simple',
  description: 'Professional business documents for UK sole traders. Client contracts, GDPR privacy policies, invoice templates - UK law compliant, delivered in 24 hours. £79 one-time payment.',
  keywords: 'sole trader UK, business documents, client contract UK, GDPR privacy policy, invoice template UK, sole trader business setup, freelancer documents UK',
  openGraph: {
    title: 'Foundationary | Business Documents for UK Sole Traders',
    description: 'Get 10 professional business documents for your UK sole trader business. Client contracts, GDPR privacy policy, invoice template & more. £79, delivered in 24 hours.',
    url: SITE_URL,
    images: [{ url: `${SITE_URL}/og/default.png`, width: 1200, height: 630 }],
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export default function HomePage() {
  return (
    <>
      <JsonLd data={generateServiceSchema()} />
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

export default function HomePage() {
  return (
    <>
      {/* page content */}
      <ClientOverlays />
    </>
  );
}
