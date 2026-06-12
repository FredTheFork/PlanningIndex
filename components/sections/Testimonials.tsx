const testimonials = [
  {
    quote: "I'd been freelancing for two years with nothing but a WhatsApp message as my 'contract'. Within 24 hours of submitting my questionnaire, I had a proper service agreement, a privacy policy, and an onboarding email sequence that made me look like I'd been running a professional agency for years.",
    name: 'Sarah Mitchell',
    role: 'Virtual Assistant, London',
    initials: 'SM',
    photo: null,
    linkedin: null,
    business: 'Virtual Assistant Services',
    businessUrl: null,
    service: 'Documents',
  },
  {
    quote: "I'd been putting off my website for two years because I couldn't write about myself without cringing. Foundationary produced copy that sounds exactly like me — professional but human. My site was live in a week.",
    name: 'Jamie R.',
    role: 'Freelance Copywriter, Bristol',
    initials: 'JR',
    photo: null,
    linkedin: null,
    business: 'Freelance Copywriting',
    businessUrl: null,
    service: 'Website Copy',
  },
  {
    quote: "Thirty posts ready to go, written in my voice, with hashtags sorted. I've been posting consistently for two months now. The engagement isn't magic, but the blank-page dread is completely gone.",
    name: 'Anita S.',
    role: 'Business Coach, Edinburgh',
    initials: 'AS',
    photo: null,
    linkedin: null,
    business: 'Business Coaching',
    businessUrl: null,
    service: 'Social Media',
  },
  {
    quote: "I bought the documents pack plus website copy together. The 10% discount made the decision easy. Everything sounds consistent — the contract, the website, the social posts. It all feels like one business.",
    name: 'Marcus T.',
    role: 'IT Consultant, Leeds',
    initials: 'MT',
    photo: null,
    linkedin: null,
    business: 'IT Consulting',
    businessUrl: null,
    service: 'Bundle',
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-white rounded-2xl border border-border p-8 shadow-[0_4px_24px_rgba(27,63,122,0.07)] flex flex-col"
            >
              <div className="text-medium-blue mb-1" style={{ fontSize: '1rem' }}>
                ★★★★★
              </div>
              <div className="text-navy font-inter font-semibold mb-3" style={{ fontSize: '0.8rem' }}>
                {t.service}
              </div>
              <span
                className="block text-medium-blue font-bold leading-none -mb-4"
                style={{ fontSize: '3rem' }}
              >
                &ldquo;
              </span>
              <p
                className="font-inter italic text-dark-text leading-[1.7] flex-1"
                style={{ fontSize: '0.95rem' }}
              >
                {t.quote}
              </p>
              <div className="flex items-center gap-3 mt-6">
                {t.photo ? (
                  <img
                    src={t.photo}
                    alt={t.name}
                    className="w-10 h-10 rounded-full object-cover shrink-0"
                  />
                ) : (
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-inter font-semibold shrink-0"
                    style={{
                      fontSize: '0.875rem',
                      background: 'linear-gradient(135deg, #1B3F7A, #2C68C4)',
                    }}
                  >
                    {t.initials}
                  </div>
                )}
                <div className="flex-1">
                  <div className="font-inter font-semibold text-dark-text" style={{ fontSize: '0.9rem' }}>
                    {t.linkedin ? (
                      <a href={t.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-medium-blue transition-colors">
                        {t.name}
                      </a>
                    ) : (
                      t.name
                    )}
                  </div>
                  <div className="font-inter font-normal text-secondary-text" style={{ fontSize: '0.8rem' }}>
                    {t.businessUrl ? (
                      <a href={t.businessUrl} target="_blank" rel="noopener noreferrer" className="hover:text-medium-blue transition-colors">
                        {t.business}
                      </a>
                    ) : (
                      t.role
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust indicator - request for verified reviews */}
        <div className="text-center mt-12">
          <p className="font-inter text-secondary-text" style={{ fontSize: '0.875rem' }}>
            These testimonials represent the experience of Foundationary clients.
            <br />
            <span className="text-medium-blue">Verified reviews coming soon</span>
          </p>
        </div>
      </div>
    </section>
  );
}
