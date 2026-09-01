import type { Metadata } from 'next';
import { JsonLd } from '@/components/seo';
import { SITE_URL, generateBreadcrumbSchema, generateWebPageSchema } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Terms of Use',
  description: 'The terms and conditions that govern your use of PlanningIndex services.',
  alternates: { canonical: `${SITE_URL}/terms` },
};

export default function TermsOfUsePage() {
  const breadcrumbs = generateBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Terms of Use', path: '/terms' },
  ]);

  const webPage = generateWebPageSchema({
    name: 'Terms of Use | PlanningIndex',
    description: 'The terms and conditions that govern your use of PlanningIndex services.',
    path: '/terms',
  });

  return (
    <>
      <JsonLd data={[breadcrumbs, webPage]} />
      <section className="bg-primary-900 text-white px-6 pt-32 pb-20">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="font-sans font-bold mb-4" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
            Terms of Use
          </h1>
          <p className="font-sans text-white/80" style={{ fontSize: '1.05rem' }}>
            The terms and conditions that govern your use of PlanningIndex.
          </p>
        </div>
      </section>
      <section className="bg-white py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="prose prose-lg max-w-none text-primary-600">
            <p className="font-sans leading-relaxed mb-6" style={{ fontSize: '0.95rem' }}>
              <strong>Last updated: September 2026</strong>
            </p>
            <p className="font-sans leading-relaxed mb-4" style={{ fontSize: '0.95rem' }}>
              By accessing and using planningindex.co.uk (the &quot;Website&quot;) and PlanningIndex services (the &quot;Service&quot;), you agree to be bound by these Terms of Use. If you do not agree with any part of these terms, you should not use the Website or the Service.
            </p>
            <p className="font-sans leading-relaxed" style={{ fontSize: '0.95rem' }}>
              The full terms of use will be expanded here in a later phase. For any questions about these terms, please contact us at hello@planningindex.co.uk.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
