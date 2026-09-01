import { Search, MapPin, ChevronDown, Plus } from 'lucide-react';

const results = [
  { title: 'Replacement of windows and doors', ref: '24/01234/FUL', address: '12 High Street, Amersham', council: 'Buckinghamshire Council', date: '28 Aug 2026', status: 'Pending', statusColor: 'bg-amber-100 text-amber-700 border-amber-200' },
  { title: 'Rear extension and alterations', ref: '24/01235/FUL', address: '45 The Broadway, Rickmansworth', council: 'Three Rivers District', date: '27 Aug 2026', status: 'Pending', statusColor: 'bg-amber-100 text-amber-700 border-amber-200' },
  { title: 'Construction of a new dwelling', ref: '24/01236/FUL', address: '3 School Lane, Amersham', council: 'Buckinghamshire Council', date: '26 Aug 2026', status: 'Approved', statusColor: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  { title: 'Loft conversion with rear dormer', ref: '24/01237/FUL', address: '78 High Street, Chesham', council: 'Buckinghamshire Council', date: '25 Aug 2026', status: 'Pending', statusColor: 'bg-amber-100 text-amber-700 border-amber-200' },
];

function BrowserBar({ breadcrumb }: { breadcrumb: string }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3.5 sm:px-5">
      <div className="flex items-center gap-2.5">
        <div className="h-2.5 w-2.5 rounded-full bg-sky-600" />
        <span className="text-xs font-semibold tracking-wide text-primary-800">PlanningIndex</span>
        <span className="hidden text-[11px] text-slate-400 sm:inline">{breadcrumb}</span>
      </div>
      <div className="flex items-center gap-3 text-[11px] font-medium text-slate-500">
        <span className="hidden sm:inline">Saved searches</span>
        <span className="h-7 w-7 rounded-full bg-primary-100" />
      </div>
    </div>
  );
}

function FilterField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 px-3 py-2.5">
      <span className="block text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-400">{label}</span>
      <div className="mt-1 flex items-center justify-between">
        <span className="text-xs font-medium text-primary-800">{value}</span>
        <ChevronDown size={12} className="text-slate-400" />
      </div>
    </div>
  );
}

export function PlanningSearchShowcase() {
  return (
    <div className="relative mx-auto w-full max-w-[640px]">
      <div className="absolute -right-10 top-10 h-72 w-72 rounded-full bg-sky-200/40 blur-3xl" />
      <div className="absolute -bottom-14 -left-10 h-64 w-64 rounded-full bg-amber-100/50 blur-3xl" />
      <div className="relative rounded-[1.6rem] border border-slate-200 bg-white p-2 shadow-[0_24px_70px_rgba(15,23,42,0.12)] sm:p-3">
        <div className="overflow-hidden rounded-[1.1rem] border border-slate-200 bg-[#f7f9fb]">
          <BrowserBar breadcrumb="/ Planning Search" />

          <div className="grid md:grid-cols-[0.9fr_1.1fr]">
            {/* Left: Filter sidebar */}
            <div className="border-b border-slate-200 bg-white p-4 sm:p-5 md:border-b-0 md:border-r">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-semibold text-primary-900">Filters</p>
                <div className="rounded-lg bg-sky-50 p-2 text-sky-700">
                  <Search size={15} />
                </div>
              </div>

              <div className="space-y-2.5">
                <div className="rounded-lg border border-slate-200 px-3 py-2.5">
                  <span className="block text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-400">Keyword</span>
                  <div className="mt-1 flex items-center gap-2">
                    <Search size={11} className="text-slate-400" />
                    <span className="text-xs font-medium text-primary-800">windows</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <FilterField label="Location" value="Harefield, UB9" />
                  <FilterField label="Radius" value="25 miles" />
                </div>

                <FilterField label="Application type" value="All applications" />
                <FilterField label="Status" value="All statuses" />
                <FilterField label="Date received" value="Last 30 days" />
                <FilterField label="Council" value="Buckinghamshire" />

                <button type="button" className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary-900 py-2.5 text-xs font-semibold text-white">
                  <Search size={13} /> Search applications
                </button>
              </div>
            </div>

            {/* Right: Results */}
            <div className="p-4 sm:p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm font-semibold text-primary-900">247 applications found</p>
                  <p className="mt-0.5 text-[10px] text-slate-500">Updated today · 28 Aug 2026</p>
                </div>
                <div className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2 py-1">
                  <span className="text-[10px] font-medium text-slate-500">Sort:</span>
                  <span className="text-[10px] font-semibold text-primary-700">Newest</span>
                  <ChevronDown size={10} className="text-slate-400" />
                </div>
              </div>

              <div className="mb-3 flex gap-1.5">
                <span className="rounded-md bg-primary-900 px-2.5 py-1 text-[10px] font-semibold text-white">List</span>
                <span className="rounded-md border border-slate-200 px-2.5 py-1 text-[10px] font-medium text-slate-500">Map</span>
              </div>

              <div className="space-y-2">
                {results.map((app) => (
                  <div key={app.ref} className="rounded-lg border border-slate-200 bg-white p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-semibold text-primary-900">{app.title}</p>
                        <p className="mt-0.5 font-mono text-[10px] text-slate-400">{app.ref}</p>
                        <p className="mt-1 flex items-center gap-1 text-[10px] text-slate-500">
                          <MapPin size={9} /> {app.address}
                        </p>
                        <div className="mt-1.5 flex items-center gap-2">
                          <span className={`rounded-full border px-1.5 py-0.5 text-[9px] font-semibold ${app.statusColor}`}>
                            {app.status}
                          </span>
                          <span className="text-[9px] text-slate-400">{app.date}</span>
                        </div>
                      </div>
                      <button type="button" className="flex shrink-0 items-center gap-1 rounded-md border border-slate-200 px-2 py-1 text-[9px] font-semibold text-primary-700">
                        <Plus size={10} /> Leads
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
