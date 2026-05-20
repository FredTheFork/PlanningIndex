import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { useClientProfile } from '../../hooks/useClientProfile';
import { Lock, Download, Clock, FileText, Eye, EyeOff } from 'lucide-react';

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
      const { data, error } = await supabase
        .from('generated_documents')
        .select('id, document_type, document_label, content_html, delivered_at, auto_delete_at, admin_edited, pdf_path, docx_path')
        .eq('client_id', user.id)
        .eq('delivered_to_client', true)
        .gt('auto_delete_at', new Date().toISOString())
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

  const handleStorageDownload = async (filePath: string, fileName: string) => {
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

  const getTimeRemaining = (autoDeleteAt: string): string => {
    const now = new Date();
    const deleteDate = new Date(autoDeleteAt);
    const diffMs = deleteDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays <= 0) return 'Expires today';
    if (diffDays === 1) return '1 day remaining';
    return `${diffDays} days remaining`;
  };

  if (profileLoading || loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy" />
      </div>
    );
  }

  if (!profile) return null;

  const hasDocuments = documents.length > 0;

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-inter font-bold text-navy text-2xl mb-1">
          Documents
        </h1>
        <p className="font-inter text-secondary-text text-sm">
          Access your business foundations pack documents.
        </p>
      </div>

      {hasDocuments ? (
        <div className="space-y-6">
          {/* Expiry notice */}
          {documents.length > 0 && documents[0].auto_delete_at && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
              <Clock size={18} className="text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-inter text-amber-800 text-sm font-medium">
                  Documents are available for a limited time
                </p>
                <p className="font-inter text-amber-700 text-xs mt-1">
                  {getTimeRemaining(documents[0].auto_delete_at)} -- Please download and save copies to your own device.
                  We recommend keeping backups in at least two separate locations.
                </p>
              </div>
            </div>
          )}

          {/* Document list */}
          <div className="flex flex-col gap-3">
            {documents.map(doc => (
              <DocumentCard
                key={doc.id}
                doc={doc}
                isViewing={viewingDoc === doc.id}
                onToggleView={() => setViewingDoc(viewingDoc === doc.id ? null : doc.id)}
                onDownload={handleStorageDownload}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-border p-8">
          <div className="flex items-start gap-4">
            <div className="bg-gray-100 rounded-lg p-3 shrink-0">
              <Lock size={24} className="text-secondary-text" />
            </div>
            <div>
              <h2 className="font-inter font-bold text-navy text-lg mb-2">
                Documents not yet available
              </h2>
              <p className="font-inter text-secondary-text text-sm mb-4">
                {profile.delivery_status === 'not_started'
                  ? 'Your documents will be prepared once you submit your intake form. The 24-hour delivery window starts from submission.'
                  : 'Your documents are currently being prepared. They will be available within 24 hours of submitting your intake form.'}
              </p>

              {!profile.has_submitted_intake && (
                <a
                  href="/personal/intake"
                  className="inline-flex items-center gap-2 font-inter font-semibold text-white bg-navy rounded-md hover:bg-medium-blue transition-colors"
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

// ── Document Card with sandboxed iframe preview ──

interface DocumentCardProps {
  doc: DeliveredDoc;
  isViewing: boolean;
  onToggleView: () => void;
  onDownload: (filePath: string, fileName: string) => void;
}

function DocumentCard({ doc, isViewing, onToggleView, onDownload }: DocumentCardProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const blobUrlRef = useRef<string | null>(null);

  useEffect(() => {
    if (isViewing && doc.content_html && iframeRef.current) {
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
      }
      const blob = new Blob([doc.content_html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      blobUrlRef.current = url;
      iframeRef.current.src = url;
    }
  }, [isViewing, doc.content_html]);

  useEffect(() => {
    return () => {
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
      }
    };
  }, []);

  const baseName = doc.document_label.replace(/\s+/g, '_');

  return (
    <div className="bg-white rounded-lg border border-border overflow-hidden">
      {/* Card header row */}
      <div className="p-5">
        <div className="flex items-start gap-4">
          <div className="bg-green-50 rounded-lg p-2.5 shrink-0 mt-0.5">
            <FileText size={20} className="text-success" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-inter font-semibold text-navy text-sm">{doc.document_label}</span>
              {doc.admin_edited && (
                <span className="font-inter text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full border border-amber-200">
                  Reviewed
                </span>
              )}
            </div>
            <div className="font-inter text-xs text-secondary-text mt-1">
              Delivered {new Date(doc.delivered_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
          </div>
        </div>

        {/* Action buttons — always on their own row below the title */}
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-border">
          {doc.docx_path && (
            <button
              onClick={() => onDownload(doc.docx_path!, `${baseName}.docx`)}
              className="font-inter text-sm font-medium text-white bg-navy rounded-md hover:bg-medium-blue transition-colors inline-flex items-center gap-1.5"
              style={{ padding: '8px 14px' }}
            >
              <Download size={14} />
              Download
            </button>
          )}
          {doc.pdf_path && (
            <button
              onClick={() => onDownload(doc.pdf_path!, `${baseName}.pdf`)}
              className="font-inter text-sm font-medium text-navy border border-border rounded-md hover:bg-off-white transition-colors inline-flex items-center gap-1.5"
              style={{ padding: '8px 14px' }}
            >
              <Download size={14} />
              PDF
            </button>
          )}
          {doc.content_html && (
            <button
              onClick={onToggleView}
              className={`font-inter text-sm font-medium rounded-md border transition-colors inline-flex items-center gap-1.5 ${
                isViewing
                  ? 'text-navy bg-off-white border-navy'
                  : 'text-navy border-border hover:bg-off-white'
              }`}
              style={{ padding: '8px 14px' }}
            >
              {isViewing ? <EyeOff size={14} /> : <Eye size={14} />}
              {isViewing ? 'Hide Preview' : 'Preview'}
            </button>
          )}
        </div>
      </div>

      {/* Sandboxed iframe preview — completely isolated from page styles */}
      {isViewing && doc.content_html && (
        <div className="border-t border-border">
          <div className="bg-gray-50 px-4 py-2 flex items-center justify-between">
            <span className="font-inter text-xs font-medium text-secondary-text uppercase tracking-wider">
              Document Preview
            </span>
            <span className="font-inter text-xs text-secondary-text">
              Scroll inside the preview to read the full document
            </span>
          </div>
          <iframe
            ref={iframeRef}
            sandbox="allow-same-origin"
            className="w-full border-0 block"
            style={{ height: 640, background: '#ffffff' }}
            title={`Preview: ${doc.document_label}`}
          />
        </div>
      )}
    </div>
  );
}
