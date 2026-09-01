import type { Metadata } from 'next';
import { Search, Map, Target, Users, FileText, ShieldCheck, CreditCard, CheckCircle2, LayoutGrid, Filter, Send, Mail, Calendar, FolderOpen, Check, ArrowRight } from 'lucide-react';
import { JsonLd } from '@/components/seo';
import { SITE_URL, generateBreadcrumbSchema, generateWebPageSchema } from '@/lib/seo';
import { PageHero, DarkCTABanner, SectionLabel } from '@/components/ui';
import {
  ProductShowcaseSection,
  PlanningSearchShowcase,
  CRMPipelineShowcase,
  ProposalShowcase,
  MapSearchShowcase,
  OpportunityDiscoveryShowcase,
  TeamShowcase,
  AccountShowcase,
} from '@/components/marketing';

export const metadata: Metadata = {
  title: 'Features',
  description: 'Everything you need to find, win, and manage construction work. Search planning applications, run your CRM pipeline, generate proposals, track costs, and stay organised.',
  alternates: { canonical: `${SITE_URL}/features` },
};

const capabilityNav = [
  { icon: Search, label: 'Planning Search' },
  { icon: Map, label: 'Geographic Search' },
  { icon: Target, label: 'Opportunity Discovery' },
  { icon: Users, label: 'CRM' },
  { icon: FileText, label: 'Proposals' },
  { icon: ShieldCheck, label: 'Team' },
  { icon: CreditCard, label: 'Account & Billing' },
];

const featurePoints = {
  planning: [
    'Nationwide UK coverage across every council',
    'Daily updates as new applications are submitted',
    'Keyword search across application descriptions',
    'Filter by date, application type, and status',
    'Save and revisit your most useful searches',
  ],
  geographic: [
    'Interactive map with pan and zoom',
    'Radius search from 1 to 100 miles',
    'Search by postcode, town, or council',
    'Visual geographic filtering with markers',
    'Switch between map and list views instantly',
  ],
  opportunity: [
    'Results ranked by trade relevance',
    'Highlights the specific work being proposed',
    'Identifies trade-relevant items automatically',
    'Spend time on applications that matter',
    'Add relevant results to your lead pipeline',
  ],
  crm: [
    'Drag-and-drop pipeline from New Lead to Won',
    'Track pipeline value and win rate',
    'Notes and follow-ups on every lead',
    'Contact information linked to applications',
    'Activity history and status tracking',
  ],
  proposals: [
    'Auto-populated from planning application data',
    'Editable work details and pricing',
    'Professional proposal templates',
    'Sent by physical post — printed and delivered',
    'Delivery tracking to the property door',
  ],
  team: [
    'Multiple users with role-based permissions',
    'Owner, Admin, Sales, Estimator, and Installer roles',
    'Shared leads across your company',
    'Collaboration on proposals and notes',
    'See who is working on what at a glance',
  ],
  account: [
    'Choose coverage from one council to nationwide',
    'Upgrade, downgrade, or cancel anytime',
    'Company profile auto-populates into proposals',
    'Manage council and region access',
    'Subscription and billing in one place',
  ],
};

function FeatureList({ items }: { items: string[] }) {
  return (
    <ul className="mt-8 space-y-3">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3">
          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100">
            <Check size={12} className="text-emerald-600" />
          </span>
          <span className="text-sm leading-6 text-slate-600">{item}</span>
        </li>
      ))}
    </ul>
  );
}

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

      {/* Capability navigation */}
      <section className="bg-white py-20 px-6 border-b border-slate-100">
        <div className="max-w-page mx-auto">
          <div className="mx-auto max-w-2xl text-center mb-14">
            <SectionLabel className="text-center">Seven capabilities. One platform.</SectionLabel>
            <h2 className="font-display text-4xl font-bold leading-[1.08] tracking-[-0.04em] text-primary-900 sm:text-5xl">
              From search to signed contract.
            </h2>
            <p className="mt-5 text-base leading-7 text-slate-600">
              Every part of PlanningIndex is designed to move you forward — from discovering a planning application to delivering a physical proposal to the property door.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {capabilityNav.map((item) => (
              <a
                key={item.label}
                href={`#${item.label.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and').replace(/-/g, '-')}`}
                className="group flex flex-col items-center gap-3 text-center rounded-xl border border-slate-200 bg-white p-4 hover:border-slate-300 hover:shadow-card-hover transition-all duration-200"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-900 text-white group-hover:bg-accent-600 transition-colors duration-200">
                  <item.icon size={20} />
                </div>
                <span className="font-sans text-xs font-semibold text-primary-700">{item.label}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 1. Planning Search */}
      <ProductShowcaseSection
        id="planning-search"
        label="Planning Search"
        title="Search every UK planning application from one place."
        description="Nationwide coverage, updated daily. Filter by keyword, location, radius, application type, status, date, and council to find the exact projects that match your trade."
      >
        <PlanningSearchShowcase />
        <FeatureList items={featurePoints.planning} />
      </ProductShowcaseSection>

      {/* 2. Geographic Search */}
      <ProductShowcaseSection
        id="geographic-search"
        label="Geographic Search"
        title="See opportunities where they actually are."
        description="Interactive map with radius search from 1 to 100 miles. Search by postcode, town, or council. Pan, zoom, and click markers to inspect applications geographically — no more guessing which council website to check."
        reverse
        className="bg-[#f7f9fc]"
      >
        <MapSearchShowcase />
        <FeatureList items={featurePoints.geographic} />
      </ProductShowcaseSection>

      {/* 3. Opportunity Discovery */}
      <ProductShowcaseSection
        id="opportunity-discovery"
        label="Opportunity Discovery"
        title="Find the work that matches your trade."
        description="Not every application is relevant to you. PlanningIndex ranks results by trade relevance and highlights the specific work being proposed — so you spend time on applications that actually matter to your business."
      >
        <OpportunityDiscoveryShowcase />
        <FeatureList items={featurePoints.opportunity} />
      </ProductShowcaseSection>

      {/* 4. CRM */}
      <ProductShowcaseSection
        id="crm"
        label="CRM"
        title="Turn planning data into a managed pipeline."
        description="Drag cards from New Lead to Won. Track pipeline value and win rate at every stage. Keep every conversation, note, and follow-up connected to the right application. No more spreadsheets and sticky notes."
        reverse
        className="bg-[#f7f9fc]"
      >
        <CRMPipelineShowcase />
        <FeatureList items={featurePoints.crm} />
      </ProductShowcaseSection>

      {/* 5. Proposals */}
      <ProductShowcaseSection
        id="proposals"
        label="Professional Proposals"
        title="Professional proposals, sent by post."
        description="Auto-populate proposals from planning application data. Edit, preview, and send by physical post — printed, delivered, and tracked to the property door. No more printing, stuffing envelopes, or trips to the post office."
      >
        <ProposalShowcase />
        <FeatureList items={featurePoints.proposals} />
      </ProductShowcaseSection>

      {/* 6. Team */}
      <ProductShowcaseSection
        id="team"
        label="Team"
        title="Your whole team, working from the same data."
        description="Multiple users with role-based permissions. Share leads, proposals, and notes across your company. Owner, Admin, Sales, Estimator, Installer — everyone sees what they need, nothing they shouldn't."
        reverse
        className="bg-[#f7f9fc]"
      >
        <TeamShowcase />
        <FeatureList items={featurePoints.team} />
      </ProductShowcaseSection>

      {/* 7. Account & Billing */}
      <ProductShowcaseSection
        id="account-and-billing"
        label="Account & Billing"
        title="Manage your membership, your way."
        description="Choose your coverage — from a single council to the whole country. Upgrade, downgrade, or cancel anytime. Your company profile auto-populates into every proposal you send."
      >
        <AccountShowcase />
        <FeatureList items={featurePoints.account} />
      </ProductShowcaseSection>

      {/* Capabilities grid */}
      <section className="bg-primary-50 py-24 px-6">
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
              <div key={item.label} className="flex items-center gap-2.5 bg-white rounded-lg border border-primary-200 px-4 py-3 hover:border-primary-300 hover:shadow-card-hover transition-all duration-200">
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
