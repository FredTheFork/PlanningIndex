// Validation schema registry - exports all schemas and provides section-based validation.

import { z } from 'zod';
import {
  getBusinessIdentitySchema, getServicesSchema, getClientsSchema,
  getPricingSchema, getGdprSchema, getLegalSchema, getBrandSchema,
  getInvoiceSchema, getLinkedinSchema, getFinalSchema,
} from './foundation';
import {
  getWebsiteCopySchema, getSocialMediaSchema,
} from './marketing';
import {
  getClientOnboardingSchema, getPaymentProtectionSchema,
  getCopyrightLicensingSchema, getGdprDeepSchema,
} from './operations';
import {
  getCoachIndustrySchema, getPhotographerIndustrySchema,
  getConsultantIndustrySchema, getContractorIndustrySchema,
} from './industry';

// ── Schema registry by section ID ──

const sectionSchemas: Record<string, () => z.ZodObject<any>> = {
  business_identity: getBusinessIdentitySchema,
  services: getServicesSchema,
  clients: getClientsSchema,
  pricing: getPricingSchema,
  gdpr: getGdprSchema,
  legal: getLegalSchema,
  brand: getBrandSchema,
  invoice: getInvoiceSchema,
  linkedin: getLinkedinSchema,
  final: getFinalSchema,
  website_copy: getWebsiteCopySchema,
  social_media: getSocialMediaSchema,
  client_onboarding: getClientOnboardingSchema,
  payment_protection: getPaymentProtectionSchema,
  copyright_licensing: getCopyrightLicensingSchema,
  gdpr_deep: getGdprDeepSchema,
  industry_coach: getCoachIndustrySchema,
  industry_photographer: getPhotographerIndustrySchema,
  industry_consultant: getConsultantIndustrySchema,
  industry_contractor: getContractorIndustrySchema,
};

/**
 * Get the Zod schema for a section by its ID.
 * Returns null for the 'intro' section (no fields to validate).
 */
export function getSectionSchema(sectionId: string): z.ZodObject<any> | null {
  if (sectionId === 'intro') return null;
  const factory = sectionSchemas[sectionId];
  return factory ? factory() : null;
}

/**
 * Validate a single section's responses using its Zod schema.
 * Only validates fields that are visible (passes through conditional logic).
 * Returns a map of fieldId → errorMessage for invalid fields, or empty object if valid.
 */
export function validateSectionWithZod(
  sectionId: string,
  responses: Record<string, any>,
): Record<string, string> {
  const schema = getSectionSchema(sectionId);
  if (!schema) return {};

  const result = schema.safeParse(responses);
  if (result.success) return {};

  const errors: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const fieldPath = issue.path.join('.');
    if (fieldPath && !errors[fieldPath]) {
      errors[fieldPath] = issue.message;
    }
  }
  return errors;
}

// Re-export individual schema getters for direct use if needed
export {
  getBusinessIdentitySchema, getServicesSchema, getClientsSchema,
  getPricingSchema, getGdprSchema, getLegalSchema, getBrandSchema,
  getInvoiceSchema, getLinkedinSchema, getFinalSchema,
  getWebsiteCopySchema, getSocialMediaSchema,
  getClientOnboardingSchema, getPaymentProtectionSchema,
  getCopyrightLicensingSchema, getGdprDeepSchema,
  getCoachIndustrySchema, getPhotographerIndustrySchema,
  getConsultantIndustrySchema, getContractorIndustrySchema,
};

// Re-export primitives for custom schema building
export {
  nonEmptyString, optionalString, emailSchema, optionalEmail,
  urlSchema, optionalUrl, phoneSchema, singleChoice, multiSelect,
  fileUpload, checkbox, serviceItemSchema, servicesRepeatingSchema,
} from './primitives';
