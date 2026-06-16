'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import {
  Layers, Package, CheckCircle2, ArrowUpCircle, Sparkles,
  Briefcase, Building2, Zap, ChevronRight
} from 'lucide-react';
import {
  getServiceById,
  getHighestTier,
  getServiceGroups,
  getServicesInGroup,
  getRecommendedBundle,
  type ServiceTier,
  type IndustryCategory,
} from '@/lib/services/service-catalog';

interface TierBundleTabProps {
  userId: string;
  data: any;
  refreshData: () => void;
}

export default function TierBundleTab({ userId, data, refreshData }: TierBundleTabProps) {
  const purchasedServices = data.purchasedServices || [];
  const purchasedServiceIds = purchasedServices.map((ps: any) => ps.service_id);

  // Compute highest tier
  const highestTier = getHighestTier(purchasedServiceIds);

  // Find which industry pack they purchased (if any)
  const industryService = purchasedServices.find((ps: any) => {
    const svc = getServiceById(ps.service_id);
    return svc?.tier === 'industry';
  });
  const primaryIndustry: IndustryCategory | null = industryService
    ? getServiceById(industryService.service_id)?.industry ?? null
    : null;

  // Find matching service groups/bundles
  const serviceGroups = getServiceGroups();
  const matchingGroups = serviceGroups
    .map(group => {
      const ownedInGroup = group.serviceIds.filter(id => purchasedServiceIds.includes(id));
      const missingFromGroup = group.serviceIds.filter(id => !purchasedServiceIds.includes(id));
      return {
        ...group,
        ownedCount: ownedInGroup.length,
        totalCount: group.serviceIds.length,
        ownedServices: ownedInGroup.map(id => getServiceById(id)).filter(Boolean),
        missingServices: missingFromGroup.map(id => getServiceById(id)).filter(Boolean),
        completionPercent: Math.round((ownedInGroup.length / group.serviceIds.length) * 100),
      };
    })
    .filter(group => group.ownedCount > 0)
    .sort((a, b) => b.completionPercent - a.completionPercent);

  // Get upgrade recommendation
  const upgradeRecommendation = getRecommendedBundle(purchasedServiceIds);

  // Compute tier stats
  const tierStats = {
    foundation: purchasedServiceIds.filter((id: string) => getServiceById(id)?.tier === 'foundation').length,
    operations: purchasedServiceIds.filter((id: string) => getServiceById(id)?.tier === 'operations').length,
    industry: purchasedServiceIds.filter((id: string) => getServiceById(id)?.tier === 'industry').length,
  };

  // Check subscription status
  const hasMonthlyCarePlan = purchasedServiceIds.includes('monthly_care_plan');
  const hasQuarterlyRefresh = purchasedServiceIds.includes('quarterly_refresh');
  const subscriptionService = purchasedServices.find((ps: any) =>
    ps.service_id === 'monthly_care_plan' || ps.service_id === 'quarterly_refresh'
  );

  return (
    <div className="space-y-6">
      {/* Current Tier Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-inter font-bold text-[#1B3F7A] text-lg mb-1">
              Client Tier
            </h3>
            <p className="font-inter text-gray-500 text-sm">
              Highest service tier purchased
            </p>
          </div>
          <TierBadge tier={highestTier} />
        </div>

        {/* Tier breakdown */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
          <TierStat
            label="Foundation"
            count={tierStats.foundation}
            active={highestTier === 'foundation'}
            color="blue"
          />
          <TierStat
            label="Operations"
            count={tierStats.operations}
            active={highestTier === 'operations'}
            color="amber"
          />
          <TierStat
            label="Industry"
            count={tierStats.industry}
            active={highestTier === 'industry'}
            color="teal"
          />
        </div>
      </div>

      {/* Industry Classification */}
      {primaryIndustry && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-teal-50 rounded-lg p-2.5">
                <Building2 size={20} className="text-teal-600" />
              </div>
              <div>
                <h3 className="font-inter font-bold text-[#1B3F7A] text-lg mb-1">
                  Industry Specialization
                </h3>
                <p className="font-inter text-gray-500 text-sm">
                  Primary industry focus based on purchased packs
                </p>
              </div>
            </div>
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 text-teal-700 rounded-lg font-inter font-semibold text-sm">
              {primaryIndustry.charAt(0).toUpperCase() + primaryIndustry.slice(1)}
            </span>
          </div>
        </div>
      )}

      {/* Subscription Status */}
      {subscriptionService && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-50 rounded-lg p-2.5">
                <Zap size={20} className="text-emerald-600" />
              </div>
              <div>
                <h3 className="font-inter font-bold text-[#1B3F7A] text-lg mb-1">
                  Care Plan Active
                </h3>
                <p className="font-inter text-gray-500 text-sm">
                  {hasMonthlyCarePlan
                    ? 'Monthly document updates and ongoing support'
                    : 'Quarterly document refresh subscription'}
                </p>
              </div>
            </div>
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg font-inter font-semibold text-sm">
              <CheckCircle2 size={14} />
              {hasMonthlyCarePlan ? 'Monthly' : 'Quarterly'}
            </span>
          </div>
        </div>
      )}

      {/* Purchased Bundles */}
      {matchingGroups.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-inter font-bold text-[#1B3F7A] text-lg mb-4">
            Bundle Groups
          </h3>
          <div className="space-y-4">
            {matchingGroups.map(group => (
              <BundleGroupCard
                key={group.id}
                group={group}
                purchasedServiceIds={purchasedServiceIds}
              />
            ))}
          </div>
        </div>
      )}

      {/* Upgrade Recommendations */}
      {upgradeRecommendation && (
        <div className="bg-gradient-to-br from-[#1B3F7A] to-[#2C68C4] rounded-lg p-6 text-white">
          <div className="flex items-start gap-4">
            <div className="bg-white/20 rounded-lg p-2.5 shrink-0">
              <Sparkles size={24} className="text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-inter font-bold text-lg mb-1">
                Recommended Upgrade
              </h3>
              <p className="font-inter text-white/80 text-sm mb-3">
                {upgradeRecommendation.group.name} — Save {upgradeRecommendation.group.discountPercent}%
              </p>
              <p className="font-inter text-white/70 text-xs mb-4">
                {upgradeRecommendation.group.description}
              </p>

              <div className="space-y-2">
                <p className="font-inter text-white/90 text-xs font-semibold">
                  Services to add ({upgradeRecommendation.newServiceIds.length}):
                </p>
                <div className="flex flex-wrap gap-2">
                  {upgradeRecommendation.newServiceIds.map(serviceId => {
                    const service = getServiceById(serviceId);
                    return (
                      <span
                        key={serviceId}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-white/10 rounded text-xs font-inter text-white"
                      >
                        <Package size={10} />
                        {service?.name ?? serviceId}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* No Services Purchased */}
      {purchasedServiceIds.length === 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <Package size={48} className="text-gray-300 mx-auto mb-4" />
          <h4 className="font-inter font-semibold text-gray-900 text-lg mb-2">
            No Services Purchased
          </h4>
          <p className="font-inter text-gray-600 text-sm">
            This client has not purchased any service packs yet.
          </p>
        </div>
      )}
    </div>
  );
}

function TierBadge({ tier }: { tier: ServiceTier }) {
  const config: Record<ServiceTier, { label: string; color: string; bg: string }> = {
    foundation: { label: 'Foundation', color: 'text-blue-700', bg: 'bg-blue-50' },
    operations: { label: 'Operations', color: 'text-amber-700', bg: 'bg-amber-50' },
    industry: { label: 'Industry', color: 'text-teal-700', bg: 'bg-teal-50' },
  };
  const c = config[tier];
  return (
    <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-inter font-semibold text-sm ${c.color} ${c.bg}`}>
      <Layers size={16} />
      {c.label}
    </span>
  );
}

function TierStat({ label, count, active, color }: {
  label: string;
  count: number;
  active: boolean;
  color: 'blue' | 'amber' | 'teal';
}) {
  const colorMap = {
    blue: active ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200',
    amber: active ? 'bg-amber-50 border-amber-200' : 'bg-gray-50 border-gray-200',
    teal: active ? 'bg-teal-50 border-teal-200' : 'bg-gray-50 border-gray-200',
  };
  const textColorMap = {
    blue: active ? 'text-blue-700' : 'text-gray-500',
    amber: active ? 'text-amber-700' : 'text-gray-500',
    teal: active ? 'text-teal-700' : 'text-gray-500',
  };

  return (
    <div className={`rounded-lg border p-3 text-center ${colorMap[color]}`}>
      <p className={`font-inter font-bold text-xl ${textColorMap[color]}`}>
        {count}
      </p>
      <p className={`font-inter text-xs ${textColorMap[color]}`}>
        {label}
      </p>
    </div>
  );
}

function BundleGroupCard({ group, purchasedServiceIds }: {
  group: any;
  purchasedServiceIds: string[];
}) {
  return (
    <div className="bg-[#FAFBFC] rounded-lg border border-gray-200 p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-inter font-semibold text-gray-900 text-sm">
            {group.name}
          </h4>
          <p className="font-inter text-gray-500 text-xs mt-0.5">
            {group.ownedCount}/{group.totalCount} services owned
          </p>
        </div>
        <div className="flex items-center gap-2">
          {group.badge && (
            <span className="px-2 py-0.5 bg-[#1B3F7A] text-white rounded text-xs font-inter font-medium">
              {group.badge}
            </span>
          )}
          <span className="px-2 py-0.5 bg-green-50 text-green-700 rounded text-xs font-inter font-medium">
            {group.discountPercent}% discount
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden mb-3">
        <div
          className="h-full bg-[#1B3F7A] rounded-full transition-all"
          style={{ width: `${group.completionPercent}%` }}
        />
      </div>

      {/* Services */}
      <div className="flex flex-wrap gap-1.5">
        {group.serviceIds.map((serviceId: string) => {
          const service = getServiceById(serviceId);
          const owned = purchasedServiceIds.includes(serviceId);
          return (
            <span
              key={serviceId}
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-inter ${
                owned
                  ? 'bg-[#1B3F7A]/10 text-[#1B3F7A] font-medium'
                  : 'bg-gray-100 text-gray-400'
              }`}
            >
              {owned ? <CheckCircle2 size={10} /> : <Package size={10} />}
              {service?.name?.replace(' Pack', '').replace(' Starter', '') ?? serviceId}
            </span>
          );
        })}
      </div>
    </div>
  );
}
