import { SITE_URL } from './config';

const INDEXNOW_KEY = process.env.INDEXNOW_KEY || 'planningindex2026indexnow';

export async function pingIndexNow(urls: string[]) {
  if (!urls.length) return;

  const fullUrls = urls.map(url =>
    url.startsWith('http') ? url : `${SITE_URL}${url}`
  );

  const payload = {
    host: new URL(SITE_URL).host,
    key: INDEXNOW_KEY,
    keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
    urlList: fullUrls,
  };

  const engines = [
    'https://api.indexnow.org/indexnow',
    'https://www.bing.com/indexnow',
    'https://yandex.com/indexnow',
  ];

  await Promise.allSettled(
    engines.map(engine =>
      fetch(engine, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).catch(() => {})
    )
  );
}
