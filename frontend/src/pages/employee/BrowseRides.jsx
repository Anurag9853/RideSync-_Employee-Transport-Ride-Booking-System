import React, { useEffect, useState } from 'react';
import { apiGetRides, apiBookRide } from '../../api/axiosInstance.js';
import { CardSkeleton } from '../../components/common/LoadingSkeleton.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import Pagination from '../../components/common/Pagination.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import Modal from '../../components/common/Modal.jsx';
import { useToast } from '../../hooks/useToast.js';
import { useModal } from '../../hooks/useModal.js';
import { formatDateTime } from '../../utils/dateUtils.js';
import '../../styles/browse-rides.css';

export default function BrowseRides() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [size] = useState(8);
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [bookingRideId, setBookingRideId] = useState(null);
  const { showToast } = useToast();
  const { isOpen, modalData, openModal, closeModal } = useModal();

  useEffect(() => {
    loadRides();
  }, [page]);

  async function loadRides() {
    try {
      setLoading(true);
      const data = await apiGetRides({ page, size, source, destination });
      const list = Array.isArray(data) ? data : data?.content || [];
      setRides(list);
      setTotalPages(data?.totalPages || 0);
    } catch (err) {
      showToast('Failed to load rides', 'error');
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(e) {
    e.preventDefault();
    setPage(0);
    loadRides();
  }

  function handleBook(ride) {
    const status = String(ride.status || '').toUpperCase();
    if (ride.availableSeats <= 0 || status === 'FULL' || status === 'CANCELLED') {
      showToast('This ride is not available for booking', 'error');
      return;
    }
    openModal({ type: 'confirm', ride });
  }

  async function confirmBooking() {
    const ride = modalData?.ride;
    if (!ride) return;

    try {
      setBookingRideId(ride.id);
      await apiBookRide(ride.id);
      showToast('Ride booked successfully!', 'success');
      closeModal();
      loadRides();
    } catch (err) {
      showToast(err?.response?.data?.message || 'Failed to book ride', 'error');
    } finally {
      setBookingRideId(null);
    }
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Browse Rides</h1>
        <p className="page-subtitle">Search and book available rides</p>
      </div>

      <form className="search-filters" onSubmit={handleSearch}>
        <div className="filter-group">
          <label>Source</label>
          <input
            type="text"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            placeholder="e.g., Office"
          />
        </div>
        <div className="filter-group">
          <label>Destination</label>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="e.g., City Center"
          />
        </div>
        <button type="submit" className="btn primary" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {loading ? (
        <div className="rides-grid">
          {Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : rides.length === 0 ? (
        <EmptyState
          icon="🚌"
          title="No Rides Found"
          message="Try adjusting your search filters"
        />
      ) : (
        <>
          <div className="rides-grid">
            {rides.map((ride) => {
              const status = String(ride.status || '').toUpperCase();
              const canBook = ride.availableSeats > 0 && status !== 'FULL' && status !== 'CANCELLED';
              return (
                <div key={ride.id} className="ride-card">
                  <div className="ride-header">
                    <div className="ride-route">
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
                    <StatusBadge status={ride.status} />
                  </div>
                  <div className="ride-details">
                    <div className="detail-item">
                      <span className="detail-label">Date & Time:</span>
                      <span className="detail-value">{formatDateTime(ride.rideDateTime)}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Available Seats:</span>
                      <span className="detail-value">
                        {ride.availableSeats} / {ride.totalSeats}
                      </span>
                    </div>
                  </div>
                  <div className="ride-actions">
                    <button
                      type="button"
                      className="btn primary"
                      disabled={!canBook || bookingRideId === ride.id}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleBook(ride);
                      }}
                    >
                      {bookingRideId === ride.id
                        ? 'Booking...'
                        : !canBook
                        ? status === 'CANCELLED'
                          ? 'Cancelled'
                          : 'Full'
                        : 'Book Now'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} loading={loading} />
        </>
      )}

      {isOpen && modalData?.type === 'confirm' && (
        <Modal isOpen={isOpen} onClose={closeModal} title="Confirm Booking" size="small">
          <div className="booking-confirm">
            <p>Are you sure you want to book this ride?</p>
            <div className="booking-details">
              <div>
                <strong>Route:</strong> {modalData.ride.sourceLocation} → {modalData.ride.destinationLocation}
              </div>
              <div>
                <strong>Date:</strong> {formatDateTime(modalData.ride.rideDateTime)}
              </div>
              <div>
                <strong>Seats Available:</strong> {modalData.ride.availableSeats} / {modalData.ride.totalSeats}
              </div>
            </div>
            <div className="modal-actions">
              <button type="button" className="btn subtle" onClick={closeModal}>
                Cancel
              </button>
              <button 
                type="button"
                className="btn primary" 
                onClick={confirmBooking} 
                disabled={bookingRideId !== null}
              >
                {bookingRideId ? 'Booking...' : 'Confirm Booking'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
