export function SearchSkeleton() {
  return (
    <div className="space-y-6">
      {/* Filter bar skeleton */}
      <div className="space-y-4">
        <div className="h-12 bg-primary-100 rounded-xl animate-pulse" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="h-10 bg-primary-100 rounded-lg animate-pulse" />
          ))}
        </div>
        <div className="h-10 w-40 bg-primary-100 rounded-lg animate-pulse" />
      </div>

      {/* Three-panel layout skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr_1fr] gap-6">
        {/* Sidebar skeleton */}
        <div className="hidden lg:block space-y-3">
          <div className="h-5 w-20 bg-primary-100 rounded animate-pulse" />
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
            <div key={i} className="h-10 bg-primary-100 rounded-lg animate-pulse" />
          ))}
          <div className="h-10 bg-primary-100 rounded-lg animate-pulse" />
        </div>

        {/* Results list skeleton */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="h-5 w-40 bg-primary-100 rounded animate-pulse" />
            <div className="h-8 w-36 bg-primary-100 rounded animate-pulse" />
          </div>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-primary-200 p-6 animate-pulse">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-primary-200 rounded w-48" />
                  <div className="h-3 bg-primary-100 rounded w-24" />
                  <div className="h-3 bg-primary-100 rounded w-32" />
                  <div className="h-3 bg-primary-100 rounded w-full" />
                  <div className="flex gap-2 mt-2">
                    <div className="h-5 w-16 bg-primary-100 rounded-full" />
                    <div className="h-5 w-20 bg-primary-100 rounded-full" />
                    <div className="h-5 w-14 bg-primary-100 rounded-full" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 w-12 bg-primary-100 rounded" />
                  <div className="h-3 w-10 bg-primary-100 rounded" />
                  <div className="h-7 w-16 bg-primary-100 rounded-lg" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Map skeleton */}
        <div className="hidden lg:block">
          <div className="relative h-[calc(100vh-6rem)] rounded-xl border border-primary-200 bg-primary-100 animate-pulse overflow-hidden">
            {/* Pulsing marker dots */}
            <div className="absolute top-1/4 left-1/3 h-5 w-5 rounded-full bg-primary-300 animate-pulse" />
            <div className="absolute top-1/2 left-1/2 h-5 w-5 rounded-full bg-primary-300 animate-pulse" />
            <div className="absolute top-1/3 left-2/3 h-5 w-5 rounded-full bg-primary-300 animate-pulse" />
            <div className="absolute top-2/3 left-1/4 h-5 w-5 rounded-full bg-primary-300 animate-pulse" />
            <div className="absolute top-1/4 left-3/4 h-5 w-5 rounded-full bg-primary-300 animate-pulse" />
            <div className="absolute bottom-4 left-4 h-20 w-24 bg-white/60 rounded-lg" />
            <div className="absolute top-4 left-4 h-12 w-20 bg-white/60 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
