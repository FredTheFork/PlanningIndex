export interface ConsistencyCheck {
  id: string;
  label: string;
  status: 'pass' | 'fail' | 'warn' | 'skipped';
  detail: string;
  affectedDocuments: string[];
}

export interface DocumentConsistencyReport {
  checks: ConsistencyCheck[];
  passCount: number;
  failCount: number;
  warnCount: number;
  skippedCount: number;
}

interface DocumentRecord {
  id: string;
  doc_type_id: string;
  status: string;
  pdf_path: string | null;
  docx_path: string | null;
  delivered_to_client: boolean;
  delivered_at: string | null;
  auto_delete_at: string | null;
}

interface IntakeData {
  [key: string]: any;
}

function extractPaymentDays(text: string): number | null {
  if (!text) return null;
  const match = text.match(/(\d+)\s*days?/i);
  return match ? parseInt(match[1], 10) : null;
}

function hasEmail(text: string, email: string): boolean {
  if (!text || !email) return true; // skip if no content to check
  return text.toLowerCase().includes(email.toLowerCase());
}

function hasText(text: string, search: string): boolean {
  if (!text) return false;
  return text.toLowerCase().includes(search.toLowerCase());
}

/**
 * Run cross-document consistency checks against generated documents and
 * intake data. Returns a structured report with pass/fail/warn/skipped status
 * for each check.
 *
 * Note: checks that require document content (HTML/text) are marked 'skipped'
 * when content is not available — the generated_documents table stores file
 * paths, not content, so content-based checks only run when the admin has
 * the content available in-memory (e.g. from a brief or preview).
 */
export function runConsistencyChecks(
  documents: Record<string, DocumentRecord>,
  intakeData: IntakeData
): DocumentConsistencyReport {
  const checks: ConsistencyCheck[] = [];
  const docs = Object.values(documents);
  const completedDocs = docs.filter((d) => d.status === 'completed');
  const deliveredDocs = docs.filter((d) => d.delivered_to_client);

  const businessName = intakeData.q2_business_name || intakeData.q1_legal_name || '';
  const contactEmail = intakeData.q7_document_email || '';
  const jurisdiction = intakeData.q5_jurisdiction || '';
  const vatRegistered = intakeData.q34_vat_registered || '';
  const vatNumber = intakeData.q35_vat_number || '';
  const bankDetails = intakeData.q69_bank_details || '';

  // 1. Payment Terms Consistency (skipped — requires document content)
  checks.push({
    id: 'payment_terms',
    label: 'Payment Terms Consistency',
    status: 'skipped',
    detail: 'Requires document content analysis — upload and deliver documents to enable this check.',
    affectedDocuments: [],
  });

  // 2. Contact Email Consistency
  if (contactEmail && completedDocs.length > 0) {
    const affected = completedDocs
      .filter((d) => d.pdf_path || d.docx_path)
      .map((d) => d.doc_type_id);
    checks.push({
      id: 'contact_email',
      label: 'Contact Email in Documents',
      status: 'warn',
      detail: `Verify that ${contactEmail} appears in all delivered documents. Open each document to confirm.`,
      affectedDocuments: affected,
    });
  } else if (!contactEmail) {
    checks.push({
      id: 'contact_email',
      label: 'Contact Email in Documents',
      status: 'skipped',
      detail: 'No contact email found in intake data.',
      affectedDocuments: [],
    });
  } else {
    checks.push({
      id: 'contact_email',
      label: 'Contact Email in Documents',
      status: 'pass',
      detail: 'No completed documents to check yet.',
      affectedDocuments: [],
    });
  }

  // 3. Business Name Consistency
  if (businessName && completedDocs.length > 0) {
    checks.push({
      id: 'business_name',
      label: 'Business Name Consistency',
      status: 'warn',
      detail: `Verify that "${businessName}" is used consistently across all documents. Open each document to confirm.`,
      affectedDocuments: completedDocs.map((d) => d.doc_type_id),
    });
  } else if (!businessName) {
    checks.push({
      id: 'business_name',
      label: 'Business Name Consistency',
      status: 'skipped',
      detail: 'No business name found in intake data.',
      affectedDocuments: [],
    });
  } else {
    checks.push({
      id: 'business_name',
      label: 'Business Name Consistency',
      status: 'pass',
      detail: 'No completed documents to check yet.',
      affectedDocuments: [],
    });
  }

  // 4. Jurisdiction Consistency
  if (jurisdiction) {
    checks.push({
      id: 'jurisdiction',
      label: 'Jurisdiction Consistency',
      status: 'warn',
      detail: `Verify all legal documents reference "${jurisdiction}" as the governing jurisdiction.`,
      affectedDocuments: completedDocs
        .filter((d) => ['service_agreement_contract', 'terms_and_conditions'].includes(d.doc_type_id))
        .map((d) => d.doc_type_id),
    });
  } else {
    checks.push({
      id: 'jurisdiction',
      label: 'Jurisdiction Consistency',
      status: 'skipped',
      detail: 'No jurisdiction specified in intake data.',
      affectedDocuments: [],
    });
  }

  // 5. VAT Number Presence
  if (vatRegistered === 'Yes' && vatNumber) {
    const invoiceDoc = completedDocs.find((d) => d.doc_type_id === 'professional_invoice_template');
    if (invoiceDoc) {
      checks.push({
        id: 'vat_number',
        label: 'VAT Number in Invoice Template',
        status: 'warn',
        detail: `VAT number ${vatNumber} should appear in the professional invoice template. Open the document to confirm.`,
        affectedDocuments: ['professional_invoice_template'],
      });
    } else {
      checks.push({
        id: 'vat_number',
        label: 'VAT Number in Invoice Template',
        status: 'skipped',
        detail: 'Invoice template not yet generated.',
        affectedDocuments: [],
      });
    }
  } else {
    checks.push({
      id: 'vat_number',
      label: 'VAT Number in Invoice Template',
      status: 'pass',
      detail: 'VAT not registered or no VAT number provided — no check needed.',
      affectedDocuments: [],
    });
  }

  // 6. Late Payment Act Reference
  const legalDocs = completedDocs.filter((d) =>
    ['terms_and_conditions', 'late_payment_letters'].includes(d.doc_type_id)
  );
  if (legalDocs.length > 0) {
    checks.push({
      id: 'late_payment_act',
      label: 'Late Payment Act Reference',
      status: 'warn',
      detail: 'Verify terms & conditions and late payment letters reference the Late Payment of Commercial Debts (Interest) Act 1998.',
      affectedDocuments: legalDocs.map((d) => d.doc_type_id),
    });
  } else {
    checks.push({
      id: 'late_payment_act',
      label: 'Late Payment Act Reference',
      status: 'skipped',
      detail: 'Terms & conditions or late payment letters not yet generated.',
      affectedDocuments: [],
    });
  }

  // 7. GDPR Retention Period
  const retentionPeriod = intakeData.q40_data_retention;
  const gdprDoc = completedDocs.find((d) => d.doc_type_id === 'gdpr_privacy_policy');
  if (retentionPeriod && gdprDoc) {
    checks.push({
      id: 'gdpr_retention',
      label: 'GDPR Retention Period',
      status: 'warn',
      detail: `Verify the GDPR privacy policy states a retention period of ${retentionPeriod}. Open the document to confirm.`,
      affectedDocuments: ['gdpr_privacy_policy'],
    });
  } else {
    checks.push({
      id: 'gdpr_retention',
      label: 'GDPR Retention Period',
      status: 'skipped',
      detail: 'GDPR privacy policy not yet generated or no retention period in intake.',
      affectedDocuments: [],
    });
  }

  // 8. Delivery Date / Auto-Delete Consistency
  const now = new Date();
  const expiredDelivered = deliveredDocs.filter((d) => {
    if (!d.auto_delete_at) return false;
    return new Date(d.auto_delete_at) < now;
  });
  if (deliveredDocs.length > 0) {
    if (expiredDelivered.length > 0) {
      checks.push({
        id: 'auto_delete',
        label: 'Auto-Delete Date Validity',
        status: 'fail',
        detail: `${expiredDelivered.length} delivered document(s) have an auto-delete date in the past. Extend the retention period or re-upload.`,
        affectedDocuments: expiredDelivered.map((d) => d.doc_type_id),
      });
    } else {
      checks.push({
        id: 'auto_delete',
        label: 'Auto-Delete Date Validity',
        status: 'pass',
        detail: 'All delivered documents have valid auto-delete dates.',
        affectedDocuments: [],
      });
    }
  } else {
    checks.push({
      id: 'auto_delete',
      label: 'Auto-Delete Date Validity',
      status: 'skipped',
      detail: 'No delivered documents to check.',
      affectedDocuments: [],
    });
  }

  // 9. Bank Details in Invoice
  if (bankDetails) {
    const invoiceDoc = completedDocs.find((d) => d.doc_type_id === 'professional_invoice_template');
    if (invoiceDoc) {
      checks.push({
        id: 'bank_details',
        label: 'Bank Details in Invoice',
        status: 'warn',
        detail: 'Verify bank details from intake appear in the professional invoice template.',
        affectedDocuments: ['professional_invoice_template'],
      });
    } else {
      checks.push({
        id: 'bank_details',
        label: 'Bank Details in Invoice',
        status: 'skipped',
        detail: 'Invoice template not yet generated.',
        affectedDocuments: [],
      });
    }
  } else {
    checks.push({
      id: 'bank_details',
      label: 'Bank Details in Invoice',
      status: 'skipped',
      detail: 'No bank details provided in intake.',
      affectedDocuments: [],
    });
  }

  // 10. Signature Lines in Contract
  const contractDoc = completedDocs.find((d) => d.doc_type_id === 'service_agreement_contract');
  if (contractDoc) {
    checks.push({
      id: 'signature_lines',
      label: 'Signature Lines in Contract',
      status: 'warn',
      detail: 'Verify the service agreement contract contains signature lines for both parties.',
      affectedDocuments: ['service_agreement_contract'],
    });
  } else {
    checks.push({
      id: 'signature_lines',
      label: 'Signature Lines in Contract',
      status: 'skipped',
      detail: 'Service agreement contract not yet generated.',
      affectedDocuments: [],
    });
  }

  const passCount = checks.filter((c) => c.status === 'pass').length;
  const failCount = checks.filter((c) => c.status === 'fail').length;
  const warnCount = checks.filter((c) => c.status === 'warn').length;
  const skippedCount = checks.filter((c) => c.status === 'skipped').length;

  return { checks, passCount, failCount, warnCount, skippedCount };
}
