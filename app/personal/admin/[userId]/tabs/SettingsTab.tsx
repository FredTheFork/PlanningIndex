'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import {
  Settings, Save, Send, Calendar, ExternalLink, AlertTriangle,
  CheckCircle2, Clock, FileText, Link as LinkIcon
} from 'lucide-react';

interface SettingsTabProps {
  userId: string;
  data: any;
  refreshData: () => void;
}

export default function SettingsTab({ userId, data, refreshData }: SettingsTabProps) {
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [deliveryStatus, setDeliveryStatus] = useState(data.profile?.delivery_status || 'not_started');
  const [deliveryLink, setDeliveryLink] = useState(data.profile?.delivery_link || '');
  const [adminNotes, setAdminNotes] = useState(data.profile?.admin_notes || '');
  const [autoDeleteDays, setAutoDeleteDays] = useState(30);
  const [documents, setDocuments] = useState<any[]>([]);

  useEffect(() => {
    fetchDocuments();
    if (data.profile) {
      setDeliveryStatus(data.profile.delivery_status);
      setDeliveryLink(data.profile.delivery_link || '');
      setAdminNotes(data.profile.admin_notes || '');
    }
  }, [userId, data.profile]);

  const fetchDocuments = async () => {
    const { data: docs } = await supabase
      .from('generated_documents')
      .select('*')
      .eq('client_id', userId)
      .eq('status', 'completed');
    setDocuments(docs || []);
  };

  const handleSaveProfile = async () => {
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

      if (error) {
        setSaveMessage('Error saving changes');
        console.error('Save error:', error);
      } else {
        setSaveMessage('Changes saved successfully');
        refreshData();
        setTimeout(() => setSaveMessage(''), 3000);
      }
    } catch (error) {
      setSaveMessage('Error saving changes');
    } finally {
      setSaving(false);
    }
  };

  const handleMarkAllDelivered = async () => {
    const confirm = window.confirm('Mark all completed documents as delivered to client?');
    if (!confirm) return;

    setSaving(true);

    try {
      // Update profile
      await supabase
        .from('client_profiles')
        .update({ delivery_status: 'delivered' })
        .eq('user_id', userId);

      // Update all completed documents
      const deliveredAt = new Date().toISOString();
      await supabase
        .from('generated_documents')
        .update({
          delivered_to_client: true,
          delivered_at: deliveredAt,
        })
        .eq('client_id', userId)
        .eq('status', 'completed');

      setSaveMessage('All documents marked as delivered');
      refreshData();
      fetchDocuments();
    } catch (error) {
      setSaveMessage('Error updating delivery status');
    } finally {
      setSaving(false);
      setTimeout(() => setSaveMessage(''), 3000);
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

      setSaveMessage(`Auto-delete set for ${autoDeleteDays} days`);
      fetchDocuments();
    } catch (error) {
      setSaveMessage('Error setting auto-delete');
    } finally {
      setSaving(false);
      setTimeout(() => setSaveMessage(''), 3000);
    }
  };

  const handleMarkDocumentDelivered = async (docId: string) => {
    await supabase
      .from('generated_documents')
      .update({
        delivered_to_client: true,
        delivered_at: new Date().toISOString(),
      })
      .eq('id', docId);

    fetchDocuments();
    setSaveMessage('Document marked as delivered');
    setTimeout(() => setSaveMessage(''), 2000);
  };

  const handleUnmarkDocumentDelivered = async (docId: string) => {
    await supabase
      .from('generated_documents')
      .update({
        delivered_to_client: false,
        delivered_at: null,
      })
      .eq('id', docId);

    fetchDocuments();
    setSaveMessage('Document delivery status cleared');
    setTimeout(() => setSaveMessage(''), 2000);
  };

  const deliveredCount = documents.filter(d => d.delivered_to_client).length;
  const totalCount = documents.length;

  return (
    <div className="space-y-6">
      {/* Save Message */}
      {saveMessage && (
        <div className={`rounded-lg p-4 ${
          saveMessage.includes('success') || saveMessage.includes('marked') || saveMessage.includes('set')
            ? 'bg-green-50 border border-green-200 text-green-800'
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          <p className="font-inter text-sm font-medium">{saveMessage}</p>
        </div>
      )}

      {/* Delivery Status Settings */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="font-inter font-bold text-[#1B3F7A] text-lg mb-4">
          Delivery Status
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block font-inter font-medium text-gray-700 text-sm mb-2">
              Current Status
            </label>
            <select
              value={deliveryStatus}
              onChange={(e) => setDeliveryStatus(e.target.value)}
              className="w-full md:w-64 px-4 py-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2C68C4] focus:border-[#2C68C4] font-inter text-sm bg-white"
            >
              <option value="not_started">Not Started</option>
              <option value="in_progress">In Progress</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>

          <div>
            <label className="block font-inter font-medium text-gray-700 text-sm mb-2">
              Delivery Link
            </label>
            <input
              type="url"
              value={deliveryLink}
              onChange={(e) => setDeliveryLink(e.target.value)}
              placeholder="https://..."
              className="w-full px-4 py-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2C68C4] focus:border-[#2C68C4] font-inter text-sm"
            />
            <p className="font-inter text-gray-500 text-xs mt-1">
              Client-facing delivery page URL
            </p>
          </div>

          {deliveryLink && (
            <a
              href={deliveryLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md font-inter text-sm font-medium transition-colors"
            >
              <ExternalLink size={16} />
              Open Delivery Page
            </a>
          )}
        </div>
      </div>

      {/* Document Delivery Management */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-inter font-bold text-[#1B3F7A] text-lg mb-1">
              Document Delivery Management
            </h3>
            <p className="font-inter text-gray-600 text-sm">
              {deliveredCount} of {totalCount} documents delivered
            </p>
          </div>
          <button
            onClick={handleMarkAllDelivered}
            disabled={saving || totalCount === 0}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#1B3F7A] hover:bg-[#2C68C4] text-white rounded-md font-inter text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={16} />
            Mark All Delivered
          </button>
        </div>

        {documents.length === 0 ? (
          <div className="text-center py-8">
            <FileText size={40} className="text-gray-400 mx-auto mb-3" />
            <p className="font-inter text-gray-600 text-sm">No completed documents yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {documents.map(doc => (
              <div key={doc.id} className="flex items-center justify-between bg-[#FAFBFC] rounded-lg border border-gray-200 p-3">
                <div className="flex items-center gap-3">
                  <FileText size={18} className="text-[#1B3F7A]" />
                  <div>
                    <p className="font-inter font-medium text-gray-900 text-sm">{doc.document_label}</p>
                    <p className="font-inter text-gray-500 text-xs">
                      {doc.delivered_to_client
                        ? `Delivered ${doc.delivered_at ? new Date(doc.delivered_at).toLocaleDateString('en-GB') : ''}`
                        : 'Not delivered'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => doc.delivered_to_client
                    ? handleUnmarkDocumentDelivered(doc.id)
                    : handleMarkDocumentDelivered(doc.id)
                  }
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-inter font-medium transition-colors ${
                    doc.delivered_to_client
                      ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {doc.delivered_to_client ? (
                    <>
                      <CheckCircle2 size={14} />
                      Delivered
                    </>
                  ) : (
                    <>
                      <Send size={14} />
                      Mark Delivered
                    </>
                )}
                </button>
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

      {/* Admin Notes */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="font-inter font-bold text-[#1B3F7A] text-lg mb-4">
          Admin Notes
        </h3>
        <textarea
          value={adminNotes}
          onChange={(e) => setAdminNotes(e.target.value)}
          rows={6}
          className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2C68C4] focus:border-[#2C68C4] font-inter text-sm"
          placeholder="Add notes about this client..."
        />
      </div>

      {/* Save Button */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleSaveProfile}
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
              <Save size={16} />
              Save All Changes
            </>
          )}
        </button>
      </div>
    </div>
  );
}
