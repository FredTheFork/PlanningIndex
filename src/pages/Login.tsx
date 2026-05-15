import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../lib/supabase';

const ADMIN_EMAILS = ['foundationarybusiness@gmail.com'];

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return;

    setLoading(true);
    setError('');

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (signInError) {
        if (signInError.message === 'Invalid login credentials') {
          setError('Invalid email or password. If you just purchased, set your password from the success page first.');
        } else {
          setError(signInError.message);
        }
        return;
      }

      // Check if this user is an admin and redirect accordingly
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Check JWT app_metadata first
        const jwtRole = user.app_metadata?.role;
        if (jwtRole === 'admin') {
          navigate('/personal/admin', { replace: true });
          return;
        }

        // Fallback: check admin email list
        if (ADMIN_EMAILS.includes(user.email?.toLowerCase() || '')) {
          navigate('/personal/admin', { replace: true });
          return;
        }

        // Final fallback: try admin_users table
        try {
          const { data: adminRecord } = await supabase
            .from('admin_users')
            .select('role')
            .eq('user_id', user.id)
            .maybeSingle();

          if (adminRecord) {
            navigate('/personal/admin', { replace: true });
            return;
          }
        } catch {
          // Table may not be accessible, ignore
        }
      }

      navigate('/personal', { replace: true });
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-off-white flex items-center justify-center py-12 px-6">
      <div className="max-w-sm w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <a href="/" className="inline-block">
            <span className="font-inter font-bold text-navy text-2xl">
              <span style={{ fontSize: '1.6rem' }}>F</span>oundationary
            </span>
          </a>
          <p className="font-inter text-secondary-text text-sm mt-2">
            Client login
          </p>
        </div>

        <div className="bg-white rounded-lg border border-border p-8">
          <h1 className="font-inter font-bold text-navy text-lg mb-1">
            Welcome back
          </h1>
          <p className="font-inter text-secondary-text text-sm mb-6">
            Sign in to access your personal area.
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
              <p className="font-inter text-sm text-danger">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block font-inter font-medium text-dark-text text-sm mb-1.5">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoFocus
                className="block w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-medium-blue focus:border-medium-blue font-inter text-sm"
              />
            </div>

            <div>
              <label className="block font-inter font-medium text-dark-text text-sm mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your password"
                  required
                  className="block w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-medium-blue focus:border-medium-blue font-inter text-sm pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-text hover:text-navy"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full font-inter font-semibold text-white bg-navy rounded-md hover:bg-medium-blue transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{ padding: '12px 24px', fontSize: '0.95rem' }}
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
              ) : (
                <>
                  Log In
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-border text-center">
            <p className="font-inter text-secondary-text text-xs">
              Don't have an account?{' '}
              <a href="/checkout" className="text-medium-blue hover:underline font-medium">
                Purchase your pack
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
