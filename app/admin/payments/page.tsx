'use client';

import { CreditCard, Mail } from 'lucide-react';
import { Card, CardHeader, Badge, Table, type TableColumn } from '@/components/ui';
import { StatCard } from '@/components/workspace/StatCard';
import { adminPayments, adminMail } from '@/lib/mock/admin';

const paymentBadge = (status: string): { variant: 'success' | 'danger' | 'neutral'; label: string } => {
  switch (status) {
    case 'paid': return { variant: 'success', label: 'Paid' };
    case 'failed': return { variant: 'danger', label: 'Failed' };
    default: return { variant: 'neutral', label: 'Refunded' };
  }
};

type BadgeVariant = 'success' | 'warning' | 'info' | 'danger';

const mailBadge = (status: string): { variant: BadgeVariant; label: string } => {
  switch (status) {
    case 'delivered': return { variant: 'success', label: 'Delivered' };
    case 'mailed': return { variant: 'info', label: 'Mailed' };
    case 'processing': return { variant: 'warning', label: 'Processing' };
    default: return { variant: 'danger', label: 'Delivery issue' };
  }
};

export default function AdminPaymentsPage() {
  const paid = adminPayments.filter((p) => p.status === 'paid').length;
  const failed = adminPayments.filter((p) => p.status === 'failed').length;
  const delivered = adminMail.filter((m) => m.status === 'delivered').length;

  const paymentColumns: TableColumn<(typeof adminPayments)[number]>[] = [
    { key: 'id', header: 'Payment', render: (p) => <span className="font-sans font-medium text-primary-900">{p.id}</span> },
    { key: 'company', header: 'Company', sortable: true, render: (p) => <span className="font-sans text-sm text-primary-600">{p.company}</span> },
    { key: 'plan', header: 'Plan', render: (p) => <span className="font-sans text-sm text-primary-600">{p.plan}</span> },
    { key: 'amount', header: 'Amount', sortable: true, align: 'right', render: (p) => <span className="font-sans text-sm text-primary-900">{p.amount}</span> },
    {
      key: 'status',
      header: 'Status',
      render: (p) => {
        const badge = paymentBadge(p.status);
        return <Badge variant={badge.variant}>{badge.label}</Badge>;
      },
    },
    { key: 'date', header: 'Date', render: (p) => <span className="font-sans text-sm text-primary-500">{p.date}</span> },
  ];

  const mailColumns: TableColumn<(typeof adminMail)[number]>[] = [
    { key: 'id', header: 'Proposal', render: (m) => <span className="font-sans font-medium text-primary-900">{m.id}</span> },
    { key: 'proposal', header: 'Document', render: (m) => <span className="font-sans text-sm text-primary-600">{m.proposal}</span> },
    { key: 'recipient', header: 'Recipient', render: (m) => <span className="font-sans text-sm text-primary-600">{m.recipient}</span> },
    {
      key: 'status',
      header: 'Status',
      render: (m) => {
        const badge = mailBadge(m.status);
        return <Badge variant={badge.variant}>{badge.label}</Badge>;
      },
    },
    { key: 'sent', header: 'Sent', render: (m) => <span className="font-sans text-sm text-primary-500">{m.sent}</span> },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-bold text-primary-900 text-h2">Payments &amp; Mail</h1>
        <p className="font-sans text-primary-500 text-sm mt-1">
          Recent payments and the physical mail queue.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={CreditCard} label="Payments (recent)" value={adminPayments.length} trend="last 7 days" trendUp />
        <StatCard icon={CreditCard} label="Paid" value={paid} trend="successful charges" trendUp />
        <StatCard icon={CreditCard} label="Failed" value={failed} trend={failed > 0 ? 'retry scheduled' : 'none'} trendUp={failed === 0} />
        <StatCard icon={Mail} label="Delivered (recent)" value={delivered} trend="confirmed to door" trendUp />
      </div>

      <Card padding="none">
        <CardHeader title="Payments" subtitle="Recent subscription payments" />
        <Table columns={paymentColumns} data={adminPayments} rowKey={(p) => p.id} />
      </Card>

      <Card padding="none">
        <CardHeader title="Mail queue" subtitle="Physical proposals — send and delivery status" />
        <Table columns={mailColumns} data={adminMail} rowKey={(m) => m.id} />
      </Card>
    </div>
  );
}
