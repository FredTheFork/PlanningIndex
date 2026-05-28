'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { ArrowLeft, User, FileText, Clock, Save, AlertCircle } from 'lucide-react';

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
  email: string;
}

export default function AdminClientDetail({ params }: { params: { userId: string } }) {
  const { userId } = params;
  const router = useRouter();
  const { user: adminUser } = useAuth();
  const [data, setData] = useState<ClientData>({
    profile: null,
    intakeResponses: null,
    email: '',
  });
  const [loading, setLoading] = useState(true);
  const [deliveryStatus, setDeliveryStatus] = useState('');
  const [deliveryLink, setDeliveryLink] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

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

      // Get email from intake responses
      const email = intakeResult?.responses?.q7_document_email || userId.substring(0, 8) + '...';

      setData({
        profile,
        intakeResponses: intakeResult?.responses || null,
        email,
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

  const handleSave = async () => {
    if (!userId || !data.profile) return;
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
        setTimeout(() => setSaveMessage(''), 3000);
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1B3F7A]" />
      </div>
    );
  }

  if (!data.profile) {
    return (
      <div>
        <Link
          href="/personal/admin"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-[#1B3F7A] mb-6"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <AlertCircle size={40} className="text-gray-600 mx-auto mb-4" />
          <p className="font-inter text-gray-600">Client not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Back link */}
      <Link
        href="/personal/admin"
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-[#1B3F7A] mb-6"
      >
        <ArrowLeft size={16} />
        Back to Dashboard
      </Link>

      <div className="mb-6">
        <h1 className="font-inter font-bold text-[#1B3F7A] text-2xl mb-1">
          Client Details
        </h1>
        <p className="font-inter text-gray-600 text-sm">
          Manage client information and delivery status.
        </p>
      </div>

      {/* Client info */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-[#FAFBFC] rounded-lg p-3">
            <User size={24} className="text-[#1B3F7A]" />
          </div>
          <div>
            <p className="font-inter font-semibold text-gray-900">{data.email}</p>
            <p className="font-inter text-gray-600 text-sm">{userId}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block font-inter font-medium text-gray-700 text-sm mb-2">
              Created
            </label>
            <p className="font-inter text-gray-600 text-sm">
              {new Date(data.profile.created_at).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>
          <div>
            <label className="block font-inter font-medium text-gray-700 text-sm mb-2">
              Intake Form
            </label>
            <p className="font-inter text-gray-600 text-sm">
              {data.profile.has_submitted_intake
                ? `Submitted ${data.profile.intake_submitted_at ? new Date(data.profile.intake_submitted_at).toLocaleDateString('en-GB') : ''}`
                : 'Not submitted'}
            </p>
          </div>
        </div>
      </div>

      {/* Delivery controls */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h2 className="font-inter font-bold text-[#1B3F7A] text-lg mb-4">
          Delivery Settings
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block font-inter font-medium text-gray-700 text-sm mb-2">
              Delivery Status
            </label>
            <select
              value={deliveryStatus}
              onChange={(e) => setDeliveryStatus(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2C68C4] focus:border-[#2C68C4] font-inter text-sm bg-white"
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
              type="text"
              value={deliveryLink}
              onChange={(e) => setDeliveryLink(e.target.value)}
              placeholder="https://..."
              className="w-full px-4 py-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2C68C4] focus:border-[#2C68C4] font-inter text-sm"
            />
          </div>

          <div>
            <label className="block font-inter font-medium text-gray-700 text-sm mb-2">
              Admin Notes
            </label>
            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              rows={4}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2C68C4] focus:border-[#2C68C4] font-inter text-sm"
              placeholder="Add notes about this client..."
            />
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 font-inter font-semibold text-white bg-[#1B3F7A] rounded-md hover:bg-[#2C68C4] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ padding: '10px 20px', fontSize: '0.9rem' }}
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Save Changes
                </>
              )}
            </button>

            {saveMessage && (
              <p className={`font-inter text-sm ${saveMessage.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>
                {saveMessage}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Intake responses preview */}
      {data.intakeResponses && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="font-inter font-bold text-[#1B3F7A] text-lg mb-4">
            Intake Form Responses
          </h2>

          <div className="space-y-3">
            {Object.entries(data.intakeResponses).map(([key, value]) => (
              <div key={key} className="border-b border-gray-100 pb-3">
                <p className="font-inter font-medium text-gray-900 text-sm mb-1">{key}</p>
                <p className="font-inter text-gray-600 text-sm">
                  {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
