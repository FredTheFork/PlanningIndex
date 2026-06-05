'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import {
  RefreshCw, Calendar, CheckCircle2, Clock, AlertTriangle,
  XCircle, Plus, FileText, CreditCard, Zap,
} from 'lucide-react';

interface SubscriptionTabProps {
  userId: string;
  data: any;
  refreshData: () => void;
}

interface RefreshJob {
  id: string;
  status: string;
  documents_to_refresh: string[];
  admin_notes: string | null;
  client_notes: string | null;
  requested_at: string;
  started_at: string | null;
  completed_at: string | null;
  error_message: string | null;
}

interface SubscriptionRecord {
  id: string;
  status: string;
  purchased_at: string;
  expires_at: string | null;
  stripe_subscription_id: string | null;
  next_billing_date: string | null;
  subscription_period_start: string | null;
  subscription_period_end: string | null;
}

const DOCUMENT_OPTIONS = [
  { id: 'terms_and_conditions', label: 'Terms & Conditions' },
  { id: 'service_agreement_contract', label: 'Client Contract' },
  { id: 'gdpr_privacy_policy', label: 'GDPR Privacy Policy' },
  { id: 'professional_invoice_template', label: 'Invoice Template' },
  { id: 'service_description_sheets', label: 'Service Description Sheets' },
  { id: 'professional_bio', label: 'Professional Bio' },
  { id: 'linkedin_profile_script', label: 'LinkedIn Profile Script' },
  { id: 'welcome_email_sequence', label: 'Welcome Email Sequence' },
  { id: 'late_payment_letters', label: 'Late Payment Letters' },
  { id: 'elevator_pitch', label: 'Elevator Pitch' },
];

const STATUS_CONFIG: Record<string, { color: string; bg: string; label: string; Icon: any }> = {
  active:     { color: 'text-green-700',  bg: 'bg-green-50',  label: 'Active',      Icon: CheckCircle2 },
  cancelled:  { color: 'text-red-600',    bg: 'bg-red-50',    label: 'Cancelled',   Icon: XCircle },
  past_due:   { color: 'text-amber-700',  bg: 'bg-amber-50',  label: 'Past Due',    Icon: AlertTriangle },
  pending:    { color: 'text-gray-600',   bg: 'bg-gray-100',  label: 'Pending',     Icon: Clock },
  in_progress:{ color: 'text-blue-600',   bg: 'bg-blue-50',   label: 'In Progress', Icon: RefreshCw },
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

export default function SubscriptionTab({ userId, refreshData }: SubscriptionTabProps) {
  const [subscription, setSubscription] = useState<SubscriptionRecord | null>(null);
  const [refreshJobs, setRefreshJobs] = useState<RefreshJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewJob, setShowNewJob] = useState(false);
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  const [adminNotes, setAdminNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null);

  useEffect(() => {
    fetchData();
  }, [userId]);

  const fetchData = async () => {
    setLoading(true);

    const { data: sub } = await supabase
      .from('services_purchased')
      .select('id, status, purchased_at, expires_at, stripe_subscription_id, next_billing_date, subscription_period_start, subscription_period_end')
      .eq('user_id', userId)
      .eq('service_id', 'quarterly_refresh')
      .maybeSingle();

    setSubscription(sub ?? null);

    const { data: jobs } = await supabase
      .from('document_refresh_jobs')
      .select('*')
      .eq('user_id', userId)
      .order('requested_at', { ascending: false });

    setRefreshJobs(jobs ?? []);
    setLoading(false);
  };

  const toggleDoc = (id: string) => {
    setSelectedDocs(prev =>
      prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
    );
  };

  const handleCreateRefreshJob = async () => {
    if (selectedDocs.length === 0) {
      setMessage({ text: 'Please select at least one document to refresh.', ok: false });
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
            documents_to_refresh: selectedDocs,
            admin_notes: adminNotes || null,
          }),
        }
      );

      const result = await response.json();

      if (response.ok && result.success) {
        setMessage({ text: 'Refresh job created successfully.', ok: true });
        setShowNewJob(false);
        setSelectedDocs([]);
        setAdminNotes('');
        await fetchData();
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

  if (!subscription) {
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

  const nextBilling = subscription.next_billing_date ?? subscription.expires_at;

  return (
    <div className="space-y-5">
      {/* Feedback message */}
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
          <StatusBadge status={subscription.status} />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
          <div>
            <p className="font-inter text-gray-500 text-xs mb-1">Started</p>
            <p className="font-inter font-semibold text-gray-900 text-sm">{formatDate(subscription.purchased_at)}</p>
          </div>
          {subscription.subscription_period_start && (
            <div>
              <p className="font-inter text-gray-500 text-xs mb-1">Period Start</p>
              <p className="font-inter font-semibold text-gray-900 text-sm">{formatDate(subscription.subscription_period_start)}</p>
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
          {subscription.stripe_subscription_id && (
            <div>
              <p className="font-inter text-gray-500 text-xs mb-1">Stripe ID</p>
              <p className="font-mono text-gray-700 text-xs truncate">{subscription.stripe_subscription_id}</p>
            </div>
          )}
        </div>
      </div>

      {/* Initiate Refresh */}
      {subscription.status === 'active' && (
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
              <div>
                <label className="block font-inter font-semibold text-gray-800 text-sm mb-2">
                  Documents to Refresh
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {DOCUMENT_OPTIONS.map((doc) => (
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

              <div>
                <label className="block font-inter font-semibold text-gray-800 text-sm mb-2">
                  Admin Notes
                </label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={3}
                  placeholder="What needs updating — pricing changes, new services, GDPR updates..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-md font-inter text-sm focus:outline-none focus:ring-2 focus:ring-[#2C68C4] focus:border-[#2C68C4] resize-none"
                />
              </div>

              <div className="flex items-center gap-3 pt-1">
                <button
                  onClick={handleCreateRefreshJob}
                  disabled={submitting || selectedDocs.length === 0}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#1B3F7A] hover:bg-[#2C68C4] text-white rounded-md font-inter text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" /> Creating...</>
                  ) : (
                    <><Zap size={15} /> Create Refresh Job</>
                  )}
                </button>
                <button
                  onClick={() => { setShowNewJob(false); setSelectedDocs([]); setAdminNotes(''); }}
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
                      {new Date(job.requested_at).toLocaleDateString('en-GB', {
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

                {job.documents_to_refresh.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {job.documents_to_refresh.map((docId) => {
                      const label = DOCUMENT_OPTIONS.find(d => d.id === docId)?.label ?? docId;
                      return (
                        <span key={docId} className="inline-flex items-center gap-1 px-2 py-0.5 bg-white border border-gray-200 rounded text-xs font-inter text-gray-700">
                          <FileText size={10} />
                          {label}
                        </span>
                      );
                    })}
                  </div>
                )}

                {job.admin_notes && (
                  <p className="font-inter text-gray-600 text-xs">
                    <span className="font-semibold">Notes:</span> {job.admin_notes}
                  </p>
                )}

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
