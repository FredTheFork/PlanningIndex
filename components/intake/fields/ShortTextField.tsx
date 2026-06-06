'use client';

import { FormField } from '@/lib/forms/intake-definition';

interface ShortTextFieldProps {
  field: FormField;
  value: string;
  onChange: (value: string) => void;
  error?: string | null;
  prefillSuggestion?: string | null;
}

export default function ShortTextField({
  field,
  value,
  onChange,
  error,
  prefillSuggestion,
}: ShortTextFieldProps) {
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

      {prefillSuggestion && !value && (
        <button
          type="button"
          onClick={() => onChange(prefillSuggestion)}
          className="mb-2 inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F0F4FF] border border-[#4A90E2]/30 rounded-md text-xs font-inter text-[#2C68C4] hover:bg-[#4A90E2]/10 transition-colors"
        >
          Use your previous answer
        </button>
      )}

      <input
        id={field.id}
        type="text"
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
