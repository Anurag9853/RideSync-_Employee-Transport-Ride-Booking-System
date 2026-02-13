import React, { useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';

function navLinkClass({ isActive }) {
  return isActive ? 'nav-link active' : 'nav-link';
}

export default function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useContext(AuthContext);

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand">
          RideSync
        </Link>

        <nav className="nav">
          {!isAuthenticated ? (
            <>
              <NavLink to="/login" className={navLinkClass}>
                Login
              </NavLink>
              <NavLink to="/register" className={navLinkClass}>
                Register
              </NavLink>
            </>
          ) : (
            <>
              <NavLink to="/dashboard" className={navLinkClass}>
                Dashboard
              </NavLink>
              <NavLink to="/rides" className={navLinkClass}>
                Rides
              </NavLink>
              <NavLink to="/my-bookings" className={navLinkClass}>
                My Bookings
              </NavLink>
              <button type="button" className="btn subtle" onClick={handleLogout}>
                Logout
              </button>
            </>
          )}
        </nav>

        {isAuthenticated ? (
          <div className="nav-user">
            <div className="nav-user-name">{user?.name || user?.email}</div>
            <div className="nav-user-meta">{user?.role ? String(user.role) : 'EMPLOYEE'}</div>
          </div>
        ) : null}
      </div>
    </header>
  );
}
