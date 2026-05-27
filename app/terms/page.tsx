import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Use — Service Agreement',
  description: 'Read Foundationary\'s Terms of Use - understand your rights and responsibilities when using our document drafting service. Clear, fair terms for UK sole traders.',
  openGraph: {
    title: 'Terms of Use — Foundationary Service Agreement',
    description: 'Clear terms and conditions for using Foundationary services.',
    url: 'https://foundationary.vercel.app/terms',
  },
};

export default function TermsOfUsePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'Terms of Use',
            description: 'Terms of Use for Foundationary document drafting service.',
            url: 'https://foundationary.vercel.app/terms',
          }),
        }}
      />
      <div className="min-h-screen py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-6 text-dark-text">Terms of Use</h1>
          <p className="text-sm text-secondary-text mb-8">Last updated: May 2026</p>

          <div className="space-y-8 text-secondary-text">
            <section>
              <h2 className="text-2xl font-bold text-dark-text mb-3">Agreement to Terms</h2>
              <p className="leading-relaxed">
                By accessing and using Foundationary's website and services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-dark-text mb-3">Use License</h2>
              <p className="leading-relaxed mb-3">
                Permission is granted to temporarily download one copy of the materials (information or software) on Foundationary's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose or for any public display</li>
                <li>Attempt to decompile or reverse engineer any software contained</li>
                <li>Remove any copyright or other proprietary notations</li>
                <li>Transfer the materials to another person or "mirror" the materials</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-dark-text mb-3">Service Description</h2>
              <p className="leading-relaxed">
                Foundationary provides a document drafting service. We create professional business documents tailored to your business based on information you provide. You acknowledge that Foundationary is NOT a law firm and does NOT provide legal advice.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-dark-text mb-3">Payment Terms</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>Price: £79 (one-time payment)</li>
                <li>Payment is processed via Stripe</li>
                <li>Payment must be completed before document generation begins</li>
                <li>All prices are in British Pounds (GBP)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-dark-text mb-3">Refund Policy</h2>
              <p className="leading-relaxed">
                If you are not completely satisfied with your documents, you may request a full refund within 7 days of delivery. To request a refund, contact foundationarybusiness@gmail.com with your order details. Refunds will be processed within 10 business days.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-dark-text mb-3">Document Ownership</h2>
              <p className="leading-relaxed">
                Upon payment, you own the documents we create for you. You may use, modify, and distribute them as you see fit. You may not resell the documents or use them to provide a competing service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-dark-text mb-3">Disclaimer</h2>
              <p className="leading-relaxed">
                The materials on Foundationary's website are provided on an 'as is' basis. Foundationary makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-dark-text mb-3">Limitations</h2>
              <p className="leading-relaxed">
                In no event shall Foundationary or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Foundationary's website, even if Foundationary has been notified of the possibility of such damage.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-dark-text mb-3">Accuracy of Materials</h2>
              <p className="leading-relaxed">
                The materials appearing on Foundationary's website could include technical, typographical, or photographic errors. Foundationary does not warrant that any of the materials on our website are accurate, complete, or current. Foundationary may make changes to the materials contained on our website at any time without notice.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-dark-text mb-3">Links</h2>
              <p className="leading-relaxed">
                Foundationary has not reviewed all of the sites linked to our website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Foundationary of the site. Use of any such linked website is at the user's own risk.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-dark-text mb-3">Modifications</h2>
              <p className="leading-relaxed">
                Foundationary may revise these terms of service at any time without notice. By using our website, you are agreeing to be bound by the then current version of these terms of service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-dark-text mb-3">Governing Law</h2>
              <p className="leading-relaxed">
                These terms and conditions are governed by and construed in accordance with the laws of the United Kingdom, and you irrevocably submit to the exclusive jurisdiction of the courts located in England.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-dark-text mb-3">Contact Information</h2>
              <p>For questions about these Terms of Use:</p>
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
