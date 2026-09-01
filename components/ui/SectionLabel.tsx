import React from 'react';

interface SectionLabelProps {
  children: React.ReactNode;
  className?: string;
}

export function SectionLabel({ children, className = '' }: SectionLabelProps) {
  return (
    <span
      className={`font-sans font-semibold text-accent-600 uppercase block mb-3 ${className}`}
      style={{ fontSize: '0.75rem', letterSpacing: '0.15em' }}
    >
      {children}
    </span>
  );
}
