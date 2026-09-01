'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
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
        setError(signInError.message);
        return;
      }

      router.replace('/app');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary-50 flex items-center justify-center py-12 px-6">
      <div className="max-w-sm w-full">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <span className="font-sans font-bold text-primary-900" style={{ fontSize: '1.5rem' }}>
              PlanningIndex
            </span>
          </Link>
          <p className="font-sans text-primary-500 text-sm mt-2">
            Sign in to your account
          </p>
        </div>

        <div className="bg-white rounded-lg border border-primary-200 p-8">
          <h1 className="font-sans font-bold text-primary-900 text-lg mb-1">
            Welcome back
          </h1>
          <p className="font-sans text-primary-500 text-sm mb-6">
            Sign in to access your dashboard.
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
              <p className="font-sans text-sm text-danger">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block font-sans font-medium text-primary-900 text-sm mb-1.5">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoFocus
                className="block w-full px-3 py-2.5 border border-primary-300 rounded-md shadow-sm placeholder-primary-400 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 font-sans text-sm"
              />
            </div>

            <div>
              <label className="block font-sans font-medium text-primary-900 text-sm mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your password"
                  required
                  className="block w-full px-3 py-2.5 border border-primary-300 rounded-md shadow-sm placeholder-primary-400 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 font-sans text-sm pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-400 hover:text-primary-900"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full font-sans font-semibold text-white bg-primary-900 rounded-md hover:bg-primary-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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

          <div className="mt-6 pt-4 border-t border-primary-200 text-center">
            <p className="font-sans text-primary-500 text-xs">
              Don&apos;t have an account?{' '}
              <Link href="/contact" className="text-accent-600 hover:underline font-medium">
                Get in touch
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
