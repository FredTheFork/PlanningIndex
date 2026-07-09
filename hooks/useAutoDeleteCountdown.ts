'use client';

import { useState, useEffect, useMemo } from 'react';

export type UrgencyLevel = 'critical' | 'warning' | 'normal' | 'none';

export interface AutoDeleteCountdownResult {
  timeRemaining: string;
  urgencyLevel: UrgencyLevel;
  daysRemaining: number;
  hoursRemaining: number;
  isExpired: boolean;
}

function calculateCountdown(autoDeleteAt: string): AutoDeleteCountdownResult {
  const now = Date.now();
  const deleteTime = new Date(autoDeleteAt).getTime();
  const diffMs = deleteTime - now;

  if (diffMs <= 0) {
    return {
      timeRemaining: 'Expired',
      urgencyLevel: 'critical',
      daysRemaining: 0,
      hoursRemaining: 0,
      isExpired: true,
    };
  }

  const diffHours = diffMs / (1000 * 60 * 60);
  const diffDays = Math.floor(diffHours / 24);
  const remainingHours = Math.floor(diffHours % 24);

  let urgencyLevel: UrgencyLevel = 'normal';
  if (diffDays < 1) {
    urgencyLevel = 'critical';
  } else if (diffDays < 3) {
    urgencyLevel = 'warning';
  }

  let timeRemaining: string;
  if (diffDays < 1) {
    if (remainingHours < 1) {
      const diffMins = Math.ceil(diffMs / (1000 * 60));
      timeRemaining = `${diffMins} minute${diffMins !== 1 ? 's' : ''} remaining`;
    } else {
      timeRemaining = `${remainingHours} hour${remainingHours !== 1 ? 's' : ''} remaining`;
    }
  } else if (diffDays === 1) {
    timeRemaining = '1 day remaining';
  } else {
    timeRemaining = `${diffDays} days remaining`;
  }

  return {
    timeRemaining,
    urgencyLevel,
    daysRemaining: diffDays,
    hoursRemaining: remainingHours,
    isExpired: false,
  };
}

export function useAutoDeleteCountdown(autoDeleteAt: string | null | undefined): AutoDeleteCountdownResult {
  const [result, setResult] = useState<AutoDeleteCountdownResult>(() => {
    if (!autoDeleteAt) {
      return {
        timeRemaining: '',
        urgencyLevel: 'none',
        daysRemaining: Infinity,
        hoursRemaining: Infinity,
        isExpired: false,
      };
    }
    return calculateCountdown(autoDeleteAt);
  });

  useEffect(() => {
    if (!autoDeleteAt) {
      setResult({
        timeRemaining: '',
        urgencyLevel: 'none',
        daysRemaining: Infinity,
        hoursRemaining: Infinity,
        isExpired: false,
      });
      return;
    }

    const update = () => setResult(calculateCountdown(autoDeleteAt));
    update();

    // Update every minute for normal countdowns, every 10 seconds for critical
    const interval = setInterval(update, 60000);

    return () => clearInterval(interval);
  }, [autoDeleteAt]);

  return result;
}

export function useEarliestAutoDelete(autoDeleteDates: (string | null | undefined)[]): AutoDeleteCountdownResult {
  const earliestDate = useMemo(() => {
    const validDates = autoDeleteDates.filter(Boolean) as string[];
    if (validDates.length === 0) return null;
    return validDates.sort()[0];
  }, [autoDeleteDates]);

  return useAutoDeleteCountdown(earliestDate);
}

export function getUrgencyStyles(urgencyLevel: UrgencyLevel): {
  bg: string;
  border: string;
  text: string;
  icon: string;
} {
  switch (urgencyLevel) {
    case 'critical':
      return {
        bg: 'bg-red-50',
        border: 'border-red-200',
        text: 'text-red-800',
        icon: 'text-red-600',
      };
    case 'warning':
      return {
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        text: 'text-amber-800',
        icon: 'text-amber-600',
      };
    case 'normal':
    default:
      return {
        bg: 'bg-gray-50',
        border: 'border-gray-200',
        text: 'text-gray-800',
        icon: 'text-gray-500',
      };
  }
}
