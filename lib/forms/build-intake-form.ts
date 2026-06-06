// Builder function for assembling intake forms based on purchased services.
// Pure, deterministic — no side effects or database calls.

import { allFormSections, FormSection, FormField } from './intake-definition';

/**
 * Build the intake form for a given set of purchased service IDs.
 *
 * 1. Filters sections whose serviceTags intersect with purchasedServiceIds
 * 2. Sorts by sortOrder ascending
 * 3. De-duplicates by section id (a section matching multiple services appears once)
 * 4. Filters fields within each section based on fieldServiceTags
 * 5. Returns the assembled, ordered, de-duplicated list
 */
export function buildIntakeForm(purchasedServiceIds: string[]): FormSection[] {
  if (purchasedServiceIds.length === 0) return [];

  const serviceSet = new Set(purchasedServiceIds);

  // Filter sections that are relevant to at least one purchased service
  const relevantSections = allFormSections.filter((section) =>
    section.serviceTags.some((tag) => serviceSet.has(tag)),
  );

  // Sort by sortOrder ascending
  const sorted = [...relevantSections].sort((a, b) => a.sortOrder - b.sortOrder);

  // De-duplicate by id (already guaranteed by filter since each id is unique in allFormSections,
  // but this is a safety net)
  const seen = new Set<string>();
  const deduplicated = sorted.filter((section) => {
    if (seen.has(section.id)) return false;
    seen.add(section.id);
    return true;
  });

  // Filter fields within each section based on fieldServiceTags
  return deduplicated.map((section) => {
    if (!section.fieldServiceTags) return section;

    const filteredFields = section.fields.filter((field) => {
      const tags = section.fieldServiceTags![field.id];
      // If no tags defined for this field, show it for all services that include the section
      if (!tags) return true;
      // If tags defined, show only if at least one tag matches a purchased service
      return tags.some((tag) => serviceSet.has(tag));
    });

    return { ...section, fields: filteredFields };
  });
}

/**
 * Count the total number of fillable fields for a given set of purchased service IDs.
 * Excludes repeating_section parents — counts their sub-fields instead (multiplied by minItems).
 */
function getTotalFieldCount(purchasedServiceIds: string[]): number {
  const sections = buildIntakeForm(purchasedServiceIds);

  let count = 0;
  for (const section of sections) {
    for (const field of section.fields) {
      if (field.type === 'repeating_section' && field.subFields) {
        count += field.subFields.length * (field.minItems ?? 1);
      } else {
        count += 1;
      }
    }
  }
  return count;
}

/**
 * Convenience wrapper: get the intake form for a single service.
 */
function getSectionsForService(serviceId: string): FormSection[] {
  return buildIntakeForm([serviceId]);
}

/**
 * Get the list of section IDs that a given service requires.
 * Derived from serviceTags on each section — the single source of truth.
 */
export function getSectionIdsForService(serviceId: string): string[] {
  return allFormSections
    .filter((section) => section.serviceTags.includes(serviceId))
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((section) => section.id);
}

/**
 * Determine which purchased services have their intake sections fully completed.
 *
 * For each service in purchasedServiceIds, checks whether ALL sections required
 * by that service have sectionProgress[sectionId] === true. A service is only
 * "intake complete" when every section it needs is done.
 *
 * This is the canonical way to compute intake_complete_for_services — it ensures
 * that buying a new service doesn't accidentally mark it as intake-complete.
 */
export function getCompletedServiceIds(
  purchasedServiceIds: string[],
  sectionProgress: Record<string, boolean>,
): string[] {
  return purchasedServiceIds.filter((serviceId) => {
    const requiredSectionIds = getSectionIdsForService(serviceId);
    // Services with no intake sections (e.g. quarterly_refresh) are always complete
    if (requiredSectionIds.length === 0) return true;
    return requiredSectionIds.every((sectionId) => sectionProgress[sectionId] === true);
  });
}

/**
 * Check whether intake is fully complete for all purchased services.
 * Returns true when every purchased service has its intake sections completed.
 */
export function isIntakeFullyComplete(
  purchasedServiceIds: string[],
  intakeCompleteForServices: string[],
): boolean {
  if (purchasedServiceIds.length === 0) return false;
  const completedSet = new Set(intakeCompleteForServices);
  return purchasedServiceIds.every((id) => completedSet.has(id));
}

/**
 * Get a human-readable list of service names for the intro section description.
 * Returns a natural language string like "Business Foundations Pack and Website Copy Starter Pack"
 * or just "Business Foundations Pack" for a single service.
 */
function getServiceListDescription(
  purchasedServiceIds: string[],
  serviceNames: Record<string, string>,
): string {
  if (purchasedServiceIds.length === 0) return 'your deliverables';

  const names = purchasedServiceIds
    .map((id) => serviceNames[id])
    .filter(Boolean);

  if (names.length === 0) return 'your deliverables';
  if (names.length === 1) return names[0];
  if (names.length === 2) return `${names[0]} and ${names[1]}`;

  return `${names.slice(0, -1).join(', ')}, and ${names[names.length - 1]}`;
}

/**
 * Check if a specific field should be visible for the given purchased services,
 * taking both section-level serviceTags and field-level fieldServiceTags into account.
 */
function isFieldVisible(
  fieldId: string,
  sectionId: string,
  purchasedServiceIds: string[],
): boolean {
  const serviceSet = new Set(purchasedServiceIds);

  const section = allFormSections.find((s) => s.id === sectionId);
  if (!section) return false;

  // Section must be relevant
  if (!section.serviceTags.some((tag) => serviceSet.has(tag))) return false;

  // Check field-level tags
  const fieldTags = section.fieldServiceTags?.[fieldId];
  if (!fieldTags) return true;

  return fieldTags.some((tag) => serviceSet.has(tag));
}

/**
 * Get all field IDs that are visible for a given set of purchased services.
 */
function getVisibleFieldIds(purchasedServiceIds: string[]): string[] {
  const sections = buildIntakeForm(purchasedServiceIds);
  const fieldIds: string[] = [];

  for (const section of sections) {
    for (const field of section.fields) {
      fieldIds.push(field.id);
      // Include sub-field IDs for repeating sections
      if (field.type === 'repeating_section' && field.subFields) {
        for (const subField of field.subFields) {
          fieldIds.push(subField.id);
        }
      }
    }
  }

  return fieldIds;
}

/**
 * Get prefill suggestions for visible fields that declare a `prefillFrom` source.
 *
 * Returns a map of target field ID → suggested value, drawn from the source field's
 * existing answer in `responses`. The UI layer uses this to offer a "use your previous
 * answer" prompt that the user can accept or reject. This function never writes data.
 *
 * Only suggests for fields that are visible given the purchased services.
 */
function getPrefillSuggestions(
  purchasedServiceIds: string[],
  responses: Record<string, any>,
): Record<string, string> {
  const visibleIds = new Set(getVisibleFieldIds(purchasedServiceIds));
  const suggestions: Record<string, string> = {};

  for (const section of allFormSections) {
    for (const field of section.fields) {
      if (!field.prefillFrom) continue;
      if (!visibleIds.has(field.id)) continue;

      const sourceValue = responses[field.prefillFrom];
      if (sourceValue !== null && sourceValue !== undefined && sourceValue !== '') {
        suggestions[field.id] = String(sourceValue);
      }
    }
  }

  return suggestions;
}

/**
 * Get metadata about all fields that support prefill, for a given set of purchased services.
 * Useful for the UI to know which fields to show prefill banners on.
 */
function getPrefillableFields(
  purchasedServiceIds: string[],
): { fieldId: string; sourceFieldId: string; sourceLabel: string }[] {
  const visibleIds = new Set(getVisibleFieldIds(purchasedServiceIds));
  const result: { fieldId: string; sourceFieldId: string; sourceLabel: string }[] = [];

  for (const section of allFormSections) {
    for (const field of section.fields) {
      if (!field.prefillFrom) continue;
      if (!visibleIds.has(field.id)) continue;

      // Find the source field's label
      let sourceLabel = field.prefillFrom;
      for (const s of allFormSections) {
        const source = s.fields.find((f) => f.id === field.prefillFrom);
        if (source) {
          sourceLabel = source.label;
          break;
        }
      }

      result.push({
        fieldId: field.id,
        sourceFieldId: field.prefillFrom,
        sourceLabel,
      });
    }
  }

  return result;
}
