import Link from 'next/link';

const productLinks = [
  { label: 'Pricing', href: '/pricing' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

const legalLinks = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Use', href: '/terms' },
];

export default function Footer() {
  return (
    <footer className="bg-primary-900 pt-14 pb-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between gap-10">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="font-sans font-bold text-white leading-none" style={{ fontSize: '1.25rem' }}>
              PlanningIndex
            </span>
          </Link>

          <div className="flex gap-16 flex-wrap">
            <div>
              <h4 className="font-sans font-semibold text-white uppercase mb-4" style={{ fontSize: '0.8rem', letterSpacing: '0.1em' }}>
                Product
              </h4>
              <ul className="flex flex-col gap-2.5">
                {productLinks.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="font-sans font-normal hover:text-white transition-colors"
                      style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)' }}
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-sans font-semibold text-white uppercase mb-4" style={{ fontSize: '0.8rem', letterSpacing: '0.1em' }}>
                Legal
              </h4>
              <ul className="flex flex-col gap-2.5">
                {legalLinks.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="font-sans font-normal hover:text-white transition-colors"
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

        <div className="border-t border-white/10 mt-10 pt-6">
          <p className="font-sans font-normal" style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>
            &copy; 2026 PlanningIndex. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
