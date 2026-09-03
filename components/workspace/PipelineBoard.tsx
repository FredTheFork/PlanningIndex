'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { Card, Badge } from '@/components/ui';
import { useLeads } from '@/components/workspace/LeadsContext';
import { pipelineStages, getPipelineSummary, type Lead, type LeadStatus } from '@/lib/mock/leads';

interface PipelineBoardProps {
  onLeadClick?: (lead: Lead) => void;
}

export function PipelineBoard({ onLeadClick }: PipelineBoardProps) {
  const { leads, moveLead } = useLeads();
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverStage, setDragOverStage] = useState<LeadStatus | null>(null);

  const summary = useMemo(() => getPipelineSummary(leads), [leads]);

  const leadsByStage = useMemo(() => {
    const map: Record<string, Lead[]> = {};
    pipelineStages.forEach((s) => {
      map[s.stage] = leads.filter((l) => l.status === s.stage);
    });
    return map;
  }, [leads]);

  const handleDragStart = (e: React.DragEvent, leadId: string) => {
    setDraggedId(leadId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDraggedId(null);
    setDragOverStage(null);
  };

  const handleDragOver = (e: React.DragEvent, stage: LeadStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverStage(stage);
  };

  const handleDragLeave = (e: React.DragEvent, stage: LeadStatus) => {
    if (dragOverStage === stage) {
      setDragOverStage(null);
    }
  };

  const handleDrop = (e: React.DragEvent, stage: LeadStatus) => {
    e.preventDefault();
    if (draggedId) {
      moveLead(draggedId, stage);
    }
    setDraggedId(null);
    setDragOverStage(null);
  };

  return (
    <div className="space-y-6">
      {/* Summary bar */}
      <div className="flex flex-wrap items-center gap-6 rounded-xl border border-primary-200 bg-white px-6 py-4">
        <div>
          <p className="text-label text-primary-400">Pipeline value</p>
          <p className="font-display font-bold text-primary-900 text-xl mt-0.5">{summary.totalValue}</p>
        </div>
        <div className="h-8 w-px bg-primary-200" />
        <div>
          <p className="text-label text-primary-400">Win rate</p>
          <p className="font-display font-bold text-primary-900 text-xl mt-0.5">{summary.winRate}</p>
        </div>
        <div className="h-8 w-px bg-primary-200" />
        <div>
          <p className="text-label text-primary-400">Active leads</p>
          <p className="font-display font-bold text-primary-900 text-xl mt-0.5">{summary.activeLeads}</p>
        </div>
        <div className="h-8 w-px bg-primary-200" />
        <div>
          <p className="text-label text-primary-400">Won</p>
          <p className="font-display font-bold text-emerald-600 text-xl mt-0.5">{summary.wonCount}</p>
        </div>
        <div className="h-8 w-px bg-primary-200" />
        <div>
          <p className="text-label text-primary-400">Lost</p>
          <p className="font-display font-bold text-danger-600 text-xl mt-0.5">{summary.lostCount}</p>
        </div>
      </div>

      {/* Board */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-max">
          {pipelineStages.map((stageConfig) => {
            const stageLeads = leadsByStage[stageConfig.stage] || [];
            const isDragOver = dragOverStage === stageConfig.stage;

            return (
              <div
                key={stageConfig.stage}
                className={`w-72 shrink-0 rounded-xl border-2 transition-colors ${
                  isDragOver
                    ? 'border-accent-400 bg-accent-50/30'
                    : 'border-primary-200 bg-primary-50/50'
                }`}
                onDragOver={(e) => handleDragOver(e, stageConfig.stage)}
                onDragLeave={(e) => handleDragLeave(e, stageConfig.stage)}
                onDrop={(e) => handleDrop(e, stageConfig.stage)}
              >
                {/* Column header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-primary-200">
                  <div className="flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${stageConfig.color}`} />
                    <span className="font-sans font-semibold text-primary-900 text-sm">{stageConfig.label}</span>
                  </div>
                  <span className="rounded-full bg-primary-200 px-2 py-0.5 font-sans text-xs font-semibold text-primary-600">
                    {stageLeads.length}
                  </span>
                </div>

                {/* Cards */}
                <div className="p-2 space-y-2 min-h-[120px]">
                  {stageLeads.map((lead) => (
                    <div
                      key={lead.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, lead.id)}
                      onDragEnd={handleDragEnd}
                      onClick={() => onLeadClick?.(lead)}
                      className={`cursor-pointer rounded-lg border border-primary-200 bg-white p-3 transition-all hover:shadow-card-hover ${
                        draggedId === lead.id ? 'opacity-40' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-sans font-semibold text-primary-900 text-sm leading-tight line-clamp-2">
                          {lead.propertyAddress}
                        </p>
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-900 shrink-0">
                          <span className="font-sans text-[10px] font-semibold text-white">
                            {lead.contactName.split(' ').map(n => n.charAt(0)).slice(0, 2).join('')}
                          </span>
                        </div>
                      </div>
                      <p className="font-mono text-[10px] text-primary-400 mt-1.5">{lead.applicationReference}</p>
                      <p className="font-sans text-xs text-primary-500 mt-1 flex items-center gap-1">
                        <MapPin size={10} className="shrink-0" /> {lead.propertyPostcode}
                      </p>
                      <div className="flex items-center justify-between mt-2.5">
                        <span className="font-sans text-sm font-bold text-primary-700">{lead.estimatedValue}</span>
                        <span className={`h-2 w-2 rounded-full ${stageConfig.dotColor}`} />
                      </div>
                    </div>
                  ))}

                  {stageLeads.length === 0 && (
                    <div className={`flex items-center justify-center py-8 text-center ${isDragOver ? 'border-2 border-dashed border-accent-400 rounded-lg' : ''}`}>
                      <p className="font-sans text-xs text-primary-300">No leads</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
