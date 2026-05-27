import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQ — Common Questions About Foundationary',
  description: 'Get answers to common questions about Foundationary - UK sole trader document services, pricing, delivery timeline, legal compliance, and what\'s included in the Business Foundations Pack.',
  openGraph: {
    title: 'FAQ — Foundationary Questions Answered',
    description: 'Honest answers about what Foundationary does, legal compliance, pricing, and whether it\'s right for your UK sole trader business.',
    url: 'https://foundationary.vercel.app/faq',
    images: [
      {
        url: '/og-faq.png',
        width: 1200,
        height: 630,
        alt: 'Foundationary FAQ - Common Questions Answered',
      },
    ],
  },
};

const faqs = [
  {
    question: 'What exactly is Foundationary?',
    answer: 'Foundationary is a done-for-you service that creates professional business documents tailored to your specific situation. You answer a structured questionnaire about your business, and we generate a complete set of documents including Terms & Conditions, Privacy Policy, Client Agreement, and other operational essentials — all specific to you and UK law.',
  },
  {
    question: 'Is this a legal service? Are you lawyers?',
    answer: 'No. Foundationary documents are professionally drafted and UK-compliant, but we\'re not a law firm and don\'t provide legal advice. Think of us as a structured service that gets your documentation right the first time.',
  },
  {
    question: 'Who is Foundationary for?',
    answer: 'Foundationary is built for UK sole traders and micro-businesses who sell services. You should be comfortable working independently, want your documents to sound professional but human, and don\'t need ongoing subscriptions or endless customisation.',
  },
  {
    question: 'What documents do I actually get?',
    answer: 'The Business Foundations Pack includes 10 tailored documents covering legal protection, client communication, positioning, and admin essentials for UK sole traders.',
  },
  {
    question: 'How long does it take?',
    answer: 'From submitting your intake form to receiving your complete package is typically 5 business days. The form itself takes about 20-30 minutes to complete.',
  },
  {
    question: 'Why is it £79?',
    answer: 'We\'ve priced Foundationary to be accessible to sole traders, but not so cheap that it suggests the work isn\'t serious. £79 covers bespoke document generation, individual review, and ownership of everything you receive.',
  },
];

export default function FAQPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqs.map((faq) => ({
              '@type': 'Question',
              name: faq.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer,
              },
            })),
          }),
        }}
      />
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center py-24">
          <h1 className="text-4xl font-bold mb-6">Frequently Asked Questions</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto px-6">
            Questions we hear a lot.
          </p>
          <p className="mt-4 text-gray-500">Full FAQ content coming soon...</p>
        </div>
      </div>
    </>
  );
}
