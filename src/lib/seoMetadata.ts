// SEO metadata for all pages
export const seoMetadata = {
  home: {
    title: 'Foundationary — Business Foundations. Fast. | Professional Documents for UK Sole Traders',
    description: '10 professional business documents for UK sole traders. Client contracts, GDPR privacy policies, invoices, bios, pitches. Done for you. Delivered in 24 hours. £79 one-time.',
    keywords: 'sole trader documents UK, freelancer contract template UK, GDPR privacy policy sole trader, UK business documents, freelancer legal documents UK',
    ogImage: 'https://foundationary.vercel.app/images/og/og-home.png',
    canonical: 'https://foundationary.vercel.app/',
  },
  whatsIncluded: {
    title: "What's Included — Business Foundations Pack | Foundationary",
    description: '10 professional documents explained: client contract, GDPR privacy policy, invoice template, professional bio, elevator pitches, LinkedIn profile, welcome emails, and more.',
    keywords: 'what\'s included business documents, client contract, privacy policy, invoice template, professional bio',
    ogImage: 'https://foundationary.vercel.app/images/og/og-whats-included.png',
    canonical: 'https://foundationary.vercel.app/whats-included',
  },
  pricing: {
    title: 'Pricing — £79 for 10 Professional Documents | Foundationary',
    description: 'One price. No surprises. £79 for 10 professional business documents. Delivered in 24 hours. Additional services available. UK sole traders & freelancers.',
    keywords: 'business documents pricing, contract template cost, professional documents UK, affordable business documents',
    ogImage: 'https://foundationary.vercel.app/images/og/og-pricing.png',
    canonical: 'https://foundationary.vercel.app/pricing',
  },
  howItWorks: {
    title: 'How It Works — Complete Your Questionnaire | Foundationary',
    description: 'Simple 3-step process: Complete questionnaire (20-30 min) → We generate your documents → Receive in 24 hours. Professional, specific, done for you.',
    keywords: 'how it works, document process, questionnaire, turnaround time',
    ogImage: 'https://foundationary.vercel.app/images/og/og-how-it-works.png',
    canonical: 'https://foundationary.vercel.app/how-it-works',
  },
  blog: {
    title: 'Blog — Resources for UK Sole Traders and Freelancers | Foundationary',
    description: 'Expert guides, legal insights, and practical tips for UK sole traders and freelancers. GDPR, contracts, invoicing, business setup, and more.',
    keywords: 'sole trader blog UK, freelancer advice, GDPR compliance, business guides',
    ogImage: 'https://foundationary.vercel.app/images/og/og-blog.png',
    canonical: 'https://foundationary.vercel.app/blog',
  },
  additionalServices: {
    title: 'Additional Services — Beyond the Business Pack | Foundationary',
    description: 'Website copy starter pack, social media copy, quarterly document refresh. Expand your business foundations.',
    keywords: 'additional services, website copy, social media, document refresh',
    ogImage: 'https://foundationary.vercel.app/images/og/og-services.png',
    canonical: 'https://foundationary.vercel.app/additional-services',
  },
  about: {
    title: 'About Foundationary — Who We Are | Foundationary',
    description: 'Meet the team behind Foundationary. We help UK sole traders and freelancers set up their business properly with professional documents.',
    keywords: 'about foundationary, company background, mission',
    ogImage: 'https://foundationary.vercel.app/images/og/og-about.png',
    canonical: 'https://foundationary.vercel.app/about',
  },
  faq: {
    title: 'FAQ — Common Questions About Foundationary | Foundationary',
    description: 'Answers to common questions about our document package, process, pricing, and whether it\'s right for you.',
    keywords: 'frequently asked questions, FAQ, document questions, pricing questions',
    ogImage: 'https://foundationary.vercel.app/images/og/og-faq.png',
    canonical: 'https://foundationary.vercel.app/faq',
  },
  contact: {
    title: 'Contact Foundationary — Get in Touch | Foundationary',
    description: 'Have questions? Get in touch with Foundationary. Email, phone, or contact form. We respond within 24 hours.',
    keywords: 'contact foundationary, get in touch, customer support',
    ogImage: 'https://foundationary.vercel.app/images/og/og-contact.png',
    canonical: 'https://foundationary.vercel.app/contact',
  },
  privacy: {
    title: 'Privacy Policy — Data Protection | Foundationary',
    description: 'Our privacy policy. How we collect, use, and protect your personal data. GDPR compliant.',
    keywords: 'privacy policy, data protection, GDPR',
    ogImage: 'https://foundationary.vercel.app/images/og/og-home.png',
    canonical: 'https://foundationary.vercel.app/privacy',
  },
  terms: {
    title: 'Terms of Use — Legal Terms | Foundationary',
    description: 'Foundationary terms of use. Rights, responsibilities, and limitations.',
    keywords: 'terms of use, legal terms, conditions',
    ogImage: 'https://foundationary.vercel.app/images/og/og-home.png',
    canonical: 'https://foundationary.vercel.app/terms',
  },
};

// Social media sharing helpers
export const generateSocialImage = (pageKey: keyof typeof seoMetadata) => {
  return seoMetadata[pageKey].ogImage;
};

// Breadcrumb generator
export const generateBreadcrumbs = (path: string) => {
  const breadcrumbs = [{ name: 'Home', url: '/' }];

  if (path === '/') return breadcrumbs;

  const segments = path.split('/').filter(Boolean);
  let currentPath = '';

  segments.forEach((segment) => {
    currentPath += `/${segment}`;
    const name = segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    breadcrumbs.push({ name, url: currentPath });
  });

  return breadcrumbs;
};

// Schema.org helpers
export const generateWebPageSchema = (pageKey: keyof typeof seoMetadata, currentPath: string) => {
  const metadata = seoMetadata[pageKey];
  const breadcrumbs = generateBreadcrumbs(currentPath);

  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    'name': metadata.title,
    'description': metadata.description,
    'url': metadata.canonical,
    'image': metadata.ogImage,
    'inLanguage': 'en-GB',
    'publisher': {
      '@id': 'https://foundationary.vercel.app/#organization',
    },
    'breadcrumb': {
      '@type': 'BreadcrumbList',
      'itemListElement': breadcrumbs.map((breadcrumb, index) => ({
        '@type': 'ListItem',
        'position': index + 1,
        'name': breadcrumb.name,
        'item': `https://foundationary.vercel.app${breadcrumb.url}`,
      })),
    },
  };
};

// Article schema generator
export const generateArticleSchema = (article: {
  title: string;
  description: string;
  date: string;
  category: string;
  slug: string;
  readTime: number;
}) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    'headline': article.title,
    'description': article.description,
    'datePublished': new Date(article.date).toISOString(),
    'dateModified': new Date(article.date).toISOString(),
    'author': {
      '@type': 'Organization',
      'name': 'Foundationary',
      'url': 'https://foundationary.vercel.app',
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'Foundationary',
      'url': 'https://foundationary.vercel.app',
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://foundationary.vercel.app/FoundationaryLogo.png',
      },
    },
    'articleSection': article.category,
    'keywords': article.title,
    'url': `https://foundationary.vercel.app/blog/${article.slug}`,
    'wordCount': Math.ceil((article.readTime * 250)), // estimate: ~250 words per minute reading
  };
};

// Internal links for SEO
export const internalLinks = {
  primary: [
    { text: 'What\'s Included', href: '/whats-included' },
    { text: 'Pricing', href: '/pricing' },
    { text: 'How It Works', href: '/how-it-works' },
    { text: 'Blog', href: '/blog' },
  ],
  secondary: [
    { text: 'About', href: '/about' },
    { text: 'FAQ', href: '/faq' },
    { text: 'Contact', href: '/contact' },
    { text: 'Additional Services', href: '/additional-services' },
  ],
  legal: [
    { text: 'Privacy Policy', href: '/privacy' },
    { text: 'Terms of Use', href: '/terms' },
  ],
};
