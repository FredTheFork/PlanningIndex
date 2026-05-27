import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Blog — Business Resources for UK Sole Traders',
  description: 'Expert guides, tips, and resources for UK sole traders and freelancers. Learn about business setup, GDPR compliance, client contracts, and more.',
  openGraph: {
    title: 'Foundationary Blog — Resources for UK Sole Traders',
    description: 'Expert guides for UK sole traders covering business setup, legal compliance, and professional documents.',
    url: 'https://foundationary.vercel.app/blog',
    type: 'website',
  },
};

const blogPosts = [
  {
    slug: 'sole-trader-business-setup-guide-uk',
    title: 'Complete Guide to Setting Up a Sole Trader Business in the UK (2026)',
    excerpt: 'Everything you need to know about starting your sole trader business in the UK, from registration to tax obligations.',
    date: '2026-05-27',
    readTime: '15 min read',
    category: 'Business Setup',
  },
  {
    slug: 'gdpr-compliance-sole-traders-uk',
    title: 'GDPR Compliance for UK Sole Traders: Complete 2026 Guide',
    excerpt: 'Understand your GDPR obligations as a UK sole trader and learn how to become compliant quickly.',
    date: '2026-05-26',
    readTime: '12 min read',
    category: 'Legal',
  },
  {
    slug: 'client-contract-essentials-uk-freelancers',
    title: 'What Every UK Freelancer Needs in Their Client Contract',
    excerpt: 'The essential clauses every service contract should include to protect your business and get paid on time.',
    date: '2026-05-25',
    readTime: '10 min read',
    category: 'Contracts',
  },
];

export default function BlogPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Blog',
            name: 'Foundationary Blog',
            description: 'Expert guides for UK sole traders',
            url: 'https://foundationary.vercel.app/blog',
            publisher: {
              '@type': 'Organization',
              name: 'Foundationary',
            },
          }),
        }}
      />
      <div className="min-h-screen pt-24 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-16">
            <span className="text-xs font-semibold text-medium-blue uppercase tracking-wider">
              Business Resources
            </span>
            <h1 className="text-4xl lg:text-5xl font-bold text-dark-text mt-2 mb-4">
              Blog
            </h1>
            <p className="text-lg text-secondary-text">
              Expert guides, tips, and resources for UK sole traders and freelancers. Learn how to set up, run, and protect your business.
            </p>
          </div>

          <div className="grid gap-8">
            {blogPosts.map((post) => (
              <article key={post.slug} className="bg-white rounded-xl border border-border p-8 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs font-semibold text-medium-blue uppercase tracking-wider">
                    {post.category}
                  </span>
                  <span className="text-xs text-secondary-text">•</span>
                  <span className="text-xs text-secondary-text">{post.readTime}</span>
                </div>
                <Link href={`/blog/${post.slug}`}>
                  <h2 className="text-2xl font-bold text-dark-text mb-3 hover:text-medium-blue transition-colors">
                    {post.title}
                  </h2>
                </Link>
                <p className="text-secondary-text mb-4">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-secondary-text">{post.date}</span>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-sm font-semibold text-navy hover:text-medium-blue transition-colors"
                  >
                    Read Article →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
