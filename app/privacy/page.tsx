import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — How We Handle Your Data',
  description: 'Read Foundationary\'s Privacy Policy - learn how we collect, use, protect, and store your personal and business data. UK GDPR compliant. Your data stays yours.',
  openGraph: {
    title: 'Privacy Policy — Foundationary Data Protection',
    description: 'How we handle, protect, and respect your data. UK GDPR compliant privacy practices.',
    url: 'https://foundationary.vercel.app/privacy',
  },
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'Privacy Policy',
            description: 'Privacy Policy for Foundationary - how we handle and protect your data.',
            url: 'https://foundationary.vercel.app/privacy',
          }),
        }}
      />
      <div className="min-h-screen py-24 px-6">
        <div className="max-w-800 mx-auto">
          <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
          <p className="text-lg text-gray-600 mb-8">
            How we handle, protect, and respect your data.
          </p>
          <p className="text-sm text-gray-500 mb-4">Last updated: May 2026</p>
          <div className="prose prose-lg max-w-none text-gray-600">
            <p>Full privacy policy content coming soon...</p>
          </div>
        </div>
      </div>
    </>
  );
}
