'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { Button, Input, Alert, Checkbox } from '@/components/ui';

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const plan = searchParams.get('plan');

  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!companyName.trim()) {
      setError('Please enter your company name.');
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!agreed) {
      setError('Please agree to the Terms of Use and Privacy Policy.');
      return;
    }

    setLoading(true);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
      });

      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      if (data.user) {
        await supabase.from('profiles').insert({
          id: data.user.id,
          company_name: companyName.trim(),
          email: email.trim().toLowerCase(),
        });
        await supabase.from('customers').insert({
          user_id: data.user.id,
        });
      }

      router.push(plan ? `/choose-plan?plan=${plan}` : '/choose-plan');
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
            Create your account
          </p>
        </div>

        <div className="bg-white rounded-xl border border-primary-200 p-8 shadow-card">
          <h1 className="font-sans font-bold text-primary-900 text-lg mb-1">
            Get started
          </h1>
          <p className="font-sans text-primary-500 text-sm mb-6">
            Start finding work from planning applications today.
          </p>

          {error && (
            <Alert variant="danger" className="mb-4">
              {error}
            </Alert>
          )}

          <form onSubmit={handleRegister} className="space-y-4" noValidate>
            <Input
              label="Company name"
              name="companyName"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Your company name"
              required
              autoFocus
            />
            <Input
              label="Email address"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              required
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-primary-400 hover:text-primary-900 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
            />
            <Input
              label="Confirm password"
              type={showPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter your password"
              required
            />
            <Checkbox
              label="I agree to the Terms of Use and Privacy Policy"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />
            <Button
              type="submit"
              fullWidth
              loading={loading}
              rightIcon={!loading ? <ArrowRight size={16} /> : undefined}
            >
              Create Account
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t border-primary-200 text-center">
            <p className="font-sans text-primary-500 text-xs">
              Already have an account?{' '}
              <Link href="/login" className="text-accent-600 hover:underline font-medium">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
