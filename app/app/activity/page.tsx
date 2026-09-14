'use client';

import { useState, useMemo } from 'react';
import { Activity as ActivityIcon, Plus, FileText, Mail, Check, Phone, Calendar, Send, Package } from 'lucide-react';
import { Card, EmptyState } from '@/components/ui';
import { useLeads } from '@/components/workspace/LeadsContext';
import type { LeadActivity, ActivityIcon as ActIcon } from '@/lib/mock/lead-activity';

const iconMap: Record<ActIcon, typeof Plus> = {
  plus: Plus,
  file: FileText,
  mail: Mail,
  check: Check,
  phone: Phone,
  calendar: Calendar,
  send: Send,
  package: Package,
};

const iconBgMap: Record<ActIcon, string> = {
  plus: 'bg-sky-100 text-sky-700',
  file: 'bg-primary-100 text-primary-700',
  mail: 'bg-violet-100 text-violet-700',
  check: 'bg-emerald-100 text-emerald-700',
  phone: 'bg-amber-100 text-amber-700',
  calendar: 'bg-sky-100 text-sky-700',
  send: 'bg-violet-100 text-violet-700',
  package: 'bg-emerald-100 text-emerald-700',
};

type FilterPill = 'all' | 'leads' | 'proposals' | 'status' | 'notes';

const filterPills: { value: FilterPill; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'leads', label: 'Leads' },
  { value: 'proposals', label: 'Proposals' },
  { value: 'status', label: 'Status Changes' },
  { value: 'notes', label: 'Notes' },
];

function matchesFilter(activity: LeadActivity, filter: FilterPill): boolean {
  switch (filter) {
    case 'all':
      return true;
    case 'leads':
      return ['lead_added', 'application_discovered', 'follow_up_scheduled', 'follow_up_completed', 'contact_updated'].includes(activity.type);
    case 'proposals':
      return ['proposal_created', 'proposal_sent', 'proposal_delivered'].includes(activity.type);
    case 'status':
      return activity.type === 'status_changed';
    case 'notes':
      return activity.type === 'note_added';
    default:
      return true;
  }
}

function getDateGroup(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);

  if (date >= today) return 'Today';
  if (date >= yesterday) return 'Yesterday';
  if (date >= weekAgo) return 'This Week';
  return 'Older';
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function ActivityPage() {
  const { activities, leads } = useLeads();
  const [activeFilter, setActiveFilter] = useState<FilterPill>('all');

  const filtered = useMemo(() => {
    return activities
      .filter((a) => matchesFilter(a, activeFilter))
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [activities, activeFilter]);

  const grouped = useMemo(() => {
    const groups: Record<string, LeadActivity[]> = {};
    filtered.forEach((activity) => {
      const group = getDateGroup(activity.timestamp);
      if (!groups[group]) groups[group] = [];
      groups[group].push(activity);
    });
    return groups;
  }, [filtered]);

  const groupOrder = ['Today', 'Yesterday', 'This Week', 'Older'];

  const getLeadAddress = (leadId: string): string => {
    const lead = leads.find((l) => l.id === leadId);
    return lead ? lead.propertyAddress : '';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-bold text-primary-900 text-h2">Activity</h1>
        <p className="font-sans text-primary-500 text-sm mt-1">
          A timeline of everything happening across your workspace.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {filterPills.map((pill) => {
          const count = activities.filter((a) => matchesFilter(a, pill.value)).length;
          return (
            <button
              key={pill.value}
              onClick={() => setActiveFilter(pill.value)}
              className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 font-sans text-sm font-semibold transition-colors ${
                activeFilter === pill.value
                  ? 'bg-primary-900 text-white'
                  : 'border border-primary-200 bg-white text-primary-600 hover:border-primary-300 hover:text-primary-900'
              }`}
            >
              {pill.label}
              <span className={`inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs font-bold ${
                activeFilter === pill.value ? 'bg-white/20 text-white' : 'bg-primary-100 text-primary-500'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-primary-200 bg-white">
          <EmptyState
            icon={ActivityIcon}
            title="No activity found"
            description="No activities match this filter. Try selecting a different filter to see more activity."
          />
        </div>
      ) : (
        <div className="space-y-8">
          {groupOrder.map((groupName) => {
            const groupActivities = grouped[groupName];
            if (!groupActivities || groupActivities.length === 0) return null;
            return (
              <div key={groupName}>
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="font-sans font-semibold text-primary-900 text-sm">{groupName}</h2>
                  <span className="font-sans text-xs text-primary-400">{groupActivities.length} {groupActivities.length === 1 ? 'event' : 'events'}</span>
                  <div className="flex-1 h-px bg-primary-200" />
                </div>
                <Card padding="none" className="overflow-hidden">
                  {groupActivities.map((activity, i) => {
                    const Icon = iconMap[activity.icon] || Plus;
                    const address = getLeadAddress(activity.leadId);
                    return (
                      <div
                        key={activity.id}
                        className={`flex items-start gap-4 px-5 py-4 ${
                          i < groupActivities.length - 1 ? 'border-b border-primary-100' : ''
                        } hover:bg-primary-50/50 transition-colors`}
                      >
                        <div className={`relative flex h-10 w-10 items-center justify-center rounded-xl shrink-0 ${iconBgMap[activity.icon] || 'bg-primary-100 text-primary-700'}`}>
                          <Icon size={16} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-sans font-semibold text-primary-900 text-sm">{activity.title}</p>
                          <p className="font-sans text-primary-500 text-sm leading-relaxed mt-0.5">{activity.description}</p>
                          {address && (
                            <p className="font-sans text-xs text-primary-400 mt-1">{address}</p>
                          )}
                        </div>
                        <div className="shrink-0 text-right">
                          <p className="font-sans text-xs text-primary-400">{formatTime(activity.timestamp)}</p>
                        </div>
                      </div>
                    );
                  })}
                </Card>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
