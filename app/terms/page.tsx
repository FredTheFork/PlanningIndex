import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Use — Service Agreement',
  description: 'Read Foundationary\'s Terms of Use - understand your rights and responsibilities when using our document drafting service. Clear, fair terms for UK sole traders.',
  openGraph: {
    title: 'Terms of Use — Foundationary Service Agreement',
    description: 'Clear terms and conditions for using Foundationary services.',
    url: 'https://foundationary.vercel.app/terms',
  },
};

export default function TermsOfUsePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'Terms of Use',
            description: 'Terms of Use for Foundationary document drafting service.',
            url: 'https://foundationary.vercel.app/terms',
          }),
        }}
      />
      <div className="min-h-screen py-24 px-6">
        <div className="max-w-800 mx-auto">
          <h1 className="text-4xl font-bold mb-6">Terms of Use</h1>
          <p className="text-lg text-gray-600 mb-8">
            Clear, fair terms for using Foundationary.
          </p>
          <div className="prose prose-lg max-w-none text-gray-600">
            <p>Full terms and conditions content coming soon...</p>
          </div>
        </div>
      </div>
    </>
  );
}
