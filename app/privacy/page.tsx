import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Foundationary\'s privacy policy explains how we collect, use, and protect your personal information. Learn about your data rights under UK GDPR.',
  alternates: {
    canonical: 'https://foundationary.vercel.app/privacy',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPolicyPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-[#F8FAFE] py-16 px-6">
        <div className="max-w-[900px] mx-auto">
          <span className="text-sm font-semibold uppercase tracking-widest text-[#2C68C4] block mb-3">
            Legal
          </span>
          <h1 className="font-bold text-[#1a1a2e] text-4xl">Privacy Policy</h1>
          <p className="mt-3 text-[#5a5a7a]">Last updated: 27 May 2026</p>
        </div>
      </section>

      {/* Content */}
      <section className="bg-white py-16 px-6">
        <div className="max-w-[900px] mx-auto prose prose-lg">
          <h2 className="text-2xl font-bold text-[#1B3F7A] mt-8 mb-4">1. Introduction</h2>
          <p className="text-[#5a5a7a] mb-6">
            Foundationary (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) respects your privacy and is committed to protecting your personal data. This privacy policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
          </p>

          <h2 className="text-2xl font-bold text-[#1B3F7A] mt-8 mb-4">2. Data Controller</h2>
          <p className="text-[#5a5a7a] mb-6">
            Foundationary is the data controller for the personal data we process. Our contact details are:
          </p>
          <ul className="list-disc pl-6 mb-6 text-[#5a5a7a]">
            <li>Email: foundationarybusiness@gmail.com</li>
            <li>Phone: +44 7377 203834</li>
          </ul>

          <h2 className="text-2xl font-bold text-[#1B3F7A] mt-8 mb-4">3. What Data We Collect</h2>
          <p className="text-[#5a5a7a] mb-4">We may collect the following types of personal data:</p>
          <ul className="list-disc pl-6 mb-6 text-[#5a5a7a]">
            <li><strong>Identity Data:</strong> First name, last name</li>
            <li><strong>Contact Data:</strong> Email address, phone number</li>
            <li><strong>Business Data:</strong> Business name, business type, services offered (from questionnaire)</li>
            <li><strong>Financial Data:</strong> Payment details (processed securely via Stripe)</li>
            <li><strong>Technical Data:</strong> IP address, browser type, device information</li>
            <li><strong>Usage Data:</strong> How you interact with our website and services</li>
          </ul>

          <h2 className="text-2xl font-bold text-[#1B3F7A] mt-8 mb-4">4. How We Collect Data</h2>
          <ul className="list-disc pl-6 mb-6 text-[#5a5a7a]">
            <li>You provide data directly when completing forms or questionnaires</li>
            <li>Automatically collected through cookies and analytics tools</li>
            <li>From third parties (e.g., payment processors)</li>
          </ul>

          <h2 className="text-2xl font-bold text-[#1B3F7A] mt-8 mb-4">5. Lawful Basis for Processing</h2>
          <p className="text-[#5a5a7a] mb-4">We process your data under the following lawful bases:</p>
          <ul className="list-disc pl-6 mb-6 text-[#5a5a7a]">
            <li><strong>Contract:</strong> To provide our services to you</li>
            <li><strong>Consent:</strong> For marketing communications (you can opt out)</li>
            <li><strong>Legitimate Interest:</strong> To improve our services and prevent fraud</li>
            <li><strong>Legal Obligation:</strong> To comply with UK law and tax requirements</li>
          </ul>

          <h2 className="text-2xl font-bold text-[#1B3F7A] mt-8 mb-4">6. How We Use Your Data</h2>
          <p className="text-[#5a5a7a] mb-4">We use your data to:</p>
          <ul className="list-disc pl-6 mb-6 text-[#5a5a7a]">
            <li>Provide and deliver our services</li>
            <li>Process payments</li>
            <li>Communicate with you about your order</li>
            <li>Send marketing materials (with consent)</li>
            <li>Improve our website and services</li>
            <li>Comply with legal obligations</li>
          </ul>

          <h2 className="text-2xl font-bold text-[#1B3F7A] mt-8 mb-4">7. Data Sharing</h2>
          <p className="text-[#5a5a7a] mb-4">We may share your data with:</p>
          <ul className="list-disc pl-6 mb-6 text-[#5a5a7a]">
            <li><strong>Service Providers:</strong> Stripe (payments), Supabase (database), Vercel (hosting)</li>
            <li><strong>Legal Requirements:</strong> When required by law or to protect rights</li>
          </ul>
          <p className="text-[#5a5a7a] mb-6">
            We do not sell your personal data to third parties.
          </p>

          <h2 className="text-2xl font-bold text-[#1B3F7A] mt-8 mb-4">8. International Transfers</h2>
          <p className="text-[#5a5a7a] mb-6">
            Some of our service providers are based outside the UK/EEA. We ensure appropriate safeguards are in place, such as Standard Contractual Clauses, to protect your data.
          </p>

          <h2 className="text-2xl font-bold text-[#1B3F7A] mt-8 mb-4">9. Data Retention</h2>
          <p className="text-[#5a5a7a] mb-4">We retain your data for as long as necessary:</p>
          <ul className="list-disc pl-6 mb-6 text-[#5a5a7a]">
            <li><strong>Service Data:</strong> Duration of service plus 7 years (tax/legal requirements)</li>
            <li><strong>Marketing Data:</strong> Until you withdraw consent or unsubscribe</li>
            <li><strong>Analytics Data:</strong> 26 months (Google Analytics default)</li>
          </ul>

          <h2 className="text-2xl font-bold text-[#1B3F7A] mt-8 mb-4">10. Your Rights (UK GDPR)</h2>
          <p className="text-[#5a5a7a] mb-4">You have the right to:</p>
          <ul className="list-disc pl-6 mb-6 text-[#5a5a7a]">
            <li><strong>Access:</strong> Request a copy of your personal data</li>
            <li><strong>Rectification:</strong> Correct inaccurate data</li>
            <li><strong>Erasure:</strong> Request deletion of your data</li>
            <li><strong>Restrict Processing:</strong> Limit how we use your data</li>
            <li><strong>Data Portability:</strong> Receive your data in a portable format</li>
            <li><strong>Object:</strong> Object to processing based on legitimate interests</li>
            <li><strong>Withdraw Consent:</strong> Withdraw consent at any time</li>
          </ul>
          <p className="text-[#5a5a7a] mb-6">
            To exercise these rights, contact us at foundationarybusiness@gmail.com. We respond within 30 days.
          </p>

          <h2 className="text-2xl font-bold text-[#1B3F7A] mt-8 mb-4">11. Security</h2>
          <p className="text-[#5a5a7a] mb-6">
            We implement appropriate technical and organisational measures to protect your data, including encryption, secure servers, and access controls. However, no method of transmission over the internet is 100% secure.
          </p>

          <h2 className="text-2xl font-bold text-[#1B3F7A] mt-8 mb-4">12. Cookies</h2>
          <p className="text-[#5a5a7a] mb-6">
            We use cookies and similar technologies for analytics and functionality. You can control cookies through your browser settings. See our Cookie Policy for more details.
          </p>

          <h2 className="text-2xl font-bold text-[#1B3F7A] mt-8 mb-4">13. Third-Party Links</h2>
          <p className="text-[#5a5a7a] mb-6">
            Our website may contain links to third-party websites. We are not responsible for their privacy practices.
          </p>

          <h2 className="text-2xl font-bold text-[#1B3F7A] mt-8 mb-4">14. Complaints</h2>
          <p className="text-[#5a5a7a] mb-6">
            If you have concerns about how we handle your data, you have the right to lodge a complaint with the Information Commissioner&apos;s Office (ICO): <a href="https://ico.org.uk" className="text-[#2C68C4] hover:underline">ico.org.uk</a>
          </p>

          <h2 className="text-2xl font-bold text-[#1B3F7A] mt-8 mb-4">15. Changes to This Policy</h2>
          <p className="text-[#5a5a7a] mb-6">
            We may update this policy from time to time. The &quot;Last updated&quot; date at the top indicates the latest version. We encourage you to review this policy periodically.
          </p>

          <h2 className="text-2xl font-bold text-[#1B3F7A] mt-8 mb-4">16. Contact Us</h2>
          <p className="text-[#5a5a7a] mb-6">
            For questions about this privacy policy or your personal data, contact us at:
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
            <Link href="/terms" className="text-[#2C68C4] hover:text-[#1B3F7A] font-medium">
              Terms of Use →
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
