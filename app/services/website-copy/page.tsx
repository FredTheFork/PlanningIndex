import type { Metadata } from 'next';
import { JsonLd } from '@/components/seo';
import { SITE_URL, generateBreadcrumbSchema, generateWebPageSchema } from '@/lib/seo';
import WebsiteCopyClient from './WebsiteCopyClient';

export const metadata: Metadata = {
  title: 'Website Copy Starter Pack — Professional Copy for UK Sole Traders | Foundationary',
  description: 'Professional website copy written in your voice. SEO-aware, ready to paste, delivered in 3-5 days. From £35/page.',
  keywords: 'website copy UK sole trader, professional website content, freelancer website copy, sole trader website writing, website copywriting service UK',
  openGraph: {
    title: 'Website Copy Starter Pack | Professional Copy for UK Sole Traders',
    description: 'Professional website copy written in your voice. SEO-aware, ready to paste. From £35/page.',
    url: `${SITE_URL}/services/website-copy`,
    siteName: 'Foundationary',
    locale: 'en_GB',
    type: 'website',
    images: [{ url: `${SITE_URL}/api/og?title=${encodeURIComponent('Website Copy for UK Sole Traders')}&description=${encodeURIComponent('Professional website copy written in your voice. From £35/page.')}`, width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Website Copy Starter Pack | Professional Copy for UK Sole Traders',
    description: 'Professional website copy written in your voice. From £35/page.',
    creator: '@Foundationary',
    site: '@Foundationary',
  },
  alternates: {
    canonical: `${SITE_URL}/services/website-copy`,
    languages: {
      'en-GB': `${SITE_URL}/services/website-copy`,
      'x-default': `${SITE_URL}/services/website-copy`,
    },
  },
};

export default function WebsiteCopyPage() {
  const breadcrumbs = generateBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Website Copy', path: '/services/website-copy' },
  ]);

  const webPage = generateWebPageSchema({
    name: 'Website Copy Starter Pack — Professional Copy for UK Sole Traders',
    description: 'Professional website copy written in your voice. SEO-aware, ready to paste, delivered in 3-5 days. From £35/page.',
    path: '/services/website-copy',
  });

  return (
    <>
      <JsonLd data={[breadcrumbs, webPage]} />
      <WebsiteCopyClient />
    </>
  );
}
