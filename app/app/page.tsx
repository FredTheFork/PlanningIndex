'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Search,
  Users,
  FileText,
  Calendar,
  Plus,
  Mail,
  Check,
  Phone,
  ArrowRight,
  TrendingUp,
  MapPin,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Card, Badge, Button } from '@/components/ui';
import {
  mockStats,
  mockRecentApplications,
  mockPipelineStages,
  mockFollowUps,
  mockActivity,
} from '@/lib/mock/workspace';
import type { MockStat, MockApplication, MockFollowUp, MockActivityItem } from '@/lib/mock/workspace';

const statIcons: Record<MockStat['icon'], typeof Search> = {
  search: Search,
  users: Users,
  file: FileText,
  calendar: Calendar,
};

const activityIcons: Record<MockActivityItem['icon'], typeof Plus> = {
  plus: Plus,
  mail: Mail,
  check: Check,
  phone: Phone,
  file: FileText,
};

const statusBadgeVariant = (status: string): 'success' | 'warning' | 'danger' | 'neutral' => {
  if (status === 'Approved') return 'success';
  if (status === 'Pending') return 'warning';
  if (status === 'Refused') return 'danger';
  return 'neutral';
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [companyName, setCompanyName] = useState('your company');
  const [hour, setHour] = useState(9);

  useEffect(() => {
    const now = new Date();
    setHour(now.getHours());
  }, []);

  useEffect(() => {
    if (user?.id) {
      import('@/lib/supabase/client').then(({ supabase }) => {
        supabase
          .from('profiles')
          .select('company_name')
          .eq('id', user.id)
          .maybeSingle()
          .then(({ data }) => {
            if (data?.company_name) setCompanyName(data.company_name);
          });
      });
    }
  }, [user]);

  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-bold text-primary-900 text-h2">
          {greeting}, {companyName}
        </h1>
        <p className="font-sans text-primary-500 text-sm mt-1">
          Here&apos;s what&apos;s happening with your pipeline today.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {mockStats.map((stat) => {
          const Icon = statIcons[stat.icon];
          return (
            <Card key={stat.label} padding="md" className="h-full">
              <div className="flex items-start justify-between mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50">
                  <Icon size={20} className="text-primary-700" />
                </div>
                <span className="inline-flex items-center gap-1 font-sans text-xs font-semibold text-emerald-600">
                  <TrendingUp size={12} /> {stat.trend}
                </span>
              </div>
              <p className="font-display font-bold text-primary-900 text-3xl">{stat.value}</p>
              <p className="font-sans text-primary-500 text-sm mt-0.5">{stat.label}</p>
            </Card>
          );
        })}
      </div>

      {/* Recent opportunities + Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6">
        {/* Recent opportunities */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-sans font-semibold text-primary-900 text-base">Recent opportunities</h2>
            <Link href="/app" className="font-sans text-sm font-medium text-accent-600 hover:text-accent-700 transition-colors">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {mockRecentApplications.map((app: MockApplication) => (
              <Card key={app.id} padding="md" className="hover:shadow-card-hover transition-shadow">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-sans font-semibold text-primary-900 text-sm truncate">{app.title}</h3>
                    <p className="font-mono text-xs text-primary-400 mt-0.5">{app.reference}</p>
                    <p className="font-sans text-xs text-primary-500 mt-1.5 flex items-center gap-1">
                      <MapPin size={11} className="shrink-0" /> {app.address}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant={statusBadgeVariant(app.status)}>{app.status}</Badge>
                      <span className="font-sans text-xs text-primary-400">{app.dateReceived}</span>
                      <span className="font-sans text-xs text-primary-300">·</span>
                      <span className="font-sans text-xs text-primary-400">{app.distance}</span>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" leftIcon={<Plus size={13} />} className="shrink-0">
                    Leads
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Pipeline summary */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-sans font-semibold text-primary-900 text-base">Lead pipeline</h2>
            <Link href="/app/pipeline" className="font-sans text-sm font-medium text-accent-600 hover:text-accent-700 transition-colors">
              View board
            </Link>
          </div>
          <Card padding="md">
            <div className="space-y-3">
              {mockPipelineStages.map((stage) => (
                <div key={stage.stage} className="flex items-center gap-3">
                  <span className={`h-2.5 w-2.5 rounded-full ${stage.color} shrink-0`} />
                  <span className="font-sans text-sm text-primary-700 flex-1">{stage.stage}</span>
                  <span className="font-display font-bold text-primary-900 text-lg">{stage.count}</span>
                </div>
              ))}
            </div>
            <div className="mt-5 pt-4 border-t border-primary-100">
              <div className="flex items-center justify-between">
                <span className="font-sans text-sm font-semibold text-primary-900">Total active</span>
                <span className="font-display font-bold text-primary-900 text-xl">22</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Follow-ups + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming follow-ups */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-sans font-semibold text-primary-900 text-base">Upcoming follow-ups</h2>
            <Link href="/app/leads" className="font-sans text-sm font-medium text-accent-600 hover:text-accent-700 transition-colors">
              All leads
            </Link>
          </div>
          <Card padding="none" className="overflow-hidden">
            {mockFollowUps.map((fu: MockFollowUp, i: number) => (
              <div
                key={fu.id}
                className={`flex items-center gap-3 px-5 py-4 ${i < mockFollowUps.length - 1 ? 'border-b border-primary-100' : ''}`}
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-50 shrink-0">
                  {fu.type === 'Call' ? <Phone size={15} className="text-accent-700" /> : fu.type === 'Proposal' ? <FileText size={15} className="text-accent-700" /> : <Calendar size={15} className="text-accent-700" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-sans font-medium text-primary-900 text-sm truncate">{fu.leadName}</p>
                  <p className="font-sans text-xs text-primary-400 mt-0.5">{fu.property}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-sans text-xs font-semibold text-primary-700">{fu.dueDate}</p>
                  <p className="font-sans text-xs text-primary-400">{fu.type}</p>
                </div>
              </div>
            ))}
          </Card>
        </div>

        {/* Recent activity */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-sans font-semibold text-primary-900 text-base">Recent activity</h2>
            <Link href="/app/activity" className="font-sans text-sm font-medium text-accent-600 hover:text-accent-700 transition-colors">
              View all
            </Link>
          </div>
          <Card padding="none" className="overflow-hidden">
            {mockActivity.map((item: MockActivityItem, i: number) => {
              const Icon = activityIcons[item.icon];
              return (
                <div
                  key={item.id}
                  className={`flex items-start gap-3 px-5 py-3.5 ${i < mockActivity.length - 1 ? 'border-b border-primary-100' : ''}`}
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary-50 shrink-0 mt-0.5">
                    <Icon size={13} className="text-primary-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-sans text-sm text-primary-900">
                      <span className="font-semibold">{item.action}</span>
                    </p>
                    <p className="font-sans text-xs text-primary-500 mt-0.5 truncate">{item.detail}</p>
                  </div>
                  <span className="font-sans text-xs text-primary-400 shrink-0">{item.time}</span>
                </div>
              );
            })}
          </Card>
        </div>
      </div>

      {/* Quick action CTA */}
      <Card padding="lg" className="bg-primary-900 border-primary-900">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-sans font-semibold text-white text-base">Ready to find your next job?</h3>
            <p className="font-sans text-white/60 text-sm mt-1">Search planning applications and turn them into leads.</p>
          </div>
          <Link href="/app">
            <Button variant="secondary" rightIcon={<ArrowRight size={16} />}>
              Search Applications
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
