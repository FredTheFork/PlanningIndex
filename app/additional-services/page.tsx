import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Additional Services — Website Copy & Social Media',
  description: 'Optional add-ons for Foundationary customers - Website Copy Starter Pack (£49), Social Media Starter Pack (£49), Quarterly Document Refresh (£29/quarter). Expand your business documentation.',
  openGraph: {
    title: 'Additional Services — Optional Business Documentation Add-ons',
    description: 'Website copy, social media packs, and quarterly document refresh services for UK sole traders.',
    url: 'https://foundationary.vercel.app/additional-services',
    images: [
      {
        url: '/og-services.png',
        width: 1200,
        height: 630,
        alt: 'Additional Services - Foundationary Add-ons',
      },
    ],
  },
};

const services = [
  {
    title: 'Website Copy Starter Pack',
    price: '£49',
    description: 'Homepage, About, Services, and Contact page copy — SEO-aware, written in your voice, ready to paste.',
    includes: [
      'Homepage headline and benefit copy',
      'About page story',
      'Services description (per service)',
      'Contact page copy',
      'SEO optimized for your keywords',
    ],
  },
  {
    title: 'Social Media Starter Pack',
    price: '£49',
    description: '30 done-for-you posts tailored to your industry, audience and tone. Captions, hashtags, image ideas.',
    includes: [
      '30 ready-to-post social media captions',
      'Hashtag recommendations',
      'Image ideas and descriptions',
      'Mix of educational, promotional, and engagement posts',
      'Suitable for LinkedIn, Twitter, and Facebook',
    ],
  },
  {
    title: 'Quarterly Document Refresh',
    price: '£29/quarter',
    description: 'One document updated each quarter as your business evolves. Pricing changes, new services, regulation updates.',
    includes: [
      'Choose one document per quarter to update',
      'Updates for price changes',
      'New services or offerings',
      'Regulatory or legal requirement changes',
      'Continuous protection as your business evolves',
    ],
  },
];

export default function AdditionalServicesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ItemPage',
            name: 'Additional Services',
            description: 'Optional add-on services for Foundationary customers.',
            url: 'https://foundationary.vercel.app/additional-services',
          }),
        }}
      />
      <div className="min-h-screen pt-24 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-dark-text mb-4">Additional Services</h1>
            <p className="text-xl text-secondary-text">
              Optional add-ons to extend your business toolkit beyond the core Business Foundations Pack.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div key={service.title} className="bg-off-white rounded-xl border border-border p-8 hover:shadow-lg transition-shadow">
                <h3 className="text-lg font-bold text-dark-text">{service.title}</h3>
                <div className="text-2xl font-bold text-medium-blue mt-2">{service.price}</div>
                <p className="text-secondary-text mt-3 text-sm leading-relaxed">{service.description}</p>

                <div className="mt-6 pt-6 border-t border-border">
                  <p className="text-xs font-semibold text-dark-text uppercase tracking-wider mb-3">Includes</p>
                  <ul className="space-y-2">
                    {service.includes.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-secondary-text">
                        <span className="text-success font-bold shrink-0 mt-0.5">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button className="w-full mt-6 bg-navy text-white px-4 py-3 rounded-lg font-semibold hover:bg-medium-blue transition-colors text-sm">
                  Add to Order
                </button>
              </div>
            ))}
          </div>

          <div className="mt-16 bg-navy text-white rounded-xl p-12 text-center">
            <h2 className="text-2xl font-bold mb-4">Already have the Business Foundations Pack?</h2>
            <p className="text-white/80 mb-8 max-w-2xl mx-auto">
              Add any of these services to your account. Email us with your order details and let us know which add-ons you'd like.
            </p>
            <Link
              href="/contact"
              className="inline-block bg-white text-navy px-8 py-3 rounded-lg font-semibold hover:bg-off-white transition-colors"
            >
              Get in Touch →
            </Link>
          </div>

          <div className="mt-12 bg-medium-blue/10 rounded-lg p-8">
            <h3 className="text-lg font-bold text-dark-text mb-4">Need Something Custom?</h3>
            <p className="text-secondary-text mb-4">
              If you need services beyond what's listed here—like industry-specific guides, email sequences, or other custom work—we'd love to discuss it.
            </p>
            <Link href="/contact" className="text-medium-blue font-semibold hover:text-navy transition-colors">
              Contact us to discuss your needs →
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
