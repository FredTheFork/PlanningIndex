export function DocumentCardSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 animate-pulse">
      <div className="flex items-start gap-4">
        <div className="bg-gray-100 rounded-lg p-3 shrink-0">
          <div className="w-6 h-6 bg-gray-200 rounded" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="h-5 bg-gray-200 rounded w-40 mb-2" />
          <div className="h-3 bg-gray-100 rounded w-32 mb-3" />
          <div className="flex flex-wrap gap-2">
            <div className="h-8 bg-gray-100 rounded w-20" />
            <div className="h-8 bg-gray-100 rounded w-16" />
            <div className="h-8 bg-gray-100 rounded w-16" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ServiceCardSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden animate-pulse">
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="bg-gray-100 rounded-lg p-2.5 shrink-0">
            <div className="w-5 h-5 bg-gray-200 rounded" />
          </div>
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-40 mb-1" />
            <div className="h-3 bg-gray-100 rounded w-56" />
          </div>
          <div className="h-6 bg-gray-100 rounded w-24" />
        </div>
      </div>
      <div className="divide-y divide-gray-100">
        {[1, 2, 3].map((i) => (
          <div key={i} className="px-5 py-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-gray-200 rounded" />
                <div>
                  <div className="h-4 bg-gray-200 rounded w-32 mb-1" />
                  <div className="h-3 bg-gray-100 rounded w-48" />
                </div>
              </div>
              <div className="flex gap-2">
                <div className="h-6 bg-gray-100 rounded w-16" />
                <div className="h-6 bg-gray-100 rounded w-14" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PostCardSkeleton() {
  return (
    <div className="bg-gray-50 rounded-lg p-4 animate-pulse">
      <div className="flex items-center gap-2 mb-2">
        <div className="h-4 bg-gray-200 rounded w-8" />
        <div className="h-5 bg-gray-100 rounded w-20" />
        <div className="h-5 bg-gray-100 rounded w-16" />
        <div className="h-3 bg-gray-200 rounded w-12" />
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-4/5" />
        <div className="h-3 bg-gray-200 rounded w-3/5" />
      </div>
      <div className="flex gap-2 mt-3">
        <div className="h-7 bg-gray-100 rounded w-28" />
        <div className="h-7 bg-gray-100 rounded w-24" />
      </div>
    </div>
  );
}

export function TimelineSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
        <div className="bg-gray-100 rounded-lg p-2 shrink-0">
          <div className="w-5 h-5 bg-gray-200 rounded" />
        </div>
        <div>
          <div className="h-5 bg-gray-200 rounded w-48 mb-1" />
          <div className="h-3 bg-gray-100 rounded w-24" />
        </div>
      </div>
      <div className="space-y-0">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 bg-gray-100 rounded-full shrink-0" />
              {i < 3 && <div className="w-0.5 h-12 bg-gray-100" />}
            </div>
            <div className="pb-8">
              <div className="h-4 bg-gray-200 rounded w-48 mb-1" />
              <div className="h-3 bg-gray-100 rounded w-32" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function WebsitePreviewSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden animate-pulse">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 bg-gray-200 rounded" />
          <div className="h-4 bg-gray-200 rounded w-32" />
        </div>
        <div className="flex items-center gap-2">
          <div className="flex border border-gray-200 rounded overflow-hidden">
            <div className="p-1.5 bg-gray-100" />
            <div className="p-1.5 bg-gray-100" />
            <div className="p-1.5 bg-gray-100" />
          </div>
          <div className="h-7 bg-gray-200 rounded w-24" />
        </div>
      </div>
      <div className="bg-gray-100 h-96 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-400 rounded-full animate-spin mx-auto mb-3" />
          <div className="h-3 bg-gray-200 rounded w-32 mx-auto" />
        </div>
      </div>
    </div>
  );
}

export function DeliveryStatusSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse">
      <div className="flex items-center gap-3 mb-2">
        <div className="h-3 bg-gray-100 rounded w-24" />
      </div>
      <div className="h-6 bg-gray-200 rounded w-28" />
      <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-gray-100">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-5 bg-gray-100 rounded w-20" />
        ))}
      </div>
    </div>
  );
}
