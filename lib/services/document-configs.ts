// Document configuration — metadata for every document type.
// Used for document tracking, labels, and display.

export interface DocumentConfig {
  document_type: string;
  service_id: string;
  document_label: string;
  description: string;
  /** Expected output structure / sections for this document type. */
  output_format?: string;
  /** Whether this document type supports incremental refresh (quarterly_refresh). */
  supportsRefresh?: boolean;
}

// ─── Business Foundations Pack (10 documents) ─────────────────────────────────

const BUSINESS_FOUNDATIONS: DocumentConfig[] = [
  {
    document_type: 'terms_and_conditions',
    service_id: 'business_foundations_pack',
    document_label: 'Terms and Conditions',
    description: 'General business terms',
  },
  {
    document_type: 'service_agreement_contract',
    service_id: 'business_foundations_pack',
    document_label: 'Service Agreement Contract',
    description: 'Client engagement contract',
  },
  {
    document_type: 'gdpr_privacy_policy',
    service_id: 'business_foundations_pack',
    document_label: 'GDPR Privacy Policy',
    description: 'Data protection policy',
  },
  {
    document_type: 'professional_invoice_template',
    service_id: 'business_foundations_pack',
    document_label: 'Professional Invoice Template',
    description: 'Invoice template with branding',
  },
  {
    document_type: 'late_payment_letters',
    service_id: 'business_foundations_pack',
    document_label: 'Late Payment Letters',
    description: 'Payment chase sequence',
  },
  {
    document_type: 'welcome_email_sequence',
    service_id: 'business_foundations_pack',
    document_label: 'Welcome Email Sequence',
    description: 'Client onboarding emails',
  },
  {
    document_type: 'professional_bio',
    service_id: 'business_foundations_pack',
    document_label: 'Professional Bio',
    description: 'Business biography',
  },
  {
    document_type: 'elevator_pitch',
    service_id: 'business_foundations_pack',
    document_label: 'Elevator Pitch',
    description: '30-second pitch script',
  },
  {
    document_type: 'linkedin_profile_script',
    service_id: 'business_foundations_pack',
    document_label: 'LinkedIn Profile Script',
    description: 'Profile optimization',
  },
  {
    document_type: 'service_description_sheets',
    service_id: 'business_foundations_pack',
    document_label: 'Service Description Sheets',
    description: 'Service breakdown documents',
  },
];

// ─── Combined exports ────────────────────────────────────────────────────────

const ALL_DOCUMENT_CONFIGS: DocumentConfig[] = [
  ...BUSINESS_FOUNDATIONS,
];

const CONFIG_MAP = new Map(ALL_DOCUMENT_CONFIGS.map(c => [c.document_type, c]));

/** Get all configs for a given service. */
export function getDocumentConfigsForService(serviceId: string): DocumentConfig[] {
  return ALL_DOCUMENT_CONFIGS.filter(c => c.service_id === serviceId);
}

/** Get the document label for a document type. */
export function getDocumentLabel(documentType: string): string | undefined {
  return CONFIG_MAP.get(documentType)?.document_label;
}

/** Get document type definitions for a given service (for DOCUMENT_TYPES-style lists). */
export function getDocumentTypesListForService(serviceId: string): Array<{ id: string; label: string; description: string }> {
  return getDocumentConfigsForService(serviceId).map(c => ({
    id: c.document_type,
    label: c.document_label,
    description: c.description,
  }));
}

/** Get all document type definitions across all services. */
export function getAllDocumentTypesList(): Array<{ id: string; label: string; description: string; service_id: string }> {
  return ALL_DOCUMENT_CONFIGS.map(c => ({
    id: c.document_type,
    label: c.document_label,
    description: c.description,
    service_id: c.service_id,
  }));
}
