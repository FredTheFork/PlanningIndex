// SEO Configuration for Foundationary
// Centralized configuration for all SEO-related settings

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://foundationary.vercel.app';

export const SITE_CONFIG = {
  name: 'Foundationary',
  tagline: 'Business Foundations for UK Sole Traders',
  description: 'Professional documents, website copy, social media posts, and ongoing maintenance for UK sole traders. UK law compliant, done for you, delivered fast. From £20.',
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
    'website copy for sole traders UK',
    'social media posts for freelancers UK',
    'quarterly document refresh',
    'business foundations platform UK',
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
    'sole trader website copy',
    'done for you social media UK',
    'business content for freelancers',
    'sole trader subscription service UK',
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

const NAVIGATION = {
  main: [
    { name: 'Services', href: '/services' },
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
