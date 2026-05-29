import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
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
      <div className="min-h-screen flex items-center justify-center bg-off-white pt-20">
        <div className="text-center px-6">
          <div className="bg-white rounded-lg border border-border p-12 max-w-md">
            <h1 className="font-inter font-bold text-navy text-2xl mb-3">Article Not Found</h1>
            <p className="font-inter text-secondary-text mb-6">Sorry, we could not find that article.</p>
            <Link href="/blog" className="font-inter font-medium text-medium-blue hover:text-navy inline-flex items-center gap-2 transition-colors">
              <ArrowLeft size={16} />
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
      <div className="min-h-screen bg-off-white">
        {/* Back Navigation */}
        <div className="bg-white border-b border-border sticky top-0 z-30" style={{ top: '72px' }}>
          <div className="max-w-[840px] mx-auto px-6 py-3">
            <Link
              href="/blog"
              className="font-inter font-medium text-sm text-secondary-text hover:text-navy inline-flex items-center gap-2 transition-colors"
            >
              <ArrowLeft size={16} />
              Back to Blog
            </Link>
          </div>
        </div>

        {/* Article Header - Simple gradient, no patterns */}
        <section
          className="px-6"
          style={{
            padding: '64px 0 56px',
            background: 'linear-gradient(135deg, #1B3F7A 0%, #2C68C4 100%)',
          }}
        >
          <div className="mx-auto" style={{ maxWidth: 840 }}>
            <div className="flex items-center gap-3 mb-4">
              <span className="font-inter font-medium text-xs px-3 py-1.5 bg-white/20 rounded text-white">
                {article.category}
              </span>
              <span className="font-inter font-medium text-xs px-3 py-1.5 bg-white/20 rounded text-white flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {article.readTime} min read
              </span>
            </div>

            <h1
              className="font-inter font-extrabold text-white leading-tight"
              style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)' }}
            >
              {article.title}
            </h1>

            <div className="flex items-center gap-4 mt-5 text-white/80 text-sm font-inter">
              <span className="font-medium">Foundationary</span>
              <span className="text-white/40">|</span>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <time dateTime={article.date}>
                  {new Date(article.date).toLocaleDateString('en-GB', { month: 'long', day: 'numeric', year: 'numeric' })}
                </time>
              </div>
            </div>
          </div>
        </section>

        {/* Article Content */}
        <article className="max-w-[840px] mx-auto px-6 py-12">
          <div className="bg-white rounded-lg border border-border p-8 md:p-10">
            <div className="prose prose-lg max-w-none text-secondary-text leading-relaxed font-inter">
              {article.content}
            </div>
          </div>

          {/* CTA Box - Simple, no patterns */}
          <div className="mt-10 bg-navy rounded-lg p-10 text-white text-center">
            <h2 className="font-inter font-bold text-2xl mb-3">
              Get All Your Business Documents
            </h2>
            <p className="font-inter text-white/80 mb-6" style={{ fontSize: '1.05rem' }}>
              Client contract, GDPR privacy policy, invoice template, professional bio, and more - all specific to you and UK law.
            </p>
            <Link
              href="/checkout"
              className="font-inter font-semibold text-navy bg-white rounded-lg inline-flex items-center gap-2 hover:bg-gray-50 transition-colors"
              style={{ padding: '14px 32px', fontSize: '1rem' }}
            >
              Get Your Pack for 79
            </Link>
          </div>

          {/* Related Articles - Clean cards */}
          {relatedArticles.length > 0 && (
            <aside className="mt-14">
              <h2 className="font-inter font-bold text-navy text-xl mb-6">Related Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {relatedArticles.map((related) => (
                  <Link
                    key={related.slug}
                    href={`/blog/${related.slug}`}
                    className="group bg-white rounded-lg border border-border overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="h-28 bg-gray-100">
                      <img
                        src={related.image}
                        alt={related.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-2 text-xs text-secondary-text font-inter">
                        <span className="px-2 py-0.5 bg-gray-100 rounded">{related.category}</span>
                        <span>{related.readTime} min</span>
                      </div>
                      <h3 className="font-inter font-semibold text-navy text-base mb-1 group-hover:text-medium-blue transition-colors">
                        {related.title}
                      </h3>
                      <p className="font-inter text-sm text-secondary-text line-clamp-2">{related.description}</p>
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
