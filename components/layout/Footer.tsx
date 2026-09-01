import Link from 'next/link';
import { Linkedin, Twitter } from 'lucide-react';

const productLinks = [
  { label: 'Planning Search', href: '/login' },
  { label: 'Features', href: '/features' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Industries', href: '/industries' },
  { label: 'About', href: '/about' },
];

const resourceLinks = [
  { label: 'Blog', href: '/blog' },
  { label: 'Help Centre', href: '/help' },
  { label: 'Guides', href: '/guides' },
  { label: 'Contact', href: '/contact' },
];

const legalLinks = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Use', href: '/terms' },
];

export default function Footer() {
  return (
    <footer className="bg-primary-900 pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 shrink-0 mb-4">
              <span className="font-sans font-bold text-white leading-none" style={{ fontSize: '1.25rem' }}>
                PlanningIndex
              </span>
            </Link>
            <p className="font-sans text-white/50 leading-relaxed max-w-xs" style={{ fontSize: '0.85rem' }}>
              Find every construction job in the UK before your competitors. Search planning applications, manage leads, and send proposals — all in one place.
            </p>
            <div className="flex items-center gap-3 mt-6">
              <a
                href="https://www.linkedin.com/company/planningindex"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
              <a
                href="https://twitter.com/PlanningIndex"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-sans font-semibold text-white uppercase mb-4" style={{ fontSize: '0.75rem', letterSpacing: '0.1em' }}>
              Product
            </h4>
            <ul className="flex flex-col gap-2.5">
              {productLinks.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="font-sans font-normal hover:text-white transition-colors"
                    style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-sans font-semibold text-white uppercase mb-4" style={{ fontSize: '0.75rem', letterSpacing: '0.1em' }}>
              Resources
            </h4>
            <ul className="flex flex-col gap-2.5">
              {resourceLinks.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="font-sans font-normal hover:text-white transition-colors"
                    style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-sans font-semibold text-white uppercase mb-4" style={{ fontSize: '0.75rem', letterSpacing: '0.1em' }}>
              Legal
            </h4>
            <ul className="flex flex-col gap-2.5">
              {legalLinks.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="font-sans font-normal hover:text-white transition-colors"
                    style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-sans font-normal" style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)' }}>
            &copy; 2026 PlanningIndex. All rights reserved.
          </p>
          <p className="font-sans font-normal" style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)' }}>
            Built for UK construction professionals.
          </p>
        </div>
      </div>
    </footer>
  );
}
