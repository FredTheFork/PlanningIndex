'use client';

import { useState } from 'react';
import {
  Search, Plus, Trash2, Mail, Bell, ChevronRight,
  Inbox, AlertCircle, RefreshCw, Home,
} from 'lucide-react';
import {
  Button, Input, Select, Checkbox, RadioGroup, Textarea, Toggle, SearchInput,
  Card, CardHeader, CardFooter, Badge, Tabs, Table, Dropdown, Tooltip, Pagination, Breadcrumbs,
  Modal, Drawer, Alert, ConfirmDialog, useToast,
  EmptyState, ErrorState, FullPageLoading,
  CardSkeleton, ListSkeleton, TableSkeleton, DetailSkeleton, Spinner,
} from '@/components/ui';
import type { TableColumn } from '@/components/ui';

export default function DesignSystemPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toggleOn, setToggleOn] = useState(true);
  const [checkboxChecked, setCheckboxChecked] = useState(true);
  const [radioValue, setRadioValue] = useState('option1');
  const [searchValue, setSearchValue] = useState('');
  const [currentPage, setCurrentPage] = useState(3);
  const { toast } = useToast();

  const tableData = [
    { ref: 'APP/2024/001', status: 'Approved', authority: 'Westminster', date: '2024-03-15' },
    { ref: 'APP/2024/002', status: 'Pending', authority: 'Camden', date: '2024-04-02' },
    { ref: 'APP/2024/003', status: 'Refused', authority: 'Hackney', date: '2024-02-28' },
    { ref: 'APP/2024/004', status: 'Withdrawn', authority: 'Islington', date: '2024-05-10' },
  ];

  const tableColumns: TableColumn<typeof tableData[number]>[] = [
    { key: 'ref', header: 'Reference', sortable: true, render: (row) => <span className="text-mono">{row.ref}</span> },
    { key: 'status', header: 'Status', sortable: true, render: (row) => {
      const variant = row.status === 'Approved' ? 'success' : row.status === 'Pending' ? 'warning' : row.status === 'Refused' ? 'danger' : 'neutral';
      return <Badge variant={variant as 'success' | 'warning' | 'danger' | 'neutral'}>{row.status}</Badge>;
    }},
    { key: 'authority', header: 'Authority', sortable: true },
    { key: 'date', header: 'Date', sortable: true, render: (row) => <span className="text-mono">{row.date}</span> },
  ];

  return (
    <div className="min-h-screen bg-surface-page">
      <div className="max-w-page mx-auto px-6 py-16 space-y-16">

        {/* Header */}
        <div>
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Design System' }]} />
          <h1 className="font-display font-bold text-primary-900 mt-4 text-display">
            Design System
          </h1>
          <p className="font-sans text-primary-500 mt-2 text-lg">
            Component library reference — every component in every variant and state.
          </p>
        </div>

        {/* Buttons */}
        <Section title="Buttons">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-3 items-center">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="danger">Danger</Button>
            </div>
            <div className="flex flex-wrap gap-3 items-center">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
            </div>
            <div className="flex flex-wrap gap-3 items-center">
              <Button loading>Loading</Button>
              <Button disabled>Disabled</Button>
              <Button leftIcon={<Plus size={16} />}>Add Item</Button>
              <Button variant="outline" rightIcon={<ChevronRight size={16} />}>Next</Button>
              <Button fullWidth className="max-w-xs">Full Width</Button>
            </div>
          </div>
        </Section>

        {/* Form Components */}
        <Section title="Form Components">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Email address"
              placeholder="you@example.com"
              helperText="We'll never share your email."
            />
            <Input
              label="Email with error"
              placeholder="you@example.com"
              error="Please enter a valid email address."
            />
            <Input
              label="Search field"
              placeholder="Search..."
              leftIcon={<Search size={16} />}
            />
            <Select label="Authority" placeholder="Select authority">
              <option value="westminster">Westminster</option>
              <option value="camden">Camden</option>
              <option value="hackney">Hackney</option>
            </Select>
            <Textarea
              label="Description"
              placeholder="Enter a description..."
              helperText="Max 500 characters."
            />
            <div className="space-y-4">
              <Checkbox
                label="Subscribe to updates"
                description="Receive email notifications about new applications."
                checked={checkboxChecked}
                onChange={(e) => setCheckboxChecked(e.target.checked)}
              />
              <Toggle
                checked={toggleOn}
                onChange={setToggleOn}
                label="Enable notifications"
                description="Get alerted when applications change status."
              />
            </div>
          </div>
          <div className="mt-6 max-w-md">
            <RadioGroup
              name="plan"
              label="Select a plan"
              value={radioValue}
              onChange={setRadioValue}
              options={[
                { value: 'option1', label: 'Starter', description: 'For individuals and small teams.' },
                { value: 'option2', label: 'Professional', description: 'For growing planning teams.' },
                { value: 'option3', label: 'Enterprise', description: 'For large organisations.' },
              ]}
            />
          </div>
          <div className="mt-6 max-w-md">
            <SearchInput
              placeholder="Search by reference, postcode, or keyword..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onClear={() => setSearchValue('')}
            />
          </div>
        </Section>

        {/* Cards */}
        <Section title="Cards">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card variant="default">
              <CardHeader title="Default Card" subtitle="Standard bordered card" />
              <p className="font-sans text-sm text-primary-500">
                Basic card with default styling.
              </p>
            </Card>
            <Card variant="bordered">
              <CardHeader title="Bordered Card" subtitle="Stronger border" />
              <p className="font-sans text-sm text-primary-500">
                Card with a more prominent border.
              </p>
            </Card>
            <Card variant="raised">
              <CardHeader title="Raised Card" subtitle="Hover shadow effect" />
              <p className="font-sans text-sm text-primary-500">
                Card with shadow that intensifies on hover.
              </p>
            </Card>
            <Card variant="inset">
              <CardHeader title="Inset Card" subtitle="Recessed appearance" />
              <p className="font-sans text-sm text-primary-500">
                Card with inset background.
              </p>
            </Card>
          </div>
          <div className="mt-6 max-w-md">
            <Card>
              <CardHeader title="Card with Footer" subtitle="Actions in the footer" action={<Badge variant="accent">New</Badge>} />
              <p className="font-sans text-sm text-primary-500 mb-4">
                This card demonstrates the header and footer components.
              </p>
              <CardFooter>
                <Button variant="ghost" size="sm">Cancel</Button>
                <Button size="sm">Save</Button>
              </CardFooter>
            </Card>
          </div>
        </Section>

        {/* Badges */}
        <Section title="Badges">
          <div className="flex flex-wrap gap-3">
            <Badge variant="success">Approved</Badge>
            <Badge variant="warning">Pending</Badge>
            <Badge variant="danger">Refused</Badge>
            <Badge variant="info">Information</Badge>
            <Badge variant="neutral">Withdrawn</Badge>
            <Badge variant="accent">Featured</Badge>
          </div>
        </Section>

        {/* Tabs */}
        <Section title="Tabs">
          <Tabs
            items={[
              { label: 'Overview', value: 'overview', content: <p className="font-sans text-sm text-primary-500">Overview content goes here.</p> },
              { label: 'Documents', value: 'documents', content: <p className="font-sans text-sm text-primary-500">Documents content goes here.</p> },
              { label: 'History', value: 'history', content: <p className="font-sans text-sm text-primary-500">History content goes here.</p> },
            ]}
            variant="underline"
          />
          <div className="mt-8">
            <Tabs
              items={[
                { label: 'Active', value: 'active', content: <p className="font-sans text-sm text-primary-500">Active applications.</p> },
                { label: 'Archived', value: 'archived', content: <p className="font-sans text-sm text-primary-500">Archived applications.</p> },
              ]}
              variant="pill"
            />
          </div>
        </Section>

        {/* Table */}
        <Section title="Table">
          <Table
            columns={tableColumns}
            data={tableData}
            rowKey={(row) => row.ref}
            zebra
          />
        </Section>

        {/* Dropdown */}
        <Section title="Dropdown">
          <Dropdown
            trigger={<Button variant="outline" rightIcon={<ChevronRight size={16} className="rotate-90" />}>Actions</Button>}
            items={[
              { label: 'Edit', icon: <Plus size={14} />, onClick: () => toast({ variant: 'info', title: 'Edit clicked' }) },
              { label: 'Share', icon: <Mail size={14} /> },
              { divider: true, label: '' },
              { label: 'Delete', icon: <Trash2 size={14} />, danger: true, onClick: () => setConfirmOpen(true) },
            ]}
          />
        </Section>

        {/* Tooltip */}
        <Section title="Tooltip">
          <div className="flex gap-8">
            <Tooltip content="Tooltip on top" side="top">
              <Button variant="outline">Top</Button>
            </Tooltip>
            <Tooltip content="Tooltip on bottom" side="bottom">
              <Button variant="outline">Bottom</Button>
            </Tooltip>
            <Tooltip content="Tooltip on left" side="left">
              <Button variant="outline">Left</Button>
            </Tooltip>
            <Tooltip content="Tooltip on right" side="right">
              <Button variant="outline">Right</Button>
            </Tooltip>
          </div>
        </Section>

        {/* Pagination */}
        <Section title="Pagination">
          <Pagination
            currentPage={currentPage}
            totalPages={10}
            onPageChange={setCurrentPage}
          />
        </Section>

        {/* Alerts */}
        <Section title="Alerts">
          <div className="space-y-3 max-w-2xl">
            <Alert variant="success" title="Application approved">
              The planning application has been approved by the local authority.
            </Alert>
            <Alert variant="warning" title="Pending review">
              This application is awaiting review from the planning officer.
            </Alert>
            <Alert variant="danger" title="Application refused">
              The planning application has been refused. Review the decision notice for details.
            </Alert>
            <Alert variant="info" title="New feature available">
              You can now search applications by drawing custom boundaries on the map.
            </Alert>
          </div>
        </Section>

        {/* Overlays */}
        <Section title="Overlays">
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => setModalOpen(true)}>Open Modal</Button>
            <Button variant="outline" onClick={() => setDrawerOpen(true)}>Open Drawer</Button>
            <Button variant="danger" onClick={() => setConfirmOpen(true)}>Delete Item</Button>
            <Button variant="secondary" onClick={() => toast({ variant: 'success', title: 'Saved!', message: 'Your changes have been saved.' })}>
              Show Success Toast
            </Button>
            <Button variant="outline" onClick={() => toast({ variant: 'danger', title: 'Error', message: 'Something went wrong.' })}>
              Show Error Toast
            </Button>
          </div>
        </Section>

        {/* Loading States */}
        <Section title="Loading States">
          <div className="space-y-6">
            <div>
              <p className="text-label text-primary-400 mb-3">Full Page Loading</p>
              <div className="border border-primary-200 rounded-xl overflow-hidden">
                <FullPageLoading label="Loading applications..." />
              </div>
            </div>
            <div>
              <p className="text-label text-primary-400 mb-3">Spinner</p>
              <div className="border border-primary-200 rounded-xl overflow-hidden">
                <Spinner />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-label text-primary-400 mb-3">Card Skeleton</p>
                <CardSkeleton />
              </div>
              <div>
                <p className="text-label text-primary-400 mb-3">List Skeleton</p>
                <ListSkeleton rows={3} />
              </div>
            </div>
            <div>
              <p className="text-label text-primary-400 mb-3">Table Skeleton</p>
              <TableSkeleton rows={4} cols={4} />
            </div>
            <div>
              <p className="text-label text-primary-400 mb-3">Detail Skeleton</p>
              <Card padding="md"><DetailSkeleton /></Card>
            </div>
          </div>
        </Section>

        {/* Empty & Error States */}
        <Section title="Empty & Error States">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card padding="none">
              <EmptyState
                icon={Inbox}
                title="No applications found"
                description="Try adjusting your search filters or broaden your criteria."
                action={<Button size="sm" leftIcon={<Plus size={14} />}>New Search</Button>}
              />
            </Card>
            <Card padding="none">
              <ErrorState
                title="Failed to load"
                description="We couldn't load the applications. Please check your connection."
                onRetry={() => toast({ variant: 'info', title: 'Retrying...' })}
              />
            </Card>
          </div>
        </Section>

        {/* Typography */}
        <Section title="Typography">
          <div className="space-y-4">
            <div>
              <p className="text-label text-primary-400 mb-1">Display</p>
              <p className="font-display font-bold text-display text-primary-900">The quick brown fox</p>
            </div>
            <div>
              <p className="text-label text-primary-400 mb-1">H1</p>
              <p className="text-h1 text-primary-900">The quick brown fox</p>
            </div>
            <div>
              <p className="text-label text-primary-400 mb-1">H2</p>
              <p className="text-h2 text-primary-900">The quick brown fox</p>
            </div>
            <div>
              <p className="text-label text-primary-400 mb-1">H3</p>
              <p className="text-h3 text-primary-900">The quick brown fox</p>
            </div>
            <div>
              <p className="text-label text-primary-400 mb-1">H4</p>
              <p className="text-h4 text-primary-900">The quick brown fox</p>
            </div>
            <div>
              <p className="text-label text-primary-400 mb-1">Label</p>
              <p className="text-label text-primary-600">Section Label</p>
            </div>
            <div>
              <p className="text-label text-primary-400 mb-1">Metadata</p>
              <p className="text-metadata">Last updated 2 hours ago</p>
            </div>
            <div>
              <p className="text-label text-primary-400 mb-1">Monospace</p>
              <p className="text-mono text-primary-900">APP/2024/0001</p>
            </div>
          </div>
        </Section>

        {/* Colour Palette */}
        <Section title="Colour Palette">
          <div className="space-y-6">
            <ColourScale name="Primary" shades={['50','100','200','300','400','500','600','700','800','900','950']} prefix="primary" />
            <ColourScale name="Accent" shades={['50','100','200','300','400','500','600','700','800','900','950']} prefix="accent" />
            <ColourScale name="Success" shades={['50','100','200','300','400','500','600','700','800','900']} prefix="success" />
            <ColourScale name="Warning" shades={['50','100','200','300','400','500','600','700','800','900']} prefix="warning" />
            <ColourScale name="Danger" shades={['50','100','200','300','400','500','600','700','800','900']} prefix="danger" />
            <ColourScale name="Info" shades={['50','100','200','300','400','500','600','700','800','900']} prefix="info" />
            <ColourScale name="Neutral" shades={['50','100','200','300','400','500','600','700','800','900','950']} prefix="neutral" />
          </div>
        </Section>

      </div>

      {/* Modals & Drawers */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Application Details"
        description="View and edit planning application information."
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={() => setModalOpen(false)}>Save Changes</Button>
          </>
        }
      >
        <p className="font-sans text-sm text-primary-500">
          This is an example modal demonstrating the overlay component with a title, description, body content, and footer actions.
        </p>
      </Modal>

      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Quick Edit"
        description="Edit application details in a slide-in panel."
        footer={
          <>
            <Button variant="outline" onClick={() => setDrawerOpen(false)}>Cancel</Button>
            <Button onClick={() => setDrawerOpen(false)}>Save</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Reference" defaultValue="APP/2024/001" />
          <Input label="Applicant" defaultValue="John Smith" />
          <Select label="Status">
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="refused">Refused</option>
          </Select>
        </div>
      </Drawer>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => {
          setConfirmOpen(false);
          toast({ variant: 'success', title: 'Deleted', message: 'The item has been removed.' });
        }}
        title="Delete this item?"
        message="This action cannot be undone. The item will be permanently removed."
        confirmLabel="Delete"
        danger
      />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-display font-bold text-primary-900 text-h2 mb-6 pb-3 border-b border-primary-200">
        {title}
      </h2>
      {children}
    </section>
  );
}

function ColourScale({ name, shades, prefix }: { name: string; shades: string[]; prefix: string }) {
  return (
    <div>
      <p className="text-label text-primary-400 mb-2">{name}</p>
      <div className="flex flex-wrap gap-1 rounded-lg overflow-hidden">
        {shades.map((shade) => (
          <div
            key={shade}
            className={`flex-1 min-w-[60px] h-16 flex items-end justify-center pb-1.5 bg-${prefix}-${shade} ${parseInt(shade) > 500 ? 'text-white' : 'text-primary-900'} text-xs font-mono`}
          >
            {shade}
          </div>
        ))}
      </div>
    </div>
  );
}
