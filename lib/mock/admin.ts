// Mock data for the internal admin interface.
// Customer-facing; will be replaced by real backend/API data in the integration phase.

export type ScraperStatus = {
  lastRun: string;
  status: 'healthy' | 'running' | 'degraded';
  councilsProcessed: number;
  applicationsImported: number;
  errors: number;
  nextRun: string;
}

export type CouncilRow = {
  council: string;
  region: string;
  status: 'healthy' | 'warning' | 'error' | 'pending';
  applications: number;
  lastUpdated: string;
}

export type AdminUser = {
  name: string;
  email: string;
  company: string;
  plan: 'Local' | 'Regional' | 'National' | 'Enterprise';
  councils: number;
  status: 'active' | 'trial' | 'past_due' | 'cancelled';
  joined: string;
}

export type AdminPayment = {
  id: string;
  company: string;
  plan: 'Local' | 'Regional' | 'National' | 'Enterprise';
  amount: string;
  date: string;
  status: 'paid' | 'refunded' | 'failed';
}

export type AdminMailItem = {
  id: string;
  proposal: string;
  recipient: string;
  councilArea: string;
  sent: string;
  status: 'mailed' | 'delivered' | 'processing' | 'delivery_issue';
}

export type SystemService = {
  name: string;
  status: 'operational' | 'degraded' | 'down';
  detail: string;
}

export const scraperStatus: ScraperStatus = {
  lastRun: 'Today, 09:42',
  status: 'healthy',
  councilsProcessed: 312,
  applicationsImported: 14821,
  errors: 3,
  nextRun: 'Tomorrow, 06:00',
};

export const councils: CouncilRow[] = [
  { council: 'Buckinghamshire Council', region: 'South East', status: 'healthy', applications: 48231, lastUpdated: 'Today, 09:38' },
  { council: 'Hertfordshire County Council', region: 'East', status: 'healthy', applications: 39120, lastUpdated: 'Today, 09:41' },
  { council: 'London Borough of Hillingdon', region: 'London', status: 'healthy', applications: 52814, lastUpdated: 'Today, 09:42' },
  { council: 'Manchester City Council', region: 'North West', status: 'warning', applications: 61207, lastUpdated: 'Yesterday, 18:12' },
  { council: 'Birmingham City Council', region: 'West Midlands', status: 'error', applications: 54419, lastUpdated: '2 days ago' },
  { council: 'Leeds City Council', region: 'Yorkshire', status: 'healthy', applications: 47966, lastUpdated: 'Today, 09:40' },
  { council: 'Bristol City Council', region: 'South West', status: 'pending', applications: 0, lastUpdated: '—' },
  { council: 'Edinburgh Council', region: 'Scotland', status: 'healthy', applications: 41873, lastUpdated: 'Today, 09:35' },
  { council: 'Cardiff Council', region: 'Wales', status: 'healthy', applications: 33208, lastUpdated: 'Today, 09:39' },
  { council: 'Newcastle City Council', region: 'North East', status: 'healthy', applications: 36440, lastUpdated: 'Today, 09:42' },
];

export const adminUsers: AdminUser[] = [
  { name: 'Sarah Mitchell', email: 'sarah@chilternwindows.co.uk', company: 'Chiltern Windows Ltd', plan: 'Regional', councils: 8, status: 'active', joined: '12 Mar 2026' },
  { name: 'James Carter', email: 'james@carterbuilding.co.uk', company: 'Carter Building Co', plan: 'Local', councils: 1, status: 'active', joined: '03 Apr 2026' },
  { name: 'Emma Roberts', email: 'emma@robertsroofing.com', company: 'Roberts Roofing', plan: 'National', councils: 312, status: 'active', joined: '21 Jan 2026' },
  { name: 'David Okafor', email: 'david@okaforextensions.uk', company: 'Okafor Extensions', plan: 'Regional', councils: 10, status: 'trial', joined: '08 Sep 2026' },
  { name: 'Liam Walsh', email: 'liam@walshlandscaping.co.uk', company: 'Walsh Landscaping', plan: 'Local', councils: 1, status: 'past_due', joined: '17 May 2026' },
  { name: 'Priya Shah', email: 'priya@shahdesigns.co.uk', company: 'Shah Architectural Designs', plan: 'Enterprise', councils: 312, status: 'active', joined: '02 Feb 2026' },
  { name: 'Tom Bennett', email: 'tom@bennettelectrical.uk', company: 'Bennett Electrical', plan: 'Local', councils: 1, status: 'cancelled', joined: '29 Nov 2025' },
];

export const adminPayments: AdminPayment[] = [
  { id: 'PAY-20841', company: 'Chiltern Windows Ltd', plan: 'Regional', amount: '£79.00', date: '14 Sep 2026', status: 'paid' },
  { id: 'PAY-20840', company: 'Roberts Roofing', plan: 'National', amount: '£199.00', date: '14 Sep 2026', status: 'paid' },
  { id: 'PAY-20839', company: 'Carter Building Co', plan: 'Local', amount: '£29.00', date: '13 Sep 2026', status: 'paid' },
  { id: 'PAY-20838', company: 'Walsh Landscaping', plan: 'Local', amount: '£29.00', date: '12 Sep 2026', status: 'failed' },
  { id: 'PAY-20837', company: 'Shah Architectural Designs', plan: 'Enterprise', amount: '£899.00', date: '10 Sep 2026', status: 'paid' },
  { id: 'PAY-20836', company: 'Bennett Electrical', plan: 'Local', amount: '£29.00', date: '09 Sep 2026', status: 'refunded' },
];

export const adminMail: AdminMailItem[] = [
  { id: 'PI-10482', proposal: 'Replacement windows and doors', recipient: '12 High Street, Amersham', councilArea: 'Buckinghamshire', sent: 'Today, 08:15', status: 'processing' },
  { id: 'PI-10481', proposal: 'Rear extension and alterations', recipient: '4 Elm Close, Watford', councilArea: 'Hertfordshire', sent: 'Today, 08:15', status: 'mailed' },
  { id: 'PI-10480', proposal: 'Loft conversion', recipient: '22 Green Lane, Ruislip', councilArea: 'Hillingdon', sent: 'Yesterday, 14:02', status: 'delivered' },
  { id: 'PI-10479', proposal: 'New dwelling build', recipient: '7 Orchard Way, Aylesbury', councilArea: 'Buckinghamshire', sent: 'Yesterday, 14:02', status: 'delivered' },
  { id: 'PI-10478', proposal: 'Roof replacement', recipient: '15 Station Road, Harrow', councilArea: 'Harrow', sent: '12 Sep 2026', status: 'delivery_issue' },
  { id: 'PI-10477', proposal: 'Replacement windows and doors', recipient: '31 Parkside Ave, Uxbridge', councilArea: 'Hillingdon', sent: '12 Sep 2026', status: 'delivered' },
];

export const systemServices: SystemService[] = [
  { name: 'Planning data scraper', status: 'operational', detail: 'Last run today, 09:42 — 14,821 applications imported' },
  { name: 'Website', status: 'operational', detail: 'All pages serving normally' },
  { name: 'Payments (Stripe)', status: 'operational', detail: 'Webhook endpoint responding' },
  { name: 'Mail provider', status: 'degraded', detail: 'Delivery confirmations delayed by ~2 hours' },
  { name: 'Supabase auth & database', status: 'operational', detail: 'All regions responding' },
];

export const scraperErrors = [
  { council: 'Birmingham City Council', error: 'Council portal returned HTTP 503 — site unavailable', time: 'Today, 09:44' },
  { council: 'Manchester City Council', error: 'Parse timeout after 30s — layout change suspected', time: 'Today, 09:41' },
  { council: 'Manchester City Council', error: '3,120 records skipped due to missing reference field', time: 'Today, 09:41' },
];