import type { Metadata } from 'next';
import { Search, Users, FileText, Calendar, FolderOpen, TrendingUp } from 'lucide-react';
import { JsonLd } from '@/components/seo';
import { SITE_URL, generateBreadcrumbSchema, generateWebPageSchema } from '@/lib/seo';
import { PageHero, DarkCTABanner, SectionLabel } from '@/components/ui';
import { ArticleCard } from '@/components/marketing';

export const metadata: Metadata = {
  title: 'Guides',
  description: 'Step-by-step tutorials for getting the most from PlanningIndex. Learn how to search, filter, manage leads, and send proposals.',
  alternates: { canonical: `${SITE_URL}/guides` },
};

const guides = [
  {
    title: 'Getting Started with PlanningIndex',
    excerpt: 'Everything you need to know to set up your account and find your first planning application in under 10 minutes.',
    category: 'Beginner',
    date: 'Aug 2026',
    href: '/guides',
    icon: Search,
  },
  {
    title: 'How to Use Map View Effectively',
    excerpt: 'Master the interactive map — draw boundaries, find clusters of activity, and target the postcodes you want to work in.',
    category: 'Beginner',
    date: 'Aug 2026',
    href: '/guides',
    icon: Search,
  },
  {
    title: 'Setting Up Smart Filters for Your Trade',
    excerpt: 'Create saved searches that automatically find the exact types of jobs you want — loft conversions, new roofs, extensions, and more.',
    category: 'Beginner',
    date: 'Jul 2026',
    href: '/guides',
    icon: Search,
  },
  {
    title: 'Managing Your Lead Pipeline',
    excerpt: 'Learn how to turn planning applications into leads, move them through your pipeline, and track your win rate.',
    category: 'Intermediate',
    date: 'Jul 2026',
    href: '/guides',
    icon: Users,
  },
  {
    title: 'Creating and Sending Proposals',
    excerpt: 'Generate branded PDF proposals in one click, send them to clients, and track when they open them.',
    category: 'Intermediate',
    date: 'Jun 2026',
    href: '/guides',
    icon: FileText,
  },
  {
    title: 'Using the Calendar and Task System',
    excerpt: 'Keep track of site visits, deadlines, and follow-ups with the integrated calendar and smart task system.',
    category: 'Intermediate',
    date: 'Jun 2026',
    href: '/guides',
    icon: Calendar,
  },
  {
    title: 'Organising Files and Documents',
    excerpt: 'Upload photos, receipts, drawings, and contracts against each job. Keep everything in one searchable vault.',
    category: 'Advanced',
    date: 'May 2026',
    href: '/guides',
    icon: FolderOpen,
  },
  {
    title: 'Tracking Costs and Profit Margins',
    excerpt: 'Use the pricing and expenses tracker to see your margin in real time and never underprice a job again.',
    category: 'Advanced',
    date: 'May 2026',
    href: '/guides',
    icon: TrendingUp,
  },
  {
    title: 'Scaling Your Business with Enterprise Plans',
    excerpt: 'Add team members, share leads, and manage multiple users across your company with Enterprise.',
    category: 'Advanced',
    date: 'Apr 2026',
    href: '/guides',
    icon: Users,
  },
];

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
            {guides.filter((g) => g.category === 'Beginner').map((guide) => (
              <ArticleCard key={guide.title} {...guide} />
            ))}
          </div>

          <div className="mb-12">
            <SectionLabel>Intermediate</SectionLabel>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {guides.filter((g) => g.category === 'Intermediate').map((guide) => (
              <ArticleCard key={guide.title} {...guide} />
            ))}
          </div>

          <div className="mb-12">
            <SectionLabel>Advanced</SectionLabel>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guides.filter((g) => g.category === 'Advanced').map((guide) => (
              <ArticleCard key={guide.title} {...guide} />
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
