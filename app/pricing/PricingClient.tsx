'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  ChevronDown,
  Check,
  ShoppingCart,
  Package,
  ArrowRight,
  Zap,
  ShieldCheck,
  Clock,
  Star,
  Briefcase,
  Crown,
  Tag,
  RefreshCw,
} from 'lucide-react';
import {
  serviceCatalog,
  serviceGroups,
  getServiceById,
  calculateTotal,
  getBundleSavingsMessage,
  getBundleDiscountPercentage,
  getBundleDiscountLabel,
  getServicesByTier,
  getServiceGroupById,
  getServicePrice,
  type ServiceCatalogEntry,
  type ServiceTier,
  type ServiceGroup,
} from '@/lib/services/service-catalog';
import { getDocumentConfigsForService } from '@/lib/services/document-configs';
import { buildIntakeForm } from '@/lib/forms/build-intake-form';
import { useAuth } from '@/hooks/useAuth';
import { useClientProfile } from '@/hooks/useClientProfile';
import { SavingsCalculator, ROICalculator, SavingsVisual } from '@/components/ui/SavingsCalculator';
import { GapAnalysis } from '@/components/ui/GapAnalysis';
import { AnimatedBarChart, AnimatedStatsGrid } from '@/components/ui/AnimatedGraphs';

/* ─── Tier Configuration ─── */

const TIER_CONFIG: Record<ServiceTier, { label: string; headline: string; description: string; icon: React.ElementType; bgColor: string; borderColor: string; accentColor: string }> = {
  foundation: {
    label: 'Foundation',
    headline: 'Start your business',
    description: 'Essential documents, website copy, and social media to launch professionally.',
    icon: Star,
    bgColor: 'bg-slate-50',
    borderColor: 'border-slate-300',
    accentColor: '#475569',
  },
  operations: {
    label: 'Operations',
    headline: 'Run your business',
    description: 'Client management, payment protection, IP rights, and deep GDPR compliance.',
    icon: Briefcase,
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-300',
    accentColor: '#2563eb',
  },
  industry: {
    label: 'Industry',
    headline: 'Dominate your industry',
    description: 'Specialized documents tailored to your specific profession.',
    icon: Crown,
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-300',
    accentColor: '#d97706',
  },
};

/* ─── Testimonials Data ─── */

const TESTIMONIALS = {
  foundation: [
    {
      quote: "Finally, documents that actually reflect how I work. Not a generic template in sight.",
      author: "Sarah M.",
      role: "Marketing Consultant",
    },
    {
      quote: "The Business Foundations Pack paid for itself within a week. One clear contract prevented a scope dispute.",
      author: "James T.",
      role: "Freelance Designer",
    },
  ],
  operations: [
    {
      quote: "The Payment Protection Pack has saved me thousands. Clear terms, proper late payment clauses — clients take invoices seriously now.",
      author: "David K.",
      role: "Business Coach",
    },
    {
      quote: "GDPR was overwhelming me. The GDPR Deep Pack made it manageable and specific to my actual data handling.",
      author: "Emma L.",
      role: "Nutritionist",
    },
  ],
  industry: [
    {
      quote: "Finally, coaching documents that understand how coaching actually works. Session terms, ethics, CPD — all covered.",
      author: "Michelle P.",
      role: "Leadership Coach",
    },
    {
      quote: "The Photographer Pack addressed licensing issues I hadn't even thought about. Model releases, delivery terms — worth every penny.",
      author: "Tom R.",
      role: "Event Photographer",
    },
  ],
};

/* ─── FAQ Data ─── */

const faqs = [
  {
    q: "What's in each tier?",
    a: "Foundation tier gives you the essentials to start: 10 business documents, plus options for website copy and social media posts. Operations tier protects your running business: client onboarding systems, payment protection, IP rights, and deep GDPR compliance. Industry tier adds profession-specific documents for coaches, photographers, consultants, and contractors.",
  },
  {
    q: "What's in each Operations pack?",
    a: "Client Onboarding Pack (8 documents): onboarding questionnaires, scope of work templates, change request forms, and communication protocols. Payment Protection Pack (8 documents): invoice terms, late payment policies, deposit protection, and chargeback defense. Copyright & Licensing Pack (8 documents): IP notices, licensing agreements, NDAs, and brand usage guidelines. GDPR Deep Pack (9 documents): comprehensive privacy policy, data processing agreements, breach procedures, and consent management.",
  },
  {
    q: "How do Industry packs work?",
    a: "Each Industry pack contains 7-8 documents tailored to a specific profession. Coach Pack: coaching agreements, session terms, supervision policy, CPD tracker, ethics code. Photographer Pack: licensing agreements, model releases, shot lists, delivery terms. Consultant Pack: consulting agreements, deliverables specifications, knowledge transfer protocols. Contractor Pack: H&S policy, risk assessments, method statements, COSHH, CDM compliance.",
  },
  {
    q: 'Can I buy packs individually?',
    a: "Yes. Every pack is sold separately with no requirement to bundle. However, bundles offer automatic discounts: 10% off two packs, 15% off three or more, and up to 25% off complete bundles. The choice is yours.",
  },
  {
    q: "What's the Monthly Care Plan?",
    a: "For £29/month, you get ongoing document updates, priority support, and proactive notifications about regulation changes affecting your documents. It's optional — your one-time purchases work independently. Cancel anytime.",
  },
  {
    q: 'Is this really a one-time payment?',
    a: "For all document packs, yes. You pay once and receive fully bespoke documents ready to use. No subscription, no monthly fees. The only recurring option is the Monthly Care Plan, which is entirely optional.",
  },
  {
    q: 'How do bundle discounts work?',
    a: "Add 2+ packs to your order and discounts apply automatically: 10% for 2 packs, 15% for 3+. Pre-built bundles offer up to 25% off. For example, buying all 4 Operations packs together saves you 15% immediately. No codes needed.",
  },
  {
    q: 'What if I buy a pack and then add another later?',
    a: "You can add any pack at any time. Your existing intake answers are saved, so new sections are the only fresh input needed. Bundle discounts still apply for new purchases.",
  },
  {
    q: 'Can I pay and complete the questionnaire later?',
    a: "Yes. Once you pay, you receive a unique link to your questionnaire by email. Complete it whenever you're ready — no deadline. The delivery clock starts when you submit, not when you pay.",
  },
  {
    q: 'How many documents do I actually get?',
    a: "Business Foundations Pack: 10 documents. Each Operations Pack: 8-9 documents. Each Industry Pack: 7-8 documents. The Complete Infrastructure Bundle includes all 70+ documents across every pack we offer.",
  },
  {
    q: "Is there a refund if I'm not happy?",
    a: "Because we begin work within hours of questionnaire submission, we cannot offer refunds after the process begins. If you have concerns before purchasing, email us first — we'll give you an honest answer.",
  },
  {
    q: 'Do the documents need editing before I use them?',
    a: "They're ready to use immediately. Every document is reviewed for consistency, UK law compliance, and alignment with your stated tone. Delivered in PDF and editable Word formats so you can make adjustments if needed.",
  },
];

/* ─── Shared Components ─── */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="font-inter font-semibold text-medium-blue uppercase block mb-3"
      style={{ fontSize: '0.75rem', letterSpacing: '0.15em' }}
    >
      {children}
    </span>
  );
}

function CheckMark() {
  return (
    <span
      className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-success text-white font-bold shrink-0"
      style={{ fontSize: '0.7rem' }}
    >
      ✓
    </span>
  );
}

function CrossMark() {
  return (
    <span
      className="inline-flex items-center justify-center w-5 h-5 rounded-full shrink-0"
      style={{ fontSize: '0.7rem', background: '#F0F4FF', color: '#CBD5E0' }}
    >
      ✕
    </span>
  );
}

/* ─── Hero Section ─── */

function PageHeader() {
  return (
    <section
      className="text-center px-6"
      style={{
        padding: '80px 0 72px',
        background: 'linear-gradient(135deg, #1B3F7A 0%, #2C68C4 100%)',
      }}
    >
      <div className="mx-auto" style={{ maxWidth: 900 }}>
        <span
          className="font-inter font-semibold uppercase block"
          style={{
            fontSize: '0.75rem',
            letterSpacing: '0.15em',
            color: 'rgba(255,255,255,0.7)',
            marginTop: '72px',
          }}
        >
          PRICING
        </span>
        <h1
          className="font-inter font-extrabold text-white mt-3"
          style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', lineHeight: 1.2 }}
        >
          Complete Business Infrastructure.
        </h1>
        <p
          className="font-inter font-bold text-white mt-2"
          style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.45rem)', opacity: 0.95 }}
        >
          Not just documents — everything you need to start AND run your business.
        </p>
        <p
          className="font-inter font-normal mx-auto mt-5 leading-[1.7]"
          style={{
            fontSize: '1rem',
            color: 'rgba(255,255,255,0.85)',
            maxWidth: 650,
          }}
        >
          Three tiers. 13 packs. From £79 for foundational documents to £299 for complete industry compliance. Buy individually or bundle for up to 25% off.
        </p>

        {/* Tier icons */}
        <div className="flex items-center justify-center gap-6 mt-10">
          {(['foundation', 'operations', 'industry'] as ServiceTier[]).map((tier, i) => {
            const config = TIER_CONFIG[tier];
            const Icon = config.icon;
            return (
              <div key={tier} className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Icon size={16} className="text-white" />
                </div>
                <div className="text-left">
                  <span className="font-inter font-semibold text-white block" style={{ fontSize: '0.85rem' }}>
                    {config.label}
                  </span>
                  <span className="font-inter text-white/70" style={{ fontSize: '0.7rem' }}>
                    {config.headline}
                  </span>
                </div>
                {i < 2 && (
                  <ArrowRight size={16} className="text-white/40 ml-2 hidden sm:block" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─── Service Card Component ─── */

interface ServiceCardProps {
  service: ServiceCatalogEntry;
  tier: ServiceTier;
  alreadyOwned: boolean;
}

function ServiceCard({ service, tier, alreadyOwned }: ServiceCardProps) {
  const hasTiers = service.pricingTiers && service.pricingTiers.length > 0;

  return (
    <div
      className={`relative bg-white rounded-2xl border-2 overflow-hidden transition-all duration-200 ${
        alreadyOwned
          ? 'border-success opacity-60'
          : 'border-border hover:border-medium-blue hover:shadow-lg'
      }`}
    >
      {/* Badge */}
      {service.badge && !alreadyOwned && (
        <span
          className="absolute top-4 right-4 font-inter font-semibold rounded-full"
          style={{
            background: service.badge === 'Best Seller' ? '#38A169' : service.badge === 'Essential' ? '#2C68C4' : '#1B3F7A',
            color: 'white',
            padding: '4px 12px',
            fontSize: '0.7rem',
            letterSpacing: '0.05em',
          }}
        >
          {service.badge}
        </span>
      )}

      <div className="p-6">
        {/* Price */}
        <div className="flex items-end gap-2 mb-3">
          <span className="font-inter font-extrabold text-navy" style={{ fontSize: '1.75rem' }}>
            {hasTiers ? `From £${service.price}` : `£${service.price}`}
          </span>
          <span className="font-inter font-normal text-secondary-text mb-1" style={{ fontSize: '0.85rem' }}>
            {service.mode === 'subscription' ? '/month' : 'one-time'}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-inter font-bold text-dark-text" style={{ fontSize: '1.05rem' }}>
          {service.name}
        </h3>

        {/* Description */}
        <p
          className="font-inter font-normal text-secondary-text mt-2 leading-[1.6]"
          style={{ fontSize: '0.85rem' }}
        >
          {service.shortDescription}
        </p>

        {/* What's included */}
        <div className="flex flex-col gap-1.5 mt-4">
          {service.includes.slice(0, 4).map((item) => (
            <div key={item} className="flex items-start gap-2">
              <CheckMark />
              <span className="font-inter font-medium text-dark-text" style={{ fontSize: '0.8rem' }}>
                {item}
              </span>
            </div>
          ))}
          {service.includes.length > 4 && (
            <span className="font-inter text-secondary-text mt-1" style={{ fontSize: '0.75rem' }}>
              +{service.includes.length - 4} more
            </span>
          )}
        </div>

        {/* CTA */}
        <Link
          href={`/checkout?services=${service.id}`}
          className={`w-full mt-5 text-center font-inter font-bold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${
            alreadyOwned
              ? 'bg-slate-200 text-secondary-text cursor-not-allowed'
              : 'bg-navy text-white hover:bg-medium-blue hover:-translate-y-0.5 hover:shadow-md'
          }`}
          style={{ padding: '12px', fontSize: '0.9rem', minHeight: 44 }}
        >
          {alreadyOwned ? (
            'Already Owned'
          ) : (
            <>
              <ShoppingCart size={16} />
              Get this pack
            </>
          )}
        </Link>
      </div>
    </div>
  );
}

/* ─── Document Breakdown Expandable Component ─── */

interface DocumentBreakdownExpandableProps {
  tier: ServiceTier;
  services: ServiceCatalogEntry[];
}

function DocumentBreakdownExpandable({ tier, services }: DocumentBreakdownExpandableProps) {
  const [expanded, setExpanded] = useState(false);

  const totalDocuments = useMemo(() => {
    return services.reduce((sum, service) => {
      const docs = getDocumentConfigsForService(service.id);
      return sum + docs.length;
    }, 0);
  }, [services]);

  if (totalDocuments === 0) return null;

  return (
    <div className="bg-white rounded-xl border border-border overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-colors"
      >
        <span className="font-inter font-semibold text-dark-text" style={{ fontSize: '0.95rem' }}>
          What you get ({totalDocuments} documents across {services.length} packs)
        </span>
        <ChevronDown
          size={20}
          className={`text-secondary-text transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
        />
      </button>

      {expanded && (
        <div className="border-t border-border p-5">
          {services.map((service) => {
            const docs = getDocumentConfigsForService(service.id);
            if (docs.length === 0) return null;

            return (
              <div key={service.id} className="mb-6 last:mb-0">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-inter font-semibold text-dark-text" style={{ fontSize: '0.9rem' }}>
                    {service.name}
                  </h4>
                  <span className="font-inter font-medium text-navy bg-off-white rounded-full px-2 py-0.5" style={{ fontSize: '0.75rem' }}>
                    {docs.length} docs
                  </span>
                </div>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {docs.map((doc) => (
                    <li key={doc.document_type} className="flex items-start gap-2">
                      <span className="text-medium-blue font-bold shrink-0" style={{ fontSize: '0.7rem' }}>•</span>
                      <span className="font-inter font-normal text-secondary-text" style={{ fontSize: '0.8rem' }}>
                        {doc.document_label}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ─── Three-Tier Pricing Section ─── */

interface TierPricingSectionProps {
  tier: ServiceTier;
  purchasedServiceIds: string[];
  onSelectBundle: (serviceIds: string[]) => void;
}

function TierPricingSection({ tier, purchasedServiceIds, onSelectBundle }: TierPricingSectionProps) {
  const config = TIER_CONFIG[tier];
  const Icon = config.icon;

  // Exclude subscription services from tier display
  const tierServices = useMemo(() => {
    const services = getServicesByTier(tier);
    return services.filter(s => s.mode !== 'subscription');
  }, [tier]);

  // Find relevant bundles for this tier
  const tierBundles = useMemo(() => {
    return serviceGroups.filter(g => {
      if (g.tier !== tier) return false;
      const hasUnpurchased = g.serviceIds.some(id => !purchasedServiceIds.includes(id));
      return hasUnpurchased;
    });
  }, [tier, purchasedServiceIds]);

  const availableServices = tierServices.filter(s => !purchasedServiceIds.includes(s.id));

  if (availableServices.length === 0) {
    return (
      <section className={`${config.bgColor} py-16 px-6`}>
        <div className="mx-auto" style={{ maxWidth: 1100 }}>
          <div className="bg-white rounded-2xl border-2 border-success p-8 flex items-start gap-4">
            <Check size={24} className="text-success shrink-0 mt-0.5" />
            <div>
              <h3 className="font-inter font-semibold text-navy" style={{ fontSize: '1.1rem' }}>
                You own all {config.label} tier services
              </h3>
              <p className="font-inter font-normal text-secondary-text mt-2 leading-[1.6]" style={{ fontSize: '0.9rem' }}>
                Great work! You have complete coverage in this tier. Consider adding services from other tiers to expand your business infrastructure.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`${config.bgColor} py-20 px-6`}>
      <div className="mx-auto" style={{ maxWidth: 1100 }}>
        {/* Tier header */}
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: config.accentColor }}
          >
            <Icon size={20} className="text-white" />
          </div>
          <div>
            <SectionLabel>{config.label}</SectionLabel>
          </div>
        </div>

        <h2
          className="font-inter font-bold text-dark-text"
          style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)' }}
        >
          {config.headline}
        </h2>
        <p
          className="font-inter font-normal text-secondary-text mt-2 leading-[1.7]"
          style={{ fontSize: '1rem', maxWidth: 600 }}
        >
          {config.description}
        </p>

        {/* Bundle recommendations */}
        {tierBundles.length > 0 && (
          <div className="mt-8 bg-white rounded-xl border border-border p-5">
            <p className="font-inter font-semibold text-dark-text mb-3" style={{ fontSize: '0.95rem' }}>
              Recommended bundles:
            </p>
            <div className="flex flex-wrap gap-3">
              {tierBundles.map((bundle) => {
                const unpurchasedIds = bundle.serviceIds.filter(id => !purchasedServiceIds.includes(id));
                const bundleServices = unpurchasedIds.map(id => getServiceById(id)).filter(Boolean) as ServiceCatalogEntry[];
                const bundlePrice = bundleServices.reduce((sum, s) => sum + s.price, 0);
                const discountedPrice = bundlePrice * (1 - bundle.discountPercent / 100);

                return (
                  <div
                    key={bundle.id}
                    className="bg-off-white rounded-lg p-4 border border-border hover:border-medium-blue hover:shadow-md transition-all cursor-pointer min-w-[220px]"
                  >
                    <div className="flex items-center justify-between gap-4 mb-2">
                      <span className="font-inter font-semibold text-dark-text" style={{ fontSize: '0.9rem' }}>
                        {bundle.name}
                      </span>
                      {bundle.badge && (
                        <span className="bg-success text-white font-inter font-bold rounded-full px-2 py-0.5" style={{ fontSize: '0.65rem' }}>
                          {bundle.badge}
                        </span>
                      )}
                    </div>
                    <p className="font-inter text-secondary-text mb-3" style={{ fontSize: '0.8rem' }}>
                      {bundleServices.length} packs
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="font-inter text-secondary-text line-through" style={{ fontSize: '0.85rem' }}>
                        £{bundlePrice.toFixed(0)}
                      </span>
                      <span className="font-inter font-bold text-navy" style={{ fontSize: '1.1rem' }}>
                        £{discountedPrice.toFixed(0)}
                      </span>
                    </div>
                    <button
                      onClick={() => onSelectBundle(unpurchasedIds)}
                      className="w-full mt-3 font-inter font-semibold text-white bg-navy rounded-lg hover:bg-medium-blue transition-colors"
                      style={{ padding: '10px', fontSize: '0.85rem' }}
                    >
                      Add to Bundle
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Individual services grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {availableServices.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              tier={tier}
              alreadyOwned={purchasedServiceIds.includes(service.id)}
            />
          ))}
        </div>

        {/* Document breakdown for this tier */}
        <div className="mt-10">
          <DocumentBreakdownExpandable tier={tier} services={availableServices} />
        </div>
      </div>
    </section>
  );
}

/* ─── Interactive Bundle Builder Section ─── */

function BuildYourBundleSection({ purchasedServiceIds }: { purchasedServiceIds: string[] }) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const availableServices = useMemo(() => {
    return serviceCatalog.filter(
      (s) => s.mode !== 'subscription' && !purchasedServiceIds.includes(s.id)
    );
  }, [purchasedServiceIds]);

  const toggleService = (serviceId: string) => {
    setSelectedIds((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const { subtotal, discountPercentage, discountAmount, total, groupId, servicePrices } = calculateTotal(selectedIds);

  // Find matching bundles
  const matchingBundles = useMemo(() => {
    if (selectedIds.length < 2) return [];
    const selectedSet = new Set(selectedIds);
    return serviceGroups.filter(g => {
      const matchCount = g.serviceIds.filter(id => selectedSet.has(id)).length;
      return matchCount >= 2;
    }).sort((a, b) => b.discountPercent - a.discountPercent);
  }, [selectedIds]);

  const intakeSections = selectedIds.length > 0 ? buildIntakeForm(selectedIds) : [];
  const sectionCount = intakeSections.length;
  const estimatedMinutes = Math.ceil(sectionCount * 2.5);

  return (
    <section className="bg-white py-24 px-6">
      <div className="mx-auto" style={{ maxWidth: 1100 }}>
        <SectionLabel>BUILD YOUR BUNDLE</SectionLabel>
        <h2
          className="font-inter font-bold text-dark-text"
          style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)' }}
        >
          Mix and match — save up to 25%
        </h2>
        <p
          className="font-inter font-normal text-secondary-text mt-2 leading-[1.7]"
          style={{ fontSize: '1rem', maxWidth: 600 }}
        >
          Select the packs you need. Bundle discounts are applied automatically — no code needed.
        </p>

        <div className="flex flex-col lg:flex-row gap-8 mt-12">
          {/* Service selection */}
          <div className="lg:w-3/5">
            {/* Tier-grouped services */}
            {(['foundation', 'operations', 'industry'] as ServiceTier[]).map((tier) => {
              const tierServices = availableServices.filter(s => s.tier === tier);
              if (tierServices.length === 0) return null;

              const config = TIER_CONFIG[tier];
              const Icon = config.icon;

              return (
                <div key={tier} className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <Icon size={18} className="text-navy" />
                    <span className="font-inter font-semibold text-navy" style={{ fontSize: '0.9rem' }}>
                      {config.label}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {tierServices.map((service) => {
                      const isSelected = selectedIds.includes(service.id);
                      const servicePrice = servicePrices.find(sp => sp.id === service.id);

                      return (
                        <button
                          key={service.id}
                          onClick={() => toggleService(service.id)}
                          className={`text-left border-2 rounded-xl p-4 transition-all duration-200 ${
                            isSelected
                              ? 'border-navy bg-navy/5'
                              : 'border-border bg-white hover:border-medium-blue'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-2.5">
                              <div
                                className={`w-5 h-5 rounded flex items-center justify-center shrink-0 mt-0.5 ${
                                  isSelected ? 'bg-navy' : 'border-2 border-gray-300 bg-white'
                                }`}
                              >
                                {isSelected && <Check size={12} className="text-white" />}
                              </div>
                              <div>
                                <p className="font-inter font-semibold text-dark-text" style={{ fontSize: '0.85rem' }}>
                                  {service.name}
                                </p>
                                {service.badge && (
                                  <span className="font-inter font-medium text-medium-blue" style={{ fontSize: '0.7rem' }}>
                                    {service.badge}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              {isSelected && servicePrice && discountPercentage > 0 ? (
                                <div>
                                  <span className="font-inter text-secondary-text line-through" style={{ fontSize: '0.75rem' }}>
                                    £{servicePrice.originalPrice.toFixed(0)}
                                  </span>
                                  <span className="font-inter font-bold text-navy ml-1" style={{ fontSize: '0.9rem' }}>
                                    £{servicePrice.discountedPrice.toFixed(0)}
                                  </span>
                                </div>
                              ) : (
                                <span className="font-inter font-bold text-navy" style={{ fontSize: '0.9rem' }}>
                                  {service.pricingTiers ? `From £${service.price}` : `£${service.price}`}
                                </span>
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Price summary sidebar */}
          <div className="lg:w-2/5">
            <div className="bg-off-white rounded-2xl border border-border p-6 sticky top-24">
              <h3 className="font-inter font-bold text-navy" style={{ fontSize: '1.1rem' }}>
                Your selection
              </h3>

              {selectedIds.length === 0 && (
                <p className="font-inter font-normal text-secondary-text mt-4" style={{ fontSize: '0.9rem' }}>
                  Select packs above to build your bundle and see savings.
                </p>
              )}

              {selectedIds.length > 0 && (
                <>
                  {/* Matching bundles */}
                  {matchingBundles.length > 0 && (
                    <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Tag size={16} className="text-success" />
                        <span className="font-inter font-semibold text-green-800" style={{ fontSize: '0.85rem' }}>
                          Bundle unlocked!
                        </span>
                      </div>
                      <p className="font-inter text-green-700" style={{ fontSize: '0.85rem' }}>
                        {matchingBundles[0].name} — {matchingBundles[0].discountPercent}% off applied
                      </p>
                    </div>
                  )}

                  {/* Generic discount */}
                  {discountPercentage > 0 && matchingBundles.length === 0 && (
                    <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center gap-2">
                        <Tag size={16} className="text-medium-blue" />
                        <span className="font-inter font-semibold text-navy" style={{ fontSize: '0.85rem' }}>
                          {getBundleDiscountLabel(selectedIds.length)}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Service list */}
                  <div className="space-y-2 mt-5">
                    {servicePrices.map((sp) => {
                      const service = getServiceById(sp.id);
                      if (!service) return null;

                      return (
                        <div key={sp.id} className="flex items-center justify-between">
                          <span className="font-inter text-secondary-text" style={{ fontSize: '0.85rem' }}>
                            {service.name}
                          </span>
                          <span className="font-inter font-semibold text-navy" style={{ fontSize: '0.85rem' }}>
                            £{sp.discountedPrice.toFixed(0)}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Discount line */}
                  {discountAmount > 0 && (
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
                      <span className="font-inter font-medium text-green-700 flex items-center gap-1" style={{ fontSize: '0.85rem' }}>
                        <Tag size={12} />
                        Discount ({discountPercentage}%)
                      </span>
                      <span className="font-inter font-semibold text-green-700" style={{ fontSize: '0.85rem' }}>
                        -£{discountAmount.toFixed(2)}
                      </span>
                    </div>
                  )}

                  {/* Total */}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-300">
                    <span className="font-inter font-bold text-navy">Total</span>
                    <span className="font-inter font-bold text-navy text-2xl">
                      £{total.toFixed(2)}
                    </span>
                  </div>

                  {/* Intake preview */}
                  {sectionCount > 0 && (
                    <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2">
                      <Zap size={16} className="text-medium-blue shrink-0 mt-0.5" />
                      <div>
                        <p className="font-inter font-semibold text-navy" style={{ fontSize: '0.8rem' }}>
                          {sectionCount} section intake form
                        </p>
                        <p className="font-inter text-secondary-text" style={{ fontSize: '0.75rem' }}>
                          Approx {estimatedMinutes} min • Save and resume anytime
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Trust */}
                  <div className="mt-4 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <ShieldCheck size={14} className="text-success shrink-0" />
                      <span className="font-inter font-medium text-secondary-text" style={{ fontSize: '0.75rem' }}>
                        Secure checkout via Stripe
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-medium-blue shrink-0" />
                      <span className="font-inter font-medium text-secondary-text" style={{ fontSize: '0.75rem' }}>
                        24-72 hour delivery after intake
                      </span>
                    </div>
                  </div>

                  {/* CTA */}
                  <Link
                    href={`/checkout?services=${selectedIds.join(',')}`}
                    className="w-full mt-5 text-center font-inter font-bold text-white bg-navy rounded-lg hover:bg-medium-blue hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
                    style={{ padding: '14px', fontSize: '1rem', minHeight: 48 }}
                  >
                    <ShoppingCart size={18} />
                    Buy Now — £{total.toFixed(2)}
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Comparison Table Section ─── */

const comparisonRows = [
  { feature: 'Documents for your specific business', foundationary: 'check', solicitor: 'check', diy: 'cross', ai: 'cross' },
  { feature: 'UK law compliant', foundationary: 'check', solicitor: 'check', diy: 'partial', ai: 'cross' },
  { feature: 'Done for you', foundationary: 'check', solicitor: 'check', diy: 'cross', ai: 'cross' },
  { feature: 'Operations packs (onboarding, payments, IP, GDPR)', foundationary: 'check', solicitor: 'partial', diy: 'cross', ai: 'cross' },
  { feature: 'Industry-specific documents', foundationary: 'check', solicitor: 'check', diy: 'cross', ai: 'cross' },
  { feature: 'All documents consistent with each other', foundationary: 'check', solicitor: 'check', diy: 'cross', ai: 'cross' },
  { feature: 'Human reviewed before delivery', foundationary: 'check', solicitor: 'check', diy: 'cross', ai: 'cross' },
  { feature: 'Website copy included', foundationary: 'check', solicitor: 'cross', diy: 'cross', ai: 'cross' },
  { feature: 'Social media posts included', foundationary: 'check', solicitor: 'cross', diy: 'cross', ai: 'cross' },
  { feature: 'Delivered in 24-72 hours', foundationary: 'check', solicitor: 'cross', diy: 'cross', ai: 'check' },
  { feature: 'Document counts', foundationary: '70+ documents', solicitor: 'Per-document pricing', diy: '10-20 templates', ai: 'Unlimited (generic)' },
  { feature: 'Typical cost for complete infrastructure', foundationary: '£79–£1,200', solicitor: '£2,000–£10,000+', diy: '£100–£300/year', ai: 'Free–£200/year' },
  { feature: 'Ongoing updates available', foundationary: '£29/month', solicitor: 'Hourly rates', diy: 'Self-managed', ai: 'Self-managed' },
];

function CellContent({ value }: { value: string }) {
  if (value === 'check') return <CheckMark />;
  if (value === 'cross') return <CrossMark />;
  if (value === 'partial')
    return (
      <span className="font-inter font-normal italic text-secondary-text" style={{ fontSize: '0.8rem' }}>
        Partial
      </span>
    );
  return (
    <span className="font-inter font-medium text-dark-text" style={{ fontSize: '0.8rem' }}>
      {value}
    </span>
  );
}

function ComparisonSection() {
  const headers = ['What you get', 'Foundationary', 'Solicitor', 'DIY', 'Generic AI'];

  // Animated stats for comparison
  const comparisonStats = [
    { value: 79, suffix: '', prefix: '£', label: 'Starting price', icon: <Tag size={18} /> },
    { value: 70, suffix: '+', label: 'Documents available', icon: <Package size={18} /> },
    { value: 72, suffix: 'hr', label: 'Delivery time', icon: <Clock size={18} /> },
    { value: 100, suffix: '%', label: 'Custom to you', icon: <ShieldCheck size={18} /> },
  ];

  return (
    <section className="bg-off-white py-24 px-6">
      <div className="mx-auto" style={{ maxWidth: 1100 }}>
        <SectionLabel>HOW WE COMPARE</SectionLabel>
        <h2
          className="font-inter font-bold text-dark-text"
          style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}
        >
          Not the cheapest. The only one that makes sense.
        </h2>
        <p
          className="font-inter font-normal text-secondary-text mt-3 leading-[1.7]"
          style={{ fontSize: '0.95rem', maxWidth: 580 }}
        >
          Every alternative either costs dramatically more, requires you to do the work yourself, or produces something generic that doesn&apos;t reflect your business.
        </p>

        {/* Animated stats grid */}
        <div className="mt-10">
          <AnimatedStatsGrid stats={comparisonStats} columns={4} />
        </div>

        {/* Cost comparison visualization */}
        <div className="mt-10 grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-inter font-bold text-navy text-lg mb-4">Cost Comparison</h3>
            <AnimatedBarChart
              data={[
                { label: 'Foundationary', value: 79, color: '#1B3F7A' },
                { label: 'DIY Templates', value: 150, color: '#94A3B8' },
                { label: 'Generic AI', value: 200, color: '#CBD5E1' },
                { label: 'Solicitor', value: 2000, color: '#DC2626' },
              ]}
              title="Average cost for documents"
              subtitle="Foundationary offers the best value"
            />
          </div>
          <div>
            <h3 className="font-inter font-bold text-navy text-lg mb-4">Time Investment</h3>
            <AnimatedBarChart
              data={[
                { label: 'Foundationary', value: 20, suffix: ' min', color: '#1B3F7A' },
                { label: 'DIY Templates', value: 480, suffix: ' min', color: '#94A3B8' },
                { label: 'Generic AI', value: 120, suffix: ' min', color: '#CBD5E1' },
                { label: 'Solicitor', value: 360, suffix: ' min', color: '#DC2626' },
              ]}
              title="Your time to complete"
              subtitle="Fill intake, receive documents"
            />
          </div>
        </div>

        {/* Desktop table */}
        <div
          className="hidden lg:block mt-12 rounded-2xl overflow-hidden border border-border"
          style={{ boxShadow: '0 8px 40px rgba(27,63,122,0.08)' }}
        >
          <table className="w-full">
            <thead>
              <tr className="bg-navy">
                <th
                  className="text-left font-inter font-semibold text-white"
                  style={{ fontSize: '0.85rem', padding: '14px 16px' }}
                >
                  {headers[0]}
                </th>
                <th
                  className="font-inter font-bold text-white text-center"
                  style={{
                    fontSize: '0.9rem',
                    padding: '14px 16px',
                    background: 'rgba(255,255,255,0.15)',
                  }}
                >
                  {headers[1]}
                </th>
                <th
                  className="font-inter font-medium text-center"
                  style={{
                    fontSize: '0.85rem',
                    padding: '14px 16px',
                    color: 'rgba(255,255,255,0.75)',
                  }}
                >
                  {headers[2]}
                </th>
                <th
                  className="font-inter font-medium text-center"
                  style={{
                    fontSize: '0.85rem',
                    padding: '14px 16px',
                    color: 'rgba(255,255,255,0.75)',
                  }}
                >
                  {headers[3]}
                </th>
                <th
                  className="font-inter font-medium text-center"
                  style={{
                    fontSize: '0.85rem',
                    padding: '14px 16px',
                    color: 'rgba(255,255,255,0.75)',
                  }}
                >
                  {headers[4]}
                </th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row, i) => (
                <tr
                  key={row.feature}
                  style={{ background: i % 2 === 0 ? '#FFFFFF' : '#F8FAFF' }}
                >
                  <td
                    className="font-inter font-medium text-dark-text"
                    style={{ fontSize: '0.85rem', padding: '12px 16px' }}
                  >
                    {row.feature}
                  </td>
                  <td
                    className="text-center"
                    style={{ padding: '12px 16px', background: i % 2 === 0 ? 'rgba(240,244,255,0.4)' : 'rgba(240,244,255,0.25)' }}
                  >
                    <CellContent value={row.foundationary} />
                  </td>
                  <td className="text-center" style={{ padding: '12px 16px' }}>
                    <CellContent value={row.solicitor} />
                  </td>
                  <td className="text-center" style={{ padding: '12px 16px' }}>
                    <CellContent value={row.diy} />
                  </td>
                  <td className="text-center" style={{ padding: '12px 16px' }}>
                    <CellContent value={row.ai} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile card stack */}
        <div className="lg:hidden mt-12 flex flex-col gap-4">
          {comparisonRows.map((row, i) => (
            <div
              key={row.feature}
              className="bg-white rounded-xl border border-border p-4"
              style={{ background: i % 2 === 0 ? '#FFFFFF' : '#F8FAFF' }}
            >
              <div className="font-inter font-semibold text-dark-text mb-3" style={{ fontSize: '0.85rem' }}>
                {row.feature}
              </div>
              <div className="flex flex-col gap-2">
                {['Foundationary', 'Solicitor', 'DIY', 'Generic AI'].map((col, ci) => {
                  const val = [row.foundationary, row.solicitor, row.diy, row.ai][ci];
                  return (
                    <div key={col} className="flex items-center justify-between gap-3">
                      <span className="font-inter font-medium text-secondary-text" style={{ fontSize: '0.75rem' }}>
                        {col}
                      </span>
                      <CellContent value={val} />
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <p
          className="font-inter font-normal italic text-secondary-text mt-4 text-right"
          style={{ fontSize: '0.75rem' }}
        >
          *DIY tools like LegalZoom offer generic templates. Generic AI produces unstructured, US-oriented output with no quality assurance.
        </p>
      </div>
    </section>
  );
}

/* ─── Monthly Care Plan Section ─── */

function MonthlyCarePlanSection({ purchasedServiceIds }: { purchasedServiceIds: string[] }) {
  const service = getServiceById('monthly_care_plan');
  if (!service) return null;

  const alreadyOwned = purchasedServiceIds.includes('monthly_care_plan');

  if (alreadyOwned) {
    return (
      <section className="bg-gradient-to-r from-indigo-50 to-purple-50 py-16 px-6">
        <div className="mx-auto" style={{ maxWidth: 760 }}>
          <div className="bg-white border-2 border-success rounded-2xl p-8 flex items-start gap-4">
            <Check size={22} className="text-success shrink-0 mt-0.5" />
            <div>
              <h3 className="font-inter font-bold text-dark-text" style={{ fontSize: '1.1rem' }}>
                Monthly Care Plan — Active
              </h3>
              <p className="font-inter font-normal text-secondary-text mt-2 leading-[1.6]" style={{ fontSize: '0.9rem' }}>
                Your subscription is active. Monthly document updates, priority support, and proactive regulation monitoring are all included.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gradient-to-r from-indigo-50 to-purple-50 py-20 px-6">
      <div className="mx-auto" style={{ maxWidth: 760 }}>
        <SectionLabel>ONGOING SUPPORT</SectionLabel>
        <h2
          className="font-inter font-bold text-dark-text"
          style={{ fontSize: 'clamp(1.4rem, 2.5vw, 1.8rem)' }}
        >
          Monthly Care Plan
        </h2>
        <p
          className="font-inter font-normal text-secondary-text mt-2 leading-[1.7]"
          style={{ fontSize: '1rem', maxWidth: 560 }}
        >
          Keep your documents accurate as your business evolves. Monthly updates, priority support, and proactive notifications.
        </p>

        <div className="bg-white border border-border rounded-2xl p-6 mt-8 flex flex-col sm:flex-row gap-6 items-start">
          <div className="flex-1">
            <div className="flex items-end gap-2 mb-4">
              <span className="font-inter font-extrabold text-navy" style={{ fontSize: '1.75rem' }}>
                £29
              </span>
              <span className="font-inter font-normal text-secondary-text mb-1" style={{ fontSize: '0.9rem' }}>
                /month
              </span>
            </div>
            <div className="flex flex-col gap-2">
              {service.includes.map((f) => (
                <div key={f} className="flex items-start gap-2.5">
                  <CheckMark />
                  <span className="font-inter font-medium text-dark-text" style={{ fontSize: '0.85rem' }}>
                    {f}
                  </span>
                </div>
              ))}
            </div>
            <p className="font-inter font-normal text-secondary-text mt-4 leading-[1.6]" style={{ fontSize: '0.85rem' }}>
              Optional subscription. Cancel anytime from your account settings.
            </p>
          </div>

          <div className="sm:text-right flex flex-col items-start sm:items-end gap-3">
            <Link
              href="/checkout?services=monthly_care_plan"
              className="font-inter font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors duration-200 flex items-center gap-2"
              style={{ padding: '12px 24px', fontSize: '0.9rem', minHeight: 44 }}
            >
              <RefreshCw size={16} />
              Subscribe Now
            </Link>
            <p className="font-inter text-secondary-text" style={{ fontSize: '0.75rem' }}>
              First payment today, then monthly. Cancel anytime.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Testimonials Section ─── */

function TestimonialsSection() {
  const [activeTier, setActiveTier] = useState<ServiceTier>('foundation');

  const testimonials = TESTIMONIALS[activeTier];

  return (
    <section className="bg-white py-20 px-6">
      <div className="mx-auto" style={{ maxWidth: 900 }}>
        <SectionLabel>WHAT CLIENTS SAY</SectionLabel>
        <h2
          className="font-inter font-bold text-dark-text"
          style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}
        >
          Real results from real businesses
        </h2>

        {/* Tier selector */}
        <div className="flex gap-2 mt-8">
          {(['foundation', 'operations', 'industry'] as ServiceTier[]).map((tier) => {
            const config = TIER_CONFIG[tier];
            const Icon = config.icon;
            const isActive = activeTier === tier;

            return (
              <button
                key={tier}
                onClick={() => setActiveTier(tier)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-inter font-medium transition-all ${
                  isActive
                    ? 'bg-navy text-white'
                    : 'bg-off-white text-dark-text hover:bg-slate-200'
                }`}
                style={{ fontSize: '0.85rem' }}
              >
                <Icon size={16} />
                {config.label}
              </button>
            );
          })}
        </div>

        {/* Testimonial cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-off-white rounded-2xl p-6 border border-border">
              <p className="font-inter font-normal text-dark-text leading-[1.7]" style={{ fontSize: '0.95rem' }}>
                "{t.quote}"
              </p>
              <div className="flex items-center gap-3 mt-4">
                <div className="w-10 h-10 rounded-full bg-navy/10 flex items-center justify-center">
                  <span className="font-inter font-bold text-navy">
                    {t.author.charAt(0)}
                  </span>
                </div>
                <div>
                  <span className="font-inter font-semibold text-dark-text block" style={{ fontSize: '0.9rem' }}>
                    {t.author}
                  </span>
                  <span className="font-inter text-secondary-text" style={{ fontSize: '0.8rem' }}>
                    {t.role}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── FAQ Section ─── */

function FAQItem({ item, isOpen, onToggle }: { item: typeof faqs[number]; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-border py-4">
      <button
        className="flex items-center justify-between w-full text-left gap-4"
        onClick={onToggle}
      >
        <span className="font-inter font-semibold text-dark-text" style={{ fontSize: '0.95rem' }}>
          {item.q}
        </span>
        <ChevronDown
          size={18}
          className="text-secondary-text shrink-0 transition-transform duration-200"
          style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </button>
      <div
        className="overflow-hidden transition-all duration-300"
        style={{ maxHeight: isOpen ? 500 : 0 }}
      >
        <p
          className="font-inter font-normal text-secondary-text pt-3 leading-[1.7]"
          style={{ fontSize: '0.9rem' }}
        >
          {item.a}
        </p>
      </div>
    </div>
  );
}

function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="bg-off-white py-20 px-6">
      <div className="mx-auto" style={{ maxWidth: 760 }}>
        <SectionLabel>COMMON QUESTIONS</SectionLabel>
        <h2
          className="font-inter font-bold text-dark-text"
          style={{ fontSize: 'clamp(1.5rem, 2.8vw, 2rem)' }}
        >
          Questions about pricing and packs
        </h2>

        <div className="mt-8">
          {faqs.map((faq, i) => (
            <FAQItem
              key={i}
              item={faq}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Final CTA ─── */

function FinalCTA() {
  return (
    <section
      className="text-center px-6"
      style={{
        padding: '80px 0',
        background: 'linear-gradient(135deg, #1B3F7A 0%, #2C68C4 100%)',
      }}
    >
      <div className="mx-auto" style={{ maxWidth: 700 }}>
        <h2
          className="font-inter font-bold text-white"
          style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)' }}
        >
          Ready for complete business infrastructure?
        </h2>
        <p
          className="font-inter font-normal mt-4 leading-[1.7]"
          style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.85)' }}
        >
          Start with one pack, build a bundle, or go all-in with the Complete Infrastructure Bundle. Either way, you get content tailored to your business.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
          <Link
            href="/checkout?services=business_foundations_pack"
            className="font-inter font-bold text-navy bg-white rounded-lg hover:bg-[rgba(255,255,255,0.92)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.2)] transition-all duration-200 flex items-center gap-2"
            style={{ padding: '16px 36px', fontSize: '1rem', minHeight: 48 }}
          >
            <ShoppingCart size={18} />
            Start with Foundation — £79
          </Link>
          <Link
            href="/checkout"
            className="font-inter font-semibold text-white border-2 border-white rounded-lg hover:bg-white hover:text-navy transition-all duration-200 flex items-center gap-2"
            style={{ padding: '14px 32px', fontSize: '0.95rem', minHeight: 48 }}
          >
            <Package size={18} />
            Build a Bundle
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ─── Main Page Component ─── */

export default function PricingPage() {
  const { user, loading: authLoading } = useAuth();
  const { purchasedServiceIds, loading: profileLoading } = useClientProfile();
  const loading = authLoading || profileLoading;

  const handleSelectBundle = (serviceIds: string[]) => {
    window.location.href = `/checkout?services=${serviceIds.join(',')}`;
  };

  if (loading) {
    return (
      <>
        <PageHeader />
        <div className="bg-off-white py-24 px-6 flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-navy" />
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader />

      {/* Three-tier pricing sections */}
      <TierPricingSection
        tier="foundation"
        purchasedServiceIds={purchasedServiceIds}
        onSelectBundle={handleSelectBundle}
      />
      <TierPricingSection
        tier="operations"
        purchasedServiceIds={purchasedServiceIds}
        onSelectBundle={handleSelectBundle}
      />
      <TierPricingSection
        tier="industry"
        purchasedServiceIds={purchasedServiceIds}
        onSelectBundle={handleSelectBundle}
      />

      {/* Interactive bundle builder */}
      <BuildYourBundleSection purchasedServiceIds={purchasedServiceIds} />

      {/* Savings Calculator */}
      <section className="py-20 px-6 bg-white">
        <div className="mx-auto" style={{ maxWidth: 1100 }}>
          <SectionLabel>SEE YOUR SAVINGS</SectionLabel>
          <h2
            className="font-inter font-bold text-dark-text"
            style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)' }}
          >
            Calculate your bundle discount
          </h2>
          <p
            className="font-inter font-normal text-secondary-text mt-2 leading-relaxed"
            style={{ fontSize: '1rem', maxWidth: 600 }}
          >
            The more you bundle, the more you save. See exactly how much you&apos;ll save with our automatic discounts.
          </p>
          <div className="mt-10">
            <SavingsCalculator
              services={serviceCatalog
                .filter(s => s.mode !== 'subscription')
                .map(s => ({ id: s.id, name: s.name, price: s.price }))}
              bundleDiscounts={[
                { count: 2, percent: 10 },
                { count: 3, percent: 15 },
                { count: 4, percent: 15 },
                { count: 5, percent: 20 },
                { count: 6, percent: 25 },
              ]}
            />
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <ComparisonSection />

      {/* Monthly Care Plan */}
      <MonthlyCarePlanSection purchasedServiceIds={purchasedServiceIds} />

      {/* Testimonials */}
      <TestimonialsSection />

      {/* FAQ */}
      <FAQSection />

      {/* Final CTA */}
      <FinalCTA />
    </>
  );
}
