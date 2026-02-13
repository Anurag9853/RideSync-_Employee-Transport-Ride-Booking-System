import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import RoleGuard from './components/guards/RoleGuard.jsx';
import AdminLayout from './layouts/AdminLayout.jsx';
import EmployeeLayout from './layouts/EmployeeLayout.jsx';
import Toast from './components/common/Toast.jsx';
import { useToast } from './hooks/useToast.js';

import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';

import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import ManageRides from './pages/admin/ManageRides.jsx';
import ManageUsers from './pages/admin/ManageUsers.jsx';
import ManageBookings from './pages/admin/ManageBookings.jsx';

import EmployeeDashboard from './pages/employee/EmployeeDashboard.jsx';
import BrowseRides from './pages/employee/BrowseRides.jsx';
import MyBookings from './pages/employee/MyBookings.jsx';

import { ROLES, ROUTES } from './constants/roles.js';

function AppContent() {
  const { toasts, removeToast } = useToast();

  return (
    <>
      <Routes>
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.REGISTER} element={<Register />} />

        <Route
          path="/admin/*"
          element={
            <RoleGuard allowedRoles={[ROLES.ADMIN]}>
              <AdminLayout>
                <Routes>
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="rides" element={<ManageRides />} />
                  <Route path="users" element={<ManageUsers />} />
                  <Route path="bookings" element={<ManageBookings />} />
                  <Route path="*" element={<Navigate to={ROUTES.ADMIN_DASHBOARD} replace />} />
                </Routes>
              </AdminLayout>
            </RoleGuard>
          }
        />

        <Route
          path="/employee/*"
          element={
            <RoleGuard allowedRoles={[ROLES.EMPLOYEE]}>
              <EmployeeLayout>
                <Routes>
                  <Route path="dashboard" element={<EmployeeDashboard />} />
                  <Route path="rides" element={<BrowseRides />} />
                  <Route path="bookings" element={<MyBookings />} />
                  <Route path="*" element={<Navigate to={ROUTES.EMPLOYEE_DASHBOARD} replace />} />
                </Routes>
              </EmployeeLayout>
            </RoleGuard>
          }
        />

        <Route path="/" element={<Navigate to={ROUTES.LOGIN} replace />} />
        <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
      </Routes>
      <Toast toasts={toasts} onRemove={removeToast} />
    </>
  );
}

export default AppContent;
