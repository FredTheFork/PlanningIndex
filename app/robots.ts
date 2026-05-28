import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/personal/', '/auth/', '/checkout/', '/success/'],
      },
      {
        userAgent: 'GPTBot',
        allow: '/',
        disallow: ['/personal/', '/auth/', '/checkout/', '/success/'],
      },
      {
        userAgent: 'ChatGPT-User',
        allow: '/',
        disallow: ['/personal/', '/auth/', '/checkout/', '/success/'],
      },
      {
        userAgent: 'CCBot',
        allow: '/',
        disallow: ['/personal/', '/auth/', '/checkout/', '/success/'],
      },
      {
        userAgent: 'anthropic-ai',
        allow: '/',
        disallow: ['/personal/', '/auth/', '/checkout/', '/success/'],
      },
      {
        userAgent: 'Claude-Web',
        allow: '/',
        disallow: ['/personal/', '/auth/', '/checkout/', '/success/'],
      },
      {
        userAgent: 'Google-Extended',
        allow: '/',
        disallow: ['/personal/', '/auth/', '/checkout/', '/success/'],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/personal/', '/auth/', '/checkout/', '/success/'],
      },
      {
        userAgent: 'Yandex',
        allow: '/',
        disallow: ['/personal/', '/auth/', '/checkout/', '/success/'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
