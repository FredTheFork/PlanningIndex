import { Link } from 'react-router-dom';

/* ─── shared ─── */

function SectionLabel({ children }) {
  return (
    <span
      className="font-inter font-semibold text-medium-blue uppercase block mb-3"
      style={{ fontSize: '0.75rem', letterSpacing: '0.15em' }}
    >
      {children}
    </span>
  );
}

/* ─── 1. Page Header ─── */

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
          }}
        >
          ADDITIONAL SERVICES
        </span>
        <h1
          className="font-inter font-extrabold text-white mt-3"
          style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', lineHeight: 1.2 }}
        >
          Extend your foundations — only if you need to.
        </h1>
        <p
          className="font-inter font-normal mx-auto mt-4 leading-[1.7]"
          style={{
            fontSize: '1.05rem',
            color: 'rgba(255,255,255,0.85)',
            maxWidth: 560,
          }}
        >
          The Business Foundations Pack is complete on its own. These services are optional enhancements for businesses that want to go further.
        </p>
      </div>
    </section>
  );
}

/* ─── 2. Core Message Strip ─── */

function CoreMessage() {
  return (
    <section className="bg-off-white py-14 px-6">
      <p
        className="font-inter font-medium text-navy text-center mx-auto leading-[1.7]"
        style={{ fontSize: '1.1rem', maxWidth: 560 }}
      >
        No bundles. No pressure. Add any service only if it genuinely helps your business.
      </p>
    </section>
  );
}

/* ─── 3. Services Grid ─── */

const services = [
  {
    price: '£49 — one-time',
    title: 'Website Copy Starter Pack',
    desc: 'Professional website copy written in your voice, aligned with your services, and ready to paste into any website builder.',
    includes: [
      'Homepage (hero, benefits, CTA)',
      'About page',
      'Services page (aligned with your service sheets)',
      'Contact page',
    ],
    whoFor: 'Ideal if you\'re building or refreshing a website and want it to sound credible, clear, and professional.',
  },
  {
    price: '£49 — one-time',
    title: 'Social Media Starter Pack',
    desc: '30 done-for-you posts tailored to your industry, audience, and offer.',
    includes: [
      'Educational posts',
      'Promotional posts',
      'Personal / trust-building posts',
      'Captions, hashtag suggestions, image prompts',
    ],
    whoFor: 'Best for sole traders who want consistency without starting from a blank page.',
  },
  {
    price: '£29 per quarter',
    title: 'Quarterly Document Refresh',
    desc: 'Keep your documents accurate as your business evolves.',
    includes: [
      'One document update per quarter',
      'Pricing changes',
      'New services',
      'GDPR updates if tools or practices change',
    ],
    whoFor: 'Optional ongoing service. Cancel anytime.',
  },
];

function ServicesGrid() {
  return (
    <section className="bg-white py-24 px-6">
      <div className="mx-auto" style={{ maxWidth: 960 }}>
        <SectionLabel>OPTIONAL ADD-ONS</SectionLabel>
        <h2
          className="font-inter font-bold text-dark-text"
          style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)' }}
        >
          Choose what fits your business
        </h2>
        <p
          className="font-inter font-normal text-secondary-text mt-3 leading-[1.7]"
          style={{ fontSize: '1rem', maxWidth: 520 }}
        >
          Each add-on is built using the same process as your core pack — your answers, your voice, reviewed before delivery.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {services.map((s) => (
            <div
              key={s.title}
              className="bg-white border border-border rounded-2xl p-8 hover:border-medium-blue hover:shadow-[0_8px_32px_rgba(27,63,122,0.08)] transition-all duration-200 flex flex-col"
            >
              <span
                className="inline-block bg-off-white border border-medium-blue rounded-full font-inter font-bold text-navy self-start"
                style={{ padding: '4px 14px', fontSize: '0.9rem' }}
              >
                {s.price}
              </span>
              <h3 className="font-inter font-bold text-dark-text mt-4" style={{ fontSize: '1.1rem' }}>
                {s.title}
              </h3>
              <p
                className="font-inter font-normal text-secondary-text mt-2.5 leading-[1.65]"
                style={{ fontSize: '0.9rem' }}
              >
                {s.desc}
              </p>
              <div className="flex flex-col gap-2.5 mt-5">
                {s.includes.map((f) => (
                  <div key={f} className="flex items-start gap-2.5">
                    <span className="text-medium-blue font-bold shrink-0">✓</span>
                    <span className="font-inter font-medium text-dark-text" style={{ fontSize: '0.875rem' }}>
                      {f}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-border mt-6 pt-5 mt-auto">
                <p className="font-inter font-normal text-secondary-text leading-[1.6]" style={{ fontSize: '0.85rem' }}>
                  {s.whoFor}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── 4. How Add-ons Fit With the Core Pack ─── */

function AddonsContext() {
  const points = [
    "You don't need add-ons to be compliant or professional — the core pack covers that completely.",
    'The core pack is a standalone product. Everything in it works together without any extras.',
    'Add-ons are convenience and growth tools — they help you go further, not get started.',
  ];

  return (
    <section className="bg-off-white py-20 px-6">
      <div className="mx-auto" style={{ maxWidth: 760 }}>
        <SectionLabel>HOW IT ALL FITS TOGETHER</SectionLabel>
        <h2
          className="font-inter font-bold text-dark-text"
          style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)' }}
        >
          Add-ons extend. They don't complete.
        </h2>
        <p
          className="font-inter font-normal text-secondary-text mt-3 leading-[1.7]"
          style={{ fontSize: '1rem', maxWidth: 560 }}
        >
          The Business Foundations Pack gives you everything required to operate professionally and protect yourself. These services are for when you want to build on that foundation — not fill gaps in it.
        </p>

        <div className="flex flex-col gap-4 mt-10">
          {points.map((p) => (
            <div
              key={p}
              className="bg-white rounded-xl border border-border p-6 flex items-start gap-4"
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
                {p}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── 5. Final CTA ─── */

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
          Start with strong foundations.
        </h2>
        <p
          className="font-inter font-normal mt-4 leading-[1.7]"
          style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.85)' }}
        >
          You can always add more later. Most clients start with the core pack and decide from there.
        </p>
        <Link
          to="/pricing"
          className="inline-block font-inter font-bold text-navy bg-white rounded-lg hover:bg-[rgba(255,255,255,0.92)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.2)] transition-all duration-200 mt-10"
          style={{ padding: '18px 40px', fontSize: '1rem', minHeight: 48 }}
        >
          View the Business Foundations Pack
        </Link>
        <div className="mt-5">
          <Link
            to="/how-it-works"
            className="font-inter font-medium hover:underline"
            style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)' }}
          >
            How the process works →
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ─── Main Page ─── */

export default function AdditionalServicesPage() {
  return (
    <>
      <PageHeader />
      <CoreMessage />
      <ServicesGrid />
      <AddonsContext />
      <FinalCTA />
    </>
  );
}
