'use client';

import { Activity } from 'lucide-react';
import { EmptyState } from '@/components/ui';

export default function ActivityPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-bold text-primary-900 text-h2">Activity</h1>
        <p className="font-sans text-primary-500 text-sm mt-1">
          A timeline of everything happening across your workspace.
        </p>
      </div>

      <div className="rounded-xl border border-primary-200 bg-white">
        <EmptyState
          icon={Activity}
          title="No activity yet"
          description="Actions taken by you and your team — adding leads, sending proposals, moving pipeline stages — will appear here."
        />
      </div>
    </div>
  );
}
