import type { Metadata } from 'next';
import HowItWorks from '@/components/HowItWorks';

export const metadata: Metadata = {
  title: 'How It Works — Simple 4-Step Process',
  description: 'Learn how Foundationary works - complete a 20-minute questionnaire, we generate your bespoke documents, human review for consistency, and deliver within 24 hours. Simple process for UK sole traders.',
  openGraph: {
    title: 'How It Works — From Questionnaire to 24-Hour Delivery',
    description: 'Simple 4-step process: Questionnaire → Generation → Review → Delivery. Your bespoke business documents in 24 hours.',
    url: 'https://foundationary.vercel.app/how-it-works',
    images: [
      {
        url: '/og-how-it-works.png',
        width: 1200,
        height: 630,
        alt: 'How Foundationary Works - Simple 4-Step Process',
      },
    ],
  },
};

export default function HowItWorksPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'HowToPage',
            name: 'How Foundationary Works',
            description: 'Step-by-step guide to getting your business documents through Foundationary.',
            url: 'https://foundationary.vercel.app/how-it-works',
          }),
        }}
      />
      <HowItWorks />
    </>
  );
}
