import type { Metadata } from 'next';
import { Search, BookOpen, CreditCard, Settings, Users, Mail, ChevronRight } from 'lucide-react';
import { JsonLd } from '@/components/seo';
import { SITE_URL, generateBreadcrumbSchema, generateWebPageSchema } from '@/lib/seo';
import { PageHero, DarkCTABanner, Card } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Help Centre',
  description: 'Find answers to common questions about PlanningIndex. Browse help categories covering search, billing, account, and more.',
  alternates: { canonical: `${SITE_URL}/help` },
};

const categories = [
  { icon: Search, title: 'Getting Started', desc: 'Learn how to search for planning applications, set up filters, and find your first job.', count: '8 articles' },
  { icon: Users, title: 'Leads & CRM', desc: 'Everything about managing leads, your pipeline, contacts, and proposals.', count: '12 articles' },
  { icon: CreditCard, title: 'Billing & Plans', desc: 'Information about pricing, plans, upgrading, downgrading, and billing.', count: '6 articles' },
  { icon: Settings, title: 'Account Settings', desc: 'Manage your profile, password, team members, and notification preferences.', count: '5 articles' },
  { icon: BookOpen, title: 'Guides & Tutorials', desc: 'Step-by-step walkthroughs to get the most out of PlanningIndex.', count: '10 articles' },
  { icon: Mail, title: 'Contact Support', desc: 'Can\'t find what you need? Get in touch with our support team directly.', count: 'Contact us' },
];

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

      <section className="bg-white py-24 px-6">
        <div className="max-w-3xl mx-auto mb-16">
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-400 pointer-events-none" />
            <input
              type="search"
              placeholder="Search for help articles..."
              className="block w-full pl-12 pr-4 py-3.5 border border-primary-300 rounded-xl shadow-sm placeholder:text-primary-400 focus:outline-none focus:ring-2 focus:ring-accent-500/40 focus:border-accent-500 font-sans text-sm text-primary-900 bg-white"
            />
          </div>
        </div>

        <div className="max-w-page mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Card key={category.title} variant="raised" className="h-full cursor-pointer group">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-lg bg-accent-100 flex items-center justify-center shrink-0">
                    <category.icon className="text-accent-700" size={22} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-sans font-semibold text-primary-900 text-base group-hover:text-accent-700 transition-colors">
                        {category.title}
                      </h3>
                      <ChevronRight size={16} className="text-primary-300 group-hover:text-accent-600 transition-colors" />
                    </div>
                    <p className="font-sans text-primary-500 text-sm leading-relaxed mt-1.5 mb-3">
                      {category.desc}
                    </p>
                    <span className="font-sans text-primary-400" style={{ fontSize: '0.8rem' }}>
                      {category.count}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center mt-16">
            <div className="inline-block bg-primary-50 rounded-xl border border-primary-100 px-8 py-6">
              <p className="font-sans text-primary-500" style={{ fontSize: '0.95rem' }}>
                Can&apos;t find what you&apos;re looking for?{' '}
                <a href="/contact" className="font-semibold text-accent-600 hover:text-accent-700 transition-colors">
                  Contact our team
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>

      <DarkCTABanner
        title="Still need help?"
        subtitle="Our support team is here to help. Get in touch and we'll respond within 24 hours."
        ctaLabel="Contact Support"
        ctaHref="/contact"
      />
    </>
  );
}
