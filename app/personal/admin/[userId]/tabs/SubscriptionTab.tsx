'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import {
  RefreshCw, Calendar, CheckCircle2, Clock, AlertTriangle,
  XCircle, Plus, FileText, CreditCard, Zap, Crown, Star,
  Briefcase, ChevronDown, ChevronUp, ExternalLink, TrendingUp, Info,
} from 'lucide-react';
import {
  getDocumentTypesListForService,
  getDocumentConfigsForService,
} from '@/lib/services/document-configs';
import { getServiceById } from '@/lib/services/service-catalog';
import {
  detectCarePlanTier,
  getTierCapabilities,
  getRefreshableDocumentsForTier,
  getUpgradeTier,
  CARE_PLAN_INCLUSIONS,
} from '@/lib/services/tier-helpers';
import { CARE_PLAN_TIERS } from '@/lib/services/service-catalog-data';
import {
  SubscriptionRecord,
  RefreshJob,
  SUBSCRIPTION_STATUS_CONFIG,
  REFRESH_JOB_STATUS_CONFIG,
} from '@/lib/services/subscription-types';

interface SubscriptionTabProps {
  userId: string;
  data: any;
  refreshData: () => void;
}

const JOB_STATUS_CONFIG = {
  pending: { color: 'text-gray-600', bg: 'bg-gray-100', label: 'Pending', Icon: Clock },
  in_progress: { color: 'text-blue-600', bg: 'bg-blue-50', label: 'Processing', Icon: RefreshCw },
  completed: { color: 'text-green-600', bg: 'bg-green-50', label: 'Completed', Icon: CheckCircle2 },
  failed: { color: 'text-red-600', bg: 'bg-red-50', label: 'Failed', Icon: XCircle },
  cancelled: { color: 'text-amber-600', bg: 'bg-amber-50', label: 'Cancelled', Icon: AlertTriangle },
};

const TIER_ICONS: Record<string, any> = {
  essentials: Briefcase,
  standard: Star,
  complete: Crown,
};

const TIER_COLORS: Record<string, { bg: string; text: string; border: string; icon: string }> = {
  essentials: { bg: 'bg-gray-50', text: 'text-gray-800', border: 'border-gray-200', icon: 'text-gray-500' },
  standard: { bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-200', icon: 'text-blue-500' },
  complete: { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200', icon: 'text-amber-500' },
};

function formatDate(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatDateTime(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

function StatusBadge({ status, size = 'md' }: { status: string; size?: 'sm' | 'md' }) {
  const cfg = JOB_STATUS_CONFIG[status as keyof typeof JOB_STATUS_CONFIG] ?? JOB_STATUS_CONFIG.pending;
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

export default function SubscriptionTab({ userId, data, refreshData }: SubscriptionTabProps) {
  const purchasedServices: SubscriptionRecord[] = data?.purchasedServices ?? [];

  // Find the care plan subscription (monthly_care_plan or legacy quarterly_refresh)
  const carePlanSub = purchasedServices.find(s =>
    s.service_id === 'monthly_care_plan' || s.service_id === 'quarterly_refresh'
  ) ?? null;

  // Detect tier from subscription (in production, would query Stripe for actual price ID)
  // For now, we infer from the service_id and show all possible tiers
  const [stripePriceId, setStripePriceId] = useState<string | null>(null);
  const detectedTier = detectCarePlanTier(stripePriceId || '');
  const tierCapabilities = getTierCapabilities(detectedTier);

  // Get other purchased services for document refresh
  const documentServiceIds = purchasedServices
    .filter(s => s.service_id !== 'monthly_care_plan' && s.service_id !== 'quarterly_refresh')
    .map(s => s.service_id);

  const [refreshJobs, setRefreshJobs] = useState<RefreshJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewJob, setShowNewJob] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string>(documentServiceIds[0] ?? '');
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  const [updateInstructions, setUpdateInstructions] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null);
  const [expandedJob, setExpandedJob] = useState<string | null>(null);

  useEffect(() => {
    fetchJobs();
  }, [userId]);

  // Try to fetch the actual Stripe price ID from the subscription
  useEffect(() => {
    const fetchPriceId = async () => {
      if (carePlanSub?.stripe_subscription_id) {
        // In production, would query Stripe API here
        // For now, we infer tier from purchased services
        // If client has the care plan, default to 'standard' tier
        setStripePriceId(CARE_PLAN_TIERS[1].stripePriceId.test);
      }
    };
    fetchPriceId();
  }, [carePlanSub]);

  const fetchJobs = async () => {
    setLoading(true);

    const { data: jobs } = await supabase
      .from('document_refresh_jobs')
      .select('*')
      .eq('client_id', userId)
      .order('created_at', { ascending: false });

    setRefreshJobs((jobs as RefreshJob[]) ?? []);
    setLoading(false);
  };

  // Get refreshable documents filtered by tier capabilities
  const allDocConfigs = selectedServiceId ? getDocumentConfigsForService(selectedServiceId) : [];
  const refreshableDocs = allDocConfigs.filter(doc => doc.supportsRefresh === true);
  const filteredRefreshableDocs = getRefreshableDocumentsForTier(detectedTier, selectedServiceId);

  // Use filtered list for display (tier-aware)
  const docOptionsForService = selectedServiceId && filteredRefreshableDocs.length > 0
    ? filteredRefreshableDocs.map(doc => ({ id: doc.document_type, label: doc.document_label, description: doc.description }))
    : refreshableDocs.map(doc => ({ id: doc.document_type, label: doc.document_label, description: doc.description }));

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
    if (!updateInstructions.trim() || updateInstructions.trim().length < 10) {
      setMessage({ text: 'Please provide detailed update instructions (at least 10 characters).', ok: false });
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
            clientId: userId,
            subscriptionId: carePlanSub?.stripe_subscription_id || null,
            serviceId: selectedServiceId,
            documentTypes: selectedDocs,
            updateInstructions: updateInstructions.trim(),
          }),
        }
      );

      const result = await response.json();

      if (response.ok && result.success) {
        setMessage({
          text: `Refresh completed: ${result.documentsCompleted?.length ?? 0} updated, ${result.documentsFailed?.length ?? 0} failed.`,
          ok: true
        });
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

  // No care plan subscription
  if (!carePlanSub) {
    return (
      <div className="space-y-5">
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <CreditCard size={48} className="text-gray-300 mx-auto mb-4" />
          <h4 className="font-inter font-semibold text-gray-900 text-lg mb-2">No Care Plan</h4>
          <p className="font-inter text-gray-600 text-sm max-w-md mx-auto">
            This client has not purchased a Monthly Care Plan or Quarterly Document Refresh subscription.
            Document refreshes require an active care plan subscription.
          </p>
        </div>
      </div>
    );
  }

  const subscriptionTitle = carePlanSub.service_id === 'monthly_care_plan'
    ? 'Monthly Care Plan' : 'Quarterly Document Refresh';

  const statusConfig = SUBSCRIPTION_STATUS_CONFIG[carePlanSub.status as keyof typeof SUBSCRIPTION_STATUS_CONFIG]
    ?? SUBSCRIPTION_STATUS_CONFIG.active;

  const isCancelled = carePlanSub.status === 'cancelled' || carePlanSub.status === 'expired';
  const isActive = carePlanSub.status === 'active';
  const accessTerminationDate = carePlanSub.expires_at || carePlanSub.subscription_period_end;

  // Get upgrade tier info
  const upgradeTier = getUpgradeTier(detectedTier);

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
            <h3 className="font-inter font-bold text-[#1B3F7A] text-lg">{subscriptionTitle}</h3>
            <p className="font-inter text-gray-500 text-sm mt-0.5">
              Ongoing document maintenance and business support
            </p>
          </div>
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-inter text-sm font-medium ${statusConfig.textColor} ${statusConfig.bgColor}`}>
            {carePlanSub.status === 'active' && <CheckCircle2 size={16} />}
            {carePlanSub.status === 'cancelled' && <XCircle size={16} />}
            {carePlanSub.status === 'expired' && <XCircle size={16} />}
            {carePlanSub.status === 'past_due' && <AlertTriangle size={16} />}
            {statusConfig.label}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
          <div>
            <p className="font-inter text-gray-500 text-xs mb-1">Started</p>
            <p className="font-inter font-semibold text-gray-900 text-sm">{formatDate(carePlanSub.purchased_at)}</p>
          </div>
          {carePlanSub.subscription_period_start && (
            <div>
              <p className="font-inter text-gray-500 text-xs mb-1">Period Start</p>
              <p className="font-inter font-semibold text-gray-900 text-sm">{formatDate(carePlanSub.subscription_period_start)}</p>
            </div>
          )}
          {(carePlanSub.next_billing_date || carePlanSub.expires_at) && (
            <div>
              <p className="font-inter text-gray-500 text-xs mb-1">
                {isActive ? 'Next Billing' : 'Access Until'}
              </p>
              <p className="font-inter font-semibold text-gray-900 text-sm flex items-center gap-1.5">
                <Calendar size={13} className="text-[#2C68C4]" />
                {formatDate(carePlanSub.next_billing_date || carePlanSub.expires_at)}
              </p>
            </div>
          )}
          {carePlanSub.stripe_subscription_id && (
            <div>
              <p className="font-inter text-gray-500 text-xs mb-1">Stripe ID</p>
              <p className="font-mono text-gray-700 text-xs truncate">{carePlanSub.stripe_subscription_id}</p>
            </div>
          )}
        </div>
      </div>

      {/* Care Plan Tier Breakdown */}
      {detectedTier && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {(() => {
                const TierIcon = TIER_ICONS[detectedTier.id] || Briefcase;
                const colors = TIER_COLORS[detectedTier.id] || TIER_COLORS.essentials;
                return (
                  <div className={`rounded-lg p-2.5 ${colors.bg} ${colors.border} border`}>
                    <TierIcon size={20} className={colors.icon} />
                  </div>
                );
              })()}
              <div>
                <h3 className="font-inter font-bold text-[#1B3F7A] text-lg">
                  {detectedTier.name} Tier
                </h3>
                <p className="font-inter text-gray-500 text-sm">
                  {detectedTier.priceLabel}/month
                </p>
              </div>
            </div>
            {upgradeTier && (
              <a
                href="/personal/checkout?service=monthly_care_plan"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#1B3F7A] hover:bg-[#2C68C4] text-white rounded-md font-inter text-sm font-semibold transition-colors"
              >
                <TrendingUp size={16} />
                Upgrade to {upgradeTier.name}
              </a>
            )}
          </div>

          <p className="font-inter text-gray-600 text-sm mb-4">
            {detectedTier.tagline}
          </p>

          {/* Tier Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {CARE_PLAN_INCLUSIONS[detectedTier.id]?.map((item, idx) => (
              <div
                key={idx}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg ${
                  item.included ? 'bg-green-50' : 'bg-gray-50'
                }`}
              >
                {item.included ? (
                  <CheckCircle2 size={16} className="text-green-600 shrink-0" />
                ) : (
                  <XCircle size={16} className="text-gray-400 shrink-0" />
                )}
                <span className={`font-inter text-sm ${
                  item.included ? 'text-gray-800' : 'text-gray-500 line-through'
                }`}>
                  {item.feature}
                </span>
              </div>
            ))}
          </div>

          {!tierCapabilities.hasSocialMediaRefresh && (
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2.5">
              <Info size={16} className="text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-inter text-amber-800 text-sm font-medium">Social media and website refresh not included</p>
                <p className="font-inter text-amber-700 text-xs mt-1">
                  Upgrade to <strong>Complete</strong> tier to unlock social media content refresh and website copy updates.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Cancelled Subscription Warning */}
      {isCancelled && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertTriangle size={18} className="text-red-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-inter font-semibold text-red-800 text-sm">
              Subscription {carePlanSub.status} — refreshes not permitted
            </p>
            <p className="font-inter text-red-700 text-xs mt-1">
              This client's {subscriptionTitle} subscription has been {carePlanSub.status}.
              {accessTerminationDate && (
                <span className="block mt-2">
                  <strong>Client access continues until:</strong> {formatDate(accessTerminationDate)}
                </span>
              )}
              Document refreshes cannot be initiated until the subscription is reactivated.
            </p>
          </div>
        </div>
      )}

      {/* Past Due Warning */}
      {carePlanSub.status === 'past_due' && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
          <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-inter font-semibold text-amber-800 text-sm">
              Payment Past Due
            </p>
            <p className="font-inter text-amber-700 text-xs mt-1">
              The latest payment for this subscription failed. Refresh jobs may be temporarily unavailable.
              Please resolve the billing issue in Stripe.
            </p>
          </div>
        </div>
      )}

      {/* Initiate Document Refresh */}
      {isActive && documentServiceIds.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-1">
            <div>
              <h3 className="font-inter font-bold text-[#1B3F7A] text-lg">Initiate Document Refresh</h3>
              <p className="font-inter text-gray-500 text-sm">
                Select documents to update and describe what has changed
              </p>
            </div>
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
            <div className="mt-5 space-y-5">
              {/* Service selector */}
              <div>
                <label className="block font-inter font-semibold text-gray-800 text-sm mb-2">
                  Service to Refresh
                </label>
                <select
                  value={selectedServiceId}
                  onChange={(e) => handleServiceChange(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-md font-inter text-sm focus:outline-none focus:ring-2 focus:ring-[#2C68C4] focus:border-[#2C68C4] bg-white"
                >
                  {documentServiceIds.map(sid => {
                    const service = getServiceById(sid);
                    return (
                      <option key={sid} value={sid}>
                        {service?.name ?? sid}
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
                      Documents to Refresh ({docOptionsForService.length} refreshable)
                    </label>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={selectAllDocs}
                        className="font-inter text-xs text-[#2C68C4] hover:underline"
                      >
                        Select all
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedDocs([])}
                        className="font-inter text-xs text-gray-500 hover:underline"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {docOptionsForService.map((doc) => (
                      <label
                        key={doc.id}
                        className={`flex items-start gap-2.5 cursor-pointer group p-2.5 rounded-lg border transition-colors ${
                          selectedDocs.includes(doc.id)
                            ? 'bg-blue-50 border-[#2C68C4]'
                            : 'bg-white border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedDocs.includes(doc.id)}
                          onChange={() => toggleDoc(doc.id)}
                          className="mt-0.5 rounded border-gray-300 text-[#1B3F7A] focus:ring-[#2C68C4]"
                        />
                        <div>
                          <span className="font-inter text-sm text-gray-800 font-medium group-hover:text-gray-900 transition-colors">
                            {doc.label}
                          </span>
                          {doc.description && (
                            <p className="font-inter text-xs text-gray-500 mt-0.5 line-clamp-2">
                              {doc.description}
                            </p>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                  {detectedTier && !tierCapabilities.hasSocialMediaRefresh && (
                    <p className="font-inter text-xs text-gray-500 mt-2 flex items-center gap-1.5">
                      <Info size={12} />
                      Social media and website documents require the Complete tier
                    </p>
                  )}
                </div>
              )}

              {docOptionsForService.length === 0 && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                  <FileText size={24} className="text-gray-300 mx-auto mb-2" />
                  <p className="font-inter text-gray-600 text-sm">
                    No refreshable documents found for this service
                  </p>
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
                  placeholder="Describe exactly what has changed and what needs updating. For example:&#10;&#10;- Price changed from £500 to £600 for flagship service&#10;- Added new service: 90-minute intensive session at £150&#10;- Updated GDPR data retention from 2 years to 3 years&#10;- Changed refund policy from 14 days to 7 days&#10;- Business name changed from 'XYZ Coaching' to 'XYZ Transformations'"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md font-inter text-sm focus:outline-none focus:ring-2 focus:ring-[#2C68C4] focus:border-[#2C68C4] resize-none"
                />
                <p className="font-inter text-gray-500 text-xs mt-1.5">
                  {updateInstructions.length}/500 characters — minimum 10 required
                </p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={handleCreateRefreshJob}
                  disabled={submitting || selectedDocs.length === 0 || updateInstructions.trim().length < 10}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1B3F7A] hover:bg-[#2C68C4] text-white rounded-md font-inter text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Zap size={16} />
                      Refresh {selectedDocs.length} Document{selectedDocs.length !== 1 ? 's' : ''}
                    </>
                  )}
                </button>
                <button
                  onClick={() => { setShowNewJob(false); setSelectedDocs([]); setUpdateInstructions(''); }}
                  className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md font-inter text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Refresh History Table */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="font-inter font-bold text-[#1B3F7A] text-lg mb-4">Refresh History</h3>

        {refreshJobs.length === 0 ? (
          <div className="text-center py-10">
            <RefreshCw size={40} className="text-gray-300 mx-auto mb-3" />
            <p className="font-inter text-gray-500 text-sm">No refresh jobs yet.</p>
            {isActive && documentServiceIds.length > 0 && (
              <button
                onClick={() => setShowNewJob(true)}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-[#1B3F7A] hover:bg-[#2C68C4] text-white rounded-md font-inter text-sm font-medium transition-colors"
              >
                <Plus size={15} />
                Create First Refresh Job
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left font-inter font-semibold text-gray-700 text-xs py-3 px-2">Date</th>
                  <th className="text-left font-inter font-semibold text-gray-700 text-xs py-3 px-2">Status</th>
                  <th className="text-left font-inter font-semibold text-gray-700 text-xs py-3 px-2">Documents</th>
                  <th className="text-left font-inter font-semibold text-gray-700 text-xs py-3 px-2">Instructions</th>
                  <th className="text-left font-inter font-semibold text-gray-700 text-xs py-3 px-2">Completed</th>
                </tr>
              </thead>
              <tbody>
                {refreshJobs.map((job) => {
                  const isExpanded = expandedJob === job.id;
                  const completedCount = job.documents_completed?.length ?? 0;
                  const failedCount = job.documents_failed?.length ?? 0;
                  const totalCount = job.document_types?.length ?? 0;

                  return (
                    <tr key={job.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-2">
                        <span className="font-inter text-gray-700 text-sm">
                          {formatDateTime(job.created_at)}
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        <StatusBadge status={job.status} size="sm" />
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-2">
                          <span className="font-inter text-gray-700 text-sm">
                            {totalCount} docs
                          </span>
                          {completedCount > 0 && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-green-100 text-green-700 text-xs rounded font-inter">
                              {completedCount} done
                            </span>
                          )}
                          {failedCount > 0 && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-red-100 text-red-700 text-xs rounded font-inter">
                              {failedCount} failed
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <p className="font-inter text-gray-600 text-sm line-clamp-1 max-w-xs">
                          {job.update_instructions || '—'}
                        </p>
                      </td>
                      <td className="py-3 px-2">
                        <span className="font-inter text-gray-500 text-sm">
                          {job.completed_at ? formatDate(job.completed_at) : '—'}
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        <button
                          onClick={() => setExpandedJob(isExpanded ? null : job.id)}
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                        >
                          {isExpanded ? (
                            <ChevronUp size={16} className="text-gray-500" />
                          ) : (
                            <ChevronDown size={16} className="text-gray-500" />
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Expanded Job Details */}
        {expandedJob && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            {(() => {
              const job = refreshJobs.find(j => j.id === expandedJob);
              if (!job) return null;

              return (
                <div className="space-y-3">
                  <div>
                    <p className="font-inter font-semibold text-gray-800 text-sm mb-1">Update Instructions</p>
                    <p className="font-inter text-gray-700 text-sm whitespace-pre-wrap">
                      {job.update_instructions || '—'}
                    </p>
                  </div>

                  {job.error_message && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="font-inter font-semibold text-red-800 text-sm mb-1">Error</p>
                      <p className="font-inter text-red-700 text-sm">{job.error_message}</p>
                    </div>
                  )}

                  <div>
                    <p className="font-inter font-semibold text-gray-800 text-sm mb-2">Document Results</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {job.document_types?.map((docId) => {
                        const isCompleted = job.documents_completed?.includes(docId);
                        const isFailed = job.documents_failed?.includes(docId);
                        const docLabel = docOptionsForService.find(d => d.id === docId)?.label || docId;

                        return (
                          <div
                            key={docId}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${
                              isCompleted
                                ? 'bg-green-50 border-green-200'
                                : isFailed
                                  ? 'bg-red-50 border-red-200'
                                  : 'bg-gray-50 border-gray-200'
                            }`}
                          >
                            {isCompleted ? (
                              <CheckCircle2 size={14} className="text-green-600" />
                            ) : isFailed ? (
                              <XCircle size={14} className="text-red-600" />
                            ) : (
                              <Clock size={14} className="text-gray-400" />
                            )}
                            <span className="font-inter text-sm text-gray-700">{docLabel}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
}
