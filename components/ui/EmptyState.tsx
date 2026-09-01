import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon: Icon, title, description, action, className = '' }: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center text-center py-16 px-6 ${className}`}>
      <div className="w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center mb-4">
        <Icon size={28} className="text-primary-400" />
      </div>
      <h3 className="font-sans font-semibold text-primary-900 text-base mb-1">{title}</h3>
      {description && (
        <p className="font-sans text-sm text-primary-500 max-w-sm mb-6">{description}</p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
}
