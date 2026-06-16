// Document-Type → Service-ID mapping
// Bridges the gap between `generated_documents.document_type` (code identifiers)
// and the service catalog's `includes` arrays (human-readable labels).
// When adding new document types, update this map AND DocumentsTab.tsx DOCUMENT_TYPES.

import { getServiceById, isOperationsService, isIndustryService } from './service-catalog';
import type { ServiceTier } from './service-catalog';

const DOCUMENT_TYPE_TO_SERVICE_ID: Record<string, string> = {
  // Business Foundations Pack (10 documents)
  terms_and_conditions: 'business_foundations_pack',
  service_agreement_contract: 'business_foundations_pack',
  gdpr_privacy_policy: 'business_foundations_pack',
  professional_invoice_template: 'business_foundations_pack',
  late_payment_letters: 'business_foundations_pack',
  welcome_email_sequence: 'business_foundations_pack',
  professional_bio: 'business_foundations_pack',
  elevator_pitch: 'business_foundations_pack',
  linkedin_profile_script: 'business_foundations_pack',
  service_description_sheets: 'business_foundations_pack',

  // Client Onboarding & Scope Control Pack (8 documents)
  client_onboarding_questionnaire: 'client_onboarding_pack',
  scope_of_work_document: 'client_onboarding_pack',
  project_brief_template: 'client_onboarding_pack',
  change_request_form: 'client_onboarding_pack',
  onboarding_checklist: 'client_onboarding_pack',
  client_communication_protocols: 'client_onboarding_pack',
  welcome_packet_guide: 'client_onboarding_pack',
  feedback_closing_questionnaire: 'client_onboarding_pack',

  // Payment Protection Pack (8 documents)
  invoice_terms_conditions: 'payment_protection_pack',
  late_payment_policy: 'payment_protection_pack',
  payment_schedule_template: 'payment_protection_pack',
  refund_policy_document: 'payment_protection_pack',
  deposit_cancellation_terms: 'payment_protection_pack',
  payment_tracking_template: 'payment_protection_pack',
  chasing_payment_scripts: 'payment_protection_pack',
  chargeback_response_templates: 'payment_protection_pack',

  // Copyright & Licensing Pack (8 documents)
  copyright_notice_ip_policy: 'copyright_licensing_pack',
  content_licensing_agreement: 'copyright_licensing_pack',
  image_media_usage_rights: 'copyright_licensing_pack',
  work_for_hire_agreement: 'copyright_licensing_pack',
  brand_usage_guidelines: 'copyright_licensing_pack',
  nda_agreement: 'copyright_licensing_pack',
  ip_assignment_agreement: 'copyright_licensing_pack',
  cease_desist_template: 'copyright_licensing_pack',

  // GDPR & Data Retention Deep Pack (9 documents)
  comprehensive_privacy_policy: 'gdpr_deep_pack',
  data_retention_schedule: 'gdpr_deep_pack',
  data_processing_agreement: 'gdpr_deep_pack',
  cookie_consent_implementation: 'gdpr_deep_pack',
  subject_access_request_template: 'gdpr_deep_pack',
  data_breach_notification_template: 'gdpr_deep_pack',
  dpia_template: 'gdpr_deep_pack',
  marketing_consent_management: 'gdpr_deep_pack',
  third_party_data_sharing_agreement: 'gdpr_deep_pack',

  // Coach Industry Pack (7 documents)
  coaching_agreement: 'coach_industry_pack',
  session_terms_policy: 'coach_industry_pack',
  supervision_policy: 'coach_industry_pack',
  cpd_tracker_template: 'coach_industry_pack',
  coaching_code_of_ethics: 'coach_industry_pack',
  client_progress_tracker: 'coach_industry_pack',
  testimonial_request_template: 'coach_industry_pack',

  // Photographer Industry Pack (7 documents)
  photography_licensing_agreement: 'photographer_industry_pack',
  model_release_form: 'photographer_industry_pack',
  shot_list_template: 'photographer_industry_pack',
  delivery_terms_policy: 'photographer_industry_pack',
  editing_brief_template: 'photographer_industry_pack',
  print_release_form: 'photographer_industry_pack',
  event_photography_terms: 'photographer_industry_pack',

  // Consultant Industry Pack (7 documents)
  consulting_agreement: 'consultant_industry_pack',
  consultant_nda: 'consultant_industry_pack',
  deliverables_specification: 'consultant_industry_pack',
  milestone_tracking_template: 'consultant_industry_pack',
  knowledge_transfer_protocol: 'consultant_industry_pack',
  consultant_code_of_conduct: 'consultant_industry_pack',
  engagement_closure_report: 'consultant_industry_pack',

  // Contractor Industry Pack (8 documents)
  health_safety_policy: 'contractor_industry_pack',
  risk_assessment_template: 'contractor_industry_pack',
  method_statement: 'contractor_industry_pack',
  coshh_assessment: 'contractor_industry_pack',
  construction_phase_plan: 'contractor_industry_pack',
  subcontractor_agreement: 'contractor_industry_pack',
  site_induction_checklist: 'contractor_industry_pack',
  defect_liability_template: 'contractor_industry_pack',
};

/** Look up which service owns a given document type. */
function getServiceIdForDocumentType(documentType: string): string | undefined {
  return DOCUMENT_TYPE_TO_SERVICE_ID[documentType];
}

/** Get all document_type identifiers that belong to a given service. */
export function getDocumentTypesForService(serviceId: string): string[] {
  return Object.entries(DOCUMENT_TYPE_TO_SERVICE_ID)
    .filter(([, sid]) => sid === serviceId)
    .map(([docType]) => docType);
}

/** Whether a service produces generated documents (as opposed to e.g. monthly_care_plan). */
export function isServiceDocumentService(serviceId: string): boolean {
  return getDocumentTypesForService(serviceId).length > 0;
}

/** Whether service is the Website Copy Pack (has dedicated Website tab). */
export function isWebsiteService(serviceId: string): boolean {
  return serviceId === 'website_copy_pack';
}

/** Whether service is the Social Media Pack (has dedicated Posts tab). */
export function isSocialMediaService(serviceId: string): boolean {
  return serviceId === 'social_media_pack';
}

/** Whether service is Business Foundations Pack (has Documents tab). */
export function isBusinessFoundationsService(serviceId: string): boolean {
  return serviceId === 'business_foundations_pack';
}

/** Get the tier of a service from the catalog. */
export function getServiceTier(serviceId: string): ServiceTier | null {
  return getServiceById(serviceId)?.tier ?? null;
}

/** Group an array of documents by their owning service. */
function groupDocumentsByService<T extends { document_type: string }>(
  documents: T[],
): Map<string, T[]> {
  const map = new Map<string, T[]>();
  for (const doc of documents) {
    const serviceId = getServiceIdForDocumentType(doc.document_type) ?? 'other';
    const list = map.get(serviceId) ?? [];
    list.push(doc);
    map.set(serviceId, list);
  }
  return map;
}
