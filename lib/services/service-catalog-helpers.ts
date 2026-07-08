// Service Catalog Helper Functions
// All helper utilities for working with the service catalog.

import type {
  ServiceTier,
  IndustryCategory,
  CarePlanTier,
  ServiceCatalogEntry,
  ServiceGroup,
  CalculateTotalOptions,
} from './service-catalog-types';
import { CARE_PLAN_TIERS, serviceGroups, serviceCatalog, BUNDLE_DISCOUNT_TIERS } from './service-catalog-data';
import { allFormSections } from '../forms/intake-definition';

const stripeMode = (process.env.NEXT_PUBLIC_STRIPE_MODE ?? 'test') as 'test' | 'live';

// ── Care Plan Helpers ──

export function getCarePlanTierById(id: string): CarePlanTier | undefined {
  return CARE_PLAN_TIERS.find(t => t.id === id);
}

export function getCarePlanPriceId(tierId: string, mode: 'test' | 'live'): string | undefined {
  const tier = getCarePlanTierById(tierId);
  return tier?.stripePriceId[mode];
}

// ── Bundle Discount Helpers ──

export function getBundleDiscountPercentage(serviceCount: number): number {
  if (serviceCount >= 3) return 15;
  if (serviceCount >= 2) return 10;
  return 0;
}

export function getBundleDiscountLabel(serviceCount: number): string {
  if (serviceCount >= 3) return BUNDLE_DISCOUNT_TIERS[3].label;
  if (serviceCount >= 2) return BUNDLE_DISCOUNT_TIERS[2].label;
  return '';
}

// ── Service Lookup Helpers ──

export function getServiceById(id: string): ServiceCatalogEntry | undefined {
  return serviceCatalog.find((s) => s.id === id);
}

export function getServicesByTier(tier: ServiceTier): ServiceCatalogEntry[] {
  return serviceCatalog.filter((s) => s.tier === tier);
}

export function getServicesByIndustry(industry: IndustryCategory): ServiceCatalogEntry[] {
  return serviceCatalog.filter((s) => s.industry === industry);
}

// ── Service Group Helpers ──

export function getServiceGroups(): ServiceGroup[] {
  return serviceGroups;
}

export function getServiceGroupById(groupId: string): ServiceGroup | undefined {
  return serviceGroups.find((g) => g.id === groupId);
}

export function getServicesInGroup(groupId: string): ServiceCatalogEntry[] {
  const group = getServiceGroupById(groupId);
  if (!group) return [];
  return group.serviceIds
    .map((id) => getServiceById(id))
    .filter((s): s is ServiceCatalogEntry => s !== undefined);
}

// ── Related Services ──

export function getRelatedServices(serviceId: string): ServiceCatalogEntry[] {
  const service = getServiceById(serviceId);
  if (!service) return [];
  return service.relatedServiceIds
    .map((id) => getServiceById(id))
    .filter((s): s is ServiceCatalogEntry => s !== undefined);
}

// ── Bundle Recommendation ──

export function getRecommendedBundle(
  ownedServiceIds: string[]
): { group: ServiceGroup; newServiceIds: string[] } | null {
  const ownedSet = new Set(ownedServiceIds);
  let best: { group: ServiceGroup; newServiceIds: string[] } | null = null;
  let bestNewCount = 0;

  for (const group of serviceGroups) {
    const newIds = group.serviceIds.filter((id) => !ownedSet.has(id));
    if (newIds.length < 2) continue;
    if (newIds.length > bestNewCount) {
      best = { group, newServiceIds: newIds };
      bestNewCount = newIds.length;
    }
  }

  return best;
}

// ── Tier Helpers ──

export function getHighestTier(serviceIds: string[]): ServiceTier {
  const tiers = serviceIds
    .map((id) => getServiceById(id)?.tier)
    .filter((t): t is ServiceTier => t !== undefined);

  if (tiers.includes('industry')) return 'industry';
  if (tiers.includes('operations')) return 'operations';
  return 'foundation';
}

export function isOperationsService(serviceId: string): boolean {
  return getServiceById(serviceId)?.tier === 'operations';
}

export function isIndustryService(serviceId: string): boolean {
  return getServiceById(serviceId)?.tier === 'industry';
}

export function isSubscriptionService(serviceId: string): boolean {
  return serviceId === 'monthly_care_plan' || serviceId === 'quarterly_refresh';
}

// ── Stripe Helpers ──

export function getStripePriceId(serviceId: string): string | undefined {
  const service = getServiceById(serviceId);
  return service?.stripePriceIds[stripeMode];
}

export function getStripePriceIdForQuantity(serviceId: string, quantity: number): string | undefined {
  const service = getServiceById(serviceId);
  if (!service) return undefined;

  if (service.pricingTiers) {
    const tier = service.pricingTiers.find(t => t.quantity === quantity);
    return tier?.stripePriceId[stripeMode];
  }

  return service.stripePriceIds[stripeMode];
}

export function getServicePrice(serviceId: string, quantity?: number): number {
  const service = getServiceById(serviceId);
  if (!service) return 0;

  if (service.pricingTiers && quantity) {
    const tier = service.pricingTiers.find(t => t.quantity === quantity);
    return tier?.price ?? service.price;
  }

  return service.price;
}

export function getServicePriceLabel(serviceId: string, quantity?: number): string {
  const service = getServiceById(serviceId);
  if (!service) return '';

  if (service.pricingTiers && quantity) {
    const tier = service.pricingTiers.find(t => t.quantity === quantity);
    if (tier) return `£${tier.price} — ${tier.quantity} ${service.quantityUnit || 'items'}`;
  }

  return service.priceLabel;
}

export function getStripeProductId(serviceId: string): string | undefined {
  const service = getServiceById(serviceId);
  return service?.stripeProductIds[stripeMode];
}

// ── Total Calculation ──

export function getBundleSavingsMessage(subtotal: number, discountPercentage: number): string | null {
  if (discountPercentage <= 0) return null;
  const savings = subtotal * (discountPercentage / 100);
  if (discountPercentage >= 15) {
    return `Best value — ${discountPercentage}% off saves you £${savings.toFixed(0)}`;
  }
  return `${discountPercentage}% bundle discount applied — save £${savings.toFixed(0)}`;
}

export function calculateTotal(
  selectedServiceIds: string[],
  options?: CalculateTotalOptions
): {
  subtotal: number;
  discountPercentage: number;
  discountAmount: number;
  total: number;
  groupId: string | null;
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
    } else if (serviceId === 'website_copy_pack' && options?.websitePageCount) {
      price = getServicePrice(serviceId, options.websitePageCount);
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
      discountedPrice: price,
    });
  }

  let discountPercentage = getBundleDiscountPercentage(selectedServiceIds.length);
  let appliedGroupId: string | null = null;

  if (options?.groupId) {
    const group = getServiceGroupById(options.groupId);
    if (group) {
      discountPercentage = Math.max(discountPercentage, group.discountPercent);
      appliedGroupId = group.id;
    }
  }

  if (!appliedGroupId) {
    for (const group of serviceGroups) {
      const selectedSet = new Set(selectedServiceIds);
      const groupSet = new Set(group.serviceIds);
      const isSuperset = [...groupSet].every((id) => selectedSet.has(id));
      if (isSuperset && group.serviceIds.length >= 2) {
        if (group.discountPercent > discountPercentage) {
          discountPercentage = group.discountPercent;
          appliedGroupId = group.id;
        }
      }
    }
  }

  const discountAmount = subtotal * (discountPercentage / 100);
  const total = subtotal - discountAmount;

  if (discountPercentage > 0) {
    servicePrices.forEach(sp => {
      sp.discountedPrice = sp.originalPrice * (1 - discountPercentage / 100);
    });
  }

  return { subtotal, discountPercentage, discountAmount, total, groupId: appliedGroupId, servicePrices };
}

// ── Validation ──

function validateServiceIntakeMapping(): boolean {
  let valid = true;

  for (const service of serviceCatalog) {
    if (!service.requiresIntake) continue;

    const expectedSections = allFormSections
      .filter((section) => section.serviceTags.includes(service.id))
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((section) => section.id);

    const missing = expectedSections.filter(
      (id) => !service.intakeSections.includes(id),
    );
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

function deriveIntakeSections(serviceId: string): string[] {
  return allFormSections
    .filter((section) => section.serviceTags.includes(serviceId))
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((section) => section.id);
}

if (process.env.NODE_ENV === 'development') {
  validateServiceIntakeMapping();
}

// Export stripeMode for external use
export { stripeMode };
