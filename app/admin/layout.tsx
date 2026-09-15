import type { Metadata } from 'next';
import AdminNav from '@/components/admin/AdminNav';

export const metadata: Metadata = {
  title: 'Admin',
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface-page">
      <AdminNav />
      <main className="max-w-page mx-auto px-4 py-6 sm:px-6 lg:py-8">
        {children}
      </main>
    </div>
  );
}
