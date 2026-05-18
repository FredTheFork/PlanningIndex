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
        <Link to="/" className="flex items-center gap-3 shrink-0" style={{ height: 40 }}>
          {/* Rocket and Launch Tower SVG */}
          <svg width="50" height="50" viewBox="0 0 200 220" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ minWidth: 50, minHeight: 50 }}>
            {/* Base platform */}
            <rect x="20" y="190" width="160" height="12" fill="#1B3F7A" />

            {/* Launch tower - vertical post */}
            <rect x="115" y="30" width="12" height="160" fill="#1B3F7A" />

            {/* Launch tower - top platform */}
            <rect x="85" y="25" width="70" height="15" fill="#1B3F7A" />
            <rect x="95" y="18" width="50" height="10" fill="#1B3F7A" />
            <rect x="110" y="8" width="20" height="12" fill="#1B3F7A" />

            {/* Tower braces - left side */}
            <line x1="115" y1="50" x2="75" y2="75" stroke="#1B3F7A" strokeWidth="6" strokeLinecap="round" />
            <line x1="115" y1="80" x2="70" y2="110" stroke="#1B3F7A" strokeWidth="6" strokeLinecap="round" />
            <line x1="115" y1="110" x2="75" y2="140" stroke="#1B3F7A" strokeWidth="6" strokeLinecap="round" />
            <line x1="115" y1="140" x2="80" y2="165" stroke="#1B3F7A" strokeWidth="6" strokeLinecap="round" />

            {/* Tower braces - right side */}
            <line x1="127" y1="50" x2="160" y2="75" stroke="#1B3F7A" strokeWidth="6" strokeLinecap="round" />
            <line x1="127" y1="80" x2="165" y2="110" stroke="#1B3F7A" strokeWidth="6" strokeLinecap="round" />
            <line x1="127" y1="110" x2="160" y2="140" stroke="#1B3F7A" strokeWidth="6" strokeLinecap="round" />
            <line x1="127" y1="140" x2="155" y2="165" stroke="#1B3F7A" strokeWidth="6" strokeLinecap="round" />

            {/* Connection arm from rocket to tower */}
            <rect x="55" y="82" width="35" height="10" fill="#1B3F7A" />
            <rect x="50" y="76" width="8" height="22" fill="#1B3F7A" />

            {/* Rocket - main body */}
            <path d="M 45 180 Q 35 160 35 120 Q 35 80 45 50 Q 45 40 50 35 Q 55 40 55 50 Q 55 80 55 120 Q 55 160 45 180 Z" fill="#1B3F7A" />
            <path d="M 45 40 Q 40 35 45 15 Q 50 35 55 40 Z" fill="#1B3F7A" />

            {/* Rocket window */}
            <ellipse cx="45" cy="85" rx="5" ry="7" fill="white" />

            {/* Rocket fins - left */}
            <path d="M 35 120 Q 15 115 10 135 Q 20 140 35 135 Z" fill="#2C68C4" />

            {/* Rocket fins - right */}
            <path d="M 55 120 Q 75 115 80 135 Q 70 140 55 135 Z" fill="#2C68C4" />

            {/* Rocket engine nozzle section */}
            <rect x="40" y="172" width="10" height="8" fill="#1B3F7A" />
            <path d="M 38 180 L 52 180 L 50 190 L 40 190 Z" fill="#1B3F7A" />
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
        <div className="hidden lg:flex items-center" style={{ marginLeft: '20px', gap: '2rem' }}>
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
