import type { Metadata } from 'next';
import { Newspaper } from 'lucide-react';
import { JsonLd } from '@/components/seo';
import { SITE_URL, generateBreadcrumbSchema, generateWebPageSchema, generateArticleSchema } from '@/lib/seo';
import { PageHero } from '@/components/ui';
import { blogPosts } from '@/lib/blog';
import BlogListContent from './BlogListContent';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Industry insights, planning application trends, and construction business tips from the PlanningIndex team.',
  alternates: { canonical: `${SITE_URL}/blog` },
};

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

  const blogSchema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'PlanningIndex Blog',
    url: `${SITE_URL}/blog`,
    description: 'Industry insights, planning application trends, and construction business tips.',
    blogPost: blogPosts.map((post) => ({
      '@type': 'BlogPosting',
      headline: post.title,
      url: `${SITE_URL}/blog/${post.slug}`,
      datePublished: post.date,
      author: { '@type': 'Organization', name: post.author },
      publisher: { '@type': 'Organization', name: 'PlanningIndex' },
    })),
  };

  return (
    <>
      <JsonLd data={[breadcrumbs, webPage, blogSchema]} />
      <PageHero
        eyebrow="Resources"
        title="The PlanningIndex Blog"
        subtitle="Industry insights, planning application trends, and construction business tips to help you find and win more work."
      />
      <BlogListContent />
    </>
  );
}
