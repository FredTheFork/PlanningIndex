'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

/* ─── shared data ─── */

const documents = [
  { num: '01', title: 'Bespoke Client Contract', desc: 'UK law-compliant service agreement covering scope, payment, IP, termination, and dispute resolution. Specific to your services.' },
  { num: '02', title: 'Terms & Conditions', desc: 'Your complete operating rulebook — payment terms, late payment rights (Late Payment Act 1998), refunds, cancellations.' },
  { num: '03', title: 'GDPR Privacy Policy', desc: 'ICO-compliant and specific to your actual data activities. Not a generic template — built around what you actually collect and why.' },
  { num: '04', title: 'Professional Bio', desc: '150-word website version and 50-word social version, written in your voice, that makes you sound exactly as good as you are.' },
  { num: '05', title: 'Elevator Pitch (3 Versions)', desc: "30-second, 2-minute, and written versions. Never stumble over 'so what do you do?' again." },
  { num: '06', title: 'LinkedIn Profile Script', desc: 'Headline, full About section, and Featured section — keyword-optimised and ready to copy-paste.' },
  { num: '07', title: 'Professional Invoice Template', desc: 'UK-formatted, VAT-ready, with your branding and the correct statutory late payment interest notice.' },
  { num: '08', title: 'New Client Welcome Emails (×3)', desc: "The onboarding sequence that makes every client feel like they've hired a professional firm, not a one-person business." },
  { num: '09', title: 'Late Payment Letters (×3)', desc: 'Friendly reminder → formal demand → Letter Before Action. All legally sound. All ready to send.' },
  { num: '10', title: 'Service Description Sheets', desc: "One-page professional breakdown per service — what's in, what's out, who it's for, what they get." },
];

const packFeatures = [
  'Bespoke Client Contract',
  'Terms & Conditions',
  'GDPR Privacy Policy',
  'Professional Bio',
  'Elevator Pitch (3 Versions)',
  'LinkedIn Profile Script',
  'Professional Invoice Template',
  'New Client Welcome Emails (×3)',
  'Late Payment Letters (×3)',
  'Service Description Sheets',
];

const packExtras = [
  'Delivered within 24 hours',
  'PDF + editable Word formats',
  'UK law compliant throughout',
  'Your tone, your business, your name',
];

const comparisonRows = [
  { feature: '10 documents included', foundationary: 'check', solicitor: 'Charged per doc', diy: 'cross', ai: 'cross' },
  { feature: 'Done for you', foundationary: 'check', solicitor: 'check', diy: 'cross', ai: 'cross' },
  { feature: 'UK law compliant', foundationary: 'check', solicitor: 'check', diy: 'partial', ai: 'cross' },
  { feature: 'Specific to your business', foundationary: 'check', solicitor: 'check', diy: 'cross', ai: 'cross' },
  { feature: 'Delivered in 24 hours', foundationary: 'check', solicitor: 'Weeks', diy: 'You decide', ai: 'Minutes' },
  { feature: 'Professional bio & pitch', foundationary: 'check', solicitor: 'cross', diy: 'cross', ai: 'cross' },
  { feature: 'LinkedIn profile script', foundationary: 'check', solicitor: 'cross', diy: 'cross', ai: 'cross' },
  { feature: 'Invoice template included', foundationary: 'check', solicitor: 'cross', diy: 'cross', ai: 'cross' },
  { feature: 'Welcome & late payment emails', foundationary: 'check', solicitor: 'cross', diy: 'cross', ai: 'cross' },
  { feature: 'Typical cost', foundationary: '£79', solicitor: '£500–£2,000+', diy: '£30–£80/yr', ai: 'Free*' },
];

const upsells = [
  {
    price: '£49 add-on',
    title: 'Website Copy Starter Pack',
    desc: 'Professional website copy written in your voice, SEO-aware, and ready to paste into any website builder.',
    features: [
      'Homepage copy (hero, benefits, CTA)',
      'About page',
      'Services page (linked to your service description sheets)',
      'Contact page',
    ],
  },
  {
    price: '£49 add-on',
    title: 'Social Media Starter Pack',
    desc: '30 done-for-you posts for your chosen platforms — covering your expertise, your personality, and your offer.',
    features: [
      'Mix of educational, promotional, and personal posts',
      'Tailored to your industry and audience',
      'Caption, hashtag suggestions, and image brief included',
      'Covers 4–6 weeks of content',
    ],
  },
  {
    price: '£29/quarter',
    title: 'Quarterly Document Refresh',
    desc: 'Keep your documents current as your business evolves — one document updated every quarter.',
    features: [
      'Pricing changes reflected in T&Cs and invoice template',
      'New services added to contracts and description sheets',
      'GDPR policy updated if tools or data practices change',
      'Annual subscription — cancel anytime',
    ],
  },
];

const faqs = [
  {
    q: 'Is this really a one-time payment?',
    a: 'Yes. £79 is the total cost for all 10 documents. There is no subscription, no monthly fee, and no further charges unless you choose to add an optional extra. The Quarterly Document Refresh is the only recurring option and it is entirely your choice.',
  },
  {
    q: 'What if I only need some of the documents?',
    a: "We don't offer individual documents — the pack is the product. The reason is that the documents need to be consistent with each other: your contract and your T&Cs need to use the same payment terms. Your invoice template needs to match your stated late payment policy. Your bio and elevator pitch need to align in tone and positioning. Producing them together is what makes them work properly.",
  },
  {
    q: 'Can I pay and come back to fill in the questionnaire later?',
    a: 'Yes. Once you pay, you receive a unique link to your questionnaire by email. That link is yours to use whenever you are ready — there is no deadline to submit. The 24-hour delivery clock starts when you submit the questionnaire, not when you pay.',
  },
  {
    q: "Is there a refund if I'm not happy?",
    a: 'Because we begin work on your documents within hours of questionnaire submission, we are not able to offer refunds after the process has begun. If you have any concerns about whether this service is right for your business before purchasing, email us first — we will give you an honest answer.',
  },
  {
    q: 'Do the documents need any editing before I use them?',
    a: 'They are ready to use immediately. We review every document before delivery to check consistency, UK law compliance, and alignment with your stated tone and services. That said, some clients choose to make small personal adjustments — which is why every document is delivered in an editable Word format alongside the polished PDF.',
  },
  {
    q: 'What if my business grows and I need to update things?',
    a: 'The editable Word format makes minor updates straightforward to do yourself. If you want us to handle updates professionally, the Quarterly Document Refresh (£29/quarter) covers one document per quarter — new services, pricing changes, GDPR updates, and anything else that evolves.',
  },
];

/* ─── tiny sub-components ─── */

function CheckMark() {
  return (
    <span
      className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-success text-white font-bold shrink-0"
      style={{ fontSize: '0.75rem' }}
    >
      ✓
    </span>
  );
}

function CrossMark() {
  return (
    <span
      className="inline-flex items-center justify-center w-6 h-6 rounded-full shrink-0"
      style={{ fontSize: '0.75rem', background: '#F0F4FF', color: '#CBD5E0' }}
    >
      ✕
    </span>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="font-inter font-semibold text-medium-blue uppercase block mb-3"
      style={{ fontSize: '0.75rem', letterSpacing: '0.15em' }}
    >
      {children}
    </span>
  );
}

/* ─── page sections ─── */

function PageHeader() {
  return (
    <section
      className="text-center px-6"
      style={{
        padding: '80px 0 64px',
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
          PRICING
        </span>
        <h1
          className="font-inter font-extrabold text-white mt-3"
          style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}
        >
          One price. No surprises.
        </h1>
        <p
          className="font-inter font-normal mx-auto mt-4 leading-[1.7]"
          style={{
            fontSize: '1.05rem',
            color: 'rgba(255,255,255,0.85)',
            maxWidth: 560,
          }}
        >
          £79 once. Everything you need to run your business properly from day one — no subscription, no upsells required, no ongoing cost unless you want one.
        </p>
      </div>
    </section>
  );
}

function CellContent({ value }: { value: string }) {
  if (value === 'check') return <CheckMark />;
  if (value === 'cross') return <CrossMark />;
  if (value === 'partial')
    return (
      <span className="font-inter font-normal italic text-secondary-text" style={{ fontSize: '0.875rem' }}>
        Partial
      </span>
    );
  return (
    <span className="font-inter font-medium text-dark-text" style={{ fontSize: '0.875rem' }}>
      {value}
    </span>
  );
}

function ComparisonSection() {
  const headers = ['What you get', 'Foundationary', 'Solicitor', 'DIY (LegalZoom etc.)', 'Generic AI (ChatGPT)'];

  return (
    <section className="bg-off-white py-24 px-6">
      <div className="mx-auto" style={{ maxWidth: 1100 }}>
        <SectionLabel>HOW WE COMPARE</SectionLabel>
        <h2
          className="font-inter font-bold text-dark-text"
          style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)' }}
        >
          Not the cheapest option. The only one that makes sense.
        </h2>
        <p
          className="font-inter font-normal text-secondary-text mt-3 leading-[1.7]"
          style={{ fontSize: '1rem', maxWidth: 580 }}
        >
          Every alternative either costs dramatically more, requires you to do all the work yourself, or produces something generic that doesn't reflect your actual business.
        </p>

        {/* Desktop table */}
        <div
          className="hidden md:block mt-12 rounded-2xl overflow-hidden border border-border"
          style={{ boxShadow: '0 8px 40px rgba(27,63,122,0.08)' }}
        >
          <table className="w-full">
            <thead>
              <tr className="bg-navy">
                <th
                  className="text-left font-inter font-semibold text-white p-4"
                  style={{ fontSize: '0.85rem', padding: '16px 20px' }}
                >
                  {headers[0]}
                </th>
                <th
                  className="font-inter font-bold text-white text-center"
                  style={{
                    fontSize: '0.9rem',
                    padding: '16px 20px',
                    background: 'rgba(255,255,255,0.15)',
                  }}
                >
                  {headers[1]}
                </th>
                <th
                  className="font-inter font-medium text-center"
                  style={{
                    fontSize: '0.85rem',
                    padding: '16px 20px',
                    color: 'rgba(255,255,255,0.75)',
                  }}
                >
                  {headers[2]}
                </th>
                <th
                  className="font-inter font-medium text-center"
                  style={{
                    fontSize: '0.85rem',
                    padding: '16px 20px',
                    color: 'rgba(255,255,255,0.75)',
                  }}
                >
                  {headers[3]}
                </th>
                <th
                  className="font-inter font-medium text-center"
                  style={{
                    fontSize: '0.85rem',
                    padding: '16px 20px',
                    color: 'rgba(255,255,255,0.75)',
                  }}
                >
                  {headers[4]}
                </th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row, i) => (
                <tr
                  key={row.feature}
                  style={{ background: i % 2 === 0 ? '#FFFFFF' : '#F8FAFF' }}
                >
                  <td
                    className="font-inter font-medium text-dark-text"
                    style={{ fontSize: '0.875rem', padding: '14px 20px', minHeight: 52 }}
                  >
                    {row.feature}
                  </td>
                  <td
                    className="text-center"
                    style={{ padding: '14px 20px', background: i % 2 === 0 ? 'rgba(240,244,255,0.4)' : 'rgba(240,244,255,0.25)' }}
                  >
                    <CellContent value={row.foundationary} />
                  </td>
                  <td className="text-center" style={{ padding: '14px 20px' }}>
                    <CellContent value={row.solicitor} />
                  </td>
                  <td className="text-center" style={{ padding: '14px 20px' }}>
                    <CellContent value={row.diy} />
                  </td>
                  <td className="text-center" style={{ padding: '14px 20px' }}>
                    <CellContent value={row.ai} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile card stack */}
        <div className="md:hidden mt-12 flex flex-col gap-4">
          {comparisonRows.map((row, i) => (
            <div
              key={row.feature}
              className="bg-white rounded-xl border border-border p-5"
              style={{ background: i % 2 === 0 ? '#FFFFFF' : '#F8FAFF' }}
            >
              <div className="font-inter font-semibold text-dark-text mb-3" style={{ fontSize: '0.9rem' }}>
                {row.feature}
              </div>
              <div className="flex flex-col gap-2">
                {['Foundationary', 'Solicitor', 'DIY Tools', 'Generic AI'].map((col, ci) => {
                  const val = [row.foundationary, row.solicitor, row.diy, row.ai][ci];
                  return (
                    <div key={col} className="flex items-center justify-between gap-3">
                      <span className="font-inter font-medium text-secondary-text" style={{ fontSize: '0.8rem' }}>
                        {col}
                      </span>
                      <CellContent value={val} />
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <p
          className="font-inter font-normal italic text-secondary-text mt-4 text-right"
          style={{ fontSize: '0.8rem' }}
        >
          *Generic AI tools like ChatGPT are free to use but produce unstructured, US-oriented, legally incomplete output with no quality assurance and no understanding of UK law.
        </p>
      </div>
    </section>
  );
}

function MainPricingSection() {
  return (
    <section className="bg-white py-24 px-6">
      <div className="mx-auto" style={{ maxWidth: 960 }}>
        <SectionLabel>THE PACK</SectionLabel>
        <h2
          className="font-inter font-bold text-dark-text"
          style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)' }}
        >
          Business Foundations Pack
        </h2>

        <div className="flex flex-col lg:flex-row gap-10 mt-12">
          {/* Left — pricing card */}
          <div className="relative mx-auto lg:mx-0" style={{ maxWidth: 420, width: '100%' }}>
            <div
              className="bg-white border-2 border-navy rounded-[20px] p-10 relative"
              style={{
                boxShadow: '0 16px 64px rgba(27,63,122,0.12)',
                padding: '40px 36px',
              }}
            >
              {/* Badge */}
              <span
                className="absolute left-1/2 -translate-x-1/2 text-white font-inter font-semibold rounded-full"
                style={{
                  top: -14,
                  background: 'linear-gradient(135deg, #1B3F7A, #2C68C4)',
                  padding: '5px 18px',
                  fontSize: '0.7rem',
                  letterSpacing: '0.1em',
                }}
              >
                COMPLETE PACK
              </span>

              <div className="text-center">
                <span
                  className="font-inter font-extrabold text-navy block"
                  style={{ fontSize: '3.5rem', lineHeight: 1 }}
                >
                  £79
                </span>
                <span
                  className="font-inter font-normal text-secondary-text block mt-1"
                  style={{ fontSize: '0.875rem' }}
                >
                  one-time payment
                </span>
              </div>

              <div className="border-t border-border my-6" />

              <div className="flex flex-col gap-3">
                {packFeatures.map((f) => (
                  <div key={f} className="flex items-start gap-3">
                    <span className="text-success font-bold shrink-0">✓</span>
                    <span className="font-inter font-medium text-dark-text" style={{ fontSize: '0.9rem' }}>
                      {f}
                    </span>
                  </div>
                ))}
                {packExtras.map((e) => (
                  <div key={e} className="flex items-start gap-3">
                    <span className="text-success font-bold shrink-0">✓</span>
                    <span className="font-inter font-medium text-dark-text" style={{ fontSize: '0.9rem' }}>
                      {e}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-border my-6" />

              <Link
                href="/checkout"
                className="block w-full text-center font-inter font-bold text-white bg-navy rounded-[10px] hover:bg-medium-blue hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(27,63,122,0.3)] transition-all duration-200"
                style={{ padding: '16px', fontSize: '1rem' }}
              >
                Get My Business Foundations Pack
              </Link>

              <div className="flex justify-center gap-4 mt-4 flex-wrap">
                {['🔒 Secure via Stripe', '📄 PDF + Word formats', '🇬🇧 UK law compliant'].map((t) => (
                  <span key={t} className="font-inter font-normal text-secondary-text" style={{ fontSize: '0.75rem' }}>
                    {t}
                  </span>
                ))}
              </div>

              <div
                className="bg-off-white rounded-lg text-center font-inter font-normal text-navy mt-5"
                style={{ padding: '14px 16px', fontSize: '0.85rem' }}
              >
                Not sure? Email us before buying — we'll tell you honestly if this pack is the right fit for your business.
              </div>
            </div>
          </div>

          {/* Right — detail breakdown */}
          <div className="flex-1">
            <h3 className="font-inter font-semibold text-dark-text mb-6" style={{ fontSize: '1rem' }}>
              What's in every pack
            </h3>
            <div className="flex flex-col gap-5">
              {documents.map((doc) => (
                <div key={doc.num} className="flex gap-4">
                  <div
                    className="shrink-0 w-7 h-7 rounded-full bg-navy text-white flex items-center justify-center font-inter font-bold"
                    style={{ fontSize: '0.75rem' }}
                  >
                    {doc.num}
                  </div>
                  <div>
                    <div className="font-inter font-semibold text-dark-text" style={{ fontSize: '0.95rem' }}>
                      {doc.title}
                    </div>
                    <p
                      className="font-inter font-normal text-secondary-text mt-1 leading-[1.55]"
                      style={{ fontSize: '0.85rem' }}
                    >
                      {doc.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Link
              href="/whats-included"
              className="inline-block font-inter font-medium text-medium-blue hover:underline mt-6"
              style={{ fontSize: '0.875rem' }}
            >
              Read the full breakdown of every document →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function UpsellsSection() {
  return (
    <section className="bg-off-white py-20 px-6">
      <div className="mx-auto" style={{ maxWidth: 960 }}>
        <SectionLabel>OPTIONAL ADD-ONS</SectionLabel>
        <h2
          className="font-inter font-bold text-dark-text"
          style={{ fontSize: 'clamp(1.6rem, 2.8vw, 2.2rem)' }}
        >
          Add more. Pay only for what you need.
        </h2>
        <p
          className="font-inter font-normal text-secondary-text mt-3 leading-[1.7]"
          style={{ fontSize: '1rem' }}
        >
          These are optional extras. The core pack is complete on its own. If you want to go further, add any of these at checkout.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          {upsells.map((u) => (
            <div
              key={u.title}
              className="bg-white border border-border rounded-2xl p-8 hover:border-medium-blue hover:shadow-[0_8px_32px_rgba(27,63,122,0.08)] transition-all duration-200"
            >
              <span
                className="inline-block bg-off-white border border-medium-blue rounded-full font-inter font-bold text-navy"
                style={{ padding: '4px 14px', fontSize: '0.9rem' }}
              >
                {u.price}
              </span>
              <h3 className="font-inter font-bold text-dark-text mt-4" style={{ fontSize: '1.1rem' }}>
                {u.title}
              </h3>
              <p
                className="font-inter font-normal text-secondary-text mt-2.5 leading-[1.65]"
                style={{ fontSize: '0.9rem' }}
              >
                {u.desc}
              </p>
              <div className="flex flex-col gap-2.5 mt-5">
                {u.features.map((f) => (
                  <div key={f} className="flex items-start gap-2.5">
                    <span className="text-medium-blue font-bold shrink-0">✓</span>
                    <span className="font-inter font-medium text-dark-text" style={{ fontSize: '0.875rem' }}>
                      {f}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQItem({ item, isOpen, onToggle }: { item: typeof faqs[number]; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-border py-5">
      <button
        className="flex items-center justify-between w-full text-left gap-4"
        onClick={onToggle}
      >
        <span className="font-inter font-semibold text-dark-text" style={{ fontSize: '1rem' }}>
          {item.q}
        </span>
        <ChevronDown
          size={20}
          className="text-secondary-text shrink-0 transition-transform duration-200"
          style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </button>
      <div
        className="overflow-hidden transition-all duration-300"
        style={{ maxHeight: isOpen ? 300 : 0 }}
      >
        <p
          className="font-inter font-normal text-secondary-text pt-3 leading-[1.7]"
          style={{ fontSize: '0.95rem' }}
        >
          {item.a}
        </p>
      </div>
    </div>
  );
}

function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="bg-white py-20 px-6">
      <div className="mx-auto" style={{ maxWidth: 760 }}>
        <SectionLabel>COMMON QUESTIONS</SectionLabel>
        <h2
          className="font-inter font-bold text-dark-text"
          style={{ fontSize: 'clamp(1.6rem, 2.8vw, 2.2rem)' }}
        >
          Questions about pricing
        </h2>

        <div className="mt-10">
          {faqs.map((faq, i) => (
            <FAQItem
              key={i}
              item={faq}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section
      className="text-center px-6"
      style={{
        padding: '80px 0',
        background: 'linear-gradient(135deg, #1B3F7A 0%, #2C68C4 100%)',
      }}
    >
      <div className="mx-auto" style={{ maxWidth: 700 }}>
        <h2
          className="font-inter font-bold text-white"
          style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)' }}
        >
          Ready to set up your business properly?
        </h2>
        <p
          className="font-inter font-normal mt-4 leading-[1.7]"
          style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.85)' }}
        >
          One questionnaire. One payment of £79. Ten documents delivered to your inbox within 24 hours.
        </p>
        <Link
          href="/checkout"
          className="inline-block font-inter font-bold text-navy bg-white rounded-lg hover:bg-[rgba(255,255,255,0.92)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.2)] transition-all duration-200 mt-10"
          style={{ padding: '18px 40px', fontSize: '1rem', minHeight: 48 }}
        >
          Get My Business Foundations Pack
        </Link>
      </div>
    </section>
  );
}

/* ─── main page ─── */

export default function PricingPage() {
  return (
    <>
      <PageHeader />
      <ComparisonSection />
      <MainPricingSection />
      <UpsellsSection />
      <FAQSection />
      <FinalCTA />
    </>
  );
}
