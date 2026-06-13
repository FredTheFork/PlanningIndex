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
import { generateServiceSchema, SITE_URL } from '@/lib/seo';

export const metadata = {
  title: 'Foundationary | Business Documents, Website Copy & Social Media for UK Sole Traders',
  description: 'Professional business documents, website copy, and social media posts for UK sole traders. Client contracts, GDPR privacy policies, website content, social posts — UK law compliant, done for you. From £79.',
  keywords: 'sole trader UK, business documents, client contract UK, GDPR privacy policy, website copy UK, social media posts UK, sole trader business setup, freelancer documents UK',
  openGraph: {
    title: 'Foundationary | Professional Content for UK Sole Traders',
    description: 'Get professional documents, website copy, and social media posts for your UK sole trader business. Client contracts, GDPR privacy policy, website content, social posts & more. From £79.',
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
      <GuaranteeBlock />
      <CTABanner />
    </>
  );
}
