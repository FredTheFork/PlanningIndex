import Link from 'next/link';
import { Search, MapPin, FileText, Users, TrendingUp, Mail } from 'lucide-react';
import { Card } from '@/components/ui';

const features = [
  { icon: Search, title: 'Planning Search', desc: 'Search planning applications by reference, applicant, postcode, or keyword across all UK authorities.' },
  { icon: MapPin, title: 'Map Search', desc: 'Find applications geographically. Draw boundaries, identify opportunities, and visualise planning activity.' },
  { icon: FileText, title: 'Application Details', desc: 'Full application breakdowns — documents, status history, decision dates, and related applications.' },
  { icon: Users, title: 'Leads & CRM', desc: 'Turn planning data into actionable leads. Manage contacts, track conversations, and build relationships.' },
  { icon: TrendingUp, title: 'Pipeline', desc: 'Track your proposals through every stage from initial contact to completion.' },
  { icon: Mail, title: 'Physical Mail', desc: 'Send planning-related mail directly through the platform — neighbour notifications, reminders, and more.' },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <section className="relative bg-primary-900 text-white px-6 pt-32 pb-24">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-display font-bold leading-tight text-display">
            UK Planning Application Intelligence
          </h1>
          <p className="font-sans mt-6 leading-relaxed text-white/80 text-lg max-w-2xl mx-auto">
            Search, track, and act on planning applications across the UK. Real-time data, geographic search, and CRM tools built for planning professionals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <Link
              href="/login"
              className="inline-flex items-center justify-center font-sans font-semibold text-primary-900 bg-white rounded-lg hover:bg-primary-50 transition-colors duration-200 px-8 py-3.5 text-base"
            >
              Get Started
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center font-sans font-semibold text-white border-2 border-white/30 rounded-lg hover:bg-white/10 transition-colors duration-200 px-8 py-3.5 text-base"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white py-24 px-6">
        <div className="max-w-page mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <Card key={feature.title} variant="raised" className="h-full">
                <div className="w-12 h-12 rounded-lg bg-accent-100 flex items-center justify-center mb-5">
                  <feature.icon className="text-accent-700" size={24} />
                </div>
                <h3 className="font-sans font-semibold text-primary-900 text-h4 mb-2">
                  {feature.title}
                </h3>
                <p className="font-sans text-primary-500 leading-relaxed text-sm">
                  {feature.desc}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-primary-900 py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display font-bold text-white mb-4 text-h2">
            Ready to get started?
          </h2>
          <p className="font-sans text-white/80 mb-8 text-lg">
            Join planning professionals using PlanningIndex to find opportunities and manage their workflow.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center justify-center font-sans font-semibold text-primary-900 bg-white rounded-lg hover:bg-primary-50 transition-colors duration-200 px-8 py-3.5 text-base"
          >
            Get Started
          </Link>
        </div>
      </section>
    </div>
  );
}
