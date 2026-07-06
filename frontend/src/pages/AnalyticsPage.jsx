import React, { useState } from 'react';
import { LineChart, BarChart, DonutChart, HorizontalBarChart } from '../components/common/AnalyticsCharts.jsx';
import { Calendar, BarChart3, Clock, Compass, Activity } from 'lucide-react';

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('7d');

  // Datasets
  const dailyRideData = [
    { label: 'Mon', count: 14 },
    { label: 'Tue', count: 22 },
    { label: 'Wed', count: 18 },
    { label: 'Thu', count: 29 },
    { label: 'Fri', count: 35 },
    { label: 'Sat', count: 10 },
    { label: 'Sun', count: 8 }
  ];

  const peakHoursData = [
    { hour: '08:00', count: 45 },
    { hour: '09:00', count: 62 },
    { hour: '10:00', count: 28 },
    { hour: '13:00', count: 15 },
    { hour: '17:00', count: 58 },
    { hour: '18:00', count: 74 },
    { hour: '19:00', count: 32 }
  ];

  const statusDistribution = [
    { name: 'Completed', value: 85 },
    { name: 'Scheduled', value: 24 },
    { name: 'Cancelled', value: 8 }
  ];

  const routesData = [
    { route: 'Office A → Residential Area 1', count: 142 },
    { route: 'Sector 5 → Headquarters', count: 98 },
    { route: 'Terminal 2 → Tech Hub', count: 74 },
    { route: 'Central Station → Office B', count: 52 },
    { route: 'Suburbs → Main Office', count: 38 }
  ];

  return (
    <div className="analytics-page animate-slide-up">
      <div className="page-header">
        <div className="page-title-group">
          <h1 className="page-title">Analytics</h1>
          <p className="page-subtitle">Historical booking reports, route efficiencies, and peak transit hours</p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className={`btn ${timeRange === '7d' ? 'primary' : 'secondary'}`}
            onClick={() => setTimeRange('7d')}
          >
            Last 7 Days
          </button>
          <button
            className={`btn ${timeRange === '30d' ? 'primary' : 'secondary'}`}
            onClick={() => setTimeRange('30d')}
          >
            Last 30 Days
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="stats-grid" style={{ marginBottom: '28px' }}>
        <div className="card stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Average Commute Duration</span>
            <div className="stat-card-icon"><Clock /></div>
          </div>
          <div className="stat-card-body">
            <div className="stat-card-value text-mono">34 min</div>
          </div>
          <div className="stat-card-footer">
            <span className="stat-card-trend positive">Optimized by 4 min this month</span>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Seat Occupancy Rate</span>
            <div className="stat-card-icon"><Activity /></div>
          </div>
          <div className="stat-card-body">
            <div className="stat-card-value text-mono">78.5%</div>
          </div>
          <div className="stat-card-footer">
            <span className="stat-card-trend positive">+3.2% vs last quarter</span>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Active Routes Count</span>
            <div className="stat-card-icon"><Compass /></div>
          </div>
          <div className="stat-card-body">
            <div className="stat-card-value text-mono">14 Routes</div>
          </div>
          <div className="stat-card-footer">
            <span className="stat-card-trend text-muted">Serving all locations</span>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Peak Ride Demand</span>
            <div className="stat-card-icon"><BarChart3 /></div>
          </div>
          <div className="stat-card-body">
            <div className="stat-card-value text-mono">06:00 PM</div>
          </div>
          <div className="stat-card-footer">
            <span className="stat-card-trend text-muted">After office hours</span>
          </div>
        </div>
      </div>

      {/* Charts Layout */}
      <div className="dashboard-charts-grid">
        <div className="card">
          <div className="card-header-clean">
            <h3 className="chart-card-title">Daily Commute Count</h3>
            <span className="chart-card-subtitle">Trips booked daily over the current schedule interval</span>
          </div>
          <div className="chart-wrapper">
            <LineChart data={dailyRideData} xKey="label" yKey="count" height={190} />
          </div>
        </div>

        <div className="card">
          <div className="card-header-clean">
            <h3 className="chart-card-title">Ride Allocation Status</h3>
            <span className="chart-card-subtitle">Ratio of completed, pending, or cancelled bookings</span>
          </div>
          <div className="donut-chart-wrapper">
            <DonutChart data={statusDistribution} nameKey="name" valueKey="value" />
          </div>
        </div>

        <div className="card">
          <div className="card-header-clean">
            <h3 className="chart-card-title">Peak Booking Demand Hours</h3>
            <span className="chart-card-subtitle">Trips requested per hour interval (corporate timezone)</span>
          </div>
          <div className="chart-wrapper">
            <BarChart data={peakHoursData} xKey="hour" yKey="count" height={190} />
          </div>
        </div>

        <div className="card">
          <div className="card-header-clean">
            <h3 className="chart-card-title">Route Popularity Ranking</h3>
            <span className="chart-card-subtitle">Volume of monthly rides taken per sector line</span>
          </div>
          <div className="routes-chart-wrapper" style={{ marginTop: '16px' }}>
            <HorizontalBarChart data={routesData} nameKey="route" valueKey="count" labelSuffix=" rides" />
          </div>
        </div>
      </div>
    </div>
  );
}
