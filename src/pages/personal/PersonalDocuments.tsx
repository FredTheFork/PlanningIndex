import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { useClientProfile } from '../../hooks/useClientProfile';
import { Lock, Download, Clock, FileText } from 'lucide-react';

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
              <div key={doc.id} className="bg-white rounded-lg border border-border p-5">
                <div className="flex items-center gap-4">
                  <div className="bg-green-50 rounded-lg p-2.5 shrink-0">
                    <FileText size={20} className="text-success" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="font-inter font-semibold text-navy text-sm">{doc.document_label}</span>
                    {doc.admin_edited && (
                      <span className="font-inter text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full border border-amber-200 ml-2">Reviewed</span>
                    )}
                    <div className="font-inter text-xs text-secondary-text mt-1">
                      Delivered {new Date(doc.delivered_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setViewingDoc(viewingDoc === doc.id ? null : doc.id)}
                      className="font-inter text-sm font-medium text-navy border border-border rounded-md hover:bg-off-white transition-colors inline-flex items-center gap-2"
                      style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                    >
                      {viewingDoc === doc.id ? 'Hide' : 'View'}
                    </button>
                    {doc.pdf_path && (
                      <button
                        onClick={() => handleStorageDownload(doc.pdf_path!, `${doc.document_label.replace(/\s+/g, '_')}.pdf`)}
                        className="font-inter text-sm font-medium text-white bg-navy rounded-md hover:bg-medium-blue transition-colors inline-flex items-center gap-2"
                        style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                      >
                        <Download size={14} />
                        PDF
                      </button>
                    )}
                    {doc.docx_path && (
                      <button
                        onClick={() => handleStorageDownload(doc.docx_path!, `${doc.document_label.replace(/\s+/g, '_')}.docx`)}
                        className="font-inter text-sm font-medium text-navy border border-border rounded-md hover:bg-off-white transition-colors inline-flex items-center gap-2"
                        style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                      >
                        <Download size={14} />
                        DOCX
                      </button>
                    )}
                    {!doc.pdf_path && !doc.docx_path && (
                      <button
                        onClick={() => handleDownloadHtml(doc)}
                        className="font-inter text-sm font-medium text-white bg-navy rounded-md hover:bg-medium-blue transition-colors inline-flex items-center gap-2"
                        style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                      >
                        <Download size={14} />
                        HTML
                      </button>
                    )}
                  </div>
                </div>

                {/* Document viewer */}
                {viewingDoc === doc.id && doc.content_html && (
                  <div className="mt-4 border-t border-border pt-4">
                    <div
                      className="bg-white rounded-md border border-border overflow-y-auto"
                      style={{ maxHeight: 600 }}
                      dangerouslySetInnerHTML={{ __html: doc.content_html }}
                    />
                  </div>
                )}
              </div>
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
