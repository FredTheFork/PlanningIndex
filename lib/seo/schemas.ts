import { SITE_CONFIG, SITE_URL, SOCIAL_LINKS } from './config';

// JSON-LD Schema Generators for Foundationary

function generateOrganizationSchema() {
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
      telephone: SITE_CONFIG.phone,
      contactType: 'customer service',
      areaServed: 'GB',
      availableLanguage: 'English',
    },
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'GB',
    },
    foundingDate: SITE_CONFIG.foundingDate,
    priceRange: '££',
  };
}

function generateWebSiteSchema() {
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
        urlTemplate: `${SITE_URL}/blog?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function generateServiceSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Document Drafting Service',
    name: 'Business Foundations Pack',
    description: 'Professional business documents for UK sole traders including client contracts, GDPR privacy policies, invoice templates, and more.',
    provider: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      url: SITE_URL,
    },
    areaServed: {
      '@type': 'Country',
      name: 'United Kingdom',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Business Foundations Pack',
      itemListElement: [
        { '@type': 'Offer', itemOffered: 'Bespoke Client Contract' },
        { '@type': 'Offer', itemOffered: 'Terms & Conditions' },
        { '@type': 'Offer', itemOffered: 'GDPR Privacy Policy' },
        { '@type': 'Offer', itemOffered: 'Professional Bio' },
        { '@type': 'Offer', itemOffered: 'Elevator Pitch' },
        { '@type': 'Offer', itemOffered: 'LinkedIn Profile Script' },
        { '@type': 'Offer', itemOffered: 'Professional Invoice Template' },
        { '@type': 'Offer', itemOffered: 'New Client Welcome Emails' },
        { '@type': 'Offer', itemOffered: 'Late Payment Letters' },
        { '@type': 'Offer', itemOffered: 'Service Description Sheets' },
      ],
    },
    offers: {
      '@type': 'Offer',
      price: '79',
      priceCurrency: 'GBP',
      availability: 'https://schema.org/InStock',
      priceValidUntil: '2025-12-31',
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

export function generateArticleSchema(article: {
  title: string;
  description: string;
  slug: string;
  date: string;
  modifiedDate?: string;
  author?: string;
  category: string;
  image?: string;
}) {
  const url = `${SITE_URL}/blog/${article.slug}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    author: {
      '@type': 'Organization',
      name: article.author || SITE_CONFIG.name,
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
    datePublished: article.date,
    dateModified: article.modifiedDate || article.date,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    image: article.image ? {
      '@type': 'ImageObject',
      url: article.image,
    } : undefined,
    articleSection: article.category,
    inLanguage: 'en-GB',
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

export function generateHowToSchema(steps: Array<{ name: string; text: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to Get Your Business Foundations Pack',
    description: 'A simple 4-step process to get professional business documents for your UK sole trader business.',
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
    })),
    totalTime: 'PT24H',
    estimatedCost: {
      '@type': 'MonetaryAmount',
      currency: 'GBP',
      value: '79',
    },
  };
}

function generateLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE_URL}/#business`,
    name: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    url: SITE_URL,
    telephone: SITE_CONFIG.phone,
    email: SITE_CONFIG.email,
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'GB',
    },
    priceRange: '££',
    areaServed: {
      '@type': 'Country',
      name: 'United Kingdom',
    },
    openingHours: 'Mo-Fr 09:00-17:00',
    sameAs: [
      SOCIAL_LINKS.linkedin,
      SOCIAL_LINKS.twitter,
    ].filter(Boolean),
  };
}
