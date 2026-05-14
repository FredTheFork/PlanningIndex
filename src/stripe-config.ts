export interface StripeProduct {
  priceId: string;
  name: string;
  description: string;
  mode: 'payment' | 'subscription';
  price: number;
  currency: string;
  currencySymbol: string;
}

export const stripeProducts: StripeProduct[] = [
  {
    priceId: 'price_1TX34AGfxcDbzGRtxVtQN95g',
    name: 'Business Foundations Pack',
    description: 'Complete business foundations pack for UK sole traders — 10 bespoke documents delivered in 24 hours',
    mode: 'payment',
    price: 149.00,
    currency: 'gbp',
    currencySymbol: '£',
  },
];

export function getProductByPriceId(priceId: string): StripeProduct | undefined {
  return stripeProducts.find(product => product.priceId === priceId);
}
