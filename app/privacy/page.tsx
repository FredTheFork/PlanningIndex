import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — How We Handle Your Data',
  description: 'Read Foundationary\'s Privacy Policy - learn how we collect, use, protect, and store your personal and business data. UK GDPR compliant. Your data stays yours.',
  openGraph: {
    title: 'Privacy Policy — Foundationary Data Protection',
    description: 'How we handle, protect, and respect your data. UK GDPR compliant privacy practices.',
    url: 'https://foundationary.vercel.app/privacy',
  },
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'Privacy Policy',
            description: 'Privacy Policy for Foundationary - how we handle and protect your data.',
            url: 'https://foundationary.vercel.app/privacy',
          }),
        }}
      />
      <div className="min-h-screen py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-6 text-dark-text">Privacy Policy</h1>
          <p className="text-sm text-secondary-text mb-8">Last updated: May 2026</p>

          <div className="space-y-8 text-secondary-text">
            <section>
              <h2 className="text-2xl font-bold text-dark-text mb-3">Introduction</h2>
              <p className="leading-relaxed">
                Foundationary ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website foundationary.vercel.app and use our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-dark-text mb-3">Information We Collect</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-dark-text">Personal Information You Provide</h3>
                  <p>When you use our service, we collect:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Name and contact details</li>
                    <li>Business information (company name, type of services)</li>
                    <li>Payment information (processed securely via Stripe)</li>
                    <li>Information from the intake questionnaire</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-dark-text">Automatically Collected Information</h3>
                  <p>We may automatically collect:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Device information (browser, IP address)</li>
                    <li>Usage data (pages visited, time spent)</li>
                    <li>Cookies and similar technologies</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-dark-text mb-3">How We Use Your Information</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>To create and deliver your personalised business documents</li>
                <li>To process payments</li>
                <li>To communicate with you about your order</li>
                <li>To improve our service and website</li>
                <li>To comply with legal obligations</li>
                <li>To send you updates (only with your consent)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-dark-text mb-3">Data Protection</h2>
              <p className="leading-relaxed">
                Your information is stored securely. We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-dark-text mb-3">Your Rights Under GDPR</h2>
              <p className="mb-3">You have the right to:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Access your personal data</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion (right to be forgotten)</li>
                <li>Restrict processing of your data</li>
                <li>Data portability</li>
                <li>Object to processing</li>
              </ul>
              <p className="mt-4">To exercise any of these rights, contact us at foundationarybusiness@gmail.com</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-dark-text mb-3">Third Parties</h2>
              <p className="leading-relaxed">
                We may share your information with third parties only as necessary to provide our service, including payment processors and hosting providers. We never sell your data. We require all third parties to respect the security of your personal data and to treat it in accordance with the law.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-dark-text mb-3">Cookies</h2>
              <p className="leading-relaxed">
                Our website uses cookies to enhance your experience. By using our site, you consent to our use of cookies in accordance with this Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-dark-text mb-3">Changes to This Policy</h2>
              <p className="leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-dark-text mb-3">Contact Us</h2>
              <p>If you have questions about this Privacy Policy, please contact us at:</p>
              <p className="mt-3">
                <strong>Email:</strong> foundationarybusiness@gmail.com<br />
                <strong>Phone:</strong> +44 7377 203834
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
