import type { Metadata } from 'next';
import WhatYouGet from '@/components/WhatYouGet';

export const metadata: Metadata = {
  title: 'What\'s Included — 10 Business Documents',
  description: 'Complete breakdown of the 10 documents included in Foundationary\'s Business Foundations Pack - client contracts, GDPR privacy policy, T&Cs, professional bio, elevator pitches, LinkedIn script, invoice template, welcome emails, late payment letters, and service descriptions.',
  openGraph: {
    title: 'What\'s Included — 10 Professional Documents for £79',
    description: 'See exactly what you get: client contracts, GDPR privacy policy, professional bios, elevator pitches, invoice templates, and 5 more essential business documents.',
    url: 'https://foundationary.vercel.app/whats-included',
    images: [
      {
        url: '/og-included.png',
        width: 1200,
        height: 630,
        alt: 'What\'s Included - 10 Business Documents',
      },
    ],
  },
};

export default function WhatsIncludedPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ItemPage',
            name: 'What\'s Included in the Business Foundations Pack',
            description: 'Detailed breakdown of all 10 documents included in the Business Foundations Pack.',
            url: 'https://foundationary.vercel.app/whats-included',
          }),
        }}
      />
      <WhatYouGet />
    </>
  );
}
