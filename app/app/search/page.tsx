'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { SlidersHorizontal, Map as MapIcon, List } from 'lucide-react';
import { SearchFiltersBar } from '@/components/workspace/SearchFiltersBar';
import { SearchResultsList } from '@/components/workspace/SearchResultsList';
import { SearchSkeleton } from '@/components/workspace/SearchSkeleton';
import { MapView } from '@/components/workspace/MapView';
import { AddLeadModal } from '@/components/workspace/AddLeadModal';
import {
  type SearchFilters,
  type SearchApplication,
  filterApplications,
  defaultFilters,
} from '@/lib/mock/applications';

export default function SearchPage() {
  const [filters, setFilters] = useState<SearchFilters>(defaultFilters);
  const [results, setResults] = useState<SearchApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [councils, setCouncils] = useState<{ value: string; label: string }[]>([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [mobileView, setMobileView] = useState<'list' | 'map'>('list');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [addLeadOpen, setAddLeadOpen] = useState(false);
  const [addLeadApp, setAddLeadApp] = useState<SearchApplication | null>(null);

  // Real authority names for the council filter (falls back to the default
  // list in SearchFiltersBar until the fetch completes).
  useEffect(() => {
    let cancelled = false;
    fetch('/api/applications/councils')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data?.councils?.length) {
          setCouncils(data.councils.map((c: string) => ({ value: c, label: c })));
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  // Server-side search: keyword / council / date-range hit Supabase
  // (plan-gated). Remaining UI filters (status, type, trade tag, decision,
  // radius, sort) apply client-side to the returned page.
  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    const params = new URLSearchParams();
    if (filters.keyword.trim()) params.set('keyword', filters.keyword.trim());
    if (filters.council !== 'all') params.set('council', filters.council);
    if (filters.dateRange !== 'all') {
      const days = parseInt(filters.dateRange, 10);
      if (!Number.isNaN(days)) {
        params.set('dateFrom', new Date(Date.now() - days * 86_400_000).toISOString());
      }
    }
    params.set('pageSize', '200');

    fetch(`/api/applications?${params.toString()}`)
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        setResults(data.applications ?? []);
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setResults([]);
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [filters.keyword, filters.council, filters.dateRange]);

  const visibleResults = useMemo(
    () => filterApplications(results, filters),
    [results, filters]
  );

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

  const handleAddLead = useCallback((app: SearchApplication) => {
    setAddLeadApp(app);
    setAddLeadOpen(true);
  }, []);

  const radiusMiles = parseInt(filters.radius, 10) || 25;

  if (loading && visibleResults.length === 0) {
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
      <SearchFiltersBar filters={filters} onSearch={handleSearch} variant="horizontal" councils={councils} />

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
            <SearchFiltersBar filters={filters} onSearch={handleSearch} variant="sidebar" councils={councils} />
          </div>
        </aside>

        {/* Results list - hidden on mobile when map is selected */}
        <div className={`${mobileView === 'map' ? 'hidden' : 'block'} lg:block`}>
          <SearchResultsList
            applications={visibleResults}
            filters={filters}
            onSortChange={handleSortChange}
            onClearFilters={() => setFilters({ ...defaultFilters })}
            loading={loading}
            selectedId={selectedId}
            hoveredId={hoveredId}
            onHover={handleCardHover}
            onAddLead={handleAddLead}
          />
        </div>

        {/* Map - hidden on mobile when list is selected */}
        <div className={`${mobileView === 'list' ? 'hidden' : 'block'} lg:block lg:sticky lg:top-20 lg:h-[calc(100vh-6rem)]`}>
          <MapView
            applications={visibleResults}
            selectedId={selectedId}
            hoveredId={hoveredId}
            onSelect={handleMapSelect}
            onHover={handleCardHover}
            radiusMiles={radiusMiles}
          />
        </div>
      </div>

      <AddLeadModal
        open={addLeadOpen}
        onClose={() => { setAddLeadOpen(false); setAddLeadApp(null); }}
        application={addLeadApp}
      />
    </div>
  );
}
