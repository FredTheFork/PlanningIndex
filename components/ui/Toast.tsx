'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, AlertTriangle, XCircle, Info, X } from 'lucide-react';

type ToastVariant = 'success' | 'warning' | 'danger' | 'info';

interface Toast {
  id: string;
  variant: ToastVariant;
  title?: string;
  message?: string;
  duration?: number;
}

interface ToastContextValue {
  toast: ( (toast: Omit<Toast, 'id'>) => void);
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

const variantConfig: Record<ToastVariant, { container: string; icon: React.ReactNode }> = {
  success: { container: 'border-success-200', icon: <CheckCircle size={18} className="text-success-600" /> },
  warning: { container: 'border-warning-200', icon: <AlertTriangle size={18} className="text-warning-600" /> },
  danger: { container: 'border-danger-200', icon: <XCircle size={18} className="text-danger-600" /> },
  info: { container: 'border-info-200', icon: <Info size={18} className="text-info-600" /> },
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback((newToast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).slice(2);
    const duration = newToast.duration ?? 4000;
    setToasts((prev) => [...prev, { ...newToast, id }]);
    if (duration > 0) {
      setTimeout(() => dismiss(id), duration);
    }
  }, [dismiss]);

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((t) => {
          const config = variantConfig[t.variant];
          return (
            <div
              key={t.id}
              className={`flex items-start gap-3 p-4 rounded-lg border bg-white shadow-raised animate-slide-in-up pointer-events-auto ${config.container}`}
            >
              <span className="shrink-0 mt-0.5">{config.icon}</span>
              <div className="flex-1 min-w-0">
                {t.title && (
                  <p className="font-sans font-semibold text-sm text-primary-900">{t.title}</p>
                )}
                {t.message && (
                  <p className="font-sans text-sm text-primary-500 mt-0.5">{t.message}</p>
                )}
              </div>
              <button
                onClick={() => dismiss(t.id)}
                className="shrink-0 text-primary-400 hover:text-primary-700 transition-colors"
                aria-label="Dismiss"
              >
                <X size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
