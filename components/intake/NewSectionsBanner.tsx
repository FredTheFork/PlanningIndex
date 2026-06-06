'use client';

import { Sparkles } from 'lucide-react';

interface NewSectionsBannerProps {
  newSectionIds: string[];
  sectionTitles: Record<string, string>;
  onStartNewSections: () => void;
}

export default function NewSectionsBanner({
  newSectionIds,
  sectionTitles,
  onStartNewSections,
}: NewSectionsBannerProps) {
  if (newSectionIds.length === 0) return null;

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-5 mb-6">
      <div className="flex items-start gap-3">
        <Sparkles size={20} className="text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-inter font-semibold text-amber-900 text-sm mb-1">
            New sections available
          </p>
          <p className="font-inter text-amber-700 text-xs mb-3">
            You&apos;ve purchased additional services that require new information.
            Please complete the following sections:{' '}
            {newSectionIds
              .map((id) => sectionTitles[id] || id)
              .join(', ')}
          </p>
          <button
            type="button"
            onClick={onStartNewSections}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md font-inter font-semibold text-sm text-white bg-amber-600 hover:bg-amber-700 transition-colors"
          >
            Complete New Sections
          </button>
        </div>
      </div>
    </div>
  );
}
