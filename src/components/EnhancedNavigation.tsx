import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Dashboard as DashboardIcon,
  Business as BusinessIcon,
  People as PeopleIcon,
  Apartment as ApartmentIcon,
  AttachMoney as MoneyIcon,
  History as HistoryIcon,
  Settings as SettingsIcon,
  Analytics as AnalyticsIcon,
  Group as UsersIcon,
  Assignment as ReportsIcon,
  Notifications as AlertsIcon,
  ArrowDropDown as DropdownIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
  Logout as LogoutIcon,
  AdminPanelSettings as SuperAdminIcon,
  Shield as SecurityIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { usePermission } from '../hooks/usePermission';

interface MenuItem {
  name: string;
  href: string;
  icon: any;
  permission?: string;
  badge?: string;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

export function EnhancedNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, supabase } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tenantMenuOpen, setTenantMenuOpen] = useState(false);
  const [userTenants, setUserTenants] = useState<any[]>([]);
  const [currentTenant, setCurrentTenant] = useState<any>(null);

  const isSuperAdmin = usePermission('manage_organizations');
  const isAdmin = usePermission('manage_tenants');
  const canManageUsers = usePermission('manage_users');
  const canViewAudit = usePermission('view_audit_logs');

  useEffect(() => {
    if (isAdmin) {
      loadUserTenants();
    }
  }, [isAdmin]);

  async function loadUserTenants() {
    try {
      // Get user's organization
      const { data: orgData } = await supabase
        .from('user_organizations')
        .select('organization_id')
        .eq('user_id', user?.id)
        .single();

      if (!orgData) return;

      // Load organization tenants
      const { data: tenants } = await supabase
        .from('tenants')
        .select('id, name, display_name, subdomain, status')
        .eq('organization_id', orgData.organization_id)
        .eq('status', 'active')
        .order('name');

      setUserTenants(tenants || []);

      // Set first tenant as current if none selected
      if (tenants && tenants.length > 0 && !currentTenant) {
        setCurrentTenant(tenants[0]);
      }
    } catch (error) {
      console.error('Failed to load tenants:', error);
    }
  }

  // Super Admin Navigation
  const superAdminMenu: MenuSection[] = [
    {
      title: 'Platform Management',
      items: [
        { name: 'Platform Dashboard', href: '/super-admin/dashboard', icon: DashboardIcon },
        { name: 'Admin Management', href: '/super-admin/admins', icon: PeopleIcon },
        { name: 'Tenant Registry', href: '/super-admin/tenants', icon: ApartmentIcon },
        { name: 'Billing & Revenue', href: '/super-admin/billing', icon: MoneyIcon },
      ],
    },
  ];

  // Admin Navigation
  const adminMenu: MenuSection[] = [
    {
      title: 'Organization',
      items: [
        { name: 'Organization Dashboard', href: '/admin/dashboard', icon: BusinessIcon },
        { name: 'Tenant Management', href: '/admin/tenants', icon: ApartmentIcon, permission: 'manage_tenants' },
        { name: 'User Management', href: '/admin/users', icon: PeopleIcon, permission: 'manage_users' },
        { name: 'Audit Logs', href: '/admin/audit-logs', icon: HistoryIcon, permission: 'view_audit_logs' },
      ],
    },
  ];

  // Standard User Navigation
  const userMenu: MenuSection[] = [
    {
      title: 'Dashboard',
      items: [
        { name: 'Overview', href: '/dashboard', icon: DashboardIcon },
        { name: 'Analytics', href: '/analytics', icon: AnalyticsIcon },
        { name: 'Voter Database', href: '/voter-database', icon: UsersIcon },
      ],
    },
    {
      title: 'Campaign Tools',
      items: [
        { name: 'Social Media', href: '/social-media', icon: DashboardIcon },
        { name: 'Field Workers', href: '/field-workers', icon: UsersIcon },
        { name: 'AI Insights', href: '/ai-insights', icon: SecurityIcon },
      ],
    },
    {
      title: 'Reports',
      items: [
        { name: 'Reports', href: '/reports', icon: ReportsIcon },
        { name: 'Alerts', href: '/alerts', icon: AlertsIcon },
      ],
    },
  ];

  const settingsMenu: MenuItem[] = [
    { name: 'Settings', href: '/settings', icon: SettingsIcon },
  ];

  function getMenuSections(): MenuSection[] {
    if (isSuperAdmin) {
      return superAdminMenu;
    } else if (isAdmin) {
      return [...adminMenu, ...userMenu];
    } else {
      return userMenu;
    }
  }

  function handleTenantSwitch(tenant: any) {
    setCurrentTenant(tenant);
    setTenantMenuOpen(false);

    // Redirect to tenant-specific subdomain in production
    if (import.meta.env.PROD) {
      window.location.href = `https://${tenant.subdomain}.yourapp.com/dashboard`;
    } else {
      // In development, just navigate
      navigate('/dashboard');
    }
  }

  const isActive = (href: string) => location.pathname === href;

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-600 hover:text-gray-900"
          >
            {sidebarOpen ? <CloseIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
          <h1 className="ml-3 text-lg font-bold text-gray-900">Pulse of People</h1>
        </div>
        {user && (
          <div className="text-sm text-gray-600">{user.name || user.email}</div>
        )}
      </div>

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
      `}>
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">Pulse of People</h1>
        </div>

        {/* User Info & Tenant Switcher */}
        <div className="p-4 border-b border-gray-200">
          {user && (
            <div className="mb-3">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <PeopleIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900">{user.name || user.email}</p>
                  <p className="text-xs text-gray-500 capitalize">{user.role || 'User'}</p>
                </div>
              </div>
            </div>
          )}

          {/* Tenant Switcher for Admins */}
          {(isAdmin || isSuperAdmin) && userTenants.length > 0 && (
            <div className="relative">
              <button
                onClick={() => setTenantMenuOpen(!tenantMenuOpen)}
                className="w-full flex items-center justify-between px-3 py-2 text-sm bg-gray-50 rounded-lg hover:bg-gray-100"
              >
                <div className="flex items-center">
                  <ApartmentIcon className="w-4 h-4 text-gray-600 mr-2" />
                  <span className="text-gray-900 truncate">
                    {currentTenant?.display_name || 'Select Tenant'}
                  </span>
                </div>
                <DropdownIcon className="w-5 h-5 text-gray-400" />
              </button>

              {tenantMenuOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                  {userTenants.map((tenant) => (
                    <button
                      key={tenant.id}
                      onClick={() => handleTenantSwitch(tenant)}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${
                        currentTenant?.id === tenant.id ? 'bg-blue-50 text-blue-600' : 'text-gray-900'
                      }`}
                    >
                      {tenant.display_name || tenant.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation Sections */}
        <nav className="flex-1 px-4 py-4 space-y-6 overflow-y-auto">
          {getMenuSections().map((section, idx) => (
            <div key={idx}>
              <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {section.title}
              </h3>
              <div className="mt-2 space-y-1">
                {section.items
                  .filter((item) => !item.permission || usePermission(item.permission))
                  .map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);

                    return (
                      <button
                        key={item.name}
                        onClick={() => {
                          navigate(item.href);
                          setSidebarOpen(false);
                        }}
                        className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg ${
                          active
                            ? 'bg-blue-50 text-blue-600'
                            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <Icon className={`w-5 h-5 mr-3 ${active ? 'text-blue-600' : 'text-gray-400'}`} />
                        {item.name}
                        {item.badge && (
                          <span className="ml-auto px-2 py-0.5 text-xs font-medium bg-red-100 text-red-600 rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
              </div>
            </div>
          ))}

          {/* Settings & Logout */}
          <div>
            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Account
            </h3>
            <div className="mt-2 space-y-1">
              {settingsMenu.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                return (
                  <button
                    key={item.name}
                    onClick={() => {
                      navigate(item.href);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg ${
                      active
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className={`w-5 h-5 mr-3 ${active ? 'text-blue-600' : 'text-gray-400'}`} />
                    {item.name}
                  </button>
                );
              })}

              <button
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="w-full flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg"
              >
                <LogoutIcon className="w-5 h-5 mr-3 text-red-600" />
                Logout
              </button>
            </div>
          </div>
        </nav>

        {/* Role Badge */}
        {isSuperAdmin && (
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center px-3 py-2 bg-purple-50 rounded-lg">
              <SuperAdminIcon className="w-5 h-5 text-purple-600 mr-2" />
              <span className="text-sm font-medium text-purple-600">Super Admin</span>
            </div>
          </div>
        )}
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
}

export default EnhancedNavigation;
