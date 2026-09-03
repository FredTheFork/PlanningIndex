export type LeadStatus = 'New' | 'Contacted' | 'Proposal Sent' | 'Follow Up' | 'Won' | 'Lost';
export type FollowUpType = 'Call' | 'Email' | 'Visit' | 'Proposal';

export interface Lead {
  [key: string]: unknown;
  id: string;
  propertyAddress: string;
  propertyPostcode: string;
  applicationId: string;
  applicationReference: string;
  applicationTitle: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  status: LeadStatus;
  notes: string;
  nextFollowUp: string | null;
  nextFollowUpType: FollowUpType | null;
  assignedTo: string;
  estimatedValue: string;
  createdAt: string;
  updatedAt: string;
  lat: number;
  lng: number;
}

export interface PipelineStageConfig {
  stage: LeadStatus;
  label: string;
  color: string;
  dotColor: string;
}

export const pipelineStages: PipelineStageConfig[] = [
  { stage: 'New', label: 'New', color: 'bg-sky-500', dotColor: 'bg-sky-500' },
  { stage: 'Contacted', label: 'Contacted', color: 'bg-amber-500', dotColor: 'bg-amber-500' },
  { stage: 'Proposal Sent', label: 'Proposal Sent', color: 'bg-violet-500', dotColor: 'bg-violet-500' },
  { stage: 'Follow Up', label: 'Follow Up', color: 'bg-orange-500', dotColor: 'bg-orange-500' },
  { stage: 'Won', label: 'Won', color: 'bg-emerald-500', dotColor: 'bg-emerald-500' },
];

export const leadStatusOptions: { value: string; label: string }[] = [
  { value: 'all', label: 'All statuses' },
  { value: 'New', label: 'New' },
  { value: 'Contacted', label: 'Contacted' },
  { value: 'Proposal Sent', label: 'Proposal Sent' },
  { value: 'Follow Up', label: 'Follow Up' },
  { value: 'Won', label: 'Won' },
  { value: 'Lost', label: 'Lost' },
];

const baseDate = new Date('2026-09-01');

function daysAgo(days: number): string {
  const d = new Date(baseDate);
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

function daysAhead(days: number): string {
  const d = new Date(baseDate);
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

export const mockLeads: Lead[] = [
  {
    id: 'lead-1',
    propertyAddress: '12 High Street, Amersham',
    propertyPostcode: 'HP6 5BA',
    applicationId: '1',
    applicationReference: '24/01234/FUL',
    applicationTitle: 'Replacement of windows and doors',
    contactName: 'John Smith',
    contactPhone: '07700 900123',
    contactEmail: 'john.smith@example.com',
    status: 'New',
    notes: 'Application validated. Property has 12 timber sash windows to replace. Good opportunity for a full window contract.',
    nextFollowUp: daysAhead(1),
    nextFollowUpType: 'Call',
    assignedTo: 'Sarah Mitchell',
    estimatedValue: '£4,200',
    createdAt: daysAgo(2),
    updatedAt: daysAgo(2),
    lat: 51.6708,
    lng: -0.6080,
  },
  {
    id: 'lead-2',
    propertyAddress: '45 The Broadway, Rickmansworth',
    propertyPostcode: 'WD3 7AB',
    applicationId: '2',
    applicationReference: '24/01235/FUL',
    applicationTitle: 'Rear extension and alterations',
    contactName: 'Angela Brown',
    contactPhone: '07700 900456',
    contactEmail: 'a.brown@example.com',
    status: 'New',
    notes: '6m x 4m rear extension with bi-fold doors. Load-bearing wall removal. Substantial project.',
    nextFollowUp: daysAhead(2),
    nextFollowUpType: 'Email',
    assignedTo: 'James Carter',
    estimatedValue: '£18,500',
    createdAt: daysAgo(1),
    updatedAt: daysAgo(1),
    lat: 51.6390,
    lng: -0.4730,
  },
  {
    id: 'lead-3',
    propertyAddress: '3 School Lane, Amersham',
    propertyPostcode: 'HP6 5AB',
    applicationId: '3',
    applicationReference: '24/01236/FUL',
    applicationTitle: 'Construction of a new dwelling',
    contactName: 'Robert Davies',
    contactPhone: '07700 900789',
    contactEmail: 'r.davies@example.com',
    status: 'Contacted',
    notes: 'New build, approved with conditions. Spoke to applicant — they are getting quotes from builders. Interested in our services.',
    nextFollowUp: daysAhead(3),
    nextFollowUpType: 'Visit',
    assignedTo: 'Sarah Mitchell',
    estimatedValue: '£32,000',
    createdAt: daysAgo(6),
    updatedAt: daysAgo(3),
    lat: 51.6780,
    lng: -0.6150,
  },
  {
    id: 'lead-4',
    propertyAddress: '78 High Street, Chesham',
    propertyPostcode: 'HP5 1AB',
    applicationId: '4',
    applicationReference: '24/01237/FUL',
    applicationTitle: 'Loft conversion with rear dormer',
    contactName: 'Emma Roberts',
    contactPhone: '07700 900234',
    contactEmail: 'emma.roberts@example.com',
    status: 'Contacted',
    notes: 'Loft conversion with rear dormer and juliet balcony. Left a voicemail — awaiting callback.',
    nextFollowUp: daysAhead(1),
    nextFollowUpType: 'Call',
    assignedTo: 'Emma Roberts',
    estimatedValue: '£8,750',
    createdAt: daysAgo(7),
    updatedAt: daysAgo(4),
    lat: 51.7040,
    lng: -0.6130,
  },
  {
    id: 'lead-5',
    propertyAddress: '22 Station Road, Chesham',
    propertyPostcode: 'HP5 1AB',
    applicationId: '5',
    applicationReference: '24/01238/FUL',
    applicationTitle: 'Replacement of existing roof covering',
    contactName: 'Michael Chen',
    contactPhone: '07700 900345',
    contactEmail: 'm.chen@example.com',
    status: 'Proposal Sent',
    notes: 'Full roof replacement — concrete tiles to natural slate plus two dormers. Proposal sent by post on 01 Sep.',
    nextFollowUp: daysAhead(5),
    nextFollowUpType: 'Call',
    assignedTo: 'James Carter',
    estimatedValue: '£6,400',
    createdAt: daysAgo(8),
    updatedAt: daysAgo(1),
    lat: 51.6910,
    lng: -0.6210,
  },
  {
    id: 'lead-6',
    propertyAddress: '17 Victoria Road, Chorleywood',
    propertyPostcode: 'WD3 5AB',
    applicationId: '10',
    applicationReference: '24/01243/FUL',
    applicationTitle: 'Wraparound extension with bi-fold doors',
    contactName: 'Patel Family',
    contactPhone: '07700 900567',
    contactEmail: 'patel.family@example.com',
    status: 'Proposal Sent',
    notes: 'Wraparound extension with aluminium bi-fold doors. Proposal delivered 29 Aug. Awaiting response.',
    nextFollowUp: daysAhead(4),
    nextFollowUpType: 'Email',
    assignedTo: 'Sarah Mitchell',
    estimatedValue: '£22,000',
    createdAt: daysAgo(16),
    updatedAt: daysAgo(3),
    lat: 51.6490,
    lng: -0.5240,
  },
  {
    id: 'lead-7',
    propertyAddress: '31 Hill Road, Chalfont St Peter',
    propertyPostcode: 'SL9 9AB',
    applicationId: '7',
    applicationReference: '24/01240/FUL',
    applicationTitle: 'Two-storey rear extension',
    contactName: 'David Wilson',
    contactPhone: '07700 900678',
    contactEmail: 'd.wilson@example.com',
    status: 'Follow Up',
    notes: 'Two-storey extension. Sent proposal two weeks ago. Called to follow up — they are comparing quotes. Need to call again next week.',
    nextFollowUp: daysAhead(3),
    nextFollowUpType: 'Call',
    assignedTo: 'James Carter',
    estimatedValue: '£28,000',
    createdAt: daysAgo(12),
    updatedAt: daysAgo(5),
    lat: 51.6060,
    lng: -0.5630,
  },
  {
    id: 'lead-8',
    propertyAddress: '9 Park Avenue, Chorleywood',
    propertyPostcode: 'WD3 5AB',
    applicationId: '6',
    applicationReference: '24/01239/FUL',
    applicationTitle: 'Single-storey side extension',
    contactName: 'Lisa Walker',
    contactPhone: '07700 900789',
    contactEmail: 'l.walker@example.com',
    status: 'Won',
    notes: 'Side extension approved. Client accepted our proposal. Contract signed. Start date: 15 September.',
    nextFollowUp: null,
    nextFollowUpType: null,
    assignedTo: 'Sarah Mitchell',
    estimatedValue: '£12,000',
    createdAt: daysAgo(10),
    updatedAt: daysAgo(1),
    lat: 51.6540,
    lng: -0.5180,
  },
  {
    id: 'lead-9',
    propertyAddress: '14 The Green, Penn',
    propertyPostcode: 'HP10 9AB',
    applicationId: '8',
    applicationReference: '24/01241/FUL',
    applicationTitle: 'Garage conversion to habitable room',
    contactName: 'Thomas Wright',
    contactPhone: '07700 900890',
    contactEmail: 't.wright@example.com',
    status: 'Won',
    notes: 'Garage conversion. Client accepted proposal. Job completed. Client very happy — potential for follow-on work.',
    nextFollowUp: null,
    nextFollowUpType: null,
    assignedTo: 'Emma Roberts',
    estimatedValue: '£5,500',
    createdAt: daysAgo(14),
    updatedAt: daysAgo(2),
    lat: 51.6430,
    lng: -0.6790,
  },
  {
    id: 'lead-10',
    propertyAddress: '8 Park Lane, Beaconsfield',
    propertyPostcode: 'HP9 1AB',
    applicationId: '9',
    applicationReference: '24/01242/FUL',
    applicationTitle: 'Construction of boundary wall and brick pier entrance pillars',
    contactName: 'Olivia Martin',
    contactPhone: '07700 900012',
    contactEmail: 'o.martin@example.com',
    status: 'Lost',
    notes: 'Boundary wall project. Client went with another contractor — price was too competitive for us.',
    nextFollowUp: null,
    nextFollowUpType: null,
    assignedTo: 'James Carter',
    estimatedValue: '£3,800',
    createdAt: daysAgo(15),
    updatedAt: daysAgo(7),
    lat: 51.6110,
    lng: -0.6460,
  },
];

export function getLeadById(id: string): Lead | undefined {
  return mockLeads.find((lead) => lead.id === id);
}

export function filterLeads(
  leads: Lead[],
  filters: { keyword: string; status: string; assignedTo: string }
): Lead[] {
  let results = [...leads];

  if (filters.keyword.trim()) {
    const kw = filters.keyword.trim().toLowerCase();
    results = results.filter(
      (lead) =>
        lead.propertyAddress.toLowerCase().includes(kw) ||
        lead.contactName.toLowerCase().includes(kw) ||
        lead.applicationReference.toLowerCase().includes(kw) ||
        lead.applicationTitle.toLowerCase().includes(kw)
    );
  }

  if (filters.status !== 'all') {
    results = results.filter((lead) => lead.status === filters.status);
  }

  if (filters.assignedTo !== 'all') {
    results = results.filter((lead) => lead.assignedTo === filters.assignedTo);
  }

  return results;
}

export function getAssignedToOptions(leads: Lead[]): { value: string; label: string }[] {
  const names = Array.from(new Set(leads.map((l) => l.assignedTo)));
  return [
    { value: 'all', label: 'All team members' },
    ...names.map((name) => ({ value: name, label: name })),
  ];
}

export function getPipelineSummary(leads: Lead[]) {
  const active = leads.filter((l) => l.status !== 'Won' && l.status !== 'Lost');
  const won = leads.filter((l) => l.status === 'Won');
  const lost = leads.filter((l) => l.status === 'Lost');
  const totalValue = active.reduce((sum, lead) => {
    const value = parseInt(lead.estimatedValue.replace(/[^0-9]/g, ''), 10) || 0;
    return sum + value;
  }, 0);
  const wonValue = won.reduce((sum, lead) => {
    const value = parseInt(lead.estimatedValue.replace(/[^0-9]/g, ''), 10) || 0;
    return sum + value;
  }, 0);
  const totalDecided = won.length + lost.length;
  const winRate = totalDecided > 0 ? Math.round((won.length / totalDecided) * 100) : 0;

  return {
    totalValue: totalValue > 0 ? `£${totalValue.toLocaleString('en-GB')}` : '£0',
    wonValue: wonValue > 0 ? `£${wonValue.toLocaleString('en-GB')}` : '£0',
    winRate: `${winRate}%`,
    activeLeads: active.length,
    wonCount: won.length,
    lostCount: lost.length,
  };
}
