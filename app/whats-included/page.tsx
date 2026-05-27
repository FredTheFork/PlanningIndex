import type { Metadata } from 'next';

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center py-24">
          <h1 className="text-4xl font-bold mb-6">What's Included</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto px-6">
            10 professional documents. Done for you.
          </p>
          <p className="mt-4 text-gray-500">Full content coming soon...</p>
        </div>
      </div>
    </>
  );
}
