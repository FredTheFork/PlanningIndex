import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/personal/', '/auth/', '/checkout/', '/success/', '/login/', '/additional-services/'],
      },
      {
        userAgent: 'GPTBot',
        allow: '/',
        disallow: ['/personal/', '/auth/', '/checkout/', '/success/', '/login/', '/additional-services/'],
      },
      {
        userAgent: 'ChatGPT-User',
        allow: '/',
        disallow: ['/personal/', '/auth/', '/checkout/', '/success/', '/login/', '/additional-services/'],
      },
      {
        userAgent: 'CCBot',
        allow: '/',
        disallow: ['/personal/', '/auth/', '/checkout/', '/success/', '/login/', '/additional-services/'],
      },
      {
        userAgent: 'anthropic-ai',
        allow: '/',
        disallow: ['/personal/', '/auth/', '/checkout/', '/success/', '/login/', '/additional-services/'],
      },
      {
        userAgent: 'Claude-Web',
        allow: '/',
        disallow: ['/personal/', '/auth/', '/checkout/', '/success/', '/login/', '/additional-services/'],
      },
      {
        userAgent: 'Google-Extended',
        allow: '/',
        disallow: ['/personal/', '/auth/', '/checkout/', '/success/', '/login/', '/additional-services/'],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/personal/', '/auth/', '/checkout/', '/success/', '/login/', '/additional-services/'],
      },
      {
        userAgent: 'Yandex',
        allow: '/',
        disallow: ['/personal/', '/auth/', '/checkout/', '/success/', '/login/', '/additional-services/'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
