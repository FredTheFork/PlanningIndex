import type { Lead } from './leads';

export type ProposalStatus =
  | 'Draft'
  | 'Ready'
  | 'Sent'
  | 'Processing'
  | 'Mailed'
  | 'Delivered'
  | 'Delivery issue'
  | 'Undeliverable';

export type ProposalSectionType =
  | 'introduction'
  | 'scope_of_works'
  | 'products_services'
  | 'pricing'
  | 'terms'
  | 'contact_info';

export interface ProposalLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface ProposalSection {
  id: string;
  type: ProposalSectionType;
  title: string;
  content: string;
  order: number;
  lineItems?: ProposalLineItem[];
}

export interface ProposalTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  applicableTradeTags: string[];
  defaultSections: ProposalSection[];
}

export interface Proposal {
  id: string;
  reference: string;
  leadId: string;
  recipientName: string;
  recipientAddress: string;
  recipientPostcode: string;
  propertyAddress: string;
  propertyPostcode: string;
  applicationId: string;
  applicationReference: string;
  applicationTitle: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  companyEmail: string;
  companyVatNumber: string;
  projectTitle: string;
  projectReference: string;
  templateId: string;
  status: ProposalStatus;
  sections: ProposalSection[];
  totalValue: string;
  createdDate: string;
  updatedDate: string;
  sentDate: string | null;
  mailedDate: string | null;
  deliveredDate: string | null;
  trackingNumber: string | null;
}

let proposalCounter = 10483;

export function generateProposalReference(): string {
  proposalCounter += 1;
  return `PI-${proposalCounter}`;
}

export function calculateProposalTotal(sections: ProposalSection[]): number {
  const pricingSection = sections.find((s) => s.type === 'pricing' || s.type === 'products_services');
  if (!pricingSection?.lineItems) return 0;
  return pricingSection.lineItems.reduce((sum, item) => sum + item.total, 0);
}

function formatTotal(value: number): string {
  return `\u00A3${value.toLocaleString('en-GB')}`;
}

const baseDate = new Date('2026-09-01');

function daysAgo(days: number): string {
  const d = new Date(baseDate);
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

export const proposalTemplates: ProposalTemplate[] = [
  {
    id: 'window-replacement',
    name: 'Window Replacement',
    description: 'Pre-filled with window and door replacement scope, pricing, and terms.',
    icon: 'frame',
    applicableTradeTags: ['Windows', 'Doors'],
    defaultSections: [
      {
        id: 'sec-intro',
        type: 'introduction',
        title: 'Introduction',
        content: 'Thank you for the opportunity to provide a quotation for the replacement of windows and doors at your property. We have reviewed the planning application and prepared a detailed proposal for your consideration.',
        order: 0,
      },
      {
        id: 'sec-scope',
        type: 'scope_of_works',
        title: 'Scope of Works',
        content: 'Supply and installation of replacement windows and doors as specified in the planning application. All works to be carried out in accordance with current building regulations. Includes removal and disposal of existing units.',
        order: 1,
      },
      {
        id: 'sec-products',
        type: 'products_services',
        title: 'Products & Services',
        content: '',
        order: 2,
        lineItems: [
          { id: 'li-1', description: 'Supply and fit double-glazed uPVC windows', quantity: 8, unitPrice: 520, total: 4160 },
          { id: 'li-2', description: 'Supply and fit composite front door', quantity: 1, unitPrice: 850, total: 850 },
          { id: 'li-3', description: 'Removal and disposal of existing windows', quantity: 1, unitPrice: 200, total: 200 },
        ],
      },
      {
        id: 'sec-pricing',
        type: 'pricing',
        title: 'Pricing',
        content: 'All prices include materials, labour, and disposal. VAT is additional where applicable.',
        order: 3,
        lineItems: [
          { id: 'li-p1', description: 'Supply and fit double-glazed uPVC windows', quantity: 8, unitPrice: 520, total: 4160 },
          { id: 'li-p2', description: 'Supply and fit composite front door', quantity: 1, unitPrice: 850, total: 850 },
          { id: 'li-p3', description: 'Removal and disposal of existing windows', quantity: 1, unitPrice: 200, total: 200 },
        ],
      },
      {
        id: 'sec-terms',
        type: 'terms',
        title: 'Terms & Conditions',
        content: 'This quotation is valid for 30 days from the date of issue. A 30% deposit is required to secure the booking, with the balance due upon completion. All works are guaranteed for 5 years. Payment terms: net 14 days from invoice date.',
        order: 4,
      },
      {
        id: 'sec-contact',
        type: 'contact_info',
        title: 'Contact Information',
        content: 'Please do not hesitate to contact us if you have any questions about this proposal.',
        order: 5,
      },
    ],
  },
  {
    id: 'general-building',
    name: 'General Building Works',
    description: 'Flexible template for general building, extensions, and alterations.',
    icon: 'hammer',
    applicableTradeTags: ['Extensions', 'Building', 'Conversions'],
    defaultSections: [
      {
        id: 'sec-intro',
        type: 'introduction',
        title: 'Introduction',
        content: 'Thank you for the opportunity to provide a quotation for the proposed building works at your property. We have reviewed the planning application and prepared a detailed proposal.',
        order: 0,
      },
      {
        id: 'sec-scope',
        type: 'scope_of_works',
        title: 'Scope of Works',
        content: 'All building works to be carried out in accordance with the approved planning application and current building regulations. Includes all necessary materials, labour, and waste removal.',
        order: 1,
      },
      {
        id: 'sec-products',
        type: 'products_services',
        title: 'Products & Services',
        content: '',
        order: 2,
        lineItems: [
          { id: 'li-1', description: 'Construction works as per approved plans', quantity: 1, unitPrice: 15000, total: 15000 },
          { id: 'li-2', description: 'Materials and fittings', quantity: 1, unitPrice: 3500, total: 3500 },
        ],
      },
      {
        id: 'sec-pricing',
        type: 'pricing',
        title: 'Pricing',
        content: 'All prices include materials, labour, and waste removal. VAT is additional where applicable.',
        order: 3,
        lineItems: [
          { id: 'li-p1', description: 'Construction works as per approved plans', quantity: 1, unitPrice: 15000, total: 15000 },
          { id: 'li-p2', description: 'Materials and fittings', quantity: 1, unitPrice: 3500, total: 3500 },
        ],
      },
      {
        id: 'sec-terms',
        type: 'terms',
        title: 'Terms & Conditions',
        content: 'This quotation is valid for 30 days. A 30% deposit secures the booking, with interim payments at agreed milestones and balance upon completion. All works guaranteed for 5 years.',
        order: 4,
      },
      {
        id: 'sec-contact',
        type: 'contact_info',
        title: 'Contact Information',
        content: 'Please contact us with any questions about this proposal.',
        order: 5,
      },
    ],
  },
  {
    id: 'roofing',
    name: 'Roofing',
    description: 'Roof replacement, re-roofing, and dormer installation scope.',
    icon: 'home',
    applicableTradeTags: ['Roofing', 'Dormers'],
    defaultSections: [
      {
        id: 'sec-intro',
        type: 'introduction',
        title: 'Introduction',
        content: 'Thank you for the opportunity to provide a quotation for the roof replacement works at your property. We have reviewed the planning application and prepared a detailed proposal.',
        order: 0,
      },
      {
        id: 'sec-scope',
        type: 'scope_of_works',
        title: 'Scope of Works',
        content: 'Removal of existing roof covering and replacement with new materials as specified. All works to comply with current building regulations. Includes scaffolding, waste removal, and weatherproofing.',
        order: 1,
      },
      {
        id: 'sec-products',
        type: 'products_services',
        title: 'Products & Services',
        content: '',
        order: 2,
        lineItems: [
          { id: 'li-1', description: 'Supply and fit natural slate roof covering', quantity: 120, unitPrice: 45, total: 5400 },
          { id: 'li-2', description: 'Installation of rear dormer windows', quantity: 2, unitPrice: 500, total: 1000 },
        ],
      },
      {
        id: 'sec-pricing',
        type: 'pricing',
        title: 'Pricing',
        content: 'All prices include materials, labour, scaffolding, and waste removal. VAT is additional where applicable.',
        order: 3,
        lineItems: [
          { id: 'li-p1', description: 'Supply and fit natural slate roof covering', quantity: 120, unitPrice: 45, total: 5400 },
          { id: 'li-p2', description: 'Installation of rear dormer windows', quantity: 2, unitPrice: 500, total: 1000 },
        ],
      },
      {
        id: 'sec-terms',
        type: 'terms',
        title: 'Terms & Conditions',
        content: 'This quotation is valid for 30 days. A 30% deposit is required. All roofing works guaranteed for 10 years against defects in materials and workmanship.',
        order: 4,
      },
      {
        id: 'sec-contact',
        type: 'contact_info',
        title: 'Contact Information',
        content: 'Please contact us with any questions.',
        order: 5,
      },
    ],
  },
  {
    id: 'extension',
    name: 'Extension',
    description: 'Extension-specific scope with structural work, foundations, and finishes.',
    icon: 'building',
    applicableTradeTags: ['Extensions', 'Wraparound'],
    defaultSections: [
      {
        id: 'sec-intro',
        type: 'introduction',
        title: 'Introduction',
        content: 'Thank you for the opportunity to provide a quotation for the proposed extension at your property. We have reviewed the planning application drawings and prepared a detailed proposal.',
        order: 0,
      },
      {
        id: 'sec-scope',
        type: 'scope_of_works',
        title: 'Scope of Works',
        content: 'Construction of the extension as per the approved plans. Includes excavation and footings, brickwork, roof structure and covering, bi-fold doors, roof lights, internal finishes, and all associated drainage works.',
        order: 1,
      },
      {
        id: 'sec-products',
        type: 'products_services',
        title: 'Products & Services',
        content: '',
        order: 2,
        lineItems: [
          { id: 'li-1', description: 'Excavation and concrete footings', quantity: 1, unitPrice: 2500, total: 2500 },
          { id: 'li-2', description: 'Brickwork and blockwork', quantity: 1, unitPrice: 4500, total: 4500 },
          { id: 'li-3', description: 'Flat roof with roof lights', quantity: 1, unitPrice: 3200, total: 3200 },
          { id: 'li-4', description: 'Aluminium bi-fold doors', quantity: 1, unitPrice: 2800, total: 2800 },
          { id: 'li-5', description: 'Internal finishes and decoration', quantity: 1, unitPrice: 2000, total: 2000 },
        ],
      },
      {
        id: 'sec-pricing',
        type: 'pricing',
        title: 'Pricing',
        content: 'All prices include materials, labour, and waste removal. VAT is additional where applicable.',
        order: 3,
        lineItems: [
          { id: 'li-p1', description: 'Excavation and concrete footings', quantity: 1, unitPrice: 2500, total: 2500 },
          { id: 'li-p2', description: 'Brickwork and blockwork', quantity: 1, unitPrice: 4500, total: 4500 },
          { id: 'li-p3', description: 'Flat roof with roof lights', quantity: 1, unitPrice: 3200, total: 3200 },
          { id: 'li-p4', description: 'Aluminium bi-fold doors', quantity: 1, unitPrice: 2800, total: 2800 },
          { id: 'li-p5', description: 'Internal finishes and decoration', quantity: 1, unitPrice: 2000, total: 2000 },
        ],
      },
      {
        id: 'sec-terms',
        type: 'terms',
        title: 'Terms & Conditions',
        content: 'This quotation is valid for 30 days. A 30% deposit secures the booking. Interim payments at agreed milestones (footings, wall plate, completion). Balance due upon completion. All works guaranteed for 5 years.',
        order: 4,
      },
      {
        id: 'sec-contact',
        type: 'contact_info',
        title: 'Contact Information',
        content: 'Please contact us with any questions.',
        order: 5,
      },
    ],
  },
  {
    id: 'custom',
    name: 'Custom',
    description: 'Start from scratch with blank sections. Full control over all content.',
    icon: 'file',
    applicableTradeTags: [],
    defaultSections: [
      { id: 'sec-intro', type: 'introduction', title: 'Introduction', content: '', order: 0 },
      { id: 'sec-scope', type: 'scope_of_works', title: 'Scope of Works', content: '', order: 1 },
      { id: 'sec-products', type: 'products_services', title: 'Products & Services', content: '', order: 2, lineItems: [] },
      { id: 'sec-pricing', type: 'pricing', title: 'Pricing', content: '', order: 3, lineItems: [] },
      { id: 'sec-terms', type: 'terms', title: 'Terms & Conditions', content: '', order: 4 },
      { id: 'sec-contact', type: 'contact_info', title: 'Contact Information', content: '', order: 5 },
    ],
  },
];

export function getTemplateById(id: string): ProposalTemplate | undefined {
  return proposalTemplates.find((t) => t.id === id);
}

function cloneSections(template: ProposalTemplate): ProposalSection[] {
  return template.defaultSections.map((s) => ({
    ...s,
    lineItems: s.lineItems?.map((li) => ({ ...li })),
  }));
}

export const mockProposals: Proposal[] = [
  {
    id: 'proposal-1',
    reference: 'PI-10482',
    leadId: 'lead-1',
    recipientName: 'Mr J. Smith',
    recipientAddress: '12 High Street, Amersham',
    recipientPostcode: 'HP6 5BA',
    propertyAddress: '12 High Street, Amersham',
    propertyPostcode: 'HP6 5BA',
    applicationId: '1',
    applicationReference: '24/01234/FUL',
    applicationTitle: 'Replacement of windows and doors',
    contactName: 'John Smith',
    contactPhone: '07700 900123',
    contactEmail: 'john.smith@example.com',
    companyName: 'Thames Construction Ltd',
    companyAddress: '14 Industrial Park, Uxbridge, UB8 1AB',
    companyPhone: '01895 123456',
    companyEmail: 'info@thames.co.uk',
    companyVatNumber: 'GB123456789',
    projectTitle: 'Replacement of windows and doors',
    projectReference: '24/01234/FUL',
    templateId: 'window-replacement',
    status: 'Mailed',
    sections: cloneSections(proposalTemplates[0]),
    totalValue: '\u00A35,210',
    createdDate: daysAgo(2),
    updatedDate: daysAgo(1),
    sentDate: daysAgo(1),
    mailedDate: daysAgo(1),
    deliveredDate: null,
    trackingNumber: 'RM-TRK-001842',
  },
  {
    id: 'proposal-2',
    reference: 'PI-10481',
    leadId: 'lead-2',
    recipientName: 'Mrs A. Brown',
    recipientAddress: '45 The Broadway, Rickmansworth',
    recipientPostcode: 'WD3 7AB',
    propertyAddress: '45 The Broadway, Rickmansworth',
    propertyPostcode: 'WD3 7AB',
    applicationId: '2',
    applicationReference: '24/01235/FUL',
    applicationTitle: 'Rear extension and alterations',
    contactName: 'Angela Brown',
    contactPhone: '07700 900456',
    contactEmail: 'a.brown@example.com',
    companyName: 'Thames Construction Ltd',
    companyAddress: '14 Industrial Park, Uxbridge, UB8 1AB',
    companyPhone: '01895 123456',
    companyEmail: 'info@thames.co.uk',
    companyVatNumber: 'GB123456789',
    projectTitle: 'Rear extension and alterations',
    projectReference: '24/01235/FUL',
    templateId: 'extension',
    status: 'Delivered',
    sections: cloneSections(proposalTemplates[3]),
    totalValue: '\u00A318,500',
    createdDate: daysAgo(4),
    updatedDate: daysAgo(3),
    sentDate: daysAgo(3),
    mailedDate: daysAgo(3),
    deliveredDate: daysAgo(2),
    trackingNumber: 'RM-TRK-001841',
  },
  {
    id: 'proposal-3',
    reference: 'PI-10480',
    leadId: 'lead-5',
    recipientName: 'Mr M. Chen',
    recipientAddress: '22 Station Road, Chesham',
    recipientPostcode: 'HP5 1AB',
    propertyAddress: '22 Station Road, Chesham',
    propertyPostcode: 'HP5 1AB',
    applicationId: '5',
    applicationReference: '24/01238/FUL',
    applicationTitle: 'Replacement of existing roof covering',
    contactName: 'Michael Chen',
    contactPhone: '07700 900345',
    contactEmail: 'm.chen@example.com',
    companyName: 'Thames Construction Ltd',
    companyAddress: '14 Industrial Park, Uxbridge, UB8 1AB',
    companyPhone: '01895 123456',
    companyEmail: 'info@thames.co.uk',
    companyVatNumber: 'GB123456789',
    projectTitle: 'Replacement of existing roof covering',
    projectReference: '24/01238/FUL',
    templateId: 'roofing',
    status: 'Processing',
    sections: cloneSections(proposalTemplates[2]),
    totalValue: '\u00A36,400',
    createdDate: daysAgo(1),
    updatedDate: daysAgo(1),
    sentDate: daysAgo(1),
    mailedDate: null,
    deliveredDate: null,
    trackingNumber: 'RM-TRK-001843',
  },
  {
    id: 'proposal-4',
    reference: 'PI-10479',
    leadId: 'lead-4',
    recipientName: 'Ms E. Roberts',
    recipientAddress: '78 High Street, Chesham',
    recipientPostcode: 'HP5 1AB',
    propertyAddress: '78 High Street, Chesham',
    propertyPostcode: 'HP5 1AB',
    applicationId: '4',
    applicationReference: '24/01237/FUL',
    applicationTitle: 'Loft conversion with rear dormer',
    contactName: 'Emma Roberts',
    contactPhone: '07700 900234',
    contactEmail: 'emma.roberts@example.com',
    companyName: 'Thames Construction Ltd',
    companyAddress: '14 Industrial Park, Uxbridge, UB8 1AB',
    companyPhone: '01895 123456',
    companyEmail: 'info@thames.co.uk',
    companyVatNumber: 'GB123456789',
    projectTitle: 'Loft conversion with rear dormer',
    projectReference: '24/01237/FUL',
    templateId: 'general-building',
    status: 'Draft',
    sections: cloneSections(proposalTemplates[1]),
    totalValue: '\u00A38,750',
    createdDate: daysAgo(1),
    updatedDate: daysAgo(1),
    sentDate: null,
    mailedDate: null,
    deliveredDate: null,
    trackingNumber: null,
  },
  {
    id: 'proposal-5',
    reference: 'PI-10478',
    leadId: 'lead-7',
    recipientName: 'Mr D. Wilson',
    recipientAddress: '31 Hill Road, Chalfont St Peter',
    recipientPostcode: 'SL9 9AB',
    propertyAddress: '31 Hill Road, Chalfont St Peter',
    propertyPostcode: 'SL9 9AB',
    applicationId: '7',
    applicationReference: '24/01240/FUL',
    applicationTitle: 'Two-storey rear extension',
    contactName: 'David Wilson',
    contactPhone: '07700 900678',
    contactEmail: 'd.wilson@example.com',
    companyName: 'Thames Construction Ltd',
    companyAddress: '14 Industrial Park, Uxbridge, UB8 1AB',
    companyPhone: '01895 123456',
    companyEmail: 'info@thames.co.uk',
    companyVatNumber: 'GB123456789',
    projectTitle: 'Two-storey rear extension',
    projectReference: '24/01240/FUL',
    templateId: 'extension',
    status: 'Delivery issue',
    sections: cloneSections(proposalTemplates[3]),
    totalValue: '\u00A328,000',
    createdDate: daysAgo(7),
    updatedDate: daysAgo(5),
    sentDate: daysAgo(6),
    mailedDate: daysAgo(6),
    deliveredDate: null,
    trackingNumber: 'RM-TRK-001840',
  },
  {
    id: 'proposal-6',
    reference: 'PI-10477',
    leadId: 'lead-9',
    recipientName: 'Mr T. Wright',
    recipientAddress: '14 The Green, Penn',
    recipientPostcode: 'HP10 9AB',
    propertyAddress: '14 The Green, Penn',
    propertyPostcode: 'HP10 9AB',
    applicationId: '8',
    applicationReference: '24/01241/FUL',
    applicationTitle: 'Garage conversion to habitable room',
    contactName: 'Thomas Wright',
    contactPhone: '07700 900890',
    contactEmail: 't.wright@example.com',
    companyName: 'Thames Construction Ltd',
    companyAddress: '14 Industrial Park, Uxbridge, UB8 1AB',
    companyPhone: '01895 123456',
    companyEmail: 'info@thames.co.uk',
    companyVatNumber: 'GB123456789',
    projectTitle: 'Garage conversion to habitable room',
    projectReference: '24/01241/FUL',
    templateId: 'general-building',
    status: 'Delivered',
    sections: cloneSections(proposalTemplates[1]),
    totalValue: '\u00A35,500',
    createdDate: daysAgo(9),
    updatedDate: daysAgo(7),
    sentDate: daysAgo(8),
    mailedDate: daysAgo(8),
    deliveredDate: daysAgo(7),
    trackingNumber: 'RM-TRK-001839',
  },
];

export function getProposalById(id: string): Proposal | undefined {
  return mockProposals.find((p) => p.id === id);
}

export function getProposalsByLeadId(leadId: string): Proposal[] {
  return mockProposals.filter((p) => p.leadId === leadId);
}

export function createProposalFromLead(
  lead: Lead,
  template: ProposalTemplate
): Proposal {
  const reference = generateProposalReference();
  const now = new Date().toISOString();
  const sections = cloneSections(template);
  const total = calculateProposalTotal(sections);

  return {
    id: `proposal-${Date.now()}`,
    reference,
    leadId: lead.id,
    recipientName: lead.contactName,
    recipientAddress: lead.propertyAddress,
    recipientPostcode: lead.propertyPostcode,
    propertyAddress: lead.propertyAddress,
    propertyPostcode: lead.propertyPostcode,
    applicationId: lead.applicationId,
    applicationReference: lead.applicationReference,
    applicationTitle: lead.applicationTitle,
    contactName: lead.contactName,
    contactPhone: lead.contactPhone,
    contactEmail: lead.contactEmail,
    companyName: '',
    companyAddress: '',
    companyPhone: '',
    companyEmail: '',
    companyVatNumber: '',
    projectTitle: lead.applicationTitle,
    projectReference: lead.applicationReference,
    templateId: template.id,
    status: 'Draft',
    sections,
    totalValue: formatTotal(total),
    createdDate: now,
    updatedDate: now,
    sentDate: null,
    mailedDate: null,
    deliveredDate: null,
    trackingNumber: null,
  };
}
