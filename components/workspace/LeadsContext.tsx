'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { mockLeads, type Lead, type LeadStatus } from '@/lib/mock/leads';

interface LeadsContextValue {
  leads: Lead[];
  addLead: (lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) => Lead;
  updateLead: (id: string, updates: Partial<Lead>) => void;
  deleteLead: (id: string) => void;
  getLeadById: (id: string) => Lead | undefined;
  moveLead: (id: string, status: LeadStatus) => void;
}

const LeadsContext = createContext<LeadsContextValue | null>(null);

export function useLeads() {
  const ctx = useContext(LeadsContext);
  if (!ctx) throw new Error('useLeads must be used within LeadsProvider');
  return ctx;
}

export function LeadsProvider({ children }: { children: ReactNode }) {
  const [leads, setLeads] = useState<Lead[]>(mockLeads);

  const addLead = useCallback((leadData: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>): Lead => {
    const now = new Date().toISOString();
    const newLead = {
      ...leadData,
      id: `lead-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    } as Lead;
    setLeads((prev) => [newLead, ...prev]);
    return newLead;
  }, []);

  const updateLead = useCallback((id: string, updates: Partial<Lead>) => {
    setLeads((prev) =>
      prev.map((lead) =>
        lead.id === id ? { ...lead, ...updates, updatedAt: new Date().toISOString() } : lead
      )
    );
  }, []);

  const deleteLead = useCallback((id: string) => {
    setLeads((prev) => prev.filter((lead) => lead.id !== id));
  }, []);

  const getLeadById = useCallback((id: string) => leads.find((lead) => lead.id === id), [leads]);

  const moveLead = useCallback((id: string, status: LeadStatus) => {
    setLeads((prev) =>
      prev.map((lead) =>
        lead.id === id ? { ...lead, status, updatedAt: new Date().toISOString() } : lead
      )
    );
  }, []);

  return (
    <LeadsContext.Provider value={{ leads, addLead, updateLead, deleteLead, getLeadById, moveLead }}>
      {children}
    </LeadsContext.Provider>
  );
}
