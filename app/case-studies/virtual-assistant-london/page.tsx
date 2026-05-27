import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'How Sarah, a London Virtual Assistant, Got Professional Documents in 24 Hours',
  description:
    'Case study: London-based virtual assistant gets complete business documents including client contracts and GDPR privacy policy in one day.',
  keywords: [
    'virtual assistant contract UK',
    'VA business documents London',
    'virtual assistant GDPR policy',
    'freelancer contracts London',
    'sole trader documents London',
  ],
  authors: [{ name: 'Foundationary' }],
  openGraph: {
    type: 'article',
    title: 'How Sarah, a London Virtual Assistant, Got Professional Documents in 24 Hours',
    description:
      'Case study: London-based virtual assistant gets complete business documents including client contracts and GDPR privacy policy in one day.',
    url: 'https://foundationary.vercel.app/case-studies/virtual-assistant-london',
    images: [{ url: '/og-home.png', width: 1200, height: 630, alt: 'Virtual Assistant London Case Study - Foundationary' }],
    publishedTime: '2026-05-27',
    authors: ['Foundationary'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How Sarah, a London Virtual Assistant, Got Professional Documents in 24 Hours',
    description:
      'London-based VA gets client contracts and GDPR privacy policy in 24 hours with Foundationary.',
    images: ['/og-home.png'],
  },
  alternates: {
    canonical: 'https://foundationary.vercel.app/case-studies/virtual-assistant-london',
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
    name: 'Sarah M.',
    jobTitle: 'Virtual Assistant',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'London',
      addressCountry: 'GB',
    },
  },
  reviewBody:
    "Finally got my contracts sorted after 2 years of winging it. The questionnaire made me think about things I'd never considered. I feel like a proper business now — not just someone doing work from home.",
  datePublished: '2026-05-27',
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'How Sarah, a London Virtual Assistant, Got Professional Documents in 24 Hours',
  description:
    'Case study: London-based virtual assistant gets complete business documents including client contracts and GDPR privacy policy in one day.',
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
    '@id': 'https://foundationary.vercel.app/case-studies/virtual-assistant-london',
  },
};

export default function VirtualAssistantLondonCaseStudy() {
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
              Virtual Assistant · London
            </span>
          </div>
          <h1 className="font-bold text-white text-3xl md:text-5xl leading-tight mb-5">
            How Sarah, a London Virtual Assistant, Got Professional Documents in 24 Hours
          </h1>
          <p className="text-white/85 text-lg leading-relaxed mb-7 max-w-[720px]">
            After two years of informal arrangements and no contracts, Sarah finally got her business properly set up — client contracts, GDPR policy, welcome emails, and more — all tailored to her VA work.
          </p>
          <div className="flex flex-wrap items-center gap-5 text-sm text-white/70">
            <span>
              <strong className="text-white">Sarah M.</strong> — Virtual Assistant
            </span>
            <span>·</span>
            <span>London, UK</span>
            <span>·</span>
            <time dateTime="2026-05-27">May 2026</time>
          </div>
        </div>
      </section>

      {/* Summary Bar */}
      <div className="bg-[#F0F4FF] border-b border-[#D0D9F2] px-6 py-5">
        <div className="max-w-[860px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { label: 'Profession', value: 'Virtual Assistant' },
            { label: 'Location', value: 'London' },
            { label: 'Time to Deliver', value: '24 hours' },
            { label: 'Result', value: 'Fully set up' },
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
            <h2 className="font-bold text-[#1a1a2e] text-3xl mb-5">Meet Sarah</h2>
            <div className="bg-[#F8FAFE] rounded-xl p-6 mb-6">
              <div className="grid sm:grid-cols-3 gap-4 text-sm mb-0">
                <div>
                  <p className="text-[#5a5a7a] mb-0.5">Name</p>
                  <p className="font-semibold text-[#1a1a2e]">Sarah M.</p>
                </div>
                <div>
                  <p className="text-[#5a5a7a] mb-0.5">Profession</p>
                  <p className="font-semibold text-[#1a1a2e]">Virtual Assistant</p>
                </div>
                <div>
                  <p className="text-[#5a5a7a] mb-0.5">Location</p>
                  <p className="font-semibold text-[#1a1a2e]">London, UK</p>
                </div>
              </div>
            </div>
            <p className="text-[#3a3a5a] leading-relaxed text-lg mb-4">
              Sarah had been working as a virtual assistant for two years when she came to Foundationary. She provided inbox management, diary coordination, and admin support to small business owners across the UK — mostly sourced through referrals and word of mouth.
            </p>
            <p className="text-[#3a3a5a] leading-relaxed text-lg">
              Business was going well. She had regular clients, a decent rate, and work she genuinely enjoyed. But underneath the day-to-day, something was quietly worrying her: she had never actually formalised anything. No contracts. No written terms. No privacy policy on her website. Just emails and trust.
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
            <h2 className="font-bold text-[#1a1a2e] text-3xl mb-5">No contracts. Informal arrangements. Growing risk.</h2>
            <p className="text-[#3a3a5a] leading-relaxed text-lg mb-4">
              Sarah&apos;s arrangement with clients was built entirely on good faith. She would agree a scope of work by email, start on a handshake, and send invoices when the work was done. It had worked — so far. But she knew it only needed one difficult client to unravel everything.
            </p>
            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-4 bg-[#FFF5F5] rounded-lg p-5 border-l-4 border-red-400">
                <div>
                  <h3 className="font-semibold text-[#1a1a2e] mb-1">No formal client contract</h3>
                  <p className="text-[#5a5a7a] text-sm leading-relaxed">
                    There was nothing in writing defining the scope of her work, her notice period, IP ownership, or what happened if a client disputed an invoice. An email chain is not a contract.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 bg-[#FFF5F5] rounded-lg p-5 border-l-4 border-red-400">
                <div>
                  <h3 className="font-semibold text-[#1a1a2e] mb-1">No GDPR privacy policy</h3>
                  <p className="text-[#5a5a7a] text-sm leading-relaxed">
                    As a VA, Sarah handled sensitive client data daily — email inboxes, calendars, client databases. She was a data processor under UK GDPR. She had no privacy policy on her website and no data processing agreements with clients.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 bg-[#FFF5F5] rounded-lg p-5 border-l-4 border-red-400">
                <div>
                  <h3 className="font-semibold text-[#1a1a2e] mb-1">Unprofessional onboarding</h3>
                  <p className="text-[#5a5a7a] text-sm leading-relaxed">
                    New clients received an informal email after agreeing to work together. There was no welcome pack, no clear process, and nothing that communicated &ldquo;this is a properly run business.&rdquo;
                  </p>
                </div>
              </div>
            </div>
            <p className="text-[#3a3a5a] leading-relaxed">
              She had looked at generic contract templates online, but they felt too generic — clearly not written for a virtual assistant, clearly not UK-specific. She did not know where to start with GDPR. Hiring a solicitor felt expensive and intimidating. So she had done nothing. Until now.
            </p>
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
              Sarah discovered Foundationary through a VA community Facebook group, where another member had recommended it. She placed her order, completed the structured questionnaire — which took around 45 minutes — and received her complete document pack the following day.
            </p>

            <h3 className="font-semibold text-[#1B3F7A] text-xl mb-4">What she received</h3>
            <div className="grid sm:grid-cols-2 gap-4 mb-7">
              {[
                {
                  doc: 'Bespoke Client Contract',
                  detail: 'Tailored to VA work: scope of services, retainer terms, IP clauses, termination provisions.',
                },
                {
                  doc: 'Terms & Conditions',
                  detail: 'Clear payment terms, late payment policy, cancellation clause, and client obligations.',
                },
                {
                  doc: 'GDPR Privacy Policy',
                  detail: 'Written specifically for a VA handling client data — covering her role as data processor.',
                },
                {
                  doc: 'Professional Bio',
                  detail: 'First and third person versions, ready for her website and LinkedIn profile.',
                },
                {
                  doc: 'Elevator Pitch (3 Versions)',
                  detail: 'Short, medium, and long versions tailored to her services and ideal client.',
                },
                {
                  doc: 'LinkedIn Profile Script',
                  detail: 'Headline, summary, and experience sections written for a London VA.',
                },
                {
                  doc: 'Professional Invoice Template',
                  detail: 'UK-compliant, with her business details and payment terms pre-filled.',
                },
                {
                  doc: 'New Client Welcome Emails (x3)',
                  detail: 'Onboarding sequence from first contact through project start — professional and warm.',
                },
                {
                  doc: 'Late Payment Letters (x3)',
                  detail: 'Graduated reminders from gentle nudge to formal demand, UK law referenced.',
                },
                {
                  doc: 'Service Description Sheet',
                  detail: 'One-page summary of her VA services for sending to prospective clients.',
                },
              ].map((item) => (
                <div key={item.doc} className="bg-[#F8FAFE] rounded-lg p-4">
                  <p className="font-semibold text-[#1B3F7A] text-sm mb-1">{item.doc}</p>
                  <p className="text-[#5a5a7a] text-xs leading-relaxed">{item.detail}</p>
                </div>
              ))}
            </div>

            <div className="bg-[#F0F4FF] rounded-xl p-6 border-l-4 border-[#2C68C4]">
              <p className="text-[#3a3a5a] text-sm leading-relaxed">
                <strong className="text-[#1B3F7A]">Key detail:</strong> The questionnaire asked Sarah specifically about the type of data she handled for clients, how she stored it, her notice period preferences, whether she worked with clients in the EU, and how she wanted to handle scope changes. This meant the GDPR policy and contract were specific to her actual working arrangements — not a generic template.
              </p>
            </div>
          </section>

          {/* Results */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-0.5 bg-[#2C68C4]" />
              <span className="font-semibold text-[#2C68C4] uppercase text-xs tracking-widest">
                The Results
              </span>
            </div>
            <h2 className="font-bold text-[#1a1a2e] text-3xl mb-5">Professional, protected, and properly set up</h2>
            <p className="text-[#3a3a5a] leading-relaxed text-lg mb-6">
              Within 24 hours of completing the questionnaire, Sarah had a complete set of professional business documents — in both PDF and editable Word formats. She sent the new client contract to her existing clients the same week, updated her website with the privacy policy, and started using the welcome email sequence immediately.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center bg-[#F0F4FF] rounded-xl p-6">
                <p className="text-4xl font-bold text-[#1B3F7A] mb-2">24h</p>
                <p className="text-[#5a5a7a] text-sm">From questionnaire to complete document pack</p>
              </div>
              <div className="text-center bg-[#F0F4FF] rounded-xl p-6">
                <p className="text-4xl font-bold text-[#1B3F7A] mb-2">10</p>
                <p className="text-[#5a5a7a] text-sm">Professional documents tailored to her VA business</p>
              </div>
              <div className="text-center bg-[#F0F4FF] rounded-xl p-6">
                <p className="text-4xl font-bold text-[#1B3F7A] mb-2">£79</p>
                <p className="text-[#5a5a7a] text-sm">One-time investment vs. hundreds for a solicitor</p>
              </div>
            </div>

            <div className="space-y-4">
              {[
                {
                  title: 'Peace of mind',
                  body: 'Sarah described the feeling of having proper contracts in place as &ldquo;finally being able to relax.&rdquo; She knew that if a client dispute arose, she had something concrete to refer to.',
                },
                {
                  title: 'More professional first impressions',
                  body: 'New clients now receive a welcome email sequence and a contract to sign before work begins. Several have commented positively on how professional the onboarding feels.',
                },
                {
                  title: 'GDPR compliance sorted',
                  body: 'The privacy policy is live on her website. She has data processing terms included in her client contract. Her GDPR anxiety has gone.',
                },
                {
                  title: 'Time saved',
                  body: 'She estimated she had spent several hours on various occasions trying to find suitable contract templates online, always abandoning the effort. Foundationary resolved it in one session.',
                },
              ].map((result) => (
                <div key={result.title} className="flex items-start gap-4 py-4 border-b border-gray-100">
                  <span className="text-[#2C68C4] font-bold text-lg flex-shrink-0 mt-0.5">✓</span>
                  <div>
                    <h3 className="font-semibold text-[#1a1a2e] mb-1">{result.title}</h3>
                    <p
                      className="text-[#5a5a7a] text-sm leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: result.body }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Testimonial */}
          <section className="mb-12">
            <blockquote className="bg-[#1B3F7A] rounded-2xl p-8 text-white">
              <p className="text-xl leading-relaxed mb-5 italic">
                &ldquo;Finally got my contracts sorted after 2 years of winging it. The questionnaire made me think about things I&apos;d never considered. I feel like a proper business now — not just someone doing work from home. The whole process was surprisingly easy, and the documents genuinely reflect how I work. Absolutely worth it.&rdquo;
              </p>
              <cite className="not-italic">
                <span className="font-bold text-white text-lg block">Sarah M.</span>
                <span className="text-white/70 text-sm">Virtual Assistant, London</span>
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
                Get your business documents sorted today
              </h3>
              <p className="text-white/85 mb-6 text-lg max-w-[540px] mx-auto">
                10 professional documents tailored to your sole trader business. Delivered in 24 hours. £79 one-time.
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
                How a Manchester marketing consultant resolved GDPR anxiety with a professional privacy policy and terms.
              </p>
              <span className="text-[#2C68C4] text-sm font-semibold mt-3 inline-block group-hover:underline">
                Read story →
              </span>
            </Link>
            <Link
              href="/case-studies/bookkeeper-birmingham"
              className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <p className="text-xs font-semibold uppercase tracking-widest text-[#2C68C4] mb-2">
                Birmingham · Bookkeeper
              </p>
              <h3 className="font-bold text-[#1a1a2e] mb-2 group-hover:text-[#2C68C4] transition-colors">
                Emma W. — Stronger Client Relationships
              </h3>
              <p className="text-sm text-[#5a5a7a]">
                How a Birmingham bookkeeper stopped late payments and scope creep with solid client agreements.
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
            <Link href="/london" className="text-[#2C68C4] hover:text-[#1B3F7A] font-medium">
              London Sole Traders →
            </Link>
          </nav>
        </div>
      </section>
    </>
  );
}
