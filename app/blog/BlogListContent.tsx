'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowRight, Clock, Search, X } from 'lucide-react';
import Image from 'next/image';
import { DarkCTABanner } from '@/components/ui/DarkCTABanner';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { Badge } from '@/components/ui/Badge';
import type { BlogPost } from '@/lib/blog';

interface BlogListContentProps {
  posts: BlogPost[];
}

export default function BlogListContent({ posts }: BlogListContentProps) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const categories = ['All', ...Array.from(new Set(posts.map((post) => post.category)))];
  const featuredPost = posts[0];

  const filteredPosts = useMemo(() => {
    let result = posts.filter((p) => p.slug !== featuredPost.slug);

    if (activeCategory !== 'All') {
      result = result.filter((p) => p.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }

    return result;
  }, [posts, activeCategory, searchQuery, featuredPost.slug]);

  return (
    <>
      <section className="bg-white py-16 px-6 border-b border-primary-100">
        <div className="max-w-page mx-auto">
          <SectionLabel>Featured Article</SectionLabel>
          <Link href={`/blog/${featuredPost.slug}`} className="group block">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="relative overflow-hidden rounded-2xl border border-primary-200 bg-primary-100 h-64 lg:h-80">
                <Image
                  src={featuredPost.image}
                  alt={featuredPost.imageAlt}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Badge variant="accent">{featuredPost.category}</Badge>
                  <span className="font-sans text-primary-400 text-sm">{featuredPost.displayDate}</span>
                  <span className="font-sans text-primary-300 text-sm">·</span>
                  <span className="inline-flex items-center gap-1 font-sans text-primary-400 text-sm">
                    <Clock size={13} /> {featuredPost.readTime}
                  </span>
                </div>
                <h2 className="font-display font-bold text-primary-900 text-h2 mb-4 group-hover:text-accent-700 transition-colors">
                  {featuredPost.title}
                </h2>
                <p className="font-sans text-primary-500 leading-relaxed mb-6" style={{ fontSize: '1.05rem' }}>
                  {featuredPost.excerpt}
                </p>
                <span className="inline-flex items-center gap-2 font-sans font-semibold text-accent-600 group-hover:text-accent-700 transition-colors text-sm">
                  Read article <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </div>
          </Link>
        </div>
      </section>

      <section className="bg-white py-20 px-6">
        <div className="max-w-page mx-auto">
          <div className="relative max-w-xl mb-8">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-400 pointer-events-none" />
            <input
              type="search"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-12 pr-10 py-3 border border-primary-300 rounded-xl shadow-sm placeholder:text-primary-400 focus:outline-none focus:ring-2 focus:ring-accent-500/40 focus:border-accent-500 font-sans text-sm text-primary-900 bg-white transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-primary-400 hover:text-primary-700 transition-colors"
                aria-label="Clear search"
              >
                <X size={18} />
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-lg px-4 py-2 font-sans text-sm font-semibold transition-colors ${
                  activeCategory === cat
                    ? 'bg-primary-900 text-white'
                    : 'bg-primary-100 text-primary-600 hover:bg-primary-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group block h-full">
                <div className="bg-white rounded-xl border border-primary-200 overflow-hidden transition-all duration-200 hover:shadow-card-hover h-full flex flex-col">
                  <div className="h-44 overflow-hidden bg-primary-100 relative">
                    <Image
                      src={post.image}
                      alt={post.imageAlt}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <Badge variant="accent">{post.category}</Badge>
                      <span className="font-sans text-primary-400 text-sm">{post.displayDate}</span>
                    </div>
                    <h3 className="font-sans font-semibold text-primary-900 text-base mb-2 group-hover:text-accent-700 transition-colors">
                      {post.title}
                    </h3>
                    <p className="font-sans text-primary-500 text-sm leading-relaxed line-clamp-2 mb-4 flex-1">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center gap-2 text-primary-400 text-sm">
                      <Clock size={13} /> {post.readTime}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-16">
              <p className="font-sans text-primary-400">
                {searchQuery.trim()
                  ? `No articles found for "${searchQuery}". Try a different search term.`
                  : 'No articles in this category yet. Check back soon.'}
              </p>
            </div>
          )}
        </div>
      </section>

      <DarkCTABanner
        title="Find your next job today."
        subtitle="Start your free trial and get instant access to every planning application in the UK."
        ctaLabel="Start Free Trial"
        ctaHref="/login"
        note="14-day free trial · No commitment · Full access"
      />
    </>
  );
}
