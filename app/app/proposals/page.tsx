'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { FileText, Search, Plus, ArrowRight } from 'lucide-react';
import { EmptyState, Button, Badge, Card, Select, SearchInput } from '@/components/ui';
import { useProposals } from '@/components/workspace/ProposalsContext';
import type { ProposalStatus } from '@/lib/mock/proposals';

const statusBadgeVariant = (status: ProposalStatus): 'neutral' | 'info' | 'warning' | 'danger' | 'success' | 'accent' => {
  switch (status) {
    case 'Delivered': return 'success';
    case 'Draft': return 'neutral';
    case 'Ready': return 'info';
    case 'Sent': return 'info';
    case 'Processing': return 'warning';
    case 'Mailed': return 'accent';
    case 'Delivery issue': return 'warning';
    case 'Undeliverable': return 'danger';
    default: return 'neutral';
  }
};

const statusOptions: { value: string; label: string }[] = [
  { value: 'all', label: 'All statuses' },
  { value: 'Draft', label: 'Draft' },
  { value: 'Ready', label: 'Ready' },
  { value: 'Sent', label: 'Sent' },
  { value: 'Processing', label: 'Processing' },
  { value: 'Mailed', label: 'Mailed' },
  { value: 'Delivered', label: 'Delivered' },
  { value: 'Delivery issue', label: 'Delivery issue' },
  { value: 'Undeliverable', label: 'Undeliverable' },
];

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function ProposalsPage() {
  const { proposals } = useProposals();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = useMemo(() => {
    return proposals.filter((p) => {
      if (statusFilter !== 'all' && p.status !== statusFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          p.reference.toLowerCase().includes(q) ||
          p.recipientName.toLowerCase().includes(q) ||
          p.propertyAddress.toLowerCase().includes(q) ||
          p.projectTitle.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [proposals, search, statusFilter]);

  if (proposals.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="font-display font-bold text-primary-900 text-h2">Proposals</h1>
          <p className="font-sans text-primary-500 text-sm mt-1">
            Create, send, and track professional proposals by post.
          </p>
        </div>
        <div className="rounded-xl border border-primary-200 bg-white">
          <EmptyState
            icon={FileText}
            title="No proposals yet"
            description="Your proposals will appear here once you create your first one from a lead."
            action={
              <Link href="/app/leads">
                <Button size="sm" leftIcon={<Search size={14} />}>View Leads</Button>
              </Link>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-display font-bold text-primary-900 text-h2">Proposals</h1>
          <p className="font-sans text-primary-500 text-sm mt-1">
            Create, send, and track professional proposals by post.
          </p>
        </div>
        <Link href="/app/leads">
          <Button leftIcon={<Plus size={16} />}>Create Proposal</Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <SearchInput
            placeholder="Search by reference, recipient, property..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="sm:w-48">
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </Select>
        </div>
      </div>

      <Card padding="none" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-primary-200 bg-primary-50">
                <th className="text-left px-4 py-3 font-sans text-xs font-semibold text-primary-400 uppercase tracking-wider">Reference</th>
                <th className="text-left px-4 py-3 font-sans text-xs font-semibold text-primary-400 uppercase tracking-wider">Recipient</th>
                <th className="text-left px-4 py-3 font-sans text-xs font-semibold text-primary-400 uppercase tracking-wider hidden md:table-cell">Property</th>
                <th className="text-left px-4 py-3 font-sans text-xs font-semibold text-primary-400 uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3 font-sans text-xs font-semibold text-primary-400 uppercase tracking-wider hidden lg:table-cell">Value</th>
                <th className="text-left px-4 py-3 font-sans text-xs font-semibold text-primary-400 uppercase tracking-wider hidden lg:table-cell">Created</th>
                <th className="w-8" />
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center">
                    <p className="font-sans text-sm text-primary-400">No proposals match your filters.</p>
                  </td>
                </tr>
              ) : (
                filtered.map((proposal) => (
                  <tr key={proposal.id} className="border-b border-primary-100 last:border-b-0 hover:bg-primary-50/50 transition-colors cursor-pointer group">
                    <td className="px-4 py-3.5">
                      <Link href={`/app/proposals/${proposal.id}`} className="font-mono text-xs text-primary-700 group-hover:text-accent-700 transition-colors">
                        {proposal.reference}
                      </Link>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="font-sans text-sm font-medium text-primary-900">{proposal.recipientName}</p>
                      <p className="font-sans text-xs text-primary-400">{proposal.projectTitle}</p>
                    </td>
                    <td className="px-4 py-3.5 hidden md:table-cell">
                      <p className="font-sans text-sm text-primary-600">{proposal.propertyAddress}</p>
                      <p className="font-sans text-xs text-primary-400">{proposal.propertyPostcode}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <Badge variant={statusBadgeVariant(proposal.status)}>{proposal.status}</Badge>
                    </td>
                    <td className="px-4 py-3.5 hidden lg:table-cell">
                      <span className="font-sans text-sm font-semibold text-primary-900">{proposal.totalValue}</span>
                    </td>
                    <td className="px-4 py-3.5 hidden lg:table-cell">
                      <span className="font-sans text-xs text-primary-400">{formatDate(proposal.createdDate)}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <Link href={`/app/proposals/${proposal.id}`}>
                        <ArrowRight size={16} className="text-primary-300 group-hover:text-accent-600 transition-colors" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
