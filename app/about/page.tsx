import Link from 'next/link';
import { Metadata } from 'next';
import { JsonLd } from '@/components/seo';
import { generateBreadcrumbSchema, SITE_URL } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'About | Foundationary - UK Sole Trader Document Service',
  description: 'Professional foundations for UK sole traders who want to operate properly - without templates, solicitors on retainer, or ongoing complexity. Learn about our mission and approach.',
  keywords: 'Foundationary about, sole trader document service UK, business foundations company, who we are',
  openGraph: {
    title: 'About Foundationary | Professional Documents for UK Sole Traders',
    description: 'We help UK sole traders operate properly with professional business documents - no templates, no solicitors, no complexity.',
    url: `${SITE_URL}/about`,
    images: [{ url: `${SITE_URL}/og/about.png`, width: 1200, height: 630 }],
  },
  alternates: {
    canonical: `${SITE_URL}/about`,
  },
};

/* ─── shared ─── */

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

/* ─── 1. Hero Section ─── */

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
          ABOUT FOUNDATIONARY
        </span>
        <h1
          className="font-inter font-extrabold text-white mt-3"
          style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', lineHeight: 1.2 }}
        >
          Professional foundations for businesses that don't want to wing it.
        </h1>
        <p
          className="font-inter font-normal mx-auto mt-4 leading-[1.7]"
          style={{
            fontSize: '1.05rem',
            color: 'rgba(255,255,255,0.85)',
            maxWidth: 620,
          }}
        >
          Foundationary exists for UK sole traders who want to operate properly — without pretending they're a corporation, hiring a solicitor on retainer, or spending weeks stitching together templates from the internet.
        </p>
        <p
          className="font-inter font-normal mx-auto mt-5 leading-[1.7]"
          style={{
            fontSize: '1.05rem',
            color: 'rgba(255,255,255,0.85)',
            maxWidth: 620,
          }}
        >
          This is not a platform. It's not a tool. It's a done-for-you service that quietly fixes the operational gaps most small businesses don't realise they have — until something goes wrong.
        </p>
      </div>
    </section>
  );
}

/* ─── 2. Immediate Clarity Strip ─── */

function ClarityStrip() {
  return (
    <section className="bg-off-white py-16 px-6">
      <div className="mx-auto text-center" style={{ maxWidth: 680 }}>
        <p
          className="font-inter font-semibold text-navy leading-[1.7]"
          style={{ fontSize: '1.15rem' }}
        >
          What we believe is simple:
        </p>
        <p
          className="font-inter font-bold text-dark-text mt-4 leading-[1.6]"
          style={{ fontSize: '1.25rem' }}
        >
          Running a small business shouldn't mean running unnecessary risks.
        </p>
        <p
          className="font-inter font-normal text-secondary-text mt-5 mx-auto leading-[1.7]"
          style={{ fontSize: '1rem', maxWidth: 560 }}
        >
          Most sole traders are skilled at what they do. Very few were ever shown how to protect themselves contractually, communicate professionally, or set clear boundaries — all while staying human.
        </p>
        <p
          className="font-inter font-semibold text-navy mt-5"
          style={{ fontSize: '1rem' }}
        >
          Foundationary exists to solve that exact problem.
        </p>
      </div>
    </section>
  );
}

/* ─── 3. The Problem We Saw ─── */

const realityItems = [
  'Work agreed over email or WhatsApp',
  'Invoices sent without consequences',
  'Services explained verbally, differently each time',
  'Privacy policies copied from Google',
  'LinkedIn bios written in a rush three years ago',
];

const riskItems = [
  'Scope disputes',
  'Late or unpaid invoices',
  'GDPR exposure',
  'Inconsistent professionalism',
  'Lost trust before the first call',
];

const costItems = [
  'Time wasted chasing',
  'Money written off',
  'Stress you normalise',
  'Opportunities you never see',
];

function ProblemDiagram() {
  return (
    <section className="bg-white py-24 px-6">
      <div className="mx-auto" style={{ maxWidth: 1000 }}>
        <SectionLabel>THE PROBLEM WE SAW</SectionLabel>
        <h2
          className="font-inter font-bold text-dark-text"
          style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)' }}
        >
          The reality for most sole traders
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {/* Reality */}
          <div className="bg-off-white rounded-2xl p-8">
            <h3 className="font-inter font-bold text-dark-text mb-5" style={{ fontSize: '1rem' }}>
              Reality
            </h3>
            <ul className="flex flex-col gap-3">
              {realityItems.map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <span className="text-secondary-text font-bold shrink-0" style={{ fontSize: '0.85rem' }}>—</span>
                  <span className="font-inter font-medium text-secondary-text" style={{ fontSize: '0.9rem' }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Hidden Risk */}
          <div className="bg-off-white rounded-2xl p-8 border-2 border-danger/20">
            <h3 className="font-inter font-bold text-danger mb-5" style={{ fontSize: '1rem' }}>
              The Hidden Risk
            </h3>
            <ul className="flex flex-col gap-3">
              {riskItems.map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <span className="text-danger font-bold shrink-0" style={{ fontSize: '0.85rem' }}>!</span>
                  <span className="font-inter font-medium text-dark-text" style={{ fontSize: '0.9rem' }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Cost */}
          <div className="bg-off-white rounded-2xl p-8">
            <h3 className="font-inter font-bold text-dark-text mb-5" style={{ fontSize: '1rem' }}>
              The Cost
            </h3>
            <ul className="flex flex-col gap-3">
              {costItems.map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <span className="text-secondary-text font-bold shrink-0" style={{ fontSize: '0.85rem' }}>—</span>
                  <span className="font-inter font-medium text-secondary-text" style={{ fontSize: '0.9rem' }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p
          className="font-inter font-medium text-navy mt-10 text-center leading-[1.7]"
          style={{ fontSize: '1rem', maxWidth: 600, marginLeft: 'auto', marginRight: 'auto' }}
        >
          None of this happens because people are careless. It happens because nobody ever gave sole traders a proper operating system.
        </p>
      </div>
    </section>
  );
}

/* ─── 4. Why Foundationary Exists ─── */

function WhyWeExist() {
  return (
    <section className="bg-off-white py-24 px-6">
      <div className="mx-auto" style={{ maxWidth: 720 }}>
        <SectionLabel>WHY WE EXIST</SectionLabel>
        <h2
          className="font-inter font-bold text-dark-text"
          style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)' }}
        >
          We didn't set out to "disrupt" anything.
        </h2>
        <p
          className="font-inter font-normal text-secondary-text mt-5 leading-[1.7]"
          style={{ fontSize: '1rem' }}
        >
          Foundationary was built after seeing the same pattern repeat over and over again:
        </p>
        <p
          className="font-inter font-semibold text-dark-text mt-4 leading-[1.7]"
          style={{ fontSize: '1.05rem' }}
        >
          Talented freelancers and service providers doing excellent work — while quietly exposing themselves to legal, financial, and reputational risk.
        </p>
        <p
          className="font-inter font-normal text-secondary-text mt-4 leading-[1.7]"
          style={{ fontSize: '1rem' }}
        >
          Not because they didn't care. But because every solution available to them was wrong for their reality.
        </p>

        <div className="flex flex-col gap-4 mt-8">
          {[
            { label: 'Solicitors', desc: 'expensive and over-engineered' },
            { label: 'Templates', desc: 'generic and legally fragile' },
            { label: 'AI tools', desc: 'fast, but unchecked' },
            { label: 'DIY solutions', desc: 'relied on confidence people didn\'t have' },
          ].map((item) => (
            <div key={item.label} className="flex items-start gap-3">
              <span className="text-danger font-bold shrink-0" style={{ fontSize: '0.9rem' }}>✕</span>
              <p className="font-inter font-medium text-dark-text" style={{ fontSize: '0.95rem' }}>
                <span className="font-semibold">{item.label}</span>
                <span className="text-secondary-text"> were {item.desc}</span>
              </p>
            </div>
          ))}
        </div>

        <p
          className="font-inter font-bold text-navy mt-8 leading-[1.7]"
          style={{ fontSize: '1.05rem' }}
        >
          So we built something different.
        </p>
      </div>
    </section>
  );
}

/* ─── 5. What Makes Foundationary Different ─── */

const usualItems = [
  'Generic templates',
  'One-size-fits-all wording',
  'US-centric legal language',
  'No human review',
  'Tools that assume you know what you\'re doing',
];

const differentItems = [
  'Built from your answers',
  'UK-specific legal frameworks',
  'Plain-English where possible',
  'Reviewed by a human',
  'Delivered ready to use',
];

function ComparisonBlock() {
  return (
    <section className="bg-white py-24 px-6">
      <div className="mx-auto" style={{ maxWidth: 960 }}>
        <SectionLabel>WHAT MAKES US DIFFERENT</SectionLabel>
        <h2
          className="font-inter font-bold text-dark-text"
          style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)' }}
        >
          Side-by-side clarity
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          {/* What usually exists */}
          <div className="bg-off-white rounded-2xl p-8">
            <h3 className="font-inter font-bold text-secondary-text mb-5" style={{ fontSize: '1rem' }}>
              What usually exists
            </h3>
            <ul className="flex flex-col gap-3">
              {usualItems.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="text-secondary-text font-bold shrink-0" style={{ fontSize: '0.85rem' }}>✕</span>
                  <span className="font-inter font-medium text-secondary-text" style={{ fontSize: '0.925rem' }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* What Foundationary does */}
          <div className="bg-off-white rounded-2xl p-8 border-2 border-success/20">
            <h3 className="font-inter font-bold text-dark-text mb-5" style={{ fontSize: '1rem' }}>
              What Foundationary does
            </h3>
            <ul className="flex flex-col gap-3">
              {differentItems.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="text-success font-bold shrink-0" style={{ fontSize: '0.85rem' }}>✓</span>
                  <span className="font-inter font-medium text-dark-text" style={{ fontSize: '0.925rem' }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p
          className="font-inter font-semibold text-navy mt-8 text-center leading-[1.7]"
          style={{ fontSize: '1rem' }}
        >
          This isn't automation for the sake of speed. It's structured work done properly — once.
        </p>
      </div>
    </section>
  );
}

/* ─── 6. How We Actually Work ─── */

const processSteps = [
  {
    num: '1',
    title: 'You explain your business',
    desc: 'You complete a structured questionnaire that captures:',
    items: ['What you do', 'How you work', 'How you charge', 'How you handle data', 'How you want to sound'],
  },
  {
    num: '2',
    title: 'We generate each asset individually',
    desc: 'Every document is created separately using prompts designed for:',
    items: ['UK sole traders', 'Service-based businesses', 'Real-world edge cases'],
  },
  {
    num: '3',
    title: 'Human review & consistency checks',
    desc: 'We check for:',
    items: ['Conflicting terms', 'Legal red flags', 'Tone mismatches', 'Structural clarity'],
  },
  {
    num: '4',
    title: 'Delivery',
    desc: 'You receive:',
    items: ['Branded PDFs', 'Editable Word documents', 'One coherent system'],
  },
];

function ProcessTransparency() {
  return (
    <section className="bg-off-white py-24 px-6">
      <div className="mx-auto" style={{ maxWidth: 960 }}>
        <SectionLabel>HOW WE ACTUALLY WORK</SectionLabel>
        <h2
          className="font-inter font-bold text-dark-text"
          style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)' }}
        >
          Behind every document is intent.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          {processSteps.map((step) => (
            <div
              key={step.num}
              className="bg-white rounded-2xl border border-border p-8"
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white font-inter font-bold shrink-0"
                  style={{
                    fontSize: '0.85rem',
                    background: 'linear-gradient(135deg, #1B3F7A, #2C68C4)',
                  }}
                >
                  {step.num}
                </div>
                <h3 className="font-inter font-semibold text-dark-text" style={{ fontSize: '1.05rem' }}>
                  {step.title}
                </h3>
              </div>
              <p className="font-inter font-normal text-secondary-text" style={{ fontSize: '0.9rem' }}>
                {step.desc}
              </p>
              <ul className="flex flex-col gap-2 mt-3">
                {step.items.map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <span className="text-medium-blue font-bold shrink-0" style={{ fontSize: '0.8rem' }}>→</span>
                    <span className="font-inter font-medium text-dark-text" style={{ fontSize: '0.875rem' }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p
          className="font-inter font-semibold text-navy mt-8 text-center leading-[1.7]"
          style={{ fontSize: '0.95rem' }}
        >
          Nothing stitched together. Nothing guessed.
        </p>
      </div>
    </section>
  );
}

/* ─── 7. Design Philosophy ─── */

const feelItems = ['Calm', 'Clear', 'Structured', 'Human'];
const avoidItems = ['Legal intimidation', 'Corporate posturing', 'Aggressive sales language', 'Artificial urgency'];

function DesignPhilosophy() {
  return (
    <section className="bg-white py-24 px-6">
      <div className="mx-auto" style={{ maxWidth: 720 }}>
        <SectionLabel>OUR DESIGN PHILOSOPHY</SectionLabel>
        <h2
          className="font-inter font-bold text-dark-text"
          style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)' }}
        >
          Professional does not mean cold.
        </h2>
        <p
          className="font-inter font-normal text-secondary-text mt-4 leading-[1.7]"
          style={{ fontSize: '1rem' }}
        >
          Foundationary is intentionally designed to feel:
        </p>

        <div className="flex flex-wrap gap-3 mt-6">
          {feelItems.map((item) => (
            <span
              key={item}
              className="bg-off-white border border-medium-blue rounded-full font-inter font-semibold text-navy"
              style={{ padding: '8px 20px', fontSize: '0.95rem' }}
            >
              {item}
            </span>
          ))}
        </div>

        <p
          className="font-inter font-normal text-secondary-text mt-8 leading-[1.7]"
          style={{ fontSize: '1rem' }}
        >
          We avoid:
        </p>

        <div className="flex flex-col gap-3 mt-4">
          {avoidItems.map((item) => (
            <div key={item} className="flex items-start gap-3">
              <span className="text-secondary-text font-bold shrink-0" style={{ fontSize: '0.85rem' }}>✕</span>
              <span className="font-inter font-medium text-secondary-text" style={{ fontSize: '0.95rem' }}>{item}</span>
            </div>
          ))}
        </div>

        <p
          className="font-inter font-semibold text-navy mt-8 leading-[1.7]"
          style={{ fontSize: '1rem' }}
        >
          Because most sole traders don't need hype. They need relief.
        </p>
      </div>
    </section>
  );
}

/* ─── 8. Who Foundationary Is For (And Isn't) ─── */

const forYouItems = [
  'You sell services',
  'You work independently or as a micro-business',
  'You want clarity, not complexity',
  'You value professionalism',
  'You don\'t want ongoing subscriptions',
];

const notForYouItems = [
  'You want legal advice instead of documents',
  'You\'re running a large incorporated company',
  'You want to customise every clause yourself',
  'You\'re looking for a DIY tool',
];

function WhoItsFor() {
  return (
    <section className="bg-off-white py-24 px-6">
      <div className="mx-auto" style={{ maxWidth: 960 }}>
        <SectionLabel>WHO THIS IS FOR</SectionLabel>
        <h2
          className="font-inter font-bold text-dark-text"
          style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)' }}
        >
          This matters.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          <div className="bg-white rounded-2xl p-8 border border-border">
            <h3 className="font-inter font-bold text-dark-text mb-5" style={{ fontSize: '1.05rem' }}>
              Foundationary is for you if:
            </h3>
            <ul className="flex flex-col gap-3">
              {forYouItems.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="text-success font-bold shrink-0">✓</span>
                  <span className="font-inter font-medium text-dark-text" style={{ fontSize: '0.925rem' }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white rounded-2xl p-8 border border-border">
            <h3 className="font-inter font-bold text-secondary-text mb-5" style={{ fontSize: '1.05rem' }}>
              Foundationary is not for you if:
            </h3>
            <ul className="flex flex-col gap-3">
              {notForYouItems.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="text-danger font-bold shrink-0">✕</span>
                  <span className="font-inter font-medium text-secondary-text" style={{ fontSize: '0.925rem' }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p
          className="font-inter font-semibold text-navy mt-8 text-center"
          style={{ fontSize: '1rem' }}
        >
          We're very comfortable with that line.
        </p>
      </div>
    </section>
  );
}

/* ─── 9. The Ethics Behind the Product ─── */

const ethicsItems = [
  { label: 'One-time purchase', reason: 'because foundations shouldn\'t be rented' },
  { label: 'No upsell pressure', reason: 'because trust matters more' },
  { label: 'Optional add-ons only', reason: 'because the core stands alone' },
  { label: 'No false guarantees', reason: 'because honesty scales' },
];

function EthicsSection() {
  return (
    <section className="bg-white py-24 px-6">
      <div className="mx-auto" style={{ maxWidth: 720 }}>
        <SectionLabel>ETHICS</SectionLabel>
        <h2
          className="font-inter font-bold text-dark-text"
          style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)' }}
        >
          The ethics behind the product
        </h2>
        <p
          className="font-inter font-normal text-secondary-text mt-4 leading-[1.7]"
          style={{ fontSize: '1rem' }}
        >
          We deliberately made certain choices.
        </p>

        <div className="flex flex-col gap-4 mt-8">
          {ethicsItems.map((item) => (
            <div
              key={item.label}
              className="bg-off-white rounded-xl p-6 flex items-start gap-4"
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white font-inter font-bold shrink-0"
                style={{
                  fontSize: '0.8rem',
                  background: 'linear-gradient(135deg, #1B3F7A, #2C68C4)',
                }}
              >
                ✓
              </div>
              <p className="font-inter font-medium text-dark-text leading-[1.6]" style={{ fontSize: '0.95rem' }}>
                <span className="font-semibold">{item.label}</span>
                <span className="text-secondary-text"> — {item.reason}</span>
              </p>
            </div>
          ))}
        </div>

        <p
          className="font-inter font-normal text-secondary-text mt-8 leading-[1.7]"
          style={{ fontSize: '1rem' }}
        >
          We don't pretend documents solve everything. We make sure they don't cause problems.
        </p>
      </div>
    </section>
  );
}

/* ─── 10. What Success Looks Like ─── */

const successItems = [
  'Contracts sent confidently',
  'Clear boundaries before work starts',
  'Invoices taken seriously',
  'Clients understand what they\'re buying',
  'Less explaining, less chasing',
  'More calm',
];

function SuccessSection() {
  return (
    <section className="bg-off-white py-24 px-6">
      <div className="mx-auto" style={{ maxWidth: 720 }}>
        <SectionLabel>WHAT SUCCESS LOOKS LIKE</SectionLabel>
        <h2
          className="font-inter font-bold text-dark-text"
          style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)' }}
        >
          After Foundationary
        </h2>

        <div className="flex flex-col gap-4 mt-10">
          {successItems.map((item) => (
            <div
              key={item}
              className="bg-white rounded-xl border border-border p-5 flex items-center gap-4"
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white font-inter font-bold shrink-0"
                style={{
                  fontSize: '0.8rem',
                  background: 'linear-gradient(135deg, #38A169, #48BB78)',
                }}
              >
                ✓
              </div>
              <span className="font-inter font-medium text-dark-text" style={{ fontSize: '0.95rem' }}>
                {item}
              </span>
            </div>
          ))}
        </div>

        <p
          className="font-inter font-semibold text-navy mt-8 text-center leading-[1.7]"
          style={{ fontSize: '1rem' }}
        >
          This is not about growth hacks. It's about removing friction from your work.
        </p>
      </div>
    </section>
  );
}

/* ─── 11. Why We Don't Call Ourselves a Legal Service ─── */

function NotLegalService() {
  return (
    <section className="bg-white py-24 px-6">
      <div className="mx-auto" style={{ maxWidth: 720 }}>
        <SectionLabel>HONESTY</SectionLabel>
        <h2
          className="font-inter font-bold text-dark-text"
          style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)' }}
        >
          Why we don't call ourselves a legal service
        </h2>
        <p
          className="font-inter font-semibold text-secondary-text mt-4"
          style={{ fontSize: '1.05rem' }}
        >
          Because we're not one.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
          <div className="bg-off-white rounded-2xl p-8">
            <h3 className="font-inter font-bold text-dark-text mb-4" style={{ fontSize: '1rem' }}>
              Foundationary documents are:
            </h3>
            <ul className="flex flex-col gap-3">
              {['Professionally drafted', 'UK-specific', 'Practical'].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="text-success font-bold shrink-0">✓</span>
                  <span className="font-inter font-medium text-dark-text" style={{ fontSize: '0.925rem' }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-off-white rounded-2xl p-8">
            <h3 className="font-inter font-bold text-secondary-text mb-4" style={{ fontSize: '1rem' }}>
              They are not:
            </h3>
            <ul className="flex flex-col gap-3">
              {['Legal advice', 'A substitute for a solicitor', 'A guarantee against disputes'].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="text-danger font-bold shrink-0">✕</span>
                  <span className="font-inter font-medium text-secondary-text" style={{ fontSize: '0.925rem' }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p
          className="font-inter font-semibold text-navy mt-8 text-center"
          style={{ fontSize: '1rem' }}
        >
          And pretending otherwise would be dishonest.
        </p>
        <p
          className="font-inter font-bold text-dark-text mt-2 text-center"
          style={{ fontSize: '1.05rem' }}
        >
          Clarity beats bravado.
        </p>
      </div>
    </section>
  );
}

/* ─── 12. Trust & Responsibility ─── */

function TrustResponsibility() {
  return (
    <section className="bg-off-white py-20 px-6">
      <div className="mx-auto" style={{ maxWidth: 720 }}>
        <SectionLabel>TRUST & RESPONSIBILITY</SectionLabel>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="bg-white rounded-2xl border border-border p-8">
            <h3 className="font-inter font-bold text-dark-text mb-5" style={{ fontSize: '1rem' }}>
              We take responsibility for:
            </h3>
            <ul className="flex flex-col gap-3">
              {['Accuracy', 'Consistency', 'Professional standards'].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="text-success font-bold shrink-0">✓</span>
                  <span className="font-inter font-medium text-dark-text" style={{ fontSize: '0.925rem' }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white rounded-2xl border border-border p-8">
            <h3 className="font-inter font-bold text-dark-text mb-5" style={{ fontSize: '1rem' }}>
              You retain responsibility for:
            </h3>
            <ul className="flex flex-col gap-3">
              {['Using the documents correctly', 'Updating them as your business evolves', 'Seeking legal advice when required'].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="text-medium-blue font-bold shrink-0">→</span>
                  <span className="font-inter font-medium text-dark-text" style={{ fontSize: '0.925rem' }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p
          className="font-inter font-semibold text-navy mt-8 text-center"
          style={{ fontSize: '0.95rem' }}
        >
          That line is intentional — and respectful.
        </p>
      </div>
    </section>
  );
}

/* ─── 13. The Long-Term View ─── */

function LongTermView() {
  return (
    <section className="bg-white py-24 px-6">
      <div className="mx-auto text-center" style={{ maxWidth: 680 }}>
        <SectionLabel>THE LONG-TERM VIEW</SectionLabel>
        <p
          className="font-inter font-bold text-dark-text leading-[1.7]"
          style={{ fontSize: '1.2rem' }}
        >
          Most small businesses don't fail because they're bad at what they do.
        </p>
        <p
          className="font-inter font-bold text-navy mt-2 leading-[1.7]"
          style={{ fontSize: '1.2rem' }}
        >
          They fail because the basics were never set up properly.
        </p>
        <p
          className="font-inter font-normal text-secondary-text mt-6 mx-auto leading-[1.7]"
          style={{ fontSize: '1rem', maxWidth: 520 }}
        >
          We exist to fix that — quietly, efficiently, and without ego.
        </p>
      </div>
    </section>
  );
}

/* ─── 14. Final CTA ─── */

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
          Strong foundations change how you work.
        </h2>
        <p
          className="font-inter font-normal mt-4 leading-[1.7]"
          style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.85)' }}
        >
          If you want to stop improvising, look professional without pretending, and protect yourself without overthinking — Foundationary was built for you.
        </p>
        <Link
          href="/pricing"
          className="inline-block font-inter font-bold text-navy bg-white rounded-lg hover:bg-[rgba(255,255,255,0.92)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.2)] transition-all duration-200 mt-10"
          style={{ padding: '18px 40px', fontSize: '1rem', minHeight: 48 }}
        >
          Start with the Business Foundations Pack
        </Link>
        <p
          className="font-inter font-normal mt-4"
          style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.65)' }}
        >
          You can always add more later — but you won't need to.
        </p>
      </div>
    </section>
  );
}

/* ─── Main Page ─── */

export default function AboutPage() {
  const breadcrumbs = generateBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbs} />
      <PageHeader />
      <ClarityStrip />
      <ProblemDiagram />
      <WhyWeExist />
      <ComparisonBlock />
      <ProcessTransparency />
      <DesignPhilosophy />
      <WhoItsFor />
      <EthicsSection />
      <SuccessSection />
      <NotLegalService />
      <TrustResponsibility />
      <LongTermView />
      <FinalCTA />
    </>
  );
}
