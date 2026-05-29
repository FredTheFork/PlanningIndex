'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Package, Clock, Fingerprint } from 'lucide-react';
import DocumentPreview from '@/components/ui/DocumentPreview';

/* ─── data ─── */

const sidebarItems = [
  { id: 'contract', label: '01 · Client Contract' },
  { id: 'terms', label: '02 · Terms & Conditions' },
  { id: 'gdpr', label: '03 · GDPR Privacy Policy' },
  { id: 'bio', label: '04 · Professional Bio' },
  { id: 'pitch', label: '05 · Elevator Pitch' },
  { id: 'linkedin', label: '06 · LinkedIn Profile Script' },
  { id: 'invoice', label: '07 · Invoice Template' },
  { id: 'welcome', label: '08 · Welcome Email Sequence' },
  { id: 'latepayment', label: '09 · Late Payment Letters' },
  { id: 'servicesheets', label: '10 · Service Description Sheets' },
];

const documents = [
  {
    id: 'contract',
    num: '01',
    title: 'Bespoke Client Contract / Service Agreement',
    hook: 'The document that protects every piece of work you do.',
    bg: '#FFFFFF',
    covered: [
      'Scope of services — exactly what you will and won\'t do',
      'Deliverables and timelines specific to your offering',
      'Payment terms, schedules, and deposit arrangements',
      'Intellectual property ownership before and after payment',
      'Limitation of liability capped at total fees paid',
      'Termination conditions and notice periods',
      'Dispute resolution process (mediation before litigation)',
      'Confidentiality obligations on both sides',
      'Force majeure clause',
      'Entire agreement and jurisdiction clause (England & Wales or Scotland)',
    ],
    why: 'A verbal agreement or WhatsApp message is not a contract in any meaningful sense. Without a signed service agreement, every engagement you enter is on a handshake — which means no enforceable scope, no enforceable payment terms, and no legal standing if a client disputes, underpays, or simply disappears. Your contract is the document you point to when things go wrong. It has to be right before things go wrong — not after.',
    risk: 'Clients dispute scope. Invoices go unpaid with no legal remedy. Work is delivered but not paid for. You have no mechanism to recover fees or protect your intellectual property.',
  },
  {
    id: 'terms',
    num: '02',
    title: 'Terms & Conditions',
    hook: 'Your operating rulebook — clear, enforceable, and entirely yours.',
    bg: '#F0F4FF',
    covered: [
      'Payment schedules and due dates',
      'Late payment remedies under the Late Payment of Commercial Debts Act 1998',
      'Statutory interest entitlement: 8% above Bank of England base rate',
      'Refund and cancellation policy',
      'Client responsibilities and obligations',
      'Acceptable use of your services',
      'Intellectual property licensing terms',
      'How and when terms can be varied',
      'Limitation of liability',
    ],
    why: 'Your Terms & Conditions set the rules of every engagement before you start. They sit alongside your contract and remove ambiguity from the most common friction points: when payment is due, what happens when it\'s late, and what the client is and isn\'t entitled to. Including the Late Payment of Commercial Debts Act 1998 statutory interest clause is one of the most effective deterrents against slow payers — most clients will pay on time simply because they know the legal consequences of not doing so.',
    risk: 'Clients dispute refund requests with no written policy to refer to. Late payment becomes a negotiation rather than a legal matter. There is no agreed framework for resolving disagreements.',
  },
  {
    id: 'gdpr',
    num: '03',
    title: 'GDPR Privacy Policy',
    hook: 'ICO-compliant, specific to your business — not a copy-paste from the internet.',
    bg: '#FFFFFF',
    covered: [
      'Your identity and contact details as the data controller',
      'What personal data you collect (specific to your actual activities)',
      'How you collect it (forms, email, calls, payment processors)',
      'Your lawful basis for processing under UK GDPR',
      'What you use the data for — purpose-by-purpose',
      'How long you retain it and why',
      'Security measures you have in place',
      'Third-party processors you use (e.g. Xero, Mailchimp, Google Drive)',
      'All eight data subject rights explained plainly',
      'How to lodge a complaint with the ICO',
    ],
    why: 'The moment you collect a client\'s name and email address, you are processing personal data under UK GDPR. A privacy policy is not optional — it is a legal requirement, and the ICO has fined businesses of all sizes for non-compliance. What makes our policy different from the generic templates available online is that it references your actual data processing activities — the specific tools you use, the specific data you collect, and your specific retention period. A policy that doesn\'t match your real practices is as problematic as having no policy at all.',
    risk: 'You are legally exposed to ICO enforcement action. Clients who ask to see your privacy policy — as is their right — find nothing. Any data subject access request arrives with no process in place to handle it.',
  },
  {
    id: 'bio',
    num: '04',
    title: 'Professional Bio',
    hook: 'Two versions. One for your website. One for everywhere else.',
    bg: '#F0F4FF',
    covered: [
      '150-word version for websites, proposals, and press',
      '50-word version for social media bios and email signatures',
      'Written in your stated tone of voice throughout',
      'Highlights your relevant experience and qualifications',
      'Positions your unique value clearly',
      'Built around what your ideal clients actually care about',
      'Avoids clichés, jargon, and generic language',
    ],
    why: 'Most sole traders write their own bio in ten minutes and never change it. It is almost always too long, too vague, too focused on what they do rather than who they help and what those people gain. Your professional bio is read by prospective clients before they ever speak to you — it forms their first impression of your credibility. A bio that positions you precisely is one of the highest-leverage pieces of writing your business has.',
    risk: 'You copy-paste something you wrote three years ago. You undersell your experience. Prospects read it and cannot immediately understand what you do or whether you are the right person for them.',
  },
  {
    id: 'pitch',
    num: '05',
    title: 'Elevator Pitch (3 Versions)',
    hook: "Never stumble over 'so what do you do?' again.",
    bg: '#FFFFFF',
    covered: [
      '30-second spoken version for quick introductions and networking',
      '2-minute spoken version for calls, discovery meetings, and events',
      'Written version optimised for emails, proposals, and LinkedIn messages',
      'All three versions: what you do, who you serve, the outcome you deliver, the differentiator, and a natural call to action',
      'Calibrated to your stated tone — formal, warm, or direct',
    ],
    why: 'An elevator pitch is not a script you memorise. It is a clear mental model of your own value that you can express naturally in any context. The problem is that most sole traders have never been forced to articulate this with any precision — which means every networking conversation, every discovery call, and every chance encounter with a potential client begins with something vague. Your three pitch versions give you a framework to work from, not a word-for-word script. Within a few uses they become instinctive.',
    risk: 'You give a different, improvised answer every time someone asks what you do. You undersell on calls. You lose prospects in the first 30 seconds because they cannot immediately understand the value you offer.',
  },
  {
    id: 'linkedin',
    num: '06',
    title: 'LinkedIn Profile Optimisation Script',
    hook: 'Ready to copy-paste directly into your profile.',
    bg: '#F0F4FF',
    covered: [
      'Optimised headline using proven formula: Role | Who You Help | Outcome',
      "Full 'About' section (2,600 character maximum used strategically)",
      'Experience section descriptions for current and relevant past roles',
      'Featured section guidance — what to pin and why',
      'Keyword integration for search visibility in your niche',
      'Consistent with your Professional Bio and Elevator Pitch throughout',
    ],
    why: "LinkedIn is the primary discovery platform for UK freelancers and service providers. Your headline is visible in every search result, every comment, and every connection request you appear in. A poorly written headline — one that says 'Virtual Assistant' instead of 'VA for e-commerce founders | Inbox & calendar management so you can run your business, not your inbox' — is simply invisible to the people looking for exactly what you offer. The About section has 2,600 characters available. Most people use fewer than 300. That gap is where your competitors are not competing.",
    risk: 'Your LinkedIn profile undersells you to every person who looks you up before a call. Potential clients who search for your services find someone else first.',
  },
  {
    id: 'invoice',
    num: '07',
    title: 'Professional Invoice Template',
    hook: 'UK-formatted, VAT-ready, and built to get you paid on time.',
    bg: '#FFFFFF',
    covered: [
      'Your business name, address, and contact details pre-populated',
      'Sequential invoice number field',
      'Issue date and payment due date fields',
      'Itemised service description and amount fields',
      'Payment methods section with your bank/payment details',
      'Late payment interest notice (statutory wording, Late Payment Act 1998)',
      'VAT number and VAT breakdown section (if registered)',
      'Optional: purchase order field, notes section, signature field',
      'Your brand colours applied to the header',
      'Delivered as PDF (professional presentation) and editable Word/Excel format',
    ],
    why: 'An invoice is not just a payment request — it is a legally relevant document. The wording matters. An invoice without a due date is an invoice with no enforceable deadline. An invoice without the statutory late payment interest notice is an invoice that signals to the client that late payment has no consequence. The difference between a correctly worded invoice and a casual one is often the difference between being paid on time and chasing for six weeks.',
    risk: 'Clients treat your invoice as a loose request rather than a binding demand. Payment terms are unclear. Late payment interest cannot be claimed because it was never notified.',
  },
  {
    id: 'welcome',
    num: '08',
    title: 'New Client Welcome Email Sequence (×3)',
    hook: 'The onboarding experience that makes you look like an agency.',
    bg: '#F0F4FF',
    covered: [
      'Email 1 — Immediate welcome on project confirmation: warmly confirms the engagement, sets out next steps, establishes the professional tone for the relationship',
      'Email 2 — Contract and onboarding: delivers the contract for signature, outlines the process, requests anything you need from the client to begin',
      'Email 3 — Value-add follow-up: shares something genuinely useful (how to get the most from working with you, resources, or a useful insight), reinforces confidence in the decision to hire you',
      'All three written in your tone of voice',
      'Personalised to your services and onboarding process',
      'Professional signatures and formatting throughout',
    ],
    why: "The client's emotional experience in the first 48 hours after hiring you determines whether they become a long-term client or a one-time transaction. Most sole traders send a brief 'great, looking forward to working with you' message and get straight to work. A structured welcome sequence communicates that you are organised, professional, and that hiring you was the right decision. It also dramatically reduces the confusion and back-and-forth that plagues the beginning of most freelance engagements.",
    risk: 'New clients feel uncertain about what happens next. You answer the same onboarding questions repeatedly. The first impression is of someone who is winging it, not someone who runs a professional operation.',
  },
  {
    id: 'latepayment',
    num: '09',
    title: 'Late Payment Letter Sequence (×3)',
    hook: 'From friendly reminder to Letter Before Action — legally sound at every stage.',
    bg: '#FFFFFF',
    covered: [
      'Letter 1 — Friendly reminder: references the original invoice, states the amount overdue, gives a new due date, maintains goodwill',
      'Letter 2 — Formal demand: formally requests payment, references your agreed terms, states your intention to apply statutory interest under the Late Payment of Commercial Debts Act 1998',
      'Letter 3 — Letter Before Action (LBA): formally notifies the client of your intention to pursue recovery through the courts or a debt recovery agency if payment is not received within 7 days, references all previous correspondence',
      'All three pre-filled with your business details and correct legal wording',
      'Correct jurisdiction and legal references for England & Wales or Scotland',
      'Professional tone that protects the business relationship where possible',
    ],
    why: 'A Letter Before Action is a formal legal document. Its wording signals to the recipient — and to any court or mediator — that you understand your legal position and are prepared to enforce it. An LBA that is vague, lacks the correct legal references, or makes threats you cannot follow through on is worse than not sending one. Our sequence escalates methodically — starting with a tone that preserves the relationship and ending with language that makes the consequence of non-payment unmistakably clear.',
    risk: 'You send an awkward, improvised chase email. The client delays. You send another. The relationship deteriorates and the money still does not arrive. Without an LBA, you have no documented evidence that you pursued recovery before taking legal action.',
  },
  {
    id: 'servicesheets',
    num: '10',
    title: 'Service Description Sheets',
    hook: 'One page per service. Every question answered before they ask it.',
    bg: '#F0F4FF',
    covered: [
      'Service name and a single clear description paragraph',
      'What is specifically included — in plain, unambiguous language',
      'What is NOT included — the boundary that prevents scope creep',
      'Who this service is for (the ideal client profile)',
      'Expected outcome or result the client achieves',
      'Typical timeline or engagement duration',
      'Process overview — what happens, in what order',
      'Starting price (optional — can be left blank)',
      'Professionally formatted and branded, ready to email or print',
    ],
    why: "A service description sheet does two things simultaneously: it helps prospects self-qualify before they contact you (saving you time on calls with poor-fit clients), and it pre-empts the scope creep that starts the moment a client misunderstands what they have actually purchased. When 'graphic design included' is written into the brief in a client's mind but not in your agreement, you are going to have a difficult conversation. When your service sheet explicitly states 'graphic design is not included', that conversation never needs to happen.",
    risk: 'Clients have inflated expectations going in. Scope creep begins before the work does. You spend time and energy correcting misunderstandings that a one-page document would have pre-empted entirely.',
  },
];

/* ─── sub-components ─── */

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
          WHAT&rsquo;S INCLUDED
        </span>
        <h1
          className="font-inter font-extrabold text-white mt-3"
          style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', lineHeight: 1.2 }}
        >
          Every document. Explained in full.
        </h1>
        <p
          className="font-inter font-normal mx-auto mt-4 leading-[1.7]"
          style={{
            fontSize: '1.05rem',
            color: 'rgba(255,255,255,0.85)',
            maxWidth: 580,
          }}
        >
          This is exactly what lands in your inbox within 24 hours of submitting your questionnaire. Ten documents, built entirely around your business.
        </p>
        <Link
          href="/checkout"
          className="inline-block font-inter font-bold text-navy bg-white rounded-lg hover:bg-[rgba(255,255,255,0.92)] transition-colors duration-200 mt-9"
          style={{ padding: '16px 36px', fontSize: '1rem', minHeight: 48 }}
        >
          Get My Pack — £79
        </Link>
      </div>
    </section>
  );
}

function IntroOverview() {
  const cards = [
    {
      icon: Package,
      title: 'What you receive',
      text: 'Every file is delivered as both a polished PDF ready to send, and an editable Word document (.docx) so you can make updates yourself in future.',
    },
    {
      icon: Clock,
      title: 'When you receive it',
      text: 'Within 24 hours of submitting your questionnaire. You fill in the form. We do the rest. No calls, no back-and-forth, no waiting.',
    },
    {
      icon: Fingerprint,
      title: 'How it\'s personalised',
      text: 'Every document is generated from your questionnaire answers — your services, your payment terms, your clients, your voice. Nothing generic leaves our system.',
    },
  ];

  return (
    <section className="bg-off-white py-16 px-6">
      <div className="mx-auto" style={{ maxWidth: 960 }}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((c) => (
            <div key={c.title} className="bg-white rounded-xl border border-border p-7">
              <c.icon size={28} className="text-medium-blue" />
              <h3 className="font-inter font-semibold text-dark-text mt-4" style={{ fontSize: '1rem' }}>
                {c.title}
              </h3>
              <p className="font-inter font-normal text-secondary-text mt-2 leading-[1.6]" style={{ fontSize: '0.9rem' }}>
                {c.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DocumentSection({ doc }: { doc: typeof documents[number] }) {
  return (
    <section
      id={doc.id}
      className="py-20 px-6"
      style={{ background: doc.bg }}
    >
      <div className="mx-auto" style={{ maxWidth: 960 }}>
        {/* Header row */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-white font-inter font-bold shrink-0"
              style={{
                fontSize: '1rem',
                background: 'linear-gradient(135deg, #1B3F7A, #2C68C4)',
              }}
            >
              {doc.num}
            </div>
            <h2
              className="font-inter font-bold text-dark-text mt-4"
              style={{ fontSize: 'clamp(1.4rem, 2.5vw, 1.9rem)' }}
            >
              {doc.title}
            </h2>
            <p
              className="font-inter font-normal italic text-secondary-text mt-2"
              style={{ fontSize: '1rem' }}
            >
              {doc.hook}
            </p>
          </div>
          <div className="hidden md:block shrink-0">
            <span
              className="inline-block bg-off-white border border-medium-blue rounded-full font-inter font-medium text-navy"
              style={{ padding: '6px 14px', fontSize: '0.8rem' }}
            >
              Included in all packs
            </span>
          </div>
        </div>

        <div className="border-t border-border my-7" />

        {/* Two-column: what's covered + why it matters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <span
              className="font-inter font-semibold text-medium-blue uppercase block mb-4"
              style={{ fontSize: '0.7rem', letterSpacing: '0.15em' }}
            >
              WHAT&rsquo;S COVERED
            </span>
            <div className="flex flex-col gap-3">
              {doc.covered.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-success font-bold shrink-0">✓</span>
                  <span className="font-inter font-medium text-dark-text" style={{ fontSize: '0.9rem' }}>
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <span
              className="font-inter font-semibold text-medium-blue uppercase block mb-4"
              style={{ fontSize: '0.7rem', letterSpacing: '0.15em' }}
            >
              WHY IT MATTERS
            </span>
            <p className="font-inter font-normal text-secondary-text leading-[1.7]" style={{ fontSize: '0.95rem' }}>
              {doc.why}
            </p>
          </div>
        </div>

        {/* Risk strip */}
        <div
          className="mt-8 border border-border rounded-[10px] p-5"
          style={{ background: doc.bg === '#FFFFFF' ? '#F0F4FF' : '#FFFFFF' }}
        >
          <span
            className="font-inter font-semibold uppercase block mb-2"
            style={{ fontSize: '0.7rem', letterSpacing: '0.15em', color: '#E53E3E' }}
          >
            WHAT HAPPENS WITHOUT IT
          </span>
          <p className="font-inter font-normal text-secondary-text leading-[1.6]" style={{ fontSize: '0.9rem' }}>
            {doc.risk}
          </p>
        </div>

        {/* Document Preview */}
        <DocumentPreview
          documentId={doc.id}
          documentTitle={doc.title}
          documentNumber={doc.num}
        />
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
          All ten documents. Your business. 24 hours.
        </h2>
        <p
          className="font-inter font-normal mt-4 leading-[1.7]"
          style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.85)' }}
        >
          One questionnaire. One payment. Everything set up properly.
        </p>
        <Link
          href="/checkout"
          className="inline-block font-inter font-bold text-navy bg-white rounded-lg hover:bg-[rgba(255,255,255,0.92)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.2)] transition-all duration-200 mt-10"
          style={{ padding: '18px 40px', fontSize: '1rem', minHeight: 48 }}
        >
          Get My Business Foundations Pack — £79
        </Link>
        <p
          className="font-inter font-normal mt-4"
          style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}
        >
          Includes all 10 documents · PDF + editable Word formats · Delivered within 24 hours
        </p>
      </div>
    </section>
  );
}

/* ─── main page ─── */

export default function WhatsIncludedPage() {
  const [activeId, setActiveId] = useState('');
  const sectionsRef = useRef(null);

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: '-88px 0px -50% 0px', threshold: 0 }
    );

    documents.forEach((doc) => {
      const el = document.getElementById(doc.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleNavClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 88;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Mobile: header then pill nav then content */}
      {/* Desktop: two-column layout — sidebar left, content right */}
      <div className="lg:flex">
        {/* Desktop sticky sidebar — flush to top, full height */}
        <div className="hidden lg:block sticky top-0 h-screen shrink-0 bg-white border-r border-border overflow-y-auto"
          style={{ width: 220 }}
        >
          <div style={{ paddingTop: 88 }}>
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className="block w-full text-left font-inter transition-colors duration-150"
                style={{
                  padding: activeId === item.id ? '10px 20px 10px 17px' : '10px 20px',
                  fontSize: '0.85rem',
                  fontWeight: activeId === item.id ? 600 : 500,
                  color: activeId === item.id ? '#1B3F7A' : '#4A5568',
                  background: activeId === item.id ? '#F0F4FF' : 'transparent',
                  borderLeft: activeId === item.id ? '3px solid #2C68C4' : '3px solid transparent',
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Right content area */}
        <div className="flex-1 min-w-0">
          <PageHeader />

          {/* Mobile sticky pill nav */}
          <div
            className="lg:hidden sticky z-40 bg-white border-b border-border flex overflow-x-auto gap-3"
            style={{ top: 64, padding: '12px 16px' }}
          >
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className="shrink-0 font-inter whitespace-nowrap rounded-full border transition-colors duration-150"
                style={{
                  padding: '8px 16px',
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  color: activeId === item.id ? '#FFFFFF' : '#4A5568',
                  background: activeId === item.id ? '#1B3F7A' : '#FFFFFF',
                  borderColor: activeId === item.id ? '#1B3F7A' : '#E2E8F0',
                }}
              >
                {item.label}
              </button>
            ))}
          </div>

          <IntroOverview />
          {documents.map((doc) => (
            <DocumentSection key={doc.id} doc={doc} />
          ))}
          <FinalCTA />
        </div>
      </div>
    </>
  );
}
