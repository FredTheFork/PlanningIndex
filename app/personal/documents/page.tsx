'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useClientProfile } from '@/hooks/useClientProfile';
import { AutoDeleteWarningMultiple, AutoDeleteBadge } from '@/components/ui/AutoDeleteWarning';
import { DocumentCardSkeleton } from '@/components/ui/skeletons';
import { Lock, FileText, Eye, EyeOff, Download } from 'lucide-react';

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
  const { profile, loading: profileLoading } = useClientProfile();
  const { user } = useAuth();
  const [documents, setDocuments] = useState<DeliveredDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewingDoc, setViewingDoc] = useState<string | null>(null);

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

  if (profileLoading || loading) {
    return (
      <div>
        <div className="mb-8">
          <div className="h-8 bg-gray-200 rounded w-40 mb-1 animate-pulse" />
          <div className="h-4 bg-gray-100 rounded w-56 animate-pulse" />
        </div>
        <div className="space-y-3">
          <DocumentCardSkeleton />
          <DocumentCardSkeleton />
        </div>
      </div>
    );
  }

  if (!profile) return null;

  const hasDocuments = documents.length > 0;

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-inter font-bold text-[#1B3F7A] text-2xl mb-1">
          Your Documents
        </h1>
        <p className="font-inter text-gray-600 text-sm">
          {hasDocuments
            ? `${documents.length} document${documents.length === 1 ? '' : 's'} ready for download`
            : 'Your business documents will appear here once delivered'}
        </p>
      </div>

      {/* Documents Section */}
      {hasDocuments && (
        <div className="space-y-6">
          <AutoDeleteWarningMultiple
            autoDeleteDates={documents.map(d => d.auto_delete_at)}
          />

          <div className="flex flex-col gap-3">
            {documents.map(doc => (
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
