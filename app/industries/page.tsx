import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { JsonLd } from '@/components/seo';
import { SITE_URL, generateBreadcrumbSchema, generateWebPageSchema } from '@/lib/seo';
import { PageHero, DarkCTABanner, SectionLabel, Card } from '@/components/ui';
import { industries } from '@/lib/industries';

export const metadata: Metadata = {
  title: 'Industries',
  description: 'PlanningIndex helps every trade find work from UK planning applications. Discover how builders, roofers, window companies, landscapers, and more use planning data to win more jobs.',
  alternates: { canonical: `${SITE_URL}/industries` },
};

export default function IndustriesPage() {
  const breadcrumbs = generateBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Industries', path: '/industries' },
  ]);

  const webPage = generateWebPageSchema({
    name: 'Industries | PlanningIndex',
    description: 'How PlanningIndex helps every trade find work from UK planning applications.',
    path: '/industries',
  });

  return (
    <>
      <JsonLd data={[breadcrumbs, webPage]} />
      <PageHero
        eyebrow="Who It's For"
        title="Built for every trade in UK construction."
        subtitle="PlanningIndex isn't just planning data. It's a way for construction businesses to discover commercially relevant work — whatever your trade."
      />

      <section className="bg-white py-24 px-6">
        <div className="max-w-page mx-auto">
          <div className="mb-16 max-w-2xl">
            <SectionLabel>Find your trade</SectionLabel>
            <h2 className="font-display font-bold text-primary-900 text-h2 mt-2">
              Planning applications create work for everyone.
            </h2>
            <p className="font-sans text-primary-500 mt-4 leading-relaxed" style={{ fontSize: '1.05rem' }}>
              Every planning application signals upcoming work — from window replacements to new builds. Find your trade below and see exactly how PlanningIndex helps you find and win that work.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {industries.map((industry) => (
              <Link key={industry.slug} href={`/industries/${industry.slug}`} className="group block h-full">
                <Card variant="raised" className="h-full">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-accent-100 flex items-center justify-center shrink-0">
                      <industry.icon className="text-accent-700" size={24} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-sans font-semibold text-primary-900 text-base group-hover:text-accent-700 transition-colors mb-1.5">
                        {industry.name}
                      </h3>
                      <p className="font-sans text-primary-500 text-sm leading-relaxed">
                        {industry.description}
                      </p>
                      <div className="mt-4 flex items-center gap-1.5 text-accent-600 font-sans font-semibold text-sm group-hover:text-accent-700 transition-colors">
                        Learn more <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <DarkCTABanner
        title="Ready to find work in your trade?"
        subtitle="Start your free trial and get instant access to every planning application in the UK."
        ctaLabel="Start Free Trial"
        ctaHref="/login"
        note="14-day free trial · No commitment · Full access"
      />
    </>
  );
}
