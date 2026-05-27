import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'GDPR Compliance for UK Sole Traders: Complete 2026 Guide',
  description:
    'Everything UK sole traders need to know about GDPR compliance - data protection, privacy policies, ICO registration, and penalties.',
  keywords: [
    'GDPR sole trader',
    'data protection UK freelancer',
    'privacy policy requirements',
    'ICO registration',
    'UK GDPR compliance',
    'data controller sole trader',
    'GDPR freelancer UK',
  ],
  authors: [{ name: 'Foundationary' }],
  openGraph: {
    type: 'article',
    title: 'GDPR Compliance for UK Sole Traders: Complete 2026 Guide',
    description:
      'Everything UK sole traders need to know about GDPR compliance - data protection, privacy policies, ICO registration, and penalties.',
    url: 'https://foundationary.vercel.app/blog/gdpr-compliance-sole-traders-uk',
    images: [{ url: '/og-home.png', width: 1200, height: 630, alt: 'GDPR Compliance for UK Sole Traders 2026' }],
    publishedTime: '2026-05-27',
    authors: ['Foundationary'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GDPR Compliance for UK Sole Traders: Complete 2026 Guide',
    description: 'Everything UK sole traders need to know about GDPR compliance in 2026.',
    images: ['/og-home.png'],
  },
  alternates: {
    canonical: 'https://foundationary.vercel.app/blog/gdpr-compliance-sole-traders-uk',
  },
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'GDPR Compliance for UK Sole Traders: Complete 2026 Guide',
  description:
    'Everything UK sole traders need to know about GDPR compliance - data protection, privacy policies, ICO registration, and penalties.',
  image: 'https://foundationary.vercel.app/og-home.png',
  datePublished: '2026-05-27',
  dateModified: '2026-05-27',
  author: {
    '@type': 'Organization',
    name: 'Foundationary',
    url: 'https://foundationary.vercel.app',
  },
  publisher: {
    '@type': 'Organization',
    name: 'Foundationary',
    logo: {
      '@type': 'ImageObject',
      url: 'https://foundationary.vercel.app/logo.png',
    },
  },
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': 'https://foundationary.vercel.app/blog/gdpr-compliance-sole-traders-uk',
  },
  keywords: 'GDPR sole trader, data protection UK freelancer, privacy policy requirements, ICO registration',
  articleSection: 'Legal',
  inLanguage: 'en-GB',
  timeRequired: 'PT12M',
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Does GDPR apply to sole traders in the UK?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Yes. UK GDPR applies to any person or organisation that processes personal data, regardless of their size or legal structure. As a sole trader, if you collect, store, or use personal data — such as client names, email addresses, or phone numbers — you are a data controller and must comply with UK GDPR.",
      },
    },
    {
      '@type': 'Question',
      name: 'Do sole traders need to register with the ICO?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Most sole traders who process personal data must register with the Information Commissioner's Office (ICO) and pay the data protection fee. The standard fee for small organisations (turnover under £632,000 or fewer than 10 staff) is £40 per year. Some exemptions apply — for example, if you only process data for personal, family, or household purposes, or certain not-for-profit activities.",
      },
    },
    {
      '@type': 'Question',
      name: 'What happens if I do not comply with GDPR as a sole trader?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "The ICO can issue fines of up to £17.5 million or 4% of global annual turnover (whichever is higher) for serious breaches. For sole traders, more typical enforcement actions include warnings, reprimands, and smaller fines. However, even modest fines combined with reputational damage can be seriously damaging for a small business. You are also exposed to civil claims from individuals whose data rights you have breached.",
      },
    },
    {
      '@type': 'Question',
      name: 'Do I need a privacy policy as a sole trader?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Yes. If you collect personal data from clients, website visitors, or anyone else, you must provide a privacy notice explaining what data you collect, why you collect it, how long you keep it, and what rights the individual has over their data. This is a legal requirement under UK GDPR Articles 13 and 14.",
      },
    },
    {
      '@type': 'Question',
      name: 'What is a lawful basis for processing personal data?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Under UK GDPR, you must have a valid lawful basis for every type of personal data you process. The six lawful bases are: consent, contract, legal obligation, vital interests, public task, and legitimate interests. For most sole traders, the most relevant bases are contract (processing data to fulfil a client agreement), legitimate interests (processing for genuine business purposes), and legal obligation (where a law requires you to hold the data).",
      },
    },
    {
      '@type': 'Question',
      name: 'How long can I keep client data?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "UK GDPR requires you to keep personal data only as long as necessary for the purpose it was collected. For client records, HMRC requires you to keep financial records for at least 5 years after the Self Assessment deadline for the relevant tax year. After the retention period, data should be securely deleted or anonymised. You should document your retention periods in your privacy policy.",
      },
    },
  ],
};

export default function GdprComplianceArticle() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Article Hero */}
      <section
        className="px-6 py-16 md:py-20"
        style={{ background: 'linear-gradient(135deg, #1B3F7A 0%, #2C68C4 100%)' }}
      >
        <div className="max-w-[860px] mx-auto">
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <Link
              href="/blog"
              className="text-white/70 text-sm hover:text-white transition-colors"
            >
              ← Blog
            </Link>
            <span className="text-white/40">·</span>
            <span className="text-xs font-semibold uppercase tracking-widest text-white/70">
              Legal
            </span>
          </div>
          <h1 className="font-bold text-white text-3xl md:text-5xl leading-tight mb-5">
            GDPR Compliance for UK Sole Traders: Complete 2026 Guide
          </h1>
          <p className="text-white/85 text-lg leading-relaxed mb-7 max-w-[720px]">
            UK GDPR applies to sole traders and freelancers the moment you hold a single client&apos;s email address. This guide covers everything you need to know — from lawful bases and privacy policies to ICO registration and what penalties actually look like in practice.
          </p>
          <div className="flex flex-wrap items-center gap-5 text-sm text-white/70">
            <span>By <strong className="text-white">Foundationary</strong></span>
            <span>·</span>
            <time dateTime="2026-05-27">27 May 2026</time>
            <span>·</span>
            <span>12 min read</span>
          </div>
        </div>
      </section>

      {/* Share Bar */}
      <div className="bg-[#F0F4FF] border-b border-[#D0D9F2] px-6 py-3">
        <div className="max-w-[860px] mx-auto flex flex-wrap items-center justify-between gap-4">
          <span className="text-[#5a5a7a] text-sm font-medium">Share this guide:</span>
          <div className="flex gap-3">
            <a
              href="https://www.linkedin.com/sharing/share-offsite/?url=https://foundationary.vercel.app/blog/gdpr-compliance-sole-traders-uk"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#1B3F7A] bg-white border border-[#D0D9F2] rounded-lg px-4 py-2 hover:bg-[#F0F4FF] transition-colors"
            >
              Share on LinkedIn
            </a>
            <a
              href="https://twitter.com/intent/tweet?url=https://foundationary.vercel.app/blog/gdpr-compliance-sole-traders-uk&text=GDPR+Compliance+for+UK+Sole+Traders%3A+Complete+2026+Guide"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#1B3F7A] bg-white border border-[#D0D9F2] rounded-lg px-4 py-2 hover:bg-[#F0F4FF] transition-colors"
            >
              Share on X
            </a>
          </div>
        </div>
      </div>

      {/* Article Body */}
      <article className="bg-white px-6 py-14">
        <div className="max-w-[860px] mx-auto">

          {/* Table of Contents */}
          <nav className="bg-[#F0F4FF] rounded-xl p-6 mb-12 border border-[#D0D9F2]">
            <h2 className="font-bold text-[#1B3F7A] text-lg mb-4">In this guide</h2>
            <ol className="space-y-2 text-[#2C68C4]">
              {[
                ['#applies', 'What is UK GDPR and does it apply to you?'],
                ['#data-you-collect', 'What personal data do you collect as a sole trader?'],
                ['#lawful-basis', 'Lawful basis for processing personal data'],
                ['#privacy-policy', 'Privacy policy requirements'],
                ['#data-subject-rights', 'Data subject rights you must respect'],
                ['#ico-registration', 'ICO registration requirements'],
                ['#data-security', 'Keeping personal data secure'],
                ['#penalties', 'Penalties and fines for non-compliance'],
                ['#checklist', 'GDPR compliance checklist for sole traders'],
                ['#faq', 'Frequently asked questions'],
              ].map(([href, label]) => (
                <li key={href}>
                  <a
                    href={href}
                    className="hover:underline text-sm md:text-base leading-relaxed"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          {/* Section: What is GDPR */}
          <section id="applies" className="mb-14 scroll-mt-8">
            <h2 className="font-bold text-[#1a1a2e] text-3xl mb-5">
              What is UK GDPR and does it apply to you?
            </h2>
            <p className="text-[#3a3a5a] leading-relaxed mb-4 text-lg">
              The UK General Data Protection Regulation (UK GDPR) is the primary law governing how organisations and individuals handle personal data in the United Kingdom. It came into effect on 1 January 2021 following Brexit, when the EU&apos;s GDPR was retained and adapted into UK law through the Data Protection Act 2018.
            </p>
            <p className="text-[#3a3a5a] leading-relaxed mb-4 text-lg">
              One of the most widely held misconceptions among sole traders and freelancers is that GDPR only applies to large businesses. This is simply not true. UK GDPR applies to any person, company, or organisation that processes personal data — regardless of size. As a sole trader, you are almost certainly processing personal data every single day.
            </p>
            <p className="text-[#3a3a5a] leading-relaxed mb-5 text-lg">
              &quot;Personal data&quot; means any information that can identify a living individual, directly or indirectly. That includes names, email addresses, phone numbers, postal addresses, IP addresses, and even job titles when linked to an individual.
            </p>

            <div className="bg-[#F0F4FF] rounded-xl p-6 mb-5 border-l-4 border-[#2C68C4]">
              <h3 className="font-semibold text-[#1B3F7A] mb-3">You are almost certainly a &quot;data controller&quot;</h3>
              <p className="text-[#3a3a5a] text-sm leading-relaxed mb-3">
                Under UK GDPR, the key role is that of a <strong>data controller</strong> — the person or organisation that determines the purposes and means of processing personal data. As a sole trader, you are a data controller if you:
              </p>
              <ul className="space-y-2 text-sm text-[#3a3a5a]">
                {[
                  'Store client contact details in a spreadsheet or CRM',
                  'Send emails to clients or prospects',
                  'Have a website that collects enquiry forms or uses analytics',
                  'Keep a record of past projects with client names',
                  'Use any email marketing tool (Mailchimp, ConvertKit, etc.)',
                  'Send invoices that include client names and addresses',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="text-[#2C68C4] mt-0.5 flex-shrink-0">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-[#5a5a7a] text-sm italic">
              If any of the above applies to you, UK GDPR applies to you. The question is not whether it applies — it is whether you are compliant.
            </p>
          </section>

          {/* Section: Data you collect */}
          <section id="data-you-collect" className="mb-14 scroll-mt-8">
            <h2 className="font-bold text-[#1a1a2e] text-3xl mb-5">
              What personal data do you collect as a sole trader?
            </h2>
            <p className="text-[#3a3a5a] leading-relaxed mb-5 text-lg">
              Before you can put GDPR compliance in place, you need to understand exactly what personal data you hold, where it comes from, and what you do with it. This is sometimes called a &quot;data mapping&quot; or &quot;data audit&quot; exercise — and it is the essential first step.
            </p>

            <h3 className="font-semibold text-[#1B3F7A] text-xl mb-4">Common categories of data sole traders hold</h3>

            <div className="space-y-4 mb-7">
              <div className="border border-gray-200 rounded-lg p-5">
                <h4 className="font-semibold text-[#1B3F7A] mb-2">Client and prospect data</h4>
                <p className="text-[#3a3a5a] text-sm leading-relaxed">
                  Names, business names, email addresses, phone numbers, postal addresses, project history, payment records, and communication history. This is the most common category for almost every sole trader.
                </p>
              </div>
              <div className="border border-gray-200 rounded-lg p-5">
                <h4 className="font-semibold text-[#1B3F7A] mb-2">Website visitor data</h4>
                <p className="text-[#3a3a5a] text-sm leading-relaxed">
                  If your website uses Google Analytics, Facebook Pixel, or similar tools, or collects contact form submissions, you are processing personal data about visitors. IP addresses are personal data under UK GDPR.
                </p>
              </div>
              <div className="border border-gray-200 rounded-lg p-5">
                <h4 className="font-semibold text-[#1B3F7A] mb-2">Supplier and contractor data</h4>
                <p className="text-[#3a3a5a] text-sm leading-relaxed">
                  If you work with subcontractors or suppliers who are individuals (not limited companies), you hold personal data about them — their contact details, bank account information for payments, tax details if you need to handle IR35 considerations.
                </p>
              </div>
              <div className="border border-gray-200 rounded-lg p-5">
                <h4 className="font-semibold text-[#1B3F7A] mb-2">Marketing and email list data</h4>
                <p className="text-[#3a3a5a] text-sm leading-relaxed">
                  If you run any form of email marketing — even occasional newsletters — you hold personal data about those subscribers. This is governed by both UK GDPR and the Privacy and Electronic Communications Regulations (PECR).
                </p>
              </div>
            </div>

            <div className="bg-[#FFF9E6] border border-[#F5C842] rounded-lg p-5 mb-5">
              <p className="text-[#7A5900] font-medium mb-2">Practical step: create a simple data register</p>
              <p className="text-[#7A5900] text-sm leading-relaxed">
                UK GDPR requires data controllers with 250 or more employees to maintain formal Records of Processing Activities (RoPA). While most sole traders fall below this threshold, maintaining a simple record of what data you hold, why, and how long you keep it is good practice — and will be invaluable if the ICO ever enquires.
              </p>
            </div>
          </section>

          {/* Section: Lawful Basis */}
          <section id="lawful-basis" className="mb-14 scroll-mt-8">
            <h2 className="font-bold text-[#1a1a2e] text-3xl mb-5">
              Lawful basis for processing personal data
            </h2>
            <p className="text-[#3a3a5a] leading-relaxed mb-4 text-lg">
              One of the fundamental requirements of UK GDPR is that you must have a lawful basis for every type of personal data processing you carry out. You cannot simply process data because it is convenient — there must be a legal justification.
            </p>
            <p className="text-[#3a3a5a] leading-relaxed mb-6 text-lg">
              There are six lawful bases under UK GDPR. For most sole traders, three are most relevant:
            </p>

            <div className="space-y-5 mb-7">
              <div className="bg-[#F0F4FF] rounded-xl p-6 border-l-4 border-[#2C68C4]">
                <h3 className="font-bold text-[#1B3F7A] text-lg mb-2">
                  1. Contract
                  <span className="ml-2 text-xs font-normal text-white bg-[#2C68C4] rounded px-2 py-0.5">Most common for sole traders</span>
                </h3>
                <p className="text-[#3a3a5a] text-sm leading-relaxed mb-2">
                  Processing is necessary to perform a contract with the individual, or to take steps at their request before entering into a contract. When you hold a client&apos;s contact details and project information to deliver your services, the lawful basis is contract.
                </p>
                <p className="text-[#5a5a7a] text-xs italic">
                  Example: Storing a client&apos;s name, email, and project requirements to deliver a freelance design project.
                </p>
              </div>

              <div className="bg-[#F0F4FF] rounded-xl p-6 border-l-4 border-[#2C68C4]">
                <h3 className="font-bold text-[#1B3F7A] text-lg mb-2">2. Legitimate Interests</h3>
                <p className="text-[#3a3a5a] text-sm leading-relaxed mb-2">
                  Processing is necessary for your legitimate interests (or those of a third party), unless those interests are overridden by the individual&apos;s rights and interests. This is a flexible basis but requires you to document a &quot;legitimate interests assessment&quot; (LIA) and balance it against the individual&apos;s privacy rights.
                </p>
                <p className="text-[#5a5a7a] text-xs italic">
                  Example: Following up with a prospect who made an enquiry but did not become a client. Marketing to existing clients about similar services you offer.
                </p>
              </div>

              <div className="bg-[#F0F4FF] rounded-xl p-6 border-l-4 border-[#2C68C4]">
                <h3 className="font-bold text-[#1B3F7A] text-lg mb-2">3. Legal Obligation</h3>
                <p className="text-[#3a3a5a] text-sm leading-relaxed mb-2">
                  Processing is necessary to comply with a legal obligation. HMRC requires you to keep financial records (which include personal data) for at least 5 years. This legal requirement is your lawful basis for retaining those records beyond the life of the contract.
                </p>
                <p className="text-[#5a5a7a] text-xs italic">
                  Example: Keeping client invoice records for HMRC compliance purposes.
                </p>
              </div>

              <div className="bg-[#F8FAFE] rounded-xl p-6">
                <h3 className="font-bold text-[#1B3F7A] text-lg mb-2">4. Consent</h3>
                <p className="text-[#3a3a5a] text-sm leading-relaxed">
                  Consent is often thought of as the &quot;default&quot; basis — but under UK GDPR, it is actually one of the most demanding. Consent must be freely given, specific, informed, and unambiguous. A pre-ticked box or implied consent is not valid. Consent is the appropriate basis for email marketing to people who are not existing clients — such as a newsletter sign-up — but should not be used as a catch-all for other processing activities.
                </p>
              </div>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-5">
              <p className="text-red-800 font-medium mb-1">Important: identify your basis before you process</p>
              <p className="text-red-700 text-sm leading-relaxed">
                You must identify your lawful basis before you begin processing — you cannot apply it retrospectively. Document your basis for each processing activity and record it in your privacy policy. If you later want to change the basis, you will generally need to stop and restart with the correct one.
              </p>
            </div>
          </section>

          {/* Section: Privacy Policy */}
          <section id="privacy-policy" className="mb-14 scroll-mt-8">
            <h2 className="font-bold text-[#1a1a2e] text-3xl mb-5">
              Privacy policy requirements
            </h2>
            <p className="text-[#3a3a5a] leading-relaxed mb-4 text-lg">
              Under UK GDPR Articles 13 and 14, you must provide individuals with a privacy notice whenever you collect their personal data. This is a legal requirement — not a formality. A compliant privacy policy must be clear, concise, and written in plain English.
            </p>
            <p className="text-[#3a3a5a] leading-relaxed mb-6 text-lg">
              If you have a website, your privacy policy should be easily accessible — typically linked from the footer of every page. You should also direct clients to it before they engage your services.
            </p>

            <h3 className="font-semibold text-[#1B3F7A] text-xl mb-4">What your privacy policy must include</h3>

            <div className="space-y-3 mb-7">
              {[
                {
                  title: 'Your identity and contact details',
                  desc: 'Your name (as data controller), your business name if different, and how individuals can contact you with data protection queries.',
                },
                {
                  title: 'What personal data you collect',
                  desc: 'A clear description of the categories of data you collect — contact information, financial data, technical data (e.g. IP addresses), usage data from your website, etc.',
                },
                {
                  title: 'Why you collect it (purposes)',
                  desc: 'The specific purposes for which you use the data — to fulfil client contracts, to send invoices, for marketing, for HMRC compliance, etc.',
                },
                {
                  title: 'The lawful basis for each processing activity',
                  desc: 'Which of the six lawful bases applies to each type of processing you carry out.',
                },
                {
                  title: 'Who you share data with',
                  desc: 'Any third parties who receive the personal data — cloud storage providers, accounting software, email tools, payment processors, subcontractors.',
                },
                {
                  title: 'How long you keep data (retention periods)',
                  desc: 'The specific period for each category of data, or the criteria used to determine it. Do not simply say "as long as necessary" — be specific.',
                },
                {
                  title: 'Data subject rights',
                  desc: 'A clear explanation of the rights individuals have (see the next section) and how to exercise them.',
                },
                {
                  title: 'How to complain',
                  desc: 'The right to lodge a complaint with the ICO (the UK supervisory authority) and the ICO\'s contact details.',
                },
                {
                  title: 'International transfers (if applicable)',
                  desc: 'If you transfer data outside the UK (e.g. using US-based software like Google Workspace or Mailchimp), you must disclose this and explain the safeguards in place.',
                },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-4 bg-[#F8FAFE] rounded-lg p-4">
                  <span className="text-[#2C68C4] mt-1 flex-shrink-0 font-bold">✓</span>
                  <div>
                    <p className="font-semibold text-[#1a1a2e] text-sm mb-1">{item.title}</p>
                    <p className="text-[#5a5a7a] text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Internal CTA */}
            <div
              className="rounded-2xl p-7 text-white"
              style={{ background: 'linear-gradient(135deg, #1B3F7A 0%, #2C68C4 100%)' }}
            >
              <h3 className="font-bold text-xl mb-2">
                Get a GDPR-compliant privacy policy written for you
              </h3>
              <p className="text-white/85 mb-5 text-sm leading-relaxed">
                Foundationary creates a bespoke GDPR privacy policy tailored to your specific sole trader business — covering your data flows, your lawful bases, and your retention periods. It is included in every package, along with 9 other essential business documents.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/whats-included"
                  className="font-semibold text-[#1B3F7A] bg-white rounded-lg hover:bg-[#F0F4FF] transition-colors px-5 py-2.5 text-sm"
                >
                  See what&apos;s included →
                </Link>
                <Link
                  href="/pricing"
                  className="font-semibold text-white border border-white/60 rounded-lg hover:bg-white/10 transition-colors px-5 py-2.5 text-sm"
                >
                  View pricing
                </Link>
              </div>
            </div>
          </section>

          {/* Section: Data Subject Rights */}
          <section id="data-subject-rights" className="mb-14 scroll-mt-8">
            <h2 className="font-bold text-[#1a1a2e] text-3xl mb-5">
              Data subject rights you must respect
            </h2>
            <p className="text-[#3a3a5a] leading-relaxed mb-5 text-lg">
              UK GDPR grants individuals a set of rights over their personal data. As a data controller, you must be able to respond to requests to exercise these rights — generally within one calendar month of receiving the request, free of charge.
            </p>

            <div className="space-y-4 mb-7">
              {[
                {
                  right: 'Right of access (Subject Access Request)',
                  detail: 'Individuals can request a copy of the personal data you hold about them, along with information about how you process it. You must respond within one month. This is one of the most commonly exercised rights — be prepared for it.',
                },
                {
                  right: 'Right to rectification',
                  detail: 'Individuals can ask you to correct inaccurate personal data or complete incomplete data. You must do so without undue delay.',
                },
                {
                  right: 'Right to erasure ("right to be forgotten")',
                  detail: 'Individuals can ask you to delete their personal data in certain circumstances — for example, if you no longer need it, if they withdraw consent, or if you have no legitimate reason to continue holding it. Note: this right is not absolute. Legal obligations (e.g. HMRC record-keeping) can override it.',
                },
                {
                  right: 'Right to restrict processing',
                  detail: 'Individuals can ask you to pause processing their data — for example, while a dispute is resolved about its accuracy. You can still hold the data, but must not use it.',
                },
                {
                  right: 'Right to data portability',
                  detail: 'Where processing is based on consent or contract and carried out by automated means, individuals can request their data in a structured, commonly-used format (e.g. CSV) to transfer to another service.',
                },
                {
                  right: 'Right to object',
                  detail: 'Individuals can object to processing based on legitimate interests or for direct marketing purposes. For direct marketing, this right is absolute — you must stop immediately. For other legitimate interests, you must stop unless you can demonstrate compelling grounds.',
                },
              ].map((item) => (
                <div key={item.right} className="border border-gray-200 rounded-lg p-5">
                  <h3 className="font-semibold text-[#1B3F7A] mb-2">{item.right}</h3>
                  <p className="text-[#3a3a5a] text-sm leading-relaxed">{item.detail}</p>
                </div>
              ))}
            </div>

            <div className="bg-[#FFF9E6] border border-[#F5C842] rounded-lg p-5">
              <p className="text-[#7A5900] font-medium mb-1">Practical tip: have a process ready</p>
              <p className="text-[#7A5900] text-sm leading-relaxed">
                Even as a sole trader, you should have a simple process for handling data subject requests. Know where your data is stored, be able to retrieve it quickly, and have a template response ready. The one-month clock starts from the date you receive the request — not the date you notice it.
              </p>
            </div>
          </section>

          {/* Section: ICO Registration */}
          <section id="ico-registration" className="mb-14 scroll-mt-8">
            <h2 className="font-bold text-[#1a1a2e] text-3xl mb-5">
              ICO registration requirements
            </h2>
            <p className="text-[#3a3a5a] leading-relaxed mb-4 text-lg">
              The Information Commissioner&apos;s Office (ICO) is the UK&apos;s independent data protection regulator. Most organisations that process personal data — including most sole traders — must register with the ICO and pay an annual data protection fee.
            </p>

            <h3 className="font-semibold text-[#1B3F7A] text-xl mb-4">Data protection fee tiers (2026)</h3>

            <div className="overflow-x-auto mb-6">
              <table className="w-full text-sm text-[#3a3a5a] border-collapse">
                <thead>
                  <tr className="bg-[#F0F4FF]">
                    <th className="text-left text-[#1B3F7A] font-semibold p-3 border border-[#D0D9F2]">Tier</th>
                    <th className="text-left text-[#1B3F7A] font-semibold p-3 border border-[#D0D9F2]">Organisation type</th>
                    <th className="text-left text-[#1B3F7A] font-semibold p-3 border border-[#D0D9F2]">Annual fee</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-3 border border-gray-200 font-medium">Tier 1</td>
                    <td className="p-3 border border-gray-200">Micro-organisations: turnover up to £632,000 OR fewer than 10 staff</td>
                    <td className="p-3 border border-gray-200 font-semibold text-[#1B3F7A]">£40/year</td>
                  </tr>
                  <tr className="bg-[#F8FAFE]">
                    <td className="p-3 border border-gray-200 font-medium">Tier 2</td>
                    <td className="p-3 border border-gray-200">Small and medium organisations: turnover up to £36m OR fewer than 250 staff</td>
                    <td className="p-3 border border-gray-200 font-semibold text-[#1B3F7A]">£60/year</td>
                  </tr>
                  <tr>
                    <td className="p-3 border border-gray-200 font-medium">Tier 3</td>
                    <td className="p-3 border border-gray-200">Large organisations: turnover over £36m OR 250+ staff</td>
                    <td className="p-3 border border-gray-200 font-semibold text-[#1B3F7A]">£2,900/year</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-[#3a3a5a] leading-relaxed mb-5">
              The vast majority of sole traders will fall into Tier 1 — the £40 annual fee. This is not optional: failing to register when required is a criminal offence under the Data Protection Act 2018, and the ICO can issue a fixed penalty notice of up to £4,000.
            </p>

            <h3 className="font-semibold text-[#1B3F7A] text-xl mb-3">Exemptions from ICO registration</h3>
            <p className="text-[#3a3a5a] leading-relaxed mb-3">
              You may be exempt from paying the fee (but not from UK GDPR itself) if you only process personal data for:
            </p>
            <ul className="space-y-2 mb-5 text-[#3a3a5a]">
              <li className="flex items-start gap-3">
                <span className="text-[#2C68C4] mt-1 flex-shrink-0">✓</span>
                <span>Staff administration (payroll, HR records) — as a sole trader with no employees, this rarely applies</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#2C68C4] mt-1 flex-shrink-0">✓</span>
                <span>Advertising, marketing, and public relations for your own business (subject to conditions)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#2C68C4] mt-1 flex-shrink-0">✓</span>
                <span>Accounts and records — only for internal financial administration, not for service delivery</span>
              </li>
            </ul>
            <p className="text-[#5a5a7a] text-sm">
              If you are unsure whether you need to register, the ICO has a self-assessment tool on its website. Most sole traders who hold client data for service delivery purposes must register. At £40 per year, it is not worth the risk of non-compliance.
            </p>
          </section>

          {/* Section: Data Security */}
          <section id="data-security" className="mb-14 scroll-mt-8">
            <h2 className="font-bold text-[#1a1a2e] text-3xl mb-5">
              Keeping personal data secure
            </h2>
            <p className="text-[#3a3a5a] leading-relaxed mb-4 text-lg">
              UK GDPR requires you to implement &quot;appropriate technical and organisational measures&quot; to protect personal data against unauthorised access, accidental loss, destruction, or damage. The standard is not perfection — it is proportionality relative to the risks and the nature of the data you hold.
            </p>
            <p className="text-[#3a3a5a] leading-relaxed mb-6 text-lg">
              For most sole traders, this means following good information security practices rather than enterprise-level security infrastructure. Here is what practical compliance looks like:
            </p>

            <div className="grid sm:grid-cols-2 gap-4 mb-7">
              {[
                {
                  title: 'Use strong, unique passwords',
                  desc: 'Use a password manager (Bitwarden, 1Password) and enable two-factor authentication on all accounts that hold personal data.',
                },
                {
                  title: 'Encrypt sensitive files',
                  desc: 'Store sensitive client data in encrypted folders or use encrypted cloud storage. Do not email unencrypted spreadsheets of personal data.',
                },
                {
                  title: 'Keep software updated',
                  desc: 'Apply operating system and application updates promptly. Many data breaches exploit known, unpatched vulnerabilities.',
                },
                {
                  title: 'Secure your devices',
                  desc: 'Use full-disk encryption on laptops (FileVault on Mac, BitLocker on Windows). Set a lock screen with a PIN or password.',
                },
                {
                  title: 'Be careful with email',
                  desc: 'Do not CC multiple unrelated contacts in the same email. Use BCC when emailing a group. Do not forward client data unnecessarily.',
                },
                {
                  title: 'Use reputable cloud providers',
                  desc: 'Stick to well-known, GDPR-compliant cloud services (Google Workspace, Microsoft 365, Dropbox Business). Review their data processing agreements.',
                },
                {
                  title: 'Have a data breach plan',
                  desc: 'UK GDPR requires you to report certain data breaches to the ICO within 72 hours. Know what constitutes a breach and who to call.',
                },
                {
                  title: 'Dispose of data securely',
                  desc: 'Shred physical documents containing personal data. Securely wipe storage devices before disposal. Do not just delete files — use secure deletion tools.',
                },
              ].map((item) => (
                <div key={item.title} className="bg-[#F8FAFE] rounded-lg p-4">
                  <p className="font-semibold text-[#1B3F7A] mb-1 text-sm">{item.title}</p>
                  <p className="text-[#5a5a7a] text-xs leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="bg-[#F0F4FF] rounded-xl p-5 border-l-4 border-[#2C68C4]">
              <p className="text-[#3a3a5a] text-sm">
                <strong className="text-[#1B3F7A]">Data breach reporting:</strong> If you experience a personal data breach — such as sending client data to the wrong person, losing an unencrypted laptop, or being hacked — you must assess whether it needs to be reported to the ICO within 72 hours. Not all breaches require reporting, but you must document all breaches internally. If the breach is likely to result in a high risk to individuals, you must also notify those individuals directly.
              </p>
            </div>
          </section>

          {/* Section: Penalties */}
          <section id="penalties" className="mb-14 scroll-mt-8">
            <h2 className="font-bold text-[#1a1a2e] text-3xl mb-5">
              Penalties and fines for non-compliance
            </h2>
            <p className="text-[#3a3a5a] leading-relaxed mb-4 text-lg">
              The ICO has significant enforcement powers under UK GDPR and the Data Protection Act 2018. Understanding the penalty structure helps you understand why compliance matters — even for a small sole trader business.
            </p>

            <h3 className="font-semibold text-[#1B3F7A] text-xl mb-4">The two penalty tiers</h3>

            <div className="grid sm:grid-cols-2 gap-5 mb-7">
              <div className="bg-[#FFF5F5] border border-red-200 rounded-xl p-5">
                <p className="font-bold text-red-800 text-2xl mb-1">Up to £8.7m</p>
                <p className="text-red-700 font-semibold text-sm mb-2">or 2% of global annual turnover</p>
                <p className="text-red-700 text-xs leading-relaxed">
                  For infringements of basic obligations — such as failing to register with the ICO, inadequate security measures, or not having lawful basis for processing.
                </p>
              </div>
              <div className="bg-[#FFF0F0] border border-red-300 rounded-xl p-5">
                <p className="font-bold text-red-900 text-2xl mb-1">Up to £17.5m</p>
                <p className="text-red-800 font-semibold text-sm mb-2">or 4% of global annual turnover</p>
                <p className="text-red-800 text-xs leading-relaxed">
                  For the most serious infringements — including breaching core data protection principles, violating data subject rights, or unlawful international transfers.
                </p>
              </div>
            </div>

            <p className="text-[#3a3a5a] leading-relaxed mb-4">
              In practice, the ICO rarely issues maximum fines against sole traders and small businesses. The largest fines are reserved for major organisations responsible for large-scale breaches. However, the ICO does take action against small businesses — and the consequences go beyond financial penalties:
            </p>

            <ul className="space-y-3 mb-6 text-[#3a3a5a]">
              {[
                { icon: '✗', text: 'Formal reprimands — which can be published on the ICO website, damaging your reputation' },
                { icon: '✗', text: 'Enforcement notices — requiring you to take specific action or stop processing' },
                { icon: '✗', text: 'Criminal prosecution — particularly for failing to register with the ICO' },
                { icon: '✗', text: 'Civil claims — from individuals whose data rights you have breached' },
                { icon: '✗', text: 'Reputational damage — especially serious in B2B businesses where client trust is paramount' },
              ].map((item) => (
                <li key={item.text} className="flex items-start gap-3">
                  <span className="text-red-500 mt-1 flex-shrink-0">{item.icon}</span>
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>

            <div className="bg-[#F0F4FF] rounded-xl p-5 border-l-4 border-[#2C68C4]">
              <p className="text-[#3a3a5a] text-sm">
                <strong className="text-[#1B3F7A]">The practical reality:</strong> For most sole traders, the bigger risk is not a massive ICO fine — it is the client you lose when they discover you have not properly handled their data, or the reputation damage from being mentioned in an ICO reprimand. GDPR compliance is also increasingly a procurement requirement: larger clients and corporates routinely ask for evidence of data protection compliance before engaging freelancers.
              </p>
            </div>
          </section>

          {/* Section: Checklist */}
          <section id="checklist" className="mb-14 scroll-mt-8">
            <h2 className="font-bold text-[#1a1a2e] text-3xl mb-5">
              GDPR compliance checklist for sole traders
            </h2>
            <p className="text-[#3a3a5a] leading-relaxed mb-6 text-lg">
              Use this checklist to assess your current compliance position and identify what you need to put in place. Not every item will apply to every sole trader — focus on what is relevant to how you operate.
            </p>

            <div className="space-y-8">
              <div>
                <h3 className="font-semibold text-[#1B3F7A] text-lg mb-3 pb-2 border-b border-[#D0D9F2]">
                  Foundation
                </h3>
                <ul className="space-y-3">
                  {[
                    'Conducted a data audit — I know what personal data I hold and why',
                    'Identified a lawful basis for each type of processing I carry out',
                    'Registered with the ICO and paid the data protection fee (£40/year for most sole traders)',
                    'Have a written privacy policy that covers all required UK GDPR elements',
                    'Privacy policy is accessible to all people whose data I hold',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-[#3a3a5a]">
                      <span className="flex-shrink-0 w-5 h-5 border-2 border-[#2C68C4] rounded mt-0.5" />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-[#1B3F7A] text-lg mb-3 pb-2 border-b border-[#D0D9F2]">
                  Client and data management
                </h3>
                <ul className="space-y-3">
                  {[
                    'Only collect personal data I actually need (data minimisation)',
                    'Have documented retention periods for different categories of data',
                    'Have a process to handle Subject Access Requests within one month',
                    'Know how to respond to requests for erasure, rectification, and objection',
                    'My client contracts include data protection clauses where relevant',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-[#3a3a5a]">
                      <span className="flex-shrink-0 w-5 h-5 border-2 border-[#2C68C4] rounded mt-0.5" />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-[#1B3F7A] text-lg mb-3 pb-2 border-b border-[#D0D9F2]">
                  Security and breach response
                </h3>
                <ul className="space-y-3">
                  {[
                    'Use strong, unique passwords and two-factor authentication on all accounts holding personal data',
                    'Devices are protected with encryption and password/PIN locks',
                    'Know what constitutes a personal data breach and what to do',
                    'Know how to report a breach to the ICO within 72 hours if required',
                    'Have a process for securely deleting data when it is no longer needed',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-[#3a3a5a]">
                      <span className="flex-shrink-0 w-5 h-5 border-2 border-[#2C68C4] rounded mt-0.5" />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-[#1B3F7A] text-lg mb-3 pb-2 border-b border-[#D0D9F2]">
                  Website and marketing (if applicable)
                </h3>
                <ul className="space-y-3">
                  {[
                    'Website has a compliant cookie notice (if using analytics or tracking cookies)',
                    'Contact forms have a clear link to the privacy policy',
                    'Marketing emails are sent only to people with valid consent or legitimate interest basis',
                    'Unsubscribe mechanism in place for all marketing emails (PECR requirement)',
                    'Third-party tools (Google Analytics, Mailchimp, etc.) reviewed for GDPR compliance',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-[#3a3a5a]">
                      <span className="flex-shrink-0 w-5 h-5 border-2 border-[#2C68C4] rounded mt-0.5" />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section id="faq" className="mb-14 scroll-mt-8">
            <h2 className="font-bold text-[#1a1a2e] text-3xl mb-7">
              Frequently asked questions
            </h2>
            <div className="space-y-7">
              {[
                {
                  q: 'Does GDPR apply to sole traders in the UK?',
                  a: "Yes. UK GDPR applies to any person or organisation that processes personal data, regardless of their size or legal structure. As a sole trader, if you collect, store, or use personal data — such as client names, email addresses, or phone numbers — you are a data controller and must comply with UK GDPR.",
                },
                {
                  q: 'Do sole traders need to register with the ICO?',
                  a: "Most sole traders who process personal data must register with the ICO and pay the data protection fee. The standard fee for small organisations (turnover under £632,000 or fewer than 10 staff) is £40 per year. Some limited exemptions apply — check the ICO website's self-assessment tool if you are unsure.",
                },
                {
                  q: 'What happens if I do not comply with GDPR as a sole trader?',
                  a: "The ICO can issue fines of up to £17.5 million for serious breaches. For sole traders, more typical enforcement actions include warnings, reprimands, and smaller fines. Failing to register with the ICO is a criminal offence and can result in a fixed penalty notice of up to £4,000. Reputational damage and client losses are often the bigger practical risk.",
                },
                {
                  q: 'Do I need a privacy policy as a sole trader?',
                  a: "Yes. If you collect personal data from clients, website visitors, or anyone else, you must provide a privacy notice explaining what data you collect, why, how long you keep it, and what rights the individual has. This is a legal requirement under UK GDPR Articles 13 and 14.",
                },
                {
                  q: 'What is a lawful basis for processing personal data?',
                  a: "Under UK GDPR, you must have a valid lawful basis for every type of personal data you process. The six lawful bases are: consent, contract, legal obligation, vital interests, public task, and legitimate interests. For most sole traders, the most relevant are contract (processing to deliver your services), legitimate interests (processing for genuine business purposes), and legal obligation (HMRC record-keeping).",
                },
                {
                  q: 'How long can I keep client data?',
                  a: "UK GDPR requires you to keep personal data only as long as necessary for the purpose it was collected. For financial records, HMRC requires at least 5 years after the Self Assessment deadline for the relevant year. You should define and document specific retention periods for each category of data in your privacy policy.",
                },
              ].map((item, i) => (
                <div key={i} className="border-b border-gray-200 pb-7">
                  <h3 className="font-semibold text-[#1a1a2e] text-lg mb-3">{item.q}</h3>
                  <p className="text-[#5a5a7a] leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <Link
                href="/faq"
                className="text-[#2C68C4] hover:text-[#1B3F7A] font-medium"
              >
                See more answers on our FAQ page →
              </Link>
            </div>
          </section>

          {/* Conclusion / Final CTA */}
          <section className="scroll-mt-8">
            <h2 className="font-bold text-[#1a1a2e] text-3xl mb-5">
              Next steps: getting GDPR-compliant
            </h2>
            <p className="text-[#3a3a5a] leading-relaxed mb-4 text-lg">
              UK GDPR compliance as a sole trader is not as daunting as it might seem. Most of what is required is common sense — only collect data you need, keep it secure, be transparent about how you use it, and respect people&apos;s rights over their information.
            </p>
            <p className="text-[#3a3a5a] leading-relaxed mb-4 text-lg">
              The practical steps are clear: register with the ICO (£40/year), create a compliant privacy policy, identify your lawful bases, and put basic security measures in place. Done once and maintained properly, GDPR compliance becomes a natural part of how you run your business — not an ongoing burden.
            </p>
            <p className="text-[#3a3a5a] leading-relaxed mb-8 text-lg">
              The bigger risk is doing nothing. As clients — especially corporate clients — increasingly scrutinise the data protection practices of the freelancers and suppliers they work with, being able to demonstrate compliance is a genuine competitive advantage.
            </p>

            <div
              className="rounded-2xl p-8 text-white text-center"
              style={{ background: 'linear-gradient(135deg, #1B3F7A 0%, #2C68C4 100%)' }}
            >
              <h3 className="font-bold text-2xl mb-3">
                Let Foundationary handle your GDPR privacy policy
              </h3>
              <p className="text-white/85 mb-6 text-lg max-w-[560px] mx-auto">
                A bespoke, UK GDPR-compliant privacy policy tailored to your sole trader business — included in every Foundationary package alongside 9 other essential business documents. Delivered in 24 hours.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link
                  href="/whats-included"
                  className="font-semibold text-[#1B3F7A] bg-white rounded-lg hover:bg-[#F0F4FF] transition-colors px-7 py-3.5"
                >
                  See What&apos;s Included →
                </Link>
                <Link
                  href="/pricing"
                  className="font-semibold text-white border-2 border-white/60 rounded-lg hover:bg-white/10 transition-colors px-7 py-3.5"
                >
                  View Pricing
                </Link>
              </div>
              <p className="text-white/60 text-sm mt-4">7-day money-back guarantee. UK-compliant.</p>
            </div>
          </section>
        </div>
      </article>

      {/* Share + Author */}
      <section className="bg-[#F8FAFE] py-12 px-6 border-t border-gray-200">
        <div className="max-w-[860px] mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <p className="text-sm text-[#5a5a7a] mb-1">Written by</p>
              <p className="font-bold text-[#1a1a2e] text-lg">Foundationary</p>
              <p className="text-sm text-[#5a5a7a]">
                Business document specialists for UK sole traders and freelancers.
              </p>
            </div>
            <div className="flex gap-3">
              <a
                href="https://www.linkedin.com/sharing/share-offsite/?url=https://foundationary.vercel.app/blog/gdpr-compliance-sole-traders-uk"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-[#1B3F7A] bg-white border border-[#D0D9F2] rounded-lg px-4 py-2 hover:bg-[#F0F4FF] transition-colors"
              >
                Share on LinkedIn
              </a>
              <a
                href="https://twitter.com/intent/tweet?url=https://foundationary.vercel.app/blog/gdpr-compliance-sole-traders-uk&text=GDPR+Compliance+for+UK+Sole+Traders%3A+Complete+2026+Guide"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-[#1B3F7A] bg-white border border-[#D0D9F2] rounded-lg px-4 py-2 hover:bg-[#F0F4FF] transition-colors"
              >
                Share on X
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Related Articles */}
      <section className="bg-white py-16 px-6">
        <div className="max-w-[860px] mx-auto">
          <h2 className="font-bold text-[#1a1a2e] text-2xl mb-7">Related guides</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            <Link
              href="/blog/sole-trader-business-setup-guide-uk"
              className="group bg-[#F8FAFE] rounded-xl p-6 border border-gray-200 hover:border-[#2C68C4] transition-colors"
            >
              <span className="text-xs font-semibold text-[#2C68C4] uppercase tracking-wide">Operations</span>
              <h3 className="font-semibold text-[#1a1a2e] mt-2 mb-1 group-hover:text-[#2C68C4] transition-colors">
                Complete Guide to Setting Up a Sole Trader Business in the UK (2026)
              </h3>
              <p className="text-sm text-[#5a5a7a]">
                Everything from HMRC registration to insurance, banking, and essential legal documents.
              </p>
            </Link>
            <Link
              href="/blog/client-contract-essentials-uk-freelancers"
              className="group bg-[#F8FAFE] rounded-xl p-6 border border-gray-200 hover:border-[#2C68C4] transition-colors"
            >
              <span className="text-xs font-semibold text-[#2C68C4] uppercase tracking-wide">Legal</span>
              <h3 className="font-semibold text-[#1a1a2e] mt-2 mb-1 group-hover:text-[#2C68C4] transition-colors">
                What Every UK Freelancer Needs in Their Client Contract
              </h3>
              <p className="text-sm text-[#5a5a7a]">
                Essential clauses for payment terms, IP rights, termination, and dispute resolution.
              </p>
            </Link>
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/blog"
              className="inline-block font-semibold text-[#2C68C4] hover:text-[#1B3F7A] transition-colors"
            >
              ← Back to all guides
            </Link>
          </div>
        </div>
      </section>

      {/* Internal Links */}
      <section className="bg-[#F0F4FF] py-12 px-6">
        <div className="max-w-[860px] mx-auto text-center">
          <nav className="flex flex-wrap justify-center gap-6">
            <Link href="/whats-included" className="text-[#2C68C4] hover:text-[#1B3F7A] font-medium">
              What&apos;s Included →
            </Link>
            <Link href="/pricing" className="text-[#2C68C4] hover:text-[#1B3F7A] font-medium">
              Pricing →
            </Link>
            <Link href="/faq" className="text-[#2C68C4] hover:text-[#1B3F7A] font-medium">
              FAQs →
            </Link>
            <Link href="/how-it-works" className="text-[#2C68C4] hover:text-[#1B3F7A] font-medium">
              How It Works →
            </Link>
            <Link href="/blog" className="text-[#2C68C4] hover:text-[#1B3F7A] font-medium">
              Blog →
            </Link>
          </nav>
        </div>
      </section>
    </>
  );
}
