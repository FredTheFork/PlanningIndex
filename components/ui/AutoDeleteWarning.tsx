'use client';

import { Clock } from 'lucide-react';
import { useAutoDeleteCountdown, useEarliestAutoDelete, getUrgencyStyles, UrgencyLevel } from '@/hooks/useAutoDeleteCountdown';

interface AutoDeleteWarningProps {
  autoDeleteAt: string | null | undefined;
  message?: string;
  className?: string;
  showIcon?: boolean;
}

export function AutoDeleteWarning({
  autoDeleteAt,
  message = 'Documents are available for a limited time',
  className = '',
  showIcon = true,
}: AutoDeleteWarningProps) {
  const { timeRemaining, urgencyLevel, isExpired } = useAutoDeleteCountdown(autoDeleteAt);

  if (!autoDeleteAt || isExpired) return null;

  const styles = getUrgencyStyles(urgencyLevel);

  return (
    <div className={`${styles.bg} ${styles.border} border rounded-lg p-4 flex items-start gap-3 ${className}`}>
      {showIcon && <Clock size={18} className={`${styles.icon} shrink-0 mt-0.5`} />}
      <div>
        <p className={`font-inter ${styles.text} text-sm font-medium`}>
          {message}
        </p>
        <p className={`font-inter ${styles.icon} text-xs mt-1`}>
          {timeRemaining} — Please download and save copies to your own device.
        </p>
      </div>
    </div>
  );
}

interface AutoDeleteWarningMultipleProps {
  autoDeleteDates: (string | null | undefined)[];
  message?: string;
  className?: string;
}

export function AutoDeleteWarningMultiple({
  autoDeleteDates,
  message = 'Documents are available for a limited time',
  className = '',
}: AutoDeleteWarningMultipleProps) {
  const { timeRemaining, urgencyLevel, isExpired } = useEarliestAutoDelete(autoDeleteDates);

  const validDates = autoDeleteDates.filter(Boolean);
  if (validDates.length === 0 || isExpired) return null;

  const styles = getUrgencyStyles(urgencyLevel);

  return (
    <div className={`${styles.bg} ${styles.border} border rounded-lg p-4 flex items-start gap-3 ${className}`}>
      <Clock size={18} className={`${styles.icon} shrink-0 mt-0.5`} />
      <div>
        <p className={`font-inter ${styles.text} text-sm font-medium`}>
          {message}
        </p>
        <p className={`font-inter ${styles.icon} text-xs mt-1`}>
          {timeRemaining} — Please download and save copies to your own device.
        </p>
      </div>
    </div>
  );
}

export function AutoDeleteBadge({ autoDeleteAt }: { autoDeleteAt: string | null | undefined }) {
  const { timeRemaining, urgencyLevel, isExpired } = useAutoDeleteCountdown(autoDeleteAt);

  if (!autoDeleteAt || isExpired) return null;

  const colorClass = urgencyLevel === 'critical'
    ? 'text-red-600'
    : urgencyLevel === 'warning'
    ? 'text-amber-600'
    : 'text-gray-500';

  return (
    <span className={`font-inter text-xs ${colorClass}`}>
      {timeRemaining}
    </span>
  );
}
