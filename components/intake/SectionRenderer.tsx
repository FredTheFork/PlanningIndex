'use client';

import { FormSection, FormField } from '@/lib/forms/intake-definition';
import { getVisibleFields } from '@/lib/forms/conditional-logic';
import FieldRenderer from './FieldRenderer';

interface SectionRendererProps {
  section: FormSection;
  responses: Record<string, any>;
  onUpdateField: (fieldId: string, value: any) => void;
  onUploadFile: (fieldId: string, file: File) => Promise<any>;
  onRemoveFile: (fieldId: string, filePath: string) => Promise<void>;
  errors: Record<string, string>;
  prefillSuggestions: Record<string, string>;
  readOnly?: boolean;
}

export default function SectionRenderer({
  section,
  responses,
  onUpdateField,
  onUploadFile,
  onRemoveFile,
  errors,
  prefillSuggestions,
  readOnly = false,
}: SectionRendererProps) {
  const visibleFields = getVisibleFields(section.fields, responses);

  // Intro section — just show description
  if (section.id === 'intro') {
    return (
      <div className="bg-white rounded-lg border border-[#E2E8F0] p-8">
        <h2 className="font-inter font-bold text-[#1B3F7A] text-xl mb-3">
          {section.title}
        </h2>
        <div className="font-inter text-[#4A5568] text-sm whitespace-pre-wrap leading-relaxed">
          {section.description}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-[#E2E8F0] overflow-hidden">
      {/* Section header */}
      <div className="px-6 py-4 border-b border-[#E2E8F0] bg-[#FAFBFC]">
        <h2 className="font-inter font-bold text-[#1B3F7A] text-lg">
          {section.title}
        </h2>
        {section.description && (
          <p className="font-inter text-[#4A5568] text-sm mt-1">
            {section.description}
          </p>
        )}
        {section.usedIn && (
          <p className="font-inter text-[#4A5568] text-xs mt-1 italic">
            Used in: {section.usedIn}
          </p>
        )}
      </div>

      {/* Fields */}
      <div className="p-6 space-y-6">
        {visibleFields.length === 0 && (
          <p className="font-inter text-[#4A5568] text-sm italic">
            No questions for this section based on your selections.
          </p>
        )}

        {visibleFields.map((field) =>
          readOnly ? (
            <ReadOnlyField
              key={field.id}
              field={field}
              value={responses[field.id]}
              responses={responses}
            />
          ) : (
            <FieldRenderer
              key={field.id}
              field={field}
              responses={responses}
              onUpdateField={onUpdateField}
              onUploadFile={onUploadFile}
              onRemoveFile={onRemoveFile}
              errors={errors}
              prefillSuggestions={prefillSuggestions}
            />
          )
        )}
      </div>
    </div>
  );
}

/** Read-only field display for previously completed sections */
function ReadOnlyField({
  field,
  value,
  responses,
}: {
  field: FormField;
  value: any;
  responses: Record<string, any>;
}) {
  const isEmpty =
    value === null || value === undefined || value === '' ||
    (Array.isArray(value) && value.length === 0);

  if (isEmpty && !field.required) return null;

  const formatReadOnly = () => {
    if (isEmpty) return <span className="text-gray-400 italic">Not provided</span>;

    if (field.type === 'checkbox') {
      return value ? 'Yes' : 'No';
    }

    if (field.type === 'multi_select') {
      if (Array.isArray(value)) {
        return value.join(', ');
      }
      return String(value);
    }

    if (field.type === 'repeating_section') {
      if (Array.isArray(value)) {
        return value
          .map((item: any, i: number) =>
            `Item ${i + 1}: ${item.service_name || 'Unnamed'}`
          )
          .join('; ');
      }
      return String(value);
    }

    if (field.type === 'file_upload') {
      if (Array.isArray(value)) {
        return value.map((f: any) => f.name).join(', ');
      }
      return 'Files uploaded';
    }

    return String(value);
  };

  return (
    <div className="py-2">
      <p className="font-inter font-medium text-[#1A1A2E] text-xs mb-1">
        {field.questionNumber && (
          <span className="text-[#2C68C4] mr-1">{field.questionNumber}.</span>
        )}
        {field.label}
      </p>
      <p className="font-inter text-[#4A5568] text-sm whitespace-pre-wrap">
        {formatReadOnly()}
      </p>
    </div>
  );
}
