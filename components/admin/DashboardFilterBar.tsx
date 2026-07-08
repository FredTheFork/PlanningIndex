'use client';

import { useState } from 'react';
import { Search, Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
import type { FilterState, SortState } from '@/lib/admin/dashboard-queries';

interface DashboardFilterBarProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  sort: SortState;
  onSortChange: (sort: SortState) => void;
  resultCount: number;
  totalCount: number;
}

export default function DashboardFilterBar({
  filters,
  onFiltersChange,
  sort,
  onSortChange,
  resultCount,
  totalCount,
}: DashboardFilterBarProps) {
  const [showFilters, setShowFilters] = useState(false);
  const activeFilterCount = countActiveFilters(filters);

  const updateFilter = (key: keyof FilterState, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFiltersChange({
      search: '',
      deliveryStatus: 'all',
      intakeStatus: 'all',
      briefStatus: 'all',
      tier: 'all',
      industry: 'all',
      subscription: 'all',
      urgency: 'all',
    });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-3">
      <div className="flex flex-col lg:flex-row gap-3">
        {/* Search */}
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            placeholder="Search by email, business name, or ID..."
            className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2C68C4] focus:border-[#2C68C4] font-inter text-sm"
          />
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={sort.field}
            onChange={(e) => onSortChange({ ...sort, field: e.target.value as SortState['field'] })}
            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2C68C4] focus:border-[#2C68C4] font-inter text-sm bg-white"
          >
            <option value="urgency_score">Urgency</option>
            <option value="created_at">Date</option>
            <option value="email">Email</option>
            <option value="business_name">Business</option>
            <option value="documents_count">Docs</option>
          </select>

          <button
            onClick={() => onSortChange({ ...sort, direction: sort.direction === 'asc' ? 'desc' : 'asc' })}
            className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md font-inter text-sm font-medium transition-colors flex items-center gap-1"
          >
            {sort.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            {sort.direction === 'asc' ? 'Asc' : 'Desc'}
          </button>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-md font-inter text-sm font-medium transition-colors ${
              showFilters ? 'bg-[#1B3F7A] text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            <Filter size={14} />
            Filters
            {activeFilterCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.5 bg-red-500 text-white rounded-full text-xs">
                {activeFilterCount}
              </span>
            )}
            {showFilters ? <X size={14} /> : null}
          </button>
        </div>
      </div>

      {/* Expanded Filters */}
      {showFilters && (
        <div className="mt-3 pt-3 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Delivery Status */}
          <div>
            <label className="block font-inter text-gray-700 text-xs mb-1">Delivery Status</label>
            <select
              value={filters.deliveryStatus}
              onChange={(e) => updateFilter('deliveryStatus', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2C68C4] focus:border-[#2C68C4] font-inter text-sm bg-white"
            >
              <option value="all">All Statuses</option>
              <option value="not_started">Not Started</option>
              <option value="in_progress">In Progress</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>

          {/* Intake Status */}
          <div>
            <label className="block font-inter text-gray-700 text-xs mb-1">Intake Status</label>
            <select
              value={filters.intakeStatus}
              onChange={(e) => updateFilter('intakeStatus', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2C68C4] focus:border-[#2C68C4] font-inter text-sm bg-white"
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="partial">Partial</option>
              <option value="complete">Complete</option>
            </select>
          </div>

          {/* Brief Status */}
          <div>
            <label className="block font-inter text-gray-700 text-xs mb-1">Brief Status</label>
            <select
              value={filters.briefStatus}
              onChange={(e) => updateFilter('briefStatus', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2C68C4] focus:border-[#2C68C4] font-inter text-sm bg-white"
            >
              <option value="all">All</option>
              <option value="none">None</option>
              <option value="generating">Generating</option>
              <option value="ready">Ready</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          {/* Tier */}
          <div>
            <label className="block font-inter text-gray-700 text-xs mb-1">Tier</label>
            <select
              value={filters.tier}
              onChange={(e) => updateFilter('tier', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2C68C4] focus:border-[#2C68C4] font-inter text-sm bg-white"
            >
              <option value="all">All Tiers</option>
              <option value="foundation">Foundation</option>
              <option value="operations">Operations</option>
              <option value="industry">Industry</option>
            </select>
          </div>

          {/* Industry */}
          <div>
            <label className="block font-inter text-gray-700 text-xs mb-1">Industry</label>
            <select
              value={filters.industry}
              onChange={(e) => updateFilter('industry', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2C68C4] focus:border-[#2C68C4] font-inter text-sm bg-white"
            >
              <option value="all">All Industries</option>
              <option value="coach">Coach</option>
              <option value="photographer">Photographer</option>
              <option value="consultant">Consultant</option>
              <option value="contractor">Contractor</option>
            </select>
          </div>

          {/* Subscription */}
          <div>
            <label className="block font-inter text-gray-700 text-xs mb-1">Subscription</label>
            <select
              value={filters.subscription}
              onChange={(e) => updateFilter('subscription', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2C68C4] focus:border-[#2C68C4] font-inter text-sm bg-white"
            >
              <option value="all">All</option>
              <option value="with_subscription">With Subscription</option>
              <option value="no_subscription">No Subscription</option>
            </select>
          </div>

          {/* Urgency */}
          <div>
            <label className="block font-inter text-gray-700 text-xs mb-1">Urgency</label>
            <select
              value={filters.urgency}
              onChange={(e) => updateFilter('urgency', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2C68C4] focus:border-[#2C68C4] font-inter text-sm bg-white"
            >
              <option value="all">All</option>
              <option value="urgent">Urgent</option>
              <option value="normal">Normal</option>
            </select>
          </div>

          {/* Clear & Results */}
          <div className="flex items-end gap-2 lg:col-span-2">
            <button
              onClick={clearFilters}
              className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md font-inter text-sm font-medium transition-colors"
            >
              Clear
            </button>
            <div className="px-3 py-2 bg-[#FAFBFC] rounded-md flex-1">
              <span className="font-inter text-sm text-gray-600">
                {resultCount} of {totalCount} clients
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function countActiveFilters(filters: FilterState): number {
  let count = 0;
  if (filters.search) count++;
  if (filters.deliveryStatus !== 'all') count++;
  if (filters.intakeStatus !== 'all') count++;
  if (filters.briefStatus !== 'all') count++;
  if (filters.tier !== 'all') count++;
  if (filters.industry !== 'all') count++;
  if (filters.subscription !== 'all') count++;
  if (filters.urgency !== 'all') count++;
  return count;
}
