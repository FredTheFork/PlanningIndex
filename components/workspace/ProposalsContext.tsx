'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { mockProposals, type Proposal, type ProposalStatus } from '@/lib/mock/proposals';
import { useLeads } from '@/components/workspace/LeadsContext';

interface ProposalsContextValue {
  proposals: Proposal[];
  addProposal: (proposal: Proposal) => void;
  updateProposal: (id: string, updates: Partial<Proposal>) => void;
  deleteProposal: (id: string) => void;
  getProposalById: (id: string) => Proposal | undefined;
  getProposalsByLeadId: (leadId: string) => Proposal[];
  updateProposalStatus: (id: string, status: ProposalStatus) => void;
}

const ProposalsContext = createContext<ProposalsContextValue | null>(null);

export function useProposals() {
  const ctx = useContext(ProposalsContext);
  if (!ctx) throw new Error('useProposals must be used within ProposalsProvider');
  return ctx;
}

export function ProposalsProvider({ children }: { children: ReactNode }) {
  const { addActivity } = useLeads();
  const [proposals, setProposals] = useState<Proposal[]>(mockProposals);

  const addProposal = useCallback((proposal: Proposal) => {
    setProposals((prev) => [proposal, ...prev]);
    addActivity(
      proposal.leadId,
      'proposal_created',
      'Proposal created',
      `${proposal.reference} — ${proposal.projectTitle}`,
      'file'
    );
  }, [addActivity]);

  const updateProposal = useCallback((id: string, updates: Partial<Proposal>) => {
    setProposals((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, ...updates, updatedDate: new Date().toISOString() } : p
      )
    );
  }, []);

  const deleteProposal = useCallback((id: string) => {
    setProposals((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const getProposalById = useCallback(
    (id: string) => proposals.find((p) => p.id === id),
    [proposals]
  );

  const getProposalsByLeadId = useCallback(
    (leadId: string) => proposals.filter((p) => p.leadId === leadId),
    [proposals]
  );

  const updateProposalStatus = useCallback(
    (id: string, status: ProposalStatus) => {
      setProposals((prev) => {
        const proposal = prev.find((p) => p.id === id);
        if (!proposal) return prev;

        const now = new Date().toISOString();
        const updates: Partial<Proposal> = { status, updatedDate: now };

        if (status === 'Sent' && !proposal.sentDate) {
          updates.sentDate = now;
          updates.trackingNumber = `RM-TRK-${Math.floor(Math.random() * 900000 + 100000)}`;
          updates.deliveryIssueReason = null;
          const estDate = new Date();
          estDate.setDate(estDate.getDate() + 3);
          updates.estimatedDeliveryDate = estDate.toISOString();
          addActivity(
            proposal.leadId,
            'proposal_sent',
            'Proposal sent by post',
            `${proposal.reference} sent to ${proposal.recipientAddress}`,
            'send'
          );
        }
        if (status === 'Mailed' && !proposal.mailedDate) {
          updates.mailedDate = now;
        }
        if (status === 'Delivered' && !proposal.deliveredDate) {
          updates.deliveredDate = now;
          addActivity(
            proposal.leadId,
            'proposal_delivered',
            'Proposal delivered',
            `${proposal.reference} delivered to ${proposal.recipientAddress}`,
            'package'
          );
        }

        return prev.map((p) =>
          p.id === id ? { ...p, ...updates } : p
        );
      });
    },
    [addActivity]
  );

  return (
    <ProposalsContext.Provider
      value={{
        proposals,
        addProposal,
        updateProposal,
        deleteProposal,
        getProposalById,
        getProposalsByLeadId,
        updateProposalStatus,
      }}
    >
      {children}
    </ProposalsContext.Provider>
  );
}
