import { SITE_CONFIG, SITE_URL, SOCIAL_LINKS } from './config';

export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_CONFIG.name,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description: SITE_CONFIG.description,
    sameAs: [
      SOCIAL_LINKS.linkedin,
      SOCIAL_LINKS.twitter,
    ].filter(Boolean),
    contactPoint: {
      '@type': 'ContactPoint',
      email: SITE_CONFIG.email,
      contactType: 'customer service',
      areaServed: 'GB',
      availableLanguage: 'English',
    },
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'GB',
    },
    foundingDate: SITE_CONFIG.foundingDate,
  };
}

export function generateWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_CONFIG.name,
    url: SITE_URL,
    description: SITE_CONFIG.description,
    inLanguage: 'en-GB',
    publisher: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      url: SITE_URL,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function generateBreadcrumbSchema(items: Array<{ name: string; path: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.path === '/' ? SITE_URL : `${SITE_URL}${item.path}`,
    })),
  };
}

export function generateWebPageSchema(options: {
  name: string;
  description: string;
  path: string;
  type?: string;
  datePublished?: string;
  dateModified?: string;
}) {
  const url = `${SITE_URL}${options.path}`;

  return {
    '@context': 'https://schema.org',
    '@type': options.type || 'WebPage',
    '@id': `${url}#webpage`,
    name: options.name,
    description: options.description,
    url,
    isPartOf: { '@id': `${SITE_URL}/#website` },
    about: { '@id': `${SITE_URL}/#organization` },
    inLanguage: 'en-GB',
    ...(options.datePublished && { datePublished: options.datePublished }),
    ...(options.dateModified && { dateModified: options.dateModified }),
  };
}

export function generateArticleSchema(options: {
  title: string;
  description: string;
  path: string;
  author: string;
  datePublished: string;
  dateModified?: string;
  image?: string;
  section?: string;
  tags?: string[];
}) {
  const url = `${SITE_URL}${options.path}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${url}#article`,
    headline: options.title,
    description: options.description,
    url,
    image: options.image || `${SITE_URL}/og/default.png`,
    datePublished: options.datePublished,
    dateModified: options.dateModified || options.datePublished,
    author: {
      '@type': 'Organization',
      name: options.author,
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    ...(options.section && { articleSection: options.section }),
    ...(options.tags && { keywords: options.tags.join(', ') }),
    inLanguage: 'en-GB',
  };
}

export function generateArticleSchema(options: {
  title: string;
  description: string;
  path: string;
  author: string;
  datePublished: string;
  dateModified?: string;
  image?: string;
  section?: string;
  tags?: string[];
}) {
  const url = `${SITE_URL}${options.path}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${url}#article`,
    headline: options.title,
    description: options.description,
    url,
    image: options.image || `${SITE_URL}/og/default.png`,
    datePublished: options.datePublished,
    dateModified: options.dateModified || options.datePublished,
    author: {
      '@type': 'Organization',
      name: options.author,
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    ...(options.section && { articleSection: options.section }),
    ...(options.tags && { keywords: options.tags.join(', ') }),
    inLanguage: 'en-GB',
  };
}
