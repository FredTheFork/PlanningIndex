'use client';

import { useState, useMemo } from 'react';
import { Inbox } from 'lucide-react';
import { Card, Button, EmptyState, Pagination } from '@/components/ui';
import { ApplicationResultCard } from './ApplicationResultCard';
import { ListSkeleton } from '@/components/ui/skeletons';
import { type SearchApplication, type SearchFilters, sortOptions } from '@/lib/mock/applications';

interface SearchResultsListProps {
  applications: SearchApplication[];
  filters: SearchFilters;
  onSortChange: (sort: string) => void;
  onClearFilters: () => void;
  loading?: boolean;
  selectedId?: string | null;
  hoveredId?: string | null;
  onHover?: (id: string | null) => void;
  onAddLead?: (application: SearchApplication) => void;
}

const PER_PAGE = 10;

export function SearchResultsList({
  applications,
  filters,
  onSortChange,
  onClearFilters,
  loading = false,
  selectedId = null,
  hoveredId = null,
  onHover,
  onAddLead,
}: SearchResultsListProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(applications.length / PER_PAGE);

  const paginatedResults = useMemo(() => {
    const start = (currentPage - 1) * PER_PAGE;
    return applications.slice(start, start + PER_PAGE);
  }, [applications, currentPage]);

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onSortChange(e.target.value);
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between mb-4">
          <div className="h-5 w-40 bg-primary-100 rounded animate-pulse" />
          <div className="h-8 w-36 bg-primary-100 rounded animate-pulse" />
        </div>
        <ListSkeleton rows={5} />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="font-sans font-semibold text-primary-900 text-sm">
            {applications.length} {applications.length === 1 ? 'application' : 'applications'} found
          </p>
          {filters.keyword && (
            <p className="font-sans text-xs text-primary-400 mt-0.5">
              for &ldquo;{filters.keyword}&rdquo;
            </p>
          )}
        </div>
        <div className="relative">
          <select
            value={filters.sort}
            onChange={handleSortChange}
            className="block pl-3 pr-9 py-2 border border-primary-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-accent-500/40 focus:border-accent-500 font-sans text-sm text-primary-900 bg-white transition-colors appearance-none cursor-pointer"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <svg
            width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-400 pointer-events-none"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>

      {applications.length === 0 ? (
        <Card padding="none">
          <EmptyState
            icon={Inbox}
            title="No applications match your filters"
            description="Try adjusting your search criteria or clearing filters to see more results."
            action={
              <Button size="sm" variant="outline" onClick={onClearFilters}>
                Clear filters
              </Button>
            }
          />
        </Card>
      ) : (
        <>
          <div className="space-y-3">
            {paginatedResults.map((app) => (
              <ApplicationResultCard
                key={app.id}
                application={app}
                selected={app.id === selectedId}
                hovered={app.id === hoveredId}
                onHover={onHover}
                onAddLead={onAddLead}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-6 flex justify-center">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
