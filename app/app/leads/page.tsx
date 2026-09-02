'use client';

import Link from 'next/link';
import { Users, Plus, Search } from 'lucide-react';
import { EmptyState, Button } from '@/components/ui';

export default function LeadsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-bold text-primary-900 text-h2">Leads</h1>
        <p className="font-sans text-primary-500 text-sm mt-1">
          Manage your leads and track them through your pipeline.
        </p>
      </div>

      <div className="rounded-xl border border-primary-200 bg-white">
        <EmptyState
          icon={Users}
          title="No leads yet"
          description="Find a planning application and add it to your CRM to start building your pipeline."
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
