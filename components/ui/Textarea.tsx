import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, helperText, error, className = '', id, ...props }, ref) => {
    const textareaId = id || props.name;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={textareaId} className="block font-sans font-medium text-primary-900 text-sm mb-1.5">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={`block w-full px-3 py-2.5 border rounded-lg shadow-sm placeholder:text-primary-400 focus:outline-none focus:ring-2 focus:ring-accent-500/40 focus:border-accent-500 font-sans text-sm text-primary-900 bg-white disabled:bg-primary-50 disabled:cursor-not-allowed transition-colors resize-y min-h-[80px] ${
            error ? 'border-danger focus:ring-danger/30 focus:border-danger' : 'border-primary-300'
          } ${className}`}
          {...props}
        />
        {helperText && !error && (
          <p className="mt-1.5 text-xs text-primary-500 font-sans">{helperText}</p>
        )}
        {error && (
          <p className="mt-1.5 text-xs text-danger font-sans">{error}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
