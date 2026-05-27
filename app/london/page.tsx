import type { Metadata } from 'next';
import Link from 'next/link';
import { CircleCheck as CheckCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Business Documents for London Sole Traders - 24 Hour Delivery',
  description:
    'Professional business documents for London-based sole traders and freelancers. Contracts, privacy policies, invoices delivered in 24 hours to London businesses.',
  keywords: [
    'business documents London',
    'sole trader London',
    'freelancer London',
    'London sole trader contracts',
    'London freelancer business setup',
    'GDPR privacy policy London',
    'sole trader documents London 24 hours',
    'London VA contracts',
    'London consultant documents',
  ],
  openGraph: {
    title: 'Business Documents for London Sole Traders - 24 Hour Delivery | Foundationary',
    description:
      'Professional business documents for London-based sole traders and freelancers. Contracts, privacy policies, invoices delivered in 24 hours.',
    url: 'https://foundationary.vercel.app/london',
    images: [
      {
        url: '/og-home.png',
        width: 1200,
        height: 630,
        alt: 'Foundationary - Business Documents for London Sole Traders',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Business Documents for London Sole Traders - 24 Hour Delivery',
    description:
      'Professional business documents for London freelancers and sole traders. Delivered in 24 hours.',
    images: ['/og-home.png'],
  },
  alternates: {
    canonical: 'https://foundationary.vercel.app/london',
  },
};

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Foundationary',
  description:
    'Professional business document drafting for London sole traders and freelancers. Contracts, privacy policies, invoices and more — delivered in 24 hours.',
  url: 'https://foundationary.vercel.app',
  areaServed: [
    {
      '@type': 'City',
      name: 'London',
      '@id': 'https://www.wikidata.org/wiki/Q84',
    },
    {
      '@type': 'Country',
      name: 'United Kingdom',
    },
  ],
  geo: {
    '@type': 'GeoCoordinates',
    latitude: '51.5074',
    longitude: '-0.1278',
  },
  priceRange: '££',
  currenciesAccepted: 'GBP',
  openingHours: 'Mo-Fr 09:00-17:00',
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Business Foundation Documents',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Business Foundations Pack',
          description: '10 professional business documents for UK sole traders, delivered in 24 hours',
        },
        price: '79',
        priceCurrency: 'GBP',
      },
    ],
  },
};

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Business Document Drafting for London Sole Traders',
  provider: {
    '@type': 'Organization',
    name: 'Foundationary',
    url: 'https://foundationary.vercel.app',
  },
  areaServed: {
    '@type': 'City',
    name: 'London',
  },
  description:
    'Professional business documents for London sole traders — client contracts, GDPR privacy policies, invoices, bios, and more. Tailored, delivered in 24 hours.',
  serviceType: 'Document Preparation',
  offers: {
    '@type': 'Offer',
    price: '79',
    priceCurrency: 'GBP',
    availability: 'https://schema.org/InStock',
  },
};

const features = [
  'Bespoke Client Contract',
  'Terms & Conditions',
  'GDPR Privacy Policy',
  'Professional Bio',
  'Elevator Pitch (3 Versions)',
  'LinkedIn Profile Script',
  'Professional Invoice Template',
  'New Client Welcome Emails (×3)',
  'Late Payment Letters (×3)',
  'Service Description Sheets',
];

const londonProfessions = [
  {
    title: 'Virtual Assistants',
    description:
      'Client contracts, GDPR policies, and onboarding documents for London VAs working with businesses across the capital.',
  },
  {
    title: 'Marketing Consultants',
    description:
      'Retainer agreements, data processing terms, and professional materials for London marketing freelancers.',
  },
  {
    title: 'Bookkeepers & Accountants',
    description:
      'Engagement letters, T&Cs, and GDPR-compliant privacy policies for London bookkeepers handling financial data.',
  },
  {
    title: 'Designers & Creatives',
    description:
      'IP assignment clauses, project contracts, and professional positioning for London creative sole traders.',
  },
  {
    title: 'Coaches & Consultants',
    description:
      'Coaching agreements, terms, and professional bios for London business coaches and independent consultants.',
  },
  {
    title: 'IT & Tech Freelancers',
    description:
      'Data handling terms, service agreements, and professional documents for London tech and IT contractors.',
  },
];

export default function LondonPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />

      {/* Hero Section */}
      <section className="bg-white pt-[100px] pb-20 md:pt-[120px] md:pb-20 px-6">
        <div className="max-w-[1200px] mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          <div className="flex-1 max-w-xl">
            <div className="flex items-center gap-3 mb-5">
              <span className="w-8 h-0.5 bg-[#2C68C4]" />
              <span className="font-semibold text-[#2C68C4] uppercase text-xs tracking-widest">
                For London Sole Traders
              </span>
            </div>

            <h1 className="font-bold text-[#1a1a2e] leading-tight text-5xl md:text-6xl">
              Business Documents for London Sole Traders.{' '}
              <span className="text-[#2C68C4]">24 Hour Delivery.</span>
            </h1>

            <p className="text-[#5a5a7a] mt-5 text-lg leading-relaxed">
              Professional contracts, GDPR privacy policies, invoices, and more — built entirely around your London sole trader business. Done for you. Delivered in 24 hours.
            </p>

            <div className="flex flex-wrap gap-4 mt-9">
              <Link
                href="/checkout"
                className="font-semibold text-white bg-[#1B3F7A] rounded-lg hover:bg-[#2C68C4] hover:-translate-y-px transition-all duration-200 px-8 py-4"
              >
                Get Started — £79
              </Link>
              <Link
                href="/whats-included"
                className="font-semibold text-[#1B3F7A] border-2 border-[#1B3F7A] rounded-lg hover:bg-[#F0F4FF] transition-colors duration-200 px-8 py-4"
              >
                See What&apos;s Included →
              </Link>
            </div>

            <div className="flex flex-wrap gap-6 mt-8 text-sm text-[#5a5a7a]">
              <span>✓ Delivered in 24 hours</span>
              <span>✓ UK law compliant</span>
              <span>✓ Money-back guarantee</span>
            </div>
          </div>

          <div className="flex-1 max-w-md w-full">
            <div className="bg-[#F0F4FF] rounded-2xl p-8 shadow-lg">
              <h3 className="font-bold text-[#1B3F7A] text-2xl mb-4">What London sole traders get:</h3>
              <ul className="space-y-3">
                {features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#2C68C4] mt-0.5 flex-shrink-0" />
                    <span className="text-[#1a1a2e]">{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 pt-6 border-t border-[#D0D9F2]">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-[#1B3F7A]">£79</span>
                  <span className="text-[#5a5a7a]">one-time</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* London-Specific Section */}
      <section className="bg-[#F8FAFE] py-16 px-6">
        <div className="max-w-[1200px] mx-auto text-center">
          <p className="text-[#5a5a7a] text-sm uppercase tracking-widest mb-4">
            Trusted by London Sole Traders &amp; Freelancers
          </p>
          <div className="flex flex-wrap justify-center gap-12 items-center opacity-60">
            <div className="text-2xl font-bold text-[#1B3F7A]">Trustpilot ⭐ 4.9</div>
            <div className="text-2xl font-bold text-[#1B3F7A]">23+ Reviews</div>
            <div className="text-2xl font-bold text-[#1B3F7A]">UK Based</div>
          </div>
        </div>
      </section>

      {/* London Professions */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-12">
            <span className="text-[#2C68C4] font-semibold uppercase text-xs tracking-widest">
              Who We Help
            </span>
            <h2 className="mt-3 font-bold text-[#1a1a2e] text-4xl">
              Built for London freelancers across every profession
            </h2>
            <p className="text-[#5a5a7a] mt-4 text-lg max-w-[600px] mx-auto">
              Whether you&apos;re a VA in Hackney, a consultant in the City, or a designer in Shoreditch — Foundationary tailors your documents to your specific work.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {londonProfessions.map((profession) => (
              <div key={profession.title} className="bg-[#F8FAFE] rounded-xl p-6">
                <h3 className="font-semibold text-[#1B3F7A] text-lg mb-2">{profession.title}</h3>
                <p className="text-[#5a5a7a] text-sm leading-relaxed">{profession.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="bg-[#F8FAFE] py-20 px-6">
        <div className="max-w-[900px] mx-auto">
          <div className="text-center mb-12">
            <span className="text-[#2C68C4] font-semibold uppercase text-xs tracking-widest">
              The Problem
            </span>
            <h2 className="mt-3 font-bold text-[#1a1a2e] text-4xl">
              London freelancers are one dispute away from disaster.
            </h2>
            <p className="text-[#5a5a7a] mt-4 text-lg">
              London&apos;s freelance market is competitive and fast-moving. Clients expect professionalism — but many sole traders are operating without the documents to back it up.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg p-6">
              <h3 className="font-semibold text-[#1B3F7A] text-xl mb-3">No Contract</h3>
              <p className="text-[#5a5a7a]">
                Verbal agreements and WhatsApp messages aren&apos;t contracts. When things go wrong with a London client, you have no legal standing.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6">
              <h3 className="font-semibold text-[#1B3F7A] text-xl mb-3">No Terms</h3>
              <p className="text-[#5a5a7a]">
                Late payment, refund requests, scope creep — these become negotiations instead of clear-cut rules. London freelancers lose thousands to unclear terms.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6">
              <h3 className="font-semibold text-[#1B3F7A] text-xl mb-3">No Privacy Policy</h3>
              <p className="text-[#5a5a7a]">
                GDPR applies the moment you collect someone&apos;s email — including London clients. Non-compliance risks ICO fines regardless of where in the UK you operate.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6">
              <h3 className="font-semibold text-[#1B3F7A] text-xl mb-3">Generic Templates Don&apos;t Cut It</h3>
              <p className="text-[#5a5a7a]">
                Free templates online are not tailored to your business. London clients work with professionals — your documents should reflect that.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-[#1B3F7A] py-20 px-6 text-white">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-12">
            <span className="text-[#A8C5FF] font-semibold uppercase text-xs tracking-widest">
              How It Works
            </span>
            <h2 className="mt-3 font-bold text-4xl">
              Three steps. 24 hours. Done.
            </h2>
            <p className="text-[#A8C5FF] mt-3 text-lg">
              No back-and-forth. No waiting weeks. Just your business documents, sorted.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#2C68C4] rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                1
              </div>
              <h3 className="font-semibold text-xl mb-3">Answer Questions</h3>
              <p className="text-[#A8C5FF]">
                45-minute structured questionnaire about your London business, services, and clients.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#2C68C4] rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                2
              </div>
              <h3 className="font-semibold text-xl mb-3">We Create Documents</h3>
              <p className="text-[#A8C5FF]">
                We draft all 10 documents tailored to your answers and UK legal requirements.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#2C68C4] rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                3
              </div>
              <h3 className="font-semibold text-xl mb-3">Receive & Use</h3>
              <p className="text-[#A8C5FF]">
                Get PDF + editable Word files within 24 hours. Use immediately with your London clients.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* London Case Study Callout */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-[900px] mx-auto">
          <div className="text-center mb-10">
            <span className="text-[#2C68C4] font-semibold uppercase text-xs tracking-widest">
              Case Study
            </span>
            <h2 className="mt-3 font-bold text-[#1a1a2e] text-4xl">
              How a London sole trader got sorted in 24 hours
            </h2>
          </div>
          <div className="bg-[#F0F4FF] rounded-2xl p-8 md:p-10">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-[#1B3F7A] rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">S</span>
                  </div>
                  <div>
                    <p className="font-bold text-[#1a1a2e]">Sarah M.</p>
                    <p className="text-[#5a5a7a] text-sm">Virtual Assistant, London</p>
                  </div>
                </div>
                <p className="text-[#5a5a7a] text-sm mb-4">
                  Sarah had been working as a VA in London for two years with no contracts, no privacy policy, and no formal client agreements. She described the situation as &ldquo;quietly worrying&rdquo; — everything was going well, but one difficult client could unravel everything.
                </p>
                <p className="text-[#3a3a5a] text-sm">
                  After completing the Foundationary questionnaire, she received all 10 documents the next morning — tailored to her specific VA services and London client base.
                </p>
              </div>
              <div className="flex-shrink-0 bg-[#1B3F7A] rounded-xl p-6 text-white max-w-xs">
                <p className="italic text-white/90 mb-4 text-sm leading-relaxed">
                  &ldquo;Finally got my contracts sorted after 2 years of winging it. I feel like a proper business now.&rdquo;
                </p>
                <p className="font-bold text-sm">Sarah M.</p>
                <p className="text-white/70 text-xs">Virtual Assistant, London</p>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-[#D0D9F2]">
              <Link
                href="/case-studies/virtual-assistant-london"
                className="font-semibold text-[#2C68C4] hover:text-[#1B3F7A] transition-colors"
              >
                Read Sarah&apos;s full case study →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-[#F8FAFE] py-20 px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-12">
            <span className="text-[#2C68C4] font-semibold uppercase text-xs tracking-widest">
              Testimonials
            </span>
            <h2 className="mt-3 font-bold text-[#1a1a2e] text-4xl">
              What sole traders across the UK say
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <blockquote className="bg-white rounded-lg p-8 shadow-sm">
              <p className="text-[#1a1a2e] text-lg mb-4">
                &quot;Finally got my contracts sorted after 2 years of winging it. The questionnaire made me think about things I&apos;d never considered.&quot;
              </p>
              <cite className="text-[#1B3F7A] font-semibold not-italic">
                — Sarah M., Virtual Assistant, London
              </cite>
            </blockquote>
            <blockquote className="bg-white rounded-lg p-8 shadow-sm">
              <p className="text-[#1a1a2e] text-lg mb-4">
                &quot;The privacy policy alone was worth it. My GDPR anxiety is finally gone. Professional quality, not some generic template.&quot;
              </p>
              <cite className="text-[#1B3F7A] font-semibold not-italic">
                — James T., Marketing Consultant, Manchester
              </cite>
            </blockquote>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-[#1B3F7A] to-[#2C68C4] py-20 px-6 text-white">
        <div className="max-w-[800px] mx-auto text-center">
          <h2 className="font-bold text-4xl mb-4">
            Ready to get your London business properly set up?
          </h2>
          <p className="text-xl mb-8 text-[#A8C5FF]">
            Join London sole traders who operate professionally. 10 documents. 24 hours. £79.
          </p>
          <Link
            href="/checkout"
            className="inline-block font-semibold text-[#1B3F7A] bg-white rounded-lg hover:bg-[#F8FAFE] transition-colors duration-200 px-10 py-5 text-lg"
          >
            Get Started Now →
          </Link>
          <p className="text-white/60 text-sm mt-5">7-day money-back guarantee. UK law compliant.</p>
        </div>
      </section>

      {/* Internal Links */}
      <section className="bg-white py-12 px-6">
        <div className="max-w-[1200px] mx-auto">
          <nav className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <Link href="/whats-included" className="text-[#2C68C4] hover:text-[#1B3F7A] font-medium">
              What&apos;s Included →
            </Link>
            <Link href="/pricing" className="text-[#2C68C4] hover:text-[#1B3F7A] font-medium">
              Pricing Details →
            </Link>
            <Link href="/how-it-works" className="text-[#2C68C4] hover:text-[#1B3F7A] font-medium">
              How It Works →
            </Link>
            <Link href="/faq" className="text-[#2C68C4] hover:text-[#1B3F7A] font-medium">
              FAQs →
            </Link>
            <Link href="/case-studies" className="text-[#2C68C4] hover:text-[#1B3F7A] font-medium">
              Case Studies →
            </Link>
            <Link href="/about" className="text-[#2C68C4] hover:text-[#1B3F7A] font-medium">
              About Us →
            </Link>
            <Link href="/case-studies/virtual-assistant-london" className="text-[#2C68C4] hover:text-[#1B3F7A] font-medium">
              London VA Story →
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
