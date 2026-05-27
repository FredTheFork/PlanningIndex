import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Complete Guide to Setting Up a Sole Trader Business in the UK (2026)',
  description:
    'Step-by-step guide to starting as a sole trader in the UK. Learn registration, tax requirements, legal documents, and best practices for 2026.',
  keywords: [
    'sole trader setup UK',
    'how to start sole trader business',
    'UK sole trader registration',
    'sole trader guide',
    'sole trader HMRC registration',
    'sole trader tax UK',
    'sole trader legal documents',
  ],
  authors: [{ name: 'Foundationary' }],
  openGraph: {
    type: 'article',
    title: 'Complete Guide to Setting Up a Sole Trader Business in the UK (2026)',
    description:
      'Step-by-step guide to starting as a sole trader in the UK. Learn registration, tax requirements, legal documents, and best practices for 2026.',
    url: 'https://foundationary.vercel.app/blog/sole-trader-business-setup-guide-uk',
    images: [{ url: '/og-home.png', width: 1200, height: 630, alt: 'Sole Trader Setup Guide UK 2026' }],
    publishedTime: '2026-05-27',
    authors: ['Foundationary'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Complete Guide to Setting Up a Sole Trader Business in the UK (2026)',
    description: 'Step-by-step guide to starting as a sole trader in the UK for 2026.',
    images: ['/og-home.png'],
  },
  alternates: {
    canonical: 'https://foundationary.vercel.app/blog/sole-trader-business-setup-guide-uk',
  },
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Complete Guide to Setting Up a Sole Trader Business in the UK (2026)',
  description:
    'Step-by-step guide to starting as a sole trader in the UK. Learn registration, tax requirements, legal documents, and best practices for 2026.',
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
    '@id': 'https://foundationary.vercel.app/blog/sole-trader-business-setup-guide-uk',
  },
  keywords: 'sole trader setup UK, how to start sole trader business, UK sole trader registration, sole trader guide',
  articleSection: 'Operations',
  inLanguage: 'en-GB',
  timeRequired: 'PT15M',
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Do I need to register as a sole trader in the UK?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Yes. If you earn more than £1,000 from self-employment in a tax year (the trading allowance), you must register with HMRC for Self Assessment. You should register by 5 October in your second year of trading at the latest, though registering sooner is advisable.",
      },
    },
    {
      '@type': 'Question',
      name: 'How much does it cost to become a sole trader in the UK?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Registering as a sole trader with HMRC is completely free. There is no registration fee. Your main costs will be for business insurance, a business bank account (some are free), and any professional services or tools you need to operate.",
      },
    },
    {
      '@type': 'Question',
      name: 'Do sole traders need to register for VAT?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "You must register for VAT when your taxable turnover exceeds £90,000 in any rolling 12-month period (2026 threshold). You can also register voluntarily below this threshold, which may benefit you if your clients are VAT-registered businesses.",
      },
    },
    {
      '@type': 'Question',
      name: 'What insurance do sole traders need in the UK?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "The insurance you need depends on your work. Professional indemnity insurance is strongly recommended for service-based businesses. If you have clients visit your premises, public liability insurance is advisable. Employers liability insurance is legally required if you hire staff. Some industries also require specific regulatory cover.",
      },
    },
    {
      '@type': 'Question',
      name: 'Do sole traders need a business bank account?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Sole traders are not legally required to have a separate business bank account, but it is strongly recommended for cleaner bookkeeping, simpler tax returns, and a more professional image with clients. Several banks offer free or low-cost business accounts specifically for sole traders.",
      },
    },
  ],
};

export default function SoleTraderGuideArticle() {
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
              Operations
            </span>
          </div>
          <h1 className="font-bold text-white text-3xl md:text-5xl leading-tight mb-5">
            Complete Guide to Setting Up a Sole Trader Business in the UK (2026)
          </h1>
          <p className="text-white/85 text-lg leading-relaxed mb-7 max-w-[720px]">
            Step-by-step guidance on registering, protecting, and running your sole trader business in the UK — from your first HMRC registration to getting your legal documents in order.
          </p>
          <div className="flex flex-wrap items-center gap-5 text-sm text-white/70">
            <span>By <strong className="text-white">Foundationary</strong></span>
            <span>·</span>
            <time dateTime="2026-05-27">27 May 2026</time>
            <span>·</span>
            <span>15 min read</span>
          </div>
        </div>
      </section>

      {/* Share Bar */}
      <div className="bg-[#F0F4FF] border-b border-[#D0D9F2] px-6 py-3">
        <div className="max-w-[860px] mx-auto flex flex-wrap items-center justify-between gap-4">
          <span className="text-[#5a5a7a] text-sm font-medium">Share this guide:</span>
          <div className="flex gap-3">
            <a
              href="https://www.linkedin.com/sharing/share-offsite/?url=https://foundationary.vercel.app/blog/sole-trader-business-setup-guide-uk"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#1B3F7A] bg-white border border-[#D0D9F2] rounded-lg px-4 py-2 hover:bg-[#F0F4FF] transition-colors"
            >
              Share on LinkedIn
            </a>
            <a
              href="https://twitter.com/intent/tweet?url=https://foundationary.vercel.app/blog/sole-trader-business-setup-guide-uk&text=Complete+Guide+to+Setting+Up+a+Sole+Trader+Business+in+the+UK+%282026%29"
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
                ['#intro', 'What is a sole trader?'],
                ['#step-1-hmrc', 'Step 1: Register with HMRC (Self Assessment)'],
                ['#step-2-name', 'Step 2: Choose your business name'],
                ['#step-3-banking', 'Step 3: Set up business banking'],
                ['#step-4-insurance', 'Step 4: Get the right insurance'],
                ['#step-5-documents', 'Step 5: Create essential business documents'],
                ['#step-6-vat', 'Step 6: Register for VAT (if needed)'],
                ['#step-7-tax', 'Step 7: Understand your tax obligations'],
                ['#step-8-accounting', 'Step 8: Set up accounting and bookkeeping'],
                ['#mistakes', 'Common mistakes to avoid'],
                ['#faq', 'Frequently asked questions'],
                ['#conclusion', 'Next steps'],
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

          {/* Introduction */}
          <section id="intro" className="mb-14 scroll-mt-8">
            <h2 className="font-bold text-[#1a1a2e] text-3xl mb-5">
              What is a sole trader?
            </h2>
            <p className="text-[#3a3a5a] leading-relaxed mb-4 text-lg">
              A sole trader is the simplest legal structure for running a business in the UK. You are the business — there is no legal distinction between you as an individual and your trading enterprise. You keep all profits after tax, but you are also personally responsible for any debts or liabilities the business incurs.
            </p>
            <p className="text-[#3a3a5a] leading-relaxed mb-4 text-lg">
              According to HMRC, there are approximately 3.1 million sole traders in the UK — making it the most common business structure. Freelancers, consultants, tradespeople, designers, coaches, and many other service providers operate as sole traders every day.
            </p>
            <p className="text-[#3a3a5a] leading-relaxed mb-5 text-lg">
              The key advantages of sole trader status are simplicity, low cost to set up, and full control over your business decisions. The main disadvantage is unlimited personal liability — if the business owes money, your personal assets could be at risk.
            </p>

            <div className="bg-[#F0F4FF] rounded-xl p-6 mb-4 border-l-4 border-[#2C68C4]">
              <h3 className="font-semibold text-[#1B3F7A] mb-2">Sole Trader vs Limited Company — at a glance</h3>
              <div className="grid sm:grid-cols-2 gap-4 text-sm text-[#3a3a5a]">
                <div>
                  <p className="font-semibold text-[#1B3F7A] mb-1">Sole Trader</p>
                  <ul className="space-y-1">
                    <li>✓ Free to set up</li>
                    <li>✓ Simple admin and tax</li>
                    <li>✓ Keep all profits (after tax)</li>
                    <li>✗ Unlimited personal liability</li>
                    <li>✗ Can appear less formal to larger clients</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-[#1B3F7A] mb-1">Limited Company</p>
                  <ul className="space-y-1">
                    <li>✓ Limited personal liability</li>
                    <li>✓ Can be more tax-efficient at higher incomes</li>
                    <li>✓ Often preferred by corporate clients</li>
                    <li>✗ More admin and filing obligations</li>
                    <li>✗ Costs to set up and maintain</li>
                  </ul>
                </div>
              </div>
            </div>
            <p className="text-[#5a5a7a] text-sm italic">
              For most people starting out, sole trader status is the right choice. You can always convert to a limited company later as your income grows.
            </p>
          </section>

          {/* Step 1 */}
          <section id="step-1-hmrc" className="mb-14 scroll-mt-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="flex-shrink-0 w-10 h-10 bg-[#1B3F7A] text-white rounded-full flex items-center justify-center font-bold text-lg">
                1
              </span>
              <h2 className="font-bold text-[#1a1a2e] text-3xl">
                Register with HMRC (Self Assessment)
              </h2>
            </div>
            <p className="text-[#3a3a5a] leading-relaxed mb-4 text-lg">
              Your first official step is to register with HMRC as self-employed. This is how you tell HMRC you are trading and need to complete a Self Assessment tax return each year. Registration is free and can be done online through the HMRC website.
            </p>

            <h3 className="font-semibold text-[#1B3F7A] text-xl mb-3">When to register</h3>
            <p className="text-[#3a3a5a] leading-relaxed mb-4">
              You must register by <strong>5 October in your second year of trading</strong>. For example, if you started trading in June 2025, you must register no later than 5 October 2026. However, registering as soon as you start trading is strongly recommended — it avoids penalties and ensures you are paying National Insurance from the outset.
            </p>
            <div className="bg-[#FFF9E6] border border-[#F5C842] rounded-lg p-4 mb-5">
              <p className="text-[#7A5900] text-sm font-medium">
                Important: If your self-employment income is less than £1,000 in a tax year, you may be covered by the trading allowance and not required to register. However, you should still check your situation with HMRC if you are unsure.
              </p>
            </div>

            <h3 className="font-semibold text-[#1B3F7A] text-xl mb-3">How to register</h3>
            <ol className="list-decimal list-inside space-y-3 text-[#3a3a5a] mb-5">
              <li>Go to the HMRC website and create a Government Gateway account (or log in to your existing one)</li>
              <li>Select &quot;Register for Self Assessment&quot;</li>
              <li>Choose &quot;I am self-employed or a sole trader&quot;</li>
              <li>Provide your personal details, National Insurance number, and information about your business</li>
              <li>HMRC will send your Unique Taxpayer Reference (UTR) number by post within 10 working days</li>
            </ol>

            <h3 className="font-semibold text-[#1B3F7A] text-xl mb-3">National Insurance for sole traders</h3>
            <p className="text-[#3a3a5a] leading-relaxed mb-3">
              As a sole trader, you pay two classes of National Insurance:
            </p>
            <ul className="space-y-3 mb-5">
              <li className="flex items-start gap-3 text-[#3a3a5a]">
                <span className="text-[#2C68C4] mt-1 flex-shrink-0">✓</span>
                <span><strong>Class 2 NIC:</strong> A flat rate charge if your profits exceed the Small Profits Threshold (£6,845 for 2025/26). This counts towards your State Pension.</span>
              </li>
              <li className="flex items-start gap-3 text-[#3a3a5a]">
                <span className="text-[#2C68C4] mt-1 flex-shrink-0">✓</span>
                <span><strong>Class 4 NIC:</strong> 6% on profits between £12,570 and £50,270, plus 2% on profits above £50,270 (2025/26 rates).</span>
              </li>
            </ul>
            <p className="text-[#5a5a7a] text-sm">
              Both are paid through your Self Assessment tax return. You do not pay NIC on top of your employment income separately — it is calculated as part of your annual return.
            </p>
          </section>

          {/* Step 2 */}
          <section id="step-2-name" className="mb-14 scroll-mt-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="flex-shrink-0 w-10 h-10 bg-[#1B3F7A] text-white rounded-full flex items-center justify-center font-bold text-lg">
                2
              </span>
              <h2 className="font-bold text-[#1a1a2e] text-3xl">
                Choose your business name
              </h2>
            </div>
            <p className="text-[#3a3a5a] leading-relaxed mb-4 text-lg">
              As a sole trader, you can trade under your own name or choose a business name (also called a trading name). There is no requirement to register a business name — unlike limited companies, you do not need to file anything with Companies House.
            </p>

            <h3 className="font-semibold text-[#1B3F7A] text-xl mb-3">Rules for sole trader business names</h3>
            <p className="text-[#3a3a5a] leading-relaxed mb-3">
              There are some restrictions on what you can call your business:
            </p>
            <ul className="space-y-2 mb-5 text-[#3a3a5a]">
              <li className="flex items-start gap-3">
                <span className="text-red-500 mt-1 flex-shrink-0">✗</span>
                <span>You cannot use &quot;Limited&quot;, &quot;Ltd&quot;, &quot;LLP&quot;, or &quot;PLC&quot; in your name — these are reserved for registered companies</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500 mt-1 flex-shrink-0">✗</span>
                <span>You cannot use a name that implies a connection to government or local authorities</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500 mt-1 flex-shrink-0">✗</span>
                <span>You cannot use names that are offensive or misleading</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#2C68C4] mt-1 flex-shrink-0">✓</span>
                <span>You must display your legal name (your full name) on all business documents, invoices, and correspondence if you trade under a different name</span>
              </li>
            </ul>

            <h3 className="font-semibold text-[#1B3F7A] text-xl mb-3">Checking your business name is available</h3>
            <p className="text-[#3a3a5a] leading-relaxed mb-4">
              Before settling on a name, check:
            </p>
            <ul className="space-y-2 mb-4 text-[#3a3a5a]">
              <li className="flex items-start gap-3">
                <span className="text-[#2C68C4] mt-1 flex-shrink-0">✓</span>
                <span>The Intellectual Property Office trademark register — to avoid infringing existing trademarks</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#2C68C4] mt-1 flex-shrink-0">✓</span>
                <span>Companies House search — to check no limited company is already using a very similar name</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#2C68C4] mt-1 flex-shrink-0">✓</span>
                <span>Domain name availability (GoDaddy, Namecheap, or similar) — your online presence matters</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#2C68C4] mt-1 flex-shrink-0">✓</span>
                <span>Social media handles — consistency across platforms helps clients find you</span>
              </li>
            </ul>
          </section>

          {/* Step 3 */}
          <section id="step-3-banking" className="mb-14 scroll-mt-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="flex-shrink-0 w-10 h-10 bg-[#1B3F7A] text-white rounded-full flex items-center justify-center font-bold text-lg">
                3
              </span>
              <h2 className="font-bold text-[#1a1a2e] text-3xl">
                Set up business banking
              </h2>
            </div>
            <p className="text-[#3a3a5a] leading-relaxed mb-4 text-lg">
              Sole traders are not legally required to have a separate business bank account, but it is one of the most important practical steps you can take. Mixing personal and business finances is a bookkeeping nightmare — and will make your Self Assessment significantly more complicated.
            </p>

            <h3 className="font-semibold text-[#1B3F7A] text-xl mb-3">Why a separate account matters</h3>
            <ul className="space-y-2 mb-5 text-[#3a3a5a]">
              <li className="flex items-start gap-3">
                <span className="text-[#2C68C4] mt-1 flex-shrink-0">✓</span>
                <span>Clean separation between personal and business transactions</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#2C68C4] mt-1 flex-shrink-0">✓</span>
                <span>Much easier to calculate your income, expenses, and profit at year end</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#2C68C4] mt-1 flex-shrink-0">✓</span>
                <span>Looks more professional to clients who pay by bank transfer</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#2C68C4] mt-1 flex-shrink-0">✓</span>
                <span>Makes HMRC enquiries much simpler to respond to</span>
              </li>
            </ul>

            <h3 className="font-semibold text-[#1B3F7A] text-xl mb-3">Business account options for sole traders</h3>
            <div className="grid sm:grid-cols-2 gap-4 mb-5">
              <div className="bg-[#F8FAFE] rounded-lg p-4">
                <p className="font-semibold text-[#1B3F7A] mb-2">Free / Low-Cost Options</p>
                <ul className="text-sm text-[#3a3a5a] space-y-1">
                  <li>Starling Bank (free, app-based)</li>
                  <li>Monzo Business (free tier available)</li>
                  <li>Tide (free basic account)</li>
                  <li>Revolut Business (free starter)</li>
                </ul>
              </div>
              <div className="bg-[#F8FAFE] rounded-lg p-4">
                <p className="font-semibold text-[#1B3F7A] mb-2">Traditional Banks</p>
                <ul className="text-sm text-[#3a3a5a] space-y-1">
                  <li>HSBC Kinetic (sole traders)</li>
                  <li>Barclays Business Account</li>
                  <li>Lloyds Business Account</li>
                  <li>NatWest Business Banking</li>
                </ul>
              </div>
            </div>
            <p className="text-[#5a5a7a] text-sm">
              For most new sole traders, a free digital bank account (Starling or Monzo) offers excellent features with no monthly fee. Many integrate directly with accounting software.
            </p>
          </section>

          {/* Step 4 */}
          <section id="step-4-insurance" className="mb-14 scroll-mt-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="flex-shrink-0 w-10 h-10 bg-[#1B3F7A] text-white rounded-full flex items-center justify-center font-bold text-lg">
                4
              </span>
              <h2 className="font-bold text-[#1a1a2e] text-3xl">
                Get the right insurance
              </h2>
            </div>
            <p className="text-[#3a3a5a] leading-relaxed mb-4 text-lg">
              As a sole trader, you have unlimited personal liability — meaning if a client sues you, they are suing you personally. The right insurance protects your personal finances from business risks.
            </p>

            <h3 className="font-semibold text-[#1B3F7A] text-xl mb-3">Key types of insurance for sole traders</h3>
            <div className="space-y-4 mb-6">
              <div className="border border-gray-200 rounded-lg p-5">
                <h4 className="font-semibold text-[#1B3F7A] mb-2">
                  Professional Indemnity Insurance
                  <span className="ml-2 text-xs font-normal text-white bg-[#2C68C4] rounded px-2 py-0.5">Recommended for most</span>
                </h4>
                <p className="text-[#3a3a5a] text-sm leading-relaxed">
                  Covers you if a client claims your advice, designs, or services caused them financial loss. Essential for consultants, designers, accountants, coaches, writers, and most knowledge-based businesses. Typical costs: £100–£400/year depending on turnover and sector.
                </p>
              </div>
              <div className="border border-gray-200 rounded-lg p-5">
                <h4 className="font-semibold text-[#1B3F7A] mb-2">Public Liability Insurance</h4>
                <p className="text-[#3a3a5a] text-sm leading-relaxed">
                  Covers claims from third parties for injury or property damage caused by your business activities. Important if you work at client sites, attend events, or have people visit your workspace. Often bundled with professional indemnity.
                </p>
              </div>
              <div className="border border-gray-200 rounded-lg p-5">
                <h4 className="font-semibold text-[#1B3F7A] mb-2">
                  Employers Liability Insurance
                  <span className="ml-2 text-xs font-normal text-white bg-red-500 rounded px-2 py-0.5">Legally required if you employ staff</span>
                </h4>
                <p className="text-[#3a3a5a] text-sm leading-relaxed">
                  Required by law if you employ anyone — even temporary or part-time workers. Not relevant if you work alone. The minimum required cover is £5 million.
                </p>
              </div>
              <div className="border border-gray-200 rounded-lg p-5">
                <h4 className="font-semibold text-[#1B3F7A] mb-2">Income Protection Insurance</h4>
                <p className="text-[#3a3a5a] text-sm leading-relaxed">
                  Unlike employees, sole traders have no statutory sick pay. Income protection insurance pays a percentage of your income if you are unable to work due to illness or injury. Worth considering if your household relies on your sole trader income.
                </p>
              </div>
            </div>

            <div className="bg-[#F0F4FF] rounded-xl p-5 border-l-4 border-[#2C68C4]">
              <p className="text-[#3a3a5a] text-sm">
                <strong className="text-[#1B3F7A]">Tip:</strong> Many professional bodies (such as those for accountants, designers, or IT professionals) offer group insurance rates to members, which can be significantly cheaper than going direct. Always compare like-for-like cover levels, not just premium prices.
              </p>
            </div>
          </section>

          {/* Step 5 */}
          <section id="step-5-documents" className="mb-14 scroll-mt-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="flex-shrink-0 w-10 h-10 bg-[#1B3F7A] text-white rounded-full flex items-center justify-center font-bold text-lg">
                5
              </span>
              <h2 className="font-bold text-[#1a1a2e] text-3xl">
                Create essential business documents
              </h2>
            </div>
            <p className="text-[#3a3a5a] leading-relaxed mb-4 text-lg">
              This is the step most sole traders skip — and it is often the most costly mistake they make. Without the right documents in place before you take on your first client, you are operating with no legal protection and no clear terms of engagement.
            </p>

            <h3 className="font-semibold text-[#1B3F7A] text-xl mb-3">The documents every sole trader needs</h3>

            <div className="space-y-5 mb-7">
              <div className="bg-[#F8FAFE] rounded-xl p-6">
                <h4 className="font-bold text-[#1a1a2e] text-lg mb-2">
                  1. Client Contract / Service Agreement
                </h4>
                <p className="text-[#3a3a5a] text-sm leading-relaxed mb-3">
                  Your contract is the foundation of every client relationship. It defines the scope of work, payment terms, deliverables, intellectual property rights, and what happens if things go wrong. Without one, you are relying on verbal agreements — which are almost impossible to enforce.
                </p>
                <p className="text-[#5a5a7a] text-sm italic">
                  A good client contract covers: scope of services, payment schedule, IP ownership, limitation of liability, cancellation terms, and dispute resolution.
                </p>
              </div>

              <div className="bg-[#F8FAFE] rounded-xl p-6">
                <h4 className="font-bold text-[#1a1a2e] text-lg mb-2">
                  2. Terms &amp; Conditions
                </h4>
                <p className="text-[#3a3a5a] text-sm leading-relaxed mb-3">
                  Your T&amp;Cs are your operating rulebook — they set out how you work, what clients can expect, and what happens if they do not pay. Key clauses include payment terms, late payment interest (UK law entitles you to 8% above the Bank of England base rate), refund policy, and client obligations.
                </p>
                <p className="text-[#5a5a7a] text-sm italic">
                  Late payment is one of the biggest problems for sole traders. Having clear T&amp;Cs means you can enforce late payment charges without awkward conversations.
                </p>
              </div>

              <div className="bg-[#F8FAFE] rounded-xl p-6">
                <h4 className="font-bold text-[#1a1a2e] text-lg mb-2">
                  3. GDPR Privacy Policy
                  <span className="ml-2 text-xs font-normal text-white bg-red-500 rounded px-2 py-0.5">Legally required</span>
                </h4>
                <p className="text-[#3a3a5a] text-sm leading-relaxed mb-3">
                  GDPR applies to you the moment you collect someone&apos;s email address, keep a client database, or use contact information to follow up with leads. As a sole trader, you are considered a Data Controller under UK GDPR and must have a privacy policy that explains how you collect, use, store, and protect personal data.
                </p>
                <p className="text-[#5a5a7a] text-sm italic">
                  Failure to have a compliant privacy policy can result in ICO fines. Generic templates found online often miss crucial details specific to your business activities.
                </p>
              </div>

              <div className="bg-[#F8FAFE] rounded-xl p-6">
                <h4 className="font-bold text-[#1a1a2e] text-lg mb-2">
                  4. Professional Invoice Template
                </h4>
                <p className="text-[#3a3a5a] text-sm leading-relaxed">
                  Your invoice is often the last impression a client has of you before payment. UK law requires invoices to include your name (and business name if different), your address, invoice number, date, description of services, amount, and payment due date. If VAT registered, you must also include your VAT registration number.
                </p>
              </div>
            </div>

            {/* Internal CTA */}
            <div
              className="rounded-2xl p-7 text-white"
              style={{ background: 'linear-gradient(135deg, #1B3F7A 0%, #2C68C4 100%)' }}
            >
              <h3 className="font-bold text-xl mb-2">
                Get all your documents done for you
              </h3>
              <p className="text-white/85 mb-5 text-sm leading-relaxed">
                Foundationary creates all the legal and business documents you need — tailored to your specific sole trader business, UK-compliant, delivered in 24 hours. That includes a bespoke client contract, T&amp;Cs, GDPR privacy policy, professional invoice template, and more.
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

          {/* Step 6 */}
          <section id="step-6-vat" className="mb-14 scroll-mt-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="flex-shrink-0 w-10 h-10 bg-[#1B3F7A] text-white rounded-full flex items-center justify-center font-bold text-lg">
                6
              </span>
              <h2 className="font-bold text-[#1a1a2e] text-3xl">
                Register for VAT (if needed)
              </h2>
            </div>
            <p className="text-[#3a3a5a] leading-relaxed mb-4 text-lg">
              Value Added Tax (VAT) is charged on most goods and services sold by VAT-registered businesses in the UK. As a sole trader, your relationship with VAT depends on how much you earn.
            </p>

            <h3 className="font-semibold text-[#1B3F7A] text-xl mb-3">The VAT threshold (2026)</h3>
            <div className="bg-[#FFF9E6] border border-[#F5C842] rounded-lg p-5 mb-5">
              <p className="text-[#7A5900] font-medium mb-1">Mandatory VAT registration threshold</p>
              <p className="text-[#7A5900] text-sm">
                If your taxable turnover exceeds <strong>£90,000</strong> in any rolling 12-month period, you must register for VAT with HMRC. You have 30 days to register once you exceed (or expect to exceed) this threshold. Late registration attracts penalties.
              </p>
            </div>

            <h3 className="font-semibold text-[#1B3F7A] text-xl mb-3">Voluntary VAT registration</h3>
            <p className="text-[#3a3a5a] leading-relaxed mb-3">
              You can register for VAT voluntarily even if your turnover is below the threshold. This makes sense if:
            </p>
            <ul className="space-y-2 mb-5 text-[#3a3a5a]">
              <li className="flex items-start gap-3">
                <span className="text-[#2C68C4] mt-1 flex-shrink-0">✓</span>
                <span>Most of your clients are VAT-registered businesses — they can reclaim the VAT you charge, so it is cost-neutral to them and you can reclaim VAT on your business purchases</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#2C68C4] mt-1 flex-shrink-0">✓</span>
                <span>You have significant business expenses with VAT you want to reclaim</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500 mt-1 flex-shrink-0">✗</span>
                <span>Avoid registering voluntarily if most of your clients are consumers (individuals) — they cannot reclaim VAT, so registering effectively increases your prices by 20%</span>
              </li>
            </ul>

            <h3 className="font-semibold text-[#1B3F7A] text-xl mb-3">The Flat Rate Scheme</h3>
            <p className="text-[#3a3a5a] leading-relaxed mb-3">
              If your expected VAT taxable turnover is less than £150,000 per year, you can join HMRC&apos;s Flat Rate Scheme. Instead of calculating VAT on every individual transaction, you pay a fixed percentage of your gross turnover (the rate varies by industry). This simplifies administration significantly.
            </p>
            <p className="text-[#5a5a7a] text-sm">
              Making Tax Digital (MTD) for VAT requires you to keep digital records and submit VAT returns using compatible software if you are VAT-registered. Plan for this from the start.
            </p>
          </section>

          {/* Step 7 */}
          <section id="step-7-tax" className="mb-14 scroll-mt-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="flex-shrink-0 w-10 h-10 bg-[#1B3F7A] text-white rounded-full flex items-center justify-center font-bold text-lg">
                7
              </span>
              <h2 className="font-bold text-[#1a1a2e] text-3xl">
                Understand your tax obligations
              </h2>
            </div>
            <p className="text-[#3a3a5a] leading-relaxed mb-4 text-lg">
              As a sole trader, you are responsible for calculating and paying your own tax. There is no employer doing it for you. Understanding how the system works is critical — surprises at tax time are painful.
            </p>

            <h3 className="font-semibold text-[#1B3F7A] text-xl mb-3">Self Assessment: the basics</h3>
            <p className="text-[#3a3a5a] leading-relaxed mb-3">
              The UK tax year runs from <strong>6 April to 5 April</strong> the following year. You must file a Self Assessment tax return each year by:
            </p>
            <ul className="space-y-2 mb-5 text-[#3a3a5a]">
              <li className="flex items-start gap-3">
                <span className="text-[#2C68C4] mt-1 flex-shrink-0">✓</span>
                <span><strong>31 October</strong> — if filing a paper return</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#2C68C4] mt-1 flex-shrink-0">✓</span>
                <span><strong>31 January</strong> — if filing online (recommended)</span>
              </li>
            </ul>

            <h3 className="font-semibold text-[#1B3F7A] text-xl mb-3">Income Tax rates (2025/26)</h3>
            <div className="overflow-x-auto mb-5">
              <table className="w-full text-sm text-[#3a3a5a] border-collapse">
                <thead>
                  <tr className="bg-[#F0F4FF]">
                    <th className="text-left text-[#1B3F7A] font-semibold p-3 border border-[#D0D9F2]">Band</th>
                    <th className="text-left text-[#1B3F7A] font-semibold p-3 border border-[#D0D9F2]">Taxable Income</th>
                    <th className="text-left text-[#1B3F7A] font-semibold p-3 border border-[#D0D9F2]">Rate</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-3 border border-gray-200">Personal Allowance</td>
                    <td className="p-3 border border-gray-200">Up to £12,570</td>
                    <td className="p-3 border border-gray-200">0%</td>
                  </tr>
                  <tr className="bg-[#F8FAFE]">
                    <td className="p-3 border border-gray-200">Basic Rate</td>
                    <td className="p-3 border border-gray-200">£12,571 – £50,270</td>
                    <td className="p-3 border border-gray-200">20%</td>
                  </tr>
                  <tr>
                    <td className="p-3 border border-gray-200">Higher Rate</td>
                    <td className="p-3 border border-gray-200">£50,271 – £125,140</td>
                    <td className="p-3 border border-gray-200">40%</td>
                  </tr>
                  <tr className="bg-[#F8FAFE]">
                    <td className="p-3 border border-gray-200">Additional Rate</td>
                    <td className="p-3 border border-gray-200">Over £125,140</td>
                    <td className="p-3 border border-gray-200">45%</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-[#5a5a7a] text-sm mb-5">
              Note: Scottish taxpayers pay different rates set by the Scottish Parliament. Tax is calculated on your profit (income minus allowable business expenses), not your gross income.
            </p>

            <h3 className="font-semibold text-[#1B3F7A] text-xl mb-3">Payments on Account</h3>
            <p className="text-[#3a3a5a] leading-relaxed mb-3">
              If your tax bill for the year exceeds £1,000 and less than 80% of your tax is collected at source, HMRC requires you to make Payments on Account — advance payments towards the following year&apos;s tax bill. These are due:
            </p>
            <ul className="space-y-2 mb-5 text-[#3a3a5a]">
              <li className="flex items-start gap-3">
                <span className="text-[#2C68C4] mt-1 flex-shrink-0">✓</span>
                <span><strong>31 January</strong> — first payment (50% of prior year&apos;s bill)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#2C68C4] mt-1 flex-shrink-0">✓</span>
                <span><strong>31 July</strong> — second payment (remaining 50%)</span>
              </li>
            </ul>

            <div className="bg-[#F0F4FF] rounded-xl p-5 border-l-4 border-[#2C68C4]">
              <p className="text-[#3a3a5a] text-sm">
                <strong className="text-[#1B3F7A]">Golden rule:</strong> Set aside 25–30% of every payment you receive into a separate savings account. When your tax bill comes, you will have the money ready. Many sole traders underestimate this and face a painful cash flow crisis in January.
              </p>
            </div>
          </section>

          {/* Step 8 */}
          <section id="step-8-accounting" className="mb-14 scroll-mt-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="flex-shrink-0 w-10 h-10 bg-[#1B3F7A] text-white rounded-full flex items-center justify-center font-bold text-lg">
                8
              </span>
              <h2 className="font-bold text-[#1a1a2e] text-3xl">
                Set up accounting and bookkeeping
              </h2>
            </div>
            <p className="text-[#3a3a5a] leading-relaxed mb-4 text-lg">
              Good bookkeeping is not optional — it is the foundation of understanding whether your business is actually profitable, and it makes tax time far less stressful. HMRC requires you to keep records for at least 5 years after the Self Assessment deadline for the relevant tax year.
            </p>

            <h3 className="font-semibold text-[#1B3F7A] text-xl mb-3">What records to keep</h3>
            <ul className="space-y-2 mb-5 text-[#3a3a5a]">
              <li className="flex items-start gap-3">
                <span className="text-[#2C68C4] mt-1 flex-shrink-0">✓</span>
                <span>All sales invoices and receipts</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#2C68C4] mt-1 flex-shrink-0">✓</span>
                <span>All business purchase receipts and expense records</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#2C68C4] mt-1 flex-shrink-0">✓</span>
                <span>Bank statements (both personal account used for business and business account)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#2C68C4] mt-1 flex-shrink-0">✓</span>
                <span>Mileage records if you claim travel expenses</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#2C68C4] mt-1 flex-shrink-0">✓</span>
                <span>Any grants received</span>
              </li>
            </ul>

            <h3 className="font-semibold text-[#1B3F7A] text-xl mb-3">Accounting software options</h3>
            <div className="grid sm:grid-cols-2 gap-4 mb-5">
              {[
                {
                  name: 'FreeAgent',
                  note: 'Free with some business bank accounts (NatWest, Royal Bank of Scotland, Ulster Bank)',
                },
                {
                  name: 'QuickBooks Self-Employed',
                  note: 'Popular, good mileage tracking and tax estimates',
                },
                {
                  name: 'Xero',
                  note: 'Highly regarded, excellent bank feeds and integrations',
                },
                {
                  name: 'Sage Accounting',
                  note: 'UK-focused, solid Making Tax Digital compliance',
                },
              ].map((tool) => (
                <div key={tool.name} className="bg-[#F8FAFE] rounded-lg p-4">
                  <p className="font-semibold text-[#1B3F7A] mb-1">{tool.name}</p>
                  <p className="text-sm text-[#5a5a7a]">{tool.note}</p>
                </div>
              ))}
            </div>

            <h3 className="font-semibold text-[#1B3F7A] text-xl mb-3">Allowable expenses</h3>
            <p className="text-[#3a3a5a] leading-relaxed mb-3">
              You can deduct &quot;wholly and exclusively&quot; business expenses from your income to reduce your tax bill. Common allowable expenses for sole traders include:
            </p>
            <div className="grid sm:grid-cols-2 gap-3 mb-5 text-sm text-[#3a3a5a]">
              {[
                'Office supplies and stationery',
                'Business phone and broadband',
                'Professional subscriptions and memberships',
                'Software and tools used for work',
                'Marketing and advertising costs',
                'Business travel (not commuting)',
                'Accountant and professional fees',
                'Bank charges and merchant fees',
                'Equipment and technology',
                'Use of home as office (simplified or actual)',
                'Training and professional development',
                'Business insurance premiums',
              ].map((expense) => (
                <div key={expense} className="flex items-start gap-2">
                  <span className="text-[#2C68C4] mt-0.5 flex-shrink-0">✓</span>
                  <span>{expense}</span>
                </div>
              ))}
            </div>

            <div className="bg-[#FFF9E6] border border-[#F5C842] rounded-lg p-4">
              <p className="text-[#7A5900] text-sm">
                <strong>Making Tax Digital (MTD) for Income Tax:</strong> From April 2026, sole traders and landlords with income over £50,000 must use MTD-compatible software for their tax returns. Those earning over £30,000 will follow in April 2027. Start using compliant software now to be prepared.
              </p>
            </div>
          </section>

          {/* Mistakes */}
          <section id="mistakes" className="mb-14 scroll-mt-8">
            <h2 className="font-bold text-[#1a1a2e] text-3xl mb-5">
              Common mistakes to avoid
            </h2>
            <p className="text-[#3a3a5a] leading-relaxed mb-6 text-lg">
              These are the errors we see most often among new sole traders — and the ones most likely to cost you time, money, or clients.
            </p>

            <div className="space-y-4">
              {[
                {
                  num: '01',
                  title: 'Starting work without a contract',
                  body: "Taking on clients without a signed contract is the single most common and most costly mistake. When disputes arise over payment, scope, or deliverables, verbal agreements are almost impossible to enforce. Even a simple, clearly-written contract protects both parties.",
                },
                {
                  num: '02',
                  title: 'Registering too late with HMRC',
                  body: "Many new sole traders delay registering because they think they need to be earning a certain amount first, or they feel uncertain whether they are really 'official'. Register as soon as you start trading — penalties for late registration can be significant, and the process is straightforward.",
                },
                {
                  num: '03',
                  title: 'Not setting aside money for tax',
                  body: "Unlike employees, tax is not automatically deducted from your income. Set aside 25–30% of every payment you receive. A separate savings pot labelled 'tax' is not optional — treat it as money that is not yours.",
                },
                {
                  num: '04',
                  title: 'Mixing personal and business finances',
                  body: "Using your personal bank account for business transactions creates a bookkeeping nightmare and makes it very difficult to calculate your actual profit. Open a dedicated business account, even if it is a free one.",
                },
                {
                  num: '05',
                  title: 'Ignoring GDPR as a sole trader',
                  body: "Many sole traders wrongly believe GDPR only applies to large companies. It applies to you the moment you hold personal data — even a simple email list. Make sure you have a compliant privacy policy and understand your obligations as a data controller.",
                },
                {
                  num: '06',
                  title: 'Not having professional indemnity insurance',
                  body: "Operating without the right insurance exposes your personal assets to business liability. A single client claiming your work caused them financial loss could be devastating without cover. Insurance is a business expense, not a luxury.",
                },
                {
                  num: '07',
                  title: 'Underpricing your services',
                  body: "As a sole trader you pay for your own holiday, sick pay, pension, tools, insurance, and professional development — none of which an employer covers. Factor these into your day rate or project fees. Pricing too low is a race to exhaustion.",
                },
                {
                  num: '08',
                  title: 'Missing the Self Assessment deadline',
                  body: "Late filing carries an automatic £100 penalty, even if you owe no tax. Daily penalties apply after three months. Set a reminder for 31 January every year — and ideally complete your return well before then.",
                },
              ].map((item) => (
                <div key={item.num} className="flex items-start gap-5 border-b border-gray-100 pb-5">
                  <span className="text-[#2C68C4] font-bold text-sm flex-shrink-0 mt-1">{item.num}</span>
                  <div>
                    <h3 className="font-semibold text-[#1a1a2e] mb-1">{item.title}</h3>
                    <p className="text-[#5a5a7a] text-sm leading-relaxed">{item.body}</p>
                  </div>
                </div>
              ))}
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
                  q: 'Do I need to register as a sole trader in the UK?',
                  a: "Yes. If your self-employment income exceeds £1,000 in a tax year (the trading allowance), you must register with HMRC for Self Assessment. Register by 5 October in your second year of trading at the latest — but registering as soon as you start is strongly recommended.",
                },
                {
                  q: 'How much does it cost to become a sole trader in the UK?',
                  a: "Registering as a sole trader with HMRC is completely free. Your main costs will be business insurance, a business bank account (some are free), and any professional services or tools you need to operate. There are no Companies House fees because you do not need to register there.",
                },
                {
                  q: 'Do sole traders need to register for VAT?',
                  a: "You must register for VAT when your taxable turnover exceeds £90,000 in any rolling 12-month period (2026 threshold). You can register voluntarily below this threshold, which benefits businesses whose clients are mainly VAT-registered.",
                },
                {
                  q: 'What insurance do sole traders need in the UK?',
                  a: "The insurance you need depends on your work. Professional indemnity is strongly recommended for most service-based sole traders. Public liability insurance is important if clients visit your premises or you work at theirs. Employers liability insurance is legally required if you hire staff.",
                },
                {
                  q: 'Do sole traders need a business bank account?',
                  a: "You are not legally required to have a separate business account, but it is strongly recommended. Separating your finances makes bookkeeping far simpler, tax returns cleaner, and presents a more professional image to clients.",
                },
                {
                  q: 'Can a sole trader have employees?',
                  a: "Yes. Being a sole trader refers to your legal structure, not whether you work alone. You can hire employees as a sole trader, but you must register as an employer with HMRC, set up PAYE, and obtain employers liability insurance (legally required).",
                },
                {
                  q: 'What is the difference between a sole trader and self-employed?',
                  a: "'Self-employed' and 'sole trader' are often used interchangeably, and in most contexts they mean the same thing. Technically, 'self-employed' describes your employment status (you work for yourself), while 'sole trader' describes your legal business structure. All sole traders are self-employed, but some self-employed people operate through limited companies or partnerships.",
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

          {/* Conclusion */}
          <section id="conclusion" className="scroll-mt-8">
            <h2 className="font-bold text-[#1a1a2e] text-3xl mb-5">
              Next steps: Getting your business properly set up
            </h2>
            <p className="text-[#3a3a5a] leading-relaxed mb-4 text-lg">
              Setting up as a sole trader in the UK is genuinely straightforward — but the difference between doing it properly and doing it halfway will define your experience as a business owner. Register with HMRC, separate your finances, get the right insurance, and put your legal documents in place before you take on your first client.
            </p>
            <p className="text-[#3a3a5a] leading-relaxed mb-4 text-lg">
              The steps that most sole traders skip — proper contracts, GDPR-compliant policies, clear T&amp;Cs — are precisely the ones that protect you when things do not go to plan. And in business, things occasionally do not go to plan.
            </p>
            <p className="text-[#3a3a5a] leading-relaxed mb-8 text-lg">
              Starting right is not about being overly cautious or litigious. It is about setting professional expectations from the start — with your clients, with HMRC, and with yourself.
            </p>

            {/* Final CTA */}
            <div
              className="rounded-2xl p-8 text-white text-center"
              style={{ background: 'linear-gradient(135deg, #1B3F7A 0%, #2C68C4 100%)' }}
            >
              <h3 className="font-bold text-2xl mb-3">
                Let Foundationary sort your business documents
              </h3>
              <p className="text-white/85 mb-6 text-lg max-w-[560px] mx-auto">
                10 professional documents — contracts, T&amp;Cs, GDPR policy, invoices, and more — tailored to your sole trader business and delivered in 24 hours. One payment. Done for you.
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
                href="https://www.linkedin.com/sharing/share-offsite/?url=https://foundationary.vercel.app/blog/sole-trader-business-setup-guide-uk"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-[#1B3F7A] bg-white border border-[#D0D9F2] rounded-lg px-4 py-2 hover:bg-[#F0F4FF] transition-colors"
              >
                Share on LinkedIn
              </a>
              <a
                href="https://twitter.com/intent/tweet?url=https://foundationary.vercel.app/blog/sole-trader-business-setup-guide-uk&text=Complete+Guide+to+Setting+Up+a+Sole+Trader+Business+in+the+UK+%282026%29"
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
            {/* Placeholder related articles */}
            <div className="bg-[#F8FAFE] rounded-xl p-6 border border-gray-200">
              <span className="text-xs font-semibold text-[#2C68C4] uppercase tracking-wide">Coming soon</span>
              <h3 className="font-semibold text-[#1a1a2e] mt-2 mb-1">
                How to Price Your Services as a UK Sole Trader
              </h3>
              <p className="text-sm text-[#5a5a7a]">
                Day rate calculations, project pricing, and how to stop undercharging.
              </p>
            </div>
            <div className="bg-[#F8FAFE] rounded-xl p-6 border border-gray-200">
              <span className="text-xs font-semibold text-[#2C68C4] uppercase tracking-wide">Coming soon</span>
              <h3 className="font-semibold text-[#1a1a2e] mt-2 mb-1">
                GDPR for Sole Traders: What You Actually Need to Do
              </h3>
              <p className="text-sm text-[#5a5a7a]">
                A plain-English guide to UK GDPR compliance for freelancers and sole traders.
              </p>
            </div>
            <div className="bg-[#F8FAFE] rounded-xl p-6 border border-gray-200">
              <span className="text-xs font-semibold text-[#2C68C4] uppercase tracking-wide">Coming soon</span>
              <h3 className="font-semibold text-[#1a1a2e] mt-2 mb-1">
                Client Contracts Explained: What Every Sole Trader Must Include
              </h3>
              <p className="text-sm text-[#5a5a7a]">
                The essential clauses that protect you when clients don&apos;t pay or scope creeps.
              </p>
            </div>
            <div className="bg-[#F8FAFE] rounded-xl p-6 border border-gray-200">
              <span className="text-xs font-semibold text-[#2C68C4] uppercase tracking-wide">Coming soon</span>
              <h3 className="font-semibold text-[#1a1a2e] mt-2 mb-1">
                Making Tax Digital: What Sole Traders Need to Know in 2026
              </h3>
              <p className="text-sm text-[#5a5a7a]">
                MTD for Income Tax explained — deadlines, software, and what to do now.
              </p>
            </div>
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
