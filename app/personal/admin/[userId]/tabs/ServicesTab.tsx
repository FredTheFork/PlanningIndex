'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import {
  Package, FileText, Briefcase, Clock, CheckCircle2, AlertCircle,
  RefreshCw, ChevronRight, ArrowRight, Calendar, CreditCard, Zap
} from 'lucide-react';
import { getServiceById } from '@/lib/services/service-catalog';
import { getDocumentTypesForService } from '@/lib/services/document-service-map';
import { getDocumentConfigsForService } from '@/lib/services/document-configs';
import { getServiceDeliveryStatuses } from '@/lib/services/service-status';
import type { ServiceDeliveryStatus } from '@/lib/services/service-status';

interface ServicesTabProps {
  userId: string;
  data: any;
  refreshData: () => void;
}

export default function ServicesTab({ userId, data, refreshData }: ServicesTabProps) {
  const [serviceStatuses, setServiceStatuses] = useState<ServiceDeliveryStatus[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [briefs, setBriefs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatingBrief, setGeneratingBrief] = useState<string | null>(null);
  const [generatingDocs, setGeneratingDocs] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>('info');

  useEffect(() => {
    fetchServiceData();
  }, [userId, data]);

  const fetchServiceData = async () => {
    setLoading(true);

    const { data: docs } = await supabase
      .from('generated_documents')
      .select('*')
      .eq('client_id', userId);

    const { data: briefsData } = await supabase
      .from('client_briefs')
      .select('*')
      .eq('client_id', userId);

    setDocuments(docs || []);
    setBriefs(briefsData || []);

    const purchasedServiceIds = data.purchasedServices?.map((ps: any) => ps.service_id) || [];
    const intakeCompleteForServices = data.profile?.intake_complete_for_services || [];

    if (purchasedServiceIds.length > 0) {
      const statuses = getServiceDeliveryStatuses({
        purchasedServiceIds,
        intakeCompleteForServices,
        documents: (docs || []).map((d: any) => ({
          document_type: d.document_type,
          delivered_to_client: d.delivered_to_client,
          status: d.status,
        })),
        overallDeliveryStatus: data.profile?.delivery_status || 'not_started',
      });
      setServiceStatuses(statuses);
    }

    setLoading(false);
  };

  const showMessage = (msg: string, type: 'success' | 'error' | 'info' = 'info') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(''), 5000);
  };

  const handleGenerateBrief = async (serviceId: string) => {
    if (!data.profile?.has_submitted_intake) {
      showMessage('Client must submit intake form first', 'error');
      return;
    }

    setGeneratingBrief(serviceId);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/generate-brief`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ user_id: userId, service_id: serviceId }),
        }
      );

      const result = await response.json();

      if (response.ok && result.success) {
        showMessage(`Brief generated for ${getServiceById(serviceId)?.name ?? serviceId}`, 'success');
        await fetchServiceData();
        refreshData();
      } else {
        showMessage(result.error || 'Failed to generate brief', 'error');
      }
    } catch (error: any) {
      showMessage(error.message || 'Error generating brief', 'error');
    } finally {
      setGeneratingBrief(null);
    }
  };

  const handleGenerateDocuments = async (serviceId: string) => {
    setGeneratingDocs(serviceId);
    const docTypes = getDocumentTypesForService(serviceId);
    const configs = getDocumentConfigsForService(serviceId);
    let successCount = 0;
    let failCount = 0;

    for (const docType of docTypes) {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/generate-document`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
            },
            body: JSON.stringify({
              user_id: userId,
              document_type: docType,
              service_id: serviceId,
            }),
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

    showMessage(
      `Generated ${successCount} document${successCount !== 1 ? 's' : ''}${failCount > 0 ? `, ${failCount} failed` : ''}`,
      failCount > 0 ? 'error' : 'success'
    );
    await fetchServiceData();
    refreshData();
    setGeneratingDocs(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1B3F7A]" />
      </div>
    );
  }

  const purchasedServices = data.purchasedServices || [];

  if (purchasedServices.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
        <Package size={48} className="text-gray-400 mx-auto mb-4" />
        <h4 className="font-inter font-semibold text-gray-900 text-lg mb-2">
          No Services Purchased
        </h4>
        <p className="font-inter text-gray-600 text-sm">
          This client has not purchased any services yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Message Banner */}
      {message && (
        <div className={`rounded-lg p-4 border flex items-start gap-3 ${
          messageType === 'success' ? 'bg-green-50 border-green-200 text-green-800'
          : messageType === 'error' ? 'bg-red-50 border-red-200 text-red-800'
          : 'bg-blue-50 border-blue-200 text-blue-800'
        }`}>
          {messageType === 'success' && <CheckCircle2 size={16} className="shrink-0 mt-0.5 text-green-600" />}
          {messageType === 'error' && <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-600" />}
          {messageType === 'info' && <Zap size={16} className="shrink-0 mt-0.5 text-blue-600" />}
          <p className="font-inter text-sm font-medium">{message}</p>
        </div>
      )}

      {/* Service Cards */}
      {purchasedServices.map((ps: any) => {
        const service = getServiceById(ps.service_id);
        const status = serviceStatuses.find(s => s.serviceId === ps.service_id);
        const serviceBriefs = briefs.filter((b: any) => b.service_id === ps.service_id);
        const serviceDocTypes = getDocumentTypesForService(ps.service_id);
        const serviceDocs = documents.filter((d: any) => serviceDocTypes.includes(d.document_type));
        const configs = getDocumentConfigsForService(ps.service_id);

        return (
          <ServiceCard
            key={ps.id}
            purchasedService={ps}
            service={service}
            status={status}
            briefs={serviceBriefs}
            documents={serviceDocs}
            docConfigs={configs}
            generatingBrief={generatingBrief === ps.service_id}
            generatingDocs={generatingDocs === ps.service_id}
            onGenerateBrief={() => handleGenerateBrief(ps.service_id)}
            onGenerateDocuments={() => handleGenerateDocuments(ps.service_id)}
            intakeSubmitted={data.profile?.has_submitted_intake}
          />
        );
      })}
    </div>
  );
}

// ─── Service Card ────────────────────────────────────────────────────────────

function ServiceCard({
  purchasedService,
  service,
  status,
  briefs,
  documents,
  docConfigs,
  generatingBrief,
  generatingDocs,
  onGenerateBrief,
  onGenerateDocuments,
  intakeSubmitted,
}: {
  purchasedService: any;
  service: any;
  status?: ServiceDeliveryStatus;
  briefs: any[];
  documents: any[];
  docConfigs: any[];
  generatingBrief: boolean;
  generatingDocs: boolean;
  onGenerateBrief: () => void;
  onGenerateDocuments: () => void;
  intakeSubmitted: boolean;
}) {
  const [expanded, setExpanded] = useState(false);

  const serviceId = purchasedService.service_id;
  const serviceName = service?.name ?? serviceId;
  const serviceDesc = service?.description ?? '';
  const isSubscription = service?.mode === 'subscription';

  // Delivery status
  const deliveryStatus = status?.deliveryStatus ?? 'not_started';
  const intakeComplete = status?.intakeComplete ?? false;
  const docsReady = status?.documentsReady ?? 0;
  const docsTotal = status?.documentsTotal ?? 0;

  const statusConfig: Record<string, { color: string; bg: string; label: string; icon: any }> = {
    not_started: { color: 'text-gray-600', bg: 'bg-gray-100', label: 'Not Started', icon: Clock },
    in_progress: { color: 'text-amber-700', bg: 'bg-amber-50', label: 'In Progress', icon: RefreshCw },
    delivered: { color: 'text-green-700', bg: 'bg-green-50', label: 'Delivered', icon: CheckCircle2 },
  };
  const sc = statusConfig[deliveryStatus] || statusConfig.not_started;
  const StatusIcon = sc.icon;

  // Brief status
  const latestBrief = briefs[briefs.length - 1];
  const briefStatus = latestBrief?.status;

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Card Header */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="bg-[#FAFBFC] rounded-lg p-2.5 shrink-0">
              <Package size={20} className="text-[#1B3F7A]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h4 className="font-inter font-semibold text-gray-900 text-base">
                  {serviceName}
                </h4>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-inter font-medium ${sc.bg} ${sc.color}`}>
                  <StatusIcon size={11} className={deliveryStatus === 'in_progress' ? 'animate-spin' : ''} />
                  {sc.label}
                </span>
                {isSubscription && purchasedService.status === 'active' && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-teal-50 text-teal-700 rounded text-xs font-inter font-medium">
                    <RefreshCw size={10} />
                    Active
                  </span>
                )}
              </div>
              <p className="font-inter text-gray-500 text-xs">{serviceDesc}</p>

              {/* Progress metrics */}
              {docsTotal > 0 && (
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-1.5">
                    <span className="font-inter text-gray-600 text-xs">Intake:</span>
                    <span className={`font-inter text-xs font-medium ${intakeComplete ? 'text-green-700' : 'text-amber-700'}`}>
                      {intakeComplete ? 'Complete' : 'Pending'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-inter text-gray-600 text-xs">Brief:</span>
                    <span className={`font-inter text-xs font-medium ${
                      briefStatus === 'completed' ? 'text-green-700'
                      : briefStatus === 'generating' ? 'text-blue-600'
                      : briefStatus === 'failed' ? 'text-red-600'
                      : 'text-gray-500'
                    }`}>
                      {briefStatus === 'completed' ? 'Generated'
                        : briefStatus === 'generating' ? 'Generating...'
                        : briefStatus === 'failed' ? 'Failed'
                        : 'Not generated'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-inter text-gray-600 text-xs">Documents:</span>
                    <span className="font-inter text-xs font-medium text-gray-900">{docsReady}/{docsTotal}</span>
                  </div>
                </div>
              )}

              {/* Subscription details */}
              {isSubscription && purchasedService.next_billing_date && (
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={12} className="text-gray-400" />
                    <span className="font-inter text-gray-600 text-xs">Next billing:</span>
                    <span className="font-inter text-xs font-medium text-gray-900">
                      {new Date(purchasedService.next_billing_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
            {!isSubscription && (
              <>
                <button
                  onClick={onGenerateBrief}
                  disabled={generatingBrief || !intakeSubmitted}
                  title={!intakeSubmitted ? 'Intake must be submitted first' : `Generate brief for ${serviceName}`}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-inter font-medium transition-all ${
                    generatingBrief
                      ? 'bg-blue-100 text-blue-600 cursor-wait'
                      : intakeSubmitted
                        ? 'bg-[#1B3F7A] hover:bg-[#2C68C4] text-white'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {generatingBrief ? (
                    <>
                      <RefreshCw size={13} className="animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Briefcase size={13} />
                      Generate Brief
                    </>
                  )}
                </button>
                {docsTotal > 0 && (
                  <button
                    onClick={onGenerateDocuments}
                    disabled={generatingDocs || !intakeSubmitted}
                    title={!intakeSubmitted ? 'Intake must be submitted first' : `Generate all ${docsTotal} documents for ${serviceName}`}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-inter font-medium transition-all ${
                      generatingDocs
                        ? 'bg-blue-100 text-blue-600 cursor-wait'
                        : intakeSubmitted
                          ? 'bg-[#1B3F7A] hover:bg-[#2C68C4] text-white'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {generatingDocs ? (
                      <>
                        <RefreshCw size={13} className="animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <FileText size={13} />
                        Generate Docs ({docsTotal})
                      </>
                    )}
                  </button>
                )}
              </>
            )}
            <button
              onClick={() => setExpanded(!expanded)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded text-xs font-inter font-medium transition-colors"
            >
              {expanded ? 'Close' : 'Details'}
            </button>
          </div>
        </div>
      </div>

      {/* Expanded: Document List */}
      {expanded && docConfigs.length > 0 && (
        <div className="border-t border-gray-200 bg-[#FAFBFC] p-5">
          <h5 className="font-inter font-semibold text-gray-700 text-xs uppercase tracking-wide mb-3">
            Documents for {serviceName}
          </h5>
          <div className="space-y-2">
            {docConfigs.map(config => {
              const doc = documents.find((d: any) => d.document_type === config.document_type);
              const docStatus = doc?.status || 'pending';
              const isDelivered = doc?.delivered_to_client;

              const statusStyles: Record<string, { color: string; bg: string; label: string }> = {
                pending: { color: 'text-gray-500', bg: 'bg-gray-100', label: 'Pending' },
                generating: { color: 'text-blue-600', bg: 'bg-blue-50', label: 'Generating' },
                completed: { color: 'text-green-600', bg: 'bg-green-50', label: 'Complete' },
                failed: { color: 'text-red-600', bg: 'bg-red-50', label: 'Failed' },
              };
              const ds = statusStyles[docStatus] || statusStyles.pending;

              return (
                <div key={config.document_type} className="flex items-center justify-between bg-white rounded-lg border border-gray-200 px-4 py-2.5">
                  <div className="flex items-center gap-3">
                    <FileText size={14} className="text-gray-400 shrink-0" />
                    <div>
                      <p className="font-inter text-sm text-gray-900">{config.document_label}</p>
                      <p className="font-inter text-xs text-gray-500">{config.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-inter font-medium ${ds.bg} ${ds.color}`}>
                      {ds.label}
                    </span>
                    {isDelivered && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-inter font-medium bg-blue-50 text-blue-600">
                        <CheckCircle2 size={10} />
                        Delivered
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Brief details */}
          {briefs.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h5 className="font-inter font-semibold text-gray-700 text-xs uppercase tracking-wide mb-3">
                Briefs
              </h5>
              {briefs.map((brief: any) => {
                const briefStatusConfig: Record<string, { color: string; bg: string; label: string }> = {
                  pending: { color: 'text-gray-600', bg: 'bg-gray-100', label: 'Pending' },
                  generating: { color: 'text-blue-600', bg: 'bg-blue-50', label: 'Generating' },
                  completed: { color: 'text-green-600', bg: 'bg-green-50', label: 'Completed' },
                  failed: { color: 'text-red-600', bg: 'bg-red-50', label: 'Failed' },
                };
                const bs = briefStatusConfig[brief.status] || briefStatusConfig.pending;

                return (
                  <div key={brief.id} className="flex items-center justify-between bg-white rounded-lg border border-gray-200 px-4 py-2.5 mb-2">
                    <div className="flex items-center gap-3">
                      <Briefcase size={14} className="text-gray-400 shrink-0" />
                      <div>
                        <p className="font-inter text-sm text-gray-900">
                          {brief.service_id ? getServiceById(brief.service_id)?.name ?? brief.service_id : 'Comprehensive Brief'}
                        </p>
                        {brief.generated_at && (
                          <p className="font-inter text-xs text-gray-500">
                            Generated: {new Date(brief.generated_at).toLocaleDateString('en-GB')}
                            {brief.model_used && ` — ${brief.model_used}`}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-inter font-medium ${bs.bg} ${bs.color}`}>
                        {bs.label}
                      </span>
                      {brief.risk_level && (
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-inter font-medium ${
                          brief.risk_level === 'High' ? 'bg-red-50 text-red-600'
                          : brief.risk_level === 'Medium' ? 'bg-amber-50 text-amber-600'
                          : 'bg-green-50 text-green-600'
                        }`}>
                          {brief.risk_level}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
