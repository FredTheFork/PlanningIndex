export function CardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-primary-200 p-6 animate-pulse">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-lg bg-primary-100 shrink-0" />
        <div className="flex-1">
          <div className="h-5 bg-primary-200 rounded w-40 mb-3" />
          <div className="h-3 bg-primary-100 rounded w-full mb-2" />
          <div className="h-3 bg-primary-100 rounded w-3/4" />
        </div>
      </div>
    </div>
  );
}

export function ListSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="bg-white rounded-xl border border-primary-200 overflow-hidden animate-pulse">
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="px-5 py-4 border-b border-primary-100 last:border-b-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-primary-100 shrink-0" />
            <div className="flex-1">
              <div className="h-4 bg-primary-200 rounded w-48 mb-2" />
              <div className="h-3 bg-primary-100 rounded w-32" />
            </div>
            <div className="h-6 bg-primary-100 rounded w-20" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function Spinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="w-8 h-8 border-2 border-primary-200 border-t-accent-500 rounded-full animate-spin" />
    </div>
  );
}
