// Document-Type → Service-ID mapping
// Bridges the gap between `generated_documents.document_type` (code identifiers)
// and the service catalog's `includes` arrays (human-readable labels).
// When adding new document types, update this map AND DocumentsTab.tsx DOCUMENT_TYPES.

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

  // Website Copy Pack (4 documents)
  homepage_copy: 'website_copy_pack',
  about_page_copy: 'website_copy_pack',
  services_page_copy: 'website_copy_pack',
  contact_page_copy: 'website_copy_pack',

  // Social Media Pack (1 composite document)
  social_media_posts: 'social_media_pack',
};

/** Look up which service owns a given document type. */
export function getServiceIdForDocumentType(documentType: string): string | undefined {
  return DOCUMENT_TYPE_TO_SERVICE_ID[documentType];
}

/** Get all document_type identifiers that belong to a given service. */
export function getDocumentTypesForService(serviceId: string): string[] {
  return Object.entries(DOCUMENT_TYPE_TO_SERVICE_ID)
    .filter(([, sid]) => sid === serviceId)
    .map(([docType]) => docType);
}

/** Whether a service produces generated documents (as opposed to e.g. quarterly_refresh). */
export function isServiceDocumentService(serviceId: string): boolean {
  return getDocumentTypesForService(serviceId).length > 0;
}

/** Group an array of documents by their owning service. */
export function groupDocumentsByService<T extends { document_type: string }>(
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
