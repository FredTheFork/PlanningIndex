import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About Foundationary - Professional Business Documents for UK Sole Traders',
  description: 'We help UK sole traders operate professionally with bespoke business documents. Learn about our mission and approach.',
  keywords: [
    'about Foundationary',
    'sole trader document service UK',
    'professional business documents UK',
    'freelancer legal documents service',
    'UK small business document provider',
  ],
  openGraph: {
    title: 'About Foundationary - Professional Foundations for UK Sole Traders',
    description: 'We help UK sole traders operate professionally with bespoke business documents tailored to their business.',
    url: 'https://foundationary.vercel.app/about',
    images: [{ url: '/og-about.png', width: 1200, height: 630 }],
  },
  alternates: {
    canonical: 'https://foundationary.vercel.app/about',
  },
};

const beliefs = [
  {
    title: 'Running a small business shouldn\'t mean running unnecessary risks.',
    body: 'Contracts, privacy policies, and terms of business aren\'t bureaucratic overhead — they\'re the foundation that lets you operate confidently. Without them, every client engagement carries avoidable risk.',
  },
  {
    title: 'Professional documentation shouldn\'t cost a solicitor\'s hourly rate.',
    body: 'Traditional legal services charge hundreds or thousands for documents that most sole traders need once and then keep. We believe there\'s a better way: structured, bespoke, fast, and affordable.',
  },
  {
    title: 'Generic templates don\'t protect you.',
    body: 'A Terms & Conditions document downloaded from a random website isn\'t tailored to your service, your pricing, or your client relationships. It might create gaps you don\'t even know about. We create documents that are specific to you.',
  },
  {
    title: 'A professional presentation wins clients before you say a word.',
    body: 'When a potential client receives a properly drafted contract, a clear privacy policy, and professional onboarding emails, it signals that you\'re someone who takes their work seriously. That matters.',
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section
        className="text-center px-6 py-20"
        style={{
          background: 'linear-gradient(135deg, #1B3F7A 0%, #2C68C4 100%)',
        }}
      >
        <div className="mx-auto max-w-[800px]">
          <span className="text-sm font-semibold uppercase tracking-widest text-white/70 block mb-3">
            ABOUT FOUNDATIONARY
          </span>
          <h1 className="font-bold text-white text-4xl md:text-5xl">
            Professional Foundations for Businesses That Don&apos;t Want to Wing It
          </h1>
          <p className="mt-5 text-lg text-white/90 max-w-[640px] mx-auto">
            We help UK sole traders get the documentation they need to operate
            properly — without the legal fees, the confusing templates, or the
            weeks of back-and-forth.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-[800px] mx-auto">
          <h2 className="font-bold text-[#1a1a2e] text-3xl mb-6">Our Mission</h2>
          <p className="text-[#5a5a7a] text-lg leading-relaxed mb-6">
            Foundationary exists because too many talented sole traders start working
            without the documents that protect them — not because they don&apos;t
            care, but because getting them right has always felt too expensive,
            too complicated, or too time-consuming.
          </p>
          <p className="text-[#5a5a7a] text-lg leading-relaxed mb-6">
            We offer a straightforward service: answer a structured questionnaire
            about your business, and we create a complete set of professional
            documents tailored to your specific situation. Not templates. Not
            generic downloads. Documents that reflect your services, your clients,
            and your business.
          </p>
          <p className="text-[#5a5a7a] text-lg leading-relaxed">
            The result is a business that looks and operates professionally from day
            one — with the legal protections in place that most sole traders only
            think about after something goes wrong.
          </p>
        </div>
      </section>

      {/* Why We Exist */}
      <section className="bg-[#F0F4FF] py-16 px-6">
        <div className="max-w-[800px] mx-auto">
          <h2 className="font-bold text-[#1a1a2e] text-3xl mb-4">Why We Exist</h2>
          <p className="text-[#5a5a7a] text-lg leading-relaxed mb-6">
            The UK has millions of sole traders and micro-businesses. Most of them
            start without a proper client contract. Many operate without a GDPR
            privacy policy. Fewer still have professionally drafted terms of
            business, a late payment process, or onboarding documents that reflect
            how they actually work.
          </p>
          <p className="text-[#5a5a7a] text-lg leading-relaxed mb-6">
            This isn&apos;t negligence — it&apos;s a gap in what&apos;s available at an
            accessible price point. Solicitors charge by the hour. Template sites
            sell generic documents that need significant modification to be useful.
            DIY approaches take time that most independent business owners
            don&apos;t have.
          </p>
          <p className="text-[#5a5a7a] text-lg leading-relaxed">
            Foundationary sits in the space between &ldquo;do it yourself&rdquo; and &ldquo;hire a
            lawyer.&rdquo; A fixed price. A structured process. Bespoke output. Done.
          </p>
        </div>
      </section>

      {/* What We Believe */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-[1000px] mx-auto">
          <h2 className="font-bold text-[#1a1a2e] text-3xl mb-10 text-center">
            What We Believe
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {beliefs.map((belief, i) => (
              <div key={i} className="bg-[#F8FAFE] rounded-xl p-8 border border-[#e0e8f8]">
                <h3 className="font-bold text-[#1B3F7A] text-lg mb-3">
                  {belief.title}
                </h3>
                <p className="text-[#5a5a7a] leading-relaxed">{belief.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who We Serve */}
      <section className="bg-[#F0F4FF] py-16 px-6">
        <div className="max-w-[800px] mx-auto">
          <h2 className="font-bold text-[#1a1a2e] text-3xl mb-6 text-center">
            Who We Serve
          </h2>
          <p className="text-[#5a5a7a] text-lg leading-relaxed text-center mb-10">
            Foundationary is built for UK sole traders and micro-businesses who
            sell services — the consultants, coaches, creatives, and independent
            professionals who work directly with clients and need the foundations
            to do that properly.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              'Consultants and business advisors',
              'Freelance creatives and designers',
              'Coaches and trainers',
              'Virtual assistants and PAs',
              'Copywriters and content creators',
              'Accountants and bookkeepers',
              'Photographers and videographers',
              'Social media managers',
              'Independent therapists and practitioners',
              'Any service-based sole trader in the UK',
            ].map((who) => (
              <div key={who} className="flex items-center gap-3 bg-white rounded-lg px-4 py-3">
                <span className="text-[#2C68C4] font-bold">✓</span>
                <span className="text-[#1a1a2e]">{who}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Are Not */}
      <section className="bg-white py-16 px-6">
        <div className="max-w-[800px] mx-auto">
          <h2 className="font-bold text-[#1a1a2e] text-3xl mb-4">
            What We Are Not
          </h2>
          <p className="text-[#5a5a7a] text-lg leading-relaxed mb-6">
            Foundationary is not a law firm and does not provide legal advice.
            Our documents are professionally drafted and UK-compliant, but if you
            need legal counsel on a specific situation — a dispute, a contract
            negotiation, or complex regulatory requirements — you should consult a
            qualified solicitor.
          </p>
          <p className="text-[#5a5a7a] text-lg leading-relaxed">
            We&apos;re also not a subscription service, a software platform, or an AI
            document generator. We&apos;re a structured service that produces bespoke
            documents from your answers, reviewed before delivery. Simple, one-time,
            done.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-[#1B3F7A] to-[#2C68C4] py-20 px-6 text-white text-center">
        <h2 className="font-bold text-4xl mb-4">Get your foundations in order</h2>
        <p className="text-xl mb-8 text-[#A8C5FF]">
          10 professional documents. 24-hour delivery. One fixed price.
        </p>
        <Link
          href="/checkout"
          className="inline-block font-semibold text-[#1B3F7A] bg-white rounded-lg hover:bg-[#F8FAFE] transition-colors px-10 py-5 text-lg"
        >
          Get Started — £79 →
        </Link>
      </section>

      {/* Internal Links */}
      <section className="bg-[#F8FAFE] py-12 px-6">
        <div className="max-w-[1200px] mx-auto text-center">
          <nav className="flex flex-wrap justify-center gap-6">
            <Link href="/how-it-works" className="text-[#2C68C4] hover:text-[#1B3F7A] font-medium">
              How It Works →
            </Link>
            <Link href="/whats-included" className="text-[#2C68C4] hover:text-[#1B3F7A] font-medium">
              What&apos;s Included →
            </Link>
            <Link href="/pricing" className="text-[#2C68C4] hover:text-[#1B3F7A] font-medium">
              Pricing →
            </Link>
            <Link href="/faq" className="text-[#2C68C4] hover:text-[#1B3F7A] font-medium">
              FAQs →
            </Link>
            <Link href="/contact" className="text-[#2C68C4] hover:text-[#1B3F7A] font-medium">
              Contact →
            </Link>
          </nav>
        </div>
      </section>
    </>
  );
}
