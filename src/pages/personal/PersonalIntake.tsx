import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useClientProfile } from '../../hooks/useClientProfile';
import { supabase } from '../../lib/supabase';
import { intakeFormSections, upsellFormSections, FormField, FormSection } from '../../lib/intakeFormDefinition';
import { Save, CheckCircle2, ArrowRight, ArrowLeft, Upload, X, Plus, Trash2, MessageSquare } from 'lucide-react';

type FieldValue = string | string[] | Record<string, string>[];
type Responses = Record<string, FieldValue>;
type AdditionalNotes = Record<string, string>;

interface FileUploadInfo {
  name: string;
  path: string;
  size: number;
  type: string;
}

export default function PersonalIntake() {
  const { user } = useAuth();
  const { profile, loading: profileLoading } = useClientProfile();
  const [responses, setResponses] = useState<Responses>({});
  const [additionalNotes, setAdditionalNotes] = useState<AdditionalNotes>({});
  const [currentSection, setCurrentSection] = useState(0);
  const [currentFieldIndex, setCurrentFieldIndex] = useState(0);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fileUploads, setFileUploads] = useState<Record<string, FileUploadInfo[]>>({});
  const [rowExists, setRowExists] = useState(false);
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const responsesRef = useRef<Responses>(responses);
  const additionalNotesRef = useRef<AdditionalNotes>(additionalNotes);
  const currentSectionRef = useRef(currentSection);
  const currentFieldIndexRef = useRef(currentFieldIndex);
  const fileUploadsRef = useRef(fileUploads);
  const savingRef = useRef(false);

  // Keep refs in sync with state
  useEffect(() => { responsesRef.current = responses; }, [responses]);
  useEffect(() => { additionalNotesRef.current = additionalNotes; }, [additionalNotes]);
  useEffect(() => { currentSectionRef.current = currentSection; }, [currentSection]);
  useEffect(() => { currentFieldIndexRef.current = currentFieldIndex; }, [currentFieldIndex]);
  useEffect(() => { fileUploadsRef.current = fileUploads; }, [fileUploads]);

  const allSections = profile?.purchased_upsells && profile.purchased_upsells.length > 0
    ? [...intakeFormSections, ...upsellFormSections]
    : intakeFormSections;

  const dataSections = allSections.filter(s => s.fields.length > 0);
  const totalSections = dataSections.length;

  // Find the position of the last answered field across all sections
  const findLastAnsweredPosition = useCallback((savedResponses: Responses, sections: FormSection[]): { section: number; fieldIndex: number } => {
    let lastSection = 0;
    let lastFieldIndex = 0;
    let foundAny = false;

    for (let s = 0; s < sections.length; s++) {
      const section = sections[s];
      if (section.fields.length === 0) continue;
      for (let f = 0; f < section.fields.length; f++) {
        const field = section.fields[f];
        const val = savedResponses[field.id];
        if (val !== undefined && val !== null && val !== '' && !(Array.isArray(val) && val.length === 0)) {
          lastSection = s;
          lastFieldIndex = f;
          foundAny = true;
        }
      }
    }

    if (!foundAny) {
      if (sections[0]?.id === 'intro') return { section: 1, fieldIndex: 0 };
      return { section: 0, fieldIndex: 0 };
    }

    return { section: lastSection, fieldIndex: lastFieldIndex };
  }, []);

  // Load existing responses on mount
  useEffect(() => {
    if (!user) return;

    const fetchResponses = async () => {
      const { data, error } = await supabase
        .from('intake_responses')
        .select('*')
        .eq('user_id', user!.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching intake responses:', error);
        setInitialLoadDone(true);
        return;
      }

      if (data) {
        const savedResponses = data.responses as Responses || {};
        setResponses(savedResponses);
        setLastSaved(new Date(data.last_saved_at));
        setRowExists(true);
        if (data.file_uploads) {
          setFileUploads(data.file_uploads as Record<string, FileUploadInfo[]> || {});
        }
        if (data.additional_notes) {
          setAdditionalNotes(data.additional_notes as AdditionalNotes || {});
        }

        const position = findLastAnsweredPosition(savedResponses, dataSections);
        setCurrentSection(position.section);
        setCurrentFieldIndex(position.fieldIndex);
      }
      setInitialLoadDone(true);
    };

    fetchResponses();
  }, [user]);

  useEffect(() => {
    if (profile?.has_submitted_intake) {
      setSubmitted(true);
    }
  }, [profile]);

  // Save on page unload / tab close
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (rowExists && responsesRef.current && Object.keys(responsesRef.current).length > 0) {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
        if (supabaseUrl && anonKey && user) {
          const payload = {
            responses: responsesRef.current,
            current_section: currentSectionRef.current,
            current_field_index: currentFieldIndexRef.current,
            last_saved_at: new Date().toISOString(),
            file_uploads: fileUploadsRef.current,
            additional_notes: additionalNotesRef.current,
          };
          fetch(`${supabaseUrl}/rest/v1/intake_responses?user_id=eq.${user.id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'apikey': anonKey,
              'Authorization': `Bearer ${anonKey}`,
              'Prefer': 'return=minimal',
            },
            body: JSON.stringify(payload),
            keepalive: true,
          }).catch(() => {});
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [rowExists, user]);

  // Core save function
  const saveResponses = useCallback(async (
    updatedResponses: Responses,
    section: number,
    updatedFileUploads?: Record<string, FileUploadInfo[]>,
    fieldIndex?: number,
    updatedAdditionalNotes?: AdditionalNotes,
  ) => {
    if (!user) return;
    if (savingRef.current) return;

    savingRef.current = true;
    setSaving(true);
    try {
      const fu = updatedFileUploads || fileUploadsRef.current;
      const fi = fieldIndex ?? currentFieldIndexRef.current;
      const an = updatedAdditionalNotes || additionalNotesRef.current;
      const updatePayload = {
        responses: updatedResponses,
        current_section: section,
        current_field_index: fi,
        last_saved_at: new Date().toISOString(),
        file_uploads: fu,
        additional_notes: an,
      };

      let error;
      if (rowExists) {
        const { error: updateError } = await supabase
          .from('intake_responses')
          .update(updatePayload)
          .eq('user_id', user.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from('intake_responses')
          .insert({
            user_id: user.id,
            form_version: 'v2',
            ...updatePayload,
          });
        error = insertError;
        if (!insertError) {
          setRowExists(true);
        }
      }

      if (error) {
        if (rowExists && error.code === 'PGRST116') {
          const { error: insertError } = await supabase
            .from('intake_responses')
            .insert({
              user_id: user.id,
              form_version: 'v2',
              ...updatePayload,
            });
          if (!insertError) {
            setRowExists(true);
            setLastSaved(new Date());
          }
        } else {
          console.error('Save error:', error);
        }
      } else {
        setLastSaved(new Date());
      }
    } finally {
      savingRef.current = false;
      setSaving(false);
    }
  }, [user, rowExists]);

  // Debounced save for field changes
  const scheduleSave = useCallback((updatedResponses: Responses, section: number, updatedAdditionalNotes?: AdditionalNotes) => {
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }
    saveTimerRef.current = setTimeout(() => {
      saveResponses(updatedResponses, section, undefined, undefined, updatedAdditionalNotes);
    }, 1000);
  }, [saveResponses]);

  // Immediate save
  const saveNow = useCallback(async () => {
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
      saveTimerRef.current = null;
    }
    await saveResponses(responsesRef.current, currentSectionRef.current, undefined, currentFieldIndexRef.current, additionalNotesRef.current);
  }, [saveResponses]);

  const handleFieldChange = (fieldId: string, value: FieldValue) => {
    const updated = { ...responses, [fieldId]: value };
    setResponses(updated);
    scheduleSave(updated, currentSection);
  };

  const handleOtherTextChange = (fieldId: string, text: string) => {
    const key = fieldId + '_other';
    const updated = { ...responses, [key]: text };
    setResponses(updated);
    scheduleSave(updated, currentSection);
  };

  const handleAdditionalNoteChange = (fieldId: string, note: string) => {
    const updated = { ...additionalNotes, [fieldId]: note };
    setAdditionalNotes(updated);
    scheduleSave(responses, currentSection, updated);
  };

  const handleFieldBlur = () => {
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
      saveTimerRef.current = null;
    }
    saveResponses(responses, currentSection, undefined, currentFieldIndex, additionalNotes);
  };

  const handleFileUpload = async (fieldId: string, files: FileList) => {
    if (!user) return;

    setUploading(true);
    const newUploads: FileUploadInfo[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const filePath = `${user.id}/${fieldId}/${Date.now()}_${file.name}`;

        const { error: uploadError } = await supabase.storage
          .from('intake-uploads')
          .upload(filePath, file);

        if (uploadError) {
          console.error('Upload error:', uploadError);
          continue;
        }

        const { error: dbError } = await supabase.from('intake_uploads').insert({
          user_id: user.id,
          question_id: fieldId,
          file_name: file.name,
          file_path: filePath,
          file_size: file.size,
          file_type: file.type,
        });
        if (dbError) {
          console.error('Failed to record upload in database:', dbError);
        }

        newUploads.push({ name: file.name, path: filePath, size: file.size, type: file.type });
      }

      const updatedUploads = {
        ...fileUploads,
        [fieldId]: [...(fileUploads[fieldId] || []), ...newUploads],
      };
      setFileUploads(updatedUploads);

      const updatedResponses = {
        ...responses,
        [fieldId]: JSON.stringify(updatedUploads[fieldId].map(f => f.name)),
      };
      setResponses(updatedResponses);
      saveResponses(updatedResponses, currentSection, updatedUploads);
    } finally {
      setUploading(false);
    }
  };

  const removeFile = async (fieldId: string, filePath: string) => {
    if (!user) return;

    try {
      await supabase.storage.from('intake-uploads').remove([filePath]);
      const { error: dbError } = await supabase.from('intake_uploads').delete().eq('file_path', filePath);
      if (dbError) {
        console.error('Failed to delete upload record:', dbError);
      }

      const updatedUploads = {
        ...fileUploads,
        [fieldId]: (fileUploads[fieldId] || []).filter(f => f.path !== filePath),
      };
      setFileUploads(updatedUploads);
      saveResponses(responses, currentSection, updatedUploads);
    } catch (err) {
      console.error('Error removing file:', err);
    }
  };

  const addRepeatingItems = (fieldId: string) => {
    const items = (responses[fieldId] as Record<string, string>[]) || [];
    const updated = [...items, {}];
    handleFieldChange(fieldId, updated);
  };

  const removeRepeatingItem = (fieldId: string, index: number) => {
    const items = (responses[fieldId] as Record<string, string>[]) || [];
    const updated = items.filter((_, i) => i !== index);
    handleFieldChange(fieldId, updated);
  };

  const updateRepeatingItem = (fieldId: string, index: number, subFieldId: string, value: string) => {
    const items = (responses[fieldId] as Record<string, string>[]) || [];
    const updated = [...items];
    updated[index] = { ...updated[index], [subFieldId]: value };
    handleFieldChange(fieldId, updated);
  };

  const goToSection = async (index: number) => {
    await saveNow();
    setCurrentSection(index);
    setCurrentFieldIndex(0);
    window.scrollTo(0, 0);
  };

  const nextField = () => {
    const section = dataSections[currentSection];
    if (!section) return;
    const visibleFields = section.fields.filter(f => isFieldVisible(f));
    if (currentFieldIndex < visibleFields.length - 1) {
      setCurrentFieldIndex(currentFieldIndex + 1);
    }
  };

  const prevField = () => {
    if (currentFieldIndex > 0) {
      setCurrentFieldIndex(currentFieldIndex - 1);
    }
  };

  const isFieldVisible = (field: FormField): boolean => {
    if (!field.conditionalOn) return true;
    const { field: depField, value: depValue, notEqual } = field.conditionalOn;
    const response = responses[depField];

    if (notEqual) {
      if (Array.isArray(depValue)) {
        return !depValue.includes(response as string);
      }
      return response !== depValue;
    }

    if (Array.isArray(depValue)) {
      return depValue.includes(response as string);
    }
    return response === depValue;
  };

  const handleSubmit = async () => {
    if (!user || !profile) return;

    await saveNow();

    setSubmitting(true);
    try {
      const { error: responsesError } = await supabase
        .from('intake_responses')
        .update({
          responses,
          current_section: currentSection,
          current_field_index: currentFieldIndex,
          last_saved_at: new Date().toISOString(),
          submitted_at: new Date().toISOString(),
          file_uploads: fileUploads,
          additional_notes: additionalNotes,
        })
        .eq('user_id', user.id);

      if (responsesError) throw responsesError;

      const { error: profileError } = await supabase
        .from('client_profiles')
        .update({
          has_submitted_intake: true,
          intake_submitted_at: new Date().toISOString(),
          delivery_status: 'in_progress',
        })
        .eq('user_id', user.id);

      if (profileError) throw profileError;

      setSubmitted(true);
    } catch (error) {
      console.error('Submit error:', error);
      alert('Something went wrong submitting your form. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Wait for initial load
  if (profileLoading || !initialLoadDone) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy" />
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="text-center py-16">
        <CheckCircle2 size={48} className="text-success mx-auto mb-4" />
        <h2 className="font-inter font-bold text-navy text-xl mb-2">
          Intake form submitted
        </h2>
        <p className="font-inter text-secondary-text text-sm mb-6">
          Thank you! We're now preparing your business foundations pack.
          The 24-hour delivery window has started.
        </p>
        <a
          href="/personal/status"
          className="inline-flex items-center gap-2 font-inter font-semibold text-white bg-navy rounded-md hover:bg-medium-blue transition-colors"
          style={{ padding: '10px 20px', fontSize: '0.9rem' }}
        >
          View Status
          <ArrowRight size={16} />
        </a>
      </div>
    );
  }

  // Intro page
  const hasExistingResponses = Object.keys(responses).length > 0;
  if (currentSection === 0 && dataSections[0]?.id === 'intro' && !hasExistingResponses) {
    const introSection = dataSections[0];
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="max-w-lg text-center">
          <h1 className="font-inter font-bold text-navy text-3xl mb-4">
            {introSection.title}
          </h1>
          <div className="font-inter text-secondary-text leading-[1.7] text-sm whitespace-pre-line mb-8">
            {introSection.description}
          </div>
          <button
            onClick={() => goToSection(1)}
            className="font-inter font-semibold text-white bg-navy rounded-md hover:bg-medium-blue transition-colors flex items-center gap-2 mx-auto"
            style={{ padding: '14px 32px', fontSize: '1rem' }}
          >
            Begin Questionnaire
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  const section = dataSections[currentSection];
  if (!section) return null;

  const visibleFields = section.fields.filter(isFieldVisible);
  const safeFieldIndex = Math.min(currentFieldIndex, Math.max(0, visibleFields.length - 1));
  if (safeFieldIndex !== currentFieldIndex) {
    setCurrentFieldIndex(safeFieldIndex);
  }
  const activeField = visibleFields[safeFieldIndex];
  const progress = (currentSection / (totalSections - 1)) * 100;

  return (
    <div className="min-h-[70vh] flex flex-col">
      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="font-inter text-sm font-medium text-navy">
            Section {currentSection} of {totalSections - 1}
          </span>
          <span className="font-inter text-xs text-secondary-text flex items-center gap-1">
            {saving && <span className="text-amber-600">Saving...</span>}
            {!saving && lastSaved && (
              <span className="flex items-center gap-1">
                <Save size={12} />
                Saved {lastSaved.toLocaleTimeString()}
              </span>
            )}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-navy rounded-full h-2 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex gap-1 mt-3 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {dataSections.filter(s => s.id !== 'intro').map((s, i) => (
            <button
              key={s.id}
              onClick={() => goToSection(i + 1)}
              className={`font-inter text-xs px-3 py-1.5 rounded-full whitespace-nowrap transition-colors ${
                i + 1 === currentSection
                  ? 'bg-navy text-white'
                  : i + 1 < currentSection
                  ? 'bg-medium-blue text-white'
                  : 'bg-gray-100 text-secondary-text hover:bg-gray-200'
              }`}
            >
              {s.title}
            </button>
          ))}
        </div>
      </div>

      {/* Section header */}
      <div className="mb-6">
        <h2 className="font-inter font-bold text-navy text-xl mb-1">
          {section.title}
        </h2>
        <p className="font-inter text-secondary-text text-sm">
          {section.description}
        </p>
        {section.usedIn && (
          <p className="font-inter text-xs text-medium-blue mt-1 italic">
            Used in: {section.usedIn}
          </p>
        )}
      </div>

      {/* Active field */}
      {activeField && (
        <div className="flex-1 flex flex-col">
          <div className="bg-white rounded-lg border border-border p-8 flex-1">
            <FieldRenderer
              field={activeField}
              value={responses[activeField.id]}
              otherText={(responses[activeField.id + '_other'] as string) || ''}
              additionalNote={additionalNotes[activeField.id] || ''}
              fileUploads={fileUploads[activeField.id] || []}
              onChange={(value) => handleFieldChange(activeField.id, value as string | string[])}
              onOtherTextChange={(text) => handleOtherTextChange(activeField.id, text)}
              onAdditionalNoteChange={(note) => handleAdditionalNoteChange(activeField.id, note)}
              onBlur={handleFieldBlur}
              onFileUpload={(files) => handleFileUpload(activeField.id, files)}
              onRemoveFile={(path) => removeFile(activeField.id, path)}
              uploading={uploading}
              repeatingItems={activeField.type === 'repeating_section' ? (responses[activeField.id] as Record<string, string>[]) || [] : []}
              onAddItem={() => addRepeatingItems(activeField.id)}
              onRemoveItem={(index) => removeRepeatingItem(activeField.id, index)}
              onUpdateItem={(index, subFieldId, value) => updateRepeatingItem(activeField.id, index, subFieldId, value)}
            />
          </div>

          {/* Field navigation */}
          <div className="flex items-center justify-between mt-4">
            <button
              onClick={prevField}
              disabled={safeFieldIndex === 0}
              className="font-inter font-medium text-secondary-text hover:text-navy transition-colors flex items-center gap-1 disabled:opacity-30 disabled:cursor-not-allowed"
              style={{ fontSize: '0.9rem' }}
            >
              <ArrowLeft size={16} />
              Previous
            </button>

            <span className="font-inter text-xs text-secondary-text">
              {safeFieldIndex + 1} / {visibleFields.length}
            </span>

            {safeFieldIndex < visibleFields.length - 1 ? (
              <button
                onClick={() => { nextField(); handleFieldBlur(); }}
                className="font-inter font-semibold text-white bg-navy rounded-md hover:bg-medium-blue transition-colors flex items-center gap-1"
                style={{ padding: '10px 20px', fontSize: '0.9rem' }}
              >
                Next
                <ArrowRight size={16} />
              </button>
            ) : currentSection < totalSections - 1 ? (
              <button
                onClick={() => goToSection(currentSection + 1)}
                className="font-inter font-semibold text-white bg-navy rounded-md hover:bg-medium-blue transition-colors flex items-center gap-1"
                style={{ padding: '10px 20px', fontSize: '0.9rem' }}
              >
                Next Section
                <ArrowRight size={16} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="font-inter font-semibold text-white bg-success rounded-md hover:bg-green-700 transition-colors flex items-center gap-1 disabled:opacity-50"
                style={{ padding: '10px 20px', fontSize: '0.9rem' }}
              >
                {submitting ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                ) : (
                  'Submit Intake Form'
                )}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Section overview */}
      <div className="mt-8 border-t border-border pt-6">
        <h3 className="font-inter font-semibold text-navy text-sm mb-3">
          All questions in this section:
        </h3>
        <div className="flex flex-wrap gap-2">
          {visibleFields.map((field, i) => (
            <button
              key={field.id}
              onClick={() => { setCurrentFieldIndex(i); handleFieldBlur(); }}
              className={`font-inter text-xs px-3 py-1.5 rounded-md transition-colors ${
                i === safeFieldIndex
                  ? 'bg-navy text-white'
                  : responses[field.id] || (field.type === 'repeating_section' && (responses[field.id] as Record<string, string>[])?.length)
                  ? 'bg-green-50 text-green-800 border border-green-200'
                  : 'bg-gray-50 text-secondary-text hover:bg-gray-100'
              }`}
            >
              {field.questionNumber}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Field Renderer ──

interface FieldRendererProps {
  field: FormField;
  value: string | string[] | Record<string, string>[];
  otherText: string;
  additionalNote: string;
  fileUploads: FileUploadInfo[];
  onChange: (value: string | string[]) => void;
  onOtherTextChange: (text: string) => void;
  onAdditionalNoteChange: (note: string) => void;
  onBlur: () => void;
  onFileUpload: (files: FileList) => void;
  onRemoveFile: (path: string) => void;
  uploading: boolean;
  repeatingItems: Record<string, string>[];
  onAddItem: () => void;
  onRemoveItem: (index: number) => void;
  onUpdateItem: (index: number, subFieldId: string, value: string) => void;
}

function FieldRenderer({
  field,
  value,
  otherText,
  additionalNote,
  fileUploads,
  onChange,
  onOtherTextChange,
  onAdditionalNoteChange,
  onBlur,
  onFileUpload,
  onRemoveFile,
  uploading,
  repeatingItems,
  onAddItem,
  onRemoveItem,
  onUpdateItem,
}: FieldRendererProps) {
  const fileRef = useRef<HTMLInputElement>(null);

  const label = (
    <label className="block font-inter font-semibold text-navy text-base mb-2">
      {field.questionNumber}. {field.label}
      {field.required && <span className="text-danger ml-1">*</span>}
    </label>
  );

  const helpText = field.helpText ? (
    <p className="font-inter text-secondary-text text-xs mb-3 leading-[1.6]">{field.helpText}</p>
  ) : null;

  // "Other" text input — shown when "Other" is selected in choice fields
  const otherInput = field.hasOtherOption ? (() => {
    const isOtherSelected = field.type === 'single_choice'
      ? value === 'Other'
      : field.type === 'multi_select'
      ? (value as string[])?.includes('Other')
      : false;

    if (!isOtherSelected) return null;

    return (
      <div className="mt-3 ml-2 pl-4 border-l-2 border-medium-blue">
        <label className="block font-inter font-medium text-dark-text text-sm mb-1.5">
          Please specify:
        </label>
        <textarea
          value={otherText}
          onChange={(e) => onOtherTextChange(e.target.value)}
          onBlur={onBlur}
          placeholder="Tell us more about this — the more detail you give, the more tailored your documents will be"
          rows={3}
          className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-medium-blue focus:border-medium-blue font-inter text-sm"
        />
      </div>
    );
  })() : null;

  // Additional notes section — shown for every field
  const additionalNotesSection = (
    <div className="mt-6 pt-5 border-t border-border">
      <div className="flex items-center gap-2 mb-2">
        <MessageSquare size={16} className="text-medium-blue" />
        <label className="font-inter font-medium text-navy text-sm">
          Additional notes for this question
        </label>
      </div>
      <p className="font-inter text-secondary-text text-xs mb-2">
        Anything else you want to add or explain about your answer? This helps us make your documents even more specific to your business.
      </p>
      <textarea
        value={additionalNote}
        onChange={(e) => onAdditionalNoteChange(e.target.value)}
        onBlur={onBlur}
        placeholder="Add any extra context, details, or clarifications here..."
        rows={2}
        className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-medium-blue focus:border-medium-blue font-inter text-sm"
      />
    </div>
  );

  switch (field.type) {
    case 'short_text':
      return (
        <div>
          {label}
          {helpText}
          <input
            type="text"
            value={(value as string) || ''}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            placeholder={field.placeholder}
            className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-medium-blue focus:border-medium-blue font-inter text-sm"
          />
          {additionalNotesSection}
        </div>
      );

    case 'long_text':
      return (
        <div>
          {label}
          {helpText}
          <textarea
            value={(value as string) || ''}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            placeholder={field.placeholder}
            rows={5}
            className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-medium-blue focus:border-medium-blue font-inter text-sm"
          />
          {additionalNotesSection}
        </div>
      );

    case 'email':
      return (
        <div>
          {label}
          {helpText}
          <input
            type="email"
            value={(value as string) || ''}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            placeholder={field.placeholder}
            className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-medium-blue focus:border-medium-blue font-inter text-sm"
          />
          {additionalNotesSection}
        </div>
      );

    case 'phone':
      return (
        <div>
          {label}
          {helpText}
          <input
            type="tel"
            value={(value as string) || ''}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            placeholder={field.placeholder}
            className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-medium-blue focus:border-medium-blue font-inter text-sm"
          />
          {additionalNotesSection}
        </div>
      );

    case 'url':
      return (
        <div>
          {label}
          {helpText}
          <input
            type="url"
            value={(value as string) || ''}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            placeholder={field.placeholder}
            className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-medium-blue focus:border-medium-blue font-inter text-sm"
          />
          {additionalNotesSection}
        </div>
      );

    case 'single_choice':
      return (
        <div>
          {label}
          {helpText}
          <div className="flex flex-col gap-2">
            {field.options?.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => { onChange(opt); onBlur(); }}
                className={`font-inter text-left px-4 py-3 rounded-md border transition-all text-sm ${
                  value === opt
                    ? 'border-navy bg-off-white text-navy font-medium'
                    : 'border-gray-200 bg-white text-secondary-text hover:border-medium-blue hover:bg-gray-50'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
          {otherInput}
          {additionalNotesSection}
        </div>
      );

    case 'multi_select': {
      const selected = (value as string[]) || [];
      const maxSel = field.maxSelections;

      const handleToggle = (opt: string) => {
        let updated: string[];
        if (selected.includes(opt)) {
          updated = selected.filter(s => s !== opt);
        } else {
          if (maxSel && selected.length >= maxSel) return;
          updated = [...selected, opt];
        }
        onChange(updated);
        onBlur();
      };

      return (
        <div>
          {label}
          {helpText}
          {maxSel && (
            <p className="font-inter text-xs text-medium-blue mb-2">
              Select up to {maxSel} options
            </p>
          )}
          <div className="flex flex-col gap-2">
            {field.options?.map((opt) => {
              const isSelected = selected.includes(opt);
              const isDisabled = !isSelected && maxSel ? selected.length >= maxSel : false;
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => handleToggle(opt)}
                  disabled={isDisabled}
                  className={`font-inter text-left px-4 py-3 rounded-md border transition-all text-sm ${
                    isSelected
                      ? 'border-navy bg-off-white text-navy font-medium'
                      : isDisabled
                      ? 'border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed'
                      : 'border-gray-200 bg-white text-secondary-text hover:border-medium-blue hover:bg-gray-50'
                  }`}
                >
                  <span className="inline-block w-5 h-5 rounded border mr-3 align-middle text-center leading-5 shrink-0"
                    style={{
                      borderColor: isSelected ? '#1B3F7A' : '#CBD5E0',
                      background: isSelected ? '#1B3F7A' : 'transparent',
                      color: '#FFFFFF',
                      fontSize: '0.7rem',
                    }}
                  >
                    {isSelected ? '\u2713' : ''}
                  </span>
                  {opt}
                </button>
              );
            })}
          </div>
          {otherInput}
          {additionalNotesSection}
        </div>
      );
    }

    case 'file_upload':
      return (
        <div>
          {label}
          {helpText}
          <input
            ref={fileRef}
            type="file"
            className="hidden"
            onChange={(e) => {
              if (e.target.files) onFileUpload(e.target.files);
            }}
            multiple
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="font-inter text-sm font-medium text-navy border-2 border-dashed border-gray-300 rounded-lg px-6 py-8 w-full hover:border-medium-blue hover:bg-off-white transition-colors flex flex-col items-center gap-2 disabled:opacity-50"
          >
            {uploading ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-navy" />
            ) : (
              <Upload size={24} className="text-medium-blue" />
            )}
            <span>{uploading ? 'Uploading...' : 'Click to upload files'}</span>
            <span className="text-xs text-secondary-text">PDF, Word, PNG, SVG, JPEG accepted</span>
          </button>

          {fileUploads.length > 0 && (
            <div className="mt-4 flex flex-col gap-2">
              {fileUploads.map((file) => (
                <div key={file.path} className="flex items-center gap-3 bg-off-white rounded-md px-4 py-2">
                  <span className="font-inter text-sm text-dark-text flex-1 truncate">{file.name}</span>
                  <span className="font-inter text-xs text-secondary-text">
                    {(file.size / 1024).toFixed(1)} KB
                  </span>
                  <button
                    type="button"
                    onClick={() => onRemoveFile(file.path)}
                    className="text-secondary-text hover:text-danger transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
          {additionalNotesSection}
        </div>
      );

    case 'checkbox':
      return (
        <div>
          {label}
          {helpText}
          <button
            type="button"
            onClick={() => { onChange(value === 'Yes' ? '' : 'Yes'); onBlur(); }}
            className={`font-inter text-left px-4 py-3 rounded-md border transition-all text-sm w-full ${
              value === 'Yes'
                ? 'border-navy bg-off-white text-navy font-medium'
                : 'border-gray-200 bg-white text-secondary-text hover:border-medium-blue'
            }`}
          >
            <span className="inline-block w-5 h-5 rounded border mr-3 align-middle text-center leading-5 shrink-0"
              style={{
                borderColor: value === 'Yes' ? '#1B3F7A' : '#CBD5E0',
                background: value === 'Yes' ? '#1B3F7A' : 'transparent',
                color: '#FFFFFF',
                fontSize: '0.7rem',
              }}
            >
              {value === 'Yes' ? '\u2713' : ''}
            </span>
            I confirm
          </button>
          {additionalNotesSection}
        </div>
      );

    case 'repeating_section': {
      const minItems = field.minItems || 1;
      const maxItems = field.maxItems || 5;

      return (
        <div>
          {label}
          {helpText}
          <div className="flex flex-col gap-6">
            {repeatingItems.map((item, index) => (
              <div key={index} className="bg-off-white rounded-lg p-6 border border-border">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-inter font-semibold text-navy text-sm">
                    Service {index + 1}
                  </h4>
                  {repeatingItems.length > minItems && (
                    <button
                      type="button"
                      onClick={() => onRemoveItem(index)}
                      className="font-inter text-xs text-danger hover:underline flex items-center gap-1"
                    >
                      <Trash2 size={14} />
                      Remove
                    </button>
                  )}
                </div>
                <div className="flex flex-col gap-4">
                  {field.subFields?.map((subField) => (
                    <div key={subField.id}>
                      <label className="block font-inter font-medium text-dark-text text-sm mb-1.5">
                        {subField.label}
                        {subField.required && <span className="text-danger ml-0.5">*</span>}
                      </label>
                      {subField.helpText && (
                        <p className="font-inter text-secondary-text text-xs mb-1">{subField.helpText}</p>
                      )}
                      {subField.type === 'long_text' ? (
                        <textarea
                          value={item[subField.id] || ''}
                          onChange={(e) => onUpdateItem(index, subField.id, e.target.value)}
                          onBlur={onBlur}
                          placeholder={subField.placeholder}
                          rows={3}
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-medium-blue focus:border-medium-blue font-inter text-sm"
                        />
                      ) : (
                        <input
                          type="text"
                          value={item[subField.id] || ''}
                          onChange={(e) => onUpdateItem(index, subField.id, e.target.value)}
                          onBlur={onBlur}
                          placeholder={subField.placeholder}
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-medium-blue focus:border-medium-blue font-inter text-sm"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          {repeatingItems.length < maxItems && (
            <button
              type="button"
              onClick={onAddItem}
              className="mt-4 font-inter text-sm font-medium text-navy border border-navy rounded-md px-4 py-2 hover:bg-off-white transition-colors flex items-center gap-2"
            >
              <Plus size={16} />
              Add Service ({repeatingItems.length}/{maxItems})
            </button>
          )}
          {additionalNotesSection}
        </div>
      );
    }

    default:
      return null;
  }
}
