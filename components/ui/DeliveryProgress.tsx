'use client';

import { CheckCircle2, Clock, Loader2 } from 'lucide-react';
import { ServiceTier } from '@/lib/services/service-catalog-types';
import { getTierStyle } from '@/lib/tier-styles';

interface DeliveryProgressProps {
  current: number;
  total: number;
  tier?: ServiceTier;
  showLabels?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function DeliveryProgress({
  current,
  total,
  tier,
  showLabels = true,
  size = 'md',
  className = '',
}: DeliveryProgressProps) {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;
  const isComplete = current >= total && total > 0;
  const isInProgress = current > 0 && !isComplete;

  const style = tier ? getTierStyle(tier) : null;
  const accentColor = style?.color || '#1B3F7A';

  // Progress bar color based on percentage
  let progressColor = accentColor;
  if (isComplete) {
    progressColor = '#22c55e'; // Green for complete
  }

  const heightClasses = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div className={className}>
      {showLabels && (
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            {isComplete ? (
              <CheckCircle2 size={size === 'sm' ? 12 : size === 'md' ? 14 : 16} className="text-green-600" />
            ) : isInProgress ? (
              <Loader2 size={size === 'sm' ? 12 : size === 'md' ? 14 : 16} className="animate-spin" style={{ color: accentColor }} />
            ) : (
              <Clock size={size === 'sm' ? 12 : size === 'md' ? 14 : 16} className="text-gray-400" />
            )}
            <span className={`font-inter ${textSizes[size]} text-gray-600`}>
              {isComplete ? 'Complete' : isInProgress ? 'In Progress' : 'Not Started'}
            </span>
          </div>
          <span className={`font-inter font-medium ${textSizes[size]} text-gray-700`}>
            {current} of {total} ({percentage}%)
          </span>
        </div>
      )}
      <div className={`w-full ${heightClasses[size]} bg-gray-100 rounded-full overflow-hidden`}>
        <div
          className={`h-full transition-all duration-500 ease-out rounded-full ${isComplete ? 'bg-green-500' : ''}`}
          style={{
            width: `${percentage}%`,
            backgroundColor: isComplete ? undefined : progressColor,
          }}
        />
      </div>
    </div>
  );
}

interface DeliveryStatusBadgeProps {
  current: number;
  total: number;
  tier?: ServiceTier;
  size?: 'sm' | 'md' | 'lg';
}

export function DeliveryStatusBadge({ current, total, tier, size = 'sm' }: DeliveryStatusBadgeProps) {
  const isComplete = current >= total && total > 0;
  const isInProgress = current > 0 && !isComplete;

  const style = tier ? getTierStyle(tier) : null;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  };

  if (isComplete) {
    return (
      <span className={`inline-flex items-center gap-1 rounded ${sizeClasses[size]} bg-green-50 text-green-700 font-inter font-medium`}>
        <CheckCircle2 size={size === 'sm' ? 10 : size === 'md' ? 12 : 14} />
        All delivered
      </span>
    );
  }

  if (isInProgress) {
    return (
      <span
        className={`inline-flex items-center gap-1 rounded ${sizeClasses[size]} font-inter font-medium`}
        style={{
          backgroundColor: style ? `${style.color}15` : '#1B3F7A15',
          color: style?.color || '#1B3F7A',
        }}
      >
        <Clock size={size === 'sm' ? 10 : size === 'md' ? 12 : 14} />
        {current}/{total} ready
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1 rounded ${sizeClasses[size]} bg-gray-100 text-gray-500 font-inter font-medium`}>
      <Clock size={size === 'sm' ? 10 : size === 'md' ? 12 : 14} />
      Pending
    </span>
  );
}

interface DeliveryCountProps {
  count: number;
  label?: string;
  tier?: ServiceTier;
}

export function DeliveryCount({ count, label = 'documents', tier }: DeliveryCountProps) {
  const style = tier ? getTierStyle(tier) : null;

  return (
    <div className="text-center">
      <div
        className="font-inter font-bold text-2xl"
        style={{ color: style?.color || '#1B3F7A' }}
      >
        {count}
      </div>
      <div className="font-inter text-gray-500 text-xs flex items-center justify-center gap-1">
        {count === 1 ? label.slice(0, -1) : label}
      </div>
    </div>
  );
}
