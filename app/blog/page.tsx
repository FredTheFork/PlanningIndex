import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Blog - Business Resources for UK Sole Traders',
  description: 'Expert guides, tips, and resources for UK sole traders and freelancers. Learn about contracts, GDPR, pricing, and more.',
  keywords: [
    'sole trader blog UK',
    'freelancer resources UK',
    'UK business guides',
    'sole trader tips',
    'GDPR freelancer',
    'business contracts UK',
  ],
  openGraph: {
    title: 'Blog - Business Resources for UK Sole Traders | Foundationary',
    description: 'Expert guides, tips, and resources for UK sole traders and freelancers. Learn about contracts, GDPR, pricing, and more.',
    url: 'https://foundationary.vercel.app/blog',
    images: [{ url: '/og-home.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog - Business Resources for UK Sole Traders | Foundationary',
    description: 'Expert guides, tips, and resources for UK sole traders and freelancers.',
    images: ['/og-home.png'],
  },
  alternates: {
    canonical: 'https://foundationary.vercel.app/blog',
  },
};

const articles = [
  {
    slug: 'sole-trader-business-setup-guide-uk',
    title: 'Complete Guide to Setting Up a Sole Trader Business in the UK (2026)',
    excerpt:
      'Everything you need to know to register, protect, and run your sole trader business in the UK — from HMRC registration to essential legal documents.',
    date: '27 May 2026',
    readTime: '15 min read',
    category: 'Operations',
    featured: true,
  },
  {
    slug: 'gdpr-compliance-sole-traders-uk',
    title: 'GDPR Compliance for UK Sole Traders: Complete 2026 Guide',
    excerpt:
      'Everything UK sole traders need to know about GDPR — data protection obligations, privacy policies, ICO registration, and what the penalties actually look like in practice.',
    date: '27 May 2026',
    readTime: '12 min read',
    category: 'Legal',
    featured: false,
  },
  {
    slug: 'client-contract-essentials-uk-freelancers',
    title: 'What Every UK Freelancer Needs in Their Client Contract',
    excerpt:
      'Essential clauses every UK freelancer should include in their service agreements — payment terms, intellectual property, termination, limitation of liability, and dispute resolution.',
    date: '27 May 2026',
    readTime: '10 min read',
    category: 'Legal',
    featured: false,
  },
];

const categories = [
  {
    name: 'Legal',
    description: 'Contracts, GDPR, terms, and legal protections for UK sole traders.',
    colour: '#1B3F7A',
    bg: '#EFF4FF',
  },
  {
    name: 'Financial',
    description: 'Tax, VAT, invoicing, bookkeeping, and managing your money.',
    colour: '#2C68C4',
    bg: '#EFF4FF',
  },
  {
    name: 'Marketing',
    description: 'Winning clients, positioning your services, and growing your business.',
    colour: '#1B7A5A',
    bg: '#EDFAF4',
  },
  {
    name: 'Operations',
    description: 'Setting up, running day-to-day, and building solid business foundations.',
    colour: '#7A3B1B',
    bg: '#FFF5EF',
  },
];

export default function BlogIndexPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Blog',
            name: 'Foundationary Blog',
            description: 'Expert guides, tips, and resources for UK sole traders and freelancers.',
            url: 'https://foundationary.vercel.app/blog',
            publisher: {
              '@type': 'Organization',
              name: 'Foundationary',
              url: 'https://foundationary.vercel.app',
            },
          }),
        }}
      />

      {/* Hero */}
      <section
        className="text-center px-6 py-20"
        style={{
          background: 'linear-gradient(135deg, #1B3F7A 0%, #2C68C4 100%)',
        }}
      >
        <div className="mx-auto max-w-[800px]">
          <span className="text-sm font-semibold uppercase tracking-widest text-white/70 block mb-3">
            FOUNDATIONARY BLOG
          </span>
          <h1 className="font-bold text-white text-4xl md:text-5xl">
            Business Resources for UK Sole Traders
          </h1>
          <p className="mt-5 text-lg text-white/90 max-w-[620px] mx-auto">
            Practical guides and expert advice to help you set up, protect, and grow your sole trader business — without the jargon.
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-[#F8FAFE] py-12 px-6">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="font-bold text-[#1a1a2e] text-2xl mb-6 text-center">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <div
                key={cat.name}
                className="rounded-lg p-5 text-center"
                style={{ background: cat.bg }}
              >
                <h3
                  className="font-bold text-base mb-1"
                  style={{ color: cat.colour }}
                >
                  {cat.name}
                </h3>
                <p className="text-[#5a5a7a] text-xs leading-relaxed">{cat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Article */}
      <section className="bg-white py-16 px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <span className="w-8 h-0.5 bg-[#2C68C4]" />
            <span className="font-semibold text-[#2C68C4] uppercase text-xs tracking-widest">
              Featured Guide
            </span>
          </div>

          {/* Featured card */}
          {articles
            .filter((a) => a.featured)
            .map((article) => (
              <Link
                key={article.slug}
                href={`/blog/${article.slug}`}
                className="group block bg-[#F0F4FF] rounded-2xl p-8 md:p-10 hover:shadow-lg transition-shadow duration-200 mb-10"
              >
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="text-xs font-semibold uppercase tracking-widest text-white bg-[#1B3F7A] rounded px-2.5 py-1">
                    {article.category}
                  </span>
                  <span className="text-[#5a5a7a] text-sm">{article.date}</span>
                  <span className="text-[#5a5a7a] text-sm">{article.readTime}</span>
                </div>
                <h2 className="font-bold text-[#1a1a2e] text-2xl md:text-3xl mb-3 group-hover:text-[#2C68C4] transition-colors">
                  {article.title}
                </h2>
                <p className="text-[#5a5a7a] text-lg leading-relaxed mb-5">{article.excerpt}</p>
                <span className="font-semibold text-[#2C68C4] group-hover:underline">
                  Read the full guide →
                </span>
              </Link>
            ))}
        </div>
      </section>

      {/* All Articles Grid */}
      <section className="bg-[#F8FAFE] py-16 px-6">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="font-bold text-[#1a1a2e] text-2xl mb-8">All Articles</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <Link
                key={article.slug}
                href={`/blog/${article.slug}`}
                className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wide text-[#2C68C4]">
                    {article.category}
                  </span>
                </div>
                <h3 className="font-bold text-[#1a1a2e] text-lg mb-2 group-hover:text-[#2C68C4] transition-colors leading-snug">
                  {article.title}
                </h3>
                <p className="text-[#5a5a7a] text-sm leading-relaxed mb-4 flex-1">
                  {article.excerpt}
                </p>
                <div className="flex items-center gap-3 text-xs text-[#5a5a7a] pt-4 border-t border-gray-100">
                  <span>{article.date}</span>
                  <span>·</span>
                  <span>{article.readTime}</span>
                </div>
              </Link>
            ))}

            {/* Placeholder card for upcoming articles */}
            <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-center min-h-[200px]">
              <span className="text-[#5a5a7a] text-sm font-medium">More guides coming soon</span>
              <span className="text-[#5a5a7a] text-xs mt-1">Financial, marketing, and tax resources</span>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter / CTA */}
      <section
        className="py-20 px-6 text-white text-center"
        style={{ background: 'linear-gradient(135deg, #1B3F7A 0%, #2C68C4 100%)' }}
      >
        <div className="max-w-[700px] mx-auto">
          <h2 className="font-bold text-3xl md:text-4xl mb-4">
            Ready to Get Your Business Properly Set Up?
          </h2>
          <p className="text-white/80 text-lg mb-8">
            Reading is a great start — but Foundationary gets it done for you. 10 professional documents, tailored to your business, delivered in 24 hours.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/whats-included"
              className="font-semibold text-[#1B3F7A] bg-white rounded-lg hover:bg-[#F0F4FF] transition-colors px-8 py-4"
            >
              See What&apos;s Included →
            </Link>
            <Link
              href="/pricing"
              className="font-semibold text-white border-2 border-white/60 rounded-lg hover:bg-white/10 transition-colors px-8 py-4"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Internal Links */}
      <section className="bg-white py-12 px-6">
        <div className="max-w-[1200px] mx-auto text-center">
          <nav className="flex flex-wrap justify-center gap-6">
            <Link href="/whats-included" className="text-[#2C68C4] hover:text-[#1B3F7A] font-medium">
              What&apos;s Included →
            </Link>
            <Link href="/pricing" className="text-[#2C68C4] hover:text-[#1B3F7A] font-medium">
              Pricing →
            </Link>
            <Link href="/faq" className="text-[#2C68C4] hover:text-[#1B3F7A] font-medium">
              FAQs →
            </Link>
            <Link href="/how-it-works" className="text-[#2C68C4] hover:text-[#1B3F7A] font-medium">
              How It Works →
            </Link>
          </nav>
        </div>
      </section>
    </>
  );
}
