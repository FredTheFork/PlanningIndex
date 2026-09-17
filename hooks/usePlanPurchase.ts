'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from '@/lib/api/client';

/**
 * Starts a plan purchase or a free trial from any pricing surface.
 * - Paid tiers go straight to Stripe Checkout (no trial attached).
 * - The 'trial' tier activates the 14-day free trial immediately.
 * - Anonymous visitors are routed to register first, with the plan
 *   preserved so the flow continues after signup.
 */
export function usePlanPurchase() {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState('');

  const purchase = useCallback(
    async (slug: string, cycle: 'monthly' | 'annual') => {
      if (slug === 'enterprise') {
        router.push('/contact');
        return;
      }

      const session = await getSession();
      if (!session?.user) {
        router.push(`/register?plan=${slug}`);
        return;
      }

      setLoading(slug);
      setError('');

      try {
        const response = await fetch(slug === 'trial' ? '/api/trial' : '/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(slug === 'trial' ? {} : { tier: slug, cycle }),
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.error || 'Something went wrong. Please try again.');
          return;
        }

        if (data.url) {
          window.location.href = data.url;
        }
      } catch {
        setError('Something went wrong. Please try again.');
      } finally {
        setLoading(null);
      }
    },
    [router]
  );

  return { purchase, loading, error, setError };
}
