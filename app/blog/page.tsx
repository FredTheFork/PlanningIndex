import { Metadata } from 'next';
import { JsonLd } from '@/components/seo';
import { SITE_URL, generateBreadcrumbSchema, generateWebPageSchema } from '@/lib/seo';
import BlogClient from './BlogClient';

export const metadata: Metadata = {
  title: 'Blog | UK Sole Trader Guides & Resources',
  description: 'Expert guides for UK sole traders. Learn about business registration, GDPR compliance, client contracts, invoicing best practices, tax obligations and more.',
  keywords: 'sole trader blog UK, freelancer guides UK, sole trader advice, UK business registration guide, GDPR for sole traders, client contract tips',
  openGraph: {
    title: 'Foundationary Blog | Guides for UK Sole Traders',
    description: 'Practical advice and expert guides for UK sole traders. Registration, tax, contracts, GDPR, invoicing and more.',
    url: `${SITE_URL}/blog`,
    images: [{ url: `${SITE_URL}/og/blog.png`, width: 1200, height: 630 }],
  },
  alternates: {
    canonical: `${SITE_URL}/blog`,
  },
};

export default function BlogPage() {
  const breadcrumbs = generateBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Blog', path: '/blog' },
  ]);

  const webPage = generateWebPageSchema({
    name: 'Blog | UK Sole Trader Guides & Resources',
    description: 'Expert guides for UK sole traders. Learn about business registration, GDPR compliance, client contracts, invoicing best practices and more.',
    path: '/blog',
  });

  return (
    <>
      <JsonLd data={[breadcrumbs, webPage]} />
      <BlogClient />
    </>
  );
}
