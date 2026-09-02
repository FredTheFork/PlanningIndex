import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Search } from 'lucide-react';
import { JsonLd } from '@/components/seo';
import { SITE_URL, generateBreadcrumbSchema, generateWebPageSchema } from '@/lib/seo';
import { PageHero, Breadcrumbs } from '@/components/ui';
import { helpCategories, getHelpCategoryBySlug, getAllHelpCategorySlugs } from '@/lib/help';
import HelpCategoryContent from './HelpCategoryContent';

interface PageProps {
  params: { category: string };
}

export function generateStaticParams() {
  return getAllHelpCategorySlugs().map((slug) => ({ category: slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const category = getHelpCategoryBySlug(params.category);
  if (!category) {
    return {
      title: 'Category Not Found',
      robots: { index: false, follow: false },
    };
  }

  return {
    title: `${category.name} — Help Centre`,
    description: category.description,
    alternates: { canonical: `${SITE_URL}/help/${category.slug}` },
  };
}

export default function HelpCategoryPage({ params }: PageProps) {
  const category = getHelpCategoryBySlug(params.category);
  if (!category) notFound();

  const breadcrumbs = generateBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Help Centre', path: '/help' },
    { name: category.name, path: `/help/${category.slug}` },
  ]);

  const webPage = generateWebPageSchema({
    name: `${category.name} | Help Centre | PlanningIndex`,
    description: category.description,
    path: `/help/${category.slug}`,
  });

  return (
    <>
      <JsonLd data={[breadcrumbs, webPage]} />
      <section className="bg-primary-900 text-white px-6 pt-32 pb-16">
        <div className="max-w-3xl mx-auto">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Help Centre', href: '/help' },
              { label: category.name },
            ]}
            className="mb-6"
          />
          <h1 className="font-display font-bold text-white" style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', lineHeight: 1.2 }}>
            {category.name}
          </h1>
          <p className="font-sans text-white/70 leading-relaxed mt-3" style={{ fontSize: '1.1rem' }}>
            {category.description}
          </p>
        </div>
      </section>
      <HelpCategoryContent category={category} allCategories={helpCategories} />
    </>
  );
}
