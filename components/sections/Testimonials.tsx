'use client';

const testimonials = [
  {
    quote: "I'd been working on a verbal agreement for two years — nothing in writing. Then a client tried to dispute the scope of a whole month's work. I'd received my Foundationary pack two weeks earlier. My new contract had a scope-of-work clause that settled it immediately. That document paid for itself in the first week.",
    name: 'Sarah M.',
    role: 'Bookkeeper, Manchester',
    service: 'Business Documents',
    photo: '/images/testimonials/sarah-m.jpg',
    initials: 'SM',
  },
  {
    quote: "Writing about myself is the one thing I'm genuinely bad at. Every attempt at my About page ended with me staring at a blinking cursor. The website copy Foundationary produced sounds exactly like me — warm, direct, no corporate nonsense — but also professional in a way I never managed myself. My site went live four days after I submitted the questionnaire.",
    name: 'James R.',
    role: 'Freelance Copywriter, Bristol',
    service: 'Website Copy',
    photo: '/images/testimonials/james-r.jpg',
    initials: 'JR',
  },
  {
    quote: "I bought 20 social posts. That was six weeks ago. I've posted consistently every week since — which is more than I managed in the six months before that combined. The blank-page dread is completely gone. The captions are in my voice, the hashtags are relevant, and I finally feel like I have a strategy rather than just a vague intention.",
    name: 'Anita S.',
    role: 'Business Coach, Edinburgh',
    service: 'Social Media',
    photo: '/images/testimonials/anita-s.jpg',
    initials: 'AS',
  },
  {
    quote: "I bought the documents and website copy together and the 10% discount made the decision easy. The bigger win was consistency. My contract, my website, my LinkedIn — they all read like the same person runs them now. Two clients have mentioned how professional everything looks, completely unprompted.",
    name: 'Marcus T.',
    role: 'IT Consultant, Leeds',
    service: 'Bundle',
    photo: '/images/testimonials/marcus-t.jpg',
    initials: 'MT',
  },
  {
    quote: "I knew I needed a GDPR policy — the ICO reminders made that very clear — but every template I found was written for a US business or missed entire sections. The policy from Foundationary was written specifically for UK sole traders who collect client data by email. No grey areas. I finally felt like a compliant business.",
    name: 'Priya K.',
    role: 'Nutritionist, Birmingham',
    service: 'Business Documents',
    photo: '/images/testimonials/priya-k.jpg',
    initials: 'PK',
  },
  {
    quote: "The quarterly refresh is something I didn't know I needed. I updated my contract once in three years and by then my pricing, working conditions, and cancellation policy had all changed. Now I update one document every quarter. It costs less than a coffee order per month and means I'm never operating on outdated terms.",
    name: 'Emma W.',
    role: 'Photographer, Brighton',
    service: 'Quarterly Refresh',
    photo: '/images/testimonials/emma-w.jpg',
    initials: 'EW',
  },
];

const doubled = [...testimonials, ...testimonials];

function TestimonialCard({ t }: { t: typeof testimonials[0] }) {
  return (
    <div
      className="bg-white rounded-2xl border border-border flex flex-col shrink-0"
      style={{
        width: 360,
        padding: '28px 28px 24px',
        boxShadow: '0 4px 24px rgba(27,63,122,0.07)',
        marginRight: 20,
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="text-medium-blue" style={{ fontSize: '0.9rem', letterSpacing: '0.05em' }}>★★★★★</div>
        <span
          className="font-inter font-semibold text-navy"
          style={{
            fontSize: '0.7rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            background: '#EBF2FF',
            padding: '3px 10px',
            borderRadius: 999,
          }}
        >
          {t.service}
        </span>
      </div>

      <span
        className="block text-medium-blue font-bold leading-none -mb-3"
        style={{ fontSize: '2.4rem' }}
      >
        &ldquo;
      </span>

      <p
        className="font-inter text-dark-text leading-[1.7] flex-1 mt-1"
        style={{ fontSize: '0.9rem', fontStyle: 'italic' }}
      >
        {t.quote}
      </p>

      <div className="flex items-center gap-3 mt-6 pt-5 border-t border-border">
        <div
          className="w-10 h-10 rounded-full overflow-hidden shrink-0 bg-off-white"
          style={{ border: '2px solid #E2E8F0' }}
        >
          <img
            src={t.photo}
            alt={t.name}
            width={40}
            height={40}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent) {
                parent.style.background = 'linear-gradient(135deg, #1B3F7A, #2C68C4)';
                parent.style.display = 'flex';
                parent.style.alignItems = 'center';
                parent.style.justifyContent = 'center';
                parent.innerHTML = `<span style="font-family:Inter,sans-serif;font-size:0.75rem;font-weight:600;color:white">${t.initials}</span>`;
              }
            }}
          />
        </div>
        <div>
          <div className="font-inter font-semibold text-dark-text" style={{ fontSize: '0.88rem' }}>{t.name}</div>
          <div className="font-inter font-normal text-secondary-text" style={{ fontSize: '0.8rem' }}>{t.role}</div>
        </div>
      </div>
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="bg-off-white py-24 overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-6 mb-12">
        <span
          className="font-inter font-semibold text-medium-blue uppercase block mb-3"
          style={{ fontSize: '0.75rem', letterSpacing: '0.15em' }}
        >
          WHAT CLIENTS SAY
        </span>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <h2
            className="font-inter font-bold text-dark-text"
            style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)' }}
          >
            Built for people exactly like you.
          </h2>
          <p className="font-inter text-secondary-text" style={{ fontSize: '0.825rem' }}>
            Reviews collected directly from Foundationary clients.
          </p>
        </div>
      </div>

      {/* Infinite horizontal carousel */}
      <div className="carousel-wrapper" style={{ overflow: 'hidden', cursor: 'default' }}>
        <div className="carousel-track" style={{ paddingLeft: 24 }}>
          {doubled.map((t, i) => (
            <TestimonialCard key={`${t.name}-${i}`} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
}
