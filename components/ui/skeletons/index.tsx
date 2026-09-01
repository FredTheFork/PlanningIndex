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

export function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-primary-200 animate-pulse">
      <table className="w-full">
        <thead>
          <tr className="border-b border-primary-200 bg-primary-50">
            {[...Array(cols)].map((_, i) => (
              <th key={i} className="px-4 py-3">
                <div className="h-4 bg-primary-200 rounded w-24" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[...Array(rows)].map((_, i) => (
            <tr key={i} className="border-b border-primary-100 last:border-b-0">
              {[...Array(cols)].map((_, j) => (
                <td key={j} className="px-4 py-3.5">
                  <div className="h-4 bg-primary-100 rounded w-full" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="space-y-2">
        <div className="h-8 bg-primary-200 rounded w-64" />
        <div className="h-4 bg-primary-100 rounded w-96" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-3 bg-primary-200 rounded w-20" />
            <div className="h-5 bg-primary-100 rounded w-full" />
          </div>
        ))}
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-primary-200 rounded w-32" />
        <div className="h-3 bg-primary-100 rounded w-full" />
        <div className="h-3 bg-primary-100 rounded w-full" />
        <div className="h-3 bg-primary-100 rounded w-3/4" />
      </div>
    </div>
  );
}

export function Spinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="w-8 h-8 border-2 border-primary-200 border-t-accent-600 rounded-full animate-spin" />
    </div>
  );
}

export function InlineSpinner({ size = 16 }: { size?: number }) {
  return (
    <div
      className="border-2 border-primary-200 border-t-accent-600 rounded-full animate-spin"
      style={{ width: size, height: size }}
    />
  );
}
