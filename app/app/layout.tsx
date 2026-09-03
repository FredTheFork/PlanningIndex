'use client';

import { useState } from 'react';
import Sidebar from '@/components/workspace/Sidebar';
import TopBar from '@/components/workspace/TopBar';
import AuthGuard from '@/components/workspace/AuthGuard';
import { LeadsProvider } from '@/components/workspace/LeadsContext';
import { ProposalsProvider } from '@/components/workspace/ProposalsContext';
import { ToastProvider } from '@/components/ui/Toast';

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AuthGuard>
      <LeadsProvider>
      <ProposalsProvider>
      <ToastProvider>
        <div className="min-h-screen bg-surface-page">
          <Sidebar mobileOpen={sidebarOpen} onCloseMobile={() => setSidebarOpen(false)} />
          <TopBar onToggleSidebar={() => setSidebarOpen(true)} />
          <main className="lg:ml-[240px] pt-14">
            <div className="max-w-page mx-auto px-4 py-6 sm:px-6 lg:py-8">
              {children}
            </div>
          </main>
        </div>
      </ToastProvider>
      </ProposalsProvider>
      </LeadsProvider>
    </AuthGuard>
  );
}
