import { Metadata } from 'next';
import { JsonLd } from '@/components/seo';
import { generateFAQSchema, SITE_URL, generateBreadcrumbSchema, generateWebPageSchema } from '@/lib/seo';
import FAQClient from './FAQClient';
import { faqs } from '@/lib/content/faq-data';

export const metadata: Metadata = {
  title: 'FAQ | Common Questions from UK Sole Traders',
  description: 'Get answers to common questions about Foundationary services. What documents are included? How does it work? Is it right for my business? Read our FAQ.',
  keywords: 'sole trader FAQ UK, business documents FAQ, freelancer contract questions, GDPR FAQ sole trader, Foundationary questions',
  openGraph: {
    title: 'FAQ | Common Questions from UK Sole Traders',
    description: 'Answers to common questions about business documents for UK sole traders. Pricing, delivery, customisation and more.',
    url: `${SITE_URL}/faq`,
    images: [{ url: `${SITE_URL}/og/faq.png`, width: 1200, height: 630 }],
  },
  alternates: {
    canonical: `${SITE_URL}/faq`,
  },
};

const simpleFaqs = faqs.map(faq => ({
  question: faq.question,
  answer: faq.answer
}));

export default function FAQPage() {
  const breadcrumbs = generateBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'FAQ', path: '/faq' },
  ]);

  const webPage = generateWebPageSchema({
    name: 'FAQ | Common Questions from UK Sole Traders',
    description: 'Get answers to common questions about Foundationary services. Pricing, delivery, customisation and more.',
    path: '/faq',
  });

  return (
    <>
      <JsonLd data={[generateFAQSchema(simpleFaqs), breadcrumbs, webPage]} />
      <FAQClient faqs={faqs} />
    </>
  );
}
