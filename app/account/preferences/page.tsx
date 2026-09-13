'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Button, Select, Alert } from '@/components/ui';
import { radiusOptions, tradeTagOptions } from '@/lib/mock/applications';

export default function PreferencesPage() {
  const [defaultRadius, setDefaultRadius] = useState('25');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session?.user) return;
      const { data } = await supabase
        .from('profiles')
        .select('default_search_radius, default_trade_tags')
        .eq('id', session.user.id)
        .maybeSingle();

      if (data) {
        setDefaultRadius(data.default_search_radius || '25');
        setSelectedTags(data.default_trade_tags || []);
      }
      setLoading(false);
    });
  }, []);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess(false);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          default_search_radius: defaultRadius,
          default_trade_tags: selectedTags,
        })
        .eq('id', session.user.id);

      if (updateError) {
        setError(updateError.message);
        return;
      }

      setSuccess(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-primary-200 border-t-accent-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-sans font-semibold text-primary-900 text-lg mb-1">
        Preferences
      </h2>
      <p className="font-sans text-primary-500 text-sm mb-6">
        Set your default search and workspace preferences.
      </p>

      {error && <Alert variant="danger" className="mb-4">{error}</Alert>}
      {success && <Alert variant="success" className="mb-4">Preferences updated.</Alert>}

      <form onSubmit={handleSave} className="max-w-md space-y-6">
        <div>
          <Select
            label="Default search radius"
            name="defaultRadius"
            value={defaultRadius}
            onChange={(e) => setDefaultRadius(e.target.value)}
          >
            {radiusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </Select>
          <p className="font-sans text-xs text-primary-400 mt-1.5">
            This radius is pre-selected when you open Planning Search.
          </p>
        </div>

        <div>
          <label className="block font-sans font-medium text-primary-900 text-sm mb-2">
            Default trade tags
          </label>
          <div className="flex flex-wrap gap-2">
            {tradeTagOptions
              .filter((opt) => opt.value !== 'all')
              .map((opt) => {
                const isSelected = selectedTags.includes(opt.value);
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => toggleTag(opt.value)}
                    className={`inline-flex items-center rounded-lg border px-3 py-2 font-sans text-sm font-medium transition-colors ${
                      isSelected
                        ? 'border-accent-500 bg-accent-50 text-accent-700'
                        : 'border-primary-200 bg-white text-primary-600 hover:border-primary-300'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
          </div>
          <p className="font-sans text-xs text-primary-400 mt-2">
            These tags are pre-selected when you filter planning applications by trade.
          </p>
        </div>

        <Button type="submit" loading={saving}>
          Save Preferences
        </Button>
      </form>
    </div>
  );
}
