'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';

type ModalSize = 'sm' | 'md' | 'lg' | 'xl';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  size?: ModalSize;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  closeOnBackdrop?: boolean;
}

const sizeClasses: Record<ModalSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-2xl',
};

export function Modal({ open, onClose, title, description, size = 'md', children, footer, closeOnBackdrop = true }: ModalProps) {
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-surface-overlay animate-fade-in"
        onClick={closeOnBackdrop ? onClose : undefined}
      />
      <div className={`relative w-full ${sizeClasses[size]} bg-white rounded-2xl shadow-overlay animate-scale-in max-h-[90vh] flex flex-col`}>
        {(title || description) && (
          <div className="flex items-start justify-between gap-4 px-6 pt-6 pb-4">
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
