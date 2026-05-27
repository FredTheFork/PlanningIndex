import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Use',
  description: 'Foundationary\'s terms of use govern your use of our website and services for UK sole traders. Read our terms and conditions carefully.',
  alternates: {
    canonical: 'https://foundationary.vercel.app/terms',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsOfUsePage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-[#F8FAFE] py-16 px-6">
        <div className="max-w-[900px] mx-auto">
          <span className="text-sm font-semibold uppercase tracking-widest text-[#2C68C4] block mb-3">
            Legal
          </span>
          <h1 className="font-bold text-[#1a1a2e] text-4xl">Terms of Use</h1>
          <p className="mt-3 text-[#5a5a7a]">Last updated: 27 May 2026</p>
        </div>
      </section>

      {/* Content */}
      <section className="bg-white py-16 px-6">
        <div className="max-w-[900px] mx-auto prose prose-lg">
          <h2 className="text-2xl font-bold text-[#1B3F7A] mt-8 mb-4">1. Agreement to Terms</h2>
          <p className="text-[#5a5a7a] mb-6">
            By accessing or using Foundationary&apos;s website and services, you agree to be bound by these Terms of Use. If you do not agree to these terms, please do not use our services.
          </p>

          <h2 className="text-2xl font-bold text-[#1B3F7A] mt-8 mb-4">2. Our Services</h2>
          <p className="text-[#5a5a7a] mb-6">
            Foundationary provides a done-for-you document drafting service for UK sole traders and freelancers. We create bespoke business documents based on information you provide through our questionnaire.
          </p>

          <h2 className="text-2xl font-bold text-[#1B3F7A] mt-8 mb-4">3. Not Legal Advice</h2>
          <p className="text-[#5a5a7a] mb-4">
            <strong>Important:</strong> Foundationary is not a law firm and does not provide legal advice. Our documents are professionally drafted and UK-compliant, but they are not a substitute for professional legal counsel.
          </p>
          <p className="text-[#5a5a7a] mb-6">
            You are responsible for ensuring that the documents meet your specific needs and for consulting a solicitor if you require legal advice.
          </p>

          <h2 className="text-2xl font-bold text-[#1B3F7A] mt-8 mb-4">4. Your Responsibilities</h2>
          <p className="text-[#5a5a7a] mb-4">When using our services, you agree to:</p>
          <ul className="list-disc pl-6 mb-6 text-[#5a5a7a]">
            <li>Provide accurate and complete information in the questionnaire</li>
            <li>Review all documents before use</li>
            <li>Not use documents for illegal purposes</li>
            <li>Not hold Foundationary liable for decisions made using the documents</li>
            <li>Seek independent legal advice if needed</li>
          </ul>

          <h2 className="text-2xl font-bold text-[#1B3F7A] mt-8 mb-4">5. Payment Terms</h2>
          <ul className="list-disc pl-6 mb-6 text-[#5a5a7a]">
            <li><strong>Pricing:</strong> The Business Foundations Pack is £79 one-time, payable before service delivery</li>
            <li><strong>Method:</strong> We accept all major credit/debit cards via Stripe</li>
            <li><strong>Currency:</strong> All prices are in GBP (British Pounds)</li>
            <li><strong>Taxes:</strong> Prices include applicable UK taxes</li>
          </ul>

          <h2 className="text-2xl font-bold text-[#1B3F7A] mt-8 mb-4">6. Refund Policy</h2>
          <p className="text-[#5a5a7a] mb-6">
            We offer a 7-day money-back guarantee. If you are not satisfied with your documents, contact us within 7 days of delivery for a full refund. Refunds are processed within 5-10 business days.
          </p>

          <h2 className="text-2xl font-bold text-[#1B3F7A] mt-8 mb-4">7. Delivery & Timelines</h2>
          <p className="text-[#5a5a7a] mb-6">
            We aim to deliver your documents within 24 hours of questionnaire completion. We are not liable for delays caused by technical issues, force majeure, or circumstances beyond our control.
          </p>

          <h2 className="text-2xl font-bold text-[#1B3F7A] mt-8 mb-4">8. Intellectual Property</h2>
          <p className="text-[#5a5a7a] mb-6">
            You own the rights to use, modify, and distribute the documents created for you. Foundationary retains the right to use generic templates and methodologies developed during the service process. You may not resell or redistribute our documents as templates.
          </p>

          <h2 className="text-2xl font-bold text-[#1B3F7A] mt-8 mb-4">9. Limitation of Liability</h2>
          <p className="text-[#5a5a7a] mb-4">
            To the maximum extent permitted by law, Foundationary shall not be liable for:
          </p>
          <ul className="list-disc pl-6 mb-6 text-[#5a5a7a]">
            <li>Any indirect, incidental, or consequential losses</li>
            <li>Loss of profits, revenue, or business opportunities</li>
            <li>Decisions you make using the documents</li>
            <li>Legal disputes arising from document use</li>
          </ul>
          <p className="text-[#5a5a7a] mb-6">
            Our total liability shall not exceed the amount you paid for the service.
          </p>

          <h2 className="text-2xl font-bold text-[#1B3F7A] mt-8 mb-4">10. Service Modifications</h2>
          <p className="text-[#5a5a7a] mb-6">
            We reserve the right to modify, suspend, or discontinue any aspect of our services at any time. We will provide notice of significant changes affecting existing customers.
          </p>

          <h2 className="text-2xl font-bold text-[#1B3F7A] mt-8 mb-4">11. User Accounts</h2>
          <p className="text-[#5a5a7a] mb-4">You are responsible for:</p>
          <ul className="list-disc pl-6 mb-6 text-[#5a5a7a]">
            <li>Keeping your login credentials secure</li>
            <li>All activities that occur under your account</li>
            <li>Notifying us immediately of unauthorized access</li>
          </ul>

          <h2 className="text-2xl font-bold text-[#1B3F7A] mt-8 mb-4">12. Privacy</h2>
          <p className="text-[#5a5a7a] mb-6">
            Your use of our services is also governed by our <Link href="/privacy" className="text-[#2C68C4] hover:underline">Privacy Policy</Link>, which explains how we collect, use, and protect your personal data.
          </p>

          <h2 className="text-2xl font-bold text-[#1B3F7A] mt-8 mb-4">13. Governing Law</h2>
          <p className="text-[#5a5a7a] mb-6">
            These terms are governed by the laws of England and Wales. Any disputes shall be resolved in the courts of England and Wales.
          </p>

          <h2 className="text-2xl font-bold text-[#1B3F7A] mt-8 mb-4">14. Severability</h2>
          <p className="text-[#5a5a7a] mb-6">
            If any provision of these terms is found to be unenforceable, the remaining provisions will continue in full force.
          </p>

          <h2 className="text-2xl font-bold text-[#1B3F7A] mt-8 mb-4">15. Entire Agreement</h2>
          <p className="text-[#5a5a7a] mb-6">
            These terms, together with our Privacy Policy, constitute the entire agreement between you and Foundationary regarding your use of our services.
          </p>

          <h2 className="text-2xl font-bold text-[#1B3F7A] mt-8 mb-4">16. Contact Us</h2>
          <p className="text-[#5a5a7a] mb-6">
            For questions about these Terms of Use, contact us at:
          </p>
          <ul className="list-none mb-6 text-[#5a5a7a]">
            <li>Email: foundationarybusiness@gmail.com</li>
            <li>Phone: +44 7377 203834</li>
          </ul>
        </div>
      </section>

      {/* Navigation */}
      <section className="bg-[#F8FAFE] py-12 px-6">
        <div className="max-w-[1200px] mx-auto text-center">
          <nav className="flex flex-wrap justify-center gap-6">
            <Link href="/privacy" className="text-[#2C68C4] hover:text-[#1B3F7A] font-medium">
              Privacy Policy →
            </Link>
            <Link href="/about" className="text-[#2C68C4] hover:text-[#1B3F7A] font-medium">
              About Us →
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
