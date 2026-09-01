import Link from 'next/link';
import { Search, MapPin, FileText, Users, TrendingUp, Mail, Map, LayoutGrid, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui';
import { StatsBar, HowItSteps } from '@/components/marketing';
import { TestimonialCard, FAQSection, DarkCTABanner, SectionLabel } from '@/components/ui';

const features = [
  { icon: Search, title: 'Planning Search', desc: 'Search every planning application in the UK by keyword, location, type, or value. Updated daily from every council.' },
  { icon: MapPin, title: 'Map Search', desc: 'See applications pinned on an interactive map. Draw boundaries, find clusters of activity, and target your area.' },
  { icon: FileText, title: 'Application Details', desc: 'Full breakdowns — documents, status history, decision dates, applicant details, and related applications.' },
  { icon: Users, title: 'Leads & CRM', desc: 'Turn planning data into qualified leads. Track conversations, manage contacts, and build your pipeline.' },
  { icon: TrendingUp, title: 'Pipeline', desc: 'Drag-and-drop your way from first contact to signed contract. Track value, win rate, and progress at every stage.' },
  { icon: Mail, title: 'Physical Mail', desc: 'Send planning-related mail directly through the platform — neighbour notifications, reminders, and more.' },
];

const testimonials = [
  {
    quote: 'PlanningIndex found me three loft conversion jobs in my area within the first week. It pays for itself many times over.',
    name: 'James Wright',
    role: 'Loft Conversion Specialist, London',
    initials: 'JW',
  },
  {
    quote: 'I used to spend hours scrolling through council websites. Now I log in, filter by my trade, and the work comes to me.',
    name: 'Sarah Mitchell',
    role: 'Roofing Contractor, Manchester',
    initials: 'SM',
  },
  {
    quote: 'The map view is a game changer. I can see exactly where the work is and target the postcodes I want to operate in.',
    name: 'David O\'Brien',
    role: 'Extension Builder, Leeds',
    initials: 'DO',
  },
];

const faqs = [
  { q: 'What is PlanningIndex?', a: 'PlanningIndex is a platform that aggregates every planning application in the UK and gives builders, roofers, and tradespeople the tools to find jobs, manage leads, and send proposals — all in one place.' },
  { q: 'How often is the data updated?', a: 'We update our planning application data daily from every council, borough, and region across the UK. If a planning application is submitted, you will find it on PlanningIndex the day it goes public.' },
  { q: 'Can I try it before I pay?', a: 'Yes. We offer a 14-day free trial with full platform access — no commitment required, and you can cancel anytime.' },
  { q: 'Which areas are covered?', a: 'Every single council, borough, and region across the UK. From small village extensions to major city new builds, if it is submitted, it is on PlanningIndex.' },
  { q: 'Do you offer team accounts?', a: 'Yes. Enterprise plans include up to 3 accounts with full team visibility, and you can add members by email with one click.' },
  { q: 'What trades is this for?', a: 'PlanningIndex is built for any construction professional who finds work through planning applications — builders, roofers, loft converters, extension specialists, driveways, and more.' },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-primary-900 text-white px-6 pt-32 pb-20 overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span
            className="font-sans font-semibold uppercase inline-block mb-6"
            style={{ fontSize: '0.75rem', letterSpacing: '0.15em', color: 'rgba(2,132,199,1)' }}
          >
            UK Planning Application Intelligence
          </span>
          <h1 className="font-display font-bold leading-tight text-display">
            Find Every Construction Job in the UK — Before Your Competitors
          </h1>
          <p className="font-sans mt-6 leading-relaxed text-white/70 text-lg max-w-2xl mx-auto">
            PlanningIndex delivers qualified planning application leads directly to builders, roofers, and tradespeople. Filter by location, type, and value — then close with our built-in CRM.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 font-sans font-semibold text-primary-900 bg-white rounded-lg hover:bg-primary-50 transition-colors duration-200 px-8 py-3.5 text-base"
            >
              Start Free Trial
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center font-sans font-semibold text-white border-2 border-white/30 rounded-lg hover:bg-white/10 transition-colors duration-200 px-8 py-3.5 text-base"
            >
              View Pricing
            </Link>
          </div>
          <p className="font-sans text-white/40 mt-5" style={{ fontSize: '0.85rem' }}>
            14-day free trial · No commitment · Full access
          </p>
        </div>
      </section>

      {/* Stats Bar */}
      <StatsBar />

      {/* How It Works */}
      <HowItSteps />

      {/* Features Grid */}
      <section className="bg-primary-50 py-24 px-6">
        <div className="max-w-page mx-auto">
          <div className="text-center mb-16">
            <SectionLabel className="text-center">Features</SectionLabel>
            <h2 className="font-display font-bold text-primary-900 text-h2 mt-2">
              Everything you need to find, win & manage work
            </h2>
            <p className="font-sans text-primary-500 mt-4 max-w-2xl mx-auto" style={{ fontSize: '1.05rem' }}>
              The only all-in-one platform built for UK construction. Search planning applications, run your CRM pipeline, generate proposals, and stay organised.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

          <div className="text-center mt-12">
            <Link
              href="/features"
              className="inline-flex items-center gap-2 font-sans font-semibold text-accent-600 hover:text-accent-700 transition-colors"
              style={{ fontSize: '0.95rem' }}
            >
              See all features
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Dual Viewing Modes */}
      <section className="bg-white py-24 px-6">
        <div className="max-w-page mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <SectionLabel>Search & Discovery</SectionLabel>
              <h2 className="font-display font-bold text-primary-900 text-h2 mt-2 mb-4">
                Two ways to find your next job
              </h2>
              <p className="font-sans text-primary-500 leading-relaxed mb-8" style={{ fontSize: '1.05rem' }}>
                Switch instantly between a clean grid view and an interactive map. See every project pinned with exact postcode location, or browse a filtered list. However you work, PlanningIndex adapts.
              </p>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-accent-100 flex items-center justify-center shrink-0">
                    <Map className="text-accent-700" size={20} />
                  </div>
                  <div>
                    <h3 className="font-sans font-semibold text-primary-900 text-h4 mb-1">Map View</h3>
                    <p className="font-sans text-primary-500 text-sm leading-relaxed">
                      Every project pinned with exact postcode location. Zoom, pan, and click — every application is right there on the map.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-accent-100 flex items-center justify-center shrink-0">
                    <LayoutGrid className="text-accent-700" size={20} />
                  </div>
                  <div>
                    <h3 className="font-sans font-semibold text-primary-900 text-h4 mb-1">Grid View</h3>
                    <p className="font-sans text-primary-500 text-sm leading-relaxed">
                      See all jobs in one organised list. Apply filters, sort by date or value, and find the job that is right for you.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-primary-100 rounded-2xl border border-primary-200 p-8 aspect-[4/3] flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-2xl bg-accent-100 flex items-center justify-center mx-auto mb-4">
                    <Map className="text-accent-700" size={40} />
                  </div>
                  <p className="font-sans text-primary-400" style={{ fontSize: '0.9rem' }}>
                    Interactive map preview
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-primary-50 py-24 px-6">
        <div className="max-w-page mx-auto">
          <div className="text-center mb-16">
            <SectionLabel className="text-center">Testimonials</SectionLabel>
            <h2 className="font-display font-bold text-primary-900 text-h2 mt-2">
              Tradespeople are winning more work with PlanningIndex
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.name} testimonial={testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FAQSection
        items={faqs}
        title="Common questions about PlanningIndex"
        label="FAQ"
        collapsible
      />

      {/* CTA */}
      <DarkCTABanner
        title="Start with a free trial today."
        subtitle="Join thousands of UK builders who stopped chasing work and started winning it."
        ctaLabel="Start Free Trial"
        ctaHref="/login"
        note="14-day free trial · No commitment · Full access"
      />
    </div>
  );
}
