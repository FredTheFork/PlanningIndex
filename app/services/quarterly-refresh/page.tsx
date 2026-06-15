import type { Metadata } from 'next';
import { JsonLd } from '@/components/seo';
import { SITE_URL, generateBreadcrumbSchema, generateWebPageSchema } from '@/lib/seo';
import QuarterlyRefreshClient from './QuarterlyRefreshClient';

export const metadata: Metadata = {
  title: 'Quarterly Document Refresh — Keep Your Business Documents Current | Foundationary',
  description: 'Keep your business documents accurate as your business evolves. One update per quarter. £29 every 4 months. Cancel anytime.',
  keywords: 'document refresh service UK, sole trader document update, quarterly document maintenance, keep business documents current UK, document subscription service',
  openGraph: {
    title: 'Quarterly Document Refresh | Keep Business Documents Current',
    description: 'Keep your business documents accurate as your business evolves. £29 every 4 months. Cancel anytime.',
    url: `${SITE_URL}/services/quarterly-refresh`,
    siteName: 'Foundationary',
    locale: 'en_GB',
    type: 'website',
    images: [{ url: `${SITE_URL}/api/og?title=${encodeURIComponent('Quarterly Document Refresh')}&description=${encodeURIComponent('Keep your business documents current. £29 every 4 months. Cancel anytime.')}`, width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Quarterly Document Refresh | Keep Business Documents Current',
    description: 'Keep your business documents accurate. £29 every 4 months. Cancel anytime.',
    creator: '@Foundationary',
    site: '@Foundationary',
  },
  alternates: {
    canonical: `${SITE_URL}/services/quarterly-refresh`,
    languages: {
      'en-GB': `${SITE_URL}/services/quarterly-refresh`,
      'x-default': `${SITE_URL}/services/quarterly-refresh`,
    },
  },
};

export default function QuarterlyRefreshPage() {
  const breadcrumbs = generateBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Quarterly Refresh', path: '/services/quarterly-refresh' },
  ]);

  const webPage = generateWebPageSchema({
    name: 'Quarterly Document Refresh — Keep Your Business Documents Current',
    description: 'Keep your business documents accurate as your business evolves. One update per quarter. £29 every 4 months. Cancel anytime.',
    path: '/services/quarterly-refresh',
  });

  return (
    <>
      <JsonLd data={[breadcrumbs, webPage]} />
      <QuarterlyRefreshClient />
    </>
  );
}
