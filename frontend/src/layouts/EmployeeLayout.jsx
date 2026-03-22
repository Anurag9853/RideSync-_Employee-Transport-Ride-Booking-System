import React, { useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import { ROUTES } from '../constants/roles.js';
import '../styles/layout.css';

function navLinkClass({ isActive }) {
  return isActive ? 'nav-link active' : 'nav-link';
}

export default function EmployeeLayout({ children }) {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  function handleLogout() {
    logout();
    navigate(ROUTES.LOGIN, { replace: true });
  }

  return (
    <div className="layout employee-layout">
      <header className="layout-header">
        <div className="layout-header-inner">
          <Link to={ROUTES.EMPLOYEE_DASHBOARD} className="brand">
            RideSync
          </Link>

          <nav className="layout-nav">
            <NavLink to={ROUTES.EMPLOYEE_DASHBOARD} className={navLinkClass}>
              Dashboard
            </NavLink>
            <NavLink to={ROUTES.EMPLOYEE_RIDES} className={navLinkClass}>
              Browse Rides
            </NavLink>
            <NavLink to={ROUTES.EMPLOYEE_BOOKINGS} className={navLinkClass}>
              My Bookings
            </NavLink>
          </nav>

          <div className="layout-user">
            <div className="user-info">
              <div className="user-name">{user?.name || user?.email}</div>
              <div className="user-role">Employee</div>
            </div>
            <button type="button" className="btn subtle" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="layout-main">{children}</main>
    </div>
  );
}
