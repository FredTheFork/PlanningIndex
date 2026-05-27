import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Free UK Sole Trader Checklist 2026',
  description: 'Download our free comprehensive checklist for UK sole traders. Covers registration, tax, legal documents, insurance, and business setup essentials.',
  keywords: ['sole trader checklist UK', 'business setup checklist', 'freelancer essentials', 'UK sole trader guide'],
  openGraph: {
    title: 'Free UK Sole Trader Checklist 2026 - Foundationary',
    description: 'Get our free checklist covering everything you need to set up and run your UK sole trader business properly.',
    url: 'https://foundationary.vercel.app/resources/checklist',
    images: [{ url: '/og-checklist.png', width: 1200, height: 630 }],
  },
  alternates: {
    canonical: 'https://foundationary.vercel.app/resources/checklist',
  },
};

export default function ChecklistPage() {
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
            FREE RESOURCE
          </span>
          <h1 className="font-bold text-white text-4xl md:text-5xl">
            UK Sole Trader Checklist 2026
          </h1>
          <p className="mt-5 text-lg text-white/90 max-w-[620px] mx-auto">
            Everything you need to set up and run your UK sole trader business properly — all in one downloadable checklist.
          </p>
        </div>
      </section>

      {/* What's Included */}
      <section className="bg-white py-16 px-6">
        <div className="max-w-[900px] mx-auto">
          <h2 className="font-bold text-[#1a1a2e] text-3xl mb-8 text-center">
            What&apos;s Inside
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-[#F0F4FF] rounded-lg p-6">
              <h3 className="font-semibold text-[#1B3F7A] text-xl mb-4">📋 Registration & Setup</h3>
              <ul className="space-y-2 text-[#1a1a2e]">
                <li>✓ HMRC Self Assessment registration steps</li>
                <li>✓ Business name considerations</li>
                <li>✓ UTR number checklist</li>
                <li>✓ Business banking setup guide</li>
              </ul>
            </div>
            <div className="bg-[#F0F4FF] rounded-lg p-6">
              <h3 className="font-semibold text-[#1B3F7A] text-xl mb-4">💷 Tax & Finances</h3>
              <ul className="space-y-2 text-[#1a1a2e]">
                <li>✓ Key tax deadlines calendar</li>
                <li>✓ Allowable expenses list</li>
                <li>✓ Tax payment thresholds</li>
                <li>✓ National Insurance rates 2026</li>
              </ul>
            </div>
            <div className="bg-[#F0F4FF] rounded-lg p-6">
              <h3 className="font-semibold text-[#1B3F7A] text-xl mb-4">📄 Legal Documents</h3>
              <ul className="space-y-2 text-[#1a1a2e]">
                <li>✓ Essential contract requirements</li>
                <li>✓ Terms & Conditions checklist</li>
                <li>✓ GDPR compliance steps</li>
                <li>✓ Privacy policy essentials</li>
              </ul>
            </div>
            <div className="bg-[#F0F4FF] rounded-lg p-6">
              <h3 className="font-semibold text-[#1B3F7A] text-xl mb-4">🛡️ Insurance & Protection</h3>
              <ul className="space-y-2 text-[#1a1a2e]">
                <li>✓ Required insurance types</li>
                <li>✓ Professional indemnity guide</li>
                <li>✓ Public liability considerations</li>
                <li>✓ Income protection options</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-[#F8FAFE] py-16 px-6">
        <div className="max-w-[800px] mx-auto">
          <h2 className="font-bold text-[#1a1a2e] text-3xl mb-8 text-center">
            Why This Checklist Helps
          </h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-[#2C68C4] rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold">1</span>
              </div>
              <div>
                <h3 className="font-semibold text-[#1B3F7A] text-lg">Never Miss a Deadline</h3>
                <p className="text-[#5a5a7a]">All key tax and registration deadlines in one place</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-[#2C68C4] rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold">2</span>
              </div>
              <div>
                <h3 className="font-semibold text-[#1B3F7A] text-lg">Avoid Costly Mistakes</h3>
                <p className="text-[#5a5a7a]">Common pitfalls highlighted so you can avoid them</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-[#2C68C4] rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold">3</span>
              </div>
              <div>
                <h3 className="font-semibold text-[#1B3F7A] text-lg">Set Up Properly from Day One</h3>
                <p className="text-[#5a5a7a]">Comprehensive checklist ensures nothing gets missed</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Email Capture Form */}
      <section className="bg-white py-16 px-6">
        <div className="max-w-[600px] mx-auto">
          <h2 className="font-bold text-[#1a1a2e] text-3xl mb-4 text-center">
            Get Your Free Checklist
          </h2>
          <p className="text-[#5a5a7a] text-center mb-8">
            Enter your email to receive the downloadable PDF checklist instantly.
          </p>
          <form
            action="https://formspree.io/f/your-form-id"
            method="POST"
            className="space-y-4"
          >
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#1B3F7A] mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                placeholder="you@example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C68C4] focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-[#1B3F7A] mb-2">
                First Name (Optional)
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Your name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C68C4] focus:border-transparent outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#1B3F7A] text-white font-semibold rounded-lg hover:bg-[#2C68C4] transition-colors py-4"
            >
              Download Free Checklist →
            </button>
          </form>
          <p className="text-sm text-[#5a5a7a] text-center mt-4">
            We respect your privacy. Unsubscribe anytime.
          </p>
        </div>
      </section>

      {/* Related Services */}
      <section className="bg-[#F0F4FF] py-16 px-6">
        <div className="max-w-[800px] mx-auto text-center">
          <h2 className="font-bold text-[#1a1a2e] text-3xl mb-4">
            Need Done-For-You Documents?
          </h2>
          <p className="text-[#5a5a7a] mb-8">
            We can create all your business documents for you in 24 hours.
          </p>
          <Link
            href="/whats-included"
            className="inline-block font-semibold text-white bg-[#1B3F7A] rounded-lg hover:bg-[#2C68C4] transition-colors px-8 py-4"
          >
            See What&apos;s Included →
          </Link>
        </div>
      </section>

      {/* Internal Links */}
      <section className="bg-white py-12 px-6">
        <div className="max-w-[1200px] mx-auto text-center">
          <nav className="flex flex-wrap justify-center gap-6">
            <Link href="/blog" className="text-[#2C68C4] hover:text-[#1B3F7A] font-medium">
              Blog →
            </Link>
            <Link href="/pricing" className="text-[#2C68C4] hover:text-[#1B3F7A] font-medium">
              Pricing →
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
