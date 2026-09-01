import { Search, Users, FileText } from 'lucide-react';
import { SectionLabel } from '@/components/ui';

const steps = [
  {
    icon: Search,
    title: 'Search Applications',
    desc: 'Find every planning application in the UK the day it goes public. Filter by keyword, location, type, and value to find jobs that match your trade.',
  },
  {
    icon: Users,
    title: 'Manage Leads',
    desc: 'Turn planning applications into qualified leads. Track conversations, manage your pipeline, and never lose touch with a potential client.',
  },
  {
    icon: FileText,
    title: 'Send Proposals',
    desc: 'Generate branded PDF proposals in one click. Send them straight from the platform and track when your client opens them.',
  },
];

export function HowItSteps() {
  return (
    <section className="bg-white py-24 px-6">
      <div className="max-w-page mx-auto">
        <div className="text-center mb-16">
          <SectionLabel className="text-center">How It Works</SectionLabel>
          <h2 className="font-display font-bold text-primary-900 text-h2 mt-2">
            From search to signed contract in three steps
          </h2>
          <p className="font-sans text-primary-500 mt-4 max-w-2xl mx-auto" style={{ fontSize: '1.05rem' }}>
            PlanningIndex streamlines the entire process of finding work, managing leads, and winning jobs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={step.title} className="relative">
              <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-accent-100 mb-6">
                <step.icon className="text-accent-700" size={28} />
              </div>
              <div className="flex items-center gap-3 mb-3">
                <span className="font-mono text-accent-600 font-bold" style={{ fontSize: '0.85rem' }}>
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="font-sans font-semibold text-primary-900 text-h4">
                  {step.title}
                </h3>
              </div>
              <p className="font-sans text-primary-500 leading-relaxed text-sm">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
