'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CreditCard, Check, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { Button, Alert, Badge } from '@/components/ui';
import { pricingTiers } from '@/lib/pricing';

export default function BillingPage() {
  const [loading, setLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);
  const [error, setError] = useState('');
  const [subscription, setSubscription] = useState<{
    plan_tier: string | null;
    billing_cycle: string | null;
    status: string;
    current_period_end: string | null;
    cancel_at_period_end: boolean;
  } | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session?.user) return;
      const { data } = await supabase
        .from('subscriptions')
        .select('plan_tier, billing_cycle, status, current_period_end, cancel_at_period_end')
        .eq('user_id', session.user.id)
        .maybeSingle();

      setSubscription(data as typeof subscription);
      setLoading(false);
    });
  }, []);

  const handlePortal = async () => {
    setPortalLoading(true);
    setError('');

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch('/api/portal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to open billing portal.');
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setPortalLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-primary-200 border-t-accent-600 rounded-full animate-spin" />
      </div>
    );
  }

  const tier = subscription?.plan_tier
    ? pricingTiers.find((t) => t.slug === subscription.plan_tier)
    : null;

  const statusVariant = subscription?.status === 'active' ? 'success' : subscription?.status === 'trialing' ? 'info' : 'neutral';

  return (
    <div>
      <h2 className="font-sans font-semibold text-primary-900 text-lg mb-1">
        Billing
      </h2>
      <p className="font-sans text-primary-500 text-sm mb-6">
        Manage your subscription and billing details.
      </p>

      {error && <Alert variant="danger" className="mb-4">{error}</Alert>}

      {subscription ? (
        <div className="max-w-lg space-y-4">
          <div className="rounded-xl border border-primary-200 bg-white p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <CreditCard size={18} className="text-primary-500" />
                <h3 className="font-sans font-semibold text-primary-900 text-sm">Current plan</h3>
              </div>
              <Badge variant={statusVariant as 'success' | 'info' | 'neutral'}>
                {subscription.status || 'No plan'}
              </Badge>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="font-sans text-sm text-primary-500">Plan</span>
                <span className="font-sans text-sm font-medium text-primary-900">
                  {tier?.name || subscription.plan_tier || 'No plan'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-sans text-sm text-primary-500">Billing cycle</span>
                <span className="font-sans text-sm font-medium text-primary-900 capitalize">
                  {subscription.billing_cycle || '\u2014'}
                </span>
              </div>
              {subscription.current_period_end && (
                <div className="flex justify-between">
                  <span className="font-sans text-sm text-primary-500">
                    {subscription.cancel_at_period_end ? 'Expires' : 'Next payment'}
                  </span>
                  <span className="font-sans text-sm font-medium text-primary-900">
                    {new Date(subscription.current_period_end).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              )}
              {subscription.cancel_at_period_end && (
                <Alert variant="warning" className="mt-3">
                  Your subscription is cancelled but remains active until the end of your billing period.
                </Alert>
              )}
            </div>

            <div className="mt-6 flex gap-3">
              <Button onClick={handlePortal} loading={portalLoading}>
                Manage Subscription
              </Button>
              <Link href="/choose-plan">
                <Button variant="outline">Change Plan</Button>
              </Link>
            </div>
          </div>

          <div className="rounded-xl border border-primary-200 bg-white p-6">
            <h3 className="font-sans font-semibold text-primary-900 text-sm mb-3">
              What&apos;s included
            </h3>
            {tier ? (
              <ul className="space-y-2">
                {tier.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                    <span className="font-sans text-sm text-primary-600">{feature}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="font-sans text-sm text-primary-500">
                No plan details available.
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="max-w-lg rounded-xl border border-primary-200 bg-white p-8 text-center">
          <h3 className="font-sans font-semibold text-primary-900 text-base mb-2">
            No active subscription
          </h3>
          <p className="font-sans text-sm text-primary-500 mb-6">
            Choose a plan to get full access to PlanningIndex.
          </p>
          <Link href="/choose-plan">
            <Button rightIcon={<ArrowRight size={16} />}>
              Choose a Plan
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
