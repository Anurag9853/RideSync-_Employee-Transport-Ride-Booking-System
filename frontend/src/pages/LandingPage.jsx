import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import { ROLES, ROUTES } from '../constants/roles.js';
import {
  ArrowRight,
  ShieldCheck,
  Calendar,
  TrendingUp,
  Users,
  Car,
  Clock,
  Compass,
  FileText
} from 'lucide-react';
import '../styles/landing.css';

export default function LandingPage() {
  const { isAuthenticated, user } = useContext(AuthContext);

  const dashboardRoute = user?.role === ROLES.ADMIN ? ROUTES.ADMIN_DASHBOARD : ROUTES.EMPLOYEE_DASHBOARD;

  const features = [
    {
      icon: <Calendar />,
      title: 'Frictionless Ride Booking',
      desc: 'Book routes in seconds. Select vehicle classes, input notes, and lock in your seat instantly.'
    },
    {
      icon: <Users />,
      title: 'Automated Carpooling',
      desc: 'We optimize routes and seat allocations to ensure efficient dispatching and low wait times.'
    },
    {
      icon: <TrendingUp />,
      title: 'Advanced Carbon Metrics',
      desc: 'View commuting statistics, ride trends, and carbon footprint offsets directly on your personal dashboard.'
    },
    {
      icon: <ShieldCheck />,
      title: 'Security & Access Control',
      desc: 'Role-based access control (Admin / Employee) secure all dashboard views and endpoints via JWT.'
    },
    {
      icon: <Car />,
      title: 'Fleet & Driver Management',
      desc: 'Simulate vehicle registrations, assign drivers, rate services, and oversee maintenance logs in real-time.'
    },
    {
      icon: <FileText />,
      title: 'Dynamic Utilization Reports',
      desc: 'Generate complete monthly commute archives and export them instantly to CSV spreadsheet formats.'
    }
  ];

  return (
    <div className="landing-wrapper">
      {/* Landing Navbar */}
      <header className="landing-header">
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
          <div className="logo-icon">R</div>
          <span style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '1.05rem', letterSpacing: '-0.02em' }}>
            RideSync
          </span>
        </Link>

        <div className="landing-nav-links">
          <a href="#features" className="landing-nav-link">Features</a>
          <a href="#roles" className="landing-nav-link">Roles</a>
          <a href="#technology" className="landing-nav-link">Technology</a>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          {isAuthenticated ? (
            <Link to={dashboardRoute} className="btn primary">
              Go to Console
              <ArrowRight size={14} />
            </Link>
          ) : (
            <>
              <Link to="/login" className="btn secondary">
                Sign In
              </Link>
              <Link to="/register" className="btn primary">
                Get Started
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="landing-hero">
        <a href="#features" className="landing-announcement">
          <span className="announcement-badge">v1.2</span>
          <span>Linear-inspired Design Release</span>
          <ArrowRight size={12} />
        </a>

        <h1 className="landing-hero-title">
          Enterprise Ride Management,<br />Reimagined.
        </h1>
        <p className="landing-hero-subtitle">
          Optimize corporate commuting, manage driver logs, and calculate carbon offsets in a minimal, high-fidelity SaaS dashboard built for modern enterprises.
        </p>

        <div className="landing-hero-ctas">
          {isAuthenticated ? (
            <Link to={dashboardRoute} className="btn primary" style={{ padding: '10px 20px', fontSize: '0.875rem' }}>
              Go to Console
              <ArrowRight size={16} />
            </Link>
          ) : (
            <>
              <Link to="/register" className="btn primary" style={{ padding: '10px 20px', fontSize: '0.875rem' }}>
                Start Free Account
              </Link>
              <Link to="/login" className="btn secondary" style={{ padding: '10px 20px', fontSize: '0.875rem' }}>
                Sign In
              </Link>
            </>
          )}
        </div>

        {/* CSS Mockup Grid */}
        <div className="landing-dashboard-mockup">
          <div className="mockup-header">
            <div className="dot-btn red" />
            <div className="dot-btn yellow" />
            <div className="dot-btn green" />
          </div>
          <div className="mockup-body">
            <div className="mockup-sidebar">
              <div className="mockup-nav-item active" />
              <div className="mockup-nav-item" />
              <div className="mockup-nav-item" />
              <div className="mockup-nav-item" />
            </div>
            <div className="mockup-main">
              <div className="mockup-grid">
                <div className="mockup-card" />
                <div className="mockup-card" />
                <div className="mockup-card" />
              </div>
              <div className="mockup-chart-placeholder">
                <div className="mockup-wave" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Checklist Section */}
      <section id="features" className="landing-section" style={{ borderTop: '1px solid var(--border-color)' }}>
        <div className="section-header">
          <span className="section-tag">Product Core</span>
          <h2 className="section-title">Built for scale. Designed for speed.</h2>
          <p className="section-subtitle">Everything a modern enterprise needs to streamline corporate transport schedules.</p>
        </div>

        <div className="features-grid">
          {features.map((feat, idx) => (
            <div key={idx} className="card feature-card interactive animate-fade">
              <div className="feature-icon-wrapper">{feat.icon}</div>
              <h3 className="feature-title">{feat.title}</h3>
              <p className="feature-desc">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Role Segmentation comparisons */}
      <section id="roles" className="landing-section" style={{ borderTop: '1px solid var(--border-color)' }}>
        <div className="section-header">
          <span className="section-tag">User Access</span>
          <h2 className="section-title">One platform. Two workflows.</h2>
          <p className="section-subtitle">Tailored console views depending on authorization permissions.</p>
        </div>

        <div className="grid-cols-2">
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <div className="avatar" style={{ backgroundColor: 'var(--primary-glow)', color: 'var(--primary)' }}>EE</div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Employee Portal</h3>
            </div>
            <ul style={{ paddingLeft: '20px', fontSize: '0.875rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>Browse matching shuttle runs and book seats on demand.</li>
              <li>View your upcoming transit timings and driver coordinates.</li>
              <li>Monitor personal carbon offsets accumulated by sharing rides.</li>
              <li>Manage locations settings (Home/Office presets).</li>
            </ul>
          </div>

          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <div className="avatar" style={{ backgroundColor: 'var(--primary-glow)', color: 'var(--primary)' }}>AD</div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Admin Console</h3>
            </div>
            <ul style={{ paddingLeft: '20px', fontSize: '0.875rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>Create, edit, and cancel ride routes via REST APIs.</li>
              <li>Oversee bookings, delete records, and handle employee logs.</li>
              <li>Manage dynamic mock directories for drivers and vehicles.</li>
              <li>Analyze overall occupancy rates, distance, and mileage reports.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Technology Stack details */}
      <section id="technology" className="landing-section" style={{ borderTop: '1px solid var(--border-color)', textAlign: 'center' }}>
        <div className="section-header">
          <span className="section-tag">Specifications</span>
          <h2 className="section-title">Production-grade Full Stack Architecture</h2>
          <p className="section-subtitle">Engineered using modern standards and transactional safety rules.</p>
        </div>

        <div className="grid-cols-3" style={{ marginTop: '20px' }}>
          <div className="card">
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '8px' }}>Spring Boot 3.2</h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Secure RESTful APIs, Spring Security JWT authentication, and global exception boundaries.</p>
          </div>
          <div className="card">
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '8px' }}>React + Vite</h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Minimal SPA shell, role-based navigation layout routing, and custom reactive SVG charts.</p>
          </div>
          <div className="card">
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '8px' }}>PostgreSQL / H2</h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Pessimistic database locking to enforce seat reservation bounds and prevent double-booking.</p>
          </div>
        </div>
      </section>

      {/* Call to Action card */}
      <section className="landing-cta-section" style={{ borderTop: '1px solid var(--border-color)' }}>
        <div className="cta-card">
          <h2 className="cta-title">Upgrade your corporate transit experience today.</h2>
          <p style={{ fontSize: '0.9375rem', color: 'var(--text-muted)', maxWidth: '500px' }}>
            Register your corporate account in seconds and manage bookings under a premium console dashboard.
          </p>
          <Link to="/register" className="btn primary" style={{ padding: '12px 24px', fontSize: '0.875rem' }}>
            Create Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <p>© 2026 RideSync Inc. All rights reserved. Built for Placement Portfolio showcase.</p>
      </footer>
    </div>
  );
}
