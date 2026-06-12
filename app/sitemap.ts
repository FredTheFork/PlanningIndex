import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_URL;

  const staticPages = [
    {
      path: '',
      priority: 1.0,
      changeFrequency: 'weekly' as const,
    },
    {
      path: '/services',
      priority: 1.0,
      changeFrequency: 'weekly' as const,
    },
    {
      path: '/services/documents',
      priority: 0.9,
      changeFrequency: 'monthly' as const,
    },
    {
      path: '/services/website-copy',
      priority: 0.9,
      changeFrequency: 'monthly' as const,
    },
    {
      path: '/services/social-media',
      priority: 0.9,
      changeFrequency: 'monthly' as const,
    },
    {
      path: '/services/quarterly-refresh',
      priority: 0.8,
      changeFrequency: 'monthly' as const,
    },
    {
      path: '/whats-included',
      priority: 0.7,
      changeFrequency: 'monthly' as const,
    },
    {
      path: '/pricing',
      priority: 0.9,
      changeFrequency: 'monthly' as const,
    },
    {
      path: '/how-it-works',
      priority: 0.8,
      changeFrequency: 'monthly' as const,
    },
    {
      path: '/about',
      priority: 0.7,
      changeFrequency: 'monthly' as const,
    },
    {
      path: '/faq',
      priority: 0.8,
      changeFrequency: 'monthly' as const,
    },
    {
      path: '/contact',
      priority: 0.6,
      changeFrequency: 'monthly' as const,
    },
    {
      path: '/blog',
      priority: 0.8,
      changeFrequency: 'weekly' as const,
    },
    {
      path: '/privacy',
      priority: 0.3,
      changeFrequency: 'yearly' as const,
    },
    {
      path: '/terms',
      priority: 0.3,
      changeFrequency: 'yearly' as const,
    },
  ];

  const blogArticles = [
    'sole-trader-business-setup-guide-uk',
    'gdpr-compliance-for-sole-traders-uk',
    'client-contract-essentials-uk-freelancers',
    'invoice-template-best-practices-uk',
    'late-payment-fees-uk-law',
  ];

  const staticRoutes = staticPages.map((page) => ({
    url: `${baseUrl}${page.path}`,
    lastModified: new Date(),
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));

  const blogRoutes = blogArticles.map((slug) => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...blogRoutes];
}
