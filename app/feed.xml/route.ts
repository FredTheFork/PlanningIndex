import { NextResponse } from 'next/server';

const BASE_URL = 'https://foundationary.vercel.app';

interface Article {
  slug: string;
  title: string;
  description: string;
  pubDate: string;
}

const articles: Article[] = [
  {
    slug: 'sole-trader-business-setup-guide-uk',
    title: 'Complete Guide to Setting Up a Sole Trader Business in the UK (2026)',
    description:
      'Everything you need to know to register, protect, and run your sole trader business in the UK — from HMRC registration to essential legal documents.',
    pubDate: 'Tue, 27 May 2026 09:00:00 +0000',
  },
];

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Foundationary Blog — Business Resources for UK Sole Traders</title>
    <link>${BASE_URL}/blog</link>
    <description>Expert guides, tips, and resources for UK sole traders and freelancers. Learn about contracts, GDPR, pricing, and more.</description>
    <language>en-gb</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${BASE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${BASE_URL}/og-home.png</url>
      <title>Foundationary Blog</title>
      <link>${BASE_URL}/blog</link>
    </image>
${articles
  .map(
    (article) => `    <item>
      <title>${escapeXml(article.title)}</title>
      <description>${escapeXml(article.description)}</description>
      <link>${BASE_URL}/blog/${article.slug}</link>
      <guid isPermaLink="true">${BASE_URL}/blog/${article.slug}</guid>
      <pubDate>${article.pubDate}</pubDate>
    </item>`,
  )
  .join('\n')}
  </channel>
</rss>`;

  return new NextResponse(rss, {
    headers: {
      'Content-Type': 'text/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  });
}
