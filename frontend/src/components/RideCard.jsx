import React from 'react';

function formatDateTime(value) {
  try {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);
    return date.toLocaleString();
  } catch {
    return String(value);
  }
}

export default function RideCard({ ride, onBook, bookingInProgress }) {
  const isCancelled = String(ride?.status || '').toUpperCase() === 'CANCELLED';
  const isFull =
    String(ride?.status || '').toUpperCase() === 'FULL' || Number(ride?.availableSeats) <= 0;

  const disableBook = isCancelled || isFull || bookingInProgress;

  return (
    <div className="card ride-card">
      <div className="ride-header">
        <div className="ride-route">
          <div className="ride-loc">
            <div className="label">From</div>
            <div className="value">{ride?.sourceLocation}</div>
          </div>
          <div className="ride-arrow">→</div>
          <div className="ride-loc">
            <div className="label">To</div>
            <div className="value">{ride?.destinationLocation}</div>
          </div>
        </div>
        <div className={`status-pill ${String(ride?.status || '').toLowerCase()}`}>
          {ride?.status}
        </div>
      </div>

      <div className="ride-meta">
        <div>
          <span className="meta-label">Date & Time:</span> {formatDateTime(ride?.rideDateTime)}
        </div>
        <div>
          <span className="meta-label">Seats:</span> {ride?.availableSeats} / {ride?.totalSeats}
        </div>
      </div>

      <div className="ride-actions">
        <button className="btn primary" disabled={disableBook} onClick={() => onBook(ride?.id)}>
          {bookingInProgress ? 'Booking…' : isCancelled ? 'Cancelled' : isFull ? 'Full' : 'Book'}
        </button>
      </div>
    </div>
  );
}
