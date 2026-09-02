'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowRight, Clock } from 'lucide-react';
import { DarkCTABanner, SectionLabel, Badge } from '@/components/ui';
import { blogPosts, getBlogCategories, getFeaturedBlogPost } from '@/lib/blog';

export default function BlogListContent() {
  const [activeCategory, setActiveCategory] = useState('All');
  const categories = getBlogCategories();
  const featuredPost = getFeaturedBlogPost();

  const filteredPosts = useMemo(() => {
    if (activeCategory === 'All') return blogPosts.filter((p) => p.slug !== featuredPost.slug);
    return blogPosts.filter((p) => p.slug !== featuredPost.slug && p.category === activeCategory);
  }, [activeCategory, featuredPost.slug]);

  return (
    <>
      <section className="bg-white py-16 px-6 border-b border-primary-100">
        <div className="max-w-page mx-auto">
          <SectionLabel>Featured Article</SectionLabel>
          <Link href={`/blog/${featuredPost.slug}`} className="group block">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="relative overflow-hidden rounded-2xl border border-primary-200 bg-primary-100 h-64 lg:h-80">
                <img
                  src={featuredPost.image}
                  alt={featuredPost.imageAlt}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
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
                    <img
                      src={post.image}
                      alt={post.imageAlt}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
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
              <p className="font-sans text-primary-400">No articles in this category yet. Check back soon.</p>
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
