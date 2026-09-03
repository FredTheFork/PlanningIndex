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
  MapPin,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Card, Badge, Button } from '@/components/ui';
import { StatCard } from '@/components/workspace/StatCard';
import { DashboardSection } from '@/components/workspace/DashboardSection';
import { ApplicationsNearYou } from '@/components/workspace/ApplicationsNearYou';
import { ProposalStatusList, type ProposalStatusItem } from '@/components/workspace/ProposalStatusList';
import { useProposals } from '@/components/workspace/ProposalsContext';
import { TodaysPriorities } from '@/components/workspace/TodaysPriorities';
import { DashboardSkeleton } from '@/components/workspace/DashboardSkeleton';
import {
  mockStats,
  mockRecentApplications,
  mockNearbyApplications,
  mockPipelineStages,
  mockPipelineSummary,
  mockFollowUps,
  mockActivity,
  mockProposals,
  mockPriorities,
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
  const { proposals } = useProposals();
  const [companyName, setCompanyName] = useState('your company');
  const [companyLoading, setCompanyLoading] = useState(true);
  const [hour, setHour] = useState(9);

  useEffect(() => {
    const now = new Date();
    setHour(now.getHours());
  }, []);

  useEffect(() => {
    let cancelled = false;
    if (user?.id) {
      setCompanyLoading(true);
      import('@/lib/supabase/client').then(({ supabase }) => {
        supabase
          .from('profiles')
          .select('company_name')
          .eq('id', user.id)
          .maybeSingle()
          .then(({ data }) => {
            if (cancelled) return;
            if (data?.company_name) setCompanyName(data.company_name);
            setCompanyLoading(false);
          });
      }).catch(() => {
        if (!cancelled) setCompanyLoading(false);
      });
    } else {
      setCompanyLoading(false);
    }
    return () => { cancelled = true; };
  }, [user]);

  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  if (companyLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div>
        <h1 className="font-display font-bold text-primary-900 text-h2">
          {greeting}, {companyName}
        </h1>
        <p className="font-sans text-primary-500 text-sm mt-1">
          Here&apos;s what&apos;s happening with your pipeline today.
        </p>
      </div>

      {/* Today's priorities */}
      <DashboardSection title="Today's priorities">
        <TodaysPriorities priorities={mockPriorities} />
      </DashboardSection>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {mockStats.map((stat) => {
          const Icon = statIcons[stat.icon];
          return (
            <StatCard
              key={stat.label}
              icon={Icon}
              value={stat.value}
              label={stat.label}
              trend={stat.trend}
              trendUp={stat.trendUp}
            />
          );
        })}
      </div>

      {/* Recent opportunities + Applications near you */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardSection title="Recent opportunities" viewAllHref="/app/search" viewAllLabel="View all">
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
        </DashboardSection>

        <DashboardSection title="Applications near you" viewAllHref="/app/search" viewAllLabel="View all">
          <ApplicationsNearYou applications={mockNearbyApplications} />
        </DashboardSection>
      </div>

      {/* Pipeline summary + Proposal status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardSection title="Lead pipeline" viewAllHref="/app/pipeline" viewAllLabel="View board">
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
            <div className="mt-5 pt-4 border-t border-primary-100 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-sans text-sm font-semibold text-primary-900">Pipeline value</span>
                <span className="font-display font-bold text-primary-900 text-lg">{mockPipelineSummary.totalValue}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-sans text-sm font-semibold text-primary-900">Win rate</span>
                <span className="font-display font-bold text-primary-900 text-lg">{mockPipelineSummary.winRate}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-sans text-sm font-semibold text-primary-900">Total active</span>
                <span className="font-display font-bold text-primary-900 text-lg">{mockPipelineSummary.activeLeads}</span>
              </div>
            </div>
          </Card>
        </DashboardSection>

        <DashboardSection title="Proposal status" viewAllHref="/app/proposals" viewAllLabel="View all">
          <ProposalStatusList proposals={proposals.map((p): ProposalStatusItem => ({
              id: p.id,
              reference: p.reference,
              recipient: p.recipientName,
              property: p.propertyAddress,
              status: p.status,
              createdDate: new Date(p.createdDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
              sentDate: p.sentDate ? new Date(p.sentDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : null,
              value: p.totalValue,
            }))} />
        </DashboardSection>
      </div>

      {/* Follow-ups + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardSection title="Upcoming follow-ups" viewAllHref="/app/leads" viewAllLabel="All leads">
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
        </DashboardSection>

        <DashboardSection title="Recent activity" viewAllHref="/app/activity" viewAllLabel="View all">
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
        </DashboardSection>
      </div>

      {/* Quick action CTA */}
      <Card padding="lg" className="bg-primary-900 border-primary-900">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-sans font-semibold text-white text-base">Ready to find your next job?</h3>
            <p className="font-sans text-white/60 text-sm mt-1">Search planning applications and turn them into leads.</p>
          </div>
          <Link href="/app/search">
            <Button variant="secondary" rightIcon={<ArrowRight size={16} />}>
              Search Applications
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
