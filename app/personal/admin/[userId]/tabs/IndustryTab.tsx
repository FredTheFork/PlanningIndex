'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import JSZip from 'jszip';
import { supabase } from '@/lib/supabase/client';
import {
  Building2, FileText, Download, AlertCircle, CheckCircle2, Clock,
  ChevronDown, ChevronUp, Send, X, FileUp, Info, RefreshCw, Copy,
  AlertTriangle, Briefcase, Save, Layers, Zap, Camera, TrendingUp, HardHat
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { getServiceById, isIndustryService } from '@/lib/services/service-catalog';
import {
  getDocumentConfigsForService,
  getDocumentLabel,
  getDocumentTypesListForService
} from '@/lib/services/document-configs';
import { getDocumentTypesForService } from '@/lib/services/document-service-map';
import { buildFullPrompt } from '@/lib/services/document-prompts';
import { triggerMessageNotification } from '@/app/actions/messaging';
import { useAdminToast } from '@/hooks/useAdminToast';
import { GenericTabSkeleton } from '@/components/admin/skeletons/AdminTabSkeletons';
import { briefGenerationLimiter } from '@/lib/admin/rate-limiter';
import { logActivity } from '@/lib/admin/activity-log';
import { useAuth } from '@/hooks/useAuth';

interface IndustryTabProps {
  userId: string;
  data: any;
  refreshData: () => void;
  showToast?: (params: { message: string; type: 'success' | 'error' | 'info' | 'warning'; retryFn?: () => void }) => void;
}

// Auto-delete urgency helper
function getAutoDeleteUrgency(autoDeleteAt: string | null): { days: number; level: 'none' | 'warning' | 'urgent' } {
  if (!autoDeleteAt) return { days: 0, level: 'none' };
  const diffMs = new Date(autoDeleteAt).getTime() - Date.now();
  const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  if (days <= 0) return { days: 0, level: 'urgent' };
  if (days <= 7) return { days, level: 'urgent' };
  if (days <= 30) return { days, level: 'warning' };
  return { days, level: 'none' };
}

// Get industry-specific icon
function getIndustryIcon(serviceId: string) {
  switch (serviceId) {
    case 'coach_industry_pack':
      return Briefcase;
    case 'photographer_industry_pack':
      return Camera;
    case 'consultant_industry_pack':
      return TrendingUp;
    case 'contractor_industry_pack':
      return HardHat;
    default:
      return Building2;
  }
}

// Main component
export default function IndustryTab({ userId, data, refreshData, showToast: externalShowToast }: IndustryTabProps) {
  const { user } = useAuth();
  const { showToast: localShowToast } = useAdminToast();
  const showToast = externalShowToast || localShowToast;
  const [documents, setDocuments] = useState<Record<string, any>>({});
  const [briefs, setBriefs] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [expandedDoc, setExpandedDoc] = useState<string | null>(null);
  const [uploadingDoc, setUploadingDoc] = useState<string | null>(null);
  const [copiedDocId, setCopiedDocId] = useState<string | null>(null);

  // Bulk operation states
  const [bulkCopying, setBulkCopying] = useState(false);
  const [bulkDelivering, setBulkDelivering] = useState(false);
  const [bulkDownloading, setBulkDownloading] = useState(false);
  const [showConfirmBulkDeliver, setShowConfirmBulkDeliver] = useState(false);

  // Brief generation states
  const [generatingBrief, setGeneratingBrief] = useState<string | null>(null);
  const [generatingAllBriefs, setGeneratingAllBriefs] = useState(false);
  const [generatingProgress, setGeneratingProgress] = useState<{ current: number; total: number; serviceId: string } | null>(null);

  // Brief editing states
  const [editingBriefId, setEditingBriefId] = useState<string | null>(null);
  const [editedBriefContent, setEditedBriefContent] = useState('');
  const [savingBrief, setSavingBrief] = useState(false);

  // Section expansion states - auto-expand if 2 or fewer services
  const industryServices = (data.purchasedServices || []).filter((ps: any) =>
    isIndustryService(ps.service_id)
  );
  const defaultExpanded = industryServices.length <= 2;
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    industryServices.forEach((ps: any) => {
      initial[ps.service_id] = defaultExpanded;
    });
    return initial;
  });

  // Build all industry doc types
  const allIndustryDocTypes: Array<{ id: string; label: string; description: string }> = industryServices.flatMap((ps: any) =>
    getDocumentTypesListForService(ps.service_id)
  );

  useEffect(() => {
    fetchData();
  }, [userId, data]);

  const fetchData = async () => {
    setLoading(true);

    // Fetch documents
    const { data: docs } = await supabase
      .from('generated_documents')
      .select('*')
      .eq('client_id', userId);

    const docsMap: Record<string, any> = {};
    docs?.forEach(doc => {
      docsMap[doc.document_type] = doc;
    });
    setDocuments(docsMap);

    // Fetch briefs for all industry services
    const { data: briefsData } = await supabase
      .from('client_briefs')
      .select('*')
      .eq('client_id', userId);

    const briefsMap: Record<string, any> = {};
    briefsData?.forEach(brief => {
      if (brief.service_id && isIndustryService(brief.service_id)) {
        // Keep latest brief per service
        if (!briefsMap[brief.service_id] || new Date(brief.created_at) > new Date(briefsMap[brief.service_id].created_at)) {
          briefsMap[brief.service_id] = brief;
        }
      }
    });
    setBriefs(briefsMap);
    setLoading(false);
  };



  const handleCopyPrompt = useCallback(async (docTypeId: string, serviceId: string) => {
    const brief = briefs[serviceId];
    const briefContent = brief?.brief_content || '';
    const fullPrompt = buildFullPrompt(docTypeId, briefContent);
    try {
      await navigator.clipboard.writeText(fullPrompt);
      setCopiedDocId(docTypeId);
      setTimeout(() => setCopiedDocId(null), 2000);
    } catch {
      showToast({ message: 'Failed to copy prompt to clipboard', type: 'error' });
    }
  }, [briefs]);

  const handleFileUpload = async (
    docTypeId: string,
    serviceId: string,
    file: File,
    fileKind: 'pdf' | 'docx'
  ) => {
    const docLabel = getDocumentLabel(docTypeId) || docTypeId;
    setUploadingDoc(`${docTypeId}-${fileKind}`);

    try {
      const ext = fileKind === 'pdf' ? 'pdf' : 'docx';
      const storagePath = `${userId}/${docTypeId}.${ext}`;
      const mimeType = fileKind === 'pdf'
        ? 'application/pdf'
        : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

      const { error: uploadError } = await supabase.storage
        .from('generated-documents')
        .upload(storagePath, file, { contentType: mimeType, upsert: true });

      if (uploadError) {
        showToast({ message: `Upload failed: ${uploadError.message}`, type: 'error' });
        return;
      }

      const existing = documents[docTypeId];
      const updatePayload: Record<string, any> = {
        client_id: userId,
        document_type: docTypeId,
        document_label: docLabel,
        status: 'completed',
        generated_at: new Date().toISOString(),
        files_generated_at: new Date().toISOString(),
        error_message: null,
      };

      if (fileKind === 'pdf') updatePayload.pdf_path = storagePath;
      if (fileKind === 'docx') updatePayload.docx_path = storagePath;

      if (existing?.id) {
        await supabase
          .from('generated_documents')
          .update(updatePayload)
          .eq('id', existing.id);
      } else {
        await supabase.from('generated_documents').insert(updatePayload);
      }

      showToast({ message: `${fileKind.toUpperCase()} uploaded for "${docLabel}"`, type: 'success' });
      logActivity({
        adminId: user?.id ?? 'unknown',
        adminEmail: user?.email ?? 'unknown',
        clientId: userId,
        actionType: 'document_uploaded',
        actionLabel: `Uploaded ${fileKind.toUpperCase()} for "${docLabel}"`,
        metadata: { docTypeId, fileKind },
      });
      await fetchData();
      refreshData();
    } catch (err: any) {
      showToast({ message: err.message || 'Upload failed', type: 'error' });
    } finally {
      setUploadingDoc(null);
    }
  };

  const handleDownloadFile = async (filePath: string, fileName: string) => {
    const { data, error } = await supabase.storage
      .from('generated-documents')
      .createSignedUrl(filePath, 3600);

    if (error || !data) {
      showToast({ message: 'Could not generate download link', type: 'error' });
      return;
    }

    const a = document.createElement('a');
    a.href = data.signedUrl;
    a.download = fileName;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Send delivery notification to client
  const sendDeliveryNotification = useCallback(async (docLabel: string) => {
    try {
      const { data: adminRow } = await supabase
        .from('admin_users')
        .select('user_id')
        .limit(1)
        .maybeSingle();

      if (!adminRow?.user_id) return;

      const convId = [adminRow.user_id, userId].sort().join('_');

      const { data: msg } = await supabase
        .from('client_messages')
        .insert({
          conversation_id: convId,
          sender_id: adminRow.user_id,
          recipient_id: userId,
          message_content: `Your document "${docLabel}" is now available for download in your Documents area.`,
          message_type: 'document_delivery',
        })
        .select('*')
        .single();

      if (msg) {
        await triggerMessageNotification(msg);
      }
    } catch (err) {
      console.error('Failed to send delivery notification:', err);
    }
  }, [userId]);

  // Handle single document delivery
  const handleMarkDelivered = async (docId: string, docLabel: string) => {
    const now = new Date();
    const autoDeleteAt = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);

    await supabase
      .from('generated_documents')
      .update({
        delivered_to_client: true,
        delivered_at: now.toISOString(),
        auto_delete_at: autoDeleteAt.toISOString()
      })
      .eq('id', docId);

    await sendDeliveryNotification(docLabel);
    showToast({ message: 'Document marked as delivered', type: 'success' });
    logActivity({
      adminId: user?.id ?? 'unknown',
      adminEmail: user?.email ?? 'unknown',
      clientId: userId,
      actionType: 'documents_delivered',
      actionLabel: `Delivered industry document "${docLabel}"`,
      metadata: { docId },
    });
    await fetchData();
  };

  const handleRemoveFile = async (docTypeId: string, fileKind: 'pdf' | 'docx') => {
    const existing = documents[docTypeId];
    if (!existing?.id) return;

    const fieldKey = fileKind === 'pdf' ? 'pdf_path' : 'docx_path';
    const storagePath = existing[fieldKey];

    if (storagePath) {
      await supabase.storage.from('generated-documents').remove([storagePath]);
    }

    const updatePayload: Record<string, any> = { [fieldKey]: null };
    const otherKey = fileKind === 'pdf' ? 'docx_path' : 'pdf_path';
    if (!existing[otherKey]) {
      updatePayload.status = 'pending';
    }

    await supabase.from('generated_documents').update(updatePayload).eq('id', existing.id);
    showToast({ message: `${fileKind.toUpperCase()} removed`, type: 'info' });
    await fetchData();
    refreshData();
  };

  // Brief generation
  const handleGenerateBrief = async (serviceId: string) => {
    if (!data.profile?.has_submitted_intake) {
      showToast({ message: 'Client must submit intake form first', type: 'error' });
      return;
    }

    if (!briefGenerationLimiter.consume()) {
      const waitMs = briefGenerationLimiter.getWaitTimeMs();
      showToast({
        message: `Rate limit reached — please wait ${Math.ceil(waitMs / 1000)}s before retrying.`,
        type: 'warning',
        retryFn: () => handleGenerateBrief(serviceId),
      });
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
      const result = await response.json().catch(() => ({ error: `HTTP ${response.status}` }));
      if (response.ok && result.success) {
        showToast({ message: `Brief generated for ${getServiceById(serviceId)?.name ?? serviceId}`, type: 'success' });
        logActivity({
          adminId: user?.id ?? 'unknown',
          adminEmail: user?.email ?? 'unknown',
          clientId: userId,
          actionType: 'brief_generated',
          actionLabel: `Generated industry brief for ${getServiceById(serviceId)?.name ?? serviceId}`,
          metadata: { serviceId },
        });
        await fetchData();
        refreshData();
      } else {
        showToast({ message: result.error || 'Failed to generate brief', type: 'error' });
      }
    } catch (err: any) {
      showToast({ message: err.message || 'Error generating brief', type: 'error' });
    } finally {
      setGeneratingBrief(null);
    }
  };

  // Generate all briefs with progress
  const handleGenerateAllBriefs = async () => {
    if (!data.profile?.has_submitted_intake) {
      showToast({ message: 'Client must submit intake form first', type: 'error' });
      return;
    }

    if (!briefGenerationLimiter.consume()) {
      const waitMs = briefGenerationLimiter.getWaitTimeMs();
      showToast({
        message: `Rate limit reached — please wait ${Math.ceil(waitMs / 1000)}s before retrying.`,
        type: 'warning',
        retryFn: handleGenerateAllBriefs,
      });
      return;
    }

    setGeneratingAllBriefs(true);
    setGeneratingProgress({ current: 0, total: industryServices.length, serviceId: '' });

    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) {
      showToast({ message: 'Not authenticated', type: 'error' });
      setGeneratingAllBriefs(false);
      return;
    }

    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < industryServices.length; i++) {
      const ps = industryServices[i];
      setGeneratingProgress({ current: i + 1, total: industryServices.length, serviceId: ps.service_id });

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/generate-brief`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${session?.access_token}`,
            },
            body: JSON.stringify({ user_id: userId, service_id: ps.service_id }),
          }
        );
        const result = await response.json().catch(() => ({}));
        if (response.ok && result.success) {
          successCount++;
        } else {
          failCount++;
        }
      } catch {
        failCount++;
      }
    }

    setGeneratingProgress(null);
    setGeneratingAllBriefs(false);
    await fetchData();
    refreshData();

    if (failCount === 0) {
      showToast({ message: `All ${successCount} industry briefs generated successfully`, type: 'success' });
      logActivity({
        adminId: user?.id ?? 'unknown',
        adminEmail: user?.email ?? 'unknown',
        clientId: userId,
        actionType: 'brief_generated',
        actionLabel: `Generated all ${successCount} industry briefs`,
        metadata: { successCount, failCount },
      });
    } else {
      showToast({ message: `${successCount} briefs generated, ${failCount} failed`, type: 'error' });
    }
  };

  // Save brief edits
  const handleSaveBrief = async (briefId: string) => {
    setSavingBrief(true);
    const { error } = await supabase
      .from('client_briefs')
      .update({ brief_content: editedBriefContent })
      .eq('id', briefId);

    if (error) {
      showToast({ message: 'Failed to save brief', type: 'error' });
    } else {
      showToast({ message: 'Brief saved', type: 'success' });
      logActivity({
        adminId: user?.id ?? 'unknown',
        adminEmail: user?.email ?? 'unknown',
        clientId: userId,
        actionType: 'brief_edited',
        actionLabel: 'Saved industry brief edits',
        metadata: { briefId },
      });
      await fetchData();
      setEditingBriefId(null);
    }
    setSavingBrief(false);
  };

  // Bulk Copy All Prompts
  const handleBulkCopyAllPrompts = async () => {
    setBulkCopying(true);
    try {
      const prompts: string[] = [];

      for (const ps of industryServices) {
        const serviceId = ps.service_id;
        const brief = briefs[serviceId];
        const briefContent = brief?.brief_content || '';
        const docTypes = getDocumentTypesListForService(serviceId);

        for (const docType of docTypes) {
          const prompt = buildFullPrompt(docType.id, briefContent);
          prompts.push(`---\n## ${docType.label}\n\n${prompt}\n\n`);
        }
      }

      await navigator.clipboard.writeText(prompts.join('\n'));
      showToast({ message: `Copied ${allIndustryDocTypes.length} prompts to clipboard`, type: 'success' });
    } catch {
      showToast({ message: 'Failed to copy prompts', type: 'error' });
    } finally {
      setBulkCopying(false);
    }
  };

  // Bulk Mark All Delivered
  const handleBulkMarkDelivered = async () => {
    setBulkDelivering(true);
    try {
      const docsToDeliver = allIndustryDocTypes.filter(docType => {
        const doc = documents[docType.id];
        return doc?.status === 'completed' && (doc.pdf_path || doc.docx_path) && !doc.delivered_to_client;
      });

      if (docsToDeliver.length === 0) {
        showToast({ message: 'No documents ready for delivery', type: 'info' });
        setShowConfirmBulkDeliver(false);
        setBulkDelivering(false);
        return;
      }

      const now = new Date();
      const autoDeleteAt = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);

      for (const docType of docsToDeliver) {
        const doc = documents[docType.id];
        await supabase
          .from('generated_documents')
          .update({
            delivered_to_client: true,
            delivered_at: now.toISOString(),
            auto_delete_at: autoDeleteAt.toISOString()
          })
          .eq('id', doc.id);
      }

      // Send consolidated notification
      const docLabels = docsToDeliver.map(d => d.label);
      let notificationMessage: string;
      if (docLabels.length <= 3) {
        notificationMessage = `Your documents are now available for download: ${docLabels.join(', ')}.`;
      } else {
        notificationMessage = `Your documents are now available for download: ${docLabels.slice(0, 3).join(', ')}, and ${docLabels.length - 3} more.`;
      }

      const { data: adminRow } = await supabase
        .from('admin_users')
        .select('user_id')
        .limit(1)
        .maybeSingle();

      if (adminRow?.user_id) {
        const convId = [adminRow.user_id, userId].sort().join('_');
        const { data: msg } = await supabase
          .from('client_messages')
          .insert({
            conversation_id: convId,
            sender_id: adminRow.user_id,
            recipient_id: userId,
            message_content: notificationMessage,
            message_type: 'document_delivery',
          })
          .select('*')
          .single();

        if (msg) {
          await triggerMessageNotification(msg);
        }
      }

      showToast({ message: `Delivered ${docsToDeliver.length} documents to client`, type: 'success' });
      logActivity({
        adminId: user?.id ?? 'unknown',
        adminEmail: user?.email ?? 'unknown',
        clientId: userId,
        actionType: 'documents_delivered',
        actionLabel: `Bulk delivered ${docsToDeliver.length} industry documents`,
        metadata: { documentCount: docsToDeliver.length },
      });
      setShowConfirmBulkDeliver(false);
      await fetchData();
    } catch (err: any) {
      showToast({ message: err.message || 'Failed to deliver documents', type: 'error' });
    } finally {
      setBulkDelivering(false);
    }
  };

  // Bulk Download All as ZIP with folder structure by service
  const handleBulkDownloadZip = async () => {
    setBulkDownloading(true);
    try {
      const zip = new JSZip();
      let successCount = 0;
      let failCount = 0;

      for (const ps of industryServices) {
        const serviceId = ps.service_id;
        const service = getServiceById(serviceId);
        const folderName = service?.name?.replace(/[^a-z0-9]/gi, '_') || serviceId;
        const folder = zip.folder(folderName);

        if (!folder) continue;

        const docTypes = getDocumentTypesListForService(serviceId);

        for (const docType of docTypes) {
          const doc = documents[docType.id];

          if (doc?.pdf_path) {
            try {
              const { data, error } = await supabase.storage
                .from('generated-documents')
                .createSignedUrl(doc.pdf_path, 3600);

              if (!error && data) {
                const response = await fetch(data.signedUrl);
                if (response.ok) {
                  const blob = await response.blob();
                  folder.file(`${docType.label}.pdf`, blob);
                  successCount++;
                } else {
                  failCount++;
                }
              } else {
                failCount++;
              }
            } catch {
              failCount++;
            }
          }

          if (doc?.docx_path) {
            try {
              const { data, error } = await supabase.storage
                .from('generated-documents')
                .createSignedUrl(doc.docx_path, 3600);

              if (!error && data) {
                const response = await fetch(data.signedUrl);
                if (response.ok) {
                  const blob = await response.blob();
                  folder.file(`${docType.label}.docx`, blob);
                  successCount++;
                } else {
                  failCount++;
                }
              } else {
                failCount++;
              }
            } catch {
              failCount++;
            }
          }
        }
      }

      if (successCount === 0) {
        showToast({ message: 'No files available to download', type: 'info' });
        setBulkDownloading(false);
        return;
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${userId.substring(0, 8)}_industry_documents.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      if (failCount > 0) {
        showToast({ message: `Downloaded ${successCount} files (${failCount} failed)`, type: 'info' });
      } else {
        showToast({ message: `Downloaded ${successCount} files as ZIP`, type: 'success' });
      }
    } catch (err: any) {
      showToast({ message: err.message || 'Failed to create ZIP', type: 'error' });
    } finally {
      setBulkDownloading(false);
    }
  };

  const toggleSection = (serviceId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [serviceId]: !prev[serviceId]
    }));
  };

  if (loading) {
    return <GenericTabSkeleton rows={6} />;
  }

  if (industryServices.length === 0) {
    return (
      <div className="text-center py-12">
        <Building2 size={48} className="text-gray-300 mx-auto mb-4" />
        <p className="font-inter text-gray-600 text-sm">No industry packs purchased.</p>
      </div>
    );
  }

  // Calculate progress
  const completedCount = Object.values(documents).filter((d: any) => d.status === 'completed').length;
  const deliveredCount = Object.values(documents).filter((d: any) => d.delivered_to_client).length;
  const totalDocCount = allIndustryDocTypes.length;
  const deliveryPercentage = totalDocCount > 0 ? Math.round((deliveredCount / totalDocCount) * 100) : 0;

  let progressColor = 'bg-gray-300';
  if (deliveryPercentage >= 80) progressColor = 'bg-green-500';
  else if (deliveryPercentage >= 40) progressColor = 'bg-amber-500';
  else if (deliveryPercentage > 0) progressColor = 'bg-red-500';

  // Documents ready for bulk delivery
  const docsReadyForDelivery = allIndustryDocTypes.filter(docType => {
    const doc = documents[docType.id];
    return doc?.status === 'completed' && (doc.pdf_path || doc.docx_path) && !doc.delivered_to_client;
  });

  // Files uploaded count
  const filesUploaded = allIndustryDocTypes.filter(docType => {
    const doc = documents[docType.id];
    return doc?.pdf_path || doc?.docx_path;
  }).length;

  // Brief status counts
  const briefsGenerated = Object.values(briefs).filter((b: any) => b?.status === 'completed').length;
  const totalServices = industryServices.length;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-inter font-bold text-[#1B3F7A] text-xl mb-1">
              Industry Pack Documents
            </h3>
            <p className="font-inter text-gray-500 text-sm">
              {totalServices} industry packs | {totalDocCount} total documents
            </p>

            {/* Brief status indicator */}
            <div className="flex items-center gap-2 mt-2">
              <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-inter font-medium ${
                briefsGenerated === totalServices
                  ? 'bg-green-50 text-green-700'
                  : briefsGenerated > 0
                    ? 'bg-amber-50 text-amber-700'
                    : 'bg-gray-100 text-gray-600'
              }`}>
                <Briefcase size={12} />
                {briefsGenerated}/{totalServices} briefs generated
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6 text-sm shrink-0">
            <div className="text-center">
              <div className="font-inter font-bold text-2xl text-green-600">{completedCount}</div>
              <div className="font-inter text-gray-500 text-xs flex items-center justify-center gap-1">
                <CheckCircle2 size={10} />
                Complete
              </div>
            </div>
            <div className="text-center">
              <div className="font-inter font-bold text-2xl text-blue-600">{deliveredCount}</div>
              <div className="font-inter text-gray-500 text-xs flex items-center justify-center gap-1">
                <Send size={10} />
                Delivered
              </div>
            </div>
            <div className="text-center">
              <div className="font-inter font-bold text-2xl text-gray-500">{totalDocCount - completedCount}</div>
              <div className="font-inter text-gray-500 text-xs flex items-center justify-center gap-1">
                <Clock size={10} />
                Pending
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-inter text-xs text-gray-600">Delivery Progress</span>
            <span className="font-inter text-xs font-medium text-gray-700">
              {deliveredCount} of {totalDocCount} delivered ({deliveryPercentage}%)
            </span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full ${progressColor} transition-all duration-500 ease-out rounded-full`}
              style={{ width: `${deliveryPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Bulk Actions Toolbar */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers size={16} className="text-teal-600" />
            <span className="font-inter font-medium text-sm text-gray-700">Bulk Actions</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {/* Generate All Briefs */}
            <button
              onClick={handleGenerateAllBriefs}
              disabled={generatingAllBriefs || !data.profile?.has_submitted_intake}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 hover:bg-teal-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded text-xs font-inter font-medium transition-colors"
              title={!data.profile?.has_submitted_intake ? 'Intake must be submitted first' : ''}
            >
              {generatingAllBriefs ? (
                <>
                  <RefreshCw size={13} className="animate-spin" />
                  {generatingProgress ? `${generatingProgress.current}/${generatingProgress.total}` : '...'}
                </>
              ) : (
                <>
                  <Zap size={13} />
                  Generate All Briefs
                  <span className="bg-white/20 rounded px-1">{totalServices}</span>
                </>
              )}
            </button>

            {/* Copy All Prompts */}
            <button
              onClick={handleBulkCopyAllPrompts}
              disabled={bulkCopying}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1B3F7A] hover:bg-[#2C68C4] disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded text-xs font-inter font-medium transition-colors"
            >
              {bulkCopying ? (
                <>
                  <RefreshCw size={13} className="animate-spin" />
                  Copying...
                </>
              ) : (
                <>
                  <Copy size={13} />
                  Copy All Prompts
                  <span className="bg-white/20 rounded px-1">{totalDocCount}</span>
                </>
              )}
            </button>

            {/* Mark All Delivered */}
            <button
              onClick={() => setShowConfirmBulkDeliver(true)}
              disabled={bulkDelivering || docsReadyForDelivery.length === 0}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded text-xs font-inter font-medium transition-colors"
              title={docsReadyForDelivery.length === 0 ? 'No completed documents with files ready for delivery' : ''}
            >
              {bulkDelivering ? (
                <>
                  <RefreshCw size={13} className="animate-spin" />
                  Delivering...
                </>
              ) : (
                <>
                  <Send size={13} />
                  Mark All Delivered
                  {docsReadyForDelivery.length > 0 && (
                    <span className="bg-white/20 rounded px-1">{docsReadyForDelivery.length}</span>
                  )}
                </>
              )}
            </button>

            {/* Download All as ZIP */}
            <button
              onClick={handleBulkDownloadZip}
              disabled={bulkDownloading || filesUploaded === 0}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded text-xs font-inter font-medium transition-colors"
              title={filesUploaded === 0 ? 'No files uploaded' : ''}
            >
              {bulkDownloading ? (
                <>
                  <RefreshCw size={13} className="animate-spin" />
                  Downloading...
                </>
              ) : (
                <>
                  <Download size={13} />
                  Download All as ZIP
                  {filesUploaded > 0 && (
                    <span className="bg-white/20 rounded px-1">{filesUploaded}</span>
                  )}
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Deliver Confirmation Dialog */}
      {showConfirmBulkDeliver && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <h4 className="font-inter font-bold text-gray-900 text-lg mb-2">
              Mark All Completed Documents as Delivered?
            </h4>
            <p className="font-inter text-gray-600 text-sm mb-4">
              This will deliver {docsReadyForDelivery.length} completed documents with files to the client.
              They will receive a single notification listing all delivered documents.
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setShowConfirmBulkDeliver(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-sm font-inter font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkMarkDelivered}
                disabled={bulkDelivering}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded text-sm font-inter font-medium transition-colors flex items-center gap-2"
              >
                {bulkDelivering && <RefreshCw size={14} className="animate-spin" />}
                Confirm Delivery
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Service Sections */}
      {industryServices.map((ps: any) => {
        const serviceId = ps.service_id;
        const service = getServiceById(serviceId);
        const docTypes = getDocumentTypesListForService(serviceId);
        const brief = briefs[serviceId];
        const isExpanded = expandedSections[serviceId] ?? false;
        const IndustryIcon = getIndustryIcon(serviceId);

        return (
          <IndustryServiceSection
            key={ps.id}
            serviceId={serviceId}
            service={service}
            docTypes={docTypes}
            documents={documents}
            brief={brief}
            isExpanded={isExpanded}
            expandedDoc={expandedDoc}
            uploadingDoc={uploadingDoc}
            copiedDocId={copiedDocId}
            generatingBrief={generatingBrief === serviceId}
            editingBriefId={editingBriefId}
            editedBriefContent={editedBriefContent}
            savingBrief={savingBrief}
            intakeSubmitted={!!data.profile?.has_submitted_intake}
            IndustryIcon={IndustryIcon}
            onToggleSection={() => toggleSection(serviceId)}
            onGenerateBrief={() => handleGenerateBrief(serviceId)}
            onStartEditBrief={(id, content) => {
              setEditingBriefId(id);
              setEditedBriefContent(content);
            }}
            onSaveBrief={handleSaveBrief}
            onCancelEditBrief={() => setEditingBriefId(null)}
            onEditedBriefContentChange={setEditedBriefContent}
            onToggleExpandDoc={(docId) => setExpandedDoc(expandedDoc === docId ? null : docId)}
            onCopyPrompt={(docTypeId) => handleCopyPrompt(docTypeId, serviceId)}
            onUploadFile={(docTypeId, file, kind) => handleFileUpload(docTypeId, serviceId, file, kind)}
            onDownload={handleDownloadFile}
            onMarkDelivered={handleMarkDelivered}
            onRemoveFile={handleRemoveFile}
          />
        );
      })}
    </div>
  );
}

// Service Section Component
function IndustryServiceSection({
  serviceId,
  service,
  docTypes,
  documents,
  brief,
  isExpanded,
  expandedDoc,
  uploadingDoc,
  copiedDocId,
  generatingBrief,
  editingBriefId,
  editedBriefContent,
  savingBrief,
  intakeSubmitted,
  IndustryIcon,
  onToggleSection,
  onGenerateBrief,
  onStartEditBrief,
  onSaveBrief,
  onCancelEditBrief,
  onEditedBriefContentChange,
  onToggleExpandDoc,
  onCopyPrompt,
  onUploadFile,
  onDownload,
  onMarkDelivered,
  onRemoveFile,
}: {
  serviceId: string;
  service: any;
  docTypes: Array<{ id: string; label: string; description: string }>;
  documents: Record<string, any>;
  brief: any;
  isExpanded: boolean;
  expandedDoc: string | null;
  uploadingDoc: string | null;
  copiedDocId: string | null;
  generatingBrief: boolean;
  editingBriefId: string | null;
  editedBriefContent: string;
  savingBrief: boolean;
  intakeSubmitted: boolean;
  IndustryIcon: LucideIcon;
  onToggleSection: () => void;
  onGenerateBrief: () => void;
  onStartEditBrief: (id: string, content: string) => void;
  onSaveBrief: (id: string) => void;
  onCancelEditBrief: () => void;
  onEditedBriefContentChange: (content: string) => void;
  onToggleExpandDoc: (docId: string) => void;
  onCopyPrompt: (docTypeId: string) => void;
  onUploadFile: (docTypeId: string, file: File, kind: 'pdf' | 'docx') => void;
  onDownload: (path: string, name: string) => void;
  onMarkDelivered: (docId: string, docLabel: string) => void;
  onRemoveFile: (docTypeId: string, kind: 'pdf' | 'docx') => void;
}) {
  const serviceDocs = docTypes.map(dt => ({
    ...dt,
    doc: documents[dt.id]
  }));

  const docsCompleted = serviceDocs.filter(sd => sd.doc?.status === 'completed').length;
  const docsDelivered = serviceDocs.filter(sd => sd.doc?.delivered_to_client).length;
  const briefComplete = brief?.status === 'completed';

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Section Header */}
      <div
        className="p-4 border-b border-gray-100 flex items-center justify-between gap-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={onToggleSection}
      >
        <div className="flex items-center gap-3">
          <div className="bg-teal-50 rounded-lg p-2 shrink-0">
            <IndustryIcon size={18} className="text-teal-600" />
          </div>
          <div>
            <p className="font-inter font-semibold text-gray-900 text-sm">
              {service?.name ?? serviceId}
            </p>
            <div className="flex items-center gap-3 mt-1">
              <span className="font-inter text-xs text-gray-500">
                Docs: {docsDelivered}/{docTypes.length} delivered
              </span>
              <span className={`font-inter text-xs font-medium ${
                briefComplete ? 'text-green-700' :
                brief?.status === 'generating' ? 'text-blue-600' :
                'text-gray-500'
              }`}>
                Brief: {briefComplete ? 'Generated' : brief?.status === 'generating' ? 'Generating...' : 'Not generated'}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
          {!briefComplete && (
            <button
              onClick={onGenerateBrief}
              disabled={generatingBrief || !intakeSubmitted}
              title={!intakeSubmitted ? 'Intake must be submitted first' : undefined}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-inter font-medium transition-all shrink-0 ${
                generatingBrief ? 'bg-blue-100 text-blue-600 cursor-wait'
                : intakeSubmitted ? 'bg-teal-600 hover:bg-teal-700 text-white'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              {generatingBrief ? (
                <><RefreshCw size={13} className="animate-spin" />Generating...</>
              ) : (
                <><Briefcase size={13} />Generate Brief</>
              )}
            </button>
          )}
          <div className="p-1.5 hover:bg-gray-100 rounded transition-colors">
            {isExpanded ? <ChevronUp size={16} className="text-gray-500" /> : <ChevronDown size={16} className="text-gray-500" />}
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-gray-100">
          {/* Brief Section */}
          {brief && (
            <div className="p-4 bg-[#FAFBFC] border-b border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Briefcase size={14} className="text-gray-400" />
                  <span className="font-inter text-sm font-medium text-gray-700">Service Brief</span>
                  {brief.generated_at && (
                    <span className="font-inter text-xs text-gray-500">
                      {new Date(brief.generated_at).toLocaleDateString('en-GB')}
                      {brief.model_used && ` - ${brief.model_used}`}
                    </span>
                  )}
                </div>
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-inter font-medium ${
                  briefComplete ? 'bg-green-50 text-green-700' :
                  brief.status === 'generating' ? 'bg-blue-50 text-blue-600' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {briefComplete ? 'Completed' : brief.status === 'generating' ? 'Generating' : brief.status}
                </span>
              </div>

              {editingBriefId === brief.id ? (
                <div className="space-y-2">
                  <textarea
                    value={editedBriefContent}
                    onChange={(e) => onEditedBriefContentChange(e.target.value)}
                    className="w-full min-h-[180px] p-3 bg-white border border-gray-300 rounded-lg font-inter text-sm text-gray-900 leading-relaxed focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-y"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSaveBrief(brief.id)}
                      disabled={savingBrief}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded text-xs font-inter font-medium transition-colors disabled:opacity-50"
                    >
                      {savingBrief ? <><RefreshCw size={13} className="animate-spin" />Saving...</> : <><Save size={13} />Save</>}
                    </button>
                    <button
                      onClick={onCancelEditBrief}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 rounded text-xs font-inter font-medium transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                briefComplete && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onStartEditBrief(brief.id, brief.brief_content || '')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 rounded text-xs font-inter font-medium transition-colors"
                    >
                      <FileText size={13} />
                      View/Edit Brief
                    </button>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(brief.brief_content || '');
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 rounded text-xs font-inter font-medium transition-colors"
                    >
                      <Copy size={13} />
                      Copy Brief
                    </button>
                    <button
                      onClick={onGenerateBrief}
                      disabled={generatingBrief}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 rounded text-xs font-inter font-medium transition-colors disabled:opacity-50"
                    >
                      <RefreshCw size={13} className={generatingBrief ? 'animate-spin' : ''} />
                      Regenerate
                    </button>
                  </div>
                )
              )}
            </div>
          )}

          {/* Document Cards */}
          <div className="divide-y divide-gray-100">
            {docTypes.map(docType => {
              const doc = documents[docType.id];
              const isDocExpanded = expandedDoc === docType.id;
              const isUploadingPdf = uploadingDoc === `${docType.id}-pdf`;
              const isUploadingDocx = uploadingDoc === `${docType.id}-docx`;

              return (
                <IndustryDocumentCard
                  key={docType.id}
                  docType={docType}
                  doc={doc}
                  isExpanded={isDocExpanded}
                  isUploadingPdf={isUploadingPdf}
                  isUploadingDocx={isUploadingDocx}
                  copiedDocId={copiedDocId}
                  onToggleExpand={() => onToggleExpandDoc(docType.id)}
                  onCopyPrompt={() => onCopyPrompt(docType.id)}
                  onUploadFile={(file, kind) => onUploadFile(docType.id, file, kind)}
                  onDownload={onDownload}
                  onMarkDelivered={() => doc && onMarkDelivered(doc.id, docType.label)}
                  onRemoveFile={(kind) => onRemoveFile(docType.id, kind)}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// Document Card Component
function IndustryDocumentCard({
  docType,
  doc,
  isExpanded,
  isUploadingPdf,
  isUploadingDocx,
  copiedDocId,
  onToggleExpand,
  onCopyPrompt,
  onUploadFile,
  onDownload,
  onMarkDelivered,
  onRemoveFile,
}: {
  docType: { id: string; label: string; description: string };
  doc: any;
  isExpanded: boolean;
  isUploadingPdf: boolean;
  isUploadingDocx: boolean;
  copiedDocId: string | null;
  onToggleExpand: () => void;
  onCopyPrompt: () => void;
  onUploadFile: (file: File, kind: 'pdf' | 'docx') => void;
  onDownload: (path: string, name: string) => void;
  onMarkDelivered: () => void;
  onRemoveFile: (kind: 'pdf' | 'docx') => void;
}) {
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const docxInputRef = useRef<HTMLInputElement>(null);

  const status = doc?.status || 'pending';
  const hasPdf = !!doc?.pdf_path;
  const hasDocx = !!doc?.docx_path;
  const hasFiles = hasPdf || hasDocx;
  const isCompleted = status === 'completed';
  const isCopied = copiedDocId === docType.id;

  const autoDelete = getAutoDeleteUrgency(doc?.auto_delete_at);

  const statusConfig: Record<string, { colour: string; bg: string; label: string; icon: React.ReactNode }> = {
    pending:    { colour: 'text-gray-500',  bg: 'bg-gray-100',  label: 'Pending',     icon: <Clock size={11} /> },
    generating: { colour: 'text-blue-600',  bg: 'bg-blue-50',   label: 'In Progress', icon: <RefreshCw size={11} className="animate-spin" /> },
    completed:  { colour: 'text-green-600', bg: 'bg-green-50',  label: 'Complete',    icon: <CheckCircle2 size={11} /> },
    failed:     { colour: 'text-red-600',   bg: 'bg-red-50',    label: 'Failed',      icon: <AlertCircle size={11} /> },
  };

  const s = statusConfig[status] || statusConfig.pending;
  const canDeliver = isCompleted && hasFiles && !doc?.delivered_to_client;

  return (
    <div className={`px-4 py-3 ${isExpanded ? 'bg-[#FAFBFC]' : ''}`}>
      <div className="flex items-center justify-between gap-3">
        {/* Left: icon + name + badges */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="bg-white rounded-lg p-2 shrink-0 border border-gray-100">
            <FileText size={14} className="text-teal-600" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <h4 className="font-inter font-medium text-gray-900 text-sm">{docType.label}</h4>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${s.bg} ${s.colour}`}>
                {s.icon}
                {s.label}
              </span>

              {/* Auto-delete warning badge */}
              {autoDelete.level === 'urgent' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-red-50 text-red-700 border border-red-200">
                  <AlertTriangle size={10} />
                  {autoDelete.days === 0 ? 'Expires today' : `${autoDelete.days} days`}
                </span>
              )}
              {autoDelete.level === 'warning' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                  <Clock size={10} />
                  {autoDelete.days} days
                </span>
              )}

              {doc?.delivered_to_client && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-600">
                  <Send size={10} /> Delivered
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: action buttons */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Copy Prompt */}
          <button
            onClick={onCopyPrompt}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded text-xs font-inter font-medium transition-colors"
          >
            {isCopied ? (
              <>
                <CheckCircle2 size={12} />
                Copied
              </>
            ) : (
              <>
                <Copy size={12} />
                Copy Prompt
              </>
            )}
          </button>

          {/* Manage (expand/collapse) */}
          <button
            onClick={onToggleExpand}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded text-xs font-inter font-medium transition-colors"
          >
            {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            Manage
          </button>
        </div>
      </div>

      {/* Expanded Manage panel */}
      {isExpanded && (
        <div className="mt-3 space-y-3">
          {/* Upload zones */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FileUploadZone
              label="PDF"
              existingPath={doc?.pdf_path}
              existingName={`${docType.label}.pdf`}
              isUploading={isUploadingPdf}
              accept=".pdf,application/pdf"
              inputRef={pdfInputRef}
              onFileSelect={(file) => onUploadFile(file, 'pdf')}
              onDownload={doc?.pdf_path ? () => onDownload(doc.pdf_path, `${docType.label}.pdf`) : undefined}
              onRemove={doc?.pdf_path ? () => onRemoveFile('pdf') : undefined}
            />
            <FileUploadZone
              label="Word (DOCX)"
              existingPath={doc?.docx_path}
              existingName={`${docType.label}.docx`}
              isUploading={isUploadingDocx}
              accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              inputRef={docxInputRef}
              onFileSelect={(file) => onUploadFile(file, 'docx')}
              onDownload={doc?.docx_path ? () => onDownload(doc.docx_path, `${docType.label}.docx`) : undefined}
              onRemove={doc?.docx_path ? () => onRemoveFile('docx') : undefined}
            />
          </div>

          {/* Deliver to client */}
          {isCompleted && (
            <div className="flex items-center gap-2 pt-3 border-t border-gray-200">
              {!doc.delivered_to_client ? (
                canDeliver ? (
                  <button
                    onClick={onMarkDelivered}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-inter font-medium transition-colors"
                  >
                    <Send size={13} />
                    Deliver to Client
                  </button>
                ) : (
                  <span
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-200 text-gray-500 rounded text-xs font-inter font-medium cursor-not-allowed"
                    title="Upload at least one file before delivering"
                  >
                    <Send size={13} />
                    Upload File First
                  </span>
                )
              ) : (
                <div className="flex items-center gap-1.5 text-xs text-green-600 font-inter font-medium">
                  <CheckCircle2 size={13} />
                  Delivered to client
                  {doc.delivered_at && ` on ${new Date(doc.delivered_at).toLocaleDateString('en-GB')}`}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// File Upload Zone Component
function FileUploadZone({
  label,
  existingPath,
  existingName,
  isUploading,
  accept,
  inputRef,
  onFileSelect,
  onDownload,
  onRemove,
}: {
  label: string;
  existingPath: string | null;
  existingName: string;
  isUploading: boolean;
  accept: string;
  inputRef: React.RefObject<HTMLInputElement>;
  onFileSelect: (file: File) => void;
  onDownload?: () => void;
  onRemove?: () => void;
}) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
    e.target.value = '';
  };

  if (existingPath) {
    return (
      <div className="flex items-center justify-between gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2.5">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded bg-green-50 flex items-center justify-center shrink-0">
            <CheckCircle2 size={14} className="text-green-600" />
          </div>
          <div className="min-w-0">
            <p className="font-inter text-xs font-semibold text-gray-800 truncate">{label}</p>
            <p className="font-inter text-xs text-gray-400 truncate">{existingName}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {onDownload && (
            <button
              onClick={onDownload}
              title="Download"
              className="p-1.5 text-gray-500 hover:text-[#1B3F7A] hover:bg-gray-100 rounded transition-colors"
            >
              <Download size={13} />
            </button>
          )}
          <button
            onClick={() => inputRef.current?.click()}
            title="Replace file"
            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
          >
            <RefreshCw size={13} />
          </button>
          {onRemove && (
            <button
              onClick={onRemove}
              title="Remove file"
              className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
            >
              <X size={13} />
            </button>
          )}
        </div>
        <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={handleChange} />
      </div>
    );
  }

  return (
    <div
      onClick={() => !isUploading && inputRef.current?.click()}
      className={`flex flex-col items-center justify-center gap-1.5 border-2 border-dashed rounded-lg px-3 py-4 cursor-pointer transition-colors
        ${isUploading
          ? 'border-blue-300 bg-blue-50 cursor-wait'
          : 'border-gray-300 bg-white hover:border-teal-400 hover:bg-teal-50'
        }`}
    >
      {isUploading ? (
        <>
          <RefreshCw size={16} className="text-blue-500 animate-spin" />
          <p className="font-inter text-xs text-blue-600 font-medium">Uploading...</p>
        </>
      ) : (
        <>
          <FileUp size={16} className="text-gray-400" />
          <p className="font-inter text-xs text-gray-600 font-medium">Upload {label}</p>
          <p className="font-inter text-xs text-gray-400">Click to select file</p>
        </>
      )}
      <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={handleChange} />
    </div>
  );
}
