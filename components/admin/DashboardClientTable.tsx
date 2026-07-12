'use client';

import { memo, useCallback } from 'react';
import Link from 'next/link';
import {
  Clock, CheckCircle2, AlertTriangle, RefreshCw, Package, Layers, Building2,
  ChevronRight, Mail, Briefcase, FolderOpen, Send, AlertCircle as AlertCircleIcon, Trash2
} from 'lucide-react';
import type { ClientRow } from '@/lib/admin/dashboard-queries';
import type { ServiceTier, IndustryCategory } from '@/lib/services/service-catalog';

interface DashboardClientTableProps {
  clients: ClientRow[];
  selectedIds: Set<string>;
  onSelect: (userId: string) => void;
  onSelectAll: (selectAll: boolean) => void;
  onAction: (userId: string, action: 'reminder' | 'generate-brief' | 'start-delivery' | 'continue') => void;
  generatingBriefFor?: string | null;
  onDeleteClient?: (userId: string, email: string) => void;
}

export default function DashboardClientTable({
  clients,
  selectedIds,
  onSelect,
  onSelectAll,
  onAction,
  generatingBriefFor,
  onDeleteClient,
}: DashboardClientTableProps) {
  const allSelected = clients.length > 0 && clients.every(c => selectedIds.has(c.user_id));
  const someSelected = selectedIds.size > 0;

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto scrollbar-hide">
        <table className="w-full">
          <thead>
            <tr className="bg-[#FAFBFC] border-b border-gray-200">
              <th className="font-inter font-semibold text-[#1B3F7A] text-xs uppercase tracking-wider text-left px-4 py-3 w-10">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={(e) => onSelectAll(e.target.checked)}
                  className="rounded border-gray-300"
                  aria-label="Select all clients"
                />
              </th>
              <th className="font-inter font-semibold text-[#1B3F7A] text-xs uppercase tracking-wider text-left px-4 py-3 min-w-[200px]">Client</th>
              <th className="font-inter font-semibold text-[#1B3F7A] text-xs uppercase tracking-wider text-left px-4 py-3 w-[100px]">Tier</th>
              <th className="font-inter font-semibold text-[#1B3F7A] text-xs uppercase tracking-wider text-left px-4 py-3 w-[100px]">Industry</th>
              <th className="font-inter font-semibold text-[#1B3F7A] text-xs uppercase tracking-wider text-left px-4 py-3 w-[90px]">Intake</th>
              <th className="font-inter font-semibold text-[#1B3F7A] text-xs uppercase tracking-wider text-left px-4 py-3 w-[90px]">Brief</th>
              <th className="font-inter font-semibold text-[#1B3F7A] text-xs uppercase tracking-wider text-left px-4 py-3 w-[70px]">Docs</th>
              <th className="font-inter font-semibold text-[#1B3F7A] text-xs uppercase tracking-wider text-left px-4 py-3 min-w-[180px]">Services</th>
              <th className="font-inter font-semibold text-[#1B3F7A] text-xs uppercase tracking-wider text-left px-4 py-3 w-[100px]">Status</th>
              <th className="font-inter font-semibold text-[#1B3F7A] text-xs uppercase tracking-wider text-left px-4 py-3 w-[60px]">Sub</th>
              <th className="font-inter font-semibold text-[#1B3F7A] text-xs uppercase tracking-wider text-left px-4 py-3 w-[100px]">Created</th>
              <th className="font-inter font-semibold text-[#1B3F7A] text-xs uppercase tracking-wider text-right px-4 py-3 w-[140px]">Action</th>
              <th className="font-inter font-semibold text-[#1B3F7A] text-xs uppercase tracking-wider text-center px-2 py-3 w-10"></th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <ClientRowComponent
                key={client.user_id}
                client={client}
                isSelected={selectedIds.has(client.user_id)}
                onSelect={onSelect}
                onAction={onAction}
                isGeneratingBrief={generatingBriefFor === client.user_id}
                onDelete={onDeleteClient}
              />
            ))}
          </tbody>
        </table>
      </div>

      {clients.length === 0 && (
        <div className="p-8 text-center">
          <p className="font-inter text-gray-600 text-sm">No clients match these filters.</p>
        </div>
      )}
    </div>
  );
}

// Memoized row component for performance
const ClientRowComponent = memo(function ClientRowComponent({
  client,
  isSelected,
  onSelect,
  onAction,
  isGeneratingBrief,
  onDelete,
}: {
  client: ClientRow;
  isSelected: boolean;
  onSelect: (userId: string) => void;
  onAction: (userId: string, action: 'reminder' | 'generate-brief' | 'start-delivery' | 'continue') => void;
  isGeneratingBrief: boolean;
  onDelete?: (userId: string, email: string) => void;
}) {
  // Determine context-aware action
  const getAction = useCallback(() => {
    if (!client.has_submitted_intake) {
      return { type: 'reminder' as const, label: 'Send Reminder', icon: Mail };
    }
    if (client.intake_complete && (!client.brief_status || client.brief_status !== 'completed')) {
      return { type: 'generate-brief' as const, label: 'Generate Brief', icon: Briefcase };
    }
    if (client.brief_status === 'completed' && client.delivery_status === 'not_started') {
      return { type: 'start-delivery' as const, label: 'Start Delivery', icon: FolderOpen };
    }
    if (client.delivery_status === 'in_progress') {
      return { type: 'continue' as const, label: 'Continue', icon: ChevronRight };
    }
    return null;
  }, [client]);

  const action = getAction();

  return (
    <tr
      className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${
        isSelected ? 'bg-blue-50 border-l-2 border-l-[#1B3F7A]' : ''
      } ${client.urgency_score >= 70 ? 'bg-red-50/30' : ''}`}
    >
      {/* Checkbox */}
      <td className="px-4 py-3">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(client.user_id)}
          className="rounded border-gray-300"
          aria-label={`Select ${client.email}`}
        />
      </td>

      {/* Client */}
      <td className="px-4 py-3">
        <div className="font-inter text-sm text-gray-900 font-medium truncate max-w-[180px]">
          {client.email}
        </div>
        {client.business_name && (
          <div className="font-inter text-xs text-[#1B3F7A] truncate max-w-[180px]">
            {client.business_name}
          </div>
        )}
        <div className="font-inter text-xs text-gray-500 truncate max-w-[180px]">
          {client.user_id.substring(0, 8)}...
        </div>
      </td>

      {/* Tier */}
      <td className="px-4 py-3">
        <TierBadge tier={client.tier} />
      </td>

      {/* Industry */}
      <td className="px-4 py-3">
        {client.industry ? (
          <span className="inline-flex items-center gap-1 font-inter text-xs font-medium text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full">
            <Building2 size={10} />
            {client.industry.charAt(0).toUpperCase() + client.industry.slice(1)}
          </span>
        ) : (
          <span className="font-inter text-xs text-gray-400">—</span>
        )}
      </td>

      {/* Intake */}
      <td className="px-4 py-3">
        <IntakeBadge hasSubmitted={client.has_submitted_intake} isComplete={client.intake_complete} />
      </td>

      {/* Brief */}
      <td className="px-4 py-3">
        <BriefStatusBadge status={client.brief_status} version={client.brief_version} />
      </td>

      {/* Docs */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-1.5">
          <span className="font-inter text-xs text-gray-900">
            {client.documents_ready}/{client.documents_total}
          </span>
          {client.risk_level && <RiskBadge level={client.risk_level} />}
        </div>
      </td>

      {/* Services */}
      <td className="px-4 py-3">
        <div className="flex flex-wrap gap-1">
          {client.service_chips.length > 0 ? (
            client.service_chips.slice(0, 4).map((chip) => (
              <ServiceChip key={chip.id} id={chip.id} name={chip.name} tier={chip.tier} />
            ))
          ) : (
            <span className="font-inter text-xs text-gray-400">—</span>
          )}
          {client.service_chips.length > 4 && (
            <span className="font-inter text-xs text-gray-400">+{client.service_chips.length - 4}</span>
          )}
        </div>
      </td>

      {/* Status */}
      <td className="px-4 py-3">
        <DeliveryStatusBadge status={client.delivery_status} />
      </td>

      {/* Subscription */}
      <td className="px-4 py-3">
        {client.has_subscription ? (
          <span className="inline-flex items-center gap-1 font-inter text-xs font-medium text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full">
            <RefreshCw size={10} />
            {client.subscription_type === 'monthly' ? 'M' : 'Q'}
          </span>
        ) : (
          <span className="font-inter text-xs text-gray-400">—</span>
        )}
      </td>

      {/* Created */}
      <td className="px-4 py-3">
        <span className="font-inter text-xs text-gray-600">
          {new Date(client.created_at).toLocaleDateString('en-GB', {
            day: 'numeric', month: 'short', year: 'numeric'
          })}
        </span>
      </td>

      {/* Action */}
      <td className="px-4 py-3 text-right">
        <div className="flex items-center justify-end gap-2">
          {action && (
            <button
              onClick={() => onAction(client.user_id, action.type)}
              disabled={isGeneratingBrief && action.type === 'generate-brief'}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-inter font-medium transition-colors ${
                isGeneratingBrief && action.type === 'generate-brief'
                  ? 'bg-blue-100 text-blue-600 cursor-wait'
                  : action.type === 'reminder'
                    ? 'bg-amber-100 hover:bg-amber-200 text-amber-700'
                    : action.type === 'generate-brief'
                      ? 'bg-[#1B3F7A] hover:bg-[#2C68C4] text-white'
                      : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-700'
              }`}
            >
              {isGeneratingBrief && action.type === 'generate-brief' ? (
                <>
                  <RefreshCw size={12} className="animate-spin" />
                  <span className="hidden sm:inline">Generating...</span>
                </>
              ) : (
                <>
                  <action.icon size={12} />
                  <span className="hidden sm:inline">{action.label}</span>
                </>
              )}
            </button>
          )}
          <Link
            href={`/personal/admin/${client.user_id}`}
            className="inline-flex items-center gap-1 font-inter text-xs font-medium text-[#2C68C4] hover:underline"
          >
            Manage
            <ChevronRight size={12} />
          </Link>
        </div>
      </td>

      {/* Delete */}
      <td className="px-2 py-3 text-center">
        {onDelete && (
          <button
            onClick={() => onDelete(client.user_id, client.email)}
            className="p-1.5 rounded text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            aria-label={`Delete ${client.email}`}
            title="Delete client"
          >
            <Trash2 size={14} />
          </button>
        )}
      </td>
    </tr>
  );
});

// Badge Components

function TierBadge({ tier }: { tier: ServiceTier }) {
  const config: Record<ServiceTier, { label: string; color: string; bg: string }> = {
    foundation: { label: 'Foundation', color: 'text-blue-700', bg: 'bg-blue-50' },
    operations: { label: 'Operations', color: 'text-amber-700', bg: 'bg-amber-50' },
    industry: { label: 'Industry', color: 'text-teal-700', bg: 'bg-teal-50' },
  };

  const c = config[tier] || config.foundation;

  return (
    <span className={`inline-flex items-center gap-1 font-inter text-xs font-medium px-2 py-0.5 rounded-full ${c.color} ${c.bg}`}>
      <Layers size={10} />
      {c.label}
    </span>
  );
}

function IntakeBadge({ hasSubmitted, isComplete }: { hasSubmitted: boolean; isComplete: boolean }) {
  if (!hasSubmitted) {
    return (
      <span className="inline-flex items-center gap-1 font-inter text-xs font-medium text-red-700 bg-red-50 px-2 py-0.5 rounded-full">
        <Clock size={10} />
        Pending
      </span>
    );
  }
  if (!isComplete) {
    return (
      <span className="inline-flex items-center gap-1 font-inter text-xs font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
        <Clock size={10} />
        Partial
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 font-inter text-xs font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
      <CheckCircle2 size={10} />
      Complete
    </span>
  );
}

function BriefStatusBadge({ status, version }: { status?: string; version?: number }) {
  if (!status) {
    return (
      <span className="inline-flex items-center font-inter text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full">
        <AlertCircleIcon size={8} className="mr-1" />
        None
      </span>
    );
  }

  const config: Record<string, { label: string; color: string; bg: string; icon?: any }> = {
    pending: { label: 'Pending', color: 'text-gray-600', bg: 'bg-gray-100' },
    generating: { label: 'Generating', color: 'text-blue-600', bg: 'bg-blue-50' },
    completed: { label: 'Ready', color: 'text-green-600', bg: 'bg-green-50', icon: CheckCircle2 },
    failed: { label: 'Failed', color: 'text-red-600', bg: 'bg-red-50' },
  };

  const c = config[status] || config.pending;
  const Icon = c.icon;

  return (
    <span className={`inline-flex items-center font-inter text-xs font-medium px-2 py-1 rounded-full ${c.color} ${c.bg}`}>
      {status === 'generating' && <RefreshCw size={10} className="animate-spin mr-1" />}
      {Icon && status !== 'generating' && <Icon size={10} className="mr-1" />}
      {c.label}
      {version && version > 1 && <span className="ml-1 opacity-70">v{version}</span>}
    </span>
  );
}

function RiskBadge({ level }: { level: string }) {
  const config: Record<string, { color: string; bg: string }> = {
    High: { color: 'text-red-600', bg: 'bg-red-50' },
    Medium: { color: 'text-amber-600', bg: 'bg-amber-50' },
    Low: { color: 'text-green-600', bg: 'bg-green-50' },
  };

  const c = config[level] || { color: 'text-gray-600', bg: 'bg-gray-100' };

  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-inter font-medium ${c.color} ${c.bg}`}>
      {level}
    </span>
  );
}

function ServiceChip({ id, name, tier }: { id: string; name: string; tier: ServiceTier }) {
  const tierColors: Record<ServiceTier, string> = {
    foundation: 'text-blue-700 bg-blue-50',
    operations: 'text-amber-700 bg-amber-50',
    industry: 'text-teal-700 bg-teal-50',
  };

  return (
    <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs font-inter font-medium ${tierColors[tier]}`}>
      <Package size={9} />
      {name}
    </span>
  );
}

function DeliveryStatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; color: string; bg: string }> = {
    not_started: { label: 'Not Started', color: 'text-gray-600', bg: 'bg-gray-100' },
    in_progress: { label: 'In Progress', color: 'text-amber-700', bg: 'bg-amber-50' },
    delivered: { label: 'Delivered', color: 'text-green-700', bg: 'bg-green-50' },
  };

  const c = config[status] || config.not_started;

  return (
    <span className={`inline-flex items-center font-inter text-xs font-medium px-2 py-0.5 rounded-full ${c.color} ${c.bg}`}>
      {c.label}
    </span>
  );
}
