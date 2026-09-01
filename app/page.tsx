import Link from 'next/link';
import { Search, MapPin, FileText, Users, TrendingUp, Mail } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-primary-900 text-white px-6 pt-32 pb-24">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-sans font-bold leading-tight" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
            UK Planning Application Intelligence
          </h1>
          <p className="font-sans mt-6 leading-relaxed text-white/80" style={{ fontSize: '1.15rem', maxWidth: '640px', marginLeft: 'auto', marginRight: 'auto' }}>
            Search, track, and act on planning applications across the UK. Real-time data, geographic search, and CRM tools built for planning professionals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <Link
              href="/login"
              className="font-sans font-semibold text-primary-900 bg-white rounded-lg hover:bg-primary-50 transition-all duration-200"
              style={{ padding: '14px 32px', fontSize: '1rem' }}
            >
              Get Started
            </Link>
            <Link
              href="/pricing"
              className="font-sans font-semibold text-white border-2 border-white/30 rounded-lg hover:bg-white/10 transition-all duration-200"
              style={{ padding: '14px 32px', fontSize: '1rem' }}
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Feature cards */}
      <section className="bg-white py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Search, title: 'Planning Search', desc: 'Search planning applications by reference, applicant, postcode, or keyword across all UK authorities.' },
              { icon: MapPin, title: 'Map Search', desc: 'Find applications geographically. Draw boundaries, identify opportunities, and visualise planning activity.' },
              { icon: FileText, title: 'Application Details', desc: 'Full application breakdowns — documents, status history, decision dates, and related applications.' },
              { icon: Users, title: 'Leads & CRM', desc: 'Turn planning data into actionable leads. Manage contacts, track conversations, and build relationships.' },
              { icon: TrendingUp, title: 'Pipeline', desc: 'Track your proposals through every stage from initial contact to completion.' },
              { icon: Mail, title: 'Physical Mail', desc: 'Send planning-related mail directly through the platform — neighbour notifications, reminders, and more.' },
            ].map((feature) => (
              <div
                key={feature.title}
                className="bg-primary-50 rounded-xl p-8 border border-primary-100 hover:border-accent-300 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-lg bg-accent-100 flex items-center justify-center mb-5">
                  <feature.icon className="text-accent-700" size={24} />
                </div>
                <h3 className="font-sans font-semibold text-primary-900 mb-2" style={{ fontSize: '1.15rem' }}>
                  {feature.title}
                </h3>
                <p className="font-sans text-primary-500 leading-relaxed" style={{ fontSize: '0.95rem' }}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary-900 py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-sans font-bold text-white mb-4" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)' }}>
            Ready to get started?
          </h2>
          <p className="font-sans text-white/80 mb-8" style={{ fontSize: '1.1rem' }}>
            Join planning professionals using PlanningIndex to find opportunities and manage their workflow.
          </p>
          <Link
            href="/login"
            className="inline-block font-sans font-semibold text-primary-900 bg-white rounded-lg hover:bg-primary-50 transition-all duration-200"
            style={{ padding: '14px 32px', fontSize: '1rem' }}
          >
            Get Started
          </Link>
        </div>
      </section>
    </div>
  );
}
