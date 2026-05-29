'use client';

import { useState } from 'react';
import Link from 'next/link';
import { articles } from '@/lib/content/articles';
import { Calendar } from 'lucide-react';
import NewsletterSignup from '@/components/ui/NewsletterSignup';

const categories = ['All Topics', 'Legal', 'Financial'];

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState('All Topics');

  const filteredArticles = selectedCategory === 'All Topics'
    ? articles
    : articles.filter(a => a.category === selectedCategory);

  return (
    <div className="min-h-screen bg-off-white">
      {/* Simple Header - matching About page style */}
      <section
        className="text-center px-6"
        style={{
          padding: '80px 0 72px',
          background: 'linear-gradient(135deg, #1B3F7A 0%, #2C68C4 100%)',
        }}
      >
        <div className="mx-auto" style={{ maxWidth: 800 }}>
          <span
            className="font-inter font-semibold uppercase block"
            style={{
              fontSize: '0.75rem',
              letterSpacing: '0.15em',
              color: 'rgba(255,255,255,0.7)',
              marginTop: '72px',
            }}
          >
            Business Resources
          </span>
          <h1
            className="font-inter font-extrabold text-white mt-3"
            style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', lineHeight: 1.2 }}
          >
            Expert Guides for UK Sole Traders
          </h1>
          <p
            className="font-inter font-normal mx-auto mt-4 leading-[1.7]"
            style={{
              fontSize: '1.05rem',
              color: 'rgba(255,255,255,0.85)',
              maxWidth: 620,
            }}
          >
            Practical advice, legal insights, and straightforward guides to help you build a professional, protected business.
          </p>
        </div>
      </section>

      {/* Category Filter - Simple pill buttons */}
      <div className="max-w-[1200px] mx-auto px-6 -mt-6 relative z-10">
        <div className="bg-white rounded-lg border border-border p-1.5 inline-flex gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`font-inter font-medium text-sm px-5 py-2.5 rounded-md transition-colors ${
                selectedCategory === cat
                  ? 'bg-navy text-white'
                  : 'bg-transparent text-secondary-text hover:bg-gray-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Grid - Clean cards matching site style */}
      <div className="max-w-[1200px] mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => (
            <Link
              key={article.id}
              href={`/blog/${article.slug}`}
              className="group block"
            >
              <div className="bg-white rounded-lg border border-border overflow-hidden transition-shadow hover:shadow-md">
                {/* Article Image */}
                <div className="relative h-44 bg-gray-100">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="font-inter font-medium text-xs px-2.5 py-1 bg-white/90 rounded text-navy">
                      {article.category}
                    </span>
                  </div>
                </div>

                {/* Article Content */}
                <div className="p-5">
                  <div className="flex items-center gap-2 text-xs text-secondary-text mb-2">
                    <Calendar className="w-3.5 h-3.5" />
                    <span className="font-inter">
                      {new Date(article.date).toLocaleDateString('en-GB', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="text-gray-300 mx-1">|</span>
                    <span className="font-inter">{article.readTime} min read</span>
                  </div>

                  <h2 className="font-inter font-bold text-navy text-lg mb-2 line-clamp-2 leading-snug group-hover:text-medium-blue transition-colors">
                    {article.title}
                  </h2>

                  <p className="font-inter text-secondary-text text-sm line-clamp-2 leading-relaxed mb-3">
                    {article.description}
                  </p>

                  <span className="font-inter font-medium text-sm text-medium-blue group-hover:text-navy transition-colors">
                    Read article
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Results Count */}
        <p className="text-center text-secondary-text text-sm mt-10 font-inter">
          Showing {filteredArticles.length} of {articles.length} articles
        </p>

        {/* Newsletter Signup */}
        <div className="mt-16">
          <NewsletterSignup />
        </div>
      </div>

      {/* CTA Section - Simple, matching site style */}
      <div className="bg-navy py-16 px-6">
        <div className="max-w-[800px] mx-auto text-center">
          <h2 className="font-inter font-bold text-white mb-3" style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}>
            Ready to Get Your Documents Done?
          </h2>
          <p className="font-inter text-white/80 mb-8" style={{ fontSize: '1.05rem' }}>
            Skip the learning curve. Get professionally-written contracts, policies, and business foundations tailored to your UK business.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/checkout"
              className="font-inter font-semibold text-navy bg-white rounded-lg hover:bg-gray-50 transition-colors"
              style={{ padding: '14px 32px', fontSize: '1rem' }}
            >
              Get Your Pack — £79
            </Link>
            <Link
              href="/whats-included"
              className="font-inter font-semibold text-white border-2 border-white/30 rounded-lg hover:bg-white/10 transition-colors"
              style={{ padding: '12px 28px', fontSize: '1rem' }}
            >
              See What's Included
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
