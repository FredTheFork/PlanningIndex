'use client';

import { useState, useEffect } from 'react';
import { Check, X, Minus, ArrowRight, ChevronRight } from 'lucide-react';
import { useInView } from '@/hooks/useInView';

// Visual Comparison Table
interface ComparisonRow {
  feature: string;
  foundationary: 'check' | 'cross' | 'partial' | string;
  alternatives: Record<string, 'check' | 'cross' | 'partial' | string>;
}

interface VisualComparisonProps {
  title?: string;
  subtitle?: string;
  rows?: ComparisonRow[];
  columns?: string[];
  className?: string;
}

export function VisualComparison({
  title = 'How We Compare',
  subtitle = 'See why Foundationary is the best choice for UK sole traders',
  rows = [
    { feature: 'UK law compliant', foundationary: 'check', alternatives: { 'DIY Templates': 'cross', 'Solicitor': 'check', 'Generic AI': 'cross' } },
    { feature: 'Tailored to your business', foundationary: 'check', alternatives: { 'DIY Templates': 'cross', 'Solicitor': 'check', 'Generic AI': 'partial' } },
    { feature: 'Done for you', foundationary: 'check', alternatives: { 'DIY Templates': 'cross', 'Solicitor': 'check', 'Generic AI': 'cross' } },
    { feature: 'Delivered in 24-72 hours', foundationary: 'check', alternatives: { 'DIY Templates': 'check', 'Solicitor': 'cross', 'Generic AI': 'check' } },
    { feature: 'Website copy included', foundationary: 'check', alternatives: { 'DIY Templates': 'cross', 'Solicitor': 'cross', 'Generic AI': 'cross' } },
    { feature: 'Social media posts included', foundationary: 'check', alternatives: { 'DIY Templates': 'cross', 'Solicitor': 'cross', 'Generic AI': 'cross' } },
    { feature: 'Operations packs available', foundationary: 'check', alternatives: { 'DIY Templates': 'cross', 'Solicitor': 'partial', 'Generic AI': 'cross' } },
    { feature: 'Industry-specific documents', foundationary: 'check', alternatives: { 'DIY Templates': 'cross', 'Solicitor': 'check', 'Generic AI': 'cross' } },
    { feature: 'Human reviewed', foundationary: 'check', alternatives: { 'DIY Templates': 'cross', 'Solicitor': 'check', 'Generic AI': 'cross' } },
    { feature: 'Typical cost', foundationary: '£79-£299', alternatives: { 'DIY Templates': '£100-£300/yr', 'Solicitor': '£2,000+', 'Generic AI': 'Free-£200/yr' } },
  ],
  columns = ['Foundationary', 'DIY Templates', 'Solicitor', 'Generic AI'],
  className = '',
}: VisualComparisonProps) {
  const [ref, inView] = useInView(0.2);
  const [expanded, setExpanded] = useState(false);

  const renderCell = (value: 'check' | 'cross' | 'partial' | string) => {
    if (value === 'check') {
      return (
        <div className="w-6 h-6 rounded-full bg-success flex items-center justify-center mx-auto">
          <Check size={14} className="text-white" />
        </div>
      );
    }
    if (value === 'cross') {
      return (
        <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center mx-auto">
          <X size={14} className="text-slate-400" />
        </div>
      );
    }
    if (value === 'partial') {
      return (
        <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center mx-auto">
          <Minus size={14} className="text-amber-600" />
        </div>
      );
    }
    return (
      <span className="font-inter font-medium text-dark-text text-sm">{value}</span>
    );
  };

  const visibleRows = expanded ? rows : rows.slice(0, 5);

  return (
    <div ref={ref} className={`bg-white rounded-2xl border border-slate-200 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="px-6 py-4 bg-gradient-to-r from-navy to-medium-blue">
        <h3 className="font-inter font-bold text-white text-lg">{title}</h3>
        <p className="font-inter text-white/80 text-sm mt-1">{subtitle}</p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="text-left font-inter font-semibold text-dark-text text-sm p-4">
                Feature
              </th>
              {columns.map((col, i) => (
                <th
                  key={col}
                  className={`text-center font-inter font-semibold text-sm p-4 ${i === 0 ? 'bg-blue-50 text-navy' : 'text-slate-600'
                    }`}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((row, rowIndex) => (
              <tr
                key={row.feature}
                className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                style={{
                  opacity: inView ? 1 : 0,
                  transform: inView ? 'translateX(0)' : 'translateX(-10px)',
                  transition: `opacity 0.3s ease ${rowIndex * 50}ms, transform 0.3s ease ${rowIndex * 50}ms`,
                }}
              >
                <td className="font-inter font-medium text-dark-text text-sm p-4">
                  {row.feature}
                </td>
                <td className="p-4 bg-blue-50/50">
                  {renderCell(row.foundationary)}
                </td>
                {Object.entries(row.alternatives).map(([alt, value], i) => (
                  <td key={alt} className="p-4 text-center">
                    {renderCell(value)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Expand/Collapse */}
      {rows.length > 5 && (
        <div className="px-6 py-4 bg-slate-50 text-center">
          <button
            onClick={() => setExpanded(!expanded)}
            className="font-inter font-semibold text-medium-blue hover:text-navy transition-colors flex items-center gap-1 mx-auto"
          >
            {expanded ? 'Show less' : `Show ${rows.length - 5} more features`}
            <ChevronRight
              size={16}
              className={`transition-transform ${expanded ? 'rotate-90' : ''}`}
            />
          </button>
        </div>
      )}

      {/* Footer CTA */}
      <div className="px-6 py-4 bg-gradient-to-r from-green-50 to-emerald-50 border-t border-green-200">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <span className="font-inter font-bold text-navy text-lg">Ready to get started?</span>
            <p className="font-inter text-secondary-text text-sm">
              The complete solution for UK sole traders
            </p>
          </div>
          <a
            href="/checkout"
            className="font-inter font-bold text-white bg-navy rounded-lg hover:bg-medium-blue transition-colors px-5 py-2.5 flex items-center gap-2"
          >
            Get Started <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </div>
  );
}

// Animated Comparison Stats
interface ComparisonStatProps {
  label: string;
  foundationaryValue: string | number;
  alternativeValue: string | number;
  alternativeLabel: string;
  unit?: string;
  className?: string;
}

export function ComparisonStat({
  label,
  foundationaryValue,
  alternativeValue,
  alternativeLabel,
  unit = '',
  className = '',
}: ComparisonStatProps) {
  const [ref, inView] = useInView(0.2);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    if (inView) {
      setTimeout(() => setAnimated(true), 200);
    }
  }, [inView]);

  const foundationaryNum = typeof foundationaryValue === 'number' ? foundationaryValue : parseFloat(foundationaryValue.replace(/[^0-9.]/g, '')) || 0;
  const alternativeNum = typeof alternativeValue === 'number' ? alternativeValue : parseFloat(alternativeValue.replace(/[^0-9.]/g, '')) || 0;
  const multiplier = alternativeNum / Math.max(foundationaryNum, 1);

  return (
    <div ref={ref} className={`bg-white rounded-xl border border-slate-200 p-4 ${className}`}>
      <span className="font-inter font-medium text-secondary-text text-sm block mb-3">{label}</span>

      <div className="flex items-end justify-between gap-4">
        {/* Foundationary bar */}
        <div className="flex-1">
          <div className="h-6 bg-slate-100 rounded-full overflow-hidden relative">
            <div
              className="h-full bg-gradient-to-r from-navy to-medium-blue rounded-full transition-all duration-1000 absolute left-0 top-0"
              style={{ width: animated ? '100%' : '0%' }}
            />
          </div>
          <div className="flex items-center justify-between mt-1.5">
            <span className="font-inter font-bold text-navy text-lg">Foundationary</span>
            <span className="font-inter font-bold text-navy text-xl">{foundationaryValue}{unit}</span>
          </div>
        </div>

        {/* Alternative bar */}
        <div className="flex-1">
          <div className="h-6 bg-slate-100 rounded-full overflow-hidden relative">
            <div
              className="h-full bg-slate-400 rounded-full transition-all duration-1000 absolute left-0 top-0"
              style={{ width: animated ? `${Math.min(multiplier * 100, 100)}%` : '0%' }}
            />
          </div>
          <div className="flex items-center justify-between mt-1.5">
            <span className="font-inter font-medium text-slate-500 text-sm">{alternativeLabel}</span>
            <span className="font-inter font-semibold text-slate-600 text-lg">{alternativeValue}{unit}</span>
          </div>
        </div>
      </div>

      {multiplier > 1.5 && animated && (
        <div className="mt-3 text-center bg-green-50 rounded-lg px-3 py-1.5">
          <span className="font-inter font-semibold text-success text-sm">
            {multiplier.toFixed(1)}x more expensive with {alternativeLabel}
          </span>
        </div>
      )}
    </div>
  );
}

// Cost Comparison Over Time
interface CostOverTimeProps {
  className?: string;
}

export function CostOverTime({ className = '' }: CostOverTimeProps) {
  const [ref, inView] = useInView(0.2);
  const [years, setYears] = useState(1);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    if (inView) {
      setAnimated(true);
    }
  }, [inView]);

  // Costs
  const foundationaryCost = 79;
  const solicitorCost = 2000;
  const diyCost = 150 * years; // subscription per year
  const aiCost = 200 * years; // subscription per year

  const costs = {
    Foundationary: foundationaryCost,
    'DIY Templates': diyCost,
    'Generic AI': aiCost,
    'Solicitor': solicitorCost,
  };

  const maxCost = Math.max(solicitorCost, diyCost, aiCost, foundationaryCost);

  return (
    <div ref={ref} className={`bg-white rounded-2xl border border-slate-200 p-6 ${className}`}>
      <h3 className="font-inter font-bold text-navy text-lg mb-2">Cost Over Time</h3>
      <p className="font-inter text-secondary-text text-sm mb-4">
        See how costs compare over time
      </p>

      {/* Year selector */}
      <div className="flex items-center gap-3 mb-6">
        <span className="font-inter font-medium text-secondary-text text-sm">Time period:</span>
        {[1, 2, 3, 5].map(y => (
          <button
            key={y}
            onClick={() => setYears(y)}
            className={`px-3 py-1.5 rounded-lg font-inter font-medium text-sm transition-colors ${years === y ? 'bg-navy text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
          >
            {y} {y === 1 ? 'year' : 'years'}
          </button>
        ))}
      </div>

      {/* Bar chart */}
      <div className="space-y-4">
        {Object.entries(costs).map(([name, cost], i) => (
          <div key={name} className="flex items-center gap-4">
            <div className="w-28 shrink-0">
              <span className={`font-inter font-medium text-sm ${name === 'Foundationary' ? 'text-navy' : 'text-slate-500'}`}>
                {name}
              </span>
            </div>
            <div className="flex-1 h-8 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${name === 'Foundationary'
                    ? 'bg-gradient-to-r from-navy to-medium-blue'
                    : name === 'Solicitor'
                      ? 'bg-red-400'
                      : 'bg-slate-400'
                  }`}
                style={{
                  width: animated ? `${(cost / maxCost) * 100}%` : '0%',
                }}
              />
            </div>
            <div className="w-16 text-right">
              <span className={`font-inter font-bold text-sm ${name === 'Foundationary' ? 'text-navy' : 'text-slate-600'}`}>
                £{cost.toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Savings message */}
      <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-200">
        <div className="flex items-center gap-2 mb-1">
          <Check size={18} className="text-success" />
          <span className="font-inter font-semibold text-success">Foundationary saves you money</span>
        </div>
        <p className="font-inter text-green-700 text-sm">
          Over {years} {years === 1 ? 'year' : 'years'}, Foundationary costs just £{foundationaryCost} total —
          {years === 1
            ? ` £${solicitorCost - foundationaryCost} less than a solicitor`
            : ` while alternatives cost £${diyCost} to £${solicitorCost}`
          }.
        </p>
      </div>
    </div>
  );
}
