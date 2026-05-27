import type { Metadata } from 'next';
import Link from 'next/link';
import { CircleCheck as CheckCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Business Foundations for UK Sole Traders',
  description: 'Get 10 professional business documents tailored to your UK sole trader business - contracts, privacy policies, invoices, bios, pitches and more. Done for you in 24 hours for £79.',
  keywords: ['sole trader UK', 'business documents UK', 'freelancer contract', 'GDPR privacy policy', 'client contract template', 'business foundations'],
  openGraph: {
    title: 'Foundationary — Your Business. Properly Set Up. In 24 Hours.',
    description: '10 professional documents built entirely around your UK sole trader business - contracts, privacy policies, invoices, bios, pitches and more.',
    url: 'https://foundationary.vercel.app',
    images: [
      {
        url: '/og-home.png',
        width: 1200,
        height: 630,
        alt: 'Foundationary - Professional business documents for UK sole traders',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Foundationary — Business Foundations. Fast.',
    description: 'Get 10 professional business documents done for you in 24 hours.',
    images: ['/og-home.png'],
  },
  alternates: {
    canonical: 'https://foundationary.vercel.app',
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

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: 'Business Foundations Pack',
            description: '10 professional business documents tailored to UK sole traders, delivered in 24 hours',
            brand: {
              '@type': 'Brand',
              name: 'Foundationary',
            },
            offers: {
              '@type': 'Offer',
              price: '79',
              priceCurrency: 'GBP',
              availability: 'https://schema.org/InStock',
              seller: {
                '@type': 'Organization',
                name: 'Foundationary',
              },
              priceValidUntil: '2027-12-31',
            },
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: '5',
              reviewCount: '23',
            },
          }),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: 'Business Document Drafting',
            provider: {
              '@type': 'LocalBusiness',
              name: 'Foundationary',
            },
            areaServed: {
              '@type': 'Country',
              name: 'United Kingdom',
            },
            description: 'Professional business document drafting for UK sole traders',
            serviceType: 'Document Preparation',
          }),
        }}
      />

      {/* Hero Section */}
      <section className="bg-white pt-[100px] pb-20 md:pt-[120px] md:pb-20 px-6">
        <div className="max-w-[1200px] mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          <div className="flex-1 max-w-xl">
            <div className="flex items-center gap-3 mb-5">
              <span className="w-8 h-0.5 bg-[#2C68C4]" />
              <span className="font-semibold text-[#2C68C4] uppercase text-xs tracking-widest">
                For UK Sole Traders
              </span>
            </div>

            <h1 className="font-bold text-[#1a1a2e] leading-tight text-5xl md:text-6xl">
              Your Business. Properly Set Up. In{' '}
              <span className="text-[#2C68C4]">24 Hours.</span>
            </h1>

            <p className="text-[#5a5a7a] mt-5 text-lg leading-relaxed">
              10 professional documents built entirely around your UK sole trader business — contracts, privacy policies, invoices, bios, pitches and more. Done for you. Delivered in 24 hours.
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
                See What's Included →
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
              <h3 className="font-bold text-[#1B3F7A] text-2xl mb-4">What you get:</h3>
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

      {/* Social Proof Section */}
      <section className="bg-[#F8FAFE] py-16 px-6">
        <div className="max-w-[1200px] mx-auto text-center">
          <p className="text-[#5a5a7a] text-sm uppercase tracking-widest mb-4">
            Trusted by UK Sole Traders
          </p>
          <div className="flex flex-wrap justify-center gap-12 items-center opacity-60">
            <div className="text-2xl font-bold text-[#1B3F7A]">Trustpilot ⭐ 4.9</div>
            <div className="text-2xl font-bold text-[#1B3F7A]">23+ Reviews</div>
            <div className="text-2xl font-bold text-[#1B3F7A]">UK Based</div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-[900px] mx-auto">
          <div className="text-center mb-12">
            <span className="text-[#2C68C4] font-semibold uppercase text-xs tracking-widest">
              The Problem
            </span>
            <h2 className="mt-3 font-bold text-[#1a1a2e] text-4xl">
              Most sole traders are one dispute away from disaster.
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-[#F8FAFE] rounded-lg p-6">
              <h3 className="font-semibold text-[#1B3F7A] text-xl mb-3">No Contract</h3>
              <p className="text-[#5a5a7a]">
                Verbal agreements and WhatsApp messages aren&apos;t contracts. When things go wrong, you have no legal standing.
              </p>
            </div>
            <div className="bg-[#F8FAFE] rounded-lg p-6">
              <h3 className="font-semibold text-[#1B3F7A] text-xl mb-3">No Terms</h3>
              <p className="text-[#5a5a7a]">
                Late payment, refund requests, scope creep — these become negotiations instead of clear-cut rules.
              </p>
            </div>
            <div className="bg-[#F8FAFE] rounded-lg p-6">
              <h3 className="font-semibold text-[#1B3F7A] text-xl mb-3">No Privacy Policy</h3>
              <p className="text-[#5a5a7a]">
                GDPR applies the moment you collect someone&apos;s email. Non-compliance risks ICO fines.
              </p>
            </div>
            <div className="bg-[#F8FAFE] rounded-lg p-6">
              <h3 className="font-semibold text-[#1B3F7A] text-xl mb-3">No Professional Positioning</h3>
              <p className="text-[#5a5a7a]">
                Operating without proper bios, pitches, or LinkedIn presence limits your ability to win better clients.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-[#1B3F7A] py-20 px-6 text-white">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-12">
            <span className="text-[#A8C5FF] font-semibold uppercase text-xs tracking-widest">
              How It Works
            </span>
            <h2 className="mt-3 font-bold text-4xl">
              Three steps. 24 hours. Done.
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#2C68C4] rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                1
              </div>
              <h3 className="font-semibold text-xl mb-3">Answer Questions</h3>
              <p className="text-[#A8C5FF]">
                45-minute structured questionnaire about your business, services, and clients.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#2C68C4] rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                2
              </div>
              <h3 className="font-semibold text-xl mb-3">We Create Documents</h3>
              <p className="text-[#A8C5FF]">
                We draft all 10 documents tailored to your answers and UK requirements.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#2C68C4] rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                3
              </div>
              <h3 className="font-semibold text-xl mb-3">Receive & Use</h3>
              <p className="text-[#A8C5FF]">
                Get PDF + editable Word files. Use immediately, modify as needed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-12">
            <span className="text-[#2C68C4] font-semibold uppercase text-xs tracking-widest">
              Testimonials
            </span>
            <h2 className="mt-3 font-bold text-[#1a1a2e] text-4xl">
              What sole traders say
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <blockquote className="bg-[#F8FAFE] rounded-lg p-8">
              <p className="text-[#1a1a2e] text-lg mb-4">
                &quot;Finally got my contracts sorted after 2 years of winging it. The questionnaire made me think about things I&apos;d never considered.&quot;
              </p>
              <cite className="text-[#1B3F7A] font-semibold not-italic">— Sarah M., Virtual Assistant</cite>
            </blockquote>
            <blockquote className="bg-[#F8FAFE] rounded-lg p-8">
              <p className="text-[#1a1a2e] text-lg mb-4">
                &quot;The privacy policy alone was worth it. My GDPR anxiety is finally gone. Professional quality, not some generic template.&quot;
              </p>
              <cite className="text-[#1B3F7A] font-semibold not-italic">— James T., Marketing Consultant</cite>
            </blockquote>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-[#1B3F7A] to-[#2C68C4] py-20 px-6 text-white">
        <div className="max-w-[800px] mx-auto text-center">
          <h2 className="font-bold text-4xl mb-4">
            Ready to get your business foundations sorted?
          </h2>
          <p className="text-xl mb-8 text-[#A8C5FF]">
            Join UK sole traders who operate professionally. 10 documents. 24 hours. £79.
          </p>
          <Link
            href="/checkout"
            className="inline-block font-semibold text-[#1B3F7A] bg-white rounded-lg hover:bg-[#F8FAFE] transition-colors duration-200 px-10 py-5 text-lg"
          >
            Get Started Now →
          </Link>
        </div>
      </section>

      {/* Internal Links for SEO */}
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
            <Link href="/about" className="text-[#2C68C4] hover:text-[#1B3F7A] font-medium">
              About Us →
            </Link>
            <Link href="/contact" className="text-[#2C68C4] hover:text-[#1B3F7A] font-medium">
              Contact →
            </Link>
            <Link href="/privacy" className="text-[#2C68C4] hover:text-[#1B3F7A] font-medium">
              Privacy Policy →
            </Link>
            <Link href="/terms" className="text-[#2C68C4] hover:text-[#1B3F7A] font-medium">
              Terms of Use →
            </Link>
          </nav>
        </div>
      </section>
    </>
  );
}
