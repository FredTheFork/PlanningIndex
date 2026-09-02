'use client';

import Link from 'next/link';
import { Briefcase, CheckCircle2 } from 'lucide-react';
import { EmptyState, Button } from '@/components/ui';

export default function JobsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-bold text-primary-900 text-h2">Jobs</h1>
        <p className="font-sans text-primary-500 text-sm mt-1">
          Track won leads through to completed jobs.
        </p>
      </div>

      <div className="rounded-xl border border-primary-200 bg-white">
        <EmptyState
          icon={Briefcase}
          title="No jobs yet"
          description="When you win a lead, it becomes a job. Move leads to Won in your pipeline to create jobs."
          action={
            <Link href="/app/pipeline">
              <Button size="sm" leftIcon={<CheckCircle2 size={14} />}>View Pipeline</Button>
            </Link>
          }
        />
      </div>
    </div>
  );
}
