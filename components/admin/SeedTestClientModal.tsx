'use client';

import { useState } from 'react';
import { Sparkles, X, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

const SERVICE_OPTIONS = [
  { id: 'business_foundations_pack', label: 'Business Foundations Pack' },
  { id: 'website_copy_pack', label: 'Website Copy Starter Pack' },
  { id: 'social_media_pack', label: 'Social Media Starter Pack' },
  { id: 'client_onboarding_pack', label: 'Client Onboarding & Scope Control' },
  { id: 'payment_protection_pack', label: 'Payment Protection Pack' },
  { id: 'copyright_licensing_pack', label: 'Copyright & Licensing Pack' },
  { id: 'gdpr_deep_pack', label: 'GDPR Deep Compliance Pack' },
  { id: 'coach_industry_pack', label: 'Coach Industry Pack' },
  { id: 'photographer_industry_pack', label: 'Photographer Industry Pack' },
  { id: 'consultant_industry_pack', label: 'Consultant Industry Pack' },
  { id: 'contractor_industry_pack', label: 'Contractor Industry Pack' },
];

interface GenerateResult {
  success: boolean;
  email?: string;
  businessName?: string;
  error?: string;
}

interface SeedTestClientModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function SeedTestClientModal({ open, onClose, onSuccess }: SeedTestClientModalProps) {
  const [selectedServices, setSelectedServices] = useState<Set<string>>(new Set(['business_foundations_pack']));
  const [personaHint, setPersonaHint] = useState('');
  const [count, setCount] = useState(1);
  const [generating, setGenerating] = useState(false);
  const [results, setResults] = useState<GenerateResult[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const toggleService = (id: string) => {
    setSelectedServices(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleGenerate = async () => {
    if (selectedServices.size === 0) {
      setError('Select at least one service pack.');
      return;
    }

    setGenerating(true);
    setError(null);
    setResults(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/seed-test-client`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            service_ids: Array.from(selectedServices),
            persona_hint: personaHint || undefined,
            count,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to generate test client(s).');
        return;
      }

      setResults(data.results || []);
      if (data.generated > 0) {
        onSuccess();
      }
    } catch (err: any) {
      setError(err.message || 'Network error. Check your connection and try again.');
    } finally {
      setGenerating(false);
    }
  };

  const handleClose = () => {
    setResults(null);
    setError(null);
    setPersonaHint('');
    setCount(1);
    setSelectedServices(new Set(['business_foundations_pack']));
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Sparkles size={20} className="text-emerald-600" />
            <h2 className="font-inter font-bold text-[#1B3F7A] text-lg">Generate Test Client</h2>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-5">
          {results ? (
            /* Results view */
            <div className="space-y-3">
              <p className="font-inter text-sm text-gray-700">
                {results.filter(r => r.success).length} test client(s) generated successfully.
              </p>
              <div className="space-y-2">
                {results.map((r, i) => (
                  <div
                    key={i}
                    className={`flex items-start gap-3 p-3 rounded-lg border ${
                      r.success ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'
                    }`}
                  >
                    {r.success ? (
                      <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle size={16} className="text-red-600 shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1 min-w-0">
                      {r.success ? (
                        <>
                          <p className="font-inter text-sm font-medium text-gray-900 truncate">
                            {r.businessName}
                          </p>
                          <p className="font-inter text-xs text-gray-500 truncate">{r.email}</p>
                        </>
                      ) : (
                        <p className="font-inter text-sm text-red-700">{r.error}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={handleClose}
                className="w-full px-4 py-2.5 bg-[#1B3F7A] hover:bg-[#2C68C4] text-white rounded-lg font-inter text-sm font-medium transition-colors"
              >
                Done
              </button>
            </div>
          ) : (
            /* Form view */
            <>
              {/* Service packs */}
              <div>
                <label className="block font-inter font-medium text-gray-700 text-sm mb-2">
                  Service Packs to Purchase
                </label>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {SERVICE_OPTIONS.map(s => (
                    <label
                      key={s.id}
                      className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-2 py-1.5 rounded transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedServices.has(s.id)}
                        onChange={() => toggleService(s.id)}
                        className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="font-inter text-sm text-gray-700">{s.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Persona hint */}
              <div>
                <label className="block font-inter font-medium text-gray-700 text-sm mb-2">
                  Persona Hint <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  value={personaHint}
                  onChange={e => setPersonaHint(e.target.value)}
                  placeholder="e.g. female photographer in Edinburgh, male contractor in Manchester"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg font-inter text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
                <p className="font-inter text-xs text-gray-500 mt-1">
                  Leave blank for a fully random business idea.
                </p>
              </div>

              {/* Count */}
              <div>
                <label className="block font-inter font-medium text-gray-700 text-sm mb-2">
                  Number of Clients
                </label>
                <select
                  value={count}
                  onChange={e => setCount(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg font-inter text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white"
                >
                  <option value={1}>1 client</option>
                  <option value={2}>2 clients</option>
                  <option value={3}>3 clients</option>
                  <option value={5}>5 clients</option>
                </select>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle size={16} className="text-red-600 shrink-0 mt-0.5" />
                  <p className="font-inter text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* Info note */}
              <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <Sparkles size={14} className="text-blue-600 shrink-0 mt-0.5" />
                <p className="font-inter text-xs text-blue-700">
                  Uses chat.z.ai (free) to invent a realistic UK sole trader, fill the entire intake form,
                  and trigger brief generation. Test clients are flagged and can be bulk-deleted.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {!results && (
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
            <button
              onClick={handleClose}
              disabled={generating}
              className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg font-inter text-sm font-medium transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleGenerate}
              disabled={generating || selectedServices.size === 0}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-inter text-sm font-medium transition-colors disabled:opacity-50"
            >
              {generating ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  Generate
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
