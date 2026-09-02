'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, ChevronRight } from 'lucide-react';
import { DarkCTABanner, Card } from '@/components/ui';
import { helpCategories, getPopularHelpArticles } from '@/lib/help';

export default function HelpHomeContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const popularArticles = getPopularHelpArticles(6);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return helpCategories.flatMap((cat) =>
      cat.articles
        .filter(
          (article) =>
            article.title.toLowerCase().includes(query) ||
            article.excerpt.toLowerCase().includes(query) ||
            article.category.toLowerCase().includes(query)
        )
        .map((article) => ({ ...article, categorySlug: cat.slug }))
    );
  }, [searchQuery]);

  return (
    <>
      <section className="bg-white py-16 px-6 border-b border-primary-100">
        <div className="max-w-3xl mx-auto">
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-400 pointer-events-none" />
            <input
              type="search"
              placeholder="Search for help articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-12 pr-4 py-3.5 border border-primary-300 rounded-xl shadow-sm placeholder:text-primary-400 focus:outline-none focus:ring-2 focus:ring-accent-500/40 focus:border-accent-500 font-sans text-sm text-primary-900 bg-white"
            />
          </div>

          {searchQuery.trim() && (
            <div className="mt-4 bg-white rounded-xl border border-primary-200 overflow-hidden">
              {searchResults.length > 0 ? (
                <div className="divide-y divide-primary-100">
                  {searchResults.slice(0, 8).map((article) => (
                    <Link
                      key={`${article.categorySlug}/${article.slug}`}
                      href={`/help/${article.categorySlug}/${article.slug}`}
                      className="flex items-center justify-between gap-3 px-5 py-3.5 hover:bg-primary-50 transition-colors"
                    >
                      <div className="min-w-0">
                        <p className="font-sans font-semibold text-primary-900 text-sm truncate">{article.title}</p>
                        <p className="font-sans text-primary-400 text-xs mt-0.5">{article.category}</p>
                      </div>
                      <ChevronRight size={16} className="text-primary-300 shrink-0" />
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="px-5 py-6 text-center">
                  <p className="font-sans text-primary-400 text-sm">No articles found. Try a different search term.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Popular articles */}
      {!searchQuery.trim() && (
        <section className="bg-white py-16 px-6 border-b border-primary-100">
          <div className="max-w-page mx-auto">
            <h2 className="font-display font-bold text-primary-900 text-h3 mb-8">Popular articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {popularArticles.map((article) => (
                <Link
                  key={`${article.categorySlug}/${article.slug}`}
                  href={`/help/${article.categorySlug}/${article.slug}`}
                  className="group flex items-center justify-between gap-3 rounded-xl border border-primary-200 bg-white p-4 hover:border-primary-300 hover:shadow-card-hover transition-all duration-200"
                >
                  <div className="min-w-0">
                    <p className="font-sans font-semibold text-primary-900 text-sm group-hover:text-accent-700 transition-colors">
                      {article.title}
                    </p>
                    <p className="font-sans text-primary-400 text-xs mt-1">{article.category}</p>
                  </div>
                  <ChevronRight size={16} className="text-primary-300 group-hover:text-accent-600 transition-colors shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Categories */}
      {!searchQuery.trim() && (
        <section className="bg-white py-20 px-6">
          <div className="max-w-page mx-auto">
            <h2 className="font-display font-bold text-primary-900 text-h3 mb-8">Browse by category</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {helpCategories.map((category) => (
                <Link key={category.slug} href={`/help/${category.slug}`} className="group block h-full">
                  <Card variant="raised" className="h-full">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <h3 className="font-sans font-semibold text-primary-900 text-base group-hover:text-accent-700 transition-colors mb-1.5">
                          {category.name}
                        </h3>
                        <p className="font-sans text-primary-500 text-sm leading-relaxed mb-3">
                          {category.description}
                        </p>
                        <span className="font-sans text-primary-400 text-xs">
                          {category.articles.length} articles
                        </span>
                      </div>
                      <ChevronRight size={18} className="text-primary-300 group-hover:text-accent-600 transition-colors shrink-0" />
                    </div>
                  </Card>
                </Link>
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
      )}

      <DarkCTABanner
        title="Still need help?"
        subtitle="Our support team is here to help. Get in touch and we'll respond within 24 hours."
        ctaLabel="Contact Support"
        ctaHref="/contact"
      />
    </>
  );
}
