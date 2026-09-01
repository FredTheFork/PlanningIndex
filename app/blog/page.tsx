import type { Metadata } from 'next';
import { Newspaper, Search, TrendingUp, Building2 } from 'lucide-react';
import { JsonLd } from '@/components/seo';
import { SITE_URL, generateBreadcrumbSchema, generateWebPageSchema } from '@/lib/seo';
import { PageHero, DarkCTABanner, SectionLabel } from '@/components/ui';
import { ArticleCard } from '@/components/marketing';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Industry insights, planning application trends, and construction business tips from the PlanningIndex team.',
  alternates: { canonical: `${SITE_URL}/blog` },
};

const articles = [
  {
    title: 'How to Find Loft Conversion Jobs in Your Area',
    excerpt: 'Learn how to use PlanningIndex filters to find loft conversion planning applications near you before your competitors do.',
    category: 'Guides',
    date: 'Aug 2026',
    href: '/blog',
    icon: Search,
  },
  {
    title: 'The State of UK Planning Applications in 2026',
    excerpt: 'Our analysis of planning application trends across the UK, including which regions are seeing the most growth.',
    category: 'Industry',
    date: 'Aug 2026',
    href: '/blog',
    icon: TrendingUp,
  },
  {
    title: '5 Ways to Win More Roofing Contracts This Year',
    excerpt: 'Practical strategies for roofing contractors to find more work, manage leads effectively, and close more deals.',
    category: 'Business',
    date: 'Jul 2026',
    href: '/blog',
    icon: Building2,
  },
  {
    title: 'Why Planning Applications Are the Best Lead Source for Builders',
    excerpt: 'Planning applications give you a head start on every competitor. Here is why they matter and how to use them.',
    category: 'Industry',
    date: 'Jul 2026',
    href: '/blog',
    icon: Newspaper,
  },
  {
    title: 'How to Price Your Jobs Competitively',
    excerpt: 'A practical guide to using the PlanningIndex cost tracker to build accurate quotes that win contracts.',
    category: 'Business',
    date: 'Jun 2026',
    href: '/blog',
    icon: TrendingUp,
  },
  {
    title: 'From Planning Application to Signed Contract: A Case Study',
    excerpt: 'Follow a real PlanningIndex user from finding a planning application to winning the job in under two weeks.',
    category: 'Case Study',
    date: 'Jun 2026',
    href: '/blog',
    icon: Building2,
  },
];

export default function BlogPage() {
  const breadcrumbs = generateBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Blog', path: '/blog' },
  ]);

  const webPage = generateWebPageSchema({
    name: 'Blog | PlanningIndex',
    description: 'Industry insights, planning application trends, and construction business tips.',
    path: '/blog',
  });

  return (
    <>
      <JsonLd data={[breadcrumbs, webPage]} />
      <PageHero
        eyebrow="Resources"
        title="The PlanningIndex Blog"
        subtitle="Industry insights, planning application trends, and construction business tips to help you find and win more work."
      />

      <section className="bg-white py-24 px-6">
        <div className="max-w-page mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <ArticleCard key={article.title} {...article} />
            ))}
          </div>

          <div className="text-center mt-16">
            <div className="inline-block bg-primary-50 rounded-xl border border-primary-100 px-8 py-6">
              <SectionLabel className="text-center">More Coming Soon</SectionLabel>
              <p className="font-sans text-primary-500 mt-2" style={{ fontSize: '0.95rem' }}>
                We&apos;re building out our blog with new articles every week. Check back soon for more.
              </p>
            </div>
          </div>
        </div>
      </section>

      <DarkCTABanner
        title="Find your next job today."
        subtitle="Start your free trial and get instant access to every planning application in the UK."
        ctaLabel="Start Free Trial"
        ctaHref="/login"
        note="14-day free trial · No commitment · Full access"
      />
    </>
  );
}
