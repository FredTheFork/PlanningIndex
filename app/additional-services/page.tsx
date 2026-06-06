import { Metadata } from 'next';
import { JsonLd } from '@/components/seo';
import { generateBreadcrumbSchema, SITE_URL } from '@/lib/seo';
import AdditionalServicesClient from './AdditionalServicesClient';

export const metadata: Metadata = {
  title: 'Additional Services | Optional Add-ons for UK Sole Traders',
  description: 'Optional add-ons to extend your business foundations. Website copy, social media content, and quarterly document refresh - only if you need them.',
  keywords: 'Foundationary add-ons, website copy UK, social media content sole trader, document refresh service, UK sole trader services',
  openGraph: {
    title: 'Additional Services | Foundationary Optional Add-ons',
    description: 'Extend your business foundations with optional add-ons. Website copy, social media content, quarterly document refresh.',
    url: `${SITE_URL}/additional-services`,
    images: [{ url: `${SITE_URL}/og/additional-services.png`, width: 1200, height: 630 }],
  },
  alternates: {
    canonical: `${SITE_URL}/additional-services`,
  },
};

export default function AdditionalServicesPage() {
  const breadcrumbs = generateBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Additional Services', path: '/additional-services' },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbs} />
      <AdditionalServicesClient />
    </>
  );
}
