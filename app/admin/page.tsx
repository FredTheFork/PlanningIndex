'use client';

import { AlertTriangle, Database, Users, CreditCard, Mail, Activity } from 'lucide-react';
import { Card, CardHeader, Badge, Table, type TableColumn } from '@/components/ui';
import { StatCard } from '@/components/workspace/StatCard';
import {
  scraperStatus,
  systemServices,
  scraperErrors,
  adminUsers,
  adminPayments,
  adminMail,
} from '@/lib/mock/admin';

const statusBadge = (status: string): { variant: 'success' | 'warning' | 'danger' | 'neutral'; label: string } => {
  switch (status) {
    case 'operational': return { variant: 'success', label: 'Operational' };
    case 'degraded': return { variant: 'warning', label: 'Degraded' };
    case 'down': return { variant: 'danger', label: 'Down' };
    default: return { variant: 'neutral', label: status };
  }
};

export default function AdminOverviewPage() {
  const activeUsers = adminUsers.filter((u) => u.status === 'active').length;
  const revenue = adminPayments.filter((p) => p.status === 'paid').length;
  const mailInTransit = adminMail.filter((m) => m.status === 'mailed' || m.status === 'processing').length;

  const serviceColumns: TableColumn<(typeof systemServices)[number]>[] = [
    { key: 'name', header: 'Service', render: (s) => <span className="font-sans font-medium text-primary-900">{s.name}</span> },
    {
      key: 'status',
      header: 'Status',
      render: (s) => {
        const badge = statusBadge(s.status);
        return <Badge variant={badge.variant}>{badge.label}</Badge>;
      },
    },
    { key: 'detail', header: 'Detail', render: (s) => <span className="font-sans text-sm text-primary-600">{s.detail}</span> },
  ];

  const errorColumns: TableColumn<(typeof scraperErrors)[number]>[] = [
    { key: 'council', header: 'Council', render: (e) => <span className="font-sans font-medium text-primary-900">{e.council}</span> },
    { key: 'error', header: 'Error', render: (e) => <span className="font-sans text-sm text-primary-600">{e.error}</span> },
    { key: 'time', header: 'Time', render: (e) => <span className="font-sans text-sm text-primary-500">{e.time}</span> },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-bold text-primary-900 text-h2">Overview</h1>
        <p className="font-sans text-primary-500 text-sm mt-1">
          System health, scraper status, and operational summary.
        </p>
      </div>

      {/* Key figures */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={Database} label="Applications imported last run" value={14821} trend="healthy" trendUp />
        <StatCard icon={Users} label="Active users" value={activeUsers} trend="+1 this week" trendUp />
        <StatCard icon={CreditCard} label="Payments this month" value={revenue} trend="on track" trendUp />
        <StatCard icon={Mail} label="Mail in transit" value={mailInTransit} trend="3 delivered today" trendUp />
      </div>

      {/* Scraper status */}
      <Card padding="md">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 text-primary-700">
              <Activity size={18} />
            </span>
            <div>
              <p className="font-sans font-semibold text-primary-900">Planning data scraper</p>
              <p className="font-sans text-sm text-primary-500">
                Last run {scraperStatus.lastRun} · Next run {scraperStatus.nextRun}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div>
              <p className="font-sans text-2xl font-bold text-primary-900">{scraperStatus.councilsProcessed}</p>
              <p className="font-sans text-xs text-primary-400">councils processed</p>
            </div>
            <div>
              <p className="font-sans text-2xl font-bold text-primary-900">{scraperStatus.applicationsImported.toLocaleString()}</p>
              <p className="font-sans text-xs text-primary-400">imported last run</p>
            </div>
            <div>
              <p className="font-sans text-2xl font-bold text-danger">{scraperStatus.errors}</p>
              <p className="font-sans text-xs text-primary-400">errors</p>
            </div>
            <Badge variant={scraperStatus.status === 'healthy' ? 'success' : 'warning'}>
              {scraperStatus.status === 'healthy' ? 'Healthy' : 'Degraded'}
            </Badge>
          </div>
        </div>
      </Card>

      {/* System health */}
      <Card padding="none">
        <CardHeader title="System health" subtitle="Current status of all PlanningIndex services" />
        <Table columns={serviceColumns} data={systemServices} rowKey={(s) => s.name} />
      </Card>

      {/* Scraper errors */}
      <Card padding="none">
        <CardHeader
          title="Recent scraper errors"
          subtitle="Errors from the most recent run"
          action={
            <span className="flex items-center gap-1.5 font-sans text-sm text-danger">
              <AlertTriangle size={15} /> {scraperErrors.length} errors
            </span>
          }
        />
        <Table columns={errorColumns} data={scraperErrors} rowKey={(e) => `${e.council}-${e.time}`} />
      </Card>
    </div>
  );
}
