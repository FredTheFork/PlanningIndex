import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

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
            marginTop: '0px',
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
            <strong>Last updated: May 2026</strong>
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
            2. Description of Service
          </h2>
          <p
            className="font-inter text-secondary-text leading-[1.7] mb-4"
            style={{ fontSize: '0.95rem' }}
          >
            Foundationary is a done-for-you document generation service for UK sole traders and small businesses. We generate a personalised set of business documents (Terms & Conditions, Privacy Policy, Client Agreement, Invoice Template, and related documents) based on information you provide.
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
            <li>Ongoing legal support or subscription-based</li>
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
            Prices for Foundationary services are displayed on the Website. All prices are in GBP (£) and include VAT where applicable. Payment is processed through Stripe and must be completed before the Service is activated.
          </p>

          <h3
            className="font-inter font-semibold text-dark-text mt-6 mb-3"
            style={{ fontSize: '1.1rem' }}
          >
            4.2 Completion of Intake Form
          </h3>
          <p
            className="font-inter text-secondary-text leading-[1.7] mb-4"
            style={{ fontSize: '0.95rem' }}
          >
            After payment, you must complete our structured intake questionnaire. Your documents are generated based on your answers. You are responsible for the accuracy and completeness of the information you provide. Incorrect information may result in documents that don't meet your needs.
          </p>

          <h3
            className="font-inter font-semibold text-dark-text mt-6 mb-3"
            style={{ fontSize: '1.1rem' }}
          >
            4.3 Delivery Timeline
          </h3>
          <p
            className="font-inter text-secondary-text leading-[1.7] mb-4"
            style={{ fontSize: '0.95rem' }}
          >
            We typically deliver your complete document package within 5 business days of receiving your completed intake form. This timeline is a guideline, not a guarantee. We reserve the right to extend this period if issues arise during quality review.
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
            Your purchase includes:
          </p>
          <ul
            className="font-inter text-secondary-text leading-[1.7] mb-4 ml-6 list-disc"
            style={{ fontSize: '0.95rem' }}
          >
            <li>Personalised Terms & Conditions specific to your business</li>
            <li>GDPR-compliant Privacy Policy</li>
            <li>Client Service Agreement template</li>
            <li>Invoice template branded to your business</li>
            <li>Additional supporting documents (as per your package)</li>
            <li>Editable Word document versions</li>
            <li>Professional PDF versions</li>
          </ul>
          <p
            className="font-inter text-secondary-text leading-[1.7] mb-4"
            style={{ fontSize: '0.95rem' }}
          >
            You own these documents outright. There are no licensing restrictions. You can use, modify, and adapt them for your business as needed. You may not resell them or redistribute them to third parties.
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
            The structure, design, and underlying methodology of Foundationary are our intellectual property. Your personalised documents are yours to own and use. You may not:
          </p>
          <ul
            className="font-inter text-secondary-text leading-[1.7] mb-4 ml-6 list-disc"
            style={{ fontSize: '0.95rem' }}
          >
            <li>Resell or distribute Foundationary services</li>
            <li>Use documents generated for other businesses</li>
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
            Foundationary provides documents on an "as is" basis. To the maximum extent permitted by law:
          </p>
          <ul
            className="font-inter text-secondary-text leading-[1.7] mb-4 ml-6 list-disc"
            style={{ fontSize: '0.95rem' }}
          >
            <li>We make no warranties about the documents' effectiveness in disputes or legal proceedings</li>
            <li>We are not liable for loss of business, revenue, profits, or data</li>
            <li>We are not liable for indirect or consequential damages</li>
            <li>Our total liability is limited to the amount you paid for the Service</li>
          </ul>
          <p
            className="font-inter text-secondary-text leading-[1.7] mb-4"
            style={{ fontSize: '0.95rem' }}
          >
            We take reasonable care in generating documents, but cannot guarantee they will prevent disputes or be enforceable in all circumstances. Your use of the documents and responsibility for legal compliance remains entirely yours.
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
            <strong>Changes in Law:</strong> We update documents based on law at the time of delivery. If legislation changes, you are responsible for reviewing and updating documents as needed.
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
            <li>Use the Service and documents in compliance with all applicable law</li>
            <li>Provide accurate and complete information in your intake form</li>
            <li>Review documents before using them in business transactions</li>
            <li>Update documents if your business materially changes</li>
            <li>Seek professional legal advice if unsure about legal matters</li>
            <li>Not use the Service for illegal, fraudulent, or unethical purposes</li>
          </ul>

          <h2
            className="font-inter font-bold text-dark-text mt-10 mb-4"
            style={{ fontSize: '1.3rem' }}
          >
            10. Refunds and Revisions
          </h2>
          <p
            className="font-inter text-secondary-text leading-[1.7] mb-4"
            style={{ fontSize: '0.95rem' }}
          >
            <strong>No Standard Refunds:</strong> Foundationary is a bespoke service. Once documents are generated and delivered, they cannot be "returned" for a refund.
          </p>
          <p
            className="font-inter text-secondary-text leading-[1.7] mb-4"
            style={{ fontSize: '0.95rem' }}
          >
            <strong>Revisions for Issues:</strong> If documents have clear errors, fail to address your business adequately, or have structural problems, we will revise them at no cost. This is our commitment to quality.
          </p>
          <p
            className="font-inter text-secondary-text leading-[1.7] mb-4"
            style={{ fontSize: '0.95rem' }}
          >
            <strong>Payment Disputes:</strong> If you believe you were charged incorrectly, contact us within 30 days. We'll review the issue and work toward resolution.
          </p>

          <h2
            className="font-inter font-bold text-dark-text mt-10 mb-4"
            style={{ fontSize: '1.3rem' }}
          >
            11. Acceptable Use Policy
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
            12. Modification of Terms
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
            13. Termination
          </h2>
          <p
            className="font-inter text-secondary-text leading-[1.7] mb-4"
            style={{ fontSize: '0.95rem' }}
          >
            Your access to the Service ends when you have received and downloaded your documents. We reserve the right to suspend access to the Website if you breach these terms or engage in abusive, fraudulent, or illegal behaviour. Termination does not affect your ownership of documents already delivered.
          </p>

          <h2
            className="font-inter font-bold text-dark-text mt-10 mb-4"
            style={{ fontSize: '1.3rem' }}
          >
            14. Governing Law & Disputes
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
            15. Third-Party Services
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
            <li><strong>Stripe:</strong> for payment processing. Their terms apply to payments.</li>
            <li><strong>Supabase:</strong> for data storage and infrastructure</li>
            <li><strong>Email providers:</strong> for communications</li>
          </ul>
          <p
            className="font-inter text-secondary-text leading-[1.7] mb-4"
            style={{ fontSize: '0.95rem' }}
          >
            We are not responsible for these third parties' services, reliability, or terms. We've selected them for security and reliability.
          </p>

          <h2
            className="font-inter font-bold text-dark-text mt-10 mb-4"
            style={{ fontSize: '1.3rem' }}
          >
            16. Entire Agreement
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
            17. Contact for Questions
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
            We're committed to resolving issues fairly and promptly. Reach out and we'll work through it together.
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
