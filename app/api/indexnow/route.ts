import { NextRequest, NextResponse } from 'next/server';
import { SITE_URL } from '@/lib/seo';

const INDEXNOW_KEY = process.env.INDEXNOW_KEY || 'foundationary2024indexnow';
const SEARCH_ENGINES = [
  'https://api.indexnow.org/indexnow',
  'https://www.bing.com/indexnow',
  'https://yandex.com/indexnow',
];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const urls: string[] = body.urls || [];

    if (!urls.length) {
      return NextResponse.json({ error: 'No URLs provided' }, { status: 400 });
    }

    const fullUrls = urls.map(url =>
      url.startsWith('http') ? url : `${SITE_URL}${url}`
    );

    const payload = {
      host: new URL(SITE_URL).host,
      key: INDEXNOW_KEY,
      keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
      urlList: fullUrls,
    };

    const results = await Promise.allSettled(
      SEARCH_ENGINES.map(engine =>
        fetch(engine, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      )
    );

    const successes = results.filter(r => r.status === 'fulfilled').length;

    return NextResponse.json({
      notified: successes,
      total: SEARCH_ENGINES.length,
      urls: fullUrls.length,
    });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
