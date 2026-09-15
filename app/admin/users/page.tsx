'use client';

import { Users } from 'lucide-react';
import { Card, CardHeader, Badge, Table, type TableColumn } from '@/components/ui';
import { StatCard } from '@/components/workspace/StatCard';
import { adminUsers } from '@/lib/mock/admin';

const userBadge = (status: string): { variant: 'success' | 'warning' | 'danger' | 'neutral' | 'info'; label: string } => {
  switch (status) {
    case 'active': return { variant: 'success', label: 'Active' };
    case 'trial': return { variant: 'info', label: 'Trial' };
    case 'past_due': return { variant: 'warning', label: 'Past due' };
    default: return { variant: 'danger', label: 'Cancelled' };
  }
};

export default function AdminUsersPage() {
  const active = adminUsers.filter((u) => u.status === 'active').length;
  const companies = new Set(adminUsers.map((u) => u.company)).size;
  const national = adminUsers.filter((u) => u.plan === 'National' || u.plan === 'Enterprise').length;

  const columns: TableColumn<(typeof adminUsers)[number]>[] = [
    {
      key: 'name',
      header: 'User',
      sortable: true,
      render: (u) => (
        <div className="leading-tight">
          <p className="font-sans font-medium text-primary-900">{u.name}</p>
          <p className="font-sans text-xs text-primary-400">{u.email}</p>
        </div>
      ),
    },
    { key: 'company', header: 'Company', sortable: true, render: (u) => <span className="font-sans text-sm text-primary-600">{u.company}</span> },
    { key: 'plan', header: 'Plan', sortable: true, render: (u) => <span className="font-sans text-sm text-primary-900">{u.plan}</span> },
    { key: 'councils', header: 'Councils', sortable: true, align: 'right', render: (u) => <span className="font-sans text-sm text-primary-600">{u.councils}</span> },
    {
      key: 'status',
      header: 'Status',
      render: (u) => {
        const badge = userBadge(u.status);
        return <Badge variant={badge.variant}>{badge.label}</Badge>;
      },
    },
    { key: 'joined', header: 'Joined', render: (u) => <span className="font-sans text-sm text-primary-500">{u.joined}</span> },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-bold text-primary-900 text-h2">Users &amp; Companies</h1>
        <p className="font-sans text-primary-500 text-sm mt-1">
          Membership accounts across PlanningIndex.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={Users} label="Total users" value={adminUsers.length} trend="all time" trendUp />
        <StatCard icon={Users} label="Active users" value={active} trend="paying members" trendUp />
        <StatCard icon={Users} label="Companies" value={companies} trend="registered" trendUp />
        <StatCard icon={Users} label="National / Enterprise" value={national} trend="high-value members" trendUp />
      </div>

      <Card padding="none">
        <CardHeader title="Users" subtitle="All registered members and their memberships" />
        <Table columns={columns} data={adminUsers} rowKey={(u) => u.email} />
      </Card>
    </div>
  );
}
