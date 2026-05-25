// ─────────────────────────────────────────────────────────────────────────────
// SHARED DOCUMENT JSON TYPES — Used by all renderers (HTML, PDF, DOCX)
// ─────────────────────────────────────────────────────────────────────────────

export interface DocumentMetadata {
  businessName: string;
  legalName: string;
  address: string;
  email: string;
  phone: string;
  website: string;
  jurisdiction: string;
  generatedDate: string;
  version: string;
}

export interface ClauseContent {
  type: 'clause';
  clauseNumber: string;
  text: string;
}

export interface ParagraphContent {
  type: 'paragraph';
  text: string;
}

export interface BulletContent {
  type: 'bullet';
  text: string;
}

export interface HeadingContent {
  type: 'heading';
  text: string;
}

export interface SignatureBlockContent {
  type: 'signature_block';
  party: string;
  signLine: string;
  dateLine: string;
  nameLabel: string;
  nameValue: string;
  extraFields?: { label: string; value: string }[];
}

export interface TableContent {
  type: 'table';
  headers: string[];
  rows: string[][];
}

export type ContentItem =
  | ClauseContent
  | ParagraphContent
  | BulletContent
  | HeadingContent
  | SignatureBlockContent
  | TableContent;

export type SectionType = 'legal' | 'narrative' | 'list' | 'signature' | 'table' | 'letter';

export interface DocumentSection {
  id: string;
  title: string;
  type: SectionType;
  content: ContentItem[];
}

// ── Generic structured document (T&Cs, Contract, Privacy, Bio, Pitch, LinkedIn, Service Sheets) ──

export interface StructuredDocument {
  documentType: string;
  metadata: DocumentMetadata;
  sections: DocumentSection[];
}

// ── Invoice document ──

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

// ── Late payment letters document ──

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

// ── Welcome email document ──

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

// ── Union type for any document ──

export type AnyDocument =
  | StructuredDocument
  | InvoiceDocument
  | LatePaymentDocument
  | WelcomeEmailDocument;

// ── Helper: detect document kind from parsed JSON ──

export function detectDocumentKind(doc: any): 'structured' | 'invoice' | 'late_payment' | 'welcome_email' {
  if (!doc || !doc.documentType) return 'structured';
  if (doc.documentType === 'invoice_template') return 'invoice';
  if (doc.documentType === 'late_payment_letters') return 'late_payment';
  if (doc.documentType === 'welcome_email') return 'welcome_email';
  if (doc.letters) return 'late_payment';
  if (doc.emails) return 'welcome_email';
  if (doc.businessInfo && doc.lineItems) return 'invoice';
  return 'structured';
}
