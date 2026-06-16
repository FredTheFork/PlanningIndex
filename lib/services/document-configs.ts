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

// ─── Client Onboarding & Scope Control Pack (8 documents) ───────────────────

const CLIENT_ONBOARDING: DocumentConfig[] = [
  {
    document_type: 'client_onboarding_questionnaire',
    service_id: 'client_onboarding_pack',
    document_label: 'Client Onboarding Questionnaire',
    description: 'Structured onboarding form capturing client details, goals, and expectations',
  },
  {
    document_type: 'scope_of_work_document',
    service_id: 'client_onboarding_pack',
    document_label: 'Scope of Work Document',
    description: 'Detailed scope definition with boundaries, deliverables, and exclusions',
  },
  {
    document_type: 'project_brief_template',
    service_id: 'client_onboarding_pack',
    document_label: 'Project Brief Template',
    description: 'Standardised project brief capturing objectives, timelines, and success criteria',
  },
  {
    document_type: 'change_request_form',
    service_id: 'client_onboarding_pack',
    document_label: 'Change Request Form',
    description: 'Formal change request process for scope modifications with cost/time impact',
  },
  {
    document_type: 'onboarding_checklist',
    service_id: 'client_onboarding_pack',
    document_label: 'Onboarding Checklist',
    description: 'Step-by-step checklist for onboarding new clients',
  },
  {
    document_type: 'client_communication_protocols',
    service_id: 'client_onboarding_pack',
    document_label: 'Client Communication Protocols',
    description: 'Documented communication standards covering channels, response times, and escalation',
  },
  {
    document_type: 'welcome_packet_guide',
    service_id: 'client_onboarding_pack',
    document_label: 'Welcome Packet Guide',
    description: 'Guide for assembling a professional welcome packet for new clients',
  },
  {
    document_type: 'feedback_closing_questionnaire',
    service_id: 'client_onboarding_pack',
    document_label: 'Feedback & Closing Questionnaire',
    description: 'End-of-engagement feedback form capturing satisfaction and testimonial opportunities',
  },
];

// ─── Payment Protection Pack (8 documents) ─────────────────────────────────────

const PAYMENT_PROTECTION: DocumentConfig[] = [
  {
    document_type: 'invoice_terms_conditions',
    service_id: 'payment_protection_pack',
    document_label: 'Invoice Terms & Conditions',
    description: 'Standalone invoice terms governing payment obligations and late payment consequences',
    supportsRefresh: true,
  },
  {
    document_type: 'late_payment_policy',
    service_id: 'payment_protection_pack',
    document_label: 'Late Payment Policy',
    description: 'Comprehensive late payment policy referencing the Late Payment of Commercial Debts Act 1998',
    supportsRefresh: true,
  },
  {
    document_type: 'payment_schedule_template',
    service_id: 'payment_protection_pack',
    document_label: 'Payment Schedule Template',
    description: 'Template for structuring payment milestones across project engagements',
  },
  {
    document_type: 'refund_policy_document',
    service_id: 'payment_protection_pack',
    document_label: 'Refund & Cancellation Policy',
    description: 'Clear refund and cancellation policy protecting revenue while remaining fair',
    supportsRefresh: true,
  },
  {
    document_type: 'deposit_cancellation_terms',
    service_id: 'payment_protection_pack',
    document_label: 'Deposit & Cancellation Terms',
    description: 'Deposit protection terms covering non-refundable deposits and cancellation windows',
    supportsRefresh: true,
  },
  {
    document_type: 'payment_tracking_template',
    service_id: 'payment_protection_pack',
    document_label: 'Payment Tracking Template',
    description: 'Spreadsheet-style template for tracking invoice status, due dates, and payment receipt',
  },
  {
    document_type: 'chasing_payment_scripts',
    service_id: 'payment_protection_pack',
    document_label: 'Chasing Payment Scripts',
    description: 'Five escalating payment recovery scripts from friendly reminder to formal demand',
  },
  {
    document_type: 'chargeback_response_templates',
    service_id: 'payment_protection_pack',
    document_label: 'Chargeback Response Templates',
    description: 'Professional response templates for disputing card chargebacks with evidence frameworks',
  },
];

// ─── Copyright & Licensing Pack (8 documents) ──────────────────────────────────

const COPYRIGHT_LICENSING: DocumentConfig[] = [
  {
    document_type: 'copyright_notice_ip_policy',
    service_id: 'copyright_licensing_pack',
    document_label: 'Copyright Notice & IP Policy',
    description: 'Copyright notice and intellectual property policy for business deliverables',
    supportsRefresh: true,
  },
  {
    document_type: 'content_licensing_agreement',
    service_id: 'copyright_licensing_pack',
    document_label: 'Content Licensing Agreement',
    description: 'Licensing agreement governing how clients may use delivered content',
    supportsRefresh: true,
  },
  {
    document_type: 'image_media_usage_rights',
    service_id: 'copyright_licensing_pack',
    document_label: 'Image & Media Usage Rights',
    description: 'Usage rights document specifying permitted and prohibited uses of images/media',
  },
  {
    document_type: 'work_for_hire_agreement',
    service_id: 'copyright_licensing_pack',
    document_label: 'Work-for-Hire Agreement',
    description: 'Work-for-hire agreement clarifying IP ownership on commissioned work',
  },
  {
    document_type: 'brand_usage_guidelines',
    service_id: 'copyright_licensing_pack',
    document_label: 'Brand Usage Guidelines',
    description: 'Guidelines governing how the business brand assets may be used by third parties',
  },
  {
    document_type: 'nda_agreement',
    service_id: 'copyright_licensing_pack',
    document_label: 'Non-Disclosure Agreement (NDA)',
    description: 'Mutual or one-way NDA for protecting confidential information',
    supportsRefresh: true,
  },
  {
    document_type: 'ip_assignment_agreement',
    service_id: 'copyright_licensing_pack',
    document_label: 'IP Assignment Agreement',
    description: 'Agreement transferring intellectual property rights from creator to client',
  },
  {
    document_type: 'cease_desist_template',
    service_id: 'copyright_licensing_pack',
    document_label: 'Cease & Desist Template',
    description: 'Cease and desist letter template for IP infringement situations',
  },
];

// ─── GDPR & Data Retention Deep Pack (9 documents) ────────────────────────────

const GDPR_DEEP: DocumentConfig[] = [
  {
    document_type: 'comprehensive_privacy_policy',
    service_id: 'gdpr_deep_pack',
    document_label: 'Comprehensive Privacy Policy',
    description: 'Full ICO-aligned privacy policy covering all GDPR Article 13/14 requirements',
    supportsRefresh: true,
  },
  {
    document_type: 'data_retention_schedule',
    service_id: 'gdpr_deep_pack',
    document_label: 'Data Retention Schedule',
    description: 'Detailed schedule specifying retention periods for each category of personal data',
    supportsRefresh: true,
  },
  {
    document_type: 'data_processing_agreement',
    service_id: 'gdpr_deep_pack',
    document_label: 'Data Processing Agreement (DPA)',
    description: 'DPA compliant with UK GDPR Article 28 for processor relationships',
    supportsRefresh: true,
  },
  {
    document_type: 'cookie_consent_implementation',
    service_id: 'gdpr_deep_pack',
    document_label: 'Cookie Consent Implementation Guide',
    description: 'Practical guide for implementing compliant cookie consent on websites',
  },
  {
    document_type: 'subject_access_request_template',
    service_id: 'gdpr_deep_pack',
    document_label: 'Subject Access Request Template',
    description: 'Response template for handling SARs within the statutory 30-day period',
  },
  {
    document_type: 'data_breach_notification_template',
    service_id: 'gdpr_deep_pack',
    document_label: 'Data Breach Notification Template',
    description: 'Notification template for ICO and affected individuals per UK GDPR breach rules',
    supportsRefresh: true,
  },
  {
    document_type: 'dpia_template',
    service_id: 'gdpr_deep_pack',
    document_label: 'Data Protection Impact Assessment (DPIA)',
    description: 'DPIA template for high-risk processing activities',
  },
  {
    document_type: 'marketing_consent_management',
    service_id: 'gdpr_deep_pack',
    document_label: 'Marketing Consent Management',
    description: 'Procedures for obtaining, recording, and withdrawing marketing consent lawfully',
    supportsRefresh: true,
  },
  {
    document_type: 'third_party_data_sharing_agreement',
    service_id: 'gdpr_deep_pack',
    document_label: 'Third-Party Data Sharing Agreement',
    description: 'Agreement governing data sharing with third parties under UK GDPR',
    supportsRefresh: true,
  },
];

// ─── Combined exports ────────────────────────────────────────────────────────

const ALL_DOCUMENT_CONFIGS: DocumentConfig[] = [
  ...BUSINESS_FOUNDATIONS,
  ...CLIENT_ONBOARDING,
  ...PAYMENT_PROTECTION,
  ...COPYRIGHT_LICENSING,
  ...GDPR_DEEP,
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
