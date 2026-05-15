import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, Mail, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

export function Success() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'confirmed' | 'waiting'>('loading');
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (!sessionId) {
      setStatus('waiting');
      return;
    }

    // Check if user is already logged in (e.g. they completed checkout while logged in)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        // Already logged in, go straight to personal area
        navigate('/personal', { replace: true });
        return;
      }

      // Not logged in yet -- the webhook will have created their account
      // and sent a magic link. Show the confirmation page.
      setStatus('confirmed');
    });
  }, [searchParams, navigate]);

  // Poll for session in case the user clicks the magic link on the same device
  useEffect(() => {
    if (status !== 'confirmed') return;

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        navigate('/personal', { replace: true });
      }
    });

    return () => subscription.unsubscribe();
  }, [status, navigate]);

  const handleResendMagicLink = async () => {
    if (!email) return;
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      console.error('Error resending magic link:', error);
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

  return (
    <div className="min-h-screen bg-off-white flex items-center justify-center py-12 px-6">
      <div className="max-w-md w-full text-center">
        <CheckCircle className="mx-auto h-16 w-16 text-success mb-6" />

        <h1 className="font-inter font-bold text-navy text-2xl mb-3">
          Payment Successful
        </h1>

        <p className="font-inter text-secondary-text mb-8">
          Thank you for your purchase. We've sent a login link to your email.
          Click the link to access your personal area and complete your intake form.
        </p>

        <div className="bg-white rounded-lg border border-border p-6 mb-6 text-left">
          <div className="flex items-start gap-3">
            <Mail size={20} className="text-medium-blue mt-0.5 shrink-0" />
            <div>
              <p className="font-inter font-semibold text-navy text-sm mb-1">Check your email</p>
              <p className="font-inter text-secondary-text text-sm">
                We've sent you a magic login link. Click it to access your personal area where you can
                complete your intake form and track your document delivery.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-border p-6 mb-8 text-left">
          <p className="font-inter font-semibold text-navy text-sm mb-2">Didn't receive the email?</p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              value={email ?? ''}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm font-inter focus:outline-none focus:ring-2 focus:ring-medium-blue focus:border-medium-blue"
            />
            <button
              onClick={handleResendMagicLink}
              disabled={!email}
              className="font-inter font-medium text-white bg-navy rounded-md hover:bg-medium-blue transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ padding: '8px 16px', fontSize: '0.85rem' }}
            >
              Resend
            </button>
          </div>
          <p className="font-inter text-secondary-text text-xs mt-2">
            Check your spam folder if you don't see it within a minute.
          </p>
        </div>

        <button
          onClick={() => navigate('/login')}
          className="inline-flex items-center gap-2 font-inter font-semibold text-white bg-navy rounded-md hover:bg-medium-blue transition-colors duration-200"
          style={{ padding: '14px 32px', fontSize: '1rem' }}
        >
          Log In
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
