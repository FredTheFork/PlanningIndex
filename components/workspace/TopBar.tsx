'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Menu, LogOut, Settings, CreditCard, ChevronDown } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface TopBarProps {
  onToggleSidebar: () => void;
}

export default function TopBar({ onToggleSidebar }: TopBarProps) {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  const handleSignOut = async () => {
    setMenuOpen(false);
    await signOut();
    router.push('/');
  };

  const initials = (user?.email || 'U')
    .split('@')[0]
    .split(/[.\s_-]+/)
    .map((s) => s.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');

  return (
    <header className="fixed top-0 left-0 right-0 z-30 h-14 bg-white border-b border-primary-200 flex items-center justify-between px-4 lg:px-6 lg:left-[240px]">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 -ml-2 text-primary-700 hover:text-primary-900 transition-colors"
          aria-label="Toggle sidebar"
        >
          <Menu size={20} />
        </button>
        <span className="font-sans font-semibold text-primary-900 text-sm hidden sm:block">
          Workspace
        </span>
      </div>

      <div ref={menuRef} className="relative">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-primary-50 transition-colors"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-900 text-white shrink-0">
            <span className="font-sans font-semibold text-xs">{initials}</span>
          </div>
          <span className="hidden sm:block font-sans text-sm font-medium text-primary-700 max-w-[140px] truncate">
            {user?.email}
          </span>
          <ChevronDown size={15} className="text-primary-400 hidden sm:block" />
        </button>

        {menuOpen && (
          <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl border border-primary-200 shadow-raised py-1.5 animate-scale-in z-50">
            <div className="px-4 py-2.5 border-b border-primary-100">
              <p className="font-sans text-xs text-primary-400">Signed in as</p>
              <p className="font-sans text-sm font-medium text-primary-900 truncate">{user?.email}</p>
            </div>
            <Link
              href="/account"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2.5 font-sans text-sm text-primary-700 hover:bg-primary-50 transition-colors"
            >
              <Settings size={15} /> Settings
            </Link>
            <Link
              href="/account/billing"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2.5 font-sans text-sm text-primary-700 hover:bg-primary-50 transition-colors"
            >
              <CreditCard size={15} /> Billing
            </Link>
            <div className="h-px bg-primary-100 my-1" />
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2.5 px-4 py-2.5 w-full font-sans text-sm text-danger hover:bg-danger-50 transition-colors"
            >
              <LogOut size={15} /> Sign Out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
