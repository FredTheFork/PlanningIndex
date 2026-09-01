import type { Metadata } from 'next';
import { JsonLd } from '@/components/seo';
import { SITE_URL, generateBreadcrumbSchema, generateWebPageSchema } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with the PlanningIndex team. Email us at hello@planningindex.co.uk.',
  alternates: { canonical: `${SITE_URL}/contact` },
};

export default function ContactPage() {
  const breadcrumbs = generateBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Contact', path: '/contact' },
  ]);

  const webPage = generateWebPageSchema({
    name: 'Contact | PlanningIndex',
    description: 'Get in touch with the PlanningIndex team.',
    path: '/contact',
  });

  return (
    <>
      <JsonLd data={[breadcrumbs, webPage]} />
      <section className="bg-primary-900 text-white px-6 pt-32 pb-20">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="font-sans font-bold mb-6" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
            Contact Us
          </h1>
          <p className="font-sans text-white/80 leading-relaxed" style={{ fontSize: '1.1rem' }}>
            Have a question about PlanningIndex? We&apos;d love to hear from you.
          </p>
        </div>
      </section>
      <section className="bg-white py-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-primary-50 rounded-xl p-12 border border-primary-100">
            <h2 className="font-sans font-semibold text-primary-900 mb-4" style={{ fontSize: '1.3rem' }}>
              Email Us
            </h2>
            <p className="font-sans text-primary-600 mb-2" style={{ fontSize: '1.05rem' }}>
              <a href="mailto:hello@planningindex.co.uk" className="text-accent-600 hover:underline">
                hello@planningindex.co.uk
              </a>
            </p>
            <p className="font-sans text-primary-400 mt-6" style={{ fontSize: '0.9rem' }}>
              A full contact form will be available here in a later phase.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
