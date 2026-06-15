import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';
import { articles } from '@/lib/content/articles';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_URL;

  const staticPages: Array<{
    path: string;
    priority: number;
    changeFrequency: 'weekly' | 'monthly' | 'yearly';
  }> = [
    { path: '', priority: 1.0, changeFrequency: 'weekly' },
    { path: '/services', priority: 1.0, changeFrequency: 'weekly' },
    { path: '/services/documents', priority: 0.9, changeFrequency: 'monthly' },
    { path: '/services/website-copy', priority: 0.9, changeFrequency: 'monthly' },
    { path: '/services/social-media', priority: 0.9, changeFrequency: 'monthly' },
    { path: '/services/quarterly-refresh', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/whats-included', priority: 0.7, changeFrequency: 'monthly' },
    { path: '/pricing', priority: 0.9, changeFrequency: 'monthly' },
    { path: '/how-it-works', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/about', priority: 0.7, changeFrequency: 'monthly' },
    { path: '/faq', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/contact', priority: 0.6, changeFrequency: 'monthly' },
    { path: '/blog', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/privacy', priority: 0.3, changeFrequency: 'yearly' },
    { path: '/terms', priority: 0.3, changeFrequency: 'yearly' },
  ];

  const staticRoutes = staticPages.map((page) => ({
    url: `${baseUrl}${page.path}`,
    lastModified: new Date(),
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));

  const blogRoutes = articles.map((article) => ({
    url: `${baseUrl}/blog/${article.slug}`,
    lastModified: new Date(article.lastUpdated || article.date),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...blogRoutes];
}
