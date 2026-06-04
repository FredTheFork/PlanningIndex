// Foundationary Service Catalog
// Defines every purchasable service as a first-class entity.
// This is the single source of truth for what we sell.

export type ServiceMode = 'payment' | 'subscription';

export interface ServiceCatalogEntry {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  currencySymbol: string;
  mode: ServiceMode;
  /** Stripe price IDs per environment. Set after creating products in Stripe Dashboard. */
  stripePriceIds: { test: string; live: string };
  /** Stripe product IDs per environment. */
  stripeProductIds: { test: string; live: string };
  /** What the customer receives — shown on checkout and pricing pages. */
  includes: string[];
  /** Whether this service requires an intake form to be completed. */
  requiresIntake: boolean;
  /** Intake form section IDs this service needs (from intake-definition.ts). */
  intakeSections: string[];
  /** Whether this service can be purchased on its own (without the core pack). */
  isStandalone: boolean;
  /** Bundle discount config: when bought with the specified service, apply this amount off. */
  discountWhenBundledWith?: { serviceId: string; amountOff: number }[];
  /** Display order on pricing/checkout pages. Lower = shown first. */
  sortOrder: number;
  /** Whether this is the core/primary product. */
  isCore: boolean;
  /** Subscription interval (only for mode='subscription'). */
  subscriptionInterval?: 'month' | 'year';
  /** Human-readable price label (e.g. "£79 — one-time", "£29 per quarter"). */
  priceLabel: string;
}

const stripeMode = (process.env.NEXT_PUBLIC_STRIPE_MODE ?? 'test') as 'test' | 'live';

export const serviceCatalog: ServiceCatalogEntry[] = [
  {
    id: 'business_foundations_pack',
    name: 'Business Foundations Pack',
    description:
      'Complete business foundations pack for UK sole traders — 10 bespoke documents delivered in 24 hours.',
    price: 79.0,
    currency: 'gbp',
    currencySymbol: '£',
    mode: 'payment',
    stripePriceIds: {
      test: 'price_1TZc9UGfxcDbzGRtniOLIJLE',
      live: 'price_1TX34AGfxcDbzGRtxVtQN95g',
    },
    stripeProductIds: {
      test: 'prod_UdvhNsQZM3C2RL',
      live: 'prod_UdvhNsQZM3C2RL',
    },
    includes: [
      'Bespoke Client Contract',
      'Terms & Conditions',
      'GDPR Privacy Policy',
      'Professional Bio',
      'Elevator Pitch (3 versions)',
      'LinkedIn Profile Script',
      'Professional Invoice Template',
      'New Client Welcome Emails (x3)',
      'Late Payment Letters (x3)',
      'Service Description Sheets',
    ],
    requiresIntake: true,
    intakeSections: [
      'business_identity',
      'services',
      'clients',
      'pricing',
      'gdpr',
      'legal',
      'brand',
      'invoice',
      'linkedin',
      'final',
    ],
    isStandalone: true,
    discountWhenBundledWith: [
      { serviceId: 'website_copy_pack', amountOff: 9 },
      { serviceId: 'social_media_pack', amountOff: 9 },
    ],
    sortOrder: 1,
    isCore: true,
    priceLabel: '£79 — one-time',
  },
  {
    id: 'website_copy_pack',
    name: 'Website Copy Starter Pack',
    description:
      'Professional website copy written in your voice, aligned with your services, and ready to paste into any website builder.',
    price: 49.0,
    currency: 'gbp',
    currencySymbol: '£',
    mode: 'payment',
    stripePriceIds: {
      test: '',
      live: '',
    },
    stripeProductIds: {
      test: 'prod_UdvhNsQZM3C2RL',
      live: 'prod_UdvhNsQZM3C2RL',
    },
    includes: [
      'Homepage (hero, benefits, CTA)',
      'About page',
      'Services page (aligned with your service sheets)',
      'Contact page',
    ],
    requiresIntake: true,
    intakeSections: [
      'business_identity',
      'services',
      'clients',
      'brand',
      'website_copy',
      'final',
    ],
    isStandalone: true,
    discountWhenBundledWith: [
      { serviceId: 'business_foundations_pack', amountOff: 9 },
    ],
    sortOrder: 2,
    isCore: false,
    priceLabel: '£49 — one-time',
  },
  {
    id: 'social_media_pack',
    name: 'Social Media Starter Pack',
    description:
      '30 done-for-you posts tailored to your industry, audience, and offer. Billed at £20 per 5 posts.',
    price: 120.0,
    currency: 'gbp',
    currencySymbol: '£',
    mode: 'payment',
    stripePriceIds: {
      test: '',
      live: '',
    },
    stripeProductIds: {
      test: 'prod_UdvoYyIfAtIHjh',
      live: 'prod_UdvoYyIfAtIHjh',
    },
    includes: [
      'Educational posts',
      'Promotional posts',
      'Personal / trust-building posts',
      'Captions & hashtag suggestions',
    ],
    requiresIntake: true,
    intakeSections: [
      'business_identity',
      'services',
      'brand',
      'social_media',
      'final',
    ],
    isStandalone: true,
    discountWhenBundledWith: [
      { serviceId: 'business_foundations_pack', amountOff: 9 },
    ],
    sortOrder: 3,
    isCore: false,
    priceLabel: '£20 per 5 posts',
  },
  {
    id: 'quarterly_refresh',
    name: 'Quarterly Document Refresh',
    description:
      'Keep your documents accurate as your business evolves. Recurring billing every 4 months.',
    price: 29.0,
    currency: 'gbp',
    currencySymbol: '£',
    mode: 'subscription',
    stripePriceIds: {
      test: '',
      live: '',
    },
    stripeProductIds: {
      test: 'prod_UdvqABMskIHzzZ',
      live: 'prod_UdvqABMskIHzzZ',
    },
    includes: [
      'One document update per quarter',
      'Pricing changes',
      'New services',
      'GDPR updates if needed',
    ],
    requiresIntake: false,
    intakeSections: [],
    isStandalone: false,
    sortOrder: 4,
    isCore: false,
    subscriptionInterval: 'month',
    priceLabel: '£29 every 4 months',
  },
];

// ── Helpers ──

export function getServiceById(id: string): ServiceCatalogEntry | undefined {
  return serviceCatalog.find((s) => s.id === id);
}

export function getCoreService(): ServiceCatalogEntry {
  return serviceCatalog.find((s) => s.isCore)!;
}

export function getStandaloneServices(): ServiceCatalogEntry[] {
  return serviceCatalog.filter((s) => s.isStandalone);
}

export function getOptionalServices(): ServiceCatalogEntry[] {
  return serviceCatalog.filter((s) => !s.isCore);
}

/** Get the active Stripe price ID for a service, based on current mode. */
export function getStripePriceId(serviceId: string): string | undefined {
  const service = getServiceById(serviceId);
  return service?.stripePriceIds[stripeMode];
}

/** Get the active Stripe product ID for a service, based on current mode. */
export function getStripeProductId(serviceId: string): string | undefined {
  const service = getServiceById(serviceId);
  return service?.stripeProductIds[stripeMode];
}

/**
 * Calculate the total discount for a given set of selected service IDs.
 * A discount only applies when BOTH services in a bundle are selected.
 */
export function calculateBundleDiscount(selectedServiceIds: string[]): number {
  let totalDiscount = 0;

  for (const serviceId of selectedServiceIds) {
    const service = getServiceById(serviceId);
    if (!service?.discountWhenBundledWith) continue;

    for (const bundle of service.discountWhenBundledWith) {
      if (selectedServiceIds.includes(bundle.serviceId)) {
        totalDiscount += bundle.amountOff;
      }
    }
  }

  // Each bundle discount is defined from both sides, so divide by 2 to avoid double-counting.
  return totalDiscount / 2;
}

/** Calculate the total price for a set of selected service IDs, including bundle discounts. */
export function calculateTotal(selectedServiceIds: string[]): {
  subtotal: number;
  discount: number;
  total: number;
} {
  let subtotal = 0;
  for (const serviceId of selectedServiceIds) {
    const service = getServiceById(serviceId);
    if (service) subtotal += service.price;
  }

  const discount = calculateBundleDiscount(selectedServiceIds);
  return { subtotal, discount, total: subtotal - discount };
}

export { stripeMode };
