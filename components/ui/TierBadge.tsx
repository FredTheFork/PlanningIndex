'use client';

import { Star, Briefcase, Crown, RefreshCw } from 'lucide-react';
import { ServiceTier } from '@/lib/services/service-catalog-types';
import { getTierStyle, SUBSCRIPTION_STYLE } from '@/lib/tier-styles';

interface TierBadgeProps {
  tier: ServiceTier;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

export function TierBadge({ tier, size = 'md', showIcon = true, className = '' }: TierBadgeProps) {
  const style = getTierStyle(tier);
  const Icon = style.icon;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-2.5 py-1 text-sm gap-1.5',
    lg: 'px-3 py-1.5 text-base gap-2',
  };

  const iconSizes = {
    sm: 10,
    md: 12,
    lg: 14,
  };

  return (
    <span
      className={`inline-flex items-center rounded font-inter font-medium ${style.bgLight} ${style.textClass} ${sizeClasses[size]} ${className}`}
    >
      {showIcon && <Icon size={iconSizes[size]} />}
      {style.label}
    </span>
  );
}

interface SubscriptionBadgeProps {
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

export function SubscriptionBadge({ size = 'md', showIcon = true, className = '' }: SubscriptionBadgeProps) {
  const Icon = SUBSCRIPTION_STYLE.icon;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-2.5 py-1 text-sm gap-1.5',
    lg: 'px-3 py-1.5 text-base gap-2',
  };

  const iconSizes = {
    sm: 10,
    md: 12,
    lg: 14,
  };

  return (
    <span
      className={`inline-flex items-center rounded font-inter font-medium ${SUBSCRIPTION_STYLE.bgLight} ${SUBSCRIPTION_STYLE.textClass} ${sizeClasses[size]} ${className}`}
    >
      {showIcon && <Icon size={iconSizes[size]} />}
      {SUBSCRIPTION_STYLE.label}
    </span>
  );
}

interface ServiceBadgeProps {
  serviceName: string;
  tier: ServiceTier | null;
  isSubscription?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

export function ServiceBadge({
  serviceName,
  tier,
  isSubscription = false,
  size = 'sm',
  showIcon = true,
  className = '',
}: ServiceBadgeProps) {
  if (isSubscription) {
    return (
      <SubscriptionBadge size={size} showIcon={showIcon} className={className} />
    );
  }

  if (!tier) {
    return (
      <span className={`inline-flex items-center rounded font-inter font-medium bg-gray-100 text-gray-700 px-2 py-0.5 text-xs ${className}`}>
        {serviceName}
      </span>
    );
  }

  const style = getTierStyle(tier);
  const Icon = style.icon;

  const sizeClasses = {
    sm: 'px-1.5 py-0.5 text-xs gap-1',
    md: 'px-2.5 py-1 text-sm gap-1.5',
    lg: 'px-3 py-1.5 text-base gap-2',
  };

  const iconSizes = {
    sm: 9,
    md: 12,
    lg: 14,
  };

  return (
    <span
      className={`inline-flex items-center rounded font-inter font-medium ${style.bgLight} ${style.textClass} ${sizeClasses[size]} ${className}`}
    >
      {showIcon && <Icon size={iconSizes[size]} />}
      {serviceName.split(' ')[0]}
    </span>
  );
}
