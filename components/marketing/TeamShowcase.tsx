import { Lock } from 'lucide-react';

const members = [
  { name: 'Sarah Mitchell', role: 'Owner', initials: 'SM', color: 'bg-primary-900', status: 'Active', statusColor: 'text-emerald-600' },
  { name: 'James Carter', role: 'Admin', initials: 'JC', color: 'bg-sky-600', status: 'Active', statusColor: 'text-emerald-600' },
  { name: 'Emma Roberts', role: 'Sales', initials: 'ER', color: 'bg-amber-500', status: 'Active', statusColor: 'text-emerald-600' },
  { name: 'Tom Wilson', role: 'Estimator', initials: 'TW', color: 'bg-emerald-600', status: 'Away', statusColor: 'text-amber-600' },
  { name: 'Lisa Chen', role: 'Installer', initials: 'LC', color: 'bg-violet-500', status: 'Offline', statusColor: 'text-slate-400' },
];

const summary = [
  { label: 'Team members', value: '5' },
  { label: 'Shared leads', value: '38' },
  { label: 'Active proposals', value: '12' },
];

export function TeamShowcase() {
  return (
    <div className="relative mx-auto w-full max-w-[640px]">
      <div className="absolute -right-10 top-10 h-72 w-72 rounded-full bg-sky-100/40 blur-3xl" />
      <div className="absolute -bottom-14 -left-10 h-64 w-64 rounded-full bg-violet-100/30 blur-3xl" />
      <div className="relative rounded-[1.6rem] border border-slate-200 bg-white p-2 shadow-[0_24px_70px_rgba(15,23,42,0.12)] sm:p-3">
        <div className="overflow-hidden rounded-[1.1rem] border border-slate-200 bg-[#f7f9fb]">
          {/* Browser bar */}
          <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3.5 sm:px-5">
            <div className="flex items-center gap-2.5">
              <div className="h-2.5 w-2.5 rounded-full bg-sky-600" />
              <span className="text-xs font-semibold tracking-wide text-primary-800">PlanningIndex</span>
              <span className="hidden text-[11px] text-slate-400 sm:inline">/ Team</span>
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
            <button type="button" className="rounded-md bg-primary-900 px-3 py-1.5 text-[10px] font-semibold text-white">
              + Invite member
            </button>
          </div>

          {/* Team list */}
          <div className="p-3 sm:p-4">
            <div className="space-y-2">
              {members.map((m) => (
                <div key={m.name} className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-2.5">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-full ${m.color} shrink-0`}>
                    <span className="text-[10px] font-semibold text-white">{m.initials}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-primary-900">{m.name}</p>
                    <div className="mt-0.5 flex items-center gap-1.5">
                      <span className="rounded-full bg-primary-100 px-2 py-0.5 text-[9px] font-semibold text-primary-600">{m.role}</span>
                      <span className={`flex items-center gap-1 text-[9px] font-medium ${m.statusColor}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${m.status === 'Active' ? 'bg-emerald-500' : m.status === 'Away' ? 'bg-amber-500' : 'bg-slate-300'}`} />
                        {m.status}
                      </span>
                    </div>
                  </div>
                  <button type="button" className="shrink-0 rounded-md border border-slate-200 px-2 py-1 text-[9px] font-semibold text-primary-700">
                    Manage
                  </button>
                </div>
              ))}
            </div>

            {/* Permissions note */}
            <div className="mt-3 flex items-center gap-2 rounded-lg bg-primary-50 px-3 py-2.5">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-sky-100 shrink-0">
                <Lock size={12} className="text-sky-700" />
              </div>
              <p className="text-[10px] text-primary-600">
                Role-based permissions control who can view, edit, and send proposals. Enforced server-side.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
