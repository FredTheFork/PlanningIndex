// supabase-js appends /rest/v1, /auth/v1 etc. to the project URL itself, so a
// URL pasted with an API path suffix (e.g. ".../rest/v1/") or trailing slash
// must be stripped to the bare origin or every request 404s.
export function normalizeSupabaseUrl(url: string): string {
  return url
    .replace(/\/+$/, '')
    .replace(/\/rest\/v1$/i, '')
    .replace(/\/+$/, '');
}
