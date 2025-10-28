/**
 * Protected Route Component
 * Handles authentication and role-based access control
 */

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { usePermissions } from '../contexts/PermissionContext';
import type { PermissionName, UserRole } from '../utils/permissions';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: PermissionName;
  requiredPermissions?: PermissionName[]; // Require ALL of these
  anyPermission?: PermissionName[]; // Require ANY of these
  requiredRole?: UserRole;
  superAdminOnly?: boolean;
  adminOnly?: boolean;
  redirectTo?: string;
}

export default function ProtectedRoute({
  children,
  requiredPermission,
  requiredPermissions,
  anyPermission,
  requiredRole,
  superAdminOnly = false,
  adminOnly = false,
  redirectTo = '/login',
}: ProtectedRouteProps) {
  const { user, isLoading: authLoading } = useAuth();
  const {
    hasPermission,
    hasAllPermissions,
    hasAnyPermission,
    hasRoleOrHigher,
    isSuperAdmin,
    isAdmin,
    loading: permissionsLoading,
  } = usePermissions();

  // Show loading state while checking authentication
  if (authLoading || permissionsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }

  // Check super admin requirement
  if (superAdminOnly && !isSuperAdmin()) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Check admin requirement
  if (adminOnly && !isAdmin()) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Check role requirement
  if (requiredRole && !hasRoleOrHigher(requiredRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Check single permission requirement
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Check all permissions requirement
  if (requiredPermissions && !hasAllPermissions(requiredPermissions)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Check any permission requirement
  if (anyPermission && !hasAnyPermission(anyPermission)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // All checks passed, render children
  return <>{children}</>;
}

// =====================================================
// CONVENIENCE WRAPPER COMPONENTS
// =====================================================

/**
 * Super Admin only route
 */
export function SuperAdminRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute superAdminOnly>
      {children}
    </ProtectedRoute>
  );
}

/**
 * Admin only route
 */
export function AdminRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute adminOnly>
      {children}
    </ProtectedRoute>
  );
}

/**
 * Admin or Manager route
 */
export function ManagerRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute anyPermission={['view_users', 'manage_field_workers']}>
      {children}
    </ProtectedRoute>
  );
}
