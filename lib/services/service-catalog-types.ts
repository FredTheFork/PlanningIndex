// Service Catalog Type Definitions

export type ServiceMode = 'payment' | 'subscription';
export type ServiceTier = 'foundation' | 'operations' | 'industry';
export type IndustryCategory = 'coach' | 'photographer' | 'consultant' | 'contractor' | 'general';

export interface PricingTier {
  quantity: number;
  price: number;
  label: string;
  stripePriceId: { test: string; live: string };
}

export interface CarePlanTier {
  id: 'essentials' | 'standard' | 'complete';
  name: string;
  price: number;
  priceLabel: string;
  tagline: string;
  includes: string[];
  stripePriceId: { test: string; live: string };
}

export interface ServiceCatalogEntry {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  price: number;
  currency: string;
  currencySymbol: string;
  mode: ServiceMode;
  stripePriceIds: { test: string; live: string };
  stripeProductIds: { test: string; live: string };
  includes: string[];
  requiresIntake: boolean;
  intakeSections: string[];
  isStandalone: boolean;
  sortOrder: number;
  isCore: boolean;
  subscriptionInterval?: 'month' | 'year';
  priceLabel: string;
  pricingTiers?: PricingTier[];
  defaultQuantity?: number;
  quantityUnit?: string;
  tier: ServiceTier;
  industry: IndustryCategory | null;
  serviceGroup: string | null;
  relatedServiceIds: string[];
  badge: string | null;
  hiddenFromCheckout?: boolean;
}

export interface ServiceGroup {
  id: string;
  name: string;
  description: string;
  serviceIds: string[];
  discountPercent: number;
  tier: ServiceTier;
  badge: string | null;
}

export interface CalculateTotalOptions {
  socialMediaPostCount?: number;
  websitePageCount?: number;
  groupId?: string;
}
