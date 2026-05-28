import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const articles = [
  {
    id: 1,
    slug: 'sole-trader-business-setup-guide-uk',
    title: 'Complete Guide to Setting Up a Sole Trader Business in the UK (2026)',
    description: 'Everything you need to know about registering as a sole trader, legal requirements, tax obligations, and essential documents from day one.',
    category: 'Legal',
    readTime: 12,
    date: '2026-05-27',
    image: '📋',
    keywords: 'sole trader setup UK, how to start sole trader business, UK sole trader registration',
  },
  {
    id: 2,
    slug: 'gdpr-compliance-for-sole-traders-uk',
    title: 'GDPR Compliance for UK Sole Traders: Complete 2026 Guide',
    description: 'Understand your obligations under UK GDPR. Privacy policy requirements, data subject rights, ICO registration, and practical compliance steps.',
    category: 'Legal',
    readTime: 10,
    date: '2026-05-27',
    image: '🔒',
    keywords: 'GDPR sole trader, data protection UK freelancer, privacy policy requirements',
  },
  {
    id: 3,
    slug: 'client-contract-essentials-uk-freelancers',
    title: 'What Every UK Freelancer Needs in Their Client Contract',
    description: 'Essential contract clauses explained: scope, payment terms, IP rights, termination, and dispute resolution. Protect yourself from day one.',
    category: 'Legal',
    readTime: 8,
    date: '2026-05-27',
    image: '📝',
    keywords: 'freelancer contract UK, service agreement sole trader, client contract terms',
  },
  {
    id: 4,
    slug: 'invoice-best-practices-uk-sole-traders',
    title: 'Invoice Best Practices for UK Sole Traders',
    description: 'Create professional invoices that get you paid on time. Essential elements, payment terms, and Late Payment Act requirements.',
    category: 'Financial',
    readTime: 7,
    date: '2026-05-27',
    image: '🧾',
    keywords: 'invoice UK sole trader, invoicing freelancers, late payment terms',
  },
  {
    id: 5,
    slug: 'late-payment-act-1998-guide',
    title: 'Late Payment Act 1998: How to Get Paid on Time',
    description: 'Your rights under UK law. Statutory interest, compensation claims, and the Letter Before Action that protects your position.',
    category: 'Financial',
    readTime: 6,
    date: '2026-05-27',
    image: '💰',
    keywords: 'late payment UK, statutory interest, legal action payment',
  },
];

const categories = ['All Topics', 'Legal', 'Financial', 'Marketing', 'Operations'];

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState('All Topics');

  const filteredArticles = selectedCategory === 'All Topics'
    ? articles
    : articles.filter(a => a.category === selectedCategory);

  return (
    <>
      <Helmet>
        <title>Blog - Resources for UK Sole Traders and Freelancers | Foundationary</title>
        <meta name="description" content="Expert guides, legal insights, and practical tips for UK sole traders and freelancers. Learn about GDPR compliance, client contracts, invoicing best practices, and more." />
        <meta name="keywords" content="sole trader blog UK, freelancer advice UK, GDPR sole trader guide, client contract tips, UK freelancer resources" />
        <link rel="canonical" href="https://foundationary.vercel.app/blog" />
      </Helmet>

      <div className="min-h-screen bg-[#F8FAFF]">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-[#1B3F7A] to-[#2C68C4] py-20 px-6">
          <div className="max-w-[1200px] mx-auto text-center">
            <h1 className="font-bold text-white mb-4" style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)' }}>
              Resources for UK Sole Traders
            </h1>
            <p className="text-lg text-blue-100 max-w-[640px] mx-auto">
              Expert guides, legal insights, and practical tips to help you run your business professionally and protect yourself properly.
            </p>
          </div>
        </section>

        {/* Category Filter */}
        <section className="bg-white border-b border-gray-200 py-8 px-6 sticky top-[72px] z-40">
          <div className="max-w-[1200px] mx-auto">
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-5 py-2 rounded-full font-medium text-sm transition-all ${
                    selectedCategory === cat
                      ? 'bg-[#1B3F7A] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Articles Grid */}
        <section className="py-16 px-6">
          <div className="max-w-[1200px] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((article) => (
                <Link
                  key={article.id}
                  to={`/blog/${article.slug}`}
                  className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:translate-y-[-4px]"
                >
                  {/* Article Image/Icon */}
                  <div className="w-full h-48 bg-gradient-to-br from-[#1B3F7A] to-[#2C68C4] flex items-center justify-center text-6xl">
                    {article.image}
                  </div>

                  {/* Article Content */}
                  <div className="p-6">
                    {/* Category Badge */}
                    <span className="inline-block px-3 py-1 bg-blue-50 text-[#1B3F7A] text-xs font-semibold uppercase tracking-wide rounded-full mb-3">
                      {article.category}
                    </span>

                    {/* Title */}
                    <h2 className="font-bold text-gray-900 mb-3 line-clamp-2" style={{ fontSize: '1.15rem', lineHeight: 1.4 }}>
                      {article.title}
                    </h2>

                    {/* Description */}
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2" style={{ lineHeight: 1.6 }}>
                      {article.description}
                    </p>

                    {/* Meta */}
                    <div className="flex justify-between items-center pt-4 border-t border-gray-100 text-xs text-gray-500">
                      <span>{new Date(article.date).toLocaleDateString('en-GB', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      <span>{article.readTime} min read</span>
                    </div>

                    {/* CTA */}
                    <div className="mt-4 font-semibold text-[#2C68C4] text-sm">
                      Read Article →
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-br from-[#1B3F7A] to-[#2C68C4] py-20 px-6">
          <div className="max-w-[1200px] mx-auto text-center">
            <h2 className="font-bold text-white mb-4" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)' }}>
              Ready to set up your business properly?
            </h2>
            <p className="text-lg text-blue-100 max-w-[560px] mx-auto mb-8">
              Get all 10 professional documents in one pack — client contract, GDPR privacy policy, invoice template, and more. £79. Done in 24 hours.
            </p>
            <Link
              to="/pricing"
              className="inline-block px-8 py-4 bg-white text-[#1B3F7A] font-bold rounded-lg hover:bg-gray-50 transition-colors"
            >
              Get Your Business Foundations Pack — £79
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
