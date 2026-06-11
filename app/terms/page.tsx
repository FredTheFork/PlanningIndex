import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Use | Foundationary',
  description: 'The terms and conditions that govern your use of Foundationary services.',
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
          Terms of Use
        </h1>
        <p
          className="font-inter font-normal mx-auto mt-4 leading-[1.7]"
          style={{
            fontSize: '1.05rem',
            color: 'rgba(255,255,255,0.85)',
            maxWidth: 620,
          }}
        >
          The terms and conditions that govern your use of Foundationary.
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
            1. Acceptance of Terms
          </h2>
          <p
            className="font-inter text-secondary-text leading-[1.7] mb-4"
            style={{ fontSize: '0.95rem' }}
          >
            By accessing and using foundationary.vercel.app (the "Website") and purchasing Foundationary services (the "Service"), you agree to be bound by these Terms of Use. If you do not agree with any part of these terms, you should not use the Website or purchase the Service.
          </p>

          <h2
            className="font-inter font-bold text-dark-text mt-10 mb-4"
            style={{ fontSize: '1.3rem' }}
          >
            2. Description of Services
          </h2>
          <p
            className="font-inter text-secondary-text leading-[1.7] mb-4"
            style={{ fontSize: '0.95rem' }}
          >
            Foundationary provides done-for-you business content services for UK sole traders and small businesses. We offer four services:
          </p>

          <h3
            className="font-inter font-semibold text-dark-text mt-6 mb-3"
            style={{ fontSize: '1.1rem' }}
          >
            2.1 Business Foundations Pack
          </h3>
          <p
            className="font-inter text-secondary-text leading-[1.7] mb-4"
            style={{ fontSize: '0.95rem' }}
          >
            A one-time purchase (£79) providing 10 personalised business documents (Terms & Conditions, Privacy Policy, Client Agreement, Invoice Template, Professional Bio, Elevator Pitches, LinkedIn Profile Script, Welcome Emails, Late Payment Letters, and Service Description Sheets) generated from information you provide.
          </p>

          <h3
            className="font-inter font-semibold text-dark-text mt-6 mb-3"
            style={{ fontSize: '1.1rem' }}
          >
            2.2 Website Copy Starter Pack
          </h3>
          <p
            className="font-inter text-secondary-text leading-[1.7] mb-4"
            style={{ fontSize: '0.95rem' }}
          >
            A one-time purchase providing professionally written website copy tailored to your brand voice and services. Priced per page (from £35/page) with quantity-based tiers for 1–10 pages. Delivered as ready-to-paste copy for any website builder, along with a Bolt.new prompt for generating a styled website.
          </p>

          <h3
            className="font-inter font-semibold text-dark-text mt-6 mb-3"
            style={{ fontSize: '1.1rem' }}
          >
            2.3 Social Media Starter Pack
          </h3>
          <p
            className="font-inter text-secondary-text leading-[1.7] mb-4"
            style={{ fontSize: '0.95rem' }}
          >
            A one-time purchase providing done-for-you social media posts tailored to your industry, audience, and tone. Priced in quantity-based tiers from £20 for 5 posts up to 30 posts. Each post includes captions and hashtag suggestions.
          </p>

          <h3
            className="font-inter font-semibold text-dark-text mt-6 mb-3"
            style={{ fontSize: '1.1rem' }}
          >
            2.4 Quarterly Document Refresh
          </h3>
          <p
            className="font-inter text-secondary-text leading-[1.7] mb-4"
            style={{ fontSize: '0.95rem' }}
          >
            A subscription service (£29 every 4 months) providing one document update per quarter as your business evolves — covering pricing changes, new services, and regulation updates. Requires a Business Foundations Pack purchase. See Section 10 for subscription-specific terms.
          </p>

          <p
            className="font-inter text-secondary-text leading-[1.7] mb-4"
            style={{ fontSize: '0.95rem' }}
          >
            The Service is not:
          </p>
          <ul
            className="font-inter text-secondary-text leading-[1.7] mb-4 ml-6 list-disc"
            style={{ fontSize: '0.95rem' }}
          >
            <li>A legal service or substitute for legal advice</li>
            <li>A guarantee that your documents will prevent disputes</li>
            <li>A guarantee of social media engagement or results</li>
            <li>Web development or website hosting</li>
          </ul>

          <h2
            className="font-inter font-bold text-dark-text mt-10 mb-4"
            style={{ fontSize: '1.3rem' }}
          >
            3. Eligibility
          </h2>
          <p
            className="font-inter text-secondary-text leading-[1.7] mb-4"
            style={{ fontSize: '0.95rem' }}
          >
            By using Foundationary, you represent and warrant that:
          </p>
          <ul
            className="font-inter text-secondary-text leading-[1.7] mb-4 ml-6 list-disc"
            style={{ fontSize: '0.95rem' }}
          >
            <li>You are at least 18 years old</li>
            <li>You are a UK sole trader or small business owner</li>
            <li>You have the authority to enter into this agreement</li>
            <li>All information you provide is accurate and complete</li>
            <li>You will not use the Service for illegal or unethical purposes</li>
          </ul>

          <h2
            className="font-inter font-bold text-dark-text mt-10 mb-4"
            style={{ fontSize: '1.3rem' }}
          >
            4. The Purchase Process
          </h2>

          <h3
            className="font-inter font-semibold text-dark-text mt-6 mb-3"
            style={{ fontSize: '1.1rem' }}
          >
            4.1 Payment
          </h3>
          <p
            className="font-inter text-secondary-text leading-[1.7] mb-4"
            style={{ fontSize: '0.95rem' }}
          >
            Prices for Foundationary services are displayed on the Website. All prices are in GBP (£) and include VAT where applicable. Payment is processed through Stripe and must be completed before the Service is activated. For services with quantity-based pricing (Website Copy and Social Media), the final price depends on the quantity selected at checkout.
          </p>

          <h3
            className="font-inter font-semibold text-dark-text mt-6 mb-3"
            style={{ fontSize: '1.1rem' }}
          >
            4.2 Bundle Discounts
          </h3>
          <p
            className="font-inter text-secondary-text leading-[1.7] mb-4"
            style={{ fontSize: '0.95rem' }}
          >
            When you purchase two services together, a 10% discount is applied to the combined total. When you purchase three or more services, a 15% discount is applied. Discounts are calculated automatically at checkout.
          </p>

          <h3
            className="font-inter font-semibold text-dark-text mt-6 mb-3"
            style={{ fontSize: '1.1rem' }}
          >
            4.3 Completion of Intake Form
          </h3>
          <p
            className="font-inter text-secondary-text leading-[1.7] mb-4"
            style={{ fontSize: '0.95rem' }}
          >
            After payment, you must complete our structured intake questionnaire. Your content is generated based on your answers. The questions you receive depend on which services you purchased — document customers answer business and legal questions; website copy customers answer questions about their brand and pages; social media customers answer questions about their platforms and audience. You are responsible for the accuracy and completeness of the information you provide. Incorrect information may result in content that doesn&apos;t meet your needs.
          </p>

          <h3
            className="font-inter font-semibold text-dark-text mt-6 mb-3"
            style={{ fontSize: '1.1rem' }}
          >
            4.4 Delivery Timeline
          </h3>
          <p
            className="font-inter text-secondary-text leading-[1.7] mb-4"
            style={{ fontSize: '0.95rem' }}
          >
            We typically deliver business documents within 5 business days and website copy / social media posts within 3–5 business days of receiving your completed intake form. These timelines are guidelines, not guarantees. We reserve the right to extend these periods if issues arise during quality review.
          </p>

          <h2
            className="font-inter font-bold text-dark-text mt-10 mb-4"
            style={{ fontSize: '1.3rem' }}
          >
            5. What You Receive
          </h2>
          <p
            className="font-inter text-secondary-text leading-[1.7] mb-4"
            style={{ fontSize: '0.95rem' }}
          >
            Depending on your purchase:
          </p>
          <ul
            className="font-inter text-secondary-text leading-[1.7] mb-4 ml-6 list-disc"
            style={{ fontSize: '0.95rem' }}
          >
            <li><strong>Business Foundations Pack:</strong> 10 personalised documents in editable Word and PDF formats</li>
            <li><strong>Website Copy Starter Pack:</strong> Professionally written copy for your selected pages, ready to paste into any website builder, plus a Bolt.new prompt for generating a complete styled website</li>
            <li><strong>Social Media Starter Pack:</strong> Your selected number of posts with captions and hashtag suggestions, formatted for your chosen platforms</li>
            <li><strong>Quarterly Document Refresh:</strong> One updated document per quarter as described in Section 2.4</li>
          </ul>
          <p
            className="font-inter text-secondary-text leading-[1.7] mb-4"
            style={{ fontSize: '0.95rem' }}
          >
            You own all delivered content outright. There are no licensing restrictions. You can use, modify, and adapt it for your business as needed. You may not resell it or redistribute it to third parties.
          </p>

          <h2
            className="font-inter font-bold text-dark-text mt-10 mb-4"
            style={{ fontSize: '1.3rem' }}
          >
            6. Intellectual Property Rights
          </h2>
          <p
            className="font-inter text-secondary-text leading-[1.7] mb-4"
            style={{ fontSize: '0.95rem' }}
          >
            The structure, design, and underlying methodology of Foundationary are our intellectual property. Your personalised content is yours to own and use. You may not:
          </p>
          <ul
            className="font-inter text-secondary-text leading-[1.7] mb-4 ml-6 list-disc"
            style={{ fontSize: '0.95rem' }}
          >
            <li>Resell or distribute Foundationary services</li>
            <li>Use content generated for other businesses</li>
            <li>Copy the underlying methodology or processes</li>
            <li>Use the Website or Service for competitive purposes</li>
          </ul>

          <h2
            className="font-inter font-bold text-dark-text mt-10 mb-4"
            style={{ fontSize: '1.3rem' }}
          >
            7. Limitations of Liability
          </h2>
          <p
            className="font-inter text-secondary-text leading-[1.7] mb-4"
            style={{ fontSize: '0.95rem' }}
          >
            Foundationary provides content on an "as is" basis. To the maximum extent permitted by law:
          </p>
          <ul
            className="font-inter text-secondary-text leading-[1.7] mb-4 ml-6 list-disc"
            style={{ fontSize: '0.95rem' }}
          >
            <li>We make no warranties about the documents&apos; effectiveness in disputes or legal proceedings</li>
            <li>We make no warranties about social media engagement, follower growth, or conversion results</li>
            <li>We are not liable for loss of business, revenue, profits, or data</li>
            <li>We are not liable for indirect or consequential damages</li>
            <li>Our total liability is limited to the amount you paid for the Service</li>
          </ul>
          <p
            className="font-inter text-secondary-text leading-[1.7] mb-4"
            style={{ fontSize: '0.95rem' }}
          >
            We take reasonable care in generating content, but cannot guarantee it will prevent disputes, be enforceable in all circumstances, or produce specific social media results. Your use of the content and responsibility for legal compliance remains entirely yours.
          </p>

          <h2
            className="font-inter font-bold text-dark-text mt-10 mb-4"
            style={{ fontSize: '1.3rem' }}
          >
            8. Disclaimers
          </h2>
          <p
            className="font-inter text-secondary-text leading-[1.7] mb-4"
            style={{ fontSize: '0.95rem' }}
          >
            <strong>Not Legal Advice:</strong> Foundationary documents are not legal advice. If you need legal guidance specific to your situation, consult a solicitor.
          </p>
          <p
            className="font-inter text-secondary-text leading-[1.7] mb-4"
            style={{ fontSize: '0.95rem' }}
          >
            <strong>No Dispute Guarantee:</strong> Having well-drafted documents reduces risk but does not eliminate it. Disputes can still occur, and their resolution depends on facts, circumstances, and law.
          </p>
          <p
            className="font-inter text-secondary-text leading-[1.7] mb-4"
            style={{ fontSize: '0.95rem' }}
          >
            <strong>Changes in Law:</strong> We update documents based on law at the time of delivery. If legislation changes, you are responsible for reviewing and updating documents as needed (unless you subscribe to the Quarterly Refresh).
          </p>
          <p
            className="font-inter text-secondary-text leading-[1.7] mb-4"
            style={{ fontSize: '0.95rem' }}
          >
            <strong>Social Media Results:</strong> Social media posts are professionally written to give you a strong starting point, but no service can guarantee specific engagement, follower growth, or business outcomes from social media content.
          </p>
          <p
            className="font-inter text-secondary-text leading-[1.7] mb-4"
            style={{ fontSize: '0.95rem' }}
          >
            <strong>Website Copy vs. Web Development:</strong> The Website Copy Starter Pack provides written content for your website. It is not web development, design, or hosting. The Bolt.new prompt is provided as a convenience to help you generate a styled website, but the resulting website is your responsibility to deploy and maintain.
          </p>
          <p
            className="font-inter text-secondary-text leading-[1.7] mb-4"
            style={{ fontSize: '0.95rem' }}
          >
            <strong>Website Uptime:</strong> We aim to maintain Website availability, but we cannot guarantee uninterrupted access. We are not liable for temporary unavailability or service interruptions.
          </p>

          <h2
            className="font-inter font-bold text-dark-text mt-10 mb-4"
            style={{ fontSize: '1.3rem' }}
          >
            9. Your Responsibilities
          </h2>
          <p
            className="font-inter text-secondary-text leading-[1.7] mb-4"
            style={{ fontSize: '0.95rem' }}
          >
            By using Foundationary, you agree to:
          </p>
          <ul
            className="font-inter text-secondary-text leading-[1.7] mb-4 ml-6 list-disc"
            style={{ fontSize: '0.95rem' }}
          >
            <li>Use the Service and content in compliance with all applicable law</li>
            <li>Provide accurate and complete information in your intake form</li>
            <li>Review all content before using it in business transactions or publishing it</li>
            <li>Update documents if your business materially changes</li>
            <li>Seek professional legal advice if unsure about legal matters</li>
            <li>Not use the Service for illegal, fraudulent, or unethical purposes</li>
          </ul>

          <h2
            className="font-inter font-bold text-dark-text mt-10 mb-4"
            style={{ fontSize: '1.3rem' }}
          >
            10. Subscription Services
          </h2>
          <p
            className="font-inter text-secondary-text leading-[1.7] mb-4"
            style={{ fontSize: '0.95rem' }}
          >
            The Quarterly Document Refresh is a subscription service billed every 4 months at £29.
          </p>
          <ul
            className="font-inter text-secondary-text leading-[1.7] mb-4 ml-6 list-disc"
            style={{ fontSize: '0.95rem' }}
          >
            <li><strong>Billing:</strong> Your payment method will be charged automatically every 4 months through Stripe until you cancel.</li>
            <li><strong>Cancellation:</strong> You may cancel at any time by emailing foundationarybusiness@gmail.com. Cancellation takes effect at the end of the current billing period — you will not be charged again, but no partial refund is provided for the current period.</li>
            <li><strong>Service during subscription:</strong> One document update is delivered per quarter while your subscription is active.</li>
            <li><strong>Price changes:</strong> We reserve the right to change subscription pricing with 30 days&apos; notice. If the price increases, you may cancel before the change takes effect.</li>
          </ul>

          <h2
            className="font-inter font-bold text-dark-text mt-10 mb-4"
            style={{ fontSize: '1.3rem' }}
          >
            11. Refunds and Revisions
          </h2>
          <p
            className="font-inter text-secondary-text leading-[1.7] mb-4"
            style={{ fontSize: '0.95rem' }}
          >
            <strong>No Standard Refunds:</strong> Foundationary is a bespoke service. Once content is generated and delivered, it cannot be "returned" for a refund.
          </p>
          <p
            className="font-inter text-secondary-text leading-[1.7] mb-4"
            style={{ fontSize: '0.95rem' }}
          >
            <strong>Revisions for Issues:</strong> If content has clear errors, fail to address your business adequately, or has structural problems, we will revise it at no cost. This is our commitment to quality.
          </p>
          <p
            className="font-inter text-secondary-text leading-[1.7] mb-4"
            style={{ fontSize: '0.95rem' }}
          >
            <strong>Payment Disputes:</strong> If you believe you were charged incorrectly, contact us within 30 days. We&apos;ll review the issue and work toward resolution.
          </p>

          <h2
            className="font-inter font-bold text-dark-text mt-10 mb-4"
            style={{ fontSize: '1.3rem' }}
          >
            12. Acceptable Use Policy
          </h2>
          <p
            className="font-inter text-secondary-text leading-[1.7] mb-4"
            style={{ fontSize: '0.95rem' }}
          >
            You may not:
          </p>
          <ul
            className="font-inter text-secondary-text leading-[1.7] mb-4 ml-6 list-disc"
            style={{ fontSize: '0.95rem' }}
          >
            <li>Use the Website or Service for illegal purposes</li>
            <li>Attempt to breach security or gain unauthorised access</li>
            <li>Harass, abuse, or threaten our team</li>
            <li>Interfere with or disrupt the Website or systems</li>
            <li>Resell or redistribute Foundationary services</li>
            <li>Use automated tools or bots to access the Website without permission</li>
            <li>Submit false or misleading information</li>
          </ul>

          <h2
            className="font-inter font-bold text-dark-text mt-10 mb-4"
            style={{ fontSize: '1.3rem' }}
          >
            13. Modification of Terms
          </h2>
          <p
            className="font-inter text-secondary-text leading-[1.7] mb-4"
            style={{ fontSize: '0.95rem' }}
          >
            We may update these Terms of Use from time to time. Material changes will be communicated via email or prominent notice on the Website. Your continued use of the Service after changes constitutes acceptance of the new terms.
          </p>

          <h2
            className="font-inter font-bold text-dark-text mt-10 mb-4"
            style={{ fontSize: '1.3rem' }}
          >
            14. Termination
          </h2>
          <p
            className="font-inter text-secondary-text leading-[1.7] mb-4"
            style={{ fontSize: '0.95rem' }}
          >
            Your access to the Service ends when you have received and downloaded your content. Subscription services (Quarterly Refresh) continue until cancelled per Section 10. We reserve the right to suspend access to the Website if you breach these terms or engage in abusive, fraudulent, or illegal behaviour. Termination does not affect your ownership of content already delivered.
          </p>

          <h2
            className="font-inter font-bold text-dark-text mt-10 mb-4"
            style={{ fontSize: '1.3rem' }}
          >
            15. Governing Law & Disputes
          </h2>
          <p
            className="font-inter text-secondary-text leading-[1.7] mb-4"
            style={{ fontSize: '0.95rem' }}
          >
            These Terms of Use are governed by English law. Any disputes are subject to the exclusive jurisdiction of English courts. We strongly encourage you to resolve disputes through direct communication first. If that fails, you may pursue legal action.
          </p>

          <h2
            className="font-inter font-bold text-dark-text mt-10 mb-4"
            style={{ fontSize: '1.3rem' }}
          >
            16. Third-Party Services
          </h2>
          <p
            className="font-inter text-secondary-text leading-[1.7] mb-4"
            style={{ fontSize: '0.95rem' }}
          >
            Foundationary uses third-party services:
          </p>
          <ul
            className="font-inter text-secondary-text leading-[1.7] mb-4 ml-6 list-disc"
            style={{ fontSize: '0.95rem' }}
          >
            <li><strong>Stripe:</strong> for payment processing (including subscription billing). Their terms apply to payments.</li>
            <li><strong>Supabase:</strong> for data storage and infrastructure</li>
            <li><strong>Vercel / Netlify:</strong> for website hosting and deployment of generated websites</li>
            <li><strong>Bolt.new:</strong> for generating styled websites from your copy</li>
            <li><strong>AI providers:</strong> for content generation (structured prompts are used to create your bespoke content)</li>
            <li><strong>Email providers:</strong> for communications</li>
          </ul>
          <p
            className="font-inter text-secondary-text leading-[1.7] mb-4"
            style={{ fontSize: '0.95rem' }}
          >
            We are not responsible for these third parties&apos; services, reliability, or terms. We&apos;ve selected them for security and reliability.
          </p>

          <h2
            className="font-inter font-bold text-dark-text mt-10 mb-4"
            style={{ fontSize: '1.3rem' }}
          >
            17. Entire Agreement
          </h2>
          <p
            className="font-inter text-secondary-text leading-[1.7] mb-4"
            style={{ fontSize: '0.95rem' }}
          >
            These Terms of Use, together with our Privacy Policy, constitute the entire agreement between you and Foundationary. No other terms or communications override these terms.
          </p>

          <h2
            className="font-inter font-bold text-dark-text mt-10 mb-4"
            style={{ fontSize: '1.3rem' }}
          >
            18. Contact for Questions
          </h2>
          <p
            className="font-inter text-secondary-text leading-[1.7] mb-4"
            style={{ fontSize: '0.95rem' }}
          >
            If you have questions about these Terms of Use, or disputes about your purchase or service:
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
            We&apos;re committed to resolving issues fairly and promptly. Reach out and we&apos;ll work through it together.
          </p>
        </div>
      </div>
    </section>
  );
}

export default function TermsOfUsePage() {
  return (
    <>
      <PageHeader />
      <Content />
    </>
  );
}
