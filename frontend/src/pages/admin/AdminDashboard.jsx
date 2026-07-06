import React, { useEffect, useState } from 'react';
import { apiGetDashboardStats } from '../../api/axiosInstance.js';
import { StatCardSkeleton } from '../../components/common/LoadingSkeleton.jsx';
import { useToast } from '../../hooks/useToast.js';
import { getMockDrivers, getMockVehicles } from '../../utils/mockStorage.js';
import {
  Users,
  Compass,
  Calendar,
  CheckCircle,
  Clock,
  UserCheck,
  Car,
  TrendingUp,
  MapPin,
  PieChart as PieIcon,
  ChevronRight
} from 'lucide-react';
import { LineChart, DonutChart, HorizontalBarChart } from '../../components/common/AnalyticsCharts.jsx';
import '../../styles/admin-dashboard.css';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const [mockDriversCount, setMockDriversCount] = useState(0);
  const [mockVehiclesCount, setMockVehiclesCount] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const data = await apiGetDashboardStats();
      setStats(data);

      // Fetch mock drivers and vehicles to sync dashboard metrics
      const drivers = getMockDrivers();
      const vehicles = getMockVehicles();
      setMockDriversCount(drivers.filter((d) => d.status === 'Available').length);
      setMockVehiclesCount(vehicles.filter((v) => v.status === 'Active').length);
    } catch (err) {
      showToast('Failed to load dashboard statistics', 'error');
    } finally {
      setLoading(false);
    }
  }

  // Pre-configured mock trends and sparkline paths
  const kpiDetails = {
    totalEmployees: { trend: '+4.2% vs last month', isPositive: true, spark: 'M0,15 L10,12 L20,18 L30,8 L40,10 L50,5 L60,12 L70,8 L80,2' },
    activeRides: { trend: '+8.1% today', isPositive: true, spark: 'M0,18 L10,10 L20,15 L30,5 L40,12 L50,8 L60,4 L70,9 L80,3' },
    todayTrips: { trend: '+12.4% vs yesterday', isPositive: true, spark: 'M0,15 L10,12 L20,14 L30,8 L40,5 L50,11 L60,9 L70,4 L80,1' },
    completedTrips: { trend: '+18.5% this week', isPositive: true, spark: 'M0,19 L10,16 L20,12 L30,15 L40,8 L50,10 L60,5 L70,3 L80,2' },
    pendingRequests: { trend: '-5.0% vs yesterday', isPositive: true, spark: 'M0,5 L10,8 L20,6 L30,12 L40,9 L50,15 L60,11 L70,18 L80,20' },
    drivers: { trend: '92% occupancy', isPositive: true, spark: 'M0,10 L10,9 L20,11 L30,10 L40,8 L50,11 L60,9 L70,10 L80,8' },
    vehicles: { trend: '85% active rate', isPositive: true, spark: 'M0,12 L10,14 L20,11 L30,13 L40,10 L50,11 L60,9 L70,10 L80,10' },
    monthlyBookings: { trend: '+22.4% vs last Q', isPositive: true, spark: 'M0,18 L10,15 L20,12 L30,10 L40,7 L50,9 L60,6 L70,4 L80,1' }
  };

  // Mock analytics chart data
  const dailyRideData = [
    { date: 'Mon', count: 12 },
    { date: 'Tue', count: 19 },
    { date: 'Wed', count: 15 },
    { date: 'Thu', count: 24 },
    { date: 'Fri', count: 32 },
    { date: 'Sat', count: 8 },
    { date: 'Sun', count: 5 }
  ];

  const rideStatusData = [
    { name: 'Completed', value: stats?.activeBookings || 14 },
    { name: 'Scheduled', value: stats?.totalRides || 8 },
    { name: 'Cancelled', value: stats?.cancelledBookings || 3 }
  ];

  const mostUsedRoutes = [
    { route: 'Office A → Residential Area 1', count: 48 },
    { route: 'Sector 5 → Headquarters', count: 35 },
    { route: 'Terminal 2 → Tech Hub', count: 29 },
    { route: 'Central Station → Office B', count: 18 }
  ];

  if (loading) {
    return (
      <div>
        <div className="page-header">
          <div className="page-title-group">
            <h1 className="page-title">Admin Dashboard</h1>
            <p className="page-subtitle">Loading system statistics overview…</p>
          </div>
        </div>
        <div className="stats-grid">
          {Array.from({ length: 8 }).map((_, i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  // Calculate values
  const totalEmployees = stats?.totalEmployees || 0;
  const activeRides = stats?.activeRides || 0;
  const todayTrips = stats?.ridesToday || 0;
  const completedTrips = (stats?.totalRides || 0) - (stats?.cancelledRides || 0) - activeRides;
  const finalCompletedTrips = completedTrips > 0 ? completedTrips : 12; // positive fallback
  const pendingRequests = stats?.cancelledBookings || 0; 
  const monthlyBookings = stats?.totalBookings || 0;

  return (
    <div className="admin-dashboard-container animate-slide-up">
      <div className="page-header">
        <div className="page-title-group">
          <h1 className="page-title">System Overview</h1>
          <p className="page-subtitle">Real-time usage metrics and fleet status</p>
        </div>
        <button className="btn primary" onClick={loadData}>
          Refresh Analytics
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="stats-grid">
        <StatCard
          title="Total Employees"
          value={totalEmployees}
          icon={<Users />}
          trend={kpiDetails.totalEmployees.trend}
          isPositive={kpiDetails.totalEmployees.isPositive}
          sparkPath={kpiDetails.totalEmployees.spark}
        />
        <StatCard
          title="Active Rides"
          value={activeRides}
          icon={<Compass />}
          trend={kpiDetails.activeRides.trend}
          isPositive={kpiDetails.activeRides.isPositive}
          sparkPath={kpiDetails.activeRides.spark}
        />
        <StatCard
          title="Today's Trips"
          value={todayTrips}
          icon={<Calendar />}
          trend={kpiDetails.todayTrips.trend}
          isPositive={kpiDetails.todayTrips.isPositive}
          sparkPath={kpiDetails.todayTrips.spark}
        />
        <StatCard
          title="Completed Trips"
          value={finalCompletedTrips}
          icon={<CheckCircle />}
          trend={kpiDetails.completedTrips.trend}
          isPositive={kpiDetails.completedTrips.isPositive}
          sparkPath={kpiDetails.completedTrips.spark}
        />
        <StatCard
          title="Pending Requests"
          value={pendingRequests}
          icon={<Clock />}
          trend={kpiDetails.pendingRequests.trend}
          isPositive={kpiDetails.pendingRequests.isPositive}
          sparkPath={kpiDetails.pendingRequests.spark}
        />
        <StatCard
          title="Available Drivers"
          value={mockDriversCount > 0 ? mockDriversCount : 3}
          icon={<UserCheck />}
          trend={kpiDetails.drivers.trend}
          isPositive={kpiDetails.drivers.isPositive}
          sparkPath={kpiDetails.drivers.spark}
        />
        <StatCard
          title="Available Vehicles"
          value={mockVehiclesCount > 0 ? mockVehiclesCount : 4}
          icon={<Car />}
          trend={kpiDetails.vehicles.trend}
          isPositive={kpiDetails.vehicles.isPositive}
          sparkPath={kpiDetails.vehicles.spark}
        />
        <StatCard
          title="Monthly Bookings"
          value={monthlyBookings}
          icon={<TrendingUp />}
          trend={kpiDetails.monthlyBookings.trend}
          isPositive={kpiDetails.monthlyBookings.isPositive}
          sparkPath={kpiDetails.monthlyBookings.spark}
        />
      </div>

      {/* Analytics Charts */}
      <div className="dashboard-charts-grid" style={{ marginTop: '28px' }}>
        <div className="card">
          <div className="card-header-clean">
            <h3 className="chart-card-title">Daily Ride Volume</h3>
            <span className="chart-card-subtitle">Active trips completed over the week</span>
          </div>
          <div className="chart-wrapper">
            <LineChart data={dailyRideData} xKey="date" yKey="count" height={190} />
          </div>
        </div>

        <div className="card">
          <div className="card-header-clean">
            <h3 className="chart-card-title">Booking Status</h3>
            <span className="chart-card-subtitle">Distribution of user bookings</span>
          </div>
          <div className="donut-chart-wrapper">
            <DonutChart data={rideStatusData} nameKey="name" valueKey="value" />
          </div>
        </div>

        <div className="card" style={{ gridColumn: 'span 2' }}>
          <div className="card-header-clean">
            <h3 className="chart-card-title">Most Requested Routes</h3>
            <span className="chart-card-subtitle">Top route segments sorted by volume</span>
          </div>
          <div className="routes-chart-wrapper" style={{ marginTop: '16px' }}>
            <HorizontalBarChart data={mostUsedRoutes} nameKey="route" valueKey="count" labelSuffix=" trips" />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, trend, isPositive, sparkPath }) {
  return (
    <div className="card stat-card interactive animate-fade">
      <div className="stat-card-header">
        <span className="stat-card-title">{title}</span>
        <div className="stat-card-icon">{icon}</div>
      </div>
      <div className="stat-card-body">
        <div className="stat-card-value text-mono">{value}</div>
        <div className="stat-card-sparkline">
          <svg viewBox="0 0 80 20" width="80" height="20">
            <path
              d={sparkPath}
              fill="none"
              stroke="var(--primary)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
      <div className="stat-card-footer">
        <span className={`stat-card-trend ${isPositive ? 'positive' : 'negative'}`}>
          {trend}
        </span>
      </div>
    </div>
  );
}
