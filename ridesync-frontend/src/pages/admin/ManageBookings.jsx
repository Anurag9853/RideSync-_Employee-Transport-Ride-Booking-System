import React, { useEffect, useState } from 'react';
import { apiGetAllBookings, apiCancelBookingByAdmin } from '../../api/axiosInstance.js';
import { TableSkeleton } from '../../components/common/LoadingSkeleton.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import Pagination from '../../components/common/Pagination.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import { useToast } from '../../hooks/useToast.js';
import { formatDateTime } from '../../utils/dateUtils.js';
import '../../styles/manage-table.css';

export default function ManageBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [size] = useState(10);
  const { showToast } = useToast();

  useEffect(() => {
    loadBookings();
  }, [page]);

  async function loadBookings() {
    try {
      setLoading(true);
      const data = await apiGetAllBookings({ page, size });
      setBookings(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch (err) {
      showToast('Failed to load bookings', 'error');
    } finally {
      setLoading(false);
    }
  }

  async function handleCancel(id) {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }
    try {
      await apiCancelBookingByAdmin(id);
      showToast('Booking cancelled successfully', 'success');
      loadBookings();
    } catch (err) {
      showToast(err?.response?.data?.message || 'Failed to cancel booking', 'error');
    }
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Manage Bookings</h1>
        <p className="page-subtitle">View and manage all ride bookings</p>
      </div>

      {loading ? (
        <TableSkeleton rows={5} cols={8} />
      ) : bookings.length === 0 ? (
        <EmptyState icon="📋" title="No Bookings" message="No bookings found in the system" />
      ) : (
        <>
          <div className="manage-table">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>User</th>
                  <th>Email</th>
                  <th>Ride</th>
                  <th>Ride Date</th>
                  <th>Booked At</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id}>
                    <td>{booking.id}</td>
                    <td>{booking.userName}</td>
                    <td>{booking.userEmail}</td>
                    <td>
                      {booking.rideSource} → {booking.rideDestination}
                    </td>
                    <td>{formatDateTime(booking.rideDateTime)}</td>
                    <td>{formatDateTime(booking.bookingTime)}</td>
                    <td>
                      <StatusBadge status={booking.status} />
                    </td>
                    <td>
                      {booking.status === 'BOOKED' && (
                        <button
                          className="btn-link danger"
                          onClick={() => handleCancel(booking.id)}
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} loading={loading} />
        </>
      )}
    </div>
  );
}
