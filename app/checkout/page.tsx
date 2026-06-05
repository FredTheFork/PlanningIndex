'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShieldCheck, Clock, ArrowRight, Check, AlertCircle, Zap } from 'lucide-react';
import { stripeMode } from '@/lib/stripe/config';
import {
  serviceCatalog,
  getServiceById,
  calculateTotal,
  getBundleSavingsMessage,
} from '@/lib/services/service-catalog';
import { buildIntakeForm } from '@/lib/forms/build-intake-form';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase/client';
import GuaranteeBadge from '@/components/ui/GuaranteeBadge';

export default function CheckoutPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const [purchasedServices, setPurchasedServices] = useState<string[]>([]);
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);
  const [isLoadingProfile, setIsLoadingProfile] = useState(!!user);

  useEffect(() => {
    if (!user) {
      setSelectedServiceIds(['business_foundations_pack']);
      setIsLoadingProfile(false);
      return;
    }

    const fetchPurchasedServices = async () => {
      try {
        const { data, error: err } = await supabase
          .from('client_profiles')
          .select('purchased_upsells')
          .eq('user_id', user.id)
          .maybeSingle();

        if (err) {
          console.error('Error fetching purchased services:', err);
        }

        if (data?.purchased_upsells && Array.isArray(data.purchased_upsells)) {
          setPurchasedServices(data.purchased_upsells);
        }
      } catch (err) {
        console.error('Failed to fetch purchased services:', err);
      } finally {
        setIsLoadingProfile(false);
      }
    };

    fetchPurchasedServices();
  }, [user]);

  const { subtotal, discount, total } = calculateTotal(selectedServiceIds);
  const savingsMessage = getBundleSavingsMessage(selectedServiceIds);
  const isBestValue = selectedServiceIds.length >= 3 && discount > 0;
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

      const response = await fetch(`${supabaseUrl}/functions/v1/stripe-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          service_ids: selectedServiceIds,
          mode: stripeMode,
          success_url: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${window.location.origin}/checkout`,
        }),
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
      <div className="min-h-screen bg-off-white pt-24 pb-16 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-off-white pt-24 pb-16">
      <div className="max-w-[1000px] mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="font-inter font-bold text-navy text-3xl mb-3">
            {user && purchasedServices.length > 0 ? 'Add More Services' : 'Complete Your Purchase'}
          </h1>
          <p className="font-inter text-secondary-text text-lg">
            {user && purchasedServices.length > 0
              ? 'Enhance your package with additional services.'
              : 'Choose the services you need. Each one works on its own — or combine them for a discount.'}
          </p>
        </div>

        {/* Current services section for logged-in returning customers */}
        {user && purchasedServices.length > 0 && (
          <div className="mb-8 bg-navy bg-opacity-5 border border-medium-blue rounded-lg p-6">
            <div className="flex items-start gap-3 mb-4">
              <Check size={20} className="text-success shrink-0 mt-0.5" />
              <div>
                <h2 className="font-inter font-semibold text-navy">Your Current Services</h2>
                <p className="font-inter text-secondary-text text-sm mt-1">
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
                    className="bg-white border border-border rounded-lg px-4 py-2 inline-flex items-center gap-2"
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

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Service selection grid */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-border p-8">
              <h2 className="font-inter font-bold text-navy text-xl mb-6">
                {user && purchasedServices.length > 0 ? 'Available Services' : 'Select Your Services'}
              </h2>

              {/* All available services as independent cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {availableServices.map((service) => {
                  const isSelected = selectedServiceIds.includes(service.id);
                  const isDisabled = purchasedServices.includes(service.id);

                  return (
                    <div
                      key={service.id}
                      onClick={() => !isDisabled && toggleService(service.id)}
                      className={`border-2 rounded-lg p-5 transition-all duration-200 ${
                        isDisabled
                          ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60'
                          : isSelected
                            ? 'border-medium-blue bg-blue-50 cursor-pointer'
                            : 'border-border bg-white hover:border-gray-300 cursor-pointer'
                      }`}
                    >
                      <div className="flex items-start gap-3 mb-2">
                        <div
                          className={`w-5 h-5 rounded flex items-center justify-center shrink-0 mt-0.5 ${
                            isDisabled
                              ? 'bg-gray-300'
                              : isSelected
                                ? 'bg-medium-blue'
                                : 'border-2 border-gray-300 bg-white'
                          }`}
                        >
                          {(isSelected || isDisabled) && (
                            <Check size={14} className="text-white" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-inter font-bold text-dark-text" style={{ fontSize: '0.95rem' }}>
                            {service.name}
                          </h3>
                          {!isDisabled && (
                            <p className="font-inter font-semibold text-navy mt-1">
                              {service.priceLabel}
                            </p>
                          )}
                        </div>
                      </div>
                      <p
                        className={`font-inter text-secondary-text mt-2 ${
                          isDisabled ? 'line-through' : ''
                        }`}
                        style={{ fontSize: '0.8rem' }}
                      >
                        {service.description}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Intake sections preview */}
              {selectedServiceIds.length > 0 && (
                <div className="border-t border-border pt-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                    <Zap size={20} className="text-medium-blue shrink-0 mt-0.5" />
                    <div>
                      <p className="font-inter font-semibold text-navy">
                        Your intake will cover {sectionCount} section{sectionCount !== 1 ? 's' : ''}, approx {estimatedMinutes} minutes
                      </p>
                      <p className="font-inter text-secondary-text text-sm mt-1">
                        Answer questions tailored to {selectedServiceIds.length === 1 ? 'this service' : 'your selected services'}. You can save and resume anytime.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Price Breakdown */}
              {selectedServiceIds.length > 0 && (
                <div className="border-t border-border pt-6 mt-6">
                  {savingsMessage && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4 flex items-center gap-3">
                      {isBestValue && (
                        <span className="bg-green-600 text-white text-xs font-inter font-bold px-2 py-1 rounded-full uppercase tracking-wide shrink-0">
                          Best Value
                        </span>
                      )}
                      <p className="font-inter font-semibold text-green-800" style={{ fontSize: '0.9rem' }}>
                        {savingsMessage}
                      </p>
                    </div>
                  )}

                  <div className="space-y-2 mb-3">
                    {selectedServiceIds.map((serviceId) => {
                      const service = getServiceById(serviceId);
                      if (!service) return null;
                      return (
                        <div key={serviceId} className="flex items-center justify-between">
                          <span className="font-inter text-secondary-text" style={{ fontSize: '0.9rem' }}>
                            {service.name}
                          </span>
                          <span className="font-inter font-semibold text-navy">
                            £{service.price.toFixed(2)}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {discount > 0 && (
                    <div className="flex items-center justify-between mb-3 pt-2 border-t border-gray-200">
                      <span className="font-inter font-medium text-green-700" style={{ fontSize: '0.9rem' }}>
                        Bundle discount
                      </span>
                      <span className="font-inter font-semibold text-green-700">
                        -£{discount.toFixed(2)}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t border-gray-300">
                    <span className="font-inter font-bold text-navy">Total</span>
                    <span className="font-inter font-bold text-navy text-2xl">
                      £{total.toFixed(2)}
                    </span>
                  </div>

                  <p className="font-inter text-secondary-text text-xs mt-3">
                    {hasSubscription
                      ? 'One-time charge for services + recurring subscription for Quarterly Refresh.'
                      : 'One-time payment. No recurring charges.'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Checkout sidebar */}
          <div>
            <div className="bg-white rounded-lg border border-border p-8 sticky top-24">
              {/* Guarantee Badge */}
              <div className="mb-6">
                <GuaranteeBadge size="small" />
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={18} className="text-success shrink-0" />
                  <span className="font-inter font-medium text-sm text-dark-text">Secure checkout via Stripe</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={18} className="text-medium-blue shrink-0" />
                  <span className="font-inter font-medium text-sm text-dark-text">24-hour delivery after intake</span>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 flex items-start gap-2">
                  <AlertCircle size={18} className="text-danger shrink-0 mt-0.5" />
                  <p className="font-inter text-sm text-danger">{error}</p>
                </div>
              )}

              <button
                onClick={handleCheckout}
                disabled={loading || selectedServiceIds.length === 0}
                className="w-full font-inter font-semibold text-white bg-navy rounded-md hover:bg-medium-blue transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{ padding: '14px 24px', fontSize: '1rem' }}
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

              <p className="font-inter text-secondary-text text-xs mt-4 text-center">
                {user ? 'Ready to proceed' : "No account needed - you'll get a login link after payment."}
              </p>

              <div className="mt-6 pt-4 border-t border-border">
                <Link
                  href="/pricing"
                  className="font-inter text-medium-blue text-sm hover:underline block text-center"
                >
                  View full pricing
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
