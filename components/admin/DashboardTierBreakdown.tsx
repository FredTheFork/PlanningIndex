'use client';

import { Layers } from 'lucide-react';
import type { DashboardStats } from '@/lib/admin/dashboard-queries';

interface DashboardTierBreakdownProps {
  stats: DashboardStats;
  onTierClick?: (tier: string) => void;
}

export default function DashboardTierBreakdown({ stats, onTierClick }: DashboardTierBreakdownProps) {
  const tiers = [
    {
      key: 'foundation',
      label: 'Foundation',
      count: stats.foundationCount,
      bg: 'bg-blue-50',
      textColor: 'text-blue-700',
      iconColor: 'bg-blue-500',
      borderColor: 'border-blue-200',
    },
    {
      key: 'operations',
      label: 'Operations',
      count: stats.operationsCount,
      bg: 'bg-amber-50',
      textColor: 'text-amber-700',
      iconColor: 'bg-amber-500',
      borderColor: 'border-amber-200',
    },
    {
      key: 'industry',
      label: 'Industry',
      count: stats.industryCount,
      bg: 'bg-teal-50',
      textColor: 'text-teal-700',
      iconColor: 'bg-teal-500',
      borderColor: 'border-teal-200',
    },
  ] as const;

  const total = stats.totalClients || 1;

  return (
    <div className="grid grid-cols-3 gap-3">
      {tiers.map((tier) => {
        const percentage = Math.round((tier.count / total) * 100);

        return (
          <button
            key={tier.key}
            onClick={() => onTierClick?.(tier.key)}
            className={`bg-white rounded-lg border border-gray-200 p-3 text-left transition-all hover:shadow-md hover:border-gray-300`}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className={`${tier.iconColor} rounded p-1`}>
                <Layers size={14} className="text-white" />
              </div>
              <span className="font-inter text-gray-600 text-xs">{tier.label}</span>
            </div>
            <div className="flex items-end gap-2">
              <span className={`font-inter font-bold text-lg ${tier.textColor}`}>{tier.count}</span>
              <span className="font-inter text-gray-400 text-xs mb-0.5">{percentage}%</span>
            </div>
            {/* Mini progress bar */}
            <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full ${tier.iconColor} transition-all`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </button>
        );
      })}
    </div>
  );
}
