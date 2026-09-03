'use client';

import type { Proposal, ProposalSection } from '@/lib/mock/proposals';

interface ProposalDocumentPreviewProps {
  proposal: Proposal;
  className?: string;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

function formatCurrency(value: number): string {
  return `\u00A3${value.toLocaleString('en-GB')}`;
}

export function ProposalDocumentPreview({ proposal, className = '' }: ProposalDocumentPreviewProps) {
  const sortedSections = [...proposal.sections].sort((a, b) => a.order - b.order);
  const pricingSection = proposal.sections.find((s) => s.type === 'pricing');
  const lineItems = pricingSection?.lineItems || [];
  const subtotal = lineItems.reduce((sum, item) => sum + item.total, 0);
  const hasVat = Boolean(proposal.companyVatNumber);
  const vatAmount = hasVat ? Math.round(subtotal * 0.2) : 0;
  const grandTotal = subtotal + vatAmount;

  const renderSection = (section: ProposalSection) => {
    if (section.type === 'pricing' || section.type === 'products_services') {
      if (!section.lineItems || section.lineItems.length === 0) return null;
      return (
        <div key={section.id} className="mb-6">
          <h3 className="font-sans font-bold text-primary-900 text-sm mb-2">{section.title}</h3>
          {section.content && (
            <p className="font-sans text-xs text-primary-500 mb-3 leading-relaxed">{section.content}</p>
          )}
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-2 pr-2 font-sans text-[10px] font-semibold text-primary-400 uppercase tracking-wider">Description</th>
                <th className="text-right py-2 px-1 font-sans text-[10px] font-semibold text-primary-400 uppercase tracking-wider">Qty</th>
                <th className="text-right py-2 px-1 font-sans text-[10px] font-semibold text-primary-400 uppercase tracking-wider">Unit</th>
                <th className="text-right py-2 pl-2 font-sans text-[10px] font-semibold text-primary-400 uppercase tracking-wider">Total</th>
              </tr>
            </thead>
            <tbody>
              {section.lineItems.map((item) => (
                <tr key={item.id} className="border-b border-slate-100">
                  <td className="py-2 pr-2 font-sans text-xs text-primary-700">{item.description}</td>
                  <td className="py-2 px-1 text-right font-sans text-xs text-primary-700">{item.quantity}</td>
                  <td className="py-2 px-1 text-right font-sans text-xs text-primary-700">{formatCurrency(item.unitPrice)}</td>
                  <td className="py-2 pl-2 text-right font-sans text-xs font-semibold text-primary-900">{formatCurrency(item.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    return (
      <div key={section.id} className="mb-6">
        <h3 className="font-sans font-bold text-primary-900 text-sm mb-2">{section.title}</h3>
        {section.content && (
          <p className="font-sans text-xs text-primary-600 leading-relaxed whitespace-pre-wrap">{section.content}</p>
        )}
      </div>
    );
  };

  return (
    <div className={`bg-slate-100 rounded-xl p-4 sm:p-6 overflow-y-auto ${className}`}>
      <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8 max-w-[680px] mx-auto" style={{ minHeight: '400px' }}>
        <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-4">
          <div className="flex items-center gap-2">
            {proposal.companyName ? (
              <>
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary-900 shrink-0">
                  <span className="font-sans font-bold text-[10px] text-white">
                    {proposal.companyName.split(' ').map(w => w.charAt(0)).slice(0, 2).join('')}
                  </span>
                </div>
                <div>
                  <p className="font-sans font-bold text-sm text-primary-900">{proposal.companyName}</p>
                  {proposal.companyEmail && (
                    <p className="font-sans text-[10px] text-slate-400">{proposal.companyEmail}</p>
                  )}
                </div>
              </>
            ) : (
              <p className="font-sans font-bold text-sm text-primary-900">Your Company Name</p>
            )}
          </div>
          <p className="font-sans text-[10px] text-slate-400">{formatDate(proposal.updatedDate)}</p>
        </div>

        <div className="mb-6">
          <p className="font-sans text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Proposal for</p>
          <p className="font-sans font-semibold text-sm text-primary-900">{proposal.recipientName || 'Recipient name'}</p>
          <p className="font-sans text-xs text-slate-500 leading-relaxed">
            {proposal.recipientAddress || 'Address'}<br />
            {proposal.recipientPostcode || 'Postcode'}
          </p>
        </div>

        <div className="mb-6 pb-4 border-b border-slate-100">
          <p className="font-sans text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Project</p>
          <p className="font-sans text-xs text-primary-800 leading-relaxed">{proposal.projectTitle || 'Project title'}</p>
          {proposal.projectReference && (
            <p className="font-mono text-[10px] text-slate-400 mt-1">Ref: {proposal.projectReference}</p>
          )}
        </div>

        {sortedSections.filter(s => s.type !== 'pricing' && s.type !== 'products_services').map(renderSection)}

        {(() => {
          const psSection = proposal.sections.find(s => s.type === 'products_services');
          return psSection ? renderSection(psSection) : null;
        })()}

        {(() => {
          const pSection = proposal.sections.find(s => s.type === 'pricing');
          return pSection ? renderSection(pSection) : null;
        })()}

        {lineItems.length > 0 && (
          <div className="mt-4 ml-auto max-w-[240px]">
            <div className="flex justify-between py-1">
              <span className="font-sans text-xs text-slate-500">Subtotal</span>
              <span className="font-sans text-xs font-medium text-primary-900">{formatCurrency(subtotal)}</span>
            </div>
            {hasVat && (
              <div className="flex justify-between py-1">
                <span className="font-sans text-xs text-slate-500">VAT (20%)</span>
                <span className="font-sans text-xs font-medium text-primary-900">{formatCurrency(vatAmount)}</span>
              </div>
            )}
            <div className="flex justify-between py-2 border-t border-slate-200 mt-1">
              <span className="font-sans text-sm font-bold text-primary-900">Total</span>
              <span className="font-sans text-sm font-bold text-primary-900">{formatCurrency(grandTotal)}</span>
            </div>
          </div>
        )}

        <div className="mt-8 pt-4 border-t border-slate-100">
          <div className="flex items-end justify-between">
            <div>
              <p className="font-sans text-[10px] text-slate-400">Accepted by</p>
              <div className="mt-1 h-6 w-24 border-b border-slate-300" />
              <p className="mt-1 font-sans text-[10px] text-slate-400">Signature</p>
            </div>
            <div>
              <p className="font-sans text-[10px] text-slate-400">Date</p>
              <div className="mt-1 h-6 w-16 border-b border-slate-300" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
