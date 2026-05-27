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
    answer: 'Foundationary is a done-for-you service that creates professional business documents tailored to your specific situation. You answer a structured questionnaire about your business, and we generate a complete set of documents including Terms & Conditions, Privacy Policy, Client Agreement, and other operational essentials—all specific to you and UK law.',
  },
  {
    question: 'Is this a legal service? Are you lawyers?',
    answer: 'No. Foundationary is a document drafting service, not a law firm, and we don\'t provide legal advice. However, our documents are professionally drafted and UK law compliant. Think of us as a structured service that gets your documentation right the first time.',
  },
  {
    question: 'Who is Foundationary for?',
    answer: 'Foundationary is built for UK sole traders and micro-businesses who sell services. You should be comfortable working independently, want your documents to sound professional but human, and don\'t need ongoing subscriptions or endless customisation.',
  },
  {
    question: 'What documents do I actually get?',
    answer: 'The Business Foundations Pack includes 10 tailored documents: Bespoke Client Contract, Terms & Conditions, GDPR Privacy Policy, Professional Bio, Elevator Pitches (3 versions), LinkedIn Profile Script, Professional Invoice Template, New Client Welcome Emails (×3), Late Payment Letters (×3), and Service Description Sheets.',
  },
  {
    question: 'How long does it take?',
    answer: 'From submitting your intake form to receiving your complete package is typically within 24 hours. The form itself takes about 20-30 minutes to complete.',
  },
  {
    question: 'Why is it £79?',
    answer: 'We\'ve priced Foundationary to be accessible to sole traders, but not so cheap that it suggests the work isn\'t serious. £79 covers bespoke document generation, individual review, and ownership of everything you receive.',
  },
  {
    question: 'Do I keep the documents forever?',
    answer: 'Yes. You own all documents outright. They\'re yours to use, edit, and keep as long as you need them. No ongoing costs or subscriptions.',
  },
  {
    question: 'Can I edit the documents?',
    answer: 'Absolutely. You receive editable Word documents (.docx) and polished PDFs. You can modify them as your business evolves.',
  },
  {
    question: 'What if I\'m not happy with them?',
    answer: 'You have 7 days to request a full refund if you\'re not completely satisfied. No questions asked. We want you happy.',
  },
  {
    question: 'Do I need this if I\'m just starting out?',
    answer: 'Actually, this is the BEST time to get these documents. Starting with proper documentation protects you from day one and gives you a professional image that impresses early clients.',
  },
  {
    question: 'How is this different from templates I can get online?',
    answer: 'Templates are generic. Ours are bespoke—specifically built around YOUR business based on YOUR answers. Templates require you to figure out what to change; ours are ready to use immediately.',
  },
  {
    question: 'What about GDPR—am I actually compliant?',
    answer: 'Our privacy policies are ICO-compliant and specific to your data activities. However, GDPR compliance involves more than just a policy—it\'s an ongoing process. We get your documentation right, but you\'re responsible for your data practices.',
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
      <div className="min-h-screen pt-24 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-dark-text mb-4">Frequently Asked Questions</h1>
            <p className="text-xl text-secondary-text">Questions we hear a lot—answered honestly.</p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, idx) => (
              <details key={idx} className="bg-off-white rounded-lg p-6 border border-border hover:border-medium-blue transition-colors group">
                <summary className="font-semibold text-dark-text cursor-pointer flex items-center justify-between">
                  <span>{faq.question}</span>
                  <span className="text-medium-blue group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="text-secondary-text mt-4 leading-relaxed">{faq.answer}</p>
              </details>
            ))}
          </div>

          <div className="mt-12 bg-medium-blue/10 rounded-lg p-8 border-l-4 border-medium-blue text-center">
            <h2 className="text-xl font-bold text-dark-text mb-3">Still have questions?</h2>
            <p className="text-secondary-text mb-6">
              Email us at <strong>foundationarybusiness@gmail.com</strong> or call <strong>+44 7377 203834</strong>
            </p>
            <p className="text-sm text-secondary-text">
              We typically respond within 24 hours
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
