import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useClientProfile } from '../hooks/useClientProfile';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useClientProfile();

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-off-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy mx-auto mb-4" />
          <p className="text-secondary-text font-inter text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/pricing" replace />;
  }

  // User must have a client profile (i.e. they paid)
  if (!profile) {
    return <Navigate to="/pricing" replace />;
  }

  return <>{children}</>;
}
