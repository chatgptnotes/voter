/**
 * Permission Context
 * Provides permission and role management throughout the application
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import type {
  UserPermissions,
  PermissionName,
  UserRole,
  OrganizationFeatures,
} from '../utils/permissions';
import {
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  isSuperAdmin,
  isAdmin,
  isAdminOrManager,
  hasRoleOrHigher,
  canManageUser,
  getAssignableRoles,
} from '../utils/permissions';
import {
  loadUserPermissions,
  getUserOrganization,
  type Organization,
} from '../utils/rbac';

// =====================================================
// TYPES & INTERFACES
// =====================================================

interface PermissionContextType {
  // User permissions
  userPermissions: UserPermissions | null;
  organization: Organization | null;
  features: Partial<OrganizationFeatures> | null;
  loading: boolean;

  // Permission checking functions
  hasPermission: (permission: PermissionName) => boolean;
  hasAnyPermission: (permissions: PermissionName[]) => boolean;
  hasAllPermissions: (permissions: PermissionName[]) => boolean;

  // Role checking functions
  isSuperAdmin: () => boolean;
  isAdmin: () => boolean;
  isAdminOrManager: () => boolean;
  hasRoleOrHigher: (role: UserRole) => boolean;
  canManageUser: (targetUserRole: UserRole) => boolean;
  getAssignableRoles: () => UserRole[];

  // Feature access
  hasFeatureAccess: (feature: keyof OrganizationFeatures) => boolean;

  // Refresh permissions
  refreshPermissions: () => Promise<void>;
}

// =====================================================
// CONTEXT CREATION
// =====================================================

const PermissionContext = createContext<PermissionContextType | undefined>(undefined);

// =====================================================
// PROVIDER COMPONENT
// =====================================================

export function PermissionProvider({ children }: { children: React.ReactNode }) {
  const { user, supabase } = useAuth();
  const [userPermissions, setUserPermissions] = useState<UserPermissions | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [features, setFeatures] = useState<Partial<OrganizationFeatures> | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user permissions when user changes
  useEffect(() => {
    if (user && supabase) {
      loadPermissions();
    } else {
      setUserPermissions(null);
      setOrganization(null);
      setFeatures(null);
      setLoading(false);
    }
  }, [user, supabase]);

  // Load user permissions and organization data
  const loadPermissions = async () => {
    if (!user || !supabase) return;

    setLoading(true);

    try {
      // Load user permissions
      const permissions = await loadUserPermissions(supabase, user.id);
      setUserPermissions(permissions);

      // Load organization data
      if (permissions?.organizationId) {
        const org = await getUserOrganization(supabase, user.id);
        setOrganization(org);

        // Set features from organization
        if (org?.features) {
          setFeatures(org.features);
        }
      }
    } catch (error) {
      console.error('Error loading permissions:', error);
    } finally {
      setLoading(false);
    }
  };

  // Refresh permissions (call after role/permission changes)
  const refreshPermissions = async () => {
    await loadPermissions();
  };

  // Permission checking wrapper functions
  const checkPermission = (permission: PermissionName) => {
    return hasPermission(userPermissions, permission);
  };

  const checkAnyPermission = (permissions: PermissionName[]) => {
    return hasAnyPermission(userPermissions, permissions);
  };

  const checkAllPermissions = (permissions: PermissionName[]) => {
    return hasAllPermissions(userPermissions, permissions);
  };

  // Role checking wrapper functions
  const checkIsSuperAdmin = () => {
    return isSuperAdmin(userPermissions);
  };

  const checkIsAdmin = () => {
    return isAdmin(userPermissions);
  };

  const checkIsAdminOrManager = () => {
    return isAdminOrManager(userPermissions);
  };

  const checkHasRoleOrHigher = (role: UserRole) => {
    return hasRoleOrHigher(userPermissions, role);
  };

  const checkCanManageUser = (targetUserRole: UserRole) => {
    return canManageUser(userPermissions, targetUserRole);
  };

  const getUserAssignableRoles = () => {
    return getAssignableRoles(userPermissions);
  };

  // Feature access checking
  const checkFeatureAccess = (feature: keyof OrganizationFeatures) => {
    if (!features) return false;
    if (userPermissions?.isSuperAdmin) return true; // Super admins bypass feature restrictions
    return features[feature] === true;
  };

  const value: PermissionContextType = {
    userPermissions,
    organization,
    features,
    loading,

    hasPermission: checkPermission,
    hasAnyPermission: checkAnyPermission,
    hasAllPermissions: checkAllPermissions,

    isSuperAdmin: checkIsSuperAdmin,
    isAdmin: checkIsAdmin,
    isAdminOrManager: checkIsAdminOrManager,
    hasRoleOrHigher: checkHasRoleOrHigher,
    canManageUser: checkCanManageUser,
    getAssignableRoles: getUserAssignableRoles,

    hasFeatureAccess: checkFeatureAccess,

    refreshPermissions,
  };

  return (
    <PermissionContext.Provider value={value}>
      {children}
    </PermissionContext.Provider>
  );
}

// =====================================================
// HOOK
// =====================================================

export function usePermissions() {
  const context = useContext(PermissionContext);
  if (context === undefined) {
    throw new Error('usePermissions must be used within a PermissionProvider');
  }
  return context;
}

// =====================================================
// CONVENIENCE HOOKS
// =====================================================

/**
 * Hook to check a single permission
 */
export function usePermission(permission: PermissionName): boolean {
  const { hasPermission } = usePermissions();
  return hasPermission(permission);
}

/**
 * Hook to check user's role
 */
export function useRole(): UserRole | null {
  const { userPermissions } = usePermissions();
  return userPermissions?.role || null;
}

/**
 * Hook to check if user is super admin
 */
export function useIsSuperAdmin(): boolean {
  const { isSuperAdmin } = usePermissions();
  return isSuperAdmin();
}

/**
 * Hook to check if user is admin
 */
export function useIsAdmin(): boolean {
  const { isAdmin } = usePermissions();
  return isAdmin();
}

/**
 * Hook to check if user is admin or manager
 */
export function useIsAdminOrManager(): boolean {
  const { isAdminOrManager } = usePermissions();
  return isAdminOrManager();
}

/**
 * Hook to get user's organization
 */
export function useOrganization(): Organization | null {
  const { organization } = usePermissions();
  return organization;
}

/**
 * Hook to check feature access
 */
export function useFeatureAccess(feature: keyof OrganizationFeatures): boolean {
  const { hasFeatureAccess } = usePermissions();
  return hasFeatureAccess(feature);
}
