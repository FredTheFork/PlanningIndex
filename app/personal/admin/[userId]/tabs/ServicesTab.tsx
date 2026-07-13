'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';
import {
  Package, FileText, Briefcase, Clock, CheckCircle2, AlertCircle,
  RefreshCw, Calendar, Zap, Copy, Save, ChevronDown, ChevronUp,
  Globe, Link2, Upload, Send, Instagram, Linkedin, Facebook, Twitter,
  Video, Image as ImageIcon
} from 'lucide-react';
import { getServiceById } from '@/lib/services/service-catalog';
import { getDocumentTypesForService } from '@/lib/services/document-service-map';
import { getDocumentConfigsForService } from '@/lib/services/document-configs';
import { getServiceDeliveryStatuses } from '@/lib/services/service-status';
import type { ServiceDeliveryStatus } from '@/lib/services/service-status';
import { useAdminToast } from '@/hooks/useAdminToast';
import { ServicesTabSkeleton } from '@/components/admin/skeletons/AdminTabSkeletons';
import { briefGenerationLimiter } from '@/lib/admin/rate-limiter';
import { logActivity } from '@/lib/admin/activity-log';
import { useAuth } from '@/hooks/useAuth';

interface ServicesTabProps {
  userId: string;
  data: any;
  refreshData: () => void;
  showToast?: (params: { message: string; type: 'success' | 'error' | 'info' | 'warning'; retryFn?: () => void }) => void;
}

export default function ServicesTab({ userId, data, refreshData, showToast: externalShowToast }: ServicesTabProps) {
  const [serviceStatuses, setServiceStatuses] = useState<ServiceDeliveryStatus[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [briefs, setBriefs] = useState<any[]>([]);
  const [websiteDelivery, setWebsiteDelivery] = useState<any>(null);
  const [socialPosts, setSocialPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatingBrief, setGeneratingBrief] = useState<string | null>(null);
  const { user } = useAuth();
  const { showToast: localShowToast } = useAdminToast();
  const showToast = externalShowToast || localShowToast;

  useEffect(() => {
    fetchServiceData();
  }, [userId, data]);

  const fetchServiceData = async () => {
    setLoading(true);

    const [docsRes, briefsRes, webRes, postsRes] = await Promise.all([
      supabase.from('generated_documents').select('*').eq('client_id', userId),
      supabase.from('client_briefs').select('*').eq('client_id', userId),
      supabase.from('website_deliveries').select('*').eq('user_id', userId).maybeSingle(),
      supabase.from('social_media_posts').select('*').eq('user_id', userId).order('post_number', { ascending: true }),
    ]);

    const docs = docsRes.data || [];
    const briefsData = briefsRes.data || [];

    setDocuments(docs);
    setBriefs(briefsData);
    setWebsiteDelivery(webRes.data || null);
    setSocialPosts(postsRes.data || []);

    const purchasedServiceIds = data.purchasedServices?.map((ps: any) => ps.service_id) || [];
    const intakeCompleteForServices = data.profile?.intake_complete_for_services || [];

    if (purchasedServiceIds.length > 0) {
      const statuses = getServiceDeliveryStatuses({
        purchasedServiceIds,
        intakeCompleteForServices,
        documents: docs.map((d: any) => ({
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

  const handleSaveBrief = async (briefId: string, content: string) => {
    const { error } = await supabase
      .from('client_briefs')
      .update({ brief_content: content })
      .eq('id', briefId);
    if (error) {
      showToast({ message: 'Failed to save brief: ' + error.message, type: 'error' });
    } else {
      showToast({ message: 'Brief saved successfully', type: 'success' });
      await fetchServiceData();
    }
  };

  const handleGenerateBrief = async (serviceId: string) => {
    if (!data.profile?.has_submitted_intake) {
      showToast({ message: 'Client must submit intake form first', type: 'warning' });
      return;
    }

    if (!briefGenerationLimiter.consume()) {
      const waitSec = Math.ceil(briefGenerationLimiter.getWaitTimeMs() / 1000);
      showToast({ message: `Please wait ${waitSec}s before generating another brief.`, type: 'warning', duration: 4000 });
      return;
    }

    setGeneratingBrief(serviceId);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) throw new Error('Not authenticated');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/generate-brief`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ user_id: userId, service_id: serviceId }),
        }
      );

      let result: any;
      try {
        result = await response.json();
      } catch {
        result = { error: response.status === 404 ? 'Service starting up — please wait 30 seconds and try again.' : `Server returned ${response.status} with non-JSON body` };
      }

      if (response.ok && result.success) {
        showToast({ message: `Brief generated for ${getServiceById(serviceId)?.name ?? serviceId}`, type: 'success' });
        if (user) {
          logActivity({ adminId: user?.id || '', adminEmail: user?.email || '', clientId: userId, actionType: 'brief_generated', actionLabel: `Generated brief for ${getServiceById(serviceId)?.name ?? serviceId}`, metadata: { serviceId } });
        }
        await fetchServiceData();
        refreshData();
      } else {
        const errMsg = result.error || result.message || 'Failed to generate brief';
        showToast({ message: errMsg, type: 'error', retryFn: () => handleGenerateBrief(serviceId) });
      }
    } catch (error: any) {
      showToast({ message: error.message || 'Network error generating brief.', type: 'error', retryFn: () => handleGenerateBrief(serviceId) });
    } finally {
      setGeneratingBrief(null);
    }
  };

  if (loading) {
    return <ServicesTabSkeleton />;
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
            onGenerateBrief={() => handleGenerateBrief(ps.service_id)}
            onSaveBrief={handleSaveBrief}
            intakeSubmitted={data.profile?.has_submitted_intake}
            websiteDelivery={websiteDelivery}
            socialPosts={socialPosts}
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
  onGenerateBrief,
  onSaveBrief,
  intakeSubmitted,
  websiteDelivery,
  socialPosts,
}: {
  purchasedService: any;
  service: any;
  status?: ServiceDeliveryStatus;
  briefs: any[];
  documents: any[];
  docConfigs: any[];
  generatingBrief: boolean;
  onGenerateBrief: () => void;
  onSaveBrief: (briefId: string, content: string) => Promise<void>;
  intakeSubmitted: boolean;
  websiteDelivery: any;
  socialPosts: any[];
}) {
  const [expanded, setExpanded] = useState(false);
  const [briefExpanded, setBriefExpanded] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  const serviceId = purchasedService.service_id;
  const serviceName = service?.name ?? serviceId;
  const serviceDesc = service?.description ?? '';
  const isSubscription = service?.mode === 'subscription';
  const isWebsiteService = serviceId === 'website_copy_pack';
  const isSocialService = serviceId === 'social_media_pack';

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
  const briefCompleted = briefStatus === 'completed';

  // Website delivery status
  const websiteHasZip = !!websiteDelivery?.website_zip_path;
  const websiteHasUrl = !!websiteDelivery?.deployment_url;
  const websiteDelivered = !!websiteDelivery?.delivered_at;

  // Social media stats
  const postsDelivered = socialPosts.filter(p => p.delivered_to_client).length;
  const postsGenerated = socialPosts.filter(p => p.status === 'generated' || p.status === 'edited').length;
  const postsWithImages = socialPosts.filter(p => p.image_path).length;
  const postsWithVideos = socialPosts.filter(p => p.video_path).length;
  const postCount = purchasedService.social_media_post_count || 30;

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
              <div className="flex items-center gap-4 mt-3 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <span className="font-inter text-gray-600 text-xs">Intake:</span>
                  <span className={`font-inter text-xs font-medium ${intakeComplete ? 'text-green-700' : 'text-amber-700'}`}>
                    {intakeComplete ? 'Complete' : 'Pending'}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-inter text-gray-600 text-xs">Brief:</span>
                  <span className={`font-inter text-xs font-medium ${
                    briefCompleted ? 'text-green-700'
                    : briefStatus === 'generating' ? 'text-blue-600'
                    : briefStatus === 'failed' ? 'text-red-600'
                    : 'text-gray-500'
                  }`}>
                    {briefCompleted ? 'Generated'
                      : briefStatus === 'generating' ? 'Generating...'
                      : briefStatus === 'failed' ? 'Failed'
                      : 'Not generated'}
                  </span>
                </div>
                {isWebsiteService && (
                  <>
                    <div className="flex items-center gap-1.5">
                      <span className="font-inter text-gray-600 text-xs">Website:</span>
                      <span className={`font-inter text-xs font-medium ${websiteDelivered ? 'text-green-700' : websiteHasUrl ? 'text-blue-600' : 'text-gray-500'}`}>
                        {websiteDelivered ? 'Delivered' : websiteHasUrl ? 'URL Set' : 'Pending'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-inter text-gray-600 text-xs">ZIP:</span>
                      <span className={`font-inter text-xs font-medium ${websiteHasZip ? 'text-green-700' : 'text-gray-500'}`}>
                        {websiteHasZip ? 'Uploaded' : 'Not uploaded'}
                      </span>
                    </div>
                  </>
                )}
                {isSocialService && (
                  <div className="flex items-center gap-1.5">
                    <span className="font-inter text-gray-600 text-xs">Posts:</span>
                    <span className="font-inter text-xs font-medium text-gray-900">
                      {socialPosts.length}/{postCount}
                      {postsDelivered > 0 && <span className="text-green-700 ml-1">({postsDelivered} delivered)</span>}
                    </span>
                  </div>
                )}
                {!isWebsiteService && !isSocialService && docsTotal > 0 && (
                  <div className="flex items-center gap-1.5">
                    <span className="font-inter text-gray-600 text-xs">Documents:</span>
                    <span className="font-inter text-xs font-medium text-gray-900">{docsReady}/{docsTotal}</span>
                  </div>
                )}
              </div>

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
            {!isSubscription && !briefCompleted && (
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

      {/* Expanded Details */}
      {expanded && (
        <div className="border-t border-gray-200 bg-[#FAFBFC] p-5">
          {/* Business Foundations Pack — Document List */}
          {docConfigs.length > 0 && (
            <>
              <h5 className="font-inter font-semibold text-gray-700 text-xs uppercase tracking-wide mb-3">
                Documents for {serviceName}
              </h5>
              <div className="space-y-2 mb-4">
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
            </>
          )}

          {/* Website Copy Pack — Delivery Status */}
          {isWebsiteService && (
            <>
              <h5 className="font-inter font-semibold text-gray-700 text-xs uppercase tracking-wide mb-3">
                Website Delivery Status
              </h5>
              <div className="space-y-2 mb-4">
                {/* Deployment URL */}
                <div className="flex items-center justify-between bg-white rounded-lg border border-gray-200 px-4 py-2.5">
                  <div className="flex items-center gap-3">
                    <Globe size={14} className="text-gray-400 shrink-0" />
                    <div>
                      <p className="font-inter text-sm text-gray-900">Deployment URL</p>
                      <p className="font-inter text-xs text-gray-500">
                        {websiteHasUrl ? websiteDelivery.deployment_url : 'Not configured'}
                      </p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-inter font-medium ${websiteHasUrl ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                    {websiteHasUrl ? 'Set' : 'Pending'}
                  </span>
                </div>

                {/* ZIP Upload */}
                <div className="flex items-center justify-between bg-white rounded-lg border border-gray-200 px-4 py-2.5">
                  <div className="flex items-center gap-3">
                    <Upload size={14} className="text-gray-400 shrink-0" />
                    <div>
                      <p className="font-inter text-sm text-gray-900">Website ZIP</p>
                      <p className="font-inter text-xs text-gray-500">
                        {websiteHasZip ? websiteDelivery.website_zip_path.split('/').pop() : 'Not uploaded'}
                      </p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-inter font-medium ${websiteHasZip ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                    {websiteHasZip ? 'Uploaded' : 'Pending'}
                  </span>
                </div>

                {/* Build Prompt (Internal) */}
                <div className="flex items-center justify-between bg-white rounded-lg border border-gray-200 px-4 py-2.5">
                  <div className="flex items-center gap-3">
                    <Briefcase size={14} className="text-gray-400 shrink-0" />
                    <div>
                      <p className="font-inter text-sm text-gray-900">Build Prompt</p>
                      <p className="font-inter text-xs text-gray-500">
                        {websiteDelivery?.bolt_prompt ? 'Generated (internal)' : 'Not generated'}
                      </p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-inter font-medium ${websiteDelivery?.bolt_prompt ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                    {websiteDelivery?.bolt_prompt ? 'Ready' : 'Pending'}
                  </span>
                </div>

                {/* Delivery Status */}
                <div className="flex items-center justify-between bg-white rounded-lg border border-gray-200 px-4 py-2.5">
                  <div className="flex items-center gap-3">
                    <Send size={14} className="text-gray-400 shrink-0" />
                    <div>
                      <p className="font-inter text-sm text-gray-900">Delivery to Client</p>
                      <p className="font-inter text-xs text-gray-500">
                        {websiteDelivered ? `Delivered ${new Date(websiteDelivery.delivered_at).toLocaleDateString('en-GB')}` : 'Not yet delivered'}
                      </p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-inter font-medium ${websiteDelivered ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                    {websiteDelivered ? 'Delivered' : 'Pending'}
                  </span>
                </div>
              </div>
            </>
          )}

          {/* Social Media Pack — Posts Status */}
          {isSocialService && (
            <>
              <h5 className="font-inter font-semibold text-gray-700 text-xs uppercase tracking-wide mb-3">
                Social Media Posts Status
              </h5>
              <div className="space-y-2 mb-4">
                {/* Posts Generated */}
                <div className="flex items-center justify-between bg-white rounded-lg border border-gray-200 px-4 py-2.5">
                  <div className="flex items-center gap-3">
                    <FileText size={14} className="text-gray-400 shrink-0" />
                    <div>
                      <p className="font-inter text-sm text-gray-900">Posts Generated</p>
                      <p className="font-inter text-xs text-gray-500">{postsGenerated} of {socialPosts.length} posts generated</p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-inter font-medium ${postsGenerated === socialPosts.length && socialPosts.length > 0 ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>
                    {socialPosts.length === 0 ? 'None' : `${postsGenerated}/${socialPosts.length}`}
                  </span>
                </div>

                {/* Images */}
                <div className="flex items-center justify-between bg-white rounded-lg border border-gray-200 px-4 py-2.5">
                  <div className="flex items-center gap-3">
                    <ImageIcon size={14} className="text-gray-400 shrink-0" />
                    <div>
                      <p className="font-inter text-sm text-gray-900">Images Uploaded</p>
                      <p className="font-inter text-xs text-gray-500">{postsWithImages} posts have images</p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-inter font-medium ${postsWithImages > 0 ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                    {postsWithImages}
                  </span>
                </div>

                {/* Videos */}
                <div className="flex items-center justify-between bg-white rounded-lg border border-gray-200 px-4 py-2.5">
                  <div className="flex items-center gap-3">
                    <Video size={14} className="text-gray-400 shrink-0" />
                    <div>
                      <p className="font-inter text-sm text-gray-900">Videos Uploaded</p>
                      <p className="font-inter text-xs text-gray-500">{postsWithVideos} posts have videos</p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-inter font-medium ${postsWithVideos > 0 ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                    {postsWithVideos}
                  </span>
                </div>

                {/* Delivery */}
                <div className="flex items-center justify-between bg-white rounded-lg border border-gray-200 px-4 py-2.5">
                  <div className="flex items-center gap-3">
                    <Send size={14} className="text-gray-400 shrink-0" />
                    <div>
                      <p className="font-inter text-sm text-gray-900">Posts Delivered</p>
                      <p className="font-inter text-xs text-gray-500">{postsDelivered} of {socialPosts.length} delivered to client</p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-inter font-medium ${postsDelivered === socialPosts.length && socialPosts.length > 0 ? 'bg-green-50 text-green-600' : postsDelivered > 0 ? 'bg-amber-50 text-amber-600' : 'bg-gray-100 text-gray-500'}`}>
                    {postsDelivered}/{socialPosts.length}
                  </span>
                </div>
              </div>
            </>
          )}

          {/* Brief details — always shown when expanded and briefs exist */}
          {briefs.length > 0 && (
            <div className={docConfigs.length > 0 || isWebsiteService || isSocialService ? 'mt-4 pt-4 border-t border-gray-200' : ''}>
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
                const isCompleted = brief.status === 'completed';

                return (
                  <div key={brief.id} className="bg-white rounded-lg border border-gray-200 mb-2 overflow-hidden">
                    <div
                      className="flex items-center justify-between px-4 py-2.5 cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => {
                        if (isCompleted && !briefExpanded) {
                          setEditedContent(brief.brief_content || '');
                        }
                        setBriefExpanded(!briefExpanded);
                      }}
                    >
                      <div className="flex items-center gap-3">
                        {isCompleted && (
                          briefExpanded ? <ChevronUp size={14} className="text-gray-400 shrink-0" /> : <ChevronDown size={14} className="text-gray-400 shrink-0" />
                        )}
                        {!isCompleted && <Briefcase size={14} className="text-gray-400 shrink-0" />}
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

                    {/* Editable brief content */}
                    {isCompleted && briefExpanded && (
                      <div className="border-t border-gray-200 px-4 py-3 bg-gray-50">
                        <textarea
                          value={editedContent}
                          onChange={(e) => setEditedContent(e.target.value)}
                          className="w-full min-h-[200px] p-3 bg-white border border-gray-300 rounded-lg font-inter text-sm text-gray-900 leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#1B3F7A] focus:border-transparent resize-y"
                        />
                        <div className="flex items-center gap-2 mt-3 flex-wrap">
                          <button
                            onClick={async () => {
                              setIsSaving(true);
                              await onSaveBrief(brief.id, editedContent);
                              setIsSaving(false);
                            }}
                            disabled={isSaving}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1B3F7A] hover:bg-[#2C68C4] text-white rounded text-xs font-inter font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isSaving ? (
                              <>
                                <RefreshCw size={13} className="animate-spin" />
                                Saving...
                              </>
                            ) : (
                              <>
                                <Save size={13} />
                                Save
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(editedContent || brief.brief_content || '');
                              setCopied(true);
                              setTimeout(() => setCopied(false), 2000);
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 rounded text-xs font-inter font-medium transition-colors"
                          >
                            <Copy size={13} />
                            {copied ? 'Copied!' : 'Copy to Clipboard'}
                          </button>
                          <button
                            onClick={onGenerateBrief}
                            disabled={generatingBrief}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 rounded text-xs font-inter font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {generatingBrief ? (
                              <>
                                <RefreshCw size={13} className="animate-spin" />
                                Regenerating...
                              </>
                            ) : (
                              <>
                                <RefreshCw size={13} />
                                Regenerate
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* No data message when there's nothing to show */}
          {docConfigs.length === 0 && !isWebsiteService && !isSocialService && briefs.length === 0 && (
            <div className="text-center py-6">
              <Package size={24} className="text-gray-300 mx-auto mb-2" />
              <p className="font-inter text-gray-500 text-xs">No detailed status available for this service</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
