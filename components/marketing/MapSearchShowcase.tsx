import { Search, MapPin, ChevronDown } from 'lucide-react';

const markers = [
  { left: '28%', top: '35%', color: 'bg-amber-500', label: 'Windows' },
  { left: '52%', top: '22%', color: 'bg-sky-600', label: 'Extension' },
  { left: '68%', top: '55%', color: 'bg-emerald-600', label: 'New build' },
  { left: '40%', top: '68%', color: 'bg-primary-700', label: 'Loft' },
  { left: '20%', top: '58%', color: 'bg-amber-500', label: 'Windows' },
];

export function MapSearchShowcase() {
  return (
    <div className="relative mx-auto w-full max-w-[640px]">
      <div className="absolute -right-10 top-10 h-72 w-72 rounded-full bg-emerald-100/40 blur-3xl" />
      <div className="absolute -bottom-14 -left-10 h-64 w-64 rounded-full bg-sky-100/50 blur-3xl" />
      <div className="relative rounded-[1.6rem] border border-slate-200 bg-white p-2 shadow-[0_24px_70px_rgba(15,23,42,0.12)] sm:p-3">
        <div className="overflow-hidden rounded-[1.1rem] border border-slate-200 bg-[#f7f9fb]">
          {/* Browser bar */}
          <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3.5 sm:px-5">
            <div className="flex items-center gap-2.5">
              <div className="h-2.5 w-2.5 rounded-full bg-sky-600" />
              <span className="text-xs font-semibold tracking-wide text-primary-800">PlanningIndex</span>
              <span className="hidden text-[11px] text-slate-400 sm:inline">/ Search / Map View</span>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-medium text-slate-500">
              <span className="h-7 w-7 rounded-full bg-primary-100" />
            </div>
          </div>

          {/* Location search bar */}
          <div className="border-b border-slate-200 bg-white px-4 py-3 sm:px-5">
            <div className="flex items-center gap-2.5">
              <div className="flex flex-1 items-center gap-2 rounded-lg border border-slate-200 px-3 py-2">
                <Search size={13} className="text-slate-400" />
                <span className="text-xs font-medium text-primary-800">Harefield, UB9</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2">
                <span className="text-[9px] font-semibold uppercase tracking-[0.1em] text-slate-400">Radius</span>
                <span className="text-xs font-medium text-primary-800">25 miles</span>
                <ChevronDown size={11} className="text-slate-400" />
              </div>
              <button type="button" className="flex items-center gap-1.5 rounded-lg bg-primary-900 px-3 py-2 text-xs font-semibold text-white">
                <Search size={12} /> Search
              </button>
            </div>
          </div>

          {/* Map area */}
          <div className="relative h-72 overflow-hidden bg-[#eef4f6] sm:h-80">
            {/* Grid overlay */}
            <div
              className="absolute inset-0 opacity-50"
              style={{
                backgroundImage:
                  'linear-gradient(35deg, transparent 48%, rgba(148,163,184,.25) 49%, transparent 50%), linear-gradient(120deg, transparent 48%, rgba(148,163,184,.2) 49%, transparent 50%)',
                backgroundSize: '92px 82px, 120px 110px',
              }}
            />
            {/* Water shapes */}
            <div className="absolute left-6 top-10 h-24 w-36 rounded-[45%] border border-slate-300/70 bg-white/35" />
            <div className="absolute bottom-8 right-3 h-28 w-40 rounded-[45%] border border-slate-300/70 bg-white/30" />

            {/* Radius circle */}
            <div className="absolute left-1/2 top-1/2 h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-sky-400/50 bg-sky-400/10" />
            <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-600 ring-4 ring-white" />

            {/* Markers */}
            {markers.map((marker, i) => (
              <div
                key={i}
                className="absolute"
                style={{ left: marker.left, top: marker.top }}
              >
                <div className={`flex h-7 w-7 items-center justify-center rounded-full border-4 border-white shadow-md ${marker.color}`}>
                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                </div>
              </div>
            ))}

            {/* Map controls */}
            <div className="absolute right-3 top-3 flex flex-col gap-1">
              <button type="button" className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white text-xs font-bold text-primary-700 shadow-sm">+</button>
              <button type="button" className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white text-xs font-bold text-primary-700 shadow-sm">−</button>
            </div>

            {/* Info card */}
            <div className="absolute bottom-3 left-3 rounded-lg border border-white bg-white/95 px-3 py-2 shadow-md">
              <div className="flex items-center gap-2">
                <MapPin size={12} className="text-sky-700" />
                <p className="text-[10px] font-semibold text-primary-800">5 applications in radius</p>
              </div>
              <p className="mt-0.5 text-[9px] text-slate-500">25 mile radius from Harefield, UB9</p>
            </div>

            {/* Legend */}
            <div className="absolute bottom-3 right-3 rounded-lg border border-slate-200 bg-white/95 px-3 py-2 shadow-sm">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                  <span className="text-[9px] text-slate-600">Windows</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-sky-600" />
                  <span className="text-[9px] text-slate-600">Extensions</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-600" />
                  <span className="text-[9px] text-slate-600">New builds</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-slate-200 bg-white px-4 py-3 sm:px-5">
            <div className="flex gap-1.5">
              <span className="rounded-md border border-slate-200 px-2.5 py-1 text-[10px] font-medium text-slate-500">List</span>
              <span className="rounded-md bg-primary-900 px-2.5 py-1 text-[10px] font-semibold text-white">Map</span>
            </div>
            <p className="text-[10px] font-semibold text-sky-700">247 results found</p>
          </div>
        </div>
      </div>
    </div>
  );
}
