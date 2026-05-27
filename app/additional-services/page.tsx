import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Additional Services — Website Copy & Social Media',
  description: 'Optional add-ons for Foundationary customers - Website Copy Starter Pack (£49), Social Media Starter Pack (£49), Quarterly Document Refresh (£29/quarter). Expand your business documentation.',
  openGraph: {
    title: 'Additional Services — Optional Business Documentation Add-ons',
    description: 'Website copy, social media packs, and quarterly document refresh services for UK sole traders.',
    url: 'https://foundationary.vercel.app/additional-services',
    images: [
      {
        url: '/og-services.png',
        width: 1200,
        height: 630,
        alt: 'Additional Services - Foundationary Add-ons',
      },
    ],
  },
};

export default function AdditionalServicesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ItemPage',
            name: 'Additional Services',
            description: 'Optional add-on services for Foundationary customers.',
            url: 'https://foundationary.vercel.app/additional-services',
          }),
        }}
      />
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center py-24">
          <h1 className="text-4xl font-bold mb-6">Additional Services</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto px-6">
            Optional extras to expand your business toolkit.
          </p>
          <p className="mt-4 text-gray-500">Full content coming soon...</p>
        </div>
      </div>
    </>
  );
}
