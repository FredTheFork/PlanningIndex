import Link from 'next/link';
import {
  ArrowRight,
  BarChart3,
  Building2,
  Check,
  ChevronRight,
  FileText,
  Filter,
  Map,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  Zap,
} from 'lucide-react';
import { DarkCTABanner, FAQSection, SectionLabel } from '@/components/ui';

const searchRows = [
  { title: 'Replacement windows and doors', location: 'Harefield, UB9', type: 'Windows', status: 'Pending', tone: 'bg-amber-400' },
  { title: 'Rear extension and alterations', location: 'Rickmansworth, WD3', type: 'Extensions', status: 'Pending', tone: 'bg-sky-500' },
  { title: 'Construction of a new dwelling', location: 'Amersham, HP6', type: 'New build', status: 'Approved', tone: 'bg-emerald-500' },
  { title: 'Loft conversion with rear dormer', location: 'Chorleywood, WD3', type: 'Loft conversions', status: 'Pending', tone: 'bg-slate-500' },
];

const workflow = [
  {
    number: '01',
    icon: Search,
    title: 'Find the signal early',
    description: 'Search every planning application in your target area before the project becomes common knowledge.',
  },
  {
    number: '02',
    icon: Target,
    title: 'Spot the right opportunity',
    description: 'Filter by trade, location, application type, value, and status to focus your time where it matters.',
  },
  {
    number: '03',
    icon: Users,
    title: 'Turn insight into work',
    description: 'Save promising applications as leads, follow up with confidence, and move them through your pipeline.',
  },
];

const capabilities = [
  { icon: Map, eyebrow: 'Know your territory', title: 'A complete view of what is being built around you.', description: 'See planning activity across your chosen area with a map and list view designed for quick decisions.', detail: 'Nationwide UK coverage', color: 'bg-sky-50 text-sky-700' },
  { icon: Filter, eyebrow: 'Make it relevant', title: 'Less noise. More opportunities worth pursuing.', description: 'Use precise filters for keywords, councils, postcodes, dates, application types, and project value.', detail: 'Search the way you work', color: 'bg-amber-50 text-amber-700' },
  { icon: BarChart3, eyebrow: 'Build momentum', title: 'A clearer path from first look to signed job.', description: 'Keep applications, contacts, notes, proposals, and next actions connected in one focused workspace.', detail: 'One connected workflow', color: 'bg-emerald-50 text-emerald-700' },
];

const faqs = [
  { q: 'What is PlanningIndex?', a: 'PlanningIndex helps UK construction businesses discover relevant opportunities through public planning applications, then organise those opportunities into a focused lead pipeline.' },
  { q: 'Which planning applications can I search?', a: 'You can search across planning applications from councils and regions throughout the UK, using keywords, location, application type, dates, status, and other practical filters.' },
  { q: 'Is PlanningIndex only for builders?', a: 'No. It is designed for any trade that benefits from knowing what work is being proposed nearby, including roofers, window companies, extension specialists, landscapers, and more.' },
];

export default function HomePage() {
  return (
    <div className="min-h-screen overflow-hidden bg-white">
      <section className="relative bg-primary-950 px-6 pb-24 pt-36 text-white sm:pb-32 sm:pt-44">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-32 top-12 h-96 w-96 rounded-full bg-sky-500/10 blur-3xl" />
          <div className="absolute -right-40 bottom-0 h-[32rem] w-[32rem] rounded-full bg-cyan-400/10 blur-3xl" />
          <div className="absolute inset-x-0 top-0 h-full opacity-[0.06]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.7) 1px, transparent 1px)', backgroundSize: '72px 72px' }} />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="grid items-center gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
            <div className="max-w-2xl">
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-sky-300">
                <Sparkles size={14} />
                UK planning intelligence
              </div>
              <h1 className="max-w-2xl font-display text-5xl font-bold leading-[1.03] tracking-[-0.045em] text-white sm:text-6xl lg:text-7xl">
                Find the applications that create your next jobs.
              </h1>
              <p className="mt-7 max-w-xl text-lg leading-8 text-slate-300 sm:text-xl">
                PlanningIndex gives construction businesses a clearer view of what is being proposed across the UK, so you can find relevant projects, reach the right opportunities, and win more work.
              </p>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Link href="/login" className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-3.5 text-sm font-semibold text-primary-950 transition-all duration-200 hover:-translate-y-0.5 hover:bg-sky-50 hover:shadow-lg hover:shadow-sky-950/30">
                  Start searching
                  <ArrowRight size={17} />
                </Link>
                <Link href="/features" className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/20 px-6 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:border-white/40 hover:bg-white/10">
                  Explore PlanningIndex
                  <ChevronRight size={17} />
                </Link>
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-400">
                <span className="inline-flex items-center gap-2"><Check size={15} className="text-sky-400" /> UK-wide coverage</span>
                <span className="inline-flex items-center gap-2"><Check size={15} className="text-sky-400" /> Built for construction</span>
                <span className="inline-flex items-center gap-2"><Check size={15} className="text-sky-400" /> Updated daily</span>
              </div>
            </div>

            <div className="relative lg:pl-4">
              <div className="absolute -inset-8 rounded-[2rem] bg-sky-400/10 blur-3xl" />
              <div className="relative rounded-2xl border border-white/15 bg-white/[0.07] p-2 shadow-2xl shadow-black/40 backdrop-blur-sm sm:p-3">
                <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-slate-50 text-primary-900 shadow-xl">
                  <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 sm:px-5">
                    <div className="flex items-center gap-2.5">
                      <div className="flex gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-slate-300" /><span className="h-2.5 w-2.5 rounded-full bg-slate-300" /><span className="h-2.5 w-2.5 rounded-full bg-slate-300" /></div>
                      <span className="ml-2 text-xs font-semibold text-slate-500">Planning Search</span>
                    </div>
                    <span className="hidden text-[11px] font-medium text-slate-400 sm:block">Live opportunity view</span>
                  </div>
                  <div className="p-4 sm:p-6">
                    <div className="mb-4 flex items-center justify-between">
                      <div><p className="text-sm font-semibold text-primary-900">Find your next opportunity</p><p className="mt-1 text-xs text-slate-500">Search planning applications across the UK</p></div>
                      <div className="hidden h-9 w-9 items-center justify-center rounded-lg bg-sky-50 text-sky-700 sm:flex"><Search size={17} /></div>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
                      <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5"><Search size={15} className="text-slate-400" /><span className="text-xs text-slate-500">Search by keyword, project, or reference...</span></div>
                      <div className="mt-3 grid grid-cols-3 gap-2">
                        <div className="rounded-lg border border-slate-200 px-2.5 py-2"><span className="block text-[9px] font-semibold uppercase tracking-wide text-slate-400">Location</span><span className="mt-1 block truncate text-xs font-semibold text-primary-800">Harefield</span></div>
                        <div className="rounded-lg border border-slate-200 px-2.5 py-2"><span className="block text-[9px] font-semibold uppercase tracking-wide text-slate-400">Radius</span><span className="mt-1 block truncate text-xs font-semibold text-primary-800">25 miles</span></div>
                        <div className="rounded-lg border border-slate-200 px-2.5 py-2"><span className="block text-[9px] font-semibold uppercase tracking-wide text-slate-400">Trade</span><span className="mt-1 block truncate text-xs font-semibold text-primary-800">Windows</span></div>
                      </div>
                      <button type="button" className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-primary-900 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-primary-800"><Search size={14} /> Search applications</button>
                    </div>
                    <div className="mt-4 flex items-center justify-between"><span className="text-xs font-semibold text-primary-800">Recent opportunities</span><span className="text-[11px] font-medium text-sky-700">247 found</span></div>
                    <div className="mt-2 divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
                      {searchRows.map((row) => (
                        <div key={row.title} className="flex items-center gap-3 px-3 py-3 transition-colors hover:bg-slate-50 sm:px-4">
                          <span className={`h-2 w-2 shrink-0 rounded-full ${row.tone}`} />
                          <div className="min-w-0 flex-1"><p className="truncate text-xs font-semibold text-primary-800">{row.title}</p><p className="mt-0.5 truncate text-[10px] text-slate-500">{row.location} · {row.type}</p></div>
                          <span className="hidden rounded-full bg-amber-50 px-2 py-1 text-[10px] font-semibold text-amber-700 sm:block">{row.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-200 bg-slate-100/80 px-4 py-3 text-[10px] text-slate-500 sm:px-6"><span className="inline-flex items-center gap-1.5"><MapPin size={12} /> 100% UK coverage</span><span className="inline-flex items-center gap-1.5"><ShieldCheck size={12} /> Data updated daily</span></div>
                </div>
              </div>
              <div className="absolute -bottom-5 -left-5 hidden items-center gap-3 rounded-xl border border-white/20 bg-slate-900/90 px-4 py-3 shadow-xl backdrop-blur sm:flex"><div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-400/15 text-emerald-400"><Zap size={17} /></div><div><p className="text-xs font-semibold text-white">Opportunity found</p><p className="mt-0.5 text-[10px] text-slate-400">Ready to add to leads</p></div></div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white px-6 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 sm:flex-row">
          <p className="text-center text-sm font-medium text-slate-500 sm:text-left">One focused view of the signals that matter to your business.</p>
          <div className="flex flex-wrap justify-center gap-x-7 gap-y-3 text-xs font-semibold uppercase tracking-[0.12em] text-slate-400"><span>Search</span><span>Discover</span><span>Qualify</span><span>Win</span></div>
        </div>
      </section>

      <section className="bg-white px-6 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-16 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
            <div className="max-w-md"><SectionLabel>From signal to opportunity</SectionLabel><h2 className="font-display text-4xl font-bold leading-tight tracking-[-0.035em] text-primary-900 sm:text-5xl">The work is already being planned. See it sooner.</h2><p className="mt-6 text-base leading-7 text-slate-600">Stop relying on word of mouth and scattered council websites. PlanningIndex brings the earliest, clearest view of local construction demand into one calm workspace.</p><Link href="/features" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-sky-700 transition-colors hover:text-sky-900">See how it works <ArrowRight size={16} /></Link></div>
            <div className="grid gap-5 sm:grid-cols-3">
              {workflow.map((item) => (<div key={item.number} className="group rounded-2xl border border-slate-200 bg-slate-50 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-sky-200 hover:bg-white hover:shadow-xl hover:shadow-slate-200/60"><div className="flex items-center justify-between"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-900 text-white"><item.icon size={20} /></div><span className="font-mono text-xs font-medium text-slate-400">{item.number}</span></div><h3 className="mt-8 text-base font-semibold text-primary-900">{item.title}</h3><p className="mt-3 text-sm leading-6 text-slate-600">{item.description}</p></div>))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-6 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center"><SectionLabel className="text-center">Built around the way you work</SectionLabel><h2 className="font-display text-4xl font-bold leading-tight tracking-[-0.035em] text-primary-900 sm:text-5xl">Clarity at every stage of the opportunity.</h2><p className="mt-5 text-base leading-7 text-slate-600">Planning data is only useful when it helps you make a better decision. Every part of PlanningIndex is designed to move you forward.</p></div>
          <div className="mt-16 grid gap-6 lg:grid-cols-3">{capabilities.map((item) => (<div key={item.title} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/70"><div className="flex h-52 items-center justify-center border-b border-slate-100 bg-[linear-gradient(135deg,#f8fafc_0%,#eef5f9_100%)]"><div className="relative h-28 w-44 rounded-xl border border-slate-300 bg-white p-3 shadow-lg transition-transform duration-300 group-hover:scale-105"><div className="flex gap-1 border-b border-slate-100 pb-2"><span className="h-1.5 w-1.5 rounded-full bg-slate-300" /><span className="h-1.5 w-1.5 rounded-full bg-slate-300" /><span className="h-1.5 w-1.5 rounded-full bg-slate-300" /></div><div className="mt-3 flex gap-2"><div className="flex-1 space-y-2"><span className="block h-2 w-3/4 rounded bg-slate-200" /><span className="block h-2 w-full rounded bg-slate-100" /><span className="block h-2 w-1/2 rounded bg-slate-100" /></div><div className={`flex h-10 w-10 items-center justify-center rounded-lg ${item.color}`}><item.icon size={18} /></div></div></div></div><div className="p-7"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-sky-700">{item.eyebrow}</p><h3 className="mt-3 text-xl font-semibold leading-snug text-primary-900">{item.title}</h3><p className="mt-3 text-sm leading-6 text-slate-600">{item.description}</p><div className="mt-6 flex items-center gap-2 text-xs font-semibold text-slate-500"><Check size={14} className="text-emerald-600" /> {item.detail}</div></div></div>))}</div>
        </div>
      </section>

      <section className="bg-primary-950 px-6 py-24 text-white sm:py-32">
        <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1fr_1fr] lg:gap-24">
          <div><SectionLabel className="text-sky-300">Your competitive advantage</SectionLabel><h2 className="font-display text-4xl font-bold leading-tight tracking-[-0.035em] text-white sm:text-5xl">Be first to the opportunity, not last to hear about it.</h2><p className="mt-6 max-w-xl text-base leading-7 text-slate-300">The earlier you understand what is happening in your market, the more confidently you can choose where to spend your time.</p><div className="mt-8 space-y-4">{['Search every council from one place', 'Save promising applications as live leads', 'Keep every next step visible and organised'].map((item) => (<div key={item} className="flex items-center gap-3 text-sm font-medium text-slate-200"><span className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-400/15 text-sky-300"><Check size={14} /></span>{item}</div>))}</div></div>
          <div className="relative"><div className="absolute -inset-5 rounded-3xl bg-sky-400/10 blur-2xl" /><div className="relative rounded-2xl border border-white/15 bg-white/[0.06] p-5 backdrop-blur sm:p-7"><div className="flex items-center justify-between border-b border-white/10 pb-5"><div><p className="text-sm font-semibold text-white">Opportunity pipeline</p><p className="mt-1 text-xs text-slate-400">This month</p></div><span className="rounded-full bg-emerald-400/15 px-2.5 py-1 text-[10px] font-semibold text-emerald-300">+24% this month</span></div><div className="mt-7 grid grid-cols-3 gap-3">{[{ label: 'New leads', value: '38' }, { label: 'In progress', value: '16' }, { label: 'Won', value: '09' }].map((item) => (<div key={item.label} className="rounded-xl border border-white/10 bg-white/[0.05] p-3"><p className="text-[10px] text-slate-400">{item.label}</p><p className="mt-2 font-display text-2xl font-bold text-white">{item.value}</p></div>))}</div><div className="mt-7 space-y-4">{['Replacement windows and doors', 'Rear extension and alterations', 'Loft conversion with rear dormer'].map((item, index) => (<div key={item} className="flex items-center gap-3"><div className={`h-2 w-2 rounded-full ${index === 0 ? 'bg-sky-400' : index === 1 ? 'bg-amber-400' : 'bg-emerald-400'}`} /><span className="flex-1 truncate text-xs text-slate-300">{item}</span><span className="text-[10px] text-slate-500">{index + 2}d ago</span></div>))}</div></div></div>
        </div>
      </section>

      <section className="bg-white px-6 py-24 sm:py-32"><div className="mx-auto max-w-5xl"><div className="grid gap-12 md:grid-cols-3 md:gap-8"><div className="md:col-span-1"><SectionLabel>Designed for confidence</SectionLabel><h2 className="font-display text-3xl font-bold leading-tight tracking-[-0.03em] text-primary-900">A sharper way to find work.</h2></div><div className="md:col-span-2 grid gap-5 sm:grid-cols-2">{[{ icon: Building2, title: 'Made for UK construction', text: 'Built around the locations, language, and decisions your business makes every day.' }, { icon: FileText, title: 'More than a database', text: 'Go from an application to an organised opportunity without losing context.' }, { icon: ShieldCheck, title: 'A dependable foundation', text: 'Clear information, calm workflows, and a product you can rely on as you grow.' }, { icon: Zap, title: 'Ready when you are', text: 'Start with one area or expand your view as your business and ambition grow.' }].map((item) => (<div key={item.title} className="rounded-xl border border-slate-200 p-5"><item.icon size={20} className="text-sky-700" /><h3 className="mt-4 text-sm font-semibold text-primary-900">{item.title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{item.text}</p></div>))}</div></div></div></section>

      <FAQSection items={faqs} title="Questions, answered clearly" label="Before you start" collapsible />
      <DarkCTABanner title="The next job may already be in the data." subtitle="Start with a clearer view of your market and turn planning activity into your next opportunity." ctaLabel="Start searching" ctaHref="/login" note="Explore PlanningIndex · Built for UK construction professionals" />
    </div>
  );
}
