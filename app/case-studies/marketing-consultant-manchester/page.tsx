import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Manchester Marketing Consultant Gets GDPR Compliant in 24 Hours',
  description:
    'Case study: Manchester-based marketing consultant solves GDPR compliance concerns with professional privacy policy and terms.',
  keywords: [
    'marketing consultant GDPR UK',
    'freelance marketing consultant contracts',
    'GDPR privacy policy Manchester',
    'sole trader GDPR compliance',
    'marketing consultant business documents',
  ],
  authors: [{ name: 'Foundationary' }],
  openGraph: {
    type: 'article',
    title: 'Manchester Marketing Consultant Gets GDPR Compliant in 24 Hours',
    description:
      'Case study: Manchester-based marketing consultant solves GDPR compliance concerns with professional privacy policy and terms.',
    url: 'https://foundationary.vercel.app/case-studies/marketing-consultant-manchester',
    images: [
      {
        url: '/og-home.png',
        width: 1200,
        height: 630,
        alt: 'Marketing Consultant Manchester Case Study - Foundationary',
      },
    ],
    publishedTime: '2026-05-27',
    authors: ['Foundationary'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Manchester Marketing Consultant Gets GDPR Compliant in 24 Hours',
    description:
      'Manchester marketing consultant resolves GDPR anxiety with a professional privacy policy and terms in 24 hours.',
    images: ['/og-home.png'],
  },
  alternates: {
    canonical:
      'https://foundationary.vercel.app/case-studies/marketing-consultant-manchester',
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
    name: 'James T.',
    jobTitle: 'Marketing Consultant',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Manchester',
      addressCountry: 'GB',
    },
  },
  reviewBody:
    "The privacy policy alone was worth it. My GDPR anxiety is finally gone. Professional quality, not some generic template. I've already recommended Foundationary to three other consultants I know.",
  datePublished: '2026-05-27',
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Manchester Marketing Consultant Gets GDPR Compliant in 24 Hours',
  description:
    'Case study: Manchester-based marketing consultant solves GDPR compliance concerns with professional privacy policy and terms.',
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
    '@id':
      'https://foundationary.vercel.app/case-studies/marketing-consultant-manchester',
  },
};

export default function MarketingConsultantManchesterCaseStudy() {
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
              Marketing Consultant · Manchester
            </span>
          </div>
          <h1 className="font-bold text-white text-3xl md:text-5xl leading-tight mb-5">
            Manchester Marketing Consultant Gets GDPR Compliant in 24 Hours
          </h1>
          <p className="text-white/85 text-lg leading-relaxed mb-7 max-w-[720px]">
            James had been managing clients&apos; marketing data for years with no formal data protection policy. One conversation about GDPR at a networking event sent him to Foundationary — and he was fully sorted by the next morning.
          </p>
          <div className="flex flex-wrap items-center gap-5 text-sm text-white/70">
            <span>
              <strong className="text-white">James T.</strong> — Marketing Consultant
            </span>
            <span>·</span>
            <span>Manchester, UK</span>
            <span>·</span>
            <time dateTime="2026-05-27">May 2026</time>
          </div>
        </div>
      </section>

      {/* Summary Bar */}
      <div className="bg-[#F0F4FF] border-b border-[#D0D9F2] px-6 py-5">
        <div className="max-w-[860px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { label: 'Profession', value: 'Marketing Consultant' },
            { label: 'Location', value: 'Manchester' },
            { label: 'Time to Deliver', value: '24 hours' },
            { label: 'Result', value: 'GDPR compliant' },
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
            <h2 className="font-bold text-[#1a1a2e] text-3xl mb-5">Meet James</h2>
            <div className="bg-[#F8FAFE] rounded-xl p-6 mb-6">
              <div className="grid sm:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-[#5a5a7a] mb-0.5">Name</p>
                  <p className="font-semibold text-[#1a1a2e]">James T.</p>
                </div>
                <div>
                  <p className="text-[#5a5a7a] mb-0.5">Profession</p>
                  <p className="font-semibold text-[#1a1a2e]">Marketing Consultant</p>
                </div>
                <div>
                  <p className="text-[#5a5a7a] mb-0.5">Location</p>
                  <p className="font-semibold text-[#1a1a2e]">Manchester, UK</p>
                </div>
              </div>
            </div>
            <p className="text-[#3a3a5a] leading-relaxed text-lg mb-4">
              James had been running as a freelance marketing consultant for three years out of Manchester. He specialised in content strategy and campaign planning for small to mid-sized businesses, working with several clients simultaneously on retainer.
            </p>
            <p className="text-[#3a3a5a] leading-relaxed text-lg">
              His work involved handling a lot of personal data — email lists, CRM exports, customer analytics, audience data. He ran campaigns on behalf of clients, meaning he regularly processed data about their customers. He knew GDPR was a thing. He knew it applied to him. And the not-quite-knowing what he needed to do had become a persistent source of stress.
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
            <h2 className="font-bold text-[#1a1a2e] text-3xl mb-5">GDPR anxiety. Data protection concerns. Unclear obligations.</h2>
            <p className="text-[#3a3a5a] leading-relaxed text-lg mb-4">
              The trigger came at a Manchester freelancer networking event, where another consultant mentioned an ICO investigation into a small business for a GDPR breach. It was a wake-up call. James went home and searched for what he actually needed to have in place — and found mostly confusing guidance and expensive solicitor services.
            </p>

            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-4 bg-[#FFF5F5] rounded-lg p-5 border-l-4 border-red-400">
                <div>
                  <h3 className="font-semibold text-[#1a1a2e] mb-1">No privacy policy</h3>
                  <p className="text-[#5a5a7a] text-sm leading-relaxed">
                    His website had no privacy policy. As a consultant who collected data via contact forms and email, this was a direct GDPR obligation he was not meeting.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 bg-[#FFF5F5] rounded-lg p-5 border-l-4 border-red-400">
                <div>
                  <h3 className="font-semibold text-[#1a1a2e] mb-1">No data processing terms with clients</h3>
                  <p className="text-[#5a5a7a] text-sm leading-relaxed">
                    James processed data on behalf of his clients, making him a data processor under UK GDPR. His client contracts had nothing about how he handled their data, what security measures he used, or how breaches would be handled.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 bg-[#FFF5F5] rounded-lg p-5 border-l-4 border-red-400">
                <div>
                  <h3 className="font-semibold text-[#1a1a2e] mb-1">No formal service agreement</h3>
                  <p className="text-[#5a5a7a] text-sm leading-relaxed">
                    Beyond GDPR, his retainer arrangements with clients were undocumented. Scope was agreed by email, and he had no standard terms covering what happened if a client ended the retainer early.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#FFF9E6] border border-[#F5C842] rounded-lg p-5 mb-4">
              <p className="text-[#7A5900] text-sm font-medium mb-1">Why GDPR matters for marketing consultants</p>
              <p className="text-[#7A5900] text-sm leading-relaxed">
                Marketing consultants frequently process personal data — email lists, advertising audiences, analytics data. Under UK GDPR, processing data on behalf of clients makes you a data processor, and you must have data processing agreements in place. Operating without them is a compliance failure, not a technicality.
              </p>
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
              James found Foundationary through a Google search for &ldquo;GDPR privacy policy for freelance marketing consultant UK.&rdquo; The questionnaire asked him specifically about the types of data he processed, how he stored it, whether he used any third-party tools (he used a CRM and email platform for client campaigns), and how long he retained data. This level of detail is what separated the result from any generic template.
            </p>

            <h3 className="font-semibold text-[#1B3F7A] text-xl mb-4">What he received</h3>
            <div className="grid sm:grid-cols-2 gap-4 mb-7">
              {[
                {
                  doc: 'GDPR Privacy Policy',
                  detail: 'Tailored to a marketing consultant who processes client data and uses third-party tools — not a one-size-fits-all template.',
                  highlight: true,
                },
                {
                  doc: 'Bespoke Client Contract',
                  detail: 'Retainer terms, scope of marketing services, IP ownership for campaign assets, and data processing obligations.',
                  highlight: true,
                },
                {
                  doc: 'Terms & Conditions',
                  detail: 'Payment terms, early termination clauses for retainer clients, and a clear cancellation policy.',
                  highlight: false,
                },
                {
                  doc: 'Professional Bio',
                  detail: 'First and third person versions, ready to deploy across his website, LinkedIn, and proposals.',
                  highlight: false,
                },
                {
                  doc: 'Elevator Pitch (3 Versions)',
                  detail: 'Short, medium, and long pitches for networking events, emails, and proposal introductions.',
                  highlight: false,
                },
                {
                  doc: 'LinkedIn Profile Script',
                  detail: 'Updated headline and summary positioning him as a specialist Manchester marketing consultant.',
                  highlight: false,
                },
                {
                  doc: 'Professional Invoice Template',
                  detail: 'UK-compliant invoice format with retainer payment terms pre-configured.',
                  highlight: false,
                },
                {
                  doc: 'New Client Welcome Emails (x3)',
                  detail: 'Professional onboarding sequence from initial agreement to project kickoff.',
                  highlight: false,
                },
                {
                  doc: 'Late Payment Letters (x3)',
                  detail: 'Graduated reminder sequence for overdue invoices, with UK statutory interest rates referenced.',
                  highlight: false,
                },
                {
                  doc: 'Service Description Sheet',
                  detail: 'Clear, professional overview of his marketing consultancy services for proposals and networking.',
                  highlight: false,
                },
              ].map((item) => (
                <div
                  key={item.doc}
                  className={`rounded-lg p-4 ${item.highlight ? 'bg-[#EFF4FF] border border-[#B8CCFF]' : 'bg-[#F8FAFE]'}`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="font-semibold text-[#1B3F7A] text-sm">{item.doc}</p>
                    {item.highlight && (
                      <span className="text-xs font-semibold text-white bg-[#2C68C4] rounded px-2 py-0.5 flex-shrink-0">
                        Key doc
                      </span>
                    )}
                  </div>
                  <p className="text-[#5a5a7a] text-xs leading-relaxed">{item.detail}</p>
                </div>
              ))}
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
            <h2 className="font-bold text-[#1a1a2e] text-3xl mb-5">GDPR compliant, properly contracted, and more confident</h2>
            <p className="text-[#3a3a5a] leading-relaxed text-lg mb-6">
              James published his privacy policy the same day the documents arrived. He sent updated contracts to his three existing retainer clients within the week, and all signed without question — two of them commenting that it looked very professional. He described it as &ldquo;the thing that had been on my to-do list for 18 months, done in 24 hours.&rdquo;
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center bg-[#F0F4FF] rounded-xl p-6">
                <p className="text-4xl font-bold text-[#1B3F7A] mb-2">24h</p>
                <p className="text-[#5a5a7a] text-sm">From questionnaire to complete, compliant document pack</p>
              </div>
              <div className="text-center bg-[#F0F4FF] rounded-xl p-6">
                <p className="text-4xl font-bold text-[#1B3F7A] mb-2">10</p>
                <p className="text-[#5a5a7a] text-sm">Professional documents tailored to his consultancy</p>
              </div>
              <div className="text-center bg-[#F0F4FF] rounded-xl p-6">
                <p className="text-4xl font-bold text-[#1B3F7A] mb-2">3</p>
                <p className="text-[#5a5a7a] text-sm">Colleagues he has since recommended Foundationary to</p>
              </div>
            </div>

            <div className="space-y-4">
              {[
                {
                  title: 'GDPR anxiety resolved',
                  body: 'His privacy policy is live, his contracts include data processing terms, and he knows exactly what his obligations are. The background worry that had been sitting with him for 18 months is gone.',
                },
                {
                  title: 'More professional client relationships',
                  body: 'Existing clients received updated contracts and all signed willingly. Several commented positively on the professionalism of the paperwork.',
                },
                {
                  title: 'Stronger retainer protection',
                  body: 'His new contract includes a clear early termination clause for retainer clients — something he had experienced problems with before but never had the tools to address properly.',
                },
                {
                  title: 'Better first impressions with new clients',
                  body: 'New clients are now onboarded with a proper welcome email sequence and a contract to review before work begins — reinforcing his position as a serious, professional consultant.',
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
                &ldquo;The privacy policy alone was worth it. My GDPR anxiety is finally gone. Professional quality, not some generic template. I&apos;ve already recommended Foundationary to three other consultants I know.&rdquo;
              </p>
              <cite className="not-italic">
                <span className="font-bold text-white text-lg block">James T.</span>
                <span className="text-white/70 text-sm">Marketing Consultant, Manchester</span>
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
                Get GDPR compliant and properly set up today
              </h3>
              <p className="text-white/85 mb-6 text-lg max-w-[540px] mx-auto">
                10 professional documents — including a tailored GDPR privacy policy — delivered in 24 hours. £79 one-time.
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
            <Link href="/blog" className="text-[#2C68C4] hover:text-[#1B3F7A] font-medium">
              Blog →
            </Link>
          </nav>
        </div>
      </section>
    </>
  );
}
