'use client';

import { useState, useCallback, useMemo, useRef } from 'react';
import { Save, Clock } from 'lucide-react';
import { useIntakeResponses } from '@/hooks/useIntakeResponses';
import { useClientProfile } from '@/hooks/useClientProfile';
import { validateSection } from '@/lib/forms/conditional-logic';
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
  } = useIntakeResponses();

  const { profile } = useClientProfile();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showValidationSummary, setShowValidationSummary] = useState(false);
  const fieldRefs = useRef<Record<string, HTMLElement | null>>({});

  const currentSectionId = data?.current_section_id || 'intro';
  const currentSection = formSections.find((s) => s.id === currentSectionId);

  // Determine display mode
  const hasSubmitted = !!data?.submitted_at;
  const isNewSectionsMode = hasSubmitted && !intakeFullyComplete && newSectionIds.length > 0;
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

  // Section titles map for the banner
  const sectionTitles = useMemo(
    () => Object.fromEntries(formSections.map((s) => [s.id, s.title])),
    [formSections]
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
      // Clear error for this field
      setErrors((prev) => {
        const next = { ...prev };
        delete next[fieldId];
        return next;
      });
    },
    [updateField]
  );

  const handleUploadFile = useCallback(
    async (fieldId: string, file: File) => {
      const fileMeta = await uploadFile(fieldId, file);
      if (!fileMeta) return null;

      // Add file metadata to the field's value array
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

  const handleSubmit = useCallback(async () => {
    if (!data?.responses || !currentSection) return;

    // Validate all sections
    const allErrors: Record<string, string> = {};

    for (const section of formSections) {
      if (section.id === 'intro') continue;

      // In new-sections mode, only validate new sections
      if (isNewSectionsMode && !newSectionIds.includes(section.id)) continue;

      const sectionErrors = validateSection(section.fields, data.responses);
      Object.assign(allErrors, sectionErrors);
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
  }, [data?.responses, formSections, isNewSectionsMode, newSectionIds, submitForm]);

  const scrollToField = useCallback((fieldId: string) => {
    const el = fieldRefs.current[fieldId];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.focus?.();
    }
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1B3F7A]" />
      </div>
    );
  }

  // Already fully submitted, no new sections
  if (isFullyComplete) {
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
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
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

  // Intro section needs special navigation
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
      {purchasedServiceIds.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {purchasedServiceIds.map((serviceId) => (
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
          newSectionIds={newSectionIds}
          sectionTitles={sectionTitles}
          onStartNewSections={() => {
            const firstNewSection = formSections.find((s) =>
              newSectionIds.includes(s.id)
            );
            if (firstNewSection) handleNavigate(firstNewSection.id);
          }}
        />
      )}

      {/* Progress bar */}
      <ProgressBar
        sections={formSections}
        responses={data?.responses || {}}
        currentSectionId={currentSectionId}
        onNavigate={handleNavigate}
        completedSectionIds={completedSectionIds}
        newSectionIds={newSectionIds}
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
        <ValidationSummary errors={errors} onScrollToField={scrollToField} />
      )}

      {/* Read-only completed sections (new-sections mode) */}
      {isNewSectionsMode && (
        <div className="space-y-3 mb-6">
          {formSections
            .filter(
              (s) =>
                s.id !== 'intro' &&
                completedSectionIds.includes(s.id) &&
                !newSectionIds.includes(s.id)
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
            completedSectionIds.includes(currentSection.id) &&
            !newSectionIds.includes(currentSection.id)
          }
        />
      )}

      {/* Navigation */}
      <SectionNav
        sections={formSections}
        currentSectionId={currentSectionId}
        onNavigate={handleNavigate}
        onSubmit={handleSubmit}
        submitting={submitting}
        completedSectionIds={completedSectionIds}
        newSectionIds={newSectionIds}
      />
    </div>
  );
}
