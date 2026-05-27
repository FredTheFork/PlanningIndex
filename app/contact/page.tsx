import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact — Get in Touch',
  description: 'Contact Foundationary - Email foundationarybusiness@gmail.com or call +44 7377 203834. We typically respond within 24 hours. Ask us about bespoke business documents for UK sole traders.',
  openGraph: {
    title: 'Contact Foundationary — Let\'s Talk About Your Business',
    description: 'Get in touch with Foundationary. Fast response, honest answers, no spam. Email or call us directly.',
    url: 'https://foundationary.vercel.app/contact',
    images: [
      {
        url: '/og-contact.png',
        width: 1200,
        height: 630,
        alt: 'Contact Foundationary - Get in Touch',
      },
    ],
  },
};

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ContactPage',
            name: 'Contact Foundationary',
            description: 'Get in touch with Foundationary for questions about business documents for UK sole traders.',
            url: 'https://foundationary.vercel.app/contact',
            mainEntity: {
              '@type': 'Organization',
              name: 'Foundationary',
              contactPoint: {
                '@type': 'ContactPoint',
                telephone: '+44-7377-203834',
                contactType: 'customer service',
                email: 'foundationarybusiness@gmail.com',
                availableLanguage: 'English',
              },
            },
          }),
        }}
      />
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center py-24">
          <h1 className="text-4xl font-bold mb-6">Contact Us</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto px-6">
            Let's talk about your business.
          </p>
          <p className="mt-4 text-gray-500">Full contact form coming soon...</p>
        </div>
      </div>
    </>
  );
}
