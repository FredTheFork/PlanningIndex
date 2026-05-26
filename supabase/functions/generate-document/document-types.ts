// ─────────────────────────────────────────────────────────────────────────────
// DOCUMENT TYPES — Render-agnostic semantic document model
// ─────────────────────────────────────────────────────────────────────────────

// ── Density & Emphasis ──

export type BlockDensity = 'compact' | 'normal' | 'airy';
export type EmphasisLevel = 'high' | 'normal' | 'subdued';
export type HeadingVariant = 'section' | 'subsection' | 'minor';
export type TableStyleHint = 'data' | 'comparative' | 'definition' | 'financial';

// ── Block Base ──

export interface BlockBase {
  id: string;
  density?: BlockDensity;
  emphasis?: EmphasisLevel;
}

// ── Block Types ──

export interface HeadingBlock extends BlockBase {
  type: 'heading';
  variant: HeadingVariant;
  text: string;
}

export interface ParagraphBlock extends BlockBase {
  type: 'paragraph';
  text: string;
}

export interface ClauseBlock extends BlockBase {
  type: 'clause';
  /** The clause number only, e.g. "1.1" — NOT repeated in the text field */
  number: string;
  /** The clause text WITHOUT any number prefix */
  text: string;
}

export interface BulletBlock extends BlockBase {
  type: 'bullet';
  text: string;
  /** 0 = top level, 1 = nested */
  level?: number;
}

export interface TableBlock extends BlockBase {
  type: 'table';
  styleHint: TableStyleHint;
  caption?: string;
  headers: string[];
  rows: string[][];
}

export interface CalloutBlock extends BlockBase {
  type: 'callout';
  label?: string;
  text: string;
}

export interface SignatureBlock extends BlockBase {
  type: 'signature';
  parties: Array<{
    label: string;
    nameField: string;
    dateField: string;
    companyField?: string;
  }>;
}

export interface DividerBlock extends BlockBase {
  type: 'divider';
  weight: 'light' | 'heavy';
}

export type DocumentBlock =
  | HeadingBlock
  | ParagraphBlock
  | ClauseBlock
  | BulletBlock
  | TableBlock
  | CalloutBlock
  | SignatureBlock
  | DividerBlock;

// ── Section ──

export interface DocumentSection {
  id: string;
  heading?: string;
  headingVariant?: HeadingVariant;
  density?: BlockDensity;
  blocks: DocumentBlock[];
}

// ── Document Metadata ──

export interface DocumentMetadata {
  title: string;
  subtitle?: string;
  documentType: string;
  businessName: string;
  legalName?: string;
  address?: string;
  email?: string;
  phone?: string;
  website?: string;
  jurisdiction?: string;
  version?: string;
  date: string;
}

// ── Document Model ──

export interface DocumentModel {
  metadata: DocumentMetadata;
  sections: DocumentSection[];
}

// ── Invoice Document ──

export interface InvoiceDocument {
  documentType: 'invoice_template';
  metadata: DocumentMetadata & {
    vatRegistered: boolean;
    vatNumber: string;
    showVat: boolean;
    vatRate: number;
    paymentDueDays: number;
    currency: string;
    hasLogo: boolean;
    logoFileName: string;
    logoStoragePath: string;
  };
  businessInfo: {
    legalName: string;
    tradingName: string;
    address: string;
    phone: string;
    email: string;
    website: string;
    vatNumber: string;
  };
  invoiceFields: {
    invoiceNumberFormat: string;
    dateFormat: string;
    taxPointDateFormat: string;
    dueDateFormat: string;
    poNumberFormat: string;
    showPoNumber: boolean;
  };
  billToPlaceholders: {
    clientName: string;
    company: string;
    addressLine1: string;
    addressLine2: string;
    email: string;
    phone: string;
  };
  lineItems: Array<{
    description: string;
    quantity: string;
    unitPrice: string;
    amount: string;
  }>;
  totals: {
    subtotal: string;
    vatPercentage: number;
    vatAmount: string;
    totalDue: string;
    showVatLine: boolean;
  };
  paymentTerms: {
    paymentDeadline: string;
    paymentMethods: string[];
    bankTransferDetails: {
      show: boolean;
      accountName: string;
      sortCode: string;
      accountNumber: string;
    };
    stripeDetails: {
      show: boolean;
      paymentLink: string;
    };
    paypalDetails: {
      show: boolean;
      paypalEmail: string;
    };
    paymentReference: string;
  };
  latePaymentClause: string;
  optionalFields: {
    showNotesSection: boolean;
    notesPlaceholder: string;
    showTermsSummary: boolean;
    termsSummary: string;
    showSignatureField: boolean;
  };
  disclaimer: string;
}

// ── Late Payment Letters Document ──

export interface LatePaymentLetter {
  id: string;
  letterType: string;
  timingNote: string;
  subject: string;
  heading?: string;
  letterhead: string;
  date: string;
  addresseeBlock: string;
  salutation: string;
  body?: string;
  paragraphs?: Record<string, string>;
  closeStatement?: string;
  close: string;
}

export interface LatePaymentDocument {
  documentType: 'late_payment_letters';
  metadata: DocumentMetadata & {
    businessLegalName: string;
    businessTradingName: string;
    businessAddress: string;
    businessEmail: string;
    businessPhone: string;
    acceptedPaymentMethods: string[];
    paymentDueDays: number;
  };
  letters: LatePaymentLetter[];
  usageNotes: {
    calculatingInterest: string;
    recoveryChargeNote: string;
    recordKeeping: string;
    legalAdvice: string;
  };
}

// ── Welcome Email Document ──

export interface WelcomeEmailItem {
  id: string;
  emailType: string;
  sendTiming: string;
  subject: string;
  greeting: string;
  body: string;
  signOff: string;
}

export interface WelcomeEmailDocument {
  documentType: 'welcome_email';
  metadata: DocumentMetadata & {
    businessEmail: string;
    businessPhone: string;
    businessWebsite: string;
    pricingModel: string;
    serviceEngaged: string;
    toneOfVoice: string;
    brandIdentity: string;
  };
  emails: WelcomeEmailItem[];
}

// ── Union ──

export type AnyDocument = DocumentModel | InvoiceDocument | LatePaymentDocument | WelcomeEmailDocument;

// ── Detection ──

export function detectDocumentKind(doc: unknown): 'model' | 'invoice' | 'late_payment' | 'welcome_email' {
  if (!doc || typeof doc !== 'object') return 'model';
  const d = doc as Record<string, unknown>;

  // 1. Check documentType or structural indicators for invoice
  const dt = d.documentType;
  if (dt === 'invoice_template' || (Array.isArray(d.lineItems) && d.businessInfo)) {
    return 'invoice';
  }

  // 2. Check for late payment letters
  if (dt === 'late_payment_letters' || Array.isArray(d.letters)) {
    return 'late_payment';
  }

  // 3. Check for welcome email
  if (dt === 'welcome_email' || Array.isArray(d.emails)) {
    return 'welcome_email';
  }

  // 4. Check for model (has sections array)
  if (Array.isArray(d.sections)) {
    return 'model';
  }

  // 5. Default to model
  return 'model';
}

// ── Validation ──

const VALID_BLOCK_TYPES = new Set([
  'heading', 'paragraph', 'clause', 'bullet', 'table', 'callout', 'signature', 'divider',
]);

export function validateDocumentModel(doc: unknown): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!doc || typeof doc !== 'object') {
    return { valid: false, errors: ['Document is not an object'] };
  }

  const d = doc as Record<string, unknown>;

  // Check metadata exists
  const md = d.metadata;
  if (!md || typeof md !== 'object') {
    errors.push('Missing or invalid metadata');
  } else {
    const m = md as Record<string, unknown>;
    if (typeof m.title !== 'string') {
      errors.push('metadata.title is required and must be a string');
    }
    if (typeof m.date !== 'string') {
      errors.push('metadata.date is required and must be a string');
    }
  }

  // Check sections is an array
  const sections = d.sections;
  if (!Array.isArray(sections)) {
    errors.push('sections must be an array');
    // Return false if sections is not an array (top-level structure broken)
    return { valid: false, errors };
  }

  // Validate each section
  for (let si = 0; si < sections.length; si++) {
    const sec = sections[si];
    if (!sec || typeof sec !== 'object') {
      errors.push(`sections[${si}] is not an object`);
      continue;
    }
    const s = sec as Record<string, unknown>;

    if (typeof s.id !== 'string') {
      errors.push(`sections[${si}].id is missing or not a string`);
    }

    if (!Array.isArray(s.blocks)) {
      errors.push(`sections[${si}].blocks is missing or not an array`);
      continue;
    }

    // Validate each block in the section
    for (let bi = 0; bi < s.blocks.length; bi++) {
      const blk = s.blocks[bi];
      if (!blk || typeof blk !== 'object') {
        errors.push(`sections[${si}].blocks[${bi}] is not an object`);
        continue;
      }
      const b = blk as Record<string, unknown>;

      if (typeof b.id !== 'string') {
        errors.push(`sections[${si}].blocks[${bi}].id is missing or not a string`);
      }

      if (typeof b.type !== 'string' || !VALID_BLOCK_TYPES.has(b.type)) {
        errors.push(`sections[${si}].blocks[${bi}].type is missing or invalid: "${b.type}"`);
      }
    }
  }

  // Return valid: true with any errors (errors don't invalidate the document)
  // Only invalid if top-level structure is broken (metadata missing/invalid or sections not an array)
  // Above we already return false if sections is not an array
  // Only return false if metadata is completely missing
  const hasValidMetadata = md && typeof md === 'object';
  return { valid: !!hasValidMetadata, errors };
}
