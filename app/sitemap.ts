import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_URL;

  const staticPages: Array<{
    path: string;
    priority: number;
    changeFrequency: 'weekly' | 'monthly' | 'yearly';
    lastModified: string;
  }> = [
    {
      path: '',
      priority: 1.0,
      changeFrequency: 'weekly',
      lastModified: '2026-06-14',
    },
    {
      path: '/services',
      priority: 1.0,
      changeFrequency: 'weekly',
      lastModified: '2026-06-14',
    },
    {
      path: '/services/documents',
      priority: 0.9,
      changeFrequency: 'monthly',
      lastModified: '2026-06-10',
    },
    {
      path: '/services/website-copy',
      priority: 0.9,
      changeFrequency: 'monthly',
      lastModified: '2026-06-10',
    },
    {
      path: '/services/social-media',
      priority: 0.9,
      changeFrequency: 'monthly',
      lastModified: '2026-06-10',
    },
    {
      path: '/services/quarterly-refresh',
      priority: 0.8,
      changeFrequency: 'monthly',
      lastModified: '2026-06-10',
    },
    {
      path: '/additional-services',
      priority: 0.9,
      changeFrequency: 'monthly',
      lastModified: '2026-06-14',
    },
    {
      path: '/whats-included',
      priority: 0.7,
      changeFrequency: 'monthly',
      lastModified: '2026-06-08',
    },
    {
      path: '/pricing',
      priority: 0.9,
      changeFrequency: 'monthly',
      lastModified: '2026-06-14',
    },
    {
      path: '/how-it-works',
      priority: 0.8,
      changeFrequency: 'monthly',
      lastModified: '2026-06-08',
    },
    {
      path: '/about',
      priority: 0.7,
      changeFrequency: 'monthly',
      lastModified: '2026-06-08',
    },
    {
      path: '/faq',
      priority: 0.8,
      changeFrequency: 'monthly',
      lastModified: '2026-06-08',
    },
    {
      path: '/contact',
      priority: 0.6,
      changeFrequency: 'monthly',
      lastModified: '2026-06-08',
    },
    {
      path: '/blog',
      priority: 0.8,
      changeFrequency: 'weekly',
      lastModified: '2026-06-14',
    },
    {
      path: '/privacy',
      priority: 0.3,
      changeFrequency: 'yearly',
      lastModified: '2026-05-14',
    },
    {
      path: '/terms',
      priority: 0.3,
      changeFrequency: 'yearly',
      lastModified: '2026-05-14',
    },
  ];

  const blogArticles: Array<{ slug: string; date: string }> = [
    { slug: 'sole-trader-business-setup-guide-uk', date: '2026-01-15' },
    { slug: 'gdpr-compliance-for-sole-traders-uk', date: '2026-01-22' },
    { slug: 'client-contract-essentials-uk-freelancers', date: '2026-02-01' },
    { slug: 'invoice-template-best-practices-uk', date: '2026-02-08' },
    { slug: 'late-payment-fees-uk-law', date: '2026-02-15' },
  ];

  const staticRoutes = staticPages.map((page) => ({
    url: `${baseUrl}${page.path}`,
    lastModified: new Date(page.lastModified),
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));

  const blogRoutes = blogArticles.map((article) => ({
    url: `${baseUrl}/blog/${article.slug}`,
    lastModified: new Date(article.date),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...blogRoutes];
}
