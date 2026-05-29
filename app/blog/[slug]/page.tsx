import type { Metadata } from 'next';
import { getArticleBySlug, getRelatedArticles, articles } from '@/lib/content/articles';
import { JsonLd } from '@/components/seo';
import { generateArticleSchema, generateBreadcrumbSchema, SITE_URL } from '@/lib/seo';
import BlogArticleClient from './BlogArticleClient';

export async function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const article = getArticleBySlug(params.slug);

  if (!article) {
    return {
      title: 'Article Not Found',
      description: 'The requested article could not be found.',
    };
  }

  const url = `${SITE_URL}/blog/${article.slug}`;

  return {
    title: `${article.title} | Foundationary Blog`,
    description: article.description,
    keywords: article.keywords,
    authors: [{ name: 'Foundationary' }],

    openGraph: {
      type: 'article',
      url,
      title: article.title,
      description: article.description,
      siteName: 'Foundationary',
      locale: 'en_GB',
      publishedTime: article.date,
      modifiedTime: article.date,
      authors: ['Foundationary'],
      section: article.category,
      tags: article.keywords?.split(',').map(k => k.trim()) || [],
      images: [{ url: `${SITE_URL}/og/articles/${article.slug}.png`, width: 1200, height: 630 }],
    },

    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.description,
      creator: '@Foundationary',
      images: [`${SITE_URL}/og/articles/${article.slug}.png`],
    },

    alternates: {
      canonical: url,
    },

    robots: {
      index: true,
      follow: true,
    },

    other: {
      'article:published_time': article.date,
      'article:author': 'Foundationary',
      'article:section': article.category,
    },
  };
}

export default function BlogArticlePage({ params }: { params: { slug: string } }) {
  const article = getArticleBySlug(params.slug);
  const relatedArticles = getRelatedArticles(params.slug);

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-off-white pt-20">
        <div className="text-center px-6">
          <div className="bg-white rounded-lg border border-border p-12 max-w-md">
            <h1 className="font-inter font-bold text-navy text-2xl mb-3">Article Not Found</h1>
            <p className="font-inter text-secondary-text mb-6">Sorry, we could not find that article.</p>
          </div>
        </div>
      </div>
    );
  }

  const breadcrumbs = generateBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Blog', path: '/blog' },
    { name: article.title, path: `/blog/${article.slug}` },
  ]);

  const articleSchema = generateArticleSchema({
    title: article.title,
    description: article.description,
    slug: article.slug,
    date: article.date,
    category: article.category,
  });

  return (
    <>
      <JsonLd data={[articleSchema, breadcrumbs]} />
      <BlogArticleClient article={article} relatedArticles={relatedArticles} />
    </>
  );
}
