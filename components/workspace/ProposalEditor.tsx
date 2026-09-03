'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft, Save, Mail, Plus, Trash2, ChevronDown, ChevronUp, Eye, CreditCard as Edit3, Copy, CheckCircle2, AlertTriangle, Send as SendIcon, Clock, Package } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { useToast } from '@/components/ui/Toast';
import { useProposals } from '@/components/workspace/ProposalsContext';
import { ProposalDocumentPreview } from '@/components/workspace/ProposalDocumentPreview';
import { SendByPostModal } from '@/components/workspace/SendByPostModal';
import { DeliveryTimeline } from '@/components/workspace/DeliveryTimeline';
import type { Proposal, ProposalSection, ProposalLineItem, ProposalStatus } from '@/lib/mock/proposals';
import { calculateProposalTotal } from '@/lib/mock/proposals';

interface ProposalEditorProps {
  proposal: Proposal;
}

const statusBadgeVariant = (status: Proposal['status']): 'neutral' | 'info' | 'warning' | 'danger' | 'success' | 'accent' => {
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

export function ProposalEditor({ proposal: initialProposal }: ProposalEditorProps) {
  const { updateProposal, updateProposalStatus } = useProposals();
  const { toast } = useToast();

  const [proposal, setProposal] = useState<Proposal>(initialProposal);
  const [sendModalOpen, setSendModalOpen] = useState(false);
  const [mobileView, setMobileView] = useState<'edit' | 'preview'>('edit');
  const [copied, setCopied] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    details: true,
    introduction: true,
    scope_of_works: true,
    products_services: true,
    pricing: true,
    terms: true,
    contact_info: true,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setProposal(initialProposal);
  }, [initialProposal]);

  const toggleSection = (key: string) => {
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const updateField = (field: keyof Proposal, value: string) => {
    setProposal(prev => ({ ...prev, [field]: value }));
  };

  const updateSectionContent = (sectionId: string, content: string) => {
    setProposal(prev => ({
      ...prev,
      sections: prev.sections.map(s => s.id === sectionId ? { ...s, content } : s),
    }));
  };

  const updateLineItem = (sectionId: string, itemId: string, field: keyof ProposalLineItem, value: string | number) => {
    setProposal(prev => ({
      ...prev,
      sections: prev.sections.map(s => {
        if (s.id !== sectionId || !s.lineItems) return s;
        return {
          ...s,
          lineItems: s.lineItems.map(li => {
            if (li.id !== itemId) return li;
            const updated = { ...li, [field]: value };
            if (field === 'quantity' || field === 'unitPrice') {
              const qty = field === 'quantity' ? Number(value) : li.quantity;
              const unit = field === 'unitPrice' ? Number(value) : li.unitPrice;
              updated.total = qty * unit;
            }
            return updated;
          }),
        };
      }),
    }));
  };

  const addLineItem = (sectionId: string) => {
    setProposal(prev => ({
      ...prev,
      sections: prev.sections.map(s => {
        if (s.id !== sectionId) return s;
        const items = s.lineItems || [];
        const newItem: ProposalLineItem = {
          id: `li-${Date.now()}`,
          description: '',
          quantity: 1,
          unitPrice: 0,
          total: 0,
        };
        return { ...s, lineItems: [...items, newItem] };
      }),
    }));
  };

  const removeLineItem = (sectionId: string, itemId: string) => {
    setProposal(prev => ({
      ...prev,
      sections: prev.sections.map(s => {
        if (s.id !== sectionId || !s.lineItems) return s;
        return { ...s, lineItems: s.lineItems.filter(li => li.id !== itemId) };
      }),
    }));
  };

  const handleSave = useCallback(() => {
    setSaving(true);
    const total = calculateProposalTotal(proposal.sections);
    const totalStr = `\u00A3${total.toLocaleString('en-GB')}`;
    updateProposal(proposal.id, {
      ...proposal,
      totalValue: totalStr,
    });
    setTimeout(() => {
      setSaving(false);
      toast({ variant: 'success', title: 'Draft saved', message: 'Your proposal has been saved.' });
    }, 500);
  }, [proposal, updateProposal, toast]);

  const isSent = proposal.status !== 'Draft' && proposal.status !== 'Ready';

  const showTracking = isSent;

  const handleCopyTracking = () => {
    if (proposal.trackingNumber) {
      navigator.clipboard.writeText(proposal.trackingNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const nextStatusMap: Record<string, ProposalStatus> = {
    'Sent': 'Processing',
    'Processing': 'Mailed',
    'Mailed': 'Delivered',
  };

  const handleAdvanceStatus = () => {
    const next = nextStatusMap[proposal.status];
    if (next) {
      updateProposalStatus(proposal.id, next);
      setProposal(prev => ({ ...prev, status: next }));
      toast({ variant: 'info', title: 'Status updated', message: `Proposal moved to ${next}.` });
    }
  };

  const handleMarkDelivered = () => {
    updateProposalStatus(proposal.id, 'Delivered');
    setProposal(prev => ({ ...prev, status: 'Delivered' }));
    toast({ variant: 'success', title: 'Delivered', message: 'Proposal marked as delivered.' });
  };

  const handleRetrySend = () => {
    updateProposalStatus(proposal.id, 'Sent');
    setProposal(prev => ({ ...prev, status: 'Sent', deliveryIssueReason: null }));
    toast({ variant: 'info', title: 'Retrying', message: 'Proposal is being re-sent by post.' });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            href="/app/proposals"
            className="inline-flex items-center gap-1.5 font-sans text-sm font-medium text-primary-500 hover:text-primary-900 transition-colors"
          >
            <ArrowLeft size={16} /> Back
          </Link>
          <div className="h-4 w-px bg-primary-200" />
          <div>
            <h1 className="font-display font-bold text-primary-900 text-h2">{proposal.reference}</h1>
            <p className="font-sans text-xs text-primary-400 mt-0.5">{proposal.projectTitle}</p>
          </div>
          <Badge variant={statusBadgeVariant(proposal.status)}>{proposal.status}</Badge>
        </div>
        <div className="flex items-center gap-2">
          {!isSent && (
            <Button variant="outline" onClick={handleSave} loading={saving} leftIcon={!saving ? <Save size={15} /> : undefined}>
              Save Draft
            </Button>
          )}
          {!isSent && (
            <Button variant="secondary" onClick={() => setSendModalOpen(true)} leftIcon={<Mail size={15} />}>
              Send by Post
            </Button>
          )}
        </div>
      </div>

      <div className="lg:hidden flex items-center gap-1 rounded-lg border border-primary-200 bg-white p-1">
        <button
          onClick={() => setMobileView('edit')}
          className={`flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-md font-sans text-sm font-medium transition-colors ${
            mobileView === 'edit' ? 'bg-primary-900 text-white' : 'text-primary-500 hover:text-primary-900'
          }`}
        >
          <Edit3 size={15} /> Edit
        </button>
        <button
          onClick={() => setMobileView('preview')}
          className={`flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-md font-sans text-sm font-medium transition-colors ${
            mobileView === 'preview' ? 'bg-primary-900 text-white' : 'text-primary-500 hover:text-primary-900'
          }`}
        >
          <Eye size={15} /> Preview
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`${mobileView === 'preview' ? 'hidden' : 'block'} lg:block`}>
          <div className="space-y-4">
            <EditSection title="Proposal Details" isOpen={openSections.details} onToggle={() => toggleSection('details')}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input label="Recipient name" name="recipientName" value={proposal.recipientName} onChange={(e) => updateField('recipientName', e.target.value)} disabled={isSent} />
                <Input label="Postcode" name="recipientPostcode" value={proposal.recipientPostcode} onChange={(e) => updateField('recipientPostcode', e.target.value)} disabled={isSent} />
              </div>
              <Input label="Delivery address" name="recipientAddress" value={proposal.recipientAddress} onChange={(e) => updateField('recipientAddress', e.target.value)} className="mt-3" disabled={isSent} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                <Input label="Project title" name="projectTitle" value={proposal.projectTitle} onChange={(e) => updateField('projectTitle', e.target.value)} disabled={isSent} />
                <Input label="Project reference" name="projectReference" value={proposal.projectReference} onChange={(e) => updateField('projectReference', e.target.value)} disabled={isSent} />
              </div>
            </EditSection>

            {proposal.sections.filter(s => s.type !== 'pricing' && s.type !== 'products_services').map(section => (
              <EditSection key={section.id} title={section.title} isOpen={openSections[section.type] ?? true} onToggle={() => toggleSection(section.type)}>
                <Textarea
                  name={section.id}
                  value={section.content}
                  onChange={(e) => updateSectionContent(section.id, e.target.value)}
                  rows={4}
                  disabled={isSent}
                />
              </EditSection>
            ))}

            {(() => {
              const psSection = proposal.sections.find(s => s.type === 'products_services');
              if (!psSection) return null;
              return (
                <EditSection title={psSection.title} isOpen={openSections.products_services ?? true} onToggle={() => toggleSection('products_services')}>
                  <LineItemEditor section={psSection} isSent={isSent} onUpdateItem={updateLineItem} onAddItem={addLineItem} onRemoveItem={removeLineItem} />
                </EditSection>
              );
            })()}

            {(() => {
              const pSection = proposal.sections.find(s => s.type === 'pricing');
              if (!pSection) return null;
              return (
                <EditSection title={pSection.title} isOpen={openSections.pricing ?? true} onToggle={() => toggleSection('pricing')}>
                  <Textarea name={pSection.id} value={pSection.content} onChange={(e) => updateSectionContent(pSection.id, e.target.value)} rows={2} disabled={isSent} />
                  <LineItemEditor section={pSection} isSent={isSent} onUpdateItem={updateLineItem} onAddItem={addLineItem} onRemoveItem={removeLineItem} />
                </EditSection>
              );
            })()}

            <EditSection title="Company Details" isOpen={openSections.contact_info ?? true} onToggle={() => toggleSection('contact_info')}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input label="Company name" name="companyName" value={proposal.companyName} onChange={(e) => updateField('companyName', e.target.value)} disabled={isSent} />
                <Input label="VAT number" name="companyVatNumber" value={proposal.companyVatNumber} onChange={(e) => updateField('companyVatNumber', e.target.value)} disabled={isSent} />
              </div>
              <Input label="Company address" name="companyAddress" value={proposal.companyAddress} onChange={(e) => updateField('companyAddress', e.target.value)} className="mt-3" disabled={isSent} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                <Input label="Phone" name="companyPhone" value={proposal.companyPhone} onChange={(e) => updateField('companyPhone', e.target.value)} disabled={isSent} />
                <Input label="Email" name="companyEmail" value={proposal.companyEmail} onChange={(e) => updateField('companyEmail', e.target.value)} disabled={isSent} />
              </div>
            </EditSection>
          </div>
        </div>

        <div className={`${mobileView === 'edit' ? 'hidden' : 'block'} lg:block lg:sticky lg:top-20 lg:h-[calc(100vh-6rem)]`}>
          <ProposalDocumentPreview proposal={proposal} className="h-full" />
        </div>
      </div>

      {showTracking && (
        <Card padding="lg" className="border-accent-200">
          <div className="flex items-center gap-2 mb-5">
            <Package size={18} className="text-accent-600" />
            <h2 className="font-sans font-semibold text-primary-900 text-base">Delivery Tracking</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <p className="font-display font-bold text-primary-900 text-lg">{proposal.reference}</p>
                <div className="mt-2 rounded-lg border border-primary-200 bg-primary-50 p-3">
                  <p className="font-sans text-sm font-medium text-primary-900">{proposal.recipientName}</p>
                  <p className="font-sans text-sm text-primary-600">{proposal.recipientAddress}</p>
                  <p className="font-sans text-sm text-primary-600">{proposal.recipientPostcode}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-label text-primary-400">Status</span>
                <Badge variant={statusBadgeVariant(proposal.status)}>{proposal.status}</Badge>
              </div>

              {proposal.sentDate && (
                <div className="flex items-center justify-between">
                  <span className="font-sans text-sm text-primary-500">Sent</span>
                  <span className="font-sans text-sm font-medium text-primary-900">
                    {new Date(proposal.sentDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                </div>
              )}

              {proposal.estimatedDeliveryDate && proposal.status !== 'Delivered' && !proposal.deliveryIssueReason && (
                <div className="flex items-center justify-between">
                  <span className="font-sans text-sm text-primary-500">Est. delivery</span>
                  <span className="font-sans text-sm font-medium text-primary-900">
                    {new Date(proposal.estimatedDeliveryDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                </div>
              )}

              {proposal.trackingNumber && (
                <div>
                  <p className="text-label text-primary-400 mb-1.5">Tracking number</p>
                  <div className="flex items-center gap-2 rounded-lg border border-primary-200 bg-white px-3 py-2.5">
                    <span className="font-mono text-sm text-primary-900 flex-1">{proposal.trackingNumber}</span>
                    <button
                      onClick={handleCopyTracking}
                      className="text-primary-400 hover:text-primary-900 transition-colors shrink-0"
                      aria-label="Copy tracking number"
                    >
                      {copied ? <CheckCircle2 size={15} className="text-emerald-600" /> : <Copy size={15} />}
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div>
              <DeliveryTimeline proposal={proposal} />
            </div>
          </div>

          {(proposal.status === 'Delivery issue' || proposal.status === 'Undeliverable') && (
            <div className="mt-5 flex items-start gap-3 rounded-lg border border-danger-200 bg-danger-50 p-4">
              <AlertTriangle size={18} className="text-danger-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-sans font-semibold text-danger-800 text-sm">Delivery problem</p>
                <p className="font-sans text-sm text-danger-700 mt-1">
                  {proposal.deliveryIssueReason || 'There was an issue delivering this proposal.'}
                </p>
              </div>
              {proposal.status === 'Delivery issue' && (
                <Button size="sm" variant="outline" onClick={handleRetrySend} leftIcon={<SendIcon size={14} />}>
                  Retry Send
                </Button>
              )}
            </div>
          )}

          {proposal.status === 'Mailed' && (
            <div className="mt-5 flex items-center justify-between rounded-lg border border-success-200 bg-success-50 p-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-success-600" />
                <p className="font-sans text-sm text-success-800">Proposal has been mailed. Mark as delivered when confirmed.</p>
              </div>
              <Button size="sm" variant="outline" onClick={handleMarkDelivered}>
                Mark as Delivered
              </Button>
            </div>
          )}

          {(proposal.status === 'Sent' || proposal.status === 'Processing') && (
            <div className="mt-5 rounded-lg border border-primary-200 bg-primary-50 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-sans text-sm font-medium text-primary-900">Simulate mail platform update</p>
                  <p className="font-sans text-xs text-primary-500 mt-0.5">
                    This simulates status updates from the mail platform (Pingen/Docmail). These updates will arrive automatically once the integration is connected.
                  </p>
                </div>
                <Button size="sm" variant="outline" onClick={handleAdvanceStatus} leftIcon={<Clock size={14} />}>
                  Advance Status
                </Button>
              </div>
            </div>
          )}
        </Card>
      )}

      <SendByPostModal open={sendModalOpen} onClose={() => setSendModalOpen(false)} proposal={proposal} />
    </div>
  );
}

function EditSection({ title, isOpen, onToggle, children }: { title: string; isOpen: boolean; onToggle: () => void; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-primary-200 bg-white overflow-hidden">
      <button onClick={onToggle} className="flex items-center justify-between w-full px-4 py-3 hover:bg-primary-50 transition-colors">
        <h3 className="font-sans font-semibold text-primary-900 text-sm">{title}</h3>
        {isOpen ? <ChevronUp size={16} className="text-primary-400" /> : <ChevronDown size={16} className="text-primary-400" />}
      </button>
      {isOpen && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
}

function LineItemEditor({
  section, isSent, onUpdateItem, onAddItem, onRemoveItem,
}: {
  section: ProposalSection;
  isSent: boolean;
  onUpdateItem: (sectionId: string, itemId: string, field: keyof ProposalLineItem, value: string | number) => void;
  onAddItem: (sectionId: string) => void;
  onRemoveItem: (sectionId: string, itemId: string) => void;
}) {
  const items = section.lineItems || [];
  return (
    <div className="mt-3 space-y-2">
      {items.map((item) => (
        <div key={item.id} className="flex items-start gap-2 rounded-lg border border-primary-100 bg-primary-50/50 p-2">
          <div className="flex-1 space-y-2">
            <Input name={`${item.id}-desc`} value={item.description} onChange={(e) => onUpdateItem(section.id, item.id, 'description', e.target.value)} placeholder="Description" disabled={isSent} />
            <div className="grid grid-cols-3 gap-2">
              <Input name={`${item.id}-qty`} type="number" value={item.quantity} onChange={(e) => onUpdateItem(section.id, item.id, 'quantity', Number(e.target.value))} placeholder="Qty" disabled={isSent} />
              <Input name={`${item.id}-unit`} type="number" value={item.unitPrice} onChange={(e) => onUpdateItem(section.id, item.id, 'unitPrice', Number(e.target.value))} placeholder="Unit price" disabled={isSent} />
              <div className="flex items-center justify-center rounded-lg border border-primary-200 bg-white px-2 py-2.5">
                <span className="font-sans text-sm font-semibold text-primary-900">{`\u00A3${item.total.toLocaleString('en-GB')}`}</span>
              </div>
            </div>
          </div>
          {!isSent && (
            <button onClick={() => onRemoveItem(section.id, item.id)} className="p-1.5 text-primary-400 hover:text-danger-600 transition-colors shrink-0" aria-label="Remove item">
              <Trash2 size={16} />
            </button>
          )}
        </div>
      ))}
      {!isSent && (
        <Button size="sm" variant="outline" onClick={() => onAddItem(section.id)} leftIcon={<Plus size={14} />}>
          Add Item
        </Button>
      )}
    </div>
  );
}
