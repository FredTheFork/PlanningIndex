'use client';

import { AlertCircle, ArrowRight } from 'lucide-react';

interface FieldMeta {
  label: string;
  questionNumber: string;
  sectionTitle: string;
}

interface ValidationSummaryProps {
  errors: Record<string, string>;
  fieldMeta?: Record<string, FieldMeta>;
  onScrollToField?: (fieldId: string) => void;
}

export default function ValidationSummary({
  errors,
  fieldMeta = {},
  onScrollToField,
}: ValidationSummaryProps) {
  const errorEntries = Object.entries(errors);
  if (errorEntries.length === 0) return null;

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
      <div className="flex items-start gap-3">
        <AlertCircle size={20} className="text-[#E53E3E] shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="font-inter font-semibold text-[#E53E3E] text-sm mb-2">
            Please fix the following errors before submitting:
          </p>
          <ul className="space-y-2">
            {errorEntries.map(([fieldId, message]) => {
              const meta = fieldMeta[fieldId];
              const displayLabel = meta
                ? `${meta.questionNumber}: ${meta.label}`
                : fieldId;
              return (
                <li key={fieldId} className="bg-white rounded-md p-3 border border-red-100">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      {meta && (
                        <p className="font-inter font-medium text-[#1B3F7A] text-xs mb-1">
                          {meta.questionNumber} — {meta.sectionTitle}
                        </p>
                      )}
                      <p className="font-inter text-gray-700 text-xs font-medium truncate">
                        {meta ? meta.label : fieldId}
                      </p>
                      <p className="font-inter text-[#E53E3E] text-xs mt-1">
                        {message}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onScrollToField?.(fieldId)}
                      className="flex items-center gap-1 font-inter font-semibold text-[#1B3F7A] text-xs hover:text-[#2C68C4] transition-colors shrink-0"
                    >
                      See question
                      <ArrowRight size={12} />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
