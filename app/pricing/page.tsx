import type { Metadata } from 'next';
import { JsonLd } from '@/components/seo';
import { SITE_URL, generateBreadcrumbSchema, generateWebPageSchema } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'PlanningIndex pricing plans for planning professionals. Choose the plan that fits your workflow.',
  alternates: { canonical: `${SITE_URL}/pricing` },
};

export default function PricingPage() {
  const breadcrumbs = generateBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Pricing', path: '/pricing' },
  ]);

  const webPage = generateWebPageSchema({
    name: 'Pricing | PlanningIndex',
    description: 'PlanningIndex pricing plans for planning professionals.',
    path: '/pricing',
  });

  return (
    <>
      <JsonLd data={[breadcrumbs, webPage]} />
      <section className="bg-primary-900 text-white px-6 pt-32 pb-20">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="font-sans font-bold mb-6" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
            Pricing
          </h1>
          <p className="font-sans text-white/80 leading-relaxed" style={{ fontSize: '1.1rem' }}>
            Simple, transparent pricing for planning professionals.
          </p>
        </div>
      </section>
      <section className="bg-white py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="bg-primary-50 rounded-xl p-12 border border-primary-100">
            <p className="font-sans text-primary-600" style={{ fontSize: '1.05rem' }}>
              Pricing plans will be displayed here in a later phase.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
