import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Foundationary — Get in Touch',
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
      <div className="min-h-screen pt-24 pb-20 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="mb-12 text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-dark-text mb-6">Get in Touch</h1>
            <p className="text-xl text-secondary-text">We'd love to hear from you. Get in touch with our team.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-off-white rounded-lg p-8">
              <h2 className="text-lg font-bold text-dark-text mb-4">Email</h2>
              <p className="text-secondary-text mb-2">
                <span className="font-semibold">foundationarybusiness@gmail.com</span>
              </p>
              <p className="text-sm text-secondary-text">
                We typically respond within 24 hours
              </p>
            </div>

            <div className="bg-off-white rounded-lg p-8">
              <h2 className="text-lg font-bold text-dark-text mb-4">Phone</h2>
              <p className="text-secondary-text mb-2">
                <span className="font-semibold">+44 7377 203834</span>
              </p>
              <p className="text-sm text-secondary-text">
                Monday-Friday, 9am-5pm GMT
              </p>
            </div>
          </div>

          <div className="mt-12 bg-navy/5 rounded-lg p-8 border border-navy/10">
            <h2 className="text-xl font-bold text-dark-text mb-4">Frequently Asked Questions</h2>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-dark-text mb-2">How long does the process take?</h3>
                <p className="text-secondary-text">From payment to delivery: typically 24 hours. The questionnaire takes 20-30 minutes.</p>
              </div>

              <div>
                <h3 className="font-semibold text-dark-text mb-2">Can I get my money back?</h3>
                <p className="text-secondary-text">Of course. If you're not completely satisfied with your documents, contact us within 7 days for a full refund—no questions asked.</p>
              </div>

              <div>
                <h3 className="font-semibold text-dark-text mb-2">Are these legal documents?</h3>
                <p className="text-secondary-text">Foundationary is a document drafting service, not a law firm. We don't provide legal advice. However, all documents are professionally drafted to be UK law compliant and ready to use immediately.</p>
              </div>

              <div>
                <h3 className="font-semibold text-dark-text mb-2">Can I edit the documents after delivery?</h3>
                <p className="text-secondary-text">Absolutely. You receive editable Word documents that you can modify as your business evolves. All documents are yours to keep and use forever.</p>
              </div>

              <div>
                <h3 className="font-semibold text-dark-text mb-2">What if I need more than 10 documents?</h3>
                <p className="text-secondary-text">The Business Foundations Pack includes 10 essential documents. If you need additional custom documents, email us to discuss options.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
