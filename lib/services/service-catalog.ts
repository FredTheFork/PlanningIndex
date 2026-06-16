// Foundationary Service Catalog
// Defines every purchasable service as a first-class entity.
// This is the single source of truth for what we sell.

type ServiceMode = 'payment' | 'subscription';
export type ServiceTier = 'foundation' | 'operations' | 'industry';
export type IndustryCategory = 'coach' | 'photographer' | 'consultant' | 'contractor' | 'general';

export interface PricingTier {
  quantity: number;
  price: number;
  label: string;
  stripePriceId: { test: string; live: string };
}

export interface ServiceCatalogEntry {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  price: number;
  currency: string;
  currencySymbol: string;
  mode: ServiceMode;
  /** Stripe price IDs per environment (for simple pricing). Set after creating products in Stripe Dashboard. */
  stripePriceIds: { test: string; live: string };
  /** Stripe product IDs per environment. */
  stripeProductIds: { test: string; live: string };
  /** What the customer receives — shown on checkout and pricing pages. */
  includes: string[];
  /** Whether this service requires an intake form to be completed. */
  requiresIntake: boolean;
  /** Intake form section IDs this service needs (from intake-definition.ts). */
  intakeSections: string[];
  /** Whether this service can be purchased on its own (without the core pack). */
  isStandalone: boolean;
  /** Display order on pricing/checkout pages. Lower = shown first. */
  sortOrder: number;
  /** @deprecated Use tier === 'foundation' && isStandalone instead. */
  isCore: boolean;
  /** Subscription interval (only for mode='subscription'). */
  subscriptionInterval?: 'month' | 'year';
  /** Human-readable price label (e.g. "£79 — one-time", "£29 per quarter"). */
  priceLabel: string;
  /** For services with quantity-based pricing (e.g., social media posts). */
  pricingTiers?: PricingTier[];
  /** Default quantity for tiered pricing services. */
  defaultQuantity?: number;
  /** Unit name for quantity-based services (e.g., "posts"). */
  quantityUnit?: string;
  /** Which pricing tier this service belongs to. */
  tier: ServiceTier;
  /** Which industry this service targets (null for non-industry services). */
  industry: IndustryCategory | null;
  /** Which bundle group this service naturally belongs to (null if none). */
  serviceGroup: string | null;
  /** Service IDs that complement this one (for recommendation engine). */
  relatedServiceIds: string[];
  /** Display badge (e.g. "Best Seller", "New", "Most Popular"). */
  badge: string | null;
}

// ── Service Groups (Bundles) ──

export interface ServiceGroup {
  id: string;
  name: string;
  description: string;
  serviceIds: string[];
  discountPercent: number;
  tier: ServiceTier;
  badge: string | null;
}

export const serviceGroups: ServiceGroup[] = [
  {
    id: 'foundation_bundle',
    name: 'Foundation Bundle',
    description: 'Everything to start your business — documents, website, and social media.',
    serviceIds: ['business_foundations_pack', 'website_copy_pack', 'social_media_pack'],
    discountPercent: 15,
    tier: 'foundation',
    badge: 'Best Value',
  },
  {
    id: 'operations_bundle',
    name: 'Operations Bundle',
    description: 'Protect your business with client onboarding and payment protection.',
    serviceIds: ['client_onboarding_pack', 'payment_protection_pack'],
    discountPercent: 10,
    tier: 'operations',
    badge: null,
  },
  {
    id: 'compliance_bundle',
    name: 'Compliance Bundle',
    description: 'Protect your intellectual property and ensure full GDPR compliance.',
    serviceIds: ['copyright_licensing_pack', 'gdpr_deep_pack'],
    discountPercent: 10,
    tier: 'operations',
    badge: null,
  },
  {
    id: 'full_operations_bundle',
    name: 'Full Operations Bundle',
    description: 'Complete operational protection — onboarding, payments, IP, and GDPR.',
    serviceIds: ['client_onboarding_pack', 'payment_protection_pack', 'copyright_licensing_pack', 'gdpr_deep_pack'],
    discountPercent: 15,
    tier: 'operations',
    badge: 'Most Popular',
  },
  {
    id: 'coach_full_bundle',
    name: 'Coach Complete Bundle',
    description: 'All operations packs plus coach-specific documents and compliance.',
    serviceIds: ['client_onboarding_pack', 'payment_protection_pack', 'copyright_licensing_pack', 'gdpr_deep_pack', 'coach_industry_pack'],
    discountPercent: 20,
    tier: 'industry',
    badge: null,
  },
  {
    id: 'photographer_full_bundle',
    name: 'Photographer Complete Bundle',
    description: 'All operations packs plus photographer-specific documents and compliance.',
    serviceIds: ['client_onboarding_pack', 'payment_protection_pack', 'copyright_licensing_pack', 'gdpr_deep_pack', 'photographer_industry_pack'],
    discountPercent: 20,
    tier: 'industry',
    badge: null,
  },
  {
    id: 'consultant_full_bundle',
    name: 'Consultant Complete Bundle',
    description: 'All operations packs plus consultant-specific documents and compliance.',
    serviceIds: ['client_onboarding_pack', 'payment_protection_pack', 'copyright_licensing_pack', 'gdpr_deep_pack', 'consultant_industry_pack'],
    discountPercent: 20,
    tier: 'industry',
    badge: null,
  },
  {
    id: 'contractor_full_bundle',
    name: 'Contractor Complete Bundle',
    description: 'All operations packs plus contractor-specific documents and H&S compliance.',
    serviceIds: ['client_onboarding_pack', 'payment_protection_pack', 'copyright_licensing_pack', 'gdpr_deep_pack', 'contractor_industry_pack'],
    discountPercent: 20,
    tier: 'industry',
    badge: null,
  },
  {
    id: 'complete_infrastructure_bundle',
    name: 'Complete Infrastructure Bundle',
    description: 'Every pack we offer — the full business infrastructure, built for you.',
    serviceIds: [
      'business_foundations_pack', 'website_copy_pack', 'social_media_pack',
      'client_onboarding_pack', 'payment_protection_pack', 'copyright_licensing_pack', 'gdpr_deep_pack',
      'coach_industry_pack', 'photographer_industry_pack', 'consultant_industry_pack', 'contractor_industry_pack',
    ],
    discountPercent: 25,
    tier: 'industry',
    badge: 'Ultimate',
  },
];

const stripeMode = (process.env.NEXT_PUBLIC_STRIPE_MODE ?? 'test') as 'test' | 'live';

/** Bundle discount tiers based on number of services purchased (fallback when no group applies). */
export const BUNDLE_DISCOUNT_TIERS = {
  1: { percentage: 0, label: '' },
  2: { percentage: 10, label: '10% bundle discount' },
  3: { percentage: 15, label: '15% bundle discount — best value' },
} as const;

/** Get the discount percentage for a given number of services. */
export function getBundleDiscountPercentage(serviceCount: number): number {
  if (serviceCount >= 3) return 15;
  if (serviceCount >= 2) return 10;
  return 0;
}

/** Get the discount label for a given number of services. */
export function getBundleDiscountLabel(serviceCount: number): string {
  if (serviceCount >= 3) return BUNDLE_DISCOUNT_TIERS[3].label;
  if (serviceCount >= 2) return BUNDLE_DISCOUNT_TIERS[2].label;
  return '';
}

// ── Service Catalog ──

export const serviceCatalog: ServiceCatalogEntry[] = [
  // ── FOUNDATION TIER ──

  {
    id: 'business_foundations_pack',
    name: 'Business Foundations Pack',
    description:
      'Complete business foundations pack for UK sole traders — 10 bespoke documents delivered in 24 hours.',
    shortDescription: '10 bespoke business documents — contracts, terms, policies, and more.',
    price: 79.0,
    currency: 'gbp',
    currencySymbol: '£',
    mode: 'payment',
    stripePriceIds: {
      test: 'price_1TZc9UGfxcDbzGRtniOLIJLE',
      live: 'price_1TX34AGfxcDbzGRtxVtQN95g',
    },
    stripeProductIds: {
      test: 'prod_UdvhNsQZM3C2RL',
      live: 'prod_UdvhNsQZM3C2RL',
    },
    includes: [
      'Bespoke Client Contract',
      'Terms & Conditions',
      'GDPR Privacy Policy',
      'Professional Bio',
      'Elevator Pitch (3 versions)',
      'LinkedIn Profile Script',
      'Professional Invoice Template',
      'New Client Welcome Emails (x3)',
      'Late Payment Letters (x3)',
      'Service Description Sheets',
    ],
    requiresIntake: true,
    intakeSections: [
      'intro', 'business_identity', 'services', 'clients', 'pricing',
      'gdpr', 'legal', 'brand', 'invoice', 'linkedin', 'final',
    ],
    isStandalone: true,
    sortOrder: 1,
    isCore: true,
    priceLabel: '£79 — one-time',
    tier: 'foundation',
    industry: null,
    serviceGroup: 'foundation_bundle',
    relatedServiceIds: ['website_copy_pack', 'social_media_pack', 'client_onboarding_pack'],
    badge: 'Best Seller',
  },
  {
    id: 'website_copy_pack',
    name: 'Website Copy Starter Pack',
    description:
      'A fully built, ready-to-deploy website created from your brand voice and services — delivered as source files and a hosted preview.',
    shortDescription: 'A fully built website tailored to your brand — ready to deploy.',
    price: 35.0,
    currency: 'gbp',
    currencySymbol: '£',
    mode: 'payment',
    stripePriceIds: {
      test: 'price_1TgSEkGfxcDbzGRtDaBz70tR',
      live: '',
    },
    stripeProductIds: {
      test: 'prod_UfnqtTGEWkoXYK',
      live: 'prod_UfnqtTGEWkoXYK',
    },
    includes: [
      'Homepage (hero, benefits, CTA)',
      'About page',
      'Services page (aligned with your service sheets)',
      'Contact page',
      'FAQ, Blog, Pricing, or Testimonials pages (as needed)',
      'Fully built website — ready to deploy',
      'Website source files (ZIP download)',
      'Hosted preview URL to review before deploying',
    ],
    requiresIntake: true,
    intakeSections: [
      'intro', 'business_identity', 'services', 'clients', 'brand', 'website_copy', 'final',
    ],
    isStandalone: true,
    sortOrder: 2,
    isCore: false,
    priceLabel: 'From £35 — per page',
    defaultQuantity: 1,
    quantityUnit: 'pages',
    tier: 'foundation',
    industry: null,
    serviceGroup: 'foundation_bundle',
    relatedServiceIds: ['business_foundations_pack', 'social_media_pack'],
    badge: null,
    pricingTiers: [
      { quantity: 1, price: 35, label: '1 page — £35', stripePriceId: { test: 'price_1TgXZQGfxcDbzGRtkovnGBSm', live: '' } },
      { quantity: 2, price: 65, label: '2 pages — £65', stripePriceId: { test: 'price_1TgXZYGfxcDbzGRtnokfBuT3', live: '' } },
      { quantity: 3, price: 90, label: '3 pages — £90', stripePriceId: { test: 'price_1TgXa9GfxcDbzGRtcQYtwDeI', live: '' } },
      { quantity: 4, price: 115, label: '4 pages — £115', stripePriceId: { test: 'price_1TgXbFGfxcDbzGRtuRAV2SGv', live: '' } },
      { quantity: 5, price: 139, label: '5 pages — £139', stripePriceId: { test: 'price_1TgSEkGfxcDbzGRtDaBz70tR', live: '' } },
      { quantity: 6, price: 160, label: '6 pages — £160', stripePriceId: { test: 'price_1TgXbQGfxcDbzGRteGhQeYwJ', live: '' } },
      { quantity: 7, price: 180, label: '7 pages — £180', stripePriceId: { test: 'price_1TgXbZGfxcDbzGRtjlm9GL6Z', live: '' } },
      { quantity: 8, price: 200, label: '8 pages — £200', stripePriceId: { test: 'price_1TgXbhGfxcDbzGRtlqg1FHhk', live: '' } },
      { quantity: 9, price: 218, label: '9 pages — £218', stripePriceId: { test: 'price_1TgXbxGfxcDbzGRtnTF07CE2', live: '' } },
      { quantity: 10, price: 235, label: '10 pages — £235', stripePriceId: { test: 'price_1TgXc3GfxcDbzGRtHs7m8tou', live: '' } },
    ],
  },
  {
    id: 'social_media_pack',
    name: 'Social Media Starter Pack',
    description:
      'Done-for-you posts tailored to your industry, audience, and offer. Choose from 5 to 30 posts.',
    shortDescription: 'Done-for-you social posts tailored to your brand and audience.',
    price: 20.0,
    currency: 'gbp',
    currencySymbol: '£',
    mode: 'payment',
    stripePriceIds: {
      test: 'price_1Tfo0mGfxcDbzGRtHqF3MmVv',
      live: '',
    },
    stripeProductIds: {
      test: 'prod_Ufnsr70N1uRKfN',
      live: 'prod_Ufnsr70N1uRKfN',
    },
    includes: [
      'Educational posts',
      'Promotional posts',
      'Personal / trust-building posts',
      'Captions & hashtag suggestions',
    ],
    requiresIntake: true,
    intakeSections: [
      'intro', 'business_identity', 'services', 'brand', 'social_media', 'final',
    ],
    isStandalone: true,
    sortOrder: 3,
    isCore: false,
    priceLabel: 'From £20 — 5 posts',
    defaultQuantity: 5,
    quantityUnit: 'posts',
    tier: 'foundation',
    industry: null,
    serviceGroup: 'foundation_bundle',
    relatedServiceIds: ['business_foundations_pack', 'website_copy_pack'],
    badge: null,
    pricingTiers: [
      { quantity: 5, price: 20, label: '5 posts — £20', stripePriceId: { test: 'price_1TgTD4GfxcDbzGRtwfjjKSc9', live: '' } },
      { quantity: 10, price: 40, label: '10 posts — £40', stripePriceId: { test: 'price_1TgT9eGfxcDbzGRtZFH9msuO', live: '' } },
      { quantity: 15, price: 57, label: '15 posts — £57', stripePriceId: { test: 'price_1TgTAGGfxcDbzGRtYvH7lEYi', live: '' } },
      { quantity: 20, price: 73, label: '20 posts — £73', stripePriceId: { test: 'price_1TgTAZGfxcDbzGRt6ehHzu2X', live: '' } },
      { quantity: 25, price: 80, label: '25 posts — £80', stripePriceId: { test: 'price_1TgTAwGfxcDbzGRtBoXaKI19', live: '' } },
      { quantity: 30, price: 110, label: '30 posts — £110', stripePriceId: { test: 'price_1TgTCpGfxcDbzGRtmaTlfkcF', live: '' } },
    ],
  },
  {
    id: 'monthly_care_plan',
    name: 'Monthly Care Plan',
    description:
      'Keep your documents accurate as your business evolves. Monthly updates, ongoing support, and priority access.',
    shortDescription: 'Monthly document updates and ongoing business support.',
    price: 29.0,
    currency: 'gbp',
    currencySymbol: '£',
    mode: 'subscription',
    stripePriceIds: {
      test: 'price_1TgSI7GfxcDbzGRtm9vf0YRM',
      live: '',
    },
    stripeProductIds: {
      test: 'prod_UfntRYA1SkzyAD',
      live: 'prod_UfntRYA1SkzyAD',
    },
    includes: [
      'Monthly document updates',
      'Pricing and service changes',
      'GDPR regulation updates',
      'Priority support',
      'New document additions as your business grows',
    ],
    requiresIntake: false,
    intakeSections: [],
    isStandalone: false,
    sortOrder: 50,
    isCore: false,
    subscriptionInterval: 'month',
    priceLabel: '£29/month — cancel anytime',
    tier: 'foundation',
    industry: null,
    serviceGroup: null,
    relatedServiceIds: ['business_foundations_pack'],
    badge: null,
  },
  // Backward-compatible alias for existing quarterly_refresh subscriptions
  {
    id: 'quarterly_refresh',
    name: 'Quarterly Document Refresh',
    description:
      'Keep your documents accurate as your business evolves. Recurring billing every 4 months.',
    shortDescription: 'Quarterly document updates for your business.',
    price: 29.0,
    currency: 'gbp',
    currencySymbol: '£',
    mode: 'subscription',
    stripePriceIds: {
      test: 'price_1TgSI7GfxcDbzGRtm9vf0YRM',
      live: '',
    },
    stripeProductIds: {
      test: 'prod_UfntRYA1SkzyAD',
      live: 'prod_UfntRYA1SkzyAD',
    },
    includes: [
      'One document update per quarter',
      'Pricing changes',
      'New services',
      'GDPR updates if needed',
    ],
    requiresIntake: false,
    intakeSections: [],
    isStandalone: false,
    sortOrder: 51,
    isCore: false,
    subscriptionInterval: 'month',
    priceLabel: '£29 every 4 months',
    tier: 'foundation',
    industry: null,
    serviceGroup: null,
    relatedServiceIds: ['business_foundations_pack', 'monthly_care_plan'],
    badge: null,
  },

  // ── OPERATIONS TIER ──

  {
    id: 'client_onboarding_pack',
    name: 'Client Onboarding & Scope Control Pack',
    description:
      'Professional onboarding systems that prevent scope creep, set clear expectations, and protect your time from day one.',
    shortDescription: 'Onboarding systems and scope control — protect your time from day one.',
    price: 149.0,
    currency: 'gbp',
    currencySymbol: '£',
    mode: 'payment',
    stripePriceIds: {
      test: 'price_test_client_onboarding_pack',
      live: 'price_live_client_onboarding_pack',
    },
    stripeProductIds: {
      test: 'prod_test_client_onboarding_pack',
      live: 'prod_live_client_onboarding_pack',
    },
    includes: [
      'Client Onboarding Questionnaire',
      'Scope of Work Document',
      'Project Brief Template',
      'Change Request Form',
      'Onboarding Checklist',
      'Client Communication Protocols',
      'Welcome Packet Guide',
      'Feedback & Closing Questionnaire',
    ],
    requiresIntake: true,
    intakeSections: [
      'intro', 'business_identity', 'services', 'clients', 'client_onboarding', 'final',
    ],
    isStandalone: true,
    sortOrder: 10,
    isCore: false,
    priceLabel: '£149 — one-time',
    tier: 'operations',
    industry: null,
    serviceGroup: 'operations_bundle',
    relatedServiceIds: ['payment_protection_pack', 'copyright_licensing_pack'],
    badge: 'New',
  },
  {
    id: 'payment_protection_pack',
    name: 'Payment Protection Pack',
    description:
      'Comprehensive payment protection system — invoicing terms, late payment recovery, deposit protection, and chargeback defense.',
    shortDescription: 'Payment protection — invoicing, late payments, deposits, and chargebacks.',
    price: 149.0,
    currency: 'gbp',
    currencySymbol: '£',
    mode: 'payment',
    stripePriceIds: {
      test: 'price_test_payment_protection_pack',
      live: 'price_live_payment_protection_pack',
    },
    stripeProductIds: {
      test: 'prod_test_payment_protection_pack',
      live: 'prod_live_payment_protection_pack',
    },
    includes: [
      'Invoice Terms & Conditions',
      'Late Payment Policy',
      'Payment Schedule Template',
      'Refund & Cancellation Policy',
      'Deposit & Cancellation Terms',
      'Payment Tracking Template',
      'Chasing Payment Scripts (x5)',
      'Chargeback Response Templates',
    ],
    requiresIntake: true,
    intakeSections: [
      'intro', 'business_identity', 'services', 'pricing', 'payment_protection', 'final',
    ],
    isStandalone: true,
    sortOrder: 11,
    isCore: false,
    priceLabel: '£149 — one-time',
    tier: 'operations',
    industry: null,
    serviceGroup: 'operations_bundle',
    relatedServiceIds: ['client_onboarding_pack', 'gdpr_deep_pack'],
    badge: null,
  },
  {
    id: 'copyright_licensing_pack',
    name: 'Copyright & Licensing Pack',
    description:
      'Protect your intellectual property — copyright notices, licensing agreements, NDAs, and brand usage rules.',
    shortDescription: 'IP protection — copyright, licensing, NDAs, and brand usage.',
    price: 149.0,
    currency: 'gbp',
    currencySymbol: '£',
    mode: 'payment',
    stripePriceIds: {
      test: 'price_test_copyright_licensing_pack',
      live: 'price_live_copyright_licensing_pack',
    },
    stripeProductIds: {
      test: 'prod_test_copyright_licensing_pack',
      live: 'prod_live_copyright_licensing_pack',
    },
    includes: [
      'Copyright Notice & IP Policy',
      'Content Licensing Agreement',
      'Image & Media Usage Rights',
      'Work-for-Hire Agreement',
      'Brand Usage Guidelines',
      'Non-Disclosure Agreement (NDA)',
      'IP Assignment Agreement',
      'Cease & Desist Template',
    ],
    requiresIntake: true,
    intakeSections: [
      'intro', 'business_identity', 'services', 'copyright_licensing', 'final',
    ],
    isStandalone: true,
    sortOrder: 12,
    isCore: false,
    priceLabel: '£149 — one-time',
    tier: 'operations',
    industry: null,
    serviceGroup: 'compliance_bundle',
    relatedServiceIds: ['payment_protection_pack', 'gdpr_deep_pack'],
    badge: null,
  },
  {
    id: 'gdpr_deep_pack',
    name: 'GDPR & Data Retention Deep Pack',
    description:
      'Beyond the basic privacy policy — comprehensive GDPR compliance with DPAs, breach procedures, consent management, and data retention schedules.',
    shortDescription: 'Deep GDPR compliance — DPAs, breach response, consent, and retention.',
    price: 199.0,
    currency: 'gbp',
    currencySymbol: '£',
    mode: 'payment',
    stripePriceIds: {
      test: 'price_test_gdpr_deep_pack',
      live: 'price_live_gdpr_deep_pack',
    },
    stripeProductIds: {
      test: 'prod_test_gdpr_deep_pack',
      live: 'prod_live_gdpr_deep_pack',
    },
    includes: [
      'Comprehensive Privacy Policy',
      'Data Retention Schedule',
      'Data Processing Agreement (DPA)',
      'Cookie Consent Implementation Guide',
      'Subject Access Request Template',
      'Data Breach Notification Template',
      'Data Protection Impact Assessment (DPIA)',
      'Marketing Consent Management Procedures',
      'Third-Party Data Sharing Agreement',
    ],
    requiresIntake: true,
    intakeSections: [
      'intro', 'business_identity', 'gdpr', 'gdpr_deep', 'final',
    ],
    isStandalone: true,
    sortOrder: 13,
    isCore: false,
    priceLabel: '£199 — one-time',
    tier: 'operations',
    industry: null,
    serviceGroup: 'compliance_bundle',
    relatedServiceIds: ['copyright_licensing_pack', 'payment_protection_pack'],
    badge: 'Essential',
  },

  // ── INDUSTRY TIER ──

  {
    id: 'coach_industry_pack',
    name: 'Coach Industry Pack',
    description:
      'Industry-specific documents for coaches — coaching agreements, session terms, ethical standards, and CPD tracking.',
    shortDescription: 'Coaching-specific documents — agreements, ethics, and CPD tracking.',
    price: 199.0,
    currency: 'gbp',
    currencySymbol: '£',
    mode: 'payment',
    stripePriceIds: {
      test: 'price_test_coach_industry_pack',
      live: 'price_live_coach_industry_pack',
    },
    stripeProductIds: {
      test: 'prod_test_coach_industry_pack',
      live: 'prod_live_coach_industry_pack',
    },
    includes: [
      'Coaching Agreement',
      'Session Terms & Cancellation Policy',
      'Supervision Policy',
      'CPD Tracker Template',
      'Coaching Code of Ethics',
      'Client Progress Tracker',
      'Testimonial Request Template',
    ],
    requiresIntake: true,
    intakeSections: [
      'intro', 'business_identity', 'services', 'clients', 'brand', 'industry_coach', 'final',
    ],
    isStandalone: true,
    sortOrder: 20,
    isCore: false,
    priceLabel: '£199 — one-time',
    tier: 'industry',
    industry: 'coach',
    serviceGroup: 'coach_full_bundle',
    relatedServiceIds: ['client_onboarding_pack', 'payment_protection_pack', 'copyright_licensing_pack'],
    badge: null,
  },
  {
    id: 'photographer_industry_pack',
    name: 'Photographer Industry Pack',
    description:
      'Industry-specific documents for photographers — licensing, model releases, delivery terms, and editing briefs.',
    shortDescription: 'Photographer-specific documents — licensing, releases, and delivery terms.',
    price: 249.0,
    currency: 'gbp',
    currencySymbol: '£',
    mode: 'payment',
    stripePriceIds: {
      test: 'price_test_photographer_industry_pack',
      live: 'price_live_photographer_industry_pack',
    },
    stripeProductIds: {
      test: 'prod_test_photographer_industry_pack',
      live: 'prod_live_photographer_industry_pack',
    },
    includes: [
      'Photography Licensing Agreement',
      'Model Release Form',
      'Shot List Template',
      'Delivery Terms & Timeline Policy',
      'Editing Brief Template',
      'Print Release Form',
      'Event Photography Terms',
    ],
    requiresIntake: true,
    intakeSections: [
      'intro', 'business_identity', 'services', 'clients', 'brand', 'industry_photographer', 'final',
    ],
    isStandalone: true,
    sortOrder: 21,
    isCore: false,
    priceLabel: '£249 — one-time',
    tier: 'industry',
    industry: 'photographer',
    serviceGroup: 'photographer_full_bundle',
    relatedServiceIds: ['copyright_licensing_pack', 'gdpr_deep_pack', 'payment_protection_pack'],
    badge: null,
  },
  {
    id: 'consultant_industry_pack',
    name: 'Consultant Industry Pack',
    description:
      'Industry-specific documents for consultants — consulting agreements, deliverables specs, knowledge transfer, and engagement closure.',
    shortDescription: 'Consultant-specific documents — agreements, deliverables, and handover.',
    price: 199.0,
    currency: 'gbp',
    currencySymbol: '£',
    mode: 'payment',
    stripePriceIds: {
      test: 'price_test_consultant_industry_pack',
      live: 'price_live_consultant_industry_pack',
    },
    stripeProductIds: {
      test: 'prod_test_consultant_industry_pack',
      live: 'prod_live_consultant_industry_pack',
    },
    includes: [
      'Consulting Agreement',
      'Consultant NDA',
      'Deliverables Specification',
      'Milestone Tracking Template',
      'Knowledge Transfer Protocol',
      'Consultant Code of Conduct',
      'Engagement Closure Report',
    ],
    requiresIntake: true,
    intakeSections: [
      'intro', 'business_identity', 'services', 'clients', 'brand', 'industry_consultant', 'final',
    ],
    isStandalone: true,
    sortOrder: 22,
    isCore: false,
    priceLabel: '£199 — one-time',
    tier: 'industry',
    industry: 'consultant',
    serviceGroup: 'consultant_full_bundle',
    relatedServiceIds: ['client_onboarding_pack', 'copyright_licensing_pack', 'payment_protection_pack'],
    badge: null,
  },
  {
    id: 'contractor_industry_pack',
    name: 'Contractor Industry Pack',
    description:
      'Industry-specific documents for contractors — H&S policy, risk assessments, method statements, COSHH, and CDM compliance.',
    shortDescription: 'Contractor-specific documents — H&S, risk assessments, and CDM compliance.',
    price: 299.0,
    currency: 'gbp',
    currencySymbol: '£',
    mode: 'payment',
    stripePriceIds: {
      test: 'price_test_contractor_industry_pack',
      live: 'price_live_contractor_industry_pack',
    },
    stripeProductIds: {
      test: 'prod_test_contractor_industry_pack',
      live: 'prod_live_contractor_industry_pack',
    },
    includes: [
      'Health & Safety Policy',
      'Risk Assessment Template',
      'Method Statement',
      'COSHH Assessment',
      'Construction Phase Plan',
      'Subcontractor Agreement',
      'Site Induction Checklist',
      'Defect Liability Template',
    ],
    requiresIntake: true,
    intakeSections: [
      'intro', 'business_identity', 'services', 'clients', 'brand', 'industry_contractor', 'final',
    ],
    isStandalone: true,
    sortOrder: 23,
    isCore: false,
    priceLabel: '£299 — one-time',
    tier: 'industry',
    industry: 'contractor',
    serviceGroup: 'contractor_full_bundle',
    relatedServiceIds: ['gdpr_deep_pack', 'payment_protection_pack', 'client_onboarding_pack'],
    badge: null,
  },
];

// ── Helpers ──

export function getServiceById(id: string): ServiceCatalogEntry | undefined {
  return serviceCatalog.find((s) => s.id === id);
}

function getCoreService(): ServiceCatalogEntry {
  return serviceCatalog.find((s) => s.isCore)!;
}

function getStandaloneServices(): ServiceCatalogEntry[] {
  return serviceCatalog.filter((s) => s.isStandalone);
}

function getOptionalServices(): ServiceCatalogEntry[] {
  return serviceCatalog.filter((s) => !s.isCore);
}

/** Get all services in a given tier. */
export function getServicesByTier(tier: ServiceTier): ServiceCatalogEntry[] {
  return serviceCatalog.filter((s) => s.tier === tier);
}

/** Get all services for a given industry. */
export function getServicesByIndustry(industry: IndustryCategory): ServiceCatalogEntry[] {
  return serviceCatalog.filter((s) => s.industry === industry);
}

/** Get all service groups. */
export function getServiceGroups(): ServiceGroup[] {
  return serviceGroups;
}

/** Get a service group by its ID. */
export function getServiceGroupById(groupId: string): ServiceGroup | undefined {
  return serviceGroups.find((g) => g.id === groupId);
}

/** Get the service catalog entries for all services in a group. */
export function getServicesInGroup(groupId: string): ServiceCatalogEntry[] {
  const group = getServiceGroupById(groupId);
  if (!group) return [];
  return group.serviceIds
    .map((id) => getServiceById(id))
    .filter((s): s is ServiceCatalogEntry => s !== undefined);
}

/** Get related service entries for a given service. */
export function getRelatedServices(serviceId: string): ServiceCatalogEntry[] {
  const service = getServiceById(serviceId);
  if (!service) return [];
  return service.relatedServiceIds
    .map((id) => getServiceById(id))
    .filter((s): s is ServiceCatalogEntry => s !== undefined);
}

/**
 * Suggest the best matching bundle group based on what the user already owns.
 * Returns the group with the most overlap (excluding already-owned services),
 * or null if no group adds value beyond what's already owned.
 */
export function getRecommendedBundle(
  ownedServiceIds: string[]
): { group: ServiceGroup; newServiceIds: string[] } | null {
  const ownedSet = new Set(ownedServiceIds);
  let best: { group: ServiceGroup; newServiceIds: string[] } | null = null;
  let bestNewCount = 0;

  for (const group of serviceGroups) {
    const newIds = group.serviceIds.filter((id) => !ownedSet.has(id));
    if (newIds.length < 2) continue; // Not enough new services to recommend
    if (newIds.length > bestNewCount) {
      best = { group, newServiceIds: newIds };
      bestNewCount = newIds.length;
    }
  }

  return best;
}

/** Get the highest tier among a set of owned service IDs. */
export function getHighestTier(serviceIds: string[]): ServiceTier {
  const tiers = serviceIds
    .map((id) => getServiceById(id)?.tier)
    .filter((t): t is ServiceTier => t !== undefined);

  if (tiers.includes('industry')) return 'industry';
  if (tiers.includes('operations')) return 'operations';
  return 'foundation';
}

/** Whether a service is in the operations tier. */
export function isOperationsService(serviceId: string): boolean {
  return getServiceById(serviceId)?.tier === 'operations';
}

/** Whether a service is in the industry tier. */
export function isIndustryService(serviceId: string): boolean {
  return getServiceById(serviceId)?.tier === 'industry';
}

/** Whether a service ID is the monthly care plan or legacy quarterly refresh. */
export function isSubscriptionService(serviceId: string): boolean {
  return serviceId === 'monthly_care_plan' || serviceId === 'quarterly_refresh';
}

/** Get the active Stripe price ID for a service, based on current mode. */
export function getStripePriceId(serviceId: string): string | undefined {
  const service = getServiceById(serviceId);
  return service?.stripePriceIds[stripeMode];
}

/** Get the Stripe price ID for a specific quantity tier. */
export function getStripePriceIdForQuantity(serviceId: string, quantity: number): string | undefined {
  const service = getServiceById(serviceId);
  if (!service) return undefined;

  if (service.pricingTiers) {
    const tier = service.pricingTiers.find(t => t.quantity === quantity);
    return tier?.stripePriceId[stripeMode];
  }

  return service.stripePriceIds[stripeMode];
}

/** Get price for a service at a specific quantity. */
export function getServicePrice(serviceId: string, quantity?: number): number {
  const service = getServiceById(serviceId);
  if (!service) return 0;

  if (service.pricingTiers && quantity) {
    const tier = service.pricingTiers.find(t => t.quantity === quantity);
    return tier?.price ?? service.price;
  }

  return service.price;
}

/** Get price label for a service at a specific quantity. */
export function getServicePriceLabel(serviceId: string, quantity?: number): string {
  const service = getServiceById(serviceId);
  if (!service) return '';

  if (service.pricingTiers && quantity) {
    const tier = service.pricingTiers.find(t => t.quantity === quantity);
    if (tier) return `£${tier.price} — ${tier.quantity} ${service.quantityUnit || 'items'}`;
  }

  return service.priceLabel;
}

/** Get the active Stripe product ID for a service, based on current mode. */
function getStripeProductId(serviceId: string): string | undefined {
  const service = getServiceById(serviceId);
  return service?.stripeProductIds[stripeMode];
}

/**
 * Returns a user-facing savings message for the current selection, or null if no discount applies.
 */
export function getBundleSavingsMessage(subtotal: number, discountPercentage: number): string | null {
  if (discountPercentage <= 0) return null;
  const savings = subtotal * (discountPercentage / 100);
  if (discountPercentage >= 15) {
    return `Best value — ${discountPercentage}% off saves you £${savings.toFixed(0)}`;
  }
  return `${discountPercentage}% bundle discount applied — save £${savings.toFixed(0)}`;
}

/** Calculate options for price calculations. */
export interface CalculateTotalOptions {
  socialMediaPostCount?: number;
  websitePageCount?: number;
  /** If provided, apply this group's discount instead of count-based discount. */
  groupId?: string;
}

/** Calculate the total price for a set of selected service IDs, including percentage-based bundle discounts. */
export function calculateTotal(
  selectedServiceIds: string[],
  options?: CalculateTotalOptions
): {
  subtotal: number;
  discountPercentage: number;
  discountAmount: number;
  total: number;
  groupId: string | null;
  servicePrices: Array<{ id: string; name: string; originalPrice: number; discountedPrice: number }>;
} {
  const servicePrices: Array<{ id: string; name: string; originalPrice: number; discountedPrice: number }> = [];
  let subtotal = 0;

  for (const serviceId of selectedServiceIds) {
    const service = getServiceById(serviceId);
    if (!service) continue;

    let price: number;
    if (serviceId === 'social_media_pack' && options?.socialMediaPostCount) {
      price = getServicePrice(serviceId, options.socialMediaPostCount);
    } else if (serviceId === 'website_copy_pack' && options?.websitePageCount) {
      price = getServicePrice(serviceId, options.websitePageCount);
    } else if (service.pricingTiers && service.defaultQuantity) {
      price = getServicePrice(serviceId, service.defaultQuantity);
    } else {
      price = service.price;
    }

    subtotal += price;
    servicePrices.push({
      id: serviceId,
      name: service.name,
      originalPrice: price,
      discountedPrice: price,
    });
  }

  // Determine discount: group discount vs count-based, use whichever is greater
  let discountPercentage = getBundleDiscountPercentage(selectedServiceIds.length);
  let appliedGroupId: string | null = null;

  if (options?.groupId) {
    const group = getServiceGroupById(options.groupId);
    if (group) {
      discountPercentage = Math.max(discountPercentage, group.discountPercent);
      appliedGroupId = group.id;
    }
  }

  // Also check if the selected services fully match any group (auto-detect)
  if (!appliedGroupId) {
    for (const group of serviceGroups) {
      const selectedSet = new Set(selectedServiceIds);
      const groupSet = new Set(group.serviceIds);
      // Check if selected services are a superset of group services
      const isSuperset = [...groupSet].every((id) => selectedSet.has(id));
      if (isSuperset && group.serviceIds.length >= 2) {
        if (group.discountPercent > discountPercentage) {
          discountPercentage = group.discountPercent;
          appliedGroupId = group.id;
        }
      }
    }
  }

  const discountAmount = subtotal * (discountPercentage / 100);
  const total = subtotal - discountAmount;

  if (discountPercentage > 0) {
    servicePrices.forEach(sp => {
      sp.discountedPrice = sp.originalPrice * (1 - discountPercentage / 100);
    });
  }

  return { subtotal, discountPercentage, discountAmount, total, groupId: appliedGroupId, servicePrices };
}

export { stripeMode };

// ── Service-Form Mapping Validation ──
// Ensures intakeSections in the catalog match the serviceTags on form sections.

import { allFormSections } from '../forms/intake-definition';

/**
 * Validate that each service's intakeSections array matches the sections
 * whose serviceTags include that service ID. Logs warnings for mismatches.
 * Returns true if all mappings are consistent.
 */
function validateServiceIntakeMapping(): boolean {
  let valid = true;

  for (const service of serviceCatalog) {
    if (!service.requiresIntake) continue;

    const expectedSections = allFormSections
      .filter((section) => section.serviceTags.includes(service.id))
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((section) => section.id);

    const missing = expectedSections.filter(
      (id) => !service.intakeSections.includes(id),
    );
    const extra = service.intakeSections.filter(
      (id) => !expectedSections.includes(id),
    );

    if (missing.length > 0 || extra.length > 0) {
      valid = false;
      if (typeof console !== 'undefined') {
        console.warn(
          `[ServiceIntakeMapping] Mismatch for "${service.id}":`,
          missing.length > 0 ? `missing in catalog: [${missing.join(', ')}]` : '',
          extra.length > 0 ? `extra in catalog (form section not yet defined): [${extra.join(', ')}]` : '',
        );
      }
    }
  }

  return valid;
}

/**
 * Derive intakeSections from the form section serviceTags for a given service.
 * This is the canonical source — the catalog's intakeSections should match this.
 */
function deriveIntakeSections(serviceId: string): string[] {
  return allFormSections
    .filter((section) => section.serviceTags.includes(serviceId))
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((section) => section.id);
}

// Run validation in development mode
if (process.env.NODE_ENV === 'development') {
  validateServiceIntakeMapping();
}
