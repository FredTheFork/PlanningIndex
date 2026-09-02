import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Clock, ArrowRight } from 'lucide-react';
import { JsonLd } from '@/components/seo';
import { SITE_URL, generateBreadcrumbSchema, generateArticleSchema } from '@/lib/seo';
import { Breadcrumbs, Badge, DarkCTABanner } from '@/components/ui';
import { ArticleBody } from '@/components/marketing/ArticleBody';
import { ArticleFeedback } from '@/components/marketing/ArticleFeedback';
import { blogPosts, getBlogPostBySlug, getRelatedBlogPosts } from '@/lib/blog';

interface PageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const post = getBlogPostBySlug(params.slug);
  if (!post) {
    return {
      title: 'Article Not Found',
      robots: { index: false, follow: false },
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `${SITE_URL}/blog/${post.slug}` },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.excerpt,
      url: `${SITE_URL}/blog/${post.slug}`,
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
      images: [{ url: post.image, width: 1200, height: 630, alt: post.imageAlt }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.image],
    },
    keywords: post.tags.join(', '),
  };
}

export default function BlogArticlePage({ params }: PageProps) {
  const post = getBlogPostBySlug(params.slug);
  if (!post) notFound();

  const relatedPosts = getRelatedBlogPosts(params.slug, 3);

  const breadcrumbs = generateBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Blog', path: '/blog' },
    { name: post.title, path: `/blog/${post.slug}` },
  ]);

  const article = generateArticleSchema({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
    author: post.author,
    datePublished: post.date,
    image: post.image,
    section: post.category,
    tags: post.tags,
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
                { label: 'Blog', href: '/blog' },
                { label: post.title },
              ]}
              className="mb-6"
            />
            <div className="flex items-center gap-3 mb-4">
              <Badge variant="accent">{post.category}</Badge>
              <span className="font-sans text-white/60 text-sm">{post.displayDate}</span>
              <span className="text-white/30">·</span>
              <span className="inline-flex items-center gap-1 font-sans text-white/60 text-sm">
                <Clock size={13} /> {post.readTime}
              </span>
            </div>
            <h1 className="font-display font-bold text-white mb-4" style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', lineHeight: 1.2 }}>
              {post.title}
            </h1>
            <p className="font-sans text-white/70 leading-relaxed" style={{ fontSize: '1.1rem' }}>
              {post.excerpt}
            </p>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-6 -mt-8 relative z-10">
          <div className="relative overflow-hidden rounded-2xl border border-primary-200 h-72 sm:h-96 bg-primary-100">
            <img
              src={post.image}
              alt={post.imageAlt}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>

        <section className="py-16 px-6">
          <div className="max-w-3xl mx-auto">
            <Link href="/blog" className="inline-flex items-center gap-2 font-sans font-medium text-primary-500 hover:text-primary-900 transition-colors text-sm mb-8">
              <ArrowLeft size={16} /> Back to Blog
            </Link>

            <ArticleBody sections={post.content} />

            <ArticleFeedback />

            <div className="mt-12 p-6 bg-primary-50 rounded-xl border border-primary-100">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-900 text-white shrink-0">
                  <span className="font-sans font-bold text-sm">PI</span>
                </div>
                <div>
                  <h3 className="font-sans font-semibold text-primary-900 text-sm mb-1">{post.author}</h3>
                  <p className="font-sans text-primary-500 text-sm leading-relaxed">{post.authorBio}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {relatedPosts.length > 0 && (
          <section className="bg-primary-50 py-16 px-6 border-t border-primary-100">
            <div className="max-w-page mx-auto">
              <h2 className="font-display font-bold text-primary-900 text-h3 mb-8">Related articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((related) => (
                  <Link key={related.slug} href={`/blog/${related.slug}`} className="group block h-full">
                    <div className="bg-white rounded-xl border border-primary-200 overflow-hidden transition-all duration-200 hover:shadow-card-hover h-full flex flex-col">
                      <div className="h-36 overflow-hidden bg-primary-100 relative">
                        <img
                          src={related.image}
                          alt={related.imageAlt}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="p-5 flex flex-col flex-1">
                        <Badge variant="accent" className="mb-2 self-start">{related.category}</Badge>
                        <h3 className="font-sans font-semibold text-primary-900 text-sm mb-2 group-hover:text-accent-700 transition-colors">
                          {related.title}
                        </h3>
                        <p className="font-sans text-primary-500 text-sm leading-relaxed line-clamp-2 flex-1">{related.excerpt}</p>
                        <div className="flex items-center gap-1.5 mt-4 text-accent-600 font-sans font-semibold text-sm">
                          Read <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        <DarkCTABanner
          title="Put this into practice."
          subtitle="Start your free trial and get instant access to every planning application in the UK."
          ctaLabel="Start Free Trial"
          ctaHref="/login"
          note="14-day free trial · No commitment · Full access"
        />
      </article>
    </>
  );
}
