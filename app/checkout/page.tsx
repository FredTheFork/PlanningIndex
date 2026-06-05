'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, Clock, FileText, ArrowRight, Check } from 'lucide-react';
import { stripeMode } from '@/lib/stripe/config';
import {
  serviceCatalog,
  getServiceById,
  getCoreService,
  getOptionalServices,
  calculateTotal,
  getBundleSavingsMessage,
  type ServiceCatalogEntry,
} from '@/lib/services/service-catalog';
import GuaranteeBadge from '@/components/ui/GuaranteeBadge';
import ServiceSelector from '@/components/ui/AddOnSelector';

export default function CheckoutPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const coreService = getCoreService();
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([coreService.id]);

  const { subtotal, discount, total } = calculateTotal(selectedServiceIds);
  const savingsMessage = getBundleSavingsMessage(selectedServiceIds);
  const isBestValue = selectedServiceIds.length >= 3 && discount > 0;
  const hasSubscription = selectedServiceIds.some(
    (id) => getServiceById(id)?.mode === 'subscription'
  );

  const toggleService = (serviceId: string) => {
    setSelectedServiceIds((prev) => {
      if (prev.includes(serviceId)) {
        // Don't allow deselecting if it's the only service
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

  const selectedCore = selectedServiceIds.find((id) => getServiceById(id)?.isCore);

  return (
    <div className="min-h-screen bg-off-white pt-24 pb-16">
      <div className="max-w-[900px] mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="font-inter font-bold text-navy text-3xl mb-3">
            Complete Your Purchase
          </h1>
          <p className="font-inter text-secondary-text text-lg">
            Choose the services you need. Each one works on its own — or combine them for a discount.
          </p>
        </div>

        <div className="grid md:grid-cols-5 gap-8">
          {/* Order summary */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-lg border border-border p-8">
              {/* Core Pack Card */}
              <div
                onClick={() => toggleService(coreService.id)}
                className={`border-2 rounded-lg p-5 cursor-pointer transition-all duration-200 mb-6 ${
                  selectedCore
                    ? 'border-medium-blue bg-blue-50'
                    : 'border-border bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-start gap-3 flex-1">
                    <div
                      className={`w-5 h-5 rounded flex items-center justify-center shrink-0 mt-0.5 ${
                        selectedCore ? 'bg-medium-blue' : 'border-2 border-gray-300 bg-white'
                      }`}
                    >
                      {selectedCore && <Check size={14} className="text-white" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h2 className="font-inter font-bold text-dark-text text-lg">
                          {coreService.name}
                        </h2>
                        <span className="font-inter font-bold text-navy">
                          {coreService.priceLabel}
                        </span>
                      </div>
                      <p className="font-inter text-secondary-text mt-1.5" style={{ fontSize: '0.85rem' }}>
                        {coreService.description}
                      </p>
                    </div>
                  </div>
                </div>

                {selectedCore && (
                  <div className="mt-3 pt-3 border-t border-border ml-8">
                    <h3 className="font-inter font-semibold text-navy text-xs mb-2 uppercase tracking-wider">
                      What's included
                    </h3>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                      {coreService.includes.map((item) => (
                        <div key={item} className="flex items-start gap-2">
                          <FileText size={14} className="text-medium-blue mt-0.5 shrink-0" />
                          <span className="font-inter text-secondary-text" style={{ fontSize: '0.8rem' }}>
                            {item}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Additional Services */}
              <div className="border-t border-border pt-6 mb-6">
                <ServiceSelector
                  selectedServiceIds={selectedServiceIds}
                  onToggle={toggleService}
                />
              </div>

              {/* Price Breakdown */}
              <div className="border-t border-border pt-4">
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
                {selectedServiceIds.map((serviceId) => {
                  const service = getServiceById(serviceId);
                  if (!service) return null;
                  return (
                    <div key={serviceId} className="flex items-center justify-between mb-2">
                      <span className="font-inter text-secondary-text" style={{ fontSize: '0.9rem' }}>
                        {service.name}
                      </span>
                      <span className="font-inter font-semibold text-navy">
                        {service.currencySymbol}{service.price.toFixed(2)}
                      </span>
                    </div>
                  );
                })}

                {discount > 0 && (
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-inter font-medium text-green-700" style={{ fontSize: '0.9rem' }}>
                      Bundle discount
                    </span>
                    <span className="font-inter font-semibold text-green-700">
                      -£{discount.toFixed(2)}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
                  <span className="font-inter font-semibold text-navy">Total</span>
                  <span className="font-inter font-bold text-navy text-2xl">
                    £{total.toFixed(2)}
                  </span>
                </div>
              </div>
              <p className="font-inter text-secondary-text text-xs mt-1">
                {hasSubscription
                  ? 'One-time charge for services + recurring subscription for Quarterly Refresh.'
                  : 'One-time payment. No recurring charges.'}
              </p>
            </div>
          </div>

          {/* Checkout action */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg border border-border p-8 sticky top-24">
              {/* Guarantee Badge */}
              <div className="mb-6">
                <GuaranteeBadge size="small" />
              </div>

              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <ShieldCheck size={18} className="text-success" />
                  <span className="font-inter font-medium text-sm text-dark-text">Secure checkout via Stripe</span>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <Clock size={18} className="text-medium-blue" />
                  <span className="font-inter font-medium text-sm text-dark-text">24-hour delivery after intake</span>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
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
                ) : (
                  <>
                    Pay £{total.toFixed(2)}
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

              <p className="font-inter text-secondary-text text-xs mt-4 text-center">
                No account needed. You'll receive a login link after payment.
              </p>

              <div className="mt-6 pt-4 border-t border-border">
                <Link
                  href="/pricing"
                  className="font-inter text-medium-blue text-sm hover:underline"
                >
                  View full pricing details
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
