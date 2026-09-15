import { NextRequest, NextResponse } from 'next/server';

// ---------------------------------------------------------------------------
// Request hardening helpers.
//
// rateLimit: fixed-window in-memory limiter. Enough for a single-instance
// deployment; move the bucket store to Redis if the app is ever scaled
// horizontally.
// ---------------------------------------------------------------------------

interface Window {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Window>();

// Periodically drop expired buckets so the map can't grow unbounded.
function pruneExpired(now: number): void {
  if (buckets.size < 500) return;
  for (const [key, w] of buckets) {
    if (w.resetAt <= now) buckets.delete(key);
  }
}

function clientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return req.headers.get('x-real-ip') || 'local';
}

/**
 * Returns a 429 response when the caller has exceeded `limit` requests in
 * `windowMs` for the named bucket, otherwise null (request allowed).
 */
export function rateLimit(
  req: NextRequest,
  name: string,
  limit: number,
  windowMs: number
): NextResponse | null {
  const now = Date.now();
  pruneExpired(now);

  const key = `${name}:${clientIp(req)}`;
  let bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    bucket = { count: 0, resetAt: now + windowMs };
    buckets.set(key, bucket);
  }
  bucket.count += 1;

  if (bucket.count > limit) {
    const retryAfter = Math.max(1, Math.ceil((bucket.resetAt - now) / 1000));
    return NextResponse.json(
      { error: 'Too many requests. Please try again shortly.' },
      { status: 429, headers: { 'Retry-After': String(retryAfter) } }
    );
  }
  return null;
}

/**
 * Copies only the allowed keys from an untrusted JSON body. Used on write
 * routes so clients can never overwrite server-owned fields (id, userId,
 * dates) by sending extra keys.
 */
export function pickAllowed<T extends Record<string, unknown>>(
  body: T,
  allowed: readonly string[]
): Record<string, unknown> {
  const picked: Record<string, unknown> = {};
  for (const key of allowed) {
    if (key in body && body[key] !== undefined) {
      picked[key] = body[key];
    }
  }
  return picked;
}
