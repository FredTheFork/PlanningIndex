'use client';

import { useState } from 'react';
import Link from 'next/link';
import { articles } from '@/lib/content/articles';
import { Calendar, User } from 'lucide-react';

const categories = ['All Topics', 'Legal', 'Financial'];

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState('All Topics');

  const filteredArticles = selectedCategory === 'All Topics'
    ? articles
    : articles.filter(a => a.category === selectedCategory);

  return (
    <div className="min-h-screen bg-[#FAFBFC]">
      {/* Premium Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#1B3F7A] via-[#2C68C4] to-[#1B3F7A]">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)',
            backgroundSize: '30px 30px'
          }}></div>
        </div>

        <div className="relative max-w-[1200px] mx-auto px-6 py-20 md:py-28">
          <div className="text-center">
            <span className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-xs font-semibold text-white uppercase tracking-wider mb-6">
              Business Resources
            </span>
            <h1 className="font-bold text-white mb-6 leading-tight" style={{
              fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
              letterSpacing: '-0.02em'
            }}>
              Expert Guides for<br />UK Sole Traders
            </h1>
            <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              Practical advice, legal insights, and straightforward guides to help you build a professional, protected business.
            </p>
          </div>
        </div>

        {/* Decorative wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#FAFBFC"/>
          </svg>
        </div>
      </div>

      {/* Category Filter */}
      <div className="max-w-[1200px] mx-auto px-6 -mt-8 relative z-10">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-2 inline-flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-3 rounded-xl font-medium text-sm transition-all ${
                selectedCategory === cat
                  ? 'bg-[#1B3F7A] text-white shadow-md'
                  : 'bg-transparent text-gray-600 hover:bg-gray-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Grid */}
      <div className="max-w-[1200px] mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.map((article, index) => (
            <Link
              key={article.id}
              href={`/blog/${article.slug}`}
              className="group relative"
            >
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200 transition-all duration-300 hover:shadow-xl hover:border-[#2C68C4]/30 hover:-translate-y-1">
                {/* Article Image/Icon Area */}
                <div className="relative h-52 bg-gradient-to-br from-[#1B3F7A] to-[#2C68C4] flex items-center justify-center overflow-hidden">
                  <div className="text-7xl filter drop-shadow-lg transform transition-transform duration-300 group-hover:scale-110">
                    {article.image}
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1.5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-xs font-semibold text-white uppercase tracking-wide">
                      {article.category}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1.5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-xs font-medium text-white">
                      {article.readTime} min read
                    </span>
                  </div>
                </div>

                {/* Article Content */}
                <div className="p-6">
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{new Date(article.date).toLocaleDateString('en-GB', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>

                  <h2 className="font-bold text-gray-900 mb-3 line-clamp-2 leading-snug transition-colors group-hover:text-[#2C68C4]" style={{ fontSize: '1.15rem' }}>
                    {article.title}
                  </h2>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                    {article.description}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <User className="w-3.5 h-3.5" />
                      <span>Foundationary</span>
                    </div>
                    <span className="text-[#2C68C4] font-semibold text-sm group-hover:text-[#1B3F7A] transition-colors flex items-center gap-1">
                      Read More
                      <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>

              {/* Featured Badge for First Article */}
              {index === 0 && (
                <div className="absolute -top-3 -right-3">
                  <div className="bg-gradient-to-r from-[#1B3F7A] to-[#2C68C4] text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg">
                    Featured
                  </div>
                </div>
              )}
            </Link>
          ))}
        </div>

        {/* Results Count */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          Showing {filteredArticles.length} of {articles.length} articles
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-[#1B3F7A] via-[#2C68C4] to-[#1B3F7A] relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div className="relative max-w-[1200px] mx-auto px-6 py-20 text-center">
          <h2 className="font-bold text-white mb-4" style={{ fontSize: 'clamp(2rem, 3vw, 2.5rem)' }}>
            Ready to Get Your Documents Done?
          </h2>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            Skip the learning curve. Get professionally-written contracts, policies, and business foundations tailored to your UK business—delivered in 24 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/pricing"
              className="px-8 py-4 bg-white text-[#1B3F7A] font-bold rounded-xl hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              style={{ fontSize: '1.05rem' }}
            >
              Get Your Pack for £79
            </Link>
            <Link
              href="/whats-included"
              className="px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white font-bold rounded-xl hover:bg-white/20 transition-all"
              style={{ fontSize: '1.05rem' }}
            >
              See What's Included
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
