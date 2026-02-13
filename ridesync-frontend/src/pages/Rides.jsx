import React, { useEffect, useMemo, useState } from 'react';
import RideCard from '../components/RideCard.jsx';
import { apiBookRide, apiGetRides } from '../api/axiosInstance.js';
import '../styles/dashboard.css';

export default function Rides() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const [page, setPage] = useState(0);
  const [size] = useState(8);
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');

  const [bookingRideId, setBookingRideId] = useState(null);

  const query = useMemo(
    () => ({ page, size, source: source.trim(), destination: destination.trim() }),
    [page, size, source, destination]
  );

  async function loadRides() {
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const data = await apiGetRides(query);
      // Handles both Spring Page response and plain arrays
      const list = Array.isArray(data) ? data : data?.content || [];
      setRides(list);
    } catch (err) {
      const msg =
        err?.response?.data?.message || err?.message || 'Failed to load rides. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRides();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.page, query.size]);

  async function handleBook(rideId) {
    setError('');
    setMessage('');

    try {
      setBookingRideId(rideId);
      await apiBookRide(rideId);
      setMessage('Booking confirmed. You can view it in My Bookings.');
      await loadRides();
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        'Booking failed. Please try again.';
      setError(msg);
    } finally {
      setBookingRideId(null);
    }
  }

  function applyFilters(e) {
    e.preventDefault();
    setPage(0);
    loadRides();
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Rides</h1>
        <p className="page-subtitle">Search and book available rides.</p>
      </div>

      <form className="filters" onSubmit={applyFilters}>
        <div className="filter-field">
          <label className="filter-label">Source</label>
          <input
            className="input"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            placeholder="e.g., Office"
          />
        </div>
        <div className="filter-field">
          <label className="filter-label">Destination</label>
          <input
            className="input"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="e.g., City Center"
          />
        </div>
        <button className="btn primary" type="submit" disabled={loading}>
          {loading ? 'Loading…' : 'Search'}
        </button>
      </form>

      {error ? <div className="alert error">{error}</div> : null}
      {message ? <div className="alert success">{message}</div> : null}

      {loading ? (
        <div className="muted">Loading rides…</div>
      ) : rides.length === 0 ? (
        <div className="muted">No rides found for the selected filters.</div>
      ) : (
        <div className="grid rides-grid">
          {rides.map((ride) => (
            <RideCard
              key={ride.id}
              ride={ride}
              onBook={handleBook}
              bookingInProgress={bookingRideId === ride.id}
            />
          ))}
        </div>
      )}

      <div className="pager">
        <button className="btn subtle" disabled={page === 0 || loading} onClick={() => setPage((p) => p - 1)}>
          Prev
        </button>
        <div className="pager-info">Page {page + 1}</div>
        <button className="btn subtle" disabled={loading || rides.length < size} onClick={() => setPage((p) => p + 1)}>
          Next
        </button>
      </div>
    </div>
  );
}
