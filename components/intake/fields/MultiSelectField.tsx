'use client';

import { useState } from 'react';
import { FormField } from '@/lib/forms/intake-definition';

interface MultiSelectFieldProps {
  field: FormField;
  value: string[];
  onChange: (value: string[]) => void;
  otherValue?: string;
  onOtherChange?: (value: string) => void;
  error?: string | null;
}

export default function MultiSelectField({
  field,
  value,
  onChange,
  otherValue,
  onOtherChange,
  error,
}: MultiSelectFieldProps) {
  const [showOther, setShowOther] = useState(
    () => value?.includes('Other') || false
  );

  const handleToggle = (option: string) => {
    const current = value || [];
    let next: string[];

    if (current.includes(option)) {
      next = current.filter((v: string) => v !== option);
      if (option === 'Other') {
        setShowOther(false);
        onOtherChange?.('');
      }
    } else {
      // Check maxSelections
      if (field.maxSelections && current.length >= field.maxSelections) return;
      next = [...current, option];
      if (option === 'Other') setShowOther(true);
    }

    onChange(next);
  };

  return (
    <div>
      <label className="block font-inter font-medium text-[#1A1A2E] text-sm mb-1.5">
        {field.questionNumber && (
          <span className="text-[#2C68C4] mr-1">{field.questionNumber}.</span>
        )}
        {field.label}
        {field.required && <span className="text-[#E53E3E] ml-0.5">*</span>}
        {field.maxSelections && (
          <span className="ml-2 font-inter text-[#4A5568] text-xs font-normal">
            (Select up to {field.maxSelections})
          </span>
        )}
      </label>

      {field.helpText && (
        <p className="font-inter text-[#4A5568] text-xs mb-2">{field.helpText}</p>
      )}

      <div className="space-y-2 mt-2">
        {(field.options || []).map((option) => {
          const isSelected = (value || []).includes(option);
          const isMaxed = field.maxSelections
            ? (value || []).length >= field.maxSelections
            : false;

          return (
            <label
              key={option}
              className={`flex items-center gap-3 p-3 rounded-md border transition-colors cursor-pointer ${
                isSelected
                  ? 'border-[#2C68C4] bg-[#F0F4FF]'
                  : isMaxed
                  ? 'border-[#E2E8F0] bg-gray-50 opacity-60 cursor-not-allowed'
                  : 'border-[#E2E8F0] hover:border-[#2C68C4] hover:bg-[#F0F4FF]'
              }`}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => handleToggle(option)}
                disabled={!isSelected && isMaxed}
                className="h-4 w-4 rounded text-[#2C68C4] focus:ring-[#2C68C4]/40 border-[#E2E8F0]"
              />
              <span className="font-inter text-sm text-[#1A1A2E]">{option}</span>
            </label>
          );
        })}
      </div>

      {showOther && (
        <div className="mt-2">
          <input
            type="text"
            value={otherValue || ''}
            onChange={(e) => onOtherChange?.(e.target.value)}
            placeholder="Please specify..."
            className="w-full rounded-md border border-[#E2E8F0] px-3 py-2 font-inter text-sm text-[#1A1A2E] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2C68C4]/40 focus:border-[#2C68C4] transition-colors"
          />
        </div>
      )}

      {error && (
        <p className="mt-1 font-inter text-[#E53E3E] text-xs">{error}</p>
      )}
    </div>
  );
}
