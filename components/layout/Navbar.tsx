'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { NavLinkDropdown } from '@/components/marketing';

const navLinks = [
  { label: 'Planning Search', href: '/login' },
  { label: 'Features', href: '/features' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Industries', href: '/industries' },
  { label: 'About', href: '/about' },
];

const resourceLinks = [
  { label: 'Blog', href: '/blog', description: 'Industry insights and updates' },
  { label: 'Help Centre', href: '/help', description: 'Guides and answers to common questions' },
  { label: 'Guides', href: '/guides', description: 'Step-by-step tutorials' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, loading: authLoading, signOut } = useAuth();
  const router = useRouter();

  const transparent = false;

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const handleSignOut = async () => {
    await signOut();
    setMobileOpen(false);
    router.push('/');
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        transparent
          ? 'bg-transparent border-b border-transparent'
          : 'bg-white border-b border-primary-200 shadow-sm'
      }`}
      style={{ height: 'clamp(64px, 8vw, 72px)' }}
    >
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span
            className={`font-sans font-bold leading-none transition-colors duration-300 ${
              transparent ? 'text-white' : 'text-primary-900'
            }`}
            style={{ fontSize: '1.25rem' }}
          >
            PlanningIndex
          </span>
        </Link>

        <div className="hidden lg:flex items-center gap-7">
          {navLinks.map((link) => {
            const isSearch = link.label === 'Planning Search';
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`font-sans font-medium relative group transition-colors duration-300 ${
                  isSearch
                    ? 'text-accent-400'
                    : transparent
                      ? 'text-white/90 hover:text-white'
                      : 'text-primary-600 hover:text-primary-900'
                }`}
                style={{ fontSize: '0.9rem' }}
              >
                {link.label}
                <span
                  className={`absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-200 group-hover:w-full ${
                    isSearch
                      ? 'bg-accent-400'
                      : transparent
                        ? 'bg-white/70'
                        : 'bg-accent-500'
                  }`}
                />
              </Link>
            );
          })}
          <NavLinkDropdown label="Resources" items={resourceLinks} transparent={transparent} />
        </div>

        <div className="hidden lg:flex items-center gap-4">
          {user && !authLoading ? (
            <>
              <Link
                href="/app"
                className={`font-sans font-semibold rounded-md transition-all duration-300 ${
                  transparent
                    ? 'text-white border-2 border-white/50 hover:bg-white/15 hover:border-white/80'
                    : 'text-white bg-primary-900 hover:bg-primary-800'
                }`}
                style={{ padding: '10px 20px', fontSize: '0.9rem' }}
              >
                Dashboard
              </Link>
              <button
                onClick={handleSignOut}
                className={`transition-colors duration-300 ${
                  transparent ? 'text-white/70 hover:text-white' : 'text-primary-500 hover:text-primary-900'
                }`}
                title="Sign out"
              >
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className={`font-sans font-medium transition-colors duration-300 ${
                  transparent ? 'text-white/80 hover:text-white' : 'text-primary-600 hover:text-primary-900'
                }`}
                style={{ fontSize: '0.9rem' }}
              >
                Log In
              </Link>
              <Link
                href="/login"
                className={`font-sans font-semibold rounded-md transition-all duration-300 ${
                  transparent
                    ? 'text-white border-2 border-white/50 hover:bg-white/15 hover:border-white/80'
                    : 'text-white bg-primary-900 hover:bg-primary-800'
                }`}
                style={{ padding: '10px 20px', fontSize: '0.9rem' }}
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        <button
          className={`lg:hidden transition-colors duration-300 ${transparent ? 'text-white' : 'text-primary-900'}`}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 bg-primary-900 z-40 flex flex-col items-center justify-center gap-5 lg:hidden overflow-y-auto py-10">
          {navLinks.map((link) => {
            const isSearch = link.label === 'Planning Search';
            return (
            <Link
              key={link.label}
              href={link.href}
              className={`font-sans font-medium text-2xl ${isSearch ? 'text-accent-400' : 'text-white'}`}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
            );
          })}

          <div className="flex flex-col items-center gap-3">
            <p className="font-sans font-semibold text-white/40 uppercase" style={{ fontSize: '0.7rem', letterSpacing: '0.15em' }}>
              Resources
            </p>
            {resourceLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="font-sans font-medium text-white/80 text-xl"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <Link
            href="/login"
            className="font-sans font-semibold text-primary-900 bg-white rounded-md mt-4"
            style={{ padding: '14px 32px', fontSize: '1rem' }}
            onClick={() => setMobileOpen(false)}
          >
            Get Started
          </Link>
          {user && !authLoading && (
            <button
              onClick={handleSignOut}
              className="font-sans font-medium text-white mt-2"
              style={{ fontSize: '1rem' }}
            >
              Sign Out
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
