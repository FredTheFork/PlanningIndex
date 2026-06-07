'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { FormSection } from '@/lib/forms/intake-definition';

interface SectionNavProps {
  sections: FormSection[];
  currentSectionId: string;
  onNavigate: (sectionId: string) => void;
  onValidateAndNext: () => boolean;
  onSubmit: () => void;
  submitting: boolean;
  completedSectionIds: string[];
  newSectionIds: string[];
}

export default function SectionNav({
  sections,
  currentSectionId,
  onNavigate,
  onValidateAndNext,
  onSubmit,
  submitting,
  completedSectionIds,
  newSectionIds,
}: SectionNavProps) {
  const currentIndex = sections.findIndex((s) => s.id === currentSectionId);
  const prevSection = currentIndex > 0 ? sections[currentIndex - 1] : null;
  const nextSection =
    currentIndex < sections.length - 1 ? sections[currentIndex + 1] : null;
  const isLastSection = currentIndex === sections.length - 1;
  const isIntro = currentSectionId === 'intro';

  const isNewSectionsMode = newSectionIds.length > 0;

  const handleNext = () => {
    if (isIntro) {
      const next = sections[currentIndex + 1];
      if (next) onNavigate(next.id);
      return;
    }
    const valid = onValidateAndNext();
    if (valid && nextSection) {
      onNavigate(nextSection.id);
    }
  };

  return (
    <div className="flex items-center justify-between mt-6">
      {/* Back button */}
      {prevSection && !isIntro ? (
        <button
          type="button"
          onClick={() => onNavigate(prevSection.id)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md font-inter font-semibold text-sm text-[#1B3F7A] border border-[#E2E8F0] hover:bg-[#F0F4FF] transition-colors"
        >
          <ChevronLeft size={16} />
          Back
        </button>
      ) : (
        <div />
      )}

      {/* Next / Submit button */}
      {isLastSection ? (
        <button
          type="button"
          onClick={onSubmit}
          disabled={submitting}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-md font-inter font-semibold text-sm text-white bg-[#1B3F7A] hover:bg-[#2C68C4] disabled:opacity-50 transition-colors"
        >
          {submitting ? (
            <>
              <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              Submitting...
            </>
          ) : isNewSectionsMode ? (
            'Submit New Sections'
          ) : (
            'Submit Form'
          )}
        </button>
      ) : nextSection ? (
        <button
          type="button"
          onClick={handleNext}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-md font-inter font-semibold text-sm text-white bg-[#1B3F7A] hover:bg-[#2C68C4] transition-colors"
        >
          {isIntro ? 'Begin' : 'Continue'}
          <ChevronRight size={16} />
        </button>
      ) : null}
    </div>
  );
}
