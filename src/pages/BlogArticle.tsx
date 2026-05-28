import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft } from 'lucide-react';

interface ArticleData {
  title: string;
  description: string;
  keywords: string;
  category: string;
  readTime: number;
  date: string;
  content: React.ReactNode;
  relatedArticles: { title: string; slug: string }[];
}

const articleDatabase: { [key: string]: ArticleData } = {
  'sole-trader-business-setup-guide-uk': {
    title: 'Complete Guide to Setting Up a Sole Trader Business in the UK (2026)',
    description: 'Complete 2026 guide to setting up a sole trader business in the UK. Step-by-step registration, legal requirements, tax obligations, and essential documents. Start your business properly.',
    keywords: 'sole trader setup UK, how to start sole trader business, UK sole trader registration',
    category: 'Legal',
    readTime: 12,
    date: '2026-05-27',
    content: <div>
      <p>Loading article content from static HTML...</p>
    </div>,
    relatedArticles: [
      { title: 'GDPR Compliance for UK Sole Traders', slug: 'gdpr-compliance-for-sole-traders-uk' },
      { title: 'What Every UK Freelancer Needs in Their Client Contract', slug: 'client-contract-essentials-uk-freelancers' },
    ],
  },
  'gdpr-compliance-for-sole-traders-uk': {
    title: 'GDPR Compliance for UK Sole Traders: Complete 2026 Guide',
    description: 'Complete 2026 guide to GDPR compliance for UK sole traders. Privacy policy requirements, ICO registration, data subject rights, and practical compliance steps.',
    keywords: 'GDPR sole trader, data protection UK freelancer, privacy policy requirements',
    category: 'Legal',
    readTime: 10,
    date: '2026-05-27',
    content: <div>
      <p>Loading article content from static HTML...</p>
    </div>,
    relatedArticles: [
      { title: 'Complete Guide to Setting Up a Sole Trader Business', slug: 'sole-trader-business-setup-guide-uk' },
      { title: 'Invoice Best Practices for UK Sole Traders', slug: 'invoice-best-practices-uk-sole-traders' },
    ],
  },
  'client-contract-essentials-uk-freelancers': {
    title: 'What Every UK Freelancer Needs in Their Client Contract',
    description: 'Essential contract clauses explained: scope, payment terms, IP rights, termination, and dispute resolution. Protect yourself from day one.',
    keywords: 'freelancer contract UK, service agreement sole trader, client contract terms',
    category: 'Legal',
    readTime: 8,
    date: '2026-05-27',
    content: <div>
      <p>Loading article content from static HTML...</p>
    </div>,
    relatedArticles: [
      { title: 'Complete Guide to Setting Up a Sole Trader Business', slug: 'sole-trader-business-setup-guide-uk' },
      { title: 'Late Payment Act 1998: How to Get Paid on Time', slug: 'late-payment-act-1998-guide' },
    ],
  },
  'invoice-best-practices-uk-sole-traders': {
    title: 'Invoice Best Practices for UK Sole Traders',
    description: 'Create professional invoices that get you paid on time. Essential elements, payment terms, and Late Payment Act requirements.',
    keywords: 'invoice UK sole trader, invoicing freelancers, late payment terms',
    category: 'Financial',
    readTime: 7,
    date: '2026-05-27',
    content: <div>
      <p>Loading article content from static HTML...</p>
    </div>,
    relatedArticles: [
      { title: 'Late Payment Act 1998: How to Get Paid on Time', slug: 'late-payment-act-1998-guide' },
      { title: 'Complete Guide to Setting Up a Sole Trader Business', slug: 'sole-trader-business-setup-guide-uk' },
    ],
  },
  'late-payment-act-1998-guide': {
    title: 'Late Payment Act 1998: How to Get Paid on Time',
    description: 'Your rights under UK law. Statutory interest, compensation claims, and the Letter Before Action that protects your position.',
    keywords: 'late payment UK, statutory interest, legal action payment',
    category: 'Financial',
    readTime: 6,
    date: '2026-05-27',
    content: <div>
      <p>Loading article content from static HTML...</p>
    </div>,
    relatedArticles: [
      { title: 'Invoice Best Practices for UK Sole Traders', slug: 'invoice-best-practices-uk-sole-traders' },
      { title: 'What Every UK Freelancer Needs in Their Client Contract', slug: 'client-contract-essentials-uk-freelancers' },
    ],
  },
};

export default function BlogArticle() {
  const { slug } = useParams<{ slug: string }>();
  const article = slug ? articleDatabase[slug] : null;

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Article Not Found</h1>
          <Link to="/blog" className="text-blue-600 hover:underline">
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

            {/* Content Placeholder - Article content would be loaded from static HTML */}
            <div className="prose prose-sm max-w-none text-gray-700 mb-12">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                <p className="text-sm text-gray-700">
                  Article content is loaded from the optimized static HTML files. The React component provides SEO metadata and consistent navigation.
                </p>
                <p className="text-sm text-gray-700 mt-3">
                  <Link to={`/blog/${slug}.html`} className="text-blue-600 hover:underline">
                    View full article with complete content →
                  </Link>
                </p>
              </div>
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
            {article.relatedArticles.length > 0 && (
              <div>
                <h3 className="font-bold text-gray-900 text-lg mb-6">Related Articles</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {article.relatedArticles.map((related) => (
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
