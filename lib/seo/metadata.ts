import { Metadata } from 'next';
import { SITE_CONFIG, SITE_URL, OG_IMAGES } from './config';

interface PageSEO {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
  noIndex?: boolean;
}

export function generatePageMetadata({
  title,
  description,
  path,
  image,
  type = 'website',
  publishedTime,
  modifiedTime,
  author,
  section,
  tags,
  noIndex = false,
}: PageSEO): Metadata {
  const url = `${SITE_URL}${path}`;
  const ogImage = image || `${SITE_URL}/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description.slice(0, 100))}`;

  const metadata: Metadata = {
    title,
    description,
    keywords: tags?.join(', '),
    authors: author ? [{ name: author }] : [{ name: SITE_CONFIG.name }],

    openGraph: {
      title,
      description,
      url,
      siteName: SITE_CONFIG.name,
      locale: 'en_GB',
      type: type === 'article' ? 'article' : 'website',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(type === 'article' && {
        publishedTime,
        modifiedTime,
        authors: [author || SITE_CONFIG.name],
        section,
        tags,
      }),
    },

    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
      creator: SITE_CONFIG.twitterHandle,
      site: SITE_CONFIG.twitterHandle,
    },

    alternates: {
      canonical: url,
      languages: {
        'en-GB': url,
        'x-default': url,
      },
    },

    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } },

    other: {
      'geo.region': 'GB',
      'geo.placename': 'United Kingdom',
      'language': 'en-GB',
    },
  };

  return metadata;
}

export function generateArticleMetadata(article: {
  title: string;
  description: string;
  slug: string;
  date: string;
  modifiedDate?: string;
  author?: string;
  category: string;
  keywords?: string;
  image?: string;
}): Metadata {
  return generatePageMetadata({
    title: `${article.title} | Foundationary Blog`,
    description: article.description,
    path: `/blog/${article.slug}`,
    type: 'article',
    image: article.image ? `${SITE_URL}/og/articles/${article.slug}.png` : `${SITE_URL}/api/og?title=${encodeURIComponent(article.title)}&description=${encodeURIComponent(article.description.slice(0, 100))}&type=blog`,
    publishedTime: article.date,
    modifiedTime: article.modifiedDate || article.date,
    author: article.author || SITE_CONFIG.name,
    section: article.category,
    tags: article.keywords?.split(',').map(k => k.trim()) || [],
  });
}
