import { Metadata } from 'next';
import { JsonLd } from '@/components/seo';
import { SITE_URL, generateBreadcrumbSchema, generateWebPageSchema } from '@/lib/seo';
import ContactClient from './ContactClient';

export const metadata: Metadata = {
  title: 'Contact | Foundationary - UK Sole Trader Document Service',
  description: 'Get in touch with Foundationary. Email us at foundationarybusiness@gmail.com or call +44 7377 203834. We respond within 24 hours.',
  keywords: 'contact Foundationary, sole trader document service contact, business documents UK contact',
  openGraph: {
    title: 'Contact Foundationary | UK Sole Trader Document Service',
    description: 'Get in touch with Foundationary for UK sole trader business documents. Email, phone, or contact form available.',
    url: `${SITE_URL}/contact`,
    images: [{ url: `${SITE_URL}/og/contact.png`, width: 1200, height: 630 }],
  },
  alternates: {
    canonical: `${SITE_URL}/contact`,
  },
};

export default function ContactPage() {
  const breadcrumbs = generateBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Contact', path: '/contact' },
  ]);

  const webPage = generateWebPageSchema({
    name: 'Contact | Foundationary - UK Sole Trader Document Service',
    description: 'Get in touch with Foundationary. We respond within 24 hours.',
    path: '/contact',
  });

  return (
    <>
      <JsonLd data={[breadcrumbs, webPage]} />
      <ContactClient />
    </>
  );
}
