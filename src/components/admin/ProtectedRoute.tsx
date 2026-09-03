import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getAuthenticatedUser } from '../../utils/auth';
import { Permission, hasPermission, hasAnyPermission } from '../../utils/permissions';
import AccessDenied from './AccessDenied';

interface ProtectedRouteProps {
  children: React.ReactNode;
  permission?: Permission;
  anyPermission?: Permission[];
}

export default function ProtectedRoute({
  children,
  permission,
  anyPermission,
}: ProtectedRouteProps) {
  const user = getAuthenticatedUser();
  const location = useLocation();

  // If not logged in, redirect to admin login
  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Check specific permission
  if (permission && !hasPermission(user, permission)) {
    return <AccessDenied requiredPermission={permission} />;
  }

  // Check anyPermission list
  if (anyPermission && !hasAnyPermission(user, anyPermission)) {
    return <AccessDenied requiredPermission={anyPermission[0]} />;
  }

  return <>{children}</>;
}
