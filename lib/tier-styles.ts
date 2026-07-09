import { Video as LucideIcon, Star, Briefcase, Crown, RefreshCw, Package } from 'lucide-react';
import { ServiceTier } from './services/service-catalog-types';

export interface TierStyleConfig {
  color: string;
  bgLight: string;
  bgClass: string;
  textClass: string;
  ringClass: string;
  icon: LucideIcon;
  label: string;
}

export const TIER_STYLES: Record<ServiceTier, TierStyleConfig> = {
  foundation: {
    color: '#1B3F7A',
    bgLight: 'bg-[#1B3F7A]/5',
    bgClass: 'bg-[#1B3F7A]',
    textClass: 'text-[#1B3F7A]',
    ringClass: 'ring-[#1B3F7A]',
    icon: Star,
    label: 'Foundation',
  },
  operations: {
    color: '#2C68C4',
    bgLight: 'bg-[#2C68C4]/5',
    bgClass: 'bg-[#2C68C4]',
    textClass: 'text-[#2C68C4]',
    ringClass: 'ring-[#2C68C4]',
    icon: Briefcase,
    label: 'Operations',
  },
  industry: {
    color: '#F59E0B',
    bgLight: 'bg-[#F59E0B]/5',
    bgClass: 'bg-[#F59E0B]',
    textClass: 'text-[#F59E0B]',
    ringClass: 'ring-[#F59E0B]',
    icon: Crown,
    label: 'Industry',
  },
};

export const SUBSCRIPTION_STYLE: TierStyleConfig = {
  color: '#0D9488',
  bgLight: 'bg-teal-50',
  bgClass: 'bg-teal-600',
  textClass: 'text-teal-700',
  ringClass: 'ring-teal-600',
  icon: RefreshCw,
  label: 'Subscription',
};

export const SERVICE_STYLES = {
  tier: TIER_STYLES,
  subscription: SUBSCRIPTION_STYLE,
};

export function getTierStyle(tier: ServiceTier): TierStyleConfig {
  return TIER_STYLES[tier];
}

export function getServiceStyleIcon(isSubscription: boolean): LucideIcon {
  return isSubscription ? RefreshCw : Package;
}

export function getServiceStyleClasses(isSubscription: boolean, tier?: ServiceTier | null): { bg: string; text: string } {
  if (isSubscription) {
    return { bg: SUBSCRIPTION_STYLE.bgLight, text: SUBSCRIPTION_STYLE.textClass };
  }
  if (tier) {
    return { bg: TIER_STYLES[tier].bgLight, text: TIER_STYLES[tier].textClass };
  }
  return { bg: 'bg-gray-100', text: 'text-gray-700' };
}
