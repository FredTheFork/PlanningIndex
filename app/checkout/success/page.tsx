'use client';

import { useEffect, useRef, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui';
import { getSession } from '@/lib/api/client';

const POLL_INTERVAL_MS = 2500;
const MAX_POLLS = 20; // ~50 seconds

function hasActiveMembership(session: Awaited<ReturnType<typeof getSession>>): boolean {
  return Boolean(
    session?.membership &&
      (session.membership.status === 'active' || session.membership.status === 'trialing') &&
      !session.membership.cancelAtPeriodEnd
  );
}

function CheckoutSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [redirecting, setRedirecting] = useState(false);
  const [waiting, setWaiting] = useState(true);
  const pollCount = useRef(0);

  // The Stripe webhook (not the redirect itself) activates the membership.
  // Poll /api/auth/session until the webhook has landed, then go to the
  // workspace — otherwise a slow webhook would bounce a paying customer back
  // to /choose-plan.
  useEffect(() => {
    let cancelled = false;

    const poll = async () => {
      pollCount.current += 1;
      const session = await getSession();
      if (cancelled) return;
      if (hasActiveMembership(session) || pollCount.current >= MAX_POLLS) {
        setWaiting(false);
        setRedirecting(true);
        router.replace('/app');
        return;
      }
      setTimeout(poll, POLL_INTERVAL_MS);
    };

    poll();
    return () => {
      cancelled = true;
    };
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
          Payment received — confirming your subscription
          {waiting ? '…' : '. Your subscription is now active and you have full access to every planning application across the UK.'}
          {redirecting ? ' Taking you to your dashboard...' : ''}
        </p>

        {sessionId && (
          <p className="font-mono text-xs text-primary-400 mb-6">
            Session: {sessionId}
          </p>
        )}

        {!waiting && (
          <Link href="/app">
            <Button rightIcon={<ArrowRight size={16} />}>
              Go to Dashboard
            </Button>
          </Link>
        )}
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
