'use client';

import { CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { FormSection } from '@/lib/forms/intake-definition';
import { getVisibleFields } from '@/lib/forms/conditional-logic';

interface ReadOnlySectionProps {
  section: FormSection;
  responses: Record<string, any>;
}

export default function ReadOnlySection({
  section,
  responses,
}: ReadOnlySectionProps) {
  const [expanded, setExpanded] = useState(false);
  const visibleFields = getVisibleFields(section.fields, responses);

  return (
    <div className="bg-white rounded-lg border border-[#E2E8F0] overflow-hidden opacity-90">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="bg-green-100 rounded-lg p-2">
            <CheckCircle2 size={18} className="text-green-600" />
          </div>
          <div className="text-left">
            <h3 className="font-inter font-semibold text-[#1A1A2E] text-sm">
              {section.title}
            </h3>
            <p className="font-inter text-[#4A5568] text-xs">
              {visibleFields.length} questions — completed
            </p>
          </div>
        </div>
        {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>

      {expanded && (
        <div className="border-t border-[#E2E8F0] p-4 bg-[#FAFBFC]">
          <div className="space-y-3">
            {visibleFields.map((field) => {
              const value = responses[field.id];
              const isEmpty =
                value === null || value === undefined || value === '' ||
                (Array.isArray(value) && value.length === 0);

              if (isEmpty && !field.required) return null;

              const displayValue = (() => {
                if (isEmpty) return 'Not provided';
                if (field.type === 'checkbox') return value ? 'Yes' : 'No';
                if (field.type === 'multi_select') {
                  if (Array.isArray(value)) return value.join(', ');
                  return String(value);
                }
                if (field.type === 'repeating_section') {
                  if (Array.isArray(value)) {
                    return value
                      .map((item: any, i: number) =>
                        `${i + 1}. ${item.service_name || 'Unnamed'}`
                      )
                      .join('; ');
                  }
                  return String(value);
                }
                if (field.type === 'file_upload') {
                  if (Array.isArray(value)) return value.map((f: any) => f.name).join(', ');
                  return 'Files uploaded';
                }
                return String(value);
              })();

              return (
                <div key={field.id}>
                  <p className="font-inter font-medium text-[#1A1A2E] text-xs mb-0.5">
                    {field.questionNumber && (
                      <span className="text-[#2C68C4] mr-1">{field.questionNumber}.</span>
                    )}
                    {field.label}
                  </p>
                  <p className="font-inter text-[#4A5568] text-sm whitespace-pre-wrap">
                    {displayValue}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
