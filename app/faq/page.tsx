import { Metadata } from 'next';
import { JsonLd } from '@/components/seo';
import { generateFAQSchema, SITE_URL, generateBreadcrumbSchema } from '@/lib/seo';
import FAQClient from './FAQClient';

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

const faqs = [
  { question: 'What exactly is Foundationary?', answer: 'Foundationary is a done-for-you service that creates professional business documents tailored to your specific situation. You answer a structured questionnaire about your business, and we generate a complete set of documents including Terms & Conditions, Privacy Policy, Client Agreement, and other operational essentials.' },
  { question: 'Is this a legal service? Are you lawyers?', answer: 'No. Foundationary documents are professionally drafted and UK-compliant, but we\'re not a law firm and don\'t provide legal advice.' },
  { question: 'Who is Foundationary for?', answer: 'Foundationary is built for UK sole traders and micro-businesses who sell services.' },
  { question: 'What documents do I actually get?', answer: 'The Business Foundations Pack includes 10 tailored documents including a bespoke client contract, Terms and Conditions, GDPR-compliant Privacy Policy, professional bio, elevator pitches, LinkedIn profile copy, branded invoice template, client welcome emails, late payment letters, and service description sheets.' },
  { question: 'Can I customise the documents?', answer: 'Absolutely. You receive editable Word documents, so you can adjust them as your business evolves.' },
  { question: 'How do I get started?', answer: 'You complete our structured intake form — it takes about 20-30 minutes.' },
  { question: 'How long does it take?', answer: 'From submitting your intake form to receiving your complete package is typically 5 business days.' },
  { question: 'Is there a guarantee?', answer: 'We stand by our work. If something doesn\'t feel right, we\'ll revise it.' },
];

export default function FAQPage() {
  const breadcrumbs = generateBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'FAQ', path: '/faq' },
  ]);

  return (
    <>
      <JsonLd data={[generateFAQSchema(faqs), breadcrumbs]} />
      <FAQClient />
    </>
  );
}
