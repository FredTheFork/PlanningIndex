import { NextResponse } from 'next/server';
import { SITE_URL, SITE_CONFIG } from '@/lib/seo';
import { articles } from '@/lib/content/articles';

export async function GET() {
  const base = SITE_URL;

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${escapeXml(SITE_CONFIG.name)} Blog</title>
    <link>${base}/blog</link>
    <atom:link href="${base}/feed.xml" rel="self" type="application/rss+xml"/>
    <description>${escapeXml(SITE_CONFIG.description)}</description>
    <language>en-GB</language>
    <copyright>Copyright ${new Date().getFullYear()} ${SITE_CONFIG.name}</copyright>
    <managingEditor>${SITE_CONFIG.email} (${SITE_CONFIG.name})</managingEditor>
    <webMaster>${SITE_CONFIG.email} (${SITE_CONFIG.name})</webMaster>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <category>Business</category>
    <category>UK Sole Traders</category>
    <category>Legal Documents</category>
    <ttl>60</ttl>
    <image>
      <url>${base}/og/default.png</url>
      <title>${escapeXml(SITE_CONFIG.name)} Blog</title>
      <link>${base}/blog</link>
    </image>
    ${articles.map(a => `<item>
      <title>${escapeXml(a.title)}</title>
      <link>${base}/blog/${a.slug}</link>
      <guid isPermaLink="true">${base}/blog/${a.slug}</guid>
      <description>${escapeXml(a.description)}</description>
      <category>${escapeXml(a.category)}</category>
      <pubDate>${new Date(a.date).toUTCString()}</pubDate>
      <author>${SITE_CONFIG.email} (${SITE_CONFIG.name})</author>
    </item>`).join('\n    ')}
  </channel>
</rss>`;

  return new NextResponse(rss, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
