// Foundationary Service Catalog
// Defines every purchasable service as a first-class entity.
// This is the single source of truth for what we sell.

type ServiceMode = 'payment' | 'subscription';

export interface PricingTier {
  quantity: number;
  price: number;
  label: string;
  stripePriceId: { test: string; live: string };
}

export interface ServiceCatalogEntry {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  currencySymbol: string;
  mode: ServiceMode;
  /** Stripe price IDs per environment (for simple pricing). Set after creating products in Stripe Dashboard. */
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
  /** Display order on pricing/checkout pages. Lower = shown first. */
  sortOrder: number;
  /** Whether this is the core/primary product. */
  isCore: boolean;
  /** Subscription interval (only for mode='subscription'). */
  subscriptionInterval?: 'month' | 'year';
  /** Human-readable price label (e.g. "£79 — one-time", "£29 per quarter"). */
  priceLabel: string;
  /** For services with quantity-based pricing (e.g., social media posts). */
  pricingTiers?: PricingTier[];
  /** Default quantity for tiered pricing services. */
  defaultQuantity?: number;
  /** Unit name for quantity-based services (e.g., "posts"). */
  quantityUnit?: string;
}

const stripeMode = (process.env.NEXT_PUBLIC_STRIPE_MODE ?? 'test') as 'test' | 'live';

/** Bundle discount tiers based on number of services purchased. */
export const BUNDLE_DISCOUNT_TIERS = {
  1: { percentage: 0, label: '' },
  2: { percentage: 10, label: '10% bundle discount' },
  3: { percentage: 15, label: '15% bundle discount — best value' },
} as const;

/** Get the discount percentage for a given number of services. */
export function getBundleDiscountPercentage(serviceCount: number): number {
  if (serviceCount >= 3) return 15;
  if (serviceCount >= 2) return 10;
  return 0;
}

/** Get the discount label for a given number of services. */
export function getBundleDiscountLabel(serviceCount: number): string {
  if (serviceCount >= 3) return BUNDLE_DISCOUNT_TIERS[3].label;
  if (serviceCount >= 2) return BUNDLE_DISCOUNT_TIERS[2].label;
  return '';
}

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
      'intro',
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
      test: 'price_1TfnutGfxcDbzGRtr7kC2XcM',
      live: '',
    },
    stripeProductIds: {
      test: 'prod_UfnqtTGEWkoXYK',
      live: 'prod_UfnqtTGEWkoXYK',
    },
    includes: [
      'Homepage (hero, benefits, CTA)',
      'About page',
      'Services page (aligned with your service sheets)',
      'Contact page',
      'FAQ, Blog, Pricing, or Testimonials pages (as needed)',
      'Website copy tailored to your brand voice and CTA',
      'Legal page copy guidance (Privacy, Terms, Cookie, etc.)',
    ],
    requiresIntake: true,
    intakeSections: [
      'intro',
      'business_identity',
      'services',
      'clients',
      'brand',
      'website_copy',
      'final',
    ],
    isStandalone: true,
    sortOrder: 2,
    isCore: false,
    priceLabel: '£49 — one-time',
  },
  {
    id: 'social_media_pack',
    name: 'Social Media Starter Pack',
    description:
      'Done-for-you posts tailored to your industry, audience, and offer. Choose from 5 to 30 posts.',
    price: 20.0, // Base price per 5 posts
    currency: 'gbp',
    currencySymbol: '£',
    mode: 'payment',
    stripePriceIds: {
      test: 'price_1Tfo0mGfxcDbzGRtHqF3MmVv', // 30 posts price (fallback)
      live: '',
    },
    stripeProductIds: {
      test: 'prod_Ufnsr70N1uRKfN',
      live: 'prod_Ufnsr70N1uRKfN',
    },
    includes: [
      'Educational posts',
      'Promotional posts',
      'Personal / trust-building posts',
      'Captions & hashtag suggestions',
    ],
    requiresIntake: true,
    intakeSections: [
      'intro',
      'business_identity',
      'services',
      'brand',
      'social_media',
      'final',
    ],
    isStandalone: true,
    sortOrder: 3,
    isCore: false,
    priceLabel: 'From £20 — 5 posts',
    defaultQuantity: 5,
    quantityUnit: 'posts',
    pricingTiers: [
      { quantity: 5, price: 20, label: '5 posts — £20', stripePriceId: { test: 'price_1TgTD4GfxcDbzGRtwfjjKSc9', live: '' } },
      { quantity: 10, price: 40, label: '10 posts — £40', stripePriceId: { test: 'price_1Tr5hIGfxcDbzGRt0wVZ5LgS', live: '' } },
      { quantity: 15, price: 57, label: '15 posts — £57', stripePriceId: { test: 'price_1Tr5hxGfxcDbzGRtnYzVnQmC', live: '' } },
      { quantity: 20, price: 73, label: '20 posts — £73', stripePriceId: { test: 'price_1Tr5icGfxcDbzGRtPj0VfTQf', live: '' } },
      { quantity: 25, price: 80, label: '25 posts — £80', stripePriceId: { test: 'price_1Tr5j6GfxcDbzGRt4Wk9cS8R', live: '' } },
      { quantity: 30, price: 110, label: '30 posts — £110', stripePriceId: { test: 'price_1Tfo0mGfxcDbzGRtHqF3MmVv', live: '' } },
    ],
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
      test: 'price_1Tfo1IGfxcDbzGRtpuP5Yg0n',
      live: '',
    },
    stripeProductIds: {
      test: 'prod_UfntRYA1SkzyAD',
      live: 'prod_UfntRYA1SkzyAD',
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

function getCoreService(): ServiceCatalogEntry {
  return serviceCatalog.find((s) => s.isCore)!;
}

function getStandaloneServices(): ServiceCatalogEntry[] {
  return serviceCatalog.filter((s) => s.isStandalone);
}

function getOptionalServices(): ServiceCatalogEntry[] {
  return serviceCatalog.filter((s) => !s.isCore);
}

/** Get the active Stripe price ID for a service, based on current mode. */
export function getStripePriceId(serviceId: string): string | undefined {
  const service = getServiceById(serviceId);
  return service?.stripePriceIds[stripeMode];
}

/** Get the Stripe price ID for a specific quantity tier. */
export function getStripePriceIdForQuantity(serviceId: string, quantity: number): string | undefined {
  const service = getServiceById(serviceId);
  if (!service) return undefined;

  if (service.pricingTiers) {
    const tier = service.pricingTiers.find(t => t.quantity === quantity);
    return tier?.stripePriceId[stripeMode];
  }

  return service.stripePriceIds[stripeMode];
}

/** Get price for a service at a specific quantity. */
export function getServicePrice(serviceId: string, quantity?: number): number {
  const service = getServiceById(serviceId);
  if (!service) return 0;

  if (service.pricingTiers && quantity) {
    const tier = service.pricingTiers.find(t => t.quantity === quantity);
    return tier?.price ?? service.price;
  }

  return service.price;
}

/** Get price label for a service at a specific quantity. */
export function getServicePriceLabel(serviceId: string, quantity?: number): string {
  const service = getServiceById(serviceId);
  if (!service) return '';

  if (service.pricingTiers && quantity) {
    const tier = service.pricingTiers.find(t => t.quantity === quantity);
    if (tier) return `£${tier.price} — ${tier.quantity} ${service.quantityUnit || 'items'}`;
  }

  return service.priceLabel;
}

/** Get the active Stripe product ID for a service, based on current mode. */
function getStripeProductId(serviceId: string): string | undefined {
  const service = getServiceById(serviceId);
  return service?.stripeProductIds[stripeMode];
}

/**
 * Returns a user-facing savings message for the current selection, or null if no discount applies.
 */
export function getBundleSavingsMessage(subtotal: number, discountPercentage: number): string | null {
  if (discountPercentage <= 0) return null;
  const savings = subtotal * (discountPercentage / 100);
  if (discountPercentage >= 15) {
    return `Best value — ${discountPercentage}% off saves you £${savings.toFixed(0)}`;
  }
  return `${discountPercentage}% bundle discount applied — save £${savings.toFixed(0)}`;
}

/** Calculate options for price calculations. */
export interface CalculateTotalOptions {
  socialMediaPostCount?: number;
}

/** Calculate the total price for a set of selected service IDs, including percentage-based bundle discounts. */
export function calculateTotal(
  selectedServiceIds: string[],
  options?: CalculateTotalOptions
): {
  subtotal: number;
  discountPercentage: number;
  discountAmount: number;
  total: number;
  servicePrices: Array<{ id: string; name: string; originalPrice: number; discountedPrice: number }>;
} {
  const servicePrices: Array<{ id: string; name: string; originalPrice: number; discountedPrice: number }> = [];
  let subtotal = 0;

  for (const serviceId of selectedServiceIds) {
    const service = getServiceById(serviceId);
    if (!service) continue;

    let price: number;
    if (serviceId === 'social_media_pack' && options?.socialMediaPostCount) {
      price = getServicePrice(serviceId, options.socialMediaPostCount);
    } else if (service.pricingTiers && service.defaultQuantity) {
      price = getServicePrice(serviceId, service.defaultQuantity);
    } else {
      price = service.price;
    }

    subtotal += price;
    servicePrices.push({
      id: serviceId,
      name: service.name,
      originalPrice: price,
      discountedPrice: price, // Will be updated below
    });
  }

  // Calculate discount percentage based on number of services
  const discountPercentage = getBundleDiscountPercentage(selectedServiceIds.length);
  const discountAmount = subtotal * (discountPercentage / 100);
  const total = subtotal - discountAmount;

  // Update discounted prices for display
  if (discountPercentage > 0) {
    servicePrices.forEach(sp => {
      sp.discountedPrice = sp.originalPrice * (1 - discountPercentage / 100);
    });
  }

  return { subtotal, discountPercentage, discountAmount, total, servicePrices };
}

export { stripeMode };

// ── Service-Form Mapping Validation ──
// Ensures intakeSections in the catalog match the serviceTags on form sections.

import { allFormSections } from '../forms/intake-definition';

/**
 * Validate that each service's intakeSections array matches the sections
 * whose serviceTags include that service ID. Logs warnings for mismatches.
 * Returns true if all mappings are consistent.
 */
function validateServiceIntakeMapping(): boolean {
  let valid = true;

  for (const service of serviceCatalog) {
    // Derive expected sections from serviceTags on form sections
    const expectedSections = allFormSections
      .filter((section) => section.serviceTags.includes(service.id))
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((section) => section.id);

    const catalogSections = [...service.intakeSections].sort();

    // Check for missing sections (in form but not in catalog)
    const missing = expectedSections.filter(
      (id) => !service.intakeSections.includes(id),
    );
    // Check for extra sections (in catalog but not in form)
    const extra = service.intakeSections.filter(
      (id) => !expectedSections.includes(id),
    );

    if (missing.length > 0 || extra.length > 0) {
      valid = false;
      if (typeof console !== 'undefined') {
        console.warn(
          `[ServiceIntakeMapping] Mismatch for "${service.id}":`,
          missing.length > 0 ? `missing in catalog: [${missing.join(', ')}]` : '',
          extra.length > 0 ? `extra in catalog: [${extra.join(', ')}]` : '',
        );
      }
    }
  }

  return valid;
}

/**
 * Derive intakeSections from the form section serviceTags for a given service.
 * This is the canonical source — the catalog's intakeSections should match this.
 */
function deriveIntakeSections(serviceId: string): string[] {
  return allFormSections
    .filter((section) => section.serviceTags.includes(serviceId))
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((section) => section.id);
}

// Run validation in development mode
if (process.env.NODE_ENV === 'development') {
  validateServiceIntakeMapping();
}
