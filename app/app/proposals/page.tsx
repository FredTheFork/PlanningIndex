'use client';

import Link from 'next/link';
import { FileText, Search } from 'lucide-react';
import { EmptyState, Button } from '@/components/ui';

export default function ProposalsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-bold text-primary-900 text-h2">Proposals</h1>
        <p className="font-sans text-primary-500 text-sm mt-1">
          Create, send, and track professional proposals by post.
        </p>
      </div>

      <div className="rounded-xl border border-primary-200 bg-white">
        <EmptyState
          icon={FileText}
          title="No proposals yet"
          description="Your proposals will appear here once you create your first one from a lead."
          action={
            <Link href="/app/leads">
              <Button size="sm" leftIcon={<Search size={14} />}>View Leads</Button>
            </Link>
          }
        />
      </div>
    </div>
  );
}
