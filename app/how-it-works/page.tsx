import { Metadata } from 'next';
import { JsonLd } from '@/components/seo';
import { generateHowToSchema, SITE_URL, generateBreadcrumbSchema, generateWebPageSchema } from '@/lib/seo';
import HowItWorksClient from './HowItWorksClient';

export const metadata: Metadata = {
  title: 'How It Works | Get Business Documents in 24 Hours',
  description: 'Simple 4-step process to get your professional business documents. Complete questionnaire, we generate documents, human review, delivery within 24 hours. £79 one-time.',
  keywords: 'how to get business documents UK, sole trader document process, Foundationary how it works, document drafting service UK',
  openGraph: {
    title: 'How It Works | Foundationary - 24 Hour Document Delivery',
    description: 'Get your business documents in 4 simple steps. Questionnaire, generation, review, delivery. 24 hours from start to finish.',
    url: `${SITE_URL}/how-it-works`,
    images: [{ url: `${SITE_URL}/og/how-it-works.png`, width: 1200, height: 630 }],
  },
  alternates: {
    canonical: `${SITE_URL}/how-it-works`,
  },
};

const steps = [
  { name: 'Complete the questionnaire', text: 'Answer questions about your business, services, clients, and how you work. Takes 20-30 minutes.' },
  { name: 'We generate your documents', text: 'Each document is created specifically for your answers using structured prompts designed for UK sole traders.' },
  { name: 'Human review and quality check', text: 'We review for consistency, legal compliance, and tone alignment before delivery.' },
  { name: 'Receive your documents', text: 'Get your 10 documents in PDF and editable Word format within 24 hours of questionnaire submission.' },
];

export default function HowItWorksPage() {
  const breadcrumbs = generateBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'How It Works', path: '/how-it-works' },
  ]);

  const webPage = generateWebPageSchema({
    name: 'How It Works | Get Business Documents in 24 Hours',
    description: 'Simple 4-step process to get your professional business documents.',
    path: '/how-it-works',
  });

  return (
    <>
      <JsonLd data={[generateHowToSchema(steps), breadcrumbs, webPage]} />
      <HowItWorksClient />
    </>
  );
}
