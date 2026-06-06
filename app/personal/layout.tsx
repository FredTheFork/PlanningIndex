'use client';

import { useEffect, useMemo } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useClientProfile } from '@/hooks/useClientProfile';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import { useUnreadMessages } from '@/hooks/useUnreadMessages';
import { getServiceById } from '@/lib/services/service-catalog';
import { isServiceDocumentService } from '@/lib/services/document-service-map';
import { LayoutDashboard, FileText, BarChart3, FolderOpen, LogOut, Shield, Package, RefreshCw } from 'lucide-react';
import ChatBubble from '@/components/ui/ChatBubble';

const adminNavItems = [
  { label: 'Dashboard', href: '/personal/admin', icon: LayoutDashboard },
];

export default function PersonalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading: authLoading, signOut } = useAuth();
  const { profile, purchasedServiceIds } = useClientProfile();
  const { isAdmin } = useIsAdmin();
  const { unreadCount } = useUnreadMessages();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Build dynamic client nav based on purchased services
  const clientNavItems = useMemo(() => {
    const items = [
      { label: 'Overview', href: '/personal', icon: LayoutDashboard },
      { label: 'Intake Form', href: '/personal/intake', icon: FileText },
    ];

    // Show Status and Documents only if the user has at least one document-producing service
    const hasDocService = purchasedServiceIds.some(isServiceDocumentService);
    if (hasDocService) {
      items.push(
        { label: 'Status', href: '/personal/status', icon: BarChart3 },
        { label: 'Documents', href: '/personal/documents', icon: FolderOpen },
      );
    }

    return items;
  }, [purchasedServiceIds]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#FAFBFC] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1B3F7A]" />
      </div>
    );
  }

  if (!user) return null;

  const navItems = isAdmin ? adminNavItems : clientNavItems;
  const areaLabel = isAdmin ? 'Admin Area' : 'Client Area';

  return (
    <div className="min-h-screen bg-[#FAFBFC]">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1600px] mx-auto px-4 lg:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="font-inter font-bold text-[#1B3F7A] text-lg">
              Foundationary
            </Link>
            {isAdmin ? (
              <span className="inline-flex items-center gap-1 font-inter text-xs font-semibold text-white bg-[#1B3F7A] px-2 py-0.5 rounded-full">
                <Shield size={12} />
                ADMIN
              </span>
            ) : (
              <span className="font-inter text-gray-600 text-sm hidden sm:inline">{areaLabel}</span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <span className="font-inter text-gray-600 text-sm hidden sm:inline">{user?.email}</span>
            <button
              onClick={signOut}
              className="font-inter text-gray-600 hover:text-[#1B3F7A] transition-colors"
              title="Sign out"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 lg:px-6 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <nav className="md:w-48 shrink-0">
            <div className="bg-white rounded-lg border border-gray-200 p-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                const isMessages = item.label === 'Messages';
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`flex items-center justify-between px-4 py-3 rounded-md font-inter text-sm transition-colors ${
                      isActive
                        ? 'bg-[#FAFBFC] text-[#1B3F7A] font-semibold'
                        : 'text-gray-600 hover:text-[#1B3F7A] hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon size={18} />
                      {item.label}
                    </div>
                    {isMessages && unreadCount > 0 && (
                      <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-semibold text-white bg-medium-blue rounded-full">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Status indicator + service badges for regular clients */}
            {!isAdmin && profile && (
              <div className="bg-white rounded-lg border border-gray-200 p-4 mt-4">
                <p className="font-inter text-xs text-gray-600 mb-2 uppercase tracking-wider">
                  Delivery Status
                </p>
                <DeliveryStatusBadge status={profile.delivery_status} />

                {/* Service badges */}
                {purchasedServiceIds.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-gray-100">
                    {purchasedServiceIds.map((sid) => {
                      const service = getServiceById(sid);
                      const isRefresh = sid === 'quarterly_refresh';
                      return (
                        <span
                          key={sid}
                          className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-inter font-medium ${
                            isRefresh
                              ? 'bg-teal-50 text-teal-700'
                              : 'bg-[#1B3F7A]/5 text-[#1B3F7A]'
                          }`}
                        >
                          {isRefresh ? <RefreshCw size={9} /> : <Package size={9} />}
                          {service?.name?.split(' ')[0] ?? sid}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </nav>

          {/* Main content */}
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>

      {/* Chat Bubble - Only for clients, not admins */}
      {!isAdmin && <ChatBubble />}
    </div>
  );
}

function DeliveryStatusBadge({ status }: { status: string }) {
  const statusConfig: Record<string, { label: string; color: string }> = {
    not_started: { label: 'Not Started', color: 'text-gray-600 bg-gray-100' },
    in_progress: { label: 'In Progress', color: 'text-blue-600 bg-blue-100' },
    delivered: { label: 'Delivered', color: 'text-green-600 bg-green-100' },
  };

  const config = statusConfig[status] || statusConfig.not_started;

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full font-inter text-sm font-medium ${config.color}`}>
      {config.label}
    </span>
  );
}
