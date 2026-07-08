// Industry tier form schemas - sections for industry-specific packs.

import { z } from 'zod';
import {
  nonEmptyString, optionalString,
  singleChoice, multiSelect,
} from './primitives';

export function getCoachIndustrySchema(): z.ZodObject<any> {
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

export function getPhotographerIndustrySchema(): z.ZodObject<any> {
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

export function getConsultantIndustrySchema(): z.ZodObject<any> {
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

export function getContractorIndustrySchema(): z.ZodObject<any> {
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
