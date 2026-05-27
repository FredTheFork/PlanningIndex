'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, LogOut } from 'lucide-react';
// import { useAuth } from '@/hooks/useAuth';
// import { useClientProfile } from '@/hooks/useClientProfile';

const navLinks = [
  { label: "What's Included", to: '/whats-included' },
  { label: 'How It Works', to: '/how-it-works' },
  { label: 'Pricing', to: '/pricing' },
  { label: 'Additional Services', to: '/additional-services' },
  { label: 'About', to: '/about' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  // const { user, loading: authLoading, signOut } = useAuth();
  // const { profile, loading: profileLoading } = useClientProfile();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 bg-white border-b border-border transition-shadow duration-200 ${
        scrolled ? 'shadow-sm' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="font-bold text-xl text-navy">
            <span className="text-2xl">F</span>oundationary
          </div>
        </Link>

        <div className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.to}
              className="text-sm font-medium text-secondary-text hover:text-navy transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm font-medium text-secondary-text hover:text-navy transition-colors"
          >
            Log In
          </Link>
          <Link
            href="/checkout"
            className="bg-navy text-white px-5 py-2 rounded-md text-sm font-semibold hover:bg-medium-blue transition-colors"
          >
            Get Your Pack - £79
          </Link>
        </div>

        <button
          className="lg:hidden text-navy"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 bg-navy z-40 flex flex-col items-center justify-center gap-8 lg:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.to}
              className="font-medium text-white text-2xl"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/checkout"
            className="font-semibold text-navy bg-white rounded-md mt-4 px-8 py-3 text-lg"
            onClick={() => setMobileOpen(false)}
          >
            Get Your Pack - £79
          </Link>
        </div>
      )}
    </nav>
  );
}
