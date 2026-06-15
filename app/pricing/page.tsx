import { Metadata } from 'next';
import { JsonLd } from '@/components/seo';
import { generateProductSchema, SITE_URL, generateBreadcrumbSchema, generateWebPageSchema } from '@/lib/seo';
import PricingClient from './PricingClient';

export const metadata: Metadata = {
  title: 'Pricing | Business Documents for UK Sole Traders - £79',
  description: 'Get 10 professional business documents for your UK sole trader business for just £79 one-time. Client contracts, GDPR privacy policy, invoice templates & more. Delivered in 24 hours.',
  keywords: 'sole trader document pricing UK, business documents cost, freelancer contract price, GDPR privacy policy cost UK',
  openGraph: {
    title: 'Foundationary Pricing | £79 for 10 Business Documents',
    description: 'Professional business documents for UK sole traders. One-time payment of £79. No subscriptions, no hidden fees.',
    url: `${SITE_URL}/pricing`,
    images: [{ url: `${SITE_URL}/api/og?title=${encodeURIComponent('From £79 for 10 Business Documents')}&description=${encodeURIComponent('Professional documents, website copy & social media for UK sole traders. One-time payment. No subscriptions.')}&type=pricing`, width: 1200, height: 630 }],
  },
  alternates: {
    canonical: `${SITE_URL}/pricing`,
    languages: {
      'en-GB': `${SITE_URL}/pricing`,
      'x-default': `${SITE_URL}/pricing`,
    },
  },
};

export default function PricingPage() {
  const breadcrumbs = generateBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Pricing', path: '/pricing' },
  ]);

  const webPage = generateWebPageSchema({
    name: 'Pricing | Business Documents for UK Sole Traders - £79',
    description: 'Get 10 professional business documents for your UK sole trader business for just £79 one-time.',
    path: '/pricing',
  });

  return (
    <>
      <JsonLd data={[generateProductSchema(), breadcrumbs, webPage]} />
      <PricingClient />
    </>
  );
}
