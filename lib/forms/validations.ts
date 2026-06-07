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

export function getBusinessIdentitySchema(): z.ZodObject<any> {
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
  });
}

export function getServicesSchema(): z.ZodObject<any> {
  return z.object({
    q13_what_you_do: nonEmptyString,
    q14_flagship_service: nonEmptyString,
    q15_services: servicesRepeatingSchema,
    q16_uses_subcontractors: singleChoice(['Yes', 'No'], true),
    q17_inform_subcontractors: singleChoice(['Yes', 'No'], false),
    q18_sends_proposal: singleChoice(['Yes — I always send a proposal first', 'Sometimes — depends on the project', 'No — we agree verbally and get started'], true),
  });
}

export function getClientsSchema(): z.ZodObject<any> {
  return z.object({
    q19_client_type: singleChoice(['Mainly individuals / consumers', 'Mainly businesses', 'Both equally'], true),
    q20_ideal_client: nonEmptyString,
    q21_client_industries: optionalString,
    q22_client_issues: multiSelect(['Client refused to pay', 'Client disappeared / went silent after work was delivered', 'Scope creep — client asked for far more than agreed', 'Refund dispute', 'Chargeback through PayPal or card', 'Client claimed ownership of work before paying in full', 'Missed deadlines caused by the client, not me', 'GDPR or data complaint', 'Harassment or abusive behaviour', 'Threats of legal action', 'None of the above'], true),
    q23_dispute_details: optionalString,
    q24_client_concerns: optionalString,
  });
}

export function getPricingSchema(): z.ZodObject<any> {
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
  });
}

export function getGdprSchema(): z.ZodObject<any> {
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
  });
}

export function getLegalSchema(): z.ZodObject<any> {
  return z.object({
    q49_regulated_services: singleChoice(['Yes', 'No'], true),
    q50_regulatory_detail: optionalString,
    q51_indemnity_insurance: singleChoice(['Yes', 'No', 'Not yet'], true),
    q52_certifications: optionalString,
    q53_specific_clauses: optionalString,
    q54_exclusions: optionalString,
  });
}

export function getBrandSchema(): z.ZodObject<any> {
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
  });
}

export function getInvoiceSchema(): z.ZodObject<any> {
  return z.object({
    q69_bank_details: nonEmptyString,
    q70_invoice_due_date: nonEmptyString,
    q71_invoice_fields: multiSelect(['Purchase order (PO) number field', 'VAT breakdown section', 'Notes / message to client section', 'Payment terms summary at the bottom', 'Signature field'], false),
  });
}

export function getLinkedinSchema(): z.ZodObject<any> {
  return z.object({
    q72_linkedin_usage: singleChoice(['Yes — I use it actively', 'I have a profile but rarely use it', 'No — I don\'t have a profile'], true),
    q73_linkedin_url: optionalUrl,
    q74_linkedin_target: nonEmptyString,
    q75_linkedin_keywords: optionalString,
  });
}

export function getFinalSchema(): z.ZodObject<any> {
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

export function getWebsiteCopySchema(): z.ZodObject<any> {
  return z.object({
    wc1_pages_needed: multiSelect(['Homepage', 'About', 'Services', 'Contact', 'FAQ', 'Blog', 'Portfolio / Case Studies', 'Pricing', 'Testimonials', 'Other'], true),
    wc_pages_other: optionalString,
    wc_service_page_count: singleChoice(['1', '2-3', '4-5', '6+', 'Depends — align with my service descriptions'], true),
    wc_nav_structure: singleChoice(['Single page / scroll', 'Multi-page', 'One-page with sections'], true),
    wc_headline_idea: optionalString,
    wc_hero_message: nonEmptyString,
    wc_differentiator: optionalString,
    wc_problems_solved: nonEmptyString,
    wc_visitor_feeling: multiSelect(['Confident', 'Inspired', 'Reassured', 'Curious', 'Excited', 'Informed', 'Supported'], true, 3),
    wc_colour_preferences: optionalString,
    wc_colour_palette_style: singleChoice(['Bold and vibrant', 'Clean and minimal', 'Warm and earthy', 'Dark and premium', 'Pastel / soft', 'I have specific brand colours'], false),
    wc_font_style: singleChoice(['Modern sans-serif', 'Classic serif', 'Friendly rounded', 'Minimal / tech', 'No preference'], true),
    wc_imagery_style: singleChoice(['Photography-led', 'Illustration-led', 'Minimal / icons', 'Mix of both', 'No preference'], true),
    wc_logo_placement: singleChoice(['Top left', 'Top centre', 'No preference'], false),
    wc_has_brand_guidelines: singleChoice(['Yes', 'No', 'Partially'], true),
    wc_brand_guidelines_upload: fileUpload,
    wc_competitor_urls: optionalString,
    wc3_inspiration_urls: optionalString,
    wc_disliked_urls: optionalString,
    wc2_primary_action: nonEmptyString,
    wc_forms_needed: multiSelect(['Contact form', 'Newsletter signup', 'Booking / scheduling', 'Quote request', 'File upload', 'No forms needed'], false),
    wc_testimonials: optionalString,
    wc_legal_pages: multiSelect(['Privacy Policy', 'Terms and Conditions', 'Cookie Policy', 'Disclaimer', 'Accessibility Statement', 'None'], false),
    wc_website_builder: singleChoice(['WordPress', 'Wix', 'Squarespace', 'Shopify', 'Custom / HTML', 'Not decided yet', 'Other'], true),
    wc_existing_copy_upload: fileUpload,
    wc_existing_images_upload: fileUpload,
    wc_existing_testimonials: optionalString,
  });
}

export function getSocialMediaSchema(): z.ZodObject<any> {
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
