import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { SectionLabel } from '@/components/ui';

interface FeatureShowcaseProps {
  label: string;
  title: string;
  description: string;
  features: string[];
  icon: LucideIcon;
  image: React.ReactNode;
  reverse?: boolean;
}

export function FeatureShowcase({
  label,
  title,
  description,
  features,
  icon: Icon,
  image,
  reverse = false,
}: FeatureShowcaseProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      <div className={reverse ? 'lg:order-2' : ''}>
        <SectionLabel>{label}</SectionLabel>
        <h3 className="font-display font-bold text-primary-900 text-h3 mt-2 mb-4">
          {title}
        </h3>
        <p className="font-sans text-primary-500 leading-relaxed mb-6" style={{ fontSize: '1.05rem' }}>
          {description}
        </p>
        <ul className="space-y-3">
          {features.map((feature) => (
            <li key={feature} className="flex items-start gap-3">
              <div className="flex items-center justify-center w-5 h-5 rounded-full bg-accent-100 shrink-0 mt-0.5">
                <Icon size={12} className="text-accent-700" />
              </div>
              <span className="font-sans text-primary-700 text-sm leading-relaxed">
                {feature}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className={reverse ? 'lg:order-1' : ''}>
        {image}
      </div>
    </div>
  );
}
