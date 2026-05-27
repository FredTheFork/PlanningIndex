import type { Metadata } from 'next';
import Link from 'next/link';
import { Package, Clock, FingerprintPattern as Fingerprint } from 'lucide-react';

export const metadata: Metadata = {
  title: 'What\'s Included in Your Business Foundations Pack',
  description: 'Get 10 professional documents including bespoke client contracts, GDPR-compliant privacy policies, Terms & Conditions, professional bios, and more for UK sole traders.',
  keywords: ['business documents included', 'sole trader documents', 'client contract UK', 'GDPR privacy policy', 'freelancer invoice template'],
  openGraph: {
    title: 'What\'s Included - 10 Professional Documents for UK Sole Traders',
    description: 'Complete breakdown of all 10 business documents included in the Business Foundations Pack.',
    url: 'https://foundationary.vercel.app/whats-included',
    images: [{ url: '/og-included.png', width: 1200, height: 630 }],
  },
  alternates: {
    canonical: 'https://foundationary.vercel.app/whats-included',
  },
};

const documents = [
  {
    id: 'contract',
    num: '01',
    title: 'Bespoke Client Contract / Service Agreement',
    hook: 'The document that protects every piece of work you do.',
    covered: [
      'Scope of services — exactly what you will and won\'t do',
      'Deliverables and timelines specific to your offering',
      'Payment terms, schedules, and deposit arrangements',
      'Intellectual property ownership before and after payment',
      'Limitation of liability capped at total fees paid',
      'Termination conditions and notice periods',
      'Dispute resolution process',
    ],
  },
  {
    id: 'terms',
    num: '02',
    title: 'Terms & Conditions',
    hook: 'Your operating rulebook — clear, enforceable, and entirely yours.',
    covered: [
      'Payment schedules and due dates',
      'Late payment remedies under UK law',
      'Statutory interest entitlement (8% above base rate)',
      'Refund and cancellation policy',
      'Client responsibilities and obligations',
      'Limitation of liability',
    ],
  },
  {
    id: 'gdpr',
    num: '03',
    title: 'GDPR Privacy Policy',
    hook: 'ICO-compliant, specific to your business — not a copy-paste from the internet.',
    covered: [
      'What personal data you collect',
      'How you collect and process it',
      'Your lawful basis for processing',
      'Data retention periods',
      'Security measures',
      'All eight data subject rights explained',
      'How to lodge a complaint with the ICO',
    ],
  },
  {
    id: 'bio',
    num: '04',
    title: 'Professional Bio',
    hook: 'Position yourself as the expert you are.',
    covered: [
      'Compelling narrative of your professional journey',
      'Your unique value proposition',
      'Key skills and specializations',
      'Professional achievements',
      'Tone that matches your brand',
    ],
  },
  {
    id: 'pitch',
    num: '05',
    title: 'Elevator Pitch (3 Versions)',
    hook: 'Tell people what you do in 30 seconds — convincingly.',
    covered: [
      '30-second networking pitch',
      '60-second detailed pitch',
      '2-minute presentation version',
      'Clear articulation of your services',
      'Memorable hooks',
    ],
  },
  {
    id: 'linkedin',
    num: '06',
    title: 'LinkedIn Profile Script',
    hook: 'Turn your LinkedIn profile into a lead-generation machine.',
    covered: [
      'Optimized headline',
      'Compelling summary section',
      'Experience descriptions',
      'Skills and endorsements strategy',
      'Call-to-action elements',
    ],
  },
  {
    id: 'invoice',
    num: '07',
    title: 'Professional Invoice Template',
    hook: 'Get paid faster with clear, professional invoices.',
    covered: [
      'Branded invoice design',
      'Payment terms and due dates',
      'Bank details section',
      'Itemized service breakdown',
      'Late payment notice language',
    ],
  },
  {
    id: 'welcome',
    num: '08',
    title: 'New Client Welcome Emails (×3)',
    hook: 'Start client relationships professionally from day one.',
    covered: [
      'Initial welcome email',
      'Onboarding checklist email',
      'Project kickoff email',
      'Professional tone',
      'Clear next steps',
    ],
  },
  {
    id: 'latepayment',
    num: '09',
    title: 'Late Payment Letters (×3)',
    hook: 'Get paid what you\'re owed — professionally and legally.',
    covered: [
      'First reminder (gentle)',
      'Second reminder (firm)',
      'Final notice before action',
      'UK late payment legislation references',
      'Escalation language',
    ],
  },
  {
    id: 'servicesheets',
    num: '10',
    title: 'Service Description Sheets',
    hook: 'Clearly define what you offer and what clients get.',
    covered: [
      'Service overviews',
      'What\'s included vs. excluded',
      'Pricing breakdown',
      'Delivery timelines',
      'Professional presentation',
    ],
  },
];

export default function WhatsIncludedPage() {
  return (
    <>
      {/* Hero */}
      <section
        className="text-center px-6 py-20"
        style={{
          background: 'linear-gradient(135deg, #1B3F7A 0%, #2C68C4 100%)',
        }}
      >
        <div className="mx-auto max-w-[800px]">
          <span className="text-sm font-semibold uppercase tracking-widest text-white/70 block mb-3">
            THE BUSINESS FOUNDATIONS PACK
          </span>
          <h1 className="font-bold text-white text-4xl md:text-5xl">
            10 Documents. All Your Bases Covered.
          </h1>
          <p className="mt-5 text-lg text-white/90 max-w-[620px] mx-auto">
            Every document you need to operate professionally, protect yourself legally, and present your business confidently — all tailored to your specific situation.
          </p>
        </div>
      </section>

      {/* Document List */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-[1200px] mx-auto">
          {documents.map((doc, index) => (
            <div key={doc.id} className={`py-12 ${index !== documents.length - 1 ? 'border-b border-gray-200' : ''}`}>
              <div className="grid md:grid-cols-3 gap-8">
                <div>
                  <div className="text-[#2C68C4] font-bold text-sm mb-2">{doc.num}</div>
                  <h2 className="font-bold text-[#1a1a2e] text-2xl mb-2">{doc.title}</h2>
                  <p className="text-[#5a5a7a] italic">{doc.hook}</p>
                </div>
                <div className="md:col-span-2">
                  <h3 className="font-semibold text-[#1B3F7A] mb-4">What's covered:</h3>
                  <ul className="grid sm:grid-cols-2 gap-3">
                    {doc.covered.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-[#1a1a2e]">
                        <span className="text-[#2C68C4] mt-1">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* What You Also Get */}
      <section className="bg-[#F0F4FF] py-16 px-6">
        <div className="max-w-[800px] mx-auto text-center">
          <h2 className="font-bold text-[#1a1a2e] text-3xl mb-6">You also get:</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6">
              <Clock className="w-10 h-10 text-[#2C68C4] mx-auto mb-3" />
              <h3 className="font-semibold text-[#1B3F7A] mb-2">24-Hour Delivery</h3>
              <p className="text-[#5a5a7a] text-sm">Complete questionnaire, get documents next day</p>
            </div>
            <div className="bg-white rounded-lg p-6">
              <Package className="w-10 h-10 text-[#2C68C4] mx-auto mb-3" />
              <h3 className="font-semibold text-[#1B3F7A] mb-2">PDF + Word Formats</h3>
              <p className="text-[#5a5a7a] text-sm">Professional PDFs and editable Word documents</p>
            </div>
            <div className="bg-white rounded-lg p-6">
              <Fingerprint className="w-10 h-10 text-[#2C68C4] mx-auto mb-3" />
              <h3 className="font-semibold text-[#1B3F7A] mb-2">Your Brand, Your Tone</h3>
              <p className="text-[#5a5a7a] text-sm">Documents written in your voice</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-[800px] mx-auto text-center">
          <h2 className="font-bold text-[#1a1a2e] text-3xl mb-4">
            Ready to get all 10 documents?
          </h2>
          <p className="text-[#5a5a7a] text-lg mb-8">
            One payment. 24 hours. Professional foundations sorted.
          </p>
          <Link
            href="/checkout"
            className="inline-block font-semibold text-white bg-[#1B3F7A] rounded-lg hover:bg-[#2C68C4] transition-colors px-10 py-5"
          >
            Get Started — £79 →
          </Link>
        </div>
      </section>

      {/* Internal Links */}
      <section className="bg-[#F8FAFE] py-12 px-6">
        <div className="max-w-[1200px] mx-auto text-center">
          <nav className="flex flex-wrap justify-center gap-6">
            <Link href="/pricing" className="text-[#2C68C4] hover:text-[#1B3F7A] font-medium">
              View Pricing →
            </Link>
            <Link href="/how-it-works" className="text-[#2C68C4] hover:text-[#1B3F7A] font-medium">
              How It Works →
            </Link>
            <Link href="/faq" className="text-[#2C68C4] hover:text-[#1B3F7A] font-medium">
              FAQs →
            </Link>
          </nav>
        </div>
      </section>
    </>
  );
}
