import { Mail, Check } from 'lucide-react';

const scopeItems = [
  { desc: 'Supply and fit 8x double-glazed uPVC windows', qty: '8', unit: '£520', total: '£4,160' },
  { desc: 'Supply and fit 1x composite front door', qty: '1', unit: '£850', total: '£850' },
  { desc: 'Removal and disposal of existing windows', qty: '1', unit: '£200', total: '£200' },
];

export function ProposalShowcase() {
  return (
    <div className="relative mx-auto w-full max-w-[680px]">
      <div className="absolute -left-10 top-10 h-72 w-72 rounded-full bg-sky-100/50 blur-3xl" />
      <div className="absolute -bottom-14 -right-10 h-64 w-64 rounded-full bg-amber-100/40 blur-3xl" />
      <div className="relative rounded-[1.6rem] border border-slate-200 bg-white p-2 shadow-[0_24px_70px_rgba(15,23,42,0.12)] sm:p-3">
        <div className="overflow-hidden rounded-[1.1rem] border border-slate-200 bg-[#f7f9fb]">
          {/* Browser bar */}
          <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3.5 sm:px-5">
            <div className="flex items-center gap-2.5">
              <div className="h-2.5 w-2.5 rounded-full bg-sky-600" />
              <span className="text-xs font-semibold tracking-wide text-primary-800">PlanningIndex</span>
              <span className="hidden text-[11px] text-slate-400 sm:inline">/ Proposals / New Proposal</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[9px] font-semibold text-emerald-700">
                Draft
              </span>
              <span className="h-7 w-7 rounded-full bg-primary-100" />
            </div>
          </div>

          <div className="grid md:grid-cols-2">
            {/* Left: Editor */}
            <div className="border-b border-slate-200 bg-white p-4 sm:p-5 md:border-b-0 md:border-r">
              <p className="text-sm font-semibold text-primary-900 mb-4">Proposal details</p>

              <div className="space-y-3">
                <div className="rounded-lg border border-slate-200 px-3 py-2">
                  <span className="block text-[9px] font-semibold uppercase tracking-[0.1em] text-slate-400">Recipient</span>
                  <span className="mt-0.5 block text-xs font-medium text-primary-800">Mr J. Smith</span>
                  <span className="block text-[10px] text-slate-500">12 High Street, Amersham, HP6 5BA</span>
                </div>

                <div className="rounded-lg border border-slate-200 px-3 py-2">
                  <span className="block text-[9px] font-semibold uppercase tracking-[0.1em] text-slate-400">Planning reference</span>
                  <span className="mt-0.5 block font-mono text-xs font-medium text-primary-800">24/01234/FUL</span>
                </div>

                <div className="rounded-lg border border-slate-200 px-3 py-2">
                  <span className="block text-[9px] font-semibold uppercase tracking-[0.1em] text-slate-400">Project</span>
                  <span className="mt-0.5 block text-xs font-medium text-primary-800">Replacement windows and doors</span>
                </div>

                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-slate-400 mb-1.5">Scope of works</p>
                  <div className="space-y-1.5">
                    {scopeItems.map((item, i) => (
                      <div key={i} className="flex items-center gap-2 rounded-md border border-slate-100 bg-slate-50 px-2 py-1.5">
                        <Check size={10} className="shrink-0 text-emerald-600" />
                        <span className="flex-1 truncate text-[10px] text-primary-700">{item.desc}</span>
                        <span className="text-[10px] font-semibold text-primary-800">{item.total}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-lg bg-primary-50 px-3 py-2">
                  <span className="text-xs font-semibold text-primary-900">Total</span>
                  <span className="font-display text-base font-bold text-primary-900">£5,210</span>
                </div>

                <button type="button" className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary-900 py-2.5 text-xs font-semibold text-white">
                  <Mail size={13} /> Send by Post
                </button>
              </div>
            </div>

            {/* Right: Document preview */}
            <div className="bg-slate-100 p-4 sm:p-5">
              <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-slate-400 mb-3">Live preview</p>
              <div className="rounded-lg bg-white p-4 shadow-sm">
                {/* Letterhead */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary-900">
                      <span className="text-[9px] font-bold text-white">TC</span>
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-primary-900">Thames Construction</p>
                      <p className="text-[8px] text-slate-400">contact@thames-construction.co.uk</p>
                    </div>
                  </div>
                  <p className="text-[8px] text-slate-400">01 Sep 2026</p>
                </div>

                {/* Recipient */}
                <p className="text-[10px] font-semibold text-slate-500 mb-0.5">Proposal for</p>
                <p className="text-[11px] font-semibold text-primary-900">Mr J. Smith</p>
                <p className="text-[9px] text-slate-500 leading-relaxed">12 High Street<br />Amersham, HP6 5BA</p>

                {/* Project */}
                <div className="mt-3 pt-3 border-t border-slate-100">
                  <p className="text-[10px] font-semibold text-slate-500 mb-0.5">Project</p>
                  <p className="text-[10px] text-primary-800 leading-relaxed">Replacement of existing timber sash windows with new double-glazed uPVC units and installation of a composite front door.</p>
                </div>

                {/* Scope table */}
                <div className="mt-3 pt-3 border-t border-slate-100">
                  <p className="text-[10px] font-semibold text-slate-500 mb-2">Scope of works</p>
                  <div className="space-y-1.5">
                    {scopeItems.map((item, i) => (
                      <div key={i} className="flex items-start justify-between gap-2">
                        <span className="flex-1 text-[9px] text-slate-600 leading-relaxed">{item.desc}</span>
                        <span className="text-[9px] font-semibold text-primary-800">{item.total}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-1.5">
                    <span className="text-[10px] font-bold text-primary-900">Total</span>
                    <span className="text-[10px] font-bold text-primary-900">£5,210</span>
                  </div>
                </div>

                {/* Signature area */}
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-[8px] text-slate-400">Accepted by</p>
                      <div className="mt-1 h-6 w-24 border-b border-slate-300" />
                      <p className="mt-1 text-[8px] text-slate-400">Signature</p>
                    </div>
                    <div>
                      <p className="text-[8px] text-slate-400">Date</p>
                      <div className="mt-1 h-6 w-16 border-b border-slate-300" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery status */}
              <div className="mt-3 flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-50">
                  <Mail size={12} className="text-sky-700" />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-semibold text-primary-800">Physical mail delivery</p>
                  <p className="text-[9px] text-slate-400">Printed, posted, and tracked — delivered to the property door</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
