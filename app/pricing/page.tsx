import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Pricing - Business Foundations Pack £79',
  description: 'Get 10 professional business documents for UK sole traders for just £79 one-time. No subscriptions, no hidden fees. Add-ons available for website copy and social media packs.',
  keywords: ['sole trader document pricing', 'business foundations cost', 'freelancer contract price UK', 'GDPR privacy policy cost'],
  openGraph: {
    title: 'Pricing - £79 for Complete Business Foundations Pack',
    description: '10 professional documents, 24-hour delivery, one-time payment of £79.',
    url: 'https://foundationary.vercel.app/pricing',
    images: [{ url: '/og-pricing.png', width: 1200, height: 630 }],
  },
  alternates: {
    canonical: 'https://foundationary.vercel.app/pricing',
  },
};

export default function PricingPage() {
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
              priceValidUntil: '2027-12-31',
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
            SIMPLE PRICING
          </span>
          <h1 className="font-bold text-white text-4xl md:text-5xl">
            One Price. Everything You Need.
          </h1>
          <div className="mt-8 inline-block bg-white/10 backdrop-blur rounded-2xl px-12 py-10">
            <div className="text-white/80 text-sm uppercase tracking-widest mb-2">
              Business Foundations Pack
            </div>
            <div className="flex items-baseline justify-center gap-2">
              <span className="text-6xl font-bold text-white">£79</span>
              <span className="text-white/80">one-time</span>
            </div>
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="bg-white py-16 px-6">
        <div className="max-w-[900px] mx-auto">
          <h2 className="font-bold text-[#1a1a2e] text-3xl mb-6 text-center">
            What&apos;s Included for £79
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
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
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-3 text-[#1a1a2e]">
                <span className="text-[#2C68C4] text-xl">✓</span>
                <span>{feature}</span>
              </div>
            ))}
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 grid sm:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-[#1B3F7A]">24 Hours</div>
              <div className="text-[#5a5a7a] text-sm">Delivery time</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#1B3F7A]">PDF + Word</div>
              <div className="text-[#5a5a7a] text-sm">Document formats</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#1B3F7A]">UK Law</div>
              <div className="text-[#5a5a7a] text-sm">Compliant throughout</div>
            </div>
          </div>
        </div>
      </section>

      {/* Add-Ons */}
      <section className="bg-[#F0F4FF] py-16 px-6">
        <div className="max-w-[900px] mx-auto">
          <h2 className="font-bold text-[#1a1a2e] text-3xl mb-6 text-center">
            Optional Add-Ons
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="text-sm text-[#2C68C4] font-semibold mb-2">£49 Add-On</div>
              <h3 className="font-bold text-[#1a1a2e] text-xl mb-3">Website Copy Starter Pack</h3>
              <p className="text-[#5a5a7a] text-sm">
                Homepage, About, Services, and Contact page copy — SEO-aware, written in your voice, ready to paste.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="text-sm text-[#2C68C4] font-semibold mb-2">£49 Add-On</div>
              <h3 className="font-bold text-[#1a1a2e] text-xl mb-3">Social Media Starter Pack</h3>
              <p className="text-[#5a5a7a] text-sm">
                30 done-for-you posts tailored to your industry, audience and tone. Captions, hashtags, image ideas.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="text-sm text-[#2C68C4] font-semibold mb-2">£29/Quarter</div>
              <h3 className="font-bold text-[#1a1a2e] text-xl mb-3">Quarterly Document Refresh</h3>
              <p className="text-[#5a5a7a] text-sm">
                One document updated each quarter as your business evolves. Pricing changes, new services, regulation updates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Guarantee */}
      <section className="bg-white py-16 px-6">
        <div className="max-w-[800px] mx-auto text-center">
          <h2 className="font-bold text-[#1a1a2e] text-3xl mb-6">
            Money-Back Guarantee
          </h2>
          <p className="text-[#5a5a7a] text-lg">
            Not satisfied with your documents? Get a full refund within 7 days. No questions asked. We&apos;re confident you&apos;ll love what we create, but if it&apos;s not right, you shouldn&apos;t pay.
          </p>
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
