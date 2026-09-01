'use client';

import React, { useState } from 'react';

type TabsVariant = 'underline' | 'pill';

interface TabItem {
  label: string;
  value: string;
  content?: React.ReactNode;
}

interface TabsProps {
  items: TabItem[];
  variant?: TabsVariant;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export function Tabs({ items, variant = 'underline', value, onChange, className = '' }: TabsProps) {
  const [internalValue, setInternalValue] = useState(items[0]?.value);
  const activeValue = value ?? internalValue;

  const handleTabChange = (val: string) => {
    setInternalValue(val);
    onChange?.(val);
  };

  const activeItem = items.find((item) => item.value === activeValue);

  return (
    <div className={className}>
      <div className={`flex gap-1 ${variant === 'pill' ? 'bg-primary-100 p-1 rounded-lg' : 'border-b border-primary-200'}`}>
        {items.map((item) => {
          const isActive = item.value === activeValue;
          if (variant === 'underline') {
            return (
              <button
                key={item.value}
                onClick={() => handleTabChange(item.value)}
                className={`px-4 py-2.5 font-sans font-medium text-sm transition-colors relative ${
                  isActive ? 'text-accent-600' : 'text-primary-500 hover:text-primary-700'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-600 rounded-full" />
                )}
              </button>
            );
          }
          return (
            <button
              key={item.value}
              onClick={() => handleTabChange(item.value)}
              className={`px-4 py-2 font-sans font-medium text-sm rounded-md transition-colors ${
                isActive ? 'bg-white text-primary-900 shadow-sm' : 'text-primary-500 hover:text-primary-700'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
      {activeItem?.content && (
        <div className="mt-6">{activeItem.content}</div>
      )}
    </div>
  );
}
