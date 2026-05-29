'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import {
  Briefcase, RefreshCw, Download, AlertCircle, CheckCircle2, Clock,
  FileText, Eye, Copy
} from 'lucide-react';

interface BriefTabProps {
  userId: string;
  data: any;
  refreshData: () => void;
}

export default function BriefTab({ userId, data, refreshData }: BriefTabProps) {
  const [brief, setBrief] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [showRaw, setShowRaw] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchBrief();
  }, [userId]);

  const fetchBrief = async () => {
    setLoading(true);
    const { data: briefData } = await supabase
      .from('client_briefs')
      .select('*')
      .eq('client_id', userId)
      .maybeSingle();
    setBrief(briefData);
    setLoading(false);
  };

  const handleGenerateBrief = async () => {
    if (!data.profile.has_submitted_intake) {
      setMessage('Client must submit intake form first');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    const confirmGen = confirm('This will generate a new brief and overwrite any existing content. Continue?');
    if (!confirmGen) return;

    setGenerating(true);
    setMessage('');

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
        setMessage(`Brief generated successfully using ${result.model || 'AI'}`);
        await fetchBrief();
        refreshData();
      } else {
        setMessage(result.error || 'Failed to generate brief');
      }
    } catch (error: any) {
      setMessage(error.message || 'Error generating brief');
    } finally {
      setGenerating(false);
      setTimeout(() => setMessage(''), 5000);
    }
  };

  const handleRegenerateBrief = async () => {
    const confirmRegen = confirm('Regenerate brief? This will overwrite the existing content.');
    if (!confirmRegen) return;
    await handleGenerateBrief();
  };

  const handleDownloadBrief = () => {
    if (!brief?.brief_content) return;

    const blob = new Blob([brief.brief_content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `client_brief_${userId.substring(0, 8)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyToClipboard = () => {
    if (!brief?.brief_content) return;
    navigator.clipboard.writeText(brief.brief_content);
    setMessage('Brief copied to clipboard');
    setTimeout(() => setMessage(''), 2000);
  };

  const formatBriefContent = (content: string) => {
    if (!content) return [];

    const sections = content.split(/=== .+ ===/);
    const headers = content.match(/=== .+ ===/g) || [];

    return headers.map((header, i) => ({
      header: header.replace(/=== /g, '').replace(/ ===/g, ''),
      content: sections[i + 1]?.trim() || '',
    }));
  };

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { color: string; bg: string; label: string; icon: any }> = {
      pending: { color: 'text-gray-600', bg: 'bg-gray-100', label: 'Pending', icon: Clock },
      generating: { color: 'text-blue-600', bg: 'bg-blue-50', label: 'Generating...', icon: RefreshCw },
      completed: { color: 'text-green-600', bg: 'bg-green-50', label: 'Completed', icon: CheckCircle2 },
      failed: { color: 'text-red-600', bg: 'bg-red-50', label: 'Failed', icon: AlertCircle },
    };
    return configs[status] || configs.pending;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1B3F7A]" />
      </div>
    );
  }

  const statusConfig = brief ? getStatusConfig(brief.status) : getStatusConfig('pending');
  const StatusIcon = statusConfig.icon;

  return (
    <div className="space-y-6">
      {/* Message */}
      {message && (
        <div className={`rounded-lg p-4 ${
          message.includes('success')
            ? 'bg-green-50 border border-green-200 text-green-800'
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          <p className="font-inter text-sm font-medium">{message}</p>
        </div>
      )}

      {/* Header with Status */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-inter font-bold text-[#1B3F7A] text-xl mb-2">
              Master Client Brief
            </h3>
            <p className="font-inter text-gray-600 text-sm">
              AI-generated comprehensive brief for document drafting
            </p>
          </div>
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${statusConfig.bg}`}>
            <StatusIcon size={18} className={`${statusConfig.color} ${brief?.status === 'generating' ? 'animate-spin' : ''}`} />
            <span className={`font-inter font-medium text-sm ${statusConfig.color}`}>
              {statusConfig.label}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={brief ? handleRegenerateBrief : handleGenerateBrief}
            disabled={generating || !data.profile.has_submitted_intake}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#1B3F7A] hover:bg-[#2C68C4] text-white rounded-md font-inter text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {generating ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Briefcase size={16} />
                {brief ? 'Regenerate Brief' : 'Generate Brief'}
              </>
            )}
          </button>

          {brief?.brief_content && (
            <>
              <button
                onClick={handleDownloadBrief}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-[#1B3F7A] border border-[#1B3F7A] rounded-md font-inter text-sm font-medium transition-colors"
              >
                <Download size={16} />
                Download TXT
              </button>
              <button
                onClick={handleCopyToClipboard}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-md font-inter text-sm font-medium transition-colors"
              >
                <Copy size={16} />
                Copy to Clipboard
              </button>
              <button
                onClick={() => setShowRaw(!showRaw)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-md font-inter text-sm font-medium transition-colors"
              >
                <Eye size={16} />
                {showRaw ? 'Show Formatted' : 'Show Raw'}
              </button>
            </>
          )}
        </div>
      </div>

      {/* No Brief State */}
      {!brief && (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <Briefcase size={48} className="text-gray-400 mx-auto mb-4" />
          <h4 className="font-inter font-semibold text-gray-900 text-lg mb-2">
            No Brief Generated Yet
          </h4>
          <p className="font-inter text-gray-600 text-sm mb-6">
            Generate a Master Client Brief to enable document creation.
          </p>
          {!data.profile.has_submitted_intake && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 max-w-md mx-auto">
              <p className="font-inter text-amber-800 text-xs">
                Client must submit their intake form before a brief can be generated.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Brief Failed */}
      {brief?.status === 'failed' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <AlertCircle size={24} className="text-red-600 shrink-0" />
            <div className="flex-1">
              <h4 className="font-inter font-semibold text-red-900 mb-1">Generation Failed</h4>
              <p className="font-inter text-red-700 text-sm mb-3">
                {brief.error_message || 'An error occurred while generating the brief.'}
              </p>
              <button
                onClick={handleRegenerateBrief}
                disabled={generating}
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md font-inter text-sm font-semibold transition-colors"
              >
                <RefreshCw size={16} />
                Retry Generation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Brief Content */}
      {brief?.brief_content && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {/* Metadata Bar */}
          <div className="bg-[#FAFBFC] border-b border-gray-200 px-6 py-3">
            <div className="flex flex-wrap items-center gap-6 text-sm">
              <div>
                <span className="font-inter text-gray-600">Generated: </span>
                <span className="font-inter text-gray-900">
                  {brief.generated_at ? new Date(brief.generated_at).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  }) : 'N/A'}
                </span>
              </div>
              {brief.model_used && (
                <div>
                  <span className="font-inter text-gray-600">Model: </span>
                  <span className="font-inter text-gray-900">{brief.model_used}</span>
                </div>
              )}
              {brief.risk_level && (
                <div>
                  <span className="font-inter text-gray-600">Risk Level: </span>
                  <span className={`font-inter font-medium ${
                    brief.risk_level === 'High' ? 'text-red-600' :
                    brief.risk_level === 'Medium' ? 'text-amber-600' : 'text-green-600'
                  }`}>
                    {brief.risk_level}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Content Display */}
          <div className="p-6">
            {showRaw ? (
              <pre className="font-mono text-xs text-gray-800 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-x-auto">
                {brief.brief_content}
              </pre>
            ) : (
              <div className="space-y-6">
                {formatBriefContent(brief.brief_content).map((section, i) => (
                  <div key={i} className="border-b border-gray-100 pb-6 last:border-b-0">
                    <h4 className="font-inter font-bold text-[#1B3F7A] text-base mb-3 uppercase tracking-wide">
                      {section.header}
                    </h4>
                    <div className="font-inter text-gray-700 text-sm whitespace-pre-wrap leading-relaxed">
                      {section.content}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
