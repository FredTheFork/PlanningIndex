import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Foundationary',
  description: 'Learn about Foundationary - a done-for-you document service for UK sole traders. We create professional business documents tailored to your specific needs without solicitor fees.',
  openGraph: {
    title: 'About Foundationary — Professional Foundations for Your Business',
    description: 'Learn about Foundationary - a done-for-you document service for UK sole traders. Professional documents without the corporate price tag.',
    url: 'https://foundationary.vercel.app/about',
    images: [
      {
        url: '/og-about.png',
        width: 1200,
        height: 630,
        alt: 'About Foundationary - Professional Business Documents',
      },
    ],
  },
};

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'AboutPage',
            name: 'About Foundationary',
            description: 'Professional foundations for businesses that don\'t want to wing it.',
            url: 'https://foundationary.vercel.app/about',
            mainEntity: {
              '@type': 'Organization',
              name: 'Foundationary',
              description: 'Document drafting service for UK sole traders',
            },
          }),
        }}
      />
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center py-24">
          <h1 className="text-4xl font-bold mb-6">About Foundationary</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto px-6">
            Professional foundations for businesses that don't want to wing it.
          </p>
          <p className="mt-4 text-gray-500">Full content coming soon...</p>
        </div>
      </div>
    </>
  );
}
