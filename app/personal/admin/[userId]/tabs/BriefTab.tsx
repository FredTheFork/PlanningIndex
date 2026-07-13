'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/lib/supabase/client';
import {
  Briefcase, RefreshCw, Download, AlertCircle, CheckCircle2, Clock,
  FileText, Eye, Copy, Package, Shield, ChevronDown, ChevronUp
} from 'lucide-react';
import { getServiceById } from '@/lib/services/service-catalog';
import { useAdminToast } from '@/hooks/useAdminToast';
import { BriefTabSkeleton } from '@/components/admin/skeletons/AdminTabSkeletons';
import { calculateBriefCompleteness, getCompletenessColor, getCompletenessTextColor } from '@/lib/admin/brief-completeness';
import { briefGenerationLimiter } from '@/lib/admin/rate-limiter';
import { logActivity } from '@/lib/admin/activity-log';
import { useAuth } from '@/hooks/useAuth';

interface BriefTabProps {
  userId: string;
  data: any;
  refreshData: () => void;
  showToast?: (params: { message: string; type: 'success' | 'error' | 'info' | 'warning'; retryFn?: () => void }) => void;
}

export default function BriefTab({ userId, data, refreshData, showToast: externalShowToast }: BriefTabProps) {
  const [briefs, setBriefs] = useState<any[]>([]);
  const [selectedBriefId, setSelectedBriefId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [showRaw, setShowRaw] = useState(false);
  const [generateServiceId, setGenerateServiceId] = useState<string | undefined>(undefined);
  const [confirmGenerate, setConfirmGenerate] = useState(false);
  const [confirmRegenerate, setConfirmRegenerate] = useState(false);
  const [showCompleteness, setShowCompleteness] = useState(false);
  const { user } = useAuth();

  const { showToast: localShowToast } = useAdminToast();
  const showToast = externalShowToast || localShowToast;

  const fetchBriefs = useCallback(async () => {
    setLoading(true);
    const { data: briefsData } = await supabase
      .from('client_briefs')
      .select('*')
      .eq('client_id', userId)
      .order('created_at', { ascending: false });
    setBriefs(briefsData || []);
    if (briefsData && briefsData.length > 0 && !selectedBriefId) {
      setSelectedBriefId(briefsData[0].id);
    }
    setLoading(false);
  }, [userId, selectedBriefId]);

  useEffect(() => {
    fetchBriefs();
  }, [fetchBriefs]);

  const selectedBrief = briefs.find(b => b.id === selectedBriefId) || briefs[0];

  const handleGenerateBrief = useCallback(async () => {
    setConfirmGenerate(false);
    if (!data.profile.has_submitted_intake) {
      showToast({ message: 'Client must submit intake form first.', type: 'warning' });
      return;
    }

    if (!briefGenerationLimiter.consume()) {
      const waitSec = Math.ceil(briefGenerationLimiter.getWaitTimeMs() / 1000);
      showToast({ message: `Please wait ${waitSec}s before generating another brief.`, type: 'warning', duration: 4000 });
      return;
    }

    setGenerating(true);

    try {
      const body: Record<string, string> = { user_id: userId };
      if (generateServiceId) body.service_id = generateServiceId;

      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) throw new Error('Not authenticated');

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/generate-brief`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify(body),
        }
      );

      const result = await response.json();

      if (response.ok && result.success) {
        showToast({ message: `Brief generated successfully using ${result.model || 'AI'}.`, type: 'success' });
        if (user) {
          logActivity({ adminId: user?.id || '', adminEmail: user?.email || '', clientId: userId, actionType: 'brief_generated', actionLabel: `Generated ${generateServiceId ? getServiceById(generateServiceId)?.name ?? generateServiceId : 'comprehensive'} brief`, metadata: { serviceId: generateServiceId } });
        }
        await fetchBriefs();
        refreshData();
      } else {
        const errMsg = result.error || (response.status === 404 ? 'Service starting up — please wait 30 seconds and try again.' : 'Failed to generate brief.');
        showToast({ message: errMsg, type: 'error', retryFn: () => handleGenerateBrief() });
      }
    } catch {
      showToast({ message: 'Network error generating brief. Check your connection and try again.', type: 'error', retryFn: () => handleGenerateBrief() });
    } finally {
      setGenerating(false);
    }
  }, [data.profile.has_submitted_intake, generateServiceId, userId, showToast, fetchBriefs, refreshData, user]);

  const handleRegenerateBrief = useCallback(async () => {
    setConfirmRegenerate(false);
    setGenerateServiceId(selectedBrief?.service_id || undefined);
    setTimeout(() => {
      handleGenerateBriefWithService(selectedBrief?.service_id || undefined);
    }, 50);
  }, [selectedBrief]);

  const handleGenerateBriefWithService = useCallback(async (serviceId: string | undefined) => {
    if (!data.profile.has_submitted_intake) {
      showToast({ message: 'Client must submit intake form first.', type: 'warning' });
      return;
    }

    if (!briefGenerationLimiter.consume()) {
      const waitSec = Math.ceil(briefGenerationLimiter.getWaitTimeMs() / 1000);
      showToast({ message: `Please wait ${waitSec}s before generating another brief.`, type: 'warning', duration: 4000 });
      return;
    }

    setGenerating(true);

    try {
      const body: Record<string, string> = { user_id: userId };
      if (serviceId) body.service_id = serviceId;

      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) throw new Error('Not authenticated');

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/generate-brief`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify(body),
        }
      );

      const result = await response.json();

      if (response.ok && result.success) {
        showToast({ message: `Brief regenerated successfully using ${result.model || 'AI'}.`, type: 'success' });
        if (user) {
          logActivity({ adminId: user?.id || '', adminEmail: user?.email || '', clientId: userId, actionType: 'brief_regenerated', actionLabel: `Regenerated ${serviceId ? getServiceById(serviceId)?.name ?? serviceId : 'comprehensive'} brief`, metadata: { serviceId } });
        }
        await fetchBriefs();
        refreshData();
      } else {
        const errMsg = result.error || (response.status === 404 ? 'Service starting up — please wait 30 seconds and try again.' : 'Failed to regenerate brief.');
        showToast({ message: errMsg, type: 'error', retryFn: () => handleGenerateBriefWithService(serviceId) });
      }
    } catch {
      showToast({ message: 'Network error regenerating brief. Check your connection and try again.', type: 'error', retryFn: () => handleGenerateBriefWithService(serviceId) });
    } finally {
      setGenerating(false);
    }
  }, [data.profile.has_submitted_intake, userId, showToast, fetchBriefs, refreshData, user]);

  const handleDownloadBrief = useCallback(() => {
    if (!selectedBrief?.brief_content) return;

    const svcSuffix = selectedBrief.service_id ? `_${selectedBrief.service_id}` : '';
    const blob = new Blob([selectedBrief.brief_content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `client_brief_${userId.substring(0, 8)}${svcSuffix}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast({ message: 'Brief downloaded.', type: 'success' });
    if (user) {
      logActivity({ adminId: user?.id || '', adminEmail: user?.email || '', clientId: userId, actionType: 'brief_downloaded', actionLabel: 'Downloaded brief as TXT' });
    }
  }, [selectedBrief, userId, showToast, user]);

  const handleCopyToClipboard = useCallback(() => {
    if (!selectedBrief?.brief_content) return;
    navigator.clipboard.writeText(selectedBrief.brief_content);
    showToast({ message: 'Brief copied to clipboard.', type: 'success' });
  }, [selectedBrief, showToast]);

  const formatBriefContent = useCallback((content: string) => {
    if (!content) return [];
    const sections = content.split(/=== .+ ===/);
    const headers = content.match(/=== .+ ===/g) || [];
    return headers.map((header, i) => ({
      header: header.replace(/=== /g, '').replace(/ ===/g, ''),
      content: sections[i + 1]?.trim() || '',
    }));
  }, []);

  const getStatusConfig = useCallback((status: string) => {
    const configs: Record<string, { color: string; bg: string; label: string; icon: any }> = {
      pending: { color: 'text-gray-600', bg: 'bg-gray-100', label: 'Pending', icon: Clock },
      generating: { color: 'text-blue-600', bg: 'bg-blue-50', label: 'Generating...', icon: RefreshCw },
      completed: { color: 'text-green-600', bg: 'bg-green-50', label: 'Completed', icon: CheckCircle2 },
      failed: { color: 'text-red-600', bg: 'bg-red-50', label: 'Failed', icon: AlertCircle },
    };
    return configs[status] || configs.pending;
  }, []);

  const briefServiceOptions = useMemo(() => {
    const purchasedServiceIds = data.purchasedServices?.map((ps: any) => ps.service_id) || [];
    return [
      { value: '', label: 'Comprehensive Brief (all services)' },
      ...purchasedServiceIds
        .filter((id: string) => id !== 'quarterly_refresh')
        .map((id: string) => ({
          value: id,
          label: getServiceById(id)?.name ?? id,
        })),
    ];
  }, [data.purchasedServices]);

  const completenessReport = useMemo(() => {
    if (!selectedBrief?.brief_content) return null;
    return calculateBriefCompleteness(selectedBrief.brief_content);
  }, [selectedBrief]);

  if (loading) {
    return <BriefTabSkeleton />;
  }

  const statusConfig = selectedBrief ? getStatusConfig(selectedBrief.status) : getStatusConfig('pending');
  const StatusIcon = statusConfig.icon;

  return (
    <div className="space-y-6">
      {/* Header with Status */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-inter font-bold text-[#1B3F7A] text-xl mb-2">Client Briefs</h3>
            <p className="font-inter text-gray-600 text-sm">AI-generated briefs for document drafting</p>
          </div>
          {selectedBrief && (
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${statusConfig.bg}`}>
              <StatusIcon size={18} className={`${statusConfig.color} ${selectedBrief.status === 'generating' ? 'animate-spin' : ''}`} />
              <span className={`font-inter font-medium text-sm ${statusConfig.color}`}>{statusConfig.label}</span>
            </div>
          )}
        </div>

        <div className="space-y-3">
          {/* Service selector + generate */}
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={generateServiceId || ''}
              onChange={(e) => setGenerateServiceId(e.target.value || undefined)}
              className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2C68C4] focus:border-[#2C68C4] font-inter text-sm bg-white"
            >
              {briefServiceOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>

            {confirmGenerate ? (
              <div className="flex items-center gap-2">
                <span className="font-inter text-sm text-gray-700">Generate {generateServiceId ? getServiceById(generateServiceId)?.name ?? generateServiceId : 'comprehensive'} brief{selectedBrief ? ' (will overwrite)' : ''}?</span>
                <button
                  onClick={handleGenerateBrief}
                  disabled={generating}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#1B3F7A] hover:bg-[#2C68C4] text-white rounded-md font-inter text-sm font-semibold transition-colors disabled:opacity-50"
                >
                  {generating ? <><RefreshCw size={16} className="animate-spin" /> Generating...</> : <><Briefcase size={16} /> Confirm</>}
                </button>
                <button
                  onClick={() => setConfirmGenerate(false)}
                  disabled={generating}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-md font-inter text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmGenerate(true)}
                disabled={generating || !data.profile.has_submitted_intake}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#1B3F7A] hover:bg-[#2C68C4] text-white rounded-md font-inter text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {generating ? <><RefreshCw size={16} className="animate-spin" /> Generating...</> : <><Briefcase size={16} /> Generate Brief</>}
              </button>
            )}
          </div>

          {/* Brief tabs */}
          {briefs.length > 1 && (
            <div className="flex flex-wrap gap-2">
              {briefs.map(b => (
                <button
                  key={b.id}
                  onClick={() => setSelectedBriefId(b.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-inter font-medium transition-colors ${
                    selectedBriefId === b.id ? 'bg-[#1B3F7A] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Package size={10} />
                  {b.service_id ? (getServiceById(b.service_id)?.name?.replace(' Pack', '').replace(' Starter', '') ?? b.service_id) : 'Comprehensive'}
                  {b.version > 1 && <span className="opacity-70 ml-0.5">v{b.version}</span>}
                </button>
              ))}
            </div>
          )}

          {/* Actions */}
          {selectedBrief?.brief_content && (
            <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-gray-200">
              {confirmRegenerate ? (
                <div className="flex items-center gap-2">
                  <span className="font-inter text-sm text-gray-700">Overwrite existing brief?</span>
                  <button
                    onClick={handleRegenerateBrief}
                    disabled={generating}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md font-inter text-sm font-semibold transition-colors disabled:opacity-50"
                  >
                    <RefreshCw size={16} /> Yes, Regenerate
                  </button>
                  <button
                    onClick={() => setConfirmRegenerate(false)}
                    disabled={generating}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-md font-inter text-sm font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmRegenerate(true)}
                  disabled={generating}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-[#1B3F7A] border border-[#1B3F7A] rounded-md font-inter text-sm font-medium transition-colors"
                >
                  <RefreshCw size={16} /> Regenerate
                </button>
              )}
              <button
                onClick={handleDownloadBrief}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-[#1B3F7A] border border-[#1B3F7A] rounded-md font-inter text-sm font-medium transition-colors"
              >
                <Download size={16} /> Download TXT
              </button>
              <button
                onClick={handleCopyToClipboard}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-md font-inter text-sm font-medium transition-colors"
              >
                <Copy size={16} /> Copy to Clipboard
              </button>
              <button
                onClick={() => setShowRaw(!showRaw)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-md font-inter text-sm font-medium transition-colors"
              >
                <Eye size={16} /> {showRaw ? 'Show Formatted' : 'Show Raw'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* No Brief State */}
      {briefs.length === 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          {data.profile.has_submitted_intake ? (
            <>
              <Briefcase size={48} className="text-gray-300 mx-auto mb-4" />
              <h4 className="font-inter font-semibold text-gray-900 text-lg mb-2">Ready to Generate</h4>
              <p className="font-inter text-gray-600 text-sm mb-6">All intake data is in — generate the client brief to begin document production.</p>
            </>
          ) : (
            <>
              <FileText size={48} className="text-gray-300 mx-auto mb-4" />
              <h4 className="font-inter font-semibold text-gray-900 text-lg mb-2">Intake Form Required</h4>
              <p className="font-inter text-gray-600 text-sm mb-6">The client must submit their intake form before a brief can be generated.</p>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 max-w-md mx-auto">
                <p className="font-inter text-amber-800 text-xs">Use the Messages tab to remind the client to complete their intake form.</p>
              </div>
            </>
          )}
        </div>
      )}

      {/* Brief Failed */}
      {selectedBrief?.status === 'failed' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <AlertCircle size={24} className="text-red-600 shrink-0" />
            <div className="flex-1">
              <h4 className="font-inter font-semibold text-red-900 mb-1">Generation Failed</h4>
              <p className="font-inter text-red-700 text-sm mb-3">{selectedBrief.error_message || 'An error occurred while generating the brief.'}</p>
              <button
                onClick={() => { setGenerateServiceId(selectedBrief?.service_id || undefined); handleRegenerateBrief(); }}
                disabled={generating}
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md font-inter text-sm font-semibold transition-colors disabled:opacity-50"
              >
                <RefreshCw size={16} /> Retry Generation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Brief Content */}
      {selectedBrief?.brief_content && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {/* Metadata Bar */}
          <div className="bg-[#FAFBFC] border-b border-gray-200 px-6 py-3">
            <div className="flex flex-wrap items-center gap-6 text-sm">
              <div>
                <span className="font-inter text-gray-600">Version: </span>
                <span className="font-inter font-semibold text-[#1B3F7A]">v{selectedBrief.version || 1}</span>
              </div>
              {selectedBrief.service_id && (
                <div>
                  <span className="font-inter text-gray-600">Service: </span>
                  <span className="font-inter text-gray-900">{getServiceById(selectedBrief.service_id)?.name ?? selectedBrief.service_id}</span>
                </div>
              )}
              <div>
                <span className="font-inter text-gray-600">Generated: </span>
                <span className="font-inter text-gray-900">
                  {selectedBrief.generated_at ? new Date(selectedBrief.generated_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                </span>
              </div>
              {selectedBrief.model_used && (
                <div>
                  <span className="font-inter text-gray-600">Model: </span>
                  <span className="font-inter text-gray-900">{selectedBrief.model_used}</span>
                </div>
              )}
              {selectedBrief.provider && (
                <div>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-inter font-medium ${
                    selectedBrief.provider === 'chatz' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {selectedBrief.provider === 'chatz' ? 'chat.z.ai' : 'Gemini (fallback)'}
                  </span>
                </div>
              )}
              {selectedBrief.generation_duration_ms && (
                <div>
                  <span className="font-inter text-gray-600">Duration: </span>
                  <span className="font-inter text-gray-900">
                    {selectedBrief.generation_duration_ms < 1000 ? `${selectedBrief.generation_duration_ms}ms` : `${(selectedBrief.generation_duration_ms / 1000).toFixed(1)}s`}
                  </span>
                </div>
              )}
              {selectedBrief.risk_level && (
                <div>
                  <span className="font-inter text-gray-600">Risk: </span>
                  <span className={`font-inter font-medium ${
                    selectedBrief.risk_level === 'High' ? 'text-red-600' : selectedBrief.risk_level === 'Medium' ? 'text-amber-600' : 'text-green-600'
                  }`}>{selectedBrief.risk_level}</span>
                </div>
              )}
            </div>
          </div>

          {/* Completeness Score Bar */}
          {completenessReport && (
            <div className="px-6 py-3 border-b border-gray-200 bg-white">
              <div className="flex items-center gap-3 mb-2">
                <Shield size={16} className="text-[#1B3F7A] shrink-0" />
                <span className="font-inter text-sm font-medium text-gray-700">Brief Completeness:</span>
                <span className={`font-inter font-bold text-sm ${getCompletenessTextColor(completenessReport.overallScore)}`}>
                  {completenessReport.overallScore}%
                </span>
                <span className="font-inter text-xs text-gray-400">
                  ({completenessReport.sectionsFound}/{completenessReport.totalSections} sections)
                </span>
                <button
                  onClick={() => setShowCompleteness(!showCompleteness)}
                  className="ml-auto inline-flex items-center gap-1 px-2 py-1 text-gray-500 hover:text-[#1B3F7A] hover:bg-gray-50 rounded text-xs font-inter font-medium transition-colors"
                >
                  {showCompleteness ? <><ChevronUp size={12} /> Hide Details</> : <><ChevronDown size={12} /> Details</>}
                </button>
              </div>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full ${getCompletenessColor(completenessReport.overallScore)} rounded-full transition-all duration-500`}
                  style={{ width: `${completenessReport.overallScore}%` }}
                />
              </div>

              {showCompleteness && (
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {Object.entries(completenessReport.sectionScores).map(([section, score]) => (
                    <div
                      key={section}
                      className={`px-3 py-2 rounded-lg border ${
                        score.score < 70 ? 'border-amber-200 bg-amber-50/50' : 'border-gray-200 bg-gray-50/50'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-inter text-xs font-medium text-gray-700 truncate">{section}</span>
                        <span className={`font-inter text-xs font-bold ${getCompletenessTextColor(score.score)}`}>{score.score}%</span>
                      </div>
                      {score.missingFields.length > 0 && (
                        <p className="font-inter text-xs text-amber-600 mt-1">Missing: {score.missingFields.join(', ')}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {completenessReport.criticalMissing.length > 0 && (
                <div className="mt-2 flex items-start gap-2 text-xs text-red-600 font-inter">
                  <AlertCircle size={12} className="shrink-0 mt-0.5" />
                  <span>Critical fields missing: {completenessReport.criticalMissing.slice(0, 3).join('; ')}{completenessReport.criticalMissing.length > 3 && ` +${completenessReport.criticalMissing.length - 3} more`}</span>
                </div>
              )}
            </div>
          )}

          {/* Content Display */}
          <div className="p-6">
            {showRaw ? (
              <pre className="font-mono text-xs text-gray-800 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-x-auto">
                {selectedBrief.brief_content}
              </pre>
            ) : (
              <div className="space-y-6">
                {formatBriefContent(selectedBrief.brief_content).map((section, i) => {
                  const sectionScore = completenessReport?.sectionScores[section.header];
                  const hasMissing = sectionScore && sectionScore.missingFields.length > 0;
                  return (
                    <div key={i} className={`border-b border-gray-100 pb-6 last:border-b-0 ${hasMissing ? 'border-l-2 border-l-amber-300 pl-3' : ''}`}>
                      <h4 className="font-inter font-bold text-[#1B3F7A] text-base mb-3 uppercase tracking-wide">{section.header}</h4>
                      <div className="font-inter text-gray-700 text-sm whitespace-pre-wrap leading-relaxed">{section.content}</div>
                      {hasMissing && (
                        <p className="mt-2 font-inter text-xs text-amber-600">Missing: {sectionScore.missingFields.join(', ')}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
