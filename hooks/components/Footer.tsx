import { Link } from 'react-router-dom';

const serviceLinks = [
  { label: "What's Included", to: '/whats-included' },
  { label: 'Pricing', to: '/pricing' },
  { label: 'Additional Services', to: '/additional-services' },
  { label: 'How It Works', to: '/how-it-works' },
];

const companyLinks = [
  { label: 'About', to: '/about' },
  { label: 'FAQ', to: '/faq' },
  { label: 'Contact', to: '/contact' },
];

const legalLinks = [
  { label: 'Privacy Policy', to: '/privacy' },
  { label: 'Terms of Use', to: '/terms' },
];

export default function Footer() {
  return (
    <footer className="bg-[#1A1A2E] pt-14 pb-8 px-6">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between gap-10">
          {/* Logo (white version) */}
          <Link to="/" className="flex items-center gap-2 shrink-0" style={{ height: 40 }}>
            <img src="/Firefly_GeminiFlash_please_do_not_change_the_shape_of_the_rocket_or_stand_or_any_of_the_blue_currently_in_422366.png" alt="Foundationary" style={{ height: 40, width: 'auto' }} />
            <div className="flex flex-col">
              <span className="font-inter font-bold text-white leading-none" style={{ fontSize: '1.15rem' }}>
                <span style={{ fontSize: '1.3rem' }}>F</span>oundationary
              </span>
              <span
                className="font-inter font-semibold"
                style={{
                  fontSize: '0.65rem',
                  letterSpacing: '0.12em',
                  color: 'rgba(255,255,255,0.6)',
                  lineHeight: 1.2,
                }}
              >
                BUSINESS FOUNDATIONS. FAST.
              </span>
            </div>
          </Link>

          {/* Nav columns */}
          <div className="flex gap-16 flex-wrap">
            <div>
              <h4
                className="font-inter font-semibold text-white uppercase mb-4"
                style={{ fontSize: '0.8rem', letterSpacing: '0.1em' }}
              >
                Services
              </h4>
              <ul className="flex flex-col gap-2.5">
                {serviceLinks.map((l) => (
                  <li key={l.label}>
                    <Link
                      to={l.to}
                      className="font-inter font-normal hover:text-white transition-colors"
                      style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)' }}
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4
                className="font-inter font-semibold text-white uppercase mb-4"
                style={{ fontSize: '0.8rem', letterSpacing: '0.1em' }}
              >
                Company
              </h4>
              <ul className="flex flex-col gap-2.5">
                {companyLinks.map((l) => (
                  <li key={l.label}>
                    <Link
                      to={l.to}
                      className="font-inter font-normal hover:text-white transition-colors"
                      style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)' }}
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4
                className="font-inter font-semibold text-white uppercase mb-4"
                style={{ fontSize: '0.8rem', letterSpacing: '0.1em' }}
              >
                Legal
              </h4>
              <ul className="flex flex-col gap-2.5">
                {legalLinks.map((l) => (
                  <li key={l.label}>
                    <Link
                      to={l.to}
                      className="font-inter font-normal hover:text-white transition-colors"
                      style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)' }}
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-[rgba(255,255,255,0.1)] mt-10 pt-6 flex flex-col md:flex-row justify-between gap-4">
          <p className="font-inter font-normal" style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>
            &copy; 2025 Foundationary. All rights reserved.
          </p>
          <p
            className="font-inter font-normal md:text-right"
            style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}
          >
            Foundationary is a document drafting service and does not provide legal advice. UK GDPR compliant.
          </p>
        </div>
      </div>
    </footer>
  );
}
