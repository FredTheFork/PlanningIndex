import { notFound } from 'next/navigation';
import { mockProposals } from '@/lib/mock/proposals';
import { ProposalDetailContent } from '@/components/workspace/ProposalDetailContent';

interface PageProps {
  params: { id: string };
}

export function generateStaticParams() {
  return mockProposals.map((p) => ({ id: p.id }));
}

export default function ProposalDetailPage({ params }: PageProps) {
  const exists = mockProposals.some((p) => p.id === params.id);
  if (!exists) notFound();

  return <ProposalDetailContent proposalId={params.id} />;
}
