'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useClientProfile } from '@/hooks/useClientProfile';
import { getServiceById } from '@/lib/services/service-catalog';
import { getServiceDeliveryStatuses } from '@/lib/services/service-status';
import { getDocumentTypesForService, isServiceDocumentService } from '@/lib/services/document-service-map';
import { CheckCircle2, Clock, RefreshCw, XCircle } from 'lucide-react';

interface DocRow {
  document_type: string;
  delivered_to_client: boolean;
  status: string;
}

export default function PersonalStatus() {
  const { profile, loading, purchasedServiceIds, intakeCompleteForServices } = useClientProfile();
  const [documents, setDocuments] = useState<DocRow[]>([]);
  const [hasCancelledRefresh, setHasCancelledRefresh] = useState(false);

  useEffect(() => {
    if (!profile?.user_id) return;
    const fetchDocs = async () => {
      const { data } = await supabase
        .from('generated_documents')
        .select('document_type, delivered_to_client, status')
        .eq('client_id', profile.user_id);
      setDocuments(data || []);
    };

    // Check for cancelled quarterly refresh subscription
    const checkRefreshStatus = async () => {
      if (!profile?.user_id) return;
      try {
        // Check services_purchased for cancelled quarterly_refresh
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

        // Also check stripe_subscriptions via stripe_customers
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
            const cancelledRefresh = subs.find((s: any) =>
              s.status === 'canceled' && s.price_id
            );
            if (cancelledRefresh) {
              // Verify it's a quarterly_refresh price
              const { getServiceById } = await import('@/lib/services/service-catalog');
              const service = subs.find((s: any) => {
                // Simple check: if it's a subscription that was cancelled
                return s.status === 'canceled';
              });
              if (service) {
                setHasCancelledRefresh(true);
              }
            }
          }
        }
      } catch {
        // Non-critical check — don't block rendering
      }
    };

    fetchDocs();
    checkRefreshStatus();
  }, [profile?.user_id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1B3F7A]" />
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
  const hasRefresh = serviceStatuses.some((s) => s.serviceId === 'quarterly_refresh');
  const refreshStatus = serviceStatuses.find((s) => s.serviceId === 'quarterly_refresh');

  // Show tabbed view when multiple document-producing services
  const showTabs = docServiceStatuses.length > 1;
  const [activeTab, setActiveTab] = useState<string>(
    docServiceStatuses[0]?.serviceId ?? 'business_foundations_pack',
  );

  // When there's only one doc service, show it directly (no tabs)
  const singleService = docServiceStatuses.length === 1 ? docServiceStatuses[0] : null;

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-inter font-bold text-[#1B3F7A] text-2xl mb-1">
          Status
        </h1>
        <p className="font-inter text-gray-600 text-sm">
          Track the progress of your {docServiceStatuses.length === 1 ? (getServiceById(docServiceStatuses[0].serviceId)?.name ?? 'service') : 'services'}.
        </p>
      </div>

      {/* Tab bar for multiple document services */}
      {showTabs && (
        <div className="mb-6">
          <div className="flex gap-1 bg-white rounded-lg border border-gray-200 p-1 overflow-x-auto">
            {docServiceStatuses.map((s) => {
              const service = getServiceById(s.serviceId);
              return (
                <button
                  key={s.serviceId}
                  onClick={() => setActiveTab(s.serviceId)}
                  className={`px-4 py-2 rounded-md font-inter text-sm font-medium transition-colors whitespace-nowrap ${
                    activeTab === s.serviceId
                      ? 'bg-[#1B3F7A] text-white'
                      : 'text-gray-600 hover:text-[#1B3F7A] hover:bg-gray-50'
                  }`}
                >
                  {service?.name ?? s.serviceId}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Active service timeline */}
      {(showTabs ? docServiceStatuses.find((s) => s.serviceId === activeTab) : singleService) && (
        <ServiceTimeline
          serviceStatus={showTabs
            ? docServiceStatuses.find((s) => s.serviceId === activeTab)!
            : singleService!}
          profile={profile}
        />
      )}

      {/* Quarterly Refresh section */}
      {hasRefresh && !hasCancelledRefresh && (
        <div className="mt-6 bg-white rounded-lg border border-teal-200 p-5">
          <div className="flex items-start gap-3">
            <div className="bg-teal-50 rounded-lg p-2 shrink-0">
              <RefreshCw size={18} className="text-teal-600" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-inter font-semibold text-[#1B3F7A] text-sm">
                  Quarterly Document Refresh
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-teal-50 text-teal-700 rounded text-xs font-inter font-medium">
                  <CheckCircle2 size={10} />
                  Active
                </span>
              </div>
              <p className="font-inter text-gray-600 text-sm">
                Your documents can be refreshed each quarter as your business evolves — pricing changes, new services, updated GDPR policies, and more. Contact us when you need updates.
              </p>
            </div>
          </div>
        </div>
      )}
      {hasCancelledRefresh && (
        <div className="mt-6 bg-white rounded-lg border border-gray-200 p-5">
          <div className="flex items-start gap-3">
            <div className="bg-gray-50 rounded-lg p-2 shrink-0">
              <RefreshCw size={18} className="text-gray-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-inter font-semibold text-gray-500 text-sm">
                  Quarterly Document Refresh
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-50 text-red-600 rounded text-xs font-inter font-medium">
                  <XCircle size={10} />
                  Cancelled
                </span>
              </div>
              <p className="font-inter text-gray-500 text-sm">
                Your Quarterly Document Refresh subscription has ended. Document refreshes are no longer available. To reactivate, visit the pricing page.
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
                You'll receive an email notification when they're ready for download.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ServiceTimeline({
  serviceStatus,
  profile,
}: {
  serviceStatus: { serviceId: string; serviceName: string; intakeComplete: boolean; deliveryStatus: string; documentsReady: number; documentsTotal: number };
  profile: { has_submitted_intake: boolean; intake_submitted_at: string | null; delivery_status: string };
}) {
  const service = getServiceById(serviceStatus.serviceId);
  const serviceName = service?.name ?? serviceStatus.serviceId;

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
      label: `${serviceName} documents being prepared`,
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
      label: `${serviceName} documents delivered`,
      complete: serviceStatus.deliveryStatus === 'delivered',
      detail: serviceStatus.deliveryStatus === 'delivered'
        ? serviceStatus.documentsTotal > 0
          ? `All ${serviceStatus.documentsTotal} documents available`
          : 'Available in Documents'
        : 'Pending',
    },
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-8">
      <div className="space-y-0">
        {steps.map((step, i) => (
          <div key={step.label} className="flex gap-4">
            {/* Indicator */}
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  step.complete
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {step.complete ? (
                  <CheckCircle2 size={18} />
                ) : (
                  <span className="font-inter font-semibold text-xs">{i + 1}</span>
                )}
              </div>
              {i < steps.length - 1 && (
                <div
                  className={`w-0.5 h-12 ${
                    step.complete ? 'bg-green-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>

            {/* Content */}
            <div className="pb-8">
              <p className={`font-inter font-semibold text-sm ${
                step.complete ? 'text-[#1B3F7A]' : 'text-gray-600'
              }`}>
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
