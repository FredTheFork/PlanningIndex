import type { Metadata } from 'next';
import { JsonLd } from '@/components/seo';
import { SITE_URL, generateBreadcrumbSchema, generateWebPageSchema } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How PlanningIndex handles, protects, and respects your data. UK GDPR compliant privacy policy.',
  alternates: { canonical: `${SITE_URL}/privacy` },
};

interface PrivacySection {
  heading: string;
  paragraphs: string[];
  list?: string[];
}

const sections: PrivacySection[] = [
  {
    heading: '1. Introduction',
    paragraphs: [
      'PlanningIndex ("we," "us," "our") is committed to protecting and respecting your privacy. This Privacy Policy explains what personal data we collect, how we use it, the legal basis for processing it, how long we keep it, and the rights you have over it.',
      'We are based in the United Kingdom and comply with the Data Protection Act 2018 and the UK GDPR. This policy applies to all visitors to planningindex.co.uk ("the Website") and users of PlanningIndex services ("the Service").',
      'This policy was last updated in September 2026. We may update it from time to time, and we will notify you of any material changes by posting the updated policy on this page.',
    ],
  },
  {
    heading: '2. Data Controller',
    paragraphs: [
      'PlanningIndex is the data controller responsible for your personal data within the meaning of the UK GDPR. If you have any questions about how we handle your data, you can contact us at hello@planningindex.co.uk.',
    ],
  },
  {
    heading: '3. Personal Data We Collect',
    paragraphs: [
      'We collect the following categories of personal data:',
    ],
    list: [
      'Account data: your name, email address, and password (stored as a secure hash) when you create an account.',
      'Company data: company name, address, phone number, email, website, logo URL, and VAT number that you enter in your account settings.',
      'Profile data: your role, preferences, notification settings, and default search configuration.',
      'Search and usage data: the searches you perform, applications you view, leads you create, and proposals you generate within the Service.',
      'Payment data: billing address, subscription plan, and payment history. We do not store full card numbers — card processing is handled entirely by Stripe, our payment provider.',
      'Communication data: messages you send us through the contact form, support emails, or in-app communication.',
      'Technical data: IP address, browser type, device information, and usage analytics collected through cookies and similar technologies.',
    ],
  },
  {
    heading: '4. How We Use Your Data',
    paragraphs: [
      'We use your personal data for the following purposes:',
    ],
    list: [
      'Providing the Service: creating and managing your account, displaying planning application search results, managing your CRM pipeline, and generating proposals.',
      'Processing payments: managing your subscription, processing billing, and maintaining payment history.',
      'Communication: responding to your enquiries, sending service notifications, and providing support.',
      'Service improvement: analysing usage patterns to improve features, fix bugs, and optimise performance.',
      'Security: preventing fraud, detecting abuse, and protecting the integrity of the Service.',
      'Legal compliance: meeting our obligations under UK law, including tax and accounting requirements.',
    ],
  },
  {
    heading: '5. Legal Basis for Processing',
    paragraphs: [
      'Under the UK GDPR, we rely on the following legal bases for processing your personal data:',
    ],
    list: [
      'Performance of a contract (Article 6(1)(b)): processing your data to provide the Service you have signed up for, including account management, search, CRM, and proposal features.',
      'Legal obligation (Article 6(1)(c)): retaining billing records and payment history to comply with UK tax and accounting laws.',
      'Legitimate interests (Article 6(1)(f)): analysing usage data to improve the Service, preventing fraud and abuse, and communicating with you about service updates.',
      'Consent (Article 6(1)(a)): placing non-essential cookies on your device and sending you marketing communications. You can withdraw consent at any time.',
    ],
  },
  {
    heading: '6. Data Retention',
    paragraphs: [
      'We retain your personal data only for as long as necessary to fulfil the purposes set out in this policy:',
    ],
    list: [
      'Account data: retained for the duration of your subscription and for 90 days after cancellation, after which it is permanently deleted.',
      'Company data: retained alongside your account and deleted when your account is deleted.',
      'Search and usage data: retained for the duration of your subscription. Leads, proposals, and notes are deleted 90 days after subscription cancellation.',
      'Payment data: retained for 7 years to comply with UK tax and accounting requirements.',
      'Communication data: retained for 2 years after your last interaction with us.',
      'Technical data: retained for up to 13 months for analytics purposes.',
    ],
  },
  {
    heading: '7. Your Rights',
    paragraphs: [
      'Under the UK GDPR, you have the following rights regarding your personal data:',
    ],
    list: [
      'Right of access: you can request a copy of the personal data we hold about you.',
      'Right to rectification: you can ask us to correct inaccurate or incomplete data.',
      'Right to erasure: you can ask us to delete your personal data, subject to legal retention requirements.',
      'Right to restrict processing: you can ask us to limit how we use your data in certain circumstances.',
      'Right to data portability: you can request your data in a structured, machine-readable format.',
      'Right to object: you can object to processing based on legitimate interests or for direct marketing.',
      'Right to withdraw consent: where processing is based on consent, you can withdraw it at any time.',
      'Right to lodge a complaint: you can complain to the Information Commissioner\u2019s Office (ICO) at ico.org.uk if you believe we have mishandled your data.',
    ],
  },
  {
    heading: '8. Cookies',
    paragraphs: [
      'We use cookies and similar technologies to operate the Website and improve your experience.',
      'Essential cookies: required for the Website to function, including authentication and session management. These cannot be disabled.',
      'Analytics cookies: help us understand how visitors use the Website so we can improve it. These are optional and only set with your consent.',
      'You can manage your cookie preferences through the cookie consent banner displayed on your first visit, or at any time through your browser settings.',
    ],
  },
  {
    heading: '9. Third-Party Services',
    paragraphs: [
      'We use the following third-party services to operate the Service. Each has its own privacy policy, and we encourage you to review them:',
    ],
    list: [
      'Supabase: provides our database infrastructure, authentication, and hosting for application data. Data is stored in EU/UK data centres. Privacy policy: supabase.com/privacy',
      'Stripe: processes all payments and manages subscription billing. Stripe handles card data securely and we never store full card numbers. Privacy policy: stripe.com/privacy',
      'Mapbox: provides map rendering and geographic data for the planning application map view. Mapbox receives IP address and map interaction data. Privacy policy: mapbox.com/privacy',
      'Vercel: hosts the Website and serves pages to your browser. Vercel may log IP addresses and request metadata. Privacy policy: vercel.com/privacy',
    ],
  },
  {
    heading: '10. Data Security',
    paragraphs: [
      'We take the security of your personal data seriously and implement appropriate technical and organisational measures to protect it:',
    ],
    list: [
      'All data in transit is encrypted using TLS (HTTPS).',
      'Passwords are stored as salted hashes and never in plain text.',
      'Access to personal data is restricted to authorised personnel on a need-to-know basis.',
      'Row-level security policies enforce that users can only access their own data in the database.',
      'Payment card data is handled entirely by Stripe and never touches our servers.',
      'We conduct periodic security reviews and monitor for suspicious activity.',
    ],
  },
  {
    heading: '11. International Data Transfers',
    paragraphs: [
      'Your personal data is primarily stored and processed within the United Kingdom and the European Union. Where any data is transferred outside the UK/EU, we ensure it is protected by appropriate safeguards, such as Standard Contractual Clauses or adequacy decisions recognised by the UK government.',
    ],
  },
  {
    heading: '12. Children\u2019s Privacy',
    paragraphs: [
      'The Service is intended for businesses and professionals in the UK construction industry. We do not knowingly collect personal data from anyone under the age of 18. If you believe we have collected data from a minor, please contact us and we will delete it promptly.',
    ],
  },
  {
    heading: '13. Changes to This Policy',
    paragraphs: [
      'We may update this Privacy Policy from time to time to reflect changes in our practices, legal requirements, or service features. We will post the updated version on this page and update the "last updated" date at the top. We encourage you to review this page periodically.',
    ],
  },
  {
    heading: '14. Contact Us',
    paragraphs: [
      'If you have any questions about this Privacy Policy, how we handle your data, or wish to exercise any of your rights, please contact us:',
    ],
    list: [
      'Email: hello@planningindex.co.uk',
      'Website: planningindex.co.uk',
      'Subject line: Privacy Request',
    ],
  },
];

export default function PrivacyPolicyPage() {
  const breadcrumbs = generateBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Privacy Policy', path: '/privacy' },
  ]);

  const webPage = generateWebPageSchema({
    name: 'Privacy Policy | PlanningIndex',
    description: 'How PlanningIndex handles, protects, and respects your data.',
    path: '/privacy',
  });

  return (
    <>
      <JsonLd data={[breadcrumbs, webPage]} />
      <section className="bg-primary-900 text-white px-6 pt-32 pb-20">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="font-sans font-bold mb-4" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
            Privacy Policy
          </h1>
          <p className="font-sans text-white/80" style={{ fontSize: '1.05rem' }}>
            How we handle, protect, and respect your data.
          </p>
        </div>
      </section>
      <section className="bg-white py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="font-sans leading-relaxed mb-6" style={{ fontSize: '0.95rem' }}>
            <strong>Last updated: September 2026</strong>
          </p>
          <div className="space-y-10">
            {sections.map((section) => (
              <div key={section.heading}>
                <h2 className="font-display font-bold text-primary-900 text-h4 mb-4">
                  {section.heading}
                </h2>
                {section.paragraphs.map((p, i) => (
                  <p key={i} className="font-sans text-primary-600 leading-relaxed mb-4" style={{ fontSize: '0.95rem' }}>
                    {p}
                  </p>
                ))}
                {section.list && (
                  <ul className="space-y-2 mt-4">
                    {section.list.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="mt-0.5 flex h-1.5 w-1.5 shrink-0 rounded-full bg-primary-400" />
                        <span className="font-sans text-primary-600 leading-relaxed" style={{ fontSize: '0.95rem' }}>
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
