'use client';

import { useAuth } from '@/hooks/useAuth';
import IntakeWizard from '@/components/intake/IntakeWizard';

export default function PersonalIntake() {
  const { user, loading: authLoading } = useAuth();

  if (authLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1B3F7A]" />
      </div>
    );
  }

  if (!user) return null;

  return <IntakeWizard />;
}
