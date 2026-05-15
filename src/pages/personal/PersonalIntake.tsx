import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useClientProfile } from '../../hooks/useClientProfile';
import { supabase } from '../../lib/supabase';
import { intakeFormSections, upsellFormSections, FormField } from '../../lib/intakeFormDefinition';
import { Save, CheckCircle2, ArrowRight, ArrowLeft, Upload, X, Plus, Trash2 } from 'lucide-react';

type FieldValue = string | string[] | Record<string, string>[];
type Responses = Record<string, FieldValue>;

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
  const [currentSection, setCurrentSection] = useState(0);
  const [currentFieldIndex, setCurrentFieldIndex] = useState(0);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fileUploads, setFileUploads] = useState<Record<string, FileUploadInfo[]>>({});
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const allSections = profile?.purchased_upsells && profile.purchased_upsells.length > 0
    ? [...intakeFormSections, ...upsellFormSections]
    : intakeFormSections;

  const dataSections = allSections.filter(s => s.fields.length > 0);
  const totalSections = dataSections.length;

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
        return;
      }

      if (data) {
        setResponses(data.responses as Responses || {});
        setCurrentSection(data.current_section ?? 0);
        setLastSaved(new Date(data.last_saved_at));
        if (data.file_uploads) {
          setFileUploads(data.file_uploads as Record<string, FileUploadInfo[]> || {});
        }
      }
    };

    fetchResponses();
  }, [user]);

  useEffect(() => {
    if (profile?.has_submitted_intake) {
      setSubmitted(true);
    }
  }, [profile]);

  const saveResponses = useCallback(async (updatedResponses: Responses, section: number, updatedFileUploads?: Record<string, FileUploadInfo[]>) => {
    if (!user) return;

    setSaving(true);
    try {
      const fu = updatedFileUploads || fileUploads;
      const { error } = await supabase
        .from('intake_responses')
        .update({
          responses: updatedResponses,
          current_section: section,
          last_saved_at: new Date().toISOString(),
          file_uploads: fu,
        })
        .eq('user_id', user.id);

      if (error) {
        console.error('Autosave error:', error);
      } else {
        setLastSaved(new Date());
      }
    } finally {
      setSaving(false);
    }
  }, [user, fileUploads]);

  const scheduleSave = useCallback((updatedResponses: Responses, section: number) => {
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }
    saveTimerRef.current = setTimeout(() => {
      saveResponses(updatedResponses, section);
    }, 800);
  }, [saveResponses]);

  const handleFieldChange = (fieldId: string, value: FieldValue) => {
    const updated = { ...responses, [fieldId]: value };
    setResponses(updated);
    scheduleSave(updated, currentSection);
  };

  const handleFieldBlur = () => {
    saveResponses(responses, currentSection);
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

        await supabase.from('intake_uploads').insert({
          user_id: user.id,
          question_id: fieldId,
          file_name: file.name,
          file_path: filePath,
          file_size: file.size,
          file_type: file.type,
        });

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
      await supabase.from('intake_uploads').delete().eq('file_path', filePath);

      const updatedUploads = {
        ...fileUploads,
        [fieldId]: (fileUploads[fieldId] || []).filter(f => f.path !== filePath),
      };
      setFileUploads(updatedUploads);
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

  const goToSection = (index: number) => {
    setCurrentSection(index);
    setCurrentFieldIndex(0);
    saveResponses(responses, index);
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

    setSubmitting(true);
    try {
      const { error: responsesError } = await supabase
        .from('intake_responses')
        .update({
          responses,
          current_section: currentSection,
          last_saved_at: new Date().toISOString(),
          submitted_at: new Date().toISOString(),
          file_uploads: fileUploads,
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

  if (profileLoading) {
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
  if (currentSection === 0 && dataSections[0]?.id === 'intro') {
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
  const activeField = visibleFields[currentFieldIndex];
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
              responses={responses}
              fileUploads={fileUploads[activeField.id] || []}
              onChange={(value) => handleFieldChange(activeField.id, value as string | string[])}
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
              disabled={currentFieldIndex === 0}
              className="font-inter font-medium text-secondary-text hover:text-navy transition-colors flex items-center gap-1 disabled:opacity-30 disabled:cursor-not-allowed"
              style={{ fontSize: '0.9rem' }}
            >
              <ArrowLeft size={16} />
              Previous
            </button>

            <span className="font-inter text-xs text-secondary-text">
              {currentFieldIndex + 1} / {visibleFields.length}
            </span>

            {currentFieldIndex < visibleFields.length - 1 ? (
              <button
                onClick={nextField}
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
              onClick={() => setCurrentFieldIndex(i)}
              className={`font-inter text-xs px-3 py-1.5 rounded-md transition-colors ${
                i === currentFieldIndex
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
  responses: Responses;
  fileUploads: FileUploadInfo[];
  onChange: (value: string | string[]) => void;
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
  fileUploads,
  onChange,
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
                          placeholder={subField.placeholder}
                          rows={3}
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-medium-blue focus:border-medium-blue font-inter text-sm"
                        />
                      ) : (
                        <input
                          type="text"
                          value={item[subField.id] || ''}
                          onChange={(e) => onUpdateItem(index, subField.id, e.target.value)}
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
        </div>
      );
    }

    default:
      return null;
  }
}
