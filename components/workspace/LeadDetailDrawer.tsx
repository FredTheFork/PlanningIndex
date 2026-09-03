'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  MapPin, FileText, User, Phone, Mail, Calendar, PoundSterling,
  Trash2, ArrowRight, Plus, Check, Mail as MailIcon, Send, Package,
  Phone as PhoneIcon, FilePlus,
} from 'lucide-react';
import { Drawer } from '@/components/ui/Drawer';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Badge } from '@/components/ui/Badge';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useToast } from '@/components/ui/Toast';
import { useLeads } from '@/components/workspace/LeadsContext';
import { useProposals } from '@/components/workspace/ProposalsContext';
import { TemplateSelectorModal } from '@/components/workspace/TemplateSelectorModal';
import { leadStatusOptions, type Lead, type LeadStatus, type FollowUpType } from '@/lib/mock/leads';
import type { LeadActivity, ActivityIcon } from '@/lib/mock/lead-activity';
import type { ProposalStatus } from '@/lib/mock/proposals';

interface LeadDetailDrawerProps {
  lead: Lead | null;
  open: boolean;
  onClose: () => void;
}

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

const iconMap: Record<ActivityIcon, typeof Plus> = {
  plus: Plus,
  file: FileText,
  mail: MailIcon,
  check: Check,
  phone: PhoneIcon,
  calendar: Calendar,
  send: Send,
  package: Package,
};

const iconBgMap: Record<ActivityIcon, string> = {
  plus: 'bg-sky-100 text-sky-700',
  file: 'bg-primary-100 text-primary-700',
  mail: 'bg-violet-100 text-violet-700',
  check: 'bg-emerald-100 text-emerald-700',
  phone: 'bg-amber-100 text-amber-700',
  calendar: 'bg-sky-100 text-sky-700',
  send: 'bg-violet-100 text-violet-700',
  package: 'bg-emerald-100 text-emerald-700',
};

function formatDateShort(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

const proposalStatusBadgeVariant = (status: ProposalStatus): 'neutral' | 'info' | 'warning' | 'danger' | 'success' | 'accent' => {
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

export function LeadDetailDrawer({ lead, open, onClose }: LeadDetailDrawerProps) {
  const { updateLead, deleteLead, addActivity, getActivityByLeadId } = useLeads();
  const { getProposalsByLeadId } = useProposals();
  const { toast } = useToast();
  const router = useRouter();

  const [status, setStatus] = useState<LeadStatus>('New');
  const [notes, setNotes] = useState('');
  const [nextFollowUp, setNextFollowUp] = useState('');
  const [nextFollowUpType, setNextFollowUpType] = useState<FollowUpType | ''>('');
  const [assignedTo, setAssignedTo] = useState('');
  const [estimatedValue, setEstimatedValue] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [leadActivities, setLeadActivities] = useState<LeadActivity[]>([]);
  const [templateModalOpen, setTemplateModalOpen] = useState(false);
  const [linkedProposals, setLinkedProposals] = useState<ReturnType<typeof getProposalsByLeadId>>([]);

  useEffect(() => {
    if (lead) {
      setStatus(lead.status);
      setNotes(lead.notes);
      setNextFollowUp(lead.nextFollowUp ? lead.nextFollowUp.split('T')[0] : '');
      setNextFollowUpType(lead.nextFollowUpType || '');
      setAssignedTo(lead.assignedTo);
      setEstimatedValue(lead.estimatedValue);
      setContactName(lead.contactName);
      setContactPhone(lead.contactPhone);
      setContactEmail(lead.contactEmail);
      setLeadActivities(getActivityByLeadId(lead.id));
      setLinkedProposals(getProposalsByLeadId(lead.id));
    }
  }, [lead, getActivityByLeadId, getProposalsByLeadId]);

  if (!lead) return null;

  const handleSave = () => {
    const oldStatus = lead.status;
    updateLead(lead.id, {
      status,
      notes: notes.trim(),
      nextFollowUp: nextFollowUp || null,
      nextFollowUpType: nextFollowUpType || null,
      assignedTo: assignedTo.trim() || 'Unassigned',
      estimatedValue: estimatedValue,
      contactName: contactName.trim(),
      contactPhone: contactPhone.trim(),
      contactEmail: contactEmail.trim(),
    });
    if (oldStatus !== status) {
      const entry = addActivity(lead.id, 'status_changed', 'Status changed', `${oldStatus} → ${status}`, 'check');
      setLeadActivities((prev) => [entry, ...prev]);
    }
    toast({ variant: 'success', title: 'Lead updated', message: 'Changes have been saved.' });
  };

  const handleAddNote = () => {
    if (!notes.trim()) return;
    const snippet = notes.trim().slice(0, 80) + (notes.trim().length > 80 ? '...' : '');
    const entry = addActivity(lead.id, 'note_added', 'Note added', snippet, 'file');
    setLeadActivities((prev) => [entry, ...prev]);
    toast({ variant: 'success', title: 'Note saved', message: 'Note has been added to the activity timeline.' });
  };

  const handleDelete = () => {
    deleteLead(lead.id);
    toast({ variant: 'success', title: 'Lead deleted', message: 'The lead has been removed.' });
    setConfirmDelete(false);
    onClose();
  };

  const handleTemplateSelect = (templateId: string) => {
    setTemplateModalOpen(false);
    router.push(`/app/proposals/new?leadId=${lead.id}&templateId=${templateId}`);
  };

  const createdDate = new Date(lead.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  const updatedDate = new Date(lead.updatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <>
      <Drawer
        open={open}
        onClose={onClose}
        title="Lead details"
        size="lg"
        footer={
          <>
            <Button variant="danger" leftIcon={<Trash2 size={15} />} onClick={() => setConfirmDelete(true)}>
              Delete
            </Button>
            <Button onClick={handleSave}>
              Save Changes
            </Button>
          </>
        }
      >
        <div className="space-y-6">
          {/* Next action callout */}
          {nextFollowUp && (
            <div className="flex items-center gap-3 rounded-lg border border-accent-200 bg-accent-50 px-4 py-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-600 text-white shrink-0">
                <Calendar size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-sans text-xs font-semibold text-accent-700 uppercase tracking-wider">Next action</p>
                <p className="font-sans text-sm font-medium text-primary-900 mt-0.5">
                  Follow up {formatDateShort(nextFollowUp)}
                  {nextFollowUpType && ` — ${nextFollowUpType}`}
                </p>
              </div>
            </div>
          )}

          {/* Property */}
          <section>
            <h3 className="font-sans font-semibold text-primary-900 text-sm mb-3">Property</h3>
            <div className="rounded-lg border border-primary-200 bg-primary-50 p-4">
              <p className="font-sans font-medium text-primary-900 text-sm flex items-center gap-1.5">
                <MapPin size={14} className="text-primary-400 shrink-0" />
                {lead.propertyAddress}, {lead.propertyPostcode}
              </p>
            </div>
          </section>

          {/* Linked application */}
          <section>
            <h3 className="font-sans font-semibold text-primary-900 text-sm mb-3">Planning application</h3>
            <Link
              href={`/app/applications/${lead.applicationId}`}
              className="group flex items-center justify-between gap-3 rounded-lg border border-primary-200 bg-white p-4 hover:border-primary-300 hover:shadow-card-hover transition-all"
            >
              <div className="min-w-0">
                <p className="font-sans font-medium text-primary-900 text-sm group-hover:text-accent-700 transition-colors">{lead.applicationTitle}</p>
                <p className="font-mono text-xs text-primary-400 mt-0.5">{lead.applicationReference}</p>
              </div>
              <ArrowRight size={16} className="text-primary-300 group-hover:text-accent-600 transition-colors shrink-0" />
            </Link>
          </section>

          {/* Proposals */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-sans font-semibold text-primary-900 text-sm">Proposals</h3>
              <Button
                size="sm"
                variant={linkedProposals.length > 0 ? 'outline' : 'primary'}
                leftIcon={<FilePlus size={13} />}
                onClick={() => setTemplateModalOpen(true)}
              >
                {linkedProposals.length > 0 ? 'Create another' : 'Create Proposal'}
              </Button>
            </div>
            {linkedProposals.length > 0 ? (
              <div className="space-y-2">
                {linkedProposals.map((proposal) => (
                  <Link
                    key={proposal.id}
                    href={`/app/proposals/${proposal.id}`}
                    className="group flex items-center justify-between gap-3 rounded-lg border border-primary-200 bg-white p-3 hover:border-primary-300 hover:shadow-card-hover transition-all"
                  >
                    <div className="min-w-0">
                      <p className="font-mono text-xs text-primary-500">{proposal.reference}</p>
                      <p className="font-sans text-sm font-medium text-primary-900 mt-0.5">{proposal.totalValue}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge variant={proposalStatusBadgeVariant(proposal.status)}>{proposal.status}</Badge>
                      <ArrowRight size={14} className="text-primary-300 group-hover:text-accent-600 transition-colors" />
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="font-sans text-sm text-primary-400 py-2">No proposals yet for this lead.</p>
            )}
          </section>

          {/* Contact */}
          <section>
            <h3 className="font-sans font-semibold text-primary-900 text-sm mb-3">Contact</h3>
            <div className="space-y-3">
              <Input
                label="Contact name"
                name="contactName"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                leftIcon={<User size={15} />}
              />
              <Input
                label="Phone"
                name="contactPhone"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                leftIcon={<Phone size={15} />}
              />
              <Input
                label="Email"
                name="contactEmail"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                leftIcon={<Mail size={15} />}
              />
            </div>
          </section>

          {/* Status */}
          <section>
            <h3 className="font-sans font-semibold text-primary-900 text-sm mb-3">Status</h3>
            <Select
              name="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as LeadStatus)}
            >
              {leadStatusOptions.filter(o => o.value !== 'all').map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </Select>
            <div className="mt-2">
              <Badge variant={statusBadgeVariant(status)}>{status}</Badge>
            </div>
          </section>

          {/* Value and assignment */}
          <section>
            <h3 className="font-sans font-semibold text-primary-900 text-sm mb-3">Value & assignment</h3>
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Estimated value"
                name="estimatedValue"
                value={estimatedValue}
                onChange={(e) => setEstimatedValue(e.target.value)}
                leftIcon={<PoundSterling size={15} />}
              />
              <Input
                label="Assigned to"
                name="assignedTo"
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
              />
            </div>
          </section>

          {/* Follow-up */}
          <section>
            <h3 className="font-sans font-semibold text-primary-900 text-sm mb-3">Next follow-up</h3>
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Date"
                type="date"
                name="nextFollowUp"
                value={nextFollowUp}
                onChange={(e) => setNextFollowUp(e.target.value)}
                leftIcon={<Calendar size={15} />}
              />
              <Select
                label="Type"
                name="nextFollowUpType"
                value={nextFollowUpType}
                onChange={(e) => setNextFollowUpType(e.target.value as FollowUpType | '')}
              >
                <option value="">Select type</option>
                <option value="Call">Call</option>
                <option value="Email">Email</option>
                <option value="Visit">Visit</option>
                <option value="Proposal">Proposal</option>
              </Select>
            </div>
          </section>

          {/* Notes */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-sans font-semibold text-primary-900 text-sm">Notes</h3>
              <Button size="sm" variant="outline" onClick={handleAddNote} leftIcon={<Plus size={13} />}>
                Add note
              </Button>
            </div>
            <Textarea
              name="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes about this lead..."
              rows={4}
            />
          </section>

          {/* Activity timeline */}
          <section className="pt-4 border-t border-primary-100">
            <h3 className="font-sans font-semibold text-primary-900 text-sm mb-4">Activity</h3>
            {leadActivities.length > 0 ? (
              <div className="relative">
                <div className="absolute left-[1.375rem] top-3 bottom-3 w-px bg-primary-200" />
                <div className="space-y-4">
                  {leadActivities.map((activity) => {
                    const Icon = iconMap[activity.icon] || Plus;
                    return (
                      <div key={activity.id} className="relative flex items-start gap-4">
                        <div className={`relative flex h-11 w-11 items-center justify-center rounded-xl shrink-0 z-10 ${iconBgMap[activity.icon] || 'bg-primary-100 text-primary-700'}`}>
                          <Icon size={16} />
                        </div>
                        <div className="pt-1.5">
                          <div className="flex items-center gap-2">
                            <span className="font-sans text-xs text-primary-400">{formatDateShort(activity.timestamp)}</span>
                          </div>
                          <p className="font-sans font-semibold text-primary-900 text-sm mt-0.5">{activity.title}</p>
                          <p className="font-sans text-primary-500 text-sm leading-relaxed mt-0.5">{activity.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <p className="font-sans text-sm text-primary-400 py-4">No activity recorded yet.</p>
            )}

            <div className="mt-6 flex items-center gap-2 text-xs text-primary-400">
              <FileText size={12} />
              <span>Created {createdDate}</span>
              <span className="text-primary-300">·</span>
              <span>Updated {updatedDate}</span>
            </div>
          </section>
        </div>
      </Drawer>

      <ConfirmDialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={handleDelete}
        title="Delete this lead?"
        message="This action cannot be undone. The lead will be permanently removed from your pipeline."
        confirmLabel="Delete"
        danger
      />

      <TemplateSelectorModal
        open={templateModalOpen}
        onClose={() => setTemplateModalOpen(false)}
        onSelect={handleTemplateSelect}
        lead={lead}
      />
    </>
  );
}
