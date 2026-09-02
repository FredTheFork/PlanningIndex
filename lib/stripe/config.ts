import { pricingTiers } from '@/lib/pricing';

export const STRIPE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';
export const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || '';
export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || '';

export function isStripeConfigured(): boolean {
  return Boolean(STRIPE_SECRET_KEY && STRIPE_SECRET_KEY.startsWith('sk_'));
}

export type BillingCycle = 'monthly' | 'annual';
export type PlanTier = 'local' | 'regional' | 'national' | 'enterprise';

export function getStripePriceId(tier: PlanTier, cycle: BillingCycle): string | null {
  const tierData = pricingTiers.find((t) => t.slug === tier);
  if (!tierData) return null;
  return cycle === 'annual' ? tierData.annualStripePriceId : tierData.monthlyStripePriceId;
}
