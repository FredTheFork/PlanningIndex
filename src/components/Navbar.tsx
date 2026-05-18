import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useClientProfile } from '../hooks/useClientProfile';

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
  const { user, loading: authLoading, signOut } = useAuth();
  const { profile, loading: profileLoading } = useClientProfile();
  const navigate = useNavigate();

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
    navigate('/');
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
        <Link to="/" className="flex items-center gap-2.5 shrink-0" style={{ height: 40 }}>
          {/* Rocket Icon */}
          <svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Rocket body */}
            <path d="M16 2C16 2 12 8 12 14C12 18.4 14 22 16 22C18 22 20 18.4 20 14C20 8 16 2 16 2Z" fill="#1B3F7A" />
            {/* Rocket nose cone */}
            <path d="M16 0C14 3 12 6 12 9L20 9C20 6 18 3 16 0Z" fill="#1B3F7A" />
            {/* Rocket window */}
            <ellipse cx="16" cy="8" rx="2.5" ry="3" fill="white" />
            {/* Left fin */}
            <path d="M12 16C10 18 8 20 8 24C8 28 10 30 12 28V16Z" fill="#2C68C4" />
            {/* Right fin */}
            <path d="M20 16C22 18 24 20 24 24C24 28 22 30 20 28V16Z" fill="#2C68C4" />
            {/* Flame - bottom of rocket */}
            <path d="M14 22L16 28L18 22L16 24Z" fill="#FF6B35" opacity="0.8" />
            <path d="M15 24L16 26L17 24L16 25Z" fill="#FFD500" />
          </svg>
          <div className="flex flex-col">
            <span className="font-inter font-bold text-navy leading-none" style={{ fontSize: '1.15rem' }}>
              <span style={{ fontSize: '1.3rem' }}>F</span>oundationary
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
        <div className="hidden lg:flex items-center gap-12">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.to}
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
          {isPaidUser ? (
            <>
              <Link
                to="/personal"
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
                to="/checkout"
                className="font-inter font-semibold text-white bg-navy rounded-md hover:bg-medium-blue transition-colors duration-200"
                style={{ padding: '10px 20px', fontSize: '0.9rem' }}
              >
                Get Your Pack — £149
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
                to="/login"
                className="font-inter font-medium text-secondary-text hover:text-navy transition-colors duration-200"
                style={{ fontSize: '0.9rem' }}
              >
                Log In
              </Link>
              <Link
                to="/checkout"
                className="font-inter font-semibold text-white bg-navy rounded-md hover:bg-medium-blue transition-colors duration-200"
                style={{ padding: '10px 20px', fontSize: '0.9rem' }}
              >
                Get Your Pack — £149
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
              to={link.to}
              className="font-inter font-medium text-white text-2xl"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {isPaidUser ? (
            <>
              <Link
                to="/personal"
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
                to="/checkout"
                className="font-inter font-semibold text-navy bg-white rounded-md mt-4"
                style={{ padding: '14px 32px', fontSize: '1rem' }}
                onClick={() => setMobileOpen(false)}
              >
                Get Your Pack — £149
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
                to="/login"
                className="font-inter font-medium text-white"
                style={{ fontSize: '1.2rem' }}
                onClick={() => setMobileOpen(false)}
              >
                Log In
              </Link>
              <Link
                to="/checkout"
                className="font-inter font-semibold text-navy bg-white rounded-md mt-4"
                style={{ padding: '14px 32px', fontSize: '1rem' }}
                onClick={() => setMobileOpen(false)}
              >
                Get Your Pack — £149
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
