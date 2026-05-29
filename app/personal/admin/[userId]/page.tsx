'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import {
  ArrowLeft, User, FileText, Clock, Save, AlertCircle, Briefcase, FileCheck,
  MessageSquare, StickyNote, Settings, GitBranch, Zap, RefreshCw,
  Download, Eye, CheckCircle2, XCircle, AlertTriangle, ExternalLink,
  ChevronRight, FileDown, Send, Loader
} from 'lucide-react';

// Tab components
import OverviewTab from './tabs/OverviewTab';
import BriefTab from './tabs/BriefTab';
import DocumentsTab from './tabs/DocumentsTab';
import IntakeTab from './tabs/IntakeTab';
import CommunicationsTab from './tabs/CommunicationsTab';
import NotesTab from './tabs/NotesTab';
import SettingsTab from './tabs/SettingsTab';

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
  intakeMetadata: {
    submitted_at: string | null;
    form_version: string;
    last_saved_at: string;
    file_uploads: Record<string, any>;
    additional_notes: Record<string, any>;
  } | null;
  email: string;
}

const TABS = [
  { id: 'overview', label: 'Overview', icon: User },
  { id: 'brief', label: 'Master Brief', icon: Briefcase },
  { id: 'documents', label: 'Documents', icon: FileText },
  { id: 'intake', label: 'Intake Form', icon: FileCheck },
  { id: 'communications', label: 'Communications', icon: MessageSquare },
  { id: 'notes', label: 'Notes & Activity', icon: StickyNote },
  { id: 'settings', label: 'Settings & Delivery', icon: Settings },
];

export default function AdminClientDetail({ params }: { params: { userId: string } }) {
  const { userId } = params;
  const { user: adminUser } = useAuth();
  const [data, setData] = useState<ClientData>({
    profile: null,
    intakeResponses: null,
    intakeMetadata: null,
    email: '',
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (!userId) return;
    fetchClientData();
  }, [userId, refreshKey]);

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

      const email = intakeResult?.responses?.q7_document_email || userId.substring(0, 8) + '...';

      setData({
        profile,
        intakeResponses: intakeResult?.responses || null,
        intakeMetadata: intakeResult ? {
          submitted_at: intakeResult.submitted_at,
          form_version: intakeResult.form_version,
          last_saved_at: intakeResult.last_saved_at,
          file_uploads: intakeResult.file_uploads || {},
          additional_notes: intakeResult.additional_notes || {},
        } : null,
        email,
      });
    } catch (error) {
      console.error('Error fetching client data:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    setRefreshKey(prev => prev + 1);
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

      {/* Client Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-[#FAFBFC] rounded-lg p-3">
              <User size={24} className="text-[#1B3F7A]" />
            </div>
            <div>
              <p className="font-inter font-semibold text-gray-900 text-lg">{data.email}</p>
              <p className="font-inter text-gray-600 text-sm">{userId}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <QuickStatusBadges profile={data.profile} />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200">
          <QuickStat
            label="Created"
            value={new Date(data.profile.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
          />
          <QuickStat
            label="Intake"
            value={data.profile.has_submitted_intake ? 'Submitted' : 'Pending'}
            status={data.profile.has_submitted_intake ? 'success' : 'pending'}
          />
          <QuickStat
            label="Delivery"
            value={data.profile.delivery_status.replace('_', ' ')}
            status={data.profile.delivery_status === 'delivered' ? 'success' : data.profile.delivery_status === 'in_progress' ? 'progress' : 'pending'}
          />
          <QuickStat
            label="Upsells"
            value={data.profile.purchased_upsells?.length || 0}
          />
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg border border-gray-200 mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px overflow-x-auto">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 border-b-2 font-inter text-sm font-medium transition-colors whitespace-nowrap ${
                    isActive
                      ? 'border-[#1B3F7A] text-[#1B3F7A]'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <OverviewTab userId={userId} data={data} refreshData={refreshData} />
          )}
          {activeTab === 'brief' && (
            <BriefTab userId={userId} data={data} refreshData={refreshData} />
          )}
          {activeTab === 'documents' && (
            <DocumentsTab userId={userId} data={data} refreshData={refreshData} />
          )}
          {activeTab === 'intake' && (
            <IntakeTab userId={userId} data={data} refreshData={refreshData} />
          )}
          {activeTab === 'communications' && (
            <CommunicationsTab userId={userId} data={data} refreshData={refreshData} />
          )}
          {activeTab === 'notes' && (
            <NotesTab userId={userId} data={data} refreshData={refreshData} />
          )}
          {activeTab === 'settings' && (
            <SettingsTab userId={userId} data={data} refreshData={refreshData} />
          )}
        </div>
      </div>
    </div>
  );
}

// Quick Status Badges
function QuickStatusBadges({ profile }: { profile: any }) {
  return (
    <div className="flex items-center gap-2">
      {profile.has_submitted_intake ? (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 rounded-md text-xs font-inter font-medium">
          <CheckCircle2 size={12} />
          Intake Complete
        </span>
      ) : (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-50 text-amber-700 rounded-md text-xs font-inter font-medium">
          <Clock size={12} />
          Intake Pending
        </span>
      )}
      {profile.delivery_status === 'delivered' && (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-inter font-medium">
          <CheckCircle2 size={12} />
          Delivered
        </span>
      )}
    </div>
  );
}

// Quick Stat Component
function QuickStat({ label, value, status }: { label: string; value: string | number; status?: 'success' | 'progress' | 'pending' }) {
  const statusColors = {
    success: 'text-green-700',
    progress: 'text-amber-700',
    pending: 'text-gray-600',
  };

  return (
    <div>
      <p className="font-inter text-gray-600 text-xs mb-1">{label}</p>
      <p className={`font-inter font-semibold text-sm ${status ? statusColors[status] : 'text-gray-900'}`}>
        {value}
      </p>
    </div>
  );
}
