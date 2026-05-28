'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { Users, FileText, Clock, CheckCircle2, Search, ChevronRight } from 'lucide-react';

interface ClientRow {
  user_id: string;
  email: string;
  has_submitted_intake: boolean;
  intake_submitted_at: string | null;
  delivery_status: 'not_started' | 'in_progress' | 'delivered';
  delivery_link: string | null;
  created_at: string;
  admin_notes: string;
  purchased_upsells: string[];
}

export default function AdminDashboard() {
  const [clients, setClients] = useState<ClientRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const { data, error: profileError } = await supabase
        .from('client_profiles')
        .select('*');

      if (profileError) {
        console.error('Error fetching profiles:', profileError);
        return;
      }

      const profiles = data || [];

      // Fetch emails from intake_responses
      let emailMap = new Map<string, string>();
      try {
        const userIds = profiles.map(p => p.user_id);
        if (userIds.length > 0) {
          const { data: intakeData } = await supabase
            .from('intake_responses')
            .select('user_id, responses')
            .in('user_id', userIds);

          if (intakeData) {
            for (const row of intakeData) {
              const email = row.responses?.q7_document_email;
              if (email) {
                emailMap.set(row.user_id, email);
              }
            }
          }
        }
      } catch {
        // intake_responses unavailable, emails will show as user ID prefix
      }

      const clientRows: ClientRow[] = profiles.map(p => ({
        user_id: p.user_id,
        email: emailMap.get(p.user_id) || p.user_id.substring(0, 8) + '...',
        has_submitted_intake: p.has_submitted_intake,
        intake_submitted_at: p.intake_submitted_at,
        delivery_status: p.delivery_status,
        delivery_link: p.delivery_link,
        created_at: p.created_at,
        admin_notes: p.admin_notes || '',
        purchased_upsells: p.purchased_upsells || [],
      }));

      setClients(clientRows);
    } finally {
      setLoading(false);
    }
  };

  const filteredClients = clients.filter(c => {
    const matchesSearch = c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.user_id.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filterStatus === 'all' || c.delivery_status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: clients.length,
    submitted: clients.filter(c => c.has_submitted_intake).length,
    inProgress: clients.filter(c => c.delivery_status === 'in_progress').length,
    delivered: clients.filter(c => c.delivery_status === 'delivered').length,
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-inter font-bold text-[#1B3F7A] text-2xl mb-1">
          Admin Dashboard
        </h1>
        <p className="font-inter text-gray-600 text-sm">
          Manage all clients, intake forms, and document delivery.
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Users} label="Total Clients" value={stats.total} color="navy" />
        <StatCard icon={FileText} label="Intake Submitted" value={stats.submitted} color="medium-blue" />
        <StatCard icon={Clock} label="In Progress" value={stats.inProgress} color="amber" />
        <StatCard icon={CheckCircle2} label="Delivered" value={stats.delivered} color="success" />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by email or user ID..."
            className="block w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2C68C4] focus:border-[#2C68C4] font-inter text-sm"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2C68C4] focus:border-[#2C68C4] font-inter text-sm bg-white"
        >
          <option value="all">All Statuses</option>
          <option value="not_started">Not Started</option>
          <option value="in_progress">In Progress</option>
          <option value="delivered">Delivered</option>
        </select>
      </div>

      {/* Client list */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1B3F7A]" />
        </div>
      ) : filteredClients.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <Users size={40} className="text-gray-600 mx-auto mb-4" />
          <p className="font-inter text-gray-600">No clients found.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-[#FAFBFC] border-b border-gray-200">
                <th className="font-inter font-semibold text-[#1B3F7A] text-xs uppercase tracking-wider text-left px-6 py-3">Client</th>
                <th className="font-inter font-semibold text-[#1B3F7A] text-xs uppercase tracking-wider text-left px-6 py-3">Intake</th>
                <th className="font-inter font-semibold text-[#1B3F7A] text-xs uppercase tracking-wider text-left px-6 py-3">Status</th>
                <th className="font-inter font-semibold text-[#1B3F7A] text-xs uppercase tracking-wider text-left px-6 py-3">Created</th>
                <th className="font-inter font-semibold text-[#1B3F7A] text-xs uppercase tracking-wider text-right px-6 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map((client) => (
                <tr key={client.user_id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-inter text-sm text-gray-900 font-medium truncate max-w-[200px]">
                      {client.email}
                    </div>
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
                      className="font-inter text-xs font-medium text-[#2C68C4] hover:underline flex items-center gap-1 justify-end"
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
      )}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: number; color: string }) {
  const colorMap: Record<string, string> = {
    navy: 'bg-[#1B3F7A]',
    'medium-blue': 'bg-[#2C68C4]',
    amber: 'bg-amber-500',
    success: 'bg-green-600',
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className={`${colorMap[color] || 'bg-[#1B3F7A]'} rounded-lg p-2`}>
          <Icon size={18} className="text-white" />
        </div>
      </div>
      <div className="font-inter font-bold text-[#1B3F7A] text-2xl">{value}</div>
      <div className="font-inter text-gray-600 text-xs mt-1">{label}</div>
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
