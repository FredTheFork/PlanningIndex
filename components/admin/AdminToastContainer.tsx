'use client';

import { CheckCircle2, AlertCircle, Info, AlertTriangle, X, RotateCw } from 'lucide-react';
import type { Toast } from '@/hooks/useAdminToast';

const config: Record<string, { icon: typeof CheckCircle2; border: string; bg: string; text: string; role: string }> = {
  success: { icon: CheckCircle2, border: 'border-l-green-500', bg: 'bg-white', text: 'text-gray-800', role: 'status' },
  error: { icon: AlertCircle, border: 'border-l-red-500', bg: 'bg-white', text: 'text-gray-800', role: 'alert' },
  info: { icon: Info, border: 'border-l-blue-500', bg: 'bg-white', text: 'text-gray-800', role: 'status' },
  warning: { icon: AlertTriangle, border: 'border-l-amber-500', bg: 'bg-white', text: 'text-gray-800', role: 'alert' },
};

export default function AdminToastContainer({
  toasts,
  onDismiss,
  onRetry,
}: {
  toasts: Toast[];
  onDismiss: (id: string) => void;
  onRetry: (id: string) => void;
}) {
  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
      aria-live="polite"
    >
      {toasts.map((toast) => {
        const c = config[toast.type] || config.info;
        const Icon = c.icon;
        return (
          <div
            key={toast.id}
            role={c.role as 'status' | 'alert'}
            className={`pointer-events-auto flex items-start gap-3 ${c.bg} ${c.border} border-l-4 border border-gray-200 rounded-lg shadow-lg p-3 pr-2 animate-[slideInRight_0.2s_ease-out]`}
          >
            <Icon size={18} className={`shrink-0 mt-0.5 ${
              toast.type === 'success' ? 'text-green-500' :
              toast.type === 'error' ? 'text-red-500' :
              toast.type === 'warning' ? 'text-amber-500' : 'text-blue-500'
            }`} />
            <div className="flex-1 min-w-0">
              <p className="font-inter text-sm ${c.text} text-gray-800 break-words">{toast.message}</p>
              {toast.retryFn && (
                <button
                  onClick={() => onRetry(toast.id)}
                  className="mt-1.5 inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-xs font-inter font-medium transition-colors"
                >
                  <RotateCw size={12} />
                  Retry
                </button>
              )}
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              aria-label="Dismiss notification"
              className="shrink-0 p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
