import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Clock } from 'lucide-react';
import { JsonLd } from '@/components/seo';
import { SITE_URL, generateBreadcrumbSchema, generateArticleSchema } from '@/lib/seo';
import { Breadcrumbs, DarkCTABanner, Badge } from '@/components/ui';
import { ArticleBody } from '@/components/marketing/ArticleBody';
import { ArticleFeedback } from '@/components/marketing/ArticleFeedback';
import { guides, getGuideBySlug, getAllGuideSlugs } from '@/lib/guides';

interface PageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return getAllGuideSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const guide = getGuideBySlug(params.slug);
  if (!guide) {
    return {
      title: 'Guide Not Found',
      robots: { index: false, follow: false },
    };
  }

  return {
    title: guide.title,
    description: guide.excerpt,
    alternates: { canonical: `${SITE_URL}/guides/${guide.slug}` },
    openGraph: {
      type: 'article',
      title: guide.title,
      description: guide.excerpt,
      url: `${SITE_URL}/guides/${guide.slug}`,
      authors: ['PlanningIndex Team'],
    },
    twitter: {
      card: 'summary_large_image',
      title: guide.title,
      description: guide.excerpt,
    },
  };
}

export default function GuideArticlePage({ params }: PageProps) {
  const guide = getGuideBySlug(params.slug);
  if (!guide) notFound();

  const breadcrumbs = generateBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Guides', path: '/guides' },
    { name: guide.title, path: `/guides/${guide.slug}` },
  ]);

  const article = generateArticleSchema({
    title: guide.title,
    description: guide.excerpt,
    path: `/guides/${guide.slug}`,
    author: 'PlanningIndex Team',
    datePublished: guide.date,
    section: guide.category,
  });

  return (
    <>
      <JsonLd data={[breadcrumbs, article]} />
      <article className="bg-white">
        <section className="bg-primary-900 text-white px-6 pt-32 pb-16">
          <div className="max-w-3xl mx-auto">
            <Breadcrumbs
              items={[
                { label: 'Home', href: '/' },
                { label: 'Guides', href: '/guides' },
                { label: guide.title },
              ]}
              className="mb-6"
            />
            <div className="flex items-center gap-3 mb-4">
              <Badge variant="accent">{guide.category}</Badge>
              <span className="font-sans text-white/60 text-sm">{guide.displayDate}</span>
              <span className="text-white/30">·</span>
              <span className="inline-flex items-center gap-1 font-sans text-white/60 text-sm">
                <Clock size={13} /> {guide.readTime}
              </span>
            </div>
            <h1 className="font-display font-bold text-white mb-4" style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', lineHeight: 1.2 }}>
              {guide.title}
            </h1>
            <p className="font-sans text-white/70 leading-relaxed" style={{ fontSize: '1.1rem' }}>
              {guide.excerpt}
            </p>
          </div>
        </section>

        <section className="py-16 px-6">
          <div className="max-w-3xl mx-auto">
            <Link href="/guides" className="inline-flex items-center gap-2 font-sans font-medium text-primary-500 hover:text-primary-900 transition-colors text-sm mb-8">
              <ArrowLeft size={16} /> Back to Guides
            </Link>

            <ArticleBody sections={guide.content} />

            <ArticleFeedback />
          </div>
        </section>

        <DarkCTABanner
          title="Put these guides into practice."
          subtitle="Start your free trial and get instant access to every planning application in the UK."
          ctaLabel="Start Free Trial"
          ctaHref="/login"
          note="14-day free trial · No commitment · Full access"
        />
      </article>
    </>
  );
}
