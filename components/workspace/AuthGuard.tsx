'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading, hasActiveSubscription } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace('/login');
      return;
    }
    if (!hasActiveSubscription) {
      router.replace('/choose-plan');
    }
  }, [user, loading, hasActiveSubscription, router]);

  if (loading || !user || (!hasActiveSubscription && user)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-surface-page">
        <div className="w-8 h-8 border-2 border-primary-200 border-t-accent-600 rounded-full animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
