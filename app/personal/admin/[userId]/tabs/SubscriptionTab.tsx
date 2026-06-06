'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import {
  RefreshCw, Calendar, CheckCircle2, Clock, AlertTriangle,
  XCircle, Plus, FileText, CreditCard, Zap,
} from 'lucide-react';
import {
  getDocumentTypesListForService,
  getDocumentLabel,
} from '@/lib/services/document-configs';

interface SubscriptionTabProps {
  userId: string;
  data: any;
  refreshData: () => void;
}

interface RefreshJob {
  id: string;
  service_id: string;
  status: string;
  document_types: string[];
  update_instructions: string;
  documents_completed: string[];
  documents_failed: string[];
  error_message: string | null;
  created_at: string;
  completed_at: string | null;
}

interface SubscriptionRecord {
  id: string;
  service_id: string;
  status: string;
  purchased_at: string;
  expires_at: string | null;
  stripe_subscription_id: string | null;
  next_billing_date: string | null;
  subscription_period_start: string | null;
  subscription_period_end: string | null;
}

const STATUS_CONFIG: Record<string, { color: string; bg: string; label: string; Icon: any }> = {
  active:     { color: 'text-green-700',  bg: 'bg-green-50',  label: 'Active',      Icon: CheckCircle2 },
  cancelled:  { color: 'text-red-600',    bg: 'bg-red-50',    label: 'Cancelled',   Icon: XCircle },
  past_due:   { color: 'text-amber-700',  bg: 'bg-amber-50',  label: 'Past Due',    Icon: AlertTriangle },
  pending:    { color: 'text-gray-600',   bg: 'bg-gray-100',  label: 'Pending',     Icon: Clock },
  processing: { color: 'text-blue-600',   bg: 'bg-blue-50',   label: 'Processing',  Icon: RefreshCw },
  completed:  { color: 'text-green-600',  bg: 'bg-green-50',  label: 'Completed',   Icon: CheckCircle2 },
  failed:     { color: 'text-red-600',    bg: 'bg-red-50',    label: 'Failed',      Icon: AlertTriangle },
  expired:    { color: 'text-gray-600',   bg: 'bg-gray-100',  label: 'Expired',     Icon: XCircle },
};

function StatusBadge({ status, size = 'md' }: { status: string; size?: 'sm' | 'md' }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
  const { Icon } = cfg;
  const iconSize = size === 'sm' ? 12 : 16;
  const padding = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1.5 text-sm';
  return (
    <span className={`inline-flex items-center gap-1.5 ${padding} rounded-lg font-inter font-medium ${cfg.color} ${cfg.bg}`}>
      <Icon size={iconSize} />
      {cfg.label}
    </span>
  );
}

function formatDate(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function SubscriptionTab({ userId, data, refreshData }: SubscriptionTabProps) {
  const purchasedServices: SubscriptionRecord[] = data?.purchasedServices ?? [];
  const documentServiceIds = purchasedServices
    .filter(s => s.service_id !== 'quarterly_refresh')
    .map(s => s.service_id);

  const refreshSub = purchasedServices.find(s => s.service_id === 'quarterly_refresh') ?? null;

  const [refreshJobs, setRefreshJobs] = useState<RefreshJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewJob, setShowNewJob] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string>(documentServiceIds[0] ?? '');
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  const [updateInstructions, setUpdateInstructions] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null);

  useEffect(() => {
    fetchJobs();
  }, [userId]);

  const fetchJobs = async () => {
    setLoading(true);

    const { data: jobs } = await supabase
      .from('document_refresh_jobs')
      .select('*')
      .eq('client_id', userId)
      .order('created_at', { ascending: false });

    setRefreshJobs(jobs ?? []);
    setLoading(false);
  };

  const docOptionsForService = selectedServiceId
    ? getDocumentTypesListForService(selectedServiceId)
    : [];

  const toggleDoc = (id: string) => {
    setSelectedDocs(prev =>
      prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
    );
  };

  const selectAllDocs = () => {
    setSelectedDocs(docOptionsForService.map(d => d.id));
  };

  const handleServiceChange = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    setSelectedDocs([]);
  };

  const handleCreateRefreshJob = async () => {
    if (!selectedServiceId) {
      setMessage({ text: 'Please select a service.', ok: false });
      return;
    }
    if (selectedDocs.length === 0) {
      setMessage({ text: 'Please select at least one document to refresh.', ok: false });
      return;
    }
    if (!updateInstructions.trim()) {
      setMessage({ text: 'Please describe what needs updating.', ok: false });
      return;
    }
    setSubmitting(true);
    setMessage(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/initiate-document-refresh`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.access_token ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            user_id: userId,
            service_id: selectedServiceId,
            document_types: selectedDocs,
            update_instructions: updateInstructions.trim(),
          }),
        }
      );

      const result = await response.json();

      if (response.ok && result.success) {
        setMessage({ text: `Refresh completed: ${result.completed?.length ?? 0} updated, ${result.failed?.length ?? 0} failed.`, ok: true });
        setShowNewJob(false);
        setSelectedDocs([]);
        setUpdateInstructions('');
        await fetchJobs();
        refreshData();
      } else {
        setMessage({ text: result.error ?? 'Failed to create refresh job.', ok: false });
      }
    } catch (err: any) {
      setMessage({ text: err.message ?? 'Unexpected error.', ok: false });
    } finally {
      setSubmitting(false);
      setTimeout(() => setMessage(null), 6000);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1B3F7A]" />
      </div>
    );
  }

  if (!refreshSub) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
        <CreditCard size={48} className="text-gray-300 mx-auto mb-4" />
        <h4 className="font-inter font-semibold text-gray-900 text-lg mb-2">No Subscription</h4>
        <p className="font-inter text-gray-600 text-sm">
          This client has not purchased the Quarterly Document Refresh service.
        </p>
      </div>
    );
  }

  const nextBilling = refreshSub.next_billing_date ?? refreshSub.expires_at;

  return (
    <div className="space-y-5">
      {message && (
        <div className={`rounded-lg p-4 border ${message.ok ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
          <p className="font-inter text-sm font-medium">{message.text}</p>
        </div>
      )}

      {/* Subscription Status Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-5">
          <div>
            <h3 className="font-inter font-bold text-[#1B3F7A] text-lg">Quarterly Document Refresh</h3>
            <p className="font-inter text-gray-500 text-sm mt-0.5">Subscription Details</p>
          </div>
          <StatusBadge status={refreshSub.status} />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
          <div>
            <p className="font-inter text-gray-500 text-xs mb-1">Started</p>
            <p className="font-inter font-semibold text-gray-900 text-sm">{formatDate(refreshSub.purchased_at)}</p>
          </div>
          {refreshSub.subscription_period_start && (
            <div>
              <p className="font-inter text-gray-500 text-xs mb-1">Period Start</p>
              <p className="font-inter font-semibold text-gray-900 text-sm">{formatDate(refreshSub.subscription_period_start)}</p>
            </div>
          )}
          {nextBilling && (
            <div>
              <p className="font-inter text-gray-500 text-xs mb-1">Next Billing</p>
              <p className="font-inter font-semibold text-gray-900 text-sm flex items-center gap-1.5">
                <Calendar size={13} className="text-[#2C68C4]" />
                {formatDate(nextBilling)}
              </p>
            </div>
          )}
          {refreshSub.stripe_subscription_id && (
            <div>
              <p className="font-inter text-gray-500 text-xs mb-1">Stripe ID</p>
              <p className="font-mono text-gray-700 text-xs truncate">{refreshSub.stripe_subscription_id}</p>
            </div>
          )}
        </div>
      </div>

      {/* Initiate Refresh */}
      {refreshSub.status === 'active' && documentServiceIds.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-inter font-bold text-[#1B3F7A] text-lg">Initiate Document Refresh</h3>
            {!showNewJob && (
              <button
                onClick={() => setShowNewJob(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#1B3F7A] hover:bg-[#2C68C4] text-white rounded-md font-inter text-sm font-semibold transition-colors"
              >
                <Plus size={15} />
                New Refresh Job
              </button>
            )}
          </div>

          {showNewJob && (
            <div className="mt-4 space-y-4">
              {/* Service selector */}
              <div>
                <label className="block font-inter font-semibold text-gray-800 text-sm mb-2">
                  Service
                </label>
                <select
                  value={selectedServiceId}
                  onChange={(e) => handleServiceChange(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-md font-inter text-sm focus:outline-none focus:ring-2 focus:ring-[#2C68C4] focus:border-[#2C68C4]"
                >
                  {documentServiceIds.map(sid => {
                    const catalog = data?.purchasedServices?.find((s: any) => s.service_id === sid);
                    return (
                      <option key={sid} value={sid}>
                        {sid === 'business_foundations_pack' ? 'Business Foundations Pack'
                          : sid === 'website_copy_pack' ? 'Website Copy Pack'
                          : sid === 'social_media_pack' ? 'Social Media Pack'
                          : sid}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Document selection */}
              {docOptionsForService.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="font-inter font-semibold text-gray-800 text-sm">
                      Documents to Refresh
                    </label>
                    <button
                      type="button"
                      onClick={selectAllDocs}
                      className="font-inter text-xs text-[#2C68C4] hover:underline"
                    >
                      Select all
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {docOptionsForService.map((doc) => (
                      <label key={doc.id} className="flex items-center gap-2.5 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={selectedDocs.includes(doc.id)}
                          onChange={() => toggleDoc(doc.id)}
                          className="rounded border-gray-300 text-[#1B3F7A] focus:ring-[#2C68C4]"
                        />
                        <span className="font-inter text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                          {doc.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Update instructions */}
              <div>
                <label className="block font-inter font-semibold text-gray-800 text-sm mb-2">
                  Update Instructions
                </label>
                <textarea
                  value={updateInstructions}
                  onChange={(e) => setUpdateInstructions(e.target.value)}
                  rows={4}
                  placeholder="Describe what has changed — e.g. 'Price changed from £500 to £600 for service X', 'Added a new service: Y', 'Updated GDPR data retention from 2 years to 3 years'..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-md font-inter text-sm focus:outline-none focus:ring-2 focus:ring-[#2C68C4] focus:border-[#2C68C4] resize-none"
                />
                <p className="font-inter text-gray-400 text-xs mt-1">
                  Only the affected documents will be regenerated. Unchanged sections will be preserved.
                </p>
              </div>

              <div className="flex items-center gap-3 pt-1">
                <button
                  onClick={handleCreateRefreshJob}
                  disabled={submitting || selectedDocs.length === 0 || !updateInstructions.trim()}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#1B3F7A] hover:bg-[#2C68C4] text-white rounded-md font-inter text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" /> Processing...</>
                  ) : (
                    <><Zap size={15} /> Refresh Documents</>
                  )}
                </button>
                <button
                  onClick={() => { setShowNewJob(false); setSelectedDocs([]); setUpdateInstructions(''); }}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md font-inter text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Refresh History */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="font-inter font-bold text-[#1B3F7A] text-lg mb-4">Refresh History</h3>

        {refreshJobs.length === 0 ? (
          <div className="text-center py-10">
            <RefreshCw size={40} className="text-gray-300 mx-auto mb-3" />
            <p className="font-inter text-gray-500 text-sm">No refresh jobs yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {refreshJobs.map((job) => (
              <div key={job.id} className="bg-[#FAFBFC] rounded-lg border border-gray-200 p-4">
                <div className="flex items-start justify-between mb-2.5">
                  <div className="flex items-center gap-2.5">
                    <StatusBadge status={job.status} size="sm" />
                    <span className="font-inter text-gray-500 text-xs">
                      {job.service_id === 'business_foundations_pack' ? 'Business Foundations'
                        : job.service_id === 'website_copy_pack' ? 'Website Copy'
                        : job.service_id === 'social_media_pack' ? 'Social Media'
                        : job.service_id}
                    </span>
                    <span className="font-inter text-gray-400 text-xs">
                      {new Date(job.created_at).toLocaleDateString('en-GB', {
                        day: 'numeric', month: 'short', year: 'numeric',
                        hour: '2-digit', minute: '2-digit',
                      })}
                    </span>
                  </div>
                  {job.completed_at && (
                    <span className="font-inter text-gray-400 text-xs">
                      Completed {formatDate(job.completed_at)}
                    </span>
                  )}
                </div>

                {job.update_instructions && (
                  <p className="font-inter text-gray-700 text-sm mb-2">
                    {job.update_instructions}
                  </p>
                )}

                <div className="flex flex-wrap gap-1.5 mb-2">
                  {(job.document_types ?? []).map((docId) => {
                    const label = getDocumentLabel(docId) ?? docId;
                    const isCompleted = (job.documents_completed ?? []).includes(docId);
                    const isFailed = (job.documents_failed ?? []).includes(docId);
                    return (
                      <span
                        key={docId}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 border rounded text-xs font-inter ${
                          isCompleted ? 'bg-green-50 border-green-200 text-green-700'
                          : isFailed ? 'bg-red-50 border-red-200 text-red-700'
                          : 'bg-white border-gray-200 text-gray-700'
                        }`}
                      >
                        <FileText size={10} />
                        {label}
                      </span>
                    );
                  })}
                </div>

                {job.error_message && (
                  <p className="font-inter text-red-600 text-xs mt-1">
                    Error: {job.error_message}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
