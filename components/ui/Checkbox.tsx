import React from 'react';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
  error?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, description, error, className = '', id, ...props }, ref) => {
    const checkboxId = id || props.name;

    return (
      <div className="w-full">
        <div className="flex items-start gap-3">
          <input
            ref={ref}
            type="checkbox"
            id={checkboxId}
            className={`mt-0.5 w-4 h-4 rounded border-primary-300 text-accent-600 focus:ring-2 focus:ring-accent-500/40 focus:ring-offset-0 cursor-pointer ${className}`}
            {...props}
          />
          {label && (
            <div className="flex-1">
              <label htmlFor={checkboxId} className="font-sans font-medium text-primary-900 text-sm cursor-pointer">
                {label}
              </label>
              {description && (
                <p className="text-xs text-primary-500 font-sans mt-0.5">{description}</p>
              )}
            </div>
          )}
        </div>
        {error && (
          <p className="mt-1.5 text-xs text-danger font-sans ml-7">{error}</p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
