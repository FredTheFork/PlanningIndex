import type { Metadata } from 'next';
import Pricing from '@/components/Pricing';

export const metadata: Metadata = {
  title: 'Pricing — Business Foundations Pack £79',
  description: 'Complete business document package for UK sole traders - £79 one-time payment. Includes client contracts, GDPR privacy policy, T&Cs, professional bios, and 6 more documents. No subscription required.',
  openGraph: {
    title: 'Foundationary Pricing — Business Foundations Pack £79',
    description: 'Complete business document package for UK sole traders - £79 one-time. 10 professional documents, UK law compliant, delivered in 24 hours.',
    url: 'https://foundationary.vercel.app/pricing',
    images: [
      {
        url: '/og-pricing.png',
        width: 1200,
        height: 630,
        alt: 'Foundationary Pricing - £79 Business Foundations Pack',
      },
    ],
  },
};

export default function PricingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: 'Business Foundations Pack',
            description: '10 bespoke business documents for UK sole traders including client contracts, GDPR privacy policy, T&Cs, professional bios, and more.',
            brand: {
              '@type': 'Brand',
              name: 'Foundationary',
            },
            offers: {
              '@type': 'Offer',
              price: '79',
              priceCurrency: 'GBP',
              availability: 'https://schema.org/InStock',
              seller: {
                '@type': 'Organization',
                name: 'Foundationary',
              },
            },
          }),
        }}
      />
      <Pricing />
    </>
  );
}
