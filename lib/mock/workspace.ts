export interface MockApplication {
  id: string;
  reference: string;
  title: string;
  address: string;
  council: string;
  dateReceived: string;
  status: 'Pending' | 'Approved' | 'Refused' | 'Withdrawn';
  distance: string;
}

export interface MockPipelineStage {
  stage: string;
  count: number;
  color: string;
}

export interface MockFollowUp {
  id: string;
  leadName: string;
  property: string;
  dueDate: string;
  type: 'Call' | 'Email' | 'Visit' | 'Proposal';
}

export interface MockActivityItem {
  id: string;
  action: string;
  detail: string;
  time: string;
  icon: 'plus' | 'mail' | 'check' | 'phone' | 'file';
}

export interface MockStat {
  label: string;
  value: number;
  trend: string;
  trendUp: boolean;
  icon: 'search' | 'users' | 'file' | 'calendar';
}

export const mockStats: MockStat[] = [
  { label: 'New applications', value: 128, trend: '+12%', trendUp: true, icon: 'search' },
  { label: 'New leads', value: 12, trend: '+3', trendUp: true, icon: 'users' },
  { label: 'Proposals sent', value: 8, trend: '+2', trendUp: true, icon: 'file' },
  { label: 'Follow-ups due', value: 17, trend: '5 today', trendUp: true, icon: 'calendar' },
];

export const mockRecentApplications: MockApplication[] = [
  {
    id: '1',
    reference: '24/01234/FUL',
    title: 'Replacement of windows and doors',
    address: '12 High Street, Amersham, HP6 5BA',
    council: 'Buckinghamshire Council',
    dateReceived: '28 Aug 2026',
    status: 'Pending',
    distance: '8 miles',
  },
  {
    id: '2',
    reference: '24/01235/FUL',
    title: 'Rear extension and alterations',
    address: '45 The Broadway, Rickmansworth, WD3 7AB',
    council: 'Three Rivers District',
    dateReceived: '27 Aug 2026',
    status: 'Pending',
    distance: '12 miles',
  },
  {
    id: '3',
    reference: '24/01236/FUL',
    title: 'Construction of a new dwelling',
    address: '3 School Lane, Amersham, HP6 5AB',
    council: 'Buckinghamshire Council',
    dateReceived: '26 Aug 2026',
    status: 'Approved',
    distance: '6 miles',
  },
  {
    id: '4',
    reference: '24/01238/FUL',
    title: 'Replacement of existing roof covering',
    address: '22 Station Road, Chesham, HP5 1AB',
    council: 'Buckinghamshire Council',
    dateReceived: '25 Aug 2026',
    status: 'Pending',
    distance: '14 miles',
  },
];

export const mockPipelineStages: MockPipelineStage[] = [
  { stage: 'New', count: 8, color: 'bg-sky-500' },
  { stage: 'Contacted', count: 5, color: 'bg-amber-500' },
  { stage: 'Proposal Sent', count: 3, color: 'bg-violet-500' },
  { stage: 'Follow Up', count: 2, color: 'bg-orange-500' },
  { stage: 'Won', count: 4, color: 'bg-emerald-500' },
];

export const mockFollowUps: MockFollowUp[] = [
  { id: '1', leadName: 'J. Smith — 12 High Street', property: 'Amersham, HP6 5BA', dueDate: 'Today, 2:00 PM', type: 'Call' },
  { id: '2', leadName: 'A. Brown — 45 The Broadway', property: 'Rickmansworth, WD3 7AB', dueDate: 'Tomorrow, 10:00 AM', type: 'Proposal' },
  { id: '3', leadName: 'R. Patel — 22 Station Road', property: 'Chesham, HP5 1AB', dueDate: '04 Sep, 9:00 AM', type: 'Visit' },
];

export const mockActivity: MockActivityItem[] = [
  { id: '1', action: 'Lead added', detail: '12 High Street, Amersham — Replacement windows', time: '2 hours ago', icon: 'plus' },
  { id: '2', action: 'Proposal sent by post', detail: '45 The Broadway, Rickmansworth — Rear extension', time: '5 hours ago', icon: 'mail' },
  { id: '3', action: 'Lead moved to Won', detail: '9 Park Avenue, Chorleywood — Door replacement', time: 'Yesterday', icon: 'check' },
  { id: '4', action: 'Follow-up call logged', detail: '78 High Street, Chesham — Loft conversion', time: 'Yesterday', icon: 'phone' },
  { id: '5', action: 'Proposal created', detail: '22 Station Road, Chesham — Roof replacement', time: '2 days ago', icon: 'file' },
];
