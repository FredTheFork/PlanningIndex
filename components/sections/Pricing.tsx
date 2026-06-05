import Link from 'next/link';

const features = [
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

const extras = [
  {
    title: 'Delivered within 24 hours',
    price: null,
  },
  {
    title: 'PDF + editable Word formats',
    price: null,
  },
  {
    title: 'UK law compliant throughout',
    price: null,
  },
  {
    title: 'Your tone, your business, your name',
    price: null,
  },
];

const upsells = [
  {
    title: 'Website Copy Starter Pack',
    price: '£49 add-on',
    desc: 'Homepage, About, Services, and Contact page copy — SEO-aware, written in your voice, ready to paste.',
  },
  {
    title: 'Social Media Starter Pack',
    price: '£120 — 30 posts',
    desc: '30 done-for-you posts tailored to your industry, audience and tone. Captions, hashtags, image ideas.',
  },
  {
    title: 'Quarterly Document Refresh',
    price: '£29 per quarter',
    desc: 'One document updated each quarter as your business evolves. Pricing changes, new services, regulation updates.',
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="bg-white py-24 px-6">
      <div className="max-w-[960px] mx-auto">
        <span
          className="font-inter font-semibold text-medium-blue uppercase block mb-3"
          style={{ fontSize: '0.75rem', letterSpacing: '0.15em' }}
        >
          PRICING
        </span>
        <h2
          className="font-inter font-bold text-dark-text"
          style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)' }}
        >
          One price. Everything included.
        </h2>

        <div className="flex justify-center mt-12">
          <div
            className="relative bg-white border-2 border-navy rounded-[20px] p-12 shadow-[0_16px_64px_rgba(27,63,122,0.12)] w-full"
            style={{ maxWidth: 520 }}
          >
            {/* Most Popular badge */}
            <div
              className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-navy text-white font-inter font-semibold rounded-full"
              style={{ padding: '4px 16px', fontSize: '0.7rem', letterSpacing: '0.1em' }}
            >
              MOST POPULAR
            </div>

            <h3 className="font-inter font-bold text-dark-text text-center" style={{ fontSize: '1.25rem' }}>
              Business Foundations Pack
            </h3>

            <div className="flex items-baseline justify-center gap-2 mt-6">
              <span className="font-inter font-extrabold text-navy" style={{ fontSize: '3.5rem', lineHeight: 1 }}>
                £79
              </span>
              <span className="font-inter font-normal text-secondary-text" style={{ fontSize: '0.875rem' }}>
                one-time payment
              </span>
            </div>

            <div className="border-t border-border my-7" />

            <div className="flex flex-col gap-3.5">
              {features.map((f) => (
                <div key={f} className="flex items-start gap-3">
                  <span className="text-success font-bold shrink-0">✓</span>
                  <span className="font-inter font-medium text-dark-text" style={{ fontSize: '0.925rem' }}>
                    {f}
                  </span>
                </div>
              ))}
              {extras.map((e) => (
                <div key={e.title} className="flex items-start gap-3">
                  <span className="text-success font-bold shrink-0">✓</span>
                  <span className="font-inter font-medium text-dark-text" style={{ fontSize: '0.925rem' }}>
                    {e.title}
                  </span>
                </div>
              ))}
            </div>

            <Link
              href="/checkout"
              className="block w-full text-center font-inter font-bold text-white bg-navy rounded-[10px] hover:bg-medium-blue hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(27,63,122,0.3)] transition-all duration-200 mt-9"
              style={{ padding: '18px', fontSize: '1rem' }}
            >
              Get My Business Foundations Pack
            </Link>

            <p className="font-inter font-normal text-secondary-text text-center mt-4" style={{ fontSize: '0.8rem' }}>
              🔒 Secure payment via Stripe. Document drafting service — not legal advice.
            </p>
          </div>
        </div>

        {/* Upsells */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
          {upsells.map((u) => (
            <div
              key={u.title}
              className="border border-border rounded-xl p-6 hover:border-medium-blue transition-colors duration-200"
            >
              <h4 className="font-inter font-semibold text-dark-text" style={{ fontSize: '0.95rem' }}>
                {u.title}
              </h4>
              <div className="font-inter font-bold text-medium-blue mt-1" style={{ fontSize: '1.1rem' }}>
                {u.price}
              </div>
              <p className="font-inter font-normal text-secondary-text mt-2 leading-[1.55]" style={{ fontSize: '0.85rem' }}>
                {u.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Bundle savings note */}
        <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-5 text-center">
          <p className="font-inter font-semibold text-green-800" style={{ fontSize: '0.9rem' }}>
            Bundle and save — add any two services and save £9. Add all three and save £18.
          </p>
        </div>
      </div>
    </section>
  );
}
