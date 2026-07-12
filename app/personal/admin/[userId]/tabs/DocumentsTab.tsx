'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import JSZip from 'jszip';
import { supabase } from '@/lib/supabase/client';
import {
  FileText, Download, AlertCircle, CheckCircle2, Clock,
  ChevronDown, ChevronUp, Send, X,
  FileUp, Info, RefreshCw, Copy, AlertTriangle, Package, Shield
} from 'lucide-react';
import {
  getAllDocumentTypesList, getDocumentLabel
} from '@/lib/services/document-configs';
import { getDocumentTypesForService } from '@/lib/services/document-service-map';
import { buildFullPrompt } from '@/lib/services/document-prompts';
import { updateOverallDeliveryStatus, markDocumentDelivered, bulkMarkDocumentsDelivered } from '@/lib/services/delivery-status';
import { triggerMessageNotification } from '@/app/actions/messaging';
import { useAdminToast } from '@/hooks/useAdminToast';
import { DocumentsTabSkeleton } from '@/components/admin/skeletons/AdminTabSkeletons';
import { runConsistencyChecks, type DocumentConsistencyReport } from '@/lib/admin/document-consistency';
import { fileUploadLimiter, bulkOperationLimiter } from '@/lib/admin/rate-limiter';
import { logActivity } from '@/lib/admin/activity-log';
import { useAuth } from '@/hooks/useAuth';

interface DocumentsTabProps {
  userId: string;
  data: any;
  refreshData: () => void;
  showToast?: (params: { message: string; type: 'success' | 'error' | 'info' | 'warning'; retryFn?: () => void }) => void;
}

const MAX_PDF_BYTES = 25 * 1024 * 1024; // 25MB
const MAX_DOCX_BYTES = 10 * 1024 * 1024; // 10MB

function getAutoDeleteUrgency(autoDeleteAt: string | null): { days: number; level: 'none' | 'warning' | 'urgent' } {
  if (!autoDeleteAt) return { days: 0, level: 'none' };
  const diffMs = new Date(autoDeleteAt).getTime() - Date.now();
  const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  if (days <= 0) return { days: 0, level: 'urgent' };
  if (days <= 7) return { days, level: 'urgent' };
  if (days <= 30) return { days, level: 'warning' };
  return { days, level: 'none' };
}

export default function DocumentsTab({ userId, data, refreshData, showToast: externalShowToast }: DocumentsTabProps) {
  const [documents, setDocuments] = useState<Record<string, any>>({});
  const [briefContent, setBriefContent] = useState<string>('');
  const [briefVersion, setBriefVersion] = useState<number>(1);
  const [briefGeneratedAt, setBriefGeneratedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedDoc, setExpandedDoc] = useState<string | null>(null);
  const [uploadingDoc, setUploadingDoc] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [copiedDocId, setCopiedDocId] = useState<string | null>(null);

  const [bulkCopying, setBulkCopying] = useState(false);
  const [bulkDelivering, setBulkDelivering] = useState(false);
  const [bulkDownloading, setBulkDownloading] = useState(false);
  const [bulkDownloadProgress, setBulkDownloadProgress] = useState<{ current: number; total: number }>({ current: 0, total: 0 });
  const [showConfirmBulkDeliver, setShowConfirmBulkDeliver] = useState(false);
  const [consistencyReport, setConsistencyReport] = useState<DocumentConsistencyReport | null>(null);
  const [showConsistencyPanel, setShowConsistencyPanel] = useState(false);
  const [highlightedDocs, setHighlightedDocs] = useState<Set<string>>(new Set());
  const lastZipDownloadRef = useRef<number>(0);

  const { user } = useAuth();
  const { showToast: localShowToast } = useAdminToast();
  const showToast = externalShowToast || localShowToast;

  const purchasedServiceIds: string[] = data.purchasedServices?.map((ps: any) => ps.service_id) || [];
  const allDocTypes = useMemo(() => {
    return purchasedServiceIds.length > 0
      ? purchasedServiceIds.flatMap((sid: string) => getDocumentTypesForService(sid))
          .filter((v, i, a) => a.indexOf(v) === i)
          .map(docTypeId => {
            const config = getAllDocumentTypesList().find(c => c.id === docTypeId);
            return config || { id: docTypeId, label: getDocumentLabel(docTypeId) ?? docTypeId, description: '', service_id: '' };
          })
      : getAllDocumentTypesList();
  }, [purchasedServiceIds]);

  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    const { data: docs } = await supabase
      .from('generated_documents')
      .select('*')
      .eq('client_id', userId);

    const docsMap: Record<string, any> = {};
    docs?.forEach(doc => {
      docsMap[doc.document_type] = doc;
    });
    setDocuments(docsMap);
    setLoading(false);
  }, [userId]);

  const fetchBrief = useCallback(async () => {
    const { data: docBriefs } = await supabase
      .from('client_briefs')
      .select('brief_content, status, service_id, version, created_at')
      .eq('client_id', userId)
      .eq('service_id', 'business_foundations_pack')
      .eq('status', 'completed')
      .order('created_at', { ascending: false })
      .limit(1);

    if (docBriefs && docBriefs.length > 0 && docBriefs[0].brief_content) {
      setBriefContent(docBriefs[0].brief_content);
      setBriefVersion(docBriefs[0].version || 1);
      setBriefGeneratedAt(docBriefs[0].created_at);
      return;
    }

    const { data: compBriefs } = await supabase
      .from('client_briefs')
      .select('brief_content, status, service_id, version, created_at')
      .eq('client_id', userId)
      .is('service_id', null)
      .eq('status', 'completed')
      .order('created_at', { ascending: false })
      .limit(1);

    if (compBriefs && compBriefs.length > 0 && compBriefs[0].brief_content) {
      setBriefContent(compBriefs[0].brief_content);
      setBriefVersion(compBriefs[0].version || 1);
      setBriefGeneratedAt(compBriefs[0].created_at);
      return;
    }

    const { data: anyBriefs } = await supabase
      .from('client_briefs')
      .select('brief_content, status, version, created_at')
      .eq('client_id', userId)
      .eq('status', 'completed')
      .order('created_at', { ascending: false })
      .limit(1);

    if (anyBriefs && anyBriefs.length > 0 && anyBriefs[0].brief_content) {
      setBriefContent(anyBriefs[0].brief_content);
      setBriefVersion(anyBriefs[0].version || 1);
      setBriefGeneratedAt(anyBriefs[0].created_at);
    }
  }, [userId]);

  useEffect(() => {
    fetchDocuments();
    fetchBrief();
  }, [fetchDocuments, fetchBrief]);

  const handleCopyPrompt = useCallback(async (docTypeId: string) => {
    const fullPrompt = buildFullPrompt(docTypeId, briefContent);
    try {
      await navigator.clipboard.writeText(fullPrompt);
      setCopiedDocId(docTypeId);
      setTimeout(() => setCopiedDocId(null), 2000);
    } catch {
      showToast({ message: 'Failed to copy prompt to clipboard.', type: 'error' });
    }
  }, [briefContent, showToast]);

  const handleFileUpload = async (
    docTypeId: string,
    file: File,
    fileKind: 'pdf' | 'docx'
  ) => {
    // Client-side validation
    const maxBytes = fileKind === 'pdf' ? MAX_PDF_BYTES : MAX_DOCX_BYTES;
    const expectedMime = fileKind === 'pdf'
      ? 'application/pdf'
      : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

    if (file.size > maxBytes) {
      showToast({ message: `File too large. ${fileKind.toUpperCase()} files must be under ${fileKind === 'pdf' ? '25MB' : '10MB'}.`, type: 'error' });
      return;
    }

    if (file.type !== expectedMime && !file.name.toLowerCase().endsWith(fileKind === 'pdf' ? '.pdf' : '.docx')) {
      showToast({ message: `Invalid file type. Please upload a ${fileKind.toUpperCase()} file.`, type: 'error' });
      return;
    }

    if (file.name.includes('..') || file.name.includes('/') || file.name.includes('\\')) {
      showToast({ message: 'Invalid filename.', type: 'error' });
      return;
    }

    if (!fileUploadLimiter.consume()) {
      const waitSec = Math.ceil(fileUploadLimiter.getWaitTimeMs() / 1000);
      showToast({ message: `Please wait ${waitSec}s before uploading another file.`, type: 'warning', duration: 4000 });
      return;
    }

    const docLabel = allDocTypes.find(d => d.id === docTypeId)?.label || getDocumentLabel(docTypeId) || docTypeId;
    const uploadKey = `${docTypeId}-${fileKind}`;
    setUploadingDoc(uploadKey);

    try {
      const ext = fileKind === 'pdf' ? 'pdf' : 'docx';
      const storagePath = `${userId}/${docTypeId}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('generated-documents')
        .upload(storagePath, file, { contentType: expectedMime, upsert: true });

      if (uploadError) {
        showToast({ message: `Upload failed: ${uploadError.message}`, type: 'error', retryFn: () => handleFileUpload(docTypeId, file, fileKind) });
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
        await supabase.from('generated_documents').update(updatePayload).eq('id', existing.id);
      } else {
        await supabase.from('generated_documents').insert(updatePayload);
      }

      showToast({ message: `${fileKind.toUpperCase()} uploaded for "${docLabel}"`, type: 'success' });
      if (user) {
        logActivity({ adminId: user?.id || '', adminEmail: user?.email || '', clientId: userId, actionType: existing ? 'file_replaced' : 'document_uploaded', actionLabel: `${existing ? 'Replaced' : 'Uploaded'} ${fileKind.toUpperCase()} for ${docLabel}`, metadata: { docType: docTypeId, fileKind, storagePath } });
      }
      await fetchDocuments();
      refreshData();
    } catch (err: any) {
      showToast({ message: err.message || 'Upload failed.', type: 'error', retryFn: () => handleFileUpload(docTypeId, file, fileKind) });
    } finally {
      setUploadingDoc(null);
      setUploadProgress(prev => { const next = { ...prev }; delete next[uploadKey]; return next; });
    }
  };

  const handleDownloadFile = async (filePath: string, fileName: string) => {
    const { data, error } = await supabase.storage
      .from('generated-documents')
      .createSignedUrl(filePath, 3600);

    if (error || !data) {
      showToast({ message: 'File not found or link expired — please re-upload the document.', type: 'error' });
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

  const handleMarkDelivered = async (docId: string, docLabel: string) => {
    try {
      await markDocumentDelivered(docId);
      await sendDeliveryNotification(docLabel);
      showToast({ message: 'Document marked as delivered.', type: 'success' });
      if (user) {
        logActivity({ adminId: user?.id || '', adminEmail: user?.email || '', clientId: userId, actionType: 'document_delivered', actionLabel: `Delivered: ${docLabel}`, metadata: { docId } });
      }
      await fetchDocuments();
      refreshData();
    } catch (err: any) {
      showToast({ message: err.message || 'Failed to mark as delivered.', type: 'error', retryFn: () => handleMarkDelivered(docId, docLabel) });
    }
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
    showToast({ message: `${fileKind.toUpperCase()} removed.`, type: 'info' });
    if (user) {
      logActivity({ adminId: user?.id || '', adminEmail: user?.email || '', clientId: userId, actionType: 'document_deleted', actionLabel: `Removed ${fileKind.toUpperCase()} from ${allDocTypes.find(d => d.id === docTypeId)?.label || docTypeId}`, metadata: { docType: docTypeId, fileKind } });
    }
    await fetchDocuments();
    refreshData();
  };

  const handleBulkCopyAllPrompts = async () => {
    if (!briefContent) {
      showToast({ message: 'No brief content available for prompts.', type: 'error' });
      return;
    }

    setBulkCopying(true);
    try {
      const prompts: string[] = [];
      for (const docType of allDocTypes) {
        const prompt = buildFullPrompt(docType.id, briefContent);
        prompts.push(`---\n## ${docType.label}\n\n${prompt}\n\n`);
      }

      await navigator.clipboard.writeText(prompts.join('\n'));
      showToast({ message: `Copied ${allDocTypes.length} prompts to clipboard.`, type: 'success' });
    } catch {
      showToast({ message: 'Failed to copy prompts.', type: 'error' });
    } finally {
      setBulkCopying(false);
    }
  };

  const handleBulkMarkDelivered = async () => {
    if (!bulkOperationLimiter.consume()) {
      const waitSec = Math.ceil(bulkOperationLimiter.getWaitTimeMs() / 1000);
      showToast({ message: `Please wait ${waitSec}s before another bulk operation.`, type: 'warning', duration: 4000 });
      return;
    }

    setBulkDelivering(true);
    try {
      const docsToDeliver = allDocTypes.filter(docType => {
        const doc = documents[docType.id];
        return doc?.status === 'completed' && (doc.pdf_path || doc.docx_path) && !doc.delivered_to_client;
      });

      if (docsToDeliver.length === 0) {
        showToast({ message: 'No documents ready for delivery.', type: 'info' });
        setShowConfirmBulkDeliver(false);
        setBulkDelivering(false);
        return;
      }

      const docIds = docsToDeliver.map(docType => documents[docType.id].id);
      await bulkMarkDocumentsDelivered(docIds);

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

      showToast({ message: `Delivered ${docsToDeliver.length} documents to client.`, type: 'success' });
      if (user) {
        logActivity({ adminId: user?.id || '', adminEmail: user?.email || '', clientId: userId, actionType: 'document_bulk_delivered', actionLabel: `Bulk delivered ${docsToDeliver.length} documents`, metadata: { count: docsToDeliver.length, docTypes: docLabels } });
      }
      setShowConfirmBulkDeliver(false);
      await fetchDocuments();
      refreshData();
    } catch (err: any) {
      showToast({ message: err.message || 'Failed to deliver documents.', type: 'error', retryFn: handleBulkMarkDelivered });
    } finally {
      setBulkDelivering(false);
    }
  };

  const handleBulkDownloadZip = async () => {
    // Cooldown check
    const now = Date.now();
    if (now - lastZipDownloadRef.current < 30000) {
      const remaining = Math.ceil((30000 - (now - lastZipDownloadRef.current)) / 1000);
      showToast({ message: `Please wait ${remaining}s before downloading another ZIP.`, type: 'warning', duration: 4000 });
      return;
    }

    setBulkDownloading(true);
    try {
      const files: { path: string; name: string }[] = [];
      for (const docType of allDocTypes) {
        const doc = documents[docType.id];
        if (doc?.pdf_path) {
          files.push({ path: doc.pdf_path, name: `${docType.label}.pdf` });
        }
        if (doc?.docx_path) {
          files.push({ path: doc.docx_path, name: `${docType.label}.docx` });
        }
      }

      if (files.length === 0) {
        showToast({ message: 'No files available to download.', type: 'info' });
        setBulkDownloading(false);
        return;
      }

      setBulkDownloadProgress({ current: 0, total: files.length });

      const zip = new JSZip();
      let successCount = 0;
      let failCount = 0;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        try {
          const { data, error } = await supabase.storage
            .from('generated-documents')
            .createSignedUrl(file.path, 3600);

          if (error || !data) {
            failCount++;
            continue;
          }

          const response = await fetch(data.signedUrl);
          if (!response.ok) {
            failCount++;
            continue;
          }

          const blob = await response.blob();
          zip.file(file.name, blob);
          successCount++;
        } catch {
          failCount++;
        }
        setBulkDownloadProgress({ current: i + 1, total: files.length });
      }

      if (successCount === 0) {
        showToast({ message: 'Failed to download any files.', type: 'error' });
        setBulkDownloading(false);
        return;
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${userId.substring(0, 8)}_documents.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      lastZipDownloadRef.current = Date.now();

      if (failCount > 0) {
        showToast({ message: `Downloaded ${successCount} files (${failCount} failed).`, type: 'info' });
      } else {
        showToast({ message: `Downloaded ${successCount} files as ZIP.`, type: 'success' });
      }
      if (user) {
        logActivity({ adminId: user?.id || '', adminEmail: user?.email || '', clientId: userId, actionType: 'zip_downloaded', actionLabel: `Downloaded ${successCount} files as ZIP`, metadata: { fileCount: successCount } });
      }
    } catch (err: any) {
      showToast({ message: err.message || 'Failed to create ZIP.', type: 'error' });
    } finally {
      setBulkDownloading(false);
      setBulkDownloadProgress({ current: 0, total: 0 });
    }
  };

  const handleRunConsistencyCheck = () => {
    const intakeData = data.intakeResponses || {};
    const report = runConsistencyChecks(documents, intakeData);
    setConsistencyReport(report);
    setShowConsistencyPanel(true);

    // Highlight failed docs
    const failedDocIds = new Set<string>();
    report.checks.forEach(check => {
      if (check.status === 'fail' || check.status === 'warn') {
        check.affectedDocuments.forEach(docId => failedDocIds.add(docId));
      }
    });
    setHighlightedDocs(failedDocIds);

    if (user) {
      logActivity({ adminId: user?.id || '', adminEmail: user?.email || '', clientId: userId, actionType: 'consistency_check_run', actionLabel: `Consistency check: ${report.passCount} pass, ${report.warnCount} warn, ${report.failCount} fail` });
    }
    showToast({ message: `Consistency check complete: ${report.passCount} passed, ${report.warnCount} warnings, ${report.failCount} failed.`, type: report.failCount > 0 ? 'warning' : 'success' });
  };

  if (loading) {
    return <DocumentsTabSkeleton />;
  }

  const completedCount = Object.values(documents).filter((d: any) => d.status === 'completed').length;
  const deliveredCount = Object.values(documents).filter((d: any) => d.delivered_to_client).length;
  const pendingCount = allDocTypes.length - completedCount;
  const deliveryPercentage = allDocTypes.length > 0 ? Math.round((deliveredCount / allDocTypes.length) * 100) : 0;

  let progressColor = 'bg-gray-300';
  if (deliveryPercentage >= 80) progressColor = 'bg-green-500';
  else if (deliveryPercentage >= 40) progressColor = 'bg-amber-500';
  else if (deliveryPercentage > 0) progressColor = 'bg-red-500';

  const docsReadyForDelivery = allDocTypes.filter(docType => {
    const doc = documents[docType.id];
    return doc?.status === 'completed' && (doc.pdf_path || doc.docx_path) && !doc.delivered_to_client;
  });

  const filesUploaded = allDocTypes.filter(docType => {
    const doc = documents[docType.id];
    return doc?.pdf_path || doc?.docx_path;
  }).length;

  const allDelivered = deliveredCount === allDocTypes.length && allDocTypes.length > 0;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-inter font-bold text-[#1B3F7A] text-xl mb-1">
              Business Foundations Pack Documents
            </h3>
            <p className="font-inter text-gray-500 text-sm">
              Copy generation prompts, upload completed files, and track delivery.
            </p>

            <div className="flex items-center gap-2 mt-2">
              {briefContent ? (
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs font-inter font-medium">
                  <Info size={12} />
                  Brief v{briefVersion}
                  {briefGeneratedAt && (
                    <span className="text-blue-500">
                      {' '}&middot; {new Date(briefGeneratedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                    </span>
                  )}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-amber-50 text-amber-700 rounded text-xs font-inter font-medium">
                  <AlertTriangle size={12} />
                  No brief available — prompts will use placeholder context
                </span>
              )}
            </div>
          </div>

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
              <div className="font-inter font-bold text-2xl text-gray-500">{pendingCount}</div>
              <div className="font-inter text-gray-500 text-xs flex items-center justify-center gap-1">
                <Clock size={10} />
                Pending
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-inter text-xs text-gray-600">Delivery Progress</span>
            <span className="font-inter text-xs font-medium text-gray-700">
              {deliveredCount} of {allDocTypes.length} delivered ({deliveryPercentage}%)
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

      {/* All Delivered State */}
      {allDelivered && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <CheckCircle2 size={48} className="text-green-500 mx-auto mb-3" />
          <h4 className="font-inter font-semibold text-green-900 text-lg mb-1">All Done!</h4>
          <p className="font-inter text-green-700 text-sm">All documents have been delivered to this client.</p>
        </div>
      )}

      {/* Bulk Actions Toolbar */}
      {allDocTypes.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <Package size={16} className="text-[#1B3F7A]" />
              <span className="font-inter font-medium text-sm text-gray-700">Bulk Actions</span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={handleBulkCopyAllPrompts}
                disabled={bulkCopying || !briefContent}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1B3F7A] hover:bg-[#2C68C4] disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded text-xs font-inter font-medium transition-colors"
                title={!briefContent ? 'No brief content available' : ''}
              >
                {bulkCopying ? (
                  <><RefreshCw size={13} className="animate-spin" /> Copying...</>
                ) : (
                  <><Copy size={13} /> Copy All Prompts <span className="bg-white/20 rounded px-1">{allDocTypes.length}</span></>
                )}
              </button>

              <button
                onClick={() => setShowConfirmBulkDeliver(true)}
                disabled={bulkDelivering || docsReadyForDelivery.length === 0}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded text-xs font-inter font-medium transition-colors"
                title={docsReadyForDelivery.length === 0 ? 'No completed documents with files ready for delivery' : ''}
              >
                {bulkDelivering ? (
                  <><RefreshCw size={13} className="animate-spin" /> Delivering...</>
                ) : (
                  <><Send size={13} /> Mark All Delivered {docsReadyForDelivery.length > 0 && <span className="bg-white/20 rounded px-1">{docsReadyForDelivery.length}</span>}</>
                )}
              </button>

              <button
                onClick={handleBulkDownloadZip}
                disabled={bulkDownloading || filesUploaded === 0}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded text-xs font-inter font-medium transition-colors"
                title={filesUploaded === 0 ? 'No files uploaded' : ''}
              >
                {bulkDownloading ? (
                  <><RefreshCw size={13} className="animate-spin" /> Downloading {bulkDownloadProgress.current}/{bulkDownloadProgress.total}...</>
                ) : (
                  <><Download size={13} /> Download All as ZIP {filesUploaded > 0 && <span className="bg-white/20 rounded px-1">{filesUploaded}</span>}</>
                )}
              </button>

              <button
                onClick={handleRunConsistencyCheck}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded text-xs font-inter font-medium transition-colors"
              >
                <Shield size={13} /> Consistency Check
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Consistency Check Results Panel */}
      {showConsistencyPanel && consistencyReport && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Shield size={18} className="text-[#1B3F7A]" />
              <h4 className="font-inter font-semibold text-gray-900 text-base">Consistency Report</h4>
              <div className="flex items-center gap-2 ml-2">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-50 text-green-700">{consistencyReport.passCount} Pass</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-700">{consistencyReport.warnCount} Warn</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-50 text-red-700">{consistencyReport.failCount} Fail</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-50 text-gray-600">{consistencyReport.skippedCount} Skipped</span>
              </div>
            </div>
            <button
              onClick={() => { setShowConsistencyPanel(false); setHighlightedDocs(new Set()); }}
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
              aria-label="Close consistency report"
            >
              <X size={16} />
            </button>
          </div>
          <div className="space-y-2">
            {consistencyReport.checks.map(check => (
              <div
                key={check.id}
                className={`flex items-start gap-3 p-3 rounded-lg border ${
                  check.status === 'pass' ? 'border-green-200 bg-green-50/30' :
                  check.status === 'fail' ? 'border-red-200 bg-red-50/30' :
                  check.status === 'warn' ? 'border-amber-200 bg-amber-50/30' :
                  'border-gray-200 bg-gray-50/30'
                }`}
              >
                <div className={`shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                  check.status === 'pass' ? 'bg-green-100' :
                  check.status === 'fail' ? 'bg-red-100' :
                  check.status === 'warn' ? 'bg-amber-100' : 'bg-gray-100'
                }`}>
                  {check.status === 'pass' && <CheckCircle2 size={12} className="text-green-600" />}
                  {check.status === 'fail' && <AlertCircle size={12} className="text-red-600" />}
                  {check.status === 'warn' && <AlertTriangle size={12} className="text-amber-600" />}
                  {check.status === 'skipped' && <Clock size={12} className="text-gray-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-inter text-sm font-medium text-gray-800">{check.label}</p>
                  <p className="font-inter text-xs text-gray-600 mt-0.5">{check.detail}</p>
                  {check.affectedDocuments.length > 0 && (
                    <p className="font-inter text-xs text-gray-400 mt-1">Affected: {check.affectedDocuments.join(', ')}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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

      {/* Document cards */}
      {allDocTypes.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <Package size={48} className="text-gray-300 mx-auto mb-4" />
          <h4 className="font-inter font-semibold text-gray-900 text-lg mb-2">No Documents Created Yet</h4>
          <p className="font-inter text-gray-600 text-sm">Generate a brief and copy prompts to create documents, then upload the completed files here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {allDocTypes.map(docType => {
            const doc = documents[docType.id];
            const isExpanded = expandedDoc === docType.id;
            const isUploadingPdf = uploadingDoc === `${docType.id}-pdf`;
            const isUploadingDocx = uploadingDoc === `${docType.id}-docx`;
            const isHighlighted = highlightedDocs.has(docType.id);

            return (
              <DocumentCard
                key={docType.id}
                docType={docType}
                doc={doc}
                isExpanded={isExpanded}
                isUploadingPdf={isUploadingPdf}
                isUploadingDocx={isUploadingDocx}
                uploadProgressPdf={uploadProgress[`${docType.id}-pdf`] || 0}
                uploadProgressDocx={uploadProgress[`${docType.id}-docx`] || 0}
                copiedDocId={copiedDocId}
                isHighlighted={isHighlighted}
                onToggleExpand={() => setExpandedDoc(isExpanded ? null : docType.id)}
                onCopyPrompt={() => handleCopyPrompt(docType.id)}
                onUploadFile={(file, kind) => handleFileUpload(docType.id, file, kind)}
                onDownload={handleDownloadFile}
                onMarkDelivered={() => handleMarkDelivered(doc?.id, docType.label)}
                onRemoveFile={(kind) => handleRemoveFile(docType.id, kind)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

function DocumentCard({
  docType,
  doc,
  isExpanded,
  isUploadingPdf,
  isUploadingDocx,
  uploadProgressPdf,
  uploadProgressDocx,
  copiedDocId,
  isHighlighted,
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
  uploadProgressPdf: number;
  uploadProgressDocx: number;
  copiedDocId: string | null;
  isHighlighted: boolean;
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
    <div className={`bg-white rounded-lg border overflow-hidden transition-all ${isExpanded ? 'border-[#1B3F7A] border-opacity-40 shadow-sm' : 'border-gray-200'} ${isHighlighted ? 'ring-2 ring-amber-300' : ''}`}>
      <div className="px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="bg-[#FAFBFC] rounded-lg p-2 shrink-0">
              <FileText size={16} className="text-[#1B3F7A]" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1.5">
                <h4 className="font-inter font-semibold text-gray-900 text-sm">{docType.label}</h4>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${s.bg} ${s.colour}`}>
                  {s.icon}
                  {s.label}
                </span>

                {autoDelete.level === 'urgent' && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-red-50 text-red-700 border border-red-200">
                    <AlertTriangle size={10} />
                    {autoDelete.days === 0 ? 'Expires today' : `${autoDelete.days} days remaining`}
                  </span>
                )}
                {autoDelete.level === 'warning' && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                    <Clock size={10} />
                    {autoDelete.days} days remaining
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

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onCopyPrompt}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1B3F7A] hover:bg-[#2C68C4] text-white rounded text-xs font-inter font-medium transition-colors"
            >
              {isCopied ? (
                <><CheckCircle2 size={13} /> Copied</>
              ) : (
                <><Copy size={13} /> Copy Prompt</>
              )}
            </button>

            <button
              onClick={onToggleExpand}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded text-xs font-inter font-medium transition-colors"
            >
              {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
              Manage
            </button>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-gray-200 px-4 py-4 bg-[#FAFBFC] space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FileUploadZone
              label="PDF"
              existingPath={doc?.pdf_path}
              existingName={`${docType.label}.pdf`}
              isUploading={isUploadingPdf}
              uploadProgress={uploadProgressPdf}
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
              uploadProgress={uploadProgressDocx}
              accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              inputRef={docxInputRef}
              onFileSelect={(file) => onUploadFile(file, 'docx')}
              onDownload={doc?.docx_path ? () => onDownload(doc.docx_path, `${docType.label}.docx`) : undefined}
              onRemove={doc?.docx_path ? () => onRemoveFile('docx') : undefined}
            />
          </div>

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

function FileUploadZone({
  label,
  existingPath,
  existingName,
  isUploading,
  uploadProgress,
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
  uploadProgress: number;
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
          : 'border-gray-300 bg-white hover:border-[#1B3F7A] hover:bg-[#FAFBFC]'
        }`}
    >
      {isUploading ? (
        <>
          <RefreshCw size={16} className="text-blue-500 animate-spin" />
          {uploadProgress > 0 ? (
            <>
              <div className="w-full h-1 bg-blue-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full transition-all duration-150" style={{ width: `${uploadProgress}%` }} />
              </div>
              <p className="font-inter text-xs text-blue-600 font-medium">{uploadProgress}%</p>
            </>
          ) : (
            <p className="font-inter text-xs text-blue-600 font-medium">Uploading...</p>
          )}
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
