import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';
import { industries } from '@/lib/industries';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: Array<{
    path: string;
    priority: number;
    changeFrequency: 'weekly' | 'monthly' | 'yearly';
  }> = [
    { path: '', priority: 1.0, changeFrequency: 'weekly' },
    { path: '/features', priority: 0.9, changeFrequency: 'monthly' },
    { path: '/pricing', priority: 0.9, changeFrequency: 'monthly' },
    { path: '/industries', priority: 0.8, changeFrequency: 'monthly' },
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

  const allPages = [...staticPages, ...industryPages];

  return allPages.map((page) => ({
    url: `${SITE_URL}${page.path}`,
    lastModified: new Date(),
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));
}
