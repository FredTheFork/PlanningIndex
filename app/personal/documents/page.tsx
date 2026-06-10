'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useClientProfile } from '@/hooks/useClientProfile';
import { getServiceById } from '@/lib/services/service-catalog';
import { getDocumentTypesForService, isServiceDocumentService } from '@/lib/services/document-service-map';
import { Lock, Clock, FileText, Eye, EyeOff, Download } from 'lucide-react';

interface DeliveredDoc {
  id: string;
  document_type: string;
  document_label: string;
  content_html: string | null;
  delivered_at: string;
  auto_delete_at: string;
  admin_edited: boolean;
  pdf_path: string | null;
  docx_path: string | null;
}

export default function PersonalDocuments() {
  const { profile, loading: profileLoading, purchasedServiceIds } = useClientProfile();
  const { user } = useAuth();
  const [documents, setDocuments] = useState<DeliveredDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewingDoc, setViewingDoc] = useState<string | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<string>('all');

  useEffect(() => {
    if (!user) return;
    fetchDeliveredDocs();
  }, [user]);

  const fetchDeliveredDocs = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from('generated_documents')
        .select('id, document_type, document_label, content_html, delivered_at, auto_delete_at, admin_edited, pdf_path, docx_path')
        .eq('client_id', user.id)
        .eq('delivered_to_client', true)
        .or(`auto_delete_at.is.null,auto_delete_at.gt.${now}`)
        .order('document_type');

      if (error) {
        console.error('Error fetching delivered docs:', error);
      } else {
        setDocuments(data || []);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadHtml = (doc: DeliveredDoc) => {
    if (!doc.content_html) return;
    const blob = new Blob([doc.content_html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${doc.document_label.replace(/\s+/g, '_')}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleStorageDownload = async (filePath: string, fileName: string, bucket: string = 'generated-documents') => {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
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

  const getTimeRemaining = (autoDeleteAt: string): string => {
    const now = new Date();
    const deleteDate = new Date(autoDeleteAt);
    const diffMs = deleteDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays <= 0) return 'Expires today';
    if (diffDays === 1) return '1 day remaining';
    return `${diffDays} days remaining`;
  };

  // Compute which document-producing services the user has purchased
  const docServiceIds = purchasedServiceIds.filter(isServiceDocumentService);

  // Filter documents based on selected service tab
  const filteredDocuments = selectedServiceId === 'all'
    ? documents
    : documents.filter((doc) => {
        const typesForService = new Set(getDocumentTypesForService(selectedServiceId));
        return typesForService.has(doc.document_type);
      });

  if (profileLoading || loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1B3F7A]" />
      </div>
    );
  }

  if (!profile) return null;

  const hasDocuments = filteredDocuments.length > 0;

  // Earliest auto-delete among filtered docs
  const earliestAutoDelete = filteredDocuments
    .map((d) => d.auto_delete_at)
    .filter(Boolean)
    .sort()[0];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-inter font-bold text-[#1B3F7A] text-2xl mb-1">
          Your Documents
        </h1>
        <p className="font-inter text-gray-600 text-sm">
          Access your business foundations documents.
        </p>
      </div>

      {/* Service filter tabs */}
      {docServiceIds.length > 1 && (
        <div className="mb-6">
          <div className="flex gap-1 bg-white rounded-lg border border-gray-200 p-1 overflow-x-auto">
            <button
              onClick={() => setSelectedServiceId('all')}
              className={`px-4 py-2 rounded-md font-inter text-sm font-medium transition-colors whitespace-nowrap ${
                selectedServiceId === 'all'
                  ? 'bg-[#1B3F7A] text-white'
                  : 'text-gray-600 hover:text-[#1B3F7A] hover:bg-gray-50'
              }`}
            >
              All Documents
            </button>
            {docServiceIds.map((sid) => {
              const service = getServiceById(sid);
              return (
                <button
                  key={sid}
                  onClick={() => setSelectedServiceId(sid)}
                  className={`px-4 py-2 rounded-md font-inter text-sm font-medium transition-colors whitespace-nowrap ${
                    selectedServiceId === sid
                      ? 'bg-[#1B3F7A] text-white'
                      : 'text-gray-600 hover:text-[#1B3F7A] hover:bg-gray-50'
                  }`}
                >
                  {service?.name ?? sid}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Documents Section */}
      {hasDocuments && (
        <div className="space-y-6">
          {earliestAutoDelete && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
              <Clock size={18} className="text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-inter text-amber-800 text-sm font-medium">
                  Documents are available for a limited time
                </p>
                <p className="font-inter text-amber-700 text-xs mt-1">
                  {getTimeRemaining(earliestAutoDelete)} — Please download and save copies to your own device.
                </p>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3">
            {filteredDocuments.map(doc => (
              <DocumentCard
                key={doc.id}
                doc={doc}
                isViewing={viewingDoc === doc.id}
                onToggleView={() => setViewingDoc(viewingDoc === doc.id ? null : doc.id)}
                onDownloadHtml={handleDownloadHtml}
                onStorageDownload={handleStorageDownload}
              />
            ))}
          </div>
        </div>
      )}

      {/* No content state */}
      {!hasDocuments && (
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <div className="flex items-start gap-4">
            <div className="bg-gray-100 rounded-lg p-3 shrink-0">
              <Lock size={24} className="text-gray-600" />
            </div>
            <div>
              <h2 className="font-inter font-bold text-[#1B3F7A] text-lg mb-2">
                Documents not yet available
              </h2>
              <p className="font-inter text-gray-600 text-sm mb-4">
                {profile.delivery_status === 'not_started'
                  ? 'Your documents will be prepared once you submit your intake form. The 24-hour delivery window starts from submission.'
                  : 'Your documents are currently being prepared. They will be available within 24 hours of submitting your intake form.'}
              </p>

              {!profile.has_submitted_intake && (
                <a
                  href="/personal/intake"
                  className="inline-flex items-center gap-2 font-inter font-semibold text-white bg-[#1B3F7A] rounded-md hover:bg-[#2C68C4] transition-colors"
                  style={{ padding: '10px 20px', fontSize: '0.9rem' }}
                >
                  Complete Intake Form
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Document Card ──

interface DocumentCardProps {
  doc: DeliveredDoc;
  isViewing: boolean;
  onToggleView: () => void;
  onDownloadHtml: (doc: DeliveredDoc) => void;
  onStorageDownload: (filePath: string, fileName: string) => void;
}

function DocumentCard({ doc, isViewing, onToggleView, onDownloadHtml, onStorageDownload }: DocumentCardProps) {
  const [htmlBlobUrl, setHtmlBlobUrl] = useState<string | null>(null);

  useEffect(() => {
    if (isViewing && doc.content_html && !htmlBlobUrl) {
      const blob = new Blob([doc.content_html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      setHtmlBlobUrl(url);
    } else if (!isViewing && htmlBlobUrl) {
      URL.revokeObjectURL(htmlBlobUrl);
      setHtmlBlobUrl(null);
    }

    return () => {
      if (htmlBlobUrl) {
        URL.revokeObjectURL(htmlBlobUrl);
      }
    };
  }, [isViewing, doc.content_html]);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5">
      <div className="flex items-start gap-4">
        <div className="bg-[#FAFBFC] rounded-lg p-3 shrink-0">
          <FileText size={24} className="text-[#1B3F7A]" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-inter font-semibold text-[#1B3F7A]">
              {doc.document_label}
            </h3>
            {doc.admin_edited && (
              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded font-inter font-medium">
                Edited
              </span>
            )}
          </div>
          <p className="font-inter text-gray-600 text-xs mb-3">
            Delivered {new Date(doc.delivered_at).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={onToggleView}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md font-inter text-sm transition-colors"
            >
              {isViewing ? (
                <>
                  <EyeOff size={16} />
                  Hide Preview
                </>
              ) : (
                <>
                  <Eye size={16} />
                  Preview
                </>
              )}
            </button>

            {doc.pdf_path && (
              <button
                onClick={() => onStorageDownload(doc.pdf_path!, `${doc.document_label}.pdf`)}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#1B3F7A] hover:bg-[#2C68C4] text-white rounded-md font-inter text-sm transition-colors"
              >
                <Download size={16} />
                PDF
              </button>
            )}

            {doc.docx_path && (
              <button
                onClick={() => onStorageDownload(doc.docx_path!, `${doc.document_label}.docx`)}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#1B3F7A] hover:bg-[#2C68C4] text-white rounded-md font-inter text-sm transition-colors"
              >
                <Download size={16} />
                Word
              </button>
            )}

            {doc.content_html && (
              <button
                onClick={() => onDownloadHtml(doc)}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md font-inter text-sm transition-colors"
              >
                <Download size={16} />
                HTML
              </button>
            )}
          </div>
        </div>
      </div>

      {isViewing && htmlBlobUrl && (
        <div className="mt-4 border-t border-gray-200 pt-4">
          <iframe
            src={htmlBlobUrl}
            title={doc.document_label}
            sandbox="allow-same-origin"
            className="w-full h-96 border border-gray-200 rounded-lg bg-white"
          />
        </div>
      )}
    </div>
  );
}
