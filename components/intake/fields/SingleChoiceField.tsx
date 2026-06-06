'use client';

import { FormField } from '@/lib/forms/intake-definition';

interface SingleChoiceFieldProps {
  field: FormField;
  value: string;
  onChange: (value: string) => void;
  error?: string | null;
}

export default function SingleChoiceField({
  field,
  value,
  onChange,
  error,
}: SingleChoiceFieldProps) {
  return (
    <div>
      <label className="block font-inter font-medium text-[#1A1A2E] text-sm mb-1.5">
        {field.questionNumber && (
          <span className="text-[#2C68C4] mr-1">{field.questionNumber}.</span>
        )}
        {field.label}
        {field.required && <span className="text-[#E53E3E] ml-0.5">*</span>}
      </label>

      {field.helpText && (
        <p className="font-inter text-[#4A5568] text-xs mb-2">{field.helpText}</p>
      )}

      <div className="space-y-2 mt-2">
        {(field.options || []).map((option) => (
          <label
            key={option}
            className="flex items-center gap-3 p-3 rounded-md border border-[#E2E8F0] hover:border-[#2C68C4] hover:bg-[#F0F4FF] cursor-pointer transition-colors"
          >
            <input
              type="radio"
              name={field.id}
              value={option}
              checked={value === option}
              onChange={() => onChange(option)}
              className="h-4 w-4 text-[#2C68C4] focus:ring-[#2C68C4]/40 border-[#E2E8F0]"
            />
            <span className="font-inter text-sm text-[#1A1A2E]">{option}</span>
          </label>
        ))}
      </div>

      {error && (
        <p className="mt-1 font-inter text-[#E53E3E] text-xs">{error}</p>
      )}
    </div>
  );
}
