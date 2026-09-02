'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Users, LayoutGrid, FileText, Briefcase, IceCream as TeamIcon, Activity, CreditCard, Settings, X } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

interface NavSection {
  label: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    label: 'Search',
    items: [
      { label: 'Planning Applications', href: '/app', icon: Search },
      { label: 'Leads', href: '/app/leads', icon: Users },
      { label: 'Pipeline', href: '/app/pipeline', icon: LayoutGrid },
    ],
  },
  {
    label: 'Work',
    items: [
      { label: 'Proposals', href: '/app/proposals', icon: FileText },
      { label: 'Jobs', href: '/app/jobs', icon: Briefcase },
    ],
  },
  {
    label: 'Team',
    items: [
      { label: 'Team', href: '/app/team', icon: TeamIcon },
      { label: 'Activity', href: '/app/activity', icon: Activity },
    ],
  },
  {
    label: 'Account',
    items: [
      { label: 'Billing', href: '/account/billing', icon: CreditCard },
      { label: 'Settings', href: '/account', icon: Settings },
    ],
  },
];

interface SidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export default function Sidebar({ mobileOpen, onCloseMobile }: SidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/app') return pathname === '/app';
    return pathname.startsWith(href);
  };

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-surface-overlay lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-[240px] bg-primary-900 text-white flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-5 h-14 border-b border-white/10 shrink-0">
          <Link href="/app" className="font-sans font-bold text-white text-lg" onClick={onCloseMobile}>
            PlanningIndex
          </Link>
          <button
            onClick={onCloseMobile}
            className="lg:hidden text-white/60 hover:text-white transition-colors"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3">
          {navSections.map((section) => (
            <div key={section.label} className="mb-6">
              <p
                className="px-3 mb-1.5 font-sans font-semibold uppercase tracking-wider"
                style={{ fontSize: '0.65rem', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.35)' }}
              >
                {section.label}
              </p>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onCloseMobile}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg font-sans text-sm transition-colors ${
                        active
                          ? 'bg-white/10 text-white font-semibold'
                          : 'text-white/60 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <item.icon size={17} className="shrink-0" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-white/10 shrink-0">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2 rounded-lg font-sans text-sm text-white/40 hover:text-white/70 hover:bg-white/5 transition-colors"
          >
            <Settings size={17} className="shrink-0" />
            Back to website
          </Link>
        </div>
      </aside>
    </>
  );
}
