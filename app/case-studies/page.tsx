import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Case Studies - How UK Sole Traders Use Foundationary',
  description:
    'Real examples of UK sole traders who got their business documents sorted with Foundationary. See how we\'ve helped virtual assistants, consultants, and freelancers.',
  keywords: [
    'sole trader case studies UK',
    'freelancer business documents',
    'virtual assistant contracts UK',
    'marketing consultant GDPR',
    'bookkeeper contracts UK',
    'sole trader testimonials',
  ],
  openGraph: {
    title: 'Case Studies - How UK Sole Traders Use Foundationary',
    description:
      'Real examples of UK sole traders who got their business documents sorted with Foundationary. See how we\'ve helped virtual assistants, consultants, and freelancers.',
    url: 'https://foundationary.vercel.app/case-studies',
    images: [{ url: '/og-home.png', width: 1200, height: 630, alt: 'Foundationary Case Studies' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Case Studies - How UK Sole Traders Use Foundationary',
    description:
      'Real examples of UK sole traders who got their business documents sorted with Foundationary.',
    images: ['/og-home.png'],
  },
  alternates: {
    canonical: 'https://foundationary.vercel.app/case-studies',
  },
};

const caseStudies = [
  {
    slug: 'virtual-assistant-london',
    name: 'Sarah M.',
    location: 'London',
    profession: 'Virtual Assistant',
    keyBenefit: 'Professional documents in 24 hours — contracts, GDPR policy, and welcome emails all done.',
    challenge: 'No client contracts, running on informal arrangements',
    highlight: 'Peace of mind from day one',
  },
  {
    slug: 'marketing-consultant-manchester',
    name: 'James T.',
    location: 'Manchester',
    profession: 'Marketing Consultant',
    keyBenefit: 'GDPR-compliant privacy policy and terms — the anxiety finally gone.',
    challenge: 'GDPR anxiety, data protection concerns with client data',
    highlight: 'Fully GDPR compliant in 24 hours',
  },
  {
    slug: 'bookkeeper-birmingham',
    name: 'Emma W.',
    location: 'Birmingham',
    profession: 'Bookkeeper',
    keyBenefit: 'Solid client agreements that stopped scope creep and late payments.',
    challenge: 'Late payments, scope creep, unclear client terms',
    highlight: 'Stronger client relationships',
  },
];

export default function CaseStudiesIndexPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'Case Studies - How UK Sole Traders Use Foundationary',
            description:
              "Real examples of UK sole traders who got their business documents sorted with Foundationary.",
            url: 'https://foundationary.vercel.app/case-studies',
            publisher: {
              '@type': 'Organization',
              name: 'Foundationary',
              url: 'https://foundationary.vercel.app',
            },
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
            CASE STUDIES
          </span>
          <h1 className="font-bold text-white text-4xl md:text-5xl">
            How UK Sole Traders Use Foundationary
          </h1>
          <p className="mt-5 text-lg text-white/90 max-w-[620px] mx-auto">
            Real examples of virtual assistants, consultants, and freelancers who got their business documents sorted — and what changed when they did.
          </p>
        </div>
      </section>

      {/* Intro */}
      <section className="bg-white py-16 px-6">
        <div className="max-w-[800px] mx-auto text-center">
          <p className="text-[#3a3a5a] text-lg leading-relaxed mb-4">
            Every UK sole trader&apos;s situation is different — different profession, different clients, different challenges. What&apos;s the same is the outcome: a properly set-up business, with the legal documents and professional materials to match.
          </p>
          <p className="text-[#5a5a7a] leading-relaxed">
            Below are three real case studies showing how Foundationary has helped sole traders across the UK get sorted in 24 hours.
          </p>
        </div>
      </section>

      {/* Case Study Cards */}
      <section className="bg-[#F8FAFE] py-16 px-6">
        <div className="max-w-[1100px] mx-auto">
          <div className="flex items-center gap-3 mb-10">
            <span className="w-8 h-0.5 bg-[#2C68C4]" />
            <span className="font-semibold text-[#2C68C4] uppercase text-xs tracking-widest">
              Client Stories
            </span>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {caseStudies.map((study) => (
              <Link
                key={study.slug}
                href={`/case-studies/${study.slug}`}
                className="group bg-white rounded-2xl p-7 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col"
              >
                {/* Header */}
                <div className="mb-5">
                  <div className="w-12 h-12 bg-[#1B3F7A] rounded-full flex items-center justify-center mb-4">
                    <span className="text-white font-bold text-lg">{study.name.charAt(0)}</span>
                  </div>
                  <h2 className="font-bold text-[#1a1a2e] text-xl mb-1 group-hover:text-[#2C68C4] transition-colors">
                    {study.name}
                  </h2>
                  <p className="text-[#2C68C4] font-semibold text-sm">{study.profession}</p>
                  <p className="text-[#5a5a7a] text-sm">{study.location}</p>
                </div>

                {/* Challenge */}
                <div className="mb-4">
                  <p className="text-xs font-semibold uppercase tracking-widest text-[#5a5a7a] mb-1">
                    Challenge
                  </p>
                  <p className="text-[#3a3a5a] text-sm leading-relaxed">{study.challenge}</p>
                </div>

                {/* Key Benefit */}
                <div className="bg-[#F0F4FF] rounded-lg p-4 mb-5 flex-1">
                  <p className="text-[#1B3F7A] text-sm leading-relaxed">&ldquo;{study.keyBenefit}&rdquo;</p>
                </div>

                {/* Highlight tag */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white bg-[#1B3F7A] rounded px-2.5 py-1">
                    {study.highlight}
                  </span>
                  <span className="font-semibold text-[#2C68C4] text-sm group-hover:underline">
                    Read story →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="py-20 px-6 text-white text-center"
        style={{ background: 'linear-gradient(135deg, #1B3F7A 0%, #2C68C4 100%)' }}
      >
        <div className="max-w-[700px] mx-auto">
          <h2 className="font-bold text-3xl md:text-4xl mb-4">
            Ready to get your business properly set up?
          </h2>
          <p className="text-white/80 text-lg mb-8">
            Join UK sole traders like Sarah, James, and Emma. 10 professional documents, tailored to your business, delivered in 24 hours.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/checkout"
              className="font-semibold text-[#1B3F7A] bg-white rounded-lg hover:bg-[#F0F4FF] transition-colors px-8 py-4"
            >
              Get Started — £79 →
            </Link>
            <Link
              href="/whats-included"
              className="font-semibold text-white border-2 border-white/60 rounded-lg hover:bg-white/10 transition-colors px-8 py-4"
            >
              See What&apos;s Included
            </Link>
          </div>
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
            <Link href="/faq" className="text-[#2C68C4] hover:text-[#1B3F7A] font-medium">
              FAQs →
            </Link>
            <Link href="/how-it-works" className="text-[#2C68C4] hover:text-[#1B3F7A] font-medium">
              How It Works →
            </Link>
            <Link href="/about" className="text-[#2C68C4] hover:text-[#1B3F7A] font-medium">
              About →
            </Link>
            <Link href="/blog" className="text-[#2C68C4] hover:text-[#1B3F7A] font-medium">
              Blog →
            </Link>
          </nav>
        </div>
      </section>
    </>
  );
}
