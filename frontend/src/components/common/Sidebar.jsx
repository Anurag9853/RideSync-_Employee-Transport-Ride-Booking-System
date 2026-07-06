import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarPlus,
  Calendar,
  Users,
  UserCheck,
  Car,
  ClipboardList,
  BarChart3,
  Bell,
  FileText,
  Settings,
  LogOut
} from 'lucide-react';
import { ROLES } from '../../constants/roles.js';

export default function Sidebar({ role, isOpen, onClose, onLogout }) {
  const isAdmin = role === ROLES.ADMIN;
  const basePath = isAdmin ? '/admin' : '/employee';

  const menuItems = [
    {
      title: 'General',
      items: [
        {
          name: 'Dashboard',
          path: `${basePath}/dashboard`,
          icon: LayoutDashboard
        },
        {
          name: 'Book Ride',
          path: `${basePath}/book-ride`,
          icon: CalendarPlus
        },
        {
          name: 'My Trips',
          path: `${basePath}/my-trips`,
          icon: Calendar
        }
      ]
    },
    {
      title: 'Management',
      items: [
        {
          name: 'Employees',
          path: `${basePath}/employees`,
          icon: Users
        },
        {
          name: 'Drivers',
          path: `${basePath}/drivers`,
          icon: UserCheck
        },
        {
          name: 'Vehicles',
          path: `${basePath}/vehicles`,
          icon: Car
        },
        {
          name: 'Ride Requests',
          path: `${basePath}/ride-requests`,
          icon: ClipboardList
        }
      ]
    },
    {
      title: 'Tools & Info',
      items: [
        {
          name: 'Analytics',
          path: `${basePath}/analytics`,
          icon: BarChart3
        },
        {
          name: 'Notifications',
          path: `${basePath}/notifications`,
          icon: Bell
        },
        {
          name: 'Reports',
          path: `${basePath}/reports`,
          icon: FileText
        },
        {
          name: 'Settings',
          path: `${basePath}/settings`,
          icon: Settings
        }
      ]
    }
  ];

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <NavLink to={`${basePath}/dashboard`} className="sidebar-logo" onClick={onClose}>
          <div className="logo-icon">R</div>
          <span className="sidebar-brand-text">RideSync</span>
        </NavLink>

        <nav className="sidebar-nav">
          {menuItems.map((section, idx) => (
            <div key={idx} className="sidebar-section">
              <div className="sidebar-section-title">{section.title}</div>
              {section.items.map((item, itemIdx) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={itemIdx}
                    to={item.path}
                    className={({ isActive }) =>
                      isActive ? 'sidebar-link active' : 'sidebar-link'
                    }
                    onClick={onClose}
                  >
                    <Icon />
                    <span>{item.name}</span>
                  </NavLink>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button
            type="button"
            className="btn subtle logout-btn"
            onClick={onLogout}
          >
            <LogOut size={16} style={{ marginRight: '8px' }} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
