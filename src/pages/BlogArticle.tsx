import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft } from 'lucide-react';
import { getArticleBySlug, getRelatedArticles } from '../lib/articleContent';

export default function BlogArticle() {
  const { slug } = useParams<{ slug: string }>();
  const article = slug ? getArticleBySlug(slug) : null;
  const relatedArticles = slug ? getRelatedArticles(slug) : [];

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFBFC]">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-gray-900">Article Not Found</h1>
          <p className="text-gray-600 mb-6">Sorry, we couldn't find that article.</p>
          <Link to="/blog" className="text-[#2C68C4] hover:underline font-medium">
            ← Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{article.title} | Foundationary Blog</title>
        <meta name="description" content={article.description} />
        <meta name="keywords" content={article.keywords} />
        <link rel="canonical" href={`https://foundationary.vercel.app/blog/${slug}`} />
      </Helmet>

      <div className="min-h-screen bg-[#FAFBFC]">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 py-6 px-6 sticky top-[72px] z-30">
          <div className="max-w-[840px] mx-auto">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 mb-4"
            >
              <ArrowLeft size={16} />
              Back to Blog
            </Link>
          </div>
        </div>

        {/* Content */}
        <article className="py-16 px-6">
          <div className="max-w-[840px] mx-auto">
            {/* Category & Meta */}
            <div className="mb-4">
              <span className="inline-block px-3 py-1 bg-blue-50 text-[#1B3F7A] text-xs font-semibold uppercase tracking-wide rounded-full mb-4">
                {article.category}
              </span>
              <p className="text-sm text-gray-600">
                Published {new Date(article.date).toLocaleDateString('en-GB', { month: 'long', day: 'numeric', year: 'numeric' })} · {article.readTime} min read
              </p>
            </div>

            {/* Title */}
            <h1 className="font-bold text-gray-900 mb-8" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', lineHeight: 1.3 }}>
              {article.title}
            </h1>

            {/* Content */}
            <div className="text-gray-700 mb-12 prose prose-sm max-w-none">
              {article.content}
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-br from-[#1B3F7A] to-[#2C68C4] rounded-lg p-8 text-white text-center mb-16">
              <h3 className="font-bold text-xl mb-3">Get All Your Business Documents</h3>
              <p className="text-blue-100 mb-6">
                Client contract, GDPR privacy policy, invoice template, professional bio, and more. All specific to you and UK law.
              </p>
              <Link
                to="/pricing"
                className="inline-block px-6 py-3 bg-white text-[#1B3F7A] font-bold rounded-lg hover:bg-gray-50 transition-colors"
              >
                Get Your Pack for £79 →
              </Link>
            </div>

            {/* Related Articles */}
            {relatedArticles.length > 0 && (
              <div>
                <h3 className="font-bold text-gray-900 text-lg mb-6">Related Articles</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {relatedArticles.map((related) => (
                    <Link
                      key={related.slug}
                      to={`/blog/${related.slug}`}
                      className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                    >
                      <h4 className="font-semibold text-gray-900 text-sm mb-2">{related.title}</h4>
                      <span className="text-xs text-blue-600 font-medium">Read more →</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </article>
      </div>
    </>
  );
}
