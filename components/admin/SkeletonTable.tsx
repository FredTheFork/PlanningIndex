'use client';

export default function SkeletonTable({ rows = 10 }: { rows?: number }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden animate-pulse">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1200px]">
          <thead>
            <tr className="bg-[#FAFBFC] border-b border-gray-200">
              <th className="px-4 py-3 w-10">
                <div className="h-4 w-4 bg-gray-200 rounded" />
              </th>
              <th className="px-4 py-3 min-w-[200px]">
                <div className="h-3 w-16 bg-gray-200 rounded" />
              </th>
              <th className="px-4 py-3 w-[100px]">
                <div className="h-3 w-10 bg-gray-200 rounded" />
              </th>
              <th className="px-4 py-3 w-[100px]">
                <div className="h-3 w-12 bg-gray-200 rounded" />
              </th>
              <th className="px-4 py-3 w-[90px]">
                <div className="h-3 w-10 bg-gray-200 rounded" />
              </th>
              <th className="px-4 py-3 w-[90px]">
                <div className="h-3 w-8 bg-gray-200 rounded" />
              </th>
              <th className="px-4 py-3 w-[70px]">
                <div className="h-3 w-8 bg-gray-200 rounded" />
              </th>
              <th className="px-4 py-3 min-w-[180px]">
                <div className="h-3 w-14 bg-gray-200 rounded" />
              </th>
              <th className="px-4 py-3 w-[100px]">
                <div className="h-3 w-12 bg-gray-200 rounded" />
              </th>
              <th className="px-4 py-3 w-[60px]">
                <div className="h-3 w-8 bg-gray-200 rounded" />
              </th>
              <th className="px-4 py-3 w-[100px]">
                <div className="h-3 w-14 bg-gray-200 rounded" />
              </th>
              <th className="px-4 py-3 w-[140px]">
                <div className="h-3 w-10 bg-gray-200 rounded" />
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }).map((_, i) => (
              <tr key={i} className="border-b border-gray-200">
                <td className="px-4 py-3">
                  <div className="h-4 w-4 bg-gray-200 rounded" />
                </td>
                <td className="px-4 py-3">
                  <div className="space-y-1.5">
                    <div className="h-3 w-32 bg-gray-200 rounded" />
                    <div className="h-2.5 w-24 bg-gray-100 rounded" />
                    <div className="h-2 w-20 bg-gray-100 rounded" />
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="h-5 w-18 bg-gray-200 rounded-full" />
                </td>
                <td className="px-4 py-3">
                  <div className="h-5 w-16 bg-gray-200 rounded-full" />
                </td>
                <td className="px-4 py-3">
                  <div className="h-5 w-14 bg-gray-200 rounded-full" />
                </td>
                <td className="px-4 py-3">
                  <div className="h-5 w-12 bg-gray-200 rounded-full" />
                </td>
                <td className="px-4 py-3">
                  <div className="h-3 w-8 bg-gray-200 rounded" />
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <div className="h-4 w-16 bg-gray-200 rounded" />
                    <div className="h-4 w-12 bg-gray-100 rounded" />
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="h-5 w-18 bg-gray-200 rounded-full" />
                </td>
                <td className="px-4 py-3">
                  <div className="h-4 w-6 bg-gray-200 rounded" />
                </td>
                <td className="px-4 py-3">
                  <div className="h-3 w-20 bg-gray-200 rounded" />
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <div className="h-6 w-18 bg-gray-200 rounded" />
                    <div className="h-4 w-14 bg-gray-100 rounded" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
