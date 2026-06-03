'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useClientProfile } from '@/hooks/useClientProfile';
import { useIsAdmin } from '@/hooks/useIsAdmin';

const navLinks = [
  { label: "What's Included", href: '/whats-included' },
  { label: 'How It Works', href: '/how-it-works' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Blog', href: '/blog' },
  { label: 'Additional Services', href: '/additional-services' },
  { label: 'About', href: '/about' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, loading: authLoading, signOut } = useAuth();
  const { profile, loading: profileLoading } = useClientProfile();
  const { isAdmin, loading: adminLoading } = useIsAdmin();
  const router = useRouter();

  const isPaidUser = !authLoading && !profileLoading && !!user && !!profile;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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
      className={`fixed top-0 left-0 right-0 z-50 bg-white border-b border-border transition-shadow duration-200 ${
        scrolled ? 'shadow-[0_2px_12px_rgba(27,63,122,0.08)]' : ''
      }`}
      style={{ height: 'clamp(64px, 8vw, 72px)' }}
    >
      <div className="max-w-full mx-0 px-6 h-full flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0" style={{ height: 52 }}>
          <img src="/images/logo.png" alt="Foundationary logo" style={{ height: 52, width: 'auto' }} />

          <div className="flex flex-col">
            <span className="font-inter font-bold text-navy leading-none" style={{ fontSize: '1.15rem' }}>
              <span style={{ fontSize: '1.2rem' }}>F</span>oundationary
            </span>
            <span
              className="font-inter font-semibold text-secondary-text"
              style={{ fontSize: '0.65rem', letterSpacing: '0.12em', lineHeight: 1.2 }}
            >
              BUSINESS FOUNDATIONS. FAST.
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center" style={{ marginLeft: '20px', gap: '2rem' }}>
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="font-inter font-medium text-secondary-text hover:text-navy relative group"
              style={{ fontSize: '0.9rem' }}
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-medium-blue transition-all duration-200 group-hover:w-full" />
            </Link>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden lg:flex items-center gap-3 ml-auto pr-6">
          {isAdmin && !adminLoading ? (
            <>
              <Link
                href="/personal/admin"
                className="font-inter font-semibold text-white bg-navy rounded-md hover:bg-medium-blue transition-colors duration-200"
                style={{ padding: '10px 20px', fontSize: '0.9rem' }}
              >
                Admin
              </Link>
              <button
                onClick={handleSignOut}
                className="font-inter font-medium text-secondary-text hover:text-navy transition-colors duration-200"
                style={{ fontSize: '0.85rem' }}
                title="Sign out"
              >
                <LogOut size={18} />
              </button>
            </>
          ) : isPaidUser ? (
            <>
              <Link
                href="/personal"
                className="font-inter font-semibold text-white bg-navy rounded-md hover:bg-medium-blue transition-colors duration-200"
                style={{ padding: '10px 20px', fontSize: '0.9rem' }}
              >
                Personal
              </Link>
              <button
                onClick={handleSignOut}
                className="font-inter font-medium text-secondary-text hover:text-navy transition-colors duration-200"
                style={{ fontSize: '0.85rem' }}
                title="Sign out"
              >
                <LogOut size={18} />
              </button>
            </>
          ) : user && !authLoading ? (
            <>
              <Link
                href="/checkout"
                className="font-inter font-semibold text-white bg-navy rounded-md hover:bg-medium-blue transition-colors duration-200"
                style={{ padding: '10px 20px', fontSize: '0.9rem' }}
              >
                Get Your Pack — £79
              </Link>
              <button
                onClick={handleSignOut}
                className="font-inter font-medium text-secondary-text hover:text-navy transition-colors duration-200"
                style={{ fontSize: '0.85rem' }}
                title="Sign out"
              >
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="font-inter font-medium text-secondary-text hover:text-navy transition-colors duration-200"
                style={{ fontSize: '0.9rem' }}
              >
                Log In
              </Link>
              <Link
                href="/checkout"
                className="font-inter font-semibold text-white bg-navy rounded-md hover:bg-medium-blue transition-colors duration-200"
                style={{ padding: '10px 20px', fontSize: '0.9rem' }}
              >
                Get Your Pack — £79
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden text-navy"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-navy z-40 flex flex-col items-center justify-center gap-8 lg:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="font-inter font-medium text-white text-2xl"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {isAdmin && !adminLoading ? (
            <>
              <Link
                href="/personal/admin"
                className="font-inter font-semibold text-navy bg-white rounded-md mt-4"
                style={{ padding: '14px 32px', fontSize: '1rem' }}
                onClick={() => setMobileOpen(false)}
              >
                Admin
              </Link>
              <button
                onClick={handleSignOut}
                className="font-inter font-medium text-white mt-2"
                style={{ fontSize: '1rem' }}
              >
                Sign Out
              </button>
            </>
          ) : isPaidUser ? (
            <>
              <Link
                href="/personal"
                className="font-inter font-semibold text-navy bg-white rounded-md mt-4"
                style={{ padding: '14px 32px', fontSize: '1rem' }}
                onClick={() => setMobileOpen(false)}
              >
                Personal
              </Link>
              <button
                onClick={handleSignOut}
                className="font-inter font-medium text-white mt-2"
                style={{ fontSize: '1rem' }}
              >
                Sign Out
              </button>
            </>
          ) : user && !authLoading ? (
            <>
              <Link
                href="/checkout"
                className="font-inter font-semibold text-navy bg-white rounded-md mt-4"
                style={{ padding: '14px 32px', fontSize: '1rem' }}
                onClick={() => setMobileOpen(false)}
              >
                Get Your Pack — £79
              </Link>
              <button
                onClick={handleSignOut}
                className="font-inter font-medium text-white mt-2"
                style={{ fontSize: '1rem' }}
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="font-inter font-medium text-white"
                style={{ fontSize: '1.2rem' }}
                onClick={() => setMobileOpen(false)}
              >
                Log In
              </Link>
              <Link
                href="/checkout"
                className="font-inter font-semibold text-navy bg-white rounded-md mt-4"
                style={{ padding: '14px 32px', fontSize: '1rem' }}
                onClick={() => setMobileOpen(false)}
              >
                Get Your Pack — £79
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
