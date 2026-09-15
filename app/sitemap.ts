import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';
import { industries } from '@/lib/industries';
import { getBlogPosts, getHelpCategories } from '@/lib/content/wordpress';
import { guides } from '@/lib/guides';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [blogPosts, helpCategories] = await Promise.all([getBlogPosts(), getHelpCategories()]);
  const staticPages: Array<{
    path: string;
    priority: number;
    changeFrequency: 'weekly' | 'monthly' | 'yearly';
  }> = [
    { path: '', priority: 1.0, changeFrequency: 'weekly' },
    { path: '/features', priority: 0.9, changeFrequency: 'monthly' },
    { path: '/pricing', priority: 0.9, changeFrequency: 'monthly' },
    { path: '/industries', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/examples', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/about', priority: 0.7, changeFrequency: 'monthly' },
    { path: '/blog', priority: 0.7, changeFrequency: 'weekly' },
    { path: '/help', priority: 0.6, changeFrequency: 'monthly' },
    { path: '/guides', priority: 0.6, changeFrequency: 'monthly' },
    { path: '/contact', priority: 0.6, changeFrequency: 'monthly' },
    { path: '/privacy', priority: 0.3, changeFrequency: 'yearly' },
    { path: '/terms', priority: 0.3, changeFrequency: 'yearly' },
  ];

  const industryPages = industries.map((industry) => ({
    path: `/industries/${industry.slug}`,
    priority: 0.7,
    changeFrequency: 'monthly' as const,
  }));

  const blogArticlePages = blogPosts.map((post) => ({
    path: `/blog/${post.slug}`,
    priority: 0.6,
    changeFrequency: 'weekly' as const,
  }));

  const helpCategoryPages = helpCategories.map((cat) => ({
    path: `/help/${cat.slug}`,
    priority: 0.6,
    changeFrequency: 'monthly' as const,
  }));

  const helpArticlePages = helpCategories.flatMap((cat) =>
    cat.articles.map((article) => ({
      path: `/help/${cat.slug}/${article.slug}`,
      priority: 0.5,
      changeFrequency: 'monthly' as const,
    }))
  );

  const guideArticlePages = guides.map((guide) => ({
    path: `/guides/${guide.slug}`,
    priority: 0.5,
    changeFrequency: 'monthly' as const,
  }));

  const allPages = [
    ...staticPages,
    ...industryPages,
    ...blogArticlePages,
    ...helpCategoryPages,
    ...helpArticlePages,
    ...guideArticlePages,
  ];

  return allPages.map((page) => ({
    url: `${SITE_URL}${page.path}`,
    lastModified: new Date(),
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));
}
