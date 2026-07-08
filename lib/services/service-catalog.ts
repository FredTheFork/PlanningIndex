// Service Catalog - Barrel Export
// All service catalog types, data, and helpers re-exported from sub-modules.

// Types
export type {
  ServiceMode,
  ServiceTier,
  IndustryCategory,
  PricingTier,
  CarePlanTier,
  ServiceCatalogEntry,
  ServiceGroup,
  CalculateTotalOptions,
} from './service-catalog-types';

// Data
export { CARE_PLAN_TIERS, serviceGroups, serviceCatalog, BUNDLE_DISCOUNT_TIERS } from './service-catalog-data';

// Helpers
export {
  getCarePlanTierById,
  getCarePlanPriceId,
  getBundleDiscountPercentage,
  getBundleDiscountLabel,
  getServiceById,
  getServicesByTier,
  getServicesByIndustry,
  getServiceGroups,
  getServiceGroupById,
  getServicesInGroup,
  getRelatedServices,
  getRecommendedBundle,
  getHighestTier,
  isOperationsService,
  isIndustryService,
  isSubscriptionService,
  getStripePriceId,
  getStripePriceIdForQuantity,
  getServicePrice,
  getServicePriceLabel,
  getStripeProductId,
  getBundleSavingsMessage,
  calculateTotal,
  stripeMode,
} from './service-catalog-helpers';
