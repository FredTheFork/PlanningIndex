'use client';

import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  onClear?: () => void;
  showClearButton?: boolean;
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ label, onClear, showClearButton = true, className = '', id, value, ...props }, ref) => {
    const inputId = id || props.name;
    const hasValue = Boolean(value);

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block font-sans font-medium text-primary-900 text-sm mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-400 pointer-events-none"
          />
          <input
            ref={ref}
            id={inputId}
            type="search"
            value={value}
            className={`block w-full pl-10 ${showClearButton && hasValue ? 'pr-10' : 'pr-3'} py-2.5 border border-primary-300 rounded-lg shadow-sm placeholder:text-primary-400 focus:outline-none focus:ring-2 focus:ring-accent-500/40 focus:border-accent-500 font-sans text-sm text-primary-900 bg-white transition-colors ${className}`}
            {...props}
          />
          {showClearButton && hasValue && (
            <button
              type="button"
              onClick={onClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-400 hover:text-primary-700 transition-colors"
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>
    );
  }
);

SearchInput.displayName = 'SearchInput';
