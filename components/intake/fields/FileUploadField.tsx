'use client';

import { useRef, useState } from 'react';
import { Upload, X, FileText } from 'lucide-react';
import { FormField } from '@/lib/forms/intake-definition';

interface FileUploadFieldProps {
  field: FormField;
  value: any[];
  onUpload: (file: File) => Promise<any>;
  onRemove: (filePath: string) => Promise<void>;
  onChange: (value: any[]) => void;
  error?: string | null;
}

export default function FileUploadField({
  field,
  value,
  onUpload,
  onRemove,
  onChange,
  error,
}: FileUploadFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploading(true);
    try {
      const currentFiles = value || [];
      const newFiles = [...currentFiles];

      for (const file of files) {
        if (file.size > 10 * 1024 * 1024) {
          alert(`File "${file.name}" exceeds the 10MB limit`);
          continue;
        }
        const fileMeta = await onUpload(file);
        if (fileMeta) newFiles.push(fileMeta);
      }

      onChange(newFiles);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemove = async (index: number) => {
    const currentFiles = value || [];
    const fileToRemove = currentFiles[index];
    if (!fileToRemove) return;

    await onRemove(fileToRemove.path);
    onChange(currentFiles.filter((_: any, i: number) => i !== index));
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
        <p className="font-inter text-[#4A5568] text-xs mb-2">{field.helpText}</p>
      )}

      {/* Existing files */}
      {(value || []).length > 0 && (
        <div className="space-y-2 mb-3">
          {value.map((file: any, i: number) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 rounded-md border border-[#E2E8F0] bg-[#FAFBFC]"
            >
              <div className="flex items-center gap-2">
                <FileText size={16} className="text-[#1B3F7A]" />
                <div>
                  <p className="font-inter text-sm font-medium text-[#1A1A2E]">{file.name}</p>
                  <p className="font-inter text-xs text-[#4A5568]">
                    {Math.round(file.size / 1024)}KB
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleRemove(i)}
                className="p-1 rounded hover:bg-red-50 transition-colors"
              >
                <X size={16} className="text-[#E53E3E]" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload button */}
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md border-2 border-dashed border-[#E2E8F0] hover:border-[#2C68C4] hover:bg-[#F0F4FF] font-inter text-sm text-[#4A5568] hover:text-[#2C68C4] transition-colors disabled:opacity-50"
      >
        <Upload size={16} />
        {uploading ? 'Uploading...' : 'Click to upload file'}
      </button>

      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileSelect}
        className="hidden"
        accept=".pdf,.png,.jpg,.jpeg,.svg,.doc,.docx,.txt"
      />

      {error && (
        <p className="mt-1 font-inter text-[#E53E3E] text-xs">{error}</p>
      )}
    </div>
  );
}
