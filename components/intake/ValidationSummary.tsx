'use client';

import { AlertCircle } from 'lucide-react';

interface ValidationSummaryProps {
  errors: Record<string, string>;
  onScrollToField?: (fieldId: string) => void;
}

export default function ValidationSummary({
  errors,
  onScrollToField,
}: ValidationSummaryProps) {
  const errorEntries = Object.entries(errors);
  if (errorEntries.length === 0) return null;

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
      <div className="flex items-start gap-3">
        <AlertCircle size={20} className="text-[#E53E3E] shrink-0 mt-0.5" />
        <div>
          <p className="font-inter font-semibold text-[#E53E3E] text-sm mb-1">
            Please fix the following errors before submitting:
          </p>
          <ul className="space-y-1">
            {errorEntries.map(([fieldId, message]) => (
              <li key={fieldId}>
                <button
                  type="button"
                  onClick={() => onScrollToField?.(fieldId)}
                  className="font-inter text-[#E53E3E] text-xs hover:underline text-left"
                >
                  {message}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
