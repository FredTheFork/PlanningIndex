import { ArrowLeft, MapPin, FileText, Plus, Send } from 'lucide-react';

const details = [
  { label: 'Address', value: '12 High Street, Amersham, HP6 5BA' },
  { label: 'Received', value: '28 August 2026' },
  { label: 'Council', value: 'Buckinghamshire Council' },
  { label: 'Application type', value: 'Householder' },
  { label: 'Decision', value: 'Awaiting decision' },
  { label: 'Ward', value: 'Amersham North' },
];

const documents = [
  { name: 'Planning application form', size: '124 KB' },
  { name: 'Site location plan', size: '2.1 MB' },
  { name: 'Existing floor plans', size: '1.8 MB' },
  { name: 'Supporting statement', size: '340 KB' },
];

export function ApplicationDetailShowcase() {
  return (
    <div className="relative mx-auto w-full max-w-[640px]">
      <div className="absolute -left-10 top-10 h-72 w-72 rounded-full bg-emerald-100/40 blur-3xl" />
      <div className="absolute -bottom-14 -right-10 h-64 w-64 rounded-full bg-sky-100/50 blur-3xl" />
      <div className="relative rounded-[1.6rem] border border-slate-200 bg-white p-2 shadow-[0_24px_70px_rgba(15,23,42,0.12)] sm:p-3">
        <div className="overflow-hidden rounded-[1.1rem] border border-slate-200 bg-[#f7f9fb]">
          {/* Browser bar */}
          <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3.5 sm:px-5">
            <div className="flex items-center gap-2.5">
              <div className="h-2.5 w-2.5 rounded-full bg-sky-600" />
              <span className="text-xs font-semibold tracking-wide text-primary-800">PlanningIndex</span>
              <span className="hidden text-[11px] text-slate-400 sm:inline">/ Application / 24/01234/FUL</span>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-medium text-slate-500">
              <span className="h-7 w-7 rounded-full bg-primary-100" />
            </div>
          </div>

          <div className="p-4 sm:p-6">
            {/* Back link */}
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 mb-5">
              <ArrowLeft size={12} /> Back to applications
            </div>

            {/* Title and reference */}
            <div className="flex items-start justify-between gap-3 mb-5">
              <div>
                <h3 className="text-base font-semibold text-primary-900">Replacement windows and doors</h3>
                <p className="mt-1 font-mono text-xs text-slate-400">24/01234/FUL</p>
              </div>
              <span className="shrink-0 rounded-full border border-amber-200 bg-amber-100 px-2.5 py-0.5 text-[10px] font-semibold text-amber-700">
                Pending
              </span>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 mb-6">
              <button type="button" className="flex items-center gap-1.5 rounded-lg bg-primary-900 px-3 py-2 text-xs font-semibold text-white">
                <Plus size={13} /> Add to Leads
              </button>
              <button type="button" className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-primary-700">
                <Send size={13} /> Create Proposal
              </button>
            </div>

            {/* Details grid */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {details.map((d) => (
                <div key={d.label} className="rounded-lg border border-slate-200 bg-white p-2.5">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-slate-400">{d.label}</p>
                  <p className="mt-1 text-xs font-medium text-primary-800">{d.value}</p>
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="mb-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-400 mb-2">Description</p>
              <div className="rounded-lg border border-slate-200 bg-white p-3">
                <p className="text-xs leading-5 text-slate-600">
                  Replacement of existing timber sash windows with new double-glazed uPVC units. Installation of new composite front door and rear French doors. No external alterations to the building envelope.
                </p>
              </div>
            </div>

            {/* Map widget */}
            <div className="mb-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-400 mb-2">Location</p>
              <div className="relative h-32 rounded-lg border border-slate-200 bg-[#eef4f6] overflow-hidden">
                <div
                  className="absolute inset-0 opacity-50"
                  style={{
                    backgroundImage:
                      'linear-gradient(35deg, transparent 48%, rgba(148,163,184,.25) 49%, transparent 50%), linear-gradient(120deg, transparent 48%, rgba(148,163,184,.2) 49%, transparent 50%)',
                    backgroundSize: '92px 82px, 120px 110px',
                  }}
                />
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border-4 border-white bg-sky-600 shadow-md">
                    <MapPin size={12} className="text-white" />
                  </div>
                </div>
                <div className="absolute bottom-2 left-2 rounded-md border border-white bg-white/90 px-2 py-1 shadow-sm">
                  <p className="text-[9px] font-semibold text-primary-800">12 High Street, Amersham</p>
                </div>
              </div>
            </div>

            {/* Documents */}
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-400 mb-2">Documents</p>
              <div className="space-y-1.5">
                {documents.map((doc) => (
                  <div key={doc.name} className="flex items-center gap-2.5 rounded-lg border border-slate-200 bg-white p-2.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-md bg-sky-50 shrink-0">
                      <FileText size={13} className="text-sky-700" />
                    </div>
                    <span className="flex-1 text-xs font-medium text-primary-800">{doc.name}</span>
                    <span className="text-[10px] text-slate-400">{doc.size}</span>
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
