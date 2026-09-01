import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  return (
    <nav className={`flex items-center gap-1.5 ${className}`} aria-label="Breadcrumbs">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={index}>
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="font-sans text-sm text-primary-500 hover:text-primary-900 transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className={`font-sans text-sm ${isLast ? 'text-primary-900 font-medium' : 'text-primary-500'}`}>
                {item.label}
              </span>
            )}
            {!isLast && (
              <ChevronRight size={14} className="text-primary-300 shrink-0" />
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
