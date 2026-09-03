'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Users, Plus, Search, MapPin, Calendar, Phone, Mail } from 'lucide-react';
import { Button, Badge, EmptyState, Table, type TableColumn } from '@/components/ui';
import { useLeads } from '@/components/workspace/LeadsContext';
import { AddLeadModal } from '@/components/workspace/AddLeadModal';
import { LeadDetailDrawer } from '@/components/workspace/LeadDetailDrawer';
import { filterLeads, getAssignedToOptions, leadStatusOptions, type Lead, type LeadStatus } from '@/lib/mock/leads';

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

export default function LeadsPage() {
  const { leads } = useLeads();
  const [keyword, setKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [assignedFilter, setAssignedFilter] = useState('all');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const assignedOptions = useMemo(() => getAssignedToOptions(leads), [leads]);

  const filteredLeads = useMemo(
    () => filterLeads(leads, { keyword, status: statusFilter, assignedTo: assignedFilter }),
    [leads, keyword, statusFilter, assignedFilter]
  );

  const handleRowClick = (lead: Lead) => {
    setSelectedLead(lead);
    setDrawerOpen(true);
  };

  const columns: TableColumn<Lead>[] = [
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
      render: (lead) => (
        <div>
          <p className="font-mono text-xs text-primary-600">{lead.applicationReference}</p>
          <p className="font-sans text-xs text-primary-400 mt-0.5 line-clamp-1">{lead.applicationTitle}</p>
        </div>
      ),
    },
    {
      key: 'contactName',
      header: 'Contact',
      sortable: true,
      render: (lead) => (
        <div>
          <p className="font-sans text-sm text-primary-900">{lead.contactName}</p>
          {lead.contactPhone && (
            <p className="font-sans text-xs text-primary-400 mt-0.5 flex items-center gap-1">
              <Phone size={10} /> {lead.contactPhone}
            </p>
          )}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
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
        <div>
          {lead.nextFollowUp ? (
            <>
              <p className="font-sans text-sm text-primary-900 flex items-center gap-1">
                <Calendar size={11} /> {formatDate(lead.nextFollowUp)}
              </p>
              {lead.nextFollowUpType && (
                <p className="font-sans text-xs text-primary-400 mt-0.5">{lead.nextFollowUpType}</p>
              )}
            </>
          ) : (
            <span className="font-sans text-sm text-primary-300">—</span>
          )}
        </div>
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
          <h1 className="font-display font-bold text-primary-900 text-h2">Leads</h1>
          <p className="font-sans text-primary-500 text-sm mt-1">
            Manage your leads and track them through your pipeline.
          </p>
        </div>
        <Button leftIcon={<Plus size={16} />} onClick={() => setAddModalOpen(true)}>
          Add Lead
        </Button>
      </div>

      {leads.length === 0 ? (
        <div className="rounded-xl border border-primary-200 bg-white">
          <EmptyState
            icon={Users}
            title="No leads yet"
            description="Find a planning application and add it to your CRM to start building your pipeline."
            action={
              <Link href="/app/search">
                <Button size="sm" leftIcon={<Search size={14} />}>Search Applications</Button>
              </Link>
            }
          />
        </div>
      ) : (
        <>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-400 pointer-events-none" />
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Search by property, contact, or reference..."
                className="block w-full pl-10 pr-3 py-2.5 border border-primary-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-accent-500/40 focus:border-accent-500 font-sans text-sm text-primary-900 bg-white transition-colors"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2.5 border border-primary-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-accent-500/40 focus:border-accent-500 font-sans text-sm text-primary-900 bg-white transition-colors cursor-pointer"
            >
              {leadStatusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <select
              value={assignedFilter}
              onChange={(e) => setAssignedFilter(e.target.value)}
              className="px-3 py-2.5 border border-primary-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-accent-500/40 focus:border-accent-500 font-sans text-sm text-primary-900 bg-white transition-colors cursor-pointer"
            >
              {assignedOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between">
            <p className="font-sans text-sm text-primary-500">
              {filteredLeads.length} {filteredLeads.length === 1 ? 'lead' : 'leads'}
            </p>
          </div>

          {filteredLeads.length === 0 ? (
            <div className="rounded-xl border border-primary-200 bg-white">
              <EmptyState
                icon={Search}
                title="No leads match your filters"
                description="Try adjusting your search or filters to see more results."
                action={
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => { setKeyword(''); setStatusFilter('all'); setAssignedFilter('all'); }}
                  >
                    Clear filters
                  </Button>
                }
              />
            </div>
          ) : (
            <Table
              columns={columns}
              data={filteredLeads}
              rowKey={(lead) => lead.id}
              onRowClick={handleRowClick}
            />
          )}
        </>
      )}

      <AddLeadModal open={addModalOpen} onClose={() => setAddModalOpen(false)} />
      <LeadDetailDrawer
        lead={selectedLead}
        open={drawerOpen}
        onClose={() => { setDrawerOpen(false); setSelectedLead(null); }}
      />
    </div>
  );
}
