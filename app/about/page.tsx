import type { Metadata } from 'next';
import { JsonLd } from '@/components/seo';
import { SITE_URL, generateBreadcrumbSchema, generateWebPageSchema } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'About',
  description: 'PlanningIndex is a UK planning intelligence platform built for planning professionals, consultants, and agents.',
  alternates: { canonical: `${SITE_URL}/about` },
};

export default function AboutPage() {
  const breadcrumbs = generateBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
  ]);

  const webPage = generateWebPageSchema({
    name: 'About | PlanningIndex',
    description: 'PlanningIndex is a UK planning intelligence platform built for planning professionals.',
    path: '/about',
  });

  return (
    <>
      <JsonLd data={[breadcrumbs, webPage]} />
      <section className="bg-primary-900 text-white px-6 pt-32 pb-20">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="font-sans font-bold mb-6" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
            About PlanningIndex
          </h1>
          <p className="font-sans text-white/80 leading-relaxed" style={{ fontSize: '1.1rem' }}>
            PlanningIndex is a UK planning intelligence platform that helps planning professionals search, track, and act on planning applications. We provide real-time data, geographic search, and CRM tools designed specifically for the planning industry.
          </p>
        </div>
      </section>
      <section className="bg-white py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="prose prose-lg max-w-none text-primary-600">
            <p className="font-sans leading-relaxed" style={{ fontSize: '1.05rem' }}>
              This page will be expanded with full company information, mission, team details, and company history in a later phase.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
