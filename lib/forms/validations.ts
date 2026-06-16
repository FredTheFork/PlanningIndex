// Zod validation schemas for intake form sections.
// Composable per-section schemas that mirror intake-definition.ts fields.
// Used by IntakeWizard for per-section validation before advancing.

import { z } from 'zod';

// ── Primitive schemas ──

const nonEmptyString = z.string().min(1, 'This field is required');
const optionalString = z.string().optional().or(z.literal(''));
const emailSchema = z.string().min(1, 'Email is required').email('Please enter a valid email address');
const optionalEmail = z.string().email('Please enter a valid email address').optional().or(z.literal(''));
const urlSchema = z.string().min(1, 'URL is required').refine(
  (val) => { try { new URL(val.startsWith('http') ? val : `https://${val}`); return true; } catch { return false; } },
  'Please enter a valid URL'
);
const optionalUrl = z.string().refine(
  (val) => { if (!val) return true; try { new URL(val.startsWith('http') ? val : `https://${val}`); return true; } catch { return false; } },
  'Please enter a valid URL'
).optional().or(z.literal(''));
const phoneSchema = z.string().optional().or(z.literal(''));

const singleChoice = (options: string[], required: boolean) =>
  required
    ? z.string().min(1, 'Please select an option').refine((v) => options.includes(v) || v === 'Other', 'Invalid selection')
    : z.string().optional().or(z.literal(''));

const multiSelect = (options: string[], required: boolean, maxSelections?: number) => {
  let schema = required
    ? z.array(z.string()).min(1, 'Please select at least one option')
    : z.array(z.string()).optional().default([]);

  if (maxSelections) {
    schema = schema.refine((arr) => !arr || arr.length <= maxSelections, {
      message: `Select no more than ${maxSelections} options`,
    });
  }
  return schema;
};

const fileUpload = z.array(z.record(z.string(), z.unknown())).optional().default([]);

const checkbox = z.boolean().refine((v) => v === true, 'You must agree to continue');

// ── Repeating section: services (Q15) ──

const serviceItemSchema = z.object({
  service_name: z.string().min(1, 'Service name is required'),
  service_includes: z.string().min(1, 'Please describe what this service includes'),
  service_excludes: z.string().min(1, 'Please describe what this service excludes'),
  service_client_provides: z.string().min(1, 'Please describe what the client needs to provide'),
  service_timeline: z.string().min(1, 'Timeline is required'),
  service_outcome: z.string().min(1, 'Please describe the outcome'),
  service_starting_price: z.string().optional().or(z.literal('')),
});

const servicesRepeatingSchema = z.array(serviceItemSchema).min(1, 'At least one service is required').max(5, 'No more than 5 services allowed');

// ── Per-section schemas ──
// Each returns a Zod object schema for the section's fields.
// Conditional fields are handled at validation time by the caller.

function getBusinessIdentitySchema(): z.ZodObject<any> {
  return z.object({
    q1_legal_name: nonEmptyString,
    q2_business_name: nonEmptyString,
    q3_business_registered: singleChoice(['Sole trader', 'Limited company', 'Partnership / LLP', 'Not registered yet'], true),
    q4_companies_house: optionalString,
    q5_jurisdiction: singleChoice(['England & Wales', 'Scotland', 'Northern Ireland'], true),
    q6_business_address: nonEmptyString,
    q7_document_email: emailSchema,
    q8_business_phone: phoneSchema,
    q9_has_website: singleChoice(['Yes — I have a live website', 'In progress / coming soon', 'No — I don\'t have one yet'], true),
    q10_website_url: optionalUrl,
    q11_social_platforms: multiSelect(['LinkedIn', 'Instagram', 'TikTok', 'Facebook Page', 'X (Twitter)', 'WhatsApp Business', 'Pinterest', 'None yet'], false),
    q12_social_links: optionalString,
    business_identity_notes: optionalString,
  });
}

function getServicesSchema(): z.ZodObject<any> {
  return z.object({
    q13_what_you_do: nonEmptyString,
    q14_flagship_service: nonEmptyString,
    q15_services: servicesRepeatingSchema,
    q16_uses_subcontractors: singleChoice(['Yes', 'No'], true),
    q17_inform_subcontractors: singleChoice(['Yes', 'No'], false),
    q18_sends_proposal: singleChoice(['Yes — I always send a proposal first', 'Sometimes — depends on the project', 'No — we agree verbally and get started'], true),
    services_notes: optionalString,
  });
}

function getClientsSchema(): z.ZodObject<any> {
  return z.object({
    q19_client_type: singleChoice(['Mainly individuals / consumers', 'Mainly businesses', 'Both equally'], true),
    q20_ideal_client: nonEmptyString,
    q21_client_industries: optionalString,
    q22_client_issues: multiSelect(['Client refused to pay', 'Client disappeared / went silent after work was delivered', 'Scope creep — client asked for far more than agreed', 'Refund dispute', 'Chargeback through PayPal or card', 'Client claimed ownership of work before paying in full', 'Missed deadlines caused by the client, not me', 'GDPR or data complaint', 'Harassment or abusive behaviour', 'Threats of legal action', 'None of the above'], true),
    q23_dispute_details: optionalString,
    q24_client_concerns: optionalString,
    clients_notes: optionalString,
  });
}

function getPricingSchema(): z.ZodObject<any> {
  return z.object({
    q25_pricing_model: multiSelect(['Fixed project fee', 'Hourly rate', 'Monthly retainer', 'Day rate', 'Milestone / stage payments', 'Subscription', 'Other'], true),
    q26_payment_terms: singleChoice(['100% payment required upfront before work begins', '50% upfront / 50% on completion', 'Invoice on completion — due within 7 days', 'Invoice on completion — due within 14 days', 'Invoice on completion — due within 30 days', 'I use milestone payments — invoice at agreed stages', 'Custom arrangement'], true),
    q27_payment_detail: optionalString,
    q28_requires_deposit: singleChoice(['Yes — always', 'Yes — for larger projects', 'No'], true),
    q29_deposit_detail: optionalString,
    q30_payment_methods: multiSelect(['Bank transfer (BACS)', 'PayPal', 'Stripe', 'GoCardless', 'Wise', 'Cash', 'Card reader', 'Other'], true),
    q31_refund_policy: singleChoice(['No refunds — once work has begun, fees are non-refundable', 'Partial refund — proportional to work not yet completed', 'Full refund if cancelled within [X] days before work starts only', 'Case by case', 'I don\'t currently have a clear policy'], true),
    q32_refund_detail: optionalString,
    q33_late_payment_interest: singleChoice(['Yes', 'No'], true),
    q34_vat_registered: singleChoice(['Yes', 'No'], true),
    q35_vat_number: optionalString,
    pricing_notes: optionalString,
  });
}

function getGdprSchema(): z.ZodObject<any> {
  return z.object({
    q36_data_collected: multiSelect(['Full names', 'Email addresses', 'Phone numbers', 'Home or business addresses', 'Financial / billing details', 'Bank account information', 'Copies of ID documents', 'Project files and creative work', 'Health or medical information', 'Information about their employees or staff', 'Other'], true),
    q37_data_collection_method: multiSelect(['Email correspondence', 'Phone or video calls', 'Written contracts or agreements', 'Online forms or questionnaires', 'Social media messages', 'In-person meetings', 'Payment processors (e.g. Stripe, PayPal)', 'Third-party booking or scheduling tools', 'Other'], true),
    q38_data_purpose: nonEmptyString,
    q39_data_storage: multiSelect(['Google Drive', 'Dropbox', 'OneDrive', 'My local computer / hard drive', 'Notion', 'Accounting software (e.g. QuickBooks, Xero, FreeAgent)', 'CRM software (e.g. Dubsado, HoneyBook)', 'Paper records / physical files', 'Other'], true),
    q40_data_retention: singleChoice(['1 year', '2 years', '3 years', '6 years (recommended — aligns with HMRC)', 'I delete records as soon as the project ends', 'I\'m not sure / I don\'t have a policy yet'], true),
    q41_uses_third_party_tools: singleChoice(['Yes', 'No'], true),
    q42_third_party_tools: optionalString,
    q43_shares_data: singleChoice(['Yes', 'No', 'Sometimes'], true),
    q44_data_sharing_detail: optionalString,
    q45_sends_marketing: singleChoice(['Yes', 'No'], true),
    q46_marketing_platform: optionalString,
    q47_uses_cookies: singleChoice(['Yes', 'No', 'I\'m not sure'], false),
    q48_tracking_tools: multiSelect(['Google Analytics', 'Meta (Facebook) Pixel', 'TikTok Pixel', 'Hotjar or Microsoft Clarity', 'Cookie consent banner tool', 'Other'], false),
    gdpr_notes: optionalString,
  });
}

function getLegalSchema(): z.ZodObject<any> {
  return z.object({
    q49_regulated_services: singleChoice(['Yes', 'No'], true),
    q50_regulatory_detail: optionalString,
    q51_indemnity_insurance: singleChoice(['Yes', 'No', 'Not yet'], true),
    q52_certifications: optionalString,
    q53_specific_clauses: optionalString,
    q54_exclusions: optionalString,
    legal_notes: optionalString,
  });
}

function getBrandSchema(): z.ZodObject<any> {
  return z.object({
    q55_first_name: nonEmptyString,
    q56_business_story: nonEmptyString,
    q57_experience: nonEmptyString,
    q58_achievements: optionalString,
    q59_client_compliments: optionalString,
    q60_12_month_goal: nonEmptyString,
    q61_differentiator: nonEmptyString,
    q62_tone_of_voice: multiSelect(['Warm and friendly', 'Professional and formal', 'Direct and no-nonsense', 'Conversational and approachable', 'Calm and reassuring', 'Bold and confident', 'Luxury and refined', 'Creative and energetic'], true, 3),
    q63_avoid_words: optionalString,
    q64_brand_identity: singleChoice(['My personal name is the brand — I want documents to feel personal', 'The business name is the brand — keep it professional and company-facing', 'A mix of both'], true),
    q65_has_logo: singleChoice(['Yes', 'No'], true),
    q66_logo_upload: fileUpload,
    q67_brand_colours: optionalString,
    q68_visual_style: singleChoice(['Clean and modern / minimal', 'Corporate and formal', 'Warm and friendly', 'Premium and luxury', 'Simple — I just want it to work'], true),
    brand_notes: optionalString,
  });
}

function getInvoiceSchema(): z.ZodObject<any> {
  return z.object({
    q69_bank_details: nonEmptyString,
    q70_invoice_due_date: nonEmptyString,
    q71_invoice_fields: multiSelect(['Purchase order (PO) number field', 'VAT breakdown section', 'Notes / message to client section', 'Payment terms summary at the bottom', 'Signature field'], false),
    invoice_notes: optionalString,
  });
}

function getLinkedinSchema(): z.ZodObject<any> {
  return z.object({
    q72_linkedin_usage: singleChoice(['Yes — I use it actively', 'I have a profile but rarely use it', 'No — I don\'t have a profile'], true),
    q73_linkedin_url: optionalUrl,
    q74_linkedin_target: nonEmptyString,
    q75_linkedin_keywords: optionalString,
    linkedin_notes: optionalString,
  });
}

function getFinalSchema(): z.ZodObject<any> {
  return z.object({
    q76_existing_docs_upload: fileUpload,
    q77_writing_samples_upload: fileUpload,
    q78_anything_else: optionalString,
    q79_how_heard: singleChoice(['LinkedIn', 'Instagram', 'TikTok', 'Facebook group', 'Referral from someone I know', 'Google search', 'Accountant or bookkeeper recommendation', 'Other'], false),
    q80_confidence_level: singleChoice(['Very confident — I just want things formalised properly', 'Somewhat confident — I know there are gaps', 'Not confident at all — I\'m starting from scratch'], true),
    q81_consent_marketing: singleChoice(['Yes', 'No'], true),
    q82_consent_not_legal: checkbox,
    q83_consent_accuracy: checkbox,
  });
}

function getWebsiteCopySchema(): z.ZodObject<any> {
  return z.object({
    // Structure
    wc_service_page_count: singleChoice(['1', '2-3', '4-5', '6+', 'Depends — align with my service descriptions'], true),
    wc_nav_structure: singleChoice(['Single page / scroll', 'Multi-page', 'One-page with sections'], true),

    // Messaging
    wc_headline_idea: optionalString,
    wc_hero_message: nonEmptyString,
    wc_differentiator: optionalString,
    wc_problems_solved: nonEmptyString,
    wc_visitor_feeling: multiSelect(['Confident', 'Inspired', 'Reassured', 'Curious', 'Excited', 'Informed', 'Supported'], true, 3),

    // Visual
    wc_colour_preferences: optionalString,
    wc_colour_palette_style: singleChoice(['Bold and vibrant', 'Clean and minimal', 'Warm and earthy', 'Dark and premium', 'Pastel / soft', 'I have specific brand colours'], false),
    wc_font_style: singleChoice(['Modern sans-serif', 'Classic serif', 'Friendly rounded', 'Minimal / tech', 'No preference'], true),
    wc_imagery_style: singleChoice(['Photography-led', 'Illustration-led', 'Minimal / icons', 'Mix of both', 'No preference'], true),
    wc_logo_placement: singleChoice(['Top left', 'Top centre', 'No preference'], false),
    wc_has_brand_guidelines: singleChoice(['Yes', 'No', 'Partially'], true),
    wc_brand_guidelines_upload: fileUpload,
    wc_logo_upload: fileUpload,

    // Inspiration
    wc_competitor_urls: optionalString,
    wc3_inspiration_urls: optionalString,
    wc_disliked_urls: optionalString,

    // Functional
    wc2_primary_action: nonEmptyString,
    wc_forms_needed: multiSelect(['Contact form', 'Newsletter signup', 'Booking / scheduling', 'Quote request', 'File upload', 'No forms needed'], false),
    wc_legal_pages: multiSelect(['Privacy Policy', 'Terms and Conditions', 'Cookie Policy', 'Disclaimer', 'Accessibility Statement', 'None needed'], true),

    // Content uploads
    wc_existing_copy_upload: fileUpload,
    wc_existing_images_upload: fileUpload,

    // Website-specific pricing
    wc_show_pricing_on_website: singleChoice(['Yes — show starting prices', 'Yes — show full pricing details', 'No — use "Get a quote" approach', 'Not sure yet'], true),
    wc_pricing_text: optionalString,
    wc_payment_methods_display: multiSelect(['Bank transfer (BACS)', 'Credit/Debit card', 'PayPal', 'Direct Debit', 'Cash', 'Payment plans available', 'Not applicable'], false),
    wc_bank_details_for_website: optionalString,

    // Website-specific GDPR
    wc_website_collects_data: singleChoice(['Yes — via contact forms', 'Yes — via newsletter signup', 'Yes — via both forms and newsletter', 'No — just a brochure website'], true),
    wc_data_collected_website: multiSelect(['Names', 'Email addresses', 'Phone numbers', 'Business name', 'Service enquiry details', 'Newsletter subscription'], false),
    wc_needs_cookie_consent: singleChoice(['Yes — required for GDPR compliance', 'No — not needed for my website', 'Not sure'], true),
    wc_analytics_tools: multiSelect(['Google Analytics', 'Meta (Facebook) Pixel', 'Google Tag Manager', 'Hotjar / Heatmaps', 'None needed'], false),

    // Contact & business details
    wc_show_business_hours: singleChoice(['Yes — show my working hours', 'No — just contact options', 'I work flexible hours'], true),
    wc_business_hours: optionalString,
    wc_phone_on_website: singleChoice(['Yes — show phone number', 'No — email and forms only', 'Contact via Calendly/booking only'], true),
    wc_email_display: optionalEmail,
    wc_address_on_website: singleChoice(['Yes — show full address', 'Show city/region only', 'No address shown'], true),

    // Social media links
    wc_show_social_links: singleChoice(['Yes — in header and footer', 'Yes — in footer only', 'Yes — on Contact page only', 'No — not needed'], true),
    wc_social_links_to_show: multiSelect(['LinkedIn', 'Instagram', 'Facebook', 'X (Twitter)', 'TikTok', 'Pinterest', 'YouTube'], false),
    wc_linkedin_url: optionalUrl,
    wc_instagram_url: optionalUrl,
    wc_facebook_url: optionalUrl,

    // Testimonials & credentials
    wc_testimonials: optionalString,
    wc_testimonials_count: singleChoice(['3-5 testimonials', '6-8 testimonials', 'More than 8', 'Just feature one or two prominently'], true),
    wc_credentials_to_show: optionalString,
    wc_awards_or_press: optionalString,

    // Additional features
    wc_booking_tool: singleChoice(['Yes — Calendly', 'Yes — Cal.com', 'Yes — another tool', 'No — I don\'t use one', 'I want one set up'], true),
    wc_booking_url: optionalUrl,
    wc_newsletter_signup: singleChoice(['Yes — I have a mailing list', 'No — not needed', 'I want to set one up'], true),
    wc_newsletter_platform: optionalString,

    // Page-specific optional fields
    wc_homepage_sections: multiSelect(['Hero banner', 'About preview', 'Services overview', 'Testimonials', 'FAQ preview', 'Latest blog posts', 'Newsletter signup', 'Contact CTA'], false),
    wc_homepage_cta_style: multiSelect(['Single prominent button', 'Multiple CTA buttons', 'Soft CTA with contact link', 'No preference'], false),
    wc_about_focus: multiSelect(['Your story and journey', 'Your qualifications and experience', 'Your approach and methodology', 'Your values and mission', 'Personal side / hobbies', 'Team members (if any)'], false),
    wc_about_tone: singleChoice(['Professional and formal', 'Warm and personal', 'Story-driven and engaging', 'No preference'], false),
    wc_services_format: singleChoice(['Card/tile format with icons', 'List format with descriptions', 'Table format with pricing', 'Mixed format', 'No preference'], false),
    wc_services_show_pricing: singleChoice(['Yes — show starting prices', 'Yes — show full pricing', 'No — use "Get a quote" or contact CTA', 'Not sure yet'], false),
    wc_services_cta: singleChoice(['Contact page', 'Booking/scheduling tool', 'Individual service detail page', 'Enquiry form', 'No preference'], false),
    wc_contact_method: multiSelect(['Contact form', 'Direct email link', 'Phone number', 'Calendar/booking link', 'Social media links'], false),
    wc_contact_form_fields: multiSelect(['Name', 'Email', 'Phone (optional)', 'Service interested in', 'Message', 'How did you hear about us?', 'Preferred contact method'], false),
    wc_faq_topics: optionalString,
    wc_faq_count: singleChoice(['5-6 questions', '8-10 questions', '12+ questions', 'No preference — we\'ll decide'], false),
    wc_blog_style: singleChoice(['Card grid with images', 'List format', 'Magazine style', 'Minimal text-only', 'No preference'], false),
    wc_blog_categories: optionalString,
    wc_portfolio_format: singleChoice(['Grid of images with titles', 'Cards with project summaries', 'Before/after format', 'Detailed case study pages', 'No preference'], false),
    wc_portfolio_projects: optionalString,
    wc_pricing_display: singleChoice(['Tiered packages (e.g. Basic/Pro/Premium)', 'Per-service list', 'Starting from prices with "Get quote" CTA', 'Custom quote only', 'No preference'], false),
    wc_pricing_highlights: optionalString,
    wc_testimonials_format: singleChoice(['Quote cards with photos', 'Carousel/slider', 'Simple list', 'Video testimonials', 'Mixed formats', 'No preference'], false),
    wc_testimonials_featured: optionalString,
    website_copy_notes: optionalString,
  });
}

function getSocialMediaSchema(): z.ZodObject<any> {
  return z.object({
    sm1_platforms: multiSelect(['LinkedIn', 'Instagram', 'TikTok', 'Facebook', 'X (Twitter)', 'Pinterest', 'Other'], true),
    sm2_content_types: multiSelect(['Educational — teach your audience something useful', 'Personal / behind-the-scenes — show the human behind the business', 'Authority / expert — position you as the go-to in your niche', 'Promotional — direct sells and offers', 'Storytelling — client wins, your journey, case studies', 'Inspirational / motivational', 'Relatable / humorous'], true),
    sm3_avoid_topics: optionalString,
    sm4_posting_frequency: singleChoice(['3x/week', '5x/week', 'Daily', '2x/day', 'Not sure'], true),
    sm5_content_pillars: nonEmptyString,
    sm6_personal_boundaries: nonEmptyString,
    sm7_hashtag_strategy: singleChoice(['Broad reach — popular hashtags for maximum visibility', 'Niche targeted — specific hashtags for your ideal audience', 'Mixed — a combination of both', 'No preference — let us decide'], true),
    sm8_competitor_accounts: optionalString,
    sm9_content_tone: singleChoice(['Same as overall brand tone', 'More casual/personal', 'More professional', 'More promotional'], true),
    sm10_call_to_action: optionalString,
    sm11_existing_accounts: optionalString,
    sm12_content_calendar: singleChoice(['Weekly themed — each week has a focus topic', 'Rotating pillars — cycle through your content pillars evenly', 'Mix of types — vary educational, personal, and promotional posts', 'No preference — let us decide'], true),
    sm13_upcoming_launches: optionalString,
    social_media_notes: optionalString,
  });
}

function getClientOnboardingSchema(): z.ZodObject<any> {
  return z.object({
    co1_onboarding_style: nonEmptyString,
    co2_onboarding_pain_points: nonEmptyString,
    co3_scope_creep_experience: singleChoice(['Yes — frequently', 'Yes — occasionally', 'Rarely', 'Never'], true),
    co4_scope_creep_detail: optionalString,
    co5_communication_channels: multiSelect(['Email', 'WhatsApp / SMS', 'Phone calls', 'Video calls (Zoom / Teams / Meet)', 'Project management tool (e.g. Trello, Asana, ClickUp)', 'Client portal', 'Slack'], true),
    co6_response_time_expectation: singleChoice(['Same business day', 'Within 24 hours', 'Within 48 hours', 'Within 3 business days', 'By end of working week'], true),
    co7_client_provides: nonEmptyString,
    co8_kickoff_format: singleChoice(['Yes — always', 'Yes — for larger projects', 'No — I start from the brief only'], true),
    co9_revision_policy: nonEmptyString,
    co10_closing_process: optionalString,
    client_onboarding_notes: optionalString,
  });
}

function getPaymentProtectionSchema(): z.ZodObject<any> {
  return z.object({
    pp1_late_payment_experience: singleChoice(['Yes — more than once', 'Yes — once', "Not yet, but I'm worried about it", 'No, never'], true),
    pp2_late_payment_detail: optionalString,
    pp3_deposit_percentage: singleChoice(['100% upfront', '50% upfront', '33% upfront', '25% upfront', 'No deposit — I invoice on completion', 'It varies by project'], true),
    pp4_deposit_non_refundable: singleChoice(['Yes — fully non-refundable', 'Partially refundable depending on notice given', 'Fully refundable if cancelled before work starts', "Not sure — I'd like guidance"], true),
    pp5_invoice_due_days: singleChoice(['Due on receipt', '7 days', '14 days', '30 days', "Custom — I'll explain below"], true),
    pp6_invoice_due_custom: optionalString,
    pp7_late_payment_interest: singleChoice(['Yes — include 8% above Bank of England base rate', 'No — I prefer a flat daily charge', "No — I don't want to charge interest"], true),
    pp8_chargeback_experience: singleChoice(['Yes', 'No'], true),
    pp9_chargeback_detail: optionalString,
    pp10_work_stoppage_policy: singleChoice(['Yes — I want clear rights to pause work', 'Yes — and the right to terminate the contract', 'No — I prefer to continue and chase separately'], true),
    payment_protection_notes: optionalString,
  });
}

function getCopyrightLicensingSchema(): z.ZodObject<any> {
  return z.object({
    cl1_deliverable_types: multiSelect(['Written content (copy, articles, reports)', 'Graphic design or visual assets', 'Photographs or video', 'Software or code', 'Presentations or slide decks', 'Strategic frameworks or methodologies', 'Training materials or courses', 'Audio content or podcasts', 'Social media content'], true),
    cl2_ip_ownership_preference: singleChoice(['I retain copyright — I licence the work to the client for agreed uses', 'The client owns all rights on full payment', 'I retain copyright until paid in full, then transfer', "It depends on the type of work — I'll explain below"], true),
    cl3_ip_ownership_detail: optionalString,
    cl4_licence_scope: multiSelect(["Use on client's own website", "Use in client's printed materials", "Use in client's social media", 'Resale or sublicensing to third parties', 'Use in advertising campaigns', 'Use in publications or broadcast media', 'Internal business use only'], true),
    cl5_uses_third_party_content: singleChoice(['Yes — regularly', 'Yes — occasionally', 'No'], true),
    cl6_third_party_detail: optionalString,
    cl7_nda_needed: singleChoice(['Yes — regularly', 'Yes — for sensitive projects', 'Occasionally', 'No'], true),
    cl8_nda_type: singleChoice(["Mutual — both parties agree to protect each other's information", "One-way — client protects my information only", "One-way — I protect client's information only", 'Not sure'], false),
    cl9_portfolio_right: singleChoice(['Yes — always', 'Yes — with client approval first', 'No — I prefer to keep client work confidential'], true),
    cl10_ip_infringement_experience: singleChoice(['Yes', 'No'], true),
    cl11_infringement_detail: optionalString,
    copyright_licensing_notes: optionalString,
  });
}

function getGdprDeepSchema(): z.ZodObject<any> {
  return z.object({
    gd1_lawful_basis: multiSelect(['Contractual necessity — processing is necessary to perform a contract', "Legitimate interests — you have a genuine business reason that doesn't override individual rights", 'Consent — individuals have actively opted in', 'Legal obligation — you must process data to comply with a law', 'Vital interests — in rare emergency situations', 'Public task — not usually applicable to sole traders'], true),
    gd2_data_processor_relationships: singleChoice(['Yes', 'No'], true),
    gd3_processor_list: optionalString,
    gd4_international_transfers: singleChoice(['Yes', 'No', 'Not sure'], true),
    gd5_international_transfer_detail: optionalString,
    gd6_sar_procedure: singleChoice(['Yes — a defined process', "Loosely — I'd figure it out when it happens", 'No — I need one'], true),
    gd7_breach_procedure: singleChoice(['Yes — I know the 72-hour ICO notification rule', "Partially — I know I'd need to report it", 'No — I need clear guidance'], true),
    gd8_high_risk_processing: multiSelect(['Systematic profiling of individuals', 'Processing special category data (health, biometric, religion, etc.)', 'Large-scale processing of personal data', "Processing children's data", "Monitoring individuals' behaviour", 'None of the above'], true),
    gd9_consent_management: singleChoice(['Opt-in tick box on a form', 'Double opt-in email confirmation', 'Verbal consent noted in CRM', "I don't have a formal consent process", "I don't do marketing emails"], true),
    gd10_retention_clarity: singleChoice(['Yes — financial records kept longer than general correspondence', 'No — I keep everything the same amount of time', "Not sure — I'd like guidance"], true),
    gdpr_deep_notes: optionalString,
  });
}

function getCoachIndustrySchema(): z.ZodObject<any> {
  return z.object({
    ic1_coaching_modality: multiSelect(['Life coaching', 'Business coaching', 'Executive / leadership coaching', 'Career coaching', 'Health / wellness coaching', 'Mindset coaching', 'Parenting / relationship coaching', 'NLP practitioner', 'Hypnotherapy'], true),
    ic2_accreditation: multiSelect(['ICF (International Coaching Federation)', 'EMCC (European Mentoring & Coaching Council)', 'AC (Association for Coaching)', 'CIPD', 'NCFE / Ofqual-accredited qualification', 'None — self-taught / non-accredited', 'Other'], true),
    ic3_session_format: multiSelect(['One-to-one via video call', 'One-to-one in person', 'Group coaching (online)', 'Group coaching (in person)', 'Hybrid', 'Asynchronous (voice notes / messaging only)'], true),
    ic4_session_length: singleChoice(['30 minutes', '45 minutes', '60 minutes', '90 minutes', '120 minutes', 'Varies by programme'], true),
    ic5_programme_structure: singleChoice(['Individual sessions only', 'Fixed programme (e.g. 6-week, 3-month)', 'Both individual and programme options', 'Retainer — ongoing monthly sessions'], true),
    ic6_programme_detail: nonEmptyString,
    ic7_supervision_arrangement: singleChoice(['Yes — monthly or more frequently', 'Yes — quarterly', 'Yes — annually', 'No — I plan to arrange this', 'No — not required in my modality'], true),
    ic8_cancellation_policy: singleChoice(['24 hours', '48 hours', '72 hours / 3 days', '5 business days', '7 days'], true),
    ic9_late_cancellation_fee: singleChoice(['Full session fee charged', '50% of session fee charged', 'Session forfeited from programme', "No charge — I'm flexible", 'Depends on the situation'], true),
    ic10_confidentiality_exceptions: nonEmptyString,
    ic11_cpd_hours: optionalString,
    industry_coach_notes: optionalString,
  });
}

function getPhotographerIndustrySchema(): z.ZodObject<any> {
  return z.object({
    ip1_photography_specialism: multiSelect(['Wedding photography', 'Portrait photography', 'Commercial / product photography', 'Brand photography', 'Event photography', 'Family / newborn photography', 'Architectural / property photography', 'Fashion photography', 'Headshots'], true),
    ip2_client_type: multiSelect(['Individuals / consumers', 'Small businesses', 'Agencies', 'Corporate clients', 'Charities / non-profits', 'Wedding couples / families'], true),
    ip3_licensing_intent: singleChoice(['I retain copyright and licence images for agreed uses', 'I transfer full copyright to the client on payment', 'I retain copyright but grant unlimited personal use', 'It depends on the project type'], true),
    ip4_commercial_use: singleChoice(['Yes — primarily commercial use (advertising, marketing, product sales)', 'Mostly personal use with some commercial use', 'No — personal use only (family, portraits, events)'], true),
    ip5_model_releases_needed: singleChoice(['Yes — models, actors, brand ambassadors', "Yes — clients' staff and team members", 'Yes — members of the public at events', 'No — my work primarily features products or environments'], true),
    ip6_location_releases: singleChoice(['Yes — regularly', 'Occasionally', 'No — I primarily shoot in my studio or public spaces'], true),
    ip7_delivery_format: multiSelect(['High-resolution JPEG', 'High-resolution TIFF', 'RAW files', 'Web-optimised JPEG', 'PNG', 'PDF contact sheets', 'Video files'], true),
    ip8_delivery_timeline: singleChoice(['Within 48 hours', 'Within 1 week', 'Within 2 weeks', 'Within 3-4 weeks', 'Within 6-8 weeks (e.g. weddings)', 'Varies by project type'], true),
    ip9_editing_rounds: singleChoice(['1 round — final images delivered', '2 rounds — proofs then finals', '3 rounds included', 'Unlimited revisions within agreed scope'], true),
    ip10_event_cancellation: nonEmptyString,
    ip11_portfolio_usage: singleChoice(['Yes — always, without approval needed', 'Yes — with client approval first', 'No — my work is confidential'], true),
    industry_photographer_notes: optionalString,
  });
}

function getConsultantIndustrySchema(): z.ZodObject<any> {
  return z.object({
    con1_consulting_specialism: multiSelect(['Management consulting', 'Strategy consulting', 'Operations consulting', 'IT / technology consulting', 'HR / people consulting', 'Finance / accounting consulting', 'Marketing consulting', 'Sales consulting', 'Change management', 'Compliance / regulatory consulting'], true),
    con2_engagement_model: singleChoice(['Fixed-scope project with defined deliverables', 'Time and materials — billed hourly or daily', 'Retained advisor — ongoing monthly fee', 'Diagnostic phase then implementation phase', 'Mixed — depends on the client'], true),
    con3_deliverable_types: multiSelect(['Written reports and recommendations', 'Presentations and slide decks', 'Process documentation', 'Strategic frameworks or models', 'Training and workshops', 'Implementation support', 'Templates and toolkits', 'Systems and technology solutions'], true),
    con4_methodology: singleChoice(['Yes — I have a named methodology or framework', "Yes — I have an approach I've developed but it's not formally named", 'No — I use standard consulting approaches'], true),
    con5_methodology_detail: optionalString,
    con6_knowledge_transfer: nonEmptyString,
    con7_conflicts_of_interest: singleChoice(['Yes — I need a clear conflict policy', "Sometimes — I'd like guidance on how to handle this", 'No — I only work with one client per sector at a time'], true),
    con8_milestones: singleChoice(['Yes — always', 'Yes — for larger projects', 'No — I invoice on a time basis'], true),
    con9_reporting_frequency: singleChoice(['Weekly status updates', 'Fortnightly updates', 'Monthly reports', 'At milestone completion only', 'Ad hoc as needed'], true),
    con10_acceptance_criteria: singleChoice(['Written sign-off via email', 'Formal acceptance form', 'Sign-off meeting then invoice', 'Payment is treated as acceptance', "I don't currently have a formal process"], true),
    industry_consultant_notes: optionalString,
  });
}

function getContractorIndustrySchema(): z.ZodObject<any> {
  return z.object({
    ct1_trade_type: multiSelect(['General builder / construction', 'Electrician', 'Plumber / gas engineer', 'Carpenter / joiner', 'Painter / decorator', 'Plasterer', 'Roofer', 'Landscaper / groundworker', 'HVAC engineer', 'Specialist installer (e.g. flooring, kitchens)'], true),
    ct2_work_environment: multiSelect(['Private residential properties', 'Commercial properties', 'Industrial sites', 'Outdoor / open sites', 'Refurbishment projects', 'New build construction', 'Rooftop / at height working', 'Confined spaces', 'Heritage / listed buildings'], true),
    ct3_employees_subcontractors: singleChoice(['Sole operator — I work alone', 'I use subcontractors on larger jobs', 'I have direct employees', 'Mix of employees and subcontractors'], true),
    ct4_cdm_exposure: singleChoice(['Yes — I work on notifiable construction projects', 'Sometimes — for projects over 30 working days or 500 person-days', 'Rarely — most of my work is smaller domestic jobs', "I'm not sure — I'd like guidance"], true),
    ct5_hazardous_substances: multiSelect(['Cement / concrete (silica dust)', 'Solvents and adhesives', 'Wood dust (fine or coarse)', 'Lead paint (in older properties)', 'Asbestos (inspection / removal work)', 'Chemical treatments (wood preservatives, pesticides)', 'Welding fumes', 'None of the above'], true),
    ct6_height_working: singleChoice(['Yes — regularly (roofing, scaffolding, ladders)', 'Yes — occasionally', 'No — my work is at ground level only'], true),
    ct7_plant_equipment: multiSelect(['Scaffolding', 'Lifting equipment (LOLER-regulated)', 'Power tools (PUWER-regulated)', 'Mini digger or plant machinery', 'Cherry picker / MEWP', 'Pressure washing equipment', 'None of the above'], true),
    ct8_existing_hs_documentation: singleChoice(['Yes — a written H&S policy', 'Yes — some risk assessments', 'Yes — method statements for specific jobs', "No — I don't have any formal documentation", 'Partially — some documentation but gaps'], true),
    ct9_insurance: multiSelect(['Public liability insurance', "Employer's liability insurance", 'Professional indemnity insurance', 'Plant and equipment insurance', 'Contract works insurance', 'None currently'], true),
    ct10_defect_liability_period: singleChoice(['6 months', '12 months', '2 years', 'As required by contract', 'No defect liability period currently offered'], true),
    ct11_specific_hazards: optionalString,
    industry_contractor_notes: optionalString,
  });
}

// ── Schema registry by section ID ──

const sectionSchemas: Record<string, () => z.ZodObject<any>> = {
  business_identity: getBusinessIdentitySchema,
  services: getServicesSchema,
  clients: getClientsSchema,
  pricing: getPricingSchema,
  gdpr: getGdprSchema,
  legal: getLegalSchema,
  brand: getBrandSchema,
  invoice: getInvoiceSchema,
  linkedin: getLinkedinSchema,
  final: getFinalSchema,
  website_copy: getWebsiteCopySchema,
  social_media: getSocialMediaSchema,
  client_onboarding: getClientOnboardingSchema,
  payment_protection: getPaymentProtectionSchema,
  copyright_licensing: getCopyrightLicensingSchema,
  gdpr_deep: getGdprDeepSchema,
  industry_coach: getCoachIndustrySchema,
  industry_photographer: getPhotographerIndustrySchema,
  industry_consultant: getConsultantIndustrySchema,
  industry_contractor: getContractorIndustrySchema,
};

/**
 * Get the Zod schema for a section by its ID.
 * Returns null for the 'intro' section (no fields to validate).
 */
export function getSectionSchema(sectionId: string): z.ZodObject<any> | null {
  if (sectionId === 'intro') return null;
  const factory = sectionSchemas[sectionId];
  return factory ? factory() : null;
}

/**
 * Validate a single section's responses using its Zod schema.
 * Only validates fields that are visible (passes through conditional logic).
 * Returns a map of fieldId → errorMessage for invalid fields, or empty object if valid.
 */
export function validateSectionWithZod(
  sectionId: string,
  responses: Record<string, any>,
): Record<string, string> {
  const schema = getSectionSchema(sectionId);
  if (!schema) return {};

  const result = schema.safeParse(responses);
  if (result.success) return {};

  const errors: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const fieldPath = issue.path.join('.');
    if (fieldPath && !errors[fieldPath]) {
      errors[fieldPath] = issue.message;
    }
  }
  return errors;
}
