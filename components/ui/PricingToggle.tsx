'use client';

import { useState } from 'react';

interface PricingToggleProps {
  onCycleChange?: (cycle: 'monthly' | 'annual') => void;
}

export function PricingToggle({ onCycleChange }: PricingToggleProps) {
  const [annual, setAnnual] = useState(false);

  const handleToggle = (isAnnual: boolean) => {
    setAnnual(isAnnual);
    onCycleChange?.(isAnnual ? 'annual' : 'monthly');
  };

  return (
    <div className="inline-flex items-center gap-1 rounded-lg bg-primary-100 p-1">
      <button
        onClick={() => handleToggle(false)}
        className={`rounded-md px-5 py-2 font-sans text-sm font-semibold transition-colors ${
          !annual ? 'bg-white text-primary-900 shadow-sm' : 'text-primary-500 hover:text-primary-700'
        }`}
      >
        Monthly
      </button>
      <button
        onClick={() => handleToggle(true)}
        className={`flex items-center gap-2 rounded-md px-5 py-2 font-sans text-sm font-semibold transition-colors ${
          annual ? 'bg-white text-primary-900 shadow-sm' : 'text-primary-500 hover:text-primary-700'
        }`}
      >
        Annual
        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
          Save 20%
        </span>
      </button>
    </div>
  );
}
