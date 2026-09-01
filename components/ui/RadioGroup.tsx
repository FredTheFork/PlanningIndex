import React from 'react';

interface RadioOption {
  value: string;
  label: string;
  description?: string;
}

interface RadioGroupProps {
  name: string;
  options: RadioOption[];
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
}

export function RadioGroup({
  name,
  options,
  value,
  onChange,
  label,
  error,
  disabled = false,
  className = '',
}: RadioGroupProps) {
  return (
    <div className="w-full">
      {label && (
        <span className="block font-sans font-medium text-primary-900 text-sm mb-1.5">
          {label}
        </span>
      )}
      <div className={`space-y-2 ${className}`}>
        {options.map((option) => {
          const isSelected = value === option.value;
          return (
            <label
              key={option.value}
              className={`flex items-start gap-3 cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={isSelected}
                onChange={() => onChange?.(option.value)}
                disabled={disabled}
                className="mt-0.5 w-4 h-4 border-primary-300 text-accent-600 focus:ring-2 focus:ring-accent-500/40 focus:ring-offset-0"
              />
              <div className="flex-1">
                <span className="font-sans font-medium text-primary-900 text-sm block">
                  {option.label}
                </span>
                {option.description && (
                  <span className="text-xs text-primary-500 font-sans mt-0.5 block">
                    {option.description}
                  </span>
                )}
              </div>
            </label>
          );
        })}
      </div>
      {error && (
        <p className="mt-1.5 text-xs text-danger font-sans">{error}</p>
      )}
    </div>
  );
}
