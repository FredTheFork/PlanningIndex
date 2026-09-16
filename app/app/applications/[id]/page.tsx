'use client';

import { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import { ApplicationDetailContent } from '@/components/workspace/ApplicationDetailContent';
import { ListSkeleton } from '@/components/ui/skeletons';
import type { SearchApplication } from '@/lib/mock/applications';

// Real applications live in Supabase, so the detail view loads its record
// through the plan-gated API rather than static mock data.
export default function ApplicationDetailPage({ params }: { params: { id: string } }) {
  const [application, setApplication] = useState<SearchApplication | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'missing'>('loading');

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/applications/${params.id}`)
      .then(async (res) => {
        if (res.status === 404) return 'missing' as const;
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return (await res.json()).application as SearchApplication;
      })
      .then((data) => {
        if (cancelled) return;
        if (data === 'missing') {
          setStatus('missing');
        } else {
          setApplication(data);
          setStatus('ready');
        }
      })
      .catch(() => {
        if (!cancelled) setStatus('missing');
      });
    return () => {
      cancelled = true;
    };
  }, [params.id]);

  if (status === 'loading') {
    return (
      <div className="space-y-4">
        <ListSkeleton rows={4} />
      </div>
    );
  }
  if (status === 'missing' || !application) {
    notFound();
  }

  return <ApplicationDetailContent application={application} />;
}
