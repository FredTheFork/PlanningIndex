'use client';

import { AlertTriangle, Building2, Database, RefreshCw } from 'lucide-react';
import { Card, CardHeader, Badge, Table, type TableColumn } from '@/components/ui';
import { StatCard } from '@/components/workspace/StatCard';
import { scraperStatus, councils, scraperErrors } from '@/lib/mock/admin';

const councilBadge = (status: string): { variant: 'success' | 'warning' | 'danger' | 'neutral'; label: string } => {
  switch (status) {
    case 'healthy': return { variant: 'success', label: 'Healthy' };
    case 'warning': return { variant: 'warning', label: 'Warning' };
    case 'error': return { variant: 'danger', label: 'Error' };
    default: return { variant: 'neutral', label: 'Pending' };
  }
};

export default function AdminScraperPage() {
  const healthy = councils.filter((c) => c.status === 'healthy').length;
  const problem = councils.filter((c) => c.status === 'error' || c.status === 'warning').length;
  const totalApps = councils.reduce((sum, c) => sum + c.applications, 0);

  const columns: TableColumn<(typeof councils)[number]>[] = [
    {
      key: 'council',
      header: 'Council',
      sortable: true,
      render: (c) => <span className="font-sans font-medium text-primary-900">{c.council}</span>,
    },
    { key: 'region', header: 'Region', sortable: true, render: (c) => <span className="font-sans text-sm text-primary-600">{c.region}</span> },
    {
      key: 'status',
      header: 'Status',
      render: (c) => {
        const badge = councilBadge(c.status);
        return <Badge variant={badge.variant}>{badge.label}</Badge>;
      },
    },
    {
      key: 'applications',
      header: 'Applications',
      sortable: true,
      align: 'right',
      render: (c) => <span className="font-sans text-sm text-primary-900">{c.applications.toLocaleString()}</span>,
    },
    { key: 'lastUpdated', header: 'Last updated', render: (c) => <span className="font-sans text-sm text-primary-500">{c.lastUpdated}</span> },
  ];

  const errorColumns: TableColumn<(typeof scraperErrors)[number]>[] = [
    { key: 'council', header: 'Council', render: (e) => <span className="font-sans font-medium text-primary-900">{e.council}</span> },
    { key: 'error', header: 'Error', render: (e) => <span className="font-sans text-sm text-primary-600">{e.error}</span> },
    { key: 'time', header: 'Time', render: (e) => <span className="font-sans text-sm text-primary-500">{e.time}</span> },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-bold text-primary-900 text-h2">Scraper &amp; Councils</h1>
        <p className="font-sans text-primary-500 text-sm mt-1">
          Planning data pipeline status across all UK councils.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={AlertTriangle} label="Councils with errors" value={problem} trend={problem > 0 ? 'needs attention' : 'all clear'} trendUp={problem === 0} />
        <StatCard icon={Building2} label="Healthy councils (sample)" value={healthy} trend="recent runs" trendUp />
        <StatCard icon={Database} label="Applications (sample)" value={totalApps} trend="across tracked councils" trendUp />
        <StatCard icon={RefreshCw} label="Errors last run" value={scraperStatus.errors} trend="3 councils affected" trendUp={false} />
      </div>

      <Card padding="none">
        <CardHeader title="Councils" subtitle="Scraper status per council" />
        <Table columns={columns} data={councils} rowKey={(c) => c.council} />
      </Card>

      <Card padding="none">
        <CardHeader title="Scraper errors" subtitle="Errors from the most recent run" />
        <Table columns={errorColumns} data={scraperErrors} rowKey={(e) => `${e.council}-${e.time}`} />
      </Card>
    </div>
  );
}
