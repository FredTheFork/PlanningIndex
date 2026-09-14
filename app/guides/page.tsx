import type { Metadata } from 'next';
import { JsonLd } from '@/components/seo';
import { SITE_URL, generateBreadcrumbSchema, generateWebPageSchema } from '@/lib/seo';
import { PageHero, DarkCTABanner, SectionLabel } from '@/components/ui';
import { ArticleCard } from '@/components/marketing';
import { guides, getGuidesByCategory } from '@/lib/guides';

export const metadata: Metadata = {
  title: 'Guides',
  description: 'Step-by-step tutorials for getting the most from PlanningIndex. Learn how to search, filter, manage leads, and send proposals.',
  alternates: { canonical: `${SITE_URL}/guides` },
};

export default function GuidesPage() {
  const breadcrumbs = generateBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Guides', path: '/guides' },
  ]);

  const webPage = generateWebPageSchema({
    name: 'Guides | PlanningIndex',
    description: 'Step-by-step tutorials for getting the most from PlanningIndex.',
    path: '/guides',
  });

  const beginnerGuides = getGuidesByCategory('Beginner');
  const intermediateGuides = getGuidesByCategory('Intermediate');
  const advancedGuides = getGuidesByCategory('Advanced');

  return (
    <>
      <JsonLd data={[breadcrumbs, webPage]} />
      <PageHero
        eyebrow="Resources"
        title="Guides & Tutorials"
        subtitle="Step-by-step tutorials to help you get the most out of PlanningIndex — from your first search to scaling your business."
      />

      <section className="bg-white py-24 px-6">
        <div className="max-w-page mx-auto">
          <div className="mb-12">
            <SectionLabel>Beginner</SectionLabel>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {beginnerGuides.map((guide) => (
              <ArticleCard
                key={guide.slug}
                title={guide.title}
                excerpt={guide.excerpt}
                category={guide.category}
                date={guide.displayDate}
                href={`/guides/${guide.slug}`}
                icon={guide.icon}
              />
            ))}
          </div>

          <div className="mb-12">
            <SectionLabel>Intermediate</SectionLabel>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {intermediateGuides.map((guide) => (
              <ArticleCard
                key={guide.slug}
                title={guide.title}
                excerpt={guide.excerpt}
                category={guide.category}
                date={guide.displayDate}
                href={`/guides/${guide.slug}`}
                icon={guide.icon}
              />
            ))}
          </div>

          <div className="mb-12">
            <SectionLabel>Advanced</SectionLabel>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {advancedGuides.map((guide) => (
              <ArticleCard
                key={guide.slug}
                title={guide.title}
                excerpt={guide.excerpt}
                category={guide.category}
                date={guide.displayDate}
                href={`/guides/${guide.slug}`}
                icon={guide.icon}
              />
            ))}
          </div>
        </div>
      </section>

      <DarkCTABanner
        title="Ready to put these guides into practice?"
        subtitle="Start your free trial and get instant access to every planning application in the UK."
        ctaLabel="Start Free Trial"
        ctaHref="/login"
        note="14-day free trial · No commitment · Full access"
      />
    </>
  );
}
