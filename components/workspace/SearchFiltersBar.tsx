'use client';

import { useState, useEffect } from 'react';
import { Search, MapPin, X } from 'lucide-react';
import { Button } from '@/components/ui';
import {
  type SearchFilters,
  applicationTypeOptions,
  statusOptions,
  dateRangeOptions,
  radiusOptions,
  councilOptions,
  decisionOptions,
  tradeTagOptions,
  defaultFilters,
} from '@/lib/mock/applications';

interface SearchFiltersBarProps {
  filters: SearchFilters;
  onSearch: (filters: SearchFilters) => void;
  variant?: 'horizontal' | 'sidebar';
}

export function SearchFiltersBar({ filters, onSearch, variant = 'horizontal' }: SearchFiltersBarProps) {
  const [local, setLocal] = useState<SearchFilters>(filters);

  useEffect(() => {
    setLocal(filters);
  }, [filters]);

  const update = (field: keyof SearchFilters, value: string) => {
    setLocal((prev) => ({ ...prev, [field]: value }));
  };

  const handleSearch = () => {
    onSearch(local);
  };

  const handleClear = () => {
    const cleared = { ...defaultFilters };
    setLocal(cleared);
    onSearch(cleared);
  };

  const hasActiveFilters =
    local.keyword !== '' ||
    local.location !== '' ||
    local.applicationType !== 'all' ||
    local.status !== 'all' ||
    local.dateRange !== defaultFilters.dateRange ||
    local.radius !== defaultFilters.radius ||
    local.council !== 'all' ||
    local.decision !== 'all' ||
    local.tradeTag !== 'all';

  const selectClass =
    'block w-full pl-3 pr-10 py-2.5 border border-primary-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-accent-500/40 focus:border-accent-500 font-sans text-sm text-primary-900 bg-white transition-colors appearance-none cursor-pointer';

  if (variant === 'sidebar') {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between mb-1">
          <p className="font-sans font-semibold text-primary-900 text-sm">Filters</p>
          {hasActiveFilters && (
            <button
              onClick={handleClear}
              className="font-sans text-xs text-accent-600 hover:text-accent-700 transition-colors"
            >
              Clear all
            </button>
          )}
        </div>

        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-400 pointer-events-none" />
          <input
            type="search"
            placeholder="Search by keyword..."
            value={local.keyword}
            onChange={(e) => update('keyword', e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="block w-full pl-9 pr-3 py-2.5 border border-primary-300 rounded-lg shadow-sm placeholder:text-primary-400 focus:outline-none focus:ring-2 focus:ring-accent-500/40 focus:border-accent-500 font-sans text-sm text-primary-900 bg-white transition-colors"
          />
        </div>

        <div className="relative">
          <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Location or postcode"
            value={local.location}
            onChange={(e) => update('location', e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="block w-full pl-9 pr-3 py-2.5 border border-primary-300 rounded-lg shadow-sm placeholder:text-primary-400 focus:outline-none focus:ring-2 focus:ring-accent-500/40 focus:border-accent-500 font-sans text-sm text-primary-900 bg-white transition-colors"
          />
        </div>

        <div className="relative">
          <select value={local.radius} onChange={(e) => update('radius', e.target.value)} className={selectClass}>
            {radiusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <ChevronDownIcon />
        </div>

        <div className="relative">
          <select value={local.council} onChange={(e) => update('council', e.target.value)} className={selectClass}>
            {councilOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <ChevronDownIcon />
        </div>

        <div className="relative">
          <select value={local.applicationType} onChange={(e) => update('applicationType', e.target.value)} className={selectClass}>
            {applicationTypeOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <ChevronDownIcon />
        </div>

        <div className="relative">
          <select value={local.status} onChange={(e) => update('status', e.target.value)} className={selectClass}>
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <ChevronDownIcon />
        </div>

        <div className="relative">
          <select value={local.decision} onChange={(e) => update('decision', e.target.value)} className={selectClass}>
            {decisionOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <ChevronDownIcon />
        </div>

        <div className="relative">
          <select value={local.tradeTag} onChange={(e) => update('tradeTag', e.target.value)} className={selectClass}>
            {tradeTagOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <ChevronDownIcon />
        </div>

        <div className="relative">
          <select value={local.dateRange} onChange={(e) => update('dateRange', e.target.value)} className={selectClass}>
            {dateRangeOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <ChevronDownIcon />
        </div>

        <Button fullWidth onClick={handleSearch} leftIcon={<Search size={15} />}>
          Search applications
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-400 pointer-events-none" />
        <input
          type="search"
          placeholder="Search by keyword, reference, or trade..."
          value={local.keyword}
          onChange={(e) => update('keyword', e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          className="block w-full pl-12 pr-4 py-3.5 border border-primary-300 rounded-xl shadow-sm placeholder:text-primary-400 focus:outline-none focus:ring-2 focus:ring-accent-500/40 focus:border-accent-500 font-sans text-sm text-primary-900 bg-white transition-colors"
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        <div className="relative col-span-2 sm:col-span-1">
          <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Location"
            value={local.location}
            onChange={(e) => update('location', e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="block w-full pl-9 pr-3 py-2.5 border border-primary-300 rounded-lg shadow-sm placeholder:text-primary-400 focus:outline-none focus:ring-2 focus:ring-accent-500/40 focus:border-accent-500 font-sans text-sm text-primary-900 bg-white transition-colors"
          />
        </div>

        <div className="relative">
          <select value={local.radius} onChange={(e) => update('radius', e.target.value)} className={selectClass}>
            {radiusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <ChevronDownIcon />
        </div>

        <div className="relative">
          <select value={local.council} onChange={(e) => update('council', e.target.value)} className={selectClass}>
            {councilOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <ChevronDownIcon />
        </div>

        <div className="relative">
          <select value={local.applicationType} onChange={(e) => update('applicationType', e.target.value)} className={selectClass}>
            {applicationTypeOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <ChevronDownIcon />
        </div>

        <div className="relative">
          <select value={local.status} onChange={(e) => update('status', e.target.value)} className={selectClass}>
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <ChevronDownIcon />
        </div>

        <div className="relative">
          <select value={local.decision} onChange={(e) => update('decision', e.target.value)} className={selectClass}>
            {decisionOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <ChevronDownIcon />
        </div>

        <div className="relative">
          <select value={local.tradeTag} onChange={(e) => update('tradeTag', e.target.value)} className={selectClass}>
            {tradeTagOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <ChevronDownIcon />
        </div>

        <div className="relative">
          <select value={local.dateRange} onChange={(e) => update('dateRange', e.target.value)} className={selectClass}>
            {dateRangeOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <ChevronDownIcon />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Button onClick={handleSearch} leftIcon={<Search size={16} />}>
          Search applications
        </Button>
        {hasActiveFilters && (
          <button
            onClick={handleClear}
            className="inline-flex items-center gap-1.5 font-sans text-sm text-primary-500 hover:text-primary-900 transition-colors"
          >
            <X size={14} /> Clear filters
          </button>
        )}
      </div>
    </div>
  );
}

function ChevronDownIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-400 pointer-events-none"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}
