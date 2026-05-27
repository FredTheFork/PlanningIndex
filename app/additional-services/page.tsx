import type { Metadata } from 'next';
import Link from 'next/link';
import { Globe, Share2, RefreshCw } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Additional Services - Website Copy & Social Media Packs',
  description: 'Enhance your business foundations with website copy starter pack, social media starter pack, and quarterly document refresh services.',
  keywords: [
    'website copy sole trader UK',
    'social media pack freelancer',
    'quarterly document refresh',
    'business add-ons UK',
    'sole trader website copywriting',
    'social media starter pack UK',
  ],
  openGraph: {
    title: 'Additional Services - Website Copy, Social Media & Document Refresh',
    description: 'Three add-on services to complement your Business Foundations Pack. Starting from £29/quarter.',
    url: 'https://foundationary.vercel.app/additional-services',
    images: [{ url: '/og-additional-services.png', width: 1200, height: 630 }],
  },
  alternates: {
    canonical: 'https://foundationary.vercel.app/additional-services',
  },
};

const services = [
  {
    id: 'website-copy',
    num: '01',
    icon: Globe,
    price: '£49',
    priceNote: 'one-time',
    title: 'Website Copy Starter Pack',
    tagline: 'Professional website copy without the agency price tag.',
    description:
      "Your website is often the first impression a potential client gets. This add-on gives you ready-to-use copy for the four pages every service business needs — written in your voice, optimised for clarity, and SEO-aware.",
    includes: [
      {
        page: 'Homepage',
        detail: 'Headline, subheadline, value proposition, services overview, and primary CTA',
      },
      {
        page: 'About Page',
        detail: 'Your story, your approach, and why clients should choose you',
      },
      {
        page: 'Services Page',
        detail: 'Clear descriptions of what you offer, what\'s included, and how to get started',
      },
      {
        page: 'Contact Page',
        detail: 'Brief, professional copy that encourages people to reach out',
      },
    ],
    extras: [
      'Written from your questionnaire answers — not a template',
      'Tone matched to your brand and audience',
      'SEO-aware phrasing for your service type and location',
      'Delivered as an editable Word document',
    ],
  },
  {
    id: 'social-media',
    num: '02',
    icon: Share2,
    price: '£49',
    priceNote: 'one-time',
    title: 'Social Media Starter Pack',
    tagline: '30 posts. Done. Ready to publish.',
    description:
      "Showing up consistently on social media matters — but most sole traders run out of ideas within weeks of launching. This pack gives you 30 ready-to-go posts tailored to your business, your industry, and your audience.",
    includes: [
      {
        page: '30 Post Captions',
        detail: 'Full written captions — no blanks to fill in, no placeholders',
      },
      {
        page: 'Hashtag Sets',
        detail: 'Researched hashtag groups for each post to maximise reach',
      },
      {
        page: 'Image Direction',
        detail: 'Brief art direction notes for each post so you know what visual to pair it with',
      },
      {
        page: 'Post Variety',
        detail: 'Mix of promotional, educational, relatable, and engagement-driving content',
      },
    ],
    extras: [
      'Tailored to your specific services and target audience',
      'Written in your brand tone and voice',
      'Suitable for Instagram, Facebook, and LinkedIn',
      'Delivered as a structured spreadsheet for easy scheduling',
    ],
  },
  {
    id: 'quarterly-refresh',
    num: '03',
    icon: RefreshCw,
    price: '£29',
    priceNote: 'per quarter',
    title: 'Quarterly Document Refresh',
    tagline: 'Keep your documents current as your business evolves.',
    description:
      "Your business will change. Pricing changes. Services get added or dropped. Regulations update. This service ensures your documents stay accurate and relevant — one document updated each quarter.",
    includes: [
      {
        page: 'One Document Per Quarter',
        detail: 'Choose which document to update each quarter based on what\'s changed',
      },
      {
        page: 'Change Consultation',
        detail: 'Brief questionnaire each quarter to capture what\'s changed in your business',
      },
      {
        page: 'Updated PDF + Word',
        detail: 'Fresh versions of both formats delivered within 24 hours',
      },
      {
        page: 'Regulatory Alerts',
        detail: 'We notify you if relevant UK law changes affect your documents',
      },
    ],
    extras: [
      'Cancel any time — no long-term commitment',
      'Pause if you don\'t need changes that quarter',
      'Covers any document from your original pack',
      'Applies to documents from the Business Foundations Pack',
    ],
  },
];

export default function AdditionalServicesPage() {
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
            ADD-ON SERVICES
          </span>
          <h1 className="font-bold text-white text-4xl md:text-5xl">
            Beyond the Basics
          </h1>
          <p className="mt-5 text-lg text-white/90 max-w-[620px] mx-auto">
            Once your foundations are in place, these three add-ons help you
            show up professionally everywhere else — your website, social media,
            and as your business grows.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm">
            <div className="bg-white/10 rounded-lg px-4 py-2 text-white">
              Website Copy — £49
            </div>
            <div className="bg-white/10 rounded-lg px-4 py-2 text-white">
              Social Media Pack — £49
            </div>
            <div className="bg-white/10 rounded-lg px-4 py-2 text-white">
              Quarterly Refresh — £29/qtr
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-[1100px] mx-auto space-y-20">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={service.id}
                className={`${index !== services.length - 1 ? 'pb-20 border-b border-gray-200' : ''}`}
              >
                {/* Header */}
                <div className="grid md:grid-cols-3 gap-8 mb-10">
                  <div className="md:col-span-2">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-[#F0F4FF] flex items-center justify-center">
                        <Icon className="w-6 h-6 text-[#2C68C4]" />
                      </div>
                      <span className="text-[#2C68C4] font-bold text-sm">
                        ADD-ON {service.num}
                      </span>
                    </div>
                    <h2 className="font-bold text-[#1a1a2e] text-3xl mb-2">
                      {service.title}
                    </h2>
                    <p className="text-[#5a5a7a] italic text-lg mb-4">
                      {service.tagline}
                    </p>
                    <p className="text-[#5a5a7a] leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                  <div className="flex items-start justify-start md:justify-end">
                    <div className="bg-[#F0F4FF] rounded-xl px-8 py-6 text-center min-w-[160px]">
                      <div className="text-4xl font-bold text-[#1B3F7A]">
                        {service.price}
                      </div>
                      <div className="text-[#5a5a7a] text-sm mt-1">
                        {service.priceNote}
                      </div>
                      <Link
                        href="/checkout"
                        className="mt-4 inline-block w-full font-semibold text-white bg-[#1B3F7A] rounded-lg hover:bg-[#2C68C4] transition-colors px-4 py-3 text-sm text-center"
                      >
                        Add to Order →
                      </Link>
                    </div>
                  </div>
                </div>

                {/* What's included grid */}
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Pages/deliverables */}
                  <div>
                    <h3 className="font-semibold text-[#1B3F7A] mb-5 text-sm uppercase tracking-wide">
                      What&apos;s included:
                    </h3>
                    <div className="space-y-4">
                      {service.includes.map((item, i) => (
                        <div
                          key={i}
                          className="border-l-2 border-[#2C68C4] pl-4"
                        >
                          <div className="font-semibold text-[#1a1a2e] mb-0.5">
                            {item.page}
                          </div>
                          <div className="text-[#5a5a7a] text-sm">{item.detail}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Extras */}
                  <div className="bg-[#F8FAFE] rounded-xl p-6">
                    <h3 className="font-semibold text-[#1B3F7A] mb-5 text-sm uppercase tracking-wide">
                      Also worth knowing:
                    </h3>
                    <ul className="space-y-3">
                      {service.extras.map((extra, i) => (
                        <li key={i} className="flex items-start gap-3 text-[#1a1a2e]">
                          <span className="text-[#2C68C4] mt-0.5 font-bold">✓</span>
                          <span className="text-sm">{extra}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Bundle note */}
      <section className="bg-[#F0F4FF] py-16 px-6">
        <div className="max-w-[800px] mx-auto text-center">
          <h2 className="font-bold text-[#1a1a2e] text-3xl mb-4">
            Add-ons require the Business Foundations Pack
          </h2>
          <p className="text-[#5a5a7a] text-lg mb-6">
            All add-on services are available as additions to the Business
            Foundations Pack (£79). Select any add-ons during checkout and
            they&apos;ll be created alongside your core documents.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/pricing"
              className="inline-block font-semibold text-[#1B3F7A] border-2 border-[#1B3F7A] rounded-lg hover:bg-[#1B3F7A] hover:text-white transition-colors px-6 py-3"
            >
              View Full Pricing →
            </Link>
            <Link
              href="/whats-included"
              className="inline-block font-semibold text-[#1B3F7A] border-2 border-[#1B3F7A] rounded-lg hover:bg-[#1B3F7A] hover:text-white transition-colors px-6 py-3"
            >
              What&apos;s in the Pack →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-[#1B3F7A] to-[#2C68C4] py-20 px-6 text-white text-center">
        <h2 className="font-bold text-4xl mb-4">Ready to build your foundations?</h2>
        <p className="text-xl mb-8 text-[#A8C5FF]">
          Start with the pack. Add what you need. Done in 24 hours.
        </p>
        <Link
          href="/checkout"
          className="inline-block font-semibold text-[#1B3F7A] bg-white rounded-lg hover:bg-[#F8FAFE] transition-colors px-10 py-5 text-lg"
        >
          Get Started — £79 →
        </Link>
      </section>

      {/* Internal Links */}
      <section className="bg-[#F8FAFE] py-12 px-6">
        <div className="max-w-[1200px] mx-auto text-center">
          <nav className="flex flex-wrap justify-center gap-6">
            <Link href="/pricing" className="text-[#2C68C4] hover:text-[#1B3F7A] font-medium">
              Pricing →
            </Link>
            <Link href="/whats-included" className="text-[#2C68C4] hover:text-[#1B3F7A] font-medium">
              What&apos;s Included →
            </Link>
            <Link href="/how-it-works" className="text-[#2C68C4] hover:text-[#1B3F7A] font-medium">
              How It Works →
            </Link>
            <Link href="/faq" className="text-[#2C68C4] hover:text-[#1B3F7A] font-medium">
              FAQs →
            </Link>
            <Link href="/contact" className="text-[#2C68C4] hover:text-[#1B3F7A] font-medium">
              Contact →
            </Link>
          </nav>
        </div>
      </section>
    </>
  );
}
