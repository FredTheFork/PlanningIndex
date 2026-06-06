// Stripe configuration — derives product data from the service catalog.
// The single source of truth for services is lib/services/service-catalog.ts.

import {
  serviceCatalog,
  getServiceById,
  stripeMode,
} from '@/lib/services/service-catalog';
import type { ServiceCatalogEntry } from '@/lib/services/service-catalog';

export { stripeMode };

// ── Backward-compatible StripeProduct interface ──
// Existing code that imports StripeProduct still works.

interface StripeProduct {
  id: string;
  priceId: string;
  productId: string;
  name: string;
  description: string;
  mode: 'payment' | 'subscription';
  price: number;
  currency: string;
  currencySymbol: string;
}

// ── Build stripeProducts array from service catalog ──

const stripeProducts: StripeProduct[] = serviceCatalog.map((service) => ({
  id: service.id,
  priceId: service.stripePriceIds[stripeMode],
  productId: service.stripeProductIds[stripeMode],
  name: service.name,
  description: service.description,
  mode: service.mode,
  price: service.price,
  currency: service.currency,
  currencySymbol: service.currencySymbol,
}));

// ── Helpers ──

function getProductByPriceId(priceId: string): StripeProduct | undefined {
  return stripeProducts.find((product) => product.priceId === priceId);
}

function getProductById(id: string): StripeProduct | undefined {
  return stripeProducts.find((product) => product.id === id);
}

function getCoreProduct(): StripeProduct {
  return stripeProducts.find((p) => p.id === 'business_foundations_pack')!;
}
