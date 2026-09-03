export type ActivityType =
  | 'lead_added'
  | 'application_discovered'
  | 'status_changed'
  | 'note_added'
  | 'follow_up_scheduled'
  | 'follow_up_completed'
  | 'proposal_created'
  | 'proposal_sent'
  | 'proposal_delivered'
  | 'contact_updated';

export type ActivityIcon = 'plus' | 'file' | 'mail' | 'check' | 'phone' | 'calendar' | 'send' | 'package';

export interface LeadActivity {
  id: string;
  leadId: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: string;
  icon: ActivityIcon;
}

const baseDate = new Date('2026-09-01');

function daysAgo(days: number): string {
  const d = new Date(baseDate);
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

export const mockActivities: LeadActivity[] = [
  // lead-1: 12 High Street, Amersham — Replacement windows (New)
  { id: 'a1-1', leadId: 'lead-1', type: 'application_discovered', title: 'Application discovered', description: '24/01234/FUL — Replacement of windows and doors', timestamp: daysAgo(4), icon: 'file' },
  { id: 'a1-2', leadId: 'lead-1', type: 'lead_added', title: 'Lead added', description: 'Added to CRM from planning application', timestamp: daysAgo(2), icon: 'plus' },
  { id: 'a1-3', leadId: 'lead-1', type: 'follow_up_scheduled', title: 'Follow-up scheduled', description: 'Call scheduled for 02 Sep', timestamp: daysAgo(2), icon: 'calendar' },

  // lead-2: 45 The Broadway, Rickmansworth — Rear extension (New)
  { id: 'a2-1', leadId: 'lead-2', type: 'application_discovered', title: 'Application discovered', description: '24/01235/FUL — Rear extension and alterations', timestamp: daysAgo(5), icon: 'file' },
  { id: 'a2-2', leadId: 'lead-2', type: 'lead_added', title: 'Lead added', description: 'Added to CRM from planning application', timestamp: daysAgo(1), icon: 'plus' },
  { id: 'a2-3', leadId: 'lead-2', type: 'follow_up_scheduled', title: 'Follow-up scheduled', description: 'Email scheduled for 03 Sep', timestamp: daysAgo(1), icon: 'calendar' },

  // lead-3: 3 School Lane, Amersham — New dwelling (Contacted)
  { id: 'a3-1', leadId: 'lead-3', type: 'application_discovered', title: 'Application discovered', description: '24/01236/FUL — Construction of a new dwelling', timestamp: daysAgo(6), icon: 'file' },
  { id: 'a3-2', leadId: 'lead-3', type: 'lead_added', title: 'Lead added', description: 'Added to CRM from planning application', timestamp: daysAgo(6), icon: 'plus' },
  { id: 'a3-3', leadId: 'lead-3', type: 'status_changed', title: 'Status changed', description: 'New → Contacted', timestamp: daysAgo(3), icon: 'check' },
  { id: 'a3-4', leadId: 'lead-3', type: 'follow_up_scheduled', title: 'Follow-up scheduled', description: 'Site visit scheduled for 04 Sep', timestamp: daysAgo(3), icon: 'calendar' },

  // lead-4: 78 High Street, Chesham — Loft conversion (Contacted)
  { id: 'a4-1', leadId: 'lead-4', type: 'application_discovered', title: 'Application discovered', description: '24/01237/FUL — Loft conversion with rear dormer', timestamp: daysAgo(7), icon: 'file' },
  { id: 'a4-2', leadId: 'lead-4', type: 'lead_added', title: 'Lead added', description: 'Added to CRM from planning application', timestamp: daysAgo(7), icon: 'plus' },
  { id: 'a4-3', leadId: 'lead-4', type: 'status_changed', title: 'Status changed', description: 'New → Contacted', timestamp: daysAgo(4), icon: 'check' },
  { id: 'a4-4', leadId: 'lead-4', type: 'follow_up_scheduled', title: 'Follow-up scheduled', description: 'Call scheduled for 02 Sep', timestamp: daysAgo(4), icon: 'calendar' },

  // lead-5: 22 Station Road, Chesham — Roof replacement (Proposal Sent)
  { id: 'a5-1', leadId: 'lead-5', type: 'application_discovered', title: 'Application discovered', description: '24/01238/FUL — Replacement of existing roof covering', timestamp: daysAgo(8), icon: 'file' },
  { id: 'a5-2', leadId: 'lead-5', type: 'lead_added', title: 'Lead added', description: 'Added to CRM from planning application', timestamp: daysAgo(8), icon: 'plus' },
  { id: 'a5-3', leadId: 'lead-5', type: 'status_changed', title: 'Status changed', description: 'New → Contacted', timestamp: daysAgo(5), icon: 'check' },
  { id: 'a5-4', leadId: 'lead-5', type: 'proposal_created', title: 'Proposal created', description: 'PI-10480 — Roof replacement proposal', timestamp: daysAgo(1), icon: 'file' },
  { id: 'a5-5', leadId: 'lead-5', type: 'proposal_sent', title: 'Proposal sent by post', description: 'PI-10480 sent to 22 Station Road, Chesham', timestamp: daysAgo(1), icon: 'send' },
  { id: 'a5-6', leadId: 'lead-5', type: 'status_changed', title: 'Status changed', description: 'Contacted → Proposal Sent', timestamp: daysAgo(1), icon: 'check' },

  // lead-6: 17 Victoria Road, Chorleywood — Wraparound extension (Proposal Sent)
  { id: 'a6-1', leadId: 'lead-6', type: 'application_discovered', title: 'Application discovered', description: '24/01243/FUL — Wraparound extension with bi-fold doors', timestamp: daysAgo(16), icon: 'file' },
  { id: 'a6-2', leadId: 'lead-6', type: 'lead_added', title: 'Lead added', description: 'Added to CRM from planning application', timestamp: daysAgo(16), icon: 'plus' },
  { id: 'a6-3', leadId: 'lead-6', type: 'status_changed', title: 'Status changed', description: 'New → Contacted', timestamp: daysAgo(10), icon: 'check' },
  { id: 'a6-4', leadId: 'lead-6', type: 'proposal_created', title: 'Proposal created', description: 'PI-10481 — Wraparound extension proposal', timestamp: daysAgo(4), icon: 'file' },
  { id: 'a6-5', leadId: 'lead-6', type: 'proposal_sent', title: 'Proposal sent by post', description: 'PI-10481 sent to 17 Victoria Road, Chorleywood', timestamp: daysAgo(3), icon: 'send' },
  { id: 'a6-6', leadId: 'lead-6', type: 'proposal_delivered', title: 'Proposal delivered', description: 'PI-10481 delivered to property', timestamp: daysAgo(2), icon: 'package' },
  { id: 'a6-7', leadId: 'lead-6', type: 'status_changed', title: 'Status changed', description: 'Contacted → Proposal Sent', timestamp: daysAgo(3), icon: 'check' },

  // lead-7: 31 Hill Road, Chalfont St Peter — Two-storey extension (Follow Up)
  { id: 'a7-1', leadId: 'lead-7', type: 'application_discovered', title: 'Application discovered', description: '24/01240/FUL — Two-storey rear extension', timestamp: daysAgo(12), icon: 'file' },
  { id: 'a7-2', leadId: 'lead-7', type: 'lead_added', title: 'Lead added', description: 'Added to CRM from planning application', timestamp: daysAgo(12), icon: 'plus' },
  { id: 'a7-3', leadId: 'lead-7', type: 'status_changed', title: 'Status changed', description: 'New → Contacted', timestamp: daysAgo(9), icon: 'check' },
  { id: 'a7-4', leadId: 'lead-7', type: 'proposal_created', title: 'Proposal created', description: 'PI-10478 — Two-storey extension proposal', timestamp: daysAgo(7), icon: 'file' },
  { id: 'a7-5', leadId: 'lead-7', type: 'proposal_sent', title: 'Proposal sent by post', description: 'PI-10478 sent to 31 Hill Road, Chalfont St Peter', timestamp: daysAgo(6), icon: 'send' },
  { id: 'a7-6', leadId: 'lead-7', type: 'status_changed', title: 'Status changed', description: 'Contacted → Proposal Sent', timestamp: daysAgo(6), icon: 'check' },
  { id: 'a7-7', leadId: 'lead-7', type: 'follow_up_completed', title: 'Follow-up completed', description: 'Called client — comparing quotes', timestamp: daysAgo(5), icon: 'phone' },
  { id: 'a7-8', leadId: 'lead-7', type: 'status_changed', title: 'Status changed', description: 'Proposal Sent → Follow Up', timestamp: daysAgo(5), icon: 'check' },
  { id: 'a7-9', leadId: 'lead-7', type: 'follow_up_scheduled', title: 'Follow-up scheduled', description: 'Call scheduled for 04 Sep', timestamp: daysAgo(5), icon: 'calendar' },

  // lead-8: 9 Park Avenue, Chorleywood — Side extension (Won)
  { id: 'a8-1', leadId: 'lead-8', type: 'application_discovered', title: 'Application discovered', description: '24/01239/FUL — Single-storey side extension', timestamp: daysAgo(10), icon: 'file' },
  { id: 'a8-2', leadId: 'lead-8', type: 'lead_added', title: 'Lead added', description: 'Added to CRM from planning application', timestamp: daysAgo(10), icon: 'plus' },
  { id: 'a8-3', leadId: 'lead-8', type: 'status_changed', title: 'Status changed', description: 'New → Contacted', timestamp: daysAgo(7), icon: 'check' },
  { id: 'a8-4', leadId: 'lead-8', type: 'proposal_created', title: 'Proposal created', description: 'PI-10479 — Side extension proposal', timestamp: daysAgo(5), icon: 'file' },
  { id: 'a8-5', leadId: 'lead-8', type: 'proposal_sent', title: 'Proposal sent by post', description: 'PI-10479 sent to 9 Park Avenue, Chorleywood', timestamp: daysAgo(4), icon: 'send' },
  { id: 'a8-6', leadId: 'lead-8', type: 'proposal_delivered', title: 'Proposal delivered', description: 'PI-10479 delivered to property', timestamp: daysAgo(3), icon: 'package' },
  { id: 'a8-7', leadId: 'lead-8', type: 'status_changed', title: 'Status changed', description: 'Proposal Sent → Won', timestamp: daysAgo(1), icon: 'check' },

  // lead-9: 14 The Green, Penn — Garage conversion (Won)
  { id: 'a9-1', leadId: 'lead-9', type: 'application_discovered', title: 'Application discovered', description: '24/01241/FUL — Garage conversion to habitable room', timestamp: daysAgo(14), icon: 'file' },
  { id: 'a9-2', leadId: 'lead-9', type: 'lead_added', title: 'Lead added', description: 'Added to CRM from planning application', timestamp: daysAgo(14), icon: 'plus' },
  { id: 'a9-3', leadId: 'lead-9', type: 'status_changed', title: 'Status changed', description: 'New → Contacted', timestamp: daysAgo(11), icon: 'check' },
  { id: 'a9-4', leadId: 'lead-9', type: 'proposal_created', title: 'Proposal created', description: 'PI-10477 — Garage conversion proposal', timestamp: daysAgo(9), icon: 'file' },
  { id: 'a9-5', leadId: 'lead-9', type: 'proposal_sent', title: 'Proposal sent by post', description: 'PI-10477 sent to 14 The Green, Penn', timestamp: daysAgo(8), icon: 'send' },
  { id: 'a9-6', leadId: 'lead-9', type: 'proposal_delivered', title: 'Proposal delivered', description: 'PI-10477 delivered to property', timestamp: daysAgo(7), icon: 'package' },
  { id: 'a9-7', leadId: 'lead-9', type: 'status_changed', title: 'Status changed', description: 'Proposal Sent → Won', timestamp: daysAgo(2), icon: 'check' },

  // lead-10: 8 Park Lane, Beaconsfield — Boundary wall (Lost)
  { id: 'a10-1', leadId: 'lead-10', type: 'application_discovered', title: 'Application discovered', description: '24/01242/FUL — Boundary wall and brick piers', timestamp: daysAgo(15), icon: 'file' },
  { id: 'a10-2', leadId: 'lead-10', type: 'lead_added', title: 'Lead added', description: 'Added to CRM from planning application', timestamp: daysAgo(15), icon: 'plus' },
  { id: 'a10-3', leadId: 'lead-10', type: 'status_changed', title: 'Status changed', description: 'New → Contacted', timestamp: daysAgo(12), icon: 'check' },
  { id: 'a10-4', leadId: 'lead-10', type: 'proposal_created', title: 'Proposal created', description: 'PI-10476 — Boundary wall proposal', timestamp: daysAgo(10), icon: 'file' },
  { id: 'a10-5', leadId: 'lead-10', type: 'proposal_sent', title: 'Proposal sent by post', description: 'PI-10476 sent to 8 Park Lane, Beaconsfield', timestamp: daysAgo(9), icon: 'send' },
  { id: 'a10-6', leadId: 'lead-10', type: 'status_changed', title: 'Status changed', description: 'Contacted → Lost', timestamp: daysAgo(7), icon: 'check' },
];

export function getActivityByLeadId(leadId: string): LeadActivity[] {
  return mockActivities
    .filter((a) => a.leadId === leadId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export function createActivityEntry(
  leadId: string,
  type: ActivityType,
  title: string,
  description: string,
  icon: ActivityIcon
): LeadActivity {
  return {
    id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    leadId,
    type,
    title,
    description,
    timestamp: new Date().toISOString(),
    icon,
  };
}
