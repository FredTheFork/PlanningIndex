import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://foundationary.co.uk';

  const staticPages = [
    '',
    '/whats-included',
    '/pricing',
    '/how-it-works',
    '/about',
    '/additional-services',
    '/faq',
    '/contact',
    '/blog',
  ].map(path => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: path === '' ? 1 : 0.8,
  }));

  // Blog articles - using hardcoded list for now
  const blogArticles = [
    'sole-trader-business-setup-guide-uk',
    'gdpr-compliance-for-sole-traders-uk',
    'client-contract-essentials-uk-freelancers',
    'invoice-template-best-practices-uk',
    'late-payment-fees-uk-law',
  ];

  const blogPages = blogArticles.map(slug => ({
    url: `${base}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  return [...staticPages, ...blogPages];
}
