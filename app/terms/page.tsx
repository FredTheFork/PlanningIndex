import type { Metadata } from 'next';
import { JsonLd } from '@/components/seo';
import { SITE_URL, generateBreadcrumbSchema, generateWebPageSchema } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Terms of Use',
  description: 'The terms and conditions that govern your use of PlanningIndex services.',
  alternates: { canonical: `${SITE_URL}/terms` },
};

interface TermsSection {
  heading: string;
  paragraphs: string[];
  list?: string[];
  afterList?: string[];
}

const sections: TermsSection[] = [
  {
    heading: '1. Acceptance of Terms',
    paragraphs: [
      'By accessing and using planningindex.co.uk (the "Website") and PlanningIndex services (the "Service"), you agree to be bound by these Terms of Use ("the Terms"). If you do not agree with any part of these Terms, you should not use the Website or the Service.',
      'These Terms constitute a legally binding agreement between you ("the User") and PlanningIndex ("we," "us," "our").',
      'We may update these Terms from time to time. The most current version will always be posted on this page with the updated date. Your continued use of the Service after any changes constitutes acceptance of the revised Terms.',
    ],
  },
  {
    heading: '2. Definitions',
    paragraphs: [
      'In these Terms:',
    ],
    list: [
      '"Service" refers to the PlanningIndex platform, including planning application search, CRM, proposal generation, and physical mail delivery features.',
      '"Content" refers to all data, text, planning applications, documents, and materials available through the Service.',
      '"User Content" refers to any data, notes, proposals, leads, and other content you create or upload to the Service.',
      '"Subscription" refers to your paid plan with PlanningIndex, including the Local, Regional, National, or Enterprise tiers.',
    ],
  },
  {
    heading: '3. Account Registration and Responsibilities',
    paragraphs: [
      'To use the Service, you must register for an account by providing accurate and complete information, including your name, email address, and company details.',
      'You are responsible for:',
    ],
    list: [
      'Maintaining the confidentiality of your account credentials.',
      'All activity that occurs under your account, whether authorised or unauthorised.',
      'Ensuring the information you provide is accurate and kept up to date.',
      'Notifying us immediately of any unauthorised use of your account or any other security breach.',
      'Not sharing your account credentials with third parties or allowing multiple people to use a single account.',
    ],
  },
  {
    heading: '4. Acceptable Use',
    paragraphs: [
      'You agree to use the Service only for lawful purposes and in accordance with these Terms. You agree not to:',
    ],
    list: [
      'Use the Service to send unsolicited commercial communications (spam) to property owners or any other party.',
      'Scrape, copy, or redistribute planning application data from the Service for commercial resale or bulk distribution.',
      'Attempt to gain unauthorised access to any part of the Service, other accounts, or computer systems or networks connected to the Service.',
      'Use the Service to infringe the intellectual property rights, privacy, or other rights of any third party.',
      'Upload or transmit viruses, malware, or any other malicious code through the Service.',
      'Interfere with or disrupt the Service, servers, or networks connected to the Service.',
      'Use the Service in any way that could damage, disable, overburden, or impair the Service.',
      'Resell, sublicense, or lease access to the Service without our written permission.',
      'Use the Service to discriminate against any person or group based on protected characteristics.',
    ],
  },
  {
    heading: '5. Subscriptions and Payment',
    paragraphs: [
      'The Service is offered on a subscription basis with the following plan tiers: Local, Regional, National, and Enterprise. Each plan provides different levels of council coverage, team seats, and features.',
      'By subscribing to a plan, you agree to:',
    ],
    list: [
      'Pay the subscription fees for your chosen plan and billing cycle (monthly or annual).',
      'Provide valid payment information and maintain a valid payment method.',
      'Authorise us to charge the subscription fee through our payment provider, Stripe, until you cancel.',
      'Pay all applicable taxes, including VAT at the standard UK rate of 20%.',
    ],
    afterList: [
      'Fees are billed in advance on a recurring basis. Annual subscriptions save 20% compared to monthly billing. All prices shown on the pricing page are exclusive of VAT.',
    ],
  },
  {
    heading: '6. Free Trial',
    paragraphs: [
      'We offer a 14-day free trial on all plans. No credit card is required to start a trial. The trial provides full access to the features of your selected plan.',
      'At the end of the trial period, you will be prompted to select a subscription plan. If you do not select a plan, your access to the Service will be suspended. No payment will be taken unless you actively choose to subscribe.',
    ],
  },
  {
    heading: '7. Cancellation and Refunds',
    paragraphs: [
      'You can cancel your subscription at any time from your account billing settings. Cancellation takes effect at the end of your current billing period — you will retain access to the Service until then.',
      'We do not provide refunds or credits for partial subscription periods. If you cancel an annual subscription, no refund will be issued for the remaining months, but you will continue to have access until the end of the annual term.',
      'If we make a material change to the Service that significantly reduces its value, you may request a pro-rata refund for the unused portion of your subscription.',
    ],
  },
  {
    heading: '8. Intellectual Property',
    paragraphs: [
      'The Service, including its design, features, software, and Content, is owned by PlanningIndex and is protected by UK and international intellectual property laws.',
      'Planning application data displayed through the Service is sourced from public council records and remains the property of the respective local authorities. PlanningIndex provides a search and management interface to this public data under licence from the relevant authorities.',
      'You retain ownership of all User Content you create through the Service, including leads, notes, proposals, and company information. By using the Service, you grant us a non-exclusive licence to process, store, and display your User Content solely for the purpose of providing the Service to you.',
      'You may not copy, modify, distribute, or create derivative works from the Service without our written permission.',
    ],
  },
  {
    heading: '9. Proposals and Physical Mail',
    paragraphs: [
      'The Service includes a proposal generation and physical mail delivery feature. When you send a proposal by post:',
    ],
    list: [
      'You are responsible for the accuracy of the recipient name and delivery address.',
      'You are responsible for the content of the proposal, including pricing, scope of works, and terms.',
      'PlanningIndex facilitates printing and posting through a third-party mail provider but does not guarantee delivery timelines.',
      'We are not liable for proposals that are lost, delayed, or undeliverable due to incorrect addresses or postal service failures.',
      'You must not use the mail feature to send threatening, harassing, or unlawful content.',
    ],
  },
  {
    heading: '10. Limitation of Liability',
    paragraphs: [
      'To the maximum extent permitted by law, PlanningIndex shall not be liable for:',
    ],
    list: [
      'Any indirect, incidental, special, or consequential damages arising from your use of the Service.',
      'Any loss of profits, revenue, business, contracts, or anticipated savings.',
      'Any loss or corruption of data resulting from your use or inability to use the Service.',
      'Any failure or delay in the delivery of physical mail, including proposals sent through the Service.',
      'Any inaccuracies, omissions, or delays in planning application data sourced from third-party council records.',
      'Any unauthorised access to your account resulting from your failure to maintain credential confidentiality.',
    ],
    afterList: [
      'Our total liability for any claim arising from or relating to the Service shall not exceed the total amount you have paid us in the 12 months preceding the claim.',
    ],
  },
  {
    heading: '11. Service Availability',
    paragraphs: [
      'We strive to maintain the Service at a high level of availability but do not guarantee uninterrupted access. The Service may be temporarily unavailable due to maintenance, updates, or circumstances beyond our control.',
      'We are not liable for any downtime, service interruption, or data loss resulting from factors outside our reasonable control, including but not limited to internet connectivity issues, third-party service failures, or force majeure events.',
    ],
  },
  {
    heading: '12. Termination',
    paragraphs: [
      'You may terminate your account at any time by cancelling your subscription and contacting us.',
      'We may suspend or terminate your account if:',
    ],
    list: [
      'You breach any of these Terms.',
      'Your subscription payment fails or is declined.',
      'Your account is inactive for more than 12 months.',
      'We are required to do so by law or regulatory authority.',
    ],
    afterList: [
      'Upon termination, your access to the Service will be removed. Your data will be retained for 90 days, during which you may export it, after which it will be permanently deleted. Payment records are retained for 7 years for tax compliance.',
    ],
  },
  {
    heading: '13. Governing Law',
    paragraphs: [
      'These Terms are governed by the laws of England and Wales. Any disputes arising from or relating to these Terms or the Service shall be subject to the exclusive jurisdiction of the courts of England and Wales.',
    ],
  },
  {
    heading: '14. Dispute Resolution',
    paragraphs: [
      'If a dispute arises, we encourage you to contact us first at hello@planningindex.co.uk to seek an informal resolution. We will make reasonable efforts to resolve the matter within 30 days.',
      'If the dispute cannot be resolved informally, it shall be referred to mediation before any court proceedings are initiated. The mediator shall be agreed upon by both parties, and the costs shall be shared equally.',
      'Nothing in this section prevents either party from seeking injunctive relief or other urgent remedies from a court where necessary.',
    ],
  },
  {
    heading: '15. Changes to These Terms',
    paragraphs: [
      'We may update these Terms from time to time. We will post the updated version on this page and update the "last updated" date. If we make material changes that affect your rights or obligations, we will notify you by email or through the Service.',
      'Your continued use of the Service after any changes take effect constitutes acceptance of the revised Terms. If you do not agree with the changes, you may cancel your subscription as described in Section 7.',
    ],
  },
  {
    heading: '16. Contact Us',
    paragraphs: [
      'If you have any questions about these Terms, please contact us:',
    ],
    list: [
      'Email: hello@planningindex.co.uk',
      'Website: planningindex.co.uk',
      'Subject line: Terms of Use Enquiry',
    ],
  },
];

export default function TermsOfUsePage() {
  const breadcrumbs = generateBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Terms of Use', path: '/terms' },
  ]);

  const webPage = generateWebPageSchema({
    name: 'Terms of Use | PlanningIndex',
    description: 'The terms and conditions that govern your use of PlanningIndex services.',
    path: '/terms',
  });

  return (
    <>
      <JsonLd data={[breadcrumbs, webPage]} />
      <section className="bg-primary-900 text-white px-6 pt-32 pb-20">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="font-sans font-bold mb-4" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
            Terms of Use
          </h1>
          <p className="font-sans text-white/80" style={{ fontSize: '1.05rem' }}>
            The terms and conditions that govern your use of PlanningIndex.
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
                {section.afterList && section.afterList.map((p, i) => (
                  <p key={`al-${i}`} className="font-sans text-primary-600 leading-relaxed mt-4 mb-4" style={{ fontSize: '0.95rem' }}>
                    {p}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
