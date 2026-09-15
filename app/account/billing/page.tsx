'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CreditCard, Check, ArrowRight, XCircle, TrendingUp, TrendingDown } from 'lucide-react';
import { getSession } from '@/lib/api/client';
import { Button, Alert, Badge, ConfirmDialog } from '@/components/ui';
import { pricingTiers } from '@/lib/pricing';

interface PaymentHistoryItem {
  id: string;
  event_type: string;
  created_at: string;
  subscription_data: Record<string, unknown>;
}

export default function BillingPage() {
  const [loading, setLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [error, setError] = useState('');
  const [subscription, setSubscription] = useState<{
    plan_tier: string | null;
    billing_cycle: string | null;
    status: string;
    current_period_end: string | null;
    cancel_at_period_end: boolean;
  } | null>(null);
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistoryItem[]>([]);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  useEffect(() => {
    (async () => {
      const session = await getSession();
      if (session?.membership) {
        const m = session.membership;
        setSubscription({
          plan_tier: m.planTier,
          billing_cycle: m.billingCycle,
          status: m.status,
          current_period_end: m.currentPeriodEnd,
          cancel_at_period_end: m.cancelAtPeriodEnd,
        });
      }
      // Payment history is populated by Stripe webhooks once payments are live.
      setPaymentHistory([]);
      setLoading(false);
    })();
  }, []);

  const handlePortal = async () => {
    setPortalLoading(true);
    setError('');

    try {
      const response = await fetch('/api/portal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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

  const handleCancel = async () => {
    setCancelLoading(true);
    setError('');

    try {
      const response = await fetch('/api/cancel-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to cancel subscription.');
        return;
      }

      setSubscription((prev) => prev ? { ...prev, cancel_at_period_end: true } : null);
      setShowCancelConfirm(false);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setCancelLoading(false);
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

  const currentTierIndex = pricingTiers.findIndex((t) => t.slug === subscription?.plan_tier);
  const canUpgrade = currentTierIndex >= 0 && currentTierIndex < pricingTiers.length - 2;
  const canDowngrade = currentTierIndex > 0;

  const formatHistoryEvent = (item: PaymentHistoryItem): { label: string; amount: string | null } => {
    const data = item.subscription_data;
    const eventType = item.event_type;

    if (eventType === 'payment_succeeded') {
      const amountPaid = (data as Record<string, unknown>).amount_paid as number | undefined;
      return {
        label: 'Payment succeeded',
        amount: amountPaid ? `\u00A3${(amountPaid / 100).toFixed(2)}` : null,
      };
    }
    if (eventType === 'payment_failed') {
      return { label: 'Payment failed', amount: null };
    }
    if (eventType === 'created') {
      return { label: 'Subscription created', amount: null };
    }
    if (eventType === 'updated') {
      return { label: 'Subscription updated', amount: null };
    }
    if (eventType === 'deleted') {
      return { label: 'Subscription cancelled', amount: null };
    }
    return { label: eventType, amount: null };
  };

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
          {/* Current plan card */}
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

            <div className="mt-6 flex flex-wrap gap-3">
              <Button onClick={handlePortal} loading={portalLoading}>
                Manage Subscription
              </Button>
              <Link href="/choose-plan">
                <Button variant="outline">Change Plan</Button>
              </Link>
              {!subscription.cancel_at_period_end && (
                <Button
                  variant="danger"
                  leftIcon={<XCircle size={15} />}
                  onClick={() => setShowCancelConfirm(true)}
                >
                  Cancel
                </Button>
              )}
            </div>
          </div>

          {/* Upgrade / Downgrade */}
          {!subscription.cancel_at_period_end && (canUpgrade || canDowngrade) && (
            <div className="rounded-xl border border-primary-200 bg-white p-6">
              <h3 className="font-sans font-semibold text-primary-900 text-sm mb-4">
                Change your plan
              </h3>
              <div className="flex flex-wrap gap-3">
                {canUpgrade && (
                  <Link href="/choose-plan">
                    <Button variant="secondary" leftIcon={<TrendingUp size={15} />}>
                      Upgrade Plan
                    </Button>
                  </Link>
                )}
                {canDowngrade && (
                  <Link href="/choose-plan">
                    <Button variant="outline" leftIcon={<TrendingDown size={15} />}>
                      Downgrade Plan
                    </Button>
                  </Link>
                )}
              </div>
              <p className="font-sans text-xs text-primary-400 mt-3">
                Changes take effect at the start of your next billing period. You can switch between monthly and annual billing anytime.
              </p>
            </div>
          )}

          {/* What's included */}
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

          {/* Payment history */}
          <div className="rounded-xl border border-primary-200 bg-white p-6">
            <h3 className="font-sans font-semibold text-primary-900 text-sm mb-4">
              Payment history
            </h3>
            {paymentHistory.length > 0 ? (
              <div className="space-y-2">
                {paymentHistory.map((item) => {
                  const { label, amount } = formatHistoryEvent(item);
                  return (
                    <div key={item.id} className="flex items-center justify-between py-2 border-b border-primary-100 last:border-b-0">
                      <div>
                        <p className="font-sans text-sm font-medium text-primary-900">{label}</p>
                        <p className="font-sans text-xs text-primary-400 mt-0.5">
                          {new Date(item.created_at).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                      {amount && (
                        <span className="font-sans text-sm font-semibold text-primary-900">{amount}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="font-sans text-sm text-primary-400">
                No payment history yet. Your payments will appear here once your subscription is active.
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

      <ConfirmDialog
        open={showCancelConfirm}
        onClose={() => setShowCancelConfirm(false)}
        onConfirm={handleCancel}
        title="Cancel subscription?"
        message="Your subscription will remain active until the end of your current billing period, after which it will be cancelled. You can re-subscribe at any time."
        confirmLabel="Cancel Subscription"
        danger
        loading={cancelLoading}
      />
    </div>
  );
}
