import type { Metadata } from 'next';
import Link from 'next/link';
import { ClipboardList, FileText, Download } from 'lucide-react';

export const metadata: Metadata = {
  title: 'How It Works - Getting Your Business Documents',
  description: 'Simple 3-step process: answer questions, we create documents, you receive and use. 24-hour delivery for UK sole traders.',
  keywords: [
    'how business documents work',
    'sole trader documents process',
    'freelancer document service UK',
    'business foundations pack process',
    '24 hour document delivery UK',
  ],
  openGraph: {
    title: 'How It Works - Three Steps. 24 Hours. Done.',
    description: 'Simple 3-step process to get professional business documents for UK sole traders. 24-hour delivery.',
    url: 'https://foundationary.vercel.app/how-it-works',
    images: [{ url: '/og-how-it-works.png', width: 1200, height: 630 }],
  },
  alternates: {
    canonical: 'https://foundationary.vercel.app/how-it-works',
  },
};

const steps = [
  {
    num: '01',
    icon: ClipboardList,
    title: 'Complete the Questionnaire',
    subtitle: 'About 45 minutes. Once.',
    description:
      "After checkout you'll receive access to a structured questionnaire. It covers your business, your services, your clients, your tone, and your specific needs. It's thorough by design — every answer shapes the documents we create.",
    details: [
      'Business structure and trading name',
      'Services you offer and how you price them',
      'Your typical client and how you work with them',
      'Payment terms and late payment approach',
      'Communication style and brand tone',
      'Any specific concerns or clauses you want covered',
    ],
    note: 'You can save your progress and return. No time pressure.',
  },
  {
    num: '02',
    icon: FileText,
    title: 'We Create Your Documents',
    subtitle: 'Tailored to your answers. Not a template.',
    description:
      'Once you submit the questionnaire, we get to work. Every document is drafted using your specific information — your service names, your payment terms, your voice. Nothing is copy-pasted from a generic library.',
    details: [
      'Each document reflects your answers directly',
      'UK law compliance checked throughout',
      'Tone matched to the communication style you described',
      'Legal clauses appropriate for your service type',
      'Documents cross-referenced so terminology is consistent',
      'Review pass before documents are packaged for delivery',
    ],
    note: 'Delivered within 24 hours of questionnaire submission.',
  },
  {
    num: '03',
    icon: Download,
    title: 'Receive and Use',
    subtitle: 'PDF and Word. Yours to keep.',
    description:
      "You'll receive an email with download links for all 10 documents. Two formats for each: a professionally formatted PDF ready to send to clients, and an editable Word document so you can make changes as your business grows.",
    details: [
      'Professional PDF versions for immediate use',
      'Editable Word versions for future adjustments',
      'All 10 documents delivered together',
      'No account, no dashboard, no ongoing login required',
      'Documents are yours permanently with no restrictions',
      'Quarterly refresh available if you need updates later',
    ],
    note: 'Use your documents straight away. No setup required.',
  },
];

export default function HowItWorksPage() {
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
            THE PROCESS
          </span>
          <h1 className="font-bold text-white text-4xl md:text-5xl">
            Three Steps. 24 Hours. Done.
          </h1>
          <p className="mt-5 text-lg text-white/90 max-w-[620px] mx-auto">
            No back-and-forth. No confusing software. Answer a questionnaire,
            we create your documents, you receive them the next day.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-[1100px] mx-auto space-y-16">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className={`grid md:grid-cols-2 gap-12 items-start ${
                  index !== steps.length - 1 ? 'pb-16 border-b border-gray-200' : ''
                }`}
              >
                {/* Left */}
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-[#F0F4FF] flex items-center justify-center">
                      <Icon className="w-6 h-6 text-[#2C68C4]" />
                    </div>
                    <span className="text-[#2C68C4] font-bold text-sm">
                      STEP {step.num}
                    </span>
                  </div>
                  <h2 className="font-bold text-[#1a1a2e] text-3xl mb-2">
                    {step.title}
                  </h2>
                  <p className="text-[#2C68C4] font-semibold mb-4">{step.subtitle}</p>
                  <p className="text-[#5a5a7a] leading-relaxed mb-6">
                    {step.description}
                  </p>
                  <div className="bg-[#F8FAFE] rounded-lg px-5 py-3 text-sm text-[#1B3F7A] font-medium">
                    {step.note}
                  </div>
                </div>

                {/* Right */}
                <div className="bg-[#F0F4FF] rounded-xl p-8">
                  <h3 className="font-semibold text-[#1B3F7A] mb-5 text-sm uppercase tracking-wide">
                    What this covers:
                  </h3>
                  <ul className="space-y-3">
                    {step.details.map((detail, i) => (
                      <li key={i} className="flex items-start gap-3 text-[#1a1a2e]">
                        <span className="text-[#2C68C4] mt-0.5 font-bold">✓</span>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-[#F0F4FF] py-16 px-6">
        <div className="max-w-[800px] mx-auto text-center">
          <h2 className="font-bold text-[#1a1a2e] text-3xl mb-10">
            Your Timeline
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="text-3xl font-bold text-[#1B3F7A] mb-1">Day 0</div>
              <div className="text-[#2C68C4] font-semibold mb-2">You pay and start</div>
              <p className="text-[#5a5a7a] text-sm">
                Immediate access to questionnaire after checkout
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="text-3xl font-bold text-[#1B3F7A] mb-1">~45 min</div>
              <div className="text-[#2C68C4] font-semibold mb-2">Questionnaire done</div>
              <p className="text-[#5a5a7a] text-sm">
                Complete at your pace — save and return anytime
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="text-3xl font-bold text-[#1B3F7A] mb-1">24 hrs</div>
              <div className="text-[#2C68C4] font-semibold mb-2">Documents delivered</div>
              <p className="text-[#5a5a7a] text-sm">
                All 10 documents in PDF and Word, ready to use
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What You Get */}
      <section className="bg-white py-16 px-6">
        <div className="max-w-[800px] mx-auto text-center">
          <h2 className="font-bold text-[#1a1a2e] text-3xl mb-4">
            What you walk away with
          </h2>
          <p className="text-[#5a5a7a] text-lg mb-8">
            Ten documents. Both formats. No surprises.
          </p>
          <div className="grid sm:grid-cols-2 gap-4 text-left">
            {[
              'Bespoke Client Contract / Service Agreement',
              'Terms & Conditions',
              'GDPR-Compliant Privacy Policy',
              'Professional Bio',
              'Elevator Pitch (3 versions)',
              'LinkedIn Profile Script',
              'Professional Invoice Template',
              'New Client Welcome Emails (×3)',
              'Late Payment Letters (×3)',
              'Service Description Sheets',
            ].map((doc) => (
              <div key={doc} className="flex items-center gap-3 text-[#1a1a2e]">
                <span className="text-[#2C68C4] text-xl font-bold">✓</span>
                <span>{doc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-[#1B3F7A] to-[#2C68C4] py-20 px-6 text-white text-center">
        <h2 className="font-bold text-4xl mb-4">Ready to get started?</h2>
        <p className="text-xl mb-8 text-[#A8C5FF]">
          £79. One-time. 10 documents. 24 hours.
        </p>
        <Link
          href="/checkout"
          className="inline-block font-semibold text-[#1B3F7A] bg-white rounded-lg hover:bg-[#F8FAFE] transition-colors px-10 py-5 text-lg"
        >
          Get Started Now →
        </Link>
      </section>

      {/* Internal Links */}
      <section className="bg-[#F8FAFE] py-12 px-6">
        <div className="max-w-[1200px] mx-auto text-center">
          <nav className="flex flex-wrap justify-center gap-6">
            <Link href="/whats-included" className="text-[#2C68C4] hover:text-[#1B3F7A] font-medium">
              What&apos;s Included →
            </Link>
            <Link href="/pricing" className="text-[#2C68C4] hover:text-[#1B3F7A] font-medium">
              Pricing →
            </Link>
            <Link href="/faq" className="text-[#2C68C4] hover:text-[#1B3F7A] font-medium">
              FAQs →
            </Link>
            <Link href="/about" className="text-[#2C68C4] hover:text-[#1B3F7A] font-medium">
              About Us →
            </Link>
          </nav>
        </div>
      </section>
    </>
  );
}
