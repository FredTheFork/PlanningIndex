'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';
import {
  Mail, Phone, MapPin, ExternalLink, AlertTriangle, Calendar, FileText, Unlock, Clock, CheckCircle2, Activity, MessageCircle
} from 'lucide-react';
import AdminNotesTimeline from '@/components/admin/AdminNotesTimeline';
import { logActivity, fetchActivityLog, type ActivityLogEntry } from '@/lib/admin/activity-log';
import { useAuth } from '@/hooks/useAuth';

interface OverviewTabProps {
  userId: string;
  data: any;
  refreshData: () => void;
  showToast?: (params: { message: string; type: 'success' | 'error' | 'info' | 'warning'; retryFn?: () => void }) => void;
  onNavigateTab?: (tab: string) => void;
}

export default function OverviewTab({ userId, data, refreshData, showToast: externalShowToast, onNavigateTab }: OverviewTabProps) {
  const [saving, setSaving] = useState(false);
  const [adminNotes, setAdminNotes] = useState(data.profile?.admin_notes || '');
  const [autoDeleteDays, setAutoDeleteDays] = useState(30);
  const [confirmAutoDelete, setConfirmAutoDelete] = useState(false);
  const [editStatus, setEditStatus] = useState<{ edit_requested_at: string | null; edit_granted_at: string | null; edit_granted_by: string | null } | null>(null);
  const [activityLog, setActivityLog] = useState<ActivityLogEntry[]>([]);
  const [activityLoading, setActivityLoading] = useState(true);
  const [adminInfo, setAdminInfo] = useState<{ id: string; email: string } | null>(null);

  const { user } = useAuth();

  // Local toast fallback if no external showToast provided
  const showToast = useCallback((params: { message: string; type: 'success' | 'error' | 'info' | 'warning'; retryFn?: () => void }) => {
    if (externalShowToast) {
      externalShowToast(params);
    }
  }, [externalShowToast]);

  // Fetch admin user info
  useEffect(() => {
    if (user?.id) {
      setAdminInfo({ id: user?.id || '', email: user?.email || '' });
    } else {
      // Fallback: query admin_users table
      supabase
        .from('admin_users')
        .select('user_id, email')
        .limit(1)
        .then(({ data }) => {
          if (data && data.length > 0) {
            setAdminInfo({ id: data[0].user_id, email: data[0].email || '' });
          }
        });
    }
  }, [user]);

  useEffect(() => {
    supabase
      .from('intake_responses')
      .select('edit_requested_at, edit_granted_at, edit_granted_by')
      .eq('user_id', userId)
      .maybeSingle()
      .then(({ data }) => {
        if (data) setEditStatus(data);
      });
  }, [userId]);

  // Fetch activity log
  useEffect(() => {
    fetchActivityLog(userId, 20).then((entries) => {
      setActivityLog(entries);
      setActivityLoading(false);
    });
  }, [userId]);

  const handleSaveNotes = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('client_profiles')
        .update({ admin_notes: adminNotes })
        .eq('user_id', userId);

      if (error) {
        showToast({ message: 'Error saving notes.', type: 'error', retryFn: handleSaveNotes });
      } else {
        showToast({ message: 'Notes saved successfully.', type: 'success' });
        refreshData();
        if (adminInfo) {
          logActivity({ adminId: adminInfo.id, adminEmail: adminInfo.email, clientId: userId, actionType: 'note_added', actionLabel: 'Updated legacy admin notes' });
        }
      }
    } catch {
      showToast({ message: 'Network error saving notes.', type: 'error', retryFn: handleSaveNotes });
    } finally {
      setSaving(false);
    }
  };

  const handleSetAutoDelete = async () => {
    const deleteDate = new Date();
    deleteDate.setDate(deleteDate.getDate() + autoDeleteDays);

    setSaving(true);
    try {
      const { error } = await supabase
        .from('generated_documents')
        .update({ auto_delete_at: deleteDate.toISOString() })
        .eq('client_id', userId);

      if (error) {
        showToast({ message: 'Error setting auto-delete.', type: 'error', retryFn: handleSetAutoDelete });
      } else {
        showToast({ message: `Auto-delete set for ${autoDeleteDays} days.`, type: 'success' });
        if (adminInfo) {
          logActivity({ adminId: adminInfo.id, adminEmail: adminInfo.email, clientId: userId, actionType: 'auto_delete_set', actionLabel: `Set auto-delete to ${autoDeleteDays} days`, metadata: { days: autoDeleteDays } });
        }
      }
    } catch {
      showToast({ message: 'Network error setting auto-delete.', type: 'error', retryFn: handleSetAutoDelete });
    } finally {
      setSaving(false);
      setConfirmAutoDelete(false);
    }
  };

  const intake = data.intakeResponses || {};

  const getActivityColor = (actionType: string): string => {
    if (actionType.includes('deliver')) return 'bg-green-500';
    if (actionType.includes('brief')) return 'bg-blue-500';
    if (actionType.includes('note')) return 'bg-amber-500';
    if (actionType.includes('upload') || actionType.includes('file')) return 'bg-teal-500';
    if (actionType.includes('delete')) return 'bg-red-500';
    return 'bg-gray-400';
  };

  return (
    <div className="space-y-6">
      {/* Contact Information */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="font-inter font-bold text-[#1B3F7A] text-lg mb-4">Contact Information</h3>
        {(!intake.q7_document_email && !intake.q8_business_phone && !intake.q6_business_address && !intake.q10_website_url) ? (
          <div className="text-center py-6">
            <Mail size={36} className="text-gray-300 mx-auto mb-2" />
            <p className="font-inter text-sm text-gray-500">No contact details yet — visible after intake submission.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {intake.q7_document_email && (
              <ContactItem icon={Mail} label="Email" value={intake.q7_document_email} href={`mailto:${intake.q7_document_email}`} />
            )}
            {intake.q8_business_phone && (
              <ContactItem icon={Phone} label="Phone" value={intake.q8_business_phone} href={`tel:${intake.q8_business_phone}`} />
            )}
            {intake.q6_business_address && (
              <div className="md:col-span-2">
                <ContactItem icon={MapPin} label="Address" value={intake.q6_business_address} />
              </div>
            )}
            {intake.q10_website_url && (
              <ContactItem icon={ExternalLink} label="Website" value={intake.q10_website_url} href={intake.q10_website_url} external />
            )}
          </div>
        )}
      </div>

      {/* Business Details */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="font-inter font-bold text-[#1B3F7A] text-lg mb-4">Business Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <BusinessItem label="Legal Name" value={intake.q1_legal_name} />
          <BusinessItem label="Trading Name" value={intake.q2_business_name} />
          <BusinessItem label="Business Type" value={intake.q3_business_registered} />
          {intake.q4_companies_house && <BusinessItem label="Companies House No." value={intake.q4_companies_house} />}
          <BusinessItem label="Jurisdiction" value={intake.q5_jurisdiction} />
          <BusinessItem label="VAT Registered" value={intake.q34_vat_registered} />
          {intake.q35_vat_number && <BusinessItem label="VAT Number" value={intake.q35_vat_number} />}
        </div>
      </div>

      {/* Intake Edit Status */}
      {editStatus && (editStatus.edit_requested_at || editStatus.edit_granted_at) && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-inter font-bold text-[#1B3F7A] text-lg mb-4">Intake Edit Status</h3>
          <div className="space-y-3">
            {editStatus.edit_granted_at && (
              <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg p-3">
                <Unlock size={18} className="text-green-600 shrink-0" />
                <div>
                  <p className="font-inter font-semibold text-green-900 text-sm">Edit Access Granted</p>
                  <p className="font-inter text-green-700 text-xs">
                    Granted on {new Date(editStatus.edit_granted_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                  <p className="font-inter text-green-600 text-xs mt-1">Client can now re-enter and edit their intake form.</p>
                </div>
              </div>
            )}
            {editStatus.edit_requested_at && !editStatus.edit_granted_at && (
              <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-lg p-3">
                <Clock size={18} className="text-amber-600 shrink-0" />
                <div>
                  <p className="font-inter font-semibold text-amber-900 text-sm">Edit Requested</p>
                  <p className="font-inter text-amber-700 text-xs">
                    Requested on {new Date(editStatus.edit_requested_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                  <p className="font-inter text-amber-600 text-xs mt-1">
                    {onNavigateTab && (
                      <button onClick={() => onNavigateTab('messaging')} className="underline hover:text-amber-900">
                        Go to the Messages tab to grant or deny edit access.
                      </button>
                    )}
                    {!onNavigateTab && 'Go to the Messages tab to grant or deny edit access.'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Admin Notes Timeline */}
      {adminInfo && (
        <AdminNotesTimeline
          clientId={userId}
          adminId={adminInfo.id}
          adminEmail={adminInfo.email}
          showToast={showToast}
        />
      )}

      {/* Legacy Quick Note */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="font-inter font-bold text-[#1B3F7A] text-lg mb-1">Legacy Quick Note</h3>
        <p className="font-inter text-gray-500 text-xs mb-4">Saved directly on the client profile.</p>
        <textarea
          value={adminNotes}
          onChange={(e) => setAdminNotes(e.target.value)}
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2C68C4] focus:border-[#2C68C4] font-inter text-sm mb-4 resize-y"
          placeholder="Add a quick note about this client..."
        />
        <button
          onClick={handleSaveNotes}
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#1B3F7A] hover:bg-[#2C68C4] text-white rounded-md font-inter text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? (
            <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" /> Saving...</>
          ) : (
            <><FileText size={16} /> Save Notes</>
          )}
        </button>
      </div>

      {/* Activity Log */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Activity size={18} className="text-[#1B3F7A]" />
          <h3 className="font-inter font-bold text-[#1B3F7A] text-lg">Activity Log</h3>
          <span className="text-xs text-gray-400 font-inter">({activityLog.length})</span>
        </div>
        {activityLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 animate-pulse">
                <div className="w-2 h-2 bg-gray-200 rounded-full" />
                <div className="h-3 w-48 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        ) : activityLog.length === 0 ? (
          <div className="text-center py-6">
            <Activity size={36} className="text-gray-300 mx-auto mb-2" />
            <p className="font-inter text-sm text-gray-500">No activity recorded yet for this client.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {activityLog.map((entry) => (
              <div key={entry.id} className="flex items-start gap-3 py-2 border-b border-gray-100 last:border-0">
                <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${getActivityColor(entry.action_type)}`} />
                <div className="flex-1 min-w-0">
                  <p className="font-inter text-sm text-gray-800">{entry.action_label}</p>
                  <p className="font-inter text-xs text-gray-400">
                    {entry.admin_email} · {new Date(entry.created_at).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Auto-Delete Settings */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-start gap-3 mb-4">
          <AlertTriangle size={20} className="text-amber-600 shrink-0" />
          <div>
            <h3 className="font-inter font-bold text-[#1B3F7A] text-lg">Auto-Delete Settings</h3>
            <p className="font-inter text-gray-600 text-sm">Automatically delete documents after a specified period for security/compliance.</p>
          </div>
        </div>

        {confirmAutoDelete ? (
          <div className="space-y-3">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="font-inter text-sm text-amber-800">
                Set auto-delete for <strong>{autoDeleteDays} days</strong> from now ({new Date(Date.now() + autoDeleteDays * 86400000).toLocaleDateString('en-GB')})? Documents will be automatically deleted after this date.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleSetAutoDelete}
                disabled={saving}
                className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-md font-inter text-sm font-semibold transition-colors disabled:opacity-50"
              >
                {saving ? <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" /> Setting...</> : <><Calendar size={16} /> Confirm</>}
              </button>
              <button
                onClick={() => setConfirmAutoDelete(false)}
                disabled={saving}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-md font-inter text-sm font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <label className="block font-inter font-medium text-gray-700 text-sm mb-2">Auto-delete after</label>
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
              onClick={() => setConfirmAutoDelete(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-md font-inter text-sm font-semibold transition-colors"
            >
              <Calendar size={16} /> Set Auto-Delete
            </button>
          </div>
        )}
      </div>

      {/* Prerequisite Warning */}
      {!data.profile.has_submitted_intake && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle size={20} className="text-amber-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-inter font-semibold text-amber-900 text-sm mb-1">Intake Form Required</p>
              <p className="font-inter text-amber-700 text-xs mb-2">
                Client must submit their intake form before you can generate the brief or documents.
              </p>
              {onNavigateTab && (
                <button
                  onClick={() => onNavigateTab('messaging')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded text-xs font-inter font-medium transition-colors"
                >
                  <MessageCircle size={13} /> Message Client
                </button>
              )}
            </div>
          </div>
        </div>
      )}
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
