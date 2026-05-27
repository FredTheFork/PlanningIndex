import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useClientProfile } from '../../hooks/useClientProfile';
import { useIsAdmin } from '../../hooks/useIsAdmin';
import { LayoutDashboard, FileText, BarChart3, FolderOpen, LogOut, Shield } from 'lucide-react';

const clientNavItems = [
  { label: 'Overview', to: '/personal', icon: LayoutDashboard, end: true },
  { label: 'Intake Form', to: '/personal/intake', icon: FileText, end: false },
  { label: 'Status', to: '/personal/status', icon: BarChart3, end: false },
  { label: 'Documents', to: '/personal/documents', icon: FolderOpen, end: false },
];

const adminNavItems = [
  { label: 'Dashboard', to: '/personal/admin', icon: LayoutDashboard, end: true },
];

export default function PersonalLayout() {
  const { user, signOut } = useAuth();
  const { profile } = useClientProfile();
  const { isAdmin } = useIsAdmin();

  const navItems = isAdmin ? adminNavItems : clientNavItems;
  const areaLabel = isAdmin ? 'Admin Area' : 'Client Area';

  return (
    <div className="min-h-screen bg-off-white">
      {/* Top bar */}
      <div className="bg-white border-b border-border">
        <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-inter font-bold text-navy text-lg">Foundationary</span>
            {isAdmin ? (
              <span className="inline-flex items-center gap-1 font-inter text-xs font-semibold text-white bg-navy px-2 py-0.5 rounded-full">
                <Shield size={12} />
                ADMIN
              </span>
            ) : (
              <span className="font-inter text-secondary-text text-sm hidden sm:inline">{areaLabel}</span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <span className="font-inter text-secondary-text text-sm hidden sm:inline">{user?.email}</span>
            <button
              onClick={signOut}
              className="font-inter text-secondary-text hover:text-navy transition-colors"
              title="Sign out"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <nav className="md:w-56 shrink-0">
            <div className="bg-white rounded-lg border border-border p-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.label}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-md font-inter text-sm transition-colors ${
                      isActive
                        ? 'bg-off-white text-navy font-semibold'
                        : 'text-secondary-text hover:text-navy hover:bg-gray-50'
                    }`
                  }
                >
                  <item.icon size={18} />
                  {item.label}
                </NavLink>
              ))}
            </div>

            {/* Status indicator for regular clients */}
            {!isAdmin && profile && (
              <div className="bg-white rounded-lg border border-border p-4 mt-4">
                <p className="font-inter text-xs text-secondary-text mb-2 uppercase tracking-wider">
                  Delivery Status
                </p>
                <DeliveryStatusBadge status={profile.delivery_status} />
              </div>
            )}
          </nav>

          {/* Main content */}
          <main className="flex-1 min-w-0">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

function DeliveryStatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; color: string; bg: string }> = {
    not_started: { label: 'Not Started', color: 'text-secondary-text', bg: 'bg-gray-100' },
    in_progress: { label: 'In Progress', color: 'text-amber-700', bg: 'bg-amber-50' },
    delivered: { label: 'Delivered', color: 'text-success', bg: 'bg-green-50' },
  };

  const c = config[status] || config.not_started;

  return (
    <span className={`inline-block font-inter text-sm font-medium px-3 py-1 rounded-full ${c.color} ${c.bg}`}>
      {c.label}
    </span>
  );
}
