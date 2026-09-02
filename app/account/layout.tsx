import type { Metadata } from 'next';
import Link from 'next/link';
import { User, Building2, CreditCard, Shield, ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Account',
  robots: { index: false, follow: false },
};

const accountNav = [
  { label: 'Profile', href: '/account', icon: User },
  { label: 'Company', href: '/account/company', icon: Building2 },
  { label: 'Billing', href: '/account/billing', icon: CreditCard },
  { label: 'Security', href: '/account/security', icon: Shield },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-primary-50 pt-24 pb-16 px-6">
      <div className="max-w-5xl mx-auto">
        <Link
          href="/app"
          className="inline-flex items-center gap-2 font-sans text-sm text-primary-500 hover:text-primary-900 transition-colors mb-6"
        >
          <ArrowLeft size={16} /> Back to dashboard
        </Link>

        <h1 className="font-display font-bold text-primary-900 text-h2 mb-8">
          Account Settings
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-8">
          <nav className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible">
            {accountNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 font-sans text-sm font-medium text-primary-600 hover:bg-primary-100 hover:text-primary-900 transition-colors whitespace-nowrap"
              >
                <item.icon size={16} className="shrink-0" />
                {item.label}
              </Link>
            ))}
          </nav>

          <div>{children}</div>
        </div>
      </div>
    </div>
  );
}
