import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About Foundationary — Professional Business Documents for UK Sole Traders',
  description: 'Learn about Foundationary - a done-for-you document service for UK sole traders. We create professional business documents tailored to each client\'s business without solicitor fees.',
  openGraph: {
    title: 'About Foundationary — Professional Foundations for Your Business',
    description: 'Learn about Foundationary - a done-for-you document service for UK sole traders. Professional documents without the corporate price tag.',
    url: 'https://foundationary.vercel.app/about',
    images: [
      {
        url: '/og-about.png',
        width: 1200,
        height: 630,
        alt: 'About Foundationary - Professional Business Documents',
      },
    ],
  },
};

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'AboutPage',
            name: 'About Foundationary',
            description: 'Professional foundations for businesses that don\'t want to wing it.',
            url: 'https://foundationary.vercel.app/about',
            mainEntity: {
              '@type': 'Organization',
              name: 'Foundationary',
              description: 'Document drafting service for UK sole traders',
            },
          }),
        }}
      />
      <div className="min-h-screen pt-24 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="mb-12">
            <span className="text-xs font-semibold text-medium-blue uppercase tracking-wider">About Us</span>
            <h1 className="text-4xl lg:text-5xl font-bold text-dark-text mt-3 mb-6">
              Professional foundations for businesses that don't want to wing it.
            </h1>
            <p className="text-xl text-secondary-text leading-relaxed">
              Foundationary exists because thousands of UK sole traders are running their businesses unprotected, underselling themselves, and legally exposed—not because they're bad at what they do, but because they were never given the tools to get their foundations right.
            </p>
          </div>

          <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold text-dark-text mb-4">The Problem We Solve</h2>
              <p className="text-secondary-text leading-relaxed mb-4">
                We watched hundreds of freelancers and sole traders struggle with the same issues:
              </p>
              <ul className="list-disc list-inside space-y-2 text-secondary-text">
                <li>No client contracts—leading to payment disputes and scope creep</li>
                <li>No GDPR compliance—risking ICO fines</li>
                <li>Generic templates that don't reflect their actual business</li>
                <li>Expensive solicitors (£500-£2,000+) or cheap DIY solutions</li>
                <li>Unprofessional image that cost them clients</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-dark-text mb-4">Our Solution</h2>
              <p className="text-secondary-text leading-relaxed">
                Foundationary fills the gap between expensive solicitors and useless templates. For £79, you get 10 bespoke business documents specifically built around YOUR business, UK law compliant, and delivered in 24 hours. Not a legal service—a document drafting service that works.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-dark-text mb-4">What We Believe</h2>
              <ul className="space-y-3 text-secondary-text">
                <li><strong>You shouldn't need a solicitor</strong> for basic business documents</li>
                <li><strong>Professional documents are an investment</strong> that pays for themselves in the first client dispute prevented</li>
                <li><strong>Bespoke beats generic</strong> every single time</li>
                <li><strong>Speed matters</strong>—the sooner you're protected, the sooner you can focus on your business</li>
                <li><strong>Transparency is everything</strong>—no hidden fees, no ongoing costs, no subscriptions</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-dark-text mb-4">Why Foundationary</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-off-white rounded-lg p-6">
                  <h3 className="font-semibold text-dark-text mb-2">UK Law Specific</h3>
                  <p className="text-sm text-secondary-text">Every document follows UK law, GDPR requirements, and Late Payment Act 1998 provisions. Not US templates adapted for the UK.</p>
                </div>
                <div className="bg-off-white rounded-lg p-6">
                  <h3 className="font-semibold text-dark-text mb-2">Bespoke, Not Template</h3>
                  <p className="text-sm text-secondary-text">Built around YOUR business, YOUR services, YOUR payment terms, YOUR voice. Not a one-size-fits-none template.</p>
                </div>
                <div className="bg-off-white rounded-lg p-6">
                  <h3 className="font-semibold text-dark-text mb-2">Human Reviewed</h3>
                  <p className="text-sm text-secondary-text">Each document is personally reviewed for consistency, legal soundness, and alignment with your business before delivery.</p>
                </div>
                <div className="bg-off-white rounded-lg p-6">
                  <h3 className="font-semibold text-dark-text mb-2">Fast & Fixed Price</h3>
                  <p className="text-sm text-secondary-text">£79 total. 24-hour delivery. No hourly billing. No cost surprises. No ongoing subscription trap.</p>
                </div>
              </div>
            </section>

            <section className="bg-medium-blue/10 rounded-lg p-8 border-l-4 border-medium-blue">
              <h2 className="text-xl font-bold text-dark-text mb-3">Ready to Get Your Foundations Right?</h2>
              <p className="text-secondary-text mb-6">
                Join hundreds of UK sole traders who've protected their business, impressed their clients, and got properly set up—all in 24 hours.
              </p>
              <Link
                href="/pricing"
                className="inline-block bg-navy text-white px-8 py-3 rounded-lg font-semibold hover:bg-medium-blue transition-colors"
              >
                See Pricing & Get Started →
              </Link>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
