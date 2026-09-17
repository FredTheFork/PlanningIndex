import { pricingTiers } from '@/lib/pricing';

export const STRIPE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';
export const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || '';
export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || '';

export function isStripeConfigured(): boolean {
  return Boolean(STRIPE_SECRET_KEY && STRIPE_SECRET_KEY.startsWith('sk_'));
}

export type BillingCycle = 'monthly' | 'annual';
export type PlanTier = 'local' | 'regional' | 'national' | 'enterprise';

// Price IDs can be overridden per environment without a code change — set
// e.g. STRIPE_PRICE_REGIONAL_MONTHLY on the hosting platform (Vercel). This is
// how live-mode price IDs (sk_live products) replace the test-mode IDs baked
// into lib/pricing.ts when going to production.
export function getStripePriceId(tier: PlanTier, cycle: BillingCycle): string | null {
  const envPrice = process.env[`STRIPE_PRICE_${tier.toUpperCase()}_${cycle.toUpperCase()}`];
  if (envPrice) return envPrice;
  const tierData = pricingTiers.find((t) => t.slug === tier);
  if (!tierData) return null;
  return cycle === 'annual' ? tierData.annualStripePriceId : tierData.monthlyStripePriceId;
}
