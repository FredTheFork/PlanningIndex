'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { CommunicationPreferencesModal } from '@/components/ui/CommunicationPreferencesModal';

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'set_password' | 'signing_in'>('loading');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [settingPassword, setSettingPassword] = useState(false);
  const [signingIn, setSigningIn] = useState(false);
  const [error, setError] = useState('');
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (!sessionId) {
      setStatus('set_password');
      return;
    }

    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        router.replace('/personal');
        return;
      }
      setStatus('set_password');
    });
  }, [searchParams, router]);

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return;

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setSettingPassword(true);
    setError('');

    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      const response = await fetch(`${supabaseUrl}/functions/v1/set-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${anonKey}`,
        },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      });

      if (response.status === 404) {
        setError('The password service is starting up. Please wait 30 seconds and try again.');
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to set password');
        return;
      }

      // Password set -- now sign in
      setSettingPassword(false);
      setSigningIn(true);

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (signInError) {
        setError('Password set but login failed. Please use the login page.');
        setSigningIn(false);
        return;
      }

      // Get the user ID from session
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.id) {
        setUserId(session.user.id);
        setShowPreferencesModal(true);
      } else {
        router.replace('/personal');
      }
    } catch (err) {
      console.error('Set password error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setSettingPassword(false);
      setSigningIn(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-off-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy mx-auto mb-4" />
          <p className="font-inter text-secondary-text">Confirming your payment...</p>
        </div>
      </div>
    );
  }

  const handleModalClose = () => {
    setShowPreferencesModal(false);
    router.replace('/personal');
  };

  return (
    <div className="min-h-screen bg-off-white flex items-center justify-center py-12 px-6">
      <CommunicationPreferencesModal
        userId={userId}
        userEmail={email}
        isOpen={showPreferencesModal}
        onClose={handleModalClose}
      />
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <CheckCircle className="mx-auto h-16 w-16 text-success mb-4" />
          <h1 className="font-inter font-bold text-navy text-2xl mb-2">
            Payment Successful
          </h1>
          <p className="font-inter text-secondary-text">
            Set a password to access your personal area and complete your intake form.
          </p>
        </div>

        {/* Set password form */}
        <div className="bg-white rounded-lg border border-border p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-off-white rounded-lg p-2.5">
              <Lock size={20} className="text-navy" />
            </div>
            <div>
              <p className="font-inter font-semibold text-navy text-sm">Set your password</p>
              <p className="font-inter text-secondary-text text-xs">Use the email you paid with</p>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
              <p className="font-inter text-sm text-danger">{error}</p>
            </div>
          )}

          <form onSubmit={handleSetPassword} className="space-y-4">
            <div>
              <label className="block font-inter font-medium text-dark-text text-sm mb-1.5">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="The email you used at checkout"
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
                  placeholder="At least 8 characters"
                  required
                  minLength={8}
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
              disabled={settingPassword || signingIn}
              className="w-full font-inter font-semibold text-white bg-navy rounded-md hover:bg-medium-blue transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{ padding: '12px 24px', fontSize: '0.95rem' }}
            >
              {settingPassword ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  Setting password...
                </>
              ) : signingIn ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  Signing in...
                </>
              ) : (
                <>
                  Set Password & Continue
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="font-inter text-secondary-text text-xs text-center mt-6">
          Already set your password?{' '}
          <button
            onClick={() => router.push('/login')}
            className="text-medium-blue hover:underline font-medium"
          >
            Log in
          </button>
        </p>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-off-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy mx-auto mb-4" />
          <p className="font-inter text-secondary-text">Loading...</p>
        </div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
