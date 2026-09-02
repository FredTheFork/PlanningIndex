import type { LucideIcon } from 'lucide-react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card } from '@/components/ui';

interface StatCardProps {
  icon: LucideIcon;
  value: number;
  label: string;
  trend: string;
  trendUp: boolean;
}

export function StatCard({ icon: Icon, value, label, trend, trendUp }: StatCardProps) {
  return (
    <Card padding="md" className="h-full">
      <div className="flex items-start justify-between mb-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50">
          <Icon size={20} className="text-primary-700" />
        </div>
        <span
          className={`inline-flex items-center gap-1 font-sans text-xs font-semibold ${
            trendUp ? 'text-emerald-600' : 'text-danger-600'
          }`}
        >
          {trendUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />} {trend}
        </span>
      </div>
      <p className="font-display font-bold text-primary-900 text-3xl">{value}</p>
      <p className="font-sans text-primary-500 text-sm mt-0.5">{label}</p>
    </Card>
  );
}
