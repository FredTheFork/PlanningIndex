import type { Metadata } from 'next';
import { JsonLd } from '@/components/seo';
import { SITE_URL, generateBreadcrumbSchema, generateWebPageSchema } from '@/lib/seo';
import { PageHero, DarkCTABanner, FAQSection } from '@/components/ui';
import { pricingFaqs } from '@/lib/pricing';
import PricingContent from './PricingContent';

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'Simple, transparent pricing for UK construction professionals. Choose from Local, Regional, National, or Enterprise plans. 14-day free trial on every plan.',
  alternates: { canonical: `${SITE_URL}/pricing` },
};

export default function PricingPage() {
  const breadcrumbs = generateBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Pricing', path: '/pricing' },
  ]);

  const webPage = generateWebPageSchema({
    name: 'Pricing | PlanningIndex',
    description: 'Simple, transparent pricing for UK construction professionals.',
    path: '/pricing',
  });

  return (
    <>
      <JsonLd data={[breadcrumbs, webPage]} />
      <PageHero
        eyebrow="Pricing"
        title="Choose your coverage."
        subtitle="Start with one council or cover the whole country. Upgrade, downgrade, or cancel anytime."
      />

      <PricingContent />

      <FAQSection items={pricingFaqs} title="Pricing questions, answered" label="FAQ" collapsible />

      <DarkCTABanner
        title="Start with a free trial today."
        subtitle="Join thousands of UK builders who stopped chasing work and started winning it."
        ctaLabel="Start Free Trial"
        ctaHref="/login"
        note="14-day free trial · No commitment · Full access"
      />
    </>
  );
}
