'use client';

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import type { Lead, LeadStatus } from '@/lib/mock/leads';
import type { LeadActivity, ActivityType, ActivityIcon } from '@/lib/mock/lead-activity';

interface LeadsContextValue {
  leads: Lead[];
  activities: LeadActivity[];
  addLead: (lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) => Lead;
  updateLead: (id: string, updates: Partial<Lead>) => void;
  deleteLead: (id: string) => void;
  getLeadById: (id: string) => Lead | undefined;
  moveLead: (id: string, status: LeadStatus) => void;
  addActivity: (
    leadId: string,
    type: ActivityType,
    title: string,
    description: string,
    icon: ActivityIcon
  ) => LeadActivity;
  getActivityByLeadId: (leadId: string) => LeadActivity[];
  setActivitiesFromServer: (activities: LeadActivity[]) => void;
}

const LeadsContext = createContext<LeadsContextValue | null>(null);

export function useLeads() {
  const ctx = useContext(LeadsContext);
  if (!ctx) throw new Error('useLeads must be used within LeadsProvider');
  return ctx;
}

export function LeadsProvider({ children }: { children: ReactNode }) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [activities, setActivities] = useState<LeadActivity[]>([]);

  // Initial load from the backend (Phase 42 — CRM integration).
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [leadsRes, actsRes] = await Promise.all([
          fetch('/api/leads', { cache: 'no-store' }),
          fetch('/api/activities', { cache: 'no-store' }),
        ]);
        const leadsData = leadsRes.ok ? await leadsRes.json() : { leads: [] };
        const actsData = actsRes.ok ? await actsRes.json() : { activities: [] };
        if (!cancelled) {
          setLeads(leadsData.leads ?? []);
          setActivities(actsData.activities ?? []);
        }
      } catch {
        // Network failure — keep empty state; AuthGuard handles logged-out users.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const persistActivity = useCallback(
    (entry: LeadActivity) => {
      fetch('/api/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId: entry.leadId,
          type: entry.type,
          title: entry.title,
          description: entry.description,
          icon: entry.icon,
        }),
      }).catch(() => {});
    },
    []
  );

  const addActivity = useCallback(
    (
      leadId: string,
      type: ActivityType,
      title: string,
      description: string,
      icon: ActivityIcon
    ): LeadActivity => {
      const entry: LeadActivity = {
        id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        leadId,
        type,
        title,
        description,
        timestamp: new Date().toISOString(),
        icon,
      };
      setActivities((prev) => [entry, ...prev]);
      persistActivity(entry);
      return entry;
    },
    [persistActivity]
  );

  const getActivityByLeadId = useCallback(
    (leadId: string): LeadActivity[] =>
      activities
        .filter((a) => a.leadId === leadId)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
    [activities]
  );

  const setActivitiesFromServer = useCallback((next: LeadActivity[]) => {
    setActivities(next);
  }, []);

  const addLead = useCallback(
    (leadData: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>): Lead => {
      const now = new Date().toISOString();
      const optimistic = {
        ...leadData,
        id: `lead-${Date.now()}`,
        createdAt: now,
        updatedAt: now,
      } as Lead;
      setLeads((prev) => [optimistic, ...prev]);
      addActivity(
        optimistic.id,
        'lead_added',
        'Lead added',
        'Added to CRM from planning application',
        'plus'
      );

      fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadData),
      })
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => {
          if (data?.lead) {
            setLeads((prev) => prev.map((l) => (l.id === optimistic.id ? data.lead : l)));
          }
        })
        .catch(() => {});

      return optimistic;
    },
    [addActivity]
  );

  const updateLead = useCallback((id: string, updates: Partial<Lead>) => {
    setLeads((prev) =>
      prev.map((lead) =>
        lead.id === id ? { ...lead, ...updates, updatedAt: new Date().toISOString() } : lead
      )
    );
    fetch(`/api/leads/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.lead) {
          setLeads((prev) => prev.map((l) => (l.id === id ? data.lead : l)));
        }
      })
      .catch(() => {});
  }, []);

  const deleteLead = useCallback((id: string) => {
    setLeads((prev) => prev.filter((lead) => lead.id !== id));
    setActivities((prev) => prev.filter((a) => a.leadId !== id));
    fetch(`/api/leads/${id}`, { method: 'DELETE' }).catch(() => {});
  }, []);

  const getLeadById = useCallback((id: string) => leads.find((l) => l.id === id), [leads]);

  const moveLead = useCallback(
    (id: string, status: LeadStatus) => {
      updateLead(id, { status });
    },
    [updateLead]
  );

  return (
    <LeadsContext.Provider
      value={{
        leads,
        activities,
        addLead,
        updateLead,
        deleteLead,
        getLeadById,
        moveLead,
        addActivity,
        getActivityByLeadId,
        setActivitiesFromServer,
      }}
    >
      {children}
    </LeadsContext.Provider>
  );
}
