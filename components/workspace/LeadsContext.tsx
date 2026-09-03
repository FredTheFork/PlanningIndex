'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { mockLeads, type Lead, type LeadStatus } from '@/lib/mock/leads';
import { mockActivities, type LeadActivity, type ActivityType, type ActivityIcon, createActivityEntry } from '@/lib/mock/lead-activity';

interface LeadsContextValue {
  leads: Lead[];
  activities: LeadActivity[];
  addLead: (lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) => Lead;
  updateLead: (id: string, updates: Partial<Lead>) => void;
  deleteLead: (id: string) => void;
  getLeadById: (id: string) => Lead | undefined;
  moveLead: (id: string, status: LeadStatus) => void;
  addActivity: (leadId: string, type: ActivityType, title: string, description: string, icon: ActivityIcon) => LeadActivity;
  getActivityByLeadId: (leadId: string) => LeadActivity[];
}

const LeadsContext = createContext<LeadsContextValue | null>(null);

export function useLeads() {
  const ctx = useContext(LeadsContext);
  if (!ctx) throw new Error('useLeads must be used within LeadsProvider');
  return ctx;
}

export function LeadsProvider({ children }: { children: ReactNode }) {
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [activities, setActivities] = useState<LeadActivity[]>(mockActivities);

  const addActivity = useCallback(
    (leadId: string, type: ActivityType, title: string, description: string, icon: ActivityIcon): LeadActivity => {
      const entry = createActivityEntry(leadId, type, title, description, icon);
      setActivities((prev) => [entry, ...prev]);
      return entry;
    },
    []
  );

  const getActivityByLeadId = useCallback(
    (leadId: string): LeadActivity[] =>
      activities
        .filter((a) => a.leadId === leadId)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
    [activities]
  );

  const addLead = useCallback((leadData: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>): Lead => {
    const now = new Date().toISOString();
    const newLead = {
      ...leadData,
      id: `lead-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    } as Lead;
    setLeads((prev) => [newLead, ...prev]);
    setActivities((prev) => [
      createActivityEntry(newLead.id, 'lead_added', 'Lead added', 'Added to CRM from planning application', 'plus'),
      ...prev,
    ]);
    return newLead;
  }, []);

  const updateLead = useCallback((id: string, updates: Partial<Lead>) => {
    setLeads((prev) =>
      prev.map((lead) => {
        if (lead.id !== id) return lead;
        const oldStatus = lead.status;
        const newStatus = updates.status ?? oldStatus;
        if (updates.status && oldStatus !== newStatus) {
          setActivities((prevAct) => [
            createActivityEntry(id, 'status_changed', 'Status changed', `${oldStatus} → ${newStatus}`, 'check'),
            ...prevAct,
          ]);
        }
        return { ...lead, ...updates, updatedAt: new Date().toISOString() };
      })
    );
  }, []);

  const deleteLead = useCallback((id: string) => {
    setLeads((prev) => prev.filter((lead) => lead.id !== id));
  }, []);

  const getLeadById = useCallback((id: string) => leads.find((lead) => lead.id === id), [leads]);

  const moveLead = useCallback((id: string, status: LeadStatus) => {
    setLeads((prev) =>
      prev.map((lead) => {
        if (lead.id !== id) return lead;
        if (lead.status !== status) {
          setActivities((prevAct) => [
            createActivityEntry(id, 'status_changed', 'Status changed', `${lead.status} → ${status}`, 'check'),
            ...prevAct,
          ]);
        }
        return { ...lead, status, updatedAt: new Date().toISOString() };
      })
    );
  }, []);

  return (
    <LeadsContext.Provider
      value={{ leads, activities, addLead, updateLead, deleteLead, getLeadById, moveLead, addActivity, getActivityByLeadId }}
    >
      {children}
    </LeadsContext.Provider>
  );
}
