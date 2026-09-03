'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { LayoutGrid, List, Search, MapPin, Calendar } from 'lucide-react';
import { Button, Badge, EmptyState, Table, type TableColumn } from '@/components/ui';
import { useLeads } from '@/components/workspace/LeadsContext';
import { PipelineBoard } from '@/components/workspace/PipelineBoard';
import { LeadDetailDrawer } from '@/components/workspace/LeadDetailDrawer';
import { pipelineStages, leadStatusOptions, type Lead, type LeadStatus } from '@/lib/mock/leads';

const statusBadgeVariant = (status: LeadStatus): 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'accent' => {
  switch (status) {
    case 'Won': return 'success';
    case 'New': return 'info';
    case 'Contacted': return 'warning';
    case 'Proposal Sent': return 'accent';
    case 'Follow Up': return 'warning';
    case 'Lost': return 'danger';
    default: return 'neutral';
  }
};

function formatDate(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

export default function PipelinePage() {
  const { leads } = useLeads();
  const [view, setView] = useState<'board' | 'list'>('board');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const activeLeads = useMemo(
    () => leads.filter((l) => l.status !== 'Lost'),
    [leads]
  );

  const handleLeadClick = (lead: Lead) => {
    setSelectedLead(lead);
    setDrawerOpen(true);
  };

  const handleRowClick = (lead: Lead) => {
    setSelectedLead(lead);
    setDrawerOpen(true);
  };

  const listColumns: TableColumn<Lead>[] = [
    {
      key: 'propertyAddress',
      header: 'Property',
      sortable: true,
      render: (lead) => (
        <div>
          <p className="font-sans font-medium text-primary-900 text-sm">{lead.propertyAddress}</p>
          <p className="font-sans text-xs text-primary-400 mt-0.5 flex items-center gap-1">
            <MapPin size={10} /> {lead.propertyPostcode}
          </p>
        </div>
      ),
    },
    {
      key: 'applicationReference',
      header: 'Application',
      render: (lead) => <span className="font-mono text-xs text-primary-600">{lead.applicationReference}</span>,
    },
    {
      key: 'contactName',
      header: 'Contact',
      sortable: true,
      render: (lead) => <span className="font-sans text-sm text-primary-900">{lead.contactName}</span>,
    },
    {
      key: 'status',
      header: 'Stage',
      sortable: true,
      render: (lead) => <Badge variant={statusBadgeVariant(lead.status)}>{lead.status}</Badge>,
    },
    {
      key: 'estimatedValue',
      header: 'Est. value',
      sortable: true,
      align: 'right',
      render: (lead) => <span className="font-sans font-semibold text-primary-900">{lead.estimatedValue}</span>,
    },
    {
      key: 'nextFollowUp',
      header: 'Follow-up',
      sortable: true,
      render: (lead) => (
        lead.nextFollowUp ? (
          <p className="font-sans text-sm text-primary-900 flex items-center gap-1">
            <Calendar size={11} /> {formatDate(lead.nextFollowUp)}
          </p>
        ) : <span className="font-sans text-sm text-primary-300">—</span>
      ),
    },
    {
      key: 'assignedTo',
      header: 'Assigned',
      sortable: true,
      render: (lead) => <span className="font-sans text-sm text-primary-600">{lead.assignedTo}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-primary-900 text-h2">Pipeline</h1>
          <p className="font-sans text-primary-500 text-sm mt-1">
            Drag leads across stages from New to Won.
          </p>
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-primary-200 bg-white p-1">
          <button
            onClick={() => setView('board')}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-md font-sans text-sm font-medium transition-colors ${
              view === 'board' ? 'bg-primary-900 text-white' : 'text-primary-500 hover:text-primary-900'
            }`}
          >
            <LayoutGrid size={15} /> Board
          </button>
          <button
            onClick={() => setView('list')}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-md font-sans text-sm font-medium transition-colors ${
              view === 'list' ? 'bg-primary-900 text-white' : 'text-primary-500 hover:text-primary-900'
            }`}
          >
            <List size={15} /> List
          </button>
        </div>
      </div>

      {leads.length === 0 ? (
        <div className="rounded-xl border border-primary-200 bg-white">
          <EmptyState
            icon={LayoutGrid}
            title="Your pipeline is empty"
            description="Add planning applications as leads to see them appear in your pipeline board."
            action={
              <Link href="/app/search">
                <Button size="sm" leftIcon={<Search size={14} />}>Search Applications</Button>
              </Link>
            }
          />
        </div>
      ) : view === 'board' ? (
        <PipelineBoard onLeadClick={handleLeadClick} />
      ) : (
        <Table
          columns={listColumns}
          data={activeLeads}
          rowKey={(lead) => lead.id}
          onRowClick={handleRowClick}
        />
      )}

      <LeadDetailDrawer
        lead={selectedLead}
        open={drawerOpen}
        onClose={() => { setDrawerOpen(false); setSelectedLead(null); }}
      />
    </div>
  );
}
