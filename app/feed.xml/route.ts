import { NextResponse } from 'next/server';

export async function GET() {
  const base = 'https://foundationary.co.uk';

  // Hardcoded blog articles for now
  const articles = [
    {
      title: 'Sole Trader Business Setup Guide: UK',
      slug: 'sole-trader-business-setup-guide-uk',
      description: 'A comprehensive guide to setting up as a sole trader in the UK, including registration, taxes, and legal requirements.',
      date: '2024-01-15',
    },
    {
      title: 'GDPR Compliance for UK Sole Traders',
      slug: 'gdpr-compliance-for-sole-traders-uk',
      description: 'Everything UK sole traders need to know about GDPR compliance, privacy policies, and data protection.',
      date: '2024-01-22',
    },
    {
      title: 'Client Contract Essentials for UK Freelancers',
      slug: 'client-contract-essentials-uk-freelancers',
      description: 'Key clauses every UK freelancer should include in their client contracts to protect their business.',
      date: '2024-02-01',
    },
    {
      title: 'Invoice Template Best Practices for UK Businesses',
      slug: 'invoice-template-best-practices-uk',
      description: 'How to create professional invoices that comply with UK requirements and get you paid faster.',
      date: '2024-02-08',
    },
    {
      title: 'Late Payment Fees and UK Law',
      slug: 'late-payment-fees-uk-law',
      description: 'Your rights under UK law for charging late payment fees and interest on unpaid invoices.',
      date: '2024-02-15',
    },
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Foundationary Blog</title>
    <link>${base}/blog</link>
    <description>Business foundations for UK sole traders</description>
    <language>en-GB</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${articles.map(a => `<item>
      <title>${escapeXml(a.title)}</title>
      <link>${base}/blog/${a.slug}</link>
      <description>${escapeXml(a.description)}</description>
      <pubDate>${new Date(a.date).toUTCString()}</pubDate>
      <guid>${base}/blog/${a.slug}</guid>
    </item>`).join('\n    ')}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
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
