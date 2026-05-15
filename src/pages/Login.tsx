import { useState } from 'react';
import { Mail, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setError('');

    try {
      const { error: signInError } = await supabase.auth.signInWithOtp({
        email: email.trim().toLowerCase(),
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (signInError) {
        setError(signInError.message);
        return;
      }

      setSent(true);
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

        {sent ? (
          <div className="bg-white rounded-lg border border-border p-8 text-center">
            <div className="bg-green-50 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-4">
              <Mail size={24} className="text-success" />
            </div>
            <h1 className="font-inter font-bold text-navy text-lg mb-2">
              Check your email
            </h1>
            <p className="font-inter text-secondary-text text-sm mb-6">
              We've sent a login link to <strong>{email}</strong>.
              Click the link in the email to access your personal area.
            </p>
            <p className="font-inter text-secondary-text text-xs">
              Didn't receive it? Check your spam folder, or{' '}
              <button
                onClick={() => setSent(false)}
                className="text-medium-blue hover:underline font-medium"
              >
                try again
              </button>.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-border p-8">
            <h1 className="font-inter font-bold text-navy text-lg mb-1">
              Welcome back
            </h1>
            <p className="font-inter text-secondary-text text-sm mb-6">
              Enter your email and we'll send you a login link.
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
                    Send Login Link
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
        )}
      </div>
    </div>
  );
}
