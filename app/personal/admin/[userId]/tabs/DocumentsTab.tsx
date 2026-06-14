'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';
import {
  FileText, Download, AlertCircle, CheckCircle2, Clock,
  ChevronDown, ChevronUp, Send, X,
  FileUp, Info, RefreshCw, Copy
} from 'lucide-react';
import {
  getAllDocumentTypesList, getDocumentLabel
} from '@/lib/services/document-configs';
import { getDocumentTypesForService } from '@/lib/services/document-service-map';
import { buildFullPrompt } from '@/lib/services/document-prompts';

interface DocumentsTabProps {
  userId: string;
  data: any;
  refreshData: () => void;
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function DocumentsTab({ userId, data, refreshData }: DocumentsTabProps) {
  const [documents, setDocuments] = useState<Record<string, any>>({});
  const [briefContent, setBriefContent] = useState<string>('');
  const [briefVersion, setBriefVersion] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>('info');
  const [expandedDoc, setExpandedDoc] = useState<string | null>(null);
  const [uploadingDoc, setUploadingDoc] = useState<string | null>(null);
  const [copiedDocId, setCopiedDocId] = useState<string | null>(null);

  // Build document types list based on purchased services
  const purchasedServiceIds: string[] = data.purchasedServices?.map((ps: any) => ps.service_id) || [];
  const allDocTypes = purchasedServiceIds.length > 0
    ? purchasedServiceIds.flatMap((sid: string) => getDocumentTypesForService(sid))
        .filter((v, i, a) => a.indexOf(v) === i)
        .map(docTypeId => {
          const config = getAllDocumentTypesList().find(c => c.id === docTypeId);
          return config || { id: docTypeId, label: getDocumentLabel(docTypeId) ?? docTypeId, description: '', service_id: '' };
        })
    : getAllDocumentTypesList();

  useEffect(() => {
    fetchDocuments();
    fetchBrief();
  }, [userId]);

  const fetchDocuments = async () => {
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
  };

  const fetchBrief = async () => {
    // Fetch the documents-specific brief first
    const { data: docBriefs } = await supabase
      .from('client_briefs')
      .select('brief_content, status, service_id, version')
      .eq('client_id', userId)
      .eq('service_id', 'business_foundations_pack')
      .eq('status', 'completed')
      .order('created_at', { ascending: false })
      .limit(1);

    if (docBriefs && docBriefs.length > 0 && docBriefs[0].brief_content) {
      setBriefContent(docBriefs[0].brief_content);
      setBriefVersion(docBriefs[0].version || 1);
      return;
    }

    // Fallback: comprehensive brief (null service_id)
    const { data: compBriefs } = await supabase
      .from('client_briefs')
      .select('brief_content, status, service_id, version')
      .eq('client_id', userId)
      .is('service_id', null)
      .eq('status', 'completed')
      .order('created_at', { ascending: false })
      .limit(1);

    if (compBriefs && compBriefs.length > 0 && compBriefs[0].brief_content) {
      setBriefContent(compBriefs[0].brief_content);
      setBriefVersion(compBriefs[0].version || 1);
      return;
    }

    // Last resort: any completed brief
    const { data: anyBriefs } = await supabase
      .from('client_briefs')
      .select('brief_content, status, version')
      .eq('client_id', userId)
      .eq('status', 'completed')
      .order('created_at', { ascending: false })
      .limit(1);

    if (anyBriefs && anyBriefs.length > 0 && anyBriefs[0].brief_content) {
      setBriefContent(anyBriefs[0].brief_content);
      setBriefVersion(anyBriefs[0].version || 1);
    }
  };

  const showMessage = (msg: string, type: 'success' | 'error' | 'info' = 'info') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(''), 5000);
  };

  const handleCopyPrompt = useCallback(async (docTypeId: string) => {
    const fullPrompt = buildFullPrompt(docTypeId, briefContent);
    try {
      await navigator.clipboard.writeText(fullPrompt);
      setCopiedDocId(docTypeId);
      setTimeout(() => setCopiedDocId(null), 2000);
    } catch {
      showMessage('Failed to copy prompt to clipboard', 'error');
    }
  }, [briefContent]);

  const handleFileUpload = async (
    docTypeId: string,
    file: File,
    fileKind: 'pdf' | 'docx'
  ) => {
    const docLabel = allDocTypes.find(d => d.id === docTypeId)?.label || getDocumentLabel(docTypeId) || docTypeId;
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
        showMessage(`Upload failed: ${uploadError.message}`, 'error');
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

      showMessage(`${fileKind.toUpperCase()} uploaded for "${docLabel}"`, 'success');
      await fetchDocuments();
      refreshData();
    } catch (err: any) {
      showMessage(err.message || 'Upload failed', 'error');
    } finally {
      setUploadingDoc(null);
    }
  };

  const handleDownloadFile = async (filePath: string, fileName: string) => {
    const { data, error } = await supabase.storage
      .from('generated-documents')
      .createSignedUrl(filePath, 3600);

    if (error || !data) {
      showMessage('Could not generate download link', 'error');
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

  const handleMarkDelivered = async (docId: string) => {
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

    showMessage('Document marked as delivered', 'success');
    await fetchDocuments();
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
    showMessage(`${fileKind.toUpperCase()} removed`, 'info');
    await fetchDocuments();
    refreshData();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1B3F7A]" />
      </div>
    );
  }

  const completedCount = Object.values(documents).filter((d: any) => d.status === 'completed').length;
  const deliveredCount = Object.values(documents).filter((d: any) => d.delivered_to_client).length;

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
          {messageType === 'info' && <Info size={16} className="shrink-0 mt-0.5 text-blue-600" />}
          <p className="font-inter text-sm font-medium">{message}</p>
        </div>
      )}

      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-inter font-bold text-[#1B3F7A] text-xl mb-1">
              Document Management
            </h3>
            <p className="font-inter text-gray-500 text-sm">
              Copy generation prompts, upload completed files, and track delivery.
            </p>
            {!briefContent && (
              <p className="font-inter text-amber-600 text-xs mt-1">
                No client brief found — prompts will include a placeholder section instead of brief context.
              </p>
            )}
            {briefContent && briefVersion > 1 && (
              <p className="font-inter text-blue-600 text-xs mt-1">
                Using brief v{briefVersion} (updated after intake edit)
              </p>
            )}
          </div>
          <div className="flex items-center gap-6 text-sm shrink-0">
            <div className="text-center">
              <div className="font-inter font-bold text-2xl text-[#1B3F7A]">{completedCount}</div>
              <div className="font-inter text-gray-500 text-xs">Complete</div>
            </div>
            <div className="text-center">
              <div className="font-inter font-bold text-2xl text-green-600">{deliveredCount}</div>
              <div className="font-inter text-gray-500 text-xs">Delivered</div>
            </div>
          </div>
        </div>
      </div>

      {/* Document cards */}
      <div className="space-y-3">
        {allDocTypes.map(docType => {
          const doc = documents[docType.id];
          const isExpanded = expandedDoc === docType.id;
          const isUploadingPdf = uploadingDoc === `${docType.id}-pdf`;
          const isUploadingDocx = uploadingDoc === `${docType.id}-docx`;

          return (
            <DocumentCard
              key={docType.id}
              docType={docType}
              doc={doc}
              isExpanded={isExpanded}
              isUploadingPdf={isUploadingPdf}
              isUploadingDocx={isUploadingDocx}
              copiedDocId={copiedDocId}
              onToggleExpand={() => setExpandedDoc(isExpanded ? null : docType.id)}
              onCopyPrompt={() => handleCopyPrompt(docType.id)}
              onUploadFile={(file, kind) => handleFileUpload(docType.id, file, kind)}
              onDownload={handleDownloadFile}
              onMarkDelivered={() => handleMarkDelivered(doc?.id)}
              onRemoveFile={(kind) => handleRemoveFile(docType.id, kind)}
            />
          );
        })}
      </div>
    </div>
  );
}

// ─── Document Card ────────────────────────────────────────────────────────────

function DocumentCard({
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
  const isCompleted = status === 'completed';
  const isCopied = copiedDocId === docType.id;

  const statusConfig: Record<string, { colour: string; bg: string; label: string; icon: React.ReactNode }> = {
    pending:    { colour: 'text-gray-500',  bg: 'bg-gray-100',  label: 'Pending',     icon: <Clock size={11} /> },
    generating: { colour: 'text-blue-600',  bg: 'bg-blue-50',   label: 'In Progress', icon: <RefreshCw size={11} className="animate-spin" /> },
    completed:  { colour: 'text-green-600', bg: 'bg-green-50',  label: 'Complete',    icon: <CheckCircle2 size={11} /> },
    failed:     { colour: 'text-red-600',   bg: 'bg-red-50',    label: 'Failed',      icon: <AlertCircle size={11} /> },
  };

  const s = statusConfig[status] || statusConfig.pending;

  return (
    <div className={`bg-white rounded-lg border overflow-hidden transition-shadow ${isExpanded ? 'border-[#1B3F7A] border-opacity-40 shadow-sm' : 'border-gray-200'}`}>
      {/* Card header row */}
      <div className="px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          {/* Left: icon + name + badges */}
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
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1B3F7A] hover:bg-[#2C68C4] text-white rounded text-xs font-inter font-medium transition-colors"
            >
              {isCopied ? (
                <>
                  <CheckCircle2 size={13} />
                  Copied
                </>
              ) : (
                <>
                  <Copy size={13} />
                  Copy Prompt
                </>
              )}
            </button>

            {/* Manage (expand/collapse) */}
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

      {/* Expanded Manage panel */}
      {isExpanded && (
        <div className="border-t border-gray-200 px-4 py-4 bg-[#FAFBFC] space-y-4">
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
                <button
                  onClick={onMarkDelivered}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-inter font-medium transition-colors"
                >
                  <Send size={13} />
                  Deliver to Client
                </button>
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

// ─── File Upload Zone ─────────────────────────────────────────────────────────

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
          : 'border-gray-300 bg-white hover:border-[#1B3F7A] hover:bg-[#FAFBFC]'
        }`}
    >
      {isUploading ? (
        <>
          <RefreshCw size={16} className="text-blue-500 animate-spin" />
          <p className="font-inter text-xs text-blue-600 font-medium">Uploading…</p>
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
