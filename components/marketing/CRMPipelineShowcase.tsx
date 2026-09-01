const columns = [
  {
    stage: 'New',
    count: 3,
    cards: [
      { title: '12 High Street — Windows', ref: '24/01234/FUL', value: '£4,200', initials: 'JS', dot: 'bg-sky-500' },
      { title: '45 The Broadway — Extension', ref: '24/01235/FUL', value: '£18,500', initials: 'AB', dot: 'bg-sky-500' },
    ],
  },
  {
    stage: 'Contacted',
    count: 2,
    cards: [
      { title: '3 School Lane — New build', ref: '24/01236/FUL', value: '£32,000', initials: 'JS', dot: 'bg-amber-500' },
    ],
  },
  {
    stage: 'Proposal Sent',
    count: 2,
    cards: [
      { title: '78 High Street — Loft', ref: '24/01237/FUL', value: '£8,750', initials: 'AB', dot: 'bg-violet-500' },
    ],
  },
  {
    stage: 'Follow Up',
    count: 1,
    cards: [
      { title: '22 Station Rd — Roof', ref: '24/01238/FUL', value: '£6,400', initials: 'JS', dot: 'bg-orange-500' },
    ],
  },
  {
    stage: 'Won',
    count: 1,
    cards: [
      { title: '9 Park Avenue — Doors', ref: '24/01229/FUL', value: '£3,200', initials: 'AB', dot: 'bg-emerald-500' },
    ],
  },
];

const summary = [
  { label: 'Pipeline value', value: '£48,600' },
  { label: 'Win rate', value: '32%' },
  { label: 'Active leads', value: '14' },
];

export function CRMPipelineShowcase() {
  return (
    <div className="relative mx-auto w-full max-w-[680px]">
      <div className="absolute -right-10 top-10 h-72 w-72 rounded-full bg-violet-100/30 blur-3xl" />
      <div className="absolute -bottom-14 -left-10 h-64 w-64 rounded-full bg-emerald-100/40 blur-3xl" />
      <div className="relative rounded-[1.6rem] border border-slate-200 bg-white p-2 shadow-[0_24px_70px_rgba(15,23,42,0.12)] sm:p-3">
        <div className="overflow-hidden rounded-[1.1rem] border border-slate-200 bg-[#f7f9fb]">
          {/* Browser bar */}
          <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3.5 sm:px-5">
            <div className="flex items-center gap-2.5">
              <div className="h-2.5 w-2.5 rounded-full bg-sky-600" />
              <span className="text-xs font-semibold tracking-wide text-primary-800">PlanningIndex</span>
              <span className="hidden text-[11px] text-slate-400 sm:inline">/ Leads / Pipeline</span>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-medium text-slate-500">
              <span className="h-7 w-7 rounded-full bg-primary-100" />
            </div>
          </div>

          {/* Summary bar */}
          <div className="flex items-center gap-4 border-b border-slate-200 bg-white px-4 py-3 sm:px-5">
            {summary.map((s) => (
              <div key={s.label} className="flex-1">
                <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-slate-400">{s.label}</p>
                <p className="mt-0.5 font-display text-lg font-bold text-primary-900">{s.value}</p>
              </div>
            ))}
            <div className="hidden sm:block">
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">+24% this month</span>
            </div>
          </div>

          {/* Kanban board */}
          <div className="overflow-x-auto p-3 sm:p-4">
            <div className="flex gap-2.5 min-w-max">
              {columns.map((col) => (
                <div key={col.stage} className="w-44 shrink-0">
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-primary-900">{col.stage}</span>
                      <span className="rounded-full bg-primary-100 px-1.5 py-0.5 text-[9px] font-semibold text-primary-600">{col.count}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {col.cards.map((card) => (
                      <div key={card.ref} className="rounded-lg border border-slate-200 bg-white p-2.5">
                        <div className="flex items-start gap-1.5">
                          <span className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full ${card.dot}`} />
                          <p className="text-[11px] font-semibold text-primary-900 leading-tight">{card.title}</p>
                        </div>
                        <p className="mt-1.5 font-mono text-[9px] text-slate-400">{card.ref}</p>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-[11px] font-bold text-primary-700">{card.value}</span>
                          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-900">
                            <span className="text-[8px] font-semibold text-white">{card.initials}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
