'use client';

import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { Save, Clock, AlertTriangle } from 'lucide-react';
import { useIntakeResponses } from '@/hooks/useIntakeResponses';
import { useClientProfile } from '@/hooks/useClientProfile';
import { validateSection, isFieldConditionallyVisible } from '@/lib/forms/conditional-logic';
import { validateSectionWithZod } from '@/lib/forms/validations';
import { allFormSections } from '@/lib/forms/intake-definition';
import SectionRenderer from './SectionRenderer';
import ReadOnlySection from './ReadOnlySection';
import ProgressBar from './ProgressBar';
import SectionNav from './SectionNav';
import ValidationSummary from './ValidationSummary';
import NewSectionsBanner from './NewSectionsBanner';

const SERVICE_NAMES: Record<string, string> = {
  business_foundations_pack: 'Business Foundations Pack',
  website_copy_pack: 'Website Copy Starter Pack',
  social_media_pack: 'Social Media Starter Pack',
};

export default function IntakeWizard() {
  const {
    data,
    loading,
    saving,
    lastSaved,
    purchasedServiceIds,
    formSections,
    submitting,
    newSectionIds,
    completedSectionIds,
    intakeFullyComplete,
    updateField,
    setCurrentSection,
    submitForm,
    uploadFile,
    removeFile,
    conflictDetected,
    dismissConflict,
  } = useIntakeResponses();

  const { profile } = useClientProfile();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showValidationSummary, setShowValidationSummary] = useState(false);
  const fieldRefs = useRef<Record<string, HTMLElement | null>>({});

  // Defensive: ensure arrays are always arrays
  const safeServiceIds = Array.isArray(purchasedServiceIds) ? purchasedServiceIds : [];
  const safeFormSections = Array.isArray(formSections) ? formSections : [];
  const safeNewSectionIds = Array.isArray(newSectionIds) ? newSectionIds : [];
  const safeCompletedSectionIds = Array.isArray(completedSectionIds) ? completedSectionIds : [];

  const currentSectionId = data?.current_section_id || 'intro';
  const currentSection = safeFormSections.find((s) => s.id === currentSectionId);

  const hasSubmitted = !!data?.submitted_at;
  // Legacy accounts: submitted_at set but intake_complete_for_services empty → treat as fully complete
  const isLegacyComplete = hasSubmitted && !intakeFullyComplete && safeNewSectionIds.length === 0;
  const isNewSectionsMode = hasSubmitted && !intakeFullyComplete && safeNewSectionIds.length > 0;
  const isFullyComplete = hasSubmitted && intakeFullyComplete;

  // Compute prefill suggestions
  const prefillSuggestions = useMemo(() => {
    if (!data?.responses) return {};
    const suggestions: Record<string, string> = {};

    for (const section of allFormSections) {
      for (const field of section.fields) {
        if (!field.prefillFrom) continue;
        const sourceValue = data.responses[field.prefillFrom];
        if (sourceValue && sourceValue !== '' && !data.responses[field.id]) {
          suggestions[field.id] = String(sourceValue);
        }
      }
    }
    return suggestions;
  }, [data?.responses]);

  const fieldMeta = useMemo(() => {
    const meta: Record<string, { label: string; questionNumber: string; sectionTitle: string }> = {};
    for (const section of allFormSections) {
      for (const field of section.fields) {
        meta[field.id] = {
          label: field.label,
          questionNumber: field.questionNumber,
          sectionTitle: section.title,
        };
        if (field.subFields) {
          for (const subField of field.subFields) {
            meta[subField.id] = {
              label: subField.label,
              questionNumber: subField.questionNumber,
              sectionTitle: section.title,
            };
          }
        }
      }
    }
    return meta;
  }, []);

  const sectionTitles = useMemo(
    () => Object.fromEntries(safeFormSections.map((s) => [s.id, s.title])),
    [safeFormSections]
  );

  const handleNavigate = useCallback(
    (sectionId: string) => {
      setCurrentSection(sectionId);
      setErrors({});
      setShowValidationSummary(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [setCurrentSection]
  );

  const handleUpdateField = useCallback(
    (fieldId: string, value: any) => {
      updateField(fieldId, value);
      setErrors((prev) => {
        const next = { ...prev };
        delete next[fieldId];
        // Also clear repeating section sub-field errors
        Object.keys(next).forEach((key) => {
          if (key.startsWith(fieldId + '[')) delete next[key];
        });
        return next;
      });
    },
    [updateField]
  );

  const handleUploadFile = useCallback(
    async (fieldId: string, file: File) => {
      const fileMeta = await uploadFile(fieldId, file);
      if (!fileMeta) return null;

      const currentFiles = data?.responses?.[fieldId] || [];
      updateField(fieldId, [...currentFiles, fileMeta]);
      return fileMeta;
    },
    [uploadFile, data?.responses, updateField]
  );

  const handleRemoveFile = useCallback(
    async (fieldId: string, filePath: string) => {
      await removeFile(fieldId, filePath);
      const currentFiles = data?.responses?.[fieldId] || [];
      updateField(
        fieldId,
        currentFiles.filter((f: any) => f.path !== filePath)
      );
    },
    [removeFile, data?.responses, updateField]
  );

  // Validate current section using Zod + conditional logic
  const validateCurrentSection = useCallback((): boolean => {
    if (!data?.responses || !currentSection) return true;
    if (currentSectionId === 'intro') return true;

    // In new-sections mode, only validate new sections
    if (isNewSectionsMode && !safeNewSectionIds.includes(currentSection.id)) return true;

    // Zod validation
    const zodErrors = validateSectionWithZod(currentSection.id, data.responses);

    // Also run conditional-logic validation for conditional fields
    const conditionalErrors = validateSection(currentSection.fields, data.responses);

    // Merge: Zod errors take priority, conditional errors fill gaps
    const merged = { ...zodErrors, ...conditionalErrors };

    // Filter out errors for fields that are not visible (conditional)
    const visibleFieldIds = new Set(
      currentSection.fields
        .filter((f) => isFieldConditionallyVisible(f, data.responses))
        .map((f) => f.id)
    );

    const filteredErrors: Record<string, string> = {};
    for (const [key, msg] of Object.entries(merged)) {
      // For repeating section sub-fields like "q15_services[0].service_name"
      const baseFieldId = key.split('[')[0];
      if (visibleFieldIds.has(baseFieldId) || key.includes('[')) {
        filteredErrors[key] = msg;
      }
    }

    if (Object.keys(filteredErrors).length > 0) {
      setErrors(filteredErrors);
      setShowValidationSummary(true);
      return false;
    }

    setErrors({});
    setShowValidationSummary(false);
    return true;
  }, [data?.responses, currentSection, currentSectionId, isNewSectionsMode, safeNewSectionIds]);

  const handleSubmit = useCallback(async () => {
    if (!data?.responses) return;

    const allErrors: Record<string, string> = {};

    for (const section of safeFormSections) {
      if (section.id === 'intro') continue;
      if (isNewSectionsMode && !safeNewSectionIds.includes(section.id)) continue;

      const zodErrors = validateSectionWithZod(section.id, data.responses);
      const conditionalErrors = validateSection(section.fields, data.responses);
      Object.assign(allErrors, zodErrors, conditionalErrors);
    }

    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      setShowValidationSummary(true);
      return;
    }

    const success = await submitForm(data.responses);
    if (success) {
      setShowValidationSummary(false);
    }
  }, [data?.responses, safeFormSections, isNewSectionsMode, safeNewSectionIds, submitForm]);

  const scrollToField = useCallback((fieldId: string) => {
    const el = fieldRefs.current[fieldId];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.focus?.();
    }
  }, []);

  // Jump to first incomplete section on mount (for returning users with new services)
  useEffect(() => {
    if (loading || !data) return;
    if (!isNewSectionsMode) return;
    if (currentSectionId !== 'intro') return;

    // If user has new sections to complete, navigate to the first one
    const firstNewSection = safeFormSections.find((s) =>
      safeNewSectionIds.includes(s.id)
    );
    if (firstNewSection) {
      setCurrentSection(firstNewSection.id);
    }
  }, [loading, data, isNewSectionsMode, safeNewSectionIds, safeFormSections, currentSectionId, setCurrentSection]);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1B3F7A]" />
      </div>
    );
  }

  // Already fully submitted, no new sections (includes legacy accounts where tracking columns were empty)
  if (isFullyComplete || isLegacyComplete) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="font-inter font-bold text-[#1B3F7A] text-2xl mb-1">
            Intake Form
          </h1>
          <p className="font-inter text-gray-600 text-sm">
            Your intake form has been submitted successfully.
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <div className="flex items-start gap-4">
            <div className="bg-green-100 rounded-lg p-3 shrink-0">
              <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h2 className="font-inter font-bold text-[#1B3F7A] text-lg mb-2">
                Form Submitted
              </h2>
              <p className="font-inter text-gray-600 text-sm mb-4">
                Your intake form was submitted on{' '}
                {data.submitted_at
                  ? new Date(data.submitted_at).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })
                  : 'an unknown date'}
                . We&apos;re now preparing your bespoke business documents.
              </p>
              <a
                href="/personal/status"
                className="inline-flex items-center gap-2 font-inter font-semibold text-white bg-[#1B3F7A] rounded-md hover:bg-[#2C68C4] transition-colors"
                style={{ padding: '10px 20px', fontSize: '0.9rem' }}
              >
                View Status
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isOnIntro = currentSectionId === 'intro';

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-inter font-bold text-[#1B3F7A] text-2xl mb-1">
          {isNewSectionsMode ? 'Complete New Sections' : 'Intake Form'}
        </h1>
        <p className="font-inter text-gray-600 text-sm">
          {isNewSectionsMode
            ? 'Please complete the new sections for your additional services.'
            : 'Tell us about your business so we can create your bespoke documents.'}
        </p>
      </div>

      {/* Service badges */}
      {safeServiceIds.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {safeServiceIds.map((serviceId) => (
            <span
              key={serviceId}
              className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-inter font-medium bg-[#F0F4FF] text-[#1B3F7A]"
            >
              {SERVICE_NAMES[serviceId] ||
                serviceId.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
            </span>
          ))}
        </div>
      )}

      {/* New sections banner */}
      {isNewSectionsMode && (
        <NewSectionsBanner
          newSectionIds={safeNewSectionIds}
          sectionTitles={sectionTitles}
          onStartNewSections={() => {
            const firstNewSection = safeFormSections.find((s) =>
              safeNewSectionIds.includes(s.id)
            );
            if (firstNewSection) handleNavigate(firstNewSection.id);
          }}
        />
      )}

      {/* Autosave conflict warning */}
      {conflictDetected && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4 flex items-start gap-3">
          <AlertTriangle size={20} className="text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-inter font-semibold text-amber-800 text-sm">
              This form was updated in another tab or session
            </p>
            <p className="font-inter text-amber-700 text-xs mt-1">
              Your local changes may overwrite the other session&apos;s edits. Continue with caution.
            </p>
          </div>
          <button
            type="button"
            onClick={dismissConflict}
            className="font-inter font-medium text-amber-700 text-xs hover:underline shrink-0"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Progress bar */}
      <ProgressBar
        sections={safeFormSections}
        responses={data?.responses || {}}
        currentSectionId={currentSectionId}
        onNavigate={handleNavigate}
        completedSectionIds={safeCompletedSectionIds}
        newSectionIds={safeNewSectionIds}
      />

      {/* Autosave indicator */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Save size={14} className={saving ? 'text-[#2C68C4] animate-pulse' : 'text-[#38A169]'} />
          <span className="font-inter text-xs text-[#4A5568]">
            {saving
              ? 'Saving...'
              : lastSaved
              ? `Saved at ${lastSaved.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`
              : 'Autosave enabled'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Clock size={14} className="text-amber-500" />
          <span className="font-inter text-xs text-[#4A5568]">
            24-hour delivery after submission
          </span>
        </div>
      </div>

      {/* Validation summary */}
      {showValidationSummary && Object.keys(errors).length > 0 && (
        <ValidationSummary errors={errors} fieldMeta={fieldMeta} onScrollToField={scrollToField} />
      )}

      {/* Read-only completed sections (new-sections mode) */}
      {isNewSectionsMode && (
        <div className="space-y-3 mb-6">
          {safeFormSections
            .filter(
              (s) =>
                s.id !== 'intro' &&
                safeCompletedSectionIds.includes(s.id) &&
                !safeNewSectionIds.includes(s.id)
            )
            .map((section) => (
              <ReadOnlySection
                key={section.id}
                section={section}
                responses={data?.responses || {}}
              />
            ))}
        </div>
      )}

      {/* Current section */}
      {currentSection && (
        <SectionRenderer
          section={currentSection}
          responses={data?.responses || {}}
          onUpdateField={handleUpdateField}
          onUploadFile={handleUploadFile}
          onRemoveFile={handleRemoveFile}
          errors={errors}
          prefillSuggestions={prefillSuggestions}
          readOnly={
            isNewSectionsMode &&
            safeCompletedSectionIds.includes(currentSection.id) &&
            !safeNewSectionIds.includes(currentSection.id)
          }
        />
      )}

      {/* Navigation */}
      <SectionNav
        sections={safeFormSections}
        currentSectionId={currentSectionId}
        onNavigate={handleNavigate}
        onValidateAndNext={validateCurrentSection}
        onSubmit={handleSubmit}
        submitting={submitting}
        completedSectionIds={safeCompletedSectionIds}
        newSectionIds={safeNewSectionIds}
      />
    </div>
  );
}
