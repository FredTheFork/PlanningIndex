import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface DashboardSectionProps {
  title: string;
  viewAllHref?: string;
  viewAllLabel?: string;
  children: React.ReactNode;
  className?: string;
}

export function DashboardSection({
  title,
  viewAllHref,
  viewAllLabel = 'View all',
  children,
  className = '',
}: DashboardSectionProps) {
  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-sans font-semibold text-primary-900 text-base">{title}</h2>
        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="inline-flex items-center gap-1 font-sans text-sm font-medium text-accent-600 hover:text-accent-700 transition-colors"
          >
            {viewAllLabel} <ArrowRight size={14} />
          </Link>
        )}
      </div>
      {children}
    </div>
  );
}
