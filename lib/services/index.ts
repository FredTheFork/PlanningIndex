// Services module barrel export

// Service Catalog (types, data, helpers)
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

export {
  CARE_PLAN_TIERS,
  serviceGroups,
  serviceCatalog,
  BUNDLE_DISCOUNT_TIERS,
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
} from './service-catalog';

// Document config
export type { DocumentConfig } from './document-configs';
export {
  getDocumentConfigsForService,
  getDocumentLabel,
  getDocumentTypesListForService,
  getAllDocumentTypesList,
} from './document-configs';

// Service status helpers
export type { ServiceDeliveryStatus, ServiceNextStep } from './service-status';
export {
  getServiceDeliveryStatuses,
  getNextStepForService,
  sortNextSteps,
  getUnifiedNextStep,
} from './service-status';

// Document-service mapping
export {
  getDocumentTypesForService,
  isServiceDocumentService,
  isWebsiteService,
  isSocialMediaService,
  isBusinessFoundationsService,
  getServiceTier,
} from './document-service-map';
