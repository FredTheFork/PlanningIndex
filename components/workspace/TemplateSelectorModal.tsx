'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Frame, Hammer, Home, Building2, FileText, ArrowRight } from 'lucide-react';
import { proposalTemplates, type ProposalTemplate } from '@/lib/mock/proposals';
import type { Lead } from '@/lib/mock/leads';

interface TemplateSelectorModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (templateId: string) => void;
  lead?: Lead | null;
}

const iconMap: Record<string, typeof Frame> = {
  frame: Frame,
  hammer: Hammer,
  home: Home,
  building: Building2,
  file: FileText,
};

export function TemplateSelectorModal({ open, onClose, onSelect, lead }: TemplateSelectorModalProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleConfirm = () => {
    if (selectedId) {
      onSelect(selectedId);
      setSelectedId(null);
    }
  };

  const handleClose = () => {
    setSelectedId(null);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Choose a proposal template"
      description={lead ? `Creating a proposal for ${lead.contactName} — ${lead.propertyAddress}` : 'Select a template to start your proposal'}
      size="xl"
      footer={
        <>
          <Button variant="outline" onClick={handleClose}>Cancel</Button>
          <Button onClick={handleConfirm} disabled={!selectedId} rightIcon={selectedId ? <ArrowRight size={16} /> : undefined}>
            Create Proposal
          </Button>
        </>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {proposalTemplates.map((template: ProposalTemplate) => {
          const Icon = iconMap[template.icon] || FileText;
          const isSelected = selectedId === template.id;
          const isRecommended = lead && template.applicableTradeTags.length > 0;

          return (
            <button
              key={template.id}
              onClick={() => setSelectedId(template.id)}
              className={`text-left rounded-xl border-2 p-5 transition-all duration-200 ${
                isSelected
                  ? 'border-accent-500 bg-accent-50/50 shadow-md'
                  : 'border-primary-200 bg-white hover:border-primary-300 hover:shadow-card-hover'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl shrink-0 ${
                  isSelected ? 'bg-accent-600 text-white' : 'bg-primary-100 text-primary-700'
                }`}>
                  <Icon size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-sans font-semibold text-primary-900 text-base">{template.name}</h3>
                    {isRecommended && (
                      <Badge variant="accent">Recommended</Badge>
                    )}
                  </div>
                  <p className="font-sans text-primary-500 text-sm leading-relaxed">{template.description}</p>
                  {template.applicableTradeTags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {template.applicableTradeTags.map((tag) => (
                        <span key={tag} className="inline-flex items-center rounded-md bg-primary-100 px-2 py-0.5 font-sans text-xs font-medium text-primary-600">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </Modal>
  );
}
