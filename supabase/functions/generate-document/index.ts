import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.49.1';
import { PDFDocument, StandardFonts, rgb, PageSizes } from 'npm:pdf-lib@1.17.1';
import { Document as DocxDocument, Paragraph, TextRun, HeadingLevel, Packer, AlignmentType, BorderStyle, Header, Footer, PageNumber, NumberFormat, TabStopType, TabStopPosition, PageBreak, ShadingType, Table, TableRow, TableCell, WidthType, VerticalAlign } from 'npm:docx@9.1.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

// ── Client Design Preferences ──

interface ClientDesign {
  businessName: string;
  legalName: string;
  firstName: string;
  brandColours: string; // hex codes or description
  visualStyle: string; // Q68 answer
  toneOfVoice: string[]; // Q62 answers
  brandIdentity: string; // Q64 answer
  jurisdiction: string;
  documentEmail: string;
  businessPhone: string;
  businessAddress: string;
  websiteUrl: string;
}

// Parse brand colours from intake response into usable hex values
function parseBrandColours(colourInput: string): { primary: string; secondary: string; accent: string } {
  // Default professional palette
  const defaults = { primary: '#1B3F7A', secondary: '#2C68C4', accent: '#4A90E2' };

  if (!colourInput || colourInput.trim() === '') return defaults;

  const input = colourInput.trim().toLowerCase();

  // Try to extract hex codes
  const hexPattern = /#([0-9a-f]{3}|[0-9a-f]{6})\b/gi;
  const hexMatches = colourInput.match(hexPattern);

  if (hexMatches && hexMatches.length >= 2) {
    return {
      primary: hexMatches[0],
      secondary: hexMatches[1],
      accent: hexMatches.length >= 3 ? hexMatches[2] : hexMatches[1],
    };
  }

  if (hexMatches && hexMatches.length === 1) {
    return { primary: hexMatches[0], secondary: defaults.secondary, accent: defaults.accent };
  }

  // Map common colour descriptions
  const colourMap: Record<string, { primary: string; secondary: string; accent: string }> = {
    'navy': { primary: '#1B3F7A', secondary: '#2C68C4', accent: '#4A90E2' },
    'blue': { primary: '#1E40AF', secondary: '#3B82F6', accent: '#60A5FA' },
    'dark blue': { primary: '#1B3F7A', secondary: '#2C68C4', accent: '#4A90E2' },
    'green': { primary: '#065F46', secondary: '#059669', accent: '#34D399' },
    'sage': { primary: '#4A6741', secondary: '#6B8F5B', accent: '#8FB87A' },
    'gold': { primary: '#92400E', secondary: '#B45309', accent: '#D97706' },
    'red': { primary: '#991B1B', secondary: '#DC2626', accent: '#EF4444' },
    'black': { primary: '#1A1A2E', secondary: '#374151', accent: '#6B7280' },
    'purple': { primary: '#5B21B6', secondary: '#7C3AED', accent: '#A78BFA' },
    'teal': { primary: '#0F766E', secondary: '#14B8A6', accent: '#2DD4BF' },
    'coral': { primary: '#9A3412', secondary: '#C2410C', accent: '#EA580C' },
    'warm': { primary: '#78350F', secondary: '#A16207', accent: '#CA8A04' },
    'luxury': { primary: '#1C1917', secondary: '#44403C', accent: '#78716C' },
  };

  for (const [key, value] of Object.entries(colourMap)) {
    if (input.includes(key)) return value;
  }

  return defaults;
}

// Convert hex colour string to pdf-lib rgb
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const clean = hex.replace('#', '');
  const full = clean.length === 3
    ? clean[0] + clean[0] + clean[1] + clean[1] + clean[2] + clean[2]
    : clean;
  return {
    r: parseInt(full.substring(0, 2), 16) / 255,
    g: parseInt(full.substring(2, 4), 16) / 255,
    b: parseInt(full.substring(4, 6), 16) / 255,
  };
}

// Get visual style config for document rendering
function getVisualStyleConfig(style: string): {
  headerFont: string;
  bodyFont: string;
  headerSize: number;
  bodySize: number;
  lineSpacing: number;
  sectionGap: number;
  decorativeElements: boolean;
  borderStyle: 'solid' | 'double' | 'accent' | 'none';
  cornerAccent: boolean;
} {
  switch (style) {
    case 'Clean and modern / minimal':
      return {
        headerFont: 'Helvetica',
        bodyFont: 'Helvetica',
        headerSize: 14,
        bodySize: 10,
        lineSpacing: 14,
        sectionGap: 20,
        decorativeElements: false,
        borderStyle: 'none',
        cornerAccent: false,
      };
    case 'Corporate and formal':
      return {
        headerFont: 'Helvetica',
        bodyFont: 'Helvetica',
        headerSize: 13,
        bodySize: 10,
        lineSpacing: 14,
        sectionGap: 18,
        decorativeElements: true,
        borderStyle: 'double',
        cornerAccent: false,
      };
    case 'Warm and friendly':
      return {
        headerFont: 'Helvetica',
        bodyFont: 'Helvetica',
        headerSize: 14,
        bodySize: 10.5,
        lineSpacing: 15,
        sectionGap: 16,
        decorativeElements: true,
        borderStyle: 'accent',
        cornerAccent: false,
      };
    case 'Premium and luxury':
      return {
        headerFont: 'Helvetica',
        bodyFont: 'Helvetica',
        headerSize: 13,
        bodySize: 10,
        lineSpacing: 14,
        sectionGap: 22,
        decorativeElements: true,
        borderStyle: 'solid',
        cornerAccent: true,
      };
    case 'Simple — I just want it to work':
    default:
      return {
        headerFont: 'Helvetica',
        bodyFont: 'Helvetica',
        headerSize: 13,
        bodySize: 10,
        lineSpacing: 14,
        sectionGap: 16,
        decorativeElements: false,
        borderStyle: 'none',
        cornerAccent: false,
      };
  }
}

// ── Document Type Configuration ──

interface DocumentConfig {
  apiKey: string;
  model: string;
  systemPrompt: string;
}

const NO_MARKDOWN_INSTRUCTION = `

CRITICAL FORMATTING RULES:
- Do NOT use markdown formatting (no ##, ###, **, *, #, etc.)
- Use === SECTION NAME === to denote major section headings
- Use plain numbered clauses (1, 1.1, 1.2, etc.) for sub-sections
- Use - (dash) for bullet points
- Write in plain text with no bold, italic, or other markdown syntax
- All text must be clean and ready for direct rendering into professional documents
- Do NOT wrap any text in backticks, asterisks, or hash symbols

CRITICAL: DO NOT USE MARKDOWN TABLES
- NEVER use | pipe-delimited markdown tables (| Column 1 | Column 2 |)
- Instead, use a clean columnar text format with pipes for readability:

EXAMPLE of CORRECT table format (NOT markdown, plain columnar text):
Purpose of Processing | Data Types | Legal Basis | Retention
Service Provision | Identity, Contact, Service, Financial | Performance of a Contract | During engagement + 1 year after
Billing & Payment | Identity, Contact, Financial | Performance of a Contract, Legal Obligation | 6 years from end of financial year

- Each row is ONE complete line of text with | separators (NOT markdown)
- Use descriptive spacing and keep text concise
- No header row separator (---) or markdown syntax
- Do NOT create actual markdown tables with |---|
`;


const DOCUMENT_CONFIGS: Record<string, DocumentConfig> = {
  terms_and_conditions: {
    apiKey: 'AIzaSyB1Q7FtBCOQjD5ZSH-4dAmHR74WJDIYsB0',
    model: 'gemini-2.5-flash',
    systemPrompt: `You are an expert legal document drafting assistant specializing in UK business law for small business services.

Your task: Generate a comprehensive, professional, legally robust Terms and Conditions document based on the client brief provided.

MANDATORY SECTIONS (ALL must be included, complete, and detailed):

1. INTRODUCTION & DEFINITIONS
   - Formal introduction to the business
   - Complete definitions section with terms like "Agreement", "Client", "Services", "Fees", "Intellectual Property", etc.
   - Interpretation rules

2. FORMATION OF CONTRACT & ACCEPTANCE
   - How contract is formed
   - When terms apply
   - Variation procedures

3. DETAILED SERVICE DESCRIPTION
   - EXACT scope of each service mentioned in the brief
   - Service 1, Service 2 (if applicable) with full details
   - EXPLICIT exclusions (what is NOT included)
   - Limitations on what can be achieved

4. CLIENT OBLIGATIONS & RESPONSIBILITIES
   - Information and access requirements
   - Warranties about client content
   - Timely decision-making and feedback
   - Restrictions on what client can ask for (illegal, unethical, IP-infringing work)
   - Secure credential handling (NO direct passwords)
   - Consequences of delays caused by client

5. COMPREHENSIVE PAYMENT TERMS
   - Pricing model (subscription, project-based, hybrid)
   - DEPOSIT STRUCTURE: Percentage required, when due, refund status
   - Invoicing schedule and format
   - Due date (e.g., "7 days")
   - LATE PAYMENT CLAUSE: Interest rate, accrual method, grace period
   - Payment methods accepted
   - VAT treatment (if applicable)
   - Suspension rights for non-payment
   - Chargeback policy with specific remedies

6. REFUNDS & CANCELLATION POLICY
   - Clear refund policy (when work has commenced, refunds are typically non-refundable)
   - Cancellation notice periods (e.g., "30 days for retainer services, 7 days for projects")
   - Effect on outstanding fees
   - Consumer cooling-off rights (14 days under Consumer Contracts Regulations 2013)
   - Waiver of cooling-off if services have commenced

7. INTELLECTUAL PROPERTY RIGHTS
   - Client-supplied IP ownership (client retains)
   - Pre-existing IP (service provider retains templates, methodologies)
   - Project-specific IP (deliverables ownership: transfers to client on full payment)
   - Client indemnity for IP infringement claims

8. CONFIDENTIALITY & DATA PROTECTION
   - Mutual confidentiality obligations
   - Exceptions to confidentiality (legal requirement, employee/advisor access)
   - Survival post-termination
   - GDPR/Data Protection Act 2018 compliance statement
   - Reference to separate Privacy Policy

9. LIABILITY LIMITATION & WARRANTIES
   - Carve-outs (death, personal injury, fraud cannot be limited)
   - Disclaimer of specific outcomes (e.g., no guarantee of X leads, conversions, etc.)
   - Limitation cap: Total liability <= fees paid in preceding 12 months
   - Exclusion of indirect/consequential losses
   - Professional indemnity insurance status

10. FORCE MAJEURE
    - Definition of Force Majeure Events
    - Notification requirements
    - Termination right if FM event exceeds 30 days

11. TERMINATION CLAUSES
    - Notice period for termination by either party (e.g., "30 days for retainer, 7 days for projects")
    - Immediate termination for cause: non-payment, material breach, insolvency
    - Cure period for remediable breaches (e.g., "10 business days")
    - Consequences of termination: payment obligation, IP transfer timing

12. DISPUTE RESOLUTION & GOVERNING LAW
    - Good faith negotiation first
    - Escalation path
    - Governing law: England and Wales
    - Jurisdiction: English courts
    - References to Late Payment of Commercial Debts (Interest) Act 1998

13. GENERAL PROVISIONS
    - Severability clause
    - Entire agreement clause
    - Amendment procedure
    - Waiver rules
    - Third-party rights (Contracts Rights of Third Parties Act 1999)
    - Assignment restrictions

14. CONTACT & NOTICES
    - Contact details for disputes and notices
    - Email and telephone
    - Website reference

CRITICAL REQUIREMENTS:

- Write in formal UK English legal style
- Use numbered clauses throughout (1, 1.1, 1.2, etc.)
- Use === SECTION NAME === to denote major sections
- Reference the client's SPECIFIC business details from the brief (name, location, services)
- Use CURRENT date (May 2026) for any version dates
- NO [REVIEW] markers, NO placeholder text, NO TBD sections
- Complete sentences with full context; do not truncate
- Include specific figures from the brief (e.g., payment terms, interest rates, notice periods)
- Each clause must be complete and self-contained
- Assume this is a final, deliver-ready document

DOCUMENT QUALITY:
- Length: 3000-4500 words (comprehensive but concise)
- Structure: Logical flow from formation to termination
- Language: Professional, precise, accessible to business owners (not overly legalistic)
- Completeness: No missing sections, no cut-off text${NO_MARKDOWN_INSTRUCTION}
Generate the document now.`,
  },

  bespoke_client_contract: {
    apiKey: 'AIzaSyBt3APMr8-rRbexFnmgm-7nl7LkOQHquTY',
    model: 'gemini-2.5-flash',
    systemPrompt: `You are an expert legal document drafting assistant specializing in UK business contracts.

Your task: Generate a comprehensive Bespoke Client Contract (project-specific agreement) based on the client brief.

MANDATORY SECTIONS (ALL must be complete):

1. PARTIES & EFFECTIVE DATE
   - Full legal names and trading details
   - Business structure and address
   - Contact details
   - Effective date (current date, May 2026)

2. RECITALS/BACKGROUND
   - Why parties are entering agreement
   - What client seeks
   - What services provider will provide

3. SCOPE OF WORK/SERVICES
   - DETAILED description of deliverables
   - Timeline/milestones from the brief
   - Success criteria (if applicable)
   - Exclusions (what is NOT included)

4. DELIVERABLES & ACCEPTANCE
   - What exactly will be delivered
   - Format and specifications
   - Client review/approval process
   - Revision allowance (if any)

5. TIMELINE & MILESTONES
   - Start date
   - Key milestones with dates
   - Completion date
   - Delay consequences and responsibility

6. FEES & PAYMENT TERMS
   - Total project fee (from brief)
   - Deposit amount (%), due date
   - Remaining payment schedule
   - Invoice timing
   - Payment method (Stripe, bank transfer, etc.)
   - Late payment interest and remedies
   - VAT treatment

7. EXPENSES & ADDITIONAL COSTS
   - What is/isn't included in fees
   - Reimbursable expenses (if any)
   - Approval requirements for over-limit spend

8. INTELLECTUAL PROPERTY
   - Ownership of deliverables
   - When ownership transfers (upon payment, upon completion, etc.)
   - Pre-existing IP (service provider retains)
   - Client IP (client retains)

9. CONFIDENTIALITY
   - Mutual obligations
   - Duration
   - Exceptions

10. TERMINATION
    - Termination for convenience (notice period)
    - Termination for cause (non-payment, breach)
    - Effect on payment (client owes for work completed)
    - IP return/transfer on termination

11. LIABILITY & INDEMNIFICATION
    - Service provider's liability cap
    - Client indemnity for IP infringement
    - Limitation on consequential damages
    - Professional standards warranty

12. GOVERNING LAW & DISPUTE RESOLUTION
    - England and Wales law
    - Good faith negotiation
    - English courts jurisdiction

CRITICAL REQUIREMENTS:

- Use client's SPECIFIC business name, location, services
- Include SPECIFIC fees from the brief
- Include SPECIFIC timeline/deliverables
- Use current date (May 2026)
- NO placeholder text, NO [REVIEW] markers
- Complete and polished (ready to sign)
- Assume payment is structured (e.g., 50% deposit, 50% on completion)
- Length: 1500-2500 words
- Every clause must be detailed and complete${NO_MARKDOWN_INSTRUCTION}
Generate the document now.`,
  },

  gdpr_privacy_policy: {
    apiKey: 'AIzaSyAIcCl8IzLaLIOXGZusfES_vU12EHg0qAo',
    model: 'gemini-2.5-flash',
    systemPrompt: `You are an expert legal document drafting assistant specializing in UK GDPR compliance.

Your task: Generate a comprehensive, compliant Privacy Policy for a UK business based on the client brief.

MANDATORY SECTIONS (ALL must be complete):

1. INTRODUCTION & ABOUT US
   - Who we are (company name, trading name, legal structure)
   - What we do
   - Commitment to privacy
   - Policy effective date (May 2026)
   - Agreement to terms

2. OUR CONTACT DETAILS & DATA CONTROLLER INFO
   - Legal name
   - Trading name
   - Business address
   - Email
   - Phone
   - Website
   - Data controller statement

3. TYPES OF DATA WE COLLECT (COMPREHENSIVE LIST)
   - Identity Data (name, business name, title)
   - Contact Data (address, email, phone)
   - Financial Data (payment details - WITH note that Stripe processes, not stored directly)
   - Service Data (project details specific to their services from brief)
   - Technical Data (IP address, browser, device info)
   - Usage Data (how website/services are used)
   - Marketing Data (preferences, communication preferences)
   - Special Categories: EXPLICITLY STATE we do NOT collect (race, health, criminal records, etc.)

4. HOW WE COLLECT DATA (METHODS)
   - Direct interactions (forms, email, phone, meetings)
   - Automated collection (cookies, analytics)
   - Third parties (payment processors, social media platforms mentioned in brief)

5. LEGAL BASIS FOR PROCESSING (Article 6 UK GDPR)
   - Contract performance (services provision)
   - Legal obligation (tax, accounting)
   - Legitimate interests (business administration, relationship management, fraud prevention)
   - Explicit consent (marketing)

6. HOW WE USE YOUR DATA (PURPOSES - DETAILED)
   - Service provision (fulfill contract)
   - Communication (send updates, confirmations)
   - Billing and payment processing
   - Administration and legal compliance
   - Marketing (WITH consent note)
   - Research and improvement
   - Fraud detection and security

7. WHO WE SHARE DATA WITH (THIRD PARTIES)
   - Payment processors (Stripe - explicitly named)
   - Email service providers (if mentioned in brief)
   - Cloud storage (Google Drive, CRM platforms from brief)
   - Professional advisors (accountants, lawyers - no data shared unless required)
   - Law enforcement (if legally required)
   - NO sharing for marketing purposes without consent

8. INTERNATIONAL TRANSFERS
   - State whether data is transferred outside UK
   - If yes, describe safeguards (Standard Contractual Clauses, etc.)

9. DATA RETENTION (HOW LONG WE KEEP DATA)
   - General retention period
   - Service data: retained during engagement + [X] years after
   - Financial data: as required by tax law (typically 6 years)
   - Marketing data: until consent withdrawn

10. DATA SUBJECT RIGHTS (Article 15-22 UK GDPR)
    - Right of access
    - Right to rectification
    - Right to erasure
    - Right to restrict processing
    - Right to data portability
    - Right to object
    - Rights related to automated decision-making
    - How to exercise rights (email, contact form)
    - Response timeline (30 days)

11. COOKIES POLICY
    - If cookies are used: specify types
    - How to manage/refuse cookies
    - OR if NO cookies: clearly state

12. MARKETING & COMMUNICATIONS
    - How we send marketing
    - Consent requirements
    - Unsubscribe link in every email
    - Right to withdraw consent anytime

13. SECURITY & DATA PROTECTION
    - Measures we take (encryption, access controls, staff training)
    - Data breach notification (notify within 72 hours if required)

14. CHILDREN'S DATA
    - State we do not intentionally collect data from children <13

15. THIRD-PARTY LINKS & SERVICES
    - We are not responsible for third-party privacy policies

16. CHANGES TO THIS POLICY
    - We may update this policy
    - Will notify of material changes

17. YOUR RIGHTS & COMPLAINTS
    - Contact us with any questions or requests
    - Right to lodge complaint with ICO (Information Commissioner's Office)
    - ICO contact details

18. CONTACT INFORMATION
    - Full contact details

CRITICAL REQUIREMENTS:

- Compliant with UK GDPR and Data Protection Act 2018
- Use client's SPECIFIC business details from brief
- EXPLICITLY reference specific tools they use (Stripe, Mailchimp, Google Drive, CRM names, etc.)
- Use current date (May 2026)
- NO placeholder text, NO [REVIEW] markers, NO generic copy
- Specific retention periods (not vague "as long as necessary")
- Address their ACTUAL data practices from the brief
- Length: 2500-3500 words
- Every section must be complete and specific${NO_MARKDOWN_INSTRUCTION}
Generate the document now.`,
  },

  professional_bio: {
    apiKey: 'AIzaSyDNOQMQ6WkDn59E9oYomzRoC-Usssuocgo',
    model: 'gemini-2.5-flash',
    systemPrompt: `You are a professional copywriter specializing in personal branding for small business owners.

Your task: Generate compelling professional bio content using the client's brand voice and story from the brief.

DELIVERABLES (3 VERSIONS):

1. SHORT BIO (50 words)
   - One punchy paragraph
   - Name, what they do, who they help
   - Key differentiator or achievement
   - Suitable for: Email signatures, LinkedIn headline, Twitter bio

2. MEDIUM BIO (150 words)
   - 2-3 paragraphs
   - Their origin story / why they started
   - What they do and for whom
   - Their approach/philosophy
   - Key achievement or result
   - Suitable for: Website "About" page sidebar, PDF proposals

3. LONG BIO (300-400 words)
   - 4-5 well-structured paragraphs
   - Background and journey to current business
   - The problem they solve
   - Their services and specialisms
   - Philosophy and approach
   - Results/impact
   - Call-to-action
   - Suitable for: Full "About" page, guest speaker bios, media kit

CRITICAL REQUIREMENTS:

- Use client's SPECIFIC business name, location, target audience from brief
- Match the brand voice from the brief
- Include their EXACT services/specialisms
- Highlight their UNIQUE differentiator
- Use ACTIVE, engaging language
- NO jargon unless aligned with their industry
- Personal touch (mention founder if single-person business)
- Results-oriented
- Ready to copy-paste with minimal edits
- Use current date context (May 2026)
- Length: 50 + 150 + 300-400 words total
- Tone: Professional but personable, not corporate-speak

Format each version clearly with section headers:
=== SHORT BIO (50 WORDS) ===
[bio here]

=== MEDIUM BIO (150 WORDS) ===
[bio here]

=== LONG BIO (300-400 WORDS) ===
[bio here]${NO_MARKDOWN_INSTRUCTION}
Generate all three versions now.`,
  },

  linkedin_script: {
    apiKey: 'AIzaSyBT-jBdlIkmfopbow2MyLGPU4xJI3L7z_Q',
    model: 'gemini-2.5-flash',
    systemPrompt: `You are an expert LinkedIn strategist and copywriter specializing in optimizing profiles for small business owners.

Your task: Generate a complete LinkedIn profile "script" using the client's business details from the brief.

DELIVERABLES (ALL FIELDS, READY TO COPY-PASTE):

1. HEADLINE (120 characters max - state the limit)
   - Keyword-rich
   - Includes: what they do + who they serve + key benefit
   - Avoid: Generic titles, excessive hashtags

2. ABOUT/SUMMARY SECTION (2600 characters max - state the limit)
   - Opens with hook (who they serve, what problem they solve)
   - 2-3 paragraphs covering their story, services, differentiator, results
   - Includes: industry keywords, specific service names
   - Ends with clear CTA

3. EXPERIENCE SECTION GUIDANCE
   - Current role title suggestion
   - Bullet points for key responsibilities

4. SPECIALTIES/SKILLS SECTION
   - List of skills to add (searchable keywords)
   - 10-15 key skills

5. BANNER TEXT SUGGESTION
   - Short tagline/visual text for LinkedIn banner

6. HASHTAG RECOMMENDATIONS
   - 5-10 relevant hashtags

7. POST CADENCE RECOMMENDATION
   - Suggested posting frequency
   - Types of content to share

CRITICAL REQUIREMENTS:

- Use client's EXACT business name and details from brief
- Include ALL services they offer
- Use the BRAND VOICE from their brief
- Keyword optimization for searchability
- State character limits where applicable
- Format with clear labels so they can copy each section
- SPECIFIC to their industry and target audience
- Actionable and ready to implement
- Length: 1500-2000 words total
- NO placeholder text, NO [REVIEW] sections${NO_MARKDOWN_INSTRUCTION}
Generate the complete LinkedIn profile script now.`,
  },

  elevator_pitch: {
    apiKey: 'AIzaSyD7DTWfXH0p1Z3krq07XbrcWITv_9vHR6c',
    model: 'gemini-2.5-flash',
    systemPrompt: `You are a professional speechwriter and pitch coach specializing in crafting compelling elevator pitches.

Your task: Generate three versions of an elevator pitch for the client's business from their brief.

DELIVERABLES (3 VERSIONS WITH CLEAR TIMING):

1. 15-SECOND PITCH (40-45 words)
   - Opening hook
   - Problem statement
   - Solution
   - Call-to-action
   - USE CASE: Quick greeting, networking event

2. 30-SECOND PITCH (75-85 words)
   - Expanded version
   - Hook + problem + solution + brief benefit
   - One specific example or result
   - Clear CTA
   - USE CASE: Elevator pitch, networking events, podcast intro

3. 60-SECOND PITCH (140-160 words)
   - Full narrative arc
   - Story element
   - The problem they solve
   - Their solution (detailed approach)
   - Results/impact
   - Why they're different
   - Clear next steps/CTA
   - USE CASE: Sales call, webinar intro, speaking engagement

CRITICAL REQUIREMENTS:

- Use client's SPECIFIC business name and services from brief
- Match their EXACT brand voice
- Focus on TARGET AUDIENCE from brief
- Include their MAIN DIFFERENTIATOR
- Use ACTIVE, confident language
- Conversational tone (written as if spoken)
- Clear CTAs
- NO placeholder text, NO [REVIEW] markers
- State the word count and timing for each version
- Length: Total 300-400 words across all three

Format clearly:

=== 15-SECOND PITCH (40-45 words, approximately 15 seconds at natural speaking pace) ===
[pitch text]

=== 30-SECOND PITCH (75-85 words, approximately 30 seconds at natural speaking pace) ===
[pitch text]

=== 60-SECOND PITCH (140-160 words, approximately 60 seconds at natural speaking pace) ===
[pitch text]${NO_MARKDOWN_INSTRUCTION}
Generate all three pitches now.`,
  },

  professional_invoice_template: {
    apiKey: 'AIzaSyC7OwlQ6YawrwbBCBhjXy_6fTa01aXEEkQ',
    model: 'gemini-2.5-flash',
    systemPrompt: `You are an expert in business document design, UK tax law, and professional invoicing standards.

Your task: Generate a professional, reusable Invoice Template for the client using their business details from the brief.

MANDATORY SECTIONS (ALL complete with placeholder fields):

1. HEADER/BUSINESS DETAILS (TOP LEFT)
   - Business name (from brief)
   - Legal/trading name (if different)
   - Business address (from brief)
   - Phone number (from brief)
   - Email address (from brief)
   - Website (if applicable)
   - Tax ID / VAT number (if registered)

2. INVOICE DETAILS (TOP RIGHT)
   - Invoice number placeholder: "INV-[YYYY]-[####]"
   - Invoice date placeholder
   - Due date placeholder

3. "BILL TO" SECTION
   - Placeholder fields for client name, company, address, email, phone

4. LINE ITEMS TABLE
   - Description, Quantity, Unit price, Total columns
   - Include 3-5 blank sample rows

5. SUBTOTAL AND CALCULATIONS
   - Subtotal, VAT/Tax, Total amount due

6. PAYMENT TERMS AND BANKING DETAILS
   - Payment deadline
   - Payment methods accepted
   - Bank details (if applicable)
   - Payment reference format

7. LATE PAYMENT CLAUSE (MANDATORY)
   - Statutory interest wording per Late Payment of Commercial Debts Act 1998

8. NOTES/ADDITIONAL TERMS

9. FOOTER
   - Contact information
   - Thank you message

CRITICAL REQUIREMENTS:

- Use client's SPECIFIC business details from brief
- Include their EXACT payment terms
- Include their EXACT payment methods
- Show VAT calculation clearly
- Reference their late payment interest policy from brief
- Ready to copy and reuse
- Professional, clean layout
- UK compliant
- Length: approximately 500-800 words when rendered${NO_MARKDOWN_INSTRUCTION}
Generate the complete invoice template now.`,
  },

  welcome_email: {
    apiKey: 'AIzaSyAV_L0-QKvaZ4y6z8-3ZFT5r5Wa1pExBXA',
    model: 'gemini-2.5-flash',
    systemPrompt: `You are an expert email copywriter specializing in client onboarding and first-impression communication.

Your task: Generate three versions of a New Client Welcome Email for the client using their business details from the brief.

DELIVERABLES (3 COMPLETE EMAIL VERSIONS):

1. FORMAL AND PROFESSIONAL VERSION
   - Subject line suggestion
   - Formal greeting
   - Welcome statement
   - Brief overview of engagement
   - What happens next
   - Payment expectations
   - Key contacts and support info
   - Professional closing

2. WARM AND FRIENDLY VERSION
   - Subject line suggestion (casual/warm)
   - Informal greeting
   - Personal welcome
   - What they can expect
   - Your commitment to their success
   - Quick overview of the service
   - When to expect deliverables
   - How to communicate
   - Warm closing with name

3. BRIEF AND ACTION-ORIENTED VERSION
   - Subject line suggestion (action-oriented)
   - Quick greeting
   - Confirmation of engagement
   - Next immediate action
   - Key dates/milestones (bullet points)
   - Contact for questions
   - Brief signoff

CRITICAL REQUIREMENTS FOR ALL VERSIONS:

- Use client's SPECIFIC business name
- Reference their EXACT service(s) from the brief
- Include SPECIFIC payment details if applicable
- Include their CONTACT DETAILS
- Set clear expectations
- Match their BRAND VOICE from the brief
- Ready to send with minimal customization
- Length: 150-250 words each
- NO placeholder text, NO [REVIEW] markers

Format clearly:

=== EMAIL VERSION 1: FORMAL AND PROFESSIONAL ===
Subject line suggestion: [subject]
[Email body]

=== EMAIL VERSION 2: WARM AND FRIENDLY ===
Subject line suggestion: [subject]
[Email body]

=== EMAIL VERSION 3: BRIEF AND ACTION-ORIENTED ===
Subject line suggestion: [subject]
[Email body]${NO_MARKDOWN_INSTRUCTION}
Generate all three email versions now.`,
  },

  late_payment_letters: {
    apiKey: 'AIzaSyC3QNfx7IW2uVE6Lwic0OEx9DuJFJsr8tc',
    model: 'gemini-2.5-flash',
    systemPrompt: `You are an expert legal document specialist in UK debt collection and commercial law.

Your task: Generate three increasingly firm late payment reminder letters for the client's business.

DELIVERABLES (3 LETTERS - PROGRESSION OF FIRMNESS):

LETTER 1: FRIENDLY REMINDER (7 DAYS OVERDUE)
- Tone: Professional, understanding, assumptive
- Include: Invoice details, due date, payment instructions, grace period
- Warm closing

LETTER 2: FIRM REMINDER (14 DAYS OVERDUE)
- Tone: Professional, firm, business-like
- Include: Debt recitation, consequences warning, MANDATORY LEGAL CLAUSE per Late Payment of Commercial Debts (Interest) Act 1998
- Interest calculation example
- Final deadline
- Suspension notice

LETTER 3: FINAL NOTICE BEFORE LEGAL ACTION (30 DAYS OVERDUE)
- Tone: Formal, serious, legal, final warning
- Include: FINAL DEMAND language, total owing calculation, legal action warning
- Reference to Terms and Conditions
- Payment plan offer (optional, shows good faith)

CRITICAL REQUIREMENTS FOR ALL LETTERS:

- Use client's SPECIFIC business name, address, contact details from brief
- Use SPECIFIC payment terms from brief
- Use SPECIFIC late payment interest rate from brief
- Reference their SPECIFIC payment methods
- Include PLACEHOLDER FIELDS: [Client Name], [Invoice Number], [Amount], [Date], etc.
- Format as formal business letters with proper UK formatting
- Each letter is STANDALONE
- Legal language is accurate and compliant with UK law
- Each letter references previous communications (in Letter 2 and 3)
- All three letters are ready to customize and send
- Professional letterhead format
- Length: 200-300 words (Letter 1), 300-400 words (Letter 2), 400-500 words (Letter 3)

Format clearly:

=== LETTER 1: FRIENDLY REMINDER (7 DAYS OVERDUE) ===
[Full letter with all fields]

=== LETTER 2: FIRM REMINDER (14 DAYS OVERDUE) ===
[Full letter with all fields]

=== LETTER 3: FINAL NOTICE BEFORE LEGAL ACTION (30 DAYS OVERDUE) ===
[Full letter with all fields]${NO_MARKDOWN_INSTRUCTION}
Generate all three letters now, making them comprehensive, legal, and ready to customize.`,
  },
};

// ── Text Parsing (handles ALL markdown variants) ──

interface TextBlock {
  type: 'heading' | 'paragraph' | 'clause' | 'bullet' | 'subheading';
  text: string;
  level: number; // 1 = main heading, 2 = sub-heading, 3 = sub-sub-heading
}

function convertMarkdownTableToColumns(text: string): string {
  // Convert markdown tables to clean columnar format
  const lines = text.split('\n');
  const result: string[] = [];
  let inTable = false;
  let headerRow: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Check if this is a markdown table line (starts and ends with |)
    if (line.startsWith('|') && line.endsWith('|')) {
      // Extract cells from markdown table row: | cell1 | cell2 | cell3 |
      const cells = line
        .split('|')
        .slice(1, -1) // Remove empty strings from leading/trailing |
        .map(cell => cell.trim());

      // Skip separator rows (|---|---|---|)
      if (cells.some(cell => /^-+$/.test(cell))) {
        inTable = true;
        continue;
      }

      // If this is the first non-separator row, it's the header
      if (inTable && headerRow.length === 0) {
        headerRow = cells;
        // Add header row with pipe separators
        result.push(cells.join(' | '));
        result.push(''); // Empty line for spacing
      } else if (inTable && cells.length > 0) {
        // Regular data row - join with pipes
        result.push(cells.join(' | '));
      }
    } else {
      // Not a table line - if we were in a table, we've ended it
      if (inTable && headerRow.length > 0) {
        inTable = false;
        headerRow = [];
        result.push(''); // Add spacing after table
      }
      result.push(line);
    }
  }

  return result.join('\n');
}

function stripMarkdown(text: string): string {
  // First convert markdown tables to columnar format
  let cleaned = convertMarkdownTableToColumns(text);

  // Remove markdown bold/italic markers but keep the text
  // Handle **bold** and __bold__
  cleaned = cleaned.replace(/\*\*(.+?)\*\*/g, '$1');
  cleaned = cleaned.replace(/__(.+?)__/g, '$1');
  // Handle *italic* and _italic_ (but not within words)
  cleaned = cleaned.replace(/(?<!\w)\*(.+?)\*(?!\w)/g, '$1');
  cleaned = cleaned.replace(/(?<!\w)_(.+?)_(?!\w)/g, '$1');
  // Remove ~~strikethrough~~
  cleaned = cleaned.replace(/~~(.+?)~~/g, '$1');
  // Remove inline code backticks
  cleaned = cleaned.replace(/`(.+?)`/g, '$1');
  // Remove markdown link syntax [text](url) -> text
  cleaned = cleaned.replace(/\[(.+?)\]\(.+?\)/g, '$1');
  // Remove image syntax ![alt](url)
  cleaned = cleaned.replace(/!\[.*?\]\(.+?\)/g, '');
  // Remove horizontal rules (---, ***, ___)
  cleaned = cleaned.replace(/^-{3,}$/gm, '');
  cleaned = cleaned.replace(/^\*{3,}$/gm, '');
  cleaned = cleaned.replace(/^_{3,}$/gm, '');
  // Remove blockquote markers
  cleaned = cleaned.replace(/^>\s*/gm, '');
  // Remove hashtag headers at start of lines (## Title, ### Title, # Title)
  // These are handled in parseTextToBlocks, but clean any remaining
  cleaned = cleaned.replace(/^#{1,6}\s+/gm, '');
  return cleaned;
}

function parseTextToBlocks(text: string): TextBlock[] {
  const blocks: TextBlock[] = [];
  const lines = text.split('\n');
  let currentParagraph: string[] = [];

  const flushParagraph = () => {
    const joined = currentParagraph.join(' ').trim();
    if (joined) {
      const cleaned = stripMarkdown(joined);
      if (cleaned) {
        // Check if it's a numbered clause
        const clauseMatch = cleaned.match(/^(\d+(?:\.\d+)*)\.\s+(.+)$/);
        if (clauseMatch) {
          blocks.push({ type: 'clause', text: cleaned, level: 0 });
        } else {
          blocks.push({ type: 'paragraph', text: cleaned, level: 0 });
        }
      }
    }
    currentParagraph = [];
  };

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed) {
      flushParagraph();
      continue;
    }

    // Section heading with === delimiters
    if (/^===\s*.+\s*===$/.test(trimmed)) {
      flushParagraph();
      const headingText = stripMarkdown(trimmed.replace(/^===\s*/, '').replace(/\s*===$/, '').trim());
      blocks.push({ type: 'heading', text: headingText, level: 1 });
      continue;
    }

    // Markdown heading: ## Title or ### Title or # Title
    const mdHeadingMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);
    if (mdHeadingMatch) {
      flushParagraph();
      const level = Math.min(mdHeadingMatch[1].length, 3);
      const headingText = stripMarkdown(mdHeadingMatch[2].trim());
      if (level === 1) {
        blocks.push({ type: 'heading', text: headingText, level: 1 });
      } else if (level === 2) {
        blocks.push({ type: 'heading', text: headingText, level: 2 });
      } else {
        blocks.push({ type: 'subheading', text: headingText, level: 3 });
      }
      continue;
    }

    // Bullet point: - item or * item or bullet character
    if (/^[-*]\s+/.test(trimmed) || /^\u2022\s+/.test(trimmed)) {
      flushParagraph();
      const bulletText = stripMarkdown(trimmed.replace(/^[-*\u2022]\s+/, ''));
      blocks.push({ type: 'bullet', text: bulletText, level: 0 });
      continue;
    }

    // Numbered clause at start of line: 1. or 1.1. etc.
    if (/^\d+(?:\.\d+)*\.\s+/.test(trimmed)) {
      flushParagraph();
      blocks.push({ type: 'clause', text: stripMarkdown(trimmed), level: 0 });
      continue;
    }

    // Continuation of previous paragraph
    currentParagraph.push(trimmed);
  }

  flushParagraph();
  return blocks;
}

// ── Text Wrapping ──

function wrapText(text: string, font: any, fontSize: number, maxWidth: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const testWidth = font.widthOfTextAtSize(testLine, fontSize);

    if (testWidth > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

// ── Professional PDF Generation ──

async function generatePdf(
  text: string,
  documentLabel: string,
  businessName: string,
  design: ClientDesign
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const italicFont = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  const pageWidth = PageSizes.A4[0];
  const pageHeight = PageSizes.A4[1];
  const margin = 72;
  const contentWidth = pageWidth - (margin * 2);

  // Parse brand colours
  const colours = parseBrandColours(design.brandColours);
  const primaryRgb = hexToRgb(colours.primary);
  const secondaryRgb = hexToRgb(colours.secondary);
  const accentRgb = hexToRgb(colours.accent);

  // Get visual style config
  const styleConfig = getVisualStyleConfig(design.visualStyle);

  // Parse text into structured blocks (strips markdown)
  const blocks = parseTextToBlocks(text);

  // Colour constants
  const primaryColour = rgb(primaryRgb.r, primaryRgb.g, primaryRgb.b);
  const secondaryColour = rgb(secondaryRgb.r, secondaryRgb.g, secondaryRgb.b);
  const accentColour = rgb(accentRgb.r, accentRgb.g, accentRgb.b);
  const darkText = rgb(0.15, 0.15, 0.2);
  const bodyText = rgb(0.2, 0.2, 0.25);
  const lightText = rgb(0.5, 0.5, 0.55);
  const ruleLine = rgb(primaryRgb.r * 0.3 + 0.7, primaryRgb.g * 0.3 + 0.7, primaryRgb.b * 0.3 + 0.7);

  const lineHeight = styleConfig.lineSpacing;
  const fontSize = styleConfig.bodySize;
  const smallFontSize = 7.5;
  const headingFontSize = styleConfig.headerSize;
  const titleFontSize = 20;

  // Build pages
  let page = pdfDoc.addPage(PageSizes.A4);
  let y = pageHeight - margin;

  // ── First page header ──
  // Decorative top bar
  if (styleConfig.decorativeElements || styleConfig.cornerAccent) {
    page.drawRectangle({
      x: 0,
      y: pageHeight - 6,
      width: pageWidth,
      height: 6,
      color: primaryColour,
    });
  }

  // Document title
  y = pageHeight - margin - 20;
  const titleWidth = boldFont.widthOfTextAtSize(documentLabel, titleFontSize);
  page.drawText(documentLabel, {
    x: (pageWidth - titleWidth) / 2,
    y: y,
    size: titleFontSize,
    font: boldFont,
    color: primaryColour,
  });
  y -= 24;

  // Subtitle: Prepared for [Business Name]
  const displayName = design.brandIdentity === 'My personal name is the brand — I want documents to feel personal'
    ? `${design.firstName || businessName}`
    : businessName;
  const subtitle = `Prepared for ${displayName}`;
  const subtitleWidth = italicFont.widthOfTextAtSize(subtitle, 10);
  page.drawText(subtitle, {
    x: (pageWidth - subtitleWidth) / 2,
    y: y,
    size: 10,
    font: italicFont,
    color: lightText,
  });
  y -= 16;

  // Foundationary branding
  const branding = 'Foundationary';
  const brandingWidth = font.widthOfTextAtSize(branding, 9);
  page.drawText(branding, {
    x: (pageWidth - brandingWidth) / 2,
    y: y,
    size: 9,
    font: font,
    color: lightText,
  });
  y -= 14;

  // Decorative header line
  if (styleConfig.borderStyle === 'double') {
    page.drawLine({
      start: { x: margin, y: y },
      end: { x: pageWidth - margin, y: y },
      thickness: 2,
      color: primaryColour,
    });
    y -= 4;
    page.drawLine({
      start: { x: margin, y: y },
      end: { x: pageWidth - margin, y: y },
      thickness: 0.5,
      color: secondaryColour,
    });
    y -= 20;
  } else if (styleConfig.borderStyle === 'solid') {
    page.drawLine({
      start: { x: margin, y: y },
      end: { x: pageWidth - margin, y: y },
      thickness: 2.5,
      color: primaryColour,
    });
    y -= 20;
  } else if (styleConfig.borderStyle === 'accent') {
    // Left accent bar + thin line
    page.drawRectangle({
      x: margin,
      y: y - 2,
      width: 4,
      height: 8,
      color: accentColour,
    });
    page.drawLine({
      start: { x: margin + 8, y: y },
      end: { x: pageWidth - margin, y: y },
      thickness: 1,
      color: secondaryColour,
    });
    y -= 20;
  } else {
    // Minimal: thin line
    page.drawLine({
      start: { x: margin, y: y },
      end: { x: pageWidth - margin, y: y },
      thickness: 1,
      color: ruleLine,
    });
    y -= 20;
  }

  // ── Widow/orphan prevention: minimum remaining space to start a section ──
  // If less than 1/3 of the content area remains, push to a new page
  const contentAreaHeight = pageHeight - (margin * 2);
  const minSectionStart = margin + (contentAreaHeight / 3);

  // Helper: estimate block height before rendering
  function estimateBlockHeight(block: TextBlock): number {
    if (block.type === 'heading') {
      const hSize = block.level === 1 ? headingFontSize : 11;
      return hSize + 4 + styleConfig.sectionGap;
    }
    if (block.type === 'subheading') {
      return 10.5 + 16;
    }
    if (block.type === 'clause') {
      const lines = wrapText(block.text, font, fontSize, contentWidth - 24);
      return (lines.length * lineHeight) + 4;
    }
    if (block.type === 'bullet') {
      const lines = wrapText(block.text, font, fontSize, contentWidth - 36);
      return (lines.length * lineHeight) + 2;
    }
    // paragraph
    const lines = wrapText(block.text, font, fontSize, contentWidth);
    return (lines.length * lineHeight) + 6;
  }

  // ── Render content blocks ──
  for (let blockIndex = 0; blockIndex < blocks.length; blockIndex++) {
    const block = blocks[blockIndex];
    const blockHeight = estimateBlockHeight(block);

    if (block.type === 'heading') {
      // Widow/orphan check: if less than 1/3 page left OR the heading + next block won't fit
      const nextBlock = blocks[blockIndex + 1];
      const nextHeight = nextBlock ? estimateBlockHeight(nextBlock) : 0;
      const combinedHeight = blockHeight + nextHeight;
      const remainingSpace = y - margin;

      if (y < minSectionStart || remainingSpace < combinedHeight) {
        page = pdfDoc.addPage(PageSizes.A4);
        y = pageHeight - margin;
      }

      const headingText = block.text;
      const headingSize = block.level === 1 ? headingFontSize : 11;
      const headingFont = block.level === 1 ? boldFont : boldFont;
      const headingColour = block.level === 1 ? primaryColour : secondaryColour;

      // Section heading with decorative underline
      page.drawText(headingText, {
        x: margin,
        y: y,
        size: headingSize,
        font: headingFont,
        color: headingColour,
      });
      y -= 4;

      // Decorative underline for headings
      const headingWidth = boldFont.widthOfTextAtSize(headingText, headingSize);
      if (styleConfig.decorativeElements) {
        page.drawLine({
          start: { x: margin, y: y },
          end: { x: margin + Math.min(headingWidth + 10, contentWidth), y: y },
          thickness: 1.5,
          color: accentColour,
        });
      } else {
        page.drawLine({
          start: { x: margin, y: y },
          end: { x: margin + Math.min(headingWidth, contentWidth), y: y },
          thickness: 0.75,
          color: ruleLine,
        });
      }
      y -= styleConfig.sectionGap;

    } else if (block.type === 'subheading') {
      // Widow/orphan check for subheadings too
      const nextBlock = blocks[blockIndex + 1];
      const nextHeight = nextBlock ? estimateBlockHeight(nextBlock) : 0;
      const combinedHeight = blockHeight + nextHeight;
      const remainingSpace = y - margin;

      if (y < minSectionStart || remainingSpace < combinedHeight) {
        page = pdfDoc.addPage(PageSizes.A4);
        y = pageHeight - margin;
      }

      page.drawText(block.text, {
        x: margin,
        y: y,
        size: 10.5,
        font: boldFont,
        color: secondaryColour,
      });
      y -= 16;

    } else if (block.type === 'clause') {
      // Numbered clause like "1.1. Something"
      const lines = wrapText(block.text, font, fontSize, contentWidth - 24);
      for (let i = 0; i < lines.length; i++) {
        if (y < margin + 20) {
          page = pdfDoc.addPage(PageSizes.A4);
          y = pageHeight - margin;
        }
        page.drawText(lines[i], {
          x: margin + 24,
          y: y,
          size: fontSize,
          font: font,
          color: bodyText,
        });
        y -= lineHeight;
      }
      y -= 4;

    } else if (block.type === 'bullet') {
      const lines = wrapText(block.text, font, fontSize, contentWidth - 36);
      for (let i = 0; i < lines.length; i++) {
        if (y < margin + 20) {
          page = pdfDoc.addPage(PageSizes.A4);
          y = pageHeight - margin;
        }
        if (i === 0) {
          // Draw bullet with brand accent colour
          page.drawText('\u2022', {
            x: margin + 12,
            y: y,
            size: fontSize,
            font: font,
            color: accentColour,
          });
        }
        page.drawText(lines[i], {
          x: margin + 36,
          y: y,
          size: fontSize,
          font: font,
          color: bodyText,
        });
        y -= lineHeight;
      }
      y -= 2;

    } else {
      // Regular paragraph
      const lines = wrapText(block.text, font, fontSize, contentWidth);
      for (const line of lines) {
        if (y < margin + 20) {
          page = pdfDoc.addPage(PageSizes.A4);
          y = pageHeight - margin;
        }
        page.drawText(line, {
          x: margin,
          y: y,
          size: fontSize,
          font: font,
          color: bodyText,
        });
        y -= lineHeight;
      }
      y -= 6;
    }
  }

  // ── Footer on each page ──
  const pages = pdfDoc.getPages();
  const dateStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  for (let i = 0; i < pages.length; i++) {
    const p = pages[i];
    const footerY = 36;

    // Footer line
    p.drawLine({
      start: { x: margin, y: footerY + 14 },
      end: { x: pageWidth - margin, y: footerY + 14 },
      thickness: 0.5,
      color: ruleLine,
    });

    // Foundationary branding in footer
    p.drawText('Generated by Foundationary', {
      x: margin,
      y: footerY,
      size: smallFontSize,
      font: italicFont,
      color: lightText,
    });

    // Page number
    const pageStr = `Page ${i + 1} of ${pages.length}`;
    const pageStrWidth = font.widthOfTextAtSize(pageStr, smallFontSize);
    p.drawText(pageStr, {
      x: pageWidth - margin - pageStrWidth,
      y: footerY,
      size: smallFontSize,
      font: font,
      color: lightText,
    });

    // Date in centre
    const dateWidth = font.widthOfTextAtSize(dateStr, smallFontSize);
    p.drawText(dateStr, {
      x: (pageWidth - dateWidth) / 2,
      y: footerY,
      size: smallFontSize,
      font: font,
      color: lightText,
    });

    // Bottom decorative bar on last page
    if (i === pages.length - 1 && (styleConfig.decorativeElements || styleConfig.cornerAccent)) {
      p.drawRectangle({
        x: 0,
        y: 0,
        width: pageWidth,
        height: 4,
        color: primaryColour,
      });
    }
  }

  return pdfDoc.save();
}

// ── Professional DOCX Generation ──

async function generateDocx(
  text: string,
  documentLabel: string,
  businessName: string,
  design: ClientDesign
): Promise<Uint8Array> {
  const blocks = parseTextToBlocks(text);
  const dateStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  // Parse brand colours
  const colours = parseBrandColours(design.brandColours);
  const primaryHex = colours.primary.replace('#', '');
  const secondaryHex = colours.secondary.replace('#', '');
  const accentHex = colours.accent.replace('#', '');

  // Get visual style config
  const styleConfig = getVisualStyleConfig(design.visualStyle);

  const displayName = design.brandIdentity === 'My personal name is the brand — I want documents to feel personal'
    ? `${design.firstName || businessName}`
    : businessName;

  const children: Paragraph[] = [];

  // Title
  children.push(new Paragraph({
    children: [new TextRun({ text: documentLabel, bold: true, size: 44, font: 'Calibri', color: primaryHex })],
    alignment: AlignmentType.CENTER,
    spacing: { after: 100 },
  }));

  // Subtitle
  children.push(new Paragraph({
    children: [new TextRun({ text: `Prepared for ${displayName}`, italics: true, size: 20, font: 'Calibri', color: '737373' })],
    alignment: AlignmentType.CENTER,
    spacing: { after: 50 },
  }));

  children.push(new Paragraph({
    children: [new TextRun({ text: 'Foundationary', size: 18, font: 'Calibri', color: '737373' })],
    alignment: AlignmentType.CENTER,
    spacing: { after: 200 },
  }));

  // Horizontal rule with brand colour
  children.push(new Paragraph({
    border: { bottom: { style: BorderStyle.SINGLE, size: styleConfig.decorativeElements ? 12 : 6, color: primaryHex } },
    spacing: { after: 400 },
  }));

  // Content blocks
  for (const block of blocks) {
    if (block.type === 'heading') {
      const isMainHeading = block.level === 1;
      children.push(new Paragraph({
        children: [new TextRun({
          text: block.text,
          bold: true,
          size: isMainHeading ? 28 : 24,
          font: 'Calibri',
          color: isMainHeading ? primaryHex : secondaryHex,
        })],
        heading: isMainHeading ? HeadingLevel.HEADING_2 : HeadingLevel.HEADING_3,
        spacing: { before: isMainHeading ? 360 : 240, after: 120 },
        border: {
          bottom: {
            style: styleConfig.decorativeElements ? BorderStyle.SINGLE : BorderStyle.NONE,
            size: styleConfig.decorativeElements ? 4 : 0,
            color: accentHex,
          },
        },
      }));
    } else if (block.type === 'subheading') {
      children.push(new Paragraph({
        children: [new TextRun({ text: block.text, bold: true, size: 22, font: 'Calibri', color: secondaryHex })],
        heading: HeadingLevel.HEADING_4,
        spacing: { before: 200, after: 80 },
      }));
    } else if (block.type === 'clause') {
      children.push(new Paragraph({
        children: [new TextRun({ text: block.text, size: 20, font: 'Calibri', color: '262626' })],
        spacing: { after: 80 },
        indent: { left: 480 },
      }));
    } else if (block.type === 'bullet') {
      children.push(new Paragraph({
        children: [
          new TextRun({ text: '\u2022  ', size: 20, font: 'Calibri', color: accentHex }),
          new TextRun({ text: block.text, size: 20, font: 'Calibri', color: '262626' }),
        ],
        spacing: { after: 40 },
        indent: { left: 720 },
      }));
    } else {
      children.push(new Paragraph({
        children: [new TextRun({ text: block.text, size: 20, font: 'Calibri', color: '262626' })],
        spacing: { after: 120 },
      }));
    }
  }

  // Footer section
  children.push(new Paragraph({
    border: { top: { style: BorderStyle.SINGLE, size: 4, color: primaryHex } },
    spacing: { before: 600 },
  }));
  children.push(new Paragraph({
    children: [new TextRun({ text: `Generated by Foundationary | ${dateStr}`, italics: true, size: 16, font: 'Calibri', color: '888888' })],
    alignment: AlignmentType.CENTER,
  }));
  children.push(new Paragraph({
    children: [new TextRun({ text: 'This document was AI-generated and should be reviewed by a qualified professional before use.', italics: true, size: 16, font: 'Calibri', color: '888888' })],
    alignment: AlignmentType.CENTER,
  }));

  const doc = new DocxDocument({
    sections: [{
      properties: {
        page: {
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
        },
      },
      children,
    }],
  });

  const buffer = await Packer.toBuffer(doc);
  return new Uint8Array(buffer);
}

// ── Main Handler ──

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { user_id, document_type, generate_files } = body;

    if (!user_id || !document_type) {
      return new Response(
        JSON.stringify({ error: 'Missing user_id or document_type' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const config = DOCUMENT_CONFIGS[document_type];
    if (!config) {
      return new Response(
        JSON.stringify({ error: `Unknown document type: ${document_type}. Valid types: ${Object.keys(DOCUMENT_CONFIGS).join(', ')}` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Fetch client design preferences (used by both modes)
    const { data: intakeData } = await supabase
      .from('intake_responses')
      .select('responses')
      .eq('user_id', user_id)
      .maybeSingle();

    const r = intakeData?.responses || {};
    const design: ClientDesign = {
      businessName: r.q2_business_name || 'Unknown Business',
      legalName: r.q1_legal_name || '',
      firstName: r.q55_first_name || '',
      brandColours: r.q67_brand_colours || '',
      visualStyle: r.q68_visual_style || 'Simple — I just want it to work',
      toneOfVoice: r.q62_tone_of_voice || [],
      brandIdentity: r.q64_brand_identity || '',
      jurisdiction: r.q5_jurisdiction || 'England & Wales',
      documentEmail: r.q7_document_email || '',
      businessPhone: r.q8_business_phone || '',
      businessAddress: r.q6_business_address || '',
      websiteUrl: r.q10_website_url || '',
    };

    // ── Mode 1: Generate text via Gemini (initial generation) ──
    if (!generate_files) {
      // Set status to 'generating'
      const { data: existingDoc } = await supabase
        .from('generated_documents')
        .select('id')
        .eq('client_id', user_id)
        .eq('document_type', document_type)
        .maybeSingle();

      if (existingDoc) {
        await supabase
          .from('generated_documents')
          .update({ status: 'generating', error_message: null, content_text: null, content_html: null })
          .eq('id', existingDoc.id);
      } else {
        await supabase
          .from('generated_documents')
          .insert({
            client_id: user_id,
            document_type,
            document_label: getDocumentLabel(document_type),
            status: 'generating',
          });
      }

      // Fetch the client brief
      const { data: briefData, error: briefError } = await supabase
        .from('client_briefs')
        .select('brief_content')
        .eq('client_id', user_id)
        .maybeSingle();

      if (briefError || !briefData?.brief_content) {
        const errMsg = briefError?.message || 'No client brief found. Generate the Master Brief first before generating documents.';
        await supabase
          .from('generated_documents')
          .update({ status: 'failed', error_message: errMsg })
          .eq('client_id', user_id)
          .eq('document_type', document_type);
        return new Response(
          JSON.stringify({ error: errMsg }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Call Gemini API
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${config.model}:generateContent?key=${config.apiKey}`;

      const userMessage = `Here is the client's Master Brief:\n\n${briefData.brief_content}\n\nBased on this brief, please generate the document as instructed in your system prompt.`;

      let contentText: string;

      try {
        const geminiResponse = await fetch(geminiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system_instruction: {
              parts: [{ text: config.systemPrompt }],
            },
            contents: [{
              role: 'user',
              parts: [{ text: userMessage }],
            }],
            generationConfig: {
              temperature: 0.3,
              maxOutputTokens: 16000,
            },
          }),
        });

        if (!geminiResponse.ok) {
          const errText = await geminiResponse.text();
          console.error(`Gemini API error (${document_type}):`, geminiResponse.status, errText);
          throw new Error(`Gemini API returned ${geminiResponse.status}: ${errText.substring(0, 300)}`);
        }

        const geminiData = await geminiResponse.json();

        if (geminiData.candidates?.[0]?.content?.parts?.[0]?.text) {
          contentText = geminiData.candidates[0].content.parts[0].text;
        } else {
          console.error('Unexpected Gemini response structure:', JSON.stringify(geminiData).substring(0, 500));
          throw new Error('No text content in Gemini response');
        }
      } catch (apiErr: any) {
        console.error(`Document generation failed for ${document_type}:`, apiErr.message);
        await supabase
          .from('generated_documents')
          .update({ status: 'failed', error_message: apiErr.message })
          .eq('client_id', user_id)
          .eq('document_type', document_type);
        return new Response(
          JSON.stringify({ error: apiErr.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Convert to HTML (also strips markdown)
      const contentHtml = textToHtml(contentText, getDocumentLabel(document_type), design);

      // Save text and HTML to database
      const { error: updateError } = await supabase
        .from('generated_documents')
        .update({
          status: 'completed',
          content_text: contentText,
          content_html: contentHtml,
          api_key_used: config.apiKey.substring(0, 10) + '...',
          model_used: config.model,
          generated_at: new Date().toISOString(),
        })
        .eq('client_id', user_id)
        .eq('document_type', document_type);

      if (updateError) {
        console.error('Failed to save document:', updateError);
        await supabase
          .from('generated_documents')
          .update({ status: 'failed', error_message: updateError.message })
          .eq('client_id', user_id)
          .eq('document_type', document_type);
        return new Response(
          JSON.stringify({ error: updateError.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ success: true, status: 'completed', document_type }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // ── Mode 2: Generate PDF and DOCX from existing text (after admin review) ──
    const { data: docData, error: docError } = await supabase
      .from('generated_documents')
      .select('id, content_text, document_label')
      .eq('client_id', user_id)
      .eq('document_type', document_type)
      .maybeSingle();

    if (docError || !docData?.content_text) {
      return new Response(
        JSON.stringify({ error: 'No text content found. Generate the document text first.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const label = docData.document_label || getDocumentLabel(document_type);

    // Generate PDF with client design preferences
    const pdfBytes = await generatePdf(docData.content_text, label, design.businessName, design);
    const pdfPath = `${user_id}/${document_type}.pdf`;
    const { error: pdfUploadError } = await supabase.storage
      .from('generated-documents')
      .upload(pdfPath, pdfBytes, { contentType: 'application/pdf', upsert: true });

    if (pdfUploadError) {
      console.error('PDF upload error:', pdfUploadError);
      return new Response(
        JSON.stringify({ error: `PDF upload failed: ${pdfUploadError.message}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate DOCX with client design preferences
    const docxBytes = await generateDocx(docData.content_text, label, design.businessName, design);
    const docxPath = `${user_id}/${document_type}.docx`;
    const { error: docxUploadError } = await supabase.storage
      .from('generated-documents')
      .upload(docxPath, docxBytes, { contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', upsert: true });

    if (docxUploadError) {
      console.error('DOCX upload error:', docxUploadError);
      return new Response(
        JSON.stringify({ error: `DOCX upload failed: ${docxUploadError.message}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Update database with file paths
    const { error: updateError } = await supabase
      .from('generated_documents')
      .update({
        pdf_path: pdfPath,
        docx_path: docxPath,
        files_generated_at: new Date().toISOString(),
      })
      .eq('id', docData.id);

    if (updateError) {
      console.error('Failed to update file paths:', updateError);
    }

    return new Response(
      JSON.stringify({ success: true, status: 'files_generated', document_type, pdf_path: pdfPath, docx_path: docxPath }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Generate document error:', error.message);
    return new Response(
      JSON.stringify({ error: error.message || 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// ── Helpers ──

function getDocumentLabel(type: string): string {
  const labels: Record<string, string> = {
    terms_and_conditions: 'Terms and Conditions',
    bespoke_client_contract: 'Bespoke Client Contract',
    gdpr_privacy_policy: 'GDPR Privacy Policy',
    professional_bio: 'Professional Bio',
    linkedin_script: 'LinkedIn Script',
    elevator_pitch: 'Elevator Pitch - 3 Versions',
    professional_invoice_template: 'Professional Invoice Template',
    welcome_email: 'New Client Welcome Email - 3 Versions',
    late_payment_letters: 'Late Payment Letters - 3 Versions',
  };
  return labels[type] || type;
}

function textToHtml(text: string, documentLabel: string, design: ClientDesign): string {
  // First strip all markdown from the text
  const cleaned = stripMarkdown(text);

  // Then escape HTML entities
  const escaped = cleaned
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  const colours = parseBrandColours(design.brandColours);
  const styleConfig = getVisualStyleConfig(design.visualStyle);

  const displayName = design.brandIdentity === 'My personal name is the brand — I want documents to feel personal'
    ? `${design.firstName || design.businessName}`
    : design.businessName;

  const formatted = escaped
    .replace(/===\s*(.+?)\s*===/g, `<h2 style="font-size:16px;font-weight:700;margin:24px 0 12px;color:${colours.primary};border-bottom:2px solid ${colours.accent};padding-bottom:6px;">$1</h2>`)
    .replace(/^(\d+(?:\.\d+)*)\.\s+(.+)$/gm, '<p style="margin:8px 0;padding-left:24px;text-indent:-24px;"><strong>$1.</strong> $2</p>')
    .replace(/^[-]\s+(.+)$/gm, `<p style="margin:4px 0 4px 24px;"><span style="color:${colours.accent};">\u2022</span> $1</p>`)
    .replace(/\n\n/g, '</p><p style="margin:8px 0;">')
    .replace(/\n/g, '<br>');

  const borderStyle = styleConfig.borderStyle === 'double'
    ? `border-bottom: 3px double ${colours.primary};`
    : styleConfig.borderStyle === 'solid'
    ? `border-bottom: 3px solid ${colours.primary};`
    : styleConfig.borderStyle === 'accent'
    ? `border-bottom: 1px solid ${colours.secondary}; border-left: 4px solid ${colours.accent}; padding-left: 8px;`
    : `border-bottom: 1px solid #ccc;`;

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  @page { margin: 2.5cm; size: A4; }
  body { font-family: 'Georgia', 'Times New Roman', serif; font-size: 12pt; line-height: 1.6; color: #1a1a2e; max-width: 700px; margin: 0 auto; padding: 40px 0; }
  h1 { font-size: 22pt; font-weight: 700; margin: 0 0 8px; color: ${colours.primary}; }
  h2 { font-size: 14pt; font-weight: 700; margin: 24px 0 12px; color: ${colours.primary}; border-bottom: 2px solid ${colours.accent}; padding-bottom: 6px; }
  p { margin: 8px 0; }
  .header { text-align: center; margin-bottom: 40px; ${borderStyle} padding-bottom: 20px; }
  .header h1 { margin-bottom: 4px; }
  .header .subtitle { font-size: 10pt; color: #555; }
  .footer { margin-top: 60px; padding-top: 16px; border-top: 1px solid ${colours.primary}; font-size: 9pt; color: #888; text-align: center; }
</style>
</head>
<body>
<div class="header">
  <h1>${documentLabel}</h1>
  <div class="subtitle">Prepared for ${displayName} | Foundationary</div>
</div>
<div style="margin-top:20px;">
${formatted}
</div>
<div class="footer">
  Generated by Foundationary | ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}<br>
  This document was AI-generated and should be reviewed by a qualified professional before use.
</div>
</body>
</html>`;
}
