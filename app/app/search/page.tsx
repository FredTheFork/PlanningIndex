'use client';

import { useState, useEffect, useCallback } from 'react';
import { SlidersHorizontal, Map as MapIcon, List } from 'lucide-react';
import { SearchFiltersBar } from '@/components/workspace/SearchFiltersBar';
import { SearchResultsList } from '@/components/workspace/SearchResultsList';
import { SearchSkeleton } from '@/components/workspace/SearchSkeleton';
import { MapView } from '@/components/workspace/MapView';
import {
  type SearchFilters,
  mockApplications,
  filterApplications,
  defaultFilters,
} from '@/lib/mock/applications';

export default function SearchPage() {
  const [filters, setFilters] = useState<SearchFilters>(defaultFilters);
  const [results, setResults] = useState(mockApplications);
  const [loading, setLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [mobileView, setMobileView] = useState<'list' | 'map'>('list');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      const filtered = filterApplications(mockApplications, filters);
      setResults(filtered);
      setLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [filters]);

  const handleSearch = useCallback((newFilters: SearchFilters) => {
    setFilters(newFilters);
    setShowMobileFilters(false);
  }, []);

  const handleSortChange = useCallback((sort: string) => {
    setFilters((prev) => ({ ...prev, sort }));
  }, []);

  const handleMapSelect = useCallback((id: string) => {
    setSelectedId(id);
  }, []);

  const handleCardHover = useCallback((id: string | null) => {
    setHoveredId(id);
  }, []);

  const radiusMiles = parseInt(filters.radius, 10) || 25;

  if (loading && results.length === 0) {
    return <SearchSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-bold text-primary-900 text-h2">Planning Applications</h1>
        <p className="font-sans text-primary-500 text-sm mt-1">
          Search planning applications across the UK. Filter by keyword, location, radius, application type, and status.
        </p>
      </div>

      {/* Horizontal filter bar - always visible */}
      <SearchFiltersBar filters={filters} onSearch={handleSearch} variant="horizontal" />

      {/* Mobile filter toggle */}
      <div className="lg:hidden">
        <button
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="inline-flex items-center gap-2 font-sans text-sm font-medium text-primary-600 hover:text-primary-900 transition-colors"
        >
          <SlidersHorizontal size={16} />
          {showMobileFilters ? 'Hide filters' : 'Show sidebar filters'}
        </button>
      </div>

      {/* Mobile list/map toggle */}
      <div className="lg:hidden flex items-center gap-1 rounded-lg border border-primary-200 bg-white p-1">
        <button
          onClick={() => setMobileView('list')}
          className={`flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-md font-sans text-sm font-medium transition-colors ${
            mobileView === 'list' ? 'bg-primary-900 text-white' : 'text-primary-500 hover:text-primary-900'
          }`}
        >
          <List size={15} /> List
        </button>
        <button
          onClick={() => setMobileView('map')}
          className={`flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-md font-sans text-sm font-medium transition-colors ${
            mobileView === 'map' ? 'bg-primary-900 text-white' : 'text-primary-500 hover:text-primary-900'
          }`}
        >
          <MapIcon size={15} /> Map
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr_1fr] gap-6">
        {/* Sidebar filters - desktop always, mobile collapsible */}
        <aside className={`${showMobileFilters ? 'block' : 'hidden'} lg:block`}>
          <div className="rounded-xl border border-primary-200 bg-white p-4 lg:sticky lg:top-20">
            <SearchFiltersBar filters={filters} onSearch={handleSearch} variant="sidebar" />
          </div>
        </aside>

        {/* Results list - hidden on mobile when map is selected */}
        <div className={`${mobileView === 'map' ? 'hidden' : 'block'} lg:block`}>
          <SearchResultsList
            applications={results}
            filters={filters}
            onSortChange={handleSortChange}
            onClearFilters={() => setFilters({ ...defaultFilters })}
            loading={loading}
            selectedId={selectedId}
            hoveredId={hoveredId}
            onHover={handleCardHover}
          />
        </div>

        {/* Map - hidden on mobile when list is selected */}
        <div className={`${mobileView === 'list' ? 'hidden' : 'block'} lg:block lg:sticky lg:top-20 lg:h-[calc(100vh-6rem)]`}>
          <MapView
            applications={results}
            selectedId={selectedId}
            hoveredId={hoveredId}
            onSelect={handleMapSelect}
            onHover={handleCardHover}
            radiusMiles={radiusMiles}
          />
        </div>
      </div>
    </div>
  );
}
