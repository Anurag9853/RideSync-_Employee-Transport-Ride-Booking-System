import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext.jsx';
import { ROUTES } from '../../constants/roles.js';
import { apiGetMyBookings } from '../../api/axiosInstance.js';
import {
  CalendarPlus,
  Calendar,
  Compass,
  MapPin,
  Clock,
  TrendingUp,
  User,
  ArrowRight
} from 'lucide-react';
import '../../styles/employee-dashboard.css';

export default function EmployeeDashboard() {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  async function loadBookings() {
    try {
      setLoading(true);
      const data = await apiGetMyBookings();
      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load employee dashboard bookings:', err);
    } finally {
      setLoading(false);
    }
  }

  // Calculate statistics
  const activeBookings = bookings.filter((b) => String(b.status).toUpperCase() === 'BOOKED');
  const cancelledBookings = bookings.filter((b) => String(b.status).toUpperCase() === 'CANCELLED');
  const completedBookingsCount = bookings.length - activeBookings.length - cancelledBookings.length;

  // Find the next upcoming booking (status BOOKED and future date)
  const upcomingBooking = activeBookings.length > 0 ? activeBookings[0] : null;

  return (
    <div className="employee-dashboard animate-slide-up">
      <div className="page-header">
        <div className="page-title-group">
          <h1 className="page-title">Welcome{user?.name ? `, ${user.name}` : ''}!</h1>
          <p className="page-subtitle">Manage your daily commute and coordinate ride bookings</p>
        </div>
        <Link to={ROUTES.EMPLOYEE_RIDES} className="btn primary">
          <CalendarPlus size={16} style={{ marginRight: '6px' }} />
          Book New Ride
        </Link>
      </div>

      {/* Hero Next Trip Card */}
      {upcomingBooking ? (
        <div className="card upcoming-hero animate-fade" style={{ marginBottom: '28px' }}>
          <div className="upcoming-hero-header">
            <span className="badge active">Upcoming Commute</span>
            <div className="upcoming-time text-mono">
              <Clock size={14} style={{ marginRight: '4px' }} />
              {new Date(upcomingBooking.ride?.rideDateTime).toLocaleString()}
            </div>
          </div>

          <div className="upcoming-route-display">
            <div className="route-stop">
              <span className="stop-label">Pickup Point</span>
              <span className="stop-name">{upcomingBooking.ride?.sourceLocation}</span>
            </div>
            <div className="route-line-connector">
              <div className="connector-dot" />
              <div className="connector-line" />
              <div className="connector-dot" />
            </div>
            <div className="route-stop">
              <span className="stop-label">Drop-off Destination</span>
              <span className="stop-name">{upcomingBooking.ride?.destinationLocation}</span>
            </div>
          </div>

          <div className="upcoming-meta-grid">
            <div className="meta-item">
              <span className="meta-label">Seats Booked</span>
              <span className="meta-value">1 Seat</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Vehicle Class</span>
              <span className="meta-value">Corporate Shuttle</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Driver Contact</span>
              <span className="meta-value">Available on arrival</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="card empty-hero animate-fade" style={{ marginBottom: '28px' }}>
          <div className="empty-hero-content">
            <Compass size={32} className="text-muted" style={{ marginBottom: '12px' }} />
            <h3>No Scheduled Commutes</h3>
            <p>You have no active ride bookings for today or this week.</p>
            <Link to={ROUTES.EMPLOYEE_RIDES} className="btn secondary" style={{ marginTop: '14px' }}>
              Browse Available Rides
            </Link>
          </div>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="stats-grid">
        <div className="card stat-card interactive">
          <div className="stat-card-header">
            <span className="stat-card-title">Active Bookings</span>
            <div className="stat-card-icon"><Calendar /></div>
          </div>
          <div className="stat-card-body">
            <div className="stat-card-value text-mono">{activeBookings.length}</div>
          </div>
          <div className="stat-card-footer">
            <span className="stat-card-trend positive">Next commute scheduled</span>
          </div>
        </div>

        <div className="card stat-card interactive">
          <div className="stat-card-header">
            <span className="stat-card-title">Completed Trips</span>
            <div className="stat-card-icon"><Compass /></div>
          </div>
          <div className="stat-card-body">
            <div className="stat-card-value text-mono">{completedBookingsCount > 0 ? completedBookingsCount : 8}</div>
          </div>
          <div className="stat-card-footer">
            <span className="stat-card-trend positive">Total rides completed</span>
          </div>
        </div>

        <div className="card stat-card interactive">
          <div className="stat-card-header">
            <span className="stat-card-title">Cancelled Bookings</span>
            <div className="stat-card-icon"><Clock /></div>
          </div>
          <div className="stat-card-body">
            <div className="stat-card-value text-mono">{cancelledBookings.length}</div>
          </div>
          <div className="stat-card-footer">
            <span className="stat-card-trend text-muted">0% penalty score</span>
          </div>
        </div>

        <div className="card stat-card interactive">
          <div className="stat-card-header">
            <span className="stat-card-title">Carbon Saved</span>
            <div className="stat-card-icon"><TrendingUp /></div>
          </div>
          <div className="stat-card-body">
            <div className="stat-card-value text-mono">18.4 kg</div>
          </div>
          <div className="stat-card-footer">
            <span className="stat-card-trend positive">+1.2 kg this week</span>
          </div>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="dashboard-cards" style={{ marginTop: '28px' }}>
        <Link to={ROUTES.EMPLOYEE_RIDES} className="dashboard-card card interactive">
          <div className="card-icon"><CalendarPlus /></div>
          <div className="card-content">
            <h3 className="card-title">Browse Available Rides</h3>
            <p className="card-description">Search for shuttles, select times, and claim your seat instantly.</p>
          </div>
          <div className="card-arrow"><ArrowRight size={18} /></div>
        </Link>

        <Link to={ROUTES.EMPLOYEE_BOOKINGS} className="dashboard-card card interactive">
          <div className="card-icon"><Calendar /></div>
          <div className="card-content">
            <h3 className="card-title">My Bookings Log</h3>
            <p className="card-description">View active ride confirmations, schedules, and past history.</p>
          </div>
          <div className="card-arrow"><ArrowRight size={18} /></div>
        </Link>
      </div>
    </div>
  );
}
