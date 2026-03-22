import React, { useEffect, useState } from 'react';
import { apiGetMyBookings } from '../api/axiosInstance.js';
import '../styles/dashboard.css';

function formatDateTime(value) {
  try {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);
    return date.toLocaleString();
  } catch {
    return String(value);
  }
}

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadBookings() {
    setLoading(true);
    setError('');

    try {
      const data = await apiGetMyBookings();
      const list = Array.isArray(data) ? data : [];
      setBookings(list);
    } catch (err) {
      const msg =
        err?.response?.data?.message || err?.message || 'Failed to load bookings. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBookings();
  }, []);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">My Bookings</h1>
        <p className="page-subtitle">View your ride bookings and their status.</p>
      </div>

      {error ? <div className="alert error">{error}</div> : null}

      {loading ? (
        <div className="muted">Loading bookings…</div>
      ) : bookings.length === 0 ? (
        <div className="muted">You have no bookings yet. Book a ride from the Rides page.</div>
      ) : (
        <div className="bookings-list">
          {bookings.map((booking) => {
            const ride = booking?.ride || {};
            const status = String(booking?.status || '').toUpperCase();
            const isCancelled = status === 'CANCELLED';

            return (
              <div key={booking.id} className={`card booking-card ${isCancelled ? 'cancelled' : ''}`}>
                <div className="booking-header">
                  <div className="booking-route">
                    <div className="booking-loc">
                      <div className="label">From</div>
                      <div className="value">{ride?.sourceLocation}</div>
                    </div>
                    <div className="booking-arrow">→</div>
                    <div className="booking-loc">
                      <div className="label">To</div>
                      <div className="value">{ride?.destinationLocation}</div>
                    </div>
                  </div>
                  <div className={`status-pill ${status.toLowerCase()}`}>{booking?.status}</div>
                </div>

                <div className="booking-meta">
                  <div>
                    <span className="meta-label">Ride Date:</span> {formatDateTime(ride?.rideDateTime)}
                  </div>
                  <div>
                    <span className="meta-label">Booked At:</span> {formatDateTime(booking?.bookingTime)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
