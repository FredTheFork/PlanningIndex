import type { MetadataRoute } from 'next';
import { SITE_URL, SITE_CONFIG } from '@/lib/seo/config';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_CONFIG.name,
    short_name: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#F8FAFC',
    theme_color: '#0F172A',
    icons: [
      {
        src: '/icon',
        sizes: '32x32',
        type: 'image/png',
      },
    ],
    categories: ['business', 'productivity'],
    lang: 'en-GB',
  };
}
