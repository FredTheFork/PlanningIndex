'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';

type DrawerSide = 'right' | 'bottom';
type DrawerSize = 'sm' | 'md' | 'lg';

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  side?: DrawerSide;
  size?: DrawerSize;
  children?: React.ReactNode;
  footer?: React.ReactNode;
}

const sideClasses: Record<DrawerSide, string> = {
  right: 'right-0 top-0 bottom-0 h-full animate-slide-in-right',
  bottom: 'left-0 right-0 bottom-0 top-auto max-h-[85vh] animate-slide-in-up',
};

const rightWidthClasses: Record<DrawerSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
};

export function Drawer({ open, onClose, title, description, side = 'right', size = 'md', children, footer }: DrawerProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  const widthClass = side === 'right' ? rightWidthClasses[size] : '';

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-surface-overlay animate-fade-in"
        onClick={onClose}
      />
      <div className={`absolute ${sideClasses[side]} w-full ${widthClass} bg-white shadow-overlay flex flex-col`}>
        {(title || description) && (
          <div className="flex items-start justify-between gap-4 px-6 pt-6 pb-4 border-b border-primary-100">
            <div>
              {title && (
                <h2 className="font-sans font-semibold text-primary-900 text-lg">{title}</h2>
              )}
              {description && (
                <p className="text-sm text-primary-500 font-sans mt-1">{description}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-primary-400 hover:text-primary-700 transition-colors shrink-0"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>
        )}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {children}
        </div>
        {footer && (
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-primary-100">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
