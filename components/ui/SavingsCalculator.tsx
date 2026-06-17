'use client';

import { useState, useEffect, useCallback } from 'react';
import { Calculator, TrendingDown, PiggyBank, ArrowRight, Check, Tag, Package, Percent } from 'lucide-react';
import { useInView } from '@/hooks/useInView';
import { AnimatedCounter } from './AnimatedGraphs';

// Bundle Savings Calculator
interface SavingsCalculatorProps {
  services: Array<{
    id: string;
    name: string;
    price: number;
  }>;
  bundleDiscounts?: Array<{
    count: number;
    percent: number;
  }>;
  className?: string;
}

export function SavingsCalculator({
  services,
  bundleDiscounts = [
    { count: 2, percent: 10 },
    { count: 3, percent: 15 },
    { count: 4, percent: 15 },
  ],
  className = '',
}: SavingsCalculatorProps) {
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);
  const [ref, inView] = useInView(0.2);

  const toggleService = useCallback((id: string) => {
    setSelectedServiceIds(prev =>
      prev.includes(id)
        ? prev.filter(s => s !== id)
        : [...prev, id]
    );
  }, []);

  const selectedServices = services.filter(s => selectedServiceIds.includes(s.id));
  const subtotal = selectedServices.reduce((sum, s) => sum + s.price, 0);

  // Calculate applicable discount
  const getApplicableDiscount = useCallback(() => {
    const count = selectedServiceIds.length;
    const applicable = bundleDiscounts
      .filter(d => count >= d.count)
      .sort((a, b) => b.percent - a.percent)[0];
    return applicable?.percent || 0;
  }, [selectedServiceIds.length, bundleDiscounts]);

  const discountPercent = getApplicableDiscount();
  const savings = subtotal * (discountPercent / 100);
  const total = subtotal - savings;

  return (
    <div ref={ref} className={`bg-white rounded-2xl border border-slate-200 overflow-hidden ${className}`}>
      <div className="px-6 py-4 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
        <div className="flex items-center gap-2">
          <Calculator size={20} className="text-success" />
          <h3 className="font-inter font-bold text-navy text-lg">Bundle Savings Calculator</h3>
        </div>
        <p className="font-inter text-secondary-text text-sm mt-1">
          Select services and see your savings grow automatically
        </p>
      </div>

      <div className="p-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Service Selection */}
          <div>
            <h4 className="font-inter font-semibold text-dark-text text-sm mb-3">Select your services:</h4>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {services.map(service => {
                const isSelected = selectedServiceIds.includes(service.id);
                return (
                  <button
                    key={service.id}
                    onClick={() => toggleService(service.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg border-2 transition-all duration-200 ${isSelected
                        ? 'border-success bg-green-50'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded flex items-center justify-center ${isSelected ? 'bg-success' : 'border-2 border-slate-300 bg-white'
                          }`}
                      >
                        {isSelected && <Check size={12} className="text-white" />}
                      </div>
                      <span className="font-inter font-medium text-dark-text text-sm text-left">
                        {service.name}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className={`font-inter font-semibold text-sm ${isSelected ? 'text-success' : 'text-navy'}`}>
                        £{service.price.toFixed(0)}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Savings Display */}
          <div>
            <h4 className="font-inter font-semibold text-dark-text text-sm mb-3">Your savings:</h4>

            {/* Discount Progress Bar */}
            <div className="bg-slate-50 rounded-xl p-4 mb-4">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-inter text-secondary-text">Services selected</span>
                <span className="font-inter font-semibold text-navy">{selectedServiceIds.length}</span>
              </div>
              <div className="flex items-center gap-1 mb-3">
                {[1, 2, 3, 4, 5].map(i => (
                  <div
                    key={i}
                    className={`flex-1 h-2 rounded-full transition-all duration-300 ${i <= selectedServiceIds.length ? 'bg-success' : 'bg-slate-200'
                      }`}
                  />
                ))}
              </div>
              <div className="flex justify-between text-xs">
                {bundleDiscounts.map(d => (
                  <div
                    key={d.count}
                    className={`font-inter ${selectedServiceIds.length >= d.count ? 'text-success font-semibold' : 'text-slate-400'
                      }`}
                  >
                    {d.count}+: {d.percent}% off
                  </div>
                ))}
              </div>
            </div>

            {/* Price Breakdown */}
            {selectedServiceIds.length > 0 ? (
              <div className="space-y-3">
                {selectedServices.map(service => (
                  <div key={service.id} className="flex items-center justify-between">
                    <span className="font-inter text-secondary-text text-sm">{service.name}</span>
                    <span className="font-inter font-medium text-navy text-sm">£{service.price.toFixed(0)}</span>
                  </div>
                ))}

                <div className="border-t border-slate-200 pt-3">
                  <div className="flex items-center justify-between">
                    <span className="font-inter text-secondary-text text-sm">Subtotal</span>
                    <span className="font-inter font-medium text-navy text-sm">£{subtotal.toFixed(0)}</span>
                  </div>
                </div>

                {discountPercent > 0 && (
                  <div className="flex items-center justify-between bg-green-50 rounded-lg px-3 py-2">
                    <div className="flex items-center gap-2">
                      <Tag size={14} className="text-success" />
                      <span className="font-inter font-semibold text-success text-sm">Bundle discount ({discountPercent}%)</span>
                    </div>
                    <span className="font-inter font-bold text-success text-sm">-£{savings.toFixed(0)}</span>
                  </div>
                )}

                <div className="flex items-center justify-between bg-navy rounded-lg px-3 py-3">
                  <span className="font-inter font-bold text-white">Total</span>
                  <div className="text-right">
                    {discountPercent > 0 && (
                      <span className="font-inter text-white/60 text-sm line-through mr-2">£{subtotal.toFixed(0)}</span>
                    )}
                    <span className="font-inter font-bold text-white text-lg">£{total.toFixed(0)}</span>
                  </div>
                </div>

                {savings > 0 && (
                  <div className="flex items-center gap-2 justify-center py-2">
                    <PiggyBank size={16} className="text-success" />
                    <span className="font-inter font-semibold text-success text-sm">
                      You save £{savings.toFixed(0)}!
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <Package size={40} className="text-slate-300 mx-auto mb-3" />
                <p className="font-inter text-secondary-text text-sm">
                  Select services above to calculate your savings
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ROI Calculator
interface ROICalculatorProps {
  className?: string;
}

export function ROICalculator({ className = '' }: ROICalculatorProps) {
  const [ref, inView] = useInView(0.2);
  const [clientValue, setClientValue] = useState(500);
  const [clientsPerMonth, setClientsPerMonth] = useState(3);

  // Calculation
  const monthlyRevenue = clientValue * clientsPerMonth;
  const packCost = 79;
  const roiPercent = Math.round(((monthlyRevenue - packCost) / packCost) * 100);
  const breakevenClients = Math.ceil(packCost / clientValue);

  return (
    <div ref={ref} className={`bg-white rounded-2xl border border-slate-200 overflow-hidden ${className}`}>
      <div className="px-6 py-4 bg-gradient-to-r from-navy to-medium-blue">
        <div className="flex items-center gap-2">
          <TrendingDown size={20} className="text-white" />
          <h3 className="font-inter font-bold text-white text-lg">Return on Investment</h3>
        </div>
        <p className="font-inter text-white/80 text-sm mt-1">
          See how quickly your investment pays off
        </p>
      </div>

      <div className="p-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Inputs */}
          <div className="space-y-6">
            <div>
              <label className="block font-inter font-semibold text-dark-text text-sm mb-2">
                Average client value (£)
              </label>
              <input
                type="range"
                min={100}
                max={2000}
                step={50}
                value={clientValue}
                onChange={e => setClientValue(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between mt-1">
                <span className="font-inter text-secondary-text text-xs">£100</span>
                <span className="font-inter font-bold text-navy text-sm">£{clientValue}</span>
                <span className="font-inter text-secondary-text text-xs">£2,000</span>
              </div>
            </div>

            <div>
              <label className="block font-inter font-semibold text-dark-text text-sm mb-2">
                Clients per month
              </label>
              <input
                type="range"
                min={1}
                max={10}
                step={1}
                value={clientsPerMonth}
                onChange={e => setClientsPerMonth(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between mt-1">
                <span className="font-inter text-secondary-text text-xs">1</span>
                <span className="font-inter font-bold text-navy text-sm">{clientsPerMonth}</span>
                <span className="font-inter text-secondary-text text-xs">10</span>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="bg-slate-50 rounded-xl p-4">
            <div className="text-center mb-4">
              <div className="font-inter text-secondary-text text-sm">Your ROI</div>
              <div className="font-inter font-bold text-success text-4xl mt-1">
                {roiPercent.toLocaleString()}%
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="font-inter text-secondary-text">Monthly revenue</span>
                <span className="font-inter font-semibold text-navy">£{monthlyRevenue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-inter text-secondary-text">Pack cost</span>
                <span className="font-inter font-semibold text-navy">£{packCost}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200">
                <span className="font-inter text-secondary-text">Break-even point</span>
                <span className="font-inter font-semibold text-success">{breakevenClients} client{breakevenClients !== 1 ? 's' : ''}</span>
              </div>
            </div>

            <div className="mt-4 p-3 bg-success/10 rounded-lg text-center">
              <p className="font-inter text-success text-sm font-medium">
                Your pack pays for itself with just {breakevenClients} new client{breakevenClients !== 1 ? 's' : ''}!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Simple Savings Visual
interface SavingsVisualProps {
  originalPrice: number;
  discountedPrice: number;
  discountPercent: number;
  className?: string;
}

export function SavingsVisual({ originalPrice, discountedPrice, discountPercent, className = '' }: SavingsVisualProps) {
  const [ref, inView] = useInView(0.2);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (inView) {
      setAnimate(true);
    }
  }, [inView]);

  const savings = originalPrice - discountedPrice;

  return (
    <div ref={ref} className={`bg-white rounded-xl border border-green-200 p-4 ${className}`}>
      <div className="flex items-center gap-2 mb-3">
        <Percent size={18} className="text-success" />
        <span className="font-inter font-semibold text-success text-sm">Bundle Savings</span>
      </div>

      <div className="relative">
        {/* Progress showing discount */}
        <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-success to-emerald-400 rounded-full transition-all duration-1000"
            style={{ width: animate ? `${discountPercent}%` : '0%' }}
          />
        </div>

        {/* Labels */}
        <div className="flex justify-between mt-2">
          <div>
            <span className="font-inter text-secondary-text text-xs block">You save</span>
            <span className="font-inter font-bold text-success text-lg">
              £{animate ? savings.toFixed(0) : '0'}
            </span>
          </div>
          <div className="text-right">
            <span className="font-inter text-secondary-text text-xs block">Discount</span>
            <span className="font-inter font-bold text-navy text-lg">
              {animate ? discountPercent : 0}%
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-200">
        <div className="flex items-center gap-2">
          <span className="font-inter text-secondary-text text-sm line-through">£{originalPrice.toFixed(0)}</span>
          <ArrowRight size={14} className="text-slate-400" />
        </div>
        <span className="font-inter font-bold text-navy text-xl">£{discountedPrice.toFixed(0)}</span>
      </div>
    </div>
  );
}
