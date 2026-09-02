import { FileText, Mail, Clock, CheckCircle2, AlertCircle, Package, Send } from 'lucide-react';
import { Card, Badge } from '@/components/ui';
import type { MockProposal } from '@/lib/mock/workspace';

const statusConfig: Record<
  MockProposal['status'],
  { variant: 'neutral' | 'info' | 'warning' | 'danger' | 'success'; icon: typeof FileText }
> = {
  Draft: { variant: 'neutral', icon: FileText },
  Ready: { variant: 'info', icon: CheckCircle2 },
  Sent: { variant: 'info', icon: Send },
  Processing: { variant: 'warning', icon: Clock },
  Mailed: { variant: 'info', icon: Package },
  Delivered: { variant: 'success', icon: CheckCircle2 },
  'Delivery issue': { variant: 'warning', icon: AlertCircle },
  Undeliverable: { variant: 'danger', icon: AlertCircle },
};

interface ProposalStatusListProps {
  proposals: MockProposal[];
}

export function ProposalStatusList({ proposals }: ProposalStatusListProps) {
  if (proposals.length === 0) {
    return (
      <Card padding="md">
        <p className="font-sans text-sm text-primary-500 text-center py-4">
          No proposals yet. Create your first proposal from a lead.
        </p>
      </Card>
    );
  }

  return (
    <Card padding="none" className="overflow-hidden">
      {proposals.map((proposal, i) => {
        const config = statusConfig[proposal.status];
        const Icon = config.icon;
        return (
          <div
            key={proposal.id}
            className={`flex items-center gap-3 px-5 py-4 ${
              i < proposals.length - 1 ? 'border-b border-primary-100' : ''
            }`}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 shrink-0">
              <Icon size={15} className="text-primary-600" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="font-sans font-medium text-primary-900 text-sm truncate">
                  {proposal.recipient}
                </p>
                <span className="font-mono text-xs text-primary-400">{proposal.reference}</span>
              </div>
              <p className="font-sans text-xs text-primary-400 mt-0.5 truncate">{proposal.property}</p>
            </div>
            <div className="flex flex-col items-end gap-1 shrink-0">
              <Badge variant={config.variant}>{proposal.status}</Badge>
              <span className="font-sans text-xs text-primary-400">
                {proposal.sentDate ? `Sent ${proposal.sentDate}` : `Created ${proposal.createdDate}`}
              </span>
            </div>
          </div>
        );
      })}
    </Card>
  );
}
