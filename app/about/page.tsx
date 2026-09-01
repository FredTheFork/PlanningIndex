import type { Metadata } from 'next';
import { Search, Users, FileText, TrendingUp } from 'lucide-react';
import { JsonLd } from '@/components/seo';
import { SITE_URL, generateBreadcrumbSchema, generateWebPageSchema } from '@/lib/seo';
import { PageHero, DarkCTABanner, SectionLabel, Card } from '@/components/ui';

export const metadata: Metadata = {
  title: 'About',
  description: 'PlanningIndex is the world\'s first all-in-one platform for UK construction professionals — find planning applications, manage leads, and send proposals in one place.',
  alternates: { canonical: `${SITE_URL}/about` },
};

const values = [
  { icon: Search, title: 'Comprehensive Data', desc: 'Every planning application from every council, borough, and region across the UK — updated daily.' },
  { icon: Users, title: 'Built for Trades', desc: 'Designed specifically for builders, roofers, and tradespeople who find work through planning applications.' },
  { icon: TrendingUp, title: 'Affordable', desc: 'Up to 60% cheaper than competitors, with flexible plans from single-council to nationwide access.' },
  { icon: FileText, title: 'UK-Focused', desc: 'Built and operated in the UK, for the UK construction industry. We understand the local market.' },
];

export default function AboutPage() {
  const breadcrumbs = generateBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
  ]);

  const webPage = generateWebPageSchema({
    name: 'About | PlanningIndex',
    description: 'PlanningIndex is the world\'s first all-in-one platform for UK construction professionals.',
    path: '/about',
  });

  return (
    <>
      <JsonLd data={[breadcrumbs, webPage]} />
      <PageHero
        title="Stop Searching for Work. Let the Work Find You."
        subtitle="PlanningIndex is the world's first all-in-one platform designed to help UK construction professionals find planning applications, manage leads, and automate proposals — all in one place."
        ctaLabel="Get Started Today"
        ctaHref="/login"
      />

      <section className="bg-white py-24 px-6">
        <div className="max-w-3xl mx-auto space-y-12">
          <div>
            <SectionLabel>The Problem</SectionLabel>
            <h2 className="font-display font-bold text-primary-900 text-h2 mb-4">
              The Ultimate Source of Local Construction Work
            </h2>
            <p className="font-sans text-primary-500 leading-relaxed" style={{ fontSize: '1.05rem' }}>
              In the competitive construction industry, time is money. The hours spent searching for new projects, tracking leads, and managing client relationships are hours you aren&apos;t spending on the job site. PlanningIndex changes that by putting a steady stream of qualified, local leads directly at your fingertips.
            </p>
          </div>

          <div>
            <h3 className="font-sans font-semibold text-primary-900 text-h4 mb-3">
              Comprehensive Nationwide Search
            </h3>
            <p className="font-sans text-primary-500 leading-relaxed" style={{ fontSize: '1.05rem' }}>
              We aggregate planning applications from every single council, borough, and region across the UK. From a small extension in a quiet village to a major new build in a bustling city, if a planning application is submitted, you&apos;ll find it on our platform the day it&apos;s made public.
            </p>
          </div>

          <div>
            <h3 className="font-sans font-semibold text-primary-900 text-h4 mb-3">
              Powerful, Intuitive Filtering
            </h3>
            <p className="font-sans text-primary-500 leading-relaxed" style={{ fontSize: '1.05rem' }}>
              Our robust search and filtering system allows you to instantly find the exact projects you&apos;re looking for. Search by keyword (e.g., &ldquo;loft conversion,&rdquo; &ldquo;new roof&rdquo;), location, application type, and more.
            </p>
          </div>

          <div>
            <h3 className="font-sans font-semibold text-primary-900 text-h4 mb-3">
              Dual Viewing Modes
            </h3>
            <p className="font-sans text-primary-500 leading-relaxed" style={{ fontSize: '1.05rem' }}>
              Visualise your opportunities in a way that suits you. Use our clean, organised Grid View to browse applications in a list, or switch to the dynamic Map View to see projects pinpointed geographically in your target areas.
            </p>
          </div>

          <div>
            <h3 className="font-sans font-semibold text-primary-900 text-h4 mb-3">
              Your Next Job is Out There
            </h3>
            <p className="font-sans text-primary-500 leading-relaxed" style={{ fontSize: '1.05rem' }}>
              PlanningIndex helps you find it before your competitors do. Stop searching for work — let the work find you.
            </p>
          </div>
        </div>
      </section>

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
