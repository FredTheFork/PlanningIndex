import { Metadata } from 'next';
import { JsonLd } from '@/components/seo';
import { generateServiceSchema, SITE_URL, generateBreadcrumbSchema, generateWebPageSchema } from '@/lib/seo';
import WhatsIncludedClient from './WhatsIncludedClient';

export const metadata: Metadata = {
  title: "What's Included — Business Foundations Pack | 10 Documents for UK Sole Traders",
  description: 'Complete breakdown of all 10 documents in the Business Foundations Pack. Client contract, terms & conditions, GDPR privacy policy, professional bio, invoice template, and more.',
  keywords: 'sole trader documents included, business foundations pack, what documents do I get, client contract UK, GDPR privacy policy sole trader',
  openGraph: {
    title: "What's Included | 10 Documents for UK Sole Traders",
    description: 'Full breakdown of every document in the £79 Business Foundations Pack. Contracts, policies, templates, scripts and more.',
    url: `${SITE_URL}/whats-included`,
    images: [{ url: `${SITE_URL}/og/whats-included.png`, width: 1200, height: 630 }],
  },
  alternates: {
    canonical: `${SITE_URL}/whats-included`,
  },
};

export default function WhatsIncludedPage() {
  const breadcrumbs = generateBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: "What's Included", path: '/whats-included' },
  ]);

  const webPage = generateWebPageSchema({
    name: "What's Included — Business Foundations Pack",
    description: 'Complete breakdown of all 10 documents in the Business Foundations Pack.',
    path: '/whats-included',
  });

  return (
    <>
      <JsonLd data={[generateServiceSchema(), breadcrumbs, webPage]} />
      <WhatsIncludedClient />
    </>
  );
}
