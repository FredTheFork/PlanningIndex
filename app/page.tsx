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
  Target,
  Users,
  Zap,
} from 'lucide-react';
import { DarkCTABanner, FAQSection, SectionLabel } from '@/components/ui';
import {
  WorkflowSteps,
  ProductShowcaseSection,
  PlanningSearchShowcase,
  ApplicationDetailShowcase,
  CRMPipelineShowcase,
  ProposalShowcase,
} from '@/components/marketing';

const applications = [
  { title: 'Replacement windows and doors', location: 'Harefield, UB9', type: 'Windows', status: 'Pending', color: 'bg-amber-500' },
  { title: 'Rear extension and alterations', location: 'Rickmansworth, WD3', type: 'Extensions', status: 'Pending', color: 'bg-sky-600' },
  { title: 'Construction of a new dwelling', location: 'Amersham, HP6', type: 'New build', status: 'Approved', color: 'bg-emerald-600' },
];

const capabilities = [
  { icon: Map, eyebrow: 'See the whole market', title: 'A clearer view of what is being built around you.', description: 'Search across the UK with a map and list view designed to help you make quick, informed decisions.', detail: 'Nationwide UK coverage', accent: 'bg-sky-50 text-sky-700' },
  { icon: Filter, eyebrow: 'Make it relevant', title: 'Less noise. More opportunities worth pursuing.', description: 'Use practical filters for keywords, councils, postcodes, dates, application types, and project value.', detail: 'Search the way you work', accent: 'bg-amber-50 text-amber-700' },
  { icon: BarChart3, eyebrow: 'Keep moving forward', title: 'A direct path from first look to signed job.', description: 'Keep applications, contacts, notes, proposals, and next actions connected in one focused workspace.', detail: 'One connected workflow', accent: 'bg-emerald-50 text-emerald-700' },
];

const faqs = [
  { q: 'What is PlanningIndex?', a: 'PlanningIndex helps UK construction businesses discover relevant opportunities through public planning applications, then organise those opportunities into a focused lead pipeline.' },
  { q: 'Which planning applications can I search?', a: 'You can search across planning applications from councils and regions throughout the UK, using keywords, location, application type, dates, status, and other practical filters.' },
  { q: 'Is PlanningIndex only for builders?', a: 'No. It is designed for any trade that benefits from knowing what work is being proposed nearby, including roofers, window companies, extension specialists, landscapers, and more.' },
];

const mapMarkers = [
  { left: '18%', top: '30%', color: 'bg-amber-500' },
  { left: '58%', top: '18%', color: 'bg-sky-600' },
  { left: '72%', top: '65%', color: 'bg-emerald-600' },
  { left: '38%', top: '72%', color: 'bg-primary-700' },
];

const designPoints = [
  { icon: Building2, title: 'Made for UK construction', text: 'Built around the locations, language, and decisions your business makes every day.' },
  { icon: FileText, title: 'More than a database', text: 'Go from an application to an organised opportunity without losing context.' },
  { icon: ShieldCheck, title: 'A dependable foundation', text: 'Clear information, calm workflows, and a product you can rely on as you grow.' },
  { icon: Zap, title: 'Ready when you are', text: 'Start with one area or expand your view as your business and ambition grow.' },
];

function ProductSearchPreview() {
  return (
    <div className="relative mx-auto w-full max-w-[620px]">
      <div className="absolute -right-10 top-10 h-72 w-72 rounded-full bg-sky-200/50 blur-3xl" />
      <div className="absolute -bottom-14 -left-10 h-64 w-64 rounded-full bg-amber-100/70 blur-3xl" />
      <div className="relative rounded-[1.6rem] border border-slate-200 bg-white p-2 shadow-[0_24px_70px_rgba(15,23,42,0.12)] sm:p-3">
        <div className="overflow-hidden rounded-[1.1rem] border border-slate-200 bg-[#f7f9fb]">
          {/* Browser bar */}
          <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3.5 sm:px-5">
            <div className="flex items-center gap-2.5">
              <div className="h-2.5 w-2.5 rounded-full bg-sky-600" />
              <span className="text-xs font-semibold tracking-wide text-primary-800">PlanningIndex</span>
              <span className="hidden text-[11px] text-slate-400 sm:inline">/ Search</span>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-medium text-slate-500">
              <span className="hidden sm:inline">Saved searches</span>
              <span className="h-7 w-7 rounded-full bg-primary-100" />
            </div>
          </div>

          {/* Two-panel layout */}
          <div className="grid md:grid-cols-[0.95fr_1.05fr]">
            {/* Left: Search form */}
            <div className="border-b border-slate-200 bg-white p-4 sm:p-6 md:border-b-0 md:border-r">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-primary-900">Find your next opportunity</p>
                  <p className="mt-1.5 text-xs leading-5 text-slate-500">Search planning applications across the UK.</p>
                </div>
                <div className="rounded-lg bg-sky-50 p-2 text-sky-700">
                  <Search size={16} />
                </div>
              </div>
              <div className="mt-5 space-y-3">
                <div className="rounded-lg border border-slate-200 px-3 py-2.5">
                  <span className="block text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-400">Keyword</span>
                  <span className="mt-1 block text-xs font-medium text-primary-800">Windows</span>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="rounded-lg border border-slate-200 px-3 py-2.5">
                    <span className="block text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-400">Location</span>
                    <span className="mt-1 block text-xs font-medium text-primary-800">Harefield</span>
                  </div>
                  <div className="rounded-lg border border-slate-200 px-3 py-2.5">
                    <span className="block text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-400">Radius</span>
                    <span className="mt-1 block text-xs font-medium text-primary-800">25 miles</span>
                  </div>
                </div>
                <div className="rounded-lg border border-slate-200 px-3 py-2.5">
                  <span className="block text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-400">Application type</span>
                  <span className="mt-1 block text-xs font-medium text-primary-800">All applications</span>
                </div>
                <button type="button" className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary-900 py-3 text-xs font-semibold text-white">
                  <Search size={14} /> Search applications
                </button>
              </div>
              <div className="mt-5 flex items-center gap-2 text-[10px] text-slate-500">
                <ShieldCheck size={13} className="text-emerald-600" /> Daily data updates across the UK
              </div>
            </div>

            {/* Right: Map view */}
            <div className="relative min-h-[340px] overflow-hidden bg-[#eef4f6] p-4 sm:p-6">
              <div
                className="absolute inset-0 opacity-50"
                style={{
                  backgroundImage:
                    'linear-gradient(35deg, transparent 48%, rgba(148,163,184,.25) 49%, transparent 50%), linear-gradient(120deg, transparent 48%, rgba(148,163,184,.2) 49%, transparent 50%)',
                  backgroundSize: '92px 82px, 120px 110px',
                }}
              />
              <div className="absolute left-8 top-14 h-28 w-40 rounded-[45%] border border-slate-300/70 bg-white/35" />
              <div className="absolute bottom-14 right-4 h-36 w-48 rounded-[45%] border border-slate-300/70 bg-white/30" />

              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-primary-900">Applications near Harefield</p>
                  <p className="mt-1 text-[10px] text-slate-500">247 results · updated today</p>
                </div>
                <button type="button" className="rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-[10px] font-semibold text-primary-700">
                  Map view
                </button>
              </div>

              <div className="relative mt-10 h-40">
                {mapMarkers.map((marker, index) => (
                  <span
                    key={`${marker.left}-${marker.top}`}
                    className={`absolute flex h-7 w-7 items-center justify-center rounded-full border-4 border-white shadow-md ${marker.color}`}
                    style={{ left: marker.left, top: marker.top }}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-white" />
                  </span>
                ))}
                <div className="absolute bottom-0 left-0 rounded-lg border border-white bg-white/90 px-3 py-2 shadow-sm">
                  <p className="text-[10px] font-semibold text-primary-800">4 relevant projects</p>
                  <p className="mt-0.5 text-[9px] text-slate-500">within your search area</p>
                </div>
              </div>

              <div className="relative mt-3 flex items-center justify-between border-t border-slate-300/60 pt-3 text-[10px] text-slate-500">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin size={12} /> 25 mile radius
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-amber-500" /> Relevant
                </span>
              </div>
            </div>
          </div>

          {/* Footer: Recent opportunities */}
          <div className="border-t border-slate-200 bg-white px-4 py-3 sm:px-5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">Recent opportunities</span>
              <span className="text-[10px] font-semibold text-sky-700">247 found</span>
            </div>
            <div className="mt-2 grid gap-1.5 sm:grid-cols-3">
              {applications.map((app) => (
                <div key={app.title} className="flex min-w-0 items-center gap-2 rounded-md px-1 py-1">
                  <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${app.color}`} />
                  <span className="truncate text-[10px] font-medium text-primary-700">{app.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen overflow-hidden bg-white">
      {/* Hero */}
      <section className="relative bg-[#f7f9fc] px-6 pb-20 pt-36 sm:pb-28 sm:pt-44">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(115deg, rgba(226,239,247,.65), transparent 42%), radial-gradient(circle at 80% 20%, rgba(219,234,254,.7), transparent 32%)',
          }}
        />
        <div className="relative mx-auto max-w-7xl">
          <div className="grid items-center gap-16 lg:grid-cols-[0.84fr_1.16fr] lg:gap-20">
            <div className="max-w-xl">
              <div className="mb-7 inline-flex items-center gap-2 border-b border-sky-200 pb-2 text-xs font-semibold uppercase tracking-[0.18em] text-sky-800">
                <span className="h-1.5 w-1.5 rounded-full bg-sky-600" /> UK planning intelligence
              </div>
              <h1 className="font-display text-5xl font-bold leading-[1.04] tracking-[-0.05em] text-primary-950 sm:text-6xl lg:text-[4.5rem]">
                Find the applications that create your next jobs.
              </h1>
              <p className="mt-7 max-w-lg text-lg leading-8 text-slate-600 sm:text-xl">
                PlanningIndex gives construction businesses a clearer view of what is being proposed across the UK, so you can find relevant projects, reach the right opportunities, and win more work.
              </p>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary-900 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-primary-800"
                >
                  Start searching <ArrowRight size={17} />
                </Link>
                <Link
                  href="/features"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-primary-800 transition-colors hover:border-slate-400 hover:bg-slate-50"
                >
                  Explore PlanningIndex <ChevronRight size={17} />
                </Link>
              </div>
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500">
                <span className="inline-flex items-center gap-2">
                  <Check size={15} className="text-emerald-600" /> UK-wide coverage
                </span>
                <span className="inline-flex items-center gap-2">
                  <Check size={15} className="text-emerald-600" /> Built for construction
                </span>
                <span className="inline-flex items-center gap-2">
                  <Check size={15} className="text-emerald-600" /> Updated daily
                </span>
              </div>
            </div>
            <ProductSearchPreview />
          </div>
        </div>
      </section>

      {/* Signal bar */}
      <section className="border-y border-slate-200 bg-white px-6 py-7">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-center text-sm font-medium text-slate-500 sm:text-left">
            A focused view of the signals that matter to your business.
          </p>
          <div className="flex flex-wrap justify-center gap-x-7 gap-y-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
            <span>Search</span>
            <span>Discover</span>
            <span>Qualify</span>
            <span>Win</span>
          </div>
        </div>
      </section>

      {/* Phase 5: Six-step workflow */}
      <WorkflowSteps />

      {/* Phase 6: Planning Search showcase */}
      <ProductShowcaseSection
        label="Planning Search"
        title="Search every UK planning application from one place."
        description="Nationwide coverage, updated daily. Filter by keyword, location, radius, application type, status, date, and council to find the exact projects that match your trade."
      >
        <PlanningSearchShowcase />
      </ProductShowcaseSection>

      {/* Phase 6: Application Detail showcase */}
      <ProductShowcaseSection
        label="Application Details"
        title="Every application, fully broken down."
        description="See the full picture — description, documents, status history, decision dates, council details, and property location. No more clicking through council websites."
        reverse
        className="bg-[#f7f9fc]"
      >
        <ApplicationDetailShowcase />
      </ProductShowcaseSection>

      {/* Phase 6: CRM Pipeline showcase */}
      <ProductShowcaseSection
        label="Lead Pipeline"
        title="Turn planning data into a managed pipeline."
        description="Drag cards from New Lead to Won. Track pipeline value and win rate at every stage. Keep every conversation, note, and follow-up connected to the right application."
      >
        <CRMPipelineShowcase />
      </ProductShowcaseSection>

      {/* Phase 6: Proposal showcase */}
      <ProductShowcaseSection
        label="Professional Proposals"
        title="From application to posted proposal, without leaving the platform."
        description="Auto-populate proposals from planning application data. Edit, preview, and send by physical post — printed, delivered, and tracked to the property door."
        reverse
        className="bg-[#f7f9fc]"
      >
        <ProposalShowcase />
      </ProductShowcaseSection>

      {/* Capabilities */}
      <section className="bg-white px-6 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <SectionLabel className="text-center">Built around the way you work</SectionLabel>
            <h2 className="font-display text-4xl font-bold leading-[1.08] tracking-[-0.04em] text-primary-900 sm:text-5xl">
              Clarity at every stage of the opportunity.
            </h2>
            <p className="mt-5 text-base leading-7 text-slate-600">
              Planning data is only useful when it helps you make a better decision. Every part of PlanningIndex is designed to move you forward.
            </p>
          </div>
          <div className="mt-16 grid gap-6 lg:grid-cols-3">
            {capabilities.map((item) => (
              <div key={item.title} className="border border-slate-200 bg-white">
                <div className="flex h-44 items-center justify-center border-b border-slate-200 bg-[#fbfcfd]">
                  <div className="relative h-24 w-40 border border-slate-300 bg-white p-3 shadow-[0_12px_24px_rgba(15,23,42,0.08)]">
                    <div className="flex gap-1 border-b border-slate-100 pb-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                    </div>
                    <div className="mt-3 flex gap-2">
                      <div className="flex-1 space-y-2">
                        <span className="block h-2 w-3/4 rounded bg-slate-200" />
                        <span className="block h-2 w-full rounded bg-slate-100" />
                        <span className="block h-2 w-1/2 rounded bg-slate-100" />
                      </div>
                      <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${item.accent}`}>
                        <item.icon size={17} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-7">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sky-700">{item.eyebrow}</p>
                  <h3 className="mt-3 text-xl font-semibold leading-snug text-primary-900">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{item.description}</p>
                  <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-slate-500">
                    <Check size={14} className="text-emerald-600" /> {item.detail}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Competitive advantage */}
      <section className="bg-primary-900 px-6 py-24 text-white sm:py-32">
        <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2 lg:gap-24">
          <div>
            <SectionLabel className="text-sky-300">Your competitive advantage</SectionLabel>
            <h2 className="font-display text-4xl font-bold leading-[1.08] tracking-[-0.04em] text-white sm:text-5xl">
              Be first to the opportunity, not last to hear about it.
            </h2>
            <p className="mt-6 max-w-xl text-base leading-7 text-slate-300">
              The earlier you understand what is happening in your market, the more confidently you can choose where to spend your time.
            </p>
            <div className="mt-8 space-y-4">
              {['Search every council from one place', 'Save promising applications as live leads', 'Keep every next step visible and organised'].map((item) => (
                <div key={item} className="flex items-center gap-3 text-sm font-medium text-slate-200">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-400/15 text-sky-300">
                    <Check size={14} />
                  </span>
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="border border-white/15 bg-white/[0.06] p-5 sm:p-7">
            <div className="flex items-center justify-between border-b border-white/10 pb-5">
              <div>
                <p className="text-sm font-semibold text-white">Opportunity pipeline</p>
                <p className="mt-1 text-xs text-slate-400">This month</p>
              </div>
              <span className="rounded-full bg-emerald-400/15 px-2.5 py-1 text-[10px] font-semibold text-emerald-300">
                +24% this month
              </span>
            </div>
            <div className="mt-7 grid grid-cols-3 gap-3">
              {[
                { label: 'New leads', value: '38' },
                { label: 'In progress', value: '16' },
                { label: 'Won', value: '09' },
              ].map((stat) => (
                <div key={stat.label} className="border border-white/10 bg-white/[0.05] p-3">
                  <p className="text-[10px] text-slate-400">{stat.label}</p>
                  <p className="mt-2 font-display text-2xl font-bold text-white">{stat.value}</p>
                </div>
              ))}
            </div>
            <div className="mt-7 space-y-4">
              {[
                { label: 'Replacement windows and doors', color: 'bg-sky-400', days: 2 },
                { label: 'Rear extension and alterations', color: 'bg-amber-400', days: 3 },
                { label: 'Loft conversion with rear dormer', color: 'bg-emerald-400', days: 4 },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <div className={`h-2 w-2 rounded-full ${item.color}`} />
                  <span className="flex-1 truncate text-xs text-slate-300">{item.label}</span>
                  <span className="text-[10px] text-slate-500">{item.days}d ago</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Design points */}
      <section className="bg-white px-6 py-24 sm:py-32">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-12 md:grid-cols-3 md:gap-8">
            <div>
              <SectionLabel>Designed for confidence</SectionLabel>
              <h2 className="font-display text-3xl font-bold leading-tight tracking-[-0.03em] text-primary-900">
                A sharper way to find work.
              </h2>
            </div>
            <div className="grid gap-5 sm:col-span-2 sm:grid-cols-2">
              {designPoints.map((item) => (
                <div key={item.title} className="border border-slate-200 p-5">
                  <item.icon size={20} className="text-sky-700" />
                  <h3 className="mt-4 text-sm font-semibold text-primary-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <FAQSection items={faqs} title="Questions, answered clearly" label="Before you start" collapsible />
      <DarkCTABanner
        title="The next job may already be in the data."
        subtitle="Start with a clearer view of your market and turn planning activity into your next opportunity."
        ctaLabel="Start searching"
        ctaHref="/login"
        note="Explore PlanningIndex · Built for UK construction professionals"
      />
    </div>
  );
}
