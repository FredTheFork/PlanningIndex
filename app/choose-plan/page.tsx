'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Check, ShieldCheck, Clock } from 'lucide-react';
import { pricingTiers } from '@/lib/pricing';
import { usePlanPurchase } from '@/hooks/usePlanPurchase';
import { PricingToggle } from '@/components/ui';

function ChoosePlanContent() {
  const searchParams = useSearchParams();
  const preselectedPlan = searchParams.get('plan');

  const [annual, setAnnual] = useState(false);
  const { purchase, loading, error } = usePlanPurchase();

  return (
    <div className="min-h-screen bg-primary-50 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <Link href="/" className="inline-block mb-4">
            <span className="font-display font-bold text-primary-900 text-2xl">
              PlanningIndex
            </span>
          </Link>
          <h1 className="font-sans font-bold text-primary-900 mb-2" style={{ fontSize: 'clamp(1.75rem, 3vw, 2.25rem)' }}>
            Choose your plan
          </h1>
          <p className="font-sans text-primary-500 text-sm max-w-lg mx-auto">
            Buy the plan you need straight away, or start with a 14-day free trial — no credit card required. Upgrade, downgrade, or cancel anytime.
          </p>
        </div>

        {error && (
          <div className="max-w-2xl mx-auto mb-6">
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 font-sans text-sm text-red-700">
              {error}
            </div>
          </div>
        )}

        <div className="flex justify-center mb-10">
          <PricingToggle onCycleChange={(cycle) => setAnnual(cycle === 'annual')} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {pricingTiers.map((tier) => {
            const price = annual ? tier.annualPrice : tier.monthlyPrice;
            const displayPrice = tier.trial
              ? 'Free'
              : price === null
                ? 'Custom'
                : annual
                  ? `\u00A3${price.toLocaleString('en-GB')}`
                  : `\u00A3${price}`;

            const suffix = tier.trial
              ? '/14 days'
              : price === null
                ? ''
                : annual
                  ? '/year'
                  : tier.priceSuffix;

            const isLoading = loading === tier.slug;
            const isPreselected = preselectedPlan === tier.slug;

            return (
              <div
                key={tier.slug}
                className={`relative flex flex-col rounded-2xl border bg-white p-6 transition-all duration-200 ${
                  tier.popular
                    ? 'border-accent-500 shadow-raised ring-2 ring-accent-500/20 lg:scale-[1.02]'
                    : 'border-primary-200 hover:border-primary-300 hover:shadow-card-hover'
                } ${isPreselected ? 'ring-2 ring-accent-500' : ''}`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center rounded-full bg-accent-600 px-3 py-1 font-sans text-xs font-semibold text-white shadow-sm">
                      Most popular
                    </span>
                  </div>
                )}

                <h3 className="font-sans font-bold text-primary-900 text-lg mb-1">
                  {tier.name}
                </h3>
                <p className="font-sans text-primary-500 text-sm leading-relaxed mb-6 min-h-[2.5rem]">
                  {tier.description}
                </p>

                <div className="mb-1">
                  <span className="font-display font-bold text-primary-900" style={{ fontSize: '2.5rem' }}>
                    {displayPrice}
                  </span>
                  {suffix && (
                    <span className="font-sans text-primary-400 text-sm">{suffix}</span>
                  )}
                </div>
                {annual && price !== null && !tier.trial && (
                  <p className="font-sans text-xs text-emerald-600 font-medium mb-4">
                    Save 20% with annual billing
                  </p>
                )}
                {(!annual || tier.trial) && <div className="mb-4" />}

                <div className="border-t border-primary-100 pt-5 mb-6 flex-1">
                  <ul className="space-y-2.5">
                    {tier.features.map((feature, i) => {
                      const isHeader = feature.endsWith(':');
                      return (
                        <li key={i} className={isHeader ? 'pt-2' : ''}>
                          {isHeader ? (
                            <span className="font-sans font-semibold text-primary-900 text-sm">
                              {feature}
                            </span>
                          ) : (
                            <div className="flex items-start gap-2.5">
                              <Check size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                              <span className="font-sans text-primary-600 text-sm">
                                {feature}
                              </span>
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => purchase(tier.slug, annual ? 'annual' : 'monthly')}
                  className={`inline-flex items-center justify-center rounded-lg font-sans font-semibold text-sm transition-colors w-full disabled:opacity-60 disabled:cursor-not-allowed ${
                    tier.trial
                      ? 'bg-white text-primary-900 border border-primary-300 hover:border-primary-500'
                      : tier.popular
                        ? 'bg-accent-600 text-white hover:bg-accent-700'
                        : 'bg-primary-900 text-white hover:bg-primary-800'
                  }`}
                  style={{ padding: '12px 24px' }}
                >
                  {isLoading ? 'Please wait…' : tier.ctaLabel}
                </button>
              </div>
            );
          })}
        </div>

        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 text-center">
          <div className="flex items-center gap-2 text-sm text-primary-500">
            <ShieldCheck size={16} className="text-emerald-600" />
            14-day free trial
          </div>
          <div className="flex items-center gap-2 text-sm text-primary-500">
            <Clock size={16} className="text-emerald-600" />
            Cancel anytime
          </div>
        </div>

        <div className="text-center mt-8">
          <Link href="/pricing" className="font-sans text-sm text-primary-500 hover:text-primary-900 transition-colors">
            Compare all features
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ChoosePlanPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-primary-50 flex items-center justify-center"><div className="w-8 h-8 border-2 border-primary-200 border-t-accent-600 rounded-full animate-spin" /></div>}>
      <ChoosePlanContent />
    </Suspense>
  );
}
