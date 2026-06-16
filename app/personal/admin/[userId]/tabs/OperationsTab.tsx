'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import {
  Package, FileText, Clock, CheckCircle2, AlertCircle,
  RefreshCw, Briefcase, ChevronDown, ChevronUp, Save, Copy
} from 'lucide-react';
import { getServiceById, isOperationsService } from '@/lib/services/service-catalog';
import { getDocumentConfigsForService } from '@/lib/services/document-configs';
import { getDocumentTypesForService } from '@/lib/services/document-service-map';

interface OperationsTabProps {
  userId: string;
  data: any;
  refreshData: () => void;
}

export default function OperationsTab({ userId, data, refreshData }: OperationsTabProps) {
  const [documents, setDocuments] = useState<any[]>([]);
  const [briefs, setBriefs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatingBrief, setGeneratingBrief] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>('info');

  const operationsServices = (data.purchasedServices || []).filter((ps: any) =>
    isOperationsService(ps.service_id)
  );

  useEffect(() => {
    fetchData();
  }, [userId, data]);

  const fetchData = async () => {
    setLoading(true);
    const [docsRes, briefsRes] = await Promise.all([
      supabase.from('generated_documents').select('*').eq('client_id', userId),
      supabase.from('client_briefs').select('*').eq('client_id', userId),
    ]);
    setDocuments(docsRes.data || []);
    setBriefs(briefsRes.data || []);
    setLoading(false);
  };

  const showMessage = (msg: string, type: 'success' | 'error' | 'info' = 'info') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(''), 5000);
  };

  const handleGenerateBrief = async (serviceId: string) => {
    if (!data.profile?.has_submitted_intake) {
      showMessage('Client must submit intake form first', 'error');
      return;
    }
    setGeneratingBrief(serviceId);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/generate-brief`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ user_id: userId, service_id: serviceId, debug: true }),
        }
      );
      const result = await response.json().catch(() => ({ error: `HTTP ${response.status}` }));
      if (response.ok && result.success) {
        showMessage(`Brief generated for ${getServiceById(serviceId)?.name ?? serviceId}`, 'success');
        await fetchData();
        refreshData();
      } else {
        showMessage(result.error || 'Failed to generate brief', 'error');
      }
    } catch (err: any) {
      showMessage(err.message || 'Error generating brief', 'error');
    } finally {
      setGeneratingBrief(null);
    }
  };

  const handleSaveBrief = async (briefId: string, content: string) => {
    const { error } = await supabase
      .from('client_briefs')
      .update({ brief_content: content })
      .eq('id', briefId);
    if (error) {
      showMessage('Failed to save brief', 'error');
    } else {
      showMessage('Brief saved', 'success');
      await fetchData();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1B3F7A]" />
      </div>
    );
  }

  if (operationsServices.length === 0) {
    return (
      <div className="text-center py-12">
        <Package size={48} className="text-gray-300 mx-auto mb-4" />
        <p className="font-inter text-gray-600 text-sm">No operations packs purchased.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {message && (
        <div className={`rounded-lg p-4 border flex items-start gap-3 ${
          messageType === 'success' ? 'bg-green-50 border-green-200 text-green-800'
          : messageType === 'error' ? 'bg-red-50 border-red-200 text-red-800'
          : 'bg-blue-50 border-blue-200 text-blue-800'
        }`}>
          {messageType === 'success' && <CheckCircle2 size={16} className="shrink-0 mt-0.5 text-green-600" />}
          {messageType === 'error' && <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-600" />}
          <p className="font-inter text-sm font-medium">{message}</p>
        </div>
      )}

      {operationsServices.map((ps: any) => {
        const service = getServiceById(ps.service_id);
        const configs = getDocumentConfigsForService(ps.service_id);
        const serviceDocTypes = getDocumentTypesForService(ps.service_id);
        const serviceDocs = documents.filter((d: any) => serviceDocTypes.includes(d.document_type));
        const serviceBriefs = briefs.filter((b: any) => b.service_id === ps.service_id);
        const latestBrief = serviceBriefs[serviceBriefs.length - 1];
        const briefComplete = latestBrief?.status === 'completed';

        return (
          <ServiceDocSection
            key={ps.id}
            purchasedService={ps}
            service={service}
            configs={configs}
            serviceDocs={serviceDocs}
            briefs={serviceBriefs}
            generatingBrief={generatingBrief === ps.service_id}
            onGenerateBrief={() => handleGenerateBrief(ps.service_id)}
            onSaveBrief={handleSaveBrief}
            intakeSubmitted={!!data.profile?.has_submitted_intake}
          />
        );
      })}
    </div>
  );
}

function ServiceDocSection({
  purchasedService,
  service,
  configs,
  serviceDocs,
  briefs,
  generatingBrief,
  onGenerateBrief,
  onSaveBrief,
  intakeSubmitted,
}: {
  purchasedService: any;
  service: any;
  configs: any[];
  serviceDocs: any[];
  briefs: any[];
  generatingBrief: boolean;
  onGenerateBrief: () => void;
  onSaveBrief: (id: string, content: string) => Promise<void>;
  intakeSubmitted: boolean;
}) {
  const [briefExpanded, setBriefExpanded] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  const latestBrief = briefs[briefs.length - 1];
  const briefStatus = latestBrief?.status;
  const briefCompleted = briefStatus === 'completed';
  const docsDelivered = serviceDocs.filter((d: any) => d.delivered_to_client).length;

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-[#FAFBFC] rounded-lg p-2 shrink-0">
            <Package size={18} className="text-[#1B3F7A]" />
          </div>
          <div>
            <p className="font-inter font-semibold text-gray-900 text-sm">
              {service?.name ?? purchasedService.service_id}
            </p>
            <div className="flex items-center gap-3 mt-1">
              <span className="font-inter text-xs text-gray-500">
                Docs: {docsDelivered}/{configs.length} delivered
              </span>
              <span className={`font-inter text-xs font-medium ${
                briefCompleted ? 'text-green-700' : briefStatus === 'generating' ? 'text-blue-600' : 'text-gray-500'
              }`}>
                Brief: {briefCompleted ? 'Generated' : briefStatus === 'generating' ? 'Generating...' : 'Not generated'}
              </span>
            </div>
          </div>
        </div>
        {!briefCompleted && (
          <button
            onClick={onGenerateBrief}
            disabled={generatingBrief || !intakeSubmitted}
            title={!intakeSubmitted ? 'Intake must be submitted first' : undefined}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-inter font-medium transition-all shrink-0 ${
              generatingBrief ? 'bg-blue-100 text-blue-600 cursor-wait'
              : intakeSubmitted ? 'bg-[#1B3F7A] hover:bg-[#2C68C4] text-white'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            {generatingBrief ? (
              <><RefreshCw size={13} className="animate-spin" />Generating...</>
            ) : (
              <><Briefcase size={13} />Generate Brief</>
            )}
          </button>
        )}
      </div>

      {/* Document rows */}
      <div className="divide-y divide-gray-100">
        {configs.map((config: any) => {
          const doc = serviceDocs.find((d: any) => d.document_type === config.document_type);
          const docStatus = doc?.status || 'pending';
          const isDelivered = doc?.delivered_to_client;

          const statusStyles: Record<string, { color: string; bg: string; label: string }> = {
            pending: { color: 'text-gray-500', bg: 'bg-gray-100', label: 'Pending' },
            generating: { color: 'text-blue-600', bg: 'bg-blue-50', label: 'Generating' },
            completed: { color: 'text-green-600', bg: 'bg-green-50', label: 'Complete' },
            failed: { color: 'text-red-600', bg: 'bg-red-50', label: 'Failed' },
          };
          const ds = statusStyles[docStatus] || statusStyles.pending;

          return (
            <div key={config.document_type} className="flex items-center justify-between px-4 py-2.5">
              <div className="flex items-center gap-3">
                <FileText size={14} className="text-gray-400 shrink-0" />
                <div>
                  <p className="font-inter text-sm text-gray-900">{config.document_label}</p>
                  <p className="font-inter text-xs text-gray-500">{config.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-inter font-medium ${ds.bg} ${ds.color}`}>
                  {ds.label}
                </span>
                {isDelivered && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-inter font-medium bg-blue-50 text-blue-600">
                    <CheckCircle2 size={10} />
                    Delivered
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Brief section */}
      {briefs.length > 0 && (
        <div className="border-t border-gray-100 bg-[#FAFBFC]">
          {briefs.map((brief: any) => {
            const isCompleted = brief.status === 'completed';
            const briefStatusConfig: Record<string, { color: string; bg: string; label: string }> = {
              pending: { color: 'text-gray-600', bg: 'bg-gray-100', label: 'Pending' },
              generating: { color: 'text-blue-600', bg: 'bg-blue-50', label: 'Generating' },
              completed: { color: 'text-green-600', bg: 'bg-green-50', label: 'Completed' },
              failed: { color: 'text-red-600', bg: 'bg-red-50', label: 'Failed' },
            };
            const bs = briefStatusConfig[brief.status] || briefStatusConfig.pending;

            return (
              <div key={brief.id} className="p-4">
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => {
                    if (isCompleted && !briefExpanded) setEditedContent(brief.brief_content || '');
                    setBriefExpanded(!briefExpanded);
                  }}
                >
                  <div className="flex items-center gap-2">
                    {isCompleted ? (briefExpanded ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />) : <Briefcase size={14} className="text-gray-400" />}
                    <p className="font-inter text-sm text-gray-900">Brief</p>
                    {brief.generated_at && (
                      <p className="font-inter text-xs text-gray-500">
                        {new Date(brief.generated_at).toLocaleDateString('en-GB')}
                        {brief.model_used && ` — ${brief.model_used}`}
                      </p>
                    )}
                  </div>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-inter font-medium ${bs.bg} ${bs.color}`}>
                    {bs.label}
                  </span>
                </div>

                {isCompleted && briefExpanded && (
                  <div className="mt-3">
                    <textarea
                      value={editedContent}
                      onChange={(e) => setEditedContent(e.target.value)}
                      className="w-full min-h-[180px] p-3 bg-white border border-gray-300 rounded-lg font-inter text-sm text-gray-900 leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#1B3F7A] focus:border-transparent resize-y"
                    />
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <button
                        onClick={async () => {
                          setIsSaving(true);
                          await onSaveBrief(brief.id, editedContent);
                          setIsSaving(false);
                        }}
                        disabled={isSaving}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1B3F7A] hover:bg-[#2C68C4] text-white rounded text-xs font-inter font-medium transition-colors disabled:opacity-50"
                      >
                        {isSaving ? <><RefreshCw size={13} className="animate-spin" />Saving...</> : <><Save size={13} />Save</>}
                      </button>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(editedContent || brief.brief_content || '');
                          setCopied(true);
                          setTimeout(() => setCopied(false), 2000);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 rounded text-xs font-inter font-medium transition-colors"
                      >
                        <Copy size={13} />
                        {copied ? 'Copied!' : 'Copy'}
                      </button>
                      <button
                        onClick={onGenerateBrief}
                        disabled={generatingBrief}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 rounded text-xs font-inter font-medium transition-colors disabled:opacity-50"
                      >
                        <RefreshCw size={13} className={generatingBrief ? 'animate-spin' : ''} />
                        {generatingBrief ? 'Regenerating...' : 'Regenerate'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
