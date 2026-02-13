import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext.jsx';
import { ROUTES } from '../../constants/roles.js';
import '../../styles/employee-dashboard.css';

export default function EmployeeDashboard() {
  const { user } = useContext(AuthContext);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Welcome{user?.name ? `, ${user.name}` : ''}!</h1>
        <p className="page-subtitle">Manage your ride bookings and find available rides</p>
      </div>

      <div className="dashboard-cards">
        <Link to={ROUTES.EMPLOYEE_RIDES} className="dashboard-card">
          <div className="card-icon">🚌</div>
          <div className="card-content">
            <h3 className="card-title">Browse Rides</h3>
            <p className="card-description">Search and book available rides</p>
          </div>
          <div className="card-arrow">→</div>
        </Link>

        <Link to={ROUTES.EMPLOYEE_BOOKINGS} className="dashboard-card">
          <div className="card-icon">📋</div>
          <div className="card-content">
            <h3 className="card-title">My Bookings</h3>
            <p className="card-description">View and manage your bookings</p>
          </div>
          <div className="card-arrow">→</div>
        </Link>
      </div>
    </div>
  );
}
