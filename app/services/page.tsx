import { Metadata } from 'next';
import { JsonLd } from '@/components/seo';
import { SITE_URL, generateBreadcrumbSchema, generateWebPageSchema } from '@/lib/seo';
import ServicesClient from './ServicesClient';

export const metadata: Metadata = {
  title: 'Services | Complete Business Infrastructure for UK Sole Traders | Foundationary',
  description: 'Three tiers of business infrastructure. Foundation: documents, website, social. Operations: onboarding, payments, GDPR, IP. Industry: coach, photographer, consultant, contractor packs. 13 packs. Bundle and save up to 25%.',
  keywords: 'sole trader services UK, business infrastructure, foundation tier, operations tier, industry tier, client onboarding UK, payment protection, GDPR compliance, coach documents, photographer contract, consultant agreements, contractor H&S, business documents, website copy, social media, UK sole trader',
  openGraph: {
    title: 'Foundationary Services | Three Tiers of Business Infrastructure',
    description: 'Foundation to start. Operations to protect. Industry to dominate. 13 packs. 70+ documents. Bundle and save up to 25%.',
    url: `${SITE_URL}/services`,
    images: [{ url: `${SITE_URL}/og/services.png`, width: 1200, height: 630 }],
  },
  alternates: {
    canonical: `${SITE_URL}/services`,
    languages: {
      'en-GB': `${SITE_URL}/services`,
      'x-default': `${SITE_URL}/services`,
    },
  },
};

export default function ServicesPage() {
  const breadcrumbs = generateBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
  ]);

  const webPage = generateWebPageSchema({
    name: 'Services — Complete Business Infrastructure for UK Sole Traders',
    description: 'Three tiers of business infrastructure: Foundation, Operations, and Industry. 13 packs. 70+ documents. Bundle and save up to 25%.',
    path: '/services',
  });

  return (
    <>
      <JsonLd data={[breadcrumbs, webPage]} />
      <ServicesClient />
    </>
  );
}
