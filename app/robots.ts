import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/personal/',
    },
    sitemap: 'https://foundationary.co.uk/sitemap.xml',
  };
}
