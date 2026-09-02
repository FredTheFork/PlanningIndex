export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Greeting skeleton */}
      <div className="animate-pulse">
        <div className="h-8 bg-primary-200 rounded w-64 mb-2" />
        <div className="h-4 bg-primary-100 rounded w-80" />
      </div>

      {/* Priorities skeleton */}
      <div className="bg-white rounded-xl border border-primary-200 overflow-hidden animate-pulse">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={`flex items-center gap-4 px-5 py-4 ${
              i < 3 ? 'border-b border-primary-100' : ''
            }`}
          >
            <div className="h-10 w-10 rounded-lg bg-primary-100 shrink-0" />
            <div className="flex-1">
              <div className="h-4 bg-primary-200 rounded w-64 mb-2" />
              <div className="h-3 bg-primary-100 rounded w-48" />
            </div>
            <div className="h-3 bg-primary-100 rounded w-16" />
          </div>
        ))}
      </div>

      {/* Stat cards skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-primary-200 p-6 animate-pulse">
            <div className="flex items-start justify-between mb-3">
              <div className="h-10 w-10 rounded-lg bg-primary-100" />
              <div className="h-4 bg-primary-100 rounded w-12" />
            </div>
            <div className="h-9 bg-primary-200 rounded w-16 mb-2" />
            <div className="h-3 bg-primary-100 rounded w-24" />
          </div>
        ))}
      </div>

      {/* Two-column row skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2].map((col) => (
          <div key={col}>
            <div className="h-5 bg-primary-200 rounded w-40 mb-4 animate-pulse" />
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl border border-primary-200 p-6 animate-pulse"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <div className="h-4 bg-primary-200 rounded w-48 mb-2" />
                      <div className="h-3 bg-primary-100 rounded w-24 mb-2" />
                      <div className="h-3 bg-primary-100 rounded w-32" />
                    </div>
                    <div className="h-8 bg-primary-100 rounded w-16" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Pipeline + proposals skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2].map((col) => (
          <div key={col}>
            <div className="h-5 bg-primary-200 rounded w-40 mb-4 animate-pulse" />
            <div className="bg-white rounded-xl border border-primary-200 overflow-hidden animate-pulse">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`px-5 py-4 ${
                    i < 4 ? 'border-b border-primary-100' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-primary-100 shrink-0" />
                    <div className="flex-1">
                      <div className="h-4 bg-primary-200 rounded w-32 mb-2" />
                      <div className="h-3 bg-primary-100 rounded w-48" />
                    </div>
                    <div className="h-5 bg-primary-100 rounded w-20" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Follow-ups + activity skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2].map((col) => (
          <div key={col}>
            <div className="h-5 bg-primary-200 rounded w-40 mb-4 animate-pulse" />
            <div className="bg-white rounded-xl border border-primary-200 overflow-hidden animate-pulse">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`px-5 py-4 ${
                    i < 3 ? 'border-b border-primary-100' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-primary-100 shrink-0" />
                    <div className="flex-1">
                      <div className="h-4 bg-primary-200 rounded w-40 mb-2" />
                      <div className="h-3 bg-primary-100 rounded w-28" />
                    </div>
                    <div className="h-3 bg-primary-100 rounded w-20" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
