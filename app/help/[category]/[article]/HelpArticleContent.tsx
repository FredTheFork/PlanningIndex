'use client';

import Link from 'next/link';
import { ArrowLeft, ChevronRight, Mail } from 'lucide-react';
import { Breadcrumbs, DarkCTABanner } from '@/components/ui';
import { ArticleBody } from '@/components/marketing/ArticleBody';
import { ArticleFeedback } from '@/components/marketing/ArticleFeedback';
import type { HelpCategory, HelpArticle } from '@/lib/help';

interface HelpArticleContentProps {
  category: HelpCategory;
  article: HelpArticle;
  relatedArticles: HelpArticle[];
  allCategories: HelpCategory[];
}

export default function HelpArticleContent({
  category,
  article,
  relatedArticles,
  allCategories,
}: HelpArticleContentProps) {
  return (
    <>
      <div className="bg-primary-900 text-white px-6 pt-32 pb-12">
        <div className="max-w-3xl mx-auto">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Help Centre', href: '/help' },
              { label: category.name, href: `/help/${category.slug}` },
              { label: article.title },
            ]}
            className="mb-6"
          />
          <h1 className="font-display font-bold text-white" style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', lineHeight: 1.2 }}>
            {article.title}
          </h1>
          <p className="font-sans text-white/50 text-sm mt-2">
            Updated {article.lastUpdated}
          </p>
        </div>
      </div>

      <div className="max-w-page mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-12">
          {/* Main content */}
          <div className="max-w-3xl">
            <Link
              href={`/help/${category.slug}`}
              className="inline-flex items-center gap-2 font-sans font-medium text-primary-500 hover:text-primary-900 transition-colors text-sm mb-8"
            >
              <ArrowLeft size={16} /> Back to {category.name}
            </Link>

            <ArticleBody sections={article.content} />

            <ArticleFeedback />

            {/* Related articles */}
            {relatedArticles.length > 0 && (
              <div className="mt-12 pt-8 border-t border-primary-200">
                <h3 className="font-sans font-semibold text-primary-900 text-sm mb-4">Related articles</h3>
                <div className="space-y-2">
                  {relatedArticles.map((related) => (
                    <Link
                      key={related.slug}
                      href={`/help/${category.slug}/${related.slug}`}
                      className="group flex items-center justify-between gap-3 rounded-lg border border-primary-200 bg-white p-3.5 hover:border-primary-300 hover:shadow-card-hover transition-all duration-200"
                    >
                      <span className="font-sans font-medium text-primary-700 text-sm group-hover:text-accent-700 transition-colors">
                        {related.title}
                      </span>
                      <ChevronRight size={16} className="text-primary-300 group-hover:text-accent-600 transition-colors shrink-0" />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Contact support callout */}
            <div className="mt-8 p-5 rounded-xl bg-primary-50 border border-primary-100">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-100 shrink-0">
                  <Mail size={18} className="text-accent-700" />
                </div>
                <div>
                  <h3 className="font-sans font-semibold text-primary-900 text-sm mb-1">Need more help?</h3>
                  <p className="font-sans text-primary-500 text-sm leading-relaxed">
                    Can&apos;t find the answer you need?{' '}
                    <a href="/contact" className="font-semibold text-accent-600 hover:text-accent-700 transition-colors">
                      Contact our support team
                    </a>{' '}
                    and we&apos;ll respond within 24 hours.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-xl border border-primary-200 bg-white p-5">
              <h3 className="font-sans font-semibold text-primary-900 text-sm mb-4">
                {category.name}
              </h3>
              <div className="space-y-1">
                {category.articles.map((catArticle) => (
                  <Link
                    key={catArticle.slug}
                    href={catArticle.slug === article.slug ? '#' : `/help/${category.slug}/${catArticle.slug}`}
                    className={`flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                      catArticle.slug === article.slug
                        ? 'bg-primary-900 text-white font-semibold'
                        : 'text-primary-600 hover:bg-primary-50'
                    }`}
                  >
                    <span className="truncate">{catArticle.title}</span>
                  </Link>
                ))}
              </div>
              <div className="mt-5 pt-4 border-t border-primary-100">
                <Link
                  href="/help"
                  className="font-sans font-medium text-accent-600 hover:text-accent-700 transition-colors text-sm"
                >
                  ← Back to Help Centre
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <DarkCTABanner
        title="Still need help?"
        subtitle="Our support team is here to help. Get in touch and we'll respond within 24 hours."
        ctaLabel="Contact Support"
        ctaHref="/contact"
      />
    </>
  );
}
