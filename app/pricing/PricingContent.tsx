'use client';

import { useState, Fragment } from 'react';
import Link from 'next/link';
import { Check } from 'lucide-react';
import { PricingToggle } from '@/components/ui';
import { pricingTiers, comparisonRows } from '@/lib/pricing';

export function PricingContent() {
  const [annual, setAnnual] = useState(false);

  return (
    <>
      {/* Pricing cards */}
      <section className="bg-white py-24 px-6">
        <div className="max-w-page mx-auto">
          <div className="flex justify-center mb-12">
            <PricingToggle onCycleChange={(cycle) => setAnnual(cycle === 'annual')} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pricingTiers.map((tier) => {
              const price = annual ? tier.annualPrice : tier.monthlyPrice;
              const displayPrice = price === null
                ? 'Custom'
                : annual
                  ? `£${price.toLocaleString('en-GB')}`
                  : `£${price}`;

              const suffix = price === null
                ? ''
                : annual
                  ? '/year'
                  : tier.priceSuffix;

              return (
                <div
                  key={tier.name}
                  className={`relative flex flex-col rounded-2xl border bg-white p-6 ${
                    tier.popular
                      ? 'border-accent-500 shadow-raised ring-2 ring-accent-500/20'
                      : 'border-primary-200'
                  }`}
                >
                  {tier.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="inline-flex items-center rounded-full bg-accent-600 px-3 py-1 font-sans text-xs font-semibold text-white">
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
                  {annual && price !== null && (
                    <p className="font-sans text-xs text-emerald-600 font-medium mb-4">
                      Save 20% with annual billing
                    </p>
                  )}
                  {!annual && <div className="mb-4" />}

                  <div className="border-t border-primary-100 pt-5 mb-6 flex-1">
                    <ul className="space-y-2.5">
                      {tier.features.map((feature, i) => {
                        const isHeader = feature.endsWith(':');
                        return (
                          <li
                            key={i}
                            className={isHeader ? 'pt-2' : ''}
                          >
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

                  <Link
                    href={tier.ctaHref}
                    className={`inline-flex items-center justify-center rounded-lg font-sans font-semibold text-sm transition-colors w-full ${
                      tier.popular
                        ? 'bg-accent-600 text-white hover:bg-accent-700'
                        : 'bg-primary-900 text-white hover:bg-primary-800'
                    }`}
                    style={{ padding: '12px 24px' }}
                  >
                    {tier.ctaLabel}
                  </Link>
                </div>
              );
            })}
          </div>

          <p className="text-center mt-8 font-sans text-sm text-primary-400">
            All prices exclude VAT. 14-day free trial on every plan. No credit card required.
          </p>
        </div>
      </section>

      {/* Comparison table */}
      <section className="bg-primary-50 py-24 px-6">
        <div className="max-w-page mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display font-bold text-primary-900 text-h2 mb-3">
              Compare all features
            </h2>
            <p className="font-sans text-primary-500 max-w-2xl mx-auto leading-relaxed" style={{ fontSize: '1.05rem' }}>
              Every plan includes the core PlanningIndex search. Choose the plan that matches your coverage and team size.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-primary-200 bg-white">
            <table className="w-full">
              <thead>
                <tr className="border-b border-primary-200 bg-primary-50">
                  <th className="px-6 py-4 text-left font-sans font-semibold text-primary-600 text-xs uppercase tracking-wide w-1/3">
                    Feature
                  </th>
                  {pricingTiers.map((tier) => (
                    <th key={tier.name} className="px-6 py-4 text-center font-sans font-bold text-primary-900 text-sm">
                      {tier.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row) => (
                  <Fragment key={row.category}>
                    <tr className="bg-primary-50/50">
                      <td colSpan={5} className="px-6 py-2.5">
                        <span className="font-sans font-semibold text-primary-900 text-sm">
                          {row.category}
                        </span>
                      </td>
                    </tr>
                    {row.features.map((feature) => (
                      <tr key={feature.label} className="border-b border-primary-100 last:border-b-0">
                        <td className="px-6 py-3.5 font-sans text-sm text-primary-600">
                          {feature.label}
                        </td>
                        {feature.values.map((value, i) => (
                          <td key={i} className="px-6 py-3.5 text-center">
                            {typeof value === 'boolean' ? (
                              value ? (
                                <Check size={16} className="text-emerald-600 mx-auto" />
                              ) : (
                                <span className="text-primary-300">—</span>
                              )
                            ) : (
                              <span className="font-sans text-sm font-medium text-primary-800">
                                {value}
                              </span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
}


export default PricingContent