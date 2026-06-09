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
  Sparkles,
} from 'lucide-react';
import { stripeMode } from '@/lib/stripe/config';
import {
  serviceCatalog,
  getServiceById,
  calculateTotal,
  getBundleDiscountLabel,
  getBundleSavingsMessage,
  getServicePrice,
} from '@/lib/services/service-catalog';
import { buildIntakeForm } from '@/lib/forms/build-intake-form';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase/client';
import GuaranteeBadge from '@/components/ui/GuaranteeBadge';

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

        // Primary: stripe_customers + stripe_orders + stripe_subscriptions (live schema)
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
                // Legacy orders without service_ids — assume business_foundations_pack
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

        // Fallback: services_purchased table
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

        // Fallback: client_profiles.purchased_upsells
        if (ids.size === 0) {
          const { data: profile, error: profileErr } = await supabase
            .from('client_profiles')
            .select('purchased_upsells')
            .eq('user_id', user.id)
            .maybeSingle();

          if (!profileErr && profile?.purchased_upsells && Array.isArray(profile.purchased_upsells)) {
            // purchased_upsells contains non-core service IDs; core pack is assumed
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

  // Set selected services once purchased services are loaded
  useEffect(() => {
    if (!initialized) return;
    if (selectedServiceIds.length > 0) return;

    if (preselectedIds.length > 0) {
      const valid = preselectedIds.filter((id) => !purchasedServices.includes(id));
      setSelectedServiceIds(valid.length > 0 ? valid : []);
    } else if (purchasedServices.length > 0) {
      // Returning customer — don't pre-select anything
      setSelectedServiceIds([]);
    } else {
      setSelectedServiceIds(['business_foundations_pack']);
    }
  }, [initialized]);

  const { subtotal, discountPercentage, discountAmount, total, servicePrices } = calculateTotal(
    selectedServiceIds,
    { socialMediaPostCount: selectedServiceIds.includes('social_media_pack') ? socialMediaPostCount : undefined }
  );
  const savingsMessage = getBundleSavingsMessage(subtotal, discountPercentage);
  const hasSubscription = selectedServiceIds.some(
    (id) => getServiceById(id)?.mode === 'subscription'
  );

  const intakeSections = buildIntakeForm(selectedServiceIds);
  const sectionCount = intakeSections.length;
  const estimatedMinutes = Math.ceil(sectionCount * 2.5);

  const availableServices = serviceCatalog.filter(
    (service) => !purchasedServices.includes(service.id)
  );

  const isRepurchaseAttempt = user && purchasedServices.length > 0 && selectedServiceIds.every(
    (id) => purchasedServices.includes(id)
  );

  const toggleService = (serviceId: string) => {
    if (purchasedServices.includes(serviceId)) {
      return;
    }

    setSelectedServiceIds((prev) => {
      if (prev.includes(serviceId)) {
        if (prev.length === 1) return prev;
        return prev.filter((id) => id !== serviceId);
      }
      return [...prev, serviceId];
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

      // Include social media post count if social_media_pack is selected
      if (selectedServiceIds.includes('social_media_pack')) {
        requestBody.social_media_post_count = socialMediaPostCount;
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

  if (isLoadingProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-24 pb-16 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-20 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
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
              : 'Select the services you need. Bundle and save up to 15%.'}
          </p>
        </div>

        {/* Current services section for logged-in returning customers */}
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
          {/* Service selection grid */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-4">
                <h2 className="font-inter font-bold text-navy text-xl">
                  {user && purchasedServices.length > 0 ? 'Available Services' : 'Select Your Services'}
                </h2>
              </div>

              <div className="p-6 space-y-4">
                {availableServices.map((service) => {
                  const isSelected = selectedServiceIds.includes(service.id);
                  const isDisabled = purchasedServices.includes(service.id);
                  const servicePrice = servicePrices.find(sp => sp.id === service.id);
                  const hasTiers = service.pricingTiers && service.pricingTiers.length > 0;

                  return (
                    <div
                      key={service.id}
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
                        className="p-5"
                      >
                        <div className="flex items-start gap-4">
                          <div
                            className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                              isDisabled
                                ? 'bg-slate-300'
                                : isSelected
                                  ? 'bg-navy shadow-inner'
                                  : 'border-2 border-slate-300 bg-white'
                            }`}
                          >
                            {(isSelected || isDisabled) && (
                              <Check size={14} className="text-white" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4 flex-wrap">
                              <div>
                                <h3 className="font-inter font-bold text-dark-text text-lg">
                                  {service.name}
                                </h3>
                                <p className="font-inter text-secondary-text text-sm mt-1 max-w-md">
                                  {service.description}
                                </p>
                              </div>
                              <div className="text-right shrink-0">
                                {isSelected && servicePrice && discountPercentage > 0 ? (
                                  <div>
                                    <span className="font-inter text-secondary-text line-through text-sm">
                                      £{servicePrice.originalPrice.toFixed(2)}
                                    </span>
                                    <span className="font-inter font-bold text-navy text-xl ml-2">
                                      £{servicePrice.discountedPrice.toFixed(2)}
                                    </span>
                                  </div>
                                ) : (
                                  <span className="font-inter font-bold text-navy text-xl">
                                    {hasTiers && service.pricingTiers
                                      ? `From £${service.pricingTiers[0].price}`
                                      : `£${service.price.toFixed(2)}`}
                                  </span>
                                )}
                                {isSelected && discountPercentage > 0 && (
                                  <div className="inline-flex items-center gap-1 bg-green-100 text-green-700 rounded-full px-2 py-0.5 mt-1">
                                    <Tag size={12} />
                                    <span className="font-inter font-medium text-xs">
                                      {discountPercentage}% off
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Social Media quantity selector */}
                            {hasTiers && isSelected && service.pricingTiers && !isDisabled && (
                              <div className="mt-4 pt-4 border-t border-slate-200">
                                <label className="font-inter font-medium text-dark-text text-sm mb-3 block">
                                  How many posts?
                                </label>
                                <div className="space-y-3">
                                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                                    {service.pricingTiers.map((tier) => (
                                      <button
                                        key={tier.quantity}
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setSocialMediaPostCount(tier.quantity);
                                        }}
                                        className={`py-3 px-2 rounded-lg text-center transition-all ${
                                          socialMediaPostCount === tier.quantity
                                            ? 'bg-navy text-white shadow-md'
                                            : 'bg-slate-100 text-dark-text hover:bg-slate-200'
                                        }`}
                                      >
                                        <div className="font-inter font-bold text-lg">
                                          {tier.quantity}
                                        </div>
                                        <div className="font-inter text-xs opacity-80">
                                          posts
                                        </div>
                                      </button>
                                    ))}
                                  </div>
                                  <div className="flex items-center justify-between bg-slate-50 rounded-lg px-4 py-3">
                                    <span className="font-inter text-secondary-text text-sm">
                                      {socialMediaPostCount} social media posts
                                    </span>
                                    <span className="font-inter font-bold text-navy text-lg">
                                      £{getServicePrice(service.id, socialMediaPostCount).toFixed(2)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Service includes */}
                            {isSelected && service.includes.length > 0 && (
                              <div className="mt-4 pt-4 border-t border-slate-200">
                                <div className="flex flex-wrap gap-2">
                                  {service.includes.slice(0, 4).map((item) => (
                                    <span
                                      key={item}
                                      className="inline-flex items-center gap-1.5 bg-slate-100 rounded-full px-3 py-1.5"
                                    >
                                      <Sparkles size={12} className="text-navy" />
                                      <span className="font-inter text-xs text-dark-text">{item}</span>
                                    </span>
                                  ))}
                                  {service.includes.length > 4 && (
                                    <span className="inline-flex items-center bg-navy/10 rounded-full px-3 py-1.5">
                                      <span className="font-inter text-xs text-navy font-medium">
                                        +{service.includes.length - 4} more
                                      </span>
                                    </span>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Checkout sidebar */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm sticky top-24">
              {/* Order summary header */}
              <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-4 rounded-t-2xl">
                <h3 className="font-inter font-bold text-navy text-lg">Order Summary</h3>
              </div>

              <div className="p-6 space-y-6">
                {/* Guarantee Badge */}
                <GuaranteeBadge size="small" />

                {/* Bundle discount banner */}
                {selectedServiceIds.length >= 2 && discountPercentage > 0 && (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-success/20 p-2">
                        <Tag size={16} className="text-success" />
                      </div>
                      <div>
                        <p className="font-inter font-semibold text-green-800">
                          {getBundleDiscountLabel(selectedServiceIds.length)}
                        </p>
                        <p className="font-inter text-green-700 text-sm">
                          All selected services reduced by {discountPercentage}%
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

                {/* Selected services list */}
                {selectedServiceIds.length > 0 && (
                  <div className="space-y-3">
                    {servicePrices.map((sp) => {
                      const service = getServiceById(sp.id);
                      if (!service) return null;
                      const hasDiscount = discountPercentage > 0 && sp.originalPrice !== sp.discountedPrice;

                      return (
                        <div key={sp.id} className="flex items-center justify-between py-2">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-navy/10 flex items-center justify-center">
                              <Package size={16} className="text-navy" />
                            </div>
                            <div>
                              <span className="font-inter font-medium text-dark-text">
                                {service.name}
                              </span>
                              {sp.id === 'social_media_pack' && selectedServiceIds.includes('social_media_pack') && (
                                <span className="font-inter text-secondary-text text-xs block">
                                  {socialMediaPostCount} posts
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            {hasDiscount ? (
                              <div>
                                <span className="font-inter text-secondary-text line-through text-sm">
                                  £{sp.originalPrice.toFixed(2)}
                                </span>
                                <span className="font-inter font-semibold text-navy ml-2">
                                  £{sp.discountedPrice.toFixed(2)}
                                </span>
                              </div>
                            ) : (
                              <span className="font-inter font-semibold text-navy">
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
                    <div className="flex items-center justify-between">
                      <span className="font-inter text-secondary-text">Subtotal</span>
                      <span className="font-inter font-medium text-dark-text">
                        £{subtotal.toFixed(2)}
                      </span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="font-inter font-medium text-green-700 flex items-center gap-1">
                          <Tag size={14} />
                          Bundle discount ({discountPercentage}%)
                        </span>
                        <span className="font-inter font-semibold text-green-700">
                          -£{discountAmount.toFixed(2)}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                      <span className="font-inter font-bold text-navy text-lg">Total</span>
                      <span className="font-inter font-bold text-navy text-2xl">
                        £{total.toFixed(2)}
                      </span>
                    </div>
                    <p className="font-inter text-secondary-text text-xs">
                      {hasSubscription
                        ? 'One-time charge for services + recurring subscription for Quarterly Refresh.'
                        : 'One-time payment. No recurring charges.'}
                    </p>
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
                        <p className="font-inter font-semibold text-navy">
                          {sectionCount} section intake form
                        </p>
                        <p className="font-inter text-secondary-text text-sm mt-0.5">
                          Approx {estimatedMinutes} min • Save and resume anytime
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Trust signals */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <ShieldCheck size={18} className="text-success shrink-0" />
                    <span className="font-inter text-sm text-dark-text">Secure checkout via Stripe</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock size={18} className="text-medium-blue shrink-0" />
                    <span className="font-inter text-sm text-dark-text">24-hour delivery after intake</span>
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
