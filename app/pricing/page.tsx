import type { Metadata } from 'next';

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: 'Business Document Drafting Service',
            serviceType: 'Legal Document Preparation',
            description: 'Professional business document creation for UK sole traders',
            provider: {
              '@type': 'Organization',
              name: 'Foundationary',
            },
            areaServed: {
              '@type': 'Country',
              name: 'United Kingdom',
            },
          }),
        }}
      />
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center py-24">
          <h1 className="text-4xl font-bold mb-6">Pricing</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto px-6">
            One price. No surprises. £79 once.
          </p>
          <p className="mt-4 text-gray-500">Full content coming soon...</p>
        </div>
      </div>
    </>
  );
}
