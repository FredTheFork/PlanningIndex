import type { Metadata } from 'next';
import { JsonLd } from '@/components/seo';
import { SITE_URL, generateBreadcrumbSchema, generateWebPageSchema } from '@/lib/seo';
import { PageHero } from '@/components/ui';
import HelpHomeContent from './HelpHomeContent';

export const metadata: Metadata = {
  title: 'Help Centre',
  description: 'Find answers to common questions about PlanningIndex. Browse help categories covering search, billing, account, and more.',
  alternates: { canonical: `${SITE_URL}/help` },
};

export default function HelpPage() {
  const breadcrumbs = generateBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Help Centre', path: '/help' },
  ]);

  const webPage = generateWebPageSchema({
    name: 'Help Centre | PlanningIndex',
    description: 'Find answers to common questions about PlanningIndex.',
    path: '/help',
  });

  return (
    <>
      <JsonLd data={[breadcrumbs, webPage]} />
      <PageHero
        eyebrow="Resources"
        title="Help Centre"
        subtitle="Find answers to common questions about PlanningIndex. Browse our help categories or get in touch with our team."
      />
      <HelpHomeContent />
    </>
  );
}
