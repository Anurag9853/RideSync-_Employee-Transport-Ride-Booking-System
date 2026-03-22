import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import '../styles/dashboard.css';

export default function Dashboard() {
  const { user } = useContext(AuthContext);

  return (
    <div className="dashboard">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">
          Welcome{user?.name ? `, ${user.name}` : ''}. Manage your ride bookings here.
        </p>
      </div>

      <div className="grid">
        <Link to="/rides" className="card nav-card">
          <div className="nav-card-title">View Rides</div>
          <div className="nav-card-desc">Browse available rides and book a seat.</div>
        </Link>

        <Link to="/my-bookings" className="card nav-card">
          <div className="nav-card-title">My Bookings</div>
          <div className="nav-card-desc">See your booked rides and booking status.</div>
        </Link>
      </div>
    </div>
  );
}
