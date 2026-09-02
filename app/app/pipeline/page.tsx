'use client';

import Link from 'next/link';
import { LayoutGrid, Search } from 'lucide-react';
import { EmptyState, Button } from '@/components/ui';

export default function PipelinePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-bold text-primary-900 text-h2">Pipeline</h1>
        <p className="font-sans text-primary-500 text-sm mt-1">
          Drag leads across stages from New to Won.
        </p>
      </div>

      <div className="rounded-xl border border-primary-200 bg-white">
        <EmptyState
          icon={LayoutGrid}
          title="Your pipeline is empty"
          description="Add planning applications as leads to see them appear in your pipeline board."
          action={
            <Link href="/app">
              <Button size="sm" leftIcon={<Search size={14} />}>Search Applications</Button>
            </Link>
          }
        />
      </div>
    </div>
  );
}
