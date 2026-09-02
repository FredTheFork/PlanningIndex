'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, ChevronRight } from 'lucide-react';
import { DarkCTABanner } from '@/components/ui';
import type { HelpCategory, HelpArticle } from '@/lib/help';

interface HelpCategoryContentProps {
  category: HelpCategory;
  allCategories: HelpCategory[];
}

export default function HelpCategoryContent({ category, allCategories }: HelpCategoryContentProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredArticles = useMemo(() => {
    if (!searchQuery.trim()) return category.articles;
    const query = searchQuery.toLowerCase();
    return category.articles.filter(
      (article) =>
        article.title.toLowerCase().includes(query) ||
        article.excerpt.toLowerCase().includes(query)
    );
  }, [searchQuery, category.articles]);

  return (
    <>
      <div className="max-w-page mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-12">
          {/* Main content */}
          <div>
            {/* Search */}
            <div className="relative mb-8">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-400 pointer-events-none" />
              <input
                type="search"
                placeholder={`Search in ${category.name}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-12 pr-4 py-3 border border-primary-300 rounded-xl shadow-sm placeholder:text-primary-400 focus:outline-none focus:ring-2 focus:ring-accent-500/40 focus:border-accent-500 font-sans text-sm text-primary-900 bg-white"
              />
            </div>

            {/* Article list */}
            {filteredArticles.length > 0 ? (
              <div className="space-y-3">
                {filteredArticles.map((article) => (
                  <Link
                    key={article.slug}
                    href={`/help/${category.slug}/${article.slug}`}
                    className="group block rounded-xl border border-primary-200 bg-white p-5 hover:border-primary-300 hover:shadow-card-hover transition-all duration-200"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-sans font-semibold text-primary-900 text-base group-hover:text-accent-700 transition-colors">
                          {article.title}
                        </h3>
                        <p className="font-sans text-primary-500 text-sm leading-relaxed mt-1.5">
                          {article.excerpt}
                        </p>
                        <p className="font-sans text-primary-400 text-xs mt-3">
                          Updated {article.lastUpdated}
                        </p>
                      </div>
                      <ChevronRight size={18} className="text-primary-300 group-hover:text-accent-600 transition-colors shrink-0 mt-1" />
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="font-sans text-primary-400">No articles found. Try a different search term.</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-xl border border-primary-200 bg-white p-5">
              <h3 className="font-sans font-semibold text-primary-900 text-sm mb-4">All categories</h3>
              <div className="space-y-1">
                {allCategories.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={cat.slug === category.slug ? '#' : `/help/${cat.slug}`}
                    className={`flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                      cat.slug === category.slug
                        ? 'bg-primary-900 text-white font-semibold'
                        : 'text-primary-600 hover:bg-primary-50'
                    }`}
                  >
                    <span className="truncate">{cat.name}</span>
                    <span className={`text-xs shrink-0 ${cat.slug === category.slug ? 'text-white/60' : 'text-primary-300'}`}>
                      {cat.articles.length}
                    </span>
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
