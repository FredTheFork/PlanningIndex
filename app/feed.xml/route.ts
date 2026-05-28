import { NextResponse } from 'next/server';
import { SITE_URL, SITE_CONFIG } from '@/lib/seo';

export async function GET() {
  const base = SITE_URL;

  const articles = [
    {
      title: 'Sole Trader Business Setup Guide: UK',
      slug: 'sole-trader-business-setup-guide-uk',
      description: 'A comprehensive guide to setting up as a sole trader in the UK, including registration, taxes, and legal requirements.',
      date: '2024-01-15',
      category: 'Legal',
    },
    {
      title: 'GDPR Compliance for UK Sole Traders',
      slug: 'gdpr-compliance-for-sole-traders-uk',
      description: 'Everything UK sole traders need to know about GDPR compliance, privacy policies, and data protection.',
      date: '2024-01-22',
      category: 'Legal',
    },
    {
      title: 'Client Contract Essentials for UK Freelancers',
      slug: 'client-contract-essentials-uk-freelancers',
      description: 'Key clauses every UK freelancer should include in their client contracts to protect their business.',
      date: '2024-02-01',
      category: 'Legal',
    },
    {
      title: 'Invoice Template Best Practices for UK Businesses',
      slug: 'invoice-template-best-practices-uk',
      description: 'How to create professional invoices that comply with UK requirements and get you paid faster.',
      date: '2024-02-08',
      category: 'Financial',
    },
    {
      title: 'Late Payment Fees and UK Law',
      slug: 'late-payment-fees-uk-law',
      description: 'Your rights under UK law for charging late payment fees and interest on unpaid invoices.',
      date: '2024-02-15',
      category: 'Financial',
    },
  ];

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
