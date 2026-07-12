// Admin Dashboard Data Fetching Layer
// Unified queries and types for the Admin Dashboard Client Intelligence Hub

import { supabase } from '@/lib/supabase/client';
import { getServiceById, getHighestTier, isIndustryService, type ServiceTier, type IndustryCategory } from '@/lib/services/service-catalog';

export interface DashboardStats {
  totalClients: number;
  intakePending: number;
  briefsNotGenerated: number;
  deliveriesInProgress: number;
  deliveriesDelivered: number;
  activeSubscriptions: number;
  foundationCount: number;
  operationsCount: number;
  industryCount: number;
}

export interface ClientRow {
  user_id: string;
  email: string;
  business_name: string;
  has_submitted_intake: boolean;
  intake_complete: boolean;
  intake_submitted_at: string | null;
  delivery_status: 'not_started' | 'in_progress' | 'delivered';
  delivery_link: string | null;
  created_at: string;
  admin_notes: string;
  brief_status?: string;
  brief_version?: number;
  documents_ready: number;
  documents_total: number;
  risk_level?: string;
  has_subscription: boolean;
  subscription_type?: 'monthly' | 'quarterly';
  purchased_services: Array<{ service_id: string; status: string }>;
  service_chips: Array<{ id: string; name: string; tier: ServiceTier }>;
  tier: ServiceTier;
  industry: IndustryCategory | null;
  urgency_score: number;
  days_since_created: number;
  is_test_client?: boolean;
}

export interface DashboardData {
  stats: DashboardStats;
  clients: ClientRow[];
  lastRefresh: Date;
}

export interface PaginationInfo {
  page: number;
  pageSize: number;
  total: number;
  hasMore: boolean;
}

export interface FilterState {
  search: string;
  deliveryStatus: string;
  intakeStatus: string;
  briefStatus: string;
  tier: string;
  industry: string;
  subscription: string;
  urgency: string;
}

export interface SortState {
  field: 'created_at' | 'email' | 'business_name' | 'documents_count' | 'urgency_score';
  direction: 'asc' | 'desc';
}

/**
 * Fetch all data needed for the admin dashboard in a single optimized pass.
 * Aggregates from: client_profiles, intake_responses, client_briefs, generated_documents, services_purchased
 */
export async function getAdminDashboardData(
  filters: FilterState,
  sort: SortState,
  page: number = 1,
  pageSize: number = 50
): Promise<{ data: DashboardData; pagination: PaginationInfo }> {
  // 1. Fetch all client profiles
  const { data: profiles, error: profileError } = await supabase
    .from('client_profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (profileError) {
    console.error('Error fetching profiles:', profileError);
    throw new Error('Failed to fetch client profiles');
  }

  if (!profiles || profiles.length === 0) {
    return {
      data: {
        stats: {
          totalClients: 0,
          intakePending: 0,
          briefsNotGenerated: 0,
          deliveriesInProgress: 0,
          deliveriesDelivered: 0,
          activeSubscriptions: 0,
          foundationCount: 0,
          operationsCount: 0,
          industryCount: 0,
        },
        clients: [],
        lastRefresh: new Date(),
      },
      pagination: { page, pageSize, total: 0, hasMore: false },
    };
  }

  const userIds = profiles.map(p => p.user_id);

  // 2. Parallel fetch: intake responses, briefs, documents, services
  const [
    intakeResult,
    briefsResult,
    docsResult,
    servicesResult,
    subscriptionsResult
  ] = await Promise.all([
    supabase.from('intake_responses').select('user_id, responses, submitted_at, intake_complete_for_services').in('user_id', userIds),
    supabase.from('client_briefs').select('client_id, status, version, risk_level, service_id').in('client_id', userIds),
    supabase.from('generated_documents').select('client_id, delivered_to_client, status').in('client_id', userIds),
    supabase.from('services_purchased').select('user_id, service_id, status').in('user_id', userIds).eq('status', 'active'),
    supabase.from('services_purchased').select('user_id, service_id, stripe_subscription_id').in('user_id', userIds).in('service_id', ['monthly_care_plan', 'quarterly_refresh']),
  ]);

  // 3. Build lookup maps
  const intakeMap = new Map<string, { email?: string; business_name?: string; intake_complete_for_services?: string[]; submitted_at?: string }>();
  if (intakeResult.data) {
    for (const row of intakeResult.data) {
      intakeMap.set(row.user_id, {
        email: row.responses?.q7_document_email,
        business_name: row.responses?.q2_business_name,
        intake_complete_for_services: row.intake_complete_for_services ?? [],
        submitted_at: row.submitted_at ?? undefined,
      });
    }
  }

  // Brief aggregation: per client, get highest version and latest status
  const briefMap = new Map<string, { status: string; version: number; risk_level?: string }>();
  if (briefsResult.data) {
    for (const brief of briefsResult.data) {
      const existing = briefMap.get(brief.client_id);
      if (!existing || (brief.version && brief.version > (existing.version || 0))) {
        briefMap.set(brief.client_id, {
          status: brief.status,
          version: brief.version || 1,
          risk_level: brief.risk_level,
        });
      }
    }
  }

  // Document counts per client
  const docCountsMap = new Map<string, { ready: number; total: number }>();
  if (docsResult.data) {
    for (const doc of docsResult.data) {
      const existing = docCountsMap.get(doc.client_id) || { ready: 0, total: 0 };
      existing.total += 1;
      if (doc.delivered_to_client) existing.ready += 1;
      docCountsMap.set(doc.client_id, existing);
    }
  }

  // Services per client
  const servicesMap = new Map<string, Array<{ service_id: string; status: string }>>();
  if (servicesResult.data) {
    for (const svc of servicesResult.data) {
      const list = servicesMap.get(svc.user_id) || [];
      list.push({ service_id: svc.service_id, status: svc.status });
      servicesMap.set(svc.user_id, list);
    }
  }

  // Subscriptions
  const subscriptionsMap = new Map<string, 'monthly' | 'quarterly'>();
  if (subscriptionsResult.data) {
    for (const sub of subscriptionsResult.data) {
      if (sub.service_id === 'monthly_care_plan') {
        subscriptionsMap.set(sub.user_id, 'monthly');
      } else if (sub.service_id === 'quarterly_refresh') {
        subscriptionsMap.set(sub.user_id, 'quarterly');
      }
    }
  }

  // 4. Transform to ClientRow[] with urgency scoring
  const now = new Date();
  const clientRows: ClientRow[] = profiles.map(p => {
    const intake = intakeMap.get(p.user_id) || {};
    const brief = briefMap.get(p.user_id);
    const docCounts = docCountsMap.get(p.user_id) || { ready: 0, total: 0 };
    const services = servicesMap.get(p.user_id) || [];
    const subscriptionType = subscriptionsMap.get(p.user_id);
    const serviceIds = services.map(s => s.service_id);

    // Compute tier
    const tier = getHighestTier(serviceIds);

    // Compute industry
    let industry: IndustryCategory | null = null;
    const industryService = services.find(s => isIndustryService(s.service_id));
    if (industryService) {
      const service = getServiceById(industryService.service_id);
      industry = service?.industry ?? null;
    }

    // Build service chips for display
    const serviceChips: Array<{ id: string; name: string; tier: ServiceTier }> = [];
    for (const svc of services) {
      const service = getServiceById(svc.service_id);
      if (service && service.mode !== 'subscription') {
        serviceChips.push({
          id: svc.service_id,
          name: service.name?.replace(' Pack', '').replace(' Starter', '') ?? svc.service_id,
          tier: service.tier,
        });
      }
    }
    // Sort chips: Foundation -> Operations -> Industry, then alphabetically
    serviceChips.sort((a, b) => {
      const tierOrder: Record<ServiceTier, number> = { foundation: 0, operations: 1, industry: 2 };
      const tierDiff = (tierOrder[a.tier] ?? 99) - (tierOrder[b.tier] ?? 99);
      if (tierDiff !== 0) return tierDiff;
      return a.name.localeCompare(b.name);
    });

    // Days since created
    const createdAt = new Date(p.created_at);
    const daysSinceCreated = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));

    // Intake complete check
    const purchasedServiceIds = serviceIds;
    const intakeCompleteForServices = p.intake_complete_for_services ?? [];
    let intakeComplete = false;
    if (p.has_submitted_intake) {
      // Legacy: if no tracking, treat as complete
      if (intakeCompleteForServices.length === 0) {
        intakeComplete = true;
      } else {
        // All purchased services must be in the complete list
        intakeComplete = purchasedServiceIds.every(id => intakeCompleteForServices.includes(id));
      }
    }

    // Urgency score
    const urgencyScore = computeUrgencyScore({
      hasSubmittedIntake: p.has_submitted_intake,
      intakeComplete,
      briefStatus: brief?.status,
      deliveryStatus: p.delivery_status,
      daysSinceCreated,
      hasSubscription: !!subscriptionType,
    });

    return {
      user_id: p.user_id,
      email: intake.email || p.user_id.substring(0, 8) + '...',
      business_name: intake.business_name || '',
      has_submitted_intake: p.has_submitted_intake,
      intake_complete: intakeComplete,
      intake_submitted_at: p.intake_submitted_at,
      delivery_status: p.delivery_status,
      delivery_link: p.delivery_link,
      created_at: p.created_at,
      admin_notes: p.admin_notes || '',
      brief_status: brief?.status,
      brief_version: brief?.version,
      documents_ready: docCounts.ready,
      documents_total: docCounts.total,
      risk_level: brief?.risk_level,
      has_subscription: !!subscriptionType,
      subscription_type: subscriptionType,
      purchased_services: services,
      service_chips: serviceChips,
      tier,
      industry,
      urgency_score: urgencyScore,
      days_since_created: daysSinceCreated,
      is_test_client: p.is_test_client ?? false,
    };
  });

  // 5. Apply filters
  let filtered = applyFilters(clientRows, filters);

  // 6. Apply sort
  filtered = applySort(filtered, sort);

  // 7. Compute stats from full dataset (pre-filter)
  const stats: DashboardStats = {
    totalClients: clientRows.length,
    intakePending: clientRows.filter(c => !c.has_submitted_intake || !c.intake_complete).length,
    briefsNotGenerated: clientRows.filter(c => c.intake_complete && (!c.brief_status || c.brief_status !== 'completed')).length,
    deliveriesInProgress: clientRows.filter(c => c.delivery_status === 'in_progress').length,
    deliveriesDelivered: clientRows.filter(c => c.delivery_status === 'delivered').length,
    activeSubscriptions: clientRows.filter(c => c.has_subscription).length,
    foundationCount: clientRows.filter(c => c.tier === 'foundation').length,
    operationsCount: clientRows.filter(c => c.tier === 'operations').length,
    industryCount: clientRows.filter(c => c.tier === 'industry').length,
  };

  // 8. Apply pagination
  const total = filtered.length;
  const startIndex = (page - 1) * pageSize;
  const paginatedClients = filtered.slice(startIndex, startIndex + pageSize);
  const hasMore = startIndex + pageSize < total;

  return {
    data: {
      stats,
      clients: paginatedClients,
      lastRefresh: new Date(),
    },
    pagination: { page, pageSize, total, hasMore },
  };
}

/**
 * Urgency score computation
 * Higher = more urgent
 */
function computeUrgencyScore(params: {
  hasSubmittedIntake: boolean;
  intakeComplete: boolean;
  briefStatus?: string;
  deliveryStatus: string;
  daysSinceCreated: number;
  hasSubscription: boolean;
}): number {
  const { hasSubmittedIntake, intakeComplete, briefStatus, deliveryStatus, daysSinceCreated, hasSubscription } = params;

  // Highest urgency: intake not submitted AND client created > 7 days ago
  if (!hasSubmittedIntake && daysSinceCreated > 7) return 100;

  // High urgency: intake complete but no brief
  if (intakeComplete && (!briefStatus || briefStatus !== 'completed')) return 90;

  // Medium-high: intake not submitted but recent
  if (!hasSubmittedIntake) return 80;

  // Medium: brief ready but delivery not started
  if (briefStatus === 'completed' && deliveryStatus === 'not_started') return 70;

  // Lower: delivery in progress
  if (deliveryStatus === 'in_progress') return 50;

  // Low: all delivered
  if (deliveryStatus === 'delivered') return 20;

  // Lowest: has subscription, no urgent items
  if (hasSubscription) return 10;

  return 60;
}

/**
 * Apply filter state to client rows
 */
function applyFilters(clients: ClientRow[], filters: FilterState): ClientRow[] {
  return clients.filter(client => {
    // Search
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch =
        client.email.toLowerCase().includes(searchLower) ||
        client.business_name.toLowerCase().includes(searchLower) ||
        client.user_id.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }

    // Delivery status
    if (filters.deliveryStatus && filters.deliveryStatus !== 'all') {
      if (client.delivery_status !== filters.deliveryStatus) return false;
    }

    // Intake status
    if (filters.intakeStatus && filters.intakeStatus !== 'all') {
      if (filters.intakeStatus === 'pending' && client.has_submitted_intake) return false;
      if (filters.intakeStatus === 'partial' && !(client.has_submitted_intake && !client.intake_complete)) return false;
      if (filters.intakeStatus === 'complete' && !client.intake_complete) return false;
    }

    // Brief status
    if (filters.briefStatus && filters.briefStatus !== 'all') {
      if (filters.briefStatus === 'none' && client.brief_status) return false;
      if (filters.briefStatus === 'generating' && client.brief_status !== 'generating') return false;
      if (filters.briefStatus === 'ready' && client.brief_status !== 'completed') return false;
      if (filters.briefStatus === 'failed' && client.brief_status !== 'failed') return false;
    }

    // Tier
    if (filters.tier && filters.tier !== 'all') {
      if (client.tier !== filters.tier) return false;
    }

    // Industry
    if (filters.industry && filters.industry !== 'all') {
      if (client.industry !== filters.industry) return false;
    }

    // Subscription
    if (filters.subscription && filters.subscription !== 'all') {
      if (filters.subscription === 'with_subscription' && !client.has_subscription) return false;
      if (filters.subscription === 'no_subscription' && client.has_subscription) return false;
    }

    // Urgency
    if (filters.urgency && filters.urgency !== 'all') {
      if (filters.urgency === 'urgent' && client.urgency_score < 70) return false;
      if (filters.urgency === 'normal' && client.urgency_score >= 70) return false;
    }

    return true;
  });
}

/**
 * Apply sort to client rows
 */
function applySort(clients: ClientRow[], sort: SortState): ClientRow[] {
  const sorted = [...clients].sort((a, b) => {
    let comparison = 0;

    switch (sort.field) {
      case 'created_at':
        comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        break;
      case 'email':
        comparison = a.email.localeCompare(b.email);
        break;
      case 'business_name':
        comparison = a.business_name.localeCompare(b.business_name);
        break;
      case 'documents_count':
        comparison = a.documents_ready - b.documents_ready;
        break;
      case 'urgency_score':
        comparison = a.urgency_score - b.urgency_score;
        break;
      default:
        comparison = 0;
    }

    return sort.direction === 'asc' ? comparison : -comparison;
  });

  // Default: urgency DESC, then created_at DESC
  if (sort.field !== 'urgency_score') {
    return sorted;
  }

  return sorted;
}

/**
 * Export clients to CSV
 */
export function exportClientsToCSV(clients: ClientRow[], filename: string): void {
  const headers = [
    'Email',
    'Business Name',
    'User ID',
    'Tier',
    'Industry',
    'Intake Status',
    'Brief Status',
    'Brief Version',
    'Documents Ready',
    'Documents Total',
    'Services',
    'Delivery Status',
    'Subscription',
    'Created',
    'Days Since Created',
    'Urgency Score',
  ];

  const rows = clients.map(c => [
    c.email,
    c.business_name,
    c.user_id,
    c.tier,
    c.industry || '',
    !c.has_submitted_intake ? 'Pending' : c.intake_complete ? 'Complete' : 'Partial',
    c.brief_status || 'None',
    c.brief_version?.toString() || '',
    c.documents_ready.toString(),
    c.documents_total.toString(),
    c.service_chips.map(s => s.name).join('; '),
    c.delivery_status,
    c.subscription_type || '',
    new Date(c.created_at).toLocaleDateString('en-GB'),
    c.days_since_created.toString(),
    c.urgency_score.toString(),
  ]);

  // Add UTF-8 BOM for Excel compatibility
  const BOM = '\uFEFF';
  const csvContent = BOM + [headers.join(','), ...rows.map(r => r.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
