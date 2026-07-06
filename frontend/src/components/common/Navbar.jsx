import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Menu, Search, Bell, Mail, Sun, Moon } from 'lucide-react';

export default function Navbar({ user, onMenuToggle }) {
  const location = useLocation();
  const [theme, setTheme] = useState(() => localStorage.getItem('ridesync_theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('ridesync_theme', theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }

  // Generate breadcrumbs from pathname
  const pathnames = location.pathname.split('/').filter((x) => x);
  const breadcrumbItems = pathnames.map((value, index) => {
    const to = `/${pathnames.slice(0, index + 1).join('/')}`;
    const isLast = index === pathnames.length - 1;
    const formattedValue = value
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());

    return isLast ? (
      <span key={to} className="breadcrumb-active">
        {formattedValue}
      </span>
    ) : (
      <React.Fragment key={to}>
        <Link to={to} style={{ textDecoration: 'none', color: 'inherit' }}>
          {formattedValue}
        </Link>
        <span className="breadcrumb-separator">/</span>
      </React.Fragment>
    );
  });

  const userInitials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : user?.email
    ? user.email.slice(0, 2).toUpperCase()
    : 'US';

  return (
    <header className="top-navbar">
      <div className="navbar-left">
        <button
          type="button"
          className="menu-toggle-btn"
          onClick={onMenuToggle}
          aria-label="Toggle Navigation Sidebar"
        >
          <Menu size={20} />
        </button>

        <div className="breadcrumb">
          <span className="breadcrumb-root">RideSync</span>
          {breadcrumbItems.length > 0 && <span className="breadcrumb-separator">/</span>}
          {breadcrumbItems}
        </div>
      </div>

      <div className="navbar-right">
        <div className="search-container">
          <Search className="search-icon" />
          <input
            type="text"
            className="input search-input"
            placeholder="Search console..."
          />
        </div>

        <div className="divider" />

        <button
          type="button"
          className="icon-btn"
          onClick={toggleTheme}
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        <Link to={location.pathname.includes('/admin') ? '/admin/notifications' : '/employee/notifications'} className="icon-btn">
          <Bell size={18} />
        </Link>

        <div className="divider" />

        <Link
          to={location.pathname.includes('/admin') ? '/admin/settings' : '/employee/settings'}
          className="user-profile-button"
        >
          <div className="avatar">{userInitials}</div>
          <div className="user-meta-details">
            <span className="user-meta-name">{user?.name || 'User'}</span>
            <span className="user-meta-role">
              {user?.role ? String(user.role).toUpperCase() : 'EMPLOYEE'}
            </span>
          </div>
        </Link>
      </div>
    </header>
  );
}
