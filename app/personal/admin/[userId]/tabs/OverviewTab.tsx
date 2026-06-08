'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { getDocumentTypesForService } from '@/lib/services/document-service-map';
import {
  Briefcase, Zap, Send, CheckCircle2, Clock, AlertTriangle,
  RefreshCw, ArrowRight, Mail, Phone, MapPin, CreditCard, ExternalLink,
  MessageSquare, DollarSign, Package, Calendar, Plus, StickyNote, FileText
} from 'lucide-react';

interface OverviewTabProps {
  userId: string;
  data: any;
  refreshData: () => void;
}

export default function OverviewTab({ userId, data, refreshData }: OverviewTabProps) {
  const [generatingBrief, setGeneratingBrief] = useState(false);
  const [actionMessage, setActionMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const [adminNotes, setAdminNotes] = useState(data.profile?.admin_notes || '');
  const [autoDeleteDays, setAutoDeleteDays] = useState(30);
  const [documents, setDocuments] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [contactMessages, setContactMessages] = useState<any[]>([]);

  useEffect(() => {
    fetchAllData();
  }, [userId]);

  const fetchAllData = async () => {
    fetchDocuments();
    fetchOrders();
    fetchContactMessages();
  };

  const fetchDocuments = async () => {
    const { data: docs } = await supabase
      .from('generated_documents')
      .select('*')
      .eq('client_id', userId)
      .eq('status', 'completed');
    setDocuments(docs || []);
  };

  const fetchOrders = async () => {
    const { data: ordersData } = await supabase
      .from('stripe_orders')
      .select('*')
      .eq('customer_id', userId)
      .order('created_at', { ascending: false });
    setOrders(ordersData || []);
  };

  const fetchContactMessages = async () => {
    const { data: messagesData } = await supabase
      .from('contact_messages')
      .select('*')
      .eq('email', data.email)
      .order('created_at', { ascending: false });
    setContactMessages(messagesData || []);
  };

  const handleGenerateBrief = async () => {
    if (!data.profile.has_submitted_intake) {
      setActionMessage('Client must submit intake form first');
      setTimeout(() => setActionMessage(''), 3000);
      return;
    }

    setGeneratingBrief(true);
    setActionMessage('');

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/generate-brief`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ user_id: userId }),
        }
      );

      const result = await response.json();

      if (response.ok && result.success) {
        setActionMessage('Brief generated successfully!');
        refreshData();
      } else {
        setActionMessage(result.error || 'Failed to generate brief');
      }
    } catch (error: any) {
      setActionMessage(error.message || 'Error generating brief');
    } finally {
      setGeneratingBrief(false);
      setTimeout(() => setActionMessage(''), 5000);
    }
  };

  const handleSaveNotes = async () => {
    setSaving(true);

    try {
      const { error } = await supabase
        .from('client_profiles')
        .update({
          admin_notes: adminNotes,
        })
        .eq('user_id', userId);

      if (error) {
        setActionMessage('Error saving notes');
      } else {
        setActionMessage('Notes saved successfully');
        refreshData();
        setTimeout(() => setActionMessage(''), 3000);
      }
    } catch (error) {
      setActionMessage('Error saving notes');
    } finally {
      setSaving(false);
    }
  };

  const handleSetAutoDelete = async () => {
    const deleteDate = new Date();
    deleteDate.setDate(deleteDate.getDate() + autoDeleteDays);

    const confirm = window.confirm(
      `Set auto-delete for ${autoDeleteDays} days from now (${deleteDate.toLocaleDateString('en-GB')})? Documents will be automatically deleted after this date.`
    );
    if (!confirm) return;

    setSaving(true);

    try {
      await supabase
        .from('generated_documents')
        .update({
          auto_delete_at: deleteDate.toISOString(),
        })
        .eq('client_id', userId);

      setActionMessage(`Auto-delete set for ${autoDeleteDays} days`);
      fetchDocuments();
    } catch (error) {
      setActionMessage('Error setting auto-delete');
    } finally {
      setSaving(false);
      setTimeout(() => setActionMessage(''), 3000);
    }
  };

  const intake = data.intakeResponses || {};
  const deliveredCount = documents.filter(d => d.delivered_to_client).length;
  const totalCount = documents.length;

  return (
    <div className="space-y-6">
      {/* Action Message */}
      {actionMessage && (
        <div className={`rounded-lg p-4 ${
          actionMessage.includes('success') || actionMessage.includes('Generated')
            ? 'bg-green-50 border border-green-200 text-green-800'
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          <p className="font-inter text-sm font-medium">{actionMessage}</p>
        </div>
      )}

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Intake Status */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-100 rounded-lg p-2">
              <FileText size={20} className="text-blue-600" />
            </div>
            <div>
              <h4 className="font-inter font-semibold text-gray-900">Intake Form</h4>
              <p className="font-inter text-gray-600 text-sm">
                {data.profile.has_submitted_intake ? 'Complete' : 'Pending'}
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-inter text-gray-600">Status</span>
              <span className={`font-inter font-medium ${data.profile.has_submitted_intake ? 'text-green-700' : 'text-amber-700'}`}>
                {data.profile.has_submitted_intake ? 'Submitted' : 'Awaiting submission'}
              </span>
            </div>
            {data.intakeMetadata?.submitted_at && (
              <div className="flex items-center justify-between text-sm">
                <span className="font-inter text-gray-600">Submitted</span>
                <span className="font-inter text-gray-900">
                  {new Date(data.intakeMetadata.submitted_at).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Brief Status */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-purple-100 rounded-lg p-2">
              <Briefcase size={20} className="text-purple-600" />
            </div>
            <div>
              <h4 className="font-inter font-semibold text-gray-900">Master Brief</h4>
              <p className="font-inter text-gray-600 text-sm">AI-generated client brief</p>
            </div>
          </div>
          <BriefStatusBadge userId={userId} />
        </div>

        {/* Documents Status */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-green-100 rounded-lg p-2">
              <FileText size={20} className="text-green-600" />
            </div>
            <div>
              <h4 className="font-inter font-semibold text-gray-900">Documents</h4>
              <p className="font-inter text-gray-600 text-sm">Generated documents</p>
            </div>
          </div>
          <DocumentsStatusCount userId={userId} purchasedServiceIds={data.purchasedServices?.map((s: any) => s.service_id) || []} />
        </div>

        {/* Delivery Status */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-amber-100 rounded-lg p-2">
              <Send size={20} className="text-amber-600" />
            </div>
            <div>
              <h4 className="font-inter font-semibold text-gray-900">Delivery</h4>
              <p className="font-inter text-gray-600 text-sm">Client delivery status</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-inter text-gray-600">Status</span>
              <span className={`font-inter font-medium ${
                data.profile.delivery_status === 'delivered' ? 'text-green-700' :
                data.profile.delivery_status === 'in_progress' ? 'text-amber-700' : 'text-gray-700'
              }`}>
                {data.profile.delivery_status.replace('_', ' ')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="font-inter font-bold text-[#1B3F7A] text-lg mb-4">
          Contact Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {intake.q7_document_email && (
            <ContactItem
              icon={Mail}
              label="Email"
              value={intake.q7_document_email}
              href={`mailto:${intake.q7_document_email}`}
            />
          )}
          {intake.q8_business_phone && (
            <ContactItem
              icon={Phone}
              label="Phone"
              value={intake.q8_business_phone}
              href={`tel:${intake.q8_business_phone}`}
            />
          )}
          {intake.q6_business_address && (
            <div className="md:col-span-2">
              <ContactItem
                icon={MapPin}
                label="Address"
                value={intake.q6_business_address}
              />
            </div>
          )}
          {intake.q10_website_url && (
            <ContactItem
              icon={ExternalLink}
              label="Website"
              value={intake.q10_website_url}
              href={intake.q10_website_url}
              external
            />
          )}
        </div>
      </div>

      {/* Business Details */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="font-inter font-bold text-[#1B3F7A] text-lg mb-4">
          Business Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <BusinessItem label="Legal Name" value={intake.q1_legal_name} />
          <BusinessItem label="Trading Name" value={intake.q2_business_name} />
          <BusinessItem label="Business Type" value={intake.q3_business_registered} />
          {intake.q4_companies_house && (
            <BusinessItem label="Companies House No." value={intake.q4_companies_house} />
          )}
          <BusinessItem label="Jurisdiction" value={intake.q5_jurisdiction} />
          <BusinessItem label="VAT Registered" value={intake.q34_vat_registered} />
          {intake.q35_vat_number && (
            <BusinessItem label="VAT Number" value={intake.q35_vat_number} />
          )}
        </div>
      </div>

      {/* Admin Notes */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="font-inter font-bold text-[#1B3F7A] text-lg mb-4">
          Admin Notes
        </h3>
        <textarea
          value={adminNotes}
          onChange={(e) => setAdminNotes(e.target.value)}
          rows={6}
          className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2C68C4] focus:border-[#2C68C4] font-inter text-sm mb-4"
          placeholder="Add notes about this client..."
        />
        <button
          onClick={handleSaveNotes}
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#1B3F7A] hover:bg-[#2C68C4] text-white rounded-md font-inter text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              Saving...
            </>
          ) : (
            <>
              <FileText size={16} />
              Save Notes
            </>
          )}
        </button>
      </div>

      {/* Auto-Delete Settings */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-start gap-3 mb-4">
          <AlertTriangle size={20} className="text-amber-600 shrink-0" />
          <div>
            <h3 className="font-inter font-bold text-[#1B3F7A] text-lg">
              Auto-Delete Settings
            </h3>
            <p className="font-inter text-gray-600 text-sm">
              Automatically delete documents after a specified period for security/compliance.
            </p>
          </div>
        </div>

        <div className="flex items-end gap-3">
          <div className="flex-1">
            <label className="block font-inter font-medium text-gray-700 text-sm mb-2">
              Auto-delete after
            </label>
            <select
              value={autoDeleteDays}
              onChange={(e) => setAutoDeleteDays(parseInt(e.target.value))}
              className="w-full md:w-48 px-4 py-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2C68C4] focus:border-[#2C68C4] font-inter text-sm bg-white"
            >
              <option value={7}>7 days</option>
              <option value={14}>14 days</option>
              <option value={30}>30 days</option>
              <option value={60}>60 days</option>
              <option value={90}>90 days</option>
              <option value={180}>6 months</option>
            </select>
          </div>
          <button
            onClick={handleSetAutoDelete}
            disabled={saving}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-md font-inter text-sm font-semibold transition-colors disabled:opacity-50"
          >
            <Calendar size={16} />
            Set Auto-Delete
          </button>
        </div>
      </div>

      {/* Prerequisite Warning */}
      {!data.profile.has_submitted_intake && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle size={20} className="text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-inter font-semibold text-amber-900 text-sm mb-1">
                Intake Form Required
              </p>
              <p className="font-inter text-amber-700 text-xs">
                Client must submit their intake form before you can generate the brief or documents.
                Contact the client to remind them to complete the form.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function BriefStatusBadge({ userId }: { userId: string }) {
  const [brief, setBrief] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrief = async () => {
      const { data } = await supabase
        .from('client_briefs')
        .select('status, risk_level, generated_at')
        .eq('client_id', userId)
        .maybeSingle();
      setBrief(data);
      setLoading(false);
    };
    fetchBrief();
  }, [userId]);

  if (loading) {
    return <div className="animate-pulse h-4 bg-gray-200 rounded w-20" />;
  }

  if (!brief) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <Clock size={16} className="text-gray-400" />
        <span className="font-inter text-gray-600">Not generated</span>
      </div>
    );
  }

  const statusConfig: Record<string, { color: string; label: string }> = {
    pending: { color: 'text-gray-600', label: 'Pending' },
    generating: { color: 'text-blue-600', label: 'Generating...' },
    completed: { color: 'text-green-600', label: 'Completed' },
    failed: { color: 'text-red-600', label: 'Failed' },
  };

  const status = statusConfig[brief.status] || statusConfig.pending;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-inter text-gray-600">Status</span>
        <span className={`font-inter font-medium ${status.color}`}>
          {status.label}
        </span>
      </div>
      {brief.generated_at && (
        <div className="flex items-center justify-between text-sm">
          <span className="font-inter text-gray-600">Generated</span>
          <span className="font-inter text-gray-900">
            {new Date(brief.generated_at).toLocaleDateString('en-GB')}
          </span>
        </div>
      )}
      {brief.risk_level && (
        <div className="flex items-center justify-between text-sm">
          <span className="font-inter text-gray-600">Risk Level</span>
          <span className={`font-inter font-medium ${
            brief.risk_level === 'High' ? 'text-red-600' :
            brief.risk_level === 'Medium' ? 'text-amber-600' : 'text-green-600'
          }`}>
            {brief.risk_level}
          </span>
        </div>
      )}
    </div>
  );
}

function DocumentsStatusCount({ userId, purchasedServiceIds }: { userId: string; purchasedServiceIds: string[] }) {
  const [counts, setCounts] = useState({ total: 0, completed: 0, delivered: 0, expected: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      // Compute expected document count from purchased services
      const expectedTypes = new Set<string>();
      for (const serviceId of purchasedServiceIds) {
        for (const docType of getDocumentTypesForService(serviceId)) {
          expectedTypes.add(docType);
        }
      }
      const expected = expectedTypes.size;

      const { count: total } = await supabase
        .from('generated_documents')
        .select('*', { count: 'exact', head: true })
        .eq('client_id', userId);

      const { count: completed } = await supabase
        .from('generated_documents')
        .select('*', { count: 'exact', head: true })
        .eq('client_id', userId)
        .eq('status', 'completed');

      const { count: delivered } = await supabase
        .from('generated_documents')
        .select('*', { count: 'exact', head: true })
        .eq('client_id', userId)
        .eq('delivered_to_client', true);

      setCounts({ total: total || 0, completed: completed || 0, delivered: delivered || 0, expected });
      setLoading(false);
    };
    fetchCounts();
  }, [userId, purchasedServiceIds]);

  if (loading) {
    return <div className="animate-pulse h-4 bg-gray-200 rounded w-20" />;
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-inter text-gray-600">Generated</span>
        <span className="font-inter text-gray-900">{counts.total} / {counts.expected || counts.total}</span>
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="font-inter text-gray-600">Completed</span>
        <span className="font-inter text-green-600">{counts.completed}</span>
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="font-inter text-gray-600">Delivered</span>
        <span className="font-inter text-blue-600">{counts.delivered}</span>
      </div>
    </div>
  );
}

function ContactItem({ icon: Icon, label, value, href, external }: any) {
  const content = (
    <div className="flex items-start gap-3">
      <div className="bg-[#FAFBFC] rounded-lg p-2 shrink-0">
        <Icon size={16} className="text-[#1B3F7A]" />
      </div>
      <div>
        <p className="font-inter text-gray-600 text-xs mb-1">{label}</p>
        <p className="font-inter text-gray-900 text-sm">{value}</p>
      </div>
    </div>
  );

  if (href) {
    return (
      <a href={href} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined}
        className="block hover:bg-gray-50 rounded-lg p-3 transition-colors -m-3">
        {content}
      </a>
    );
  }

  return <div className="p-3">{content}</div>;
}

function BusinessItem({ label, value }: { label: string; value: string }) {
  if (!value) return null;

  return (
    <div>
      <p className="font-inter text-gray-600 text-xs mb-1">{label}</p>
      <p className="font-inter text-gray-900 text-sm">{value}</p>
    </div>
  );
}
