import type { Metadata } from 'next';
import Link from 'next/link';
import { Search, Users, FileText, TrendingUp, MapPin, Clock, ArrowRight } from 'lucide-react';
import { JsonLd } from '@/components/seo';
import { SITE_URL, generateBreadcrumbSchema, generateWebPageSchema } from '@/lib/seo';
import { PageHero, DarkCTABanner, SectionLabel, Card } from '@/components/ui';

export const metadata: Metadata = {
  title: 'About',
  description: 'PlanningIndex turns UK planning applications into construction opportunities. Find upcoming work before your competitors, manage leads, and send professional proposals by post.',
  alternates: { canonical: `${SITE_URL}/about` },
};

const values = [
  { icon: Search, title: 'Comprehensive Data', desc: 'Every planning application from every council, borough, and region across the UK — updated daily.' },
  { icon: Users, title: 'Built for Trades', desc: 'Designed specifically for builders, roofers, and tradespeople who find work through planning applications.' },
  { icon: TrendingUp, title: 'Affordable', desc: 'Up to 60% cheaper than competitors, with flexible plans from single-council to nationwide access.' },
  { icon: FileText, title: 'UK-Focused', desc: 'Built and operated in the UK, for the UK construction industry. We understand the local market.' },
];

const trades = [
  'Window & Door Companies',
  'Builders',
  'Roofing Companies',
  'Bricklayers',
  'Extension Contractors',
  'Architects & Designers',
  'Landscapers',
  'Plumbing Contractors',
  'Electrical Contractors',
];

export default function AboutPage() {
  const breadcrumbs = generateBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
  ]);

  const webPage = generateWebPageSchema({
    name: 'About | PlanningIndex',
    description: 'PlanningIndex turns UK planning applications into construction opportunities.',
    path: '/about',
  });

  return (
    <>
      <JsonLd data={[breadcrumbs, webPage]} />
      <PageHero
        eyebrow="About PlanningIndex"
        title="Stop searching for work. Let the work find you."
        subtitle="PlanningIndex turns UK planning applications into construction opportunities — so you find upcoming work before your competitors even know it exists."
        ctaLabel="Get Started Today"
        ctaHref="/login"
      />

      {/* What PlanningIndex is */}
      <section className="bg-white py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <SectionLabel>What PlanningIndex is</SectionLabel>
          <h2 className="font-display font-bold text-primary-900 text-h2 mb-6">
            A planning application is the earliest signal that work is coming.
          </h2>
          <div className="space-y-5">
            <p className="font-sans text-primary-500 leading-relaxed" style={{ fontSize: '1.05rem' }}>
              Every construction project in the UK starts with a planning application. Before a single brick is laid, before a contractor is hired, before the work goes out to tender — a planning application is submitted to the local council.
            </p>
            <p className="font-sans text-primary-500 leading-relaxed" style={{ fontSize: '1.05rem' }}>
              PlanningIndex collects those applications from every council across the UK, the day they go public, and puts them in front of the tradespeople who can do the work. Search by keyword, location, radius, and application type. Find the projects that match what you do. Turn them into leads. Send professional proposals by post. Win the work.
            </p>
            <p className="font-sans text-primary-500 leading-relaxed" style={{ fontSize: '1.05rem' }}>
              It is not a planning portal. It is not a lead-generation site. It is a working tool for construction businesses who want to find their own work, on their own terms, before anyone else.
            </p>
          </div>
        </div>
      </section>

      {/* The problem */}
      <section className="bg-primary-50 py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <SectionLabel>The problem</SectionLabel>
          <h2 className="font-display font-bold text-primary-900 text-h2 mb-6">
            Finding construction work is harder than it should be.
          </h2>
          <div className="space-y-5">
            <p className="font-sans text-primary-500 leading-relaxed" style={{ fontSize: '1.05rem' }}>
              Most construction businesses find work through word of mouth, repeat customers, or expensive lead-generation sites that sell the same lead to five competitors. By the time you hear about a project, three other companies have already quoted for it.
            </p>
            <p className="font-sans text-primary-500 leading-relaxed" style={{ fontSize: '1.05rem' }}>
              The problem is not that the work isn&apos;t out there. The problem is that you can&apos;t see it early enough. Planning applications are public information, but they&apos;re scattered across hundreds of council websites, each with its own search tool, its own format, and its own update schedule. No one has the time to check them all.
            </p>
            <p className="font-sans text-primary-500 leading-relaxed" style={{ fontSize: '1.05rem' }}>
              So the opportunities pass you by — not because you weren&apos;t good enough, but because you didn&apos;t know about them.
            </p>
          </div>
        </div>
      </section>

      {/* The early signal */}
      <section className="bg-white py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <SectionLabel>How planning applications help</SectionLabel>
          <h2 className="font-display font-bold text-primary-900 text-h2 mb-6">
            An early signal of upcoming work.
          </h2>
          <div className="space-y-5">
            <p className="font-sans text-primary-500 leading-relaxed" style={{ fontSize: '1.05rem' }}>
              A planning application tells you what a property owner wants to do — sometimes months before the work starts. A &ldquo;replacement of 12 timber sash windows&rdquo; is a window contract. A &ldquo;single-storey rear extension&rdquo; is a building job. A &ldquo;replacement of existing roof covering&rdquo; is a roofing project.
            </p>
            <p className="font-sans text-primary-500 leading-relaxed" style={{ fontSize: '1.05rem' }}>
              The application includes the address, the description of the work, the council, the decision dates, and often the applicant&apos;s name. That is everything you need to identify a relevant opportunity, understand what work is being proposed, and reach out before the competition.
            </p>
            <p className="font-sans text-primary-500 leading-relaxed" style={{ fontSize: '1.05rem' }}>
              PlanningIndex makes that signal actionable. Instead of checking council websites one by one, you search once — by keyword, location, radius, or trade — and see every relevant application in one place, updated daily.
            </p>
          </div>

          {/* Signal flow */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: FileText, step: '01', title: 'Application submitted', desc: 'A property owner applies for planning permission — windows, extension, roof, new build.' },
              { icon: Clock, step: '02', title: 'PlanningIndex finds it', desc: 'We collect the application the day it goes public and add it to our nationwide database.' },
              { icon: ArrowRight, step: '03', title: 'You act on it', desc: 'You find the application, add it as a lead, and send a proposal — before competitors know it exists.' },
            ].map((item) => (
              <div key={item.step} className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-900 text-white mb-4">
                  <item.icon size={22} />
                </div>
                <span className="font-mono text-xs font-bold text-primary-300">{item.step}</span>
                <h3 className="font-sans font-semibold text-primary-900 text-base mt-1 mb-1.5">{item.title}</h3>
                <p className="font-sans text-primary-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our purpose */}
      <section className="bg-primary-50 py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <SectionLabel>Our purpose</SectionLabel>
          <h2 className="font-display font-bold text-primary-900 text-h2 mb-6">
            Give every trade the same early advantage.
          </h2>
          <div className="space-y-5">
            <p className="font-sans text-primary-500 leading-relaxed" style={{ fontSize: '1.05rem' }}>
              PlanningIndex exists to level the playing field. The biggest companies have always had the resources to monitor planning applications, chase leads, and manage pipelines. Smaller trades have not. We built PlanningIndex so that a two-person window company in Harefield has the same access to upcoming work as a national contractor.
            </p>
            <p className="font-sans text-primary-500 leading-relaxed" style={{ fontSize: '1.05rem' }}>
              We do not sell leads. We do not take a cut of your work. We give you the tools to find your own opportunities, manage them professionally, and turn them into paying jobs — all in one place.
            </p>
          </div>
        </div>
      </section>

      {/* Who it's built for */}
      <section className="bg-white py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <SectionLabel>Who it&apos;s built for</SectionLabel>
          <h2 className="font-display font-bold text-primary-900 text-h2 mb-6">
            Any trade that benefits from knowing what work is coming.
          </h2>
          <p className="font-sans text-primary-500 leading-relaxed mb-8" style={{ fontSize: '1.05rem' }}>
            PlanningIndex is built for UK construction professionals — from solo tradespeople to growing companies. If your work is triggered by a planning application, PlanningIndex helps you find it, manage it, and win it.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {trades.map((trade) => (
              <Link
                key={trade}
                href="/industries"
                className="group flex items-center gap-2.5 rounded-lg border border-primary-200 bg-white px-4 py-3 hover:border-primary-300 hover:shadow-card-hover transition-all duration-200"
              >
                <MapPin size={16} className="text-accent-600 shrink-0" />
                <span className="font-sans font-medium text-primary-700 text-sm group-hover:text-accent-700 transition-colors">
                  {trade}
                </span>
                <ArrowRight size={14} className="ml-auto text-primary-300 group-hover:text-accent-600 group-hover:translate-x-0.5 transition-all" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-primary-50 py-24 px-6">
        <div className="max-w-page mx-auto">
          <div className="text-center mb-16">
            <SectionLabel className="text-center">Why PlanningIndex</SectionLabel>
            <h2 className="font-display font-bold text-primary-900 text-h2 mt-2">
              Built for the way UK tradespeople actually work
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => (
              <Card key={value.title} variant="raised" className="h-full">
                <div className="w-12 h-12 rounded-lg bg-accent-100 flex items-center justify-center mb-5">
                  <value.icon className="text-accent-700" size={24} />
                </div>
                <h3 className="font-sans font-semibold text-primary-900 text-h4 mb-2">
                  {value.title}
                </h3>
                <p className="font-sans text-primary-500 leading-relaxed text-sm">
                  {value.desc}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <DarkCTABanner
        title="Ready to find your next job?"
        subtitle="Join thousands of UK builders who stopped chasing work and started winning it."
        ctaLabel="Start Free Trial"
        ctaHref="/login"
        note="14-day free trial · No commitment · Full access"
      />
    </>
  );
}
