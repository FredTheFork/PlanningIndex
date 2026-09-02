import { Phone, FileText, Users, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui';
import type { MockPriority } from '@/lib/mock/workspace';

const priorityConfig: Record<
  MockPriority['type'],
  { icon: typeof Phone; bg: string; text: string }
> = {
  'follow-up': { icon: Phone, bg: 'bg-sky-50', text: 'text-sky-700' },
  proposal: { icon: FileText, bg: 'bg-violet-50', text: 'text-violet-700' },
  lead: { icon: Users, bg: 'bg-emerald-50', text: 'text-emerald-700' },
};

const urgencyConfig: Record<
  MockPriority['urgency'],
  { label: string; color: string }
> = {
  today: { label: 'Today', color: 'text-danger-600' },
  tomorrow: { label: 'Tomorrow', color: 'text-warning-600' },
  'this-week': { label: 'This week', color: 'text-primary-500' },
};

interface TodaysPrioritiesProps {
  priorities: MockPriority[];
}

export function TodaysPriorities({ priorities }: TodaysPrioritiesProps) {
  if (priorities.length === 0) {
    return (
      <Card padding="md">
        <div className="flex items-center gap-3 py-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 shrink-0">
            <AlertCircle size={20} className="text-primary-400" />
          </div>
          <div>
            <p className="font-sans font-medium text-primary-900 text-sm">No priorities today</p>
            <p className="font-sans text-xs text-primary-500 mt-0.5">
              You&apos;re all caught up. Search for new applications to find your next opportunity.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card padding="none" className="overflow-hidden">
      {priorities.map((priority, i) => {
        const config = priorityConfig[priority.type];
        const Icon = config.icon;
        const urgency = urgencyConfig[priority.urgency];
        return (
          <div
            key={priority.id}
            className={`flex items-center gap-4 px-5 py-4 ${
              i < priorities.length - 1 ? 'border-b border-primary-100' : ''
            } hover:bg-primary-50/50 transition-colors`}
          >
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${config.bg} shrink-0`}>
              <Icon size={18} className={config.text} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-sans font-medium text-primary-900 text-sm truncate">{priority.title}</p>
              <p className="font-sans text-xs text-primary-500 mt-0.5 truncate">{priority.detail}</p>
            </div>
            <div className="flex flex-col items-end gap-1 shrink-0">
              <span className={`font-sans text-xs font-semibold ${urgency.color}`}>{urgency.label}</span>
              <span className="font-sans text-xs text-primary-400">{priority.dueLabel}</span>
            </div>
          </div>
        );
      })}
    </Card>
  );
}
