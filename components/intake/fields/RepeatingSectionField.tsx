'use client';

import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { FormField } from '@/lib/forms/intake-definition';

interface RepeatingSectionFieldProps {
  field: FormField;
  value: any[];
  onChange: (value: any[]) => void;
  error?: string | null;
}

export default function RepeatingSectionField({
  field,
  value,
  onChange,
  error,
}: RepeatingSectionFieldProps) {
  const items = value || [];
  const canAdd = !field.maxItems || items.length < field.maxItems;
  const canRemove = items.length > (field.minItems || 0);

  const addItem = () => {
    const newItem: Record<string, any> = {};
    (field.subFields || []).forEach((sf) => {
      newItem[sf.id] = sf.default || '';
    });
    onChange([...items, newItem]);
  };

  const removeItem = (index: number) => {
    if (!canRemove) return;
    onChange(items.filter((_: any, i: number) => i !== index));
  };

  const updateSubField = (itemIndex: number, subFieldId: string, subValue: any) => {
    const updated = items.map((item: any, i: number) => {
      if (i !== itemIndex) return item;
      return { ...item, [subFieldId]: subValue };
    });
    onChange(updated);
  };

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
        <p className="font-inter text-[#4A5568] text-xs mb-3">{field.helpText}</p>
      )}

      <div className="space-y-4">
        {items.map((item: any, itemIndex: number) => (
          <div
            key={itemIndex}
            className="border border-[#E2E8F0] rounded-lg p-4 bg-[#FAFBFC]"
          >
            <div className="flex items-center justify-between mb-3">
              <h5 className="font-inter font-semibold text-[#1B3F7A] text-sm">
                {item.service_name || `Item ${itemIndex + 1}`}
              </h5>
              {canRemove && (
                <button
                  type="button"
                  onClick={() => removeItem(itemIndex)}
                  className="inline-flex items-center gap-1 px-2 py-1 text-xs font-inter text-[#E53E3E] hover:bg-red-50 rounded transition-colors"
                >
                  <Trash2 size={14} />
                  Remove
                </button>
              )}
            </div>

            <div className="space-y-4">
              {(field.subFields || []).map((subField) => {
                const subValue = item[subField.id] || '';
                const subError = error && subField.required && !subValue
                  ? `${subField.label} is required`
                  : null;

                return (
                  <div key={subField.id}>
                    <label
                      htmlFor={`${field.id}-${itemIndex}-${subField.id}`}
                      className="block font-inter font-medium text-[#1A1A2E] text-xs mb-1"
                    >
                      {subField.questionNumber && (
                        <span className="text-[#2C68C4] mr-1">{subField.questionNumber}.</span>
                      )}
                      {subField.label}
                      {subField.required && (
                        <span className="text-[#E53E3E] ml-0.5">*</span>
                      )}
                    </label>

                    {subField.helpText && (
                      <p className="font-inter text-[#4A5568] text-[11px] mb-1">
                        {subField.helpText}
                      </p>
                    )}

                    {subField.type === 'long_text' ? (
                      <textarea
                        id={`${field.id}-${itemIndex}-${subField.id}`}
                        value={subValue}
                        onChange={(e) =>
                          updateSubField(itemIndex, subField.id, e.target.value)
                        }
                        placeholder={subField.placeholder}
                        rows={3}
                        className={`w-full rounded-md border px-3 py-1.5 font-inter text-sm text-[#1A1A2E] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2C68C4]/40 focus:border-[#2C68C4] transition-colors resize-y ${
                          subError ? 'border-[#E53E3E]' : 'border-[#E2E8F0]'
                        }`}
                      />
                    ) : (
                      <input
                        id={`${field.id}-${itemIndex}-${subField.id}`}
                        type="text"
                        value={subValue}
                        onChange={(e) =>
                          updateSubField(itemIndex, subField.id, e.target.value)
                        }
                        placeholder={subField.placeholder}
                        className={`w-full rounded-md border px-3 py-1.5 font-inter text-sm text-[#1A1A2E] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2C68C4]/40 focus:border-[#2C68C4] transition-colors ${
                          subError ? 'border-[#E53E3E]' : 'border-[#E2E8F0]'
                        }`}
                      />
                    )}

                    {subError && (
                      <p className="mt-0.5 font-inter text-[#E53E3E] text-[11px]">
                        {subError}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {canAdd && (
          <button
            type="button"
            onClick={addItem}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md border-2 border-dashed border-[#E2E8F0] hover:border-[#2C68C4] hover:bg-[#F0F4FF] font-inter text-sm text-[#4A5568] hover:text-[#2C68C4] transition-colors w-full justify-center"
          >
            <Plus size={16} />
            Add {items.length === 0 ? 'first item' : 'another item'}
            {field.maxItems && (
              <span className="text-xs text-[#4A5568] ml-1">
                ({items.length}/{field.maxItems})
              </span>
            )}
          </button>
        )}
      </div>

      {error && (
        <p className="mt-1 font-inter text-[#E53E3E] text-xs">{error}</p>
      )}
    </div>
  );
}
