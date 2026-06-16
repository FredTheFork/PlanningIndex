'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import {
  Users, FileText, Clock, CheckCircle2, Search, ChevronRight,
  Filter, Download, RefreshCw, AlertTriangle, Briefcase, Send,
  Calendar, X, TrendingUp, BarChart3, Inbox, Package, Layers, Building2
} from 'lucide-react';
import { getServiceById, getHighestTier, isIndustryService, type ServiceTier, type IndustryCategory } from '@/lib/services/service-catalog';

interface ClientRow {
  user_id: string;
  email: string;
  business_name: string;
  has_submitted_intake: boolean;
  intake_submitted_at: string | null;
  delivery_status: 'not_started' | 'in_progress' | 'delivered';
  delivery_link: string | null;
  created_at: string;
  admin_notes: string;
  purchased_upsells: string[];
  brief_status?: string;
  documents_count?: number;
  risk_level?: string;
  has_quarterly_refresh?: boolean;
  has_monthly_care_plan?: boolean;
  purchased_services?: Array<{ service_id: string; status: string }>;
  tier: ServiceTier;
  industry: IndustryCategory | null;
}

export default function AdminDashboard() {
  const [clients, setClients] = useState<ClientRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterIntake, setFilterIntake] = useState<string>('all');
  const [filterTier, setFilterTier] = useState<string>('all');
  const [filterIndustry, setFilterIndustry] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedClients, setSelectedClients] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const { data, error: profileError } = await supabase
        .from('client_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profileError) {
        console.error('Error fetching profiles:', profileError);
        return;
      }

      const profiles = data || [];

      // Fetch emails and business names from intake_responses
      const userIds = profiles.map(p => p.user_id);
      let clientDataMap = new Map<string, any>();

      if (userIds.length > 0) {
        const { data: intakeData } = await supabase
          .from('intake_responses')
          .select('user_id, responses')
          .in('user_id', userIds);

        if (intakeData) {
          for (const row of intakeData) {
            clientDataMap.set(row.user_id, {
              email: row.responses?.q7_document_email,
              business_name: row.responses?.q2_business_name,
            });
          }
        }

        // Fetch brief status
        const { data: briefsData } = await supabase
          .from('client_briefs')
          .select('client_id, status, risk_level')
          .in('client_id', userIds);

        if (briefsData) {
          for (const brief of briefsData) {
            const existing = clientDataMap.get(brief.client_id) || {};
            clientDataMap.set(brief.client_id, {
              ...existing,
              brief_status: brief.status,
              risk_level: brief.risk_level,
            });
          }
        }

        // Fetch document counts
        const { data: docsData } = await supabase
          .from('generated_documents')
          .select('client_id')
          .in('client_id', userIds);

        if (docsData) {
          const docCounts = new Map<string, number>();
          for (const doc of docsData) {
            docCounts.set(doc.client_id, (docCounts.get(doc.client_id) || 0) + 1);
          }
          for (const [clientId, count] of docCounts) {
            const existing = clientDataMap.get(clientId) || {};
            clientDataMap.set(clientId, {
              ...existing,
              documents_count: count,
            });
          }
        }

        // Fetch all purchased services per client
        const { data: allServices } = await supabase
          .from('services_purchased')
          .select('user_id, service_id, status')
          .in('user_id', userIds)
          .eq('status', 'active');

        if (allServices) {
          const servicesByUser = new Map<string, Array<{ service_id: string; status: string }>>();
          for (const svc of allServices) {
            const list = servicesByUser.get(svc.user_id) || [];
            list.push({ service_id: svc.service_id, status: svc.status });
            servicesByUser.set(svc.user_id, list);
          }
          for (const [uid, svcs] of servicesByUser) {
            const existing = clientDataMap.get(uid) || {};
            const serviceIds = svcs.map(s => s.service_id);

            // Compute highest tier from purchased services
            const tier = getHighestTier(serviceIds);

            // Compute primary industry from purchased industry packs
            const industryService = svcs.find(s => isIndustryService(s.service_id));
            let industry: IndustryCategory | null = null;
            if (industryService) {
              const service = getServiceById(industryService.service_id);
              industry = service?.industry ?? null;
            }

            // Check for subscription services
            const hasQuarterlyRefresh = serviceIds.includes('quarterly_refresh');
            const hasMonthlyCarePlan = serviceIds.includes('monthly_care_plan');

            clientDataMap.set(uid, {
              ...existing,
              purchased_services: svcs,
              has_quarterly_refresh: hasQuarterlyRefresh,
              has_monthly_care_plan: hasMonthlyCarePlan,
              tier,
              industry,
            });
          }
        }
      }

      const clientRows: ClientRow[] = profiles.map(p => {
        const data = clientDataMap.get(p.user_id) || {};
        return {
          user_id: p.user_id,
          email: data.email || p.user_id.substring(0, 8) + '...',
          business_name: data.business_name || '',
          has_submitted_intake: p.has_submitted_intake,
          intake_submitted_at: p.intake_submitted_at,
          delivery_status: p.delivery_status,
          delivery_link: p.delivery_link,
          created_at: p.created_at,
          admin_notes: p.admin_notes || '',
          purchased_upsells: p.purchased_upsells || [],
          brief_status: data.brief_status,
          documents_count: data.documents_count || 0,
          risk_level: data.risk_level,
          has_quarterly_refresh: data.has_quarterly_refresh ?? false,
          has_monthly_care_plan: data.has_monthly_care_plan ?? false,
          purchased_services: data.purchased_services || [],
          tier: data.tier ?? 'foundation',
          industry: data.industry ?? null,
        };
      });

      setClients(clientRows);
    } finally {
      setLoading(false);
    }
  };

  const filteredClients = clients.filter(c => {
    const matchesSearch = c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.user_id.toLowerCase().includes(search.toLowerCase()) ||
      c.business_name?.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filterStatus === 'all' || c.delivery_status === filterStatus;
    const matchesIntake = filterIntake === 'all' ||
      (filterIntake === 'submitted' && c.has_submitted_intake) ||
      (filterIntake === 'pending' && !c.has_submitted_intake);
    const matchesTier = filterTier === 'all' || c.tier === filterTier;
    const matchesIndustry = filterIndustry === 'all' || c.industry === filterIndustry;
    return matchesSearch && matchesFilter && matchesIntake && matchesTier && matchesIndustry;
  }).sort((a, b) => {
    let comparison = 0;
    switch (sortBy) {
      case 'created_at':
        comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        break;
      case 'email':
        comparison = a.email.localeCompare(b.email);
        break;
      case 'documents_count':
        comparison = (a.documents_count || 0) - (b.documents_count || 0);
        break;
      case 'delivery_status':
        comparison = a.delivery_status.localeCompare(b.delivery_status);
        break;
      default:
        comparison = 0;
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const stats = {
    total: clients.length,
    submitted: clients.filter(c => c.has_submitted_intake).length,
    pending: clients.filter(c => !c.has_submitted_intake).length,
    inProgress: clients.filter(c => c.delivery_status === 'in_progress').length,
    delivered: clients.filter(c => c.delivery_status === 'delivered').length,
    totalDocs: clients.reduce((sum, c) => sum + (c.documents_count || 0), 0),
    highRisk: clients.filter(c => c.risk_level === 'High').length,
    foundation: clients.filter(c => c.tier === 'foundation').length,
    operations: clients.filter(c => c.tier === 'operations').length,
    industry: clients.filter(c => c.tier === 'industry').length,
  };

  const handleSelectClient = (userId: string) => {
    setSelectedClients(prev => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedClients.size === filteredClients.length) {
      setSelectedClients(new Set());
    } else {
      setSelectedClients(new Set(filteredClients.map(c => c.user_id)));
    }
  };

  const handleExportCSV = () => {
    const headers = ['Email', 'Business Name', 'Intake Status', 'Delivery Status', 'Documents', 'Created'];
    const rows = filteredClients.map(c => [
      c.email,
      c.business_name,
      c.has_submitted_intake ? 'Submitted' : 'Pending',
      c.delivery_status,
      c.documents_count?.toString() || '0',
      new Date(c.created_at).toLocaleDateString('en-GB'),
    ]);

    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `clients_export_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-inter font-bold text-[#1B3F7A] text-2xl mb-1">
            Admin Dashboard
          </h1>
          <p className="font-inter text-gray-600 text-sm">
            Manage all clients, intake forms, and document delivery.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchClients}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-md font-inter text-sm font-medium transition-colors"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-3 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-md font-inter text-sm font-medium transition-colors"
          >
            <Download size={16} />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* Stats cards - key metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard icon={Users} label="Total" value={stats.total} color="navy" />
        <StatCard icon={Inbox} label="Pending" value={stats.pending} color="amber" alert={stats.pending > 0} />
        <StatCard icon={Clock} label="In Progress" value={stats.inProgress} color="medium-blue" />
        <StatCard icon={Send} label="Delivered" value={stats.delivered} color="success" />
        <StatCard icon={Briefcase} label="Docs" value={stats.totalDocs} color="medium-blue" />
        <StatCard icon={AlertTriangle} label="Risk" value={stats.highRisk} color="red" alert={stats.highRisk > 0} />
      </div>

      {/* Tier breakdown */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard icon={Layers} label="Foundation" value={stats.foundation} color="blue" />
        <StatCard icon={Layers} label="Operations" value={stats.operations} color="amber" />
        <StatCard icon={Layers} label="Industry" value={stats.industry} color="teal" />
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-lg border border-gray-200 p-3">
        <div className="flex flex-col lg:flex-row gap-3">
          {/* Search */}
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by email, ID, or business name..."
              className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2C68C4] focus:border-[#2C68C4] font-inter text-sm"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md font-inter text-sm font-medium transition-colors"
            >
              <Filter size={14} />
              Filters
              {showFilters ? <X size={14} /> : null}
            </button>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2C68C4] focus:border-[#2C68C4] font-inter text-sm bg-white"
            >
              <option value="created_at">Date</option>
              <option value="email">Email</option>
              <option value="documents_count">Docs</option>
              <option value="delivery_status">Status</option>
            </select>

            <button
              onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
              className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md font-inter text-sm font-medium transition-colors"
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="mt-3 pt-3 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            <div>
              <label className="block font-inter text-gray-700 text-xs mb-1">Delivery Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2C68C4] focus:border-[#2C68C4] font-inter text-sm bg-white"
              >
                <option value="all">All Statuses</option>
                <option value="not_started">Not Started</option>
                <option value="in_progress">In Progress</option>
                <option value="delivered">Delivered</option>
              </select>
            </div>

            <div>
              <label className="block font-inter text-gray-700 text-xs mb-1">Intake Status</label>
              <select
                value={filterIntake}
                onChange={(e) => setFilterIntake(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2C68C4] focus:border-[#2C68C4] font-inter text-sm bg-white"
              >
                <option value="all">All</option>
                <option value="submitted">Submitted</option>
                <option value="pending">Pending</option>
              </select>
            </div>

            <div>
              <label className="block font-inter text-gray-700 text-xs mb-1">Tier</label>
              <select
                value={filterTier}
                onChange={(e) => setFilterTier(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2C68C4] focus:border-[#2C68C4] font-inter text-sm bg-white"
              >
                <option value="all">All Tiers</option>
                <option value="foundation">Foundation</option>
                <option value="operations">Operations</option>
                <option value="industry">Industry</option>
              </select>
            </div>

            <div>
              <label className="block font-inter text-gray-700 text-xs mb-1">Industry</label>
              <select
                value={filterIndustry}
                onChange={(e) => setFilterIndustry(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2C68C4] focus:border-[#2C68C4] font-inter text-sm bg-white"
              >
                <option value="all">All Industries</option>
                <option value="coach">Coach</option>
                <option value="photographer">Photographer</option>
                <option value="consultant">Consultant</option>
                <option value="contractor">Contractor</option>
              </select>
            </div>

            <div className="flex items-end gap-2">
              <button
                onClick={() => {
                  setFilterStatus('all');
                  setFilterIntake('all');
                  setFilterTier('all');
                  setFilterIndustry('all');
                  setSearch('');
                }}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md font-inter text-sm font-medium transition-colors"
              >
                Clear
              </button>
              <div className="px-3 py-2 bg-[#FAFBFC] rounded-md flex-1">
                <span className="font-inter text-sm text-gray-600">{filteredClients.length} results</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Client list */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#1B3F7A]" />
        </div>
      ) : filteredClients.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <Users size={32} className="text-gray-400 mx-auto mb-3" />
          <p className="font-inter text-gray-600 text-sm">No clients found.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full min-w-[1100px]">
              <thead>
                <tr className="bg-[#FAFBFC] border-b border-gray-200">
                  <th className="font-inter font-semibold text-[#1B3F7A] text-xs uppercase tracking-wider text-left px-4 py-2.5 w-10">
                    <input
                      type="checkbox"
                      checked={selectedClients.size === filteredClients.length && filteredClients.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="font-inter font-semibold text-[#1B3F7A] text-xs uppercase tracking-wider text-left px-4 py-2.5">Client</th>
                  <th className="font-inter font-semibold text-[#1B3F7A] text-xs uppercase tracking-wider text-left px-4 py-2.5">Tier</th>
                  <th className="font-inter font-semibold text-[#1B3F7A] text-xs uppercase tracking-wider text-left px-4 py-2.5">Industry</th>
                  <th className="font-inter font-semibold text-[#1B3F7A] text-xs uppercase tracking-wider text-left px-4 py-2.5">Intake</th>
                  <th className="font-inter font-semibold text-[#1B3F7A] text-xs uppercase tracking-wider text-left px-4 py-2.5">Brief</th>
                  <th className="font-inter font-semibold text-[#1B3F7A] text-xs uppercase tracking-wider text-left px-4 py-2.5">Docs</th>
                  <th className="font-inter font-semibold text-[#1B3F7A] text-xs uppercase tracking-wider text-left px-4 py-2.5">Services</th>
                  <th className="font-inter font-semibold text-[#1B3F7A] text-xs uppercase tracking-wider text-left px-4 py-2.5">Status</th>
                  <th className="font-inter font-semibold text-[#1B3F7A] text-xs uppercase tracking-wider text-left px-4 py-2.5">Sub</th>
                  <th className="font-inter font-semibold text-[#1B3F7A] text-xs uppercase tracking-wider text-left px-4 py-2.5">Created</th>
                  <th className="font-inter font-semibold text-[#1B3F7A] text-xs uppercase tracking-wider text-right px-4 py-2.5 w-20"></th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.map((client) => (
                  <tr
                    key={client.user_id}
                    className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${
                      selectedClients.has(client.user_id) ? 'bg-blue-50' : ''
                    }`}
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedClients.has(client.user_id)}
                        onChange={() => handleSelectClient(client.user_id)}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-inter text-sm text-gray-900 font-medium truncate max-w-[180px]">
                        {client.email}
                      </div>
                      {client.business_name && (
                        <div className="font-inter text-xs text-[#1B3F7A] truncate max-w-[180px]">
                          {client.business_name}
                        </div>
                      )}
                      <div className="font-inter text-xs text-gray-600 truncate max-w-[180px]">
                        {client.user_id.substring(0, 8)}...
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <TierBadge tier={client.tier} />
                    </td>
                    <td className="px-4 py-3">
                      {client.industry ? (
                        <span className="inline-flex items-center gap-1 font-inter text-xs font-medium text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full">
                          <Building2 size={10} />
                          {client.industry.charAt(0).toUpperCase() + client.industry.slice(1)}
                        </span>
                      ) : (
                        <span className="font-inter text-xs text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {client.has_submitted_intake ? (
                        <span className="inline-flex items-center gap-1 font-inter text-xs font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
                          <CheckCircle2 size={10} />
                          Done
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 font-inter text-xs font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
                          <Clock size={10} />
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <BriefStatusBadge status={client.brief_status} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <span className="font-inter text-xs text-gray-900">
                          {client.documents_count || 0}
                        </span>
                        {client.risk_level && (
                          <RiskBadge level={client.risk_level} />
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {(client.purchased_services || []).map((svc: { service_id: string; status: string }) => {
                          const service = getServiceById(svc.service_id);
                          if (!service || service.mode === 'subscription') return null;
                          const name = service?.name?.replace(' Pack', '').replace(' Starter', '') ?? svc.service_id;
                          return (
                            <span
                              key={svc.service_id}
                              className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs font-inter font-medium bg-[#1B3F7A]/5 text-[#1B3F7A]"
                            >
                              <Package size={9} />
                              {name}
                            </span>
                          );
                        })}
                        {(!client.purchased_services || client.purchased_services.filter((s: any) => {
                          const svc = getServiceById(s.service_id);
                          return svc && svc.mode !== 'subscription';
                        }).length === 0) && (
                          <span className="font-inter text-xs text-gray-400">—</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={client.delivery_status} />
                    </td>
                    <td className="px-4 py-3">
                      {client.has_monthly_care_plan || client.has_quarterly_refresh ? (
                        <span className="inline-flex items-center gap-1 font-inter text-xs font-medium text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full">
                          <RefreshCw size={10} />
                          {client.has_monthly_care_plan ? 'Monthly' : 'Qtrly'}
                        </span>
                      ) : (
                        <span className="font-inter text-xs text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-inter text-xs text-gray-600">
                        {new Date(client.created_at).toLocaleDateString('en-GB', {
                          day: 'numeric', month: 'short', year: 'numeric'
                        })}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/personal/admin/${client.user_id}`}
                        className="inline-flex items-center gap-1 font-inter text-xs font-medium text-[#2C68C4] hover:underline"
                      >
                        Manage
                        <ChevronRight size={12} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Selected Actions */}
      {selectedClients.size > 0 && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-[#1B3F7A] text-white rounded-lg shadow-lg px-4 py-2.5 flex items-center gap-3">
          <span className="font-inter text-xs">
            {selectedClients.size} selected
          </span>
          <div className="h-3 w-px bg-white/30" />
          <button className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/20 hover:bg-white/30 rounded text-xs font-inter font-medium transition-colors">
            Bulk Actions
          </button>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color, alert }: {
  icon: any;
  label: string;
  value: number;
  color: string;
  alert?: boolean;
}) {
  const colorMap: Record<string, string> = {
    navy: 'bg-[#1B3F7A]',
    'medium-blue': 'bg-[#2C68C4]',
    blue: 'bg-blue-500',
    amber: 'bg-amber-500',
    teal: 'bg-teal-500',
    success: 'bg-green-600',
    red: 'bg-red-500',
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-3 ${alert ? 'ring-2 ring-red-200' : ''}`}>
      <div className="flex items-center gap-2 mb-1.5">
        <div className={`${colorMap[color] || 'bg-[#1B3F7A]'} rounded p-1`}>
          <Icon size={14} className="text-white" />
        </div>
        {alert && <AlertTriangle size={12} className="text-red-500" />}
      </div>
      <div className="font-inter font-bold text-[#1B3F7A] text-lg">{value}</div>
      <div className="font-inter text-gray-600 text-xs">{label}</div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; color: string; bg: string }> = {
    not_started: { label: 'Not Started', color: 'text-gray-600', bg: 'bg-gray-100' },
    in_progress: { label: 'In Progress', color: 'text-amber-700', bg: 'bg-amber-50' },
    delivered: { label: 'Delivered', color: 'text-green-700', bg: 'bg-green-50' },
  };

  const c = config[status] || config.not_started;

  return (
    <span className={`inline-flex items-center font-inter text-xs font-medium px-2 py-0.5 rounded-full ${c.color} ${c.bg}`}>
      {c.label}
    </span>
  );
}

function BriefStatusBadge({ status }: { status?: string }) {
  if (!status) {
    return (
      <span className="inline-flex items-center font-inter text-xs font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded-full">
        -
      </span>
    );
  }

  const config: Record<string, { label: string; color: string; bg: string }> = {
    pending: { label: 'Pending', color: 'text-gray-600', bg: 'bg-gray-100' },
    generating: { label: 'Generating', color: 'text-blue-600', bg: 'bg-blue-50' },
    completed: { label: 'Completed', color: 'text-green-600', bg: 'bg-green-50' },
    failed: { label: 'Failed', color: 'text-red-600', bg: 'bg-red-50' },
  };

  const c = config[status] || config.pending;

  return (
    <span className={`inline-flex items-center font-inter text-xs font-medium px-2 py-1 rounded-full ${c.color} ${c.bg}`}>
      {c.label}
    </span>
  );
}

function RiskBadge({ level }: { level: string }) {
  const config: Record<string, { color: string; bg: string }> = {
    High: { color: 'text-red-600', bg: 'bg-red-50' },
    Medium: { color: 'text-amber-600', bg: 'bg-amber-50' },
    Low: { color: 'text-green-600', bg: 'bg-green-50' },
  };

  const c = config[level] || { color: 'text-gray-600', bg: 'bg-gray-100' };

  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-inter font-medium ${c.color} ${c.bg}`}>
      {level}
    </span>
  );
}

function TierBadge({ tier }: { tier: ServiceTier }) {
  const config: Record<ServiceTier, { label: string; color: string; bg: string }> = {
    foundation: { label: 'Foundation', color: 'text-blue-700', bg: 'bg-blue-50' },
    operations: { label: 'Operations', color: 'text-amber-700', bg: 'bg-amber-50' },
    industry: { label: 'Industry', color: 'text-teal-700', bg: 'bg-teal-50' },
  };

  const c = config[tier] || config.foundation;

  return (
    <span className={`inline-flex items-center gap-1 font-inter text-xs font-medium px-2 py-0.5 rounded-full ${c.color} ${c.bg}`}>
      <Layers size={10} />
      {c.label}
    </span>
  );
}
