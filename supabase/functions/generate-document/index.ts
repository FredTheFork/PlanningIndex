import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.49.1';
import { PDFDocument, StandardFonts, rgb, PageSizes } from 'npm:pdf-lib@1.17.1';
import { Document as DocxDocument, Paragraph, TextRun, HeadingLevel, Packer, AlignmentType, BorderStyle, TabStopPosition, TabStopType, Header, Footer, PageNumber, NumberFormat } from 'npm:docx@9.1.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

// ── Document Type Configuration ──

interface DocumentConfig {
  apiKey: string;
  model: string;
  systemPrompt: string;
}

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
   - PlanningIndex pre-existing IP (PlanningIndex retains templates, methodologies)
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
   - Limitation cap: Total liability ≤ fees paid in preceding 12 months
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
- Tables are acceptable and useful (e.g., pricing structure, service breakdown)
- Each clause must be complete and self-contained
- Assume this is a final, deliver-ready document

DOCUMENT QUALITY:
- Length: 3000-4500 words (comprehensive but concise)
- Structure: Logical flow from formation to termination
- Language: Professional, precise, accessible to business owners (not overly legalistic)
- Completeness: No missing sections, no cut-off text

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
- Every clause must be detailed and complete

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
   - Automated collection (cookies, analytics) - state "we use [specify] cookies" or "we do not use cookies"
   - Third parties (payment processors, social media platforms mentioned in brief)

5. LEGAL BASIS FOR PROCESSING (Article 6 UK GDPR)
   - Contract performance (services provision)
   - Legal obligation (tax, accounting)
   - Legitimate interests (business administration, relationship management, fraud prevention)
   - Explicit consent (marketing)
   - Create a detailed table:
     | Purpose | Data Types | Legal Basis | Retention |

6. HOW WE USE YOUR DATA (PURPOSES - DETAILED)
   - Service provision (fulfill contract)
   - Communication (send updates, confirmations)
   - Billing & payment processing
   - Administration & legal compliance
   - Marketing (WITH consent note)
   - Research & improvement
   - Fraud detection and security
   - Any other specific purpose from the brief

7. WHO WE SHARE DATA WITH (THIRD PARTIES)
   - Payment processors (Stripe - explicitly named)
   - Email service providers (Mailchimp if mentioned in brief)
   - Cloud storage (Google Drive, CRM platforms from brief)
   - Web hosting (SiteGround if mentioned)
   - Professional advisors (accountants, lawyers - no data shared unless required)
   - Law enforcement (if legally required)
   - NO sharing for marketing purposes without consent

8. INTERNATIONAL TRANSFERS
   - State whether data is transferred outside UK
   - If yes, describe safeguards (Standard Contractual Clauses, etc.)
   - If no, state clearly

9. DATA RETENTION (HOW LONG WE KEEP DATA)
   - General retention period (e.g., "1 year after service ends")
   - Service data: retained during engagement + [X] years after
   - Financial data: as required by tax law (typically 6 years)
   - Marketing data: until consent withdrawn
   - Clear, specific periods

10. DATA SUBJECT RIGHTS (Article 15-22 UK GDPR)
    - Right of access (request what data we hold)
    - Right to rectification (correct inaccurate data)
    - Right to erasure ("right to be forgotten")
    - Right to restrict processing
    - Right to data portability (receive in machine-readable format)
    - Right to object (marketing, processing on legitimate interests)
    - Rights related to automated decision-making
    - How to exercise rights (email, contact form)
    - Response timeline (30 days)

11. COOKIES POLICY
    - If cookies are used: specify types (essential, analytics, marketing)
    - Cookie names and purposes
    - How to manage/refuse cookies
    - Explicit consent for non-essential cookies
    - OR if NO cookies: clearly state "We do not use cookies"

12. MARKETING & COMMUNICATIONS
    - How we send marketing (email via Mailchimp, etc.)
    - Consent requirements
    - Unsubscribe link in every email
    - Right to withdraw consent anytime
    - Frequency of communications

13. SECURITY & DATA PROTECTION
    - Measures we take (encryption, access controls, staff training)
    - Servers/storage locations (Google Drive, SiteGround, etc.)
    - Data breach notification (notify within 72 hours if required)
    - Limitations: no system is 100% secure

14. CHILDREN'S DATA
    - State we do not intentionally collect data from children <13
    - If you provide child's data, we will delete it
    - Parental consent requirements

15. THIRD-PARTY LINKS & SERVICES
    - We are not responsible for third-party privacy policies
    - Link to their privacy policies (Google, Facebook, Stripe, etc.)

16. CHANGES TO THIS POLICY
    - We may update this policy
    - Will notify of material changes
    - Continued use = acceptance

17. YOUR RIGHTS & COMPLAINTS
    - Contact us with any questions or requests
    - Right to lodge complaint with ICO (Information Commissioner's Office)
    - ICO contact details
    - Contact us first; we'll try to resolve

18. CONTACT INFORMATION
    - Full contact details
    - Email, phone, address
    - Data Protection Officer (if applicable)

CRITICAL REQUIREMENTS:

- Compliant with UK GDPR and Data Protection Act 2018
- Use client's SPECIFIC business details from brief
- EXPLICITLY reference specific tools they use (Stripe, Mailchimp, Google Drive, CRM names, etc.)
- Use current date (May 2026)
- NO placeholder text, NO [REVIEW] markers, NO generic copy
- Tables for clarity (data types vs. legal basis vs. retention)
- Specific retention periods (not vague "as long as necessary")
- Address their ACTUAL data practices from the brief
- Length: 2500-3500 words
- Every section must be complete and specific

Generate the document now.`,
  },

  professional_bio: {
    apiKey: 'AIzaSyCiKbp7qJhnXaAxi3MFkdQhh4bK-opcwEQ',
    model: 'gemini-2.5-flash',
    systemPrompt: `You are a professional copywriter specializing in personal branding for small business owners.

Your task: Generate compelling professional bio content using the client's brand voice and story from the brief.

DELIVERABLES (3 VERSIONS):

1. SHORT BIO (50 words)
   - One punchy paragraph
   - Name, what they do, who they help
   - Key differentiator or achievement
   - Call-to-action implicit (how to engage)
   - Suitable for: Email signatures, LinkedIn headline, Twitter bio, brief form fields

2. MEDIUM BIO (150 words)
   - 2-3 paragraphs
   - Their origin story / why they started
   - What they do and for whom
   - Their approach/philosophy
   - Key achievement or result
   - Suitable for: Website "About" page sidebar, PDF proposals, social media bios

3. LONG BIO (300-400 words)
   - 4-5 well-structured paragraphs
   - Background and journey to current business
   - The problem they solve
   - Their services and specialisms
   - Philosophy and approach
   - Results/impact (specific examples from brief if available)
   - Call-to-action (how clients can engage)
   - Suitable for: Full "About" page, guest speaker bios, detailed proposals, media kit

CRITICAL REQUIREMENTS:

- Use client's SPECIFIC business name, location, target audience from brief
- Match the brand voice from the brief (e.g., professional, warm, energetic, technical, etc.)
- Include their EXACT services/specialisms
- Highlight their UNIQUE differentiator
- Use ACTIVE, engaging language
- NO jargon unless aligned with their industry
- Personal touch (mention founder if single-person business)
- Results-oriented (how they help clients achieve outcomes)
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
[bio here]

Generate all three versions now.`,
  },

  linkedin_script: {
    apiKey: 'AIzaSyCh_PHT3_4GKJAaDbHt2XGZdVdxBB7Jgok',
    model: 'gemini-2.5-flash',
    systemPrompt: `You are an expert LinkedIn strategist and copywriter specializing in optimizing profiles for small business owners.

Your task: Generate a complete LinkedIn profile "script" using the client's business details from the brief.

DELIVERABLES (ALL FIELDS, READY TO COPY-PASTE):

1. HEADLINE (120 characters max - state the limit)
   - Keyword-rich
   - Includes: what they do + who they serve + key benefit
   - Example structure: "Planning Application Lead Generation | Social Media Management | [Tagline]"
   - Avoid: Generic titles, excessive hashtags

2. ABOUT/SUMMARY SECTION (2600 characters max - state the limit)
   - Opens with hook (who they serve, what problem they solve)
   - 2-3 paragraphs covering:
     * Their story/background
     * What they do (all services from brief)
     * Who they serve (target clients)
     * Unique approach/differentiator
     * Key results/achievements
   - Includes: industry keywords, specific service names
   - Calls out target audience explicitly
   - Ends with clear CTA (how to connect, how to inquire)
   - Formatted with line breaks for readability
   - LinkedIn recognizes multiple line breaks

3. EXPERIENCE SECTION GUIDANCE
   - Current role title suggestion
   - Bullet points for key responsibilities (each service as one bullet)
   - Include keywords for searchability
   - Metrics/results where applicable

4. SPECIALTIES/SKILLS SECTION
   - List of skills to add (searchable keywords)
   - Include service names, tools, industry terms
   - 10-15 key skills

5. BANNER TEXT SUGGESTION
   - Short tagline/visual text for LinkedIn banner
   - Reinforces unique value proposition
   - Example: "[Service Name] | [Target Market] | [Key Benefit]"

6. HASHTAG RECOMMENDATIONS
   - 5-10 relevant hashtags for posts/engagement
   - Include industry, service, target audience hashtags

7. POST CADENCE RECOMMENDATION
   - Suggested posting frequency
   - Types of content to share (case studies, tips, industry insights, etc.)

CRITICAL REQUIREMENTS:

- Use client's EXACT business name and details from brief
- Include ALL services they offer
- Use the BRAND VOICE from their brief
- Keyword optimization for searchability (planningindex, planning applications, lead generation, etc.)
- State character limits where applicable
- Format with clear labels so they can copy each section
- SPECIFIC to their industry and target audience
- Actionable and ready to implement
- Length: 1500-2000 words total
- NO placeholder text, NO [REVIEW] sections

Generate the complete LinkedIn profile script now.`,
  },

  elevator_pitch: {
    apiKey: 'AIzaSyD7DTWfXH0p1Z3krq07XbrcWITv_9vHR6c',
    model: 'gemini-2.5-flash',
    systemPrompt: `You are a professional speechwriter and pitch coach specializing in crafting compelling elevator pitches.

Your task: Generate three versions of an elevator pitch for the client's business from their brief.

DELIVERABLES (3 VERSIONS WITH CLEAR TIMING):

1. 15-SECOND PITCH (40-45 words)
   - Opening hook (who you are / what you do)
   - Problem statement (what pain point you solve)
   - Solution (what you do, briefly)
   - Call-to-action (next step, how to connect)
   - USE CASE: Quick greeting, networking event hallway conversation, phone pitch opener
   - Pacing note: Aim for ~170 words/min speaking pace

2. 30-SECOND PITCH (75-85 words)
   - Expanded version of 15-second
   - Hook + problem + solution + brief benefit
   - One specific example or result
   - Clear CTA with contact method
   - USE CASE: Elevator pitch, networking events, podcast intro, initial client call
   - Include: Target audience name, key service, main benefit

3. 60-SECOND PITCH (140-160 words)
   - Full narrative arc
   - Story element (why they started / background)
   - The problem they solve (specific pain)
   - Their solution (detailed approach)
   - Results/impact (specific examples from brief or typical outcomes)
   - Why they're different (differentiator)
   - Clear next steps/CTA
   - USE CASE: Sales call, webinar intro, speaking engagement, detailed pitch
   - Can include: Client case study, specific metric, testimonial hint

CRITICAL REQUIREMENTS:

- Use client's SPECIFIC business name and services from brief
- Match their EXACT brand voice (professional, casual, technical, etc.)
- Focus on TARGET AUDIENCE from brief (who they help)
- Include their MAIN DIFFERENTIATOR
- Use ACTIVE, confident language
- Avoid jargon unless it resonates with their audience
- Each pitch stands alone (client can use any version)
- Conversational tone (written as if spoken)
- Clear CTAs (email, phone, website, meeting request)
- NO placeholder text, NO [REVIEW] markers
- State the word count and timing for each version
- Client can practice reading each aloud
- Length: Total 300-400 words across all three

Format clearly:

=== 15-SECOND PITCH (40-45 words, ~15 seconds at natural speaking pace) ===
[pitch text]

=== 30-SECOND PITCH (75-85 words, ~30 seconds at natural speaking pace) ===
[pitch text]

=== 60-SECOND PITCH (140-160 words, ~60 seconds at natural speaking pace) ===
[pitch text]

Generate all three pitches now.`,
  },

  professional_invoice_template: {
    apiKey: 'AIzaSyCmmp_14EZUTNYxAvUbdv3sJZVyc0z3tlw',
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
   - Tax ID / VAT number (if registered, or state "Not VAT registered")

2. INVOICE DETAILS (TOP RIGHT)
   - Invoice number placeholder: "INV-[YYYY]-[####]"
   - Invoice date placeholder: "Date: _____________"
   - Due date placeholder: "Due date: _____________"

3. "BILL TO" SECTION (BELOW HEADER)
   - Placeholder fields for client name, company, address, email, phone
   - Clear labels for readability

4. LINE ITEMS TABLE (CENTER)
   Columns:
   - Description of service/product
   - Quantity
   - Unit price
   - Total
   - Footer note: "You may add/remove rows as needed"
   - Include 3-5 blank sample rows

5. SUBTOTAL & CALCULATIONS
   - Subtotal calculation
   - If applicable: VAT/Tax calculation (even if 0%, show clearly)
   - Any discounts (if they offer them, with placeholder)
   - Total amount due (PROMINENT)

6. PAYMENT TERMS & BANKING DETAILS (BELOW TOTAL)
   - Payment deadline (from brief, e.g., "Due within 7 days")
   - Payment method(s) accepted (Stripe, bank transfer, cash, etc. from brief)
   - If bank transfer: Account holder name, sort code, account number (REDACTED for template)
   - Bank name and address
   - Payment reference format (e.g., "Use invoice number as reference")
   - If Stripe: Link or instruction

7. LATE PAYMENT CLAUSE (MANDATORY)
   - State: "Late payment interest will be charged at [X]% per annum above the Bank of England base rate per the Late Payment of Commercial Debts (Interest) Act 1998"
   - Grace period (if any)
   - Suspension of services clause (if applicable)

8. NOTES/ADDITIONAL TERMS (OPTIONAL SECTION)
   - Space for any additional terms, notes, or conditions
   - E.g., service delivery timeline, deposit already paid, refund policy reference

9. FOOTER
   - Contact information (reiterate email/phone)
   - Thank you message
   - Company website
   - Optional: "Please retain this invoice for your records"

10. PROFESSIONAL FORMATTING
    - Clear hierarchy (headings, sections)
    - Adequate white space
    - Professional font (Arial, Calibri, or similar)
    - All numbers aligned (right-aligned for clarity)
    - Date format: DD Month YYYY (UK standard, e.g., "15 May 2026")
    - Currency: £ (GBP)

CRITICAL REQUIREMENTS:

- Use client's SPECIFIC business details from brief
- Include their EXACT payment terms (e.g., "7 days" from brief)
- Include their EXACT payment methods (Stripe, bank transfer, etc.)
- Show VAT calculation clearly (even if 0%, as they're not VAT registered)
- Reference their late payment interest policy from brief
- Deposit/advance payment note (if they require deposits)
- Ready to copy and reuse (all variable fields marked with underscores or brackets)
- Professional, clean layout
- UK compliant (Late Payment act, date format, currency, terms)
- Multiple blank rows for line items (2026 may vary by client, show flexibility)
- NO placeholder text like [INSERT], use underscores or blanks
- Include guidance notes in italics if needed
- Suitable for printing or PDF export
- Length: ~500-800 words when rendered

Format as a template that can be copied into Word/Google Docs:

=== PROFESSIONAL INVOICE TEMPLATE ===
[Full template with all sections]

Generate the complete invoice template now.`,
  },

  welcome_email: {
    apiKey: 'AIzaSyAV_L0-QKvaZ4y6z8-3ZFT5r5Wa1pExBXA',
    model: 'gemini-2.5-flash',
    systemPrompt: `You are an expert email copywriter specializing in client onboarding and first-impression communication.

Your task: Generate three versions of a New Client Welcome Email for the client using their business details from the brief.

DELIVERABLES (3 COMPLETE EMAIL VERSIONS):

1. FORMAL & PROFESSIONAL VERSION
   - Suitable for: B2B, corporate clients, legal/financial services
   - Tone: Professional, structured, reassuring
   - Structure:
     * Subject line suggestion
     * Formal greeting
     * Welcome statement (thank them for choosing you)
     * Brief overview of their engagement (reference their service)
     * What happens next (timeline, next steps)
     * Payment expectations (when invoice due, methods, etc.)
     * Key contacts and support info
     * Link to terms/privacy policy
     * Professional closing

2. WARM & FRIENDLY VERSION
   - Suitable for: Creative services, coaching, personal brand
   - Tone: Warm, personable, encouraging, approachable
   - Structure:
     * Subject line suggestion (casual/warm)
     * Informal greeting (using first name if appropriate)
     * Personal welcome (show genuine enthusiasm)
     * What they can expect (timeline, communication)
     * Your commitment to their success
     * Quick overview of the service (without jargon)
     * When to expect deliverables
     * How to communicate (email, phone, availability)
     * A bit of personality (maybe reference to why you do this work)
     * Warm closing with name

3. BRIEF & ACTION-ORIENTED VERSION
   - Suitable for: Busy entrepreneurs, fast-paced industries
   - Tone: Direct, efficient, results-focused
   - Structure:
     * Subject line suggestion (action-oriented)
     * Quick greeting
     * Confirmation of engagement (what service, cost, timeline)
     * Next immediate action (what they need to do by when)
     * Key dates/milestones (bullet points)
     * Contact for questions (direct, quick)
     * Brief signoff

CRITICAL REQUIREMENTS FOR ALL VERSIONS:

- Use client's SPECIFIC business name (e.g., "PlanningIndex")
- Reference their EXACT service(s) from the brief
- Include SPECIFIC payment details if applicable (e.g., "Invoice to follow within 24 hours; due within 7 days")
- Include their CONTACT DETAILS (email, phone, website)
- Set clear expectations (timeline, communication frequency, deliverables)
- Thank them for their business
- Mention any next steps CLEARLY (what they need to do, if anything)
- Include link to terms, privacy policy, or relevant documentation
- Suggest subject lines for each version
- Match their BRAND VOICE from the brief
- Ready to send with minimal customization (only client name, specific project details)
- Professional but appropriate tone for their industry
- Length: 150-250 words each (email-appropriate)
- NO placeholder text, NO [REVIEW] markers
- Include one subtle personalization opportunity (reference their service or industry)

Format clearly:

=== EMAIL VERSION 1: FORMAL & PROFESSIONAL ===
**Subject line suggestion:** [subject]
[Email body]

=== EMAIL VERSION 2: WARM & FRIENDLY ===
**Subject line suggestion:** [subject]
[Email body]

=== EMAIL VERSION 3: BRIEF & ACTION-ORIENTED ===
**Subject line suggestion:** [subject]
[Email body]

Generate all three email versions now.`,
  },

  late_payment_letters: {
    apiKey: 'AIzaSyC3QNfx7IW2uVE6Lwic0OEx9DuJFJsr8tc',
    model: 'gemini-2.5-flash',
    systemPrompt: `You are an expert legal document specialist in UK debt collection and commercial law.

Your task: Generate three increasingly firm late payment reminder letters for the client's business.

DELIVERABLES (3 LETTERS - PROGRESSION OF FIRMNESS):

LETTER 1: FRIENDLY REMINDER (7 DAYS OVERDUE)
- Tone: Professional, understanding, assumptive (assume it's an oversight)
- Purpose: Gentle reminder; give them a chance to pay without friction
- Structure:
  * Formal letter header with date placeholder
  * "Dear [Client Name],"
  * Opening: "We hope this is a friendly reminder..." or "We wanted to follow up..."
  * Invoice details: number, date, amount
  * Due date that has passed
  * Suggest it may be an oversight
  * Request immediate payment
  * Payment instructions (bank details, Stripe link, reference number format)
  * Grace period: "Please settle by [DATE - typically 7 days from this letter]"
  * Warm closing
  * Signature line with business contact

LETTER 2: FIRM REMINDER (14 DAYS OVERDUE)
- Tone: Professional, firm, business-like, no longer assuming oversight
- Purpose: Clear that this is now a serious issue requiring immediate attention
- Structure:
  * Formal letter header with date
  * "Dear [Client Name],"
  * Opening: "We are writing regarding outstanding payment..."
  * Recite the debt: invoice number, date, original due date, amount, days overdue
  * State: "Despite our previous communication, payment remains outstanding"
  * Warn of consequences: interest charges, suspension of services, legal action
  * MANDATORY LEGAL CLAUSE: "Under the Late Payment of Commercial Debts (Interest) Act 1998, we are entitled to charge interest at 8% per annum above the Bank of England base rate. Interest will accrue from the original due date."
  * Calculate and state: Accrued interest amount and any charges
  * Final deadline: "Please remit payment in full by [DATE - typically 7-10 days]"
  * Payment instructions (bank, Stripe, methods accepted)
  * Suspension notice: "Please note that if payment is not received, we will suspend [Services] immediately"
  * Professional closing
  * Signature with title and business details

LETTER 3: FINAL NOTICE BEFORE LEGAL ACTION (30 DAYS OVERDUE)
- Tone: Formal, serious, legal, final warning
- Purpose: Final demand; next step is legal/debt collection
- Structure:
  * Formal letter header with date
  * "Dear [Client Name],"
  * Opening: "FINAL DEMAND FOR PAYMENT"
  * State facts: Invoice details, due date, original reminder letters sent, amount outstanding
  * Days overdue and current interest accrued
  * Calculate total owing: Principal + interest + any costs incurred to date
  * CLEAR LEGAL LANGUAGE: Reference to Late Payment of Commercial Debts (Interest) Act 1998
  * State: "This is a FINAL DEMAND for payment"
  * Final payment deadline: "Payment in full must be received by [DATE - typically 7 days]"
  * Payment instructions (all accepted methods)
  * WARNING: "Failure to remit payment by this date will result in: (a) Further interest accrual; (b) Referral to a debt collection agency; (c) Commencement of legal proceedings in the County Court or Small Claims Court; (d) Recovery of all costs including legal fees, court fees, and debt collection agency fees"
  * Reference to Terms and Conditions: "As set out in our Terms and Conditions of Business dated [DATE], you agreed to payment within 7 days. Late payment interest and associated costs are payable as per the statutory framework."
  * Offer: "If you are experiencing difficulty with payment, please contact us immediately to discuss a payment plan" (optional, shows good faith)
  * Signature and professional closing
  * Contact details for payment queries

CRITICAL REQUIREMENTS FOR ALL LETTERS:

- Use client's SPECIFIC business name, address, contact details from brief
- Use SPECIFIC payment terms from brief (e.g., "7 days" if that's their policy)
- Use SPECIFIC late payment interest rate from brief (typically 8% + BoE base rate)
- Reference their SPECIFIC payment methods (Stripe, bank transfer, etc.)
- Include PLACEHOLDER FIELDS: [Client Name], [Invoice Number], [Amount], [Date], etc. - use brackets or underscores
- Format as formal business letters with proper UK formatting (date, address, salutation, signature)
- Each letter is STANDALONE (client can use just Letter 1, or escalate as needed)
- Progression is clear: friendly → firm → final
- Legal language is accurate and compliant with UK law
- Each letter references previous communications (in Letter 2 & 3)
- Calculation examples for interest (show the math in Letter 2 & 3)
- All three letters are ready to customize and send
- Professional letterhead format (can be adapted to PDF or Word)
- Include signature lines and contact details at bottom
- Length: 200-300 words (Letter 1), 300-400 words (Letter 2), 400-500 words (Letter 3)
- NO placeholder text like [INSERT], use [FIELD] format clearly
- Grammar and tone: Professional, assertive but fair

Format clearly:

=== LETTER 1: FRIENDLY REMINDER (7 DAYS OVERDUE) ===
[Full letter with all fields]

=== LETTER 2: FIRM REMINDER (14 DAYS OVERDUE) ===
[Full letter with all fields]

=== LETTER 3: FINAL NOTICE BEFORE LEGAL ACTION (30 DAYS OVERDUE) ===
[Full letter with all fields]

Generate all three letters now, making them comprehensive, legal, and ready to customize.`,
  },
};

// ── PDF Generation using pdf-lib ──

async function generatePdf(text: string, documentLabel: string, businessName: string): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const italicFont = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  const pageWidth = PageSizes.A4[0];
  const pageHeight = PageSizes.A4[1];
  const margin = 72; // 1 inch
  const contentWidth = pageWidth - (margin * 2);
  const lineHeight = 14;
  const fontSize = 10;
  const smallFontSize = 8;

  // Colors
  const navy = rgb(0.1, 0.1, 0.18);
  const darkText = rgb(0.15, 0.15, 0.2);
  const secondaryText = rgb(0.45, 0.45, 0.5);
  const accentLine = rgb(0.1, 0.1, 0.18);

  // Parse text into structured blocks
  const blocks = parseTextToBlocks(text);

  // Build pages
  let page = pdfDoc.addPage(PageSizes.A4);
  let y = pageHeight - margin;

  // Draw header on first page
  y = pageHeight - margin - 10;

  // Title
  const titleWidth = boldFont.widthOfTextAtSize(documentLabel, 18);
  page.drawText(documentLabel, {
    x: (pageWidth - titleWidth) / 2,
    y: y,
    size: 18,
    font: boldFont,
    color: navy,
  });
  y -= 22;

  // Subtitle
  const subtitle = `Prepared for ${businessName}`;
  const subtitleWidth = font.widthOfTextAtSize(subtitle, 10);
  page.drawText(subtitle, {
    x: (pageWidth - subtitleWidth) / 2,
    y: y,
    size: 10,
    font: italicFont,
    color: secondaryText,
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
    color: secondaryText,
  });
  y -= 12;

  // Header line
  page.drawLine({
    start: { x: margin, y: y },
    end: { x: pageWidth - margin, y: y },
    thickness: 2,
    color: accentLine,
  });
  y -= 24;

  // Render blocks
  for (const block of blocks) {
    if (block.type === 'heading') {
      // Check if we need a new page (need at least 60px for heading + some content)
      if (y < margin + 60) {
        page = pdfDoc.addPage(PageSizes.A4);
        y = pageHeight - margin;
      }

      // Draw heading underline
      const headingText = block.text;
      const headingWidth = boldFont.widthOfTextAtSize(headingText, 13);
      page.drawText(headingText, {
        x: margin,
        y: y,
        size: 13,
        font: boldFont,
        color: navy,
      });
      y -= 4;
      page.drawLine({
        start: { x: margin, y: y },
        end: { x: margin + Math.min(headingWidth, contentWidth), y: y },
        thickness: 1,
        color: accentLine,
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
        const x = i === 0 ? margin + 24 : margin + 24;
        page.drawText(lines[i], {
          x: x,
          y: y,
          size: fontSize,
          font: font,
          color: darkText,
        });
        y -= lineHeight;
      }
      y -= 4; // Extra space after clause
    } else if (block.type === 'bullet') {
      const lines = wrapText(block.text, font, fontSize, contentWidth - 36);
      for (let i = 0; i < lines.length; i++) {
        if (y < margin + 20) {
          page = pdfDoc.addPage(PageSizes.A4);
          y = pageHeight - margin;
        }
        if (i === 0) {
          page.drawText('\u2022', {
            x: margin + 12,
            y: y,
            size: fontSize,
            font: font,
            color: darkText,
          });
        }
        page.drawText(lines[i], {
          x: margin + 36,
          y: y,
          size: fontSize,
          font: font,
          color: darkText,
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
          color: darkText,
        });
        y -= lineHeight;
      }
      y -= 6;
    }
  }

  // Footer on each page
  const pages = pdfDoc.getPages();
  const dateStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  for (let i = 0; i < pages.length; i++) {
    const p = pages[i];
    const footerY = 40;

    p.drawLine({
      start: { x: margin, y: footerY + 12 },
      end: { x: pageWidth - margin, y: footerY + 12 },
      thickness: 0.5,
      color: rgb(0.8, 0.8, 0.8),
    });

    p.drawText('Generated by Foundationary', {
      x: margin,
      y: footerY,
      size: smallFontSize,
      font: italicFont,
      color: secondaryText,
    });

    const pageStr = `Page ${i + 1} of ${pages.length}`;
    const pageStrWidth = font.widthOfTextAtSize(pageStr, smallFontSize);
    p.drawText(pageStr, {
      x: pageWidth - margin - pageStrWidth,
      y: footerY,
      size: smallFontSize,
      font: font,
      color: secondaryText,
    });

    const dateWidth = font.widthOfTextAtSize(dateStr, smallFontSize);
    p.drawText(dateStr, {
      x: (pageWidth - dateWidth) / 2,
      y: footerY,
      size: smallFontSize,
      font: font,
      color: secondaryText,
    });
  }

  return pdfDoc.save();
}

// ── DOCX Generation using docx package ──

async function generateDocx(text: string, documentLabel: string, businessName: string): Promise<Uint8Array> {
  const blocks = parseTextToBlocks(text);
  const dateStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  const children: Paragraph[] = [];

  // Title
  children.push(new Paragraph({
    children: [new TextRun({ text: documentLabel, bold: true, size: 36, font: 'Calibri', color: '1A1A2E' })],
    alignment: AlignmentType.CENTER,
    spacing: { after: 100 },
  }));

  // Subtitle
  children.push(new Paragraph({
    children: [new TextRun({ text: `Prepared for ${businessName}`, italics: true, size: 20, font: 'Calibri', color: '737373' })],
    alignment: AlignmentType.CENTER,
    spacing: { after: 50 },
  }));

  children.push(new Paragraph({
    children: [new TextRun({ text: 'Foundationary', size: 18, font: 'Calibri', color: '737373' })],
    alignment: AlignmentType.CENTER,
    spacing: { after: 200 },
  }));

  // Horizontal rule
  children.push(new Paragraph({
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: '1A1A2E' } },
    spacing: { after: 400 },
  }));

  // Content blocks
  for (const block of blocks) {
    if (block.type === 'heading') {
      children.push(new Paragraph({
        children: [new TextRun({ text: block.text, bold: true, size: 26, font: 'Calibri', color: '1A1A2E' })],
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 360, after: 120 },
        border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: '1A1A2E' } },
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
          new TextRun({ text: '\u2022  ', size: 20, font: 'Calibri', color: '262626' }),
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
    border: { top: { style: BorderStyle.SINGLE, size: 4, color: 'CCCCCC' } },
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

// ── Text Parsing ──

interface TextBlock {
  type: 'heading' | 'paragraph' | 'clause' | 'bullet';
  text: string;
}

function parseTextToBlocks(text: string): TextBlock[] {
  const blocks: TextBlock[] = [];
  const lines = text.split('\n');
  let currentParagraph: string[] = [];

  const flushParagraph = () => {
    const joined = currentParagraph.join(' ').trim();
    if (joined) {
      // Check if it's a numbered clause
      const clauseMatch = joined.match(/^(\d+(?:\.\d+)*)\.\s+(.+)$/);
      if (clauseMatch) {
        blocks.push({ type: 'clause', text: joined });
      } else {
        blocks.push({ type: 'paragraph', text: joined });
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
      const headingText = trimmed.replace(/^===\s*/, '').replace(/\s*===$/, '').trim();
      blocks.push({ type: 'heading', text: headingText });
      continue;
    }

    // Bullet point
    if (/^[-•]\s+/.test(trimmed)) {
      flushParagraph();
      blocks.push({ type: 'bullet', text: trimmed.replace(/^[-•]\s+/, '') });
      continue;
    }

    // Numbered clause at start of line
    if (/^\d+(?:\.\d+)*\.\s+/.test(trimmed)) {
      flushParagraph();
      blocks.push({ type: 'clause', text: trimmed });
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

      // Fetch business name
      const { data: intakeData } = await supabase
        .from('intake_responses')
        .select('responses')
        .eq('user_id', user_id)
        .maybeSingle();

      const businessName = intakeData?.responses?.q2_business_name || 'Unknown Business';

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

      // Convert to HTML
      const contentHtml = textToHtml(contentText, getDocumentLabel(document_type), businessName);

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

    const { data: intakeData } = await supabase
      .from('intake_responses')
      .select('responses')
      .eq('user_id', user_id)
      .maybeSingle();

    const businessName = intakeData?.responses?.q2_business_name || 'Unknown Business';
    const label = docData.document_label || getDocumentLabel(document_type);

    // Generate PDF
    const pdfBytes = await generatePdf(docData.content_text, label, businessName);
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

    // Generate DOCX
    const docxBytes = await generateDocx(docData.content_text, label, businessName);
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

function textToHtml(text: string, documentLabel: string, businessName: string): string {
  const escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  const formatted = escaped
    .replace(/===\s*(.+?)\s*===/g, '<h2 style="font-size:18px;font-weight:700;margin:24px 0 12px;color:#1a1a2e;border-bottom:2px solid #1a1a2e;padding-bottom:6px;">$1</h2>')
    .replace(/^(\d+(?:\.\d+)*)\.\s+(.+)$/gm, '<p style="margin:8px 0;padding-left:24px;text-indent:-24px;"><strong>$1.</strong> $2</p>')
    .replace(/^[-•]\s+(.+)$/gm, '<p style="margin:4px 0 4px 24px;">&bull; $1</p>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n\n/g, '</p><p style="margin:8px 0;">')
    .replace(/\n/g, '<br>');

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  @page { margin: 2.5cm; size: A4; }
  body { font-family: 'Georgia', 'Times New Roman', serif; font-size: 12pt; line-height: 1.6; color: #1a1a2e; max-width: 700px; margin: 0 auto; padding: 40px 0; }
  h1 { font-size: 22pt; font-weight: 700; margin: 0 0 8px; color: #1a1a2e; }
  h2 { font-size: 14pt; font-weight: 700; margin: 24px 0 12px; color: #1a1a2e; border-bottom: 2px solid #1a1a2e; padding-bottom: 6px; }
  p { margin: 8px 0; }
  .header { text-align: center; margin-bottom: 40px; border-bottom: 3px solid #1a1a2e; padding-bottom: 20px; }
  .header h1 { margin-bottom: 4px; }
  .header .subtitle { font-size: 10pt; color: #555; }
  .footer { margin-top: 60px; padding-top: 16px; border-top: 1px solid #ccc; font-size: 9pt; color: #888; text-align: center; }
</style>
</head>
<body>
<div class="header">
  <h1>${documentLabel}</h1>
  <div class="subtitle">Prepared for ${businessName} | Foundationary</div>
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
