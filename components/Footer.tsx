import Link from 'next/link';

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
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark-text pt-14 pb-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between gap-10">
          <Link href="/" className="flex items-center gap-2">
            <div className="font-bold text-white text-xl">
              <span className="text-2xl">F</span>oundationary
            </div>
          </Link>

          <div className="flex gap-16 flex-wrap">
            <div>
              <h4 className="font-semibold text-white uppercase mb-4 text-xs tracking-wider">
                Services
              </h4>
              <ul className="flex flex-col gap-2">
                {serviceLinks.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.to}
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white uppercase mb-4 text-xs tracking-wider">
                Company
              </h4>
              <ul className="flex flex-col gap-2">
                {companyLinks.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.to}
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white uppercase mb-4 text-xs tracking-wider">
                Legal
              </h4>
              <ul className="flex flex-col gap-2">
                {legalLinks.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.to}
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-10 pt-6 flex flex-col md:flex-row justify-between gap-4">
          <p className="text-xs text-gray-500">
            &copy; {currentYear} Foundationary. All rights reserved.
          </p>
          <p className="text-xs text-gray-500 md:text-right">
            Foundationary is a document drafting service and does not provide legal advice. UK GDPR compliant.
          </p>
        </div>
      </div>
    </footer>
  );
}
