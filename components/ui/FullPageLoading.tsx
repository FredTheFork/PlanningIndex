import React from 'react';

interface FullPageLoadingProps {
  label?: string;
}

export function FullPageLoading({ label = 'Loading...' }: FullPageLoadingProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="w-8 h-8 border-2 border-primary-200 border-t-accent-600 rounded-full animate-spin mb-4" />
      <p className="font-sans text-sm text-primary-500">{label}</p>
    </div>
  );
}
