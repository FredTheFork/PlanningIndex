import React from 'react';
import { SectionLabel } from '@/components/ui';

interface ProductShowcaseSectionProps {
  label: string;
  title: string;
  description: string;
  children: React.ReactNode;
  reverse?: boolean;
  className?: string;
  id?: string;
}

export function ProductShowcaseSection({
  label,
  title,
  description,
  children,
  reverse = false,
  className = '',
  id,
}: ProductShowcaseSectionProps) {
  return (
    <section id={id} className={`px-6 py-24 sm:py-32 ${className}`}>
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-20">
          <div className={reverse ? 'lg:order-2' : ''}>
            <SectionLabel>{label}</SectionLabel>
            <h2 className="font-display text-4xl font-bold leading-[1.08] tracking-[-0.04em] text-primary-900 sm:text-5xl">
              {title}
            </h2>
            <p className="mt-6 text-base leading-7 text-slate-600">
              {description}
            </p>
          </div>
          <div className={reverse ? 'lg:order-1' : ''}>
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}
