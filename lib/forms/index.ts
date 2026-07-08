// Forms module barrel export

// FormBuilder - assembles forms based on purchased services
export {
  buildIntakeForm,
  isIntakeFullyComplete,
  getSectionsForTier,
  getEstimatedCompletionTime,
} from './build-intake-form';

// Conditional logic - field visibility rules
export {
  isFieldConditionallyVisible,
  getVisibleFields,
  validateSection,
  isSectionComplete,
} from './conditional-logic';

// Intake definition - form sections and fields
export type { FieldType, FormField, FormSection } from './intake-definition';
export { allFormSections } from './intake-definition';

// Validations - Zod schemas per section
export {
  getSectionSchema,
  validateSectionWithZod,
  // Individual schema getters
  getBusinessIdentitySchema,
  getServicesSchema,
  getClientsSchema,
  getPricingSchema,
  getGdprSchema,
  getLegalSchema,
  getBrandSchema,
  getInvoiceSchema,
  getLinkedinSchema,
  getFinalSchema,
  getWebsiteCopySchema,
  getSocialMediaSchema,
  getClientOnboardingSchema,
  getPaymentProtectionSchema,
  getCopyrightLicensingSchema,
  getGdprDeepSchema,
  getCoachIndustrySchema,
  getPhotographerIndustrySchema,
  getConsultantIndustrySchema,
  getContractorIndustrySchema,
  // Primitives
  nonEmptyString,
  optionalString,
  emailSchema,
  optionalEmail,
  urlSchema,
  optionalUrl,
  phoneSchema,
  singleChoice,
  multiSelect,
  fileUpload,
  checkbox,
  serviceItemSchema,
  servicesRepeatingSchema,
} from './validations';
