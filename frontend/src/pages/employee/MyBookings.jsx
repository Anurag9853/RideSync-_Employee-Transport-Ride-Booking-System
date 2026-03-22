import React, { useEffect, useState } from 'react';
import { apiGetMyBookings, apiCancelBooking } from '../../api/axiosInstance.js';
import { CardSkeleton } from '../../components/common/LoadingSkeleton.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import Modal from '../../components/common/Modal.jsx';
import { useToast } from '../../hooks/useToast.js';
import { useModal } from '../../hooks/useModal.js';
import { formatDateTime } from '../../utils/dateUtils.js';
import '../../styles/my-bookings.css';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const { isOpen, modalData, openModal, closeModal } = useModal();

  useEffect(() => {
    loadBookings();
  }, []);

  async function loadBookings() {
    try {
      setLoading(true);
      const data = await apiGetMyBookings();
      const list = Array.isArray(data) ? data : [];
      setBookings(list);
    } catch (err) {
      showToast('Failed to load bookings', 'error');
    } finally {
      setLoading(false);
    }
  }

  function handleCancel(booking) {
    if (booking.status === 'CANCELLED') {
      showToast('This booking is already cancelled', 'warning');
      return;
    }
    openModal({ type: 'cancel', booking });
  }

  async function confirmCancel() {
    const booking = modalData?.booking;
    if (!booking) return;

    try {
      await apiCancelBooking(booking.id);
      showToast('Booking cancelled successfully', 'success');
      closeModal();
      loadBookings();
    } catch (err) {
      showToast(err?.response?.data?.message || 'Failed to cancel booking', 'error');
    }
  }

  if (loading) {
    return (
      <div>
        <div className="page-header">
          <h1 className="page-title">My Bookings</h1>
          <p className="page-subtitle">View and manage your ride bookings</p>
        </div>
        <div className="bookings-list">
          {Array.from({ length: 3 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">My Bookings</h1>
        <p className="page-subtitle">View and manage your ride bookings</p>
      </div>

      {bookings.length === 0 ? (
        <EmptyState
          icon="📋"
          title="No Bookings"
          message="You haven't booked any rides yet. Browse available rides to get started!"
        />
      ) : (
        <div className="bookings-list">
          {bookings.map((booking) => {
            const ride = booking.ride || {};
            const isCancelled = booking.status === 'CANCELLED';
            return (
              <div key={booking.id} className={`booking-card ${isCancelled ? 'cancelled' : ''}`}>
                <div className="booking-header">
                  <div className="booking-route">
                    <div className="route-item">
                      <span className="route-label">From</span>
                      <span className="route-value">{ride.sourceLocation}</span>
                    </div>
                    <div className="route-arrow">→</div>
                    <div className="route-item">
                      <span className="route-label">To</span>
                      <span className="route-value">{ride.destinationLocation}</span>
                    </div>
                  </div>
                  <StatusBadge status={booking.status} />
                </div>
                <div className="booking-details">
                  <div className="detail-row">
                    <span className="detail-label">Ride Date:</span>
                    <span className="detail-value">{formatDateTime(ride.rideDateTime)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Booked At:</span>
                    <span className="detail-value">{formatDateTime(booking.bookingTime)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Ride Status:</span>
                    <StatusBadge status={ride.status} />
                  </div>
                </div>
                {!isCancelled && (
                  <div className="booking-actions">
                    <button
                      className="btn danger"
                      onClick={() => handleCancel(booking)}
                    >
                      Cancel Booking
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <Modal isOpen={isOpen} onClose={closeModal} title="Cancel Booking" size="small">
        {modalData?.type === 'cancel' && (
          <div className="cancel-confirm">
            <p>Are you sure you want to cancel this booking?</p>
            <div className="booking-info">
              <div>
                <strong>Route:</strong> {modalData.booking.ride.sourceLocation} →{' '}
                {modalData.booking.ride.destinationLocation}
              </div>
              <div>
                <strong>Ride Date:</strong> {formatDateTime(modalData.booking.ride.rideDateTime)}
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn subtle" onClick={closeModal}>
                Keep Booking
              </button>
              <button className="btn danger" onClick={confirmCancel}>
                Cancel Booking
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
