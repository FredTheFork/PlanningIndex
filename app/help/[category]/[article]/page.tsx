import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { JsonLd } from '@/components/seo';
import { SITE_URL, generateBreadcrumbSchema, generateArticleSchema, generateWebPageSchema } from '@/lib/seo';
import { Breadcrumbs } from '@/components/ui';
import { ArticleBody } from '@/components/marketing/ArticleBody';
import { ArticleFeedback } from '@/components/marketing/ArticleFeedback';
import {
  getAllHelpArticleSlugs,
  getHelpArticleBySlug,
  getHelpCategoryBySlug,
  getRelatedHelpArticles,
  helpCategories,
} from '@/lib/help';
import HelpArticleContent from './HelpArticleContent';

interface PageProps {
  params: { category: string; article: string };
}

export function generateStaticParams() {
  return getAllHelpArticleSlugs().map(({ category, article }) => ({
    category,
    article,
  }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const article = getHelpArticleBySlug(params.category, params.article);
  if (!article) {
    return {
      title: 'Article Not Found',
      robots: { index: false, follow: false },
    };
  }

  return {
    title: `${article.title} — Help Centre`,
    description: article.excerpt,
    alternates: { canonical: `${SITE_URL}/help/${params.category}/${params.article}` },
  };
}

export default function HelpArticlePage({ params }: PageProps) {
  const category = getHelpCategoryBySlug(params.category);
  const article = getHelpArticleBySlug(params.category, params.article);
  if (!category || !article) notFound();

  const relatedArticles = getRelatedHelpArticles(params.category, params.article, 3);

  const breadcrumbs = generateBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Help Centre', path: '/help' },
    { name: category.name, path: `/help/${category.slug}` },
    { name: article.title, path: `/help/${category.slug}/${article.slug}` },
  ]);

  const articleSchema = generateArticleSchema({
    title: article.title,
    description: article.excerpt,
    path: `/help/${category.slug}/${article.slug}`,
    author: 'PlanningIndex Team',
    datePublished: '2026-08-01',
    section: category.name,
  });

  return (
    <>
      <JsonLd data={[breadcrumbs, articleSchema]} />
      <HelpArticleContent
        category={category}
        article={article}
        relatedArticles={relatedArticles}
        allCategories={helpCategories}
      />
    </>
  );
}
