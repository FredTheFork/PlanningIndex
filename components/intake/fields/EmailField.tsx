'use client';

import { FormField } from '@/lib/forms/intake-definition';

interface EmailFieldProps {
  field: FormField;
  value: string;
  onChange: (value: string) => void;
  error?: string | null;
}

export default function EmailField({ field, value, onChange, error }: EmailFieldProps) {
  return (
    <div>
      <label htmlFor={field.id} className="block font-inter font-medium text-[#1A1A2E] text-sm mb-1.5">
        {field.questionNumber && (
          <span className="text-[#2C68C4] mr-1">{field.questionNumber}.</span>
        )}
        {field.label}
        {field.required && <span className="text-[#E53E3E] ml-0.5">*</span>}
      </label>

      {field.helpText && (
        <p className="font-inter text-[#4A5568] text-xs mb-2">{field.helpText}</p>
      )}

      <input
        id={field.id}
        type="email"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder}
        className={`w-full rounded-md border px-3 py-2 font-inter text-sm text-[#1A1A2E] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2C68C4]/40 focus:border-[#2C68C4] transition-colors ${
          error ? 'border-[#E53E3E]' : 'border-[#E2E8F0]'
        }`}
      />

      {error && (
        <p className="mt-1 font-inter text-[#E53E3E] text-xs">{error}</p>
      )}
    </div>
  );
}
