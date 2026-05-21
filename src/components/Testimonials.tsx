const testimonials = [
  {
    quote: "I'd been freelancing for two years with nothing but a WhatsApp message as my 'contract'. Within 24 hours of submitting my questionnaire, I had a proper service agreement, a privacy policy, and an onboarding email sequence that made me look like I'd been running a professional agency for years.",
    name: 'Sarah M.',
    role: 'Virtual Assistant, London',
    initials: 'SM',
  },
  {
    quote: 'The contract alone has already saved me a dispute. A client tried to ask for significantly more than we\'d agreed, and I was able to point directly to the scope clause. They backed down immediately. £79 was one of the best things I\'ve spent on my business.',
    name: 'James T.',
    role: 'Freelance Marketing Consultant, Manchester',
    initials: 'JT',
  },
  {
    quote: 'I knew I needed a GDPR policy but had no idea what it actually needed to say. The one Foundationary produced was specific to my business — it referenced the exact tools I use and the exact data I collect. Nothing generic about it.',
    name: 'Priya K.',
    role: 'Bookkeeper, Birmingham',
    initials: 'PK',
  },
];

export default function Testimonials() {
  return (
    <section className="bg-off-white py-24 px-6">
      <div className="max-w-[1200px] mx-auto">
        <span
          className="font-inter font-semibold text-medium-blue uppercase block mb-3"
          style={{ fontSize: '0.75rem', letterSpacing: '0.15em' }}
        >
          WHAT CLIENTS SAY
        </span>
        <h2
          className="font-inter font-bold text-dark-text"
          style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)' }}
        >
          Built for people exactly like you.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-white rounded-2xl border border-border p-8 shadow-[0_4px_24px_rgba(27,63,122,0.07)]"
            >
              <div className="text-medium-blue" style={{ fontSize: '1rem' }}>
                ★★★★★
              </div>
              <span
                className="block text-medium-blue font-bold leading-none -mb-4"
                style={{ fontSize: '3rem' }}
              >
                &ldquo;
              </span>
              <p
                className="font-inter italic text-dark-text leading-[1.7]"
                style={{ fontSize: '0.95rem' }}
              >
                {t.quote}
              </p>
              <div className="flex items-center gap-3 mt-5">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-inter font-semibold shrink-0"
                  style={{
                    fontSize: '0.875rem',
                    background: 'linear-gradient(135deg, #1B3F7A, #2C68C4)',
                  }}
                >
                  {t.initials}
                </div>
                <div>
                  <div className="font-inter font-semibold text-dark-text" style={{ fontSize: '0.9rem' }}>
                    {t.name}
                  </div>
                  <div className="font-inter font-normal text-secondary-text" style={{ fontSize: '0.8rem' }}>
                    {t.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
