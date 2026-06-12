import { Metadata } from 'next';
import { SITE_URL } from '@/lib/seo';
import ServicesClient from './ServicesClient';

export const metadata: Metadata = {
  title: 'Services | Foundationary',
  description: 'Professional documents, website copy, social media posts, and ongoing maintenance for UK sole traders. Buy any service alone or bundle and save.',
  keywords: 'sole trader services UK, business documents, website copy, social media management, UK freelancer, sole trader packages',
  openGraph: {
    title: 'Foundationary Services | Business Documents, Website Copy & Social Media',
    description: 'Professional documents, website copy, social media posts, and ongoing maintenance for UK sole traders. Buy any service alone or bundle and save.',
    url: `${SITE_URL}/services`,
    images: [{ url: `${SITE_URL}/og/services.png`, width: 1200, height: 630 }],
  },
  alternates: {
    canonical: `${SITE_URL}/services`,
  },
};

export default function ServicesPage() {
  return <ServicesClient />;
}
