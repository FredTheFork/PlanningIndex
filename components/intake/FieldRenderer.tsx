'use client';

import { FormField } from '@/lib/forms/intake-definition';
import { isFieldConditionallyVisible } from '@/lib/forms/conditional-logic';
import ShortTextField from './fields/ShortTextField';
import LongTextField from './fields/LongTextField';
import EmailField from './fields/EmailField';
import PhoneField from './fields/PhoneField';
import UrlField from './fields/UrlField';
import SingleChoiceField from './fields/SingleChoiceField';
import MultiSelectField from './fields/MultiSelectField';
import FileUploadField from './fields/FileUploadField';
import CheckboxField from './fields/CheckboxField';
import RepeatingSectionField from './fields/RepeatingSectionField';

interface FieldRendererProps {
  field: FormField;
  responses: Record<string, any>;
  onUpdateField: (fieldId: string, value: any) => void;
  onUploadFile: (fieldId: string, file: File) => Promise<any>;
  onRemoveFile: (fieldId: string, filePath: string) => Promise<void>;
  errors: Record<string, string>;
  prefillSuggestions: Record<string, string>;
}

export default function FieldRenderer({
  field,
  responses,
  onUpdateField,
  onUploadFile,
  onRemoveFile,
  errors,
  prefillSuggestions,
}: FieldRendererProps) {
  if (!isFieldConditionallyVisible(field, responses)) return null;

  const value = responses[field.id];
  const error = errors[field.id];
  const prefill = prefillSuggestions[field.id] || null;

  switch (field.type) {
    case 'short_text':
      return (
        <ShortTextField
          field={field}
          value={value || ''}
          onChange={(v) => onUpdateField(field.id, v)}
          error={error}
          prefillSuggestion={prefill}
        />
      );

    case 'long_text':
      return (
        <LongTextField
          field={field}
          value={value || ''}
          onChange={(v) => onUpdateField(field.id, v)}
          error={error}
          prefillSuggestion={prefill}
        />
      );

    case 'email':
      return (
        <EmailField
          field={field}
          value={value || ''}
          onChange={(v) => onUpdateField(field.id, v)}
          error={error}
        />
      );

    case 'phone':
      return (
        <PhoneField
          field={field}
          value={value || ''}
          onChange={(v) => onUpdateField(field.id, v)}
          error={error}
        />
      );

    case 'url':
      return (
        <UrlField
          field={field}
          value={value || ''}
          onChange={(v) => onUpdateField(field.id, v)}
          error={error}
        />
      );

    case 'single_choice':
      return (
        <SingleChoiceField
          field={field}
          value={value || ''}
          onChange={(v) => onUpdateField(field.id, v)}
          error={error}
        />
      );

    case 'multi_select':
      return (
        <MultiSelectField
          field={field}
          value={value || []}
          onChange={(v) => onUpdateField(field.id, v)}
          otherValue={responses[`${field.id}_other`] || ''}
          onOtherChange={(v) => onUpdateField(`${field.id}_other`, v)}
          error={error}
        />
      );

    case 'file_upload':
      return (
        <FileUploadField
          field={field}
          value={value || []}
          onUpload={(file) => onUploadFile(field.id, file)}
          onRemove={(filePath) => onRemoveFile(field.id, filePath)}
          onChange={(v) => onUpdateField(field.id, v)}
          error={error}
        />
      );

    case 'checkbox':
      return (
        <CheckboxField
          field={field}
          value={value || false}
          onChange={(v) => onUpdateField(field.id, v)}
          error={error}
        />
      );

    case 'repeating_section':
      return (
        <RepeatingSectionField
          field={field}
          value={value || []}
          onChange={(v) => onUpdateField(field.id, v)}
          error={error}
        />
      );

    default:
      return null;
  }
}
