// Operations tier form schemas - sections used by Operations packs.

import { z } from 'zod';
import {
  nonEmptyString, optionalString,
  singleChoice, multiSelect,
} from './primitives';

export function getClientOnboardingSchema(): z.ZodObject<any> {
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

export function getPaymentProtectionSchema(): z.ZodObject<any> {
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

export function getCopyrightLicensingSchema(): z.ZodObject<any> {
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

export function getGdprDeepSchema(): z.ZodObject<any> {
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
