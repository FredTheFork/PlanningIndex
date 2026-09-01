import { Search, Plus, Target, FileText } from 'lucide-react';

const results = [
  { title: 'Replacement of 12 timber sash windows', ref: '24/01234/FUL', address: '12 High Street, Amersham', relevance: 'High', relevanceColor: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  { title: 'Rear extension and alterations', ref: '24/01235/FUL', address: '45 The Broadway, Rickmansworth', relevance: 'Medium', relevanceColor: 'bg-amber-100 text-amber-700 border-amber-200' },
  { title: 'Construction of a new dwelling', ref: '24/01236/FUL', address: '3 School Lane, Amersham', relevance: 'Low', relevanceColor: 'bg-slate-100 text-slate-500 border-slate-200' },
];

const intelligence = [
  { label: 'Windows', value: '12', detail: 'Timber sash replacement' },
  { label: 'Doors', value: '2', detail: '1x front, 1x rear French' },
  { label: 'Extension', value: '1', detail: 'Rear single-storey' },
];

export function OpportunityDiscoveryShowcase() {
  return (
    <div className="relative mx-auto w-full max-w-[640px]">
      <div className="absolute -left-10 top-10 h-72 w-72 rounded-full bg-amber-100/40 blur-3xl" />
      <div className="absolute -bottom-14 -right-10 h-64 w-64 rounded-full bg-emerald-100/50 blur-3xl" />
      <div className="relative rounded-[1.6rem] border border-slate-200 bg-white p-2 shadow-[0_24px_70px_rgba(15,23,42,0.12)] sm:p-3">
        <div className="overflow-hidden rounded-[1.1rem] border border-slate-200 bg-[#f7f9fb]">
          {/* Browser bar */}
          <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3.5 sm:px-5">
            <div className="flex items-center gap-2.5">
              <div className="h-2.5 w-2.5 rounded-full bg-sky-600" />
              <span className="text-xs font-semibold tracking-wide text-primary-800">PlanningIndex</span>
              <span className="hidden text-[11px] text-slate-400 sm:inline">/ Search / Trade Relevance</span>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-medium text-slate-500">
              <span className="h-7 w-7 rounded-full bg-primary-100" />
            </div>
          </div>

          {/* Search bar */}
          <div className="border-b border-slate-200 bg-white px-4 py-3 sm:px-5">
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2">
              <Search size={13} className="text-slate-400" />
              <span className="text-xs font-medium text-primary-800">windows</span>
              <span className="ml-auto text-[9px] font-medium text-slate-400">Keyword search</span>
            </div>
          </div>

          {/* Results */}
          <div className="p-4 sm:p-5">
            <p className="mb-3 text-sm font-semibold text-primary-900">Results ranked by trade relevance</p>

            <div className="space-y-2">
              {results.map((app) => (
                <div key={app.ref} className="rounded-lg border border-slate-200 bg-white p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold text-primary-900">{app.title}</p>
                      <p className="mt-0.5 font-mono text-[10px] text-slate-400">{app.ref}</p>
                      <p className="mt-1 text-[10px] text-slate-500">{app.address}</p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1.5">
                      <span className={`rounded-full border px-2 py-0.5 text-[9px] font-semibold ${app.relevanceColor}`}>
                        {app.relevance}
                      </span>
                      <button type="button" className="flex items-center gap-1 rounded-md border border-slate-200 px-2 py-1 text-[9px] font-semibold text-primary-700">
                        <Plus size={10} /> Leads
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Application intelligence panel */}
            <div className="mt-4 rounded-lg border border-sky-200 bg-sky-50/50 p-3">
              <div className="mb-2.5 flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-sky-100">
                  <Target size={12} className="text-sky-700" />
                </div>
                <p className="text-xs font-semibold text-primary-900">Potential work identified</p>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {intelligence.map((item) => (
                  <div key={item.label} className="rounded-md border border-slate-200 bg-white p-2">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-slate-400">{item.label}</p>
                    <p className="mt-1 font-display text-lg font-bold text-primary-900">{item.value}</p>
                    <p className="mt-0.5 text-[9px] text-slate-500">{item.detail}</p>
                  </div>
                ))}
              </div>
              <div className="mt-2.5 flex items-center gap-2 rounded-md bg-white px-2.5 py-2">
                <FileText size={11} className="text-sky-700" />
                <span className="text-[10px] font-medium text-primary-700">Potential trade:</span>
                <span className="text-[10px] font-semibold text-sky-700">Window / Door Contractor</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
