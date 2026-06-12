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
    serviceType: 'Business Foundations Platform',
    name: 'Foundationary Business Foundations Platform',
    description: 'Professional documents, website copy, social media posts, and ongoing maintenance for UK sole traders. UK law compliant, done for you, delivered fast.',
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
      name: 'Foundationary Services',
      itemListElement: [
        {
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
        {
          '@type': 'OfferCatalog',
          name: 'Website Copy Starter Pack',
          description: 'Professional website copy written in your voice, SEO-aware, ready to paste.',
        },
        {
          '@type': 'OfferCatalog',
          name: 'Social Media Starter Pack',
          description: 'Done-for-you social media posts tailored to your industry and audience.',
        },
        {
          '@type': 'OfferCatalog',
          name: 'Quarterly Document Refresh',
          description: 'Keep your documents accurate as your business evolves. One update per quarter.',
        },
      ],
    },
    offers: [
      {
        '@type': 'Offer',
        name: 'Business Foundations Pack',
        price: '79',
        priceCurrency: 'GBP',
        availability: 'https://schema.org/InStock',
      },
      {
        '@type': 'Offer',
        name: 'Website Copy Starter Pack',
        price: '35',
        priceCurrency: 'GBP',
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: '35',
          priceCurrency: 'GBP',
          referenceQuantity: { '@type': 'QuantitativeValue', value: '1', unitCode: 'PAGE' },
        },
        availability: 'https://schema.org/InStock',
      },
      {
        '@type': 'Offer',
        name: 'Social Media Starter Pack',
        price: '20',
        priceCurrency: 'GBP',
        availability: 'https://schema.org/InStock',
      },
      {
        '@type': 'Offer',
        name: 'Quarterly Document Refresh',
        price: '29',
        priceCurrency: 'GBP',
        availability: 'https://schema.org/InStock',
      },
    ],
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
    name: 'How to Get Your Business Foundations',
    description: 'A simple 3-step process to get professional business documents, website copy, and social media posts for your UK sole trader business.',
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
    })),
    totalTime: 'P5D',
    estimatedCost: {
      '@type': 'MonetaryAmount',
      currency: 'GBP',
      value: '20',
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
