import React from 'react';
import { CheckCircle, AlertTriangle, XCircle, Info, X } from 'lucide-react';

type AlertVariant = 'success' | 'warning' | 'danger' | 'info';

interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  children?: React.ReactNode;
  onClose?: () => void;
  className?: string;
}

const variantConfig: Record<AlertVariant, { container: string; icon: React.ReactNode; iconColor: string }> = {
  success: {
    container: 'bg-success-50 border-success-200 text-success-800',
    icon: <CheckCircle size={20} />,
    iconColor: 'text-success-600',
  },
  warning: {
    container: 'bg-warning-50 border-warning-200 text-warning-800',
    icon: <AlertTriangle size={20} />,
    iconColor: 'text-warning-600',
  },
  danger: {
    container: 'bg-danger-50 border-danger-200 text-danger-800',
    icon: <XCircle size={20} />,
    iconColor: 'text-danger-600',
  },
  info: {
    container: 'bg-info-50 border-info-200 text-info-800',
    icon: <Info size={20} />,
    iconColor: 'text-info-600',
  },
};

export function Alert({ variant = 'info', title, children, onClose, className = '' }: AlertProps) {
  const config = variantConfig[variant];

  return (
    <div className={`flex items-start gap-3 p-4 rounded-lg border ${config.container} ${className}`}>
      <span className={`shrink-0 ${config.iconColor}`}>{config.icon}</span>
      <div className="flex-1 min-w-0">
        {title && (
          <p className="font-sans font-semibold text-sm mb-0.5">{title}</p>
        )}
        {children && (
          <div className="font-sans text-sm opacity-90">{children}</div>
        )}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="shrink-0 opacity-60 hover:opacity-100 transition-opacity"
          aria-label="Dismiss"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
