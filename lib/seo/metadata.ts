import { Metadata } from 'next';
import { SITE_CONFIG, SITE_URL } from './config';

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
  const ogImage = image || `${SITE_URL}/og/default.png`;

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
