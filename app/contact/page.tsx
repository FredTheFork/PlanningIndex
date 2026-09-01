import type { Metadata } from 'next';
import { JsonLd } from '@/components/seo';
import { SITE_URL, generateBreadcrumbSchema, generateWebPageSchema } from '@/lib/seo';
import ContactForm from './ContactForm';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with the PlanningIndex team. Email us at hello@planningindex.co.uk or send us a message.',
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
      <ContactForm />
    </>
  );
}
