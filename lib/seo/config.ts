// SEO Configuration for Foundationary
// Centralized configuration for all SEO-related settings

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://foundationary.co.uk';

export const SITE_CONFIG = {
  name: 'Foundationary',
  tagline: 'Business Foundations for UK Sole Traders',
  description: 'Professional business documents for UK sole traders. Client contracts, GDPR privacy policies, invoice templates - UK law compliant, delivered in 24 hours. £79 one-time.',
  url: SITE_URL,
  locale: 'en_GB',
  language: 'en-GB',
  country: 'GB',
  currency: 'GBP',
  timezone: 'Europe/London',
  email: 'foundationarybusiness@gmail.com',
  phone: '+44 7377 203834',
  twitterHandle: '@Foundationary',
  foundingDate: '2024',
};

export const KEYWORDS = {
  primary: [
    'sole trader UK',
    'business documents UK',
    'sole trader contract',
    'GDPR privacy policy sole trader',
    'invoice template UK',
    'sole trader business setup',
  ],
  secondary: [
    'freelancer documents UK',
    'client contract UK',
    'terms and conditions sole trader',
    'privacy policy UK',
    'business foundations UK',
    'sole trader registration',
    'self employed UK',
    'UK freelancer',
  ],
  longTail: [
    'how to register as sole trader UK',
    'sole trader tax return guide',
    'best business bank account sole trader UK',
    'sole trader vs limited company UK',
    'what expenses can I claim as a sole trader',
  ],
};

export const SOCIAL_LINKS = {
  linkedin: 'https://www.linkedin.com/company/foundationary',
  twitter: 'https://twitter.com/foundationary',
};

export const OG_IMAGES = {
  default: `${SITE_URL}/og/default.png`,
  blog: `${SITE_URL}/og/blog.png`,
  pricing: `${SITE_URL}/og/pricing.png`,
  about: `${SITE_URL}/og/about.png`,
};

export const NAVIGATION = {
  main: [
    { name: 'What\'s Included', href: '/whats-included' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'How It Works', href: '/how-it-works' },
    { name: 'Blog', href: '/blog' },
    { name: 'About', href: '/about' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Contact', href: '/contact' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Use', href: '/terms' },
  ],
};
