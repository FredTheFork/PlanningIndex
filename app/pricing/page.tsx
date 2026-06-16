import { Metadata } from 'next';
import { JsonLd } from '@/components/seo';
import { generateProductSchema, SITE_URL, generateBreadcrumbSchema, generateWebPageSchema, generateFAQSchema } from '@/lib/seo';
import PricingClient from './PricingClient';

export const metadata: Metadata = {
  title: 'Pricing | Complete Business Infrastructure for UK Sole Traders',
  description: 'Three tiers. 13 packs. From £79 for foundational documents to £299 for complete industry compliance. Foundation, Operations, and Industry tiers — buy individually or bundle for up to 25% off.',
  keywords: 'sole trader document pricing UK, business documents cost, freelancer contract price, GDPR privacy policy cost UK, operations pack, industry pack, business infrastructure pricing',
  openGraph: {
    title: 'Foundationary Pricing | Three-Tier Business Infrastructure',
    description: 'Complete business infrastructure for UK sole traders. Foundation, Operations, and Industry tiers from £79 to £299. Bundle for up to 25% off.',
    url: `${SITE_URL}/pricing`,
    images: [{ url: `${SITE_URL}/api/og?title=${encodeURIComponent('Complete Business Infrastructure')}&description=${encodeURIComponent('Three tiers. 13 packs. From £79 for documents to £299 for industry compliance.')}&type=pricing`, width: 1200, height: 630 }],
  },
  alternates: {
    canonical: `${SITE_URL}/pricing`,
    languages: {
      'en-GB': `${SITE_URL}/pricing`,
      'x-default': `${SITE_URL}/pricing`,
    },
  },
};

// FAQ schema for the pricing page
const pricingFAQs = [
  { question: "What's in each tier?", answer: "Foundation tier gives you the essentials to start: 10 business documents, plus options for website copy and social media posts. Operations tier protects your running business: client onboarding systems, payment protection, IP rights, and deep GDPR compliance. Industry tier adds profession-specific documents for coaches, photographers, consultants, and contractors." },
  { question: "What's in each Operations pack?", answer: "Client Onboarding Pack (8 documents): onboarding questionnaires, scope of work templates, change request forms. Payment Protection Pack (8 documents): invoice terms, late payment policies, deposit protection. Copyright & Licensing Pack (8 documents): IP notices, licensing agreements, NDAs. GDPR Deep Pack (9 documents): comprehensive privacy policy, DPAs, breach procedures." },
  { question: "How do bundle discounts work?", answer: "Add 2+ packs to your order and discounts apply automatically: 10% for 2 packs, 15% for 3+. Pre-built bundles offer up to 25% off. No codes needed." },
  { question: 'Can I buy packs individually?', answer: "Yes. Every pack is sold separately with no requirement to bundle. You only get discounts when you bundle multiple packs together." },
  { question: "What's the Monthly Care Plan?", answer: "For £29/month, you get ongoing document updates, priority support, and proactive notifications about regulation changes. It's optional and you can cancel anytime." },
];

export default function PricingPage() {
  const breadcrumbs = generateBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Pricing', path: '/pricing' },
  ]);

  const webPage = generateWebPageSchema({
    name: 'Pricing | Complete Business Infrastructure for UK Sole Traders',
    description: 'Three tiers. 13 packs. From £79 for foundational documents to £299 for complete industry compliance.',
    path: '/pricing',
  });

  const faqSchema = generateFAQSchema(pricingFAQs);

  return (
    <>
      <JsonLd data={[generateProductSchema(), breadcrumbs, webPage, faqSchema]} />
      <PricingClient />
    </>
  );
}
