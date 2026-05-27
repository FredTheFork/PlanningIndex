import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions - Foundationary',
  description: 'Common questions about business documents for UK sole traders. Learn about our service, pricing, delivery time, document customization, and more.',
  keywords: ['sole trader FAQ', 'freelancer documents questions', 'business documents UK FAQ', 'GDPR sole trader questions'],
  openGraph: {
    title: 'FAQs About Business Documents for UK Sole Traders',
    description: 'Get answers to common questions about Foundationary services.',
    url: 'https://foundationary.vercel.app/faq',
    images: [{ url: '/og-faq.png', width: 1200, height: 630 }],
  },
  alternates: {
    canonical: 'https://foundationary.vercel.app/faq',
  },
};

const faqs = [
  {
    id: 'what-is',
    category: 'The Basics',
    question: 'What exactly is Foundationary?',
    answer: 'Foundationary is a done-for-you service that creates professional business documents tailored to your specific situation. You answer a structured questionnaire about your business, and we generate a complete set of documents including Terms & Conditions, Privacy Policy, Client Agreement, and other operational essentials — all specific to you and UK law. It\'s not a template tool, not a legal service, and not software. It\'s bespoke work delivered once.',
  },
  {
    id: 'not-legal',
    category: 'The Basics',
    question: 'Is this a legal service? Are you lawyers?',
    answer: 'No. Foundationary documents are professionally drafted and UK-compliant, but we\'re not a law firm and don\'t provide legal advice. Think of us as a structured service that gets your documentation right the first time. If you need legal advice about your specific situation, you should consult a solicitor.',
  },
  {
    id: 'who-for',
    category: 'The Basics',
    question: 'Who is Foundationary for?',
    answer: 'Foundationary is built for UK sole traders and micro-businesses who sell services. You should be comfortable working independently, want your documents to sound professional but human, and don\'t need ongoing subscriptions or endless customisation. We\'re for people who want strong foundations without the solicitor price tag.',
  },
  {
    id: 'not-for',
    category: 'The Basics',
    question: 'Who is Foundationary NOT for?',
    answer: 'If you\'re running a large incorporated company, need ongoing legal support, want to modify every single clause yourself, or need advice rather than documents — Foundationary isn\'t the right fit. Similarly, if you operate outside the UK, sell physical products at scale, or have highly complex contract requirements, you\'ll need something more specialist.',
  },
  {
    id: 'what-included',
    category: 'What You Get',
    question: 'What documents do I actually get?',
    answer: 'The Business Foundations Pack includes 10 tailored documents created from your completed questionnaire, covering legal protection, client communication, positioning, and admin essentials for UK sole traders. This includes a bespoke client contract, Terms and Conditions, GDPR-compliant Privacy Policy, professional bio, elevator pitches, LinkedIn profile copy, branded invoice template, client welcome emails, late payment letters, and service description sheets.',
  },
  {
    id: 'custom',
    category: 'What You Get',
    question: 'Can I customise the documents?',
    answer: 'Absolutely. You receive editable Word documents, so you can adjust them as your business evolves. However, customisation is your responsibility — we don\'t provide ongoing editing or updates. The documents are designed to be clear and straightforward, so most changes are simple.',
  },
  {
    id: 'delivery-time',
    category: 'Delivery',
    question: 'How long does delivery take?',
    answer: 'You\'ll receive your documents within 24 hours of completing the questionnaire. This isn\'t an automated process — your documents are created specifically for you, but we\'ve streamlined the workflow to deliver fast without compromising quality.',
  },
  {
    id: 'formats',
    category: 'Delivery',
    question: 'What format are the documents in?',
    answer: 'You receive both PDF versions (professionally formatted, ready to use) and editable Word documents (so you can make changes as needed). All documents are yours to keep forever with no restrictions.',
  },
  {
    id: 'pricing',
    category: 'Pricing',
    question: 'How much does it cost?',
    answer: 'The Business Foundations Pack is £79 one-time. No subscriptions, no hidden fees, no ongoing costs. Add-ons like website copy or social media packs are £49 each, and our quarterly refresh service is £29 per quarter.',
  },
  {
    id: 'payment-methods',
    category: 'Pricing',
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit and debit cards through our secure payment processor. All transactions are encrypted and we never store your card details.',
  },
  {
    id: 'refund',
    category: 'Pricing',
    question: 'What\'s your refund policy?',
    answer: 'We offer a 7-day money-back guarantee. If you\'re not satisfied with your documents, contact us within 7 days for a full refund. No questions asked, no hoops to jump through.',
  },
  {
    id: 'questionnaire',
    category: 'Process',
    question: 'How does the questionnaire work?',
    answer: 'The questionnaire takes approximately 45 minutes to complete. It covers your business structure, services, target clients, pricing model, communication style, and specific needs. Your answers directly inform the content and tone of every document we create.',
  },
  {
    id: 'secure',
    category: 'Process',
    question: 'Is my data secure?',
    answer: 'Yes. All data is encrypted in transit and at rest. We use enterprise-grade security infrastructure and never share your information with third parties. Your documents are delivered via secure download links.',
  },
  {
    id: 'next-steps',
    category: 'Process',
    question: 'What happens after I pay?',
    answer: 'After payment, you\'ll receive immediate access to the questionnaire. Complete it at your own pace (you can save and return). Once submitted, we\'ll create your documents within 24 hours and send you download links via email.',
  },
  {
    id: 'updates',
    category: 'After Delivery',
    question: 'What if laws or regulations change?',
    answer: 'Your documents are yours to modify. If significant legal changes occur that affect your documents, we\'ll notify you. Our quarterly refresh service (£29/quarter) ensures your documents stay current.',
  },
  {
    id: 'support',
    category: 'After Delivery',
    question: 'Do you provide support?',
    answer: 'We provide email support for questions about your documents. However, we cannot provide legal advice or guidance on how to apply documents to specific situations — for that, consult a solicitor.',
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

      {/* Hero */}
      <section
        className="text-center px-6 py-20"
        style={{
          background: 'linear-gradient(135deg, #1B3F7A 0%, #2C68C4 100%)',
        }}
      >
        <div className="mx-auto max-w-[800px]">
          <span className="text-sm font-semibold uppercase tracking-widest text-white/70 block mb-3">
            COMMON QUESTIONS
          </span>
          <h1 className="font-bold text-white text-4xl md:text-5xl">
            Questions We Hear a Lot
          </h1>
          <p className="mt-5 text-lg text-white/90 max-w-[620px] mx-auto">
            Get honest answers about what Foundationary does, what it doesn&apos;t, and whether it&apos;s right for your business.
          </p>
        </div>
      </section>

      {/* FAQ Sections */}
      <section className="bg-white py-16 px-6">
        <div className="max-w-[900px] mx-auto">
          {Object.entries(
            faqs.reduce((acc, faq) => {
              if (!acc[faq.category]) acc[faq.category] = [];
              acc[faq.category].push(faq);
              return acc;
            }, {} as Record<string, typeof faqs>)
          ).map(([category, categoryFaqs]) => (
            <div key={category} className="mb-12">
              <h2 className="font-bold text-[#1B3F7A] text-2xl mb-6">{category}</h2>
              <div className="space-y-6">
                {categoryFaqs.map((faq) => (
                  <div key={faq.id} className="border-b border-gray-200 pb-6">
                    <h3 className="font-semibold text-[#1a1a2e] text-lg mb-3">
                      {faq.question}
                    </h3>
                    <p className="text-[#5a5a7a] leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#F0F4FF] py-16 px-6">
        <div className="max-w-[800px] mx-auto text-center">
          <h2 className="font-bold text-[#1a1a2e] text-3xl mb-4">
            Still have questions?
          </h2>
          <p className="text-[#5a5a7a] mb-8">
            We&apos;re happy to help. Get in touch and we&apos;ll get back to you within 24 hours.
          </p>
          <Link
            href="/contact"
            className="inline-block font-semibold text-white bg-[#1B3F7A] rounded-lg hover:bg-[#2C68C4] transition-colors px-8 py-4"
          >
            Contact Us →
          </Link>
        </div>
      </section>

      {/* Internal Links */}
      <section className="bg-white py-12 px-6">
        <div className="max-w-[1200px] mx-auto text-center">
          <nav className="flex flex-wrap justify-center gap-6">
            <Link href="/whats-included" className="text-[#2C68C4] hover:text-[#1B3F7A] font-medium">
              What&apos;s Included →
            </Link>
            <Link href="/pricing" className="text-[#2C68C4] hover:text-[#1B3F7A] font-medium">
              Pricing →
            </Link>
            <Link href="/how-it-works" className="text-[#2C68C4] hover:text-[#1B3F7A] font-medium">
              How It Works →
            </Link>
          </nav>
        </div>
      </section>
    </>
  );
}
