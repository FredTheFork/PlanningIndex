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
    serviceTags: ['business_foundations_pack', 'website_copy_pack', 'social_media_pack'],
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
    ],
    serviceTags: ['business_foundations_pack', 'website_copy_pack', 'social_media_pack'],
    sortOrder: 70,
    // q67_brand_colours is only needed by website-copy (for colour scheme choices).
    // For documents-only purchases, it's not essential for document generation.
    fieldServiceTags: {
      'q67_brand_colours': ['website_copy_pack', 'social_media_pack'],
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
    serviceTags: ['business_foundations_pack', 'website_copy_pack', 'social_media_pack'],
    sortOrder: 100,
  },

  // ── SECTION 11 — WEBSITE COPY ──
  {
    id: 'website_copy',
    title: 'Website Copy',
    description: 'Tell us about your website so we can write copy that reflects your brand, communicates your value, and converts visitors into clients.',
    usedIn: 'Website Copy Starter Pack',
    fields: [
      // ── Website Structure and Pages ──
      { id: 'wc1_pages_needed', questionNumber: 'WC1', label: 'Which website pages do you need copy written for?', type: 'multi_select', required: true, options: ['Homepage', 'About', 'Services', 'Contact', 'FAQ', 'Blog', 'Portfolio / Case Studies', 'Pricing', 'Testimonials', 'Other'], hasOtherOption: true, helpText: 'Select every page you want us to write. We\'ll tailor the copy for each one.' },
      { id: 'wc_pages_other', questionNumber: 'WC4', label: 'Describe the custom page(s) you need.', type: 'long_text', required: false, placeholder: 'e.g. "A Process page explaining how I work step by step" or "A Resources page linking to free downloads."', conditionalOn: { field: 'wc1_pages_needed', value: 'Other' } },
      { id: 'wc_service_page_count', questionNumber: 'WC5', label: 'How many individual service pages do you need?', type: 'single_choice', required: true, options: ['1', '2-3', '4-5', '6+', 'Depends — align with my service descriptions'], helpText: 'If you selected the Services page above, this tells us whether it\'s a single overview or separate pages per service.' },
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

      // ── Competitor and Inspiration ──
      { id: 'wc_competitor_urls', questionNumber: 'WC19', label: 'Are there competitor or fellow business websites you\'d like us to reference?', type: 'long_text', required: false, placeholder: 'Paste URLs of similar businesses. We\'ll study how they position themselves — not to copy, but to differentiate you.' },
      { id: 'wc3_inspiration_urls', questionNumber: 'WC3', label: 'Are there any websites — your own industry or otherwise — whose copy or overall feel you admire? Paste the URLs.', type: 'long_text', required: false, placeholder: 'We\'re not copying them. We\'re calibrating tone and style.' },
      { id: 'wc_disliked_urls', questionNumber: 'WC20', label: 'Are there websites you actively do NOT like? Paste the URLs and tell us why.', type: 'long_text', required: false, placeholder: 'e.g. "example.com — too cluttered and aggressive" or "example.co.uk — feels cold and corporate." Helps us avoid what you hate.' },

      // ── Functional Website Details ──
      { id: 'wc2_primary_action', questionNumber: 'WC2', label: 'What is the single most important action you want a website visitor to take?', type: 'long_text', required: true, placeholder: 'e.g. Book a free discovery call / Fill out my enquiry form / Buy my online course / Sign up for my newsletter / Download my free guide.' },
      { id: 'wc_forms_needed', questionNumber: 'WC21', label: 'Do you need any forms on your website?', type: 'multi_select', required: false, options: ['Contact form', 'Newsletter signup', 'Booking / scheduling', 'Quote request', 'File upload', 'No forms needed'] },
      { id: 'wc_testimonials', questionNumber: 'WC22', label: 'What testimonials or reviews do you want to include on your website?', type: 'long_text', required: false, placeholder: 'Paste any testimonials you\'d like us to incorporate. Include the client name and context if possible.' },
      { id: 'wc_legal_pages', questionNumber: 'WC23', label: 'Do you need any specific legal pages on your website?', type: 'multi_select', required: false, options: ['Privacy Policy', 'Terms and Conditions', 'Cookie Policy', 'Disclaimer', 'Accessibility Statement', 'None'] },
      { id: 'wc_website_builder', questionNumber: 'WC24', label: 'What website builder are you using (or planning to use)?', type: 'single_choice', required: true, options: ['WordPress', 'Wix', 'Squarespace', 'Shopify', 'Custom / HTML', 'Not decided yet', 'Other'], hasOtherOption: true },

      // ── Content You Already Have ──
      { id: 'wc_existing_copy_upload', questionNumber: 'WC25', label: 'Upload any existing website copy you\'d like us to reference.', type: 'file_upload', required: false, helpText: 'If you have draft copy, an old website, or notes — upload them here so we can build on what you have.' },
      { id: 'wc_existing_images_upload', questionNumber: 'WC26', label: 'Upload any existing images or photos you want to use on the website.', type: 'file_upload', required: false, helpText: 'Professional headshots, product photos, workspace shots. If you don\'t have any, we\'ll write copy that works with stock imagery.' },
      { id: 'wc_existing_testimonials', questionNumber: 'WC27', label: 'Do you have existing testimonials or reviews that are already written?', type: 'long_text', required: false, placeholder: 'Paste them here if you haven\'t already uploaded them as a file. Separate from the question above — this is content you already have ready to go.' },
    ],
    serviceTags: ['website_copy_pack'],
    sortOrder: 110,
  },

  // ── SECTION 12 — SOCIAL MEDIA PACK ──
  {
    id: 'social_media',
    title: 'Social Media Pack',
    description: 'Tell us about your social media presence so we can create posts that match your brand and engage your audience.',
    usedIn: 'Social Media Starter Pack',
    fields: [
      { id: 'sm1_platforms', questionNumber: 'SM1', label: 'Which platforms are you focusing on right now?', type: 'multi_select', required: true, options: ['LinkedIn', 'Instagram', 'TikTok', 'Facebook', 'X (Twitter)', 'Pinterest', 'Other'], hasOtherOption: true },
      { id: 'sm2_content_types', questionNumber: 'SM2', label: 'What type of content do you want? Select everything that fits your brand.', type: 'multi_select', required: true, options: ['Educational — teach your audience something useful', 'Personal / behind-the-scenes — show the human behind the business', 'Authority / expert — position you as the go-to in your niche', 'Promotional — direct sells and offers', 'Storytelling — client wins, your journey, case studies', 'Inspirational / motivational', 'Relatable / humorous'] },
      { id: 'sm3_avoid_topics', questionNumber: 'SM3', label: 'Are there any topics, clients, or personal details you NEVER want mentioned publicly?', type: 'long_text', required: false, placeholder: 'e.g. Don\'t reference my previous employer. Don\'t use my children\'s names or images.' },
    ],
    serviceTags: ['social_media_pack'],
    sortOrder: 120,
  },
];

// ── BACKWARD COMPATIBILITY ──
// These deprecated aliases keep existing imports working during the transition.

/** @deprecated Use buildIntakeForm(['business_foundations_pack']) from build-intake-form.ts instead. */
export const intakeFormSections: FormSection[] = allFormSections.filter(
  (s) => s.serviceTags.includes('business_foundations_pack') && s.id !== 'intro',
);

/** @deprecated Use buildIntakeForm(['website_copy_pack', 'social_media_pack']) from build-intake-form.ts instead. */
export const upsellFormSections: FormSection[] = allFormSections.filter(
  (s) => s.id === 'website_copy' || s.id === 'social_media',
);
