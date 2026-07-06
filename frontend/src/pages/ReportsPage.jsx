import React, { useState } from 'react';
import { FileText, Download, TrendingUp, Calendar, AlertCircle } from 'lucide-react';
import { useToast } from '../hooks/useToast.js';

export default function ReportsPage() {
  const { showToast } = useToast();
  const [reportType, setReportType] = useState('utilization');

  const reportLogs = [
    {
      id: 1,
      month: 'June 2026',
      rides: 184,
      occupancy: '82%',
      distance: '3,420 km',
      carbonSaved: '142 kg',
      status: 'Finalized'
    },
    {
      id: 2,
      month: 'May 2026',
      rides: 168,
      occupancy: '79%',
      distance: '3,110 km',
      carbonSaved: '128 kg',
      status: 'Finalized'
    },
    {
      id: 3,
      month: 'April 2026',
      rides: 152,
      occupancy: '75%',
      distance: '2,890 km',
      carbonSaved: '115 kg',
      status: 'Finalized'
    },
    {
      id: 4,
      month: 'March 2026',
      rides: 120,
      occupancy: '68%',
      distance: '2,240 km',
      carbonSaved: '92 kg',
      status: 'Finalized'
    }
  ];

  // Dynamically generate and download CSV
  function downloadCSV(report) {
    try {
      const csvHeaders = ['Month', 'Completed Rides', 'Occupancy Rate', 'Distance Traveled', 'Carbon Saved', 'Status'];
      const csvRows = [
        [
          report.month,
          report.rides,
          report.occupancy,
          report.distance,
          report.carbonSaved,
          report.status
        ]
      ];

      const csvContent =
        'data:text/csv;charset=utf-8,' +
        [csvHeaders.join(','), ...csvRows.map((row) => row.join(','))].join('\n');

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `RideSync_Report_${report.month.replace(' ', '_')}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showToast(`CSV report for ${report.month} downloaded successfully.`, 'success');
    } catch (err) {
      showToast('Failed to export CSV report.', 'error');
    }
  }

  function simulatePDFDownload(report) {
    showToast(`PDF generation started. Downloading RideSync_Summary_${report.month.replace(' ', '_')}.pdf…`, 'info');
    setTimeout(() => {
      showToast('PDF summary downloaded successfully.', 'success');
    }, 1500);
  }

  return (
    <div className="reports-page animate-slide-up">
      <div className="page-header">
        <div className="page-title-group">
          <h1 className="page-title">Reports & Exports</h1>
          <p className="page-subtitle">Download official corporate commute registries, carbon metrics, and logs</p>
        </div>
      </div>

      {/* Selector Tabs */}
      <div className="table-controls" style={{ marginBottom: '20px', borderRadius: 'var(--radius-lg)' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className={`btn ${reportType === 'utilization' ? 'primary' : 'secondary'}`}
            onClick={() => setReportType('utilization')}
          >
            Commute Utilization
          </button>
          <button
            className={`btn ${reportType === 'carbon' ? 'primary' : 'secondary'}`}
            onClick={() => setReportType('carbon')}
          >
            Environmental Impact
          </button>
        </div>
      </div>

      {/* Info Warning banner */}
      <div className="card" style={{ display: 'flex', gap: '12px', alignItems: 'center', backgroundColor: 'var(--color-info-bg)', borderColor: 'var(--color-info-border)', marginBottom: '24px' }}>
        <AlertCircle size={18} style={{ color: 'var(--color-info)' }} />
        <span style={{ fontSize: '0.8125rem', color: 'var(--text-main)', fontWeight: 500 }}>
          Reports are finalized on the 1st of every calendar month. Past logs remain archived indefinitely.
        </span>
      </div>

      {/* Reports Table List */}
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Reporting Cycle</th>
              <th>Trips Made</th>
              <th>Average Occupancy</th>
              {reportType === 'utilization' ? <th>Distance Traveled</th> : <th>Carbon Saved</th>}
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reportLogs.map((report) => (
              <tr key={report.id}>
                <td style={{ fontWeight: 600 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FileText size={16} className="text-muted" />
                    {report.month}
                  </div>
                </td>
                <td className="text-mono">{report.rides}</td>
                <td className="text-mono">{report.occupancy}</td>
                {reportType === 'utilization' ? (
                  <td className="text-mono">{report.distance}</td>
                ) : (
                  <td className="text-mono" style={{ color: 'var(--color-success)', fontWeight: 600 }}>
                    {report.carbonSaved}
                  </td>
                )}
                <td>
                  <span className="badge active">{report.status}</span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'end' }}>
                    <button
                      type="button"
                      className="btn secondary"
                      style={{ padding: '6px 10px', fontSize: '0.75rem' }}
                      onClick={() => downloadCSV(report)}
                    >
                      <Download size={12} style={{ marginRight: '4px' }} />
                      CSV
                    </button>
                    <button
                      type="button"
                      className="btn secondary"
                      style={{ padding: '6px 10px', fontSize: '0.75rem' }}
                      onClick={() => simulatePDFDownload(report)}
                    >
                      <FileText size={12} style={{ marginRight: '4px' }} />
                      PDF
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
