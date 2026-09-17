export interface PricingTier {
  name: string;
  slug: string;
  description: string;
  monthlyPrice: number | null;
  annualPrice: number | null;
  priceSuffix: string;
  monthlyStripePriceId: string;
  annualStripePriceId: string;
  popular?: boolean;
  trial?: boolean;
  features: string[];
  ctaLabel: string;
  ctaHref: string;
}

export const pricingTiers: PricingTier[] = [
  {
    name: 'Free Trial',
    slug: 'trial',
    description: 'Try everything PlanningIndex offers, free.',
    monthlyPrice: 0,
    annualPrice: 0,
    priceSuffix: '/14 days',
    trial: true,
    features: [
      'Full access for 14 days',
      'All councils',
      'CRM pipeline',
      'Proposal builder',
      'No credit card required',
    ],
    ctaLabel: 'Start Free Trial',
    ctaHref: '/choose-plan',
    monthlyStripePriceId: '',
    annualStripePriceId: '',
  },
  {
    name: 'Local',
    slug: 'local',
    description: 'For solo tradespeople covering a single area.',
    monthlyPrice: 29,
    annualPrice: 279,
    priceSuffix: '/month',
    features: [
      '1 council',
      'Planning search',
      'Map view',
      'Basic filters',
      'Lead management',
      'Email support',
    ],
    ctaLabel: 'Get Local',
    ctaHref: '/choose-plan',
    monthlyStripePriceId: 'price_1UFzZlGgxdIg5idJyvnMAkLy',
    annualStripePriceId: 'price_1UFzZlGgxdIg5idJwFY77xPK',
  },
  {
    name: 'Regional',
    slug: 'regional',
    description: 'For growing businesses covering a region.',
    monthlyPrice: 79,
    annualPrice: 759,
    priceSuffix: '/month',
    popular: true,
    features: [
      'Up to 10 councils',
      'Everything in Local, plus:',
      'Advanced filters',
      'CRM pipeline',
      'Proposal builder',
      'Physical mail (10/month)',
      'Priority support',
    ],
    ctaLabel: 'Get Regional',
    ctaHref: '/choose-plan',
    monthlyStripePriceId: 'price_1UFzZlGgxdIg5idJ3ThAISl5',
    annualStripePriceId: 'price_1UFzZlGgxdIg5idJgPZQQoX4',
  },
  {
    name: 'National',
    slug: 'national',
    description: 'For established companies covering the country.',
    monthlyPrice: 199,
    annualPrice: 1899,
    priceSuffix: '/month',
    features: [
      'All councils',
      'Everything in Regional, plus:',
      'Proposal templates',
      'Physical mail (50/month)',
      'API access',
      'Phone support',
    ],
    ctaLabel: 'Get National',
    ctaHref: '/choose-plan',
    monthlyStripePriceId: 'price_1UFzZlGgxdIg5idJJJ047109',
    annualStripePriceId: 'price_1UFzZmGgxdIg5idJ6TxrcxgY',
  },
  {
    name: 'Enterprise',
    slug: 'enterprise',
    description: 'For large organisations with custom needs.',
    monthlyPrice: null,
    annualPrice: null,
    priceSuffix: '',
    features: [
      'All councils',
      'Everything in National, plus:',
      'Custom integrations',
      'Dedicated account manager',
      'SLA',
      'Onboarding training',
    ],
    ctaLabel: 'Contact Sales',
    ctaHref: '/contact',
    monthlyStripePriceId: '',
    annualStripePriceId: '',
  },
];

export function getPricingTierBySlug(slug: string): PricingTier | undefined {
  return pricingTiers.find((tier) => tier.slug === slug);
}

export interface ComparisonRow {
  category: string;
  features: { label: string; values: (string | boolean)[] }[];
}

export const comparisonRows: ComparisonRow[] = [
  {
    category: 'Coverage',
    features: [
      { label: 'Councils', values: ['1', 'Up to 10', 'All', 'All'] },
      { label: 'Map view', values: [true, true, true, true] },
      { label: 'Radius search', values: [true, true, true, true] },
      { label: 'Daily updates', values: [true, true, true, true] },
    ],
  },
  {
    category: 'Search & Filters',
    features: [
      { label: 'Basic filters', values: [true, true, true, true] },
      { label: 'Advanced filters', values: [false, true, true, true] },
      { label: 'Keyword search', values: [true, true, true, true] },
      { label: 'Saved searches', values: [false, true, true, true] },
    ],
  },
  {
    category: 'CRM & Leads',
    features: [
      { label: 'Lead management', values: [true, true, true, true] },
      { label: 'CRM pipeline', values: [false, true, true, true] },
      { label: 'Notes & follow-ups', values: [true, true, true, true] },
      { label: 'Activity history', values: [false, true, true, true] },
    ],
  },
  {
    category: 'Proposals',
    features: [
      { label: 'Proposal builder', values: [false, true, true, true] },
      { label: 'Proposal templates', values: [false, false, true, true] },
      { label: 'Physical mail', values: [false, '10/month', '50/month', 'Unlimited'] },
      { label: 'Delivery tracking', values: [false, true, true, true] },
    ],
  },
  {
    category: 'Support',
    features: [
      { label: 'Email support', values: [true, true, true, true] },
      { label: 'Priority support', values: [false, true, true, true] },
      { label: 'Phone support', values: [false, false, true, true] },
      { label: 'Dedicated manager', values: [false, false, false, true] },
    ],
  },
];

export const pricingFaqs = [
  { q: 'Can I change plans at any time?', a: 'Yes. You can upgrade, downgrade, or cancel your subscription at any time. Changes take effect immediately and we prorate any difference in cost.' },
  { q: 'Is there a free trial?', a: 'Yes, every plan comes with a 14-day free trial with full access. No credit card required to start.' },
  { q: 'What happens to my data if I cancel?', a: 'Your data is retained for 90 days after cancellation. You can export your leads, proposals, and notes at any time from your account settings.' },
  { q: 'Do prices include VAT?', a: 'All prices shown are exclusive of VAT. VAT at the standard UK rate of 20% is added at checkout for UK-based customers.' },
  { q: 'Can I pay annually?', a: 'Yes. Annual billing saves you 20% compared to monthly billing. You can switch between monthly and annual at any time from your billing settings.' },
];
