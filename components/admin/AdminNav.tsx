'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldCheck, Home } from 'lucide-react';

const navItems = [
  { label: 'Overview', href: '/admin' },
  { label: 'Scraper & Councils', href: '/admin/scraper' },
  { label: 'Users & Companies', href: '/admin/users' },
  { label: 'Payments & Mail', href: '/admin/payments' },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-primary-200 bg-white">
      <div className="max-w-page mx-auto px-4 sm:px-6">
        <div className="flex h-14 items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-900 text-white">
              <ShieldCheck size={16} />
            </span>
            <div className="leading-tight">
              <p className="font-sans font-bold text-primary-900 text-sm">PlanningIndex Admin</p>
              <p className="font-sans text-primary-400 text-[11px]">Internal — not customer facing</p>
            </div>
          </div>
          <nav className="flex items-center gap-1 overflow-x-auto">
            {navItems.map((item) => {
              const active = item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`whitespace-nowrap rounded-lg px-3 py-2 font-sans text-sm transition-colors ${
                    active
                      ? 'bg-primary-100 font-semibold text-primary-900'
                      : 'text-primary-500 hover:text-primary-900 hover:bg-primary-50'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <Link
              href="/"
              className="ml-2 flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 font-sans text-sm text-primary-400 hover:text-primary-900 transition-colors"
            >
              <Home size={15} />
              Site
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
