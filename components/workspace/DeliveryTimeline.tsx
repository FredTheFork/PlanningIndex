'use client';

import { Send, Clock, Package, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';
import type { Proposal } from '@/lib/mock/proposals';

function formatDate(iso: string | null): string {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

interface TimelineStep {
  status: Proposal['status'];
  label: string;
  icon: typeof Send;
  dateField: keyof Pick<Proposal, 'sentDate' | 'mailedDate' | 'deliveredDate'>;
}

const deliverySteps: TimelineStep[] = [
  { status: 'Sent', label: 'Sent', icon: Send, dateField: 'sentDate' },
  { status: 'Processing', label: 'Processing', icon: Clock, dateField: 'sentDate' },
  { status: 'Mailed', label: 'Mailed', icon: Package, dateField: 'mailedDate' },
  { status: 'Delivered', label: 'Delivered', icon: CheckCircle2, dateField: 'deliveredDate' },
];

const statusOrder: Proposal['status'][] = ['Draft', 'Ready', 'Sent', 'Processing', 'Mailed', 'Delivered'];

function getStatusIndex(status: Proposal['status']): number {
  return statusOrder.indexOf(status);
}

export function DeliveryTimeline({ proposal }: { proposal: Proposal }) {
  const currentIndex = getStatusIndex(proposal.status);
  const isError = proposal.status === 'Delivery issue' || proposal.status === 'Undeliverable';

  return (
    <div className="relative">
      <div className="absolute left-[1.375rem] top-3 bottom-3 w-px bg-primary-200" />
      <div className="space-y-5">
        {deliverySteps.map((step, i) => {
          const stepIndex = getStatusIndex(step.status);
          const isCompleted = !isError && stepIndex < currentIndex;
          const isCurrent = !isError && stepIndex === currentIndex;
          const isFuture = !isError && stepIndex > currentIndex;
          const Icon = step.icon;
          const date = proposal[step.dateField];

          return (
            <div key={step.status} className="relative flex items-start gap-4">
              <div
                className={`relative flex h-11 w-11 items-center justify-center rounded-xl z-10 shrink-0 ${
                  isCompleted
                    ? 'bg-emerald-600 text-white'
                    : isCurrent
                      ? 'bg-accent-600 text-white ring-4 ring-accent-500/20'
                      : isFuture
                        ? 'bg-primary-100 text-primary-300'
                        : 'bg-primary-100 text-primary-400'
                }`}
              >
                <Icon size={18} />
              </div>
              <div className="pt-1.5">
                <p
                  className={`font-sans font-semibold text-sm ${
                    isCompleted
                      ? 'text-primary-900'
                      : isCurrent
                        ? 'text-accent-700'
                        : 'text-primary-400'
                  }`}
                >
                  {step.label}
                </p>
                {date && (isCompleted || isCurrent) && (
                  <p className="font-sans text-xs text-primary-500 mt-0.5">{formatDate(date)}</p>
                )}
                {isFuture && (
                  <p className="font-sans text-xs text-primary-300 mt-0.5">Pending</p>
                )}
              </div>
            </div>
          );
        })}

        {isError && (
          <div className="relative flex items-start gap-4 pt-2">
            <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-danger-600 text-white z-10 shrink-0">
              {proposal.status === 'Undeliverable' ? <XCircle size={18} /> : <AlertCircle size={18} />}
            </div>
            <div className="pt-1.5">
              <p className="font-sans font-semibold text-danger-700 text-sm">
                {proposal.status === 'Undeliverable' ? 'Undeliverable' : 'Delivery issue'}
              </p>
              {proposal.deliveryIssueReason && (
                <p className="font-sans text-xs text-danger-600 mt-0.5 leading-relaxed">
                  {proposal.deliveryIssueReason}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
