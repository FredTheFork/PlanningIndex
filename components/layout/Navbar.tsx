'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, X, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useClientProfile } from '@/hooks/useClientProfile';
import { useIsAdmin } from '@/hooks/useIsAdmin';

const navLinks = [
  {
    label: 'Services',
    href: '/services',
    sub: [
      { label: 'Business Foundations Pack', href: '/services/documents' },
      { label: 'Website Copy Starter Pack', href: '/services/website-copy' },
      { label: 'Social Media Starter Pack', href: '/services/social-media' },
      { label: 'Quarterly Document Refresh', href: '/services/quarterly-refresh' },
    ],
  },
  { label: 'How It Works', href: '/how-it-works' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Blog', href: '/blog' },
  { label: 'About', href: '/about' },
];

function NavDropdown({ label, href, items }: { label: string; href: string; items: { label: string; href: string }[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <Link
        href={href}
        className="font-inter font-medium text-secondary-text hover:text-navy relative group flex items-center gap-1"
        style={{ fontSize: '0.9rem' }}
      >
        {label}
        <ChevronDown size={14} className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-medium-blue transition-all duration-200 group-hover:w-full" />
      </Link>
      {open && (
        <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg py-2 min-w-[260px] z-50">
          {items.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="block font-inter font-medium text-secondary-text hover:text-navy hover:bg-gray-50 px-4 py-2.5 transition-colors"
              style={{ fontSize: '0.875rem' }}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <div className="border-t border-gray-100 mt-1 pt-1">
            <Link
              href={href}
              className="block font-inter font-semibold text-medium-blue hover:bg-blue-50 px-4 py-2.5 transition-colors"
              style={{ fontSize: '0.875rem' }}
              onClick={() => setOpen(false)}
            >
              View All Services
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSubOpen, setMobileSubOpen] = useState(false);
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

  const ctaButton = (isPaidUser: boolean, isAdmin: boolean) => {
    if (isAdmin) return { label: 'Admin', href: '/personal/admin' };
    if (isPaidUser) return { label: 'Personal', href: '/personal' };
    return { label: 'See All Services', href: '/services' };
  };

  const cta = ctaButton(isPaidUser, !!(isAdmin && !adminLoading));

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
          {navLinks.map((link) =>
            link.sub ? (
              <NavDropdown key={link.label} label={link.label} href={link.href} items={link.sub} />
            ) : (
              <Link
                key={link.label}
                href={link.href}
                className="font-inter font-medium text-secondary-text hover:text-navy relative group"
                style={{ fontSize: '0.9rem' }}
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-medium-blue transition-all duration-200 group-hover:w-full" />
              </Link>
            )
          )}
        </div>

        {/* Desktop CTA */}
        <div className="hidden lg:flex items-center gap-3 ml-auto pr-6">
          {(isAdmin && !adminLoading) || isPaidUser ? (
            <>
              <Link
                href={cta.href}
                className="font-inter font-semibold text-white bg-navy rounded-md hover:bg-medium-blue transition-colors duration-200"
                style={{ padding: '10px 20px', fontSize: '0.9rem' }}
              >
                {cta.label}
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
                href="/services"
                className="font-inter font-semibold text-white bg-navy rounded-md hover:bg-medium-blue transition-colors duration-200"
                style={{ padding: '10px 20px', fontSize: '0.9rem' }}
              >
                See All Services
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
                href="/services"
                className="font-inter font-semibold text-white bg-navy rounded-md hover:bg-medium-blue transition-colors duration-200"
                style={{ padding: '10px 20px', fontSize: '0.9rem' }}
              >
                See All Services
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
        <div className="fixed inset-0 bg-navy z-40 flex flex-col items-center justify-center gap-6 lg:hidden overflow-y-auto py-10">
          {navLinks.map((link) =>
            link.sub ? (
              <div key={link.label} className="text-center">
                <button
                  onClick={() => setMobileSubOpen(!mobileSubOpen)}
                  className="font-inter font-medium text-white text-2xl flex items-center gap-2"
                >
                  {link.label}
                  <ChevronDown size={20} className={`transition-transform duration-200 ${mobileSubOpen ? 'rotate-180' : ''}`} />
                </button>
                {mobileSubOpen && (
                  <div className="flex flex-col gap-3 mt-3">
                    <Link
                      href={link.href}
                      className="font-inter font-medium text-white/80 text-lg"
                      onClick={() => setMobileOpen(false)}
                    >
                      View All Services
                    </Link>
                    {link.sub.map((sub) => (
                      <Link
                        key={sub.label}
                        href={sub.href}
                        className="font-inter font-normal text-white/70 text-base"
                        onClick={() => setMobileOpen(false)}
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={link.label}
                href={link.href}
                className="font-inter font-medium text-white text-2xl"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            )
          )}
          <Link
            href={cta.href}
            className="font-inter font-semibold text-navy bg-white rounded-md mt-4"
            style={{ padding: '14px 32px', fontSize: '1rem' }}
            onClick={() => setMobileOpen(false)}
          >
            {cta.label}
          </Link>
          {user && !authLoading && (
            <button
              onClick={handleSignOut}
              className="font-inter font-medium text-white mt-2"
              style={{ fontSize: '1rem' }}
            >
              Sign Out
            </button>
          )}
          {!user && !authLoading && (
            <Link
              href="/login"
              className="font-inter font-medium text-white"
              style={{ fontSize: '1.2rem' }}
              onClick={() => setMobileOpen(false)}
            >
              Log In
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
