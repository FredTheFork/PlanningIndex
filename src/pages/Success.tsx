import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Mail } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export function Success() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
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

        <div className="bg-white rounded-lg border border-border p-6 mb-8 text-left">
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

        {user ? (
          <Link
            to="/personal"
            className="inline-block font-inter font-semibold text-white bg-navy rounded-md hover:bg-medium-blue transition-colors duration-200"
            style={{ padding: '14px 32px', fontSize: '1rem' }}
          >
            Go to Personal Area
          </Link>
        ) : (
          <p className="font-inter text-secondary-text text-sm">
            Didn't receive the email? Check your spam folder, or{' '}
            <button
              onClick={async () => {
                // Will be handled by magic link flow
              }}
              className="text-medium-blue hover:underline font-medium"
            >
              contact support
            </button>.
          </p>
        )}
      </div>
    </div>
  );
}
