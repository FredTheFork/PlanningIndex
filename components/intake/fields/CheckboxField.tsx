'use client';

import { FormField } from '@/lib/forms/intake-definition';

interface CheckboxFieldProps {
  field: FormField;
  value: boolean;
  onChange: (value: boolean) => void;
  error?: string | null;
}

export default function CheckboxField({
  field,
  value,
  onChange,
  error,
}: CheckboxFieldProps) {
  return (
    <div>
      <label className="flex items-start gap-3 p-3 rounded-md border border-[#E2E8F0] hover:border-[#2C68C4] hover:bg-[#F0F4FF] cursor-pointer transition-colors">
        <input
          type="checkbox"
          checked={value || false}
          onChange={(e) => onChange(e.target.checked)}
          className="mt-0.5 h-4 w-4 rounded text-[#2C68C4] focus:ring-[#2C68C4]/40 border-[#E2E8F0]"
        />
        <div>
          <span className="font-inter text-sm text-[#1A1A2E]">
            {field.questionNumber && (
              <span className="text-[#2C68C4] mr-1">{field.questionNumber}.</span>
            )}
            {field.label}
            {field.required && <span className="text-[#E53E3E] ml-0.5">*</span>}
          </span>
          {field.helpText && (
            <p className="font-inter text-[#4A5568] text-xs mt-1">{field.helpText}</p>
          )}
        </div>
      </label>

      {error && (
        <p className="mt-1 font-inter text-[#E53E3E] text-xs">{error}</p>
      )}
    </div>
  );
}
