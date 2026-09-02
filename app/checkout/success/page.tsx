'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui';

function CheckoutSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setRedirecting(true);
      router.replace('/app');
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-primary-50 flex items-center justify-center py-12 px-6">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 rounded-full bg-success-50 flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={32} className="text-success-600" />
        </div>

        <h1 className="font-sans font-bold text-primary-900 mb-3" style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}>
          Welcome to PlanningIndex!
        </h1>

        <p className="font-sans text-primary-500 leading-relaxed mb-8" style={{ fontSize: '1.05rem' }}>
          Your subscription is now active. You have full access to every planning application across the UK.
          {redirecting ? ' Taking you to your dashboard...' : ' You can start searching right away.'}
        </p>

        {sessionId && (
          <p className="font-mono text-xs text-primary-400 mb-6">
            Session: {sessionId}
          </p>
        )}

        <Link href="/app">
          <Button rightIcon={<ArrowRight size={16} />}>
            Go to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-primary-50 flex items-center justify-center"><div className="w-8 h-8 border-2 border-primary-200 border-t-accent-600 rounded-full animate-spin" /></div>}>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
