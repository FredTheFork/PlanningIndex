'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Mail, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { Button, Input, Alert } from '@/components/ui';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setError('');

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email.trim().toLowerCase(),
        { redirectTo: `${window.location.origin}/reset-password` }
      );

      if (resetError) {
        setError(resetError.message);
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
    <div className="min-h-screen bg-primary-50 flex items-center justify-center py-12 px-6">
      <div className="max-w-sm w-full">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <span className="font-display font-bold text-primary-900 text-2xl">
              PlanningIndex
            </span>
          </Link>
          <p className="font-sans text-primary-500 text-sm mt-2">
            Reset your password
          </p>
        </div>

        <div className="bg-white rounded-xl border border-primary-200 p-8 shadow-card">
          {sent ? (
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-success-50 flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={24} className="text-success-600" />
              </div>
              <h1 className="font-sans font-bold text-primary-900 text-lg mb-2">
                Check your email
              </h1>
              <p className="font-sans text-primary-500 text-sm mb-6">
                We&apos;ve sent a password reset link to <strong>{email}</strong>. Click the link in the email to set a new password.
              </p>
              <Link
                href="/login"
                className="font-sans font-semibold text-accent-600 hover:text-accent-700 transition-colors text-sm"
              >
                Back to login
              </Link>
            </div>
          ) : (
            <>
              <h1 className="font-sans font-bold text-primary-900 text-lg mb-1">
                Forgot password?
              </h1>
              <p className="font-sans text-primary-500 text-sm mb-6">
                Enter your email address and we&apos;ll send you a link to reset your password.
              </p>

              {error && (
                <Alert variant="danger" className="mb-4">
                  {error}
                </Alert>
              )}

              <form onSubmit={handleReset} className="space-y-4">
                <Input
                  label="Email address"
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  autoFocus
                  leftIcon={<Mail size={16} />}
                />

                <Button
                  type="submit"
                  fullWidth
                  loading={loading}
                  rightIcon={!loading ? <ArrowRight size={16} /> : undefined}
                >
                  Send Reset Link
                </Button>
              </form>

              <div className="mt-6 pt-4 border-t border-primary-200 text-center">
                <p className="font-sans text-primary-500 text-xs">
                  Remembered your password?{' '}
                  <Link href="/login" className="text-accent-600 hover:underline font-medium">
                    Log in
                  </Link>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
