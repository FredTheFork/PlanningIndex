import type { LucideIcon } from 'lucide-react';
import { Search, Target, Bookmark, FileText, Mail, MapPin, ArrowRight, CheckCircle2 } from 'lucide-react';

export interface ScenarioStep {
  icon: LucideIcon;
  label: string;
  detail: string;
}

export interface Scenario {
  trade: string;
  tradeIcon: LucideIcon;
  applicationTitle: string;
  applicationRef: string;
  applicationAddress: string;
  steps: ScenarioStep[];
  outcome: string;
}

export function ScenarioWalkthrough({ scenario, index }: { scenario: Scenario; index: number }) {
  const isReversed = index % 2 === 1;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
      {/* Application card */}
      <div className={isReversed ? 'lg:order-2' : ''}>
        <div className="rounded-2xl border border-primary-200 bg-white overflow-hidden shadow-card">
          <div className="border-b border-primary-100 p-5">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-100">
                  <scenario.tradeIcon className="text-accent-700" size={18} />
                </div>
                <span className="font-sans font-semibold text-primary-900 text-sm">{scenario.trade}</span>
              </div>
              <span className="rounded-full border border-amber-200 bg-amber-100 px-2.5 py-0.5 text-[10px] font-semibold text-amber-700">
                Pending
              </span>
            </div>
            <h3 className="font-sans font-semibold text-primary-900 text-base mb-1">
              {scenario.applicationTitle}
            </h3>
            <p className="font-mono text-xs text-primary-400 mb-2">{scenario.applicationRef}</p>
            <div className="flex items-center gap-1.5 text-sm text-primary-500">
              <MapPin size={14} className="shrink-0" />
              {scenario.applicationAddress}
            </div>
          </div>
          <div className="p-5">
            <p className="text-label text-primary-400 mb-2">Description</p>
            <p className="font-sans text-sm text-primary-600 leading-relaxed">
              {scenario.applicationTitle}. The application has been validated and is now available for public inspection.
            </p>
          </div>
        </div>
      </div>

      {/* Step flow */}
      <div className={isReversed ? 'lg:order-1' : ''}>
        <div className="relative">
          {/* Vertical connector line */}
          <div className="absolute left-[1.375rem] top-3 bottom-3 w-px bg-primary-200" />

          <div className="space-y-5">
            {scenario.steps.map((step, i) => (
              <div key={i} className="relative flex items-start gap-4">
                <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-primary-900 text-white shadow-md z-10 shrink-0">
                  <step.icon size={18} />
                </div>
                <div className="pt-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-primary-300">{String(i + 1).padStart(2, '0')}</span>
                    <h4 className="font-sans font-semibold text-primary-900 text-sm">{step.label}</h4>
                  </div>
                  <p className="font-sans text-primary-500 text-sm leading-relaxed mt-1">{step.detail}</p>
                </div>
              </div>
            ))}

            {/* Outcome */}
            <div className="relative flex items-start gap-4 pt-2">
              <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md z-10 shrink-0">
                <CheckCircle2 size={18} />
              </div>
              <div className="pt-1.5">
                <h4 className="font-sans font-semibold text-emerald-700 text-sm">Result</h4>
                <p className="font-sans text-primary-500 text-sm leading-relaxed mt-1">{scenario.outcome}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
