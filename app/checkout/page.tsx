'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  ShieldCheck,
  Clock,
  ArrowRight,
  Check,
  AlertCircle,
  Zap,
  Tag,
  Package,
  Crown,
  Briefcase,
  Star,
  RefreshCw,
  Plus,
} from 'lucide-react';
import { stripeMode } from '@/lib/stripe/config';
import {
  serviceCatalog,
  serviceGroups,
  getServiceById,
  calculateTotal,
  getBundleDiscountLabel,
  getBundleSavingsMessage,
  getServicePrice,
  getServicesByTier,
  getServiceGroupById,
  getHighestTier,
  type ServiceCatalogEntry,
  type ServiceTier,
  type ServiceGroup,
} from '@/lib/services/service-catalog';
import { buildIntakeForm } from '@/lib/forms/build-intake-form';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase/client';

// Available website pages for selection
const WEBSITE_PAGE_OPTIONS = [
  'Homepage',
  'About',
  'Services',
  'Contact',
  'FAQ',
  'Blog',
  'Portfolio / Case Studies',
  'Pricing',
  'Testimonials',
] as const;

// Tier display configuration
const TIER_CONFIG: Record<ServiceTier, { label: string; description: string; icon: React.ElementType; colorClass: string }> = {
  foundation: {
    label: 'Foundation',
    description: 'Essential business documents and digital presence',
    icon: Star,
    colorClass: 'bg-slate-100 text-slate-700 border-slate-200',
  },
  operations: {
    label: 'Operations',
    description: 'Client management, payment protection, and compliance',
    icon: Briefcase,
    colorClass: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  industry: {
    label: 'Industry',
    description: 'Specialized documents for your profession',
    icon: Crown,
    colorClass: 'bg-amber-50 text-amber-700 border-amber-200',
  },
};

// Get bundle recommendations based on current selection and owned services
function getBundleRecommendations(
  selectedIds: string[],
  ownedIds: string[]
): { group: ServiceGroup; missingIds: string[]; missingCount: number }[] {
  const allOwned = new Set([...selectedIds, ...ownedIds]);
  const recommendations: { group: ServiceGroup; missingIds: string[]; missingCount: number }[] = [];

  for (const group of serviceGroups) {
    const missing = group.serviceIds.filter(id => !allOwned.has(id));
    if (missing.length >= 1 && missing.length < group.serviceIds.length) {
      recommendations.push({ group, missingIds: missing, missingCount: missing.length });
    }
  }

  return recommendations.sort((a, b) => a.missingCount - b.missingCount);
}

// Check if selection completes a bundle
function getCompletedBundle(selectedIds: string[]): ServiceGroup | null {
  const selectedSet = new Set(selectedIds);
  let bestMatch: ServiceGroup | null = null;

  for (const group of serviceGroups) {
    if (group.serviceIds.length >= 2) {
      const isComplete = group.serviceIds.every(id => selectedSet.has(id));
      if (isComplete) {
        if (!bestMatch || group.discountPercent > bestMatch.discountPercent) {
          bestMatch = group;
        }
      }
    }
  }
  return bestMatch;
}

function CheckoutPageInner() {
  const searchParams = useSearchParams();
  const preselectedParam = searchParams.get('services');
  const preselectedIds = preselectedParam
    ? preselectedParam.split(',').filter((id) => getServiceById(id))
    : [];

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const [purchasedServices, setPurchasedServices] = useState<string[]>([]);
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);
  const [socialMediaPostCount, setSocialMediaPostCount] = useState(5);
  const [selectedWebsitePages, setSelectedWebsitePages] = useState<string[]>(['Homepage']);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!user) {
      const defaultIds = preselectedIds.length > 0 ? preselectedIds : ['business_foundations_pack'];
      setSelectedServiceIds(defaultIds);
      setIsLoadingProfile(false);
      setInitialized(true);
      return;
    }

    const fetchPurchasedServices = async () => {
      try {
        const ids = new Set<string>();

        const { data: customer } = await supabase
          .from('stripe_customers')
          .select('customer_id')
          .eq('user_id', user.id)
          .maybeSingle();

        if (customer?.customer_id) {
          const { data: orders } = await supabase
            .from('stripe_orders')
            .select('checkout_session_id, status, service_ids')
            .eq('customer_id', customer.customer_id)
            .eq('status', 'completed');

          if (orders && orders.length > 0) {
            for (const order of orders) {
              if (order.service_ids && Array.isArray(order.service_ids) && order.service_ids.length > 0) {
                order.service_ids.forEach((id: string) => ids.add(id));
              } else {
                ids.add('business_foundations_pack');
              }
            }
          }

          const { data: subs } = await supabase
            .from('stripe_subscriptions')
            .select('price_id, status')
            .eq('customer_id', customer.customer_id);

          if (subs) {
            for (const sub of subs) {
              if (sub.status === 'active' || sub.status === 'trialing') {
                const svc = serviceCatalog.find(
                  (s) => s.stripePriceIds.test === sub.price_id || s.stripePriceIds.live === sub.price_id
                );
                if (svc) ids.add(svc.id);
              }
            }
          }
        }

        if (ids.size === 0) {
          const { data: services, error: svcErr } = await supabase
            .from('services_purchased')
            .select('service_id')
            .eq('user_id', user.id)
            .eq('status', 'active');

          if (!svcErr && services && services.length > 0) {
            services.forEach((s: { service_id: string }) => ids.add(s.service_id));
          }
        }

        if (ids.size === 0) {
          const { data: profile, error: profileErr } = await supabase
            .from('client_profiles')
            .select('purchased_upsells')
            .eq('user_id', user.id)
            .maybeSingle();

          if (!profileErr && profile?.purchased_upsells && Array.isArray(profile.purchased_upsells)) {
            ids.add('business_foundations_pack');
            profile.purchased_upsells.forEach((id: string) => ids.add(id));
          }
        }

        setPurchasedServices(Array.from(ids));
      } catch (err) {
        console.error('Failed to fetch purchased services:', err);
      } finally {
        setIsLoadingProfile(false);
        setInitialized(true);
      }
    };

    fetchPurchasedServices();
  }, [user]);

  useEffect(() => {
    if (!initialized) return;
    if (selectedServiceIds.length > 0) return;

    if (preselectedIds.length > 0) {
      const valid = preselectedIds.filter((id) => !purchasedServices.includes(id));
      setSelectedServiceIds(valid.length > 0 ? valid : []);
    } else if (purchasedServices.length > 0) {
      setSelectedServiceIds([]);
    } else {
      setSelectedServiceIds(['business_foundations_pack']);
    }
  }, [initialized]);

  const websitePageCount = selectedWebsitePages.length;
  const { subtotal, discountPercentage, discountAmount, total, groupId, servicePrices } = calculateTotal(
    selectedServiceIds,
    {
      socialMediaPostCount: selectedServiceIds.includes('social_media_pack') ? socialMediaPostCount : undefined,
      websitePageCount: selectedServiceIds.includes('website_copy_pack') ? websitePageCount : undefined,
    }
  );

  // Get completed bundle info
  const completedBundle = getCompletedBundle(selectedServiceIds);
  const bundleSavedMessage = completedBundle
    ? `You've unlocked the ${completedBundle.name}! ${completedBundle.discountPercent}% off applied.`
    : null;

  // Get recommendations
  const recommendations = getBundleRecommendations(selectedServiceIds, purchasedServices);

  // Calculate tier breakdown - exclude subscriptions from tier sections
  const foundationServices = getServicesByTier('foundation').filter(
    (s) => !purchasedServices.includes(s.id) && s.mode !== 'subscription'
  );
  const operationsServices = getServicesByTier('operations').filter(
    (s) => !purchasedServices.includes(s.id)
  );
  const industryServices = getServicesByTier('industry').filter(
    (s) => !purchasedServices.includes(s.id)
  );
  const subscriptionServices = serviceCatalog.filter(
    (s) => s.mode === 'subscription' && !purchasedServices.includes(s.id)
  );

  // Current tier from selection
  const currentTier = getHighestTier(selectedServiceIds);

  const intakeSections = buildIntakeForm(selectedServiceIds);
  const sectionCount = intakeSections.length;
  const estimatedMinutes = Math.ceil(sectionCount * 2.5);

  const isRepurchaseAttempt = user && purchasedServices.length > 0 && selectedServiceIds.every(
    (id) => purchasedServices.includes(id)
  );

  const toggleService = (serviceId: string) => {
    if (purchasedServices.includes(serviceId)) return;

    setSelectedServiceIds((prev) => {
      if (prev.includes(serviceId)) {
        if (prev.length === 1) return prev;
        return prev.filter((id) => id !== serviceId);
      }
      return [...prev, serviceId];
    });
  };

  const selectAllFromBundle = (group: ServiceGroup) => {
    const missingFromSelected = group.serviceIds.filter(
      (id) => !selectedServiceIds.includes(id) && !purchasedServices.includes(id)
    );
    if (missingFromSelected.length > 0) {
      setSelectedServiceIds((prev) => [...prev, ...missingFromSelected]);
    }
  };

  const toggleWebsitePage = (page: string) => {
    setSelectedWebsitePages((prev) => {
      if (prev.includes(page)) {
        if (prev.length === 1) return prev;
        return prev.filter((p) => p !== page);
      }
      return [...prev, page];
    });
  };

  const handleCheckout = async () => {
    if (selectedServiceIds.length === 0) {
      setError('Please select at least one service.');
      return;
    }

    if (isRepurchaseAttempt) {
      setError('You already own these services. Please select a new service to add.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      if (!supabaseUrl) {
        throw new Error('Supabase URL not configured. Check your environment variables.');
      }

      const requestBody: Record<string, unknown> = {
        service_ids: selectedServiceIds,
        mode: stripeMode,
        success_url: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${window.location.origin}/checkout`,
      };

      if (selectedServiceIds.includes('social_media_pack')) {
        requestBody.social_media_post_count = socialMediaPostCount;
      }

      if (selectedServiceIds.includes('website_copy_pack')) {
        requestBody.website_page_count = websitePageCount;
        requestBody.website_pages_selected = selectedWebsitePages;
      }

      // Pass group_id if a bundle is completed
      if (groupId) {
        requestBody.group_id = groupId;
      }

      const response = await fetch(`${supabaseUrl}/functions/v1/stripe-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (response.status === 404 || response.type === 'opaque') {
        throw new Error('The checkout service is starting up. Please wait 30 seconds and try again.');
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Checkout failed (status ${response.status})`);
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned from server');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      const message = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // Service card component for tier sections
  const ServiceCard = ({ service }: { service: ServiceCatalogEntry }) => {
    const isSelected = selectedServiceIds.includes(service.id);
    const isDisabled = purchasedServices.includes(service.id);
    const servicePrice = servicePrices.find(sp => sp.id === service.id);
    const hasTiers = service.pricingTiers && service.pricingTiers.length > 0;

    return (
      <div
        className={`relative border-2 rounded-xl transition-all duration-200 ${
          isDisabled
            ? 'border-slate-200 bg-slate-50 cursor-not-allowed opacity-60'
            : isSelected
              ? 'border-navy bg-navy/5 shadow-md'
              : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm cursor-pointer'
        }`}
      >
        <div
          onClick={() => !isDisabled && toggleService(service.id)}
          className="p-4"
        >
          <div className="flex items-start gap-3">
            <div
              className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-all ${
                isDisabled
                  ? 'bg-slate-300'
                  : isSelected
                    ? 'bg-navy shadow-inner'
                    : 'border-2 border-slate-300 bg-white'
              }`}
            >
              {(isSelected || isDisabled) && (
                <Check size={12} className="text-white" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <h3 className="font-inter font-semibold text-dark-text text-sm">
                    {service.name}
                  </h3>
                  <p className="font-inter text-secondary-text text-xs mt-0.5 max-w-sm">
                    {service.shortDescription}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  {isSelected && servicePrice && discountPercentage > 0 ? (
                    <div>
                      <span className="font-inter text-secondary-text line-through text-xs">
                        £{servicePrice.originalPrice.toFixed(2)}
                      </span>
                      <span className="font-inter font-bold text-navy ml-1 text-sm">
                        £{servicePrice.discountedPrice.toFixed(2)}
                      </span>
                    </div>
                  ) : (
                    <span className="font-inter font-bold text-navy text-sm">
                      {service.id === 'website_copy_pack' && service.pricingTiers
                        ? `From £${service.pricingTiers[0].price}`
                        : hasTiers && service.pricingTiers
                          ? `From £${service.pricingTiers[0].price}`
                          : `£${service.price.toFixed(2)}`}
                    </span>
                  )}
                  {isSelected && discountPercentage > 0 && (
                    <div className="inline-flex items-center gap-1 bg-green-100 text-green-700 rounded-full px-1.5 py-0.5 mt-1">
                      <Tag size={10} />
                      <span className="font-inter font-medium text-xs">
                        {discountPercentage}% off
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Social Media quantity selector */}
              {service.id === 'social_media_pack' && isSelected && service.pricingTiers && !isDisabled && (
                <div className="mt-3 pt-3 border-t border-slate-200">
                  <label className="font-inter font-medium text-dark-text text-xs mb-2 block">
                    How many posts?
                  </label>
                  <div className="grid grid-cols-6 gap-1">
                    {service.pricingTiers.map((tier) => (
                      <button
                        key={tier.quantity}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSocialMediaPostCount(tier.quantity);
                        }}
                        className={`py-2 px-1 rounded text-center transition-all text-xs ${
                          socialMediaPostCount === tier.quantity
                            ? 'bg-navy text-white'
                            : 'bg-slate-100 text-dark-text hover:bg-slate-200'
                        }`}
                      >
                        {tier.quantity}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Website page selector */}
              {service.id === 'website_copy_pack' && isSelected && service.pricingTiers && !isDisabled && (
                <div className="mt-3 pt-3 border-t border-slate-200">
                  <label className="font-inter font-medium text-dark-text text-xs mb-2 block">
                    Which pages? ({websitePageCount} selected = £{getServicePrice(service.id, websitePageCount).toFixed(2)})
                  </label>
                  <div className="flex flex-wrap gap-1">
                    {WEBSITE_PAGE_OPTIONS.map((page) => {
                      const isSelectedPage = selectedWebsitePages.includes(page);
                      return (
                        <button
                          key={page}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWebsitePage(page);
                          }}
                          className={`py-1.5 px-2 rounded text-xs font-inter font-medium transition-all ${
                            isSelectedPage
                              ? 'bg-navy text-white'
                              : 'bg-slate-100 text-dark-text hover:bg-slate-200'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Tier section component
  const TierSection = ({ tier, services }: { tier: ServiceTier; services: ServiceCatalogEntry[] }) => {
    const config = TIER_CONFIG[tier];
    const Icon = config.icon;
    const selectedFromTier = selectedServiceIds.filter(id =>
      services.some(s => s.id === id)
    ).length;

    if (services.length === 0) return null;

    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className={`px-5 py-3 border-b border-slate-100 ${config.colorClass.split(' ')[0]}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon size={18} className="text-navy" />
              <h2 className="font-inter font-bold text-navy" style={{ fontSize: '1.07rem' }}>
                {config.label} Tier
              </h2>
              {selectedFromTier > 0 && (
                <span className="bg-navy text-white font-inter font-medium text-xs px-2 py-0.5 rounded-full">
                  {selectedFromTier} selected
                </span>
              )}
            </div>
            <span className="font-inter text-secondary-text text-xs">
              {services.length} available
            </span>
          </div>
          <p className="font-inter text-secondary-text text-xs mt-1">{config.description}</p>
        </div>
        <div className="p-4 space-y-2">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    );
  };

  if (isLoadingProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-24 pb-16 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy" />
      </div>
    );
  }

  // Calculate one-time vs recurring totals
  const oneTimeTotal = servicePrices
    .filter(sp => getServiceById(sp.id)?.mode === 'payment')
    .reduce((sum, sp) => sum + sp.discountedPrice, 0);
  const monthlyTotal = servicePrices
    .filter(sp => getServiceById(sp.id)?.mode === 'subscription')
    .reduce((sum, sp) => sum + sp.discountedPrice, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-20 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-navy/10 rounded-full px-4 py-1.5 mb-4">
            <Package size={16} className="text-navy" />
            <span className="font-inter font-medium text-navy text-sm">Secure Checkout</span>
          </div>
          <h1 className="font-inter font-bold text-navy text-3xl sm:text-4xl mb-3">
            {user && purchasedServices.length > 0 ? 'Add More Services' : 'Complete Your Purchase'}
          </h1>
          <p className="font-inter text-secondary-text text-lg max-w-2xl mx-auto">
            {user && purchasedServices.length > 0
              ? 'Enhance your package with additional services.'
              : 'Select the services you need. Bundle and save up to 25%.'}
          </p>
        </div>

        {/* Current services section for returning customers */}
        {user && purchasedServices.length > 0 && (
          <div className="mb-8 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="rounded-full bg-success/20 p-2">
                <Check size={18} className="text-success" />
              </div>
              <div>
                <h2 className="font-inter font-semibold text-navy text-lg">Your Current Services</h2>
                <p className="font-inter text-secondary-text text-sm mt-0.5">
                  You already own the following:
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              {purchasedServices.map((serviceId) => {
                const service = getServiceById(serviceId);
                return (
                  <div
                    key={serviceId}
                    className="bg-white border border-green-200 rounded-xl px-4 py-2.5 inline-flex items-center gap-2 shadow-sm"
                  >
                    <Check size={16} className="text-success" />
                    <span className="font-inter font-medium text-dark-text">
                      {service?.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Service selection area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Tiered sections */}
            <TierSection tier="foundation" services={foundationServices} />
            <TierSection tier="operations" services={operationsServices} />
            <TierSection tier="industry" services={industryServices} />

            {/* Subscriptions section */}
            {subscriptionServices.length > 0 && (
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-200 overflow-hidden">
                <div className="px-5 py-3 border-b border-indigo-100">
                  <div className="flex items-center gap-2">
                    <RefreshCw size={18} className="text-indigo-600" />
                    <h2 className="font-inter font-bold text-indigo-900" style={{ fontSize: '1.07rem' }}>
                      Ongoing Support
                    </h2>
                  </div>
                  <p className="font-inter text-indigo-700 text-xs mt-1">
                    Monthly updates and priority support for your documents
                  </p>
                </div>
                <div className="p-4 space-y-2">
                  {subscriptionServices.map((service) => {
                    const isSelected = selectedServiceIds.includes(service.id);
                    const isDisabled = purchasedServices.includes(service.id);

                    return (
                      <div
                        key={service.id}
                        onClick={() => !isDisabled && toggleService(service.id)}
                        className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                          isDisabled
                            ? 'border-slate-200 bg-slate-50 opacity-60 cursor-not-allowed'
                            : isSelected
                              ? 'border-indigo-500 bg-indigo-50'
                              : 'border-indigo-200 bg-white hover:border-indigo-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-md flex items-center justify-center ${
                              isSelected ? 'bg-indigo-500' : 'border-2 border-indigo-300 bg-white'
                            }`}>
                              {isSelected && <Check size={12} className="text-white" />}
                            </div>
                            <div>
                              <h3 className="font-inter font-semibold text-dark-text text-sm">
                                {service.name}
                              </h3>
                              <p className="font-inter text-secondary-text text-xs mt-0.5">
                                {service.shortDescription}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="font-inter font-bold text-indigo-700 text-sm">
                              £{service.price.toFixed(2)}
                            </span>
                            <span className="font-inter text-indigo-600 text-xs block">
                              /month
                            </span>
                          </div>
                        </div>
                        {isSelected && service.includes.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-indigo-200">
                            <div className="flex flex-wrap gap-1">
                              {service.includes.slice(0, 3).map((item) => (
                                <span
                                  key={item}
                                  className="inline-flex items-center gap-1 bg-white rounded-full px-2 py-0.5"
                                >
                                  <span className="font-inter text-xs text-indigo-700">{item}</span>
                                </span>
                              ))}
                              {service.includes.length > 3 && (
                                <span className="inline-flex items-center bg-indigo-100 rounded-full px-2 py-0.5">
                                  <span className="font-inter text-xs text-indigo-700 font-medium">
                                    +{service.includes.length - 3} more
                                  </span>
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Checkout sidebar */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm sticky top-24">
              {/* Order summary header */}
              <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-4 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <h3 className="font-inter font-bold text-navy text-lg">Order Summary</h3>
                  <span className={`font-inter text-sm font-medium px-3 py-1 rounded-full ${
                    currentTier === 'industry'
                      ? 'bg-amber-100 text-amber-700'
                      : currentTier === 'operations'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-slate-100 text-slate-700'
                  }`}>
                    {TIER_CONFIG[currentTier].label}
                  </span>
                </div>
              </div>

              <div className="p-6 space-y-5">
                {/* Bundle completions */}
                {bundleSavedMessage && (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-success/20 p-2">
                        <Check size={16} className="text-success" />
                      </div>
                      <div>
                        <p className="font-inter font-semibold text-green-800 text-sm">
                          {bundleSavedMessage}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Bundle recommendations */}
                {recommendations.length > 0 && !bundleSavedMessage && (
                  <div className="bg-navy/5 border border-navy/20 rounded-xl p-4">
                    <p className="font-inter font-semibold text-navy text-sm mb-3">
                      Complete a bundle for extra savings
                    </p>
                    <div className="space-y-2">
                      {recommendations.slice(0, 2).map(({ group, missingIds, missingCount }) => (
                        <button
                          key={group.id}
                          onClick={() => selectAllFromBundle(group)}
                          className="w-full text-left p-3 bg-white rounded-lg border border-slate-200 hover:border-navy/30 hover:bg-navy/5 transition-all"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Plus size={14} className="text-navy" />
                              <span className="font-inter font-medium text-dark-text text-xs">
                                {group.name}
                              </span>
                            </div>
                            <span className="font-inter font-bold text-green-700 text-xs">
                              {group.discountPercent}% off
                            </span>
                          </div>
                          <p className="font-inter text-secondary-text text-xs mt-1">
                            {missingCount === 1
                              ? `Add ${getServiceById(missingIds[0])?.name || '1 more'} to unlock`
                              : `Add ${missingCount} more services`}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Generic bundle discount banner */}
                {selectedServiceIds.length >= 2 && !bundleSavedMessage && discountPercentage > 0 && !groupId && (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-success/20 p-2">
                        <Tag size={16} className="text-success" />
                      </div>
                      <div>
                        <p className="font-inter font-semibold text-green-800 text-sm">
                          {getBundleDiscountLabel(selectedServiceIds.length)}
                        </p>
                        <p className="font-inter text-green-700 text-xs">
                          All services reduced by {discountPercentage}%
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Bundle savings hint */}
                {selectedServiceIds.length === 1 && (
                  <div className="bg-navy/5 border border-navy/20 rounded-xl p-4">
                    <p className="font-inter text-sm text-navy">
                      <strong>Add another service</strong> to unlock a 10% bundle discount. Add 3+ for 15% off.
                    </p>
                  </div>
                )}

                {/* Tier upgrade hint */}
                {currentTier === 'foundation' && selectedServiceIds.length > 0 && operationsServices.length > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                    <p className="font-inter text-xs text-blue-800">
                      <strong>Tip:</strong> Add an Operations pack for client management and payment protection tools.
                    </p>
                  </div>
                )}

                {/* Selected services list */}
                {selectedServiceIds.length > 0 && (
                  <div className="space-y-2">
                    {servicePrices.map((sp) => {
                      const service = getServiceById(sp.id);
                      if (!service) return null;
                      const hasDiscount = discountPercentage > 0 && sp.originalPrice !== sp.discountedPrice;

                      return (
                        <div key={sp.id} className="flex items-center justify-between py-2">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-navy/10 flex items-center justify-center">
                              <Package size={14} className="text-navy" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-inter font-medium text-dark-text text-sm">
                                  {service.name}
                                </span>
                                <span className={`font-inter text-xs px-1.5 py-0.5 rounded ${
                                  service.mode === 'subscription'
                                    ? 'bg-indigo-100 text-indigo-700'
                                    : 'bg-slate-100 text-slate-600'
                                }`}>
                                  {service.mode === 'subscription' ? 'Monthly' : 'One-time'}
                                </span>
                              </div>
                              {sp.id === 'social_media_pack' && selectedServiceIds.includes('social_media_pack') && (
                                <span className="font-inter text-secondary-text text-xs">
                                  {socialMediaPostCount} posts
                                </span>
                              )}
                              {sp.id === 'website_copy_pack' && selectedServiceIds.includes('website_copy_pack') && (
                                <span className="font-inter text-secondary-text text-xs">
                                  {websitePageCount} page{websitePageCount !== 1 ? 's' : ''}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            {hasDiscount ? (
                              <div>
                                <span className="font-inter text-secondary-text line-through text-xs">
                                  £{sp.originalPrice.toFixed(2)}
                                </span>
                                <span className="font-inter font-semibold text-navy ml-1 text-sm">
                                  £{sp.discountedPrice.toFixed(2)}
                                </span>
                              </div>
                            ) : (
                              <span className="font-inter font-semibold text-navy text-sm">
                                £{sp.originalPrice.toFixed(2)}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Price breakdown */}
                {selectedServiceIds.length > 0 && (
                  <div className="border-t border-slate-200 pt-4 space-y-2">
                    {oneTimeTotal > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="font-inter text-secondary-text text-sm">One-time total</span>
                        <span className="font-inter font-medium text-dark-text text-sm">
                          £{oneTimeTotal.toFixed(2)}
                        </span>
                      </div>
                    )}
                    {monthlyTotal > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="font-inter text-secondary-text text-sm">Monthly subscription</span>
                        <span className="font-inter font-medium text-dark-text text-sm">
                          £{monthlyTotal.toFixed(2)}/mo
                        </span>
                      </div>
                    )}
                    {discountAmount > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="font-inter font-medium text-green-700 flex items-center gap-1 text-sm">
                          <Tag size={14} />
                          Bundle discount ({discountPercentage}%)
                        </span>
                        <span className="font-inter font-semibold text-green-700 text-sm">
                          -£{discountAmount.toFixed(2)}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                      <span className="font-inter font-bold text-navy text-lg">
                        {monthlyTotal > 0 ? 'Due today' : 'Total'}
                      </span>
                      <span className="font-inter font-bold text-navy" style={{ fontSize: '1.43rem' }}>
                        £{total.toFixed(2)}
                      </span>
                    </div>
                    {monthlyTotal > 0 && (
                      <p className="font-inter text-secondary-text text-xs">
                        First payment today, then £{monthlyTotal.toFixed(2)}/month. Cancel anytime.
                      </p>
                    )}
                  </div>
                )}

                {/* Intake preview */}
                {selectedServiceIds.length > 0 && sectionCount > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-medium-blue/20 p-2 shrink-0">
                        <Zap size={16} className="text-medium-blue" />
                      </div>
                      <div>
                        <p className="font-inter font-semibold text-navy text-sm">
                          {sectionCount} section intake form
                        </p>
                        <p className="font-inter text-secondary-text text-xs mt-0.5">
                          Approx {estimatedMinutes} min • Save and resume anytime
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Trust signals */}
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <ShieldCheck size={16} className="text-success shrink-0" />
                    <span className="font-inter text-xs text-dark-text">Secure checkout via Stripe</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock size={16} className="text-medium-blue shrink-0" />
                    <span className="font-inter text-xs text-dark-text">24-hour delivery after intake</span>
                  </div>
                </div>

                {/* Error message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                    <AlertCircle size={18} className="text-danger shrink-0 mt-0.5" />
                    <p className="font-inter text-sm text-danger">{error}</p>
                  </div>
                )}

                {/* Checkout button */}
                <button
                  onClick={handleCheckout}
                  disabled={loading || selectedServiceIds.length === 0}
                  className={`w-full font-inter font-semibold text-white rounded-xl transition-all duration-200 flex items-center justify-center gap-2 ${
                    selectedServiceIds.length === 0
                      ? 'bg-slate-300 cursor-not-allowed'
                      : 'bg-navy hover:bg-medium-blue hover:shadow-lg hover:-translate-y-0.5'
                  }`}
                  style={{ padding: '16px 24px', fontSize: '1rem' }}
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                  ) : selectedServiceIds.length === 0 ? (
                    'Select a Service'
                  ) : (
                    <>
                      Pay £{total.toFixed(2)}
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>

                <p className="font-inter text-secondary-text text-xs text-center">
                  {user ? 'Ready to proceed' : "No account needed — you'll get a login link after payment."}
                </p>

                <div className="pt-4 border-t border-slate-200">
                  <Link
                    href="/pricing"
                    className="font-inter text-medium-blue text-sm hover:underline block text-center"
                  >
                    View full pricing details
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-24 pb-16 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy" />
        </div>
      }
    >
      <CheckoutPageInner />
    </Suspense>
  );
}
