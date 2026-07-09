import React from 'react';

interface SectionLabelProps {
  children: React.ReactNode;
  className?: string;
}

export function SectionLabel({ children, className = '' }: SectionLabelProps) {
  return (
    <span
      className={`font-inter font-semibold text-medium-blue uppercase block mb-3 ${className}`}
      style={{ fontSize: '0.75rem', letterSpacing: '0.15em' }}
    >
      {children}
    </span>
  );
}
