'use client';

import { FormSection } from '@/lib/forms/intake-definition';
import { isSectionComplete, getVisibleFields } from '@/lib/forms/conditional-logic';

interface ProgressBarProps {
  sections: FormSection[];
  responses: Record<string, any>;
  currentSectionId: string;
  onNavigate: (sectionId: string) => void;
  completedSectionIds: string[];
  newSectionIds: string[];
}

export default function ProgressBar({
  sections,
  responses,
  currentSectionId,
  onNavigate,
  completedSectionIds,
  newSectionIds,
}: ProgressBarProps) {
  const totalSections = sections.filter((s) => s.id !== 'intro').length;
  const completedCount = sections.filter(
    (s) => s.id !== 'intro' && isSectionComplete(s.fields, responses)
  ).length;
  const percentage = totalSections > 0 ? Math.round((completedCount / totalSections) * 100) : 0;

  return (
    <div className="bg-white rounded-lg border border-[#E2E8F0] p-4 mb-6">
      {/* Progress bar */}
      <div className="flex items-center justify-between mb-2">
        <span className="font-inter font-medium text-[#1A1A2E] text-sm">
          Progress
        </span>
        <span className="font-inter text-[#4A5568] text-xs">
          {completedCount} of {totalSections} sections complete ({percentage}%)
        </span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2">
        <div
          className="bg-[#2C68C4] h-2 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Section dots */}
      <div className="flex items-center gap-1 mt-3 overflow-x-auto pb-1">
        {sections
          .filter((s) => s.id !== 'intro')
          .map((section, index) => {
            const isComplete = isSectionComplete(section.fields, responses);
            const isCurrent = currentSectionId === section.id;
            const isLocked = completedSectionIds.includes(section.id) && !newSectionIds.includes(section.id);
            const isNew = newSectionIds.includes(section.id);

            return (
              <button
                key={section.id}
                type="button"
                onClick={() => onNavigate(section.id)}
                title={section.title}
                className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-inter text-xs font-medium transition-colors ${
                  isCurrent
                    ? 'bg-[#2C68C4] text-white ring-2 ring-[#2C68C4]/30'
                    : isComplete
                    ? 'bg-[#38A169] text-white'
                    : isNew
                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                    : isLocked
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-100 text-[#4A5568] hover:bg-[#F0F4FF]'
                }`}
              >
                {isComplete ? '✓' : index + 1}
              </button>
            );
          })}
      </div>
    </div>
  );
}
