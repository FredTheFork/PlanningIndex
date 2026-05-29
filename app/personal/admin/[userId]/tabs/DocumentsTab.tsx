'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import {
  FileText, RefreshCw, Download, Eye, AlertCircle, CheckCircle2, Clock,
  Zap, FileDown, ExternalLink, ChevronDown, ChevronUp, Send, Loader
} from 'lucide-react';

interface DocumentsTabProps {
  userId: string;
  data: any;
  refreshData: () => void;
}

const DOCUMENT_TYPES = [
  { id: 'terms_and_conditions', label: 'Terms and Conditions', description: 'General business terms' },
  { id: 'service_agreement_contract', label: 'Service Agreement Contract', description: 'Client engagement contract' },
  { id: 'gdpr_privacy_policy', label: 'GDPR Privacy Policy', description: 'Data protection policy' },
  { id: 'professional_invoice_template', label: 'Professional Invoice Template', description: 'Invoice template with branding' },
  { id: 'late_payment_letters', label: 'Late Payment Letters', description: 'Payment chase sequence' },
  { id: 'welcome_email_sequence', label: 'Welcome Email Sequence', description: 'Client onboarding emails' },
  { id: 'professional_bio', label: 'Professional Bio', description: 'Business biography' },
  { id: 'elevator_pitch', label: 'Elevator Pitch', description: '30-second pitch script' },
  { id: 'linkedin_profile_script', label: 'LinkedIn Profile Script', description: 'Profile optimization' },
  { id: 'service_description_sheets', label: 'Service Description Sheets', description: 'Service breakdown documents' },
];

export default function DocumentsTab({ userId, data, refreshData }: DocumentsTabProps) {
  const [documents, setDocuments] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState<string | null>(null);
  const [generatingAll, setGeneratingAll] = useState(false);
  const [message, setMessage] = useState('');
  const [expandedDoc, setExpandedDoc] = useState<string | null>(null);

  useEffect(() => {
    fetchDocuments();
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

  const handleGenerateDocument = async (docType: string) => {
    if (!data.profile.has_submitted_intake) {
      setMessage('Client must submit intake form first');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    // Check if brief exists
    const { data: brief } = await supabase
      .from('client_briefs')
      .select('id')
      .eq('client_id', userId)
      .eq('status', 'completed')
      .maybeSingle();

    if (!brief) {
      setMessage('Generate Master Brief first before documents');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    setGenerating(docType);
    setMessage('');

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
          }),
        }
      );

      const result = await response.json();

      if (response.ok && result.success) {
        setMessage(`${docType.replace(/_/g, ' ')} generated successfully`);
        await fetchDocuments();
        refreshData();
      } else {
        setMessage(result.error || 'Failed to generate document');
      }
    } catch (error: any) {
      setMessage(error.message || 'Error generating document');
    } finally {
      setGenerating(null);
      setTimeout(() => setMessage(''), 5000);
    }
  };

  const handleGenerateAllDocuments = async () => {
    if (!data.profile.has_submitted_intake) {
      setMessage('Client must submit intake form first');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    const { data: brief } = await supabase
      .from('client_briefs')
      .select('id')
      .eq('client_id', userId)
      .eq('status', 'completed')
      .maybeSingle();

    if (!brief) {
      setMessage('Generate Master Brief first before documents');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    const confirmGen = confirm('Generate all 10 documents? This may take several minutes.');
    if (!confirmGen) return;

    setGeneratingAll(true);
    setMessage('');

    let successCount = 0;
    let failCount = 0;

    for (const doc of DOCUMENT_TYPES) {
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
              document_type: doc.id,
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

      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setMessage(`Generated ${successCount} documents${failCount > 0 ? `, ${failCount} failed` : ''}`);
    await fetchDocuments();
    refreshData();
    setGeneratingAll(false);
    setTimeout(() => setMessage(''), 5000);
  };

  const handleRegenerateFiles = async (docType: string) => {
    setGenerating(docType + '-files');
    setMessage('');

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
            generate_files: true,
          }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        setMessage('Files regenerated successfully');
        await fetchDocuments();
      } else {
        setMessage(result.error || 'Failed to regenerate files');
      }
    } catch (error: any) {
      setMessage(error.message || 'Error regenerating files');
    } finally {
      setGenerating(null);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleDownloadFile = async (filePath: string, fileName: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('generated-documents')
        .createSignedUrl(filePath, 3600);

      if (error || !data) {
        console.error('Download error:', error);
        return;
      }

      const a = document.createElement('a');
      a.href = data.signedUrl;
      a.download = fileName;
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      console.error('Download error:', err);
    }
  };

  const handleMarkDelivered = async (docId: string) => {
    const { error } = await supabase
      .from('generated_documents')
      .update({
        delivered_to_client: true,
        delivered_at: new Date().toISOString(),
      })
      .eq('id', docId);

    if (!error) {
      setMessage('Document marked as delivered');
      await fetchDocuments();
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { color: string; bg: string; label: string; icon: any }> = {
      pending: { color: 'text-gray-600', bg: 'bg-gray-100', label: 'Pending', icon: Clock },
      generating: { color: 'text-blue-600', bg: 'bg-blue-50', label: 'Generating', icon: RefreshCw },
      completed: { color: 'text-green-600', bg: 'bg-green-50', label: 'Completed', icon: CheckCircle2 },
      failed: { color: 'text-red-600', bg: 'bg-red-50', label: 'Failed', icon: AlertCircle },
    };
    return configs[status] || configs.pending;
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
      {/* Message */}
      {message && (
        <div className={`rounded-lg p-4 ${
          message.includes('success') || message.includes('Generated')
            ? 'bg-green-50 border border-green-200 text-green-800'
            : message.includes('Failed') || message.includes('Error')
            ? 'bg-red-50 border border-red-200 text-red-800'
            : 'bg-blue-50 border border-blue-200 text-blue-800'
        }`}>
          <p className="font-inter text-sm font-medium">{message}</p>
        </div>
      )}

      {/* Header with Stats */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-inter font-bold text-[#1B3F7A] text-xl mb-2">
              Document Generation Center
            </h3>
            <p className="font-inter text-gray-600 text-sm">
              Generate and manage all 10 business foundation documents
            </p>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="text-center">
              <div className="font-inter font-bold text-2xl text-[#1B3F7A]">{completedCount}</div>
              <div className="font-inter text-gray-600 text-xs">Generated</div>
            </div>
            <div className="text-center">
              <div className="font-inter font-bold text-2xl text-green-600">{deliveredCount}</div>
              <div className="font-inter text-gray-600 text-xs">Delivered</div>
            </div>
          </div>
        </div>

        {/* Master Generate Button */}
        <button
          onClick={handleGenerateAllDocuments}
          disabled={generatingAll || !data.profile.has_submitted_intake}
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#1B3F7A] hover:bg-[#2C68C4] text-white rounded-md font-inter text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {generatingAll ? (
            <>
              <RefreshCw size={18} className="animate-spin" />
              Generating All Documents...
            </>
          ) : (
            <>
              <Zap size={18} />
              Generate All 10 Documents
            </>
          )}
        </button>
      </div>

      {/* Documents List */}
      <div className="space-y-3">
        {DOCUMENT_TYPES.map(docType => {
          const doc = documents[docType.id];
          const statusConfig = getStatusConfig(doc?.status || 'pending');
          const StatusIcon = statusConfig.icon;
          const isGenerating = generating === docType.id;
          const isGeneratingFiles = generating === docType.id + '-files';

          return (
            <DocumentCard
              key={docType.id}
              docType={docType}
              doc={doc}
              statusConfig={statusConfig}
              StatusIcon={StatusIcon}
              expanded={expandedDoc === docType.id}
              isGenerating={isGenerating}
              isGeneratingFiles={isGeneratingFiles}
              onToggleExpand={() => setExpandedDoc(expandedDoc === docType.id ? null : docType.id)}
              onGenerate={() => handleGenerateDocument(docType.id)}
              onRegenerateFiles={() => handleRegenerateFiles(docType.id)}
              onDownload={handleDownloadFile}
              onMarkDelivered={() => handleMarkDelivered(doc.id)}
            />
          );
        })}
      </div>
    </div>
  );
}

// Document Card Component
function DocumentCard({
  docType,
  doc,
  statusConfig,
  StatusIcon,
  expanded,
  isGenerating,
  isGeneratingFiles,
  onToggleExpand,
  onGenerate,
  onRegenerateFiles,
  onDownload,
  onMarkDelivered,
}: any) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <div className="bg-[#FAFBFC] rounded-lg p-2.5 shrink-0">
              <FileText size={20} className="text-[#1B3F7A]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-inter font-semibold text-gray-900 text-sm">
                  {docType.label}
                </h4>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${statusConfig.bg} ${statusConfig.color}`}>
                  <StatusIcon size={12} className={doc?.status === 'generating' ? 'animate-spin' : ''} />
                  {statusConfig.label}
                </span>
                {doc?.delivered_to_client && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-600">
                    <Send size={12} />
                    Delivered
                  </span>
                )}
                {doc?.admin_edited && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-50 text-purple-600">
                    Edited
                  </span>
                )}
              </div>
              <p className="font-inter text-gray-600 text-xs">{docType.description}</p>
              {doc?.generated_at && (
                <p className="font-inter text-gray-500 text-xs mt-1">
                  Generated: {new Date(doc.generated_at).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 ml-4">
            {!doc && (
              <button
                onClick={onGenerate}
                disabled={isGenerating}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1B3F7A] hover:bg-[#2C68C4] text-white rounded text-xs font-inter font-medium transition-colors disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Zap size={14} />
                    Generate
                  </>
                )}
              </button>
            )}
            {doc && (
              <button
                onClick={onToggleExpand}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-xs font-inter font-medium transition-colors"
              >
                {expanded ? (
                  <>
                    <ChevronUp size={14} />
                    Hide
                  </>
                ) : (
                  <>
                    <Eye size={14} />
                    View
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Expanded View */}
      {expanded && doc && (
        <div className="border-t border-gray-200 p-4 bg-[#FAFBFC]">
          {/* Actions */}
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={onGenerate}
              disabled={isGenerating}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1B3F7A] hover:bg-[#2C68C4] text-white rounded text-xs font-inter font-medium transition-colors disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <RefreshCw size={14} className="animate-spin" />
                  Regenerating...
                </>
              ) : (
                <>
                  <RefreshCw size={14} />
                  Regenerate
                </>
              )}
            </button>

            {doc.status === 'completed' && (
              <>
                {doc.pdf_path && (
                  <button
                    onClick={() => onDownload(doc.pdf_path, `${docType.label}.pdf`)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded text-xs font-inter font-medium transition-colors"
                  >
                    <Download size={14} />
                    PDF
                  </button>
                )}
                {doc.docx_path && (
                  <button
                    onClick={() => onDownload(doc.docx_path, `${docType.label}.docx`)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded text-xs font-inter font-medium transition-colors"
                  >
                    <Download size={14} />
                    Word
                  </button>
                )}
                <button
                  onClick={onRegenerateFiles}
                  disabled={isGeneratingFiles}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded text-xs font-inter font-medium transition-colors disabled:opacity-50"
                >
                  {isGeneratingFiles ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <FileDown size={14} />
                      Regenerate Files
                    </>
                  )}
                </button>
                {!doc.delivered_to_client && (
                  <button
                    onClick={onMarkDelivered}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-inter font-medium transition-colors"
                  >
                    <Send size={14} />
                    Mark Delivered
                  </button>
                )}
              </>
            )}
          </div>

          {/* Error */}
          {doc.status === 'failed' && doc.error_message && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <div className="flex items-start gap-2">
                <AlertCircle size={16} className="text-red-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-inter font-medium text-red-900 text-xs mb-1">Generation Failed</p>
                  <p className="font-inter text-red-700 text-xs">{doc.error_message}</p>
                </div>
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <MetaItem label="Document Type" value={doc.document_type} />
            <MetaItem label="Model Used" value={doc.model_used || 'N/A'} />
            <MetaItem label="Generated" value={doc.generated_at ? new Date(doc.generated_at).toLocaleDateString('en-GB') : 'N/A'} />
            <MetaItem label="Files" value={doc.pdf_path && doc.docx_path ? 'PDF & Word' : doc.pdf_path ? 'PDF' : doc.docx_path ? 'Word' : 'No files'} />
          </div>

          {/* Content Preview */}
          {doc.content_text && (
            <div>
              <p className="font-inter font-medium text-gray-700 text-xs mb-2">Content Preview</p>
              <div className="bg-white rounded border border-gray-200 p-3 max-h-96 overflow-y-auto">
                <pre className="font-mono text-xs text-gray-800 whitespace-pre-wrap">
                  {doc.content_text.substring(0, 2000)}
                  {doc.content_text.length > 2000 && '\n\n[Content truncated. Download full document to view complete content.]'}
                </pre>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-inter text-gray-600 text-xs">{label}</p>
      <p className="font-inter font-medium text-gray-900 text-xs">{value}</p>
    </div>
  );
}
