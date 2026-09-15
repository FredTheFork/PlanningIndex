// ---------------------------------------------------------------------------
// WordPress content integration (Phase 45).
// WordPress → API → Next.js: WordPress owns the content, the marketing
// frontend owns presentation. When WORDPRESS_API_URL is configured, blog and
// help content is fetched from the WordPress REST API and mapped into the
// app's own content shapes. When it is not configured — or the request fails
// for any reason — the bundled local content is served instead, so the
// marketing site always renders.
// ---------------------------------------------------------------------------

import type { BlogPost, BlogSection } from '@/lib/blog';
import type { HelpArticle, HelpCategory } from '@/lib/help';
import { blogPosts } from '@/lib/blog';
import { helpCategories } from '@/lib/help';

const REVALIDATE_SECONDS = 300; // 5 minutes

export function isWordPressConfigured(): boolean {
  const url = process.env.WORDPRESS_API_URL;
  return Boolean(url && /^https?:\/\//.test(url));
}

// --- WordPress REST shapes (only the fields we use) ------------------------

interface WpTerm {
  name: string;
  slug: string;
}

interface WpEmbedded {
  author?: { name?: string; description?: string }[];
  'wp:featuredmedia'?: { source_url?: string; alt_text?: string }[];
  'wp:term'?: WpTerm[][];
}

interface WpPost {
  slug: string;
  date: string;
  modified: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
  _embedded?: WpEmbedded;
}

// --- HTML helpers -----------------------------------------------------------

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#8217;|&rsquo;/g, "'")
    .replace(/&#8216;|&lsquo;/g, '‘')
    .replace(/&#8220;|&ldquo;/g, '“')
    .replace(/&#8221;|&rdquo;/g, '”')
    .replace(/&#8212;|&mdash;/g, '—')
    .replace(/&#8211;|&ndash;/g, '–')
    .replace(/&#8230;/g, '…')
    .replace(/&#(\d+);/g, (_m, code: string) => String.fromCharCode(Number(code)))
    .replace(/\s+/g, ' ')
    .trim();
}

function matchAll(html: string, tag: string): string[] {
  return Array.from(html.matchAll(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, 'gi'))).map(
    (m) => m[1]
  );
}

/** Map WordPress post HTML into the app's structured section format. */
function htmlToSections(html: string): BlogSection[] {
  const sections: BlogSection[] = [];
  // Split on headings; content before the first heading becomes the intro.
  const parts = html.split(/<h[23][^>]*>/i);
  const headings = Array.from(html.matchAll(/<h[23][^>]*>([\s\S]*?)<\/h[23]>/gi)).map((m) =>
    stripHtml(m[1])
  );

  const blocks = parts.map((part) => part.split(/<\/h[23]>/i).pop() ?? part);

  blocks.forEach((block, i) => {
    const section: BlogSection = {};

    const paragraphs = matchAll(block, 'p')
      .map(stripHtml)
      .filter((t) => t.length > 0);

    const blockquote = matchAll(block, 'blockquote').map(stripHtml)[0];
    const listItems = matchAll(block, 'li').map(stripHtml).filter((t) => t.length > 0);

    if (i > 0 && headings[i - 1]) section.heading = headings[i - 1];

    if (blockquote) {
      section.type = 'callout';
      section.calloutType = 'info';
      section.paragraphs = paragraphs.length > 0 ? paragraphs : [blockquote];
    } else if (listItems.length > 0 && /<ol/i.test(block)) {
      section.type = 'steps';
      section.steps = listItems;
      section.paragraphs = paragraphs;
    } else if (listItems.length > 0) {
      section.type = 'list';
      section.items = listItems;
      section.paragraphs = paragraphs;
    } else if (paragraphs.length > 0) {
      section.paragraphs = paragraphs;
    }

    if (section.paragraphs?.length || section.steps?.length || section.items?.length) {
      sections.push(section);
    }
  });

  return sections.length > 0 ? sections : [{ paragraphs: [stripHtml(html)].filter(Boolean) }];
}

function termsForPost(post: WpPost): WpTerm[] {
  const termGroups = post._embedded?.['wp:term'] ?? [];
  return termGroups.flat().filter((t) => t && t.name);
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function readTimeFor(html: string): string {
  const words = stripHtml(html).split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.round(words / 200))} min read`;
}

const FALLBACK_IMAGE =
  'https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';

function wpPostToBlogPost(post: WpPost): BlogPost {
  const terms = termsForPost(post);
  const category = terms[0]?.name ?? 'Blog';
  const media = post._embedded?.['wp:featuredmedia']?.[0];
  const author = post._embedded?.author?.[0];

  return {
    slug: post.slug,
    title: stripHtml(post.title.rendered),
    excerpt: stripHtml(post.excerpt.rendered),
    category,
    date: post.date.slice(0, 10),
    displayDate: formatDate(post.date),
    readTime: readTimeFor(post.content.rendered),
    author: author?.name ?? 'PlanningIndex Team',
    authorBio:
      author?.description?.trim() ||
      'The PlanningIndex team helps UK construction professionals find and win work through planning application intelligence.',
    tags: terms.slice(1).map((t) => t.name),
    image: media?.source_url ?? FALLBACK_IMAGE,
    imageAlt: media?.alt_text ?? stripHtml(post.title.rendered),
    content: htmlToSections(post.content.rendered),
  };
}

// --- Fetchers ----------------------------------------------------------------

async function fetchWpPosts(): Promise<WpPost[] | null> {
  if (!isWordPressConfigured()) return null;
  try {
    const base = process.env.WORDPRESS_API_URL!.replace(/\/$/, '');
    const res = await fetch(`${base}/wp-json/wp/v2/posts?_embed&per_page=100`, {
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) return null;
    return (await res.json()) as WpPost[];
  } catch {
    // Any WordPress failure falls back to the bundled content.
    return null;
  }
}

let blogCache: { posts: BlogPost[]; source: 'wordpress' | 'local' } | null = null;
let helpCache: { categories: HelpCategory[]; source: 'wordpress' | 'local' } | null = null;

/**
 * Blog posts from WordPress when configured and reachable, otherwise the
 * bundled local posts. WordPress controls content; this app controls layout.
 */
export async function getBlogPosts(): Promise<BlogPost[]> {
  if (blogCache) return blogCache.posts;
  const wp = await fetchWpPosts();
  blogCache = wp
    ? { posts: wp.map(wpPostToBlogPost), source: 'wordpress' }
    : { posts: blogPosts, source: 'local' };
  return blogCache.posts;
}

export function getBlogContentSource(): 'wordpress' | 'local' {
  return blogCache?.source ?? 'local';
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const posts = await getBlogPosts();
  return posts.find((p) => p.slug === slug) ?? null;
}

/** Related posts sharing a category or tags with the given slug. */
export function getRelatedPosts(posts: BlogPost[], slug: string, limit = 3): BlogPost[] {
  const post = posts.find((p) => p.slug === slug);
  if (!post) return [];
  return posts
    .filter((p) => p.slug !== slug)
    .map((p) => {
      let score = 0;
      if (p.category === post.category) score += 2;
      score += p.tags.filter((t) => post.tags.includes(t)).length;
      return { post: p, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((r) => r.post);
}

/**
 * Help centre categories from WordPress when configured and reachable,
 * otherwise the bundled local help content. Each WordPress category becomes a
 * help category; its posts become the articles.
 */
export async function getHelpCategories(): Promise<HelpCategory[]> {
  if (helpCache) return helpCache.categories;
  const wp = await fetchWpPosts();
  if (!wp) {
    helpCache = { categories: helpCategories, source: 'local' };
    return helpCache.categories;
  }

  const byCategory = new Map<string, HelpCategory>();
  for (const raw of wp) {
    const post = wpPostToBlogPost(raw);
    const terms = termsForPost(raw);
    const term = terms[0];
    if (!term) continue;

    let category = byCategory.get(term.slug);
    if (!category) {
      category = {
        slug: term.slug,
        name: term.name,
        description: `Guides and answers about ${term.name.toLowerCase()}.`,
        articles: [],
      };
      byCategory.set(term.slug, category);
    }

    const article: HelpArticle = {
      slug: post.slug,
      title: post.title,
      category: term.name,
      categorySlug: term.slug,
      excerpt: post.excerpt,
      lastUpdated: formatDate(raw.modified),
      content: post.content,
    };
    category.articles.push(article);
  }

  helpCache = { categories: Array.from(byCategory.values()), source: 'wordpress' };
  return helpCache.categories;
}

export async function getHelpCategoryBySlug(slug: string): Promise<HelpCategory | null> {
  const categories = await getHelpCategories();
  return categories.find((c) => c.slug === slug) ?? null;
}
