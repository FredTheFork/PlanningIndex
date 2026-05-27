import type { Metadata } from 'next';
import Link from 'next/link';
import { CircleCheck as CheckCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Business Documents for Manchester Sole Traders - 24 Hour Delivery',
  description: 'Professional business documents for Manchester-based sole traders and freelancers. Contracts, privacy policies, invoices delivered in 24 hours.',
  keywords: ['Manchester sole trader', 'freelancer Manchester', 'business documents Manchester', 'UK freelancer contract'],
  openGraph: {
    title: 'Foundationary - Business Documents for Manchester Sole Traders',
    description: 'Professional business documents tailored for Manchester businesses. Delivered in 24 hours.',
    url: 'https://foundationary.vercel.app/manchester',
    images: [{ url: '/og-home.png', width: 1200, height: 630 }],
  },
  alternates: {
    canonical: 'https://foundationary.vercel.app/manchester',
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

export default function ManchesterPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'LocalBusiness',
            '@id': 'https://foundationary.vercel.app/#manchester',
            name: 'Foundationary - Manchester',
            description: 'Professional business documents for Manchester sole traders',
            url: 'https://foundationary.vercel.app/manchester',
            areaServed: {
              '@type': 'City',
              name: 'Manchester',
              containedInPlace: {
                '@type': 'Country',
                name: 'United Kingdom',
              },
            },
            geo: {
              '@type': 'GeoCoordinates',
              latitude: '53.4808',
              longitude: '-2.2426',
            },
            serviceType: ['Document Drafting', 'Legal Document Preparation'],
          }),
        }}
      />

      {/* Hero */}
      <section className="bg-white pt-[100px] pb-20 md:pt-[120px] px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex items-center gap-3 mb-5">
            <span className="w-8 h-0.5 bg-[#2C68C4]" />
            <span className="font-semibold text-[#2C68C4] uppercase text-xs tracking-widest">
              For Manchester Sole Traders
            </span>
          </div>
          <h1 className="font-bold text-[#1a1a2e] text-4xl md:text-5xl mb-5">
            Business Documents for Manchester Professionals
          </h1>
          <p className="text-[#5a5a7a] text-lg max-w-[620px]">
            Serving Manchester&apos;s thriving independent business community with professional documents tailored to your specific needs. From the Northern Quarter to MediaCity, get your business properly set up in 24 hours.
          </p>
          <div className="flex flex-wrap gap-4 mt-8">
            <Link href="/checkout" className="bg-[#1B3F7A] text-white font-semibold rounded-lg hover:bg-[#2C68C4] transition-colors px-8 py-4">
              Get Started — £79
            </Link>
            <Link href="/whats-included" className="border-2 border-[#1B3F7A] text-[#1B3F7A] font-semibold rounded-lg hover:bg-[#F0F4FF] transition-colors px-8 py-4">
              What&apos;s Included →
            </Link>
          </div>
        </div>
      </section>

      {/* Manchester Professions */}
      <section className="bg-[#F8FAFE] py-16 px-6">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="font-bold text-[#1a1a2e] text-3xl mb-8 text-center">
            Serving Manchester&apos;s Independent Professionals
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {['Marketing Consultants', 'Creative Designers', 'Software Developers', 'Virtual Assistants', 'Business Coaches', 'Content Writers'].map((profession) => (
              <div key={profession} className="bg-white rounded-lg p-6 text-center">
                <div className="text-[#2C68C4] font-semibold text-lg">{profession}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="bg-white py-16 px-6">
        <div className="max-w-[900px] mx-auto">
          <h2 className="font-bold text-[#1a1a2e] text-3xl mb-6 text-center">
            Complete Business Foundations Pack
          </h2>
          <div className="bg-[#F0F4FF] rounded-2xl p-8">
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
                <span className="text-[#5a5a7a]">one-time payment</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Manchester Case Study */}
      <section className="bg-[#1B3F7A] py-16 px-6 text-white">
        <div className="max-w-[800px] mx-auto text-center">
          <h2 className="font-bold text-3xl mb-4">
            Manchester Case Study
          </h2>
          <p className="text-[#A8C5FF] mb-6">
            See how James, a Manchester Marketing Consultant, got GDPR compliant and professional documents in 24 hours.
          </p>
          <Link href="/case-studies/marketing-consultant-manchester" className="inline-block bg-white text-[#1B3F7A] font-semibold rounded-lg hover:bg-[#F8FAFE] transition-colors px-8 py-4">
            Read James&apos;s Story →
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white py-16 px-6">
        <div className="max-w-[800px] mx-auto text-center">
          <h2 className="font-bold text-[#1a1a2e] text-3xl mb-4">
            Ready to get your business documents sorted?
          </h2>
          <p className="text-[#5a5a7a] mb-8">
            Join Manchester professionals who operate with proper business foundations.
          </p>
          <Link href="/checkout" className="inline-block bg-[#1B3F7A] text-white font-semibold rounded-lg hover:bg-[#2C68C4] transition-colors px-10 py-5">
            Get Started Now →
          </Link>
        </div>
      </section>

      {/* Internal Links */}
      <section className="bg-[#F8FAFE] py-12 px-6">
        <div className="max-w-[1200px] mx-auto text-center">
          <nav className="flex flex-wrap justify-center gap-6">
            <Link href="/whats-included" className="text-[#2C68C4] hover:text-[#1B3F7A] font-medium">What&apos;s Included →</Link>
            <Link href="/pricing" className="text-[#2C68C4] hover:text-[#1B3F7A] font-medium">Pricing →</Link>
            <Link href="/how-it-works" className="text-[#2C68C4] hover:text-[#1B3F7A] font-medium">How It Works →</Link>
            <Link href="/faq" className="text-[#2C68C4] hover:text-[#1B3F7A] font-medium">FAQs →</Link>
          </nav>
        </div>
      </section>
    </>
  );
}
