import type { Metadata } from 'next';
import { JsonLd } from '@/components/seo';
import { SITE_URL, generateBreadcrumbSchema, generateWebPageSchema } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How PlanningIndex handles, protects, and respects your data. UK GDPR compliant privacy policy.',
  alternates: { canonical: `${SITE_URL}/privacy` },
};

export default function PrivacyPolicyPage() {
  const breadcrumbs = generateBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Privacy Policy', path: '/privacy' },
  ]);

  const webPage = generateWebPageSchema({
    name: 'Privacy Policy | PlanningIndex',
    description: 'How PlanningIndex handles, protects, and respects your data.',
    path: '/privacy',
  });

  return (
    <>
      <JsonLd data={[breadcrumbs, webPage]} />
      <section className="bg-primary-900 text-white px-6 pt-32 pb-20">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="font-sans font-bold mb-4" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
            Privacy Policy
          </h1>
          <p className="font-sans text-white/80" style={{ fontSize: '1.05rem' }}>
            How we handle, protect, and respect your data.
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
              PlanningIndex (&quot;we,&quot; &quot;us,&quot; &quot;our&quot;) is committed to protecting your privacy. This Privacy Policy explains what personal data we collect, how we use it, your rights, and how we protect it.
            </p>
            <p className="font-sans leading-relaxed mb-4" style={{ fontSize: '0.95rem' }}>
              We are based in the United Kingdom and operate under the UK&apos;s Data Protection Act 2018 and the UK GDPR. This policy applies to all visitors to planningindex.co.uk (&quot;the Website&quot;) and users of PlanningIndex services.
            </p>
            <p className="font-sans leading-relaxed" style={{ fontSize: '0.95rem' }}>
              The full privacy policy will be expanded here in a later phase. For any privacy-related questions, please contact us at hello@planningindex.co.uk.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
