import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'What Every UK Freelancer Needs in Their Client Contract',
  description:
    'Essential clauses every UK freelancer should include in their service agreements - payment terms, IP rights, termination, and dispute resolution.',
  keywords: [
    'freelancer contract UK',
    'service agreement sole trader',
    'client contract terms',
    'freelance agreement template',
    'freelancer legal protection UK',
    'scope of work contract',
    'UK freelance payment terms',
  ],
  authors: [{ name: 'Foundationary' }],
  openGraph: {
    type: 'article',
    title: 'What Every UK Freelancer Needs in Their Client Contract',
    description:
      'Essential clauses every UK freelancer should include in their service agreements - payment terms, IP rights, termination, and dispute resolution.',
    url: 'https://foundationary.vercel.app/blog/client-contract-essentials-uk-freelancers',
    images: [{ url: '/og-home.png', width: 1200, height: 630, alt: 'Client Contract Essentials for UK Freelancers' }],
    publishedTime: '2026-05-27',
    authors: ['Foundationary'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'What Every UK Freelancer Needs in Their Client Contract',
    description: 'Essential contract clauses every UK freelancer should have in their service agreements.',
    images: ['/og-home.png'],
  },
  alternates: {
    canonical: 'https://foundationary.vercel.app/blog/client-contract-essentials-uk-freelancers',
  },
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'What Every UK Freelancer Needs in Their Client Contract',
  description:
    'Essential clauses every UK freelancer should include in their service agreements - payment terms, IP rights, termination, and dispute resolution.',
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
    '@id': 'https://foundationary.vercel.app/blog/client-contract-essentials-uk-freelancers',
  },
  keywords: 'freelancer contract UK, service agreement sole trader, client contract terms, freelance agreement template',
  articleSection: 'Legal',
  inLanguage: 'en-GB',
  timeRequired: 'PT10M',
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Do UK freelancers need a written contract?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "While verbal contracts are technically enforceable in the UK, they are extremely difficult to prove and enforce in practice. A written contract protects both you and your client by setting clear expectations, reducing misunderstandings, and providing an enforceable document if a dispute arises. Every UK freelancer should use written contracts for every engagement.",
      },
    },
    {
      '@type': 'Question',
      name: 'Who owns intellectual property created by a freelancer?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Under UK law, the default position for freelancers (as independent contractors, not employees) is that you own the intellectual property you create — unless your contract assigns it to the client. This is the opposite of the employment situation, where employers typically own IP created in the course of employment. Your contract must explicitly address IP assignment if you wish to transfer ownership to your client upon payment.",
      },
    },
    {
      '@type': 'Question',
      name: 'How long should freelancer payment terms be?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Standard payment terms for UK freelancers are typically 14 to 30 days from invoice date. The UK Late Payment of Commercial Debts (Interest) Act 1998 provides a statutory right to charge 8% above the Bank of England base rate on overdue invoices between businesses, plus compensation of £40-£100 per invoice depending on the amount. Your contract should specify your payment terms, invoice date, late payment interest, and the compensation you will charge on overdue invoices.",
      },
    },
    {
      '@type': 'Question',
      name: 'What should a freelancer do if a client does not pay?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "First, send a formal overdue payment reminder referencing your contract terms. If payment is still not received, you can issue a formal Letter Before Action (LBA) stating your intention to pursue the debt through the courts. For debts under £10,000, the UK Small Claims Court (Money Claim Online) is a cost-effective route. Having a written contract with clear payment terms is essential for this process — it is your evidence.",
      },
    },
    {
      '@type': 'Question',
      name: 'What is a limitation of liability clause?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "A limitation of liability clause caps the amount of compensation you could be required to pay if your work causes loss to the client. Without one, your liability could theoretically be unlimited — meaning a client could claim consequential losses far exceeding your fee. Most freelancer contracts limit liability to the total fees paid for the specific project, or to the value of your professional indemnity insurance cover.",
      },
    },
    {
      '@type': 'Question',
      name: 'Can I use a contract template I found online?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Generic contract templates found online are often inadequate, legally incorrect for UK law, or so vague as to be effectively unenforceable. The specific terms you need depend on your industry, the type of work you do, your payment structure, and how you handle IP and confidentiality. A bespoke contract tailored to your business provides significantly better protection than a generic template.",
      },
    },
  ],
};

export default function ClientContractArticle() {
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
            What Every UK Freelancer Needs in Their Client Contract
          </h1>
          <p className="text-white/85 text-lg leading-relaxed mb-7 max-w-[720px]">
            A well-written client contract is the foundation of every professional freelance relationship. This guide covers every essential clause — from scope and payment terms to intellectual property, confidentiality, and what happens when things go wrong.
          </p>
          <div className="flex flex-wrap items-center gap-5 text-sm text-white/70">
            <span>By <strong className="text-white">Foundationary</strong></span>
            <span>·</span>
            <time dateTime="2026-05-27">27 May 2026</time>
            <span>·</span>
            <span>10 min read</span>
          </div>
        </div>
      </section>

      {/* Share Bar */}
      <div className="bg-[#F0F4FF] border-b border-[#D0D9F2] px-6 py-3">
        <div className="max-w-[860px] mx-auto flex flex-wrap items-center justify-between gap-4">
          <span className="text-[#5a5a7a] text-sm font-medium">Share this guide:</span>
          <div className="flex gap-3">
            <a
              href="https://www.linkedin.com/sharing/share-offsite/?url=https://foundationary.vercel.app/blog/client-contract-essentials-uk-freelancers"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#1B3F7A] bg-white border border-[#D0D9F2] rounded-lg px-4 py-2 hover:bg-[#F0F4FF] transition-colors"
            >
              Share on LinkedIn
            </a>
            <a
              href="https://twitter.com/intent/tweet?url=https://foundationary.vercel.app/blog/client-contract-essentials-uk-freelancers&text=What+Every+UK+Freelancer+Needs+in+Their+Client+Contract"
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
                ['#why-contract', 'Why you need a written contract'],
                ['#scope', 'Essential clause 1: Scope of services'],
                ['#payment', 'Essential clause 2: Payment terms'],
                ['#ip', 'Essential clause 3: Intellectual property'],
                ['#confidentiality', 'Essential clause 4: Confidentiality'],
                ['#termination', 'Essential clause 5: Termination'],
                ['#liability', 'Essential clause 6: Limitation of liability'],
                ['#dispute', 'Essential clause 7: Dispute resolution'],
                ['#mistakes', 'Common mistakes to avoid'],
                ['#template', 'Contract structure: a practical overview'],
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

          {/* Section: Why you need a contract */}
          <section id="why-contract" className="mb-14 scroll-mt-8">
            <h2 className="font-bold text-[#1a1a2e] text-3xl mb-5">
              Why you need a written contract
            </h2>
            <p className="text-[#3a3a5a] leading-relaxed mb-4 text-lg">
              The single most common and costly mistake UK freelancers make is starting work without a signed contract. It happens for understandable reasons — you trust the client, the project feels straightforward, or you do not want to seem overly formal when the relationship is new. But it is a decision that exposes you to serious, preventable risk.
            </p>
            <p className="text-[#3a3a5a] leading-relaxed mb-4 text-lg">
              A written contract is not about distrust — it is about clarity. It protects both you and your client by defining exactly what is being delivered, when payment is due, who owns the work, and what happens if circumstances change. Without it, disputes become genuinely difficult to resolve, because there is no agreed record of what was promised.
            </p>
            <p className="text-[#3a3a5a] leading-relaxed mb-5 text-lg">
              In the UK, verbal contracts are technically enforceable — but only if you can prove the terms were agreed. When a client disputes an invoice, claims the scope was different to what you delivered, or simply stops responding, a verbal agreement gives you almost nothing to stand on legally.
            </p>

            <div className="bg-[#F0F4FF] rounded-xl p-6 mb-5 border-l-4 border-[#2C68C4]">
              <h3 className="font-semibold text-[#1B3F7A] mb-3">What a good client contract achieves</h3>
              <ul className="space-y-2 text-sm text-[#3a3a5a]">
                {[
                  'Sets clear expectations on both sides before any work begins',
                  'Prevents scope creep — the gradual expansion of a project beyond what was agreed and paid for',
                  'Establishes when and how you get paid, and what happens if payment is late',
                  'Determines who owns the intellectual property created during the project',
                  'Provides legal protection and evidence if a dispute arises',
                  'Signals professionalism — clients who work with established businesses expect contracts',
                  'Enables you to enforce your rights under the Late Payment of Commercial Debts Act',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="text-[#2C68C4] mt-0.5 flex-shrink-0">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-[#5a5a7a] text-sm italic">
              A contract need not be lengthy to be effective. A clear, concise service agreement covering the essential clauses outlined in this guide will protect you far better than a verbose document full of legalese that neither party reads properly.
            </p>
          </section>

          {/* Essential Clause 1: Scope */}
          <section id="scope" className="mb-14 scroll-mt-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="flex-shrink-0 w-10 h-10 bg-[#1B3F7A] text-white rounded-full flex items-center justify-center font-bold text-lg">
                1
              </span>
              <h2 className="font-bold text-[#1a1a2e] text-3xl">
                Scope of services
              </h2>
            </div>
            <p className="text-[#3a3a5a] leading-relaxed mb-4 text-lg">
              The scope of services clause is arguably the most important part of any freelance contract. It defines precisely what you are being hired to do — and, just as importantly, what falls outside the agreement. Without a clearly defined scope, you are vulnerable to scope creep: clients requesting additional work without additional payment because it feels like part of the original brief.
            </p>

            <h3 className="font-semibold text-[#1B3F7A] text-xl mb-3">What to include in your scope clause</h3>
            <ul className="space-y-3 mb-5 text-[#3a3a5a]">
              {[
                { label: 'Specific deliverables', desc: 'List exactly what you will produce or deliver — not just a description of the work, but the specific outputs (e.g. "a 5-page website including home, about, services, portfolio, and contact pages" rather than "a website").' },
                { label: 'Number of revisions', desc: 'State how many rounds of revisions or amendments are included. Without this, clients can request unlimited changes as part of the original fee.' },
                { label: 'Client responsibilities', desc: 'What the client needs to provide for you to complete the work — content, access, feedback, approvals. Delays caused by the client failing to provide these should not extend your payment timeline.' },
                { label: 'Exclusions', desc: 'Explicitly list what is NOT included in the project. This prevents assumptions and provides clear grounds for quoting additional work.' },
                { label: 'Timeline and milestones', desc: 'Key dates, delivery milestones, and the project completion date. Also specify that timelines are contingent on timely client feedback.' },
              ].map((item) => (
                <li key={item.label} className="flex items-start gap-4 bg-[#F8FAFE] rounded-lg p-4">
                  <span className="text-[#2C68C4] mt-0.5 flex-shrink-0 font-bold">✓</span>
                  <div>
                    <p className="font-semibold text-[#1a1a2e] text-sm mb-1">{item.label}</p>
                    <p className="text-[#5a5a7a] text-sm">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="bg-[#FFF9E6] border border-[#F5C842] rounded-lg p-4">
              <p className="text-[#7A5900] text-sm font-medium mb-1">Handling scope changes</p>
              <p className="text-[#7A5900] text-sm leading-relaxed">
                Your contract should include a process for requesting additional work outside the original scope — typically a &quot;change request&quot; or &quot;variation order&quot; clause that requires written agreement and additional payment before additional work begins. This is your primary tool for managing scope creep professionally.
              </p>
            </div>
          </section>

          {/* Essential Clause 2: Payment Terms */}
          <section id="payment" className="mb-14 scroll-mt-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="flex-shrink-0 w-10 h-10 bg-[#1B3F7A] text-white rounded-full flex items-center justify-center font-bold text-lg">
                2
              </span>
              <h2 className="font-bold text-[#1a1a2e] text-3xl">
                Payment terms
              </h2>
            </div>
            <p className="text-[#3a3a5a] leading-relaxed mb-4 text-lg">
              Late and non-payment are among the most significant problems facing UK freelancers. A 2023 IPSE (Association of Independent Professionals and the Self-Employed) survey found that 71% of freelancers had experienced late payment, and that the average outstanding debt at any time was over £6,000. Clear, contractual payment terms are your first and most important line of defence.
            </p>

            <h3 className="font-semibold text-[#1B3F7A] text-xl mb-4">What your payment clause must cover</h3>

            <div className="space-y-4 mb-6">
              <div className="border border-gray-200 rounded-lg p-5">
                <h4 className="font-semibold text-[#1B3F7A] mb-2">Fee amount and structure</h4>
                <p className="text-[#3a3a5a] text-sm leading-relaxed">
                  State the total fee clearly — whether it is a fixed project price, an hourly or day rate, or a retainer. If it is a day rate, specify the number of days included. Avoid ambiguity: &quot;approx. £3,000&quot; or &quot;around 10 days at £300/day&quot; leave room for dispute. Be precise.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-5">
                <h4 className="font-semibold text-[#1B3F7A] mb-2">Payment schedule and deposit</h4>
                <p className="text-[#3a3a5a] text-sm leading-relaxed mb-2">
                  For most projects, a deposit (typically 30–50%) paid upfront before work begins is strongly recommended. It confirms the client&apos;s commitment, covers your initial time, and protects you if the project is cancelled early. Structure milestone payments for longer projects rather than invoicing only at completion.
                </p>
                <p className="text-[#5a5a7a] text-xs italic">
                  Common structures: 50% upfront / 50% on delivery. Or: 30% upfront / 40% at midpoint milestone / 30% on completion.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-5">
                <h4 className="font-semibold text-[#1B3F7A] mb-2">Payment due date</h4>
                <p className="text-[#3a3a5a] text-sm leading-relaxed">
                  Standard payment terms for freelancers are typically 14 or 30 days from invoice date. Specify this precisely in your contract and on every invoice. Some clients — particularly larger businesses — will attempt to impose 60 or 90-day payment terms. You are not required to accept these; your contract governs if it was agreed before the engagement began.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-5">
                <h4 className="font-semibold text-[#1B3F7A] mb-2">
                  Late payment interest and compensation
                  <span className="ml-2 text-xs font-normal text-white bg-[#2C68C4] rounded px-2 py-0.5">Your legal right</span>
                </h4>
                <p className="text-[#3a3a5a] text-sm leading-relaxed mb-2">
                  The Late Payment of Commercial Debts (Interest) Act 1998 gives you the statutory right to charge interest on overdue invoices between businesses at 8% above the Bank of England base rate. You are also entitled to claim a fixed sum compensation:
                </p>
                <ul className="space-y-1 text-sm text-[#3a3a5a]">
                  <li className="flex items-center gap-2"><span className="text-[#2C68C4]">£40</span> for debts under £1,000</li>
                  <li className="flex items-center gap-2"><span className="text-[#2C68C4]">£70</span> for debts of £1,000–£9,999</li>
                  <li className="flex items-center gap-2"><span className="text-[#2C68C4]">£100</span> for debts of £10,000 or more</li>
                </ul>
                <p className="text-[#5a5a7a] text-xs mt-2 italic">
                  Reference these rights explicitly in your contract — it signals you know your legal entitlements and makes clients take payment terms seriously.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-5">
                <h4 className="font-semibold text-[#1B3F7A] mb-2">Expenses</h4>
                <p className="text-[#3a3a5a] text-sm leading-relaxed">
                  If you will incur expenses (travel, stock photography, printing, software licences), specify whether these are included in your fee or charged separately. If separate, state whether you will seek prior approval for expenses above a threshold, and how they will be invoiced (at cost, or with a handling fee).
                </p>
              </div>
            </div>

            {/* Internal CTA */}
            <div
              className="rounded-2xl p-7 text-white"
              style={{ background: 'linear-gradient(135deg, #1B3F7A 0%, #2C68C4 100%)' }}
            >
              <h3 className="font-bold text-xl mb-2">
                Get a professionally drafted client contract
              </h3>
              <p className="text-white/85 mb-5 text-sm leading-relaxed">
                Foundationary creates bespoke client contracts for UK sole traders and freelancers — with all the essential clauses covered, legally robust payment terms, and IP provisions tailored to your specific type of work.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/whats-included"
                  className="font-semibold text-[#1B3F7A] bg-white rounded-lg hover:bg-[#F0F4FF] transition-colors px-5 py-2.5 text-sm"
                >
                  See what&apos;s included →
                </Link>
                <Link
                  href="/how-it-works"
                  className="font-semibold text-white border border-white/60 rounded-lg hover:bg-white/10 transition-colors px-5 py-2.5 text-sm"
                >
                  How it works
                </Link>
              </div>
            </div>
          </section>

          {/* Essential Clause 3: Intellectual Property */}
          <section id="ip" className="mb-14 scroll-mt-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="flex-shrink-0 w-10 h-10 bg-[#1B3F7A] text-white rounded-full flex items-center justify-center font-bold text-lg">
                3
              </span>
              <h2 className="font-bold text-[#1a1a2e] text-3xl">
                Intellectual property
              </h2>
            </div>
            <p className="text-[#3a3a5a] leading-relaxed mb-4 text-lg">
              Intellectual property (IP) ownership is one of the most misunderstood — and most disputed — aspects of freelance work. Who owns the designs, code, copy, or other creative output you produce for a client? The answer is not always obvious, and without a clear contractual clause, disputes can become expensive and damaging.
            </p>

            <div className="bg-[#F0F4FF] rounded-xl p-6 mb-6 border-l-4 border-[#2C68C4]">
              <h3 className="font-semibold text-[#1B3F7A] mb-3">The UK default position for freelancers</h3>
              <p className="text-[#3a3a5a] text-sm leading-relaxed">
                Under the Copyright, Designs and Patents Act 1988, when a freelancer (as an independent contractor, not an employee) creates an original work, they are the first owner of the copyright — unless the contract says otherwise. This is the <strong>opposite</strong> of the employment situation, where employers typically own IP created during employment. The practical implication: if your contract is silent on IP, you own the copyright in the work you create, even if the client has paid for it.
              </p>
            </div>

            <h3 className="font-semibold text-[#1B3F7A] text-xl mb-4">IP approaches to consider</h3>

            <div className="space-y-4 mb-6">
              <div className="border border-gray-200 rounded-lg p-5">
                <h4 className="font-semibold text-[#1B3F7A] mb-2">Full IP assignment on payment</h4>
                <p className="text-[#3a3a5a] text-sm leading-relaxed">
                  You transfer all intellectual property rights to the client upon receipt of full payment. This is the most common arrangement for commissioned work. The key condition — &quot;upon receipt of full payment&quot; — is important: it means you retain IP (and can withhold or recall work) if the client does not pay.
                </p>
              </div>
              <div className="border border-gray-200 rounded-lg p-5">
                <h4 className="font-semibold text-[#1B3F7A] mb-2">Licence only (retain ownership)</h4>
                <p className="text-[#3a3a5a] text-sm leading-relaxed">
                  You retain copyright in the work and grant the client a licence to use it for specified purposes. This is more common in photography, illustration, or music licensing, where the same asset may be licensed to multiple clients. Define the scope of the licence clearly: is it exclusive or non-exclusive? What territories? What media? For what duration?
                </p>
              </div>
              <div className="border border-gray-200 rounded-lg p-5">
                <h4 className="font-semibold text-[#1B3F7A] mb-2">Portfolio and case study rights</h4>
                <p className="text-[#3a3a5a] text-sm leading-relaxed">
                  Even when you assign IP to the client, include a clause retaining the right to display the work in your portfolio and reference the project in case studies. Without this, clients can (and occasionally do) argue that their NDA or IP assignment prevents you from showing the work publicly. Reserve this right explicitly.
                </p>
              </div>
              <div className="border border-gray-200 rounded-lg p-5">
                <h4 className="font-semibold text-[#1B3F7A] mb-2">Third-party IP and assets</h4>
                <p className="text-[#3a3a5a] text-sm leading-relaxed">
                  If your work incorporates third-party assets (stock images, fonts, open-source code, licensed music), your contract should clarify that the client is responsible for ensuring they have the appropriate licences for commercial use. You should not indemnify the client against third-party IP claims arising from assets you did not create.
                </p>
              </div>
            </div>
          </section>

          {/* Essential Clause 4: Confidentiality */}
          <section id="confidentiality" className="mb-14 scroll-mt-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="flex-shrink-0 w-10 h-10 bg-[#1B3F7A] text-white rounded-full flex items-center justify-center font-bold text-lg">
                4
              </span>
              <h2 className="font-bold text-[#1a1a2e] text-3xl">
                Confidentiality
              </h2>
            </div>
            <p className="text-[#3a3a5a] leading-relaxed mb-4 text-lg">
              Freelancers frequently handle sensitive client information — business strategies, unreleased products, financial data, customer databases, internal processes. A confidentiality (or non-disclosure) clause protects both you and your client by establishing clear obligations around how this information is handled.
            </p>

            <h3 className="font-semibold text-[#1B3F7A] text-xl mb-4">What a good confidentiality clause covers</h3>
            <ul className="space-y-3 mb-6 text-[#3a3a5a]">
              {[
                { label: 'Definition of confidential information', desc: 'What counts as confidential — typically anything the client marks as confidential, or that a reasonable person would understand to be confidential given the context of the engagement.' },
                { label: 'Your obligations', desc: 'Not to disclose confidential information to third parties, use it only for the purpose of fulfilling the contract, and take reasonable steps to keep it secure.' },
                { label: 'Duration', desc: 'How long the confidentiality obligation lasts. Perpetual confidentiality clauses are common, but you can negotiate time-limited obligations (e.g. 2–3 years after project completion).' },
                { label: 'Exclusions', desc: 'Information that is already in the public domain, information you already knew before the engagement, or information you receive from a third party with no confidentiality obligation. These should be excluded from the confidentiality obligation.' },
                { label: 'Reciprocal obligations', desc: 'Consider making confidentiality mutual — you also share information about your business processes, pricing, and methods with clients, and may want equivalent protection.' },
              ].map((item) => (
                <li key={item.label} className="flex items-start gap-4 bg-[#F8FAFE] rounded-lg p-4">
                  <span className="text-[#2C68C4] mt-0.5 flex-shrink-0 font-bold">✓</span>
                  <div>
                    <p className="font-semibold text-[#1a1a2e] text-sm mb-1">{item.label}</p>
                    <p className="text-[#5a5a7a] text-sm">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* Essential Clause 5: Termination */}
          <section id="termination" className="mb-14 scroll-mt-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="flex-shrink-0 w-10 h-10 bg-[#1B3F7A] text-white rounded-full flex items-center justify-center font-bold text-lg">
                5
              </span>
              <h2 className="font-bold text-[#1a1a2e] text-3xl">
                Termination
              </h2>
            </div>
            <p className="text-[#3a3a5a] leading-relaxed mb-4 text-lg">
              Projects end — sometimes as planned, and sometimes not. A clear termination clause defines the circumstances under which either party can end the contract, what notice is required, and critically, what happens to work completed and payment owed at the point of termination.
            </p>

            <div className="space-y-4 mb-6">
              <div className="border border-gray-200 rounded-lg p-5">
                <h4 className="font-semibold text-[#1B3F7A] mb-2">Termination for convenience</h4>
                <p className="text-[#3a3a5a] text-sm leading-relaxed">
                  Either party should be able to end the contract with reasonable notice — typically 14 to 30 days written notice. Your clause should specify what happens to work already completed and any deposit paid: generally, you are entitled to payment for all work completed to date, and the deposit is non-refundable after a reasonable amount of work has begun.
                </p>
              </div>
              <div className="border border-gray-200 rounded-lg p-5">
                <h4 className="font-semibold text-[#1B3F7A] mb-2">Termination for cause (material breach)</h4>
                <p className="text-[#3a3a5a] text-sm leading-relaxed">
                  Either party should be able to terminate immediately if the other commits a material breach of the contract and fails to remedy it within a specified period (typically 14 days of written notice). For the client, this might include non-payment. For you, it might include failure to deliver work meeting the agreed specifications.
                </p>
              </div>
              <div className="border border-gray-200 rounded-lg p-5">
                <h4 className="font-semibold text-[#1B3F7A] mb-2">Project abandonment by client</h4>
                <p className="text-[#3a3a5a] text-sm leading-relaxed">
                  Define what happens if the client goes silent, fails to provide required materials, or effectively abandons the project. You should be entitled to invoice for all work completed to the point of abandonment, and the deposit should not be refundable after work has commenced.
                </p>
              </div>
              <div className="border border-gray-200 rounded-lg p-5">
                <h4 className="font-semibold text-[#1B3F7A] mb-2">IP on termination</h4>
                <p className="text-[#3a3a5a] text-sm leading-relaxed">
                  Specify what happens to IP if the contract is terminated. A common approach: IP in work completed and paid for transfers to the client; IP in work not yet paid for remains with you. This gives you leverage to ensure full payment is made.
                </p>
              </div>
            </div>
          </section>

          {/* Essential Clause 6: Limitation of Liability */}
          <section id="liability" className="mb-14 scroll-mt-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="flex-shrink-0 w-10 h-10 bg-[#1B3F7A] text-white rounded-full flex items-center justify-center font-bold text-lg">
                6
              </span>
              <h2 className="font-bold text-[#1a1a2e] text-3xl">
                Limitation of liability
              </h2>
            </div>
            <p className="text-[#3a3a5a] leading-relaxed mb-4 text-lg">
              Without a limitation of liability clause, a client could theoretically claim consequential losses far exceeding your project fee. If a software bug causes business disruption, a design error affects a major campaign, or advice leads to a business decision with significant financial consequences, the potential liability without a cap could be ruinous.
            </p>
            <p className="text-[#3a3a5a] leading-relaxed mb-5 text-lg">
              A limitation of liability clause caps the maximum amount you can be required to pay in damages. For freelancers, the most common approach is to limit liability to the total fees paid for the specific project — or to the value of your professional indemnity insurance cover.
            </p>

            <h3 className="font-semibold text-[#1B3F7A] text-xl mb-4">Key elements to include</h3>
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              {[
                {
                  title: 'Cap on total liability',
                  desc: 'The maximum total amount claimable against you — typically the value of fees paid for the relevant project, or your insurance limit.',
                },
                {
                  title: 'Exclude consequential loss',
                  desc: 'Exclude liability for indirect or consequential losses — lost profits, lost business, loss of reputation, or any other indirect consequences of your work.',
                },
                {
                  title: 'Time limit for claims',
                  desc: 'A reasonable time limit within which claims must be raised — often 12 months from project completion or delivery.',
                },
                {
                  title: 'Exceptions',
                  desc: 'Note that you cannot lawfully exclude liability for death or personal injury caused by negligence, or for fraud. These must remain in any UK contract.',
                },
              ].map((item) => (
                <div key={item.title} className="bg-[#F8FAFE] rounded-lg p-4">
                  <p className="font-semibold text-[#1B3F7A] mb-1 text-sm">{item.title}</p>
                  <p className="text-[#5a5a7a] text-xs leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="bg-[#FFF9E6] border border-[#F5C842] rounded-lg p-4">
              <p className="text-[#7A5900] text-sm">
                <strong>Important:</strong> Limitation of liability clauses must satisfy the test of &quot;reasonableness&quot; under the Unfair Contract Terms Act 1977 to be enforceable. A clause limiting liability to nil would not be reasonable. Limiting to fees paid for the specific project is generally considered reasonable and enforceable.
              </p>
            </div>
          </section>

          {/* Essential Clause 7: Dispute Resolution */}
          <section id="dispute" className="mb-14 scroll-mt-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="flex-shrink-0 w-10 h-10 bg-[#1B3F7A] text-white rounded-full flex items-center justify-center font-bold text-lg">
                7
              </span>
              <h2 className="font-bold text-[#1a1a2e] text-3xl">
                Dispute resolution
              </h2>
            </div>
            <p className="text-[#3a3a5a] leading-relaxed mb-4 text-lg">
              Even with a clear contract, disputes can occasionally arise. A dispute resolution clause sets out the steps both parties agree to follow if they cannot resolve a disagreement directly — providing a structured path that avoids immediate legal action and the costs that come with it.
            </p>

            <h3 className="font-semibold text-[#1B3F7A] text-xl mb-4">Typical dispute resolution hierarchy</h3>

            <div className="space-y-3 mb-6">
              {[
                { step: '1', title: 'Direct negotiation', desc: 'Both parties commit to first attempting to resolve any dispute by direct discussion between the key contacts named in the contract, within a defined timeframe (e.g. 14 days of a written dispute notice).' },
                { step: '2', title: 'Mediation', desc: 'If direct negotiation fails, refer the dispute to a neutral mediator before pursuing legal action. Mediation is significantly cheaper and faster than litigation. CEDR (Centre for Effective Dispute Resolution) and the Civil Mediation Council maintain lists of accredited mediators.' },
                { step: '3', title: 'Court proceedings', desc: 'If mediation is unsuccessful, either party may pursue the matter through the courts. For claims under £10,000, the UK Small Claims Court (Money Claim Online) is cost-effective and does not generally require legal representation.' },
              ].map((item) => (
                <div key={item.step} className="flex items-start gap-4 border border-gray-200 rounded-lg p-5">
                  <span className="flex-shrink-0 w-8 h-8 bg-[#F0F4FF] text-[#1B3F7A] rounded-full flex items-center justify-center font-bold text-sm">
                    {item.step}
                  </span>
                  <div>
                    <p className="font-semibold text-[#1B3F7A] mb-1">{item.title}</p>
                    <p className="text-[#3a3a5a] text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-[#3a3a5a] leading-relaxed mb-4">
              Your dispute resolution clause should also specify the <strong>governing law and jurisdiction</strong> — almost always &quot;the laws of England and Wales&quot; (or Scotland, if relevant) and &quot;the exclusive jurisdiction of the courts of England and Wales.&quot; This prevents clients from attempting to bring claims under foreign law.
            </p>
          </section>

          {/* Mistakes */}
          <section id="mistakes" className="mb-14 scroll-mt-8">
            <h2 className="font-bold text-[#1a1a2e] text-3xl mb-5">
              Common contract mistakes to avoid
            </h2>
            <p className="text-[#3a3a5a] leading-relaxed mb-6 text-lg">
              Even freelancers who do use contracts often make mistakes that significantly weaken their protection. Here are the most common errors and how to avoid them.
            </p>

            <div className="space-y-4">
              {[
                {
                  num: '01',
                  title: 'Starting work before the contract is signed',
                  body: "Starting work on a handshake or based on a client email is one of the riskiest things you can do. Once work has begun without a signed contract, your leverage to insist on contract terms diminishes significantly. Never start work until both parties have signed the agreement.",
                },
                {
                  num: '02',
                  title: 'Using a generic template without adapting it',
                  body: "Generic contract templates downloaded from the internet are often inadequate for UK law, too vague to be enforceable, or simply not suited to your type of work. A contract for a web developer has very different IP, scope, and liability considerations than one for a copywriter or management consultant.",
                },
                {
                  num: '03',
                  title: 'Not addressing what happens if the project changes',
                  body: "Scope creep is the most common source of freelancer frustration. If your contract does not include a change request process — requiring written agreement and additional payment for out-of-scope work — you have no mechanism to resist or charge for additional requests.",
                },
                {
                  num: '04',
                  title: 'Accepting client-drafted contracts without review',
                  body: "Larger clients often send their own supplier contracts, which are typically drafted entirely in their favour. These may include indemnities that are catastrophically broad, unlimited liability exposure, or IP clauses that give them rights to all your background IP. Always read client-drafted contracts carefully — and negotiate where necessary.",
                },
                {
                  num: '05',
                  title: 'No deposit clause',
                  body: "Invoicing only on completion leaves you exposed if a client cancels or disputes the work after it is done. A deposit of 25–50% upfront is standard practice, provides cash flow, and confirms the client&apos;s genuine commitment before you invest significant time.",
                },
                {
                  num: '06',
                  title: 'Vague payment terms',
                  body: "\"Payment within a reasonable time\" or \"payment on completion\" are not enforceable terms. Specify the exact number of days (e.g. 14 calendar days from invoice date), the invoice trigger, and the late payment interest rate. Precision is protection.",
                },
                {
                  num: '07',
                  title: 'No IP clarity for projects using pre-existing work',
                  body: "If you reuse code, design elements, or other assets from previous projects in new client work, the IP position becomes complicated. Be explicit in your contract about what background IP you bring to the project (which you retain) versus what you create specifically for the client (which you may assign).",
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

          {/* Template Structure */}
          <section id="template" className="mb-14 scroll-mt-8">
            <h2 className="font-bold text-[#1a1a2e] text-3xl mb-5">
              Contract structure: a practical overview
            </h2>
            <p className="text-[#3a3a5a] leading-relaxed mb-5 text-lg">
              A well-structured freelance client contract does not need to be long — but it does need to cover the right ground in a logical order. Here is the structure that most effective freelance service agreements follow:
            </p>

            <div className="space-y-3 mb-7">
              {[
                { section: 'Parties', desc: 'Full legal names of both parties — your name (and business name if trading as one), the client\'s name, and registered addresses.' },
                { section: 'Project overview', desc: 'A brief description of the engagement and the purpose of the agreement.' },
                { section: 'Scope of services', desc: 'The specific deliverables, timeline, milestones, revision rounds included, and what falls outside the scope.' },
                { section: 'Fees and payment terms', desc: 'Total fee, payment schedule, deposit requirements, payment due dates, late payment interest, and expense treatment.' },
                { section: 'Intellectual property', desc: 'Ownership, assignment conditions, licence terms (if retaining copyright), portfolio rights, and third-party IP.' },
                { section: 'Confidentiality', desc: 'Definition of confidential information, mutual obligations, duration, and exclusions.' },
                { section: 'Termination', desc: 'Notice periods, reasons for termination for cause, and what happens to work and payment on termination.' },
                { section: 'Limitation of liability', desc: 'Cap on total liability, exclusion of indirect and consequential loss, and mandatory exceptions.' },
                { section: 'Dispute resolution', desc: 'Direct negotiation, mediation, and court proceedings hierarchy.' },
                { section: 'General provisions', desc: 'Governing law and jurisdiction, the entire agreement clause (this contract supersedes prior discussions), variation clause (changes must be in writing), and severability.' },
                { section: 'Signatures', desc: 'Signature blocks for both parties — name, title, date, and signature. For electronic signatures, ensure you are using a platform that creates a legally valid record.' },
              ].map((item, i) => (
                <div key={item.section} className="flex items-start gap-4">
                  <span className="flex-shrink-0 w-7 h-7 bg-[#F0F4FF] text-[#1B3F7A] rounded text-xs font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <div className="flex-1 pb-3 border-b border-gray-100">
                    <p className="font-semibold text-[#1a1a2e] text-sm">{item.section}</p>
                    <p className="text-[#5a5a7a] text-xs mt-0.5 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-[#F0F4FF] rounded-xl p-5 border-l-4 border-[#2C68C4]">
              <p className="text-[#3a3a5a] text-sm">
                <strong className="text-[#1B3F7A]">On electronic signatures:</strong> Under the Electronic Communications Act 2000, electronic signatures are legally valid in the UK for most contracts (with some exceptions such as property transactions). Tools like DocuSign, Adobe Sign, and even a typed name in an email exchange can constitute a valid signature — though dedicated e-signature tools provide a better audit trail.
              </p>
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
                  q: 'Do UK freelancers need a written contract?',
                  a: "While verbal contracts are technically enforceable in the UK, they are extremely difficult to prove and enforce in practice. A written contract protects both you and your client by setting clear expectations and providing an enforceable document if a dispute arises. Every UK freelancer should use written contracts for every engagement.",
                },
                {
                  q: 'Who owns intellectual property created by a freelancer?',
                  a: "Under UK law, the default position for freelancers (as independent contractors) is that you own the intellectual property you create — unless your contract assigns it to the client. Your contract must explicitly address IP assignment if you wish to transfer ownership to your client, typically upon receipt of full payment.",
                },
                {
                  q: 'How long should freelancer payment terms be?',
                  a: "Standard payment terms are typically 14 to 30 days from invoice date. The Late Payment of Commercial Debts Act gives you a statutory right to charge 8% above base rate on overdue invoices, plus a fixed compensation of £40–£100 per invoice. Your contract should specify your exact terms, including late payment interest.",
                },
                {
                  q: 'What should a freelancer do if a client does not pay?',
                  a: "First, send a formal overdue payment reminder referencing your contract terms. If payment is not received, issue a Letter Before Action stating your intention to pursue the debt through the courts. For debts under £10,000, the UK Small Claims Court (Money Claim Online) is a cost-effective route. A written contract is essential evidence for this process.",
                },
                {
                  q: 'What is a limitation of liability clause?',
                  a: "A limitation of liability clause caps the amount of compensation you could be required to pay if your work causes loss to the client. Without one, your liability could theoretically be unlimited. Most freelancer contracts limit liability to the total fees paid for the specific project, or to the value of their professional indemnity insurance cover.",
                },
                {
                  q: 'Can I use a contract template I found online?',
                  a: "Generic contract templates are often inadequate, legally incorrect for UK law, or too vague to be enforceable. The specific terms you need depend on your industry, type of work, payment structure, and how you handle IP and confidentiality. A bespoke contract tailored to your business provides significantly better protection than a generic template.",
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
          <section className="scroll-mt-8">
            <h2 className="font-bold text-[#1a1a2e] text-3xl mb-5">
              Next steps: get your contract in place
            </h2>
            <p className="text-[#3a3a5a] leading-relaxed mb-4 text-lg">
              A well-drafted client contract is not just legal protection — it is a statement of your professionalism. Clients who receive a clear, comprehensive service agreement feel confident they are working with someone who takes their business seriously. It sets the tone for the entire engagement.
            </p>
            <p className="text-[#3a3a5a] leading-relaxed mb-4 text-lg">
              The essential clauses covered in this guide — scope, payment, IP, confidentiality, termination, limitation of liability, and dispute resolution — are not optional extras. They are the minimum viable protection for any UK freelancer. Together, they define the commercial and legal relationship, and provide a clear framework for resolving the inevitable complications that arise in any business engagement.
            </p>
            <p className="text-[#3a3a5a] leading-relaxed mb-8 text-lg">
              If you are currently operating without a written contract, the priority is simple: stop doing that. Implement one before your next engagement — the risk of operating without is significantly greater than the minor friction of asking a client to sign one.
            </p>

            {/* Final CTA */}
            <div
              className="rounded-2xl p-8 text-white text-center"
              style={{ background: 'linear-gradient(135deg, #1B3F7A 0%, #2C68C4 100%)' }}
            >
              <h3 className="font-bold text-2xl mb-3">
                Let Foundationary write your client contract
              </h3>
              <p className="text-white/85 mb-6 text-lg max-w-[560px] mx-auto">
                A bespoke, UK-compliant client contract drafted for your specific sole trader business — with all the essential clauses covered. Included in every Foundationary package alongside 9 other professional business documents. Delivered in 24 hours.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link
                  href="/whats-included"
                  className="font-semibold text-[#1B3F7A] bg-white rounded-lg hover:bg-[#F0F4FF] transition-colors px-7 py-3.5"
                >
                  See What&apos;s Included →
                </Link>
                <Link
                  href="/how-it-works"
                  className="font-semibold text-white border-2 border-white/60 rounded-lg hover:bg-white/10 transition-colors px-7 py-3.5"
                >
                  How It Works
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
                href="https://www.linkedin.com/sharing/share-offsite/?url=https://foundationary.vercel.app/blog/client-contract-essentials-uk-freelancers"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-[#1B3F7A] bg-white border border-[#D0D9F2] rounded-lg px-4 py-2 hover:bg-[#F0F4FF] transition-colors"
              >
                Share on LinkedIn
              </a>
              <a
                href="https://twitter.com/intent/tweet?url=https://foundationary.vercel.app/blog/client-contract-essentials-uk-freelancers&text=What+Every+UK+Freelancer+Needs+in+Their+Client+Contract"
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
              href="/blog/gdpr-compliance-sole-traders-uk"
              className="group bg-[#F8FAFE] rounded-xl p-6 border border-gray-200 hover:border-[#2C68C4] transition-colors"
            >
              <span className="text-xs font-semibold text-[#2C68C4] uppercase tracking-wide">Legal</span>
              <h3 className="font-semibold text-[#1a1a2e] mt-2 mb-1 group-hover:text-[#2C68C4] transition-colors">
                GDPR Compliance for UK Sole Traders: Complete 2026 Guide
              </h3>
              <p className="text-sm text-[#5a5a7a]">
                Data protection, privacy policies, ICO registration, and what the penalties actually look like.
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
            <Link href="/how-it-works" className="text-[#2C68C4] hover:text-[#1B3F7A] font-medium">
              How It Works →
            </Link>
            <Link href="/faq" className="text-[#2C68C4] hover:text-[#1B3F7A] font-medium">
              FAQs →
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
