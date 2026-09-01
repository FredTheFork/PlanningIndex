'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
  className?: string;
}

function getRange(start: number, end: number): number[] {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

function getPaginationRange(current: number, total: number, siblings: number): (number | '...')[] {
  const totalShown = siblings * 2 + 5;
  if (total <= totalShown) return getRange(1, total);

  const leftSibling = Math.max(current - siblings, 1);
  const rightSibling = Math.min(current + siblings, total);
  const showLeftDots = leftSibling > 2;
  const showRightDots = rightSibling < total - 1;

  if (!showLeftDots && showRightDots) {
    const leftCount = 3 + siblings * 2;
    return [...getRange(1, leftCount), '...', total];
  }
  if (showLeftDots && !showRightDots) {
    const rightCount = 3 + siblings * 2;
    return [1, '...', ...getRange(total - rightCount + 1, total)];
  }
  return [1, '...', ...getRange(leftSibling, rightSibling), '...', total];
}

export function Pagination({ currentPage, totalPages, onPageChange, siblingCount = 1, className = '' }: PaginationProps) {
  if (totalPages <= 1) return null;

  const range = getPaginationRange(currentPage, totalPages, siblingCount);

  return (
    <nav className={`flex items-center gap-1 ${className}`} aria-label="Pagination">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-md text-primary-500 hover:bg-primary-100 hover:text-primary-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        aria-label="Previous page"
      >
        <ChevronLeft size={18} />
      </button>
      {range.map((item, index) => {
        if (item === '...') {
          return (
            <span key={`ellipsis-${index}`} className="px-3 py-2 text-primary-400 text-sm font-sans">
              ...
            </span>
          );
        }
        const page = item as number;
        return (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`min-w-[36px] h-9 px-2 rounded-md font-sans font-medium text-sm transition-colors ${
              page === currentPage
                ? 'bg-primary-900 text-white'
                : 'text-primary-600 hover:bg-primary-100'
            }`}
          >
            {page}
          </button>
        );
      })}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-md text-primary-500 hover:bg-primary-100 hover:text-primary-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        aria-label="Next page"
      >
        <ChevronRight size={18} />
      </button>
    </nav>
  );
}
