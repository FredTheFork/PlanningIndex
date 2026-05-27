import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Birmingham Bookkeeper Secures Client Relationships with Professional Contracts',
  description:
    'Case study: Birmingham bookkeeper creates solid client agreements and professional positioning with Foundationary.',
  keywords: [
    'bookkeeper contracts UK',
    'bookkeeper business documents Birmingham',
    'freelance bookkeeper terms UK',
    'self-employed bookkeeper contracts',
    'sole trader bookkeeper documents',
  ],
  authors: [{ name: 'Foundationary' }],
  openGraph: {
    type: 'article',
    title: 'Birmingham Bookkeeper Secures Client Relationships with Professional Contracts',
    description:
      'Case study: Birmingham bookkeeper creates solid client agreements and professional positioning with Foundationary.',
    url: 'https://foundationary.vercel.app/case-studies/bookkeeper-birmingham',
    images: [
      {
        url: '/og-home.png',
        width: 1200,
        height: 630,
        alt: 'Bookkeeper Birmingham Case Study - Foundationary',
      },
    ],
    publishedTime: '2026-05-27',
    authors: ['Foundationary'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Birmingham Bookkeeper Secures Client Relationships with Professional Contracts',
    description:
      'Birmingham bookkeeper stops late payments and scope creep with solid client agreements from Foundationary.',
    images: ['/og-home.png'],
  },
  alternates: {
    canonical: 'https://foundationary.vercel.app/case-studies/bookkeeper-birmingham',
  },
};

const reviewSchema = {
  '@context': 'https://schema.org',
  '@type': 'Review',
  itemReviewed: {
    '@type': 'Product',
    name: 'Business Foundations Pack',
    brand: {
      '@type': 'Brand',
      name: 'Foundationary',
    },
  },
  reviewRating: {
    '@type': 'Rating',
    ratingValue: '5',
    bestRating: '5',
  },
  author: {
    '@type': 'Person',
    name: 'Emma W.',
    jobTitle: 'Bookkeeper',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Birmingham',
      addressCountry: 'GB',
    },
  },
  reviewBody:
    "The contract is worth every penny on its own. I had a client dispute my invoice shortly after getting my documents and for the first time I could just point to the terms. Sorted in minutes instead of weeks of awkward conversations. I wish I had done this years ago.",
  datePublished: '2026-05-27',
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Birmingham Bookkeeper Secures Client Relationships with Professional Contracts',
  description:
    'Case study: Birmingham bookkeeper creates solid client agreements and professional positioning with Foundationary.',
  image: 'https://foundationary.vercel.app/og-home.png',
  datePublished: '2026-05-27',
  dateModified: '2026-05-27',
  author: {
    '@type': 'Organization',
    name: 'Foundationary',
    url: 'https://foundationary.vercel.app',
  },
  publisher: {
    '@type': 'Organization',
    name: 'Foundationary',
    logo: {
      '@type': 'ImageObject',
      url: 'https://foundationary.vercel.app/logo.png',
    },
  },
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': 'https://foundationary.vercel.app/case-studies/bookkeeper-birmingham',
  },
};

export default function BookkeeperBirminghamCaseStudy() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      {/* Hero */}
      <section
        className="px-6 py-16 md:py-20"
        style={{ background: 'linear-gradient(135deg, #1B3F7A 0%, #2C68C4 100%)' }}
      >
        <div className="max-w-[860px] mx-auto">
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <Link
              href="/case-studies"
              className="text-white/70 text-sm hover:text-white transition-colors"
            >
              ← Case Studies
            </Link>
            <span className="text-white/40">·</span>
            <span className="text-xs font-semibold uppercase tracking-widest text-white/70">
              Bookkeeper · Birmingham
            </span>
          </div>
          <h1 className="font-bold text-white text-3xl md:text-5xl leading-tight mb-5">
            Birmingham Bookkeeper Secures Client Relationships with Professional Contracts
          </h1>
          <p className="text-white/85 text-lg leading-relaxed mb-7 max-w-[720px]">
            Emma had experienced late payments, scope creep, and unclear client expectations. Getting proper contracts in place did not just fix those problems — it changed how clients treated her business from day one.
          </p>
          <div className="flex flex-wrap items-center gap-5 text-sm text-white/70">
            <span>
              <strong className="text-white">Emma W.</strong> — Bookkeeper
            </span>
            <span>·</span>
            <span>Birmingham, UK</span>
            <span>·</span>
            <time dateTime="2026-05-27">May 2026</time>
          </div>
        </div>
      </section>

      {/* Summary Bar */}
      <div className="bg-[#F0F4FF] border-b border-[#D0D9F2] px-6 py-5">
        <div className="max-w-[860px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { label: 'Profession', value: 'Bookkeeper' },
            { label: 'Location', value: 'Birmingham' },
            { label: 'Time to Deliver', value: '24 hours' },
            { label: 'Result', value: 'Protected & professional' },
          ].map((item) => (
            <div key={item.label}>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#5a5a7a] mb-1">
                {item.label}
              </p>
              <p className="font-bold text-[#1B3F7A]">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <article className="bg-white px-6 py-14">
        <div className="max-w-[860px] mx-auto">

          {/* Client Intro */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-0.5 bg-[#2C68C4]" />
              <span className="font-semibold text-[#2C68C4] uppercase text-xs tracking-widest">
                The Client
              </span>
            </div>
            <h2 className="font-bold text-[#1a1a2e] text-3xl mb-5">Meet Emma</h2>
            <div className="bg-[#F8FAFE] rounded-xl p-6 mb-6">
              <div className="grid sm:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-[#5a5a7a] mb-0.5">Name</p>
                  <p className="font-semibold text-[#1a1a2e]">Emma W.</p>
                </div>
                <div>
                  <p className="text-[#5a5a7a] mb-0.5">Profession</p>
                  <p className="font-semibold text-[#1a1a2e]">Bookkeeper</p>
                </div>
                <div>
                  <p className="text-[#5a5a7a] mb-0.5">Location</p>
                  <p className="font-semibold text-[#1a1a2e]">Birmingham, UK</p>
                </div>
              </div>
            </div>
            <p className="text-[#3a3a5a] leading-relaxed text-lg mb-4">
              Emma had been running her bookkeeping practice in Birmingham for four years. She offered monthly bookkeeping services to small businesses and sole traders — reconciling accounts, preparing VAT returns, and keeping clients&apos; finances organised and HMRC-ready.
            </p>
            <p className="text-[#3a3a5a] leading-relaxed text-lg">
              She was good at her work and had built a steady client base. The problem was not the bookkeeping — it was the business relationships around it. Unclear scope, unpaid invoices, and clients who added work without acknowledging it was extra. And no formal agreements to point to when things went sideways.
            </p>
          </section>

          {/* The Challenge */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-0.5 bg-[#2C68C4]" />
              <span className="font-semibold text-[#2C68C4] uppercase text-xs tracking-widest">
                The Challenge
              </span>
            </div>
            <h2 className="font-bold text-[#1a1a2e] text-3xl mb-5">Late payments. Scope creep. No leverage.</h2>
            <p className="text-[#3a3a5a] leading-relaxed text-lg mb-4">
              Three separate incidents in the space of six months crystallised the problem for Emma. A client paid an invoice two months late with no acknowledgement of the delay. Another asked for additional work outside the agreed scope and seemed surprised when Emma mentioned it would cost more. A third questioned the value of the service partway through an engagement and withheld the final payment.
            </p>
            <p className="text-[#3a3a5a] leading-relaxed text-lg mb-6">
              In all three cases, Emma had no written contract to reference. She had agreed terms verbally and by email, but nothing formal. That meant any dispute became a conversation about what was agreed — rather than a clear reference to a document both parties had signed.
            </p>

            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-4 bg-[#FFF5F5] rounded-lg p-5 border-l-4 border-red-400">
                <div>
                  <h3 className="font-semibold text-[#1a1a2e] mb-1">Late payment with no recourse</h3>
                  <p className="text-[#5a5a7a] text-sm leading-relaxed">
                    Without payment terms in writing, Emma had no basis to charge late payment interest (to which she was entitled under UK law). She was chasing invoices without any formal leverage.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 bg-[#FFF5F5] rounded-lg p-5 border-l-4 border-red-400">
                <div>
                  <h3 className="font-semibold text-[#1a1a2e] mb-1">Scope creep with no defined boundaries</h3>
                  <p className="text-[#5a5a7a] text-sm leading-relaxed">
                    Clients frequently added requests outside the agreed monthly scope. Without a written service definition, Emma had no clear way to say &ldquo;this is extra work&rdquo; — leading to tension and unpaid additional time.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 bg-[#FFF5F5] rounded-lg p-5 border-l-4 border-red-400">
                <div>
                  <h3 className="font-semibold text-[#1a1a2e] mb-1">Disputes with no documentation</h3>
                  <p className="text-[#5a5a7a] text-sm leading-relaxed">
                    When clients questioned the service or withheld payment, Emma had no formal agreement to refer to. Every dispute became a negotiation from scratch, draining time and causing stress.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 bg-[#FFF5F5] rounded-lg p-5 border-l-4 border-red-400">
                <div>
                  <h3 className="font-semibold text-[#1a1a2e] mb-1">Handling sensitive financial data without GDPR terms</h3>
                  <p className="text-[#5a5a7a] text-sm leading-relaxed">
                    As a bookkeeper, Emma had access to highly sensitive financial data. She had no privacy policy, no data retention policy, and nothing in her client arrangements about how she handled or protected that data.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* The Solution */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-0.5 bg-[#2C68C4]" />
              <span className="font-semibold text-[#2C68C4] uppercase text-xs tracking-widest">
                The Solution
              </span>
            </div>
            <h2 className="font-bold text-[#1a1a2e] text-3xl mb-5">Foundationary Business Foundations Pack</h2>
            <p className="text-[#3a3a5a] leading-relaxed text-lg mb-6">
              Emma came to Foundationary after seeing it mentioned in a bookkeeper&apos;s networking group. The questionnaire asked her specifically about how she structured her retainer arrangements, what her notice period should be, how she handled additional work requests, what data she handled for clients, and how she preferred to deal with late payments. The resulting documents were built around those specifics.
            </p>

            <h3 className="font-semibold text-[#1B3F7A] text-xl mb-4">Key documents for her situation</h3>
            <div className="space-y-4 mb-7">
              <div className="bg-[#EFF4FF] border border-[#B8CCFF] rounded-xl p-6">
                <h4 className="font-bold text-[#1B3F7A] text-lg mb-2">Bespoke Client Contract</h4>
                <p className="text-[#3a3a5a] text-sm leading-relaxed mb-3">
                  The contract defined the exact scope of her monthly bookkeeping service, what constituted additional work and how it would be priced, a 30-day notice period for either party, and what happened if a client failed to provide information on time. For Emma, this was the single most valuable document.
                </p>
                <ul className="text-sm text-[#5a5a7a] space-y-1">
                  <li className="flex items-start gap-2"><span className="text-[#2C68C4]">✓</span> Scope of monthly service clearly defined</li>
                  <li className="flex items-start gap-2"><span className="text-[#2C68C4]">✓</span> Process for additional work requests and pricing</li>
                  <li className="flex items-start gap-2"><span className="text-[#2C68C4]">✓</span> Client data provision obligations included</li>
                  <li className="flex items-start gap-2"><span className="text-[#2C68C4]">✓</span> Notice period and termination terms</li>
                </ul>
              </div>

              <div className="bg-[#EFF4FF] border border-[#B8CCFF] rounded-xl p-6">
                <h4 className="font-bold text-[#1B3F7A] text-lg mb-2">Terms & Conditions</h4>
                <p className="text-[#3a3a5a] text-sm leading-relaxed mb-3">
                  Clear payment terms (14 days from invoice date), explicit late payment interest provisions referencing the Late Payment of Commercial Debts Act, and a clause allowing suspension of services for non-payment. For the first time, Emma had formal tools to deal with the late payment problem she had experienced repeatedly.
                </p>
              </div>

              <div className="bg-[#EFF4FF] border border-[#B8CCFF] rounded-xl p-6">
                <h4 className="font-bold text-[#1B3F7A] text-lg mb-2">GDPR Privacy Policy</h4>
                <p className="text-[#3a3a5a] text-sm leading-relaxed">
                  Tailored to a bookkeeper who handles clients&apos; financial records and sensitive business data. Covered data retention periods, security measures, and her role as a data processor — appropriate for the highly sensitive nature of financial data she worked with daily.
                </p>
              </div>
            </div>

            <p className="text-[#5a5a7a] text-sm leading-relaxed">
              She also received her professional bio, elevator pitch, LinkedIn script, invoice template, welcome email sequence, and late payment letter sequence — building out the complete professional infrastructure of her practice.
            </p>
          </section>

          {/* Results */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-0.5 bg-[#2C68C4]" />
              <span className="font-semibold text-[#2C68C4] uppercase text-xs tracking-widest">
                The Results
              </span>
            </div>
            <h2 className="font-bold text-[#1a1a2e] text-3xl mb-5">Protected, positioned, and in control of her client relationships</h2>
            <p className="text-[#3a3a5a] leading-relaxed text-lg mb-6">
              Emma put the new contracts in front of all existing clients at their next renewal, and all signed without objection. When a dispute arose shortly after — the first real test of the documents — she was able to reference the contract directly. The matter was resolved quickly because the terms were unambiguous.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center bg-[#F0F4FF] rounded-xl p-6">
                <p className="text-4xl font-bold text-[#1B3F7A] mb-2">24h</p>
                <p className="text-[#5a5a7a] text-sm">From questionnaire to complete document pack</p>
              </div>
              <div className="text-center bg-[#F0F4FF] rounded-xl p-6">
                <p className="text-4xl font-bold text-[#1B3F7A] mb-2">100%</p>
                <p className="text-[#5a5a7a] text-sm">Of existing clients signed the new contracts</p>
              </div>
              <div className="text-center bg-[#F0F4FF] rounded-xl p-6">
                <p className="text-4xl font-bold text-[#1B3F7A] mb-2">First</p>
                <p className="text-[#5a5a7a] text-sm">Dispute after resolved in minutes, not weeks</p>
              </div>
            </div>

            <div className="space-y-4">
              {[
                {
                  title: 'Late payment problem addressed',
                  body: 'The new T&Cs include 14-day payment terms and explicit late payment interest provisions. Clients are now clear on what happens if they do not pay on time — and payment behaviour has improved noticeably.',
                },
                {
                  title: 'Scope creep reduced',
                  body: 'The contract defines exactly what is included in the monthly service. When clients request additional work, Emma now has a document to reference that makes it clear this is outside scope and attracts additional fees.',
                },
                {
                  title: 'First dispute resolved quickly',
                  body: 'When a client disputed an invoice after the new contracts were in place, Emma pointed to the relevant clause. The matter was resolved in one email exchange rather than weeks of uncomfortable conversation.',
                },
                {
                  title: 'More professional onboarding',
                  body: 'New clients now receive a welcome email sequence and a contract before work begins. Emma describes the feedback as &ldquo;much more positive&rdquo; — clients feel they are working with a professional practice.',
                },
                {
                  title: 'GDPR compliance for a data-sensitive practice',
                  body: 'Her privacy policy covers her handling of sensitive financial data appropriately. As a bookkeeper working with business financial records, this was a particularly important compliance gap to close.',
                },
              ].map((result) => (
                <div key={result.title} className="flex items-start gap-4 py-4 border-b border-gray-100">
                  <span className="text-[#2C68C4] font-bold text-lg flex-shrink-0 mt-0.5">✓</span>
                  <div>
                    <h3 className="font-semibold text-[#1a1a2e] mb-1">{result.title}</h3>
                    <p className="text-[#5a5a7a] text-sm leading-relaxed">{result.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Testimonial */}
          <section className="mb-12">
            <blockquote className="bg-[#1B3F7A] rounded-2xl p-8 text-white">
              <p className="text-xl leading-relaxed mb-5 italic">
                &ldquo;The contract is worth every penny on its own. I had a client dispute my invoice shortly after getting my documents and for the first time I could just point to the terms. Sorted in minutes instead of weeks of awkward conversations. I wish I had done this years ago.&rdquo;
              </p>
              <cite className="not-italic">
                <span className="font-bold text-white text-lg block">Emma W.</span>
                <span className="text-white/70 text-sm">Bookkeeper, Birmingham</span>
              </cite>
            </blockquote>
          </section>

          {/* CTA */}
          <section>
            <div
              className="rounded-2xl p-8 text-white text-center"
              style={{ background: 'linear-gradient(135deg, #1B3F7A 0%, #2C68C4 100%)' }}
            >
              <h3 className="font-bold text-2xl mb-3">
                Protect your client relationships with proper contracts
              </h3>
              <p className="text-white/85 mb-6 text-lg max-w-[540px] mx-auto">
                10 professional documents tailored to your sole trader business — including a bespoke client contract and late payment terms. Delivered in 24 hours. £79 one-time.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link
                  href="/checkout"
                  className="font-semibold text-[#1B3F7A] bg-white rounded-lg hover:bg-[#F0F4FF] transition-colors px-7 py-3.5"
                >
                  Get Started — £79 →
                </Link>
                <Link
                  href="/whats-included"
                  className="font-semibold text-white border-2 border-white/60 rounded-lg hover:bg-white/10 transition-colors px-7 py-3.5"
                >
                  See What&apos;s Included
                </Link>
              </div>
              <p className="text-white/60 text-sm mt-4">7-day money-back guarantee. UK-compliant.</p>
            </div>
          </section>
        </div>
      </article>

      {/* Related Case Studies */}
      <section className="bg-[#F8FAFE] py-16 px-6">
        <div className="max-w-[860px] mx-auto">
          <h2 className="font-bold text-[#1a1a2e] text-2xl mb-7">More case studies</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            <Link
              href="/case-studies/virtual-assistant-london"
              className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <p className="text-xs font-semibold uppercase tracking-widest text-[#2C68C4] mb-2">
                London · Virtual Assistant
              </p>
              <h3 className="font-bold text-[#1a1a2e] mb-2 group-hover:text-[#2C68C4] transition-colors">
                Sarah M. — Professional Documents in 24 Hours
              </h3>
              <p className="text-sm text-[#5a5a7a]">
                How a London VA got client contracts and a GDPR policy after two years of informal arrangements.
              </p>
              <span className="text-[#2C68C4] text-sm font-semibold mt-3 inline-block group-hover:underline">
                Read story →
              </span>
            </Link>
            <Link
              href="/case-studies/marketing-consultant-manchester"
              className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <p className="text-xs font-semibold uppercase tracking-widest text-[#2C68C4] mb-2">
                Manchester · Marketing Consultant
              </p>
              <h3 className="font-bold text-[#1a1a2e] mb-2 group-hover:text-[#2C68C4] transition-colors">
                James T. — GDPR Compliant in 24 Hours
              </h3>
              <p className="text-sm text-[#5a5a7a]">
                How a Manchester marketing consultant resolved GDPR anxiety with professional privacy policy and terms.
              </p>
              <span className="text-[#2C68C4] text-sm font-semibold mt-3 inline-block group-hover:underline">
                Read story →
              </span>
            </Link>
          </div>
          <div className="mt-6 text-center">
            <Link href="/case-studies" className="text-[#2C68C4] hover:text-[#1B3F7A] font-medium">
              ← Back to all case studies
            </Link>
          </div>
        </div>
      </section>

      {/* Internal Links */}
      <section className="bg-white py-12 px-6">
        <div className="max-w-[860px] mx-auto text-center">
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
            <Link href="/blog" className="text-[#2C68C4] hover:text-[#1B3F7A] font-medium">
              Blog →
            </Link>
          </nav>
        </div>
      </section>
    </>
  );
}
