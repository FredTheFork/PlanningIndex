'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { FileText, Search, Plus, ArrowRight } from 'lucide-react';
import { EmptyState, Button, Badge, Card, SearchInput } from '@/components/ui';
import { useProposals } from '@/components/workspace/ProposalsContext';
import { useLeads } from '@/components/workspace/LeadsContext';
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

type FilterPill = 'all' | 'draft' | 'mailed' | 'delivered' | 'failed';

const filterPills: { value: FilterPill; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'draft', label: 'Draft' },
  { value: 'mailed', label: 'In Transit' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'failed', label: 'Failed' },
];

function matchesFilter(status: ProposalStatus, filter: FilterPill): boolean {
  switch (filter) {
    case 'all': return true;
    case 'draft': return status === 'Draft' || status === 'Ready';
    case 'mailed': return status === 'Sent' || status === 'Processing' || status === 'Mailed';
    case 'delivered': return status === 'Delivered';
    case 'failed': return status === 'Delivery issue' || status === 'Undeliverable';
    default: return true;
  }
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatShortDate(iso: string | null): string {
  if (!iso) return '\u2014';
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

const emptyStateMessages: Record<FilterPill, { title: string; description: string }> = {
  all: { title: 'No proposals yet', description: 'Your proposals will appear here once you create your first one from a lead.' },
  draft: { title: 'No draft proposals', description: 'Draft proposals will appear here when you start creating them.' },
  mailed: { title: 'No proposals in transit', description: 'Proposals sent by post will appear here while they are being delivered.' },
  delivered: { title: 'No delivered proposals yet', description: 'Delivered proposals will appear here once they reach their destination.' },
  failed: { title: 'No failed deliveries', description: 'Proposals with delivery issues will appear here if something goes wrong.' },
};

export default function ProposalsPage() {
  const { proposals } = useProposals();
  const { getLeadById } = useLeads();
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterPill>('all');

  const counts = useMemo(() => {
    return {
      all: proposals.length,
      draft: proposals.filter(p => matchesFilter(p.status, 'draft')).length,
      mailed: proposals.filter(p => matchesFilter(p.status, 'mailed')).length,
      delivered: proposals.filter(p => matchesFilter(p.status, 'delivered')).length,
      failed: proposals.filter(p => matchesFilter(p.status, 'failed')).length,
    } as Record<FilterPill, number>;
  }, [proposals]);

  const filtered = useMemo(() => {
    return proposals.filter((p) => {
      if (!matchesFilter(p.status, activeFilter)) return false;
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
  }, [proposals, search, activeFilter]);

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
      </div>

      <div className="flex flex-wrap gap-2">
        {filterPills.map((pill) => (
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
              activeFilter === pill.value
                ? 'bg-white/20 text-white'
                : 'bg-primary-100 text-primary-500'
            }`}>
              {counts[pill.value]}
            </span>
          </button>
        ))}
      </div>

      <Card padding="none" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-primary-200 bg-primary-50">
                <th className="text-left px-4 py-3 font-sans text-xs font-semibold text-primary-400 uppercase tracking-wider">Reference</th>
                <th className="text-left px-4 py-3 font-sans text-xs font-semibold text-primary-400 uppercase tracking-wider">Recipient</th>
                <th className="text-left px-4 py-3 font-sans text-xs font-semibold text-primary-400 uppercase tracking-wider hidden md:table-cell">Lead</th>
                <th className="text-left px-4 py-3 font-sans text-xs font-semibold text-primary-400 uppercase tracking-wider hidden md:table-cell">Property</th>
                <th className="text-left px-4 py-3 font-sans text-xs font-semibold text-primary-400 uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3 font-sans text-xs font-semibold text-primary-400 uppercase tracking-wider hidden lg:table-cell">Value</th>
                <th className="text-left px-4 py-3 font-sans text-xs font-semibold text-primary-400 uppercase tracking-wider hidden lg:table-cell">Sent</th>
                <th className="text-left px-4 py-3 font-sans text-xs font-semibold text-primary-400 uppercase tracking-wider hidden lg:table-cell">Created</th>
                <th className="w-8" />
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center">
                    <p className="font-sans text-sm text-primary-400">{emptyStateMessages[activeFilter].title}</p>
                    <p className="font-sans text-xs text-primary-300 mt-1">{emptyStateMessages[activeFilter].description}</p>
                  </td>
                </tr>
              ) : (
                filtered.map((proposal) => {
                  const lead = getLeadById(proposal.leadId);
                  return (
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
                        {lead ? (
                          <Link href="/app/leads" className="font-sans text-sm text-primary-700 hover:text-accent-700 transition-colors">
                            {lead.contactName}
                          </Link>
                        ) : (
                          <span className="font-sans text-sm text-primary-300">Lead removed</span>
                        )}
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
                        <span className={`font-sans text-xs ${proposal.sentDate ? 'text-primary-500' : 'text-primary-300'}`}>
                          {formatShortDate(proposal.sentDate)}
                        </span>
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
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
