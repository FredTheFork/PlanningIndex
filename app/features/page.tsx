import type { Metadata } from 'next';
import { Search, Users, FileText, Calendar, FolderOpen, Map, LayoutGrid, Filter, Send, Mail, CheckCircle2 } from 'lucide-react';
import { JsonLd } from '@/components/seo';
import { SITE_URL, generateBreadcrumbSchema, generateWebPageSchema } from '@/lib/seo';
import { PageHero, DarkCTABanner, SectionLabel } from '@/components/ui';
import { FeatureShowcase } from '@/components/marketing';

export const metadata: Metadata = {
  title: 'Features',
  description: 'Everything you need to find, win, and manage construction work. Search planning applications, run your CRM pipeline, generate proposals, track costs, and stay organised.',
  alternates: { canonical: `${SITE_URL}/features` },
};

export default function FeaturesPage() {
  const breadcrumbs = generateBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Features', path: '/features' },
  ]);

  const webPage = generateWebPageSchema({
    name: 'Features | PlanningIndex',
    description: 'Everything you need to find, win, and manage construction work.',
    path: '/features',
  });

  return (
    <>
      <JsonLd data={[breadcrumbs, webPage]} />
      <PageHero
        eyebrow="Platform"
        title="Everything you need to find, win & manage work."
        subtitle="The only all-in-one platform built for UK construction. Search planning applications, run your full CRM pipeline, generate proposals, track costs, and stay organised — all in one place."
        ctaLabel="Start Free Trial"
        ctaHref="/login"
      />

      <section className="bg-white py-24 px-6">
        <div className="max-w-page mx-auto space-y-24">
          <FeatureShowcase
            label="Search & Discovery"
            title="Find every planning application. Before your competitors."
            description="Stop wasting hours on council websites. Every UK planning application, filtered exactly the way you work, updated daily."
            icon={Search}
            features={[
              'Map View — see every project pinned with exact postcode location',
              'Grid View — browse all jobs in one organised, filterable list',
              'Smart Filters — keyword, date range, postcode, council, value, type',
              'Save your favourite searches and get instant results',
            ]}
            image={
              <div className="bg-primary-100 rounded-2xl border border-primary-200 p-8 aspect-[4/3] flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-2xl bg-accent-100 flex items-center justify-center mx-auto mb-4">
                    <Map className="text-accent-700" size={40} />
                  </div>
                  <p className="font-sans text-primary-400" style={{ fontSize: '0.9rem' }}>
                    Map & Grid View
                  </p>
                </div>
              </div>
            }
          />

          <FeatureShowcase
            label="Workspace & Pipeline"
            title="Your entire sales process. One beautiful dashboard."
            description="Turn every planning application into a live lead in seconds. Drag-and-drop your way from first contact to signed contract."
            icon={Users}
            features={[
              'Lead Manager Pipeline — drag cards from New Lead to Won',
              'Job Manager — track site progress, variations, and invoicing',
              'Live totals show £ value and win rate at every stage',
              'Zero switching — everything lives in the same workspace',
            ]}
            reverse
            image={
              <div className="bg-primary-100 rounded-2xl border border-primary-200 p-8 aspect-[4/3] flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-2xl bg-accent-100 flex items-center justify-center mx-auto mb-4">
                    <Users className="text-accent-700" size={40} />
                  </div>
                  <p className="font-sans text-primary-400" style={{ fontSize: '0.9rem' }}>
                    Pipeline Dashboard
                  </p>
                </div>
              </div>
            }
          />

          <FeatureShowcase
            label="Proposals & Quoting"
            title="Professional proposals. Sent in seconds, not hours."
            description="Build, send, and track polished proposals faster than any competitor. One click from quote to client inbox."
            icon={FileText}
            features={[
              'Instant proposal generation — enter your quote once',
              'One-click sending directly from the platform',
              'Track opens, reads, and replies in real time',
              'Searchable archive of every proposal you have ever sent',
            ]}
            image={
              <div className="bg-primary-100 rounded-2xl border border-primary-200 p-8 aspect-[4/3] flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-2xl bg-accent-100 flex items-center justify-center mx-auto mb-4">
                    <Send className="text-accent-700" size={40} />
                  </div>
                  <p className="font-sans text-primary-400" style={{ fontSize: '0.9rem' }}>
                    Proposal Builder
                  </p>
                </div>
              </div>
            }
          />

          <FeatureShowcase
            label="Calendar & Tasks"
            title="Never miss a site visit, deadline, or follow-up."
            description="Everything connected. Calendar, tasks, leads, and jobs — all linked automatically so nothing slips through the cracks."
            icon={Calendar}
            features={[
              'Integrated calendar with site visits and meetings',
              'Smart tasks automatically linked to the correct lead or job',
              'Drag to reschedule, click for full details',
              'Due dates, reminders, and progress tracking',
            ]}
            reverse
            image={
              <div className="bg-primary-100 rounded-2xl border border-primary-200 p-8 aspect-[4/3] flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-2xl bg-accent-100 flex items-center justify-center mx-auto mb-4">
                    <Calendar className="text-accent-700" size={40} />
                  </div>
                  <p className="font-sans text-primary-400" style={{ fontSize: '0.9rem' }}>
                    Calendar & Tasks
                  </p>
                </div>
              </div>
            }
          />

          <FeatureShowcase
            label="File Storage"
            title="Every receipt, photo, and contract — in one vault."
            description="Upload and organise documents directly against each lead or job. Searchable, secure, always there when you need them."
            icon={FolderOpen}
            features={[
              'Site photos — snap and upload directly from your phone',
              'Receipts & invoices — attach costs to the right job instantly',
              'Drawings & plans — store architect drawings alongside project data',
              'Contracts — keep signed documents secure and accessible',
            ]}
            image={
              <div className="bg-primary-100 rounded-2xl border border-primary-200 p-8 aspect-[4/3] flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-2xl bg-accent-100 flex items-center justify-center mx-auto mb-4">
                    <FolderOpen className="text-accent-700" size={40} />
                  </div>
                  <p className="font-sans text-primary-400" style={{ fontSize: '0.9rem' }}>
                    File Vault
                  </p>
                </div>
              </div>
            }
          />
        </div>
      </section>

      <section className="bg-primary-50 py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <SectionLabel className="text-center">One Platform</SectionLabel>
          <h2 className="font-display font-bold text-primary-900 text-h2 mt-2 mb-6">
            One platform. Zero apps. Everything connected.
          </h2>
          <p className="font-sans text-primary-500 leading-relaxed mb-10" style={{ fontSize: '1.05rem' }}>
            From the first planning application to the signed contract — PlanningIndex handles every step of the process so you can focus on the work, not the admin.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
            {[
              { icon: Map, label: 'Map View' },
              { icon: LayoutGrid, label: 'Grid View' },
              { icon: Filter, label: 'Smart Filters' },
              { icon: Users, label: 'Lead Pipeline' },
              { icon: FileText, label: 'Proposals' },
              { icon: Mail, label: 'Mail Sending' },
              { icon: Calendar, label: 'Calendar' },
              { icon: FolderOpen, label: 'File Storage' },
              { icon: CheckCircle2, label: 'Job Tracking' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2.5 bg-white rounded-lg border border-primary-200 px-4 py-3">
                <item.icon className="text-accent-600" size={18} />
                <span className="font-sans font-medium text-primary-700 text-sm">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

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
