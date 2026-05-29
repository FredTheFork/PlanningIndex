'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import {
  Briefcase, FileText, Zap, Send, CheckCircle2, Clock, AlertTriangle,
  RefreshCw, ArrowRight
} from 'lucide-react';

interface OverviewTabProps {
  userId: string;
  data: any;
  refreshData: () => void;
}

export default function OverviewTab({ userId, data, refreshData }: OverviewTabProps) {
  const [generatingBrief, setGeneratingBrief] = useState(false);
  const [generatingDocs, setGeneratingDocs] = useState(false);
  const [actionMessage, setActionMessage] = useState('');

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

  const handleGenerateAllDocuments = async () => {
    setGeneratingDocs(true);
    setActionMessage('');

    try {
      const documentTypes = [
        'terms_and_conditions',
        'service_agreement_contract',
        'gdpr_privacy_policy',
        'professional_invoice_template',
        'late_payment_letters',
        'welcome_email_sequence',
        'professional_bio',
        'elevator_pitch',
        'linkedin_profile_script',
        'service_description_sheets',
      ];

      let successCount = 0;
      let failCount = 0;

      for (const docType of documentTypes) {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/generate-document`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
              },
              body: JSON.stringify({
                user_id: userId,
                document_type: docType,
              }),
            }
          );

          if (response.ok) {
            successCount++;
          } else {
            failCount++;
          }
        } catch {
          failCount++;
        }
      }

      setActionMessage(`Generated ${successCount} documents successfully${failCount > 0 ? `, ${failCount} failed` : ''}`);
      refreshData();
    } catch (error: any) {
      setActionMessage(error.message || 'Error generating documents');
    } finally {
      setGeneratingDocs(false);
      setTimeout(() => setActionMessage(''), 5000);
    }
  };

  const handleMarkDelivered = async () => {
    const confirmDeliver = confirm('Mark all completed documents as delivered to the client?');
    if (!confirmDeliver) return;

    try {
      // Update profile delivery status
      const { error: profileError } = await supabase
        .from('client_profiles')
        .update({
          delivery_status: 'delivered',
        })
        .eq('user_id', userId);

      if (profileError) throw profileError;

      // Mark all completed documents as delivered
      const { error: docsError } = await supabase
        .from('generated_documents')
        .update({
          delivered_to_client: true,
          delivered_at: new Date().toISOString(),
        })
        .eq('client_id', userId)
        .eq('status', 'completed');

      if (docsError) throw docsError;

      setActionMessage('Marked as delivered successfully!');
      refreshData();
    } catch (error: any) {
      setActionMessage(error.message || 'Error updating delivery status');
    } finally {
      setTimeout(() => setActionMessage(''), 3000);
    }
  };

  const getBriefStatus = async () => {
    const { data: brief } = await supabase
      .from('client_briefs')
      .select('status, risk_level')
      .eq('client_id', userId)
      .maybeSingle();
    return brief;
  };

  const getDocumentsCount = async () => {
    const { count: total } = await supabase
      .from('generated_documents')
      .select('*', { count: 'exact', head: true })
      .eq('client_id', userId);

    const { count: completed } = await supabase
      .from('generated_documents')
      .select('*', { count: 'exact', head: true })
      .eq('client_id', userId)
      .eq('status', 'completed');

    return { total: total || 0, completed: completed || 0 };
  };

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

      {/* Quick Actions Panel */}
      <div className="bg-[#FAFBFC] rounded-lg border border-gray-200 p-6">
        <h3 className="font-inter font-semibold text-[#1B3F7A] text-lg mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <QuickActionButton
            icon={Briefcase}
            label="Generate Brief"
            description="AI-generated master client brief"
            onClick={handleGenerateBrief}
            loading={generatingBrief}
            disabled={!data.profile.has_submitted_intake}
            variant="primary"
          />
          <QuickActionButton
            icon={FileText}
            label="Generate All Documents"
            description="Create all 10 documents at once"
            onClick={handleGenerateAllDocuments}
            loading={generatingDocs}
            disabled={!data.profile.has_submitted_intake}
            variant="secondary"
          />
          <QuickActionButton
            icon={Send}
            label="Mark as Delivered"
            description="Finalize delivery to client"
            onClick={handleMarkDelivered}
            loading={false}
            disabled={data.profile.delivery_status === 'delivered'}
            variant="tertiary"
          />
        </div>
      </div>

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
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            )}
            {data.intakeMetadata?.form_version && (
              <div className="flex items-center justify-between text-sm">
                <span className="font-inter text-gray-600">Form Version</span>
                <span className="font-inter text-gray-900">{data.intakeMetadata.form_version}</span>
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
              <p className="font-inter text-gray-600 text-sm">10 document types</p>
            </div>
          </div>
          <DocumentsStatusCount userId={userId} />
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
            {data.profile.delivery_link && (
              <div className="flex items-center justify-between text-sm">
                <span className="font-inter text-gray-600">Link</span>
                <a
                  href={data.profile.delivery_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-inter text-[#2C68C4] hover:underline flex items-center gap-1"
                >
                  View <ArrowRight size={12} />
                </a>
              </div>
            )}
          </div>
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

// Quick Action Button Component
function QuickActionButton({ icon: Icon, label, description, onClick, loading, disabled, variant }: {
  icon: any;
  label: string;
  description: string;
  onClick: () => void;
  loading: boolean;
  disabled: boolean;
  variant: 'primary' | 'secondary' | 'tertiary';
}) {
  const variantStyles = {
    primary: 'bg-[#1B3F7A] hover:bg-[#2C68C4] text-white',
    secondary: 'bg-[#2C68C4] hover:bg-[#1B3F7A] text-white',
    tertiary: 'bg-white hover:bg-gray-50 text-[#1B3F7A] border border-[#1B3F7A]',
  };

  return (
    <button
      onClick={onClick}
      disabled={loading || disabled}
      className={`rounded-lg p-4 text-left transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles[variant]}`}
    >
      <div className="flex items-center gap-2 mb-2">
        {loading ? (
          <RefreshCw size={18} className="animate-spin" />
        ) : (
          <Icon size={18} />
        )}
        <span className="font-inter font-semibold text-sm">{label}</span>
      </div>
      <p className="font-inter text-xs opacity-90">{description}</p>
    </button>
  );
}

// Brief Status Badge Component
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

// Documents Status Count Component
function DocumentsStatusCount({ userId }: { userId: string }) {
  const [counts, setCounts] = useState({ total: 0, completed: 0, delivered: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
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

      setCounts({ total: total || 0, completed: completed || 0, delivered: delivered || 0 });
      setLoading(false);
    };
    fetchCounts();
  }, [userId]);

  if (loading) {
    return <div className="animate-pulse h-4 bg-gray-200 rounded w-20" />;
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-inter text-gray-600">Generated</span>
        <span className="font-inter text-gray-900">{counts.total} / 10</span>
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
