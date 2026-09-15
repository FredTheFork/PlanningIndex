'use client';

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import type { Proposal, ProposalStatus } from '@/lib/mock/proposals';
import type { LeadActivity } from '@/lib/mock/lead-activity';
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
  const { setActivitiesFromServer } = useLeads();
  const [proposals, setProposals] = useState<Proposal[]>([]);

  // Initial load from the backend (Phase 43 — Proposal integration).
  useEffect(() => {
    let cancelled = false;
    fetch('/api/proposals', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : { proposals: [] }))
      .then((data) => {
        if (!cancelled) setProposals(data.proposals ?? []);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const refreshActivities = useCallback(() => {
    fetch('/api/activities', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : { activities: [] }))
      .then((data) => setActivitiesFromServer(data.activities ?? []))
      .catch(() => {});
  }, [setActivitiesFromServer]);

  const addProposal = useCallback(
    (proposal: Proposal) => {
      setProposals((prev) => [proposal, ...prev]);
      fetch('/api/proposals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(proposal),
      })
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => {
          if (data?.proposal) {
            setProposals((prev) =>
              prev.map((p) => (p.id === proposal.id ? data.proposal : p))
            );
          }
          refreshActivities(); // server records the 'proposal_created' activity
        })
        .catch(() => {});
    },
    [refreshActivities]
  );

  const updateProposal = useCallback((id: string, updates: Partial<Proposal>) => {
    setProposals((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates, updatedDate: new Date().toISOString() } : p))
    );
    fetch(`/api/proposals/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.proposal) {
          setProposals((prev) => prev.map((p) => (p.id === id ? data.proposal : p)));
        }
      })
      .catch(() => {});
  }, []);

  const deleteProposal = useCallback((id: string) => {
    setProposals((prev) => prev.filter((p) => p.id !== id));
    fetch(`/api/proposals/${id}`, { method: 'DELETE' }).catch(() => {});
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
      setProposals((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));
      // The server owns the send/delivery state machine and the lifecycle
      // activities (proposal_sent / proposal_delivered).
      fetch(`/api/proposals/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => {
          if (data?.proposal) {
            setProposals((prev) => prev.map((p) => (p.id === id ? data.proposal : p)));
          }
          refreshActivities();
        })
        .catch(() => {});
    },
    [refreshActivities]
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
