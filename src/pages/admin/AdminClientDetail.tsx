import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { intakeFormSections, upsellFormSections, FormField } from '../../lib/intakeFormDefinition';
import {
  ArrowLeft, FileText, Upload, X,
  Save, AlertCircle, FolderOpen, Download, ExternalLink,
  Copy, RefreshCw, FileSearch
} from 'lucide-react';

interface ClientData {
  profile: {
    user_id: string;
    has_submitted_intake: boolean;
    intake_submitted_at: string | null;
    delivery_status: 'not_started' | 'in_progress' | 'delivered';
    delivery_link: string | null;
    created_at: string;
    admin_notes: string;
    purchased_upsells: string[];
  } | null;
  intakeResponses: Record<string, any> | null;
  additionalNotes: Record<string, string> | null;
  fileUploads: Record<string, any[]>;
  intakeUploads: { id: string; question_id: string; file_name: string; file_path: string; file_size: number; file_type: string }[];
  clientDocuments: { id: string; file_name: string; file_path: string; file_size: number; file_type: string; created_at: string }[];
  orders: any[];
}

export default function AdminClientDetail() {
  const { userId } = useParams<{ userId: string }>();
  const { user: adminUser } = useAuth();
  const [data, setData] = useState<ClientData>({
    profile: null,
    intakeResponses: null,
    additionalNotes: null,
    fileUploads: {},
    intakeUploads: [],
    clientDocuments: [],
    orders: [],
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'intake' | 'documents' | 'uploads' | 'brief'>('overview');
  const [briefData, setBriefData] = useState<{
    id: string;
    status: string;
    brief_content: string | null;
    risk_level: string | null;
    error_message: string | null;
    generated_at: string | null;
  } | null>(null);
  const [briefLoading, setBriefLoading] = useState(false);
  const [briefTriggering, setBriefTriggering] = useState(false);
  const [copied, setCopied] = useState(false);
  const [deliveryStatus, setDeliveryStatus] = useState('');
  const [deliveryLink, setDeliveryLink] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [signedUrls, setSignedUrls] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!userId) return;
    fetchClientData();
  }, [userId]);

  const fetchClientData = async () => {
    if (!userId) return;
    setLoading(true);

    try {
      const { data: profile } = await supabase
        .from('client_profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      const { data: intakeResult } = await supabase
        .from('intake_responses')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      const { data: uploadsData } = await supabase
        .from('intake_uploads')
        .select('*')
        .eq('user_id', userId);

      const { data: docsData } = await supabase
        .from('client_documents')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      const { data: ordersData } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId);

      setData({
        profile,
        intakeResponses: intakeResult?.responses || null,
        additionalNotes: intakeResult?.additional_notes || null,
        fileUploads: intakeResult?.file_uploads || {},
        intakeUploads: uploadsData || [],
        clientDocuments: docsData || [],
        orders: ordersData || [],
      });

      if (profile) {
        setDeliveryStatus(profile.delivery_status);
        setDeliveryLink(profile.delivery_link || '');
        setAdminNotes(profile.admin_notes || '');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchBrief = async () => {
    if (!userId) return;
    setBriefLoading(true);
    try {
      const { data, error } = await supabase
        .from('client_briefs')
        .select('id, status, brief_content, risk_level, error_message, generated_at')
        .eq('client_id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching brief:', error);
      } else {
        setBriefData(data);
      }
    } finally {
      setBriefLoading(false);
    }
  };

  const handleTriggerBrief = async () => {
    if (!userId) return;
    setBriefTriggering(true);
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const response = await fetch(`${supabaseUrl}/functions/v1/trigger-brief`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ clientId: userId }),
      });

      if (!response.ok) {
        const data = await response.json();
        console.error('Trigger brief error:', data.error);
        return;
      }

      // Insert a pending row locally so the UI updates immediately
      if (!briefData) {
        const { data: newBrief } = await supabase
          .from('client_briefs')
          .select('id, status, brief_content, risk_level, error_message, generated_at')
          .eq('client_id', userId)
          .maybeSingle();

        if (newBrief) {
          setBriefData(newBrief);
        }
      } else {
        setBriefData(prev => prev ? { ...prev, status: 'generating' } : prev);
      }
    } catch (err) {
      console.error('Trigger brief error:', err);
    } finally {
      setBriefTriggering(false);
    }
  };

  const handleCopyBrief = () => {
    if (briefData?.brief_content) {
      navigator.clipboard.writeText(briefData.brief_content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Fetch brief when the brief tab is active
  useEffect(() => {
    if (activeTab === 'brief' && userId) {
      fetchBrief();
    }
  }, [activeTab, userId]);

  // Poll for brief updates when generating
  useEffect(() => {
    if (activeTab !== 'brief' || !briefData || briefData.status === 'completed' || briefData.status === 'failed') return;
    if (briefData.status !== 'generating' && briefData.status !== 'pending') return;

    const interval = setInterval(fetchBrief, 10000);
    return () => clearInterval(interval);
  }, [activeTab, briefData?.status]);

  const generateSignedUrls = async () => {
    const urls: Record<string, string> = {};
    const paths: string[] = [];

    data.intakeUploads.forEach(f => paths.push(f.file_path));
    Object.values(data.fileUploads).flat().forEach((f: any) => {
      if (f.path) paths.push(f.path);
    });
    data.clientDocuments.forEach(d => paths.push(d.file_path));

    for (const path of paths) {
      const { data: urlData } = await supabase.storage
        .from(path.startsWith(userId! + '/') && data.intakeUploads.some(f => f.file_path === path) ? 'intake-uploads' : 'client-documents')
        .createSignedUrl(path, 3600);
      if (urlData?.signedUrl) {
        urls[path] = urlData.signedUrl;
      }
    }

    setSignedUrls(urls);
  };

  useEffect(() => {
    if (!loading && (data.intakeUploads.length > 0 || Object.keys(data.fileUploads).length > 0 || data.clientDocuments.length > 0)) {
      generateSignedUrls();
    }
  }, [loading, data.intakeUploads.length, data.clientDocuments.length]);

  const handleSaveProfile = async () => {
    if (!userId) return;

    setSaving(true);
    setSaveMessage('');

    try {
      const { error } = await supabase
        .from('client_profiles')
        .update({
          delivery_status: deliveryStatus,
          delivery_link: deliveryLink || null,
          admin_notes: adminNotes,
        })
        .eq('user_id', userId);

      if (error) throw error;

      setSaveMessage('Saved successfully');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (err) {
      console.error('Save error:', err);
      setSaveMessage('Error saving');
    } finally {
      setSaving(false);
    }
  };

  const handleDocumentUpload = async (files: FileList) => {
    if (!userId || !adminUser) return;

    setUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const filePath = `${userId}/${Date.now()}_${file.name}`;

        const { error: uploadError } = await supabase.storage
          .from('client-documents')
          .upload(filePath, file);

        if (uploadError) {
          console.error('Upload error:', uploadError);
          continue;
        }

        const { error: dbError } = await supabase.from('client_documents').insert({
          user_id: userId,
          file_name: file.name,
          file_path: filePath,
          file_size: file.size,
          file_type: file.type,
          uploaded_by: adminUser.id,
        });
        if (dbError) {
          console.error('Failed to record document in database:', dbError);
        }
      }

      fetchClientData();
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteDocument = async (docId: string, filePath: string) => {
    if (!confirm('Delete this document?')) return;

    try {
      await supabase.storage.from('client-documents').remove([filePath]);
      const { error: dbError } = await supabase.from('client_documents').delete().eq('id', docId);
      if (dbError) {
        console.error('Failed to delete document record:', dbError);
      }
      fetchClientData();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy" />
      </div>
    );
  }

  if (!data.profile) {
    return (
      <div className="text-center py-16">
        <AlertCircle size={40} className="text-secondary-text mx-auto mb-4" />
        <p className="font-inter text-secondary-text">Client not found.</p>
        <Link to="/personal/admin" className="font-inter text-medium-blue text-sm hover:underline mt-4 inline-block">
          Back to dashboard
        </Link>
      </div>
    );
  }

  const allSections = [...intakeFormSections, ...upsellFormSections];

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <Link
          to="/personal/admin"
          className="font-inter text-sm text-medium-blue hover:underline flex items-center gap-1 mb-3"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>
        <h1 className="font-inter font-bold text-navy text-2xl mb-1">
          Client Management
        </h1>
        <p className="font-inter text-secondary-text text-sm font-mono">
          {userId}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-border">
        {(['overview', 'intake', 'documents', 'uploads', 'brief'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`font-inter text-sm px-4 py-2.5 border-b-2 transition-colors ${
              activeTab === tab
                ? 'border-navy text-navy font-semibold'
                : 'border-transparent text-secondary-text hover:text-navy'
            }`}
          >
            {tab === 'uploads' ? 'Client Uploads' : tab === 'brief' ? 'Master Brief' : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Status & Controls */}
          <div className="bg-white rounded-lg border border-border p-6">
            <h3 className="font-inter font-semibold text-navy text-sm mb-4">Delivery Status & Controls</h3>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block font-inter font-medium text-dark-text text-sm mb-1.5">
                  Delivery Status
                </label>
                <select
                  value={deliveryStatus}
                  onChange={(e) => setDeliveryStatus(e.target.value)}
                  className="block w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-medium-blue focus:border-medium-blue font-inter text-sm bg-white"
                >
                  <option value="not_started">Not Started</option>
                  <option value="in_progress">In Progress</option>
                  <option value="delivered">Delivered</option>
                </select>
              </div>

              <div>
                <label className="block font-inter font-medium text-dark-text text-sm mb-1.5">
                  Delivery Link (folder URL)
                </label>
                <input
                  type="url"
                  value={deliveryLink}
                  onChange={(e) => setDeliveryLink(e.target.value)}
                  placeholder="e.g. Google Drive or Dropbox folder link"
                  className="block w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-medium-blue focus:border-medium-blue font-inter text-sm"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block font-inter font-medium text-dark-text text-sm mb-1.5">
                Admin Notes
              </label>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                rows={3}
                placeholder="Internal notes about this client..."
                className="block w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-medium-blue focus:border-medium-blue font-inter text-sm"
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleSaveProfile}
                disabled={saving}
                className="font-inter font-semibold text-white bg-navy rounded-md hover:bg-medium-blue transition-colors flex items-center gap-2 disabled:opacity-50"
                style={{ padding: '10px 20px', fontSize: '0.9rem' }}
              >
                {saving ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                ) : (
                  <Save size={16} />
                )}
                Save Changes
              </button>
              {saveMessage && (
                <span className={`font-inter text-sm ${saveMessage.includes('Error') ? 'text-danger' : 'text-success'}`}>
                  {saveMessage}
                </span>
              )}
            </div>
          </div>

          {/* Quick info */}
          <div className="grid md:grid-cols-3 gap-4">
            <InfoCard
              label="Intake Form"
              value={data.profile.has_submitted_intake ? 'Submitted' : 'Not Submitted'}
              detail={data.profile.intake_submitted_at
                ? new Date(data.profile.intake_submitted_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
                : 'Waiting for client'}
              status={data.profile.has_submitted_intake ? 'success' : 'pending'}
            />
            <InfoCard
              label="Document Status"
              value={data.profile.delivery_status === 'delivered' ? 'Delivered' : data.profile.delivery_status === 'in_progress' ? 'In Progress' : 'Not Started'}
              detail={data.profile.delivery_link ? 'Delivery link set' : 'No delivery link'}
              status={data.profile.delivery_status === 'delivered' ? 'success' : data.profile.delivery_status === 'in_progress' ? 'warning' : 'pending'}
            />
            <InfoCard
              label="Documents Uploaded"
              value={`${data.clientDocuments.length} files`}
              detail={data.clientDocuments.length > 0 ? 'Ready for client' : 'No documents uploaded yet'}
              status={data.clientDocuments.length > 0 ? 'success' : 'pending'}
            />
          </div>

          {/* Orders */}
          {data.orders.length > 0 && (
            <div className="bg-white rounded-lg border border-border p-6">
              <h3 className="font-inter font-semibold text-navy text-sm mb-4">Orders</h3>
              <div className="flex flex-col gap-2">
                {data.orders.map(order => (
                  <div key={order.id} className="flex items-center justify-between bg-off-white rounded-md px-4 py-3">
                    <div>
                      <span className="font-inter text-sm text-dark-text font-medium">{order.status}</span>
                      <span className="font-inter text-xs text-secondary-text ml-3">
                        {new Date(order.created_at).toLocaleDateString('en-GB')}
                      </span>
                    </div>
                    <span className="font-inter text-xs text-secondary-text font-mono">
                      {order.stripe_checkout_session_id?.substring(0, 20)}...
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Intake Tab */}
      {activeTab === 'intake' && (
        <div>
          {!data.intakeResponses ? (
            <div className="bg-white rounded-lg border border-border p-12 text-center">
              <FileText size={40} className="text-secondary-text mx-auto mb-4" />
              <p className="font-inter text-secondary-text">Client has not submitted their intake form yet.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {allSections.filter(s => s.fields.length > 0 && s.id !== 'intro').map(section => {
                const sectionResponses = section.fields
                  .filter(f => {
                    const val = data.intakeResponses?.[f.id];
                    const otherVal = data.intakeResponses?.[f.id + '_other'];
                    const noteVal = data.additionalNotes?.[f.id];
                    if (f.type === 'repeating_section') {
                      return val && Array.isArray(val) && val.length > 0;
                    }
                    const hasMain = val !== undefined && val !== null && val !== '' && !(Array.isArray(val) && val.length === 0);
                    const hasOther = otherVal && otherVal.trim() !== '';
                    const hasNote = noteVal && noteVal.trim() !== '';
                    return hasMain || hasOther || hasNote;
                  });

                if (sectionResponses.length === 0) return null;

                return (
                  <div key={section.id} className="bg-white rounded-lg border border-border p-6">
                    <h3 className="font-inter font-semibold text-navy text-sm mb-1">{section.title}</h3>
                    {section.usedIn && (
                      <p className="font-inter text-xs text-medium-blue mb-4 italic">Used in: {section.usedIn}</p>
                    )}
                    <div className="flex flex-col gap-4">
                      {section.fields.map(field => {
                        const val = data.intakeResponses?.[field.id];
                        const otherVal = data.intakeResponses?.[field.id + '_other'];
                        const noteVal = data.additionalNotes?.[field.id];
                        const hasMain = val !== undefined && val !== null && val !== '' && !(Array.isArray(val) && val.length === 0);
                        const hasOther = otherVal && otherVal.trim() !== '';
                        const hasNote = noteVal && noteVal.trim() !== '';
                        if (!hasMain && !hasOther && !hasNote) return null;

                        return (
                          <div key={field.id} className="border-b border-border pb-4 last:border-0 last:pb-0">
                            <div className="font-inter font-medium text-dark-text text-sm mb-1">
                              {field.questionNumber}. {field.label}
                            </div>
                            {hasMain && <FieldValue field={field} value={val} />}
                            {field.hasOtherOption && hasOther && (
                              <div className="mt-2 ml-2 pl-3 border-l-2 border-medium-blue">
                                <span className="font-inter text-xs text-medium-blue font-semibold">Other (specified):</span>
                                <p className="font-inter text-secondary-text text-sm mt-0.5">{String(otherVal)}</p>
                              </div>
                            )}
                            {hasNote && (
                              <div className="mt-2 bg-amber-50 border border-amber-200 rounded-md p-3">
                                <span className="font-inter text-xs text-amber-700 font-semibold">Additional note:</span>
                                <p className="font-inter text-secondary-text text-sm mt-0.5 whitespace-pre-line">{String(noteVal)}</p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Documents Tab - Upload delivery documents */}
      {activeTab === 'documents' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-border p-6">
            <h3 className="font-inter font-semibold text-navy text-sm mb-4">
              Upload Delivery Documents
            </h3>
            <p className="font-inter text-secondary-text text-xs mb-4">
              Upload the completed business foundations pack documents here. The client will be able to download them from their documents page.
            </p>

            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={(e) => {
                if (e.target.files) handleDocumentUpload(e.target.files);
              }}
              multiple
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="font-inter text-sm font-medium text-navy border-2 border-dashed border-gray-300 rounded-lg px-6 py-8 w-full hover:border-medium-blue hover:bg-off-white transition-colors flex flex-col items-center gap-2 disabled:opacity-50"
            >
              {uploading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-navy" />
              ) : (
                <Upload size={24} className="text-medium-blue" />
              )}
              <span>{uploading ? 'Uploading...' : 'Click to upload delivery documents'}</span>
              <span className="text-xs text-secondary-text">PDF, Word, ZIP files accepted</span>
            </button>

            {data.clientDocuments.length > 0 && (
              <div className="mt-6 flex flex-col gap-2">
                <h4 className="font-inter font-semibold text-navy text-xs uppercase tracking-wider mb-2">
                  Uploaded Documents ({data.clientDocuments.length})
                </h4>
                {data.clientDocuments.map(doc => {
                  const url = signedUrls[doc.file_path];
                  return (
                    <div key={doc.id} className="flex items-center gap-3 bg-off-white rounded-md px-4 py-3">
                      <FolderOpen size={18} className="text-medium-blue shrink-0" />
                      <span className="font-inter text-sm text-dark-text flex-1 truncate">{doc.file_name}</span>
                      <span className="font-inter text-xs text-secondary-text">
                        {(doc.file_size / 1024).toFixed(1)} KB
                      </span>
                      <span className="font-inter text-xs text-secondary-text">
                        {new Date(doc.created_at).toLocaleDateString('en-GB')}
                      </span>
                      {url && (
                        <>
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-medium-blue hover:text-navy transition-colors"
                            title="View file"
                          >
                            <ExternalLink size={16} />
                          </a>
                          <a
                            href={url}
                            download={doc.file_name}
                            className="text-medium-blue hover:text-navy transition-colors"
                            title="Download file"
                          >
                            <Download size={16} />
                          </a>
                        </>
                      )}
                      <button
                        onClick={() => handleDeleteDocument(doc.id, doc.file_path)}
                        className="text-secondary-text hover:text-danger transition-colors"
                        title="Delete"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Client Uploads Tab - Files the client uploaded during intake */}
      {activeTab === 'uploads' && (
        <div className="space-y-6">
          {data.intakeUploads.length === 0 && Object.keys(data.fileUploads).length === 0 ? (
            <div className="bg-white rounded-lg border border-border p-12 text-center">
              <Upload size={40} className="text-secondary-text mx-auto mb-4" />
              <p className="font-inter text-secondary-text">No files uploaded by the client.</p>
            </div>
          ) : (
            <>
              {/* File uploads from intake_uploads table */}
              {data.intakeUploads.length > 0 && (
                <div className="bg-white rounded-lg border border-border p-6">
                  <h3 className="font-inter font-semibold text-navy text-sm mb-4">
                    Client Uploaded Files ({data.intakeUploads.length})
                  </h3>
                  <div className="flex flex-col gap-2">
                    {data.intakeUploads.map(file => {
                      const url = signedUrls[file.file_path];
                      return (
                        <div key={file.id} className="flex items-center gap-3 bg-off-white rounded-md px-4 py-3">
                          <FileText size={18} className="text-medium-blue shrink-0" />
                          <div className="flex-1 min-w-0">
                            <span className="font-inter text-sm text-dark-text block truncate">{file.file_name}</span>
                            <span className="font-inter text-xs text-secondary-text">
                              Question: {file.question_id} | {(file.file_size / 1024).toFixed(1)} KB | {file.file_type || 'unknown type'}
                            </span>
                          </div>
                          {url && (
                            <>
                              <a
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-medium-blue hover:text-navy transition-colors"
                                title="View file"
                              >
                                <ExternalLink size={16} />
                              </a>
                              <a
                                href={url}
                                download={file.file_name}
                                className="text-medium-blue hover:text-navy transition-colors"
                                title="Download file"
                              >
                                <Download size={16} />
                              </a>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* File uploads stored in intake_responses.file_uploads (legacy) */}
              {Object.keys(data.fileUploads).length > 0 && (
                <div className="bg-white rounded-lg border border-border p-6">
                  <h3 className="font-inter font-semibold text-navy text-sm mb-4">
                    Additional File References
                  </h3>
                  <p className="font-inter text-secondary-text text-xs mb-4">
                    Files referenced in the intake response data.
                  </p>
                  <div className="flex flex-col gap-2">
                    {Object.entries(data.fileUploads).map(([fieldId, files]) =>
                      files.map((file: any, i: number) => {
                        const url = signedUrls[file.path];
                        return (
                          <div key={`${fieldId}-${i}`} className="flex items-center gap-3 bg-off-white rounded-md px-4 py-3">
                            <FileText size={18} className="text-medium-blue shrink-0" />
                            <div className="flex-1 min-w-0">
                              <span className="font-inter text-sm text-dark-text block truncate">{file.name}</span>
                              <span className="font-inter text-xs text-secondary-text">
                                Question: {fieldId} | {(file.size / 1024).toFixed(1)} KB
                              </span>
                            </div>
                            {url && (
                              <>
                                <a
                                  href={url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-medium-blue hover:text-navy transition-colors"
                                  title="View file"
                                >
                                  <ExternalLink size={16} />
                                </a>
                                <a
                                  href={url}
                                  download={file.name}
                                  className="text-medium-blue hover:text-navy transition-colors"
                                  title="Download file"
                                >
                                  <Download size={16} />
                                </a>
                              </>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Master Brief Tab */}
      {activeTab === 'brief' && (
        <div className="space-y-6">
          {briefLoading && !briefData ? (
            <div className="bg-white rounded-lg border border-border p-12 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy mx-auto mb-4" />
              <p className="font-inter text-secondary-text">Loading brief...</p>
            </div>
          ) : !briefData ? (
            <div className="bg-white rounded-lg border border-border p-12 text-center">
              <FileSearch size={40} className="text-secondary-text mx-auto mb-4" />
              <h3 className="font-inter font-semibold text-navy mb-2">No brief generated yet</h3>
              <p className="font-inter text-secondary-text text-sm mb-6">
                Generate a master brief from this client's intake responses.
              </p>
              <button
                onClick={handleTriggerBrief}
                disabled={briefTriggering}
                className="font-inter font-semibold text-white bg-navy rounded-md hover:bg-medium-blue transition-colors inline-flex items-center gap-2 disabled:opacity-50"
                style={{ padding: '10px 20px', fontSize: '0.9rem' }}
              >
                {briefTriggering ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                ) : (
                  <FileSearch size={16} />
                )}
                Generate Brief
              </button>
            </div>
          ) : briefData.status === 'pending' || briefData.status === 'generating' ? (
            <div className="bg-white rounded-lg border border-border p-12 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy mx-auto mb-4" />
              <h3 className="font-inter font-semibold text-navy mb-2">Brief is being generated</h3>
              <p className="font-inter text-secondary-text text-sm">
                Check back in 60 seconds
              </p>
            </div>
          ) : briefData.status === 'failed' ? (
            <div className="bg-white rounded-lg border border-border p-6">
              <div className="flex items-start gap-4">
                <div className="bg-red-50 rounded-lg p-3 shrink-0">
                  <AlertCircle size={24} className="text-danger" />
                </div>
                <div className="flex-1">
                  <h3 className="font-inter font-semibold text-navy mb-2">Brief generation failed</h3>
                  {briefData.error_message && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
                      <p className="font-inter text-sm text-danger">{briefData.error_message}</p>
                    </div>
                  )}
                  <button
                    onClick={handleTriggerBrief}
                    disabled={briefTriggering}
                    className="font-inter font-semibold text-white bg-navy rounded-md hover:bg-medium-blue transition-colors inline-flex items-center gap-2 disabled:opacity-50"
                    style={{ padding: '10px 20px', fontSize: '0.9rem' }}
                  >
                    {briefTriggering ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    ) : (
                      <RefreshCw size={16} />
                    )}
                    Retry
                  </button>
                </div>
              </div>
            </div>
          ) : briefData.status === 'completed' ? (
            <div className="space-y-4">
              {/* Risk level badge */}
              {briefData.risk_level && (
                <div className="bg-white rounded-lg border border-border p-5 flex items-center gap-4">
                  <span className="font-inter font-semibold text-navy text-sm">Risk Level:</span>
                  <span
                    className={`font-inter font-bold text-sm px-3 py-1 rounded-full ${
                      briefData.risk_level === 'Low'
                        ? 'bg-green-50 text-green-800 border border-green-200'
                        : briefData.risk_level === 'Medium'
                        ? 'bg-amber-50 text-amber-800 border border-amber-200'
                        : 'bg-red-50 text-red-800 border border-red-200'
                    }`}
                  >
                    {briefData.risk_level}
                  </span>
                  {briefData.generated_at && (
                    <span className="font-inter text-xs text-secondary-text ml-auto">
                      Generated {new Date(briefData.generated_at).toLocaleString('en-GB')}
                    </span>
                  )}
                </div>
              )}

              {/* Brief content */}
              <div className="bg-white rounded-lg border border-border p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-inter font-semibold text-navy text-sm">Brief Content</h3>
                  <button
                    onClick={handleCopyBrief}
                    className="font-inter text-sm font-medium text-navy border border-border rounded-md hover:bg-off-white transition-colors inline-flex items-center gap-2"
                    style={{ padding: '6px 14px', fontSize: '0.85rem' }}
                  >
                    <Copy size={14} />
                    {copied ? 'Copied!' : 'Copy to Clipboard'}
                  </button>
                </div>
                <div
                  className="font-mono text-sm text-dark-text bg-off-white rounded-md p-5 overflow-y-auto whitespace-pre-wrap leading-[1.7]"
                  style={{ maxHeight: 600 }}
                >
                  {briefData.brief_content || 'No content available.'}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

// ── Helper Components ──

function InfoCard({ label, value, detail, status }: {
  label: string;
  value: string;
  detail: string;
  status: 'success' | 'warning' | 'pending';
}) {
  const statusColors = {
    success: 'text-success',
    warning: 'text-amber-600',
    pending: 'text-secondary-text',
  };

  return (
    <div className="bg-white rounded-lg border border-border p-5">
      <p className="font-inter text-xs text-secondary-text uppercase tracking-wider mb-2">{label}</p>
      <p className={`font-inter font-semibold text-sm ${statusColors[status]}`}>{value}</p>
      <p className="font-inter text-xs text-secondary-text mt-1">{detail}</p>
    </div>
  );
}

function FieldValue({ field, value }: { field: FormField; value: any }) {
  if (field.type === 'single_choice' || field.type === 'short_text' || field.type === 'email' || field.type === 'phone' || field.type === 'url') {
    return <p className="font-inter text-secondary-text text-sm">{String(value)}</p>;
  }

  if (field.type === 'long_text') {
    return <p className="font-inter text-secondary-text text-sm whitespace-pre-line">{String(value)}</p>;
  }

  if (field.type === 'multi_select' && Array.isArray(value)) {
    return (
      <div className="flex flex-wrap gap-1.5 mt-1">
        {value.map((v: string) => (
          <span key={v} className="font-inter text-xs bg-off-white text-navy px-2 py-1 rounded-md">
            {v}
          </span>
        ))}
      </div>
    );
  }

  if (field.type === 'checkbox') {
    return (
      <span className={`font-inter text-sm ${value === 'Yes' ? 'text-success' : 'text-secondary-text'}`}>
        {value === 'Yes' ? 'Confirmed' : 'Not confirmed'}
      </span>
    );
  }

  if (field.type === 'repeating_section' && Array.isArray(value)) {
    return (
      <div className="flex flex-col gap-3 mt-2">
        {value.map((item: Record<string, string>, i: number) => (
          <div key={i} className="bg-off-white rounded-md p-4 border border-border">
            <p className="font-inter font-medium text-navy text-xs mb-2">Service {i + 1}</p>
            {field.subFields?.map(sf => (
              <div key={sf.id} className="mb-2 last:mb-0">
                <span className="font-inter text-xs text-secondary-text">{sf.label}: </span>
                <span className="font-inter text-xs text-dark-text">{item[sf.id] || '—'}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }

  if (field.type === 'file_upload') {
    return <p className="font-inter text-secondary-text text-xs italic">File uploaded (see Client Uploads tab)</p>;
  }

  return <p className="font-inter text-secondary-text text-sm">{JSON.stringify(value)}</p>;
}
