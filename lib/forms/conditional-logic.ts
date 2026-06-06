// Conditional visibility logic for intake form fields.
// Pure functions — no UI, no side effects.

import { FormField } from './intake-definition';

/**
 * Evaluate whether a field should be visible given the current responses.
 *
 * Rules:
 *  - No conditionalOn → always visible
 *  - conditionalOn.notEqual === false/undefined → field visible when parent value matches
 *  - conditionalOn.notEqual === true → field visible when parent value does NOT match
 *  - conditionalOn.value can be a string or string[] (any match = visible)
 */
export function isFieldConditionallyVisible(
  field: FormField,
  responses: Record<string, any>,
): boolean {
  if (!field.conditionalOn) return true;

  const { field: sourceField, value, notEqual } = field.conditionalOn;
  const sourceValue = responses[sourceField];

  const matches = Array.isArray(value)
    ? value.some((v) => sourceValue === v)
    : sourceValue === value;

  // For multi_select source fields, check if the source array includes any of the conditional values
  if (!matches && Array.isArray(sourceValue)) {
    const conditionalValues = Array.isArray(value) ? value : [value];
    const arrayMatches = conditionalValues.some((v) => sourceValue.includes(v));
    return notEqual ? !arrayMatches : arrayMatches;
  }

  return notEqual ? !matches : matches;
}

/**
 * Get all visible fields for a section, respecting conditionalOn rules.
 */
export function getVisibleFields(
  fields: FormField[],
  responses: Record<string, any>,
): FormField[] {
  return fields.filter((field) => isFieldConditionallyVisible(field, responses));
}

/**
 * Validate a single field's value against its definition.
 * Returns an error message or null if valid.
 */
export function validateField(
  field: FormField,
  value: any,
  responses: Record<string, any>,
): string | null {
  // Skip validation if field is not visible
  if (!isFieldConditionallyVisible(field, responses)) return null;

  const isEmpty =
    value === null ||
    value === undefined ||
    value === '' ||
    (Array.isArray(value) && value.length === 0);

  if (field.required && isEmpty) {
    return `${field.label} is required`;
  }

  // Multi-select maxSelections
  if (field.type === 'multi_select' && field.maxSelections && Array.isArray(value)) {
    if (value.length > field.maxSelections) {
      return `Select no more than ${field.maxSelections} options`;
    }
  }

  // Repeating section min/max
  if (field.type === 'repeating_section' && Array.isArray(value)) {
    if (field.minItems && value.length < field.minItems) {
      return `At least ${field.minItems} ${field.minItems === 1 ? 'item is' : 'items are'} required`;
    }
    if (field.maxItems && value.length > field.maxItems) {
      return `No more than ${field.maxItems} items allowed`;
    }
    // Validate each item's sub-fields
    for (let i = 0; i < value.length; i++) {
      const item = value[i] || {};
      for (const subField of field.subFields || []) {
        const subValue = item[subField.id];
        const subEmpty =
          subValue === null || subValue === undefined || subValue === '' ||
          (Array.isArray(subValue) && subValue.length === 0);
        if (subField.required && subEmpty) {
          return `Item ${i + 1}: ${subField.label} is required`;
        }
      }
    }
  }

  // Email format
  if (field.type === 'email' && value && typeof value === 'string') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return 'Please enter a valid email address';
  }

  // URL format
  if (field.type === 'url' && value && typeof value === 'string') {
    try {
      new URL(value.startsWith('http') ? value : `https://${value}`);
    } catch {
      return 'Please enter a valid URL';
    }
  }

  // File upload
  if (field.type === 'file_upload' && value && Array.isArray(value)) {
    for (const file of value) {
      if (file.size && file.size > 10 * 1024 * 1024) {
        return `File ${file.name} exceeds the 10MB limit`;
      }
    }
  }

  return null;
}

/**
 * Validate all visible fields in a section.
 * Returns a map of fieldId → errorMessage.
 */
export function validateSection(
  fields: FormField[],
  responses: Record<string, any>,
): Record<string, string> {
  const errors: Record<string, string> = {};

  for (const field of getVisibleFields(fields, responses)) {
    const error = validateField(field, responses[field.id], responses);
    if (error) errors[field.id] = error;

    // Also validate repeating section sub-fields
    if (field.type === 'repeating_section' && Array.isArray(responses[field.id])) {
      for (let i = 0; i < responses[field.id].length; i++) {
        const item = responses[field.id][i] || {};
        for (const subField of field.subFields || []) {
          const subValue = item[subField.id];
          const subEmpty =
            subValue === null || subValue === undefined || subValue === '' ||
            (Array.isArray(subValue) && subValue.length === 0);
          if (subField.required && subEmpty) {
            errors[`${field.id}[${i}].${subField.id}`] =
              `Item ${i + 1}: ${subField.label} is required`;
          }
        }
      }
    }
  }

  return errors;
}

/**
 * Compute per-section completion status.
 * A section is "complete" when all visible required fields have non-empty values.
 */
export function isSectionComplete(
  fields: FormField[],
  responses: Record<string, any>,
): boolean {
  const visibleFields = getVisibleFields(fields, responses);
  return visibleFields.every((field) => {
    if (!field.required) return true;

    const value = responses[field.id];

    if (field.type === 'repeating_section') {
      if (!Array.isArray(value) || value.length === 0) return false;
      return value.every((item: Record<string, any>) =>
        (field.subFields || [])
          .filter((sf) => sf.required)
          .every((sf) => {
            const v = item[sf.id];
            return v !== null && v !== undefined && v !== '' &&
              !(Array.isArray(v) && v.length === 0);
          })
      );
    }

    return value !== null && value !== undefined && value !== '' &&
      !(Array.isArray(value) && value.length === 0);
  });
}
