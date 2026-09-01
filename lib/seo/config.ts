export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://planningindex.co.uk';

export const SITE_CONFIG = {
  name: 'PlanningIndex',
  tagline: 'UK Planning Application Intelligence',
  description: 'Search, track, and act on UK planning applications. PlanningIndex gives you real-time planning data, geographic search, and CRM tools for planning professionals.',
  url: SITE_URL,
  locale: 'en_GB',
  language: 'en-GB',
  country: 'GB',
  currency: 'GBP',
  timezone: 'Europe/London',
  email: 'hello@planningindex.co.uk',
  phone: '',
  twitterHandle: '@PlanningIndex',
  foundingDate: '2026',
};

export const KEYWORDS = {
  primary: [
    'UK planning applications',
    'planning application search',
    'planning permission UK',
    'planning intelligence',
    'planning data UK',
    'planning portal search',
  ],
  secondary: [
    'planning leads',
    'planning CRM',
    'planning pipeline',
    'planning proposals',
    'planning consultants UK',
    'planning agents',
  ],
  longTail: [
    'how to find planning applications UK',
    'planning application search by postcode',
    'planning application map search',
  ],
};

export const SOCIAL_LINKS = {
  linkedin: 'https://www.linkedin.com/company/planningindex',
  twitter: 'https://twitter.com/PlanningIndex',
};

export const OG_IMAGES = {
  default: `${SITE_URL}/og/default.png`,
  blog: `${SITE_URL}/og/blog.png`,
  pricing: `${SITE_URL}/og/pricing.png`,
  about: `${SITE_URL}/og/about.png`,
};

export const NAVIGATION = {
  main: [
    { name: 'Features', href: '/features' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Resources', href: '/resources' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Use', href: '/terms' },
  ],
};
