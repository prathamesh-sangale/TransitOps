import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../constants/routes';
import { LayoutDashboard, Truck, Users, Route, Wrench, WalletCards, ChartNoAxesCombined, Settings, LogOut, Menu } from 'lucide-react';
import { useState } from 'react';

const NAV_ITEMS = [
  { path: ROUTES.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard, allowedRoles: ['FLEET_MANAGER', 'DISPATCHER', 'SAFETY_OFFICER', 'FINANCIAL_ANALYST'] },
  { path: ROUTES.VEHICLES, label: 'Vehicles', icon: Truck, allowedRoles: ['FLEET_MANAGER', 'DISPATCHER', 'SAFETY_OFFICER'] },
  { path: ROUTES.DRIVERS, label: 'Drivers', icon: Users, allowedRoles: ['FLEET_MANAGER', 'DISPATCHER', 'SAFETY_OFFICER'] },
  { path: ROUTES.TRIPS, label: 'Trips', icon: Route, allowedRoles: ['FLEET_MANAGER', 'DISPATCHER'] },
  { path: ROUTES.MAINTENANCE, label: 'Maintenance', icon: Wrench, allowedRoles: ['FLEET_MANAGER', 'SAFETY_OFFICER'] },
  { path: ROUTES.FINANCE, label: 'Finance', icon: WalletCards, allowedRoles: ['FLEET_MANAGER', 'FINANCIAL_ANALYST'] },
  { path: ROUTES.ANALYTICS, label: 'Analytics', icon: ChartNoAxesCombined, allowedRoles: ['FLEET_MANAGER', 'FINANCIAL_ANALYST'] },
  { path: ROUTES.SETTINGS, label: 'Settings', icon: Settings, allowedRoles: ['FLEET_MANAGER'] },
];

export const AppLayout = () => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-app-bg flex overflow-hidden">
      {/* Sidebar Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-text-primary/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-surface border-r border-border-subtle transform transition-transform duration-200 ease-in-out
        lg:relative lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-16 flex items-center px-6 border-b border-border-subtle">
          <h1 className="text-xl font-bold text-primary">TransitOps</h1>
        </div>
        
        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-4rem)]">
          {NAV_ITEMS.filter(item => !item.allowedRoles || item.allowedRoles.includes(user?.role)).map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors
                ${isActive 
                  ? 'bg-primary-soft text-primary' 
                  : 'text-text-secondary hover:bg-surface-secondary hover:text-text-primary'
                }
              `}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-surface border-b border-border-subtle flex items-center justify-between px-4 sm:px-6">
          <button 
            className="lg:hidden p-2 text-text-secondary hover:bg-surface-secondary rounded-md"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="flex-1" /> {/* Spacer */}

          <div className="flex items-center gap-4">
            <div className="text-sm text-text-secondary hidden sm:block">
              {user?.name} ({user?.role})
            </div>
            <button 
              onClick={logout}
              className="flex items-center gap-2 text-sm text-text-secondary hover:text-danger transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
