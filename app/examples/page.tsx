import type { Metadata } from 'next';
import { Frame, Hammer, Home, Building2, Trees, Search, Target, Bookmark, FileText, Mail } from 'lucide-react';
import { JsonLd } from '@/components/seo';
import { SITE_URL, generateBreadcrumbSchema, generateWebPageSchema } from '@/lib/seo';
import { PageHero, DarkCTABanner, SectionLabel } from '@/components/ui';
import { ScenarioWalkthrough, type Scenario } from '@/components/marketing';

export const metadata: Metadata = {
  title: 'How It Works',
  description: 'See real-world examples of how UK tradespeople use PlanningIndex to find work from planning applications, manage leads, create proposals, and send them by post.',
  alternates: { canonical: `${SITE_URL}/examples` },
};

const scenarios: Scenario[] = [
  {
    trade: 'Window & Door Company',
    tradeIcon: Frame,
    applicationTitle: 'Replacement of 12 timber sash windows with double-glazed units',
    applicationRef: '24/01234/FUL',
    applicationAddress: '12 High Street, Amersham, HP6 5BA',
    steps: [
      { icon: Search, label: 'Search planning applications', detail: 'Search for "replacement windows" within 25 miles of your operating area.' },
      { icon: Target, label: 'Identify the opportunity', detail: 'PlanningIndex highlights 12 timber sash windows being replaced — a direct match for your trade.' },
      { icon: Bookmark, label: 'Add to leads', detail: 'Save the application as a new lead in your CRM with all the property details pre-filled.' },
      { icon: FileText, label: 'Create proposal', detail: 'Generate a professional proposal from the planning application data — scope, pricing, and terms.' },
      { icon: Mail, label: 'Send by post', detail: 'PlanningIndex prints and posts the proposal directly to the property. No envelopes, no post office trips.' },
    ],
    outcome: 'Your proposal arrives at the property door before the planning decision is even made — you are first in line for the work.',
  },
  {
    trade: 'Builder',
    tradeIcon: Hammer,
    applicationTitle: 'Single-storey rear extension and internal alterations',
    applicationRef: '24/01235/FUL',
    applicationAddress: '45 The Broadway, Rickmansworth, WD3 7AB',
    steps: [
      { icon: Search, label: 'Discover the application', detail: 'A new rear extension application appears in your saved search for "extension" within your area.' },
      { icon: Bookmark, label: 'Create a lead', detail: 'Add the application to your CRM pipeline as a new lead with the property address and project details.' },
      { icon: Target, label: 'Review the details', detail: 'Open the application to see the full description, documents, and site location plan.' },
      { icon: FileText, label: 'Schedule a follow-up', detail: 'Set a follow-up reminder in your CRM to contact the homeowner once the application is validated.' },
      { icon: Mail, label: 'Send proposal', detail: 'When the time is right, create and post a professional proposal for the extension work.' },
    ],
    outcome: 'You are tracking the project from planning application to construction start, with every detail organised in one place.',
  },
  {
    trade: 'Roofing Company',
    tradeIcon: Home,
    applicationTitle: 'Replacement of existing roof covering and installation of two dormer windows',
    applicationRef: '24/01238/FUL',
    applicationAddress: '22 Station Road, Chesham, HP5 1AB',
    steps: [
      { icon: Search, label: 'Search by keyword', detail: 'Search for "roof replacement" and "dormer" across your target councils.' },
      { icon: Target, label: 'Identify the scope', detail: 'PlanningIndex shows 120m² of roof covering replacement plus two new dormers — a substantial roofing project.' },
      { icon: Bookmark, label: 'Add to leads', detail: 'Save the application as a lead with the estimated roof area and dormer count noted.' },
      { icon: FileText, label: 'Create proposal from template', detail: 'Use your roofing proposal template — the property and project details auto-populate from the application.' },
      { icon: Mail, label: 'Send by post', detail: 'Post the proposal directly to the property. Track delivery status in your pipeline.' },
    ],
    outcome: 'A complete roofing proposal is delivered to the homeowner before any competitor even knows the application exists.',
  },
  {
    trade: 'Extension Contractor',
    tradeIcon: Building2,
    applicationTitle: 'Single-storey wraparound extension with bi-fold doors',
    applicationRef: '24/01245/FUL',
    applicationAddress: '17 Victoria Road, Chorleywood, WD3 5AB',
    steps: [
      { icon: Search, label: 'Search for extensions', detail: 'Filter for "wraparound" and "bi-fold" within your operating region to find specialist extension projects.' },
      { icon: Target, label: 'Assess the project', detail: 'A 32m² wraparound with aluminium bi-fold doors — exactly the type of project your team specialises in.' },
      { icon: Bookmark, label: 'Add to pipeline', detail: 'Move the application straight into your CRM pipeline at the "New Lead" stage.' },
      { icon: FileText, label: 'Generate proposal', detail: 'Create a detailed proposal with scope of works, materials, and pricing — all linked to the planning reference.' },
      { icon: Mail, label: 'Send by post', detail: 'Print and post the proposal to the property in one click. Delivery is tracked to the door.' },
    ],
    outcome: 'You have a professional proposal in the homeowner\'s hands at the earliest possible stage of their project.',
  },
  {
    trade: 'Landscaper',
    tradeIcon: Trees,
    applicationTitle: 'Construction of garden room and landscaping works including new patio and retaining wall',
    applicationRef: '24/01255/FUL',
    applicationAddress: '31 Hill Road, Chalfont St Peter, SL9 9AB',
    steps: [
      { icon: Search, label: 'Search for landscaping work', detail: 'Search for "garden room", "patio", and "landscaping" across your local councils.' },
      { icon: Target, label: 'Identify the opportunity', detail: 'A 12m² garden room plus 28m² of Indian sandstone patio and sleeper retaining wall — a full landscaping package.' },
      { icon: Bookmark, label: 'Create a lead', detail: 'Save the application as a lead with the garden room and patio details noted for your proposal.' },
      { icon: FileText, label: 'Build the proposal', detail: 'Create a proposal covering the garden room construction, patio installation, and retaining wall work.' },
      { icon: Mail, label: 'Post the proposal', detail: 'Send the proposal by post — printed, delivered, and tracked to the property door.' },
    ],
    outcome: 'You are the first landscaper to reach this homeowner with a professional proposal for their approved project.',
  },
];

export default function ExamplesPage() {
  const breadcrumbs = generateBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'How It Works', path: '/examples' },
  ]);

  const webPage = generateWebPageSchema({
    name: 'How It Works | PlanningIndex',
    description: 'See real-world examples of how UK tradespeople use PlanningIndex to find and win work.',
    path: '/examples',
  });

  return (
    <>
      <JsonLd data={[breadcrumbs, webPage]} />
      <PageHero
        eyebrow="How It Works"
        title="From planning application to paying job."
        subtitle="See exactly how UK tradespeople use PlanningIndex to find opportunities, manage leads, and send professional proposals by post — all from one platform."
      />

      {/* Scenarios */}
      <section className="bg-white py-24 px-6">
        <div className="max-w-page mx-auto space-y-24">
          {scenarios.map((scenario, index) => (
            <div key={scenario.applicationRef}>
              <div className="mb-10 max-w-2xl">
                <SectionLabel>Scenario {String(index + 1).padStart(2, '0')}</SectionLabel>
                <h2 className="font-display font-bold text-primary-900 text-h2 mt-2">
                  {scenario.trade}
                </h2>
              </div>
              <ScenarioWalkthrough scenario={scenario} index={index} />
            </div>
          ))}
        </div>
      </section>

      {/* Summary workflow */}
      <section className="bg-primary-50 py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <SectionLabel className="text-center">The core workflow</SectionLabel>
          <h2 className="font-display font-bold text-primary-900 text-h2 mt-2 mb-6">
            Every scenario follows the same path.
          </h2>
          <p className="font-sans text-primary-500 leading-relaxed mb-12" style={{ fontSize: '1.05rem' }}>
            Whatever your trade, PlanningIndex takes you from the first planning application to a posted proposal in a few focused steps. No spreadsheets. No council website searches. No trips to the post office.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 text-sm font-sans font-semibold text-primary-700">
            {['Search', 'Identify', 'Add Lead', 'Create Proposal', 'Send by Post', 'Win Work'].map((step, i, arr) => (
              <div key={step} className="flex items-center gap-3">
                <span className="inline-flex items-center rounded-lg border border-primary-200 bg-white px-4 py-2.5">
                  {step}
                </span>
                {i < arr.length - 1 && <span className="text-primary-300">→</span>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <DarkCTABanner
        title="Put these workflows into practice."
        subtitle="Start your free trial and get instant access to every planning application in the UK."
        ctaLabel="Start Free Trial"
        ctaHref="/login"
        note="14-day free trial · No commitment · Full access"
      />
    </>
  );
}
