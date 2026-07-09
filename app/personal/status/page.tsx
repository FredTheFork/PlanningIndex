'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useClientProfile } from '@/hooks/useClientProfile';
import { getServiceById, isSubscriptionService, type ServiceTier } from '@/lib/services/service-catalog';
import { getServiceDeliveryStatuses, type ServiceDeliveryStatus } from '@/lib/services/service-status';
import { getDocumentTypesForService, isServiceDocumentService } from '@/lib/services/document-service-map';
import { TimelineSkeleton } from '@/components/ui/skeletons';
import { CheckCircle2, Clock, RefreshCw, XCircle, Star, Briefcase, Crown } from 'lucide-react';

interface DocRow {
  document_type: string;
  delivered_to_client: boolean;
  status: string;
  delivered_at?: string | null;
}

export default function PersonalStatus() {
  const { profile, loading, purchasedServiceIds, intakeCompleteForServices } = useClientProfile();
  const [documents, setDocuments] = useState<DocRow[]>([]);
  const [hasCancelledRefresh, setHasCancelledRefresh] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('');
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  useEffect(() => {
    if (!profile?.user_id) return;

    const fetchDocs = async () => {
      const { data } = await supabase
        .from('generated_documents')
        .select('document_type, delivered_to_client, status, delivered_at')
        .eq('client_id', profile.user_id);
      setDocuments(data || []);
    };

    const checkRefreshStatus = async () => {
      if (!profile?.user_id) return;
      try {
        const { data: sp } = await supabase
          .from('services_purchased')
          .select('status')
          .eq('user_id', profile.user_id)
          .eq('service_id', 'quarterly_refresh')
          .maybeSingle();

        if (sp?.status === 'cancelled') {
          setHasCancelledRefresh(true);
          return;
        }

        const { data: customer } = await supabase
          .from('stripe_customers')
          .select('customer_id')
          .eq('user_id', profile.user_id)
          .maybeSingle();

        if (customer?.customer_id) {
          const { data: subs } = await supabase
            .from('stripe_subscriptions')
            .select('status, price_id')
            .eq('customer_id', customer.customer_id);

          if (subs) {
            for (const sub of subs) {
              if (sub.status === 'canceled' && sub.price_id) {
                const service = getServiceById('quarterly_refresh');
                if (service && (service.stripePriceIds.test === sub.price_id || service.stripePriceIds.live === sub.price_id)) {
                  setHasCancelledRefresh(true);
                  break;
                }
              }
            }
          }
        }
      } catch {
        // Non-critical check
      }
    };

    fetchDocs();
    checkRefreshStatus();

    // Realtime subscription for document delivery updates
    const channel = supabase.channel(`status_docs:${profile.user_id}`);
    channel
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'generated_documents',
        filter: `client_id=eq.${profile.user_id}`,
      }, (payload) => {
        // Refetch all documents to get accurate counts
        fetchDocs();
      })
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'generated_documents',
        filter: `client_id=eq.${profile.user_id}`,
      }, () => {
        fetchDocs();
      })
      .subscribe();

    channelRef.current = channel;

    return () => {
      channel.unsubscribe();
    };
  }, [profile?.user_id]);

  if (loading) {
    return (
      <div>
        <div className="mb-8">
          <div className="h-8 bg-gray-200 rounded w-20 mb-1 animate-pulse" />
          <div className="h-4 bg-gray-100 rounded w-48 animate-pulse" />
        </div>
        <TimelineSkeleton />
      </div>
    );
  }

  if (!profile) return null;

  // Compute per-service statuses
  const serviceStatuses = getServiceDeliveryStatuses({
    purchasedServiceIds,
    intakeCompleteForServices,
    documents,
    overallDeliveryStatus: profile.delivery_status,
  });

  const docServiceStatuses = serviceStatuses.filter((s) => isServiceDocumentService(s.serviceId));
  const subServices = serviceStatuses.filter((s) => isSubscriptionService(s.serviceId));
  const hasRefresh = subServices.some((s) => s.serviceId === 'quarterly_refresh');

  // Group by tier
  const foundationServices = docServiceStatuses.filter((s) => s.tier === 'foundation');
  const operationsServices = docServiceStatuses.filter((s) => s.tier === 'operations');
  const industryServices = docServiceStatuses.filter((s) => s.tier === 'industry');

  // Default tab selection
  useEffect(() => {
    if (!activeTab && docServiceStatuses.length > 0) {
      // Select the first service with incomplete intake, or first overall
      const needsIntake = docServiceStatuses.find((s) => !s.intakeComplete);
      setActiveTab(needsIntake?.serviceId ?? docServiceStatuses[0].serviceId);
    }
  }, [docServiceStatuses, activeTab]);

  // Get active service for display
  const activeService = docServiceStatuses.find((s) => s.serviceId === activeTab);

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-inter font-bold text-[#1B3F7A] text-2xl mb-1">
          Status
        </h1>
        <p className="font-inter text-gray-600 text-sm">
          Track the progress of your packs across all tiers.
        </p>
      </div>

      {/* Tier tabs if multiple services */}
      {docServiceStatuses.length > 1 && (
        <div className="mb-6">
          <TierTabBar
            foundationServices={foundationServices}
            operationsServices={operationsServices}
            industryServices={industryServices}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </div>
      )}

      {/* Active service timeline */}
      {activeService && (
        <ServiceTimeline serviceStatus={activeService} profile={profile} documents={documents} />
      )}

      {/* Single service — show directly */}
      {docServiceStatuses.length === 1 && (
        <ServiceTimeline serviceStatus={docServiceStatuses[0]} profile={profile} documents={documents} />
      )}

      {/* Subscription section */}
      {subServices.length > 0 && (
        <div className="mt-6 bg-white rounded-lg border border-teal-200 p-5">
          <div className="flex items-start gap-3">
            <div className="bg-teal-50 rounded-lg p-2 shrink-0">
              <RefreshCw size={18} className="text-teal-600" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-inter font-semibold text-[#1B3F7A] text-sm">
                  {subServices[0].serviceId === 'monthly_care_plan' ? 'Monthly Care Plan' : 'Quarterly Document Refresh'}
                </span>
                {!hasCancelledRefresh && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-teal-50 text-teal-700 rounded text-xs font-inter font-medium">
                    <CheckCircle2 size={10} />
                    Active
                  </span>
                )}
                {hasCancelledRefresh && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-50 text-red-600 rounded text-xs font-inter font-medium">
                    <XCircle size={10} />
                    Cancelled
                  </span>
                )}
              </div>
              <p className="font-inter text-gray-600 text-sm">
                {hasCancelledRefresh
                  ? 'Your subscription has ended. To reactivate, visit the services page.'
                  : subServices[0].serviceId === 'monthly_care_plan'
                    ? 'Your documents can be updated monthly as your business evolves. Contact us when you need updates.'
                    : 'Your documents can be refreshed each quarter. Contact us when you need updates.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Info box */}
      {docServiceStatuses.length > 0 && (
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-5">
          <div className="flex items-start gap-3">
            <Clock size={20} className="text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-inter font-semibold text-blue-900 text-sm mb-1">
                24-Hour Delivery Promise
              </p>
              <p className="font-inter text-blue-700 text-xs">
                Once you submit your intake form, we begin preparing your bespoke documents immediately.
                You&apos;ll receive an email notification when they&apos;re ready for download.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TierTabBar({
  foundationServices,
  operationsServices,
  industryServices,
  activeTab,
  setActiveTab,
}: {
  foundationServices: ServiceDeliveryStatus[];
  operationsServices: ServiceDeliveryStatus[];
  industryServices: ServiceDeliveryStatus[];
  activeTab: string;
  setActiveTab: (id: string) => void;
}) {
  const allServices = [
    ...foundationServices.map((s) => ({ ...s, tier: 'foundation' as const })),
    ...operationsServices.map((s) => ({ ...s, tier: 'operations' as const })),
    ...industryServices.map((s) => ({ ...s, tier: 'industry' as const })),
  ];

  const getTierStyle = (tier: ServiceTier) => {
    switch (tier) {
      case 'foundation':
        return { bg: '#1B3F7A15', text: '#1B3F7A', border: '#1B3F7A' };
      case 'operations':
        return { bg: '#2C68C415', text: '#2C68C4', border: '#2C68C4' };
      case 'industry':
        return { bg: '#F59E0B15', text: '#F59E0B', border: '#F59E0B' };
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-1 overflow-x-auto">
      <div className="flex gap-1">
        {allServices.map((s) => {
          const service = getServiceById(s.serviceId);
          const isActive = activeTab === s.serviceId;
          const style = getTierStyle(s.tier!);
          const Icon = s.tier === 'foundation' ? Star : s.tier === 'operations' ? Briefcase : Crown;

          return (
            <button
              key={s.serviceId}
              onClick={() => setActiveTab(s.serviceId)}
              className="flex items-center gap-2 px-4 py-2 rounded-md font-inter text-sm font-medium transition-colors whitespace-nowrap"
              style={{
                background: isActive ? style.border : 'transparent',
                color: isActive ? '#ffffff' : style.text,
              }}
            >
              <Icon size={14} />
              <span className="truncate max-w-[120px]">{service?.name?.split(' ').slice(0, 2).join(' ') ?? s.serviceId}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ServiceTimeline({
  serviceStatus,
  profile,
  documents,
}: {
  serviceStatus: ServiceDeliveryStatus;
  profile: { has_submitted_intake: boolean; intake_submitted_at: string | null; delivery_status: string };
  documents: DocRow[];
}) {
  const service = getServiceById(serviceStatus.serviceId);
  const serviceName = service?.name ?? serviceStatus.serviceId;
  const docTypesForService = getDocumentTypesForService(serviceStatus.serviceId);

  // Find the most recent delivered_at timestamp for this service's documents
  const latestDeliveryDate = documents
    .filter(d => d.delivered_to_client && docTypesForService.includes(d.document_type) && d.delivered_at)
    .map(d => new Date(d.delivered_at!))
    .sort((a, b) => b.getTime() - a.getTime())[0];

  // Tier-aware styling
  const getTierStyle = (tier: ServiceTier | null) => {
    switch (tier) {
      case 'foundation':
        return { accent: '#1B3F7A', bg: '#1B3F7A10', Icon: Star };
      case 'operations':
        return { accent: '#2C68C4', bg: '#2C68C410', Icon: Briefcase };
      case 'industry':
        return { accent: '#F59E0B', bg: '#F59E0B10', Icon: Crown };
      default:
        return { accent: '#1B3F7A', bg: '#1B3F7A10', Icon: Star };
    }
  };

  const tierStyle = getTierStyle(serviceStatus.tier);
  const tierLabel = serviceStatus.tier === 'foundation' ? 'Foundation'
    : serviceStatus.tier === 'operations' ? 'Operations'
    : serviceStatus.tier === 'industry' ? 'Industry'
    : '';

  const steps = [
    {
      label: `Intake form submitted for ${serviceName}`,
      complete: serviceStatus.intakeComplete,
      detail: !profile.has_submitted_intake
        ? 'Not yet submitted'
        : !serviceStatus.intakeComplete
        ? 'New sections needed'
        : profile.intake_submitted_at
          ? new Date(profile.intake_submitted_at).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })
          : 'Submitted',
    },
    {
      label: `${tierLabel ? tierLabel + ' ' : ''}documents being prepared`,
      complete: serviceStatus.deliveryStatus === 'in_progress' || serviceStatus.deliveryStatus === 'delivered',
      detail: serviceStatus.deliveryStatus === 'not_started'
        ? 'Waiting for intake completion'
        : serviceStatus.deliveryStatus === 'in_progress'
        ? serviceStatus.documentsTotal > 0
          ? `${serviceStatus.documentsReady} of ${serviceStatus.documentsTotal} ready`
          : 'In progress'
        : 'Complete',
    },
    {
      label: `${tierLabel ? tierLabel + ' ' : ''}documents delivered`,
      complete: serviceStatus.deliveryStatus === 'delivered',
      detail: serviceStatus.deliveryStatus === 'delivered'
        ? latestDeliveryDate
          ? `Delivered on ${latestDeliveryDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`
          : `All ${serviceStatus.documentsTotal} documents available`
        : 'Pending',
    },
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      {/* Header with tier badge */}
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
        <div
          className="rounded-lg p-2"
          style={{ background: tierStyle.bg }}
        >
          <tierStyle.Icon size={20} style={{ color: tierStyle.accent }} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-inter font-bold text-[#1B3F7A]">{serviceName}</h2>
            {tierLabel && (
              <span
                className="font-inter text-xs px-2 py-0.5 rounded"
                style={{ background: tierStyle.bg, color: tierStyle.accent }}
              >
                {tierLabel}
              </span>
            )}
          </div>
          {serviceStatus.documentsTotal > 0 && (
            <p className="font-inter text-gray-500 text-xs mt-0.5">
              {serviceStatus.documentsReady}/{serviceStatus.documentsTotal} documents delivered
            </p>
          )}
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-0">
        {steps.map((step, i) => (
          <div key={step.label} className="flex gap-4">
            {/* Indicator */}
            <div className="flex flex-col items-center">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                style={{
                  background: step.complete ? tierStyle.accent : '#f3f4f6',
                  color: step.complete ? '#ffffff' : '#6b7280',
                }}
              >
                {step.complete ? (
                  <CheckCircle2 size={18} />
                ) : (
                  <span className="font-inter font-semibold text-xs">{i + 1}</span>
                )}
              </div>
              {i < steps.length - 1 && (
                <div
                  className="w-0.5 h-12"
                  style={{ background: step.complete ? tierStyle.accent : '#e5e7eb' }}
                />
              )}
            </div>

            {/* Content */}
            <div className="pb-8">
              <p
                className="font-inter font-semibold text-sm"
                style={{ color: step.complete ? tierStyle.accent : '#6b7280' }}
              >
                {step.label}
              </p>
              <p className="font-inter text-gray-600 text-xs mt-0.5">
                {step.detail}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
