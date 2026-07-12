'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { RefreshCw, Download, AlertCircle, Clock, Users, Trash2 } from 'lucide-react';
import {
  getAdminDashboardData,
  exportClientsToCSV,
  type DashboardData,
  type FilterState,
  type SortState,
  type ClientRow,
  type PaginationInfo,
} from '@/lib/admin/dashboard-queries';
import { useAdminToast } from '@/hooks/useAdminToast';
import { briefGenerationLimiter } from '@/lib/admin/rate-limiter';
import { supabase } from '@/lib/supabase/client';

import DashboardSummaryCards from '@/components/admin/DashboardSummaryCards';
import DashboardTierBreakdown from '@/components/admin/DashboardTierBreakdown';
import DashboardFilterBar from '@/components/admin/DashboardFilterBar';
import DashboardClientTable from '@/components/admin/DashboardClientTable';
import DashboardBulkActions from '@/components/admin/DashboardBulkActions';
import SkeletonTable from '@/components/admin/SkeletonTable';
import AdminToastContainer from '@/components/admin/AdminToastContainer';
import DeleteClientModal from '@/components/admin/DeleteClientModal';
import DeleteAllClientsModal from '@/components/admin/DeleteAllClientsModal';

const DEFAULT_FILTERS: FilterState = {
  search: '',
  deliveryStatus: 'all',
  intakeStatus: 'all',
  briefStatus: 'all',
  tier: 'all',
  industry: 'all',
  subscription: 'all',
  urgency: 'all',
};

const DEFAULT_SORT: SortState = {
  field: 'urgency_score',
  direction: 'desc',
};

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo>({ page: 1, pageSize: 50, total: 0, hasMore: false });
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [sort, setSort] = useState<SortState>(DEFAULT_SORT);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [secondsSinceRefresh, setSecondsSinceRefresh] = useState(0);
  const [generatingBriefFor, setGeneratingBriefFor] = useState<string | null>(null);
  const { toasts, showToast, dismissToast } = useAdminToast();
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ userId: string; email: string; businessName?: string } | null>(null);
  const [deleteAllOpen, setDeleteAllOpen] = useState(false);
  const [deletingAll, setDeletingAll] = useState(false);

  // Fetch data
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getAdminDashboardData(filters, sort, pagination.page, pagination.pageSize);
      setData(result.data);
      setPagination(result.pagination);
      setLastRefresh(new Date());
      setSecondsSinceRefresh(0);
    } catch (err: any) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message || 'Failed to load client data');
    } finally {
      setLoading(false);
    }
  }, [filters, sort, pagination.page, pagination.pageSize]);

  // Initial fetch and filter/sort changes
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchData();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchData]);

  // Update seconds since refresh
  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsSinceRefresh(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Selection handlers
  const handleSelect = useCallback((userId: string) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  }, []);

  const handleSelectAll = useCallback((selectAll: boolean) => {
    if (!data?.clients) return;
    if (selectAll) {
      setSelectedIds(new Set(data.clients.map(c => c.user_id)));
    } else {
      setSelectedIds(new Set());
    }
  }, [data?.clients]);

  const handleClearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  // Filter changes from summary card clicks
  const handleCardFilter = useCallback((filterType: string, value: string) => {
    if (filterType === 'intakeStatus') {
      setFilters(prev => ({ ...prev, intakeStatus: value }));
    } else if (filterType === 'briefStatus') {
      setFilters(prev => ({ ...prev, briefStatus: value }));
    } else if (filterType === 'deliveryStatus') {
      setFilters(prev => ({ ...prev, deliveryStatus: value }));
    } else if (filterType === 'subscription') {
      setFilters(prev => ({ ...prev, subscription: value }));
    }
  }, []);

  // Tier filter from tier breakdown
  const handleTierClick = useCallback((tier: string) => {
    setFilters(prev => ({ ...prev, tier }));
  }, []);

  // Export
  const handleExportAll = useCallback(() => {
    if (!data?.clients) return;
    const filename = `foundationary_all_clients_${new Date().toISOString().split('T')[0]}.csv`;
    exportClientsToCSV(data.clients, filename);
  }, [data?.clients]);

  const handleExportSelected = useCallback(() => {
    if (!data?.clients) return;
    const selectedClients = data.clients.filter(c => selectedIds.has(c.user_id));
    const filename = `foundationary_selected_clients_${new Date().toISOString().split('T')[0]}.csv`;
    exportClientsToCSV(selectedClients, filename);
  }, [data?.clients, selectedIds]);

  // Context-aware actions
  const handleAction = useCallback(async (userId: string, action: 'reminder' | 'generate-brief' | 'start-delivery' | 'continue') => {
    if (action === 'generate-brief') {
      if (!briefGenerationLimiter.consume()) {
        const waitSec = Math.ceil(briefGenerationLimiter.getWaitTimeMs() / 1000);
        showToast({ message: `Please wait ${waitSec}s before generating another brief.`, type: 'warning', duration: 4000 });
        return;
      }
      const generateBrief = async () => {
        setGeneratingBriefFor(userId);
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/generate-brief`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
              },
              body: JSON.stringify({ user_id: userId }),
            }
          );

          const result = await response.json();

          if (!response.ok || !result.success) {
            const errMsg = result.error || (response.status === 404 ? 'Service starting up — please wait 30 seconds and try again.' : 'Unexpected server error. Please try again.');
            showToast({ message: `Failed to generate brief: ${errMsg}`, type: 'error', retryFn: () => handleAction(userId, 'generate-brief') });
          } else {
            showToast({ message: 'Brief generated successfully.', type: 'success' });
            fetchData();
          }
        } catch (err) {
          showToast({ message: 'Network error generating brief. Check your connection and try again.', type: 'error', retryFn: () => handleAction(userId, 'generate-brief') });
        } finally {
          setGeneratingBriefFor(null);
        }
      };
      await generateBrief();
    } else if (action === 'reminder') {
      window.location.href = `/personal/admin/${userId}?tab=messaging`;
    } else {
      window.location.href = `/personal/admin/${userId}?tab=documents`;
    }
  }, [fetchData, showToast]);

  // Pagination
  const handlePageChange = useCallback((newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  }, []);

  // Delete single client
  const handleDeleteClient = useCallback(async (userId: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/delete-account`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ user_id: userId }),
        }
      );
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to delete client');
      }
      showToast({ message: 'Client deleted successfully.', type: 'success' });
      setSelectedIds(prev => { const s = new Set(prev); s.delete(userId); return s; });
      await fetchData();
    } catch (err: any) {
      showToast({ message: `Delete failed: ${err.message}`, type: 'error' });
      throw err;
    }
  }, [fetchData, showToast]);

  // Delete all clients
  const handleDeleteAllClients = useCallback(async () => {
    setDeletingAll(true);
    try {
      const { data: profiles, error: profilesError } = await supabase
        .from('client_profiles')
        .select('user_id');
      if (profilesError) throw new Error(`Failed to fetch client list: ${profilesError.message}`);
      if (!profiles || profiles.length === 0) {
        showToast({ message: 'No clients to delete.', type: 'warning' });
        return;
      }
      let successCount = 0;
      let failCount = 0;
      for (const p of profiles) {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/delete-account`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
              },
              body: JSON.stringify({ user_id: p.user_id }),
            }
          );
          if (response.ok) {
            successCount++;
          } else {
            failCount++;
          }
        } catch {
          failCount++;
        }
      }
      setSelectedIds(new Set());
      await fetchData();
      if (failCount === 0) {
        showToast({ message: `All ${successCount} clients deleted successfully.`, type: 'success' });
      } else {
        showToast({ message: `Deleted ${successCount} clients. ${failCount} failed — check console.`, type: 'warning' });
      }
    } catch (err: any) {
      showToast({ message: `Delete all failed: ${err.message}`, type: 'error' });
      throw err;
    } finally {
      setDeletingAll(false);
    }
  }, [fetchData, showToast]);

  // Selected clients for bulk actions
  const selectedClients = useMemo(() => {
    if (!data?.clients) return [];
    return data.clients.filter(c => selectedIds.has(c.user_id));
  }, [data?.clients, selectedIds]);

  return (
    <div className="space-y-4 pb-20">
      <AdminToastContainer toasts={toasts} onDismiss={dismissToast} onRetry={(id) => { const t = toasts.find(t => t.id === id); if (t?.retryFn) { dismissToast(id); t.retryFn(); } }} />
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-inter font-bold text-[#1B3F7A] text-2xl mb-1">
            Admin Dashboard
          </h1>
          <p className="font-inter text-gray-600 text-sm">
            Manage all clients, intake forms, briefs, and document delivery.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 text-xs text-gray-500 font-inter">
            <Clock size={12} />
            Last updated: {secondsSinceRefresh < 60 ? `${secondsSinceRefresh}s ago` : `${Math.floor(secondsSinceRefresh / 60)}m ago`}
          </div>
          <button
            onClick={fetchData}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-md font-inter text-sm font-medium transition-colors"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <button
            onClick={handleExportAll}
            disabled={loading || !data?.clients?.length}
            className="inline-flex items-center gap-2 px-3 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-md font-inter text-sm font-medium transition-colors disabled:opacity-50"
          >
            <Download size={16} />
            <span className="hidden sm:inline">Export All</span>
          </button>
          <button
            onClick={() => setDeleteAllOpen(true)}
            disabled={!data?.stats.totalClients}
            className="inline-flex items-center gap-2 px-3 py-2 bg-white hover:bg-red-50 text-red-600 border border-red-300 rounded-md font-inter text-sm font-medium transition-colors disabled:opacity-50"
          >
            <Trash2 size={16} />
            <span className="hidden sm:inline">Delete All</span>
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle size={20} className="text-red-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-inter font-medium text-red-800 text-sm">{error}</p>
          </div>
          <button
            onClick={fetchData}
            className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-inter font-medium transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Summary Cards */}
      {data && (
        <DashboardSummaryCards stats={data.stats} onCardClick={handleCardFilter} />
      )}

      {/* Tier Breakdown */}
      {data && (
        <DashboardTierBreakdown stats={data.stats} onTierClick={handleTierClick} />
      )}

      {/* Filters */}
      <DashboardFilterBar
        filters={filters}
        onFiltersChange={setFilters}
        sort={sort}
        onSortChange={setSort}
        resultCount={pagination.total}
        totalCount={data?.stats.totalClients || 0}
      />

      {/* Table */}
      {loading && !data ? (
        <SkeletonTable rows={10} />
      ) : data ? (
        <>
          <DashboardClientTable
            clients={data.clients}
            selectedIds={selectedIds}
            onSelect={handleSelect}
            onSelectAll={handleSelectAll}
            onAction={handleAction}
            generatingBriefFor={generatingBriefFor}
            onDeleteClient={(userId, email) => {
              const client = data.clients.find(c => c.user_id === userId);
              setDeleteTarget({ userId, email, businessName: client?.business_name });
            }}
          />

          {/* Pagination */}
          {pagination.hasMore && (
            <div className="flex justify-center">
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                className="px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-md font-inter text-sm font-medium transition-colors"
              >
                Load More ({pagination.total - data.clients.length} remaining)
              </button>
            </div>
          )}
        </>
      ) : null}

      {/* Empty State */}
      {!loading && !error && data?.clients.length === 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <Users size={40} className="text-gray-400 mx-auto mb-3" />
          <h3 className="font-inter font-semibold text-gray-900 text-lg mb-2">No clients found</h3>
          <p className="font-inter text-gray-600 text-sm max-w-md mx-auto">
            {filters.search || Object.values(filters).some(v => v !== 'all' && v !== '')
              ? 'No clients match your current filters. Try adjusting your search or filters.'
              : 'No clients have been created yet. Clients will appear here after their first purchase.'}
          </p>
          {(filters.search || Object.values(filters).some(v => v !== 'all' && v !== '')) && (
            <button
              onClick={() => setFilters(DEFAULT_FILTERS)}
              className="mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md font-inter text-sm font-medium transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>
      )}

      {/* Bulk Actions Bar */}
      <DashboardBulkActions
        selectedClients={selectedClients}
        onClearSelection={handleClearSelection}
        onExportSelected={handleExportSelected}
      />

      <DeleteClientModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => handleDeleteClient(deleteTarget!.userId)}
        userId={deleteTarget?.userId || ''}
        email={deleteTarget?.email || ''}
        businessName={deleteTarget?.businessName}
      />

      <DeleteAllClientsModal
        open={deleteAllOpen}
        onClose={() => setDeleteAllOpen(false)}
        onConfirm={handleDeleteAllClients}
        totalCount={data?.stats.totalClients || 0}
      />
    </div>
  );
}
