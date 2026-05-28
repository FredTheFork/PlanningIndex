export interface StripeProduct {
  priceId: string;
  name: string;
  description: string;
  mode: 'payment' | 'subscription';
  price: number;
  currency: string;
  currencySymbol: string;
}

// Set NEXT_PUBLIC_STRIPE_MODE to 'test' or 'live' to switch between Stripe environments
// Defaults to 'test' if not set
const stripeMode = (process.env.NEXT_PUBLIC_STRIPE_MODE ?? 'test') as 'test' | 'live';

// Price IDs differ between test and live Stripe environments
// You need to create the same product in both environments
const priceIds: Record<string, { test: string; live: string }> = {
  business_foundations_pack: {
    test: 'price_1TZc9UGfxcDbzGRtniOLIJLE',
    live: 'price_1TX34AGfxcDbzGRtxVtQN95g', // Update this with your live price ID
  },
};

export const stripeProducts: StripeProduct[] = [
  {
    priceId: priceIds.business_foundations_pack[stripeMode],
    name: 'Business Foundations Pack',
    description: 'Complete business foundations pack for UK sole traders — 10 bespoke documents delivered in 24 hours',
    mode: 'payment',
    price: 79.00,
    currency: 'gbp',
    currencySymbol: '£',
  },
];

export function getProductByPriceId(priceId: string): StripeProduct | undefined {
  return stripeProducts.find(product => product.priceId === priceId);
}

export { stripeMode };
