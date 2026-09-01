import { Check, CreditCard, Building2 } from 'lucide-react';

const councils = [
  'Buckinghamshire Council',
  'Three Rivers District',
  'Hertsmere Borough',
  'Dacorum Borough',
];

export function AccountShowcase() {
  return (
    <div className="relative mx-auto w-full max-w-[640px]">
      <div className="absolute -left-10 top-10 h-72 w-72 rounded-full bg-sky-100/40 blur-3xl" />
      <div className="absolute -bottom-14 -right-10 h-64 w-64 rounded-full bg-emerald-100/40 blur-3xl" />
      <div className="relative rounded-[1.6rem] border border-slate-200 bg-white p-2 shadow-[0_24px_70px_rgba(15,23,42,0.12)] sm:p-3">
        <div className="overflow-hidden rounded-[1.1rem] border border-slate-200 bg-[#f7f9fb]">
          {/* Browser bar */}
          <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3.5 sm:px-5">
            <div className="flex items-center gap-2.5">
              <div className="h-2.5 w-2.5 rounded-full bg-sky-600" />
              <span className="text-xs font-semibold tracking-wide text-primary-800">PlanningIndex</span>
              <span className="hidden text-[11px] text-slate-400 sm:inline">/ Settings / Account</span>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-medium text-slate-500">
              <span className="h-7 w-7 rounded-full bg-primary-100" />
            </div>
          </div>

          <div className="grid md:grid-cols-2">
            {/* Left: Company profile */}
            <div className="border-b border-slate-200 bg-white p-4 sm:p-5 md:border-b-0 md:border-r">
              <div className="mb-4 flex items-center gap-2">
                <Building2 size={14} className="text-sky-700" />
                <p className="text-sm font-semibold text-primary-900">Company profile</p>
              </div>

              <div className="space-y-2.5">
                <div className="rounded-lg border border-slate-200 px-3 py-2">
                  <span className="block text-[9px] font-semibold uppercase tracking-[0.1em] text-slate-400">Company name</span>
                  <span className="mt-0.5 block text-xs font-medium text-primary-800">Thames Construction Ltd</span>
                </div>
                <div className="rounded-lg border border-slate-200 px-3 py-2">
                  <span className="block text-[9px] font-semibold uppercase tracking-[0.1em] text-slate-400">Address</span>
                  <span className="mt-0.5 block text-xs font-medium text-primary-800">14 Industrial Park, Uxbridge, UB8 1AB</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-lg border border-slate-200 px-3 py-2">
                    <span className="block text-[9px] font-semibold uppercase tracking-[0.1em] text-slate-400">Phone</span>
                    <span className="mt-0.5 block text-xs font-medium text-primary-800">01895 123456</span>
                  </div>
                  <div className="rounded-lg border border-slate-200 px-3 py-2">
                    <span className="block text-[9px] font-semibold uppercase tracking-[0.1em] text-slate-400">Email</span>
                    <span className="mt-0.5 block text-xs font-medium text-primary-800">info@thames.co.uk</span>
                  </div>
                </div>
                <div className="rounded-lg border border-slate-200 px-3 py-2">
                  <span className="block text-[9px] font-semibold uppercase tracking-[0.1em] text-slate-400">Website</span>
                  <span className="mt-0.5 block text-xs font-medium text-primary-800">www.thames-construction.co.uk</span>
                </div>
              </div>

              <p className="mt-3 text-[9px] text-slate-400">Company details auto-populate in proposals and documents.</p>
            </div>

            {/* Right: Plan & Council access */}
            <div className="p-4 sm:p-5">
              {/* Current plan */}
              <div className="mb-4 rounded-lg border border-sky-200 bg-sky-50/50 p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CreditCard size={14} className="text-sky-700" />
                    <p className="text-sm font-semibold text-primary-900">Current plan</p>
                  </div>
                  <span className="rounded-full bg-sky-600 px-2.5 py-0.5 text-[10px] font-semibold text-white">Regional</span>
                </div>
                <div className="mt-2.5 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-slate-500">Billing cycle</p>
                    <p className="text-xs font-semibold text-primary-800">Monthly · £79/mo</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500">Next payment</p>
                    <p className="text-xs font-semibold text-primary-800">01 Oct 2026</p>
                  </div>
                </div>
                <button type="button" className="mt-3 w-full rounded-md border border-slate-200 bg-white py-2 text-[10px] font-semibold text-primary-700">
                  Manage subscription
                </button>
              </div>

              {/* Council access */}
              <div>
                <p className="mb-2 text-sm font-semibold text-primary-900">Council access</p>
                <div className="space-y-1.5">
                  {councils.map((c) => (
                    <div key={c} className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 shrink-0">
                        <Check size={11} className="text-emerald-600" />
                      </div>
                      <span className="flex-1 text-xs font-medium text-primary-800">{c}</span>
                    </div>
                  ))}
                </div>
                <p className="mt-2 text-[9px] text-slate-400">4 of 10 councils covered on Regional plan</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
