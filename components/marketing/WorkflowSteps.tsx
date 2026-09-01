import { Search, Filter, Target, Bookmark, FileText, Trophy } from 'lucide-react';
import { SectionLabel } from '@/components/ui';

const steps = [
  { number: '01', icon: Search, title: 'Find', description: 'Search thousands of planning applications across the UK.' },
  { number: '02', icon: Filter, title: 'Filter', description: 'Find applications relevant to your trade and area.' },
  { number: '03', icon: Target, title: 'Identify', description: 'See exactly what work is being proposed.' },
  { number: '04', icon: Bookmark, title: 'Save', description: 'Turn applications into leads in your CRM.' },
  { number: '05', icon: FileText, title: 'Contact', description: 'Generate professional proposals in minutes.' },
  { number: '06', icon: Trophy, title: 'Win work', description: 'Send physical proposals directly to the property.' },
];

export function WorkflowSteps() {
  return (
    <section className="bg-white px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <SectionLabel className="text-center">From planning application to signed contract</SectionLabel>
          <h2 className="font-display text-4xl font-bold leading-[1.08] tracking-[-0.04em] text-primary-900 sm:text-5xl">
            The complete workflow in six steps.
          </h2>
          <p className="mt-5 text-base leading-7 text-slate-600">
            PlanningIndex handles every step of the journey — from discovering a planning application to delivering a physical proposal to the property door.
          </p>
        </div>

        {/* Desktop: horizontal row with connector line */}
        <div className="hidden lg:block relative">
          <div className="absolute top-[3.25rem] left-[8.33%] right-[8.33%] h-px bg-slate-200" />
          <div className="grid grid-cols-6 gap-4">
            {steps.map((step) => (
              <div key={step.number} className="relative text-center">
                <div className="relative inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary-900 text-white shadow-md z-10">
                  <step.icon size={22} />
                </div>
                <span className="block mt-6 font-mono text-xs text-slate-400">{step.number}</span>
                <h3 className="mt-2 text-base font-semibold text-primary-900">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600 px-2">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile/tablet: vertical with left connector line */}
        <div className="lg:hidden relative">
          <div className="absolute left-7 top-2 bottom-2 w-px bg-slate-200" />
          <div className="space-y-8">
            {steps.map((step) => (
              <div key={step.number} className="relative flex items-start gap-5">
                <div className="relative inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary-900 text-white shadow-md z-10 shrink-0">
                  <step.icon size={22} />
                </div>
                <div className="pt-1">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-slate-400">{step.number}</span>
                    <h3 className="text-base font-semibold text-primary-900">{step.title}</h3>
                  </div>
                  <p className="mt-1.5 text-sm leading-6 text-slate-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
