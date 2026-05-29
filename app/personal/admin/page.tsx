'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import {
  Users, FileText, Clock, CheckCircle2, Search, ChevronRight,
  Filter, Download, RefreshCw, AlertTriangle, Briefcase, Send,
  Calendar, X, TrendingUp, BarChart3, Inbox
} from 'lucide-react';

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
}

export default function AdminDashboard() {
  const [clients, setClients] = useState<ClientRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterIntake, setFilterIntake] = useState<string>('all');
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
    return matchesSearch && matchesFilter && matchesIntake;
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
    highRisk: clients.filter(c => c.risk_level === 'High').length,
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
    <div>
      <div className="mb-8">
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
              className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-md font-inter text-sm font-medium transition-colors"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              Refresh
            </button>
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-md font-inter text-sm font-medium transition-colors"
            >
              <Download size={16} />
              Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
        <StatCard
          icon={Users}
          label="Total Clients"
          value={stats.total}
          color="navy"
          trend={stats.total > 0 ? '+' : ''}
        />
        <StatCard
          icon={Inbox}
          label="Pending Intake"
          value={stats.pending}
          color="amber"
          alert={stats.pending > 0}
        />
        <StatCard
          icon={FileText}
          label="Intake Submitted"
          value={stats.submitted}
          color="medium-blue"
        />
        <StatCard
          icon={Clock}
          label="In Progress"
          value={stats.inProgress}
          color="amber"
        />
        <StatCard
          icon={Send}
          label="Delivered"
          value={stats.delivered}
          color="success"
        />
        <StatCard
          icon={Briefcase}
          label="Total Documents"
          value={clients.reduce((sum, c) => sum + (c.documents_count || 0), 0)}
          color="medium-blue"
        />
        <StatCard
          icon={AlertTriangle}
          label="High Risk"
          value={stats.highRisk}
          color="red"
          alert={stats.highRisk > 0}
        />
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by email, ID, or business name..."
              className="block w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2C68C4] focus:border-[#2C68C4] font-inter text-sm"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md font-inter text-sm font-medium transition-colors"
            >
              <Filter size={16} />
              Filters
              {showFilters ? <X size={16} /> : null}
            </button>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2C68C4] focus:border-[#2C68C4] font-inter text-sm bg-white"
            >
              <option value="created_at">Sort by Date</option>
              <option value="email">Sort by Email</option>
              <option value="documents_count">Sort by Documents</option>
              <option value="delivery_status">Sort by Status</option>
            </select>

            <button
              onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
              className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md font-inter text-sm font-medium transition-colors"
            >
              {sortOrder === 'asc' ? '↑ Asc' : '↓ Desc'}
            </button>
          </div>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block font-inter text-gray-700 text-xs mb-2">Delivery Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2C68C4] focus:border-[#2C68C4] font-inter text-sm bg-white"
              >
                <option value="all">All Statuses</option>
                <option value="not_started">Not Started</option>
                <option value="in_progress">In Progress</option>
                <option value="delivered">Delivered</option>
              </select>
            </div>

            <div>
              <label className="block font-inter text-gray-700 text-xs mb-2">Intake Status</label>
              <select
                value={filterIntake}
                onChange={(e) => setFilterIntake(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2C68C4] focus:border-[#2C68C4] font-inter text-sm bg-white"
              >
                <option value="all">All</option>
                <option value="submitted">Submitted</option>
                <option value="pending">Pending</option>
              </select>
            </div>

            <div className="flex items-end gap-2">
              <button
                onClick={() => {
                  setFilterStatus('all');
                  setFilterIntake('all');
                  setSearch('');
                }}
                className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md font-inter text-sm font-medium transition-colors"
              >
                Clear Filters
              </button>
              <div className="px-4 py-2.5 bg-[#FAFBFC] rounded-md">
                <span className="font-inter text-sm text-gray-600">{filteredClients.length} results</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Client list */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1B3F7A]" />
        </div>
      ) : filteredClients.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <Users size={40} className="text-gray-400 mx-auto mb-4" />
          <p className="font-inter text-gray-600">No clients found.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#FAFBFC] border-b border-gray-200">
                  <th className="font-inter font-semibold text-[#1B3F7A] text-xs uppercase tracking-wider text-left px-6 py-3 w-12">
                    <input
                      type="checkbox"
                      checked={selectedClients.size === filteredClients.length && filteredClients.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="font-inter font-semibold text-[#1B3F7A] text-xs uppercase tracking-wider text-left px-6 py-3">Client</th>
                  <th className="font-inter font-semibold text-[#1B3F7A] text-xs uppercase tracking-wider text-left px-6 py-3">Intake</th>
                  <th className="font-inter font-semibold text-[#1B3F7A] text-xs uppercase tracking-wider text-left px-6 py-3">Brief</th>
                  <th className="font-inter font-semibold text-[#1B3F7A] text-xs uppercase tracking-wider text-left px-6 py-3">Documents</th>
                  <th className="font-inter font-semibold text-[#1B3F7A] text-xs uppercase tracking-wider text-left px-6 py-3">Status</th>
                  <th className="font-inter font-semibold text-[#1B3F7A] text-xs uppercase tracking-wider text-left px-6 py-3">Created</th>
                  <th className="font-inter font-semibold text-[#1B3F7A] text-xs uppercase tracking-wider text-right px-6 py-3"></th>
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
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedClients.has(client.user_id)}
                        onChange={() => handleSelectClient(client.user_id)}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-inter text-sm text-gray-900 font-medium truncate max-w-[200px]">
                        {client.email}
                      </div>
                      {client.business_name && (
                        <div className="font-inter text-xs text-[#1B3F7A] truncate max-w-[200px]">
                          {client.business_name}
                        </div>
                      )}
                      <div className="font-inter text-xs text-gray-600 truncate max-w-[200px]">
                        {client.user_id.substring(0, 8)}...
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {client.has_submitted_intake ? (
                        <span className="inline-flex items-center gap-1 font-inter text-xs font-medium text-green-700 bg-green-50 px-2 py-1 rounded-full">
                          <CheckCircle2 size={12} />
                          Submitted
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 font-inter text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                          <Clock size={12} />
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <BriefStatusBadge status={client.brief_status} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-inter text-sm text-gray-900">
                          {client.documents_count || 0}/10
                        </span>
                        {client.risk_level && (
                          <RiskBadge level={client.risk_level} />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={client.delivery_status} />
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-inter text-xs text-gray-600">
                        {new Date(client.created_at).toLocaleDateString('en-GB', {
                          day: 'numeric', month: 'short', year: 'numeric'
                        })}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/personal/admin/${client.user_id}`}
                        className="inline-flex items-center gap-1 font-inter text-xs font-medium text-[#2C68C4] hover:underline"
                      >
                        Manage
                        <ChevronRight size={14} />
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
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-[#1B3F7A] text-white rounded-lg shadow-lg px-6 py-4 flex items-center gap-4">
          <span className="font-inter text-sm">
            {selectedClients.size} client{selectedClients.size > 1 ? 's' : ''} selected
          </span>
          <div className="h-4 w-px bg-white/30" />
          <button className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded text-xs font-inter font-medium transition-colors">
            Bulk Actions (Coming Soon)
          </button>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color, trend, alert }: {
  icon: any;
  label: string;
  value: number;
  color: string;
  trend?: string;
  alert?: boolean;
}) {
  const colorMap: Record<string, string> = {
    navy: 'bg-[#1B3F7A]',
    'medium-blue': 'bg-[#2C68C4]',
    amber: 'bg-amber-500',
    success: 'bg-green-600',
    red: 'bg-red-500',
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-4 ${alert ? 'ring-2 ring-red-200' : ''}`}>
      <div className="flex items-center gap-2 mb-2">
        <div className={`${colorMap[color] || 'bg-[#1B3F7A]'} rounded-lg p-1.5`}>
          <Icon size={16} className="text-white" />
        </div>
        {alert && <AlertTriangle size={14} className="text-red-500" />}
      </div>
      <div className="font-inter font-bold text-[#1B3F7A] text-xl">{value}</div>
      <div className="font-inter text-gray-600 text-xs mt-0.5">{label}</div>
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
    <span className={`inline-flex items-center font-inter text-xs font-medium px-2 py-1 rounded-full ${c.color} ${c.bg}`}>
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
