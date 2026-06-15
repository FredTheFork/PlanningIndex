import type { Metadata } from 'next';
import { JsonLd } from '@/components/seo';
import { SITE_URL, generateBreadcrumbSchema, generateWebPageSchema, generateServiceSchema, generateFAQSchema } from '@/lib/seo';
import DocumentsClient from './DocumentsClient';

export const metadata: Metadata = {
  title: 'Business Foundations Pack — 10 Documents for UK Sole Traders | Foundationary',
  description: 'Complete pack of 10 bespoke business documents for UK sole traders. Client contracts, GDPR policies, invoices and more. £79 one-time, delivered fast.',
  keywords: 'sole trader documents UK, business foundations pack, client contract UK, GDPR privacy policy sole trader, invoice template UK, terms and conditions sole trader, professional bio UK, late payment letter UK',
  openGraph: {
    title: 'Business Foundations Pack | 10 Documents for UK Sole Traders',
    description: 'Get 10 bespoke business documents for your UK sole trader business. Client contract, GDPR privacy policy, invoice template and more. £79 one-time.',
    url: `${SITE_URL}/services/documents`,
    siteName: 'Foundationary',
    locale: 'en_GB',
    type: 'website',
    images: [{ url: `${SITE_URL}/api/og?title=${encodeURIComponent('10 Business Documents for UK Sole Traders')}&description=${encodeURIComponent('Client contract, GDPR privacy policy, invoice template and more. £79 one-time.')}`, width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Business Foundations Pack | 10 Documents for UK Sole Traders',
    description: 'Get 10 bespoke business documents for your UK sole trader business. £79 one-time, delivered fast.',
    creator: '@Foundationary',
    site: '@Foundationary',
  },
  alternates: {
    canonical: `${SITE_URL}/services/documents`,
    languages: {
      'en-GB': `${SITE_URL}/services/documents`,
      'x-default': `${SITE_URL}/services/documents`,
    },
  },
};

export default function DocumentsPage() {
  const breadcrumbs = generateBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Business Foundations Pack', path: '/services/documents' },
  ]);

  const webPage = generateWebPageSchema({
    name: 'Business Foundations Pack — 10 Documents for UK Sole Traders',
    description: 'Complete pack of 10 bespoke business documents for UK sole traders. Client contracts, GDPR policies, invoices and more. £79 one-time.',
    path: '/services/documents',
  });

  const faqSchema = generateFAQSchema([
    { question: 'What documents do I get in the Business Foundations Pack?', answer: 'You receive 10 bespoke documents: Client Agreement, Terms & Conditions, GDPR Privacy Policy, Professional Bio, Elevator Pitch, LinkedIn Profile Script, Invoice Template, New Client Welcome Emails, Late Payment Letters, and Service Description Sheets.' },
    { question: 'How is this different from downloading templates?', answer: 'Templates are generic and often US-centric. Every Foundationary document is generated from your answers to our structured questionnaire, then reviewed by a human for consistency and UK legal compliance.' },
    { question: 'Is this legal advice?', answer: 'No. Foundationary provides professionally drafted documents, not legal advice. If you need guidance specific to your situation, we recommend consulting a solicitor.' },
    { question: 'How long does delivery take?', answer: 'We deliver your documents within 5 business days of receiving your completed intake questionnaire.' },
    { question: 'Is the £79 price a subscription?', answer: 'No. The Business Foundations Pack is a one-time payment of £79. There are no recurring charges unless you choose to add the Quarterly Document Refresh.' },
  ]);

  return (
    <>
      <JsonLd data={[breadcrumbs, webPage, generateServiceSchema(), faqSchema]} />
      <DocumentsClient />
    </>
  );
}
