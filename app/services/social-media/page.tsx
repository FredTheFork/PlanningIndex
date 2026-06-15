import type { Metadata } from 'next';
import { JsonLd } from '@/components/seo';
import { SITE_URL, generateBreadcrumbSchema, generateWebPageSchema } from '@/lib/seo';
import SocialMediaClient from './SocialMediaClient';

export const metadata: Metadata = {
  title: 'Social Media Starter Pack — Done-For-You Posts for UK Sole Traders | Foundationary',
  description: 'Done-for-you social media posts for UK sole traders. Educational, promotional, and trust-building content. From £20 for 5 posts.',
  keywords: 'social media posts UK sole trader, freelancer social media, done for you social media UK, LinkedIn posts sole trader, social media content service UK',
  openGraph: {
    title: 'Social Media Starter Pack | Done-For-You Posts for UK Sole Traders',
    description: 'Done-for-you social media posts for UK sole traders. From £20 for 5 posts.',
    url: `${SITE_URL}/services/social-media`,
    siteName: 'Foundationary',
    locale: 'en_GB',
    type: 'website',
    images: [{ url: `${SITE_URL}/api/og?title=${encodeURIComponent('Social Media Posts for UK Sole Traders')}&description=${encodeURIComponent('Done-for-you social media posts. Educational, promotional, trust-building. From £20.')}`, width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Social Media Starter Pack | Done-For-You Posts for UK Sole Traders',
    description: 'Done-for-you social media posts for UK sole traders. From £20 for 5 posts.',
    creator: '@Foundationary',
    site: '@Foundationary',
  },
  alternates: {
    canonical: `${SITE_URL}/services/social-media`,
    languages: {
      'en-GB': `${SITE_URL}/services/social-media`,
      'x-default': `${SITE_URL}/services/social-media`,
    },
  },
};

export default function SocialMediaPage() {
  const breadcrumbs = generateBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Social Media', path: '/services/social-media' },
  ]);

  const webPage = generateWebPageSchema({
    name: 'Social Media Starter Pack — Done-For-You Posts for UK Sole Traders',
    description: 'Done-for-you social media posts for UK sole traders. Educational, promotional, and trust-building content. From £20 for 5 posts.',
    path: '/services/social-media',
  });

  return (
    <>
      <JsonLd data={[breadcrumbs, webPage]} />
      <SocialMediaClient />
    </>
  );
}
