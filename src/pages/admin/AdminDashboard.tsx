import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

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
      // Get all client profiles
      const { data: profiles, error: profileError } = await supabase
        .from('client_profiles')
        .select('*');

      if (profileError) {
        console.error('Error fetching profiles:', profileError);
        return;
      }

      // Fetch user emails via edge function (uses service role to list auth users)
      let emailMap = new Map<string, string>();
      try {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const response = await fetch(`${supabaseUrl}/functions/v1/set-password`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ action: 'list_users' }),
        });
        const result = await response.json();
        if (result.users) {
          emailMap = new Map(result.users.map((u: any) => [u.id, u.email]));
        }
      } catch {
        // Edge function may not have propagated yet, emails will show as user ID prefix
      }

      // Also try to set admin app_metadata (no-op if already set)
      try {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        await fetch(`${supabaseUrl}/functions/v1/set-password`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ action: 'set_admin_metadata' }),
        });
      } catch {
        // Ignore errors, this is a best-effort call
      }

      // Build client list
      const clientRows: ClientRow[] = (profiles || []).map(p => ({
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
        <h1 className="font-inter font-bold text-navy text-2xl mb-1">
          Admin Dashboard
        </h1>
        <p className="font-inter text-secondary-text text-sm">
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
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-text" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by email or user ID..."
            className="block w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-medium-blue focus:border-medium-blue font-inter text-sm"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-medium-blue focus:border-medium-blue font-inter text-sm bg-white"
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
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy" />
        </div>
      ) : filteredClients.length === 0 ? (
        <div className="bg-white rounded-lg border border-border p-12 text-center">
          <Users size={40} className="text-secondary-text mx-auto mb-4" />
          <p className="font-inter text-secondary-text">No clients found.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-border overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-off-white border-b border-border">
                <th className="font-inter font-semibold text-navy text-xs uppercase tracking-wider text-left px-6 py-3">Client</th>
                <th className="font-inter font-semibold text-navy text-xs uppercase tracking-wider text-left px-6 py-3">Intake</th>
                <th className="font-inter font-semibold text-navy text-xs uppercase tracking-wider text-left px-6 py-3">Status</th>
                <th className="font-inter font-semibold text-navy text-xs uppercase tracking-wider text-left px-6 py-3">Created</th>
                <th className="font-inter font-semibold text-navy text-xs uppercase tracking-wider text-right px-6 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map((client) => (
                <tr key={client.user_id} className="border-b border-border hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-inter text-sm text-dark-text font-medium truncate max-w-[200px]">
                      {client.email}
                    </div>
                    <div className="font-inter text-xs text-secondary-text truncate max-w-[200px]">
                      {client.user_id.substring(0, 8)}...
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {client.has_submitted_intake ? (
                      <span className="inline-flex items-center gap-1 font-inter text-xs font-medium text-success bg-green-50 px-2 py-1 rounded-full">
                        <CheckCircle2 size={12} />
                        Submitted
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 font-inter text-xs font-medium text-secondary-text bg-gray-100 px-2 py-1 rounded-full">
                        <Clock size={12} />
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={client.delivery_status} />
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-inter text-xs text-secondary-text">
                      {new Date(client.created_at).toLocaleDateString('en-GB', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      to={`/personal/admin/${client.user_id}`}
                      className="font-inter text-xs font-medium text-medium-blue hover:underline flex items-center gap-1 justify-end"
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
    navy: 'bg-navy',
    'medium-blue': 'bg-medium-blue',
    amber: 'bg-amber-500',
    success: 'bg-success',
  };

  return (
    <div className="bg-white rounded-lg border border-border p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className={`${colorMap[color] || 'bg-navy'} rounded-lg p-2`}>
          <Icon size={18} className="text-white" />
        </div>
      </div>
      <div className="font-inter font-bold text-navy text-2xl">{value}</div>
      <div className="font-inter text-secondary-text text-xs mt-1">{label}</div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; color: string; bg: string }> = {
    not_started: { label: 'Not Started', color: 'text-secondary-text', bg: 'bg-gray-100' },
    in_progress: { label: 'In Progress', color: 'text-amber-700', bg: 'bg-amber-50' },
    delivered: { label: 'Delivered', color: 'text-success', bg: 'bg-green-50' },
  };

  const c = config[status] || config.not_started;

  return (
    <span className={`inline-flex items-center font-inter text-xs font-medium px-2 py-1 rounded-full ${c.color} ${c.bg}`}>
      {c.label}
    </span>
  );
}
