import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext.jsx';
import { ROLES, ROUTES } from '../../constants/roles.js';

export default function RoleGuard({ children, allowedRoles }) {
  const { isAuthenticated, user } = useContext(AuthContext);

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  const userRole = user?.role?.toUpperCase();
  const hasAccess = allowedRoles.some((role) => role.toUpperCase() === userRole);

  if (!hasAccess) {
    // Redirect based on role
    if (userRole === ROLES.ADMIN) {
      return <Navigate to={ROUTES.ADMIN_DASHBOARD} replace />;
    }
    return <Navigate to={ROUTES.EMPLOYEE_DASHBOARD} replace />;
  }

  return children;
}
