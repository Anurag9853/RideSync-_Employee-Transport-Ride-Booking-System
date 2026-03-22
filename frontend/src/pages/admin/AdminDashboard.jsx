import React, { useEffect, useState } from 'react';
import { apiGetDashboardStats } from '../../api/axiosInstance.js';
import { StatCardSkeleton } from '../../components/common/LoadingSkeleton.jsx';
import { useToast } from '../../hooks/useToast.js';
import '../../styles/admin-dashboard.css';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    try {
      setLoading(true);
      const data = await apiGetDashboardStats();
      setStats(data);
    } catch (err) {
      showToast('Failed to load dashboard statistics', 'error');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div>
        <div className="page-header">
          <h1 className="page-title">Admin Dashboard</h1>
          <p className="page-subtitle">Overview of RideSync system statistics</p>
        </div>
        <div className="stats-grid">
          {Array.from({ length: 9 }).map((_, i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Admin Dashboard</h1>
        <p className="page-subtitle">Overview of RideSync system statistics</p>
      </div>

      <div className="stats-grid">
        <StatCard title="Total Rides" value={stats?.totalRides || 0} icon="🚌" />
        <StatCard title="Active Rides" value={stats?.activeRides || 0} icon="✅" color="green" />
        <StatCard title="Cancelled Rides" value={stats?.cancelledRides || 0} icon="❌" color="red" />
        <StatCard title="Total Bookings" value={stats?.totalBookings || 0} icon="📋" />
        <StatCard title="Active Bookings" value={stats?.activeBookings || 0} icon="✓" color="green" />
        <StatCard title="Cancelled Bookings" value={stats?.cancelledBookings || 0} icon="✗" color="red" />
        <StatCard title="Total Users" value={stats?.totalUsers || 0} icon="👥" />
        <StatCard title="Employees" value={stats?.totalEmployees || 0} icon="👤" />
        <StatCard title="Admins" value={stats?.totalAdmins || 0} icon="👑" />
        <StatCard title="Rides Today" value={stats?.ridesToday || 0} icon="📅" />
        <StatCard title="Bookings Today" value={stats?.bookingsToday || 0} icon="📊" />
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  return (
    <div className={`stat-card ${color ? `stat-${color}` : ''}`}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-content">
        <div className="stat-value">{value}</div>
        <div className="stat-label">{title}</div>
      </div>
    </div>
  );
}
