'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, MapPin, FileText, Plus, Send, Calendar, Building2, CheckCircle2, XCircle, Clock, Ban, PoundSterling, Download, ExternalLink } from 'lucide-react';
import { Card, Badge, Button } from '@/components/ui';
import { ApplicationIntelligence } from '@/components/workspace/ApplicationIntelligence';
import { SingleMarkerMap } from '@/components/workspace/SingleMarkerMap';
import { AddLeadModal } from '@/components/workspace/AddLeadModal';
import { TemplateSelectorModal } from '@/components/workspace/TemplateSelectorModal';
import { useLeads } from '@/components/workspace/LeadsContext';
import { useProposals } from '@/components/workspace/ProposalsContext';
import { createProposalFromLead, getTemplateById, type CompanyInfo } from '@/lib/mock/proposals';
import type { SearchApplication } from '@/lib/mock/applications';
import { getProfile } from '@/lib/api/client';

const statusVariant: Record<SearchApplication['status'], 'success' | 'warning' | 'danger' | 'neutral'> = {
  Approved: 'success',
  Pending: 'warning',
  Refused: 'danger',
  Withdrawn: 'neutral',
};

const statusIcon: Record<SearchApplication['status'], typeof CheckCircle2> = {
  Approved: CheckCircle2,
  Pending: Clock,
  Refused: XCircle,
  Withdrawn: Ban,
};

const documentTypeLabels: Record<string, string> = {
  planning: 'Planning documents',
  drawing: 'Drawings',
  supporting: 'Supporting information',
};

interface ApplicationDetailContentProps {
  application: SearchApplication;
}

export function ApplicationDetailContent({ application: app }: ApplicationDetailContentProps) {
  const [addLeadOpen, setAddLeadOpen] = useState(false);
  const [templateModalOpen, setTemplateModalOpen] = useState(false);
  const { leads } = useLeads();
  const { addProposal } = useProposals();
  const router = useRouter();
  const StatusIcon = statusIcon[app.status];

  const existingLead = leads.find((l) => l.applicationId === app.id);

  const handleTemplateSelect = async (templateId: string) => {
    if (!existingLead) return;
    const template = getTemplateById(templateId);
    if (!template) return;

    const profile = await getProfile();
    const companyInfo: CompanyInfo = profile
      ? {
          companyName: profile.companyName || '',
          companyAddress: [
            profile.addressLine1,
            profile.addressLine2,
            profile.city,
            profile.postcode,
          ]
            .filter(Boolean)
            .join(', '),
          companyPhone: profile.companyPhone || '',
          companyEmail: profile.companyEmail || '',
          companyVatNumber: profile.vatNumber || '',
        }
      : {};

    const newProposal = createProposalFromLead(existingLead, template, companyInfo);
    addProposal(newProposal);
    setTemplateModalOpen(false);
    router.push(`/app/proposals/${newProposal.id}`);
  };

  const details = [
    { label: 'Received', value: app.dateReceived, icon: Calendar },
    { label: 'Status', value: app.status, icon: StatusIcon },
    { label: 'Decision', value: app.decision, icon: CheckCircle2 },
    { label: 'Council', value: app.council, icon: Building2 },
    { label: 'Application type', value: app.applicationType, icon: FileText },
    ...(app.estimatedValue
      ? [{ label: 'Estimated value', value: app.estimatedValue, icon: PoundSterling }]
      : []),
  ];

  const docsByType = app.documents.reduce<Record<string, typeof app.documents>>((acc, doc) => {
    if (!acc[doc.type]) acc[doc.type] = [];
    acc[doc.type].push(doc);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        href="/app/search"
        className="inline-flex items-center gap-1.5 font-sans text-sm font-medium text-primary-500 hover:text-primary-900 transition-colors"
      >
        <ArrowLeft size={16} /> Back to applications
      </Link>

      {/* Title and reference */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-primary-900 text-h2">{app.title}</h1>
          <p className="font-mono text-sm text-primary-400 mt-1">{app.reference}</p>
        </div>
        <Badge variant={statusVariant[app.status]} className="shrink-0">
          <StatusIcon size={12} /> {app.status}
        </Badge>
      </div>

      {/* Address */}
      <div className="flex items-center gap-1.5 font-sans text-sm text-primary-600">
        <MapPin size={15} className="shrink-0 text-primary-400" />
        {app.address}, {app.postcode}
      </div>

      <div className="h-px bg-primary-200" />

      {/* Application details */}
      <section>
        <h2 className="font-sans font-semibold text-primary-900 text-base mb-4">Application details</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {details.map((d) => {
            const Icon = d.icon;
            return (
              <div key={d.label} className="rounded-lg border border-primary-200 bg-white p-4">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Icon size={12} className="text-primary-400" />
                  <p className="font-sans text-xs font-semibold text-primary-400 uppercase tracking-wider">{d.label}</p>
                </div>
                <p className="font-sans text-sm font-medium text-primary-900">{d.value}</p>
              </div>
            );
          })}
        </div>
      </section>

      <div className="h-px bg-primary-200" />

      {/* Description */}
      <section>
        <h2 className="font-sans font-semibold text-primary-900 text-base mb-3">Description</h2>
        <Card padding="md">
          <p className="font-sans text-sm text-primary-600 leading-relaxed">{app.description}</p>
        </Card>
      </section>

      <div className="h-px bg-primary-200" />

      {/* Location */}
      <section>
        <h2 className="font-sans font-semibold text-primary-900 text-base mb-3">Location</h2>
        {app.lat !== 0 || app.lng !== 0 ? (
          <SingleMarkerMap lat={app.lat} lng={app.lng} label={app.title} address={`${app.address}, ${app.postcode}`} />
        ) : (
          <Card padding="md">
            <p className="font-sans text-sm text-primary-500 flex items-center gap-1.5">
              <MapPin size={14} className="text-primary-400 shrink-0" />
              {app.address}{app.postcode ? `, ${app.postcode}` : ''}
            </p>
          </Card>
        )}
      </section>

      <div className="h-px bg-primary-200" />

      {/* Application Intelligence */}
      <ApplicationIntelligence application={app} />

      <div className="h-px bg-primary-200" />

      {/* Documents */}
      <section>
        <h2 className="font-sans font-semibold text-primary-900 text-base mb-4">Documents</h2>
        {app.documents.length === 0 && (app.documentsUrl || app.infoUrl) ? (
          <Card padding="md">
            <p className="font-sans text-sm text-primary-500">
              Document bundles aren’t stored in PlanningIndex — view the full file on the council portal.
            </p>
            <a
              href={app.documentsUrl || app.infoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-sans text-sm font-medium text-accent-600 hover:text-accent-700 transition-colors mt-2"
            >
              <ExternalLink size={14} /> Open council documents
            </a>
          </Card>
        ) : (
        <div className="space-y-4">
          {Object.entries(docsByType).map(([type, docs]) => (
            <div key={type}>
              <p className="font-sans text-xs font-semibold text-primary-400 uppercase tracking-wider mb-2">
                {documentTypeLabels[type] || type}
              </p>
              <div className="space-y-2">
                {docs.map((doc) => (
                  <div key={doc.name} className="flex items-center gap-3 rounded-lg border border-primary-200 bg-white p-3 hover:border-primary-300 transition-colors">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary-50 shrink-0">
                      <FileText size={14} className="text-primary-600" />
                    </div>
                    <span className="flex-1 font-sans text-sm font-medium text-primary-800">{doc.name}</span>
                    <span className="font-sans text-xs text-primary-400">{doc.size}</span>
                    <button className="text-primary-400 hover:text-primary-700 transition-colors" aria-label={`Download ${doc.name}`}>
                      <Download size={15} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        )}
      </section>

      <div className="h-px bg-primary-200" />

      {/* CRM Actions */}
      <section>
        <h2 className="font-sans font-semibold text-primary-900 text-base mb-4">CRM</h2>
        <div className="flex flex-wrap gap-3">
          <Button variant="primary" leftIcon={<Plus size={15} />} onClick={() => setAddLeadOpen(true)}>
            Add to Leads
          </Button>
          <Button
            variant="outline"
            leftIcon={<Send size={15} />}
            onClick={() => {
              if (existingLead) {
                setTemplateModalOpen(true);
              } else {
                setAddLeadOpen(true);
              }
            }}
          >
            {existingLead ? 'Create Proposal' : 'Add to Leads First'}
          </Button>
        </div>
      </section>

      <AddLeadModal open={addLeadOpen} onClose={() => setAddLeadOpen(false)} application={app} />

      {existingLead && (
        <TemplateSelectorModal
          open={templateModalOpen}
          onClose={() => setTemplateModalOpen(false)}
          onSelect={handleTemplateSelect}
          lead={existingLead}
        />
      )}
    </div>
  );
}
