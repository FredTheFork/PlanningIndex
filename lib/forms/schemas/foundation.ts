// Foundation tier form schemas - sections used by Business Foundations Pack.

import { z } from 'zod';
import {
  nonEmptyString, optionalString, emailSchema, phoneSchema, optionalUrl,
  singleChoice, multiSelect, fileUpload, checkbox, servicesRepeatingSchema,
} from './primitives';

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
    business_identity_notes: optionalString,
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
    services_notes: optionalString,
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
    clients_notes: optionalString,
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
    pricing_notes: optionalString,
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
    gdpr_notes: optionalString,
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
    legal_notes: optionalString,
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
    brand_notes: optionalString,
  });
}

export function getInvoiceSchema(): z.ZodObject<any> {
  return z.object({
    q69_bank_details: nonEmptyString,
    q70_invoice_due_date: nonEmptyString,
    q71_invoice_fields: multiSelect(['Purchase order (PO) number field', 'VAT breakdown section', 'Notes / message to client section', 'Payment terms summary at the bottom', 'Signature field'], false),
    invoice_notes: optionalString,
  });
}

export function getLinkedinSchema(): z.ZodObject<any> {
  return z.object({
    q72_linkedin_usage: singleChoice(['Yes — I use it actively', 'I have a profile but rarely use it', 'No — I don\'t have a profile'], true),
    q73_linkedin_url: optionalUrl,
    q74_linkedin_target: nonEmptyString,
    q75_linkedin_keywords: optionalString,
    linkedin_notes: optionalString,
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
