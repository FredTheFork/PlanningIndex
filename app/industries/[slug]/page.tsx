import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, MapPin, FileText, Check, Target } from 'lucide-react';
import { JsonLd } from '@/components/seo';
import { SITE_URL, generateBreadcrumbSchema, generateWebPageSchema } from '@/lib/seo';
import { PageHero, DarkCTABanner, SectionLabel, Card, Badge } from '@/components/ui';
import { industries, getIndustryBySlug } from '@/lib/industries';

interface PageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return industries.map((industry) => ({ slug: industry.slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const industry = getIndustryBySlug(params.slug);
  if (!industry) {
    return {
      title: 'Industry Not Found',
      robots: { index: false, follow: false },
    };
  }

  return {
    title: industry.seoTitle,
    description: industry.seoDescription,
    alternates: { canonical: `${SITE_URL}/industries/${industry.slug}` },
  };
}

export default function IndustryPage({ params }: PageProps) {
  const industry = getIndustryBySlug(params.slug);
  if (!industry) notFound();

  const Icon = industry.icon;

  const breadcrumbs = generateBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Industries', path: '/industries' },
    { name: industry.shortName, path: `/industries/${industry.slug}` },
  ]);

  const webPage = generateWebPageSchema({
    name: `${industry.seoTitle} | PlanningIndex`,
    description: industry.seoDescription,
    path: `/industries/${industry.slug}`,
  });

  return (
    <>
      <JsonLd data={[breadcrumbs, webPage]} />
      <PageHero
        eyebrow={industry.shortName}
        title={industry.description}
        subtitle={`PlanningIndex helps ${industry.name.toLowerCase()} find relevant projects from UK planning applications — before the competition even knows they exist.`}
        ctaLabel="Start Free Trial"
        ctaHref="/login"
      />

      {/* How it works for this trade */}
      <section className="bg-white py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <SectionLabel>How PlanningIndex works for {industry.shortName}</SectionLabel>
            <h2 className="font-display font-bold text-primary-900 text-h2 mt-2">
              {industry.name} find work through planning applications.
            </h2>
            <p className="font-sans text-primary-500 mt-4 leading-relaxed" style={{ fontSize: '1.05rem' }}>
              Every planning application signals upcoming work. Here are the types of projects {industry.shortName.toLowerCase()} can find and win through PlanningIndex.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {industry.useCases.map((useCase, index) => (
              <Card key={useCase.title} variant="bordered" className="h-full">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-900 text-white shrink-0">
                    <span className="font-mono text-xs font-bold">{String(index + 1).padStart(2, '0')}</span>
                  </div>
                  <div>
                    <h3 className="font-sans font-semibold text-primary-900 text-base mb-1.5">
                      {useCase.title}
                    </h3>
                    <p className="font-sans text-primary-500 text-sm leading-relaxed">
                      {useCase.description}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* What to search for */}
      <section className="bg-primary-50 py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <SectionLabel>What to search for</SectionLabel>
          <h2 className="font-display font-bold text-primary-900 text-h2 mt-2 mb-6">
            Keywords that find {industry.shortName.toLowerCase()} work.
          </h2>
          <p className="font-sans text-primary-500 mb-8 leading-relaxed" style={{ fontSize: '1.05rem' }}>
            Use these keywords in PlanningIndex search to find planning applications relevant to your trade. Save your searches and get daily updates as new applications are submitted.
          </p>
          <div className="flex flex-wrap gap-2.5">
            {industry.keywords.map((keyword) => (
              <span
                key={keyword}
                className="inline-flex items-center gap-1.5 rounded-lg border border-primary-200 bg-white px-3.5 py-2 font-sans text-sm font-medium text-primary-700"
              >
                <Check size={14} className="text-emerald-600" />
                {keyword}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Real example */}
      <section className="bg-white py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <SectionLabel>Real example</SectionLabel>
          <h2 className="font-display font-bold text-primary-900 text-h2 mt-2 mb-6">
            A {industry.shortName.toLowerCase()} opportunity, found on PlanningIndex.
          </h2>
          <p className="font-sans text-primary-500 mb-10 leading-relaxed" style={{ fontSize: '1.05rem' }}>
            Here is an example of a real planning application that {industry.shortName.toLowerCase()} would find on PlanningIndex. The highlighted information shows exactly what work is being proposed.
          </p>

          <Card variant="bordered" className="overflow-hidden">
            {/* Application header */}
            <div className="border-b border-primary-100 p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h3 className="font-sans font-semibold text-primary-900 text-lg mb-1">
                    {industry.example.title}
                  </h3>
                  <p className="font-mono text-sm text-primary-400">{industry.example.reference}</p>
                </div>
                <Badge variant={industry.example.status === 'Approved' ? 'success' : 'warning'}>
                  {industry.example.status}
                </Badge>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-primary-500">
                <MapPin size={14} className="shrink-0" />
                {industry.example.address}
              </div>
            </div>

            {/* Application details */}
            <div className="grid grid-cols-2 gap-px bg-primary-100 border-b border-primary-100">
              <div className="bg-white p-4">
                <p className="text-label text-primary-400 mb-1">Council</p>
                <p className="font-sans text-sm font-medium text-primary-800">{industry.example.council}</p>
              </div>
              <div className="bg-white p-4">
                <p className="text-label text-primary-400 mb-1">Received</p>
                <p className="font-sans text-sm font-medium text-primary-800">{industry.example.date}</p>
              </div>
            </div>

            {/* Description */}
            <div className="border-b border-primary-100 p-6">
              <p className="text-label text-primary-400 mb-2">Description</p>
              <p className="font-sans text-sm text-primary-600 leading-relaxed">
                {industry.example.description}
              </p>
            </div>

            {/* Highlights */}
            <div className="p-6 bg-primary-50/50">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-accent-100">
                  <Target size={14} className="text-accent-700" />
                </div>
                <p className="font-sans font-semibold text-primary-900 text-sm">Potential work identified</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {industry.example.highlights.map((highlight) => (
                  <div key={highlight.label} className="rounded-lg border border-primary-200 bg-white p-3">
                    <p className="text-label text-primary-400 mb-1">{highlight.label}</p>
                    <p className="font-sans font-semibold text-primary-900 text-sm">{highlight.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 p-6 border-t border-primary-100">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-lg bg-primary-900 px-4 py-2.5 font-sans font-semibold text-sm text-white hover:bg-primary-800 transition-colors"
              >
                <FileText size={15} /> Add to Leads
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-lg border border-primary-300 bg-white px-4 py-2.5 font-sans font-semibold text-sm text-primary-700 hover:bg-primary-50 transition-colors"
              >
                Create Proposal
              </Link>
            </div>
          </Card>
        </div>
      </section>

      {/* Back link */}
      <section className="bg-primary-50 py-8 px-6 border-t border-primary-100">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/industries"
            className="inline-flex items-center gap-2 font-sans font-medium text-primary-500 hover:text-primary-900 transition-colors text-sm"
          >
            <ArrowLeft size={16} /> Back to all industries
          </Link>
        </div>
      </section>

      <DarkCTABanner
        title={`Start searching for ${industry.shortName.toLowerCase()} jobs today.`}
        subtitle="Start your free trial and get instant access to every planning application in the UK."
        ctaLabel="Start Free Trial"
        ctaHref="/login"
        note="14-day free trial · No commitment · Full access"
      />
    </>
  );
}
