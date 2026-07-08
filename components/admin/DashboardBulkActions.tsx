'use client';

import { Download, Send, CheckCircle2, X } from 'lucide-react';
import type { ClientRow } from '@/lib/admin/dashboard-queries';

interface DashboardBulkActionsProps {
  selectedClients: ClientRow[];
  onClearSelection: () => void;
  onExportSelected: () => void;
  onBulkMessage?: () => void;
  onBulkMarkDelivered?: () => void;
}

export default function DashboardBulkActions({
  selectedClients,
  onClearSelection,
  onExportSelected,
  onBulkMessage,
  onBulkMarkDelivered,
}: DashboardBulkActionsProps) {
  if (selectedClients.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-[#1B3F7A] text-white rounded-lg shadow-lg px-4 py-3 flex items-center gap-3 z-50">
      <span className="font-inter text-xs font-medium">
        {selectedClients.length} selected
      </span>

      <div className="h-3 w-px bg-white/30" />

      <button
        onClick={onExportSelected}
        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-white/20 hover:bg-white/30 rounded text-xs font-inter font-medium transition-colors"
      >
        <Download size={14} />
        Export CSV
      </button>

      {onBulkMessage && (
        <button
          onClick={onBulkMessage}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-white/20 hover:bg-white/30 rounded text-xs font-inter font-medium transition-colors"
        >
          <Send size={14} />
          Send Reminder
        </button>
      )}

      {onBulkMarkDelivered && selectedClients.some(c => c.delivery_status !== 'delivered') && (
        <button
          onClick={onBulkMarkDelivered}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-white/20 hover:bg-white/30 rounded text-xs font-inter font-medium transition-colors"
        >
          <CheckCircle2 size={14} />
          Mark Delivered
        </button>
      )}

      <button
        onClick={onClearSelection}
        className="inline-flex items-center gap-1 px-2 py-1.5 hover:bg-white/20 rounded text-xs font-inter transition-colors"
        aria-label="Clear selection"
      >
        <X size={14} />
      </button>
    </div>
  );
}
