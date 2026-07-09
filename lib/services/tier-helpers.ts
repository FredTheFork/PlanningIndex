// Tier detection and capability helpers for Care Plan tiers
// Used by SubscriptionTab and refresh wizard to determine available features

import { CarePlanTier } from './service-catalog-types';
import { CARE_PLAN_TIERS } from './service-catalog-data';
import { DocumentConfig, getDocumentConfigsForService } from './document-configs';

/**
 * Tier capability flags determining what refresh features are available.
 */
export interface TierCapabilities {
  hasMonthlyUpdates: boolean;
  hasPrioritySupport: boolean;
  hasNewDocuments: boolean;
  hasSocialMediaRefresh: boolean;
  hasWebsiteRefresh: boolean;
}

/**
 * Detects the care plan tier from a Stripe price ID.
 * Returns null if the price ID doesn't match any tier.
 */
export function detectCarePlanTier(stripePriceId: string): CarePlanTier | null {
  if (!stripePriceId) return null;

  for (const tier of CARE_PLAN_TIERS) {
    if (
      tier.stripePriceId.test === stripePriceId ||
      tier.stripePriceId.live === stripePriceId
    ) {
      return tier;
    }
  }

  return null;
}

/**
 * Detects tier from a subscription by looking up the price ID from Stripe.
 * This is a placeholder - in production, would query Stripe API.
 */
export function detectCarePlanTierFromSubscription(
  stripeSubscriptionId: string,
  priceId: string
): CarePlanTier | null {
  // Use the price ID directly for detection
  return detectCarePlanTier(priceId);
}

/**
 * Gets capability flags for a given tier.
 * All tiers have monthly updates, but higher tiers unlock additional features.
 */
export function getTierCapabilities(tier: CarePlanTier | null): TierCapabilities {
  const defaultCapabilities: TierCapabilities = {
    hasMonthlyUpdates: false,
    hasPrioritySupport: false,
    hasNewDocuments: false,
    hasSocialMediaRefresh: false,
    hasWebsiteRefresh: false,
  };

  if (!tier) return defaultCapabilities;

  const capabilities = { ...defaultCapabilities };

  // All tiers have monthly document updates
  capabilities.hasMonthlyUpdates = true;

  if (tier.id === 'standard' || tier.id === 'complete') {
    capabilities.hasPrioritySupport = true;
    capabilities.hasNewDocuments = true;
  }

  if (tier.id === 'complete') {
    capabilities.hasSocialMediaRefresh = true;
    capabilities.hasWebsiteRefresh = true;
  }

  return capabilities;
}

/**
 * Document types that belong to social media category.
 * Only available for refresh on 'complete' tier.
 */
const SOCIAL_MEDIA_DOCUMENT_TYPES = [
  'social_media_content_calendar',
  'social_media_post_templates',
];

/**
 * Document types that belong to website copy category.
 * Only available for refresh on 'complete' tier.
 */
const WEBSITE_DOCUMENT_TYPES = [
  'website_terms',
  'website_privacy_policy',
];

/**
 * Gets the list of refreshable documents for a given tier.
 * Filters documents by supportsRefresh flag and tier capabilities.
 */
export function getRefreshableDocumentsForTier(
  tier: CarePlanTier | null,
  serviceId: string
): DocumentConfig[] {
  const capabilities = getTierCapabilities(tier);

  // Get all document configs for the service
  const allDocuments = getDocumentConfigsForService(serviceId);

  // Filter to only those that support refresh
  const refreshableDocs = allDocuments.filter(doc => doc.supportsRefresh === true);

  // Further filter based on tier capabilities
  return refreshableDocs.filter(doc => {
    const docType = doc.document_type;

    // Essentials tier: only standard documents (no social, no website)
    if (!capabilities.hasSocialMediaRefresh && SOCIAL_MEDIA_DOCUMENT_TYPES.includes(docType)) {
      return false;
    }

    if (!capabilities.hasWebsiteRefresh && WEBSITE_DOCUMENT_TYPES.includes(docType)) {
      return false;
    }

    return true;
  });
}

/**
 * Inclusion feature list for UI display.
 * Maps tier ID to the list of features with tick/cross indicators.
 */
export const CARE_PLAN_INCLUSIONS: Record<string, { feature: string; included: boolean }[]> = {
  essentials: [
    { feature: 'Monthly document updates', included: true },
    { feature: 'Pricing and service changes', included: true },
    { feature: 'GDPR regulation updates', included: true },
    { feature: 'Priority support', included: false },
    { feature: 'New document additions', included: false },
    { feature: 'Social media content refresh', included: false },
    { feature: 'Website copy updates', included: false },
  ],
  standard: [
    { feature: 'Monthly document updates', included: true },
    { feature: 'Pricing and service changes', included: true },
    { feature: 'GDPR regulation updates', included: true },
    { feature: 'Priority support', included: true },
    { feature: 'New document additions', included: true },
    { feature: 'Social media content refresh', included: false },
    { feature: 'Website copy updates', included: false },
  ],
  complete: [
    { feature: 'Monthly document updates', included: true },
    { feature: 'Pricing and service changes', included: true },
    { feature: 'GDPR regulation updates', included: true },
    { feature: 'Priority support', included: true },
    { feature: 'New document additions', included: true },
    { feature: 'Social media content refresh', included: true },
    { feature: 'Website copy updates', included: true },
  ],
};

/**
 * Gets the upgrade tier recommendation for a given tier.
 * Returns null for 'complete' tier (no upgrade available).
 */
export function getUpgradeTier(currentTier: CarePlanTier | null): CarePlanTier | null {
  if (!currentTier) return CARE_PLAN_TIERS[0]; // Recommend essentials if no tier

  if (currentTier.id === 'essentials') {
    return CARE_PLAN_TIERS.find(t => t.id === 'standard') || null;
  }

  if (currentTier.id === 'standard') {
    return CARE_PLAN_TIERS.find(t => t.id === 'complete') || null;
  }

  return null; // Complete has no upgrade
}
