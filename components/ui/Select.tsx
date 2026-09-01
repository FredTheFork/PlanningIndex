import React from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  helperText?: string;
  error?: string;
  placeholder?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, helperText, error, placeholder, className = '', id, children, ...props }, ref) => {
    const selectId = id || props.name;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={selectId} className="block font-sans font-medium text-primary-900 text-sm mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={`block w-full pl-3 pr-10 py-2.5 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-accent-500/40 focus:border-accent-500 font-sans text-sm text-primary-900 bg-white disabled:bg-primary-50 disabled:cursor-not-allowed transition-colors appearance-none cursor-pointer ${
              error ? 'border-danger focus:ring-danger/30 focus:border-danger' : 'border-primary-300'
            } ${className}`}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {children}
          </select>
          <ChevronDown
            size={16}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-400 pointer-events-none"
          />
        </div>
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

Select.displayName = 'Select';
