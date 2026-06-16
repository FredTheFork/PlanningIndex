// Foundationary Intake Form V3 — Unified Service-Aware Question Definition
// Each section declares which services it serves via serviceTags.
// Use buildIntakeForm(purchasedServiceIds) to assemble the correct form.

export type FieldType =
  | 'short_text'
  | 'long_text'
  | 'email'
  | 'phone'
  | 'url'
  | 'single_choice'
  | 'multi_select'
  | 'file_upload'
  | 'checkbox'
  | 'repeating_section';

export interface FormField {
  id: string;
  questionNumber: string;
  label: string;
  type: FieldType;
  required: boolean;
  options?: string[];
  placeholder?: string;
  helpText?: string;
  conditionalOn?: { field: string; value: string | string[]; notEqual?: boolean };
  maxSelections?: number;
  minItems?: number;
  maxItems?: number;
  subFields?: FormField[];
  default?: string;
  hasOtherOption?: boolean;
  /**
   * Declares that this field can be prefilled from another field's answer.
   * The source and target remain SEPARATE fields with different IDs — the question
   * framing differs. The UI layer reads this to offer a prefill suggestion that the
   * user can accept or reject. This property does NOT cause automatic population.
   */
  prefillFrom?: string;
}

export interface FormSection {
  id: string;
  title: string;
  description: string;
  usedIn: string;
  fields: FormField[];
  /** Service IDs this section is relevant for. Used by buildIntakeForm() for de-duplication. */
  serviceTags: string[];
  /** Controls presentation order regardless of which services are purchased. */
  sortOrder: number;
  /**
   * Per-field service filtering within a shared section.
   * Key = field ID, value = service IDs that need this field.
   * If a field is not listed here, it shows for all services that include this section.
   * If a field IS listed, it only shows when the user purchased at least one listed service.
   */
  fieldServiceTags?: Record<string, string[]>;
}

// Service repeater sub-fields (Q15)
const serviceSubFields: FormField[] = [
  {
    id: 'service_name',
    questionNumber: 'Q15a',
    label: 'Service name',
    type: 'short_text',
    required: true,
    placeholder: 'e.g. Monthly Social Media Management',
  },
  {
    id: 'service_includes',
    questionNumber: 'Q15b',
    label: 'What does this service include? Describe everything the client receives.',
    type: 'long_text',
    required: true,
    placeholder: 'Be specific. "Social media management" tells us nothing. "Scheduling 15 posts per month, responding to comments Monday to Friday, and producing a monthly performance report" tells us everything we need.',
    helpText: 'Be as specific as possible — vague answers produce generic documents.',
  },
  {
    id: 'service_excludes',
    questionNumber: 'Q15c',
    label: 'What does this service NOT include? What are the boundaries?',
    type: 'long_text',
    required: true,
    placeholder: 'e.g. Paid advertising spend, website edits, graphic design outside of basic Canva work, or any work outside the agreed monthly hours.',
    helpText: 'This is one of the most important questions. Scope creep is the number one cause of disputes.',
  },
  {
    id: 'service_client_provides',
    questionNumber: 'Q15d',
    label: 'What does the client need to provide for you to begin this service?',
    type: 'long_text',
    required: true,
    placeholder: 'e.g. Access to social media accounts, brand guidelines or examples, a content preferences questionnaire completed before session 1.',
  },
  {
    id: 'service_timeline',
    questionNumber: 'Q15e',
    label: 'What is the typical timeline or duration of this service?',
    type: 'short_text',
    required: true,
    placeholder: 'e.g. Ongoing monthly retainer / 3-5 business days per project / 6-week programme',
  },
  {
    id: 'service_outcome',
    questionNumber: 'Q15f',
    label: 'What result or outcome does the client typically experience after this service?',
    type: 'long_text',
    required: true,
    placeholder: 'Be concrete. Not "they feel more organised" — "they free up 8-10 hours per week and have a consistent, professional online presence they didn\'t have to build themselves."',
    helpText: 'Used in your Service Description Sheets, Elevator Pitch, and Bio.',
  },
  {
    id: 'service_starting_price',
    questionNumber: 'Q15g',
    label: 'What is the starting price for this service? (optional — leave blank if you prefer not to display pricing)',
    type: 'short_text',
    required: false,
    placeholder: 'e.g. From £500/month',
  },
];

// ── UNIFIED FORM SECTIONS ──
// All sections for all services in one array, tagged with serviceTags and sortOrder.
// Use buildIntakeForm(purchasedServiceIds) to get the right sections for any purchase combination.

export const allFormSections: FormSection[] = [
  // ── INTRO PAGE ──
  {
    id: 'intro',
    title: 'Welcome to Foundationary',
    description: 'This questionnaire is the only information we will use to build your deliverables. Please answer every question as fully and honestly as you can — the more detail you give us, the more tailored and precise your documents will be.\n\nEstimated time: 20-30 minutes.\n\nThere are no wrong answers. Write the way you speak. We will turn it into something professional.\n\nYour deliverables will be ready within 24 hours of submission.',
    usedIn: '',
    fields: [],
    serviceTags: ['business_foundations_pack', 'website_copy_pack', 'social_media_pack', 'client_onboarding_pack', 'payment_protection_pack', 'copyright_licensing_pack', 'gdpr_deep_pack', 'coach_industry_pack', 'photographer_industry_pack', 'consultant_industry_pack', 'contractor_industry_pack'],
    sortOrder: 0,
  },

  // ── SECTION 1 — BUSINESS IDENTITY ──
  {
    id: 'business_identity',
    title: 'Business Identity',
    description: 'This information appears in your contracts, terms, privacy policy, invoices, and all document headers.',
    usedIn: 'Contract, T&Cs, Privacy Policy, Invoice Template, Late Payment Letters, all document headers',
    fields: [
      { id: 'q1_legal_name', questionNumber: 'Q1', label: 'What is your full legal name?', type: 'short_text', required: true, placeholder: 'e.g. Jane Elizabeth Smith', helpText: 'This is the name that appears on contracts and legal documents.' },
      { id: 'q2_business_name', questionNumber: 'Q2', label: 'What is your business or trading name?', type: 'short_text', required: true, placeholder: 'e.g. Smith Consulting', helpText: 'If you trade under your own name, repeat it here.' },
      { id: 'q3_business_registered', questionNumber: 'Q3', label: 'How is your business registered?', type: 'single_choice', required: true, options: ['Sole trader', 'Limited company', 'Partnership / LLP', 'Not registered yet'] },
      { id: 'q4_companies_house', questionNumber: 'Q4', label: 'If you are a limited company — what is your Companies House registration number?', type: 'short_text', required: false, placeholder: 'e.g. 12345678', conditionalOn: { field: 'q3_business_registered', value: 'Limited company' }, helpText: 'Required for legally compliant contracts and invoices for limited companies.' },
      { id: 'q5_jurisdiction', questionNumber: 'Q5', label: 'Which part of the UK does your business operate under?', type: 'single_choice', required: true, options: ['England & Wales', 'Scotland', 'Northern Ireland'], helpText: 'This determines which legal jurisdiction applies to your documents.' },
      { id: 'q6_business_address', questionNumber: 'Q6', label: 'What is your business address?', type: 'long_text', required: true, placeholder: 'Full address including postcode', helpText: 'Appears on contracts, invoices, and legal documents. If you work from home and prefer not to display your home address, note that here.' },
      { id: 'q7_document_email', questionNumber: 'Q7', label: 'What is the email address that should appear on your documents?', type: 'email', required: true, placeholder: 'e.g. hello@smithconsulting.co.uk' },
      { id: 'q8_business_phone', questionNumber: 'Q8', label: 'What is your business phone number?', type: 'phone', required: false, placeholder: 'e.g. 07700 900123' },
      { id: 'q9_has_website', questionNumber: 'Q9', label: 'Do you have an existing website?', type: 'single_choice', required: true, options: ['Yes — I have a live website', 'In progress / coming soon', 'No — I don\'t have one yet'] },
      { id: 'q10_website_url', questionNumber: 'Q10', label: 'If yes — what is your website URL?', type: 'url', required: false, placeholder: 'e.g. www.smithconsulting.co.uk', conditionalOn: { field: 'q9_has_website', value: 'Yes — I have a live website' } },
      { id: 'q11_social_platforms', questionNumber: 'Q11', label: 'Which social media platforms do you actively use for your business?', type: 'multi_select', required: false, options: ['LinkedIn', 'Instagram', 'TikTok', 'Facebook Page', 'X (Twitter)', 'WhatsApp Business', 'Pinterest', 'None yet'] },
      { id: 'q12_social_links', questionNumber: 'Q12', label: 'Please paste the links to any active social media profiles', type: 'long_text', required: false, placeholder: 'One per line', conditionalOn: { field: 'q11_social_platforms', value: 'None yet', notEqual: true } },
      { id: 'business_identity_notes', questionNumber: 'Q12b', label: 'Additional notes for this section', type: 'long_text', required: false, placeholder: 'Any additional details or clarifications you want to share about your business identity...', helpText: 'Optional — add any extra context that didn\'t fit in the questions above.' },
    ],
    serviceTags: ['business_foundations_pack', 'website_copy_pack', 'social_media_pack'],
    sortOrder: 10,
  },

  // ── SECTION 2 — YOUR SERVICES ──
  {
    id: 'services',
    title: 'Your Services',
    description: 'Help us understand what you offer so your contracts and descriptions are accurate.',
    usedIn: 'Contract (scope & deliverables), T&Cs, Service Description Sheets, Welcome Email Sequence, Elevator Pitch',
    fields: [
      { id: 'q13_what_you_do', questionNumber: 'Q13', label: 'In your own words — what does your business do, and who do you do it for?', type: 'long_text', required: true, placeholder: 'Write this the way you\'d explain it to a friend. Don\'t overthink it. This is the single most important question in this form.', helpText: 'Example: "I help small business owners manage their admin and social media so they can focus on actually running their business. My clients are typically coaches and consultants who are too busy to keep on top of the back-office stuff."' },
      { id: 'q14_flagship_service', questionNumber: 'Q14', label: 'What is your main / flagship service?', type: 'short_text', required: true, placeholder: 'The one thing you\'re most known for, or most want to be known for.' },
      { id: 'q15_services', questionNumber: 'Q15', label: 'Please describe each service you offer.', type: 'repeating_section', required: true, minItems: 1, maxItems: 5, subFields: serviceSubFields, helpText: 'Complete one block per service. If you only offer one service, complete one block. Be as specific as possible.' },
      { id: 'q16_uses_subcontractors', questionNumber: 'Q16', label: 'Do you use subcontractors or other freelancers to help deliver any part of your services?', type: 'single_choice', required: true, options: ['Yes', 'No'] },
      { id: 'q17_inform_subcontractors', questionNumber: 'Q17', label: 'Should your clients be informed in their contract that subcontractors may be involved in delivering their work?', type: 'single_choice', required: false, options: ['Yes', 'No'], conditionalOn: { field: 'q16_uses_subcontractors', value: 'Yes' }, helpText: 'Most clients will select yes. Being transparent about this protects you legally.' },
      { id: 'q18_sends_proposal', questionNumber: 'Q18', label: 'Do you typically send a proposal or quote before a client formally engages you?', type: 'single_choice', required: true, options: ['Yes — I always send a proposal first', 'Sometimes — depends on the project', 'No — we agree verbally and get started'] },
      { id: 'services_notes', questionNumber: 'Q18b', label: 'Additional notes for this section', type: 'long_text', required: false, placeholder: 'Any additional details about your services that didn\'t fit above...', helpText: 'Optional — add any extra context about what you offer.' },
    ],
    serviceTags: ['business_foundations_pack', 'website_copy_pack', 'social_media_pack'],
    sortOrder: 20,
  },

  // ── SECTION 3 — YOUR CLIENTS & HOW YOU WORK ──
  {
    id: 'clients',
    title: 'Your Clients & How You Work',
    description: 'This helps us tailor your contract clauses, welcome emails, and professional positioning.',
    usedIn: 'Contract (client responsibilities, dispute clauses), T&Cs, Welcome Email Sequence, Bio, Elevator Pitch',
    fields: [
      { id: 'q19_client_type', questionNumber: 'Q19', label: 'Are your clients mainly individuals, businesses, or a mix?', type: 'single_choice', required: true, options: ['Mainly individuals / consumers', 'Mainly businesses', 'Both equally'], helpText: 'This affects which consumer protection laws apply to your contract.' },
      { id: 'q20_ideal_client', questionNumber: 'Q20', label: 'Describe your ideal client in as much detail as you can.', type: 'long_text', required: true, placeholder: 'Who are they? What do they do? What stage of business are they at? What problem brings them to you?' },
      { id: 'q21_client_industries', questionNumber: 'Q21', label: 'What industries do your clients typically work in?', type: 'long_text', required: false, placeholder: 'e.g. E-commerce brands, health and wellness coaches, tradespeople setting up their first business.' },
      { id: 'q22_client_issues', questionNumber: 'Q22', label: 'Have you ever experienced any of the following with clients?', type: 'multi_select', required: true, options: ['Client refused to pay', 'Client disappeared / went silent after work was delivered', 'Scope creep — client asked for far more than agreed', 'Refund dispute', 'Chargeback through PayPal or card', 'Client claimed ownership of work before paying in full', 'Missed deadlines caused by the client, not me', 'GDPR or data complaint', 'Harassment or abusive behaviour', 'Threats of legal action', 'None of the above'] },
      { id: 'q23_dispute_details', questionNumber: 'Q23', label: 'Please describe what happened in any of the above situations.', type: 'long_text', required: false, placeholder: 'You don\'t need to name anyone. The more detail you give here, the more precisely we can tailor your contract clauses.', conditionalOn: { field: 'q22_client_issues', value: 'None of the above', notEqual: true }, helpText: 'Strongly encouraged — this directly shapes your protective clauses.' },
      { id: 'q24_client_concerns', questionNumber: 'Q24', label: 'What are your biggest concerns or worries when working with clients?', type: 'long_text', required: false, placeholder: 'e.g. Clients not taking the work seriously, projects dragging on past the agreed timeline, being asked to do things outside the original brief.' },
      { id: 'clients_notes', questionNumber: 'Q24b', label: 'Additional notes for this section', type: 'long_text', required: false, placeholder: 'Any additional details about your clients that didn\'t fit above...', helpText: 'Optional — add any extra context about your client relationships.' },
    ],
    serviceTags: ['business_foundations_pack', 'website_copy_pack'],
    sortOrder: 30,
  },

  // ── SECTION 4 — PRICING, PAYMENT & PROTECTION ──
  {
    id: 'pricing',
    title: 'Pricing, Payment & Protection',
    description: 'This information feeds directly into your contract, terms, invoice template, and late payment letters.',
    usedIn: 'Contract, T&Cs, Invoice Template, Late Payment Letter Sequence',
    fields: [
      { id: 'q25_pricing_model', questionNumber: 'Q25', label: 'How do you charge for your services?', type: 'multi_select', required: true, options: ['Fixed project fee', 'Hourly rate', 'Monthly retainer', 'Day rate', 'Milestone / stage payments', 'Subscription', 'Other'], hasOtherOption: true },
      { id: 'q26_payment_terms', questionNumber: 'Q26', label: 'What are your standard payment terms?', type: 'single_choice', required: true, options: ['100% payment required upfront before work begins', '50% upfront / 50% on completion', 'Invoice on completion — due within 7 days', 'Invoice on completion — due within 14 days', 'Invoice on completion — due within 30 days', 'I use milestone payments — invoice at agreed stages', 'Custom arrangement'] },
      { id: 'q27_payment_detail', questionNumber: 'Q27', label: 'Describe your payment arrangement in more detail.', type: 'long_text', required: false, placeholder: 'Describe your milestone or custom payment arrangement.', conditionalOn: { field: 'q26_payment_terms', value: ['I use milestone payments — invoice at agreed stages', 'Custom arrangement'] } },
      { id: 'q28_requires_deposit', questionNumber: 'Q28', label: 'Do you require a deposit before starting work?', type: 'single_choice', required: true, options: ['Yes — always', 'Yes — for larger projects', 'No'] },
      { id: 'q29_deposit_detail', questionNumber: 'Q29', label: 'If yes — what percentage do you take as a deposit, and when is the remainder due?', type: 'short_text', required: false, placeholder: 'e.g. 50% upfront, 50% within 7 days of final delivery.', conditionalOn: { field: 'q28_requires_deposit', value: ['Yes — always', 'Yes — for larger projects'] } },
      { id: 'q30_payment_methods', questionNumber: 'Q30', label: 'What payment methods do you accept?', type: 'multi_select', required: true, options: ['Bank transfer (BACS)', 'PayPal', 'Stripe', 'GoCardless', 'Wise', 'Cash', 'Card reader', 'Other'], hasOtherOption: true },
      { id: 'q31_refund_policy', questionNumber: 'Q31', label: 'What is your refund policy?', type: 'single_choice', required: true, options: ['No refunds — once work has begun, fees are non-refundable', 'Partial refund — proportional to work not yet completed', 'Full refund if cancelled within [X] days before work starts only', 'Case by case', 'I don\'t currently have a clear policy'] },
      { id: 'q32_refund_detail', questionNumber: 'Q32', label: 'Describe your refund or cancellation terms in more detail.', type: 'long_text', required: false, placeholder: 'Any specifics — timeframes, conditions, what "cancellation" means for ongoing retainers.', conditionalOn: { field: 'q31_refund_policy', value: 'No refunds — once work has begun, fees are non-refundable', notEqual: true } },
      { id: 'q33_late_payment_interest', questionNumber: 'Q33', label: 'Do you want statutory late payment interest wording included in your documents?', type: 'single_choice', required: true, options: ['Yes', 'No'], default: 'Yes', helpText: 'Under the Late Payment of Commercial Debts Act 1998, you have the legal right to charge 8% above the Bank of England base rate on overdue invoices. We recommend including this.' },
      { id: 'q34_vat_registered', questionNumber: 'Q34', label: 'Are you VAT registered?', type: 'single_choice', required: true, options: ['Yes', 'No'] },
      { id: 'q35_vat_number', questionNumber: 'Q35', label: 'What is your VAT number?', type: 'short_text', required: false, placeholder: 'e.g. GB123456789', conditionalOn: { field: 'q34_vat_registered', value: 'Yes' } },
      { id: 'pricing_notes', questionNumber: 'Q35b', label: 'Additional notes for this section', type: 'long_text', required: false, placeholder: 'Any additional details about your pricing and payment terms...', helpText: 'Optional — add any extra context about how you handle payments.' },
    ],
    serviceTags: ['business_foundations_pack'],
    sortOrder: 40,
  },

  // ── SECTION 5 — GDPR & DATA PROTECTION ──
  {
    id: 'gdpr',
    title: 'GDPR & Data Protection',
    description: 'Every question in this section is required by UK law to produce a compliant privacy notice.',
    usedIn: 'GDPR Privacy Policy',
    fields: [
      { id: 'q36_data_collected', questionNumber: 'Q36', label: 'What personal information do you collect from your clients?', type: 'multi_select', required: true, options: ['Full names', 'Email addresses', 'Phone numbers', 'Home or business addresses', 'Financial / billing details', 'Bank account information', 'Copies of ID documents', 'Project files and creative work', 'Health or medical information', 'Information about their employees or staff', 'Other'], hasOtherOption: true },
      { id: 'q37_data_collection_method', questionNumber: 'Q37', label: 'How do you collect this information?', type: 'multi_select', required: true, options: ['Email correspondence', 'Phone or video calls', 'Written contracts or agreements', 'Online forms or questionnaires', 'Social media messages', 'In-person meetings', 'Payment processors (e.g. Stripe, PayPal)', 'Third-party booking or scheduling tools', 'Other'], hasOtherOption: true },
      { id: 'q38_data_purpose', questionNumber: 'Q38', label: 'Why do you collect and use this information? What do you need it for?', type: 'long_text', required: true, placeholder: 'Be specific. Example: "I collect names and email addresses to communicate with clients about their projects, send invoices, and maintain records for tax purposes."' },
      { id: 'q39_data_storage', questionNumber: 'Q39', label: 'Where do you store client data?', type: 'multi_select', required: true, options: ['Google Drive', 'Dropbox', 'OneDrive', 'My local computer / hard drive', 'Notion', 'Accounting software (e.g. QuickBooks, Xero, FreeAgent)', 'CRM software (e.g. Dubsado, HoneyBook)', 'Paper records / physical files', 'Other'], hasOtherOption: true },
      { id: 'q40_data_retention', questionNumber: 'Q40', label: 'How long do you keep client records after a project or contract ends?', type: 'single_choice', required: true, options: ['1 year', '2 years', '3 years', '6 years (recommended — aligns with HMRC)', 'I delete records as soon as the project ends', 'I\'m not sure / I don\'t have a policy yet'], helpText: 'HMRC requires you to keep financial records for at least 6 years. We recommend selecting 6 years unless you have a specific reason to delete sooner.' },
      { id: 'q41_uses_third_party_tools', questionNumber: 'Q41', label: 'Do you use any third-party software tools that have access to client data?', type: 'single_choice', required: true, options: ['Yes', 'No'], helpText: 'Examples: Mailchimp, Xero, QuickBooks, Notion, Dubsado, Calendly, WhatsApp, Zoom, Google Workspace.' },
      { id: 'q42_third_party_tools', questionNumber: 'Q42', label: 'List the tools that process your clients\' personal data, and what each one is used for.', type: 'long_text', required: false, placeholder: 'Example: "Google Drive — stores project files and client documents. Xero — sends invoices and stores payment records. Mailchimp — sends a monthly newsletter to past clients who have opted in."', conditionalOn: { field: 'q41_uses_third_party_tools', value: 'Yes' } },
      { id: 'q43_shares_data', questionNumber: 'Q43', label: 'Do you share client information with any other person or company outside of those tools?', type: 'single_choice', required: true, options: ['Yes', 'No', 'Sometimes'] },
      { id: 'q44_data_sharing_detail', questionNumber: 'Q44', label: 'Who do you share client data with, and why?', type: 'long_text', required: false, placeholder: 'Example: "I sometimes share client project details with a subcontractor VA who assists with admin tasks. She has signed a confidentiality agreement."', conditionalOn: { field: 'q43_shares_data', value: ['Yes', 'Sometimes'] } },
      { id: 'q45_sends_marketing', questionNumber: 'Q45', label: 'Do you send marketing emails to clients or leads?', type: 'single_choice', required: true, options: ['Yes', 'No'] },
      { id: 'q46_marketing_platform', questionNumber: 'Q46', label: 'Which platform do you use for email marketing, and how do people sign up?', type: 'short_text', required: false, placeholder: 'e.g. Mailchimp — people opt in via a sign-up form on my website', conditionalOn: { field: 'q45_sends_marketing', value: 'Yes' } },
      { id: 'q47_uses_cookies', questionNumber: 'Q47', label: 'Do you use cookies or tracking tools on your website?', type: 'single_choice', required: false, options: ['Yes', 'No', 'I\'m not sure'], conditionalOn: { field: 'q9_has_website', value: 'Yes — I have a live website' } },
      { id: 'q48_tracking_tools', questionNumber: 'Q48', label: 'Which tracking tools do you use?', type: 'multi_select', required: false, options: ['Google Analytics', 'Meta (Facebook) Pixel', 'TikTok Pixel', 'Hotjar or Microsoft Clarity', 'Cookie consent banner tool', 'Other'], conditionalOn: { field: 'q47_uses_cookies', value: 'Yes' }, hasOtherOption: true },
      { id: 'gdpr_notes', questionNumber: 'Q48b', label: 'Additional notes for this section', type: 'long_text', required: false, placeholder: 'Any additional details about your data protection practices...', helpText: 'Optional — add any extra context about how you handle client data.' },
    ],
    serviceTags: ['business_foundations_pack'],
    sortOrder: 50,
  },

  // ── SECTION 6 — LEGAL & RISK ──
  {
    id: 'legal',
    title: 'Legal & Risk',
    description: 'This affects how your contract\'s liability clauses are written.',
    usedIn: 'Contract (limitation of liability, regulated services clauses), T&Cs',
    fields: [
      { id: 'q49_regulated_services', questionNumber: 'Q49', label: 'Do you provide any regulated, licensed, or specialist professional services?', type: 'single_choice', required: true, options: ['Yes', 'No'], helpText: 'Examples: Financial advice, legal services, medical or health services, childcare, mortgage advice, debt counselling, food production, alcohol sales.' },
      { id: 'q50_regulatory_detail', questionNumber: 'Q50', label: 'Describe the regulatory context for your services.', type: 'long_text', required: false, placeholder: 'Which regulatory body governs your work? Are you licensed, registered, or insured as required?', conditionalOn: { field: 'q49_regulated_services', value: 'Yes' }, helpText: 'This information affects how your contract\'s liability clauses are written.' },
      { id: 'q51_indemnity_insurance', questionNumber: 'Q51', label: 'Do you hold professional indemnity insurance?', type: 'single_choice', required: true, options: ['Yes', 'No', 'Not yet'] },
      { id: 'q52_certifications', questionNumber: 'Q52', label: 'Do you hold any professional certifications, accreditations, or memberships relevant to your work?', type: 'long_text', required: false, placeholder: 'e.g. ICB-certified bookkeeper. Member of the VA Membership Association since 2022.', helpText: 'These are used in your Professional Bio and LinkedIn Profile.' },
      { id: 'q53_specific_clauses', questionNumber: 'Q53', label: 'Are there any specific protections, clauses, or wording you know you want included in your documents?', type: 'long_text', required: false, placeholder: 'e.g. "I want a very clear clause about what happens if a client disappears mid-project. I also want it clearly stated that my working hours are Monday to Thursday only."' },
      { id: 'q54_exclusions', questionNumber: 'Q54', label: 'Is there anything you know you do NOT want included?', type: 'long_text', required: false, placeholder: 'Any clauses, wording, or approaches you want excluded from your documents.' },
      { id: 'legal_notes', questionNumber: 'Q54b', label: 'Additional notes for this section', type: 'long_text', required: false, placeholder: 'Any additional legal or risk considerations...', helpText: 'Optional — add any extra context about your legal needs.' },
    ],
    serviceTags: ['business_foundations_pack'],
    sortOrder: 60,
  },

  // ── SECTION 7 — YOUR VOICE, STORY & BRAND ──
  {
    id: 'brand',
    title: 'Your Voice, Story & Brand',
    description: 'This shapes your Professional Bio, Elevator Pitch, LinkedIn Profile, Welcome Emails, and all tone-of-voice decisions.',
    usedIn: 'Professional Bio, Elevator Pitch, LinkedIn Profile Script, Welcome Email Sequence, all tone-of-voice decisions',
    fields: [
      { id: 'q55_first_name', questionNumber: 'Q55', label: 'What is your first name, or the name you want used when documents refer to you personally?', type: 'short_text', required: true, placeholder: 'Used in your bio, email signatures, and welcome sequence.' },
      { id: 'q56_business_story', questionNumber: 'Q56', label: 'Why did you start this business? What is your story?', type: 'long_text', required: true, placeholder: 'This does not need to be polished. Write it like you\'d tell a friend. What made you go out on your own? What was the moment you decided?' },
      { id: 'q57_experience', questionNumber: 'Q57', label: 'What experience, background, or qualifications make you good at what you do?', type: 'long_text', required: true, placeholder: 'Include relevant jobs, industries, years of experience, training, skills — anything that establishes your credibility.' },
      { id: 'q58_achievements', questionNumber: 'Q58', label: 'What are you most proud of achieving — in your business or career?', type: 'long_text', required: false, placeholder: 'Results, milestones, client wins, moments you felt genuinely good about your work.' },
      { id: 'q59_client_compliments', questionNumber: 'Q59', label: 'What do clients most often compliment you on or thank you for?', type: 'long_text', required: false, placeholder: 'If you\'ve never had a client, what do colleagues or people who know your work say about you?' },
      { id: 'q60_12_month_goal', questionNumber: 'Q60', label: 'What is the single biggest thing you want your business to achieve in the next 12 months?', type: 'long_text', required: true, placeholder: 'Be specific — "get to 10 retainer clients" is more useful than "grow my business."' },
      { id: 'q61_differentiator', questionNumber: 'Q61', label: 'What makes you meaningfully different from others who offer similar services?', type: 'long_text', required: true, placeholder: 'Be honest. Generic answers ("I offer great value and a personal service") produce generic documents. What is the specific, genuine thing that sets you apart?' },
      { id: 'q62_tone_of_voice', questionNumber: 'Q62', label: 'What is your brand\'s tone of voice?', type: 'multi_select', required: true, maxSelections: 3, options: ['Warm and friendly', 'Professional and formal', 'Direct and no-nonsense', 'Conversational and approachable', 'Calm and reassuring', 'Bold and confident', 'Luxury and refined', 'Creative and energetic'] },
      { id: 'q63_avoid_words', questionNumber: 'Q63', label: 'Are there any words, phrases, or tones you NEVER want used in any of your documents?', type: 'long_text', required: false, placeholder: 'e.g. "I hate corporate jargon. Don\'t use \'synergy\', \'leverage\' as a verb, or anything that sounds like a LinkedIn buzzword."' },
      { id: 'q64_brand_identity', questionNumber: 'Q64', label: 'Do you want your personal name and identity to be front and centre, or do you prefer the business name to lead?', type: 'single_choice', required: true, options: ['My personal name is the brand — I want documents to feel personal', 'The business name is the brand — keep it professional and company-facing', 'A mix of both'] },
      { id: 'q65_has_logo', questionNumber: 'Q65', label: 'Do you have a logo?', type: 'single_choice', required: true, options: ['Yes', 'No'] },
      { id: 'q66_logo_upload', questionNumber: 'Q66', label: 'Upload your logo.', type: 'file_upload', required: false, conditionalOn: { field: 'q65_has_logo', value: 'Yes' }, helpText: 'PNG or SVG preferred. This will be used on your invoice template and document headers.' },
      { id: 'q67_brand_colours', questionNumber: 'Q67', label: 'What are your brand colours?', type: 'short_text', required: false, placeholder: 'Hex codes if you have them. If not, describe: "deep navy blue and warm gold" or "sage green and off-white."' },
      { id: 'q68_visual_style', questionNumber: 'Q68', label: 'How do you want your documents to feel visually?', type: 'single_choice', required: true, options: ['Clean and modern / minimal', 'Corporate and formal', 'Warm and friendly', 'Premium and luxury', 'Simple — I just want it to work'] },
      { id: 'brand_notes', questionNumber: 'Q68b', label: 'Additional notes for this section', type: 'long_text', required: false, placeholder: 'Any additional details about your brand and voice...', helpText: 'Optional — add any extra context about how you want to come across.' },
    ],
    serviceTags: ['business_foundations_pack', 'website_copy_pack', 'social_media_pack'],
    sortOrder: 70,
    // q67_brand_colours is only needed by website-copy (for colour scheme choices).
    // For documents-only purchases, it's not essential for document generation.
    fieldServiceTags: {
      'q67_brand_colours': ['website_copy_pack', 'social_media_pack'],
      'brand_notes': ['business_foundations_pack'],
    },
  },

  // ── SECTION 8 — INVOICE PREFERENCES ──
  {
    id: 'invoice',
    title: 'Invoice Preferences',
    description: 'This information is used exclusively for your Professional Invoice Template.',
    usedIn: 'Professional Invoice Template only',
    fields: [
      { id: 'q69_bank_details', questionNumber: 'Q69', label: 'What bank or payment details should appear on your invoices?', type: 'long_text', required: true, placeholder: 'For bank transfers: Account name, sort code, account number. For PayPal/Stripe/other: include the relevant details or email. If you use multiple methods, list all of them.' },
      { id: 'q70_invoice_due_date', questionNumber: 'Q70', label: 'What should invoices default to as a payment due date?', type: 'short_text', required: true, placeholder: 'e.g. 7 days from invoice date / 14 days from invoice date / Due on receipt', helpText: 'This should match your payment terms in Section 4.' },
      { id: 'q71_invoice_fields', questionNumber: 'Q71', label: 'What optional fields do you want included on your invoice template?', type: 'multi_select', required: false, options: ['Purchase order (PO) number field', 'VAT breakdown section', 'Notes / message to client section', 'Payment terms summary at the bottom', 'Signature field'] },
      { id: 'invoice_notes', questionNumber: 'Q71b', label: 'Additional notes for this section', type: 'long_text', required: false, placeholder: 'Any additional details about your invoice preferences...', helpText: 'Optional — add any extra context about how you want invoices to look.' },
    ],
    serviceTags: ['business_foundations_pack'],
    sortOrder: 80,
  },

  // ── SECTION 9 — LINKEDIN PROFILE ──
  {
    id: 'linkedin',
    title: 'LinkedIn Profile',
    description: 'We\'ll write your LinkedIn profile script and professional online presence.',
    usedIn: 'LinkedIn Profile Optimisation Script',
    fields: [
      { id: 'q72_linkedin_usage', questionNumber: 'Q72', label: 'Do you currently use LinkedIn for your business?', type: 'single_choice', required: true, options: ['Yes — I use it actively', 'I have a profile but rarely use it', 'No — I don\'t have a profile'] },
      { id: 'q73_linkedin_url', questionNumber: 'Q73', label: 'What is your LinkedIn profile URL?', type: 'url', required: false, placeholder: 'e.g. linkedin.com/in/yourname', conditionalOn: { field: 'q72_linkedin_usage', value: ['Yes — I use it actively', 'I have a profile but rarely use it'], notEqual: false } },
      { id: 'q74_linkedin_target', questionNumber: 'Q74', label: 'What kind of clients or opportunities do you want to attract through LinkedIn?', type: 'long_text', required: true, placeholder: 'Be specific. "New clients" is not enough. "Small e-commerce business owners who need monthly bookkeeping support on a retainer basis" gives us what we need.' },
      { id: 'q75_linkedin_keywords', questionNumber: 'Q75', label: 'What keywords or services do you want people to find you for on LinkedIn?', type: 'long_text', required: false, placeholder: 'e.g. VA services, email management, social media scheduling, virtual assistant for coaches, online business support.' },
      { id: 'linkedin_notes', questionNumber: 'Q75b', label: 'Additional notes for this section', type: 'long_text', required: false, placeholder: 'Any additional details about your LinkedIn profile...', helpText: 'Optional — add any extra context about your LinkedIn goals.' },
    ],
    serviceTags: ['business_foundations_pack'],
    sortOrder: 90,
  },

  // ── SECTION 10 — FINAL CONFIRMATION ──
  {
    id: 'final',
    title: 'Final Confirmation',
    description: 'Upload any existing documents and confirm your consent.',
    usedIn: 'Operational and consent',
    fields: [
      { id: 'q76_existing_docs_upload', questionNumber: 'Q76', label: 'Upload any existing contracts, terms, or business documents you currently use.', type: 'file_upload', required: false, helpText: 'If you have anything — even something rough — upload it here. We\'ll use it to ensure we don\'t miss anything specific to how you already operate.' },
      { id: 'q77_writing_samples_upload', questionNumber: 'Q77', label: 'Upload any examples of your own writing — emails, social posts, a previous bio — so we can match your natural voice.', type: 'file_upload', required: false, helpText: 'This is particularly useful if your tone of voice is distinctive or if you\'ve answered "creative" or "bold" above.' },
      { id: 'q78_anything_else', questionNumber: 'Q78', label: 'Is there anything else about your business, your clients, or your situation that we should know before building your documents?', type: 'long_text', required: false, placeholder: 'If something doesn\'t fit neatly into any of the above questions, tell us here.' },
      { id: 'q79_how_heard', questionNumber: 'Q79', label: 'How did you hear about Foundationary?', type: 'single_choice', required: false, options: ['LinkedIn', 'Instagram', 'TikTok', 'Facebook group', 'Referral from someone I know', 'Google search', 'Accountant or bookkeeper recommendation', 'Other'], hasOtherOption: true },
      { id: 'q80_confidence_level', questionNumber: 'Q80', label: 'How confident do you currently feel about your business setup?', type: 'single_choice', required: true, options: ['Very confident — I just want things formalised properly', 'Somewhat confident — I know there are gaps', 'Not confident at all — I\'m starting from scratch'], helpText: 'This helps us calibrate how we write your documents and what we prioritise.' },
      { id: 'q81_consent_marketing', questionNumber: 'Q81', label: 'Do you consent to Foundationary using anonymised and redacted excerpts from your documents — without any identifying information — for case studies, marketing, or portfolio purposes?', type: 'single_choice', required: true, options: ['Yes', 'No'] },
      { id: 'q82_consent_not_legal', questionNumber: 'Q82', label: 'I understand that Foundationary provides document drafting support only and not legal advice. I will seek independent legal advice before relying on these documents in any dispute or legal proceeding.', type: 'checkbox', required: true },
      { id: 'q83_consent_accuracy', questionNumber: 'Q83', label: 'I confirm that all information I have provided in this form is accurate and complete to the best of my knowledge.', type: 'checkbox', required: true },
    ],
    serviceTags: ['business_foundations_pack', 'website_copy_pack', 'social_media_pack', 'client_onboarding_pack', 'payment_protection_pack', 'copyright_licensing_pack', 'gdpr_deep_pack', 'coach_industry_pack', 'photographer_industry_pack', 'consultant_industry_pack', 'contractor_industry_pack'],
    sortOrder: 200,
  },

  // ── SECTION 11 — WEBSITE COPY ──
  {
    id: 'website_copy',
    title: 'Website Content',
    description: 'Tell us about your website so we can build a complete, professional site that reflects your brand, communicates your value, and converts visitors into clients.',
    usedIn: 'Website Copy Starter Pack',
    fields: [
      // ── Primary Website Goal ──
      { id: 'wc2_primary_action', questionNumber: 'WC2', label: 'What is the single most important action you want a website visitor to take?', type: 'long_text', required: true, placeholder: 'e.g. Book a free discovery call / Fill out my enquiry form / Buy my online course / Sign up for my newsletter / Download my free guide.' },
      { id: 'wc3_inspiration_urls', questionNumber: 'WC3', label: 'Are there any websites — your own industry or otherwise — whose copy or overall feel you admire? Paste the URLs.', type: 'long_text', required: false, placeholder: 'We\'re not copying them. We\'re calibrating tone and style.' },

      // ── Website Structure ──
      { id: 'wc_service_page_count', questionNumber: 'WC5', label: 'How many individual service pages do you need?', type: 'single_choice', required: true, options: ['1', '2-3', '4-5', '6+', 'Depends — align with my service descriptions'], helpText: 'If you selected the Services page, this tells us whether it\'s a single overview or separate pages per service.' },
      { id: 'wc_nav_structure', questionNumber: 'WC6', label: 'What navigation structure do you prefer?', type: 'single_choice', required: true, options: ['Single page / scroll', 'Multi-page', 'One-page with sections'], helpText: 'This affects how we structure and link the copy together.' },

      // ── Website Copy Tone and Messaging ──
      { id: 'wc_headline_idea', questionNumber: 'WC7', label: 'Do you have a headline or tagline idea for your homepage?', type: 'short_text', required: false, placeholder: 'e.g. "Clear the chaos. Run your business." — Leave blank if you want us to create one.' },
      { id: 'wc_hero_message', questionNumber: 'WC8', label: 'What is the key message for your homepage hero section?', type: 'long_text', required: true, placeholder: 'What should visitors understand within 5 seconds of landing on your site? e.g. "I help overwhelmed sole traders get their admin and compliance sorted so they can actually focus on growing their business."' },
      { id: 'wc_differentiator', questionNumber: 'WC9', label: 'What makes you different — specifically for your website?', type: 'long_text', required: false, placeholder: 'What is the specific, genuine thing that sets you apart? If you\'ve already answered this in the documents section, we\'ll suggest that answer here — but you can tailor it for a website audience.', prefillFrom: 'q61_differentiator' },
      { id: 'wc_problems_solved', questionNumber: 'WC10', label: 'What problems do you solve for your clients?', type: 'long_text', required: true, placeholder: 'What pain points or frustrations bring them to you? e.g. "They\'re drowning in paperwork, afraid of getting fined for non-compliance, and spending evenings on admin instead of with their family."', prefillFrom: 'q13_what_you_do' },
      { id: 'wc_visitor_feeling', questionNumber: 'WC11', label: 'How do you want visitors to feel when they land on your website?', type: 'multi_select', required: true, maxSelections: 3, options: ['Confident', 'Inspired', 'Reassured', 'Curious', 'Excited', 'Informed', 'Supported'] },

      // ── Visual and Brand Preferences (Website-Specific) ──
      { id: 'wc_colour_preferences', questionNumber: 'WC12', label: 'What are your colour scheme preferences for the website?', type: 'long_text', required: false, placeholder: 'Describe colours, moods, or paste hex codes. e.g. "Deep navy and warm gold — professional but not stuffy" or "#1B3F7A, #F0C040, #FAFBFC."', prefillFrom: 'q67_brand_colours', helpText: 'This is more detailed than the brand colours question earlier — tell us how you want colours to work on screen.' },
      { id: 'wc_colour_palette_style', questionNumber: 'WC13', label: 'What colour palette style appeals to you?', type: 'single_choice', required: false, options: ['Bold and vibrant', 'Clean and minimal', 'Warm and earthy', 'Dark and premium', 'Pastel / soft', 'I have specific brand colours'] },
      { id: 'wc_font_style', questionNumber: 'WC14', label: 'What font style do you prefer?', type: 'single_choice', required: true, options: ['Modern sans-serif', 'Classic serif', 'Friendly rounded', 'Minimal / tech', 'No preference'] },
      { id: 'wc_imagery_style', questionNumber: 'WC15', label: 'What imagery style suits your brand?', type: 'single_choice', required: true, options: ['Photography-led', 'Illustration-led', 'Minimal / icons', 'Mix of both', 'No preference'] },
      { id: 'wc_logo_placement', questionNumber: 'WC16', label: 'Where should your logo sit?', type: 'single_choice', required: false, options: ['Top left', 'Top centre', 'No preference'] },
      { id: 'wc_has_brand_guidelines', questionNumber: 'WC17', label: 'Do you have brand guidelines?', type: 'single_choice', required: true, options: ['Yes', 'No', 'Partially'] },
      { id: 'wc_brand_guidelines_upload', questionNumber: 'WC18', label: 'Upload your brand guidelines.', type: 'file_upload', required: false, conditionalOn: { field: 'wc_has_brand_guidelines', value: ['Yes', 'Partially'] }, helpText: 'PDF or PNG preferred. This helps us match your existing visual identity.' },
      { id: 'wc_logo_upload', questionNumber: 'WC18a', label: 'Upload your logo file for the website.', type: 'file_upload', required: false, conditionalOn: { field: 'q65_has_logo', value: 'Yes' }, helpText: 'Upload your logo file here (PNG or SVG preferred). This will be used on your website.' },

      // ── Competitor and Inspiration ──
      { id: 'wc_competitor_urls', questionNumber: 'WC19', label: 'Are there competitor or fellow business websites you\'d like us to reference?', type: 'long_text', required: false, placeholder: 'Paste URLs of similar businesses. We\'ll study how they position themselves — not to copy, but to differentiate you.' },
      { id: 'wc_disliked_urls', questionNumber: 'WC20', label: 'Are there websites you actively do NOT like? Paste the URLs and tell us why.', type: 'long_text', required: false, placeholder: 'e.g. "example.com — too cluttered and aggressive" or "example.co.uk — feels cold and corporate." Helps us avoid what you hate.' },
      { id: 'wc_forms_needed', questionNumber: 'WC21', label: 'Do you need any forms on your website?', type: 'multi_select', required: false, options: ['Contact form', 'Newsletter signup', 'Booking / scheduling', 'Quote request', 'File upload', 'No forms needed'] },
      { id: 'wc_legal_pages', questionNumber: 'WC23', label: 'Do you need any specific legal pages on your website?', type: 'multi_select', required: true, options: ['Privacy Policy', 'Terms and Conditions', 'Cookie Policy', 'Disclaimer', 'Accessibility Statement', 'None needed'] },

      // ── Content You Already Have ──
      { id: 'wc_existing_copy_upload', questionNumber: 'WC25', label: 'Upload any existing website copy you\'d like us to reference.', type: 'file_upload', required: false, helpText: 'If you have draft copy, an old website, or notes — upload them here so we can build on what you have.' },
      { id: 'wc_existing_images_upload', questionNumber: 'WC26', label: 'Upload any existing images or photos you want to use on the website.', type: 'file_upload', required: false, helpText: 'Professional headshots, product photos, workspace shots. If you don\'t have any, we\'ll write copy that works with stock imagery.' },

      // ── WEBSITE-SPECIFIC PRICING & PAYMENT FIELDS ──
      { id: 'wc_show_pricing_on_website', questionNumber: 'WC48', label: 'Do you want to display pricing information on your website?', type: 'single_choice', required: true, options: ['Yes — show starting prices', 'Yes — show full pricing details', 'No — use "Get a quote" approach', 'Not sure yet'], helpText: 'This determines how your Services or Pricing page will be structured.' },
      { id: 'wc_pricing_text', questionNumber: 'WC49', label: 'What pricing text should appear on your website?', type: 'long_text', required: false, placeholder: 'e.g. "Services starting from £X" or "Monthly packages from £X" or "Hourly rate: £X"', conditionalOn: { field: 'wc_show_pricing_on_website', value: ['Yes — show starting prices', 'Yes — show full pricing details'] }, helpText: 'Enter the specific prices or price ranges you want displayed.' },
      { id: 'wc_payment_methods_display', questionNumber: 'WC50', label: 'Which payment methods should be shown on your website?', type: 'multi_select', required: false, options: ['Bank transfer (BACS)', 'Credit/Debit card', 'PayPal', 'Direct Debit', 'Cash', 'Payment plans available', 'Not applicable'], helpText: 'Select all payment methods you accept and want to advertise.' },
      { id: 'wc_bank_details_for_website', questionNumber: 'WC51', label: 'If showing bank transfer, what details should appear?', type: 'long_text', required: false, placeholder: 'Account name, Sort code, Account number. ONLY fill this if you want these details publicly visible on your website.', conditionalOn: { field: 'wc_payment_methods_display', value: 'Bank transfer (BACS)' } },

      // ── WEBSITE-SPECIFIC GDPR & DATA FIELDS ──
      { id: 'wc_website_collects_data', questionNumber: 'WC52', label: 'Will your website collect any personal data from visitors?', type: 'single_choice', required: true, options: ['Yes — via contact forms', 'Yes — via newsletter signup', 'Yes — via both forms and newsletter', 'No — just a brochure website'], helpText: 'This determines what legal pages and cookie notices you need.' },
      { id: 'wc_data_collected_website', questionNumber: 'WC53', label: 'What data will you collect through your website forms?', type: 'multi_select', required: false, options: ['Names', 'Email addresses', 'Phone numbers', 'Business name', 'Service enquiry details', 'Newsletter subscription'], conditionalOn: { field: 'wc_website_collects_data', value: ['Yes — via contact forms', 'Yes — via newsletter signup', 'Yes — via both forms and newsletter'] } },
      { id: 'wc_needs_cookie_consent', questionNumber: 'WC54', label: 'Do you want a cookie consent banner on your website?', type: 'single_choice', required: true, options: ['Yes — required for GDPR compliance', 'No — not needed for my website', 'Not sure'], helpText: 'If you use any analytics or tracking, you need cookie consent.' },
      { id: 'wc_analytics_tools', questionNumber: 'WC55', label: 'Which analytics or tracking tools do you want installed?', type: 'multi_select', required: false, options: ['Google Analytics', 'Meta (Facebook) Pixel', 'Google Tag Manager', 'Hotjar / Heatmaps', 'None needed'], helpText: 'These tools help you understand visitor behaviour.' },

      // ── WEBSITE-SPECIFIC CONTACT & BUSINESS DETAILS ──
      { id: 'wc_show_business_hours', questionNumber: 'WC56', label: 'Do you want to display your business hours on your website?', type: 'single_choice', required: true, options: ['Yes — show my working hours', 'No — just contact options', 'I work flexible hours'], helpText: 'Displayed on the Contact page or footer.' },
      { id: 'wc_business_hours', questionNumber: 'WC57', label: 'What are your business hours?', type: 'long_text', required: false, placeholder: 'e.g. Monday to Friday, 9am to 5pm. Available for calls Tuesday and Thursday afternoons.', conditionalOn: { field: 'wc_show_business_hours', value: 'Yes — show my working hours' } },
      { id: 'wc_phone_on_website', questionNumber: 'WC58', label: 'Do you want your phone number displayed on the website?', type: 'single_choice', required: true, options: ['Yes — show phone number', 'No — email and forms only', 'Contact via Calendly/booking only'] },
      { id: 'wc_email_display', questionNumber: 'WC59', label: 'What email address should be shown on your website?', type: 'email', required: false, placeholder: 'e.g. hello@yourbusiness.co.uk', prefillFrom: 'q7_document_email', helpText: 'This will be publicly visible. Leave blank if you prefer a contact form only.' },
      { id: 'wc_address_on_website', questionNumber: 'WC60', label: 'Do you want your business address displayed on the website?', type: 'single_choice', required: true, options: ['Yes — show full address', 'Show city/region only', 'No address shown'], helpText: 'Some businesses prefer not to show their home address.' },

      // ── WEBSITE-SPECIFIC SOCIAL MEDIA & LINKS ──
      { id: 'wc_show_social_links', questionNumber: 'WC61', label: 'Do you want social media links displayed on your website?', type: 'single_choice', required: true, options: ['Yes — in header and footer', 'Yes — in footer only', 'Yes — on Contact page only', 'No — not needed'] },
      { id: 'wc_social_links_to_show', questionNumber: 'WC62', label: 'Which social media profiles do you want linked?', type: 'multi_select', required: false, options: ['LinkedIn', 'Instagram', 'Facebook', 'X (Twitter)', 'TikTok', 'Pinterest', 'YouTube'], conditionalOn: { field: 'wc_show_social_links', value: ['Yes — in header and footer', 'Yes — in footer only', 'Yes — on Contact page only'] } },
      { id: 'wc_linkedin_url', questionNumber: 'WC63', label: 'What is your LinkedIn profile URL?', type: 'url', required: false, placeholder: 'e.g. linkedin.com/in/yourname', conditionalOn: { field: 'wc_social_links_to_show', value: 'LinkedIn' } },
      { id: 'wc_instagram_url', questionNumber: 'WC64', label: 'What is your Instagram profile URL?', type: 'url', required: false, placeholder: 'e.g. instagram.com/yourbusiness', conditionalOn: { field: 'wc_social_links_to_show', value: 'Instagram' } },
      { id: 'wc_facebook_url', questionNumber: 'WC65', label: 'What is your Facebook page URL?', type: 'url', required: false, placeholder: 'e.g. facebook.com/yourbusiness', conditionalOn: { field: 'wc_social_links_to_show', value: 'Facebook' } },

      // ── TESTIMONIALS & CREDENTIALS FOR WEBSITE ──
      { id: 'wc_testimonials', questionNumber: 'WC22', label: 'What testimonials or reviews do you want to include on your website?', type: 'long_text', required: false, placeholder: 'Paste any testimonials you\'d like us to incorporate. Include the client name and context if possible.' },
      { id: 'wc_testimonials_count', questionNumber: 'WC66', label: 'How many testimonials do you want displayed?', type: 'single_choice', required: true, options: ['3-5 testimonials', '6-8 testimonials', 'More than 8', 'Just feature one or two prominently'], helpText: 'We can always add more later.' },
      { id: 'wc_credentials_to_show', questionNumber: 'WC67', label: 'What credentials, certifications, or memberships should be displayed?', type: 'long_text', required: false, placeholder: 'e.g. "ICB Certified Bookkeeper", "Member of VA Association", "Xero Certified Advisor"', helpText: 'These build trust and credibility on your website.' },
      { id: 'wc_awards_or_press', questionNumber: 'WC68', label: 'Any awards, press mentions, or notable achievements to feature?', type: 'long_text', required: false, placeholder: 'e.g. "Featured in XYZ Magazine", "Winner of ABC Award 2024"' },

      // ── ADDITIONAL WEBSITE FEATURES ──
      { id: 'wc_booking_tool', questionNumber: 'WC69', label: 'Do you use an online booking/scheduling tool?', type: 'single_choice', required: true, options: ['Yes — Calendly', 'Yes — Cal.com', 'Yes — another tool', 'No — I don\'t use one', 'I want one set up'], helpText: 'If you use Calendly or similar, we can integrate it into your website.' },
      { id: 'wc_booking_url', questionNumber: 'WC70', label: 'What is your booking/scheduling link?', type: 'url', required: false, placeholder: 'e.g. calendly.com/yourname', conditionalOn: { field: 'wc_booking_tool', value: ['Yes — Calendly', 'Yes — Cal.com', 'Yes — another tool'] } },
      { id: 'wc_newsletter_signup', questionNumber: 'WC71', label: 'Do you want a newsletter signup form on your website?', type: 'single_choice', required: true, options: ['Yes — I have a mailing list', 'No — not needed', 'I want to set one up'], helpText: 'Good for building your audience.' },
      { id: 'wc_newsletter_platform', questionNumber: 'WC72', label: 'What newsletter/email marketing platform do you use?', type: 'short_text', required: false, placeholder: 'e.g. Mailchimp, ConvertKit, Flodesk, Substack', conditionalOn: { field: 'wc_newsletter_signup', value: 'Yes — I have a mailing list' } },

      // ── PAGE-SPECIFIC QUESTIONS (Optional customisation hints) ──
      // Homepage
      { id: 'wc_homepage_sections', questionNumber: 'WC28', label: 'What sections do you want on your Homepage?', type: 'multi_select', required: false, options: ['Hero banner', 'About preview', 'Services overview', 'Testimonials', 'FAQ preview', 'Latest blog posts', 'Newsletter signup', 'Contact CTA'], helpText: 'Optional — tell us if you have specific preferences, otherwise we\'ll use a standard structure.' },
      { id: 'wc_homepage_cta_style', questionNumber: 'WC29', label: 'What style of call-to-action do you prefer on your Homepage?', type: 'multi_select', required: false, options: ['Single prominent button', 'Multiple CTA buttons', 'Soft CTA with contact link', 'No preference'] },

      // About page
      { id: 'wc_about_focus', questionNumber: 'WC30', label: 'What should your About page focus on?', type: 'multi_select', required: false, options: ['Your story and journey', 'Your qualifications and experience', 'Your approach and methodology', 'Your values and mission', 'Personal side / hobbies', 'Team members (if any)'], helpText: 'Select what matters most for connecting with your audience.' },
      { id: 'wc_about_tone', questionNumber: 'WC31', label: 'What tone should your About page have?', type: 'single_choice', required: false, options: ['Professional and formal', 'Warm and personal', 'Story-driven and engaging', 'No preference'] },

      // Services page
      { id: 'wc_services_format', questionNumber: 'WC32', label: 'How should your services be presented?', type: 'single_choice', required: false, options: ['Card/tile format with icons', 'List format with descriptions', 'Table format with pricing', 'Mixed format', 'No preference'] },
      { id: 'wc_services_show_pricing', questionNumber: 'WC33', label: 'Do you want to display pricing on your Services page?', type: 'single_choice', required: false, options: ['Yes — show starting prices', 'Yes — show full pricing', 'No — use "Get a quote" or contact CTA', 'Not sure yet'] },
      { id: 'wc_services_cta', questionNumber: 'WC34', label: 'What should each service card link to?', type: 'single_choice', required: false, options: ['Contact page', 'Booking/scheduling tool', 'Individual service detail page', 'Enquiry form', 'No preference'] },

      // Contact page
      { id: 'wc_contact_method', questionNumber: 'WC35', label: 'How should visitors contact you?', type: 'multi_select', required: false, options: ['Contact form', 'Direct email link', 'Phone number', 'Calendar/booking link', 'Social media links'], helpText: 'Select all that apply. We recommend at least 2 contact options.' },
      { id: 'wc_contact_form_fields', questionNumber: 'WC36', label: 'What fields should your contact form have?', type: 'multi_select', required: false, options: ['Name', 'Email', 'Phone (optional)', 'Service interested in', 'Message', 'How did you hear about us?', 'Preferred contact method'], helpText: 'Only needed if you selected "Contact form" above.' },

      // FAQ page
      { id: 'wc_faq_topics', questionNumber: 'WC38', label: 'What topics should your FAQ cover?', type: 'long_text', required: false, placeholder: 'e.g. Common questions about pricing, process, delivery times, what\'s included, how it works...', helpText: 'We\'ll craft questions and answers that address common concerns and objections.' },
      { id: 'wc_faq_count', questionNumber: 'WC39', label: 'How many FAQs do you want?', type: 'single_choice', required: false, options: ['5-6 questions', '8-10 questions', '12+ questions', 'No preference — we\'ll decide'] },

      // Blog page
      { id: 'wc_blog_style', questionNumber: 'WC40', label: 'What style should your Blog page have?', type: 'single_choice', required: false, options: ['Card grid with images', 'List format', 'Magazine style', 'Minimal text-only', 'No preference'] },
      { id: 'wc_blog_categories', questionNumber: 'WC41', label: 'What blog categories or topics do you plan to write about?', type: 'long_text', required: false, placeholder: 'e.g. Industry tips, Case studies, How-to guides, Client stories, Business advice...', helpText: 'Helps us structure the blog layout and navigation.' },

      // Portfolio/Case Studies page
      { id: 'wc_portfolio_format', questionNumber: 'WC42', label: 'How should your Portfolio/Case Studies be displayed?', type: 'single_choice', required: false, options: ['Grid of images with titles', 'Cards with project summaries', 'Before/after format', 'Detailed case study pages', 'No preference'] },
      { id: 'wc_portfolio_projects', questionNumber: 'WC43', label: 'Briefly describe 2-3 projects or case studies you want to feature.', type: 'long_text', required: false, placeholder: 'Client name (or anonymous), what they needed, what you delivered, the outcome...', helpText: 'We\'ll write them up professionally based on these notes.' },

      // Pricing page
      { id: 'wc_pricing_display', questionNumber: 'WC44', label: 'How should your pricing be displayed?', type: 'single_choice', required: false, options: ['Tiered packages (e.g. Basic/Pro/Premium)', 'Per-service list', 'Starting from prices with "Get quote" CTA', 'Custom quote only', 'No preference'] },
      { id: 'wc_pricing_highlights', questionNumber: 'WC45', label: 'What should stand out about your pricing?', type: 'long_text', required: false, placeholder: 'e.g. "Transparent, no hidden fees", "Flexible payment plans available", "Most popular package is..."' },

      // Testimonials page
      { id: 'wc_testimonials_format', questionNumber: 'WC46', label: 'How should testimonials be displayed?', type: 'single_choice', required: false, options: ['Quote cards with photos', 'Carousel/slider', 'Simple list', 'Video testimonials', 'Mixed formats', 'No preference'] },
      { id: 'wc_testimonials_featured', questionNumber: 'WC47', label: 'Do you have any testimonials you want featured prominently?', type: 'long_text', required: false, placeholder: 'Paste the full testimonial text and tell us why it stands out.' },
      { id: 'website_copy_notes', questionNumber: 'WC47b', label: 'Additional notes for this section', type: 'long_text', required: false, placeholder: 'Any additional details about your website that didn\'t fit above...', helpText: 'Optional — add any extra context about your website vision.' },
    ],
    serviceTags: ['website_copy_pack'],
    sortOrder: 110,
  },

  // ── SECTION 12 — SOCIAL MEDIA PACK ──
  {
    id: 'social_media',
    title: 'Social Media Content Strategy',
    description: 'Tell us how you want your social media to look, sound, and feel. The more detail you give us, the more tailored and effective your posts will be.',
    usedIn: 'Social Media Starter Pack',
    fields: [
      { id: 'sm1_platforms', questionNumber: 'SM1', label: 'Which platforms are you focusing on right now?', type: 'multi_select', required: true, options: ['LinkedIn', 'Instagram', 'TikTok', 'Facebook', 'X (Twitter)', 'Pinterest', 'Other'], hasOtherOption: true },
      { id: 'sm2_content_types', questionNumber: 'SM2', label: 'What type of content do you want? Select everything that fits your brand.', type: 'multi_select', required: true, options: ['Educational — teach your audience something useful', 'Personal / behind-the-scenes — show the human behind the business', 'Authority / expert — position you as the go-to in your niche', 'Promotional — direct sells and offers', 'Storytelling — client wins, your journey, case studies', 'Inspirational / motivational', 'Relatable / humorous'] },
      { id: 'sm3_avoid_topics', questionNumber: 'SM3', label: 'Are there any topics, clients, or personal details you NEVER want mentioned publicly?', type: 'long_text', required: false, placeholder: 'e.g. Don\'t reference my previous employer. Don\'t use my children\'s names or images.' },
      { id: 'sm4_posting_frequency', questionNumber: 'SM4', label: 'How often do you want to post?', type: 'single_choice', required: true, options: ['3x/week', '5x/week', 'Daily', '2x/day', 'Not sure'], helpText: 'This helps us plan the right volume and variety of content for you.' },
      { id: 'sm5_content_pillars', questionNumber: 'SM5', label: 'What are your main content pillars? These are the recurring topics your content will revolve around.', type: 'long_text', required: true, placeholder: 'e.g. Tips and tutorials, Client success stories, Behind-the-scenes of running my business, Industry news and commentary', helpText: 'Think of 3-5 broad themes. Everything you post should fall under one of these pillars.' },
      { id: 'sm6_personal_boundaries', questionNumber: 'SM6', label: 'What personal details are OK to share versus off-limits?', type: 'long_text', required: true, placeholder: 'e.g. OK to share my first name and general location. Not OK to share my children\'s names, home address, or previous employer details.', helpText: 'This keeps your content authentic without crossing any lines you\'re not comfortable with.' },
      { id: 'sm7_hashtag_strategy', questionNumber: 'SM7', label: 'What hashtag strategy do you prefer?', type: 'single_choice', required: true, options: ['Broad reach — popular hashtags for maximum visibility', 'Niche targeted — specific hashtags for your ideal audience', 'Mixed — a combination of both', 'No preference — let us decide'], helpText: 'Broad hashtags get more eyes. Niche hashtags attract the right people. Most businesses benefit from a mix.' },
      { id: 'sm8_competitor_accounts', questionNumber: 'SM8', label: 'Are there competitor or fellow business accounts whose content you admire?', type: 'long_text', required: false, placeholder: 'Paste URLs or @handles. e.g. @janedoe_design on Instagram, linkedin.com/company/example. We\'ll study their approach — not to copy, but to understand what resonates with you.' },
      { id: 'sm9_content_tone', questionNumber: 'SM9', label: 'Should your social media tone match your overall brand voice, or be different?', type: 'single_choice', required: true, options: ['Same as overall brand tone', 'More casual/personal', 'More professional', 'More promotional'], prefillFrom: 'q62_tone_of_voice', helpText: 'Social media often works best with a slightly more relaxed tone, but it depends on your audience and platform.' },
      { id: 'sm10_call_to_action', questionNumber: 'SM10', label: 'What should your social media posts drive people to do?', type: 'long_text', required: false, placeholder: 'e.g. Book a discovery call, Sign up for my newsletter, Download my free guide, DM me for details, Visit my website', helpText: 'Every post should have a purpose. What action do you want readers to take most often?' },
      { id: 'sm11_existing_accounts', questionNumber: 'SM11', label: 'List your existing social media accounts and approximate follower counts.', type: 'long_text', required: false, placeholder: 'e.g. Instagram @janesmith 2.3K followers, LinkedIn /in/janesmith 500+ connections, TikTok @janesmith 150 followers' },
      { id: 'sm12_content_calendar', questionNumber: 'SM12', label: 'How should your content calendar be structured?', type: 'single_choice', required: true, options: ['Weekly themed — each week has a focus topic', 'Rotating pillars — cycle through your content pillars evenly', 'Mix of types — vary educational, personal, and promotional posts', 'No preference — let us decide'], helpText: 'This affects how we plan and organise your 30 posts.' },
      { id: 'sm13_upcoming_launches', questionNumber: 'SM13', label: 'Do you have any upcoming launches, events, or seasonal moments you want featured in your posts?', type: 'long_text', required: false, placeholder: 'e.g. Launching a new service in July, Speaking at an event in September, Running a Black Friday promotion, Celebrating my business anniversary in October' },
      { id: 'social_media_notes', questionNumber: 'SM13b', label: 'Additional notes for this section', type: 'long_text', required: false, placeholder: 'Any additional details about your social media content that didn\'t fit above...', helpText: 'Optional — add any extra context about your social media goals.' },
    ],
    serviceTags: ['social_media_pack'],
    sortOrder: 120,
  },

  // ── SECTION 13 — CLIENT ONBOARDING & SCOPE CONTROL ──
  {
    id: 'client_onboarding',
    title: 'Client Onboarding & Scope Control',
    description: 'Help us understand how you onboard clients and manage project scope so your documents reflect your real working process.',
    usedIn: 'Client Onboarding Questionnaire, Scope of Work Document, Project Brief Template, Change Request Form, Onboarding Checklist, Communication Protocols, Welcome Packet Guide, Feedback & Closing Questionnaire',
    fields: [
      { id: 'co1_onboarding_style', questionNumber: 'CO1', label: 'How do you currently onboard a new client? Walk us through your process from "yes" to starting work.', type: 'long_text', required: true, placeholder: 'e.g. I send a contract, take a deposit, hold a kick-off call, then share a project brief document before we begin.' },
      { id: 'co2_onboarding_pain_points', questionNumber: 'CO2', label: 'What are the most common problems or misunderstandings that occur at the start of a project?', type: 'long_text', required: true, placeholder: 'e.g. Clients not knowing what they need to provide upfront, unclear expectations about timelines, scope expanding without warning.' },
      { id: 'co3_scope_creep_experience', questionNumber: 'CO3', label: 'Have you experienced scope creep — clients asking for significantly more than originally agreed?', type: 'single_choice', required: true, options: ['Yes — frequently', 'Yes — occasionally', 'Rarely', 'Never'] },
      { id: 'co4_scope_creep_detail', questionNumber: 'CO4', label: 'Describe what typically happens when a client tries to expand the scope beyond the original agreement.', type: 'long_text', required: false, placeholder: 'What do they ask for? How do you currently handle it? What outcome do you want these documents to achieve?', conditionalOn: { field: 'co3_scope_creep_experience', value: ['Yes — frequently', 'Yes — occasionally'] } },
      { id: 'co5_communication_channels', questionNumber: 'CO5', label: 'What communication channels do you use with clients?', type: 'multi_select', required: true, options: ['Email', 'WhatsApp / SMS', 'Phone calls', 'Video calls (Zoom / Teams / Meet)', 'Project management tool (e.g. Trello, Asana, ClickUp)', 'Client portal', 'Slack'], hasOtherOption: true },
      { id: 'co6_response_time_expectation', questionNumber: 'CO6', label: 'What response time commitment do you want to formalise with clients?', type: 'single_choice', required: true, options: ['Same business day', 'Within 24 hours', 'Within 48 hours', 'Within 3 business days', 'By end of working week'] },
      { id: 'co7_client_provides', questionNumber: 'CO7', label: 'What must a client typically provide before you can begin work?', type: 'long_text', required: true, placeholder: 'e.g. Completed brief document, brand assets, access to relevant platforms, payment of deposit, signed contract.' },
      { id: 'co8_kickoff_format', questionNumber: 'CO8', label: 'Do you hold a kick-off meeting or call before starting work?', type: 'single_choice', required: true, options: ['Yes — always', 'Yes — for larger projects', 'No — I start from the brief only'] },
      { id: 'co9_revision_policy', questionNumber: 'CO9', label: 'How many rounds of revisions do you offer as standard, and what happens if a client wants more?', type: 'long_text', required: true, placeholder: 'e.g. Two rounds of revisions are included. Additional rounds are charged at my hourly rate.' },
      { id: 'co10_closing_process', questionNumber: 'CO10', label: 'How do you currently close out a project or engagement?', type: 'long_text', required: false, placeholder: 'e.g. Final invoice, sign-off email, request for testimonial, offboarding document.' },
      { id: 'client_onboarding_notes', questionNumber: 'CO10b', label: 'Additional notes for this section', type: 'long_text', required: false, placeholder: 'Any additional details about your client onboarding process...', helpText: 'Optional — add any extra context.' },
    ],
    serviceTags: ['client_onboarding_pack'],
    sortOrder: 85,
  },

  // ── SECTION 14 — PAYMENT PROTECTION ──
  {
    id: 'payment_protection',
    title: 'Payment Protection',
    description: 'We need to understand your payment situation in detail so your documents provide the strongest possible protection.',
    usedIn: 'Invoice Terms & Conditions, Late Payment Policy, Payment Schedule Template, Refund & Cancellation Policy, Deposit & Cancellation Terms, Payment Tracking Template, Chasing Payment Scripts, Chargeback Response Templates',
    fields: [
      { id: 'pp1_late_payment_experience', questionNumber: 'PP1', label: 'Have you ever experienced a client who did not pay — or paid very late?', type: 'single_choice', required: true, options: ['Yes — more than once', 'Yes — once', 'Not yet, but I\'m worried about it', 'No, never'] },
      { id: 'pp2_late_payment_detail', questionNumber: 'PP2', label: 'Describe what happened in your worst payment experience.', type: 'long_text', required: false, placeholder: 'What was the amount? What stage was the project at? What did you do? What was the outcome?', conditionalOn: { field: 'pp1_late_payment_experience', value: ['Yes — more than once', 'Yes — once'] } },
      { id: 'pp3_deposit_percentage', questionNumber: 'PP3', label: 'What percentage deposit do you take — or want to take — before starting work?', type: 'single_choice', required: true, options: ['100% upfront', '50% upfront', '33% upfront', '25% upfront', 'No deposit — I invoice on completion', 'It varies by project'] },
      { id: 'pp4_deposit_non_refundable', questionNumber: 'PP4', label: 'Is your deposit non-refundable?', type: 'single_choice', required: true, options: ['Yes — fully non-refundable', 'Partially refundable depending on notice given', 'Fully refundable if cancelled before work starts', 'Not sure — I\'d like guidance'] },
      { id: 'pp5_invoice_due_days', questionNumber: 'PP5', label: 'How many days do clients have to pay your invoices?', type: 'single_choice', required: true, options: ['Due on receipt', '7 days', '14 days', '30 days', 'Custom — I\'ll explain below'] },
      { id: 'pp6_invoice_due_custom', questionNumber: 'PP6', label: 'Describe your custom payment terms.', type: 'long_text', required: false, placeholder: 'e.g. 50% on project start, 25% at midpoint, 25% on delivery within 7 days.', conditionalOn: { field: 'pp5_invoice_due_days', value: 'Custom — I\'ll explain below' } },
      { id: 'pp7_late_payment_interest', questionNumber: 'PP7', label: 'Do you want statutory late payment interest included in your documents?', type: 'single_choice', required: true, options: ['Yes — include 8% above Bank of England base rate', 'No — I prefer a flat daily charge', 'No — I don\'t want to charge interest'], default: 'Yes — include 8% above Bank of England base rate', helpText: 'Under the Late Payment of Commercial Debts Act 1998, you are legally entitled to charge 8% above the Bank of England base rate on overdue invoices from business clients.' },
      { id: 'pp8_chargeback_experience', questionNumber: 'PP8', label: 'Have you ever had a client raise a chargeback or payment dispute through their bank or PayPal?', type: 'single_choice', required: true, options: ['Yes', 'No'] },
      { id: 'pp9_chargeback_detail', questionNumber: 'PP9', label: 'What happened in that dispute, and what evidence did you have?', type: 'long_text', required: false, placeholder: 'We\'ll build your chargeback response templates around the specific evidence types that will be most useful in your situation.', conditionalOn: { field: 'pp8_chargeback_experience', value: 'Yes' } },
      { id: 'pp10_work_stoppage_policy', questionNumber: 'PP10', label: 'Do you want the right to pause or stop work if payment is overdue?', type: 'single_choice', required: true, options: ['Yes — I want clear rights to pause work', 'Yes — and the right to terminate the contract', 'No — I prefer to continue and chase separately'], helpText: 'Having an explicit work suspension clause significantly strengthens your position in disputes.' },
      { id: 'payment_protection_notes', questionNumber: 'PP10b', label: 'Additional notes for this section', type: 'long_text', required: false, placeholder: 'Any additional details about your payment situation...', helpText: 'Optional — add any extra context.' },
    ],
    serviceTags: ['payment_protection_pack'],
    sortOrder: 86,
  },

  // ── SECTION 15 — COPYRIGHT & LICENSING ──
  {
    id: 'copyright_licensing',
    title: 'Copyright & Licensing',
    description: 'Help us understand how you create, own, and licence your work so your IP documents are precisely calibrated to your situation.',
    usedIn: 'Copyright Notice & IP Policy, Content Licensing Agreement, Image & Media Usage Rights, Work-for-Hire Agreement, Brand Usage Guidelines, NDA, IP Assignment Agreement, Cease & Desist Template',
    fields: [
      { id: 'cl1_deliverable_types', questionNumber: 'CL1', label: 'What types of work or content do you create and deliver to clients?', type: 'multi_select', required: true, options: ['Written content (copy, articles, reports)', 'Graphic design or visual assets', 'Photographs or video', 'Software or code', 'Presentations or slide decks', 'Strategic frameworks or methodologies', 'Training materials or courses', 'Audio content or podcasts', 'Social media content'], hasOtherOption: true },
      { id: 'cl2_ip_ownership_preference', questionNumber: 'CL2', label: 'When you deliver work to a client, who should own the intellectual property?', type: 'single_choice', required: true, options: ['I retain copyright — I licence the work to the client for agreed uses', 'The client owns all rights on full payment', 'I retain copyright until paid in full, then transfer', 'It depends on the type of work — I\'ll explain below'] },
      { id: 'cl3_ip_ownership_detail', questionNumber: 'CL3', label: 'Explain the different IP ownership arrangements for different types of work you produce.', type: 'long_text', required: false, placeholder: 'e.g. For brand strategy documents I retain a licence. For custom software I assign rights on final payment.', conditionalOn: { field: 'cl2_ip_ownership_preference', value: 'It depends on the type of work — I\'ll explain below' } },
      { id: 'cl4_licence_scope', questionNumber: 'CL4', label: 'When you licence work to clients rather than assigning rights, what usage are you comfortable with?', type: 'multi_select', required: true, options: ['Use on client\'s own website', 'Use in client\'s printed materials', 'Use in client\'s social media', 'Resale or sublicensing to third parties', 'Use in advertising campaigns', 'Use in publications or broadcast media', 'Internal business use only'] },
      { id: 'cl5_uses_third_party_content', questionNumber: 'CL5', label: 'Do you ever incorporate third-party content, stock images, or licensed materials into your deliverables?', type: 'single_choice', required: true, options: ['Yes — regularly', 'Yes — occasionally', 'No'] },
      { id: 'cl6_third_party_detail', questionNumber: 'CL6', label: 'Describe what third-party content you use and the licence terms you operate under.', type: 'long_text', required: false, placeholder: 'e.g. I use Unsplash images (CC0 licence) and occasionally licensed stock from Shutterstock.', conditionalOn: { field: 'cl5_uses_third_party_content', value: ['Yes — regularly', 'Yes — occasionally'] } },
      { id: 'cl7_nda_needed', questionNumber: 'CL7', label: 'Do you share confidential information with clients — or receive confidential information from them — that requires NDA protection?', type: 'single_choice', required: true, options: ['Yes — regularly', 'Yes — for sensitive projects', 'Occasionally', 'No'] },
      { id: 'cl8_nda_type', questionNumber: 'CL8', label: 'What type of NDA do you need?', type: 'single_choice', required: false, options: ['Mutual — both parties agree to protect each other\'s information', 'One-way — client protects my information only', 'One-way — I protect client\'s information only', 'Not sure'], conditionalOn: { field: 'cl7_nda_needed', value: ['Yes — regularly', 'Yes — for sensitive projects', 'Occasionally'] } },
      { id: 'cl9_portfolio_right', questionNumber: 'CL9', label: 'Do you want the right to showcase client work in your portfolio?', type: 'single_choice', required: true, options: ['Yes — always', 'Yes — with client approval first', 'No — I prefer to keep client work confidential'] },
      { id: 'cl10_ip_infringement_experience', questionNumber: 'CL10', label: 'Has anyone ever used your work without permission, or have you had an IP dispute?', type: 'single_choice', required: true, options: ['Yes', 'No'] },
      { id: 'cl11_infringement_detail', questionNumber: 'CL11', label: 'Describe what happened.', type: 'long_text', required: false, placeholder: 'This helps us tailor your cease and desist template and IP protection language.', conditionalOn: { field: 'cl10_ip_infringement_experience', value: 'Yes' } },
      { id: 'copyright_licensing_notes', questionNumber: 'CL11b', label: 'Additional notes for this section', type: 'long_text', required: false, placeholder: 'Any additional details about your intellectual property situation...', helpText: 'Optional — add any extra context.' },
    ],
    serviceTags: ['copyright_licensing_pack'],
    sortOrder: 87,
  },

  // ── SECTION 16 — GDPR DEEP ──
  {
    id: 'gdpr_deep',
    title: 'GDPR Deep Compliance',
    description: 'This section goes beyond the basic privacy policy to build your full UK GDPR compliance framework. Every question here shapes a specific compliance document.',
    usedIn: 'Comprehensive Privacy Policy, Data Retention Schedule, Data Processing Agreement, Cookie Consent Guide, Subject Access Request Template, Data Breach Notification Template, DPIA Template, Marketing Consent Management, Third-Party Data Sharing Agreement',
    fields: [
      { id: 'gd1_lawful_basis', questionNumber: 'GD1', label: 'What is the primary lawful basis you rely on for processing client personal data?', type: 'multi_select', required: true, options: ['Contractual necessity — processing is necessary to perform a contract', 'Legitimate interests — you have a genuine business reason that doesn\'t override individual rights', 'Consent — individuals have actively opted in', 'Legal obligation — you must process data to comply with a law', 'Vital interests — in rare emergency situations', 'Public task — not usually applicable to sole traders'], helpText: 'Most service businesses rely on contractual necessity for client data and legitimate interests for marketing.' },
      { id: 'gd2_data_processor_relationships', questionNumber: 'GD2', label: 'Do you use any third-party services that process personal data on your behalf (data processors)?', type: 'single_choice', required: true, options: ['Yes', 'No'], helpText: 'Examples: your email provider, accounting software, CRM tool, payment processor, cloud storage.' },
      { id: 'gd3_processor_list', questionNumber: 'GD3', label: 'List each data processor you use, what data they process, and their role.', type: 'long_text', required: false, placeholder: 'e.g. Google Workspace — stores client emails and documents. Xero — processes client billing information. Stripe — processes payment card data.', conditionalOn: { field: 'gd2_data_processor_relationships', value: 'Yes' } },
      { id: 'gd4_international_transfers', questionNumber: 'GD4', label: 'Are any of your data processors or third-party tools based outside the UK or EEA?', type: 'single_choice', required: true, options: ['Yes', 'No', 'Not sure'], helpText: 'Many US-based tools (e.g. Mailchimp, HubSpot) process data outside the UK, which requires safeguards.' },
      { id: 'gd5_international_transfer_detail', questionNumber: 'GD5', label: 'Which tools process data outside the UK/EEA, and do you know what safeguards they use?', type: 'long_text', required: false, placeholder: 'e.g. Mailchimp — US-based, uses Standard Contractual Clauses under their DPA.', conditionalOn: { field: 'gd4_international_transfers', value: ['Yes', 'Not sure'] } },
      { id: 'gd6_sar_procedure', questionNumber: 'GD6', label: 'Do you have a procedure for handling Subject Access Requests (SARs)?', type: 'single_choice', required: true, options: ['Yes — a defined process', 'Loosely — I\'d figure it out when it happens', 'No — I need one'], helpText: 'Under UK GDPR, you must respond to SARs within 30 days. The SAR template we create will make this manageable.' },
      { id: 'gd7_breach_procedure', questionNumber: 'GD7', label: 'If you experienced a data breach today, would you know what to do?', type: 'single_choice', required: true, options: ['Yes — I know the 72-hour ICO notification rule', 'Partially — I know I\'d need to report it', 'No — I need clear guidance'], helpText: 'You must report certain breaches to the ICO within 72 hours and notify affected individuals without undue delay.' },
      { id: 'gd8_high_risk_processing', questionNumber: 'GD8', label: 'Do you carry out any of the following higher-risk data processing activities?', type: 'multi_select', required: true, options: ['Systematic profiling of individuals', 'Processing special category data (health, biometric, religion, etc.)', 'Large-scale processing of personal data', 'Processing children\'s data', 'Monitoring individuals\' behaviour', 'None of the above'], helpText: 'High-risk activities may trigger the need for a Data Protection Impact Assessment (DPIA).' },
      { id: 'gd9_consent_management', questionNumber: 'GD9', label: 'How do you currently obtain and record marketing consent?', type: 'single_choice', required: true, options: ['Opt-in tick box on a form', 'Double opt-in email confirmation', 'Verbal consent noted in CRM', 'I don\'t have a formal consent process', 'I don\'t do marketing emails'] },
      { id: 'gd10_retention_clarity', questionNumber: 'GD10', label: 'Do you have different retention periods for different types of data?', type: 'single_choice', required: true, options: ['Yes — financial records kept longer than general correspondence', 'No — I keep everything the same amount of time', 'Not sure — I\'d like guidance'], helpText: 'HMRC requires 6 years for financial records. Other data may have different legal or practical retention requirements.' },
      { id: 'gdpr_deep_notes', questionNumber: 'GD10b', label: 'Additional notes for this section', type: 'long_text', required: false, placeholder: 'Any additional details about your data protection situation...', helpText: 'Optional — add any extra context.' },
    ],
    serviceTags: ['gdpr_deep_pack'],
    sortOrder: 88,
  },

  // ── SECTION 17 — COACH INDUSTRY ──
  {
    id: 'industry_coach',
    title: 'Coaching Practice Details',
    description: 'Tell us about your coaching practice so your industry-specific documents reflect your modality, ethical framework, and how you work with clients.',
    usedIn: 'Coaching Agreement, Session Terms & Cancellation Policy, Supervision Policy, CPD Tracker, Coaching Code of Ethics, Client Progress Tracker, Testimonial Request Template',
    fields: [
      { id: 'ic1_coaching_modality', questionNumber: 'IC1', label: 'What type of coaching do you offer?', type: 'multi_select', required: true, options: ['Life coaching', 'Business coaching', 'Executive / leadership coaching', 'Career coaching', 'Health / wellness coaching', 'Mindset coaching', 'Parenting / relationship coaching', 'NLP practitioner', 'Hypnotherapy'], hasOtherOption: true },
      { id: 'ic2_accreditation', questionNumber: 'IC2', label: 'Are you accredited with or a member of a professional coaching body?', type: 'multi_select', required: true, options: ['ICF (International Coaching Federation)', 'EMCC (European Mentoring & Coaching Council)', 'AC (Association for Coaching)', 'CIPD', 'NCFE / Ofqual-accredited qualification', 'None — self-taught / non-accredited', 'Other'], hasOtherOption: true },
      { id: 'ic3_session_format', questionNumber: 'IC3', label: 'How do you deliver your coaching sessions?', type: 'multi_select', required: true, options: ['One-to-one via video call', 'One-to-one in person', 'Group coaching (online)', 'Group coaching (in person)', 'Hybrid', 'Asynchronous (voice notes / messaging only)'] },
      { id: 'ic4_session_length', questionNumber: 'IC4', label: 'What is your standard session length?', type: 'single_choice', required: true, options: ['30 minutes', '45 minutes', '60 minutes', '90 minutes', '120 minutes', 'Varies by programme'] },
      { id: 'ic5_programme_structure', questionNumber: 'IC5', label: 'Do you sell individual sessions, fixed-length programmes, or both?', type: 'single_choice', required: true, options: ['Individual sessions only', 'Fixed programme (e.g. 6-week, 3-month)', 'Both individual and programme options', 'Retainer — ongoing monthly sessions'] },
      { id: 'ic6_programme_detail', questionNumber: 'IC6', label: 'Describe your main coaching programme or offering.', type: 'long_text', required: true, placeholder: 'e.g. 6-session business coaching programme covering goal-setting, strategy, and accountability. Delivered fortnightly over 12 weeks via Zoom.' },
      { id: 'ic7_supervision_arrangement', questionNumber: 'IC7', label: 'Do you attend regular supervision?', type: 'single_choice', required: true, options: ['Yes — monthly or more frequently', 'Yes — quarterly', 'Yes — annually', 'No — I plan to arrange this', 'No — not required in my modality'] },
      { id: 'ic8_cancellation_policy', questionNumber: 'IC8', label: 'How much notice do clients need to give to cancel or reschedule a session without charge?', type: 'single_choice', required: true, options: ['24 hours', '48 hours', '72 hours / 3 days', '5 business days', '7 days'] },
      { id: 'ic9_late_cancellation_fee', questionNumber: 'IC9', label: 'What is your late cancellation or no-show policy?', type: 'single_choice', required: true, options: ['Full session fee charged', '50% of session fee charged', 'Session forfeited from programme', 'No charge — I\'m flexible', 'Depends on the situation'] },
      { id: 'ic10_confidentiality_exceptions', questionNumber: 'IC10', label: 'Are there any circumstances where you would break confidentiality with a client?', type: 'long_text', required: true, placeholder: 'e.g. Risk of harm to self or others, safeguarding concerns involving children, requirement by law. This is standard in coaching ethics and should be stated clearly in your agreement.' },
      { id: 'ic11_cpd_hours', questionNumber: 'IC11', label: 'How many CPD hours per year do you aim to complete, or are required to complete?', type: 'short_text', required: false, placeholder: 'e.g. 30 hours per year (ICF requirement)' },
      { id: 'industry_coach_notes', questionNumber: 'IC11b', label: 'Additional notes for this section', type: 'long_text', required: false, placeholder: 'Any additional details about your coaching practice...', helpText: 'Optional — add any extra context.' },
    ],
    serviceTags: ['coach_industry_pack'],
    sortOrder: 130,
  },

  // ── SECTION 18 — PHOTOGRAPHER INDUSTRY ──
  {
    id: 'industry_photographer',
    title: 'Photography Practice Details',
    description: 'Tell us about your photography business so your documents reflect your specialisation, licensing approach, and delivery process.',
    usedIn: 'Photography Licensing Agreement, Model Release Form, Shot List Template, Delivery Terms & Timeline Policy, Editing Brief Template, Print Release Form, Event Photography Terms',
    fields: [
      { id: 'ip1_photography_specialism', questionNumber: 'IP1', label: 'What type of photography do you specialise in?', type: 'multi_select', required: true, options: ['Wedding photography', 'Portrait photography', 'Commercial / product photography', 'Brand photography', 'Event photography', 'Family / newborn photography', 'Architectural / property photography', 'Fashion photography', 'Headshots'], hasOtherOption: true },
      { id: 'ip2_client_type', questionNumber: 'IP2', label: 'Who are your primary clients?', type: 'multi_select', required: true, options: ['Individuals / consumers', 'Small businesses', 'Agencies', 'Corporate clients', 'Charities / non-profits', 'Wedding couples / families'] },
      { id: 'ip3_licensing_intent', questionNumber: 'IP3', label: 'When you deliver images to a client, how do you handle copyright?', type: 'single_choice', required: true, options: ['I retain copyright and licence images for agreed uses', 'I transfer full copyright to the client on payment', 'I retain copyright but grant unlimited personal use', 'It depends on the project type'] },
      { id: 'ip4_commercial_use', questionNumber: 'IP4', label: 'Do your clients typically use your images for commercial purposes?', type: 'single_choice', required: true, options: ['Yes — primarily commercial use (advertising, marketing, product sales)', 'Mostly personal use with some commercial use', 'No — personal use only (family, portraits, events)'] },
      { id: 'ip5_model_releases_needed', questionNumber: 'IP5', label: 'Do you regularly photograph identifiable people whose images may be used commercially?', type: 'single_choice', required: true, options: ['Yes — models, actors, brand ambassadors', 'Yes — clients\' staff and team members', 'Yes — members of the public at events', 'No — my work primarily features products or environments'] },
      { id: 'ip6_location_releases', questionNumber: 'IP6', label: 'Do you ever shoot in private locations that might require location releases?', type: 'single_choice', required: true, options: ['Yes — regularly', 'Occasionally', 'No — I primarily shoot in my studio or public spaces'] },
      { id: 'ip7_delivery_format', questionNumber: 'IP7', label: 'In what formats do you deliver final images?', type: 'multi_select', required: true, options: ['High-resolution JPEG', 'High-resolution TIFF', 'RAW files', 'Web-optimised JPEG', 'PNG', 'PDF contact sheets', 'Video files'] },
      { id: 'ip8_delivery_timeline', questionNumber: 'IP8', label: 'What is your standard image delivery timeline?', type: 'single_choice', required: true, options: ['Within 48 hours', 'Within 1 week', 'Within 2 weeks', 'Within 3-4 weeks', 'Within 6-8 weeks (e.g. weddings)', 'Varies by project type'] },
      { id: 'ip9_editing_rounds', questionNumber: 'IP9', label: 'How many rounds of editing / selects do clients receive?', type: 'single_choice', required: true, options: ['1 round — final images delivered', '2 rounds — proofs then finals', '3 rounds included', 'Unlimited revisions within agreed scope'] },
      { id: 'ip10_event_cancellation', questionNumber: 'IP10', label: 'What is your cancellation policy for event bookings?', type: 'long_text', required: true, placeholder: 'e.g. Deposit non-refundable. Full fee charged if cancelled within 30 days of the event. Rescheduling allowed once with 60+ days notice.' },
      { id: 'ip11_portfolio_usage', questionNumber: 'IP11', label: 'Do you want the right to use client images in your portfolio and social media?', type: 'single_choice', required: true, options: ['Yes — always, without approval needed', 'Yes — with client approval first', 'No — my work is confidential'] },
      { id: 'industry_photographer_notes', questionNumber: 'IP11b', label: 'Additional notes for this section', type: 'long_text', required: false, placeholder: 'Any additional details about your photography business...', helpText: 'Optional — add any extra context.' },
    ],
    serviceTags: ['photographer_industry_pack'],
    sortOrder: 131,
  },

  // ── SECTION 19 — CONSULTANT INDUSTRY ──
  {
    id: 'industry_consultant',
    title: 'Consulting Practice Details',
    description: 'Tell us about your consulting work so your documents reflect how you structure engagements, deliver value, and protect your methodology.',
    usedIn: 'Consulting Agreement, Consultant NDA, Deliverables Specification, Milestone Tracking Template, Knowledge Transfer Protocol, Consultant Code of Conduct, Engagement Closure Report',
    fields: [
      { id: 'con1_consulting_specialism', questionNumber: 'CON1', label: 'What type of consulting do you provide?', type: 'multi_select', required: true, options: ['Management consulting', 'Strategy consulting', 'Operations consulting', 'IT / technology consulting', 'HR / people consulting', 'Finance / accounting consulting', 'Marketing consulting', 'Sales consulting', 'Change management', 'Compliance / regulatory consulting'], hasOtherOption: true },
      { id: 'con2_engagement_model', questionNumber: 'CON2', label: 'How do you typically structure your consulting engagements?', type: 'single_choice', required: true, options: ['Fixed-scope project with defined deliverables', 'Time and materials — billed hourly or daily', 'Retained advisor — ongoing monthly fee', 'Diagnostic phase then implementation phase', 'Mixed — depends on the client'] },
      { id: 'con3_deliverable_types', questionNumber: 'CON3', label: 'What do you typically deliver to clients?', type: 'multi_select', required: true, options: ['Written reports and recommendations', 'Presentations and slide decks', 'Process documentation', 'Strategic frameworks or models', 'Training and workshops', 'Implementation support', 'Templates and toolkits', 'Systems and technology solutions'], hasOtherOption: true },
      { id: 'con4_methodology', questionNumber: 'CON4', label: 'Do you use a proprietary methodology or framework that you want to protect?', type: 'single_choice', required: true, options: ['Yes — I have a named methodology or framework', 'Yes — I have an approach I\'ve developed but it\'s not formally named', 'No — I use standard consulting approaches'] },
      { id: 'con5_methodology_detail', questionNumber: 'CON5', label: 'Describe your methodology or framework and how you want it protected.', type: 'long_text', required: false, placeholder: 'e.g. I use a 5-stage transformation framework I developed over 15 years. Clients receive the output of applying it, but not the framework documentation itself.', conditionalOn: { field: 'con4_methodology', value: ['Yes — I have a named methodology or framework', 'Yes — I have an approach I\'ve developed but it\'s not formally named'] } },
      { id: 'con6_knowledge_transfer', questionNumber: 'CON6', label: 'At the end of an engagement, how do you transfer knowledge and documentation to the client?', type: 'long_text', required: true, placeholder: 'e.g. Final handover pack including all deliverables, process guides, and a recorded walkthrough call. 30-day support period for follow-up questions.' },
      { id: 'con7_conflicts_of_interest', questionNumber: 'CON7', label: 'Do you ever work with competing businesses simultaneously, and do you need a conflict of interest policy?', type: 'single_choice', required: true, options: ['Yes — I need a clear conflict policy', 'Sometimes — I\'d like guidance on how to handle this', 'No — I only work with one client per sector at a time'] },
      { id: 'con8_milestones', questionNumber: 'CON8', label: 'Do you structure payment around project milestones?', type: 'single_choice', required: true, options: ['Yes — always', 'Yes — for larger projects', 'No — I invoice on a time basis'] },
      { id: 'con9_reporting_frequency', questionNumber: 'CON9', label: 'How often do you report progress to clients?', type: 'single_choice', required: true, options: ['Weekly status updates', 'Fortnightly updates', 'Monthly reports', 'At milestone completion only', 'Ad hoc as needed'] },
      { id: 'con10_acceptance_criteria', questionNumber: 'CON10', label: 'How do clients formally accept your deliverables?', type: 'single_choice', required: true, options: ['Written sign-off via email', 'Formal acceptance form', 'Sign-off meeting then invoice', 'Payment is treated as acceptance', 'I don\'t currently have a formal process'] },
      { id: 'industry_consultant_notes', questionNumber: 'CON10b', label: 'Additional notes for this section', type: 'long_text', required: false, placeholder: 'Any additional details about your consulting practice...', helpText: 'Optional — add any extra context.' },
    ],
    serviceTags: ['consultant_industry_pack'],
    sortOrder: 132,
  },

  // ── SECTION 20 — CONTRACTOR INDUSTRY ──
  {
    id: 'industry_contractor',
    title: 'Contractor / Trade Business Details',
    description: 'Tell us about your trade or contracting business so your H&S documents, risk assessments, and compliance paperwork are accurate and legally sound.',
    usedIn: 'Health & Safety Policy, Risk Assessment Template, Method Statement, COSHH Assessment, Construction Phase Plan, Subcontractor Agreement, Site Induction Checklist, Defect Liability Template',
    fields: [
      { id: 'ct1_trade_type', questionNumber: 'CT1', label: 'What trade or contracting work do you carry out?', type: 'multi_select', required: true, options: ['General builder / construction', 'Electrician', 'Plumber / gas engineer', 'Carpenter / joiner', 'Painter / decorator', 'Plasterer', 'Roofer', 'Landscaper / groundworker', 'HVAC engineer', 'Specialist installer (e.g. flooring, kitchens)'], hasOtherOption: true },
      { id: 'ct2_work_environment', questionNumber: 'CT2', label: 'What type of sites or environments do you work in?', type: 'multi_select', required: true, options: ['Private residential properties', 'Commercial properties', 'Industrial sites', 'Outdoor / open sites', 'Refurbishment projects', 'New build construction', 'Rooftop / at height working', 'Confined spaces', 'Heritage / listed buildings'] },
      { id: 'ct3_employees_subcontractors', questionNumber: 'CT3', label: 'Do you work alone or do you employ staff / use subcontractors?', type: 'single_choice', required: true, options: ['Sole operator — I work alone', 'I use subcontractors on larger jobs', 'I have direct employees', 'Mix of employees and subcontractors'] },
      { id: 'ct4_cdm_exposure', questionNumber: 'CT4', label: 'Do your projects ever fall under the CDM 2015 Regulations?', type: 'single_choice', required: true, options: ['Yes — I work on notifiable construction projects', 'Sometimes — for projects over 30 working days or 500 person-days', 'Rarely — most of my work is smaller domestic jobs', 'I\'m not sure — I\'d like guidance'], helpText: 'CDM 2015 applies to most construction projects. Notifiable projects require F10 notification to the HSE.' },
      { id: 'ct5_hazardous_substances', questionNumber: 'CT5', label: 'Do you work with any hazardous substances or COSHH-regulated materials?', type: 'multi_select', required: true, options: ['Cement / concrete (silica dust)', 'Solvents and adhesives', 'Wood dust (fine or coarse)', 'Lead paint (in older properties)', 'Asbestos (inspection / removal work)', 'Chemical treatments (wood preservatives, pesticides)', 'Welding fumes', 'None of the above'] },
      { id: 'ct6_height_working', questionNumber: 'CT6', label: 'Do you regularly work at height?', type: 'single_choice', required: true, options: ['Yes — regularly (roofing, scaffolding, ladders)', 'Yes — occasionally', 'No — my work is at ground level only'], helpText: 'Work at height above 2 metres requires a specific risk assessment and control measures.' },
      { id: 'ct7_plant_equipment', questionNumber: 'CT7', label: 'Do you operate any of the following plant, machinery, or specialist equipment?', type: 'multi_select', required: true, options: ['Scaffolding', 'Lifting equipment (LOLER-regulated)', 'Power tools (PUWER-regulated)', 'Mini digger or plant machinery', 'Cherry picker / MEWP', 'Pressure washing equipment', 'None of the above'] },
      { id: 'ct8_existing_hs_documentation', questionNumber: 'CT8', label: 'Do you currently have any Health & Safety documentation in place?', type: 'single_choice', required: true, options: ['Yes — a written H&S policy', 'Yes — some risk assessments', 'Yes — method statements for specific jobs', 'No — I don\'t have any formal documentation', 'Partially — some documentation but gaps'] },
      { id: 'ct9_insurance', questionNumber: 'CT9', label: 'What business insurance do you hold?', type: 'multi_select', required: true, options: ['Public liability insurance', 'Employer\'s liability insurance', 'Professional indemnity insurance', 'Plant and equipment insurance', 'Contract works insurance', 'None currently'], helpText: 'Employer\'s liability insurance is a legal requirement if you have employees.' },
      { id: 'ct10_defect_liability_period', questionNumber: 'CT10', label: 'What defect liability period do you offer or want to formalise?', type: 'single_choice', required: true, options: ['6 months', '12 months', '2 years', 'As required by contract', 'No defect liability period currently offered'] },
      { id: 'ct11_specific_hazards', questionNumber: 'CT11', label: 'Are there any specific hazards, working conditions, or project types we should know about for your risk assessments?', type: 'long_text', required: false, placeholder: 'e.g. I regularly work on Victorian properties with suspected asbestos, always having surveys done before work begins.' },
      { id: 'industry_contractor_notes', questionNumber: 'CT11b', label: 'Additional notes for this section', type: 'long_text', required: false, placeholder: 'Any additional details about your trade or contracting business...', helpText: 'Optional — add any extra context.' },
    ],
    serviceTags: ['contractor_industry_pack'],
    sortOrder: 133,
  },
];

// ── BACKWARD COMPATIBILITY ──
// These deprecated aliases keep existing imports working during the transition.

/** @deprecated Use buildIntakeForm(['business_foundations_pack']) from build-intake-form.ts instead. */
const intakeFormSections: FormSection[] = allFormSections.filter(
  (s) => s.serviceTags.includes('business_foundations_pack') && s.id !== 'intro',
);

/** @deprecated Use buildIntakeForm(['website_copy_pack', 'social_media_pack']) from build-intake-form.ts instead. */
const upsellFormSections: FormSection[] = allFormSections.filter(
  (s) => s.id === 'website_copy' || s.id === 'social_media',
);
