import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react';
import { getArticleBySlug, getRelatedArticles, articles } from '@/lib/content/articles';
import { JsonLd } from '@/components/seo';
import { generateArticleSchema, generateBreadcrumbSchema, SITE_URL } from '@/lib/seo';

export async function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const article = getArticleBySlug(params.slug);

  if (!article) {
    return {
      title: 'Article Not Found',
      description: 'The requested article could not be found.',
    };
  }

  const url = `${SITE_URL}/blog/${article.slug}`;

  return {
    title: `${article.title} | Foundationary Blog`,
    description: article.description,
    keywords: article.keywords,
    authors: [{ name: 'Foundationary' }],

    openGraph: {
      type: 'article',
      url,
      title: article.title,
      description: article.description,
      siteName: 'Foundationary',
      locale: 'en_GB',
      publishedTime: article.date,
      modifiedTime: article.date,
      authors: ['Foundationary'],
      section: article.category,
      tags: article.keywords?.split(',').map(k => k.trim()) || [],
      images: [{ url: `${SITE_URL}/og/articles/${article.slug}.png`, width: 1200, height: 630 }],
    },

    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.description,
      creator: '@Foundationary',
      images: [`${SITE_URL}/og/articles/${article.slug}.png`],
    },

    alternates: {
      canonical: url,
    },

    robots: {
      index: true,
      follow: true,
    },

    other: {
      'article:published_time': article.date,
      'article:author': 'Foundationary',
      'article:section': article.category,
    },
  };
}

export default function BlogArticlePage({ params }: { params: { slug: string } }) {
  const article = getArticleBySlug(params.slug);
  const relatedArticles = getRelatedArticles(params.slug);

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFBFC]">
        <div className="text-center px-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 max-w-md">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold mb-3 text-gray-900">Article Not Found</h1>
            <p className="text-gray-600 mb-6">Sorry, we could not find that article. It may have been moved or deleted.</p>
            <Link href="/blog" className="inline-flex items-center gap-2 text-[#2C68C4] hover:text-[#1B3F7A] font-semibold transition-colors">
              <ArrowLeft size={18} />
              Back to Blog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const breadcrumbs = generateBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Blog', path: '/blog' },
    { name: article.title, path: `/blog/${article.slug}` },
  ]);

  const articleSchema = generateArticleSchema({
    title: article.title,
    description: article.description,
    slug: article.slug,
    date: article.date,
    category: article.category,
  });

  return (
    <>
      <JsonLd data={[articleSchema, breadcrumbs]} />
      <div className="min-h-screen bg-[#FAFBFC]">
        {/* Compact Back Navigation */}
        <div className="bg-white border-b border-gray-200 sticky top-[72px] z-30">
          <div className="max-w-[840px] mx-auto px-6 py-4">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-[#1B3F7A] transition-colors"
            >
              <ArrowLeft size={16} />
              Back to Blog
            </Link>
          </div>
        </div>

        {/* Article Hero */}
        <div className="bg-gradient-to-br from-[#1B3F7A] to-[#2C68C4] relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)',
              backgroundSize: '30px 30px'
            }}></div>
          </div>

          <div className="relative max-w-[840px] mx-auto px-6 py-16 md:py-20">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1.5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-xs font-semibold text-white uppercase tracking-wide">
                {article.category}
              </span>
              <span className="px-3 py-1.5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-xs font-medium text-white flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {article.readTime} min read
              </span>
            </div>

            <h1 className="font-bold text-white mb-6 leading-tight" style={{
              fontSize: 'clamp(2rem, 4vw, 2.8rem)',
              letterSpacing: '-0.02em'
            }}>
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-white/80 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="font-medium">Foundationary</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <time dateTime={article.date}>
                  {new Date(article.date).toLocaleDateString('en-GB', { month: 'long', day: 'numeric', year: 'numeric' })}
                </time>
              </div>
            </div>
          </div>

          {/* Decorative wave */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 80L60 70C120 60 240 40 360 30C480 20 600 20 720 25C840 30 960 40 1080 45C1200 50 1320 50 1380 50L1440 50V80H1380C1320 80 1200 80 1080 80C960 80 840 80 720 80C600 80 480 80 360 80C240 80 120 80 60 80H0Z" fill="#FAFBFC"/>
            </svg>
          </div>
        </div>

        {/* Article Content */}
        <article className="max-w-[840px] mx-auto px-6 py-12 md:py-16">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 md:p-12">
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
              {article.content}
            </div>
          </div>

          {/* CTA Box */}
          <div className="mt-12 bg-gradient-to-br from-[#1B3F7A] to-[#2C68C4] rounded-2xl p-10 md:p-12 text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)',
                backgroundSize: '40px 40px'
              }}></div>
            </div>

            <div className="relative text-center">
              <h2 className="font-bold text-2xl md:text-3xl mb-4">
                Get All Your Business Documents
              </h2>
              <p className="text-white/90 text-lg mb-8 max-w-xl mx-auto">
                Client contract, GDPR privacy policy, invoice template, professional bio, and more - all specific to you and UK law.
              </p>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#1B3F7A] font-bold rounded-xl hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                style={{ fontSize: '1.05rem' }}
              >
                Get Your Pack for 79
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <aside className="mt-16">
              <h2 className="font-bold text-gray-900 text-2xl mb-8">Related Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {relatedArticles.map((related) => (
                  <Link
                    key={related.slug}
                    href={`/blog/${related.slug}`}
                    className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-[#2C68C4]/30 hover:shadow-lg transition-all"
                  >
                    <div className="h-32 bg-gradient-to-br from-[#1B3F7A] to-[#2C68C4] flex items-center justify-center text-5xl">
                      {related.image}
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3 text-xs text-gray-500">
                        <span className="px-2 py-1 bg-gray-100 rounded">{related.category}</span>
                        <span> - </span>
                        <span>{related.readTime} min</span>
                      </div>
                      <h3 className="font-semibold text-gray-900 text-base mb-2 group-hover:text-[#2C68C4] transition-colors">
                        {related.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2">{related.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </aside>
          )}
        </article>
      </div>
    </>
  );
}
