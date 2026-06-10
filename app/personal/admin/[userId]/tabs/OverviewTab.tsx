'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import {
  Mail, Phone, MapPin, ExternalLink, AlertTriangle, Calendar, FileText
} from 'lucide-react';

interface OverviewTabProps {
  userId: string;
  data: any;
  refreshData: () => void;
}

export default function OverviewTab({ userId, data, refreshData }: OverviewTabProps) {
  const [actionMessage, setActionMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const [adminNotes, setAdminNotes] = useState(data.profile?.admin_notes || '');
  const [autoDeleteDays, setAutoDeleteDays] = useState(30);

  useEffect(() => {
    // Initial data fetch if needed
  }, [userId]);

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
    } catch (error) {
      setActionMessage('Error setting auto-delete');
    } finally {
      setSaving(false);
      setTimeout(() => setActionMessage(''), 3000);
    }
  };

  const intake = data.intakeResponses || {};

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
