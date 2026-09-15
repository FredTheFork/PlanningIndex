'use client';

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import type { Proposal, ProposalStatus } from '@/lib/mock/proposals';
import type { LeadActivity } from '@/lib/mock/lead-activity';
import { useLeads } from '@/components/workspace/LeadsContext';

export type LoadStatus = 'loading' | 'ready' | 'error';

export interface SendRecipient {
  recipientName?: string;
  recipientAddress?: string;
  recipientPostcode?: string;
}

interface ProposalsContextValue {
  proposals: Proposal[];
  status: LoadStatus;
  retry: () => void;
  addProposal: (proposal: Proposal) => void;
  updateProposal: (id: string, updates: Partial<Proposal>) => void;
  deleteProposal: (id: string) => void;
  getProposalById: (id: string) => Proposal | undefined;
  getProposalsByLeadId: (leadId: string) => Proposal[];
  updateProposalStatus: (id: string, status: ProposalStatus) => void;
  sendProposal: (id: string, recipient?: SendRecipient) => Promise<Proposal>;
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
  const [status, setStatus] = useState<LoadStatus>('loading');
  const [reloadToken, setReloadToken] = useState(0);

  // Initial load from the backend (Phase 43 — Proposal integration).
  useEffect(() => {
    let cancelled = false;
    setStatus('loading');
    fetch('/api/proposals', { cache: 'no-store' })
      .then((r) => {
        if (!r.ok) throw new Error(String(r.status));
        return r.json();
      })
      .then((data) => {
        if (!cancelled) {
          setProposals(data.proposals ?? []);
          setStatus('ready');
        }
      })
      .catch(() => {
        if (!cancelled) setStatus('error');
      });
    return () => {
      cancelled = true;
    };
  }, [reloadToken]);

  const retry = useCallback(() => setReloadToken((t) => t + 1), []);

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
    (id: string, proposalStatus: ProposalStatus) => {
      setProposals((prev) => prev.map((p) => (p.id === id ? { ...p, status: proposalStatus } : p)));
      // The server owns the send/delivery state machine and the lifecycle
      // activities (proposal_sent / proposal_delivered).
      fetch(`/api/proposals/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: proposalStatus }),
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

  /**
   * Phase 44 — physical mail. All provider complexity lives behind
   * POST /api/proposals/[id]/send; this returns the server's resulting
   * state, or throws a user-safe error message for the UI to display.
   */
  const sendProposal = useCallback(
    async (id: string, recipient?: SendRecipient): Promise<Proposal> => {
      // Optimistic: show the proposal as being processed while dispatch runs.
      setProposals((prev) =>
        prev.map((p) => (p.id === id && (p.status === 'Draft' || p.status === 'Ready') ? { ...p, status: 'Processing' } : p))
      );

      const res = await fetch(`/api/proposals/${id}/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(recipient ?? {}),
      });
      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.proposal) {
        // Dispatch failed — restore the previous status so the UI reflects
        // that nothing was sent.
        setProposals((prev) =>
          prev.map((p) => (p.id === id && p.status === 'Processing' ? { ...p, status: 'Ready' } : p))
        );
        throw new Error(data?.error ?? 'We could not send this proposal. Please try again in a moment.');
      }

      setProposals((prev) => prev.map((p) => (p.id === id ? data.proposal : p)));
      refreshActivities();
      return data.proposal as Proposal;
    },
    [refreshActivities]
  );

  return (
    <ProposalsContext.Provider
      value={{
        proposals,
        status,
        retry,
        addProposal,
        updateProposal,
        deleteProposal,
        getProposalById,
        getProposalsByLeadId,
        updateProposalStatus,
        sendProposal,
      }}
    >
      {children}
    </ProposalsContext.Provider>
  );
}
