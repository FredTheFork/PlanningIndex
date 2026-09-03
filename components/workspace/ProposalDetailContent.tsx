'use client';

import { useProposals } from '@/components/workspace/ProposalsContext';
import { ProposalEditor } from '@/components/workspace/ProposalEditor';

interface ProposalDetailContentProps {
  proposalId: string;
}

export function ProposalDetailContent({ proposalId }: ProposalDetailContentProps) {
  const { getProposalById } = useProposals();
  const proposal = getProposalById(proposalId);

  if (!proposal) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <p className="font-sans text-sm text-primary-500 mb-4">Proposal not found.</p>
      </div>
    );
  }

  return <ProposalEditor proposal={proposal} />;
}
