'use client';

import { Users, Inbox, Clock, CheckCircle2, RefreshCw, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
import type { DashboardStats } from '@/lib/admin/dashboard-queries';

interface DashboardSummaryCardsProps {
  stats: DashboardStats;
  onCardClick?: (filterType: string, value: string) => void;
}

export default function DashboardSummaryCards({ stats, onCardClick }: DashboardSummaryCardsProps) {
  const cards = [
    {
      key: 'total',
      icon: Users,
      label: 'Total Clients',
      value: stats.totalClients,
      color: 'navy',
      filterType: null,
    },
    {
      key: 'intakePending',
      icon: Inbox,
      label: 'Intake Pending',
      value: stats.intakePending,
      color: 'amber',
      isUrgent: stats.intakePending > 0,
      filterType: 'intakeStatus',
      filterValue: 'pending',
    },
    {
      key: 'briefsNotGenerated',
      icon: AlertTriangle,
      label: 'Briefs Not Generated',
      value: stats.briefsNotGenerated,
      color: 'red',
      isUrgent: stats.briefsNotGenerated > 0,
      filterType: 'briefStatus',
      filterValue: 'none',
    },
    {
      key: 'deliveriesInProgress',
      icon: Clock,
      label: 'In Progress',
      value: stats.deliveriesInProgress,
      color: 'medium-blue',
      filterType: 'deliveryStatus',
      filterValue: 'in_progress',
    },
    {
      key: 'deliveriesDelivered',
      icon: CheckCircle2,
      label: 'Delivered',
      value: stats.deliveriesDelivered,
      color: 'success',
      filterType: 'deliveryStatus',
      filterValue: 'delivered',
    },
    {
      key: 'activeSubscriptions',
      icon: RefreshCw,
      label: 'Subscriptions',
      value: stats.activeSubscriptions,
      color: 'teal',
      filterType: 'subscription',
      filterValue: 'with_subscription',
    },
  ];

  const colorMap: Record<string, string> = {
    navy: 'bg-[#1B3F7A]',
    'medium-blue': 'bg-[#2C68C4]',
    blue: 'bg-blue-500',
    amber: 'bg-amber-500',
    teal: 'bg-teal-500',
    success: 'bg-green-600',
    red: 'bg-red-500',
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {cards.map((card) => {
        const Icon = card.icon;
        const bgColor = colorMap[card.color] || 'bg-[#1B3F7A]';
        const isClickable = !!card.filterType && !!onCardClick;

        return (
          <button
            key={card.key}
            onClick={() => isClickable && onCardClick(card.filterType!, card.filterValue!)}
            disabled={!isClickable}
            className={`bg-white rounded-lg border border-gray-200 p-3 text-left transition-all ${
              isClickable ? 'hover:shadow-md hover:border-gray-300 cursor-pointer' : 'cursor-default'
            } ${card.isUrgent ? 'ring-2 ring-red-200' : ''}`}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <div className={`${bgColor} rounded p-1`}>
                <Icon size={14} className="text-white" />
              </div>
              {card.isUrgent && <AlertTriangle size={12} className="text-red-500" />}
            </div>
            <div className="font-inter font-bold text-[#1B3F7A] text-lg">{card.value}</div>
            <div className="font-inter text-gray-600 text-xs">{card.label}</div>
          </button>
        );
      })}
    </div>
  );
}
