import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Foundationary',
  description: 'How Foundationary handles, protects, and respects your data. UK GDPR compliant privacy policy.',
};

function PageHeader() {
  return (
    <section
      className="text-center px-6"
      style={{
        padding: '80px 0 72px',
        background: 'linear-gradient(135deg, #1B3F7A 0%, #2C68C4 100%)',
      }}
    >
      <div className="mx-auto" style={{ maxWidth: 800 }}>
        <span
          className="font-inter font-semibold uppercase block"
          style={{
            fontSize: '0.75rem',
            letterSpacing: '0.15em',
            color: 'rgba(255,255,255,0.7)',
            marginTop: '72px',
          }}
        >
          LEGAL
        </span>
        <h1
          className="font-inter font-extrabold text-white mt-3"
          style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', lineHeight: 1.2 }}
        >
          Privacy Policy
        </h1>
        <p
          className="font-inter font-normal mx-auto mt-4 leading-[1.7]"
          style={{
            fontSize: '1.05rem',
            color: 'rgba(255,255,255,0.85)',
            maxWidth: 620,
          }}
        >
          How we handle, protect, and respect your data.
        </p>
      </div>
    </section>
  );
}

function Content() {
  return (
    <section className="bg-white py-24 px-6">
      <div className="mx-auto" style={{ maxWidth: 800 }}>
        <div className="prose prose-sm max-w-none" style={{ color: 'var(--color-dark-text)' }}>
          <p
            className="font-inter text-secondary-text leading-[1.7] mb-6"
            style={{ fontSize: '0.95rem' }}
          >
            <strong>Last updated: June 2026</strong>
          </p>

          <h2
            className="font-inter font-bold text-dark-text mt-10 mb-4"
            style={{ fontSize: '1.3rem' }}
          >
            1. Introduction
          </h2>
          <p
            className="font-inter text-secondary-text leading-[1.7] mb-4"
            style={{ fontSize: '0.95rem' }}
          >
            Foundationary ("we," "us," "our") is committed to protecting your privacy. This Privacy Policy explains what personal data we collect, how we use it, your rights, and how we protect it.
          </p>
          <p
            className="font-inter text-secondary-text leading-[1.7] mb-4"
            style={{ fontSize: '0.95rem' }}
          >
            We are based in the United Kingdom and operate under the UK&apos;s Data Protection Act 2018 and the UK GDPR. This policy applies to all visitors to foundationary.vercel.app ("the Website") and customers of Foundationary services — including the Business Foundations Pack, Website Copy Starter Pack, Social Media Starter Pack, and Quarterly Document Refresh.
          </p>

          <h2
            className="font-inter font-bold text-dark-text mt-10 mb-4"
            style={{ fontSize: '1.3rem' }}
          >
            2. What Personal Data We Collect
          </h2>

          <h3
            className="font-inter font-semibold text-dark-text mt-6 mb-3"
            style={{ fontSize: '1.1rem' }}
          >
            2.1 Information You Provide Directly
          </h3>
          <p
            className="font-inter text-secondary-text leading-[1.7] mb-4"
            style={{ fontSize: '0.95rem' }}
          >
            When you use Foundationary, we collect:
          </p>
          <ul
            className="font-inter text-secondary-text leading-[1.7] mb-4 ml-6 list-disc"
            style={{ fontSize: '0.95rem' }}
          >
            <li>Contact information: name, email address, phone number</li>
            <li>Business information: business name, business type, services offered, pricing, location</li>
            <li>Intake form responses: detailed information about your business, how you work, your processes, and your preferences</li>
            <li>Social media preferences: preferred platforms (LinkedIn, Instagram, Facebook, X), post quantity, audience, and tone for social media content</li>
            <li>Website page selections: number of pages, page types (Homepage, About, Services, Contact, FAQ, Blog, Pricing, Testimonials), and page priorities for website copy</li>
            <li>Brand assets: logo files, colour preferences, brand voice descriptions, and tone guidelines uploaded during the intake process</li>
            <li>Payment information: processed securely through Stripe (we never see your full card details)</li>
            <li>Communications: emails, messages, and support requests</li>
          </ul>

          <h3
            className="font-inter font-semibold text-dark-text mt-6 mb-3"
            style={{ fontSize: '1.1rem' }}
          >
            2.2 Information Collected Automatically
          </h3>
          <p
            className="font-inter text-secondary-text leading-[1.7] mb-4"
            style={{ fontSize: '0.95rem' }}
          >
            When you visit the Website, we collect:
          </p>
          <ul
            className="font-inter text-secondary-text leading-[1.7] mb-4 ml-6 list-disc"
            style={{ fontSize: '0.95rem' }}
          >
            <li>Technical data: IP address, browser type, pages visited, time spent on pages</li>
            <li>Cookies: to improve your experience and understand how you use the Website</li>
            <li>Device information: device type, operating system</li>
          </ul>

          <h2
            className="font-inter font-bold text-dark-text mt-10 mb-4"
            style={{ fontSize: '1.3rem' }}
          >
            3. How We Use Your Personal Data
          </h2>
          <p
            className="font-inter text-secondary-text leading-[1.7] mb-4"
            style={{ fontSize: '0.95rem' }}
          >
            We use your personal data for:
          </p>
          <ul
            className="font-inter text-secondary-text leading-[1.7] mb-4 ml-6 list-disc"
            style={{ fontSize: '0.95rem' }}
          >
            <li><strong>Delivering services:</strong> generating your personalised documents, website copy, and social media posts and delivering them to you</li>
            <li><strong>Subscription management:</strong> managing your Quarterly Document Refresh subscription, including billing and document update delivery</li>
            <li><strong>Communication:</strong> responding to enquiries, providing support, sending order confirmations</li>
            <li><strong>Billing:</strong> processing payments (one-time and recurring) and maintaining financial records</li>
            <li><strong>Improvement:</strong> understanding how customers use Foundationary to improve our service</li>
            <li><strong>Legal compliance:</strong> meeting tax, accounting, and legal obligations</li>
            <li><strong>Security:</strong> preventing fraud and protecting against abuse</li>
            <li><strong>Marketing:</strong> only if you&apos;ve explicitly opted in</li>
          </ul>

          <h2
            className="font-inter font-bold text-dark-text mt-10 mb-4"
            style={{ fontSize: '1.3rem' }}
          >
            4. AI and Automated Decision-Making
          </h2>
          <p
            className="font-inter text-secondary-text leading-[1.7] mb-4"
            style={{ fontSize: '0.95rem' }}
          >
            Foundationary uses AI-powered tools to generate your bespoke content. Your intake form responses are processed through structured AI prompts to produce documents, website copy, and social media posts. Important details:
          </p>
          <ul
            className="font-inter text-secondary-text leading-[1.7] mb-4 ml-6 list-disc"
            style={{ fontSize: '0.95rem' }}
          >
            <li><strong>Human review:</strong> All content is reviewed in depth by the team before delivery for accuracy, consistency, and quality.</li>
            <li><strong>No automated decisions about you:</strong> AI is used to create content based on your explicit inputs. We do not use automated decision-making to determine your eligibility, pricing, or service level.</li>
            <li><strong>Data processing:</strong> Your intake form data is sent to AI providers solely for content generation. These providers are contractually obligated not to use your data for model training or other purposes.</li>
            <li><strong>No profiling:</strong> We do not create profiles about you or make decisions about you based on automated processing.</li>
          </ul>

          <h2
            className="font-inter font-bold text-dark-text mt-10 mb-4"
            style={{ fontSize: '1.3rem' }}
          >
            5. Legal Basis for Processing
          </h2>
          <p
            className="font-inter text-secondary-text leading-[1.7] mb-4"
            style={{ fontSize: '0.95rem' }}
          >
            Under UK GDPR, we only process your data when we have a lawful basis:
          </p>
          <ul
            className="font-inter text-secondary-text leading-[1.7] mb-4 ml-6 list-disc"
            style={{ fontSize: '0.95rem' }}
          >
            <li><strong>Contract:</strong> to deliver the services you&apos;ve purchased</li>
            <li><strong>Legal obligation:</strong> to meet tax and accounting requirements</li>
            <li><strong>Legitimate interest:</strong> to improve our service and prevent fraud</li>
            <li><strong>Consent:</strong> for marketing communications (only with your permission)</li>
          </ul>

          <h2
            className="font-inter font-bold text-dark-text mt-10 mb-4"
            style={{ fontSize: '1.3rem' }}
          >
            6. Who We Share Your Data With
          </h2>
          <p
            className="font-inter text-secondary-text leading-[1.7] mb-4"
            style={{ fontSize: '0.95rem' }}
          >
            We share your data with:
          </p>
          <ul
            className="font-inter text-secondary-text leading-[1.7] mb-4 ml-6 list-disc"
            style={{ fontSize: '0.95rem' }}
          >
            <li><strong>Service providers:</strong> Supabase (database), Stripe (payments and subscription billing), AI providers (for content generation), email providers (for communications). These are processed under Data Processing Agreements.</li>
            <li><strong>Website deployment services:</strong> Your delivered website may be hosted on platforms such as Vercel, Netlify, or similar hosting providers for preview purposes. These services have their own privacy policies.</li>
            <li><strong>Legal requirements:</strong> when required by law or court order</li>
            <li><strong>Business transfer:</strong> if Foundationary is sold or merged, your data may be transferred (you&apos;d be notified)</li>
          </ul>
          <p
            className="font-inter text-secondary-text leading-[1.7] mb-4"
            style={{ fontSize: '0.95rem' }}
          >
            We do not sell your data. We do not share it with third parties for marketing purposes. We do not use it for anything other than delivering Foundationary services and complying with legal obligations.
          </p>

          <h2
            className="font-inter font-bold text-dark-text mt-10 mb-4"
            style={{ fontSize: '1.3rem' }}
          >
            7. International Data Transfers
          </h2>
          <p
            className="font-inter text-secondary-text leading-[1.7] mb-4"
            style={{ fontSize: '0.95rem' }}
          >
            Your data is primarily stored and processed in the UK. Some services we use (Stripe, Supabase, AI providers, Vercel, Netlify) may process data internationally, but only with appropriate safeguards in place (Standard Contractual Clauses or equivalent protections).
          </p>

          <h2
            className="font-inter font-bold text-dark-text mt-10 mb-4"
            style={{ fontSize: '1.3rem' }}
          >
            8. How Long We Keep Your Data
          </h2>
          <p
            className="font-inter text-secondary-text leading-[1.7] mb-4"
            style={{ fontSize: '0.95rem' }}
          >
            We keep personal data for:
          </p>
          <ul
            className="font-inter text-secondary-text leading-[1.7] mb-4 ml-6 list-disc"
            style={{ fontSize: '0.95rem' }}
          >
            <li><strong>Customer data (one-time purchases):</strong> for the duration of your relationship with us, plus 6 years for tax and legal purposes</li>
            <li><strong>Subscription data:</strong> for the duration of your active subscription plus 6 years after cancellation for tax and legal purposes. Billing records are retained for 6 years from the last transaction.</li>
            <li><strong>Intake form data:</strong> retained while your subscription is active (to generate quarterly updates for Quarterly Refresh customers). For one-time purchases, intake data is retained for 6 years unless you request deletion.</li>
            <li><strong>Email lists:</strong> until you unsubscribe</li>
            <li><strong>Website analytics:</strong> typically 26 months</li>
            <li><strong>Support records:</strong> until resolved, then archived for 3 years</li>
          </ul>
          <p
            className="font-inter text-secondary-text leading-[1.7] mb-4"
            style={{ fontSize: '0.95rem' }}
          >
            After retention periods expire, we securely delete your data or anonymise it so it cannot be linked back to you.
          </p>

          <h2
            className="font-inter font-bold text-dark-text mt-10 mb-4"
            style={{ fontSize: '1.3rem' }}
          >
            9. Your Rights
          </h2>
          <p
            className="font-inter text-secondary-text leading-[1.7] mb-4"
            style={{ fontSize: '0.95rem' }}
          >
            Under UK GDPR, you have the right to:
          </p>
          <ul
            className="font-inter text-secondary-text leading-[1.7] mb-4 ml-6 list-disc"
            style={{ fontSize: '0.95rem' }}
          >
            <li><strong>Access:</strong> request a copy of the personal data we hold about you</li>
            <li><strong>Rectification:</strong> ask us to correct inaccurate data</li>
            <li><strong>Erasure:</strong> request deletion of your data (subject to legal retention requirements)</li>
            <li><strong>Restriction:</strong> ask us to limit how we use your data</li>
            <li><strong>Portability:</strong> request your data in a portable format</li>
            <li><strong>Object:</strong> object to certain types of processing</li>
            <li><strong>Withdraw consent:</strong> if you&apos;ve given consent, you can withdraw it at any time</li>
            <li><strong>Cancel subscription:</strong> cancel your Quarterly Document Refresh subscription at any time by emailing us</li>
          </ul>
          <p
            className="font-inter text-secondary-text leading-[1.7] mb-4"
            style={{ fontSize: '0.95rem' }}
          >
            To exercise these rights, contact us at foundationarybusiness@gmail.com. We&apos;ll respond within 30 days.
          </p>

          <h2
            className="font-inter font-bold text-dark-text mt-10 mb-4"
            style={{ fontSize: '1.3rem' }}
          >
            10. Security
          </h2>
          <p
            className="font-inter text-secondary-text leading-[1.7] mb-4"
            style={{ fontSize: '0.95rem' }}
          >
            We protect your data through:
          </p>
          <ul
            className="font-inter text-secondary-text leading-[1.7] mb-4 ml-6 list-disc"
            style={{ fontSize: '0.95rem' }}
          >
            <li>HTTPS encryption for all Website traffic</li>
            <li>Secure, encrypted storage in UK-based servers</li>
            <li>Restricted access to personal data (only essential staff)</li>
            <li>Regular security audits and monitoring</li>
            <li>Secure payment processing through Stripe (one-time and recurring)</li>
            <li>Row-level security on all database tables</li>
          </ul>
          <p
            className="font-inter text-secondary-text leading-[1.7] mb-4"
            style={{ fontSize: '0.95rem' }}
          >
            While we implement robust protections, no system is 100% secure. We encourage you to use strong passwords and protect your account credentials.
          </p>

          <h2
            className="font-inter font-bold text-dark-text mt-10 mb-4"
            style={{ fontSize: '1.3rem' }}
          >
            11. Cookies
          </h2>
          <p
            className="font-inter text-secondary-text leading-[1.7] mb-4"
            style={{ fontSize: '0.95rem' }}
          >
            We use cookies to:
          </p>
          <ul
            className="font-inter text-secondary-text leading-[1.7] mb-4 ml-6 list-disc"
            style={{ fontSize: '0.95rem' }}
          >
            <li>Keep you logged in</li>
            <li>Remember your preferences</li>
            <li>Understand how you use the Website (analytics)</li>
            <li>Prevent fraud</li>
          </ul>
          <p
            className="font-inter text-secondary-text leading-[1.7] mb-4"
            style={{ fontSize: '0.95rem' }}
          >
            You can control cookies through your browser settings. If you disable cookies, some Website features may not work properly.
          </p>

          <h2
            className="font-inter font-bold text-dark-text mt-10 mb-4"
            style={{ fontSize: '1.3rem' }}
          >
            12. Third-Party Links
          </h2>
          <p
            className="font-inter text-secondary-text leading-[1.7] mb-4"
            style={{ fontSize: '0.95rem' }}
          >
            The Website may contain links to third-party websites (including hosting platforms like Vercel and Netlify). We&apos;re not responsible for their privacy practices. We encourage you to review their privacy policies before sharing personal information.
          </p>

          <h2
            className="font-inter font-bold text-dark-text mt-10 mb-4"
            style={{ fontSize: '1.3rem' }}
          >
            13. Children
          </h2>
          <p
            className="font-inter text-secondary-text leading-[1.7] mb-4"
            style={{ fontSize: '0.95rem' }}
          >
            Foundationary is designed for business owners, not children. We do not knowingly collect personal data from anyone under 18. If we become aware that we&apos;ve collected data from a minor, we&apos;ll delete it promptly.
          </p>

          <h2
            className="font-inter font-bold text-dark-text mt-10 mb-4"
            style={{ fontSize: '1.3rem' }}
          >
            14. Data Protection Officer & Complaints
          </h2>
          <p
            className="font-inter text-secondary-text leading-[1.7] mb-4"
            style={{ fontSize: '0.95rem' }}
          >
            If you have concerns about how we handle your data, please contact us first at foundationarybusiness@gmail.com. If you&apos;re not satisfied with our response, you have the right to lodge a complaint with the Information Commissioner&apos;s Office (ICO) at ico.org.uk.
          </p>

          <h2
            className="font-inter font-bold text-dark-text mt-10 mb-4"
            style={{ fontSize: '1.3rem' }}
          >
            15. Changes to This Policy
          </h2>
          <p
            className="font-inter text-secondary-text leading-[1.7] mb-4"
            style={{ fontSize: '0.95rem' }}
          >
            We may update this Privacy Policy from time to time. Material changes will be communicated via email or a prominent notice on the Website. Continued use of Foundationary after changes constitutes acceptance of the updated policy.
          </p>

          <h2
            className="font-inter font-bold text-dark-text mt-10 mb-4"
            style={{ fontSize: '1.3rem' }}
          >
            16. Contact Us
          </h2>
          <p
            className="font-inter text-secondary-text leading-[1.7] mb-4"
            style={{ fontSize: '0.95rem' }}
          >
            For questions about this Privacy Policy or how we handle your data:
          </p>
          <ul
            className="font-inter text-secondary-text leading-[1.7] mb-4 ml-6 list-disc"
            style={{ fontSize: '0.95rem' }}
          >
            <li>Email: foundationarybusiness@gmail.com</li>
            <li>Phone: +44 7377 203834</li>
          </ul>
          <p
            className="font-inter text-secondary-text leading-[1.7] mb-4"
            style={{ fontSize: '0.95rem' }}
          >
            We&apos;re committed to protecting your privacy and responding to your questions promptly.
          </p>
        </div>
      </div>
    </section>
  );
}

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHeader />
      <Content />
    </>
  );
}
