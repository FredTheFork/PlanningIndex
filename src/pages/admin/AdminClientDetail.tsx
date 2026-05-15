import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { intakeFormSections, upsellFormSections, FormField } from '../../lib/intakeFormDefinition';
import {
  ArrowLeft, FileText, Upload, X,
  Save, AlertCircle, FolderOpen
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
    fileUploads: {},
    intakeUploads: [],
    clientDocuments: [],
    orders: [],
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'intake' | 'documents' | 'uploads'>('overview');
  const [deliveryStatus, setDeliveryStatus] = useState('');
  const [deliveryLink, setDeliveryLink] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!userId) return;
    fetchClientData();
  }, [userId]);

  const fetchClientData = async () => {
    if (!userId) return;
    setLoading(true);

    try {
      // Profile
      const { data: profile } = await supabase
        .from('client_profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      // Intake responses
      const { data: intakeData } = await supabase
        .from('intake_responses')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      // Intake file uploads
      const { data: uploads } = await supabase
        .from('intake_uploads')
        .select('*')
        .eq('user_id', userId);

      // Client documents
      const { data: docs } = await supabase
        .from('client_documents')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      // Orders
      const { data: orders } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId);

      setData({
        profile,
        intakeResponses: intakeData?.responses || null,
        fileUploads: intakeData?.file_uploads || {},
        intakeUploads: uploads || [],
        clientDocuments: docs || [],
        orders: orders || [],
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

        await supabase.from('client_documents').insert({
          user_id: userId,
          file_name: file.name,
          file_path: filePath,
          file_size: file.size,
          file_type: file.type,
          uploaded_by: adminUser.id,
        });
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
      await supabase.from('client_documents').delete().eq('id', docId);
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
        {(['overview', 'intake', 'documents', 'uploads'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`font-inter text-sm px-4 py-2.5 border-b-2 transition-colors capitalize ${
              activeTab === tab
                ? 'border-navy text-navy font-semibold'
                : 'border-transparent text-secondary-text hover:text-navy'
            }`}
          >
            {tab === 'uploads' ? 'Client Uploads' : tab}
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
                    if (f.type === 'repeating_section') {
                      return val && Array.isArray(val) && val.length > 0;
                    }
                    return val !== undefined && val !== null && val !== '' && !(Array.isArray(val) && val.length === 0);
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
                        if (val === undefined || val === null || val === '' || (Array.isArray(val) && val.length === 0)) return null;

                        return (
                          <div key={field.id} className="border-b border-border pb-4 last:border-0 last:pb-0">
                            <div className="font-inter font-medium text-dark-text text-sm mb-1">
                              {field.questionNumber}. {field.label}
                            </div>
                            <FieldValue field={field} value={val} />
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
                {data.clientDocuments.map(doc => (
                  <div key={doc.id} className="flex items-center gap-3 bg-off-white rounded-md px-4 py-3">
                    <FolderOpen size={18} className="text-medium-blue shrink-0" />
                    <span className="font-inter text-sm text-dark-text flex-1 truncate">{doc.file_name}</span>
                    <span className="font-inter text-xs text-secondary-text">
                      {(doc.file_size / 1024).toFixed(1)} KB
                    </span>
                    <span className="font-inter text-xs text-secondary-text">
                      {new Date(doc.created_at).toLocaleDateString('en-GB')}
                    </span>
                    <button
                      onClick={() => handleDeleteDocument(doc.id, doc.file_path)}
                      className="text-secondary-text hover:text-danger transition-colors"
                      title="Delete"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
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
                    {data.intakeUploads.map(file => (
                      <div key={file.id} className="flex items-center gap-3 bg-off-white rounded-md px-4 py-3">
                        <FileText size={18} className="text-medium-blue shrink-0" />
                        <div className="flex-1 min-w-0">
                          <span className="font-inter text-sm text-dark-text block truncate">{file.file_name}</span>
                          <span className="font-inter text-xs text-secondary-text">
                            Question: {file.question_id} | {(file.file_size / 1024).toFixed(1)} KB
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
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
